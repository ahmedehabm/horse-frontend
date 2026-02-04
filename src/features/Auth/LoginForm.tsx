import { useState } from "react";
import { useLogin } from "./authHooks";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

export default function LoginForm() {
  const [email, setEmail] = useState("john@example.com");

  const [password, setPassword] = useState("password123");

  const [showPassword, setShowPassword] = useState(false);

  const { login, isPending, error } = useLogin();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email || !password) return;
    login({ email, password });
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-green-50 to-white">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center">
            <svg
              className="h-12 w-12 text-green-700"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 5V19H5V5H19Z" />
              <path d="M5 12H19" />
              <path d="M12 5V19" />
              <circle cx="17" cy="7" r="1" fill="currentColor" />
              <circle cx="7" cy="17" r="1" fill="currentColor" />
            </svg>
            <span className="ml-2 text-3xl font-bold text-green-800">
              Ostler
            </span>
          </div>
        </div>

        {/* Login Form */}
        <div>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Welcome Back
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error.message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 text-sm font-medium mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="your@email.com"
                disabled={isPending}
              />
            </div>

            {/* Password Field */}
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-gray-700 text-sm font-medium mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="••••••••"
                  disabled={isPending}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-500 hover:text-green-600 focus:outline-none transition-colors"
                  disabled={isPending}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="btn-primary w-full py-3 px-4 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" />
                  Signing In...
                </>
              ) : (
                "Log In"
              )}
            </button>
          </form>

          {/* Link to Signup */}
          <p className="text-center mt-6 text-gray-600 text-sm">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-green-600 font-medium hover:underline hover:text-green-700 transition-colors"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
