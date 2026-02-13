// src/components/DevicesList.tsx
import React from "react";
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

import { LIMIT_RES } from "@/constants";
import Pagination from "@/components/Pagination";
import DeviceFilter from "@/components/Filter";
import { useGetAllDevices } from "./deviceHooks";
import CreateFeederDialog from "./CreateFeederForm";
import CreateCameraDialog from "./CreateCameraForm";

interface Device {
  id: string;
  thingLabel: string;
  deviceType: "FEEDER" | "CAMERA";
  horsesAsFeeder?: Array<{ name: string }>;
  horsesAsCamera?: Array<{ name: string }>;
}

const DEVICE_TYPE_OPTIONS = [
  { value: "all", label: "All" },
  { value: "FEEDER", label: "Feeders" },
  { value: "CAMERA", label: "Cameras" },
];

export default function DevicesList() {
  const { devices, count, totalPages, isFetching, error } = useGetAllDevices();

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
          <CardTitle className="text-sm ">Create Devices</CardTitle>
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
          <CardTitle>Devices</CardTitle>

          <div className="flex items-center gap-2">
            <DeviceFilter fieldValue="type" options={DEVICE_TYPE_OPTIONS} />
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[280px]">Device Name</TableHead>
                <TableHead>Device Type</TableHead>
                <TableHead>Horse Attached</TableHead>
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
                  </TableRow>
                ))
              ) : devices.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center text-muted-foreground"
                  >
                    No devices found.
                  </TableCell>
                </TableRow>
              ) : (
                devices.map((device: Device) => {
                  const horseName =
                    device.deviceType === "FEEDER"
                      ? device.horsesAsFeeder?.[0]?.name
                      : device.horsesAsCamera?.[0]?.name;

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
                          {device.deviceType}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {horseName || "-"}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
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
    </>
  );
}
