// src/pages/admin/DashboardHome.jsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Avatar, Button, Card, List, Tag } from "antd";
import {
  TeamOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  ArrowRightOutlined,
  PlusOutlined,
  ShoppingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import api, { assetUrl, errorMessage } from "../../api/client";
import { renderState } from "../../components/admin/ui";

const byNewest = (a, b) => new Date(b.createdAt) - new Date(a.createdAt);

const DashboardHome = () => {
  const { user } = useOutletContext() || {};
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [userRes, blogRes] = await Promise.all([
        api.get("/view-user"),
        api.get("/view-blog"),
      ]);
      setUsers(userRes.data?.data || []);
      setBlogs(blogRes.data?.data || []);
    } catch (err) {
      setError(errorMessage(err, "Failed to load dashboard data"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const stats = useMemo(() => {
    const verified = users.filter((u) => u.verified).length;
    return {
      total: users.length,
      verified,
      pending: users.length - verified,
      blogs: blogs.length,
    };
  }, [users, blogs]);

  const recentUsers = useMemo(() => [...users].sort(byNewest).slice(0, 5), [users]);
  const recentBlogs = useMemo(() => [...blogs].sort(byNewest).slice(0, 5), [blogs]);

  const blocked = renderState({ loading, error, onRetry: load });

  return (
    <div className="space-y-6">
      {/* Premium Welcome Hero Card */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-600/15">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-48 h-48 rounded-full bg-indigo-500/20 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Avatar
              src={assetUrl(user?.profile)}
              size={64}
              icon={!user?.profile && <UserOutlined />}
              className="bg-white/20 text-white font-bold border-2 border-white/40 shadow-inner"
            >
              {user?.name?.[0]?.toUpperCase()}
            </Avatar>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-0">
                  Welcome back, {user?.name ? user.name.split(" ")[0] : "Admin"}! 👋
                </h1>
              </div>
              <p className="text-indigo-100 text-sm mt-1 mb-0 max-w-xl">
                Here is your daily activity overview. Manage users, track verification status, and publish blog articles seamlessly.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={() => navigate("/admin/dashboard/add-blog")}
              className="h-11 px-6 rounded-xl font-bold bg-white text-indigo-700 border-none hover:!bg-indigo-50 shadow-md transition-all"
            >
              New Blog Post
            </Button>
            <Button
              size="large"
              icon={<ShoppingOutlined />}
              onClick={() => navigate("/admin/dashboard/products")}
              className="h-11 px-5 rounded-xl font-semibold bg-white/10 text-white border-white/20 hover:!bg-white/20 hover:!text-white transition-all"
            >
              Products
            </Button>
          </div>
        </div>
      </div>

      {blocked || (
        <>
          {/* Stat Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Stat 1 */}
            <Card hoverable className="shadow-xs hover:shadow-md border border-slate-200/80 rounded-2xl transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">
                    Total Users
                  </p>
                  <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-0">
                    {stats.total}
                  </h3>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl border border-indigo-100/60 shadow-xs">
                  <TeamOutlined />
                </div>
              </div>
            </Card>

            {/* Stat 2 */}
            <Card hoverable className="shadow-xs hover:shadow-md border border-slate-200/80 rounded-2xl transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">
                    Verified Users
                  </p>
                  <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-0">
                    {stats.verified}
                  </h3>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl border border-emerald-100/60 shadow-xs">
                  <CheckCircleOutlined />
                </div>
              </div>
            </Card>

            {/* Stat 3 */}
            <Card hoverable className="shadow-xs hover:shadow-md border border-slate-200/80 rounded-2xl transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">
                    Awaiting Verification
                  </p>
                  <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-0">
                    {stats.pending}
                  </h3>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl border border-amber-100/60 shadow-xs">
                  <ClockCircleOutlined />
                </div>
              </div>
            </Card>

            {/* Stat 4 */}
            <Card hoverable className="shadow-xs hover:shadow-md border border-slate-200/80 rounded-2xl transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">
                    Blog Posts
                  </p>
                  <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-0">
                    {stats.blogs}
                  </h3>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-2xl border border-purple-100/60 shadow-xs">
                  <FileTextOutlined />
                </div>
              </div>
            </Card>
          </div>

          {/* Newest Users & Latest Blogs Lists */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Newest Users */}
            <Card
              title={
                <div className="flex items-center gap-2">
                  <TeamOutlined className="text-indigo-600" />
                  <span className="font-bold text-slate-800 text-base">Newest Users</span>
                </div>
              }
              extra={
                <Button type="link" onClick={() => navigate("/admin/dashboard/users")} className="p-0 font-semibold text-indigo-600">
                  View all <ArrowRightOutlined />
                </Button>
              }
              className="shadow-xs border border-slate-200/80 rounded-2xl"
            >
              {recentUsers.length === 0 ? (
                <p className="text-slate-400 py-6 text-center text-sm">No user accounts found.</p>
              ) : (
                <List
                  itemLayout="horizontal"
                  dataSource={recentUsers}
                  renderItem={(u) => (
                    <List.Item
                      extra={
                        <Tag
                          color={u.verified ? "green" : "orange"}
                          className="rounded-full px-3 py-0.5 font-semibold text-xs border-none"
                        >
                          {u.verified ? "Verified" : "Pending"}
                        </Tag>
                      }
                      className="px-0 py-3 border-b border-slate-100 last:border-none"
                    >
                      <List.Item.Meta
                        avatar={
                          <Avatar src={assetUrl(u.profile)} size={44} className="bg-indigo-600 font-bold shadow-xs">
                            {u.name?.[0]?.toUpperCase()}
                          </Avatar>
                        }
                        title={<span className="font-bold text-slate-800 text-sm">{u.name}</span>}
                        description={<span className="text-slate-500 text-xs">{u.email}</span>}
                      />
                    </List.Item>
                  )}
                />
              )}
            </Card>

            {/* Latest Blog Posts */}
            <Card
              title={
                <div className="flex items-center gap-2">
                  <FileTextOutlined className="text-purple-600" />
                  <span className="font-bold text-slate-800 text-base">Latest Blog Posts</span>
                </div>
              }
              extra={
                <Button type="link" onClick={() => navigate("/admin/dashboard/manage-blog")} className="p-0 font-semibold text-indigo-600">
                  View all <ArrowRightOutlined />
                </Button>
              }
              className="shadow-xs border border-slate-200/80 rounded-2xl"
            >
              {recentBlogs.length === 0 ? (
                <p className="text-slate-400 py-6 text-center text-sm">No blog posts available.</p>
              ) : (
                <List
                  itemLayout="horizontal"
                  dataSource={recentBlogs}
                  renderItem={(b) => (
                    <List.Item
                      extra={
                        <span className="text-slate-400 text-xs font-medium">
                          {b.createdAt ? new Date(b.createdAt).toLocaleDateString() : ""}
                        </span>
                      }
                      className="px-0 py-3 border-b border-slate-100 last:border-none"
                    >
                      <List.Item.Meta
                        avatar={
                          <Avatar
                            shape="square"
                            src={assetUrl(b.image)}
                            icon={<FileTextOutlined />}
                            className="rounded-xl bg-purple-50 text-purple-600 border border-purple-100"
                            size={44}
                          />
                        }
                        title={<span className="font-bold text-slate-800 text-sm line-clamp-1">{b.title || "Untitled"}</span>}
                        description={<span className="text-slate-500 text-xs">{b.auther ? `By ${b.auther}` : "Unknown author"}</span>}
                      />
                    </List.Item>
                  )}
                />
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardHome;
