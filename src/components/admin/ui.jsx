// src/components/admin/ui.jsx
// Ant Design + Tailwind shared building blocks for admin pages
import React from 'react';
import { Card, Spin, Alert, Modal, Button, Typography } from 'antd';
import { ReloadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

/** Page title + optional description and right-aligned actions. */
export const PageHeader = ({ title, subtitle, actions }) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
    <div>
      <Title level={3} className="!mb-1 !text-slate-800 font-bold tracking-tight">
        {title}
      </Title>
      {subtitle && <Text className="text-slate-500 text-sm">{subtitle}</Text>}
    </div>
    {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
  </div>
);

/** Metric card tile for the dashboard overview. */
export const StatCard = ({ label, value, icon, color = "indigo", loading }) => {
  const colorClasses = {
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    green: "bg-emerald-50 text-emerald-600 border-emerald-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    blue: "bg-blue-50 text-blue-600 border-blue-100",
  };

  const bgClass = colorClasses[color] || colorClasses.indigo;

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow border border-slate-100">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl border ${bgClass}`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <Text className="text-slate-500 text-xs uppercase font-semibold tracking-wider block truncate">
            {label}
          </Text>
          {loading ? (
            <Spin size="small" />
          ) : (
            <span className="text-2xl font-bold text-slate-800 tracking-tight block">
              {value}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};

/** Render loading / error / empty placeholder */
export const renderState = ({ loading, error, empty, emptyText = "Nothing here yet", onRetry }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Spin size="large" tip="Loading data..." />
      </div>
    );
  }
  if (error) {
    return (
      <Alert
        message="Error"
        description={error}
        type="error"
        showIcon
        className="my-4 rounded-xl border border-red-200"
        action={
          onRetry && (
            <Button size="small" type="primary" danger icon={<ReloadOutlined />} onClick={onRetry}>
              Retry
            </Button>
          )
        }
      />
    );
  }
  if (empty) {
    return (
      <div className="py-16 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
        <ExclamationCircleOutlined className="text-3xl text-slate-400 mb-2" />
        <p className="text-slate-500 font-medium text-sm">{emptyText}</p>
      </div>
    );
  }
  return null;
};

export const StateBlock = (props) => renderState(props);

/** Replacement for confirm dialogs */
export const ConfirmDialog = ({
  open,
  title = "Are you sure?",
  message,
  confirmLabel = "Delete",
  busy = false,
  onConfirm,
  onClose,
}) => (
  <Modal
    open={open}
    title={title}
    onCancel={busy ? undefined : onClose}
    footer={[
      <Button key="cancel" onClick={onClose} disabled={busy}>
        Cancel
      </Button>,
      <Button key="confirm" type="primary" danger loading={busy} onClick={onConfirm}>
        {confirmLabel}
      </Button>,
    ]}
  >
    <p className="text-slate-600 my-2">{message}</p>
  </Modal>
);
