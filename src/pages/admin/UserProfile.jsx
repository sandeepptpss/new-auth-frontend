// src/pages/admin/UserProfile.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import VerifiedIcon from "@mui/icons-material/Verified";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import toast from "react-hot-toast";
import api, { assetUrl, errorMessage } from "../../api/client";
import { PageHeader, StateBlock } from "../../components/admin/ui";

const Field = ({ label, value }) => (
  <Box sx={{ py: 1.5 }}>
    <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: ".06em" }}>
      {label}
    </Typography>
    <Typography variant="body1" sx={{ mt: 0.25, textTransform: label === "Gender" ? "capitalize" : "none" }}>
      {value || "—"}
    </Typography>
  </Box>
);

const UserProfile = () => {
  const { user, refreshUser } = useOutletContext() || {};
  const [form, setForm] = useState({ name: "", email: "", gender: "", role: "" });
  const [file, setFile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (!user) return;
    setForm({
      name: user.name || "",
      email: user.email || "",
      gender: user.gender || "",
      role: user.role || "",
    });
  }, [user]);

  const previewUrl = useMemo(
    () => (file ? URL.createObjectURL(file) : assetUrl(user?.profile)),
    [file, user?.profile]
  );

  const cancelEdit = () => {
    setFile(null);
    setEditing(false);
    setForm({
      name: user?.name || "",
      email: user?.email || "",
      gender: user?.gender || "",
      role: user?.role || "",
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = new FormData();
      data.append("name", form.name);
      data.append("email", form.email);
      data.append("gender", form.gender);
      data.append("role", form.role);
      if (file) data.append("profile", file);

      await api.put("/profile-edit", data);
      await refreshUser?.();
      toast.success("Profile updated");
      setFile(null);
      setEditing(false);
    } catch (err) {
      toast.error(errorMessage(err, "Could not update your profile"));
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <Box>
        <PageHeader title="My Profile" />
        <StateBlock loading />
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="My Profile"
        subtitle="Your account details and photo."
        actions={
          !editing && (
            <Button variant="contained" startIcon={<EditOutlinedIcon />} onClick={() => setEditing(true)}>
              Edit profile
            </Button>
          )
        }
      />

      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "1fr", md: "320px 1fr" },
          alignItems: "start",
        }}
      >
        <Card elevation={1}>
          <CardContent sx={{ textAlign: "center", py: 4 }}>
            <Avatar
              src={previewUrl}
              alt={user.name}
              sx={{ width: 120, height: 120, mx: "auto", fontSize: 40 }}
            >
              {user.name?.[0]?.toUpperCase()}
            </Avatar>
            <Typography variant="h6" sx={{ mt: 2 }}>
              {user.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
            <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 2 }}>
              <Chip size="small" label={user.role} sx={{ textTransform: "capitalize" }} />
              <Chip
                size="small"
                icon={user.verified ? <VerifiedIcon /> : <ErrorOutlineIcon />}
                label={user.verified ? "Verified" : "Unverified"}
                color={user.verified ? "success" : "warning"}
                variant="outlined"
              />
            </Stack>

            {editing && (
              <Button
                component="label"
                variant="outlined"
                startIcon={<PhotoCameraOutlinedIcon />}
                sx={{ mt: 3 }}
              >
                Change photo
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files[0] || null)}
                />
              </Button>
            )}
          </CardContent>
        </Card>

        <Card elevation={1}>
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            {editing ? (
              <form onSubmit={handleSave}>
                <Stack spacing={2.5}>
                  <TextField
                    label="Name"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    required
                    fullWidth
                  />
                  <TextField
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    required
                    fullWidth
                  />
                  <TextField
                    select
                    label="Gender"
                    value={form.gender}
                    onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}
                    fullWidth
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </TextField>
                  {isAdmin && (
                    <TextField
                      select
                      label="Role"
                      value={form.role}
                      onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                      fullWidth
                    >
                      <MenuItem value="user">User</MenuItem>
                      <MenuItem value="manager">Manager</MenuItem>
                      <MenuItem value="admin">Admin</MenuItem>
                    </TextField>
                  )}
                  <Stack direction="row" spacing={1.5}>
                    <Button type="submit" variant="contained" disabled={saving}>
                      {saving ? "Saving…" : "Save changes"}
                    </Button>
                    <Button color="inherit" onClick={cancelEdit} disabled={saving}>
                      Cancel
                    </Button>
                  </Stack>
                </Stack>
              </form>
            ) : (
              <Stack divider={<Divider flexItem />}>
                <Field label="Name" value={user.name} />
                <Field label="Email" value={user.email} />
                <Field label="Gender" value={user.gender} />
                <Field label="Role" value={user.role} />
                <Field label="Verified" value={user.verified ? "Yes" : "No"} />
                <Field
                  label="Member since"
                  value={user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ""}
                />
              </Stack>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default UserProfile;
