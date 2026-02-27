// src/features/Horses/HorsesList.tsx
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
import { useGetAllHorses } from "./horseHooks";
import EditHorseDialog from "./EditHorseForm";
import DeleteDialogHorse from "./DeleteDialogHorse";

interface Horse {
  id: string;
  name: string;
  image?: string;
  owner?: {
    name: string;
  };
  camera?: {
    thingLabel: string;
  };
  feeder?: {
    thingLabel: string;
  };
}

export default function HorsesList() {
  const { t } = useTranslation();
  const { horses, count, totalPages, isFetching, error } = useGetAllHorses();

  // State for the edit dialog
  const [editHorseId, setEditHorseId] = useState<string | null>(null);

  // State for delete dialog
  const [deleteTarget, setDeleteTarget] = useState<{
    horseId: string;
    horseName: string;
  } | null>(null);

  if (error) {
    return (
      <div className="text-sm text-destructive">{(error as Error).message}</div>
    );
  }

  const isInitialLoading = isFetching && horses.length === 0;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{t("horses.title", "Horses")}</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">
                  {t("horses.image", "Image")}
                </TableHead>
                <TableHead>{t("horses.name", "Name")}</TableHead>
                <TableHead>{t("common.owner", "Owner")}</TableHead>
                <TableHead>{t("devices.feeder", "Feeder")}</TableHead>
                <TableHead>{t("devices.camera", "Camera")}</TableHead>
                <TableHead className="w-[100px] text-right">
                  {t("common.actions", "Actions")}
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isInitialLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-10 w-10 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[150px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[120px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[100px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[100px]" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="ml-auto h-9 w-9 rounded-md" />
                    </TableCell>
                  </TableRow>
                ))
              ) : horses.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-muted-foreground"
                  >
                    {t("horses.noHorsesFound", "No horses found.")}
                  </TableCell>
                </TableRow>
              ) : (
                horses.map((horse: Horse) => (
                  <TableRow key={horse.id}>
                    {/* Image */}
                    <TableCell>
                      <img
                        src={horse.image || "/placeholder-horse.png"}
                        alt={horse.name}
                        className="h-10 w-10 rounded-full object-cover ring-2 ring-gray-100"
                      />
                    </TableCell>

                    {/* Name */}
                    <TableCell className="font-medium">{horse.name}</TableCell>

                    {/* Owner */}
                    <TableCell className="text-muted-foreground">
                      {horse.owner?.name || "-"}
                    </TableCell>

                    {/* Feeder */}
                    <TableCell className="text-muted-foreground">
                      {horse.feeder?.thingLabel || "-"}
                    </TableCell>

                    {/* Camera */}
                    <TableCell className="text-muted-foreground">
                      {horse.camera?.thingLabel || "-"}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            aria-label={t("common.actions", "Actions")}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuItem
                            onClick={() => setEditHorseId(horse.id)}
                            className="cursor-pointer"
                          >
                            {t("common.edit", "Edit")}
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() =>
                              setDeleteTarget({
                                horseId: horse.id,
                                horseName: horse.name,
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
                ))
              )}
            </TableBody>
          </Table>

          <div className="pt-4">
            <Pagination
              label={t("pagination.horses", "horses")}
              count={count}
              totalPages={totalPages}
              limit={LIMIT_RES}
            />
          </div>
        </CardContent>
      </Card>

      {/* Edit Horse Dialog */}
      {editHorseId && (
        <EditHorseDialog
          horseId={editHorseId}
          open={!!editHorseId}
          onOpenChange={(open) => {
            if (!open) setEditHorseId(null);
          }}
        />
      )}

      {/* Delete Horse Dialog */}
      {deleteTarget && (
        <DeleteDialogHorse
          open={!!deleteTarget}
          onOpenChange={(open) => {
            if (!open) setDeleteTarget(null);
          }}
          horseId={deleteTarget.horseId}
          horseName={deleteTarget.horseName}
        />
      )}
    </>
  );
}
