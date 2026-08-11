// src/components/Products.jsx
import React, { useState, useEffect } from "react";
import { Button, Card, Spin, Tag, Input } from "antd";
import { ShoppingCartOutlined, StarFilled, SearchOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const showProduct = async () => {
    setLoading(true);
    try {
      const productApi = await fetch("https://dummyjson.com/products?limit=48");
      const fetchData = await productApi.json();
      setProducts(fetchData.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    showProduct();
  }, []);

  const filtered = products.filter((p) =>
    [p.title, p.category, p.brand].some((v) =>
      String(v || "").toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1">
              Store Products
            </h1>
            <p className="text-slate-500 text-sm">
              Discover quality products powered by dummyjson API.
            </p>
          </div>

          <Input
            placeholder="Search products..."
            prefix={<SearchOutlined className="text-slate-400" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
            size="large"
            className="sm:w-72 rounded-xl border-slate-200"
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <Spin size="large" tip="Loading catalogue..." />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((item) => (
              <Card
                key={item.id}
                hoverable
                cover={
                  <div className="relative overflow-hidden group">
                    <img
                      className="h-52 w-full object-cover bg-slate-100 group-hover:scale-105 transition-transform duration-300"
                      src={item.thumbnail || item.images?.[0]}
                      alt={item.title}
                    />
                    <Tag
                      color={item.stock > 0 ? "green" : "red"}
                      className="absolute top-3 right-3 font-semibold rounded-md shadow-xs mr-0"
                    >
                      {item.availabilityStatus || (item.stock > 0 ? "In Stock" : "Out of Stock")}
                    </Tag>
                  </div>
                }
                className="shadow-sm border border-slate-200/80 rounded-2xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <h3 className="font-bold text-slate-800 text-sm line-clamp-1 mb-0" title={item.title}>
                      {item.title}
                    </h3>
                    <span className="font-extrabold text-indigo-600 text-base">
                      ${item.price}
                    </span>
                  </div>

                  <p className="text-slate-400 text-xs capitalize mb-3">{item.category}</p>

                  <div className="flex items-center gap-1 mb-4">
                    <StarFilled className="text-amber-400 text-xs" />
                    <span className="text-xs font-semibold text-slate-700">{item.rating}</span>
                  </div>
                </div>

                <Button
                  type="primary"
                  block
                  icon={<ShoppingCartOutlined />}
                  onClick={() => toast.success(`Added "${item.title}" to cart!`)}
                  className="rounded-xl font-semibold shadow-sm mt-2"
                >
                  Add to Cart
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
