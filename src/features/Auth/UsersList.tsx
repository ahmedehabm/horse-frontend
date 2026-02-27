// src/features/Users/UsersList.tsx

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
import { useGetUsers } from "./usersHooks";
import CreateHorseDialog from "../Horses/CreateHorseForm";
import DeleteUserDialog from "./DeleteDialogUser";

interface User {
  id: string;
  name?: string;
  username: string;
  _count: {
    horses: number;
  };
}

export default function UsersList() {
  const { t } = useTranslation();
  const { users, count, totalPages, isFetching, error } = useGetUsers();

  const [deleteTarget, setDeleteTarget] = useState<{
    userId: string;
    userName: string;
    horseCount: number;
  } | null>(null);

  if (error) {
    return (
      <div className="text-sm text-destructive">{(error as Error).message}</div>
    );
  }

  const isInitialLoading = isFetching && users.length === 0;

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>{t("users.title")}</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[280px]">{t("users.name")}</TableHead>
                <TableHead>{t("auth.username")}</TableHead>
                <TableHead className="w-[120px]">
                  {t("users.horses", "Horses")}
                </TableHead>
                <TableHead className="w-[100px] text-right">
                  {t("users.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isInitialLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-4 w-[180px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[220px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-10" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="ml-auto h-9 w-9 rounded-md" />
                    </TableCell>
                  </TableRow>
                ))
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-muted-foreground"
                  >
                    {t("users.noUsersFound")}
                  </TableCell>
                </TableRow>
              ) : (
                users.map((u: User) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">
                      {u.name || t("users.unnamedUser")}
                    </TableCell>

                    <TableCell className="text-muted-foreground">
                      {u.username}
                    </TableCell>

                    <TableCell>
                      <span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                        {u._count.horses}
                      </span>
                    </TableCell>

                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            aria-label={t("users.actions")}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-56">
                          <CreateHorseDialog
                            ownerId={u.id}
                            ownerName={u.name ?? undefined}
                            triggerAsMenuItem
                          />

                          <DropdownMenuItem
                            onClick={() =>
                              setDeleteTarget({
                                userId: u.id,
                                userName: u.name || u.username,
                                horseCount: u._count.horses,
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
              label={t("pagination.users")}
              count={count}
              totalPages={totalPages}
              limit={LIMIT_RES}
            />
          </div>
        </CardContent>
      </Card>

      {/* Delete User Dialog */}
      {deleteTarget && (
        <DeleteUserDialog
          open={!!deleteTarget}
          onOpenChange={(open) => {
            if (!open) setDeleteTarget(null);
          }}
          userId={deleteTarget.userId}
          userName={deleteTarget.userName}
          horseCount={deleteTarget.horseCount}
        />
      )}
    </>
  );
}
