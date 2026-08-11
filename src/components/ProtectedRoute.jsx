import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const auth = localStorage.getItem("user");
  if (!auth) {
    return <Navigate to="/login" />;
  }

  const user = JSON.parse(auth);
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
  
}

export default ProtectedRoute;
