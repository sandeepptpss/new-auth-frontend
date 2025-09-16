// src/components/AdminLayout.jsx
import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "../assets/dashbord.css";

const AdminLayout = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        const res = await fetch("http://localhost:8002/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setUser(data);
      } catch (err) {
        console.error("Error fetching profile", err);
      }
    };
    fetchUser();
  }, [navigate]);

  return (
    <div className="admin-panel">
      <Header user={user} />
      <Sidebar />
      <main className="main-content">
        <Outlet /> {/* 🔥 Nested admin pages load here */}
      </main>
    </div>
  );
};

export default AdminLayout;
