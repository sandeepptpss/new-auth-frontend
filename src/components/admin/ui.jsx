// src/components/admin/ui.jsx
// Small shared building blocks used across the admin pages.
import React from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

/** Page title + optional description and right-aligned actions. */
export const PageHeader = ({ title, subtitle, actions }) => (
  <Stack
    direction={{ xs: "column", sm: "row" }}
    justifyContent="space-between"
    alignItems={{ xs: "flex-start", sm: "center" }}
    spacing={2}
    sx={{ mb: 3 }}
  >
    <Box>
      <Typography variant="h5" component="h1">
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {subtitle}
        </Typography>
      )}
    </Box>
    {actions && (
      <Stack direction="row" spacing={1} flexWrap="wrap">
        {actions}
      </Stack>
    )}
  </Stack>
);

/** Metric tile for the dashboard overview. */
export const StatCard = ({ label, value, icon, color = "primary", loading }) => (
  <Card elevation={1} sx={{ height: "100%" }}>
    <CardContent>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Avatar
          variant="rounded"
          sx={{
            bgcolor: (t) => `${t.palette[color].main}14`,
            color: `${color}.main`,
            width: 48,
            height: 48,
          }}
        >
          {icon}
        </Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body2" color="text.secondary" noWrap>
            {label}
          </Typography>
          <Typography variant="h5" component="p" sx={{ lineHeight: 1.2 }}>
            {loading ? <CircularProgress size={20} /> : value}
          </Typography>
        </Box>
      </Stack>
    </CardContent>
  </Card>
);

/**
 * Loading / error / empty placeholder for a data region, or null when there is
 * data to show. This is a plain function, not a component, so callers can write
 *   {renderState({ loading, error, empty }) || <Table />}
 * and actually get the fallback — a `<StateBlock />` element is always truthy
 * even when the component itself renders nothing.
 */
export const renderState = ({ loading, error, empty, emptyText = "Nothing here yet", onRetry }) => {
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return (
      <Alert
        severity="error"
        sx={{ my: 2 }}
        action={
          onRetry && (
            <Button color="inherit" size="small" onClick={onRetry}>
              Retry
            </Button>
          )
        }
      >
        {error}
      </Alert>
    );
  }
  if (empty) {
    return (
      <Paper variant="outlined" sx={{ py: 8, textAlign: "center", borderStyle: "dashed" }}>
        <Typography color="text.secondary">{emptyText}</Typography>
      </Paper>
    );
  }
  return null;
};

/** Component form of `renderState`, for when it is the only thing being rendered. */
export const StateBlock = (props) => renderState(props);

/** Replacement for window.confirm on destructive actions. */
export const ConfirmDialog = ({
  open,
  title = "Are you sure?",
  message,
  confirmLabel = "Delete",
  confirmColor = "error",
  busy = false,
  onConfirm,
  onClose,
}) => (
  <Dialog open={open} onClose={busy ? undefined : onClose} maxWidth="xs" fullWidth>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <DialogContentText>{message}</DialogContentText>
    </DialogContent>
    <DialogActions sx={{ px: 3, pb: 2 }}>
      <Button onClick={onClose} disabled={busy} color="inherit">
        Cancel
      </Button>
      <Button
        onClick={onConfirm}
        variant="contained"
        color={confirmColor}
        disabled={busy}
        startIcon={busy ? <CircularProgress size={16} color="inherit" /> : null}
      >
        {confirmLabel}
      </Button>
    </DialogActions>
  </Dialog>
);
