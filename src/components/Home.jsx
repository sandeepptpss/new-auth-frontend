// src/components/Home.jsx
import React from "react";
import { Button, Card } from "antd";
import {
  RocketOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <SafetyCertificateOutlined className="text-3xl text-indigo-600 mb-4 block" />,
      title: "Secure Authentication",
      desc: "Robust role-based access control with JWT token management and Google OAuth login integration.",
    },
    {
      icon: <RocketOutlined className="text-3xl text-indigo-600 mb-4 block" />,
      title: "Powerful Admin Suite",
      desc: "Comprehensive dashboard for user management, blog post publishing, profile settings, and data analytics.",
    },
    {
      icon: <ThunderboltOutlined className="text-3xl text-indigo-600 mb-4 block" />,
      title: "Modern Tech Stack",
      desc: "Built with React 18, Node.js, Express, MongoDB, Ant Design, and Tailwind CSS for peak performance.",
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-900 text-white py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold text-xs uppercase tracking-wider mb-6 border border-indigo-500/30">
            Next-Gen Auth Platform
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight mb-6 bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
            Modern Web Solution with Ant Design & Tailwind
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Experience a seamless role-based authentication ecosystem with high-speed performance, clean design system, and full admin capabilities.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              type="primary"
              size="large"
              icon={<ArrowRightOutlined />}
              onClick={() => navigate("/products")}
              className="h-12 px-8 font-bold text-base rounded-xl shadow-lg shadow-indigo-600/30"
            >
              Explore Products
            </Button>
            <Button
              size="large"
              onClick={() => navigate("/about")}
              className="h-12 px-8 font-bold text-base rounded-xl border-slate-700 text-slate-200 hover:text-white bg-slate-800/50"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
            Everything You Need
          </h2>
          <p className="text-slate-600 text-base">
            Crafted with high visual fidelity and robust functional components.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <Card
              key={i}
              hoverable
              className="shadow-sm hover:shadow-md border border-slate-200/80 rounded-2xl p-4 transition-all duration-200"
            >
              {f.icon}
              <h3 className="text-xl font-bold text-slate-800 mb-2">{f.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;