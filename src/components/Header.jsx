// src/components/Header.jsx
import React from "react";
import { Avatar, Dropdown, Input, Tag, Button } from "antd";
import {
  MenuOutlined,
  SearchOutlined,
  UserOutlined,
  LockOutlined,
  TeamOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { assetUrl } from "../api/client";

const ROLE_COLOR = { admin: "indigo", manager: "purple", user: "default" };

const Header = ({ user, searchQuery, setSearchQuery, onMenuClick }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  const menuItems = [
    {
      key: "user-info",
      label: (
        <div className="py-1 px-1">
          <p className="font-semibold text-slate-800 text-sm mb-0">{user?.name || "User"}</p>
          <p className="text-xs text-slate-500 mb-0">{user?.email}</p>
        </div>
      ),
    },
    { type: "divider" },
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "My Profile",
      onClick: () => navigate("/admin/dashboard/profile"),
    },
    ...(user?.role === "admin" || user?.role === "manager"
      ? [
          {
            key: "users",
            icon: <TeamOutlined />,
            label: "Manage Users",
            onClick: () => navigate("/admin/dashboard/users"),
          },
        ]
      : []),
    {
      key: "password",
      icon: <LockOutlined />,
      label: "Change Password",
      onClick: () => navigate("/admin/dashboard/update-password"),
    },
    { type: "divider" },
    {
      key: "logout",
      icon: <LogoutOutlined className="text-red-500" />,
      label: <span className="text-red-500 font-medium">Logout</span>,
      onClick: handleLogout,
    },
  ];

  return (
    <header className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 px-4 md:px-6 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <Button
          type="text"
          icon={<MenuOutlined className="text-lg" />}
          onClick={onMenuClick}
          className="md:hidden flex items-center justify-center text-slate-600 hover:text-indigo-600"
        />

        <Input
          placeholder="Search..."
          prefix={<SearchOutlined className="text-slate-400" />}
          value={searchQuery ?? ""}
          onChange={(e) => setSearchQuery?.(e.target.value)}
          allowClear
          className="rounded-lg bg-slate-50 border-slate-200 hover:border-indigo-400 focus:border-indigo-500"
          size="middle"
        />
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex flex-col items-end leading-tight">
          <span className="font-semibold text-slate-800 text-sm">{user?.name || "—"}</span>
          {user?.role && (
            <Tag color={ROLE_COLOR[user.role] || "blue"} className="mr-0 mt-0.5 capitalize text-[10px] font-semibold rounded-md">
              {user.role}
            </Tag>
          )}
        </div>

        <Dropdown menu={{ items: menuItems }} placement="bottomRight" arrow>
          <div className="cursor-pointer p-1 rounded-full hover:bg-slate-100 transition-colors">
            <Avatar
              src={assetUrl(user?.profile)}
              size={40}
              icon={!user?.profile && <UserOutlined />}
              className="bg-indigo-600 text-white font-semibold border-2 border-white shadow-xs"
            >
              {user?.name?.[0]?.toUpperCase()}
            </Avatar>
          </div>
        </Dropdown>
      </div>
    </header>
  );
};

export default Header;
