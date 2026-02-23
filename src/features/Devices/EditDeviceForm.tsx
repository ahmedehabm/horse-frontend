// src/components/Devices/EditDeviceDialog.tsx
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getUpdateDeviceSchema } from "@/lib/validators";
import { useGetDevice, useUpdateDevice } from "./deviceHooks";

type FormValues = z.infer<ReturnType<typeof getUpdateDeviceSchema>>;

interface EditDeviceDialogProps {
  deviceId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: React.ReactNode;
}

export default function EditDeviceDialog({
  deviceId,
  open,
  onOpenChange,
  trigger,
}: EditDeviceDialogProps) {
  const { t } = useTranslation();

  const { device, isFetching } = useGetDevice(deviceId, open);
  const { updateDevice, isPending } = useUpdateDevice();

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    updateDevice(
      { id: deviceId, payload: values },
      {
        onSuccess: () => onOpenChange(false),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {t("common.edit")} {t("common.device")}
          </DialogTitle>
          <DialogDescription>
            {t("devices.updateDeviceConfig", "Update device configuration")}
          </DialogDescription>
        </DialogHeader>

        {isFetching || !device ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : device.deviceType === "FEEDER" ? (
          <EditFeederForm
            key={device.id}
            device={device}
            onSubmit={onSubmit}
            isPending={isPending}
            onCancel={() => onOpenChange(false)}
          />
        ) : (
          <EditCameraForm
            key={device.id}
            device={device}
            onSubmit={onSubmit}
            isPending={isPending}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

// ============= FEEDER FORM =============
function EditFeederForm({
  device,
  onSubmit,
  isPending,
  onCancel,
}: {
  device: any;
  onSubmit: SubmitHandler<FormValues>;
  isPending: boolean;
  onCancel: () => void;
}) {
  const { t } = useTranslation();

  const form = useForm<FormValues>({
    resolver: zodResolver(getUpdateDeviceSchema()),
    defaultValues: {
      thingLabel: device.thingLabel || "",
      location: device.location || "",
      feederType: device.feederType || "MANUAL",
      scheduledAmountKg: device.scheduledAmountKg ?? undefined,
      morningTime: device.morningTime || "",
      dayTime: device.dayTime || "",
      nightTime: device.nightTime || "",
    },
  });

  const feederType = form.watch("feederType");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Thing Label */}
        <FormField
          control={form.control}
          name="thingLabel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("common.deviceName", "Device Name")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Location */}
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("common.location", "Location")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Feeder Type */}
        <FormField
          control={form.control}
          name="feederType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("devices.feederType", "Feeder Type")}</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="MANUAL">
                    {t("feederTypes.manual", "Manual")}
                  </SelectItem>
                  <SelectItem value="SCHEDULED">
                    {t("feederTypes.scheduled", "Scheduled")}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Scheduled Fields */}
        {feederType === "SCHEDULED" && (
          <>
            <FormField
              control={form.control}
              name="scheduledAmountKg"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t(
                      "feederTypes.scheduledAmount",
                      "Scheduled Amount (kg) *",
                    )}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      min="0.1"
                      max="50"
                      placeholder="2.5"
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value
                            ? parseFloat(e.target.value)
                            : undefined,
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="morningTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("feederTypes.morningTime", "Morning Time (Optional)")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="time"
                      {...field}
                      value={field.value || ""}
                      step="3600"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dayTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("feederTypes.dayTime", "Day Time (Optional)")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="time"
                      {...field}
                      value={field.value || ""}
                      step="3600"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nightTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("feederTypes.nightTime", "Night Time (Optional)")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="time"
                      {...field}
                      value={field.value || ""}
                      step="3600"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isPending}
          >
            {t("common.cancel", "Cancel")}
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("common.edit", "Update Device")}
          </Button>
        </div>
      </form>
    </Form>
  );
}

// ============= CAMERA FORM =============
function EditCameraForm({
  device,
  onSubmit,
  isPending,
  onCancel,
}: {
  device: any;
  onSubmit: SubmitHandler<FormValues>;
  isPending: boolean;
  onCancel: () => void;
}) {
  const { t } = useTranslation();

  const form = useForm<FormValues>({
    resolver: zodResolver(getUpdateDeviceSchema()),
    defaultValues: {
      thingLabel: device.thingLabel || "",
      location: device.location || "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Thing Label */}
        <FormField
          control={form.control}
          name="thingLabel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("common.deviceName", "Device Name")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Location */}
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("common.location", "Location")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isPending}
          >
            {t("common.cancel", "Cancel")}
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("common.edit", "Update Device")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
