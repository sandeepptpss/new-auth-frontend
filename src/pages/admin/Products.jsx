// src/pages/admin/Products.jsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Button, Card, Tag } from "antd";
import { ReloadOutlined, StarFilled } from "@ant-design/icons";
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
    <div>
      <PageHeader
        title="Products Catalogue"
        subtitle={
          loading ? "Loading products..." : `${filtered.length} of ${products.length} products available`
        }
        actions={
          <Button icon={<ReloadOutlined />} onClick={load} loading={loading}>
            Refresh
          </Button>
        }
      />

      {state || (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <Card
              key={product.id}
              hoverable
              cover={
                <img
                  alt={product.title}
                  src={product.thumbnail}
                  className="h-48 object-cover bg-slate-50"
                />
              }
              className="shadow-sm border border-slate-100 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start gap-2 mb-1">
                  <h3 className="font-bold text-slate-800 text-sm line-clamp-1 mb-0" title={product.title}>
                    {product.title}
                  </h3>
                  <span className="font-extrabold text-indigo-600 text-base">
                    ${product.price}
                  </span>
                </div>

                <p className="text-slate-400 text-xs capitalize mb-3">{product.category}</p>

                <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-3 mt-2">
                  <div className="flex items-center gap-1">
                    <StarFilled className="text-amber-400 text-sm" />
                    <span className="text-xs font-semibold text-slate-700">{product.rating}</span>
                  </div>

                  <Tag
                    color={product.stock > 0 ? "green" : "red"}
                    className="mr-0 font-medium rounded-md text-xs"
                  >
                    {product.availabilityStatus || (product.stock > 0 ? "In Stock" : "Out of Stock")}
                  </Tag>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
