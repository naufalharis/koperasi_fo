import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("access_token");

  // ❌ tidak ada token → tendang ke login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ✅ ada token → lanjut
  return <Outlet />;
};

export default ProtectedRoute;
