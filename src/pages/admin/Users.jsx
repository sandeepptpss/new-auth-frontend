// src/pages/admin/Users.jsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import RefreshIcon from "@mui/icons-material/Refresh";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import toast from "react-hot-toast";
import api, { assetUrl, errorMessage } from "../../api/client";
import { ConfirmDialog, PageHeader, renderState } from "../../components/admin/ui";
import useTableData from "../../hooks/useTableData";

const ROLE_META = {
  admin: { label: "Admin", color: "primary" },
  manager: { label: "Manager", color: "secondary" },
  user: { label: "User", color: "default" },
};

const COLUMNS = [
  { key: "name", label: "User", sortable: true },
  { key: "gender", label: "Gender", sortable: true },
  { key: "role", label: "Role", sortable: true },
  { key: "verified", label: "Verified", sortable: true },
  { key: "createdAt", label: "Joined", sortable: true },
  { key: "actions", label: "Actions", sortable: false, align: "right" },
];

const SEARCH_FIELDS = ["name", "email", "role", "gender"];

const emptyEdit = { _id: "", name: "", email: "", gender: "", role: "user", profile: null };

const Users = () => {
  const { searchQuery = "", user: currentUser } = useOutletContext() || {};
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editData, setEditData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [busyIds, setBusyIds] = useState([]);

  const isAdmin = currentUser?.role === "admin";

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/view-user");
      setUsers(res.data?.data || []);
    } catch (err) {
      setError(errorMessage(err, "Failed to load users"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const table = useTableData(users, SEARCH_FIELDS, searchQuery, {
    key: "createdAt",
    direction: "desc",
  });

  /** Non-admins may not modify admin accounts. */
  const canManage = useCallback(
    (row) => isAdmin || row.role !== "admin",
    [isAdmin]
  );

  const setBusy = (id, on) =>
    setBusyIds((prev) => (on ? [...prev, id] : prev.filter((x) => x !== id)));

  const toggleVerification = async (row) => {
    const next = !row.verified;
    setBusy(row._id, true);
    // Optimistic: revert if the request fails.
    setUsers((prev) => prev.map((u) => (u._id === row._id ? { ...u, verified: next } : u)));
    try {
      await api.put(`/update-verification/${row._id}`, { verified: next });
      toast.success(`${row.name} ${next ? "verified" : "unverified"}`);
    } catch (err) {
      setUsers((prev) =>
        prev.map((u) => (u._id === row._id ? { ...u, verified: row.verified } : u))
      );
      toast.error(errorMessage(err, "Could not update verification"));
    } finally {
      setBusy(row._id, false);
    }
  };

  const handleDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/delete-user/${pendingDelete._id}`);
      setUsers((prev) => prev.filter((u) => u._id !== pendingDelete._id));
      toast.success(`${pendingDelete.name} deleted`);
      setPendingDelete(null);
    } catch (err) {
      toast.error(errorMessage(err, "Delete failed"));
    } finally {
      setDeleting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", editData.name);
      formData.append("email", editData.email);
      formData.append("gender", editData.gender);
      formData.append("role", editData.role);
      if (editData.profile) formData.append("profile", editData.profile);

      const res = await api.put(`/update-user/${editData._id}`, formData);
      const updated = res.data?.user || {};
      setUsers((prev) =>
        prev.map((u) =>
          u._id === editData._id
            ? {
                ...u,
                name: editData.name,
                email: editData.email,
                gender: editData.gender,
                role: editData.role,
                profile: updated.profile ?? u.profile,
              }
            : u
        )
      );
      toast.success("User updated");
      setEditData(null);
    } catch (err) {
      toast.error(errorMessage(err, "Could not update user"));
    } finally {
      setSaving(false);
    }
  };

  const editPreview = useMemo(() => {
    if (!editData) return "";
    if (editData.profile) return URL.createObjectURL(editData.profile);
    return assetUrl(editData.existingProfile);
  }, [editData]);

  const state = renderState({
    loading,
    error,
    empty: !loading && !error && table.total === 0,
    emptyText: searchQuery ? `No users match "${searchQuery}"` : "No users yet",
    onRetry: fetchUsers,
  });

  return (
    <Box>
      <PageHeader
        title="Users"
        subtitle={
          loading
            ? "Loading accounts…"
            : `${table.total} of ${users.length} account${users.length === 1 ? "" : "s"}${
                searchQuery ? ` matching "${searchQuery}"` : ""
              }`
        }
        actions={
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={fetchUsers} disabled={loading}>
            Refresh
          </Button>
        }
      />

      {state || (
        <Card elevation={1}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {COLUMNS.map((col) => (
                    <TableCell key={col.key} align={col.align || "left"}>
                      {col.sortable ? (
                        <TableSortLabel
                          active={table.sort.key === col.key}
                          direction={table.sort.key === col.key ? table.sort.direction : "asc"}
                          onClick={() => table.toggleSort(col.key)}
                        >
                          {col.label}
                        </TableSortLabel>
                      ) : (
                        col.label
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {table.rows.map((row) => {
                  const manageable = canManage(row);
                  const lockedHint = "Admin accounts can only be changed by an admin";
                  const role = ROLE_META[row.role] || ROLE_META.user;

                  return (
                    <TableRow key={row._id} hover>
                      <TableCell>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar src={assetUrl(row.profile)} alt={row.name}>
                            {row.name?.[0]?.toUpperCase()}
                          </Avatar>
                          <Box sx={{ minWidth: 0 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                              {row.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" noWrap>
                              {row.email}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell sx={{ textTransform: "capitalize" }}>{row.gender || "—"}</TableCell>
                      <TableCell>
                        <Chip size="small" label={role.label} color={role.color} variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Tooltip title={manageable ? "Toggle verification" : lockedHint}>
                          <span>
                            <Switch
                              size="small"
                              checked={Boolean(row.verified)}
                              disabled={!manageable || busyIds.includes(row._id)}
                              onChange={() => toggleVerification(row)}
                              inputProps={{ "aria-label": `Verify ${row.name}` }}
                            />
                          </span>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "—"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          updated {row.updatedAt ? new Date(row.updatedAt).toLocaleDateString() : "—"}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                          <Tooltip title={manageable ? "Edit user" : lockedHint}>
                            <span>
                              <IconButton
                                size="small"
                                disabled={!manageable}
                                onClick={() =>
                                  setEditData({
                                    ...emptyEdit,
                                    _id: row._id,
                                    name: row.name || "",
                                    email: row.email || "",
                                    gender: row.gender || "",
                                    role: row.role || "user",
                                    existingProfile: row.profile,
                                  })
                                }
                              >
                                <EditOutlinedIcon fontSize="small" />
                              </IconButton>
                            </span>
                          </Tooltip>
                          <Tooltip title={manageable ? "Delete user" : lockedHint}>
                            <span>
                              <IconButton
                                size="small"
                                color="error"
                                disabled={!manageable}
                                onClick={() => setPendingDelete(row)}
                              >
                                <DeleteOutlineIcon fontSize="small" />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={table.total}
            page={table.page}
            onPageChange={(_, p) => table.setPage(p)}
            rowsPerPage={table.rowsPerPage}
            onRowsPerPageChange={(e) => table.setRowsPerPage(parseInt(e.target.value, 10))}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </Card>
      )}

      {/* Edit dialog */}
      <Dialog open={Boolean(editData)} onClose={() => !saving && setEditData(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit user</DialogTitle>
        <form onSubmit={handleEditSubmit}>
          <DialogContent dividers>
            <Stack spacing={2.5}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar src={editPreview} sx={{ width: 64, height: 64 }}>
                  {editData?.name?.[0]?.toUpperCase()}
                </Avatar>
                <Button component="label" variant="outlined" startIcon={<PhotoCameraOutlinedIcon />}>
                  Change photo
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setEditData((prev) => ({ ...prev, profile: e.target.files[0] || null }))
                    }
                  />
                </Button>
              </Stack>

              <TextField
                label="Name"
                value={editData?.name || ""}
                onChange={(e) => setEditData((p) => ({ ...p, name: e.target.value }))}
                required
                fullWidth
              />
              <TextField
                label="Email"
                type="email"
                value={editData?.email || ""}
                onChange={(e) => setEditData((p) => ({ ...p, email: e.target.value }))}
                required
                fullWidth
              />
              <TextField
                select
                label="Gender"
                value={editData?.gender || ""}
                onChange={(e) => setEditData((p) => ({ ...p, gender: e.target.value }))}
                required
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
                  value={editData?.role || "user"}
                  onChange={(e) => setEditData((p) => ({ ...p, role: e.target.value }))}
                  required
                  fullWidth
                  helperText="Controls what this account can access"
                >
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="manager">Manager</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </TextField>
              )}
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={() => setEditData(null)} color="inherit" disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={saving}>
              {saving ? "Saving…" : "Save changes"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete user"
        message={`This permanently removes ${pendingDelete?.name || "this user"} (${
          pendingDelete?.email || ""
        }). This cannot be undone.`}
        busy={deleting}
        onConfirm={handleDelete}
        onClose={() => setPendingDelete(null)}
      />
    </Box>
  );
};

export default Users;
