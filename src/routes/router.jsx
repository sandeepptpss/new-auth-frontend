// src/routes/Router.jsx
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Nav from "../components/Nav";
import NoPage from "../components/NoPage";
import Home from "../components/Home";
import DashboardHome from "../pages/admin/DashboardHome";
import Users from "../pages/admin/Users";
import Products from "../components/Products";
import AdminProducts from "../pages/admin/Products";
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
import MyCalendar from "../pages/admin/Calendar";
import AdminLayout from "../components/AdminLayout";
import BlogView from "../pages/admin/BlogView";
import BlogEdit from "../pages/admin/blogEdit";
import ChangePassword from "../pages/admin/ChangePassword";

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
            <ProtectedRoute allowedRoles={["admin", "manager"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route
            path="users"
            element={
              <ProtectedRoute allowedRoles={["admin", "manager"]}>
                <Users />
              </ProtectedRoute>
            }
          />
          <Route path="profile" element={<UserProfile />} />
          <Route path="update-password" element={<ChangePassword />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="calendar" element={<MyCalendar />} />
          <Route path="add-blog" element={<AddBlog />} />
          <Route path="manage-blog" element={<BlogView />} />
          <Route path="blogs/edit/:id" element={<BlogEdit />} />
        </Route>
      </Routes>
      <FooterLayout />
    </BrowserRouter>
  );
};

export default Router;
