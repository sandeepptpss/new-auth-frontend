// src/components/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { Alert, Button, Card, Divider, Form, Input } from "antd";
import { MailOutlined, LockOutlined, ThunderboltFilled } from "@ant-design/icons";

const Login = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loginUser = async (values) => {
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");
    try {
      const response = await fetch("http://localhost:8002/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email, password: values.password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        setSuccessMessage("Login successful! Redirecting...");
        const role = data.user.role;
        setTimeout(() => {
          if (role === "admin" || role === "manager") {
            navigate("/admin/dashboard");
          } else {
            navigate("/");
          }
        }, 500);
      } else {
        setErrorMessage(data.message || "Authentication failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    setSuccessMessage("");
    setErrorMessage("");
    try {
      const response = await fetch("http://localhost:8002/api/auth/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        setSuccessMessage("Google login successful!");
        const role = data.user.role;
        setTimeout(() => {
          if (role === "admin" || role === "manager") {
            navigate("/admin/dashboard");
          } else {
            navigate("/");
          }
        }, 500);
      } else {
        setErrorMessage(data.message || "Google login failed");
      }
    } catch (error) {
      console.error("Google login error:", error);
      setErrorMessage("Google login failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Dynamic background Glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      <Card className="w-full max-w-md shadow-2xl border-slate-800 bg-slate-950/80 backdrop-blur-xl rounded-3xl p-4 sm:p-6 relative z-10 text-slate-100">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-600/40 text-xl">
            <ThunderboltFilled />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Welcome Back</h2>
          <p className="text-slate-400 text-sm mt-1">Sign in to your account to continue</p>
        </div>

        {successMessage && (
          <Alert message={successMessage} type="success" showIcon className="mb-4 rounded-xl" />
        )}
        {errorMessage && (
          <Alert message={errorMessage} type="error" showIcon className="mb-4 rounded-xl" />
        )}

        <Form layout="vertical" onFinish={loginUser}>
          <Form.Item
            name="email"
            rules={[{ required: true, type: "email", message: "Please enter a valid email address" }]}
          >
            <Input
              size="large"
              prefix={<MailOutlined className="text-slate-500" />}
              placeholder="Email Address"
              className="rounded-xl bg-slate-900 border-slate-800 text-white placeholder-slate-500 hover:border-indigo-500 focus:border-indigo-500"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined className="text-slate-500" />}
              placeholder="Password"
              className="rounded-xl bg-slate-900 border-slate-800 text-white placeholder-slate-500 hover:border-indigo-500 focus:border-indigo-500"
            />
          </Form.Item>

          <div className="flex justify-end mb-6">
            <Link to="/forgot-password" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold">
              Forgot password?
            </Link>
          </div>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
            block
            className="rounded-xl h-12 font-bold text-base shadow-lg shadow-indigo-600/30"
          >
            Sign In
          </Button>
        </Form>

        <Divider className="border-slate-800 text-slate-500 text-xs my-6">OR</Divider>

        <div className="flex justify-center mb-6">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => setErrorMessage("Google login failed")}
            theme="filled_dark"
            shape="circle"
          />
        </div>

        <div className="text-center text-xs text-slate-400">
          Don't have an account?{" "}
          <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 font-bold ml-1">
            Create account
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;
