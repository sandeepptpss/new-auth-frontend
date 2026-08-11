// src/pages/admin/BlogView.jsx
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Card,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Tooltip,
  Typography,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import toast from "react-hot-toast";
import api, { assetUrl, errorMessage } from "../../api/client";
import { ConfirmDialog, PageHeader, renderState } from "../../components/admin/ui";
import useTableData from "../../hooks/useTableData";

const COLUMNS = [
  { key: "image", label: "", sortable: false },
  { key: "title", label: "Title", sortable: true },
  { key: "auther", label: "Author", sortable: true },
  { key: "createdAt", label: "Created", sortable: true },
  { key: "actions", label: "Actions", sortable: false, align: "right" },
];

const SEARCH_FIELDS = ["title", "auther"];

/** Blog descriptions are stored as HTML; show a plain-text preview instead. */
const toExcerpt = (html, length = 90) => {
  const text = String(html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > length ? `${text.slice(0, length)}…` : text;
};

const BlogView = () => {
  const { searchQuery = "" } = useOutletContext() || {};
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/view-blog");
      setBlogs(res.data?.data || []);
    } catch (err) {
      setError(errorMessage(err, "Failed to load blog posts"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const table = useTableData(blogs, SEARCH_FIELDS, searchQuery, {
    key: "createdAt",
    direction: "desc",
  });

  const handleDelete = async () => {
    if (!pendingDelete) return;
    const id = pendingDelete._id || pendingDelete.id;
    setDeleting(true);
    try {
      await api.delete(`/delete-blog/${id}`);
      setBlogs((prev) => prev.filter((b) => (b._id || b.id) !== id));
      toast.success("Blog post deleted");
      setPendingDelete(null);
    } catch (err) {
      toast.error(errorMessage(err, "Delete failed"));
    } finally {
      setDeleting(false);
    }
  };

  const state = renderState({
    loading,
    error,
    empty: !loading && !error && table.total === 0,
    emptyText: searchQuery ? `No posts match "${searchQuery}"` : "No blog posts yet",
    onRetry: fetchBlogs,
  });

  return (
    <Box>
      <PageHeader
        title="Blog Posts"
        subtitle={
          loading
            ? "Loading posts…"
            : `${table.total} of ${blogs.length} post${blogs.length === 1 ? "" : "s"}${
                searchQuery ? ` matching "${searchQuery}"` : ""
              }`
        }
        actions={
          <>
            <Button variant="outlined" startIcon={<RefreshIcon />} onClick={fetchBlogs} disabled={loading}>
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate("/admin/dashboard/add-blog")}
            >
              Add blog
            </Button>
          </>
        }
      />

      {state || (
        <Card elevation={1}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {COLUMNS.map((col) => (
                    <TableCell key={col.key} align={col.align || "left"}>
                      {col.sortable ? (
                        <TableSortLabel
                          active={table.sort.key === col.key}
                          direction={table.sort.key === col.key ? table.sort.direction : "asc"}
                          onClick={() => table.toggleSort(col.key)}
                        >
                          {col.label}
                        </TableSortLabel>
                      ) : (
                        col.label
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {table.rows.map((blog) => {
                  const id = blog._id || blog.id;
                  return (
                    <TableRow key={id} hover>
                      <TableCell sx={{ width: 72 }}>
                        <Avatar
                          variant="rounded"
                          src={assetUrl(blog.image)}
                          alt={blog.title}
                          sx={{ width: 48, height: 48 }}
                        >
                          <ImageOutlinedIcon fontSize="small" />
                        </Avatar>
                      </TableCell>
                      <TableCell sx={{ maxWidth: 420 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                          {blog.title || "Untitled"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {toExcerpt(blog.decription) || "No description"}
                        </Typography>
                      </TableCell>
                      <TableCell>{blog.auther || "Unknown"}</TableCell>
                      <TableCell>
                        {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : "—"}
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                          <Tooltip title="Edit post">
                            <IconButton
                              size="small"
                              onClick={() => navigate(`/admin/dashboard/blogs/edit/${id}`)}
                            >
                              <EditOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete post">
                            <IconButton size="small" color="error" onClick={() => setPendingDelete(blog)}>
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={table.total}
            page={table.page}
            onPageChange={(_, p) => table.setPage(p)}
            rowsPerPage={table.rowsPerPage}
            onRowsPerPageChange={(e) => table.setRowsPerPage(parseInt(e.target.value, 10))}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </Card>
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete blog post"
        message={`"${pendingDelete?.title || "This post"}" will be permanently removed.`}
        busy={deleting}
        onConfirm={handleDelete}
        onClose={() => setPendingDelete(null)}
      />
    </Box>
  );
};

export default BlogView;
