// src/pages/admin/DashboardHome.jsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import api, { assetUrl, errorMessage } from "../../api/client";
import { PageHeader, StatCard, renderState } from "../../components/admin/ui";

const byNewest = (a, b) => new Date(b.createdAt) - new Date(a.createdAt);

const DashboardHome = () => {
  const { user } = useOutletContext() || {};
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [userRes, blogRes] = await Promise.all([
        api.get("/view-user"),
        api.get("/view-blog"),
      ]);
      setUsers(userRes.data?.data || []);
      setBlogs(blogRes.data?.data || []);
    } catch (err) {
      setError(errorMessage(err, "Failed to load dashboard data"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const stats = useMemo(() => {
    const verified = users.filter((u) => u.verified).length;
    return {
      total: users.length,
      verified,
      pending: users.length - verified,
      blogs: blogs.length,
    };
  }, [users, blogs]);

  const recentUsers = useMemo(() => [...users].sort(byNewest).slice(0, 5), [users]);
  const recentBlogs = useMemo(() => [...blogs].sort(byNewest).slice(0, 5), [blogs]);

  const blocked = renderState({ loading, error, onRetry: load });

  return (
    <Box>
      <PageHeader
        title={`Welcome back${user?.name ? `, ${user.name.split(" ")[0]}` : ""}`}
        subtitle="Here's what's happening across your workspace today."
        actions={
          <Button
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate("/admin/dashboard/add-blog")}
          >
            New blog post
          </Button>
        }
      />

      {blocked || (
        <>
          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                lg: "repeat(4, 1fr)",
              },
              mb: 3,
            }}
          >
            <StatCard label="Total users" value={stats.total} icon={<GroupOutlinedIcon />} />
            <StatCard
              label="Verified users"
              value={stats.verified}
              icon={<VerifiedUserOutlinedIcon />}
              color="success"
            />
            <StatCard
              label="Awaiting verification"
              value={stats.pending}
              icon={<PendingActionsOutlinedIcon />}
              color="warning"
            />
            <StatCard
              label="Blog posts"
              value={stats.blogs}
              icon={<ArticleOutlinedIcon />}
              color="secondary"
            />
          </Box>

          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
            }}
          >
            <Card elevation={1}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6">Newest users</Typography>
                  <Button size="small" onClick={() => navigate("/admin/dashboard/users")}>
                    View all
                  </Button>
                </Stack>
              </CardContent>
              <Divider />
              {recentUsers.length === 0 ? (
                <Box sx={{ p: 3 }}>
                  <Typography color="text.secondary" variant="body2">
                    No users yet.
                  </Typography>
                </Box>
              ) : (
                <List disablePadding>
                  {recentUsers.map((u) => (
                    <ListItem key={u._id} divider>
                      <ListItemAvatar>
                        <Avatar src={assetUrl(u.profile)} alt={u.name}>
                          {u.name?.[0]?.toUpperCase()}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={u.name}
                        secondary={u.email}
                        primaryTypographyProps={{ fontWeight: 600, fontSize: 14 }}
                        secondaryTypographyProps={{ fontSize: 13 }}
                      />
                      <Chip
                        size="small"
                        label={u.verified ? "Verified" : "Pending"}
                        color={u.verified ? "success" : "warning"}
                        variant="outlined"
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Card>

            <Card elevation={1}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6">Latest blog posts</Typography>
                  <Button size="small" onClick={() => navigate("/admin/dashboard/manage-blog")}>
                    View all
                  </Button>
                </Stack>
              </CardContent>
              <Divider />
              {recentBlogs.length === 0 ? (
                <Box sx={{ p: 3 }}>
                  <Typography color="text.secondary" variant="body2">
                    No blog posts yet.
                  </Typography>
                </Box>
              ) : (
                <List disablePadding>
                  {recentBlogs.map((b) => (
                    <ListItem
                      key={b._id}
                      divider
                      secondaryAction={
                        <Typography variant="caption" color="text.secondary">
                          {b.createdAt ? new Date(b.createdAt).toLocaleDateString() : ""}
                        </Typography>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar variant="rounded" src={assetUrl(b.image)} alt={b.title}>
                          <ArticleOutlinedIcon fontSize="small" />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={b.title || "Untitled"}
                        secondary={b.auther ? `by ${b.auther}` : "Unknown author"}
                        primaryTypographyProps={{ fontWeight: 600, fontSize: 14, noWrap: true }}
                        secondaryTypographyProps={{ fontSize: 13 }}
                        sx={{ pr: 8 }}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Card>
          </Box>
        </>
      )}
    </Box>
  );
};

export default DashboardHome;
