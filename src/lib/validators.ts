// src/lib/validators.ts
import i18n from "@/locales/config";
import { z } from "zod";

// Helper function to get translation
const t = (key: string, params?: Record<string, any>) => {
  return i18n.t(`validation.${key}`, params);
};

// Factory functions that create schemas dynamically
export const getUserSignupSchema = () =>
  z
    .object({
      name: z.string().min(2, t("nameMinLength")).max(50, t("nameMaxLength")),
      username: z.string().min(3, t("usernameMinLength")),
      password: z
        .string()
        .min(8, t("passwordMinLength"))
        .max(100, t("passwordMaxLength")),
      passwordConfirm: z.string({
        message: t("providePasswordConfirm"),
      }),
    })
    .refine((data) => data.password === data.passwordConfirm, {
      message: t("passwordsDoNotMatch"),
      path: ["passwordConfirm"],
    });

export const getCreateHorseSchema = () =>
  z.object({
    name: z
      .string()
      .min(2, t("horseNameMinLength"))
      .max(50, t("horseNameMaxLength")),
    breed: z.string().min(2, t("breedMinLength")).max(50, t("breedMaxLength")),
    age: z
      .number({
        message: t("ageRequired"),
      })
      .int(t("ageInteger"))
      .min(1, t("ageMinValue"))
      .max(40, t("ageMaxValue")),
    location: z
      .string()
      .min(2, t("locationMinLength"))
      .max(100, t("locationMaxLength")),
    feederId: z.string().uuid(t("validDeviceUUID")).optional(),
    cameraId: z.string().uuid(t("validDeviceUUID")).optional(),
    ownerId: z
      .string({
        message: t("ownerIdRequired"),
      })
      .uuid(t("validUUID")),
    image: z
      .instanceof(File)
      .refine((file) => file.size <= 5_000_000, t("imageSizeLimit"))
      .refine(
        (file) =>
          ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
            file.type,
          ),
        t("imageFormatSupport"),
      )
      .optional(),
  });

export const getCreateCameraSchema = () =>
  z.object({
    thingLabel: z
      .string()
      .min(5, t("deviceNameMinLength"))
      .max(50, t("deviceNameMaxLength")),
    deviceType: z.literal("CAMERA"),
    location: z
      .string()
      .min(2, t("locationMinLength"))
      .max(100, t("locationMaxLength")),
  });

export const getCreateFeederSchema = () =>
  z
    .object({
      thingLabel: z
        .string()
        .min(5, t("deviceNameMinLength"))
        .max(50, t("deviceNameMaxLength")),
      deviceType: z.literal("FEEDER"),
      location: z
        .string()
        .min(2, t("locationMinLength"))
        .max(100, t("locationMaxLength")),
      feederType: z.enum(["MANUAL", "SCHEDULED"]),
      scheduledAmountKg: z
        .number()
        .min(0.1, t("amountMinValue"))
        .max(50, t("amountMaxValue"))
        .optional(),
      morningTime: z
        .string()
        .regex(/^([0-1]?[0-9]|2[0-3]):00$/, t("timeOnTheHour"))
        .or(z.literal(""))
        .optional(),
      dayTime: z
        .string()
        .regex(/^([0-1]?[0-9]|2[0-3]):00$/, t("timeOnTheHour"))
        .or(z.literal(""))
        .optional(),
      nightTime: z
        .string()
        .regex(/^([0-1]?[0-9]|2[0-3]):00$/, t("timeOnTheHour"))
        .or(z.literal(""))
        .optional(),
    })
    .refine(
      (data) => {
        if (data.feederType === "SCHEDULED") {
          return data.scheduledAmountKg !== undefined;
        }
        return true;
      },
      {
        message: t("scheduledAmountRequired"),
        path: ["scheduledAmountKg"],
      },
    )
    .refine(
      (data) => {
        if (data.feederType === "SCHEDULED") {
          return data.morningTime || data.dayTime || data.nightTime;
        }
        return true;
      },
      {
        message: t("atLeastOneTime"),
        path: ["morningTime"],
      },
    )
    .superRefine((data, ctx) => {
      const times = [
        { value: data.morningTime, field: "morningTime" },
        { value: data.dayTime, field: "dayTime" },
        { value: data.nightTime, field: "nightTime" },
      ].filter((t) => t.value && t.value !== "");

      const seen = new Map<string, string>();
      for (const time of times) {
        if (seen.has(time.value!)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("timeAlreadyUsed", { field: seen.get(time.value!) }),
            path: [time.field],
          });
        } else {
          seen.set(time.value!, time.field);
        }
      }
    });

