// src/pages/admin/Products.jsx
// Admin-side catalogue view. Data comes from the public dummyjson demo API,
// the same source the storefront page uses.
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import StarRateRoundedIcon from "@mui/icons-material/StarRateRounded";
import { PageHeader, renderState } from "../../components/admin/ui";

const PRODUCTS_URL = "https://dummyjson.com/products?limit=48";

const Products = () => {
  const { searchQuery = "" } = useOutletContext() || {};
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(PRODUCTS_URL);
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return products;
    return products.filter((p) =>
      [p.title, p.brand, p.category].some((v) => String(v || "").toLowerCase().includes(query))
    );
  }, [products, searchQuery]);

  const state = renderState({
    loading,
    error,
    empty: !loading && !error && filtered.length === 0,
    emptyText: searchQuery ? `No products match "${searchQuery}"` : "No products found",
    onRetry: load,
  });

  return (
    <Box>
      <PageHeader
        title="Products"
        subtitle={
          loading ? "Loading catalogue…" : `${filtered.length} of ${products.length} products`
        }
        actions={
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={load} disabled={loading}>
            Refresh
          </Button>
        }
      />

      {state || (
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
              xl: "repeat(4, 1fr)",
            },
          }}
        >
          {filtered.map((product) => (
            <Card key={product.id} elevation={1} sx={{ display: "flex", flexDirection: "column" }}>
              <CardMedia
                component="img"
                image={product.thumbnail}
                alt={product.title}
                sx={{ height: 160, objectFit: "cover", bgcolor: "#f1f5f9" }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }} noWrap title={product.title}>
                    {product.title}
                  </Typography>
                  <Typography variant="subtitle2" color="primary.main" noWrap>
                    ${product.price}
                  </Typography>
                </Stack>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: "capitalize" }}>
                  {product.category}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1.5 }}>
                  <Chip
                    size="small"
                    icon={<StarRateRoundedIcon />}
                    label={product.rating}
                    variant="outlined"
                  />
                  <Chip
                    size="small"
                    label={product.availabilityStatus || (product.stock > 0 ? "In Stock" : "Out of Stock")}
                    color={product.stock > 0 ? "success" : "default"}
                    variant="outlined"
                  />
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Products;
