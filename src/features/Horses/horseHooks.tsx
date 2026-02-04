import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { getActiveFeedingStatus, getMyHorses } from "../../services/apiHorse";
import { LIMIT_RES } from "@/constants";
import { FeedingStatusPayload } from "@/types";

export function useGetHorsesUser() {
  const [searchParams] = useSearchParams();

  // Pagination
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  // Query with optimized settings
  const {
    data: { horses = [], count, totalPages } = {},
    error,
    isFetching,
  } = useQuery({
    queryKey: ["horses-user", page],
    queryFn: () => getMyHorses({ page, limit: LIMIT_RES }),
    placeholderData: (previousData) => previousData,
  });

  return { horses, count, totalPages, isFetching, error };
}
