// hooks/useAuth.ts
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
import { User } from "@/types";

// ==============================
// Types
// ==============================

export interface LoginInput {
  username: string;
  password: string;
}

export interface SignupInput {
  name: string;
  username: string;
  password: string;
  passwordConfirm: string;
}

// ==============================
// useLogin Hook
// ==============================
export function useLogin() {
  const queryClient = useQueryClient();

  const {
    mutate: login,
    isPending,
    error,
  } = useMutation<User, Error, LoginInput>({
    mutationFn: ({ username, password }) => loginApi(username, password),
    onSuccess: () => {
      toast.success("Logged in successfully");
      // Invalidate + refetch user session
      queryClient.resetQueries({ queryKey: ["user"] });
    },
    onError: (err) => {
      toast.error(err.message || "Login failed");
    },
    retry: false,
  });

  return { login, isPending, error };
}

// ==============================
// useSession Hook
// ==============================
export function useSession() {
  const {
    data: user,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery<User, Error>({
    queryKey: ["user"],
    queryFn: getCurrentUser,
    staleTime: 5 * 60 * 1000,
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

// ==============================
// useLogout Hook
// ==============================
export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    mutate: logout,
    isPending,
    error,
  } = useMutation<void, Error>({
    mutationFn: logoutApi,
    onSuccess: () => {
      queryClient.clear();
      toast.success("Logged out successfully");
      navigate("/", { replace: true });
    },
    onError: (err) => {
      toast.error(err.message || "Logout failed");
      queryClient.clear();
    },
    retry: false,
  });

  return { logout, isPending, error };
}

// ==============================
// useSignup Hook
// ==============================
export function useSignup() {
  const queryClient = useQueryClient();
  const {
    mutate: signUp,
    isPending,
    error,
  } = useMutation<User, Error, SignupInput>({
    mutationFn: ({ name, username, password, passwordConfirm }) =>
      signUpApi({ name, username, password, passwordConfirm }),
    onSuccess: () => {
      toast.success("Account successfully created! Please log in.");
      queryClient.invalidateQueries({ queryKey: ["users"] });

      queryClient.clear();
    },
    onError: (err) => {
      toast.error(err.message || "Signup failed");
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
