// src/pages/admin/ChangePassword.jsx
import React, { useState } from "react";
import { Alert, Button, Card, Form, Input } from "antd";
import { LockOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";
import api, { errorMessage } from "../../api/client";
import { PageHeader } from "../../components/admin/ui";

const MIN_LENGTH = 8;

const ChangePassword = () => {
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      await api.post("/change-password", {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });
      toast.success("Password changed successfully");
      form.resetFields();
    } catch (err) {
      toast.error(errorMessage(err, "Failed to change password"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Change Password"
        subtitle="Ensure your account is using a strong password."
      />

      <Card className="shadow-sm border border-slate-100 max-w-lg">
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="oldPassword"
            label={<span className="font-semibold text-slate-700">Current Password</span>}
            rules={[{ required: true, message: "Please enter current password" }]}
          >
            <Input.Password size="large" prefix={<LockOutlined className="text-slate-400" />} />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label={<span className="font-semibold text-slate-700">New Password</span>}
            rules={[
              { required: true, message: "Please enter new password" },
              { min: MIN_LENGTH, message: `Password must be at least ${MIN_LENGTH} characters` },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("oldPassword") !== value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("New password must be different from current password"));
                },
              }),
            ]}
          >
            <Input.Password size="large" prefix={<LockOutlined className="text-slate-400" />} />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label={<span className="font-semibold text-slate-700">Confirm New Password</span>}
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Please confirm new password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match"));
                },
              }),
            ]}
          >
            <Input.Password size="large" prefix={<LockOutlined className="text-slate-400" />} />
          </Form.Item>

          <Alert
            message="You will remain logged in on this device after changing your password."
            type="info"
            showIcon
            className="mb-6 rounded-lg"
          />

          <Button
            type="primary"
            htmlType="submit"
            loading={submitting}
            size="large"
            className="w-full shadow-sm"
          >
            Update Password
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default ChangePassword;
