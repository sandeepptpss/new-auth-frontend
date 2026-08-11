// src/theme/adminTheme.js
// Ant Design custom theme configuration and global constants

export const SIDEBAR_WIDTH = 260;

export const antdThemeConfig = {
  token: {
    colorPrimary: '#4f46e5', // Tailwind indigo-600
    colorSuccess: '#16a34a',
    colorWarning: '#d97706',
    colorError: '#dc2626',
    colorInfo: '#2563eb',
    borderRadius: 8,
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    colorBgContainer: '#ffffff',
    colorBgLayout: '#f8fafc',
  },
  components: {
    Button: {
      fontWeight: 600,
      borderRadius: 8,
    },
    Card: {
      borderRadius: 12,
      boxShadowTertiary: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    },
    Table: {
      borderRadius: 12,
      headerBg: '#f8fafc',
      headerColor: '#475569',
      headerFontWeight: 600,
    },
    Menu: {
      itemBorderRadius: 8,
    },
  },
};

export default antdThemeConfig;
