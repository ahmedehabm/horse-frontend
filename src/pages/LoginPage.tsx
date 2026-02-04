import { Navigate, useLocation } from "react-router-dom";
import { useSession } from "../features/Auth/authHooks";
import LoginForm from "../features/Auth/LoginForm";

function Login() {
  const { user, isLoading } = useSession();

  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);

  const callback = searchParams.get("callback");

  // If already logged in, redirect to callback or home

  if (!isLoading && user) {
    const destination = callback
      ? decodeURIComponent(callback)
      : user.role === "ADMIN"
        ? "/admin/horses"
        : "/user/dashboard";
    return <Navigate to={destination} replace />;
  }

  return <LoginForm />;
}

export default Login;
