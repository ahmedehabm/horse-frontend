// features/Horses/DeleteDialogHorse.tsx
import { useState } from "react";
import { useTranslation } from "react-i18next";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import { useDeleteHorse } from "./horseHooks";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  horseId: string;
  horseName: string;
};

export default function DeleteDialogHorse({
  open,
  onOpenChange,
  horseId,
  horseName,
}: Props) {
  const { t } = useTranslation();
  const { deleteHorse, isPending } = useDeleteHorse();

  const [deleteDevices, setDeleteDevices] = useState(false);

  const handleConfirm = () => {
    deleteHorse(
      { id: horseId, deleteDevices },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={(isOpen) => {
        if (isPending) return;
        onOpenChange(isOpen);
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t("horses.deleteTitle", "Delete horse?")}
          </AlertDialogTitle>

          <AlertDialogDescription>
            {t("common.deleteDescription")}{" "}
            <span className="font-medium">{horseName}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="rounded-md border p-3 space-y-2">
          <div className="flex items-start gap-3">
            <Checkbox
              id="delete-devices"
              checked={deleteDevices}
              onCheckedChange={(val) => setDeleteDevices(val === true)}
              disabled={isPending}
            />
            <div className="grid gap-1 leading-none">
              <Label htmlFor="delete-devices" className="cursor-pointer">
                {t(
                  "horses.deleteAlsoDevices",
                  "Also delete connected devices (feeder/camera)",
                )}
              </Label>
              <p className="text-sm text-muted-foreground">
                {t(
                  "horses.deleteDevicesHint",
                  "If checked, the horse and any assigned feeder/camera will be deleted.",
                )}
              </p>
            </div>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            {t("common.cancel", "Cancel")}
          </AlertDialogCancel>

          <Button
            onClick={handleConfirm}
            disabled={isPending}
            variant="destructive"
            className="cursor-pointer hover:bg-destructive/70 transition-colors text-white"
          >
            {isPending
              ? t("common.processing", "Processing...")
              : t("common.delete", "Delete")}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
