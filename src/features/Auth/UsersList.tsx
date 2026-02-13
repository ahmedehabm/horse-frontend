// src/components/UsersList.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { MoreVertical } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
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

interface User {
  id: string;
  name?: string;
  username: string;
}

export default function UsersList() {
  const navigate = useNavigate();
  const { users, count, totalPages, isFetching, error } = useGetUsers();

  console.log(users);

  if (error) {
    return (
      <div className="text-sm text-destructive">{(error as Error).message}</div>
    );
  }

  const isInitialLoading = isFetching && users.length === 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Users</CardTitle>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[280px]">Name</TableHead>
              <TableHead>Username</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
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
                  <TableCell className="text-right">
                    <Skeleton className="ml-auto h-9 w-9 rounded-md" />
                  </TableCell>
                </TableRow>
              ))
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center text-muted-foreground"
                >
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((u: User) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">
                    {u.name || "Unnamed User"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {u.username}
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            aria-label="Open user actions"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-56">
                          {/* Create Horse (opens dialog) */}
                          <CreateHorseDialog
                            ownerId={u.id}
                            ownerName={u.name ?? undefined}
                            triggerAsMenuItem
                          />

                          <DropdownMenuItem
                            onClick={() =>
                              navigate(`/admin/users/${u.id}/edit`)
                            }
                            className="cursor-pointer"
                          >
                            Update user details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/*  Pagination  */}
        <div className="pt-4">
          <Pagination
            label="users"
            count={count}
            totalPages={totalPages}
            limit={LIMIT_RES}
          />
        </div>
      </CardContent>
    </Card>
  );
}
