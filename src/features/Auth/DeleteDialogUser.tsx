// src/features/Users/DeleteUserDialog.tsx

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AlertTriangle } from "lucide-react";

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
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useDeleteUser } from "./usersHooks";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  userName: string;
  horseCount?: number;
};

export default function DeleteUserDialog({
  open,
  onOpenChange,
  userId,
  userName,
  horseCount = 0,
}: Props) {
  const { t } = useTranslation();
  const { deleteUser, isPending } = useDeleteUser();

  const [deleteDevices, setDeleteDevices] = useState(false);

  const handleConfirm = () => {
    deleteUser(
      { id: userId, deleteDevices },
      {
        onSuccess: () => {
          onOpenChange(false);
          setDeleteDevices(false);
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
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            {t("users.deleteTitle", "Delete user?")}
          </AlertDialogTitle>

          <AlertDialogDescription className="space-y-2">
            <p>
              {t("users.deleteWarning", "You are about to delete user:")}{" "}
              <span className="font-semibold text-foreground">{userName}</span>
            </p>

            {horseCount > 0 && (
              <p className="text-destructive">
                {t(
                  "users.horsesWillBeDeleted",
                  "This will also delete {{count}} horse(s) owned by this user.",
                  { count: horseCount },
                )}
              </p>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Warning Alert */}
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {t(
              "users.deleteIrreversible",
              "This action cannot be undone. The user and all their horses will be permanently deleted.",
            )}
          </AlertDescription>
        </Alert>

        {/* Device Deletion Option */}
        <div className="rounded-md border border-destructive/50 bg-destructive/5 p-3 space-y-2">
          <div className="flex items-start gap-3">
            <Checkbox
              id="delete-devices"
              checked={deleteDevices}
              onCheckedChange={(val) => setDeleteDevices(val === true)}
              disabled={isPending}
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor="delete-devices"
                className="cursor-pointer font-medium"
              >
                {t(
                  "users.deleteAlsoDevices",
                  "Also delete all connected devices",
                )}
              </Label>
              <p className="text-xs text-muted-foreground">
                {t(
                  "users.deleteDevicesHint",
                  "If checked, all feeders and cameras assigned to this user's horses will also be permanently deleted.",
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
            className="cursor-pointer hover:bg-destructive/90 transition-colors text-white"
          >
            {isPending
              ? t("common.processing", "Deleting...")
              : t("common.delete", "Delete User")}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
