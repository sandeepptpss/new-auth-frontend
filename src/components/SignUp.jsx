// src/components/SignUp.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Alert, Button, Card, Form, Input, Select, Upload } from "antd";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  UploadOutlined,
  ThunderboltFilled,
} from "@ant-design/icons";

const SignUp = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const navigate = useNavigate();

  const handleSignUp = async (values) => {
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("username", values.username);
      formData.append("gender", values.gender);
      formData.append("email", values.email);
      formData.append("password", values.password);

      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append("profile", fileList[0].originFileObj);
      }

      let res = await fetch("http://localhost:8002/api/register", {
        method: "POST",
        body: formData,
      });

      let data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 1200);
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      console.error("Sign up error:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      <Card className="w-full max-w-lg shadow-2xl border-slate-800 bg-slate-950/80 backdrop-blur-xl rounded-3xl p-4 sm:p-6 relative z-10 text-slate-100">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-600/40 text-xl">
            <ThunderboltFilled />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Create Account</h2>
          <p className="text-slate-400 text-sm mt-1">Join AuthTask platform today</p>
        </div>

        {error && <Alert message={error} type="error" showIcon className="mb-4 rounded-xl" />}
        {success && (
          <Alert
            message="Registration successful! Redirecting to login..."
            type="success"
            showIcon
            className="mb-4 rounded-xl"
          />
        )}

        <Form layout="vertical" onFinish={handleSignUp}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <Form.Item
              name="name"
              rules={[{ required: true, message: "Please enter your name" }]}
            >
              <Input
                size="large"
                prefix={<UserOutlined className="text-slate-500" />}
                placeholder="Full Name"
                className="rounded-xl bg-slate-900 border-slate-800 text-white placeholder-slate-500"
              />
            </Form.Item>

            <Form.Item
              name="username"
              rules={[{ required: true, message: "Please enter username" }]}
            >
              <Input
                size="large"
                prefix={<UserOutlined className="text-slate-500" />}
                placeholder="Username"
                className="rounded-xl bg-slate-900 border-slate-800 text-white placeholder-slate-500"
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <Form.Item
              name="gender"
              rules={[{ required: true, message: "Please select gender" }]}
            >
              <Select
                size="large"
                placeholder="Gender"
                className="rounded-xl"
                popupClassName="bg-slate-900"
              >
                <Select.Option value="male">Male</Select.Option>
                <Select.Option value="female">Female</Select.Option>
                <Select.Option value="other">Other</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="email"
              rules={[{ required: true, type: "email", message: "Please enter valid email" }]}
            >
              <Input
                size="large"
                prefix={<MailOutlined className="text-slate-500" />}
                placeholder="Email Address"
                className="rounded-xl bg-slate-900 border-slate-800 text-white placeholder-slate-500"
              />
            </Form.Item>
          </div>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Please enter password" },
              { min: 6, message: "Password must be at least 6 characters" },
            ]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined className="text-slate-500" />}
              placeholder="Password"
              className="rounded-xl bg-slate-900 border-slate-800 text-white placeholder-slate-500"
            />
          </Form.Item>

          <Form.Item label={<span className="text-slate-400 text-xs font-semibold">Profile Photo (Optional)</span>}>
            <Upload
              beforeUpload={() => false}
              maxCount={1}
              fileList={fileList}
              onChange={({ fileList: fl }) => setFileList(fl)}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />} className="rounded-xl">
                Select Profile Photo
              </Button>
            </Upload>
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
            block
            className="rounded-xl h-12 font-bold text-base shadow-lg shadow-indigo-600/30 mt-4"
          >
            Sign Up
          </Button>
        </Form>

        <div className="text-center text-xs text-slate-400 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-bold ml-1">
            Sign in
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default SignUp;
