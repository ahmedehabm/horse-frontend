// src/components/CreateCameraDialog.tsx
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
import { useCreateDevice } from "./deviceHooks";
import { createCameraSchema } from "@/lib/validators";

type FormValues = z.infer<typeof createCameraSchema>;

export default function CreateCameraDialog() {
  const [open, setOpen] = useState(false);
  const { createDevice, isPending } = useCreateDevice();

  const form = useForm<FormValues>({
    resolver: zodResolver(createCameraSchema),
    defaultValues: {
      thingLabel: "",
      deviceType: "CAMERA",
      location: "",
    },
  });

  function onSubmit(values: FormValues) {
    createDevice(values, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Camera</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Camera Device</DialogTitle>
          <DialogDescription>
            Add a new camera device to the system
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
                    <Input placeholder="CAMERA-STABLE-001" {...field} />
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
                Create Camera
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
