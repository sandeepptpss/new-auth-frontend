// src/pages/admin/UserProfile.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Avatar, Button, Card, Form, Input, Select, Tag, Upload } from "antd";
import {
  EditOutlined,
  UploadOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import toast from "react-hot-toast";
import api, { assetUrl, errorMessage } from "../../api/client";
import { PageHeader, StateBlock } from "../../components/admin/ui";

const Field = ({ label, value }) => (
  <div className="py-3 border-b border-slate-100 last:border-0 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</span>
    <span className="text-slate-800 font-medium text-sm capitalize">{value || "—"}</span>
  </div>
);

const UserProfile = () => {
  const { user, refreshUser } = useOutletContext() || {};
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (!user) return;
    form.setFieldsValue({
      name: user.name || "",
      email: user.email || "",
      gender: user.gender || "",
      role: user.role || "",
    });
  }, [user, form]);

  const previewUrl = useMemo(
    () => (fileList.length > 0 ? URL.createObjectURL(fileList[0].originFileObj) : assetUrl(user?.profile)),
    [fileList, user?.profile]
  );

  const cancelEdit = () => {
    setFileList([]);
    setEditing(false);
    form.setFieldsValue({
      name: user?.name || "",
      email: user?.email || "",
      gender: user?.gender || "",
      role: user?.role || "",
    });
  };

  const handleSave = async (values) => {
    setSaving(true);
    try {
      const data = new FormData();
      data.append("name", values.name);
      data.append("email", values.email);
      data.append("gender", values.gender);
      data.append("role", values.role);
      if (fileList.length > 0 && fileList[0].originFileObj) {
        data.append("profile", fileList[0].originFileObj);
      }

      await api.put("/profile-edit", data);
      await refreshUser?.();
      toast.success("Profile updated");
      setFileList([]);
      setEditing(false);
    } catch (err) {
      toast.error(errorMessage(err, "Could not update your profile"));
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div>
        <PageHeader title="My Profile" />
        <StateBlock loading />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="My Profile"
        subtitle="Your personal account details and photo."
        actions={
          !editing && (
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => setEditing(true)}
              className="shadow-sm"
            >
              Edit Profile
            </Button>
          )
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Left Side: Avatar Card */}
        <Card className="shadow-sm border border-slate-100 text-center py-4">
          <Avatar
            src={previewUrl}
            size={110}
            icon={<UserOutlined />}
            className="bg-indigo-600 font-semibold shadow-md mx-auto"
          />
          <h2 className="text-lg font-bold text-slate-800 mt-4 mb-0">{user.name}</h2>
          <p className="text-slate-500 text-xs mt-1 mb-4">{user.email}</p>

          <div className="flex items-center justify-center gap-2">
            <Tag color="indigo" className="capitalize font-semibold rounded-md">
              {user.role}
            </Tag>
            <Tag
              color={user.verified ? "green" : "orange"}
              icon={user.verified ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />}
              className="font-semibold rounded-md"
            >
              {user.verified ? "Verified" : "Unverified"}
            </Tag>
          </div>

          {editing && (
            <div className="mt-6">
              <Upload
                beforeUpload={() => false}
                maxCount={1}
                fileList={fileList}
                onChange={({ fileList: fl }) => setFileList(fl)}
                accept="image/*"
              >
                <Button icon={<UploadOutlined />}>Upload New Photo</Button>
              </Upload>
            </div>
          )}
        </Card>

        {/* Right Side: Details Card / Edit Form */}
        <Card className="shadow-sm border border-slate-100 md:col-span-2">
          {editing ? (
            <Form form={form} layout="vertical" onFinish={handleSave}>
              <Form.Item name="name" label="Full Name" rules={[{ required: true, message: "Please enter name" }]}>
                <Input size="large" />
              </Form.Item>

              <Form.Item name="email" label="Email Address" rules={[{ required: true, type: "email", message: "Please enter valid email" }]}>
                <Input size="large" />
              </Form.Item>

              <Form.Item name="gender" label="Gender">
                <Select size="large">
                  <Select.Option value="male">Male</Select.Option>
                  <Select.Option value="female">Female</Select.Option>
                  <Select.Option value="other">Other</Select.Option>
                </Select>
              </Form.Item>

              {isAdmin && (
                <Form.Item name="role" label="Role">
                  <Select size="large">
                    <Select.Option value="user">User</Select.Option>
                    <Select.Option value="manager">Manager</Select.Option>
                    <Select.Option value="admin">Admin</Select.Option>
                  </Select>
                </Form.Item>
              )}

              <div className="flex gap-3 mt-6">
                <Button type="primary" htmlType="submit" loading={saving} size="large">
                  Save Changes
                </Button>
                <Button onClick={cancelEdit} disabled={saving} size="large">
                  Cancel
                </Button>
              </div>
            </Form>
          ) : (
            <div>
              <Field label="Full Name" value={user.name} />
              <Field label="Email Address" value={user.email} />
              <Field label="Gender" value={user.gender} />
              <Field label="Role" value={user.role} />
              <Field label="Verified Status" value={user.verified ? "Verified Account" : "Pending Verification"} />
              <Field
                label="Member Since"
                value={user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
              />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;
