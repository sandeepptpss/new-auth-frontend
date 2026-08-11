// src/pages/admin/ChangePassword.jsx
import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import toast from "react-hot-toast";
import api, { errorMessage } from "../../api/client";
import { PageHeader } from "../../components/admin/ui";

const MIN_LENGTH = 8;

const ChangePassword = () => {
  const [form, setForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [show, setShow] = useState({ old: false, next: false, confirm: false });
  const [submitting, setSubmitting] = useState(false);

  const tooShort = form.newPassword.length > 0 && form.newPassword.length < MIN_LENGTH;
  const mismatch =
    form.confirmPassword.length > 0 && form.newPassword !== form.confirmPassword;
  const sameAsOld =
    form.newPassword.length > 0 && form.newPassword === form.oldPassword;
  const canSubmit =
    form.oldPassword && form.newPassword && form.confirmPassword && !tooShort && !mismatch && !sameAsOld;

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const toggle = (key) => () => setShow((s) => ({ ...s, [key]: !s[key] }));

  const adornment = (key) => ({
    endAdornment: (
      <InputAdornment position="end">
        <IconButton onClick={toggle(key)} edge="end" size="small" aria-label="Toggle password visibility">
          {show[key] ? <VisibilityOffOutlinedIcon fontSize="small" /> : <VisibilityOutlinedIcon fontSize="small" />}
        </IconButton>
      </InputAdornment>
    ),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await api.post("/change-password", {
        oldPassword: form.oldPassword,
        newPassword: form.newPassword,
      });
      toast.success("Password changed successfully");
      setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(errorMessage(err, "Failed to change password"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      <PageHeader
        title="Change Password"
        subtitle="Use a strong password you don't reuse elsewhere."
      />

      <Card elevation={1} sx={{ maxWidth: 520 }}>
        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              <TextField
                label="Current password"
                type={show.old ? "text" : "password"}
                value={form.oldPassword}
                onChange={set("oldPassword")}
                required
                fullWidth
                InputProps={adornment("old")}
              />
              <TextField
                label="New password"
                type={show.next ? "text" : "password"}
                value={form.newPassword}
                onChange={set("newPassword")}
                required
                fullWidth
                error={tooShort || sameAsOld}
                helperText={
                  sameAsOld
                    ? "New password must be different from the current one"
                    : tooShort
                    ? `Must be at least ${MIN_LENGTH} characters`
                    : `At least ${MIN_LENGTH} characters`
                }
                InputProps={adornment("next")}
              />
              <TextField
                label="Confirm new password"
                type={show.confirm ? "text" : "password"}
                value={form.confirmPassword}
                onChange={set("confirmPassword")}
                required
                fullWidth
                error={mismatch}
                helperText={mismatch ? "Passwords do not match" : " "}
                InputProps={adornment("confirm")}
              />

              <Alert severity="info" variant="outlined">
                You'll stay signed in on this device after changing your password.
              </Alert>

              <Box>
                <Button type="submit" variant="contained" disabled={!canSubmit || submitting}>
                  {submitting ? "Updating…" : "Update password"}
                </Button>
              </Box>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ChangePassword;
