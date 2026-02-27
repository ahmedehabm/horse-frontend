import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTranslation } from "react-i18next";
import { useDeleteDevice } from "./deviceHooks";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deviceId: string;
  deviceLabel: string;
};

export default function DeleteDeviceDialogDevice({
  open,
  onOpenChange,
  deviceId,
  deviceLabel,
}: Props) {
  const { t } = useTranslation();
  const { deleteDevice, isPending } = useDeleteDevice();

  const handleConfirm = () => {
    deleteDevice(deviceId, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
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
            {t("devices.deleteTitle", "Delete device?")}
          </AlertDialogTitle>

          <AlertDialogDescription>
            {t(
              "common.deleteDescription",
              "This action cannot be undone. This is a permanent deletion",
            )}{" "}
            <span className="font-medium">{deviceLabel}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>

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
