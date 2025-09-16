// src/routes/Router.jsx
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Nav from "../components/Nav";
import NoPage from "../components/NoPage";
import Home from "../components/Home";
import DashboardHome from "../pages/admin/DashboardHome";
import Users from "../pages/admin/Users";
import Products from "../components/Products";
import AddBlog from "../pages/admin/AddBlog";
import SignUp from "../components/SignUp";
import Login from "../components/Login";
import ResetPassword from "../components/ResetPasswordPage";
import ForgotPasswordPage from "../components/ForgotPassword";
import Footer from "../components/Footer";
import ProtectedRoute from "../components/ProtectedRoute";
import Blog from "../components/blog";
import AboutUs from "../components/About";
import BlogDetails from "../components/blogDetails";
import UserProfile from "../pages/admin/UserProfile";
import MyCalendar from "../components/Calendar";
import AdminLayout from "../components/AdminLayout";

const NavLayout = () => {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith("/admin/dashboard");
  return !isDashboardRoute && <Nav />;
};

const FooterLayout = () => {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith("/admin/dashboard");
  return !isDashboardRoute && <Footer />;
};

const Router = () => {
  return (
    <BrowserRouter>
      <NavLayout />
      <Routes>
        {/* Public & Protected */}
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
       
        <Route path="/calendar" element={<MyCalendar />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/about" element={<ProtectedRoute><AboutUs /></ProtectedRoute>} />
        <Route path="/blog" element={<ProtectedRoute><Blog /></ProtectedRoute>} />
        <Route path="/blog-details/:id" element={<ProtectedRoute><BlogDetails /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/products" element={<Products />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<NoPage />} />

        {/* ✅ Admin Nested Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="users" element={<Users />} />
           <Route path="profile" element={<UserProfile />} />
          <Route path="products" element={<Products />} />
          <Route path="blog" element={<AddBlog />} />
        </Route>
      </Routes>
      <FooterLayout />
    </BrowserRouter>
  );
};

export default Router;
