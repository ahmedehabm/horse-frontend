// src/hooks/useGetUsers.ts
import { LIMIT_RES } from "@/constants";
import { getUsers } from "@/services/apiUsers";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

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
