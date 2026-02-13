// src/components/CreateHorseDialog.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

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

import { CreateHorseFormData, createHorseSchema } from "@/lib/validators";
import { useCreateHorse } from "./horseHooks";
import {
  useUnassignedCameraOptions,
  useUnassignedFeederOptions,
} from "../Devices/deviceHooks";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface CreateHorseDialogProps {
  ownerId: string;
  ownerName?: string;
  triggerAsMenuItem?: boolean;
}

export default function CreateHorseDialog({
  ownerId,
  ownerName,
  triggerAsMenuItem = false,
}: CreateHorseDialogProps) {
  const [open, setOpen] = useState(false);

  const { options: feederOptions, isFetching: isFetchingFeeders } =
    useUnassignedFeederOptions({ enabled: open });

  const { options: cameraOptions, isFetching: isFetchingCameras } =
    useUnassignedCameraOptions({ enabled: open });

  const { createHorse, isPending } = useCreateHorse();

  const form = useForm<CreateHorseFormData>({
    resolver: zodResolver(createHorseSchema),
    defaultValues: {
      name: "wwfw",
      breed: "sfvsv",
      age: 1,
      location: "dwded",
      ownerId,
      feederId: undefined,
      cameraId: undefined,
      image: undefined,
    },
  });

  const onSubmit = (data: CreateHorseFormData) => {
    createHorse(data, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerAsMenuItem ? (
          <DropdownMenuItem
            className="cursor-pointer"
            // prevents the dropdown from "stealing" focus / weird close issues
            onSelect={(e) => {
              e.preventDefault();
              setOpen(true);
            }}
          >
            Create horse for user
          </DropdownMenuItem>
        ) : (
          <Button size="sm" variant="outline">
            Create Horse
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Horse</DialogTitle>
          <DialogDescription>
            {ownerName
              ? `Creating a horse for ${ownerName}`
              : "Add a new horse to the system"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Thunder" {...field} />
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
                  <FormLabel>Breed</FormLabel>
                  <FormControl>
                    <Input placeholder="Arabian" {...field} />
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
                  <FormLabel>Age</FormLabel>
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
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Stable A, Barn 3" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Feeder */}
            <FormField
              control={form.control}
              name="feederId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Feeder (Optional)</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isFetchingFeeders}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a feeder" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {feederOptions.length === 0 ? (
                        <div className="px-2 py-1.5 text-sm text-muted-foreground">
                          No unassigned feeders available
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

            {/* Camera */}
            <FormField
              control={form.control}
              name="cameraId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Camera (Optional)</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isFetchingCameras}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a camera" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {cameraOptions.length === 0 ? (
                        <div className="px-2 py-1.5 text-sm text-muted-foreground">
                          No unassigned cameras available
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
                  <FormLabel>Image (Optional)</FormLabel>
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
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Horse
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
