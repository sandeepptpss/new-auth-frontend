// src/pages/admin/blogEdit.jsx
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Form, Input, Upload } from "antd";
import { SaveOutlined, UploadOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import toast from "react-hot-toast";
import api, { assetUrl, errorMessage } from "../../api/client";
import { PageHeader, renderState } from "../../components/admin/ui";

const QUILL_MODULES = {
  toolbar: [
    [{ header: [2, 3, false] }],
    ["bold", "italic", "underline", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"],
  ],
};

const BlogEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  const fetchBlog = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/get-blog/${id}`);
      const blog = res.data?.data || {};
      form.setFieldsValue({
        title: blog.title || "",
        auther: blog.auther || "",
      });
      setDescription(blog.decription || "");
      setImageUrl(assetUrl(blog.image));
    } catch (err) {
      setError(errorMessage(err, "Failed to load this blog post"));
    } finally {
      setLoading(false);
    }
  }, [id, form]);

  useEffect(() => {
    fetchBlog();
  }, [fetchBlog]);

  const handleUpdate = async (values) => {
    const bodyIsEmpty = !description.replace(/<[^>]*>/g, "").trim();
    if (bodyIsEmpty) {
      toast.error("Content is required");
      return;
    }

    setSaving(true);
    try {
      const data = new FormData();
      data.append("title", values.title);
      data.append("decription", description);
      data.append("auther", values.auther);
      if (fileList.length > 0 && fileList[0].originFileObj) {
        data.append("image", fileList[0].originFileObj);
      }

      await api.put(`/update-blog/${id}`, data);
      toast.success("Blog post updated");
      navigate("/admin/dashboard/manage-blog");
    } catch (err) {
      toast.error(errorMessage(err, "Update failed"));
    } finally {
      setSaving(false);
    }
  };

  const state = renderState({ loading, error, onRetry: fetchBlog });

  return (
    <div>
      <PageHeader
        title="Edit Blog Post"
        subtitle="Update article title, content, author, or cover photo."
        actions={
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/admin/dashboard/manage-blog")}>
            Back to Posts
          </Button>
        }
      />

      {state || (
        <Card className="shadow-sm border border-slate-100 max-w-4xl">
          <Form form={form} layout="vertical" onFinish={handleUpdate}>
            <Form.Item
              name="title"
              label={<span className="font-semibold text-slate-700">Title</span>}
              rules={[{ required: true, message: "Please enter blog title" }]}
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item
              name="auther"
              label={<span className="font-semibold text-slate-700">Author</span>}
            >
              <Input size="large" />
            </Form.Item>

            <div className="mb-6">
              <label className="block font-semibold text-slate-700 mb-2">Content</label>
              <ReactQuill
                theme="snow"
                value={description}
                onChange={setDescription}
                modules={QUILL_MODULES}
                className="bg-white rounded-lg border-slate-200"
              />
            </div>

            <Form.Item label={<span className="font-semibold text-slate-700">Cover Image</span>}>
              <div className="flex items-center gap-4">
                {fileList.length > 0 ? (
                  <img
                    src={URL.createObjectURL(fileList[0].originFileObj)}
                    alt="New Cover"
                    className="w-28 h-20 object-cover rounded-lg border border-slate-200"
                  />
                ) : imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Cover"
                    className="w-28 h-20 object-cover rounded-lg border border-slate-200"
                  />
                ) : null}

                <Upload
                  beforeUpload={() => false}
                  maxCount={1}
                  fileList={fileList}
                  onChange={({ fileList: fl }) => setFileList(fl)}
                  accept="image/*"
                >
                  <Button icon={<UploadOutlined />}>Replace Cover Photo</Button>
                </Upload>
              </div>
            </Form.Item>

            <div className="flex gap-3 mt-6">
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={saving}
                size="large"
              >
                Save Changes
              </Button>
              <Button onClick={() => navigate("/admin/dashboard/manage-blog")} disabled={saving} size="large">
                Cancel
              </Button>
            </div>
          </Form>
        </Card>
      )}
    </div>
  );
};

export default BlogEdit;
