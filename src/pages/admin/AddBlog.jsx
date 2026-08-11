// src/pages/admin/AddBlog.jsx
import React, { useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Button, Card, Form, Input, Upload } from "antd";
import { SaveOutlined, UploadOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import toast from "react-hot-toast";
import api, { errorMessage } from "../../api/client";
import { PageHeader } from "../../components/admin/ui";

const QUILL_MODULES = {
  toolbar: [
    [{ header: [2, 3, false] }],
    ["bold", "italic", "underline", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"],
  ],
};

const AddBlog = () => {
  const navigate = useNavigate();
  const { user } = useOutletContext() || {};
  const [description, setDescription] = useState("");
  const [fileList, setFileList] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  const preview = useMemo(
    () => (fileList.length > 0 ? URL.createObjectURL(fileList[0].originFileObj) : ""),
    [fileList]
  );

  const handleSubmit = async (values) => {
    const bodyIsEmpty = !description.replace(/<[^>]*>/g, "").trim();
    if (bodyIsEmpty) {
      toast.error("Content is required");
      return;
    }

    setSubmitting(true);
    try {
      const data = new FormData();
      data.append("title", values.title);
      data.append("decription", description);
      data.append("auther", values.auther || user?.name || "");
      if (fileList.length > 0 && fileList[0].originFileObj) {
        data.append("image", fileList[0].originFileObj);
      }

      await api.post("/add-blog", data);
      toast.success("Blog post published");
      navigate("/admin/dashboard/manage-blog");
    } catch (err) {
      toast.error(errorMessage(err, "Could not publish post"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Add Blog Post"
        subtitle="Write a new article and publish it to your website."
        actions={
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/admin/dashboard/manage-blog")}>
            Back to Posts
          </Button>
        }
      />

      <Card className="shadow-sm border border-slate-100 max-w-4xl">
        <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ auther: user?.name || "" }}>
          <Form.Item
            name="title"
            label={<span className="font-semibold text-slate-700">Title</span>}
            rules={[{ required: true, message: "Please enter blog title" }]}
          >
            <Input size="large" placeholder="Enter article title..." />
          </Form.Item>

          <Form.Item
            name="auther"
            label={<span className="font-semibold text-slate-700">Author</span>}
            help="Leave blank to use your current account name"
          >
            <Input size="large" placeholder={user?.name || "Author name"} />
          </Form.Item>

          <div className="mb-6">
            <label className="block font-semibold text-slate-700 mb-2">Content</label>
            <ReactQuill
              theme="snow"
              value={description}
              onChange={setDescription}
              modules={QUILL_MODULES}
              placeholder="Write your article content here..."
              className="bg-white rounded-lg border-slate-200"
            />
          </div>

          <Form.Item label={<span className="font-semibold text-slate-700">Cover Image</span>}>
            <div className="flex items-center gap-4">
              <Upload
                beforeUpload={() => false}
                maxCount={1}
                fileList={fileList}
                onChange={({ fileList: fl }) => setFileList(fl)}
                accept="image/*"
              >
                <Button icon={<UploadOutlined />}>Select Cover Image</Button>
              </Upload>

              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-24 h-16 object-cover rounded-lg border border-slate-200"
                />
              )}
            </div>
          </Form.Item>

          <div className="flex gap-3 mt-6">
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={submitting}
              size="large"
            >
              Publish Post
            </Button>
            <Button onClick={() => navigate("/admin/dashboard/manage-blog")} disabled={submitting} size="large">
              Cancel
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default AddBlog;