// src/lib/validators.ts

export const getUpdateDeviceSchema = () =>
  z
    .object({
      thingLabel: z
        .string()
        .min(5, t("deviceNameMinLength"))
        .max(50, t("deviceNameMaxLength")),
      location: z
        .string()
        .min(2, t("locationMinLength"))
        .max(100, t("locationMaxLength")),
      // ❌ No deviceType — cannot change device type after creation

      // FEEDER-SPECIFIC
      feederType: z.enum(["MANUAL", "SCHEDULED"]).optional(),

      scheduledAmountKg: z
        .number()
        .min(0.1, t("amountMinValue"))
        .max(50, t("amountMaxValue"))
        .optional(),

      morningTime: z
        .string()
        .regex(/^([0-1]?[0-9]|2[0-3]):00$/, t("timeOnTheHour"))
        .or(z.literal(""))
        .optional(),

      dayTime: z
        .string()
        .regex(/^([0-1]?[0-9]|2[0-3]):00$/, t("timeOnTheHour"))
        .or(z.literal(""))
        .optional(),

      nightTime: z
        .string()
        .regex(/^([0-1]?[0-9]|2[0-3]):00$/, t("timeOnTheHour"))
        .or(z.literal(""))
        .optional(),
    })
    .refine(
      (data) => {
        // If switching to SCHEDULED, scheduledAmountKg is required
        if (data.feederType === "SCHEDULED") {
          return data.scheduledAmountKg !== undefined;
        }
        return true;
      },
      {
        message: t("scheduledAmountRequired"),
        path: ["scheduledAmountKg"],
      },
    )
    .refine(
      (data) => {
        // If switching to SCHEDULED, at least one time must be set
        if (data.feederType === "SCHEDULED") {
          return data.morningTime || data.dayTime || data.nightTime;
        }
        return true;
      },
      {
        message: t("atLeastOneTime"),
        path: ["morningTime"],
      },
    )
    .refine(
      (data) => {
        // Check for duplicate times
        const times = [data.morningTime, data.dayTime, data.nightTime].filter(
          (t) => t && t !== "",
        );
        const uniqueTimes = new Set(times);
        return times.length === uniqueTimes.size;
      },
      {
        message: t("duplicateTimes"),
        path: ["dayTime"],
      },
    );

export const getUpdateFeederSchema = () =>
  z
    .object({
      feederType: z.enum(["MANUAL", "SCHEDULED"]),
      scheduledAmountKg: z
        .number()
        .min(0.1, t("amountMinValue"))
        .max(50, t("amountMaxValue"))
        .optional(),
      morningTime: z
        .string()
        .regex(/^([0-1]?[0-9]|2[0-3]):00$/, t("timeOnTheHour"))
        .or(z.literal(""))
        .optional(),
      dayTime: z
        .string()
        .regex(/^([0-1]?[0-9]|2[0-3]):00$/, t("timeOnTheHour"))
        .or(z.literal(""))
        .optional(),
      nightTime: z
        .string()
        .regex(/^([0-1]?[0-9]|2[0-3]):00$/, t("timeOnTheHour"))
        .or(z.literal(""))
        .optional(),
    })
    .refine(
      (data) => {
        if (data.feederType === "SCHEDULED") {
          return data.scheduledAmountKg !== undefined;
        }
        return true;
      },
      {
        message: t("scheduledAmountRequired"),
        path: ["scheduledAmountKg"],
      },
    )
    .refine(
      (data) => {
        if (data.feederType === "SCHEDULED") {
          return data.morningTime || data.dayTime || data.nightTime;
        }
        return true;
      },
      {
        message: t("atLeastOneTime"),
        path: ["morningTime"],
      },
    )
    .refine(
      (data) => {
        const times = [data.morningTime, data.dayTime, data.nightTime].filter(
          (t) => t && t !== "",
        );
        const uniqueTimes = new Set(times);
        return times.length === uniqueTimes.size;
      },
      {
        message: t("duplicateTimes"),
        path: ["dayTime"],
      },
    );
