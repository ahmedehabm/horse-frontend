// src/hooks/useDeviceOptions.ts
import { LIMIT_RES } from "@/constants";
import {
  createDevice as createDeviceApi,
  getAdminDevices,
  getDeviceOptions,
} from "@/services/apiDevices";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";

type UseOptionsParams = {
  enabled?: boolean; // useful to only fetch when dialog is open
};

export function useUnassignedFeederOptions(params: UseOptionsParams = {}) {
  const { enabled = true } = params;

  const {
    data: { options = [] } = {},
    isFetching,
    error,
  } = useQuery({
    queryKey: ["device-options", "FEEDER", "unassigned"],
    queryFn: () => getDeviceOptions({ type: "FEEDER", unassigned: true }),
    enabled,
    staleTime: 60_000,
  });

  return { options, isFetching, error };
}

export function useUnassignedCameraOptions(params: UseOptionsParams = {}) {
  const { enabled = true } = params;

  const {
    data: { options = [] } = {},
    isFetching,
    error,
  } = useQuery({
    queryKey: ["device-options", "CAMERA", "unassigned"],
    queryFn: () => getDeviceOptions({ type: "CAMERA", unassigned: true }),
    enabled,
    staleTime: 60_000,
  });

  return { options, isFetching, error };
}

export function useGetAllDevices() {
  const [searchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1", 10);
  const type = searchParams.get("type") || "all";

  const {
    data: { devices = [], count, totalPages } = {},
    isFetching,
    error,
  } = useQuery({
    queryKey: ["devices", page, type],
    queryFn: () =>
      getAdminDevices({
        page,
        limit: LIMIT_RES,
        type: type === "all" ? "" : type,
      }),
  });

  return {
    devices,
    count,
    totalPages,
    isFetching,
    error,
  };
}

export function useCreateDevice() {
  const queryClient = useQueryClient();

  const {
    mutate: createDevice,
    isPending,
    error,
  } = useMutation({
    mutationFn: createDeviceApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["devices"] });

      queryClient.invalidateQueries({ queryKey: ["device-options"] });

      toast.success("Device created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create device");
    },
  });

  return {
    createDevice,
    isPending,
    error,
  };
}
