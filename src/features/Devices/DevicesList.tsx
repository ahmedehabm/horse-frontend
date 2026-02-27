// features/Devices/DevicesList.tsx
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MoreVertical } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { LIMIT_RES } from "@/constants";
import Pagination from "@/components/Pagination";
import DeviceFilter from "@/components/Filter";
import { useGetAllDevices } from "./deviceHooks";
import CreateFeederDialog from "./CreateFeederForm";
import CreateCameraDialog from "./CreateCameraForm";
import ForceUnassignDialog from "./ForceUnassignDialog";
import EditDeviceDialog from "./EditDeviceForm";
import DeleteDeviceDialogDevice from "./DeleteDialogDevice";

interface Device {
  id: string;
  thingLabel: string;
  deviceType: "FEEDER" | "CAMERA";
  horsesAsFeeder?: Array<{ name: string }>;
  horsesAsCamera?: Array<{ name: string }>;
}

export default function DevicesList() {
  const { t } = useTranslation();
  const { devices, count, totalPages, isFetching, error } = useGetAllDevices();

  // State for the unassign dialog
  const [unassignTarget, setUnassignTarget] = useState<{
    deviceId: string;
    deviceLabel: string;
    deviceType: "FEEDER" | "CAMERA";
    horseName: string;
  } | null>(null);

  // State for the edit dialog
  const [editDeviceId, setEditDeviceId] = useState<string | null>(null);

  // State for the delete dialog
  const [deleteTarget, setDeleteTarget] = useState<{
    deviceId: string;
    deviceLabel: string;
  } | null>(null);

  const DEVICE_TYPE_OPTIONS = [
    { value: "all", label: t("common.all", "All") },
    { value: "FEEDER", label: t("devices.feeder", "Feeder") },
    { value: "CAMERA", label: t("devices.camera", "Camera") },
  ];

  const deviceTypeLabelMap: Record<string, string> = {
    FEEDER: t("devices.feeder", "Feeder"),
    CAMERA: t("devices.camera", "Camera"),
  };

  if (error) {
    return (
      <div className="text-sm text-destructive">{(error as Error).message}</div>
    );
  }

  const isInitialLoading = isFetching && devices.length === 0;

  return (
    <>
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">{t("devices.title")}</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex gap-2">
            <CreateFeederDialog />
            <CreateCameraDialog />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>{t("devices.title")}</CardTitle>

          <div className="flex items-center gap-2">
            <DeviceFilter fieldValue="type" options={DEVICE_TYPE_OPTIONS} />
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[280px]">
                  {t("common.deviceName")}
                </TableHead>
                <TableHead>{t("common.deviceType")}</TableHead>
                <TableHead>{t("common.horseAttached")}</TableHead>
                <TableHead className="w-[100px] text-right">
                  {t("common.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isInitialLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-4 w-[200px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[100px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[150px]" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="ml-auto h-9 w-9 rounded-md" />
                    </TableCell>
                  </TableRow>
                ))
              ) : devices.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-muted-foreground"
                  >
                    {t("devices.noDevicesFound", "No devices found.")}
                  </TableCell>
                </TableRow>
              ) : (
                devices.map((device: Device) => {
                  const horseName =
                    device.deviceType === "FEEDER"
                      ? device.horsesAsFeeder?.[0]?.name
                      : device.horsesAsCamera?.[0]?.name;

                  const isAssigned = !!horseName;

                  return (
                    <TableRow key={device.id}>
                      <TableCell className="font-medium">
                        {device.thingLabel}
                      </TableCell>

                      <TableCell>
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                            device.deviceType === "FEEDER"
                              ? "bg-slate-300 text-slate-700 ring-1 ring-slate-200"
                              : "bg-zinc-300 text-zinc-900 ring-1 ring-zinc-200"
                          }`}
                        >
                          {deviceTypeLabelMap[device.deviceType] ||
                            device.deviceType}
                        </span>
                      </TableCell>

                      <TableCell className="text-muted-foreground">
                        {horseName || "-"}
                      </TableCell>

                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              aria-label={t("common.actions")}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuItem
                              onClick={() => setEditDeviceId(device.id)}
                              className="cursor-pointer"
                            >
                              {t("common.edit", "Edit")}
                            </DropdownMenuItem>

                            {/* Only show Force Unassign for assigned devices */}
                            {isAssigned && (
                              <DropdownMenuItem
                                onClick={() =>
                                  setUnassignTarget({
                                    deviceId: device.id,
                                    deviceLabel: device.thingLabel,
                                    deviceType: device.deviceType,
                                    horseName: horseName!,
                                  })
                                }
                                className="cursor-pointer text-destructive focus:text-destructive"
                              >
                                {t("devices.forceUnassign", "Force Unassign")}
                              </DropdownMenuItem>
                            )}

                            {/* Delete */}
                            <DropdownMenuItem
                              onClick={() =>
                                setDeleteTarget({
                                  deviceId: device.id,
                                  deviceLabel: device.thingLabel,
                                })
                              }
                              className="cursor-pointer text-destructive focus:text-destructive"
                            >
                              {t("common.delete", "Delete")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          <div className="pt-4">
            <Pagination
              label="devices"
              count={count}
              totalPages={totalPages}
              limit={LIMIT_RES}
            />
          </div>
        </CardContent>
      </Card>

      {/* Edit Device Dialog */}
      {editDeviceId && (
        <EditDeviceDialog
          deviceId={editDeviceId}
          open={!!editDeviceId}
          onOpenChange={(open) => {
            if (!open) setEditDeviceId(null);
          }}
        />
      )}

      {/* Force Unassign Confirmation Dialog */}
      {unassignTarget && (
        <ForceUnassignDialog
          open={!!unassignTarget}
          onOpenChange={(open) => {
            if (!open) setUnassignTarget(null);
          }}
          deviceId={unassignTarget.deviceId}
          deviceLabel={unassignTarget.deviceLabel}
          deviceType={unassignTarget.deviceType}
          horseName={unassignTarget.horseName}
        />
      )}

      {/* Delete Device Dialog */}
      {deleteTarget && (
        <DeleteDeviceDialogDevice
          open={!!deleteTarget}
          onOpenChange={(open) => {
            if (!open) setDeleteTarget(null);
          }}
          deviceId={deleteTarget.deviceId}
          deviceLabel={deleteTarget.deviceLabel}
        />
      )}
    </>
  );
}
