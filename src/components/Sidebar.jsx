// src/components/Sidebar.jsx
import React from "react";
import { Drawer, Menu, Tag } from "antd";
import {
  DashboardOutlined,
  TeamOutlined,
  FileTextOutlined,
  FileAddOutlined,
  CalendarOutlined,
  ShoppingOutlined,
  UserOutlined,
  LockOutlined,
  ThunderboltFilled,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { SIDEBAR_WIDTH } from "../theme/adminTheme";

const SidebarContent = ({ role, onItemClick }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const navItems = [
    {
      key: "overview-header",
      type: "group",
      label: <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Overview</span>,
      children: [
        {
          key: "/admin/dashboard",
          icon: <DashboardOutlined />,
          label: "Dashboard",
          onClick: () => { navigate("/admin/dashboard"); onItemClick?.(); },
        },
        {
          key: "/admin/dashboard/calendar",
          icon: <CalendarOutlined />,
          label: "Calendar",
          onClick: () => { navigate("/admin/dashboard/calendar"); onItemClick?.(); },
        },
      ],
    },
    {
      key: "manage-header",
      type: "group",
      label: <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Manage</span>,
      children: [
        ...(role === "admin" || role === "manager"
          ? [
              {
                key: "/admin/dashboard/users",
                icon: <TeamOutlined />,
                label: "Users",
                onClick: () => { navigate("/admin/dashboard/users"); onItemClick?.(); },
              },
            ]
          : []),
        {
          key: "/admin/dashboard/manage-blog",
          icon: <FileTextOutlined />,
          label: "Blog Posts",
          onClick: () => { navigate("/admin/dashboard/manage-blog"); onItemClick?.(); },
        },
        {
          key: "/admin/dashboard/add-blog",
          icon: <FileAddOutlined />,
          label: "Add Blog",
          onClick: () => { navigate("/admin/dashboard/add-blog"); onItemClick?.(); },
        },
        {
          key: "/admin/dashboard/products",
          icon: <ShoppingOutlined />,
          label: "Products",
          onClick: () => { navigate("/admin/dashboard/products"); onItemClick?.(); },
        },
      ],
    },
    {
      key: "account-header",
      type: "group",
      label: <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Account</span>,
      children: [
        {
          key: "/admin/dashboard/profile",
          icon: <UserOutlined />,
          label: "My Profile",
          onClick: () => { navigate("/admin/dashboard/profile"); onItemClick?.(); },
        },
        {
          key: "/admin/dashboard/update-password",
          icon: <LockOutlined />,
          label: "Change Password",
          onClick: () => { navigate("/admin/dashboard/update-password"); onItemClick?.(); },
        },
      ],
    },
  ];

  // Selected key calculation
  const getSelectedKey = () => {
    if (pathname === "/admin/dashboard" || pathname === "/admin/dashboard/") return "/admin/dashboard";
    return pathname;
  };

  return (
    <div className="h-full flex flex-col justify-between bg-white border-r border-slate-200">
      <div>
        <div className="h-16 flex items-center px-6 gap-3 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-indigo-200">
            <ThunderboltFilled className="text-lg" />
          </div>
          <div>
            <h1 className="font-bold text-slate-800 text-base leading-tight mb-0">Admin Panel</h1>
            <p className="text-slate-400 text-xs mb-0">Control Center</p>
          </div>
        </div>

        <div className="p-3">
          <Menu
            mode="inline"
            selectedKeys={[getSelectedKey()]}
            items={navItems}
            className="border-none font-medium text-slate-600"
          />
        </div>
      </div>

      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Signed in as</span>
          <Tag color="indigo" className="capitalize text-xs font-semibold mr-0">
            {role || "User"}
          </Tag>
        </div>
      </div>
    </div>
  );
};

const Sidebar = ({ user, mobileOpen, onClose }) => {
  return (
    <>
      {/* Mobile Drawer */}
      <Drawer
        placement="left"
        onClose={onClose}
        open={mobileOpen}
        bodyStyle={{ padding: 0 }}
        width={SIDEBAR_WIDTH}
        className="md:hidden"
      >
        <SidebarContent role={user?.role} onItemClick={onClose} />
      </Drawer>

      {/* Desktop Sidebar */}
      <aside
        className="admin-sidebar-fixed hidden md:block fixed left-0 top-0 bottom-0 z-40"
        style={{ width: SIDEBAR_WIDTH }}
      >
        <SidebarContent role={user?.role} />
      </aside>
    </>
  );
};

export default Sidebar;
