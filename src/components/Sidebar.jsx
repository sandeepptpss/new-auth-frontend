// src/components/Sidebar.jsx
import React from "react";
import { Drawer, List, ListItem, ListItemText } from "@mui/material";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const menuItems = [
    { id: "home", label: "Dashboard", path: "/admin/dashboard" },
    { id: "users", label: "Users", path: "/admin/dashboard/users" },
    { id: "blog", label: "Add Blog", path: "/admin/dashboard/blog" },
  ];

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: 220,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 220,
          boxSizing: "border-box",
          backgroundColor: "#1e1e2f",
          color: "#fff",
        },
      }}
    >
      <List>
        <div className="logo">Admin Dashboard</div>
        {menuItems.map((item) => (
          <ListItem
            key={item.id}
            component={NavLink}
            to={item.path}
            sx={{
              "&.active": { background: "#444" },
              "&:hover": { background: "#333" },
            }}
          >
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
