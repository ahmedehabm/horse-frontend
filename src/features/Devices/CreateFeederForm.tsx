import React, { useState } from "react";
import { useForm } from "react-hook-form";
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
import { getCreateFeederSchema } from "@/lib/validators";
import { useCreateDevice } from "./deviceHooks";

type FormValues = z.infer<ReturnType<typeof getCreateFeederSchema>>;

export default function CreateFeederDialog() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { createDevice, isPending } = useCreateDevice();

  const form = useForm<FormValues>({
    resolver: zodResolver(getCreateFeederSchema()),
    defaultValues: {
      thingLabel: "",
      deviceType: "FEEDER",
      location: "",
      feederType: "MANUAL",
      scheduledAmountKg: undefined,
      morningTime: "",
      dayTime: "",
      nightTime: "",
    },
  });

  const feederType = form.watch("feederType");

  function onSubmit(values: FormValues) {
    const payload: any = {
      thingLabel: values.thingLabel,
      deviceType: values.deviceType,
      location: values.location,
      feederType: values.feederType,
    };

    if (values.feederType === "SCHEDULED") {
      payload.scheduledAmountKg = values.scheduledAmountKg;
      if (values.morningTime) payload.morningTime = values.morningTime;
      if (values.dayTime) payload.dayTime = values.dayTime;
      if (values.nightTime) payload.nightTime = values.nightTime;
    }

    createDevice(payload, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{t("devices.createFeeder")}</Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("devices.createFeeder")}</DialogTitle>
          <DialogDescription>
            {t("devices.addCameraDescription")}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Device Name */}
            <FormField
              control={form.control}
              name="thingLabel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("common.deviceName")} ({t("common.uniqueDevice")})
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="FEEDER-STABLE-001" {...field} />
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
                  <FormLabel>{t("common.location")}</FormLabel>
                  <FormControl>
                    <Input placeholder="Stable A, Barn 3" {...field} />
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
                  <FormLabel>
                    {t("feederTypes.manual")}/{t("feederTypes.scheduled")}
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("feederTypes.manual")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="MANUAL">
                        {t("feederTypes.manual")}
                      </SelectItem>
                      <SelectItem value="SCHEDULED">
                        {t("feederTypes.scheduled")}
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
                        {t("feederTypes.scheduledAmount")} *
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          min="0.1"
                          max="50"
                          placeholder="2.5"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value))
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
                        {t("feederTypes.morningTime")} (Optional)
                      </FormLabel>
                      <FormControl>
                        <Input type="time" {...field} step={3600} />
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
                        {t("feederTypes.dayTime")} (Optional)
                      </FormLabel>
                      <FormControl>
                        <Input type="time" {...field} step={3600} />
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
                        {t("feederTypes.nightTime")} (Optional)
                      </FormLabel>
                      <FormControl>
                        <Input type="time" {...field} step={3600} />
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
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                {t("common.cancel")}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t("devices.createFeeder")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
