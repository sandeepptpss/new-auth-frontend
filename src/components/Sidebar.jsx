// src/components/Sidebar.jsx
import React from "react";
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import PostAddOutlinedIcon from "@mui/icons-material/PostAddOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import BoltIcon from "@mui/icons-material/Bolt";
import { NavLink, useLocation } from "react-router-dom";
import { SIDEBAR_WIDTH } from "../theme/adminTheme";

const SECTIONS = [
  {
    heading: "Overview",
    items: [
      { label: "Dashboard", path: "/admin/dashboard", icon: <DashboardOutlinedIcon />, end: true },
      { label: "Calendar", path: "/admin/dashboard/calendar", icon: <CalendarMonthOutlinedIcon /> },
    ],
  },
  {
    heading: "Manage",
    items: [
      {
        label: "Users",
        path: "/admin/dashboard/users",
        icon: <GroupOutlinedIcon />,
        roles: ["admin", "manager"],
      },
      { label: "Blog Posts", path: "/admin/dashboard/manage-blog", icon: <ArticleOutlinedIcon /> },
      { label: "Add Blog", path: "/admin/dashboard/add-blog", icon: <PostAddOutlinedIcon /> },
      { label: "Products", path: "/admin/dashboard/products", icon: <Inventory2OutlinedIcon /> },
    ],
  },
  {
    heading: "Account",
    items: [
      { label: "My Profile", path: "/admin/dashboard/profile", icon: <PersonOutlineIcon /> },
      { label: "Change Password", path: "/admin/dashboard/update-password", icon: <LockOutlinedIcon /> },
    ],
  },
];

const SidebarContent = ({ role }) => {
  const { pathname } = useLocation();

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Toolbar sx={{ px: 2.5 }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              display: "grid",
              placeItems: "center",
              bgcolor: "primary.main",
              color: "#fff",
            }}
          >
            <BoltIcon fontSize="small" />
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.1 }}>
              Admin Panel
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Control center
            </Typography>
          </Box>
        </Stack>
      </Toolbar>
      <Divider />

      <Box sx={{ flexGrow: 1, overflowY: "auto", py: 1 }}>
        {SECTIONS.map((section) => {
          const items = section.items.filter(
            (item) => !item.roles || (role && item.roles.includes(role))
          );
          if (items.length === 0) return null;

          return (
            <List
              key={section.heading}
              dense
              subheader={
                <ListSubheader
                  disableSticky
                  sx={{
                    bgcolor: "transparent",
                    fontSize: 11,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    color: "text.secondary",
                  }}
                >
                  {section.heading}
                </ListSubheader>
              }
            >
              {items.map((item) => {
                const selected = item.end
                  ? pathname === item.path || pathname === `${item.path}/`
                  : pathname.startsWith(item.path);

                return (
                  <ListItemButton
                    key={item.path}
                    component={NavLink}
                    to={item.path}
                    end={item.end}
                    selected={selected}
                    sx={{
                      mx: 1.5,
                      mb: 0.25,
                      borderRadius: 2,
                      color: "text.secondary",
                      "&.Mui-selected": {
                        bgcolor: "primary.main",
                        color: "#fff",
                        "& .MuiListItemIcon-root": { color: "#fff" },
                        "&:hover": { bgcolor: "primary.dark" },
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 38, color: "inherit" }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{ fontSize: 14, fontWeight: 600 }}
                    />
                  </ListItemButton>
                );
              })}
            </List>
          );
        })}
      </Box>

      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography variant="caption" color="text.secondary">
          Signed in as {role || "user"}
        </Typography>
      </Box>
    </Box>
  );
};

const Sidebar = ({ user, mobileOpen, onClose }) => {
  const paperSx = {
    width: SIDEBAR_WIDTH,
    boxSizing: "border-box",
    borderRight: "1px solid",
    borderColor: "divider",
    bgcolor: "background.paper",
  };

  return (
    <Box
      component="nav"
      sx={{ width: { md: SIDEBAR_WIDTH }, flexShrink: { md: 0 } }}
      aria-label="Admin navigation"
    >
      {/* Mobile: temporary drawer toggled from the header */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": paperSx,
        }}
      >
        <SidebarContent role={user?.role} />
      </Drawer>

      {/* Desktop: always visible */}
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": paperSx,
        }}
      >
        <SidebarContent role={user?.role} />
      </Drawer>
    </Box>
  );
};

export default Sidebar;
