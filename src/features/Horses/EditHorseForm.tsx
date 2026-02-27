// src/features/Horses/EditHorseDialog.tsx
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";
import z from "zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { Alert, AlertDescription } from "@/components/ui/alert";

import { getUpdateHorseSchema } from "@/lib/validators";
import { useGetHorse, useUpdateHorse } from "./horseHooks";
import {
  useUnassignedCameraOptions,
  useUnassignedFeederOptions,
} from "../Devices/deviceHooks";

type UpdateHorseFormData = z.infer<ReturnType<typeof getUpdateHorseSchema>>;

interface EditHorseDialogProps {
  horseId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditHorseDialog({
  horseId,
  open,
  onOpenChange,
}: EditHorseDialogProps) {
  const { t } = useTranslation();

  const { horse, isFetching } = useGetHorse(horseId, open);
  const { updateHorse, isPending } = useUpdateHorse();

  const onSubmit: SubmitHandler<UpdateHorseFormData> = (values) => {
    updateHorse(
      { id: horseId, payload: values as any },
      {
        onSuccess: () => onOpenChange(false),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("horses.editHorse", "Edit Horse")}</DialogTitle>
          <DialogDescription>
            {t("horses.updateHorseDetails", "Update horse information")}
          </DialogDescription>
        </DialogHeader>

        {isFetching || !horse ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <EditHorseForm
            key={horse.id}
            horse={horse}
            onSubmit={onSubmit}
            isPending={isPending}
            onCancel={() => onOpenChange(false)}
            dialogOpen={open}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function EditHorseForm({
  horse,
  onSubmit,
  isPending,
  onCancel,
  dialogOpen,
}: {
  horse: any;
  onSubmit: SubmitHandler<UpdateHorseFormData>;
  isPending: boolean;
  onCancel: () => void;
  dialogOpen: boolean;
}) {
  const { t } = useTranslation();

  const { options: feederOptions, isFetching: isFetchingFeeders } =
    useUnassignedFeederOptions({ enabled: dialogOpen });
  const { options: cameraOptions, isFetching: isFetchingCameras } =
    useUnassignedCameraOptions({ enabled: dialogOpen });

  const form = useForm<UpdateHorseFormData>({
    resolver: zodResolver(getUpdateHorseSchema()),
    defaultValues: {
      name: horse.name || "",
      breed: horse.breed || "",
      age: horse.age ?? undefined,
      location: horse.location || "",
      feederId: horse.feederId || undefined,
      cameraId: horse.cameraId || undefined,
      image: undefined,
    },
  });

  // Check if horse has assigned devices
  const hasAssignedFeeder = horse?.feeder?.thingLabel;
  const hasAssignedCamera = horse?.camera?.thingLabel;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("horses.name", "Name")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("horses.namePlaceholder", "Thunder")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Breed */}
        <FormField
          control={form.control}
          name="breed"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("horses.breed", "Breed")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("horses.breedPlaceholder", "Arabian")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Age */}
        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("horses.age", "Age")}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  value={field.value ?? ""}
                  onChange={(e) => {
                    const v = e.target.value;
                    field.onChange(v === "" ? undefined : Number(v));
                  }}
                />
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
              <FormLabel>{t("horses.location", "Location")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t(
                    "horses.locationPlaceholder",
                    "Stable A, Barn 3",
                  )}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Warning Alert for Assigned Feeder */}
        {hasAssignedFeeder && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {t(
                "horses.feederAlreadyAssigned",
                "This horse is already assigned to feeder: {{feederName}}. It's recommended to force unassign this device before reassigning.",
                { feederName: hasAssignedFeeder },
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Feeder */}
        <FormField
          control={form.control}
          name="feederId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("horses.feeder", "Feeder (Optional)")}</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={isFetchingFeeders}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        hasAssignedFeeder
                          ? hasAssignedFeeder
                          : t("horses.selectFeeder", "Select a feeder")
                      }
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {/* Show current feeder as first option if assigned */}
                  {hasAssignedFeeder && (
                    <SelectItem value={horse.feederId!}>
                      {hasAssignedFeeder} {t("common.current", "(Current)")}
                    </SelectItem>
                  )}

                  {feederOptions.length === 0 ? (
                    <div className="px-2 py-1.5 text-sm text-muted-foreground">
                      {t(
                        "horses.noUnassignedFeeders",
                        "No unassigned feeders available",
                      )}
                    </div>
                  ) : (
                    feederOptions.map((option: any) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.thingLabel}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Warning Alert for Assigned Camera */}
        {hasAssignedCamera && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {t(
                "horses.cameraAlreadyAssigned",
                "This horse is already assigned to camera: {{cameraName}}. It's recommended to force unassign this device before reassigning.",
                { cameraName: hasAssignedCamera },
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Camera */}
        <FormField
          control={form.control}
          name="cameraId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("horses.camera", "Camera (Optional)")}</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={isFetchingCameras}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        hasAssignedCamera
                          ? hasAssignedCamera
                          : t("horses.selectCamera", "Select a camera")
                      }
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {/* Show current camera as first option if assigned */}
                  {hasAssignedCamera && (
                    <SelectItem value={horse.cameraId!}>
                      {hasAssignedCamera} {t("common.current", "(Current)")}
                    </SelectItem>
                  )}

                  {cameraOptions.length === 0 ? (
                    <div className="px-2 py-1.5 text-sm text-muted-foreground">
                      {t(
                        "horses.noUnassignedCameras",
                        "No unassigned cameras available",
                      )}
                    </div>
                  ) : (
                    cameraOptions.map((option: any) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.thingLabel}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Image */}
        <FormField
          control={form.control}
          name="image"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>{t("horses.image", "Image (Optional)")}</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    onChange(file);
                  }}
                  {...field}
                />
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
            {t("common.edit", "Edit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
