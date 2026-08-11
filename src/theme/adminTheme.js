// src/theme/adminTheme.js
import { createTheme } from "@mui/material/styles";

export const SIDEBAR_WIDTH = 264;

const adminTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#2563eb", dark: "#1d4ed8", light: "#60a5fa" },
    secondary: { main: "#7c3aed" },
    success: { main: "#16a34a" },
    warning: { main: "#d97706" },
    error: { main: "#dc2626" },
    background: { default: "#f4f6fb", paper: "#ffffff" },
    text: { primary: "#0f172a", secondary: "#64748b" },
    divider: "#e6eaf2",
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily:
      '"Inter", "Segoe UI", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif',
    h5: { fontWeight: 700, letterSpacing: "-0.02em" },
    h6: { fontWeight: 700, letterSpacing: "-0.01em" },
    subtitle2: { fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: "none" },
        elevation1: { boxShadow: "0 1px 2px rgba(15,23,42,.06), 0 8px 24px rgba(15,23,42,.05)" },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { borderRadius: 10 } },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          fontSize: 13,
          color: "#64748b",
          backgroundColor: "#f8fafc",
          whiteSpace: "nowrap",
        },
        body: { fontSize: 14 },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: { "&:last-child td": { borderBottom: 0 } },
      },
    },
    MuiChip: {
      styleOverrides: { root: { fontWeight: 600 } },
    },
    MuiOutlinedInput: {
      styleOverrides: { root: { borderRadius: 10, backgroundColor: "#fff" } },
    },
    MuiTooltip: {
      defaultProps: { arrow: true },
    },
  },
});

export default adminTheme;
