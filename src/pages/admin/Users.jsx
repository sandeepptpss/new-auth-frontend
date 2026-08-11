// src/pages/admin/Users.jsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Avatar,
  Button,
  Card,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Switch,
  Table,
  Tag,
  Tooltip,
  Upload,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import toast from "react-hot-toast";
import api, { assetUrl, errorMessage } from "../../api/client";
import { PageHeader, renderState } from "../../components/admin/ui";

const ROLE_META = {
  admin: { label: "Admin", color: "indigo" },
  manager: { label: "Manager", color: "purple" },
  user: { label: "User", color: "default" },
};

const emptyEdit = { _id: "", name: "", email: "", gender: "", role: "user", profile: null };

const Users = () => {
  const { searchQuery = "", user: currentUser } = useOutletContext() || {};
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editData, setEditData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [busyIds, setBusyIds] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();

  const isAdmin = currentUser?.role === "admin";

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/view-user");
      setUsers(res.data?.data || []);
    } catch (err) {
      setError(errorMessage(err, "Failed to load users"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const canManage = useCallback(
    (row) => isAdmin || row.role !== "admin",
    [isAdmin]
  );

  const setBusy = (id, on) =>
    setBusyIds((prev) => (on ? [...prev, id] : prev.filter((x) => x !== id)));

  const toggleVerification = async (row) => {
    const next = !row.verified;
    setBusy(row._id, true);
    setUsers((prev) => prev.map((u) => (u._id === row._id ? { ...u, verified: next } : u)));
    try {
      await api.put(`/update-verification/${row._id}`, { verified: next });
      toast.success(`${row.name} ${next ? "verified" : "unverified"}`);
    } catch (err) {
      setUsers((prev) =>
        prev.map((u) => (u._id === row._id ? { ...u, verified: row.verified } : u))
      );
      toast.error(errorMessage(err, "Could not update verification"));
    } finally {
      setBusy(row._id, false);
    }
  };

  const handleDelete = async (row) => {
    try {
      await api.delete(`/delete-user/${row._id}`);
      setUsers((prev) => prev.filter((u) => u._id !== row._id));
      toast.success(`${row.name} deleted`);
    } catch (err) {
      toast.error(errorMessage(err, "Delete failed"));
    }
  };

  const openEditModal = (row) => {
    setEditData({
      ...emptyEdit,
      _id: row._id,
      name: row.name || "",
      email: row.email || "",
      gender: row.gender || "",
      role: row.role || "user",
      existingProfile: row.profile,
    });
    setFileList([]);
    form.setFieldsValue({
      name: row.name || "",
      email: row.email || "",
      gender: row.gender || "",
      role: row.role || "user",
    });
  };

  const handleEditSubmit = async (values) => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("gender", values.gender);
      formData.append("role", values.role);
      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append("profile", fileList[0].originFileObj);
      }

      const res = await api.put(`/update-user/${editData._id}`, formData);
      const updated = res.data?.user || {};
      setUsers((prev) =>
        prev.map((u) =>
          u._id === editData._id
            ? {
                ...u,
                name: values.name,
                email: values.email,
                gender: values.gender,
                role: values.role,
                profile: updated.profile ?? u.profile,
              }
            : u
        )
      );
      toast.success("User updated");
      setEditData(null);
    } catch (err) {
      toast.error(errorMessage(err, "Could not update user"));
    } finally {
      setSaving(false);
    }
  };

  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return users;
    return users.filter((u) =>
      [u.name, u.email, u.role, u.gender].some((v) => String(v || "").toLowerCase().includes(query))
    );
  }, [users, searchQuery]);

  const columns = [
    {
      title: "User",
      dataIndex: "name",
      key: "name",
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <Avatar src={assetUrl(row.profile)} size={40} className="bg-indigo-600 font-semibold">
            {row.name?.[0]?.toUpperCase()}
          </Avatar>
          <div>
            <p className="font-semibold text-slate-800 text-sm mb-0">{row.name}</p>
            <p className="text-slate-500 text-xs mb-0">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      render: (g) => <span className="capitalize text-slate-600 text-sm">{g || "—"}</span>,
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (roleKey) => {
        const meta = ROLE_META[roleKey] || ROLE_META.user;
        return <Tag color={meta.color} className="rounded-md font-semibold">{meta.label}</Tag>;
      },
    },
    {
      title: "Verified",
      dataIndex: "verified",
      key: "verified",
      render: (verified, row) => {
        const manageable = canManage(row);
        return (
          <Tooltip title={manageable ? "Toggle verification status" : "Cannot edit admin account"}>
            <Switch
              size="small"
              checked={Boolean(verified)}
              disabled={!manageable || busyIds.includes(row._id)}
              onChange={() => toggleVerification(row)}
            />
          </Tooltip>
        );
      },
    },
    {
      title: "Joined",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (d) => (
        <span className="text-slate-600 text-xs">
          {d ? new Date(d).toLocaleDateString() : "—"}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      align: "right",
      render: (_, row) => {
        const manageable = canManage(row);
        return (
          <div className="flex items-center justify-end gap-1">
            <Tooltip title={manageable ? "Edit User" : "Locked"}>
              <Button
                type="text"
                icon={<EditOutlined className="text-indigo-600" />}
                disabled={!manageable}
                onClick={() => openEditModal(row)}
              />
            </Tooltip>
            <Tooltip title={manageable ? "Delete User" : "Locked"}>
              <Popconfirm
                title="Delete user"
                description={`Delete ${row.name}?`}
                onConfirm={() => handleDelete(row)}
                okText="Yes"
                cancelText="No"
                disabled={!manageable}
              >
                <Button type="text" danger icon={<DeleteOutlined />} disabled={!manageable} />
              </Popconfirm>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  const state = renderState({
    loading,
    error,
    empty: !loading && !error && filteredUsers.length === 0,
    emptyText: searchQuery ? `No users match "${searchQuery}"` : "No users yet",
    onRetry: fetchUsers,
  });

  return (
    <div>
      <PageHeader
        title="Users"
        subtitle={
          loading
            ? "Loading accounts..."
            : `${filteredUsers.length} of ${users.length} account${users.length === 1 ? "" : "s"}`
        }
        actions={
          <Button icon={<ReloadOutlined />} onClick={fetchUsers} loading={loading}>
            Refresh
          </Button>
        }
      />

      {state || (
        <Card className="shadow-sm border border-slate-100" bodyStyle={{ padding: 0 }}>
          <Table
            dataSource={filteredUsers}
            columns={columns}
            rowKey="_id"
            pagination={{ pageSize: 10, showSizeChanger: true }}
          />
        </Card>
      )}

      {/* Edit Modal */}
      <Modal
        title="Edit User Profile"
        open={Boolean(editData)}
        onCancel={() => !saving && setEditData(null)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleEditSubmit} className="mt-4">
          <Form.Item label="Photo">
            <div className="flex items-center gap-4">
              <Avatar
                src={
                  fileList.length > 0
                    ? URL.createObjectURL(fileList[0].originFileObj)
                    : assetUrl(editData?.existingProfile)
                }
                size={64}
                icon={<UserOutlined />}
                className="bg-indigo-600"
              />
              <Upload
                beforeUpload={() => false}
                maxCount={1}
                fileList={fileList}
                onChange={({ fileList: fl }) => setFileList(fl)}
                accept="image/*"
              >
                <Button icon={<UploadOutlined />}>Change Photo</Button>
              </Upload>
            </div>
          </Form.Item>

          <Form.Item name="name" label="Name" rules={[{ required: true, message: "Please enter name" }]}>
            <Input size="large" />
          </Form.Item>

          <Form.Item name="email" label="Email" rules={[{ required: true, type: "email", message: "Please enter valid email" }]}>
            <Input size="large" />
          </Form.Item>

          <Form.Item name="gender" label="Gender" rules={[{ required: true, message: "Please select gender" }]}>
            <Select size="large">
              <Select.Option value="male">Male</Select.Option>
              <Select.Option value="female">Female</Select.Option>
              <Select.Option value="other">Other</Select.Option>
            </Select>
          </Form.Item>

          {isAdmin && (
            <Form.Item name="role" label="Role" rules={[{ required: true, message: "Please select role" }]}>
              <Select size="large">
                <Select.Option value="user">User</Select.Option>
                <Select.Option value="manager">Manager</Select.Option>
                <Select.Option value="admin">Admin</Select.Option>
              </Select>
            </Form.Item>
          )}

          <div className="flex justify-end gap-2 mt-6">
            <Button onClick={() => setEditData(null)} disabled={saving}>
              Cancel
            </Button>

            <Button type="primary" htmlType="submit" loading={saving}>
              Save Changes
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Users;
