import React, { useState } from "react";
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
import { getUpdateFeederSchema } from "@/lib/validators";
import { useGetMyFeeder, useUpdateMyFeeder } from "./deviceHooks";

type FormValues = z.infer<ReturnType<typeof getUpdateFeederSchema>>;

interface EditFeederDialogProps {
  feederId: string;
  trigger?: React.ReactNode;
}

export default function EditFeederDialog({
  feederId,
  trigger,
}: EditFeederDialogProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const { feeder, isFetching } = useGetMyFeeder(feederId, open);
  const { updateMyFeeder, isPending } = useUpdateMyFeeder();

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    const payload: any = {
      feederType: values.feederType,
    };

    if (values.feederType === "SCHEDULED") {
      payload.scheduledAmountKg = values.scheduledAmountKg;
      if (values.morningTime) payload.morningTime = values.morningTime;
      if (values.dayTime) payload.dayTime = values.dayTime;
      if (values.nightTime) payload.nightTime = values.nightTime;
    }

    updateMyFeeder(
      { id: feederId, payload },
      {
        onSuccess: () => setOpen(false),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            {t("devices.editFeeder", "Edit Feeder")}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {t("devices.editFeeder", "Edit Feeder Settings")}
          </DialogTitle>
          <DialogDescription>
            {t(
              "devices.updateFeederConfig",
              "Update your feeder configuration and schedule",
            )}
          </DialogDescription>
        </DialogHeader>

        {isFetching || !feeder ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <EditFeederForm
            key={feeder.id}
            feeder={feeder}
            onSubmit={onSubmit}
            isPending={isPending}
            onCancel={() => setOpen(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function EditFeederForm({
  feeder,
  onSubmit,
  isPending,
  onCancel,
}: {
  feeder: any;
  onSubmit: SubmitHandler<FormValues>;
  isPending: boolean;
  onCancel: () => void;
}) {
  const { t } = useTranslation();

  const form = useForm<FormValues>({
    resolver: zodResolver(getUpdateFeederSchema()),
    defaultValues: {
      feederType: feeder.feederType || "MANUAL",
      scheduledAmountKg: feeder.scheduledAmountKg ?? undefined,
      morningTime: feeder.morningTime || "",
      dayTime: feeder.dayTime || "",
      nightTime: feeder.nightTime || "",
    },
  });

  const feederType = form.watch("feederType");

  const feederTypeOptions = [
    { value: "MANUAL", label: t("feederTypes.MANUAL", "Manual") },
    { value: "SCHEDULED", label: t("feederTypes.SCHEDULED", "Scheduled") },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    <SelectValue
                      placeholder={t("common.select", "Select feeder type")}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {feederTypeOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
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

            {["morningTime", "dayTime", "nightTime"].map((timeField) => (
              <FormField
                key={timeField}
                control={form.control}
                name={timeField as any}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t(`feederTypes.${timeField}`, `${timeField} (Optional)`)}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        {...field}
                        value={field.value || ""}
                        step={3600}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
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
            {t("devices.updateFeeder", "Update Feeder")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
