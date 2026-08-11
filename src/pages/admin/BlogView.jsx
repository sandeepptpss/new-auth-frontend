// src/pages/admin/BlogView.jsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Avatar, Button, Card, Popconfirm, Table, Tooltip } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ReloadOutlined,
  FileImageOutlined,
} from "@ant-design/icons";
import toast from "react-hot-toast";
import api, { assetUrl, errorMessage } from "../../api/client";
import { PageHeader, renderState } from "../../components/admin/ui";

const toExcerpt = (html, length = 90) => {
  const text = String(html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > length ? `${text.slice(0, length)}…` : text;
};

const BlogView = () => {
  const { searchQuery = "" } = useOutletContext() || {};
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/view-blog");
      setBlogs(res.data?.data || []);
    } catch (err) {
      setError(errorMessage(err, "Failed to load blog posts"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleDelete = async (blog) => {
    const id = blog._id || blog.id;
    try {
      await api.delete(`/delete-blog/${id}`);
      setBlogs((prev) => prev.filter((b) => (b._id || b.id) !== id));
      toast.success("Blog post deleted");
    } catch (err) {
      toast.error(errorMessage(err, "Delete failed"));
    }
  };

  const filteredBlogs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return blogs;
    return blogs.filter((b) =>
      [b.title, b.auther].some((v) => String(v || "").toLowerCase().includes(query))
    );
  }, [blogs, searchQuery]);

  const columns = [
    {
      title: "Cover",
      dataIndex: "image",
      key: "image",
      width: 70,
      render: (img) => (
        <Avatar
          shape="square"
          src={assetUrl(img)}
          size={48}
          icon={<FileImageOutlined />}
          className="rounded-lg bg-slate-100 border border-slate-200"
        />
      ),
    },
    {
      title: "Title & Excerpt",
      dataIndex: "title",
      key: "title",
      render: (_, row) => (
        <div>
          <h4 className="font-semibold text-slate-800 text-sm mb-0 line-clamp-1">
            {row.title || "Untitled"}
          </h4>
          <p className="text-slate-500 text-xs mb-0 line-clamp-1">
            {toExcerpt(row.decription) || "No description"}
          </p>
        </div>
      ),
    },
    {
      title: "Author",
      dataIndex: "auther",
      key: "auther",
      render: (auther) => <span className="text-slate-600 text-sm">{auther || "Unknown"}</span>,
    },
    {
      title: "Created Date",
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
      render: (_, blog) => {
        const id = blog._id || blog.id;
        return (
          <div className="flex items-center justify-end gap-1">
            <Tooltip title="Edit Post">
              <Button
                type="text"
                icon={<EditOutlined className="text-indigo-600" />}
                onClick={() => navigate(`/admin/dashboard/blogs/edit/${id}`)}
              />
            </Tooltip>
            <Tooltip title="Delete Post">
              <Popconfirm
                title="Delete blog post"
                description={`Permanently remove "${blog.title}"?`}
                onConfirm={() => handleDelete(blog)}
                okText="Yes"
                cancelText="No"
              >
                <Button type="text" danger icon={<DeleteOutlined />} />
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
    empty: !loading && !error && filteredBlogs.length === 0,
    emptyText: searchQuery ? `No posts match "${searchQuery}"` : "No blog posts yet",
    onRetry: fetchBlogs,
  });

  return (
    <div>
      <PageHeader
        title="Blog Posts"
        subtitle={
          loading
            ? "Loading posts..."
            : `${filteredBlogs.length} of ${blogs.length} post${blogs.length === 1 ? "" : "s"}`
        }
        actions={
          <>
            <Button icon={<ReloadOutlined />} onClick={fetchBlogs} loading={loading}>
              Refresh
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate("/admin/dashboard/add-blog")}
              className="shadow-sm"
            >
              Add Blog
            </Button>
          </>
        }
      />

      {state || (
        <Card className="shadow-sm border border-slate-100" bodyStyle={{ padding: 0 }}>
          <Table
            dataSource={filteredBlogs}
            columns={columns}
            rowKey={(b) => b._id || b.id}
            pagination={{ pageSize: 10, showSizeChanger: true }}
          />
        </Card>
      )}
    </div>
  );
};

export default BlogView;
