// src/components/blog.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Card, Spin } from "antd";
import { ArrowRightOutlined, FileTextOutlined, CalendarOutlined } from "@ant-design/icons";
import { assetUrl } from "../api/client";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const showblog = async () => {
    setLoading(true);
    try {
      const responseApi = await fetch(`http://localhost:8002/api/view-blog`);
      const fetchData = await responseApi.json();
      setBlogs(fetchData.data || []);
    } catch (err) {
      console.error("Error fetching blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    showblog();
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 font-semibold text-xs uppercase tracking-wider mb-2">
            Articles & Insights
          </span>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Latest Blog Posts</h1>
          <p className="text-slate-500 text-base mt-2">
            Read articles and updates written by our team.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <Spin size="large" tip="Loading articles..." />
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-16 text-slate-400 font-medium">No blog posts available.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blogItem) => (
              <Card
                key={blogItem._id}
                hoverable
                cover={
                  <div className="relative overflow-hidden group h-56 bg-slate-100">
                    {blogItem.image ? (
                      <img
                        src={assetUrl(blogItem.image)}
                        alt={blogItem.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <FileTextOutlined className="text-4xl" />
                      </div>
                    )}
                  </div>
                }
                className="shadow-sm border border-slate-200/80 rounded-2xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span>By {blogItem.auther || "Admin"}</span>
                    {blogItem.createdAt && (
                      <span className="flex items-center gap-1">
                        <CalendarOutlined />
                        {new Date(blogItem.createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-slate-800 text-lg line-clamp-2 mb-2">
                    {blogItem.title}
                  </h3>

                  <div
                    className="text-slate-600 text-sm line-clamp-3 mb-4 leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: (blogItem.decription || "").replace(/<[^>]*>/g, " ").slice(0, 100) + "...",
                    }}
                  />
                </div>

                <Link to={`/blog-details/${blogItem._id}`}>
                  <Button
                    type="primary"
                    block
                    icon={<ArrowRightOutlined />}
                    className="rounded-xl font-semibold shadow-sm"
                  >
                    Read Article
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;