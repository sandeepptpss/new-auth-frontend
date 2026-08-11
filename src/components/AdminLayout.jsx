// src/components/AdminLayout.jsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Box, CssBaseline, Toolbar } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import toast, { Toaster } from "react-hot-toast";
import Sidebar from "./Sidebar";
import Header from "./Header";
import adminTheme, { SIDEBAR_WIDTH } from "../theme/adminTheme";
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
      // 401 is handled by the interceptor (redirect to /login).
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

  // A query typed on one page shouldn't silently filter the next one.
  useEffect(() => {
    setSearchQuery("");
    setMobileOpen(false);
  }, [location.pathname]);

  const outletContext = useMemo(
    () => ({ searchQuery, setSearchQuery, user, refreshUser: loadProfile }),
    [searchQuery, user, loadProfile]
  );

  return (
    <ThemeProvider theme={adminTheme}>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
        <Header
          user={user}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onMenuClick={() => setMobileOpen((open) => !open)}
        />
        <Sidebar
          user={user}
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
        />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { md: `calc(100% - ${SIDEBAR_WIDTH}px)` },
            p: { xs: 2, md: 3 },
            minWidth: 0,
          }}
        >
          <Toolbar />
          <Outlet context={outletContext} />
        </Box>
      </Box>
      <Toaster
        position="top-right"
        toastOptions={{ style: { fontSize: 14, borderRadius: 10 } }}
      />
    </ThemeProvider>
  );
};

export default AdminLayout;
