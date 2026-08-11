// src/components/blogDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Card, Spin } from "antd";
import { ArrowLeftOutlined, CalendarOutlined, UserOutlined } from "@ant-design/icons";
import { assetUrl } from "../api/client";

const BlogDetails = () => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8002/api/get-blog/${id}`);
        const result = await response.json();
        setBlog(result.data);
      } catch (error) {
        console.error("Error fetching blog details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Spin size="large" tip="Loading post..." />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4 text-center">
        <p className="text-slate-500 font-medium">Blog post not found.</p>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/blog")} className="mt-4">
          Back to Blog
        </Button>
      </div>
    );
  }

  const formattedDate = blog.createdAt
    ? new Date(blog.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/blog")}
          className="font-semibold rounded-lg"
        >
          Back to Articles
        </Button>

        <Card className="shadow-sm border border-slate-200/80 rounded-2xl overflow-hidden p-2 sm:p-6">
          {blog.image && (
            <img
              src={assetUrl(blog.image)}
              alt={blog.title}
              className="w-full h-80 sm:h-96 object-cover rounded-xl mb-6 shadow-sm"
            />
          )}

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug mb-4">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-slate-500 text-sm border-b border-slate-100 pb-6 mb-6">
            <span className="flex items-center gap-1.5 font-semibold text-slate-700">
              <UserOutlined className="text-indigo-600" />
              Author: {blog.auther || "Admin"}
            </span>

            {formattedDate && (
              <span className="flex items-center gap-1.5">
                <CalendarOutlined className="text-indigo-600" />
                {formattedDate}
              </span>
            )}
          </div>

          <div
            className="prose max-w-none text-slate-700 leading-relaxed text-base"
            dangerouslySetInnerHTML={{ __html: blog.decription }}
          />
        </Card>
      </div>
    </div>
  );
};

export default BlogDetails;
