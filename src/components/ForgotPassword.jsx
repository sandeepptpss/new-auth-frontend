// src/components/ForgotPassword.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Alert, Button, Card, Form, Input } from "antd";
import { MailOutlined, ArrowLeftOutlined, ThunderboltFilled } from "@ant-design/icons";
import axios from "axios";

const ForgotPasswordPage = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (values) => {
    setMessage("");
    setError("");
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8002/api/auth/forgot-password", {
        email: values.email,
      });
      setMessage(response.data.message);
    } catch (err) {
      if (err.response && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl pointer-events-none" />

      <Card className="w-full max-w-md shadow-2xl border-slate-800 bg-slate-950/80 backdrop-blur-xl rounded-3xl p-4 sm:p-6 relative z-10 text-slate-100">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-600/40 text-xl">
            <ThunderboltFilled />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Forgot Password</h2>
          <p className="text-slate-400 text-sm mt-1">
            Enter your email to receive a password reset link
          </p>
        </div>

        {message && <Alert message={message} type="success" showIcon className="mb-4 rounded-xl" />}
        {error && <Alert message={error} type="error" showIcon className="mb-4 rounded-xl" />}

        <Form layout="vertical" onFinish={handleForgotPassword}>
          <Form.Item
            name="email"
            rules={[{ required: true, type: "email", message: "Please enter a valid email address" }]}
          >
            <Input
              size="large"
              prefix={<MailOutlined className="text-slate-500" />}
              placeholder="Enter your email"
              className="rounded-xl bg-slate-900 border-slate-800 text-white placeholder-slate-500"
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
            block
            className="rounded-xl h-12 font-bold text-base shadow-lg shadow-indigo-600/30 mt-2 mb-4"
          >
            Send Reset Link
          </Button>
        </Form>

        <div className="text-center">
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold text-xs inline-flex items-center gap-2">
            <ArrowLeftOutlined /> Back to Login
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
