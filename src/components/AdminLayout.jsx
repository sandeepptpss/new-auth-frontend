// src/components/AdminLayout.jsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { ConfigProvider } from "antd";
import toast, { Toaster } from "react-hot-toast";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { antdThemeConfig } from "../theme/adminTheme";
import api, { errorMessage } from "../api/client";

const AdminLayout = () => {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const loadProfile = useCallback(async () => {
    try {
      const res = await api.get("/profile");
      setUser(res.data);
    } catch (error) {
      if (error.response?.status !== 401) {
        toast.error(errorMessage(error, "Could not load your profile"));
      }
    }
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login", { replace: true });
      return;
    }
    loadProfile();
  }, [loadProfile, navigate]);

  useEffect(() => {
    setSearchQuery("");
    setMobileOpen(false);
  }, [location.pathname]);

  const outletContext = useMemo(
    () => ({ searchQuery, setSearchQuery, user, refreshUser: loadProfile }),
    [searchQuery, user, loadProfile]
  );

  return (
    <ConfigProvider theme={antdThemeConfig}>
      <div className="min-h-screen bg-slate-50 flex">
        <Sidebar
          user={user}
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
        />

        <div className="admin-main-content flex-1 flex flex-col min-w-0 transition-all duration-200 md:pl-[260px]">
          <Header
            user={user}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onMenuClick={() => setMobileOpen((open) => !open)}
          />

          <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
            <Outlet context={outletContext} />
          </main>
        </div>
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          style: { fontSize: "14px", borderRadius: "10px" },
        }}
      />
    </ConfigProvider>
  );
};

export default AdminLayout;
