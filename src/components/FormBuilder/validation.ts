import { z } from "zod";

export const textValidationSchema = z.object({
  required: z.boolean().optional(),
  minLength: z.number().min(0).optional(),
  maxLength: z.number().min(0).optional(),
  customError: z.string().optional(),
});

export const numberValidationSchema = z.object({
  required: z.boolean().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  customError: z.string().optional(),
});

export const selectValidationSchema = z.object({
  required: z.boolean().optional(),
  options: z.array(
    z.object({
      label: z.string(),
      value: z.union([z.string(), z.number()]),
    })
  ),
  customError: z.string().optional(),
});

export const fieldSchema = z.object({
  name: z.string().min(1, "Field name is required"),
  title: z.string().min(1, "Question title is required"),
  type: z.enum(["text", "number", "select"]),
  required: z.boolean().optional(),
  defaultValue: z.union([z.string(), z.number()]).optional(),
  variant: z.enum(["years", "temperature"]).optional(),
  validation: z.union([
    textValidationSchema,
    numberValidationSchema,
    selectValidationSchema,
  ]),
});

export const formSchema = z.object({
  fields: z
    .array(fieldSchema)
    .min(1, "At least one field is required")
    .refine(
      (fields) => {
        const names = fields.map((field) => field.name);
        return new Set(names).size === names.length;
      },
      {
        message: "Field names must be unique",
      }
    ),
});
