// hooks/useAuth.js - Improved Version
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCurrentUser,
  login as loginApi,
  logout as logoutApi,
  signup as signUpApi,
  updatePassword as updatePasswordApi,
} from "../../services/apiAuth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function useLogin() {
  const queryClient = useQueryClient();

  const {
    mutate: login,
    isPending,
    error,
  } = useMutation({
    mutationFn: ({ email, password }) => loginApi(email, password), // Fixed API signature
    onSuccess: () => {
      toast.success("Logged in successfully");
      // Invalidate + refetch user session
      queryClient.resetQueries({ queryKey: ["user"] });
    },
    onError: (err) => {
      toast.error(err.message || "Login failed");
    },
    retry: false, // Don't retry auth failures
  });

  return { isPending, login, error };
}

export function useSession() {
  const {
    data: user,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    gcTime: 10 * 60 * 1000, // 10 minutes garbage collection
    retry: 1,
    retryDelay: 1000,
  });

  return {
    user: user ?? null,
    isLoading: isLoading || isFetching,
    isError,
    error,
    refetch,
    isLoggedIn: !!user,
    isAdmin: user?.role === "ADMIN",
  };
}

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    mutate: logout,
    isPending,
    error,
  } = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      // Clear ALL queries + cache
      queryClient.clear();
      queryClient.removeQueries();
      toast.success("Logged out successfully");
      navigate("/", { replace: true });
    },
    onError: (err) => {
      toast.error(err.message || "Logout failed");
      // Force clear cache even on error
      queryClient.clear();
    },
    retry: false,
  });

  return { logout, isPending, error };
}

export function useSignup() {
  const queryClient = useQueryClient();
  //   const navigate = useNavigate();

  const {
    mutate: signUp,
    isPending,
    error,
  } = useMutation({
    mutationFn: ({ name, email, password, passwordConfirm }) =>
      signUpApi({ name, email, password, passwordConfirm }),
    onSuccess: () => {
      toast.success("Account successfully created! Please log in.");
      // Clear cache for fresh login
      queryClient.clear();

      //   navigate("/login", { replace: true }); // Go to login, not home
    },
    onError: (error) => {
      toast.error(error.message || "Signup failed");
    },
    retry: false,
  });

  return { signUp, isPending, error };
}

// export function useUpdatePassword() {
//   const queryClient = useQueryClient();

//   const { mutate: updatePassword, isPending, error } = useMutation({
//     mutationFn: ({ currentPassword, newPassword, passwordConfirm }) =>
//       updatePasswordApi({ currentPassword, newPassword, passwordConfirm }),
//     onSuccess: () => {
//       toast.success("Password updated successfully");
//       // Refresh user session
//       queryClient.resetQueries({ queryKey: ["user"] });
//     },
//     onError: (err) => {
//       toast.error(err.message || "Password update failed");
//     },
//     retry: false,
//   });

//   return { updatePassword, isPending, error };
// }
