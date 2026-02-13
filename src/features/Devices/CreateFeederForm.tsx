// src/components/CreateFeederDialog.tsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { createFeederSchema } from "@/lib/validators";
import { useCreateDevice } from "./deviceHooks";

type FormValues = z.infer<typeof createFeederSchema>;

export default function CreateFeederDialog() {
  const [open, setOpen] = useState(false);
  const { createDevice, isPending } = useCreateDevice();

  const form = useForm<FormValues>({
    resolver: zodResolver(createFeederSchema),
    defaultValues: {
      thingLabel: "",
      deviceType: "FEEDER",
      location: "",
      feederType: "MANUAL",
      morningTime: "",
      dayTime: "",
      nightTime: "",
    },
  });

  const feederType = form.watch("feederType");

  function onSubmit(values: FormValues) {
    const payload: any = {
      thingLabel: values.thingLabel,
      deviceType: values.deviceType,
      location: values.location,
      feederType: values.feederType,
    };

    // Only include time fields if SCHEDULED
    if (values.feederType === "SCHEDULED") {
      if (values.morningTime) payload.morningTime = values.morningTime;
      if (values.dayTime) payload.dayTime = values.dayTime;
      if (values.nightTime) payload.nightTime = values.nightTime;
    }

    console.log(payload);
    createDevice(payload, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Feeder</Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Feeder Device</DialogTitle>
          <DialogDescription>
            Add a new feeder device to the system
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Thing Label */}
            <FormField
              control={form.control}
              name="thingLabel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Device Name (Must be unique for each device)
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="FEEDER-STABLE-001" {...field} />
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

            {/* Feeder Type */}
            <FormField
              control={form.control}
              name="feederType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Feeder Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select feeder type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="MANUAL">Manual</SelectItem>
                      <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Scheduled Times - Only show if SCHEDULED */}
            {feederType === "SCHEDULED" && (
              <>
                <FormField
                  control={form.control}
                  name="morningTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Morning Time (Optional)</FormLabel>
                      <FormControl>
                        <Input type="time" placeholder="08:00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dayTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Day Time (Optional)</FormLabel>
                      <FormControl>
                        <Input type="time" placeholder="14:00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nightTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Night Time (Optional)</FormLabel>
                      <FormControl>
                        <Input type="time" placeholder="20:00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

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
                Create Feeder
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
