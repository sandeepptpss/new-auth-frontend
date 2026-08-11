// src/pages/admin/blogEdit.jsx
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  FormHelperText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
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
  const [form, setForm] = useState({ title: "", decription: "", auther: "", imageFile: null });
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [touched, setTouched] = useState(false);

  const fetchBlog = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/get-blog/${id}`);
      const blog = res.data?.data || {};
      setForm({
        title: blog.title || "",
        decription: blog.decription || "",
        auther: blog.auther || "",
        imageFile: null,
      });
      setImageUrl(assetUrl(blog.image));
    } catch (err) {
      setError(errorMessage(err, "Failed to load this blog post"));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBlog();
  }, [fetchBlog]);

  const bodyIsEmpty = !form.decription.replace(/<[^>]*>/g, "").trim();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm((f) => ({ ...f, imageFile: file }));
    setImageUrl(URL.createObjectURL(file));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setTouched(true);
    if (bodyIsEmpty) return;

    setSaving(true);
    try {
      const data = new FormData();
      data.append("title", form.title);
      data.append("decription", form.decription);
      data.append("auther", form.auther);
      if (form.imageFile) data.append("image", form.imageFile);

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
    <Box>
      <PageHeader
        title="Edit Blog Post"
        subtitle="Update the content, author or cover image."
        actions={
          <Button color="inherit" onClick={() => navigate("/admin/dashboard/manage-blog")}>
            Back to posts
          </Button>
        }
      />

      {state || (
        <Card elevation={1} sx={{ maxWidth: 900 }}>
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <form onSubmit={handleUpdate}>
              <Stack spacing={3}>
                <TextField
                  label="Title"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  required
                  fullWidth
                />
                <TextField
                  label="Author"
                  value={form.auther}
                  onChange={(e) => setForm((f) => ({ ...f, auther: e.target.value }))}
                  fullWidth
                />

                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Content
                  </Typography>
                  <Box
                    sx={{
                      "& .ql-container": { minHeight: 220, borderBottomLeftRadius: 8, borderBottomRightRadius: 8 },
                      "& .ql-toolbar": { borderTopLeftRadius: 8, borderTopRightRadius: 8 },
                    }}
                  >
                    <ReactQuill
                      theme="snow"
                      value={form.decription}
                      onChange={(val) => setForm((f) => ({ ...f, decription: val }))}
                      modules={QUILL_MODULES}
                      placeholder="Edit your blog content…"
                    />
                  </Box>
                  {touched && bodyIsEmpty && (
                    <FormHelperText error>Content is required</FormHelperText>
                  )}
                </Box>

                <Stack direction="row" spacing={2} alignItems="center">
                  {imageUrl ? (
                    <Box
                      component="img"
                      src={imageUrl}
                      alt="Cover"
                      sx={{ width: 120, height: 80, objectFit: "cover", borderRadius: 2 }}
                    />
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No cover image
                    </Typography>
                  )}
                  <Button component="label" variant="outlined" startIcon={<PhotoCameraOutlinedIcon />}>
                    {imageUrl ? "Replace image" : "Upload image"}
                    <input hidden type="file" accept="image/*" onChange={handleImageChange} />
                  </Button>
                </Stack>

                <Stack direction="row" spacing={1.5}>
                  <Button type="submit" variant="contained" startIcon={<SaveOutlinedIcon />} disabled={saving}>
                    {saving ? "Saving…" : "Save changes"}
                  </Button>
                  <Button
                    color="inherit"
                    onClick={() => navigate("/admin/dashboard/manage-blog")}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                </Stack>
              </Stack>
            </form>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default BlogEdit;
