// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import { ThunderboltFilled } from "@ant-design/icons";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 text-white font-extrabold text-xl mb-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                <ThunderboltFilled />
              </div>
              <span>AuthTask</span>
            </div>
            <p className="text-sm text-slate-400">
              A comprehensive role-based authentication and management platform built with modern technologies.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-white transition-colors">Blog</Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white transition-colors">Products</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Contact</h4>
            <p className="text-sm">Email: info@tech-prastish.com</p>
            <p className="text-sm">Support available 24/7</p>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>© {currentYear} AuthTask. All Rights Reserved.</p>
          <p>Designed with Ant Design & Tailwind CSS</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;