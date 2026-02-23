// src/hooks/useDeviceOptions.ts
import { LIMIT_RES } from "@/constants";
import {
  createDevice as createDeviceApi,
  forceUnassign as forceUnassignApi,
  getAdminDevices,
  getDevice,
  getDeviceOptions,
  getMyFeeder,
  getMyFeeders,
  updateMyFeeder as updateMyFeederApi,
  updateDevice as updateDeviceApi,
} from "@/services/apiDevices";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
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

export function useGetMyFeeders() {
  const [searchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1", 10);

  const {
    data: { feeders = [], count, totalPages } = {},
    isFetching,
    error,
  } = useQuery({
    queryKey: ["my-feeders", page],
    queryFn: () =>
      getMyFeeders({
        page,
        limit: LIMIT_RES,
      }),
  });

  return {
    feeders,
    count,
    totalPages,
    isFetching,
    error,
  };
}

export function useGetMyFeeder(id: string, enabled: boolean = false) {
  const {
    data: { feeder } = {},
    isFetching,
    error,
  } = useQuery({
    queryKey: ["my-feeder", id],
    queryFn: () => getMyFeeder(id),
    enabled: enabled && !!id,
  });

  return { feeder, isFetching, error };
}

export function useUpdateMyFeeder() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const {
    mutate: updateMyFeeder,
    isPending,
    error,
  } = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: {
        feederType: "MANUAL" | "SCHEDULED";
        scheduledAmountKg?: number;
        morningTime?: string;
        dayTime?: string;
        nightTime?: string;
      };
    }) => updateMyFeederApi(id, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["my-feeders"] });

      queryClient.invalidateQueries({ queryKey: ["my-feeder", variables.id] });

      toast.success(t("devices.feederUpdatedSuccess"));
    },
    onError: (error: Error) => {
      toast.error(error.message || t("devices.updateFeederFailed"));
    },
  });

  return { updateMyFeeder, isPending, error };
}

export function useGetDevice(id: string, enabled: boolean = false) {
  const {
    data: { device } = {},
    isFetching,
    error,
  } = useQuery({
    queryKey: ["device", id],
    queryFn: () => getDevice(id),
    enabled: enabled && !!id,
  });

  return { device, isFetching, error };
}

export function useUpdateDevice() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const {
    mutate: updateDevice,
    isPending,
    error,
  } = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: {
        thingLabel: string;
        location: string;

        // feeder-specific
        feederType?: "MANUAL" | "SCHEDULED";
        morningTime?: string;
        dayTime?: string;
        nightTime?: string;
      };
    }) => updateDeviceApi(id, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["devices"] });

      queryClient.invalidateQueries({ queryKey: ["device", variables.id] });

      toast.success(t("common.updatedSuccess"));
    },
    onError: (error: Error) => {
      toast.error(error.message || t("common.updatedFailed"));
    },
  });

  return { updateDevice, isPending, error };
}

export function useCreateDevice() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const {
    mutate: createDevice,
    isPending,
    error,
  } = useMutation({
    mutationFn: createDeviceApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["devices"] });

      queryClient.invalidateQueries({ queryKey: ["device-options"] });

      toast.success(t("devices.deviceCreatedSuccess"));
    },
    onError: (error: Error) => {
      toast.error(error.message || t("devices.createDeviceFailed"));
    },
  });

  return { createDevice, isPending, error };
}

export function useUnassignDevice() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const {
    mutate: forceUnassign,
    isPending,
    error,
  } = useMutation({
    mutationFn: forceUnassignApi,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["devices"] });

      queryClient.invalidateQueries({ queryKey: ["device-options"] });

      toast.success(t("devices.unassignDeviceSuccessful"));
    },

    onError: (error: Error) => {
      toast.error(error.message || t("devices.unassignDeviceFailed"));
    },
  });

  return { forceUnassign, isPending, error };
}
