// src/pages/admin/AddBlog.jsx
import React, { useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
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
  const [form, setForm] = useState({ title: "", decription: "", auther: "", image: null });
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState(false);

  const preview = useMemo(
    () => (form.image ? URL.createObjectURL(form.image) : ""),
    [form.image]
  );

  const bodyIsEmpty = !form.decription.replace(/<[^>]*>/g, "").trim();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched(true);
    if (bodyIsEmpty) return;

    setSubmitting(true);
    try {
      const data = new FormData();
      data.append("title", form.title);
      data.append("decription", form.decription);
      data.append("auther", form.auther || user?.name || "");
      if (form.image) data.append("image", form.image);

      await api.post("/add-blog", data);
      toast.success("Blog post published");
      navigate("/admin/dashboard/manage-blog");
    } catch (err) {
      toast.error(errorMessage(err, "Could not publish the post"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      <PageHeader
        title="Add Blog Post"
        subtitle="Write a new post and publish it to the blog."
        actions={
          <Button color="inherit" onClick={() => navigate("/admin/dashboard/manage-blog")}>
            Back to posts
          </Button>
        }
      />

      <Card elevation={1} sx={{ maxWidth: 900 }}>
        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Title"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                required
                fullWidth
                autoFocus
              />

              <TextField
                label="Author"
                value={form.auther}
                onChange={(e) => setForm((f) => ({ ...f, auther: e.target.value }))}
                fullWidth
                placeholder={user?.name || "Author name"}
                helperText="Leave blank to publish under your own name"
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
                    placeholder="Write your blog content here…"
                  />
                </Box>
                {touched && bodyIsEmpty && (
                  <FormHelperText error>Content is required</FormHelperText>
                )}
              </Box>

              <Stack direction="row" spacing={2} alignItems="center">
                <Button component="label" variant="outlined" startIcon={<PhotoCameraOutlinedIcon />}>
                  {form.image ? "Change cover" : "Upload cover"}
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={(e) => setForm((f) => ({ ...f, image: e.target.files[0] || null }))}
                  />
                </Button>
                {preview && (
                  <Box
                    component="img"
                    src={preview}
                    alt="Cover preview"
                    sx={{ width: 96, height: 64, objectFit: "cover", borderRadius: 2 }}
                  />
                )}
                {form.image && (
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {form.image.name}
                  </Typography>
                )}
              </Stack>

              <Stack direction="row" spacing={1.5}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveOutlinedIcon />}
                  disabled={submitting}
                >
                  {submitting ? "Publishing…" : "Publish post"}
                </Button>
                <Button
                  color="inherit"
                  onClick={() => navigate("/admin/dashboard/manage-blog")}
                  disabled={submitting}
                >
                  Cancel
                </Button>
              </Stack>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AddBlog;
