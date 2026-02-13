// src/lib/validators.ts
import { z } from "zod";

export const userSignupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50),
    username: z.string().min(3, "username must be at least 3 characters"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100),
    passwordConfirm: z.string({ error: "Provide password confirm" }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords do not match",
    path: ["passwordConfirm"],
  });

export const createHorseSchema = z.object({
  name: z.string().min(2, "Horse name must be at least 2 characters").max(50),
  breed: z.string().min(2, "Breed must be at least 2 characters").max(50),

  // keep it as number (no coerce) to avoid resolver type mismatch
  age: z
    .number({ error: "Age is required" })
    .int("Age must be an integer")
    .min(1, "Age must be 1 or greater")
    .max(40, "Age must be 40 or less"),

  location: z
    .string()
    .min(2, "Location must be at least 2 characters")
    .max(100),

  feederId: z.string().uuid("Must be a valid Device UUID").optional(),
  cameraId: z.string().uuid("Must be a valid Device UUID").optional(),

  ownerId: z
    .string({ error: "Owner ID is required" })
    .uuid("Must be a valid UUID"),

  image: z
    .instanceof(File)
    .refine((file) => file.size <= 5_000_000, "Image must be less than 5MB")
    .refine(
      (file) =>
        ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
          file.type,
        ),
      "Only .jpg, .jpeg, .png and .webp formats are supported",
    )
    .optional(),
});

export type CreateHorseFormData = z.infer<typeof createHorseSchema>;

export const createCameraSchema = z.object({
  thingLabel: z
    .string()
    .min(5, "Device name must be at least 5 characters")
    .max(50),
  deviceType: z.literal("CAMERA"),
  location: z
    .string()
    .min(2, "Location must be at least 2 characters")
    .max(100),
});

export const createFeederSchema = z.object({
  thingLabel: z
    .string()
    .min(5, "Device name must be at least 5 characters")
    .max(50),
  deviceType: z.literal("FEEDER"),
  location: z
    .string()
    .min(2, "Location must be at least 2 characters")
    .max(100),
  feederType: z.enum(["MANUAL", "SCHEDULED"]),
  morningTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "HH:MM format (08:00)")
    .optional(),
  dayTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "HH:MM format (08:00)")
    .optional(),
  nightTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "HH:MM format (08:00)")
    .optional(),
});
