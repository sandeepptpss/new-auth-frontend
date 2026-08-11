// src/components/Header.jsx
import React, { useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { assetUrl } from "../api/client";
import { SIDEBAR_WIDTH } from "../theme/adminTheme";

const ROLE_COLOR = { admin: "primary", manager: "secondary" };

const Header = ({ user, searchQuery, setSearchQuery, onMenuClick }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const closeMenu = () => setAnchorEl(null);

  const go = (path) => {
    closeMenu();
    navigate(path);
  };

  const handleLogout = () => {
    closeMenu();
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  return (
    <AppBar
      position="fixed"
      color="inherit"
      elevation={0}
      sx={{
        width: { md: `calc(100% - ${SIDEBAR_WIDTH}px)` },
        ml: { md: `${SIDEBAR_WIDTH}px` },
        borderBottom: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Toolbar sx={{ gap: 2 }}>
        <IconButton
          edge="start"
          onClick={onMenuClick}
          sx={{ display: { md: "none" } }}
          aria-label="Open navigation"
        >
          <MenuIcon />
        </IconButton>

        <TextField
          size="small"
          placeholder="Search…"
          value={searchQuery ?? ""}
          onChange={(e) => setSearchQuery?.(e.target.value)}
          sx={{ flexGrow: 1, maxWidth: 420 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" color="disabled" />
              </InputAdornment>
            ),
            endAdornment: searchQuery ? (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearchQuery?.("")} aria-label="Clear search">
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ) : null,
          }}
        />

        <Box sx={{ flexGrow: 1 }} />

        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box sx={{ textAlign: "right", display: { xs: "none", sm: "block" } }}>
            <Typography variant="subtitle2" noWrap>
              {user?.name || "—"}
            </Typography>
            {user?.role && (
              <Chip
                label={user.role}
                size="small"
                color={ROLE_COLOR[user.role] || "default"}
                sx={{ height: 18, fontSize: 11, textTransform: "capitalize" }}
              />
            )}
          </Box>

          <Tooltip title="Account">
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} size="small">
              <Avatar src={assetUrl(user?.profile)} alt={user?.name || "Profile"} sx={{ width: 40, height: 40 }}>
                {user?.name?.[0]?.toUpperCase()}
              </Avatar>
            </IconButton>
          </Tooltip>
        </Stack>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={closeMenu}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          slotProps={{ paper: { sx: { minWidth: 220, mt: 1 } } }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle2">{user?.name}</Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>
          <Divider />
          <MenuItem onClick={() => go("/admin/dashboard/profile")}>
            <ListItemIcon><PersonOutlineIcon fontSize="small" /></ListItemIcon>
            My Profile
          </MenuItem>
          {user?.role === "admin" || user?.role === "manager" ? (
            <MenuItem onClick={() => go("/admin/dashboard/users")}>
              <ListItemIcon><GroupOutlinedIcon fontSize="small" /></ListItemIcon>
              Manage Users
            </MenuItem>
          ) : null}
          <MenuItem onClick={() => go("/admin/dashboard/update-password")}>
            <ListItemIcon><LockOutlinedIcon fontSize="small" /></ListItemIcon>
            Change Password
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
            <ListItemIcon><LogoutIcon fontSize="small" color="error" /></ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
