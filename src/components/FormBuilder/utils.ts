import { z } from "zod";
import type {
  FormField,
  NumberValidation,
  SelectValidation,
  TextValidation,
} from "./types";

// Validate if a field has enough data to be rendered
export const isFieldRenderable = (field: FormField) => {
  if (!field.name || !field.title || !field.type) return false;

  if (field.type === "select") {
    return field.validation?.options && field.validation.options.length > 0;
  }

  return true;
};

// Validate if the entire form has enough data
export const isFormRenderable = (fields: FormField[]) => {
  return fields.length > 0 && fields.every(isFieldRenderable);
};

export const createFieldValidation = (field: FormField) => {
  let schema: any = z.any();

  switch (field.type) {
    case "text": {
      const validation = field.validation as TextValidation;
      schema = z.string();
      if (validation?.minLength) {
        schema = schema.min(
          validation.minLength,
          validation.customError ||
            `Minimum ${validation.minLength} characters required`
        );
      }
      if (validation?.maxLength) {
        schema = schema.max(
          validation.maxLength,
          validation.customError ||
            `Maximum ${validation.maxLength} characters allowed`
        );
      }
      if (validation?.pattern) {
        schema = schema.regex(
          new RegExp(validation.pattern),
          validation.customError || "Invalid format"
        );
      }
      break;
    }
    case "number": {
      const validation = field.validation as NumberValidation;
      schema = z.number();
      if (validation?.min !== undefined) {
        schema = schema.min(
          validation.min,
          validation.customError || `Minimum value is ${validation.min}`
        );
      }
      if (validation?.max !== undefined) {
        schema = schema.max(
          validation.max,
          validation.customError || `Maximum value is ${validation.max}`
        );
      }
      break;
    }
    case "select": {
      const validation = field.validation as SelectValidation;
      const values = validation?.options?.map((opt) =>
        typeof opt.value === "string" ? opt.value : opt.value.toString()
      );
      schema = z
        .string()
        .refine(
          (value) => values.includes(value),
          validation.customError || "Please select a valid option"
        );
      break;
    }
  }

  return field.required ? schema : schema.optional();
};

export const createFormSchema = (fields: FormField[]) => {
  const shape = fields.reduce(
    (acc, field) => ({
      ...acc,
      [field.name]: createFieldValidation(field),
    }),
    {}
  );

  return z.object(shape);
};
