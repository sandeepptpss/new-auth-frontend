// src/components/Nav.jsx
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button, Drawer } from "antd";
import {
  MenuOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  FileTextOutlined,
  ShoppingOutlined,
  LogoutOutlined,
  DashboardOutlined,
  ThunderboltFilled,
} from "@ant-design/icons";

const Nav = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const authString = localStorage.getItem("user");
  const auth = authString ? JSON.parse(authString) : null;

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const navLinks = [
    { label: "Home", path: "/", icon: <HomeOutlined /> },
    { label: "About", path: "/about", icon: <InfoCircleOutlined /> },
    { label: "Blog", path: "/blog", icon: <FileTextOutlined /> },
    { label: "Products", path: "/products", icon: <ShoppingOutlined /> },
  ];

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-indigo-600 font-extrabold text-xl tracking-tight">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-indigo-200">
            <ThunderboltFilled />
          </div>
          <span className="text-slate-800">AuthTask</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const active = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${
                  active
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* User Auth Actions */}
        <div className="hidden md:flex items-center gap-3">
          {auth ? (
            <>
              {(auth.role === "admin" || auth.role === "manager") && (
                <Button
                  type="primary"
                  icon={<DashboardOutlined />}
                  onClick={() => navigate("/admin/dashboard")}
                  className="shadow-sm font-semibold"
                >
                  Dashboard
                </Button>
              )}
              <Button icon={<LogoutOutlined />} onClick={logout} className="font-semibold">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => navigate("/login")} className="font-semibold">
                Login
              </Button>
              <Button type="primary" onClick={() => navigate("/signup")} className="shadow-sm font-semibold">
                Sign Up
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="md:hidden">
          <Button icon={<MenuOutlined />} onClick={() => setMobileOpen(true)} type="text" />
        </div>
      </div>

      {/* Mobile Drawer */}
      <Drawer
        title="Navigation"
        placement="right"
        onClose={() => setMobileOpen(false)}
        open={mobileOpen}
      >
        <div className="flex flex-col gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className="px-4 py-3 rounded-lg text-slate-700 font-semibold hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-3"
            >
              {link.icon}
              {link.label}
            </Link>
          ))}

          <div className="border-t border-slate-100 mt-4 pt-4 flex flex-col gap-2">
            {auth ? (
              <>
                {(auth.role === "admin" || auth.role === "manager") && (
                  <Button
                    type="primary"
                    block
                    icon={<DashboardOutlined />}
                    onClick={() => {
                      setMobileOpen(false);
                      navigate("/admin/dashboard");
                    }}
                  >
                    Dashboard
                  </Button>
                )}
                <Button
                  block
                  danger
                  icon={<LogoutOutlined />}
                  onClick={() => {
                    setMobileOpen(false);
                    logout();
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  block
                  onClick={() => {
                    setMobileOpen(false);
                    navigate("/login");
                  }}
                >
                  Login
                </Button>
                <Button
                  type="primary"
                  block
                  onClick={() => {
                    setMobileOpen(false);
                    navigate("/signup");
                  }}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </Drawer>
    </nav>
  );
};

export default Nav;
