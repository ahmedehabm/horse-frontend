// features/Devices/ForceUnassignDialog.tsx
import { useTranslation } from "react-i18next";
import { AlertTriangle, Loader2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useUnassignDevice } from "./deviceHooks";

interface ForceUnassignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deviceId: string;
  deviceLabel: string;
  deviceType: "FEEDER" | "CAMERA";
  horseName: string;
}

export default function ForceUnassignDialog({
  open,
  onOpenChange,
  deviceId,
  deviceLabel,
  deviceType,
  horseName,
}: ForceUnassignDialogProps) {
  const { t } = useTranslation();
  const { forceUnassign, isPending } = useUnassignDevice();

  const handleConfirm = () => {
    forceUnassign(deviceId, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  const isFeeder = deviceType === "FEEDER";

  return (
    <AlertDialog
      open={open}
      onOpenChange={(isOpen) => {
        if (isPending) return;
        onOpenChange(isOpen);
      }}
    >
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>

          <AlertDialogTitle className="text-center">
            {t("devices.forceUnassignTitle", "Force Unassign Device")}
          </AlertDialogTitle>

          <AlertDialogDescription className="text-center">
            {t(
              "devices.forceUnassignDescription",
              "You are about to unassign this device from its horse. This action cannot be undone automatically.",
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Device & Horse Info */}
        <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {t("common.device", "Device")}:
            </span>
            <span className="font-medium">{deviceLabel}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {t("common.type", "Type")}:
            </span>
            <span
              className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                isFeeder
                  ? "bg-slate-300 text-slate-700"
                  : "bg-zinc-300 text-zinc-900"
              }`}
            >
              {isFeeder
                ? t("devices.feeder", "Feeder")
                : t("devices.camera", "Camera")}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {t("common.horse", "Horse")}:
            </span>
            <span className="font-medium">{horseName}</span>
          </div>
        </div>

        {/* Consequences Warning */}
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 space-y-2">
          <p className="text-sm font-semibold text-destructive">
            {t("devices.consequences", "Consequences:")}
          </p>
          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
            {isFeeder ? (
              <>
                <li>{t("devices.consequenceFeeder1", { horseName })}</li>
                <li>{t("devices.consequenceFeeder2")}</li>
                <li>{t("devices.consequenceFeeder3")}</li>
              </>
            ) : (
              <>
                <li>{t("devices.consequenceCamera1", { horseName })}</li>
                <li>{t("devices.consequenceCamera2")}</li>
                <li>{t("devices.consequenceCamera3")}</li>
              </>
            )}
            <li>{t("devices.consequenceReassign")}</li>
          </ul>
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
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending
              ? t("common.processing", "Processing...")
              : t("devices.confirmUnassign", "Yes, Unassign Device")}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
