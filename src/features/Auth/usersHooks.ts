// src/hooks/useGetUsers.ts
import { LIMIT_RES } from "@/constants";
import { deleteUser as deleteUserApi, getUsers } from "@/services/apiUsers";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

export function useGetUsers() {
  const [searchParams] = useSearchParams();
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  const {
    data: { users = [], count, totalPages } = {},
    error,
    isFetching,
  } = useQuery({
    queryKey: ["users", page],
    queryFn: () => getUsers({ page, limit: LIMIT_RES }),
    placeholderData: (previousData) => previousData,
  });

  return { users, count, totalPages, isFetching, error };
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const {
    mutate: deleteUser,
    isPending,
    error,
  } = useMutation({
    mutationFn: ({
      id,
      deleteDevices,
    }: {
      id: string;
      deleteDevices: boolean;
    }) => deleteUserApi(id, deleteDevices),

    onSuccess: () => {
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["horses"] });
      queryClient.invalidateQueries({ queryKey: ["devices"] });
      queryClient.invalidateQueries({ queryKey: ["device-options"] });

      toast.success(t("common.deletedSuccess", "User deleted successfully"));
    },

    onError: (error: Error) => {
      toast.error(
        error.message || t("common.deletedFailed", "Failed to delete user"),
      );
    },
  });

  return { deleteUser, isPending, error };
}
