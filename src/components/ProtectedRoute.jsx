// src/ui/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useSession } from "../features/Auth/authHooks";
import Spinner from "./Spinner";

export default function ProtectedRoute({ children, role = "USER" }) {
  const { user, isLoading } = useSession();
  const location = useLocation();

  // Loading state
  if (isLoading) return <Spinner />;

  // Not authenticated - redirect to login
  if (!user) {
    const callback = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/?callback=${callback}`} replace />;
  }

  // Check role authorization
  if (role === "ADMIN" && user.role !== "ADMIN") {
    return <Navigate to="/unauthorized" replace />;
  }

  if (role === "USER" && user.role !== "USER") {
    return <Navigate to="/unauthorized" replace />;
  }

  // Authorized
  return children;
}
