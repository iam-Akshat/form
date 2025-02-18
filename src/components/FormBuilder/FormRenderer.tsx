import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Button } from "@/components/ui/button";
import type {
  FormConfiguration,
  FormField as FormFieldType,
  TextValidation,
  NumberValidation,
  SelectValidation,
} from "./types";

interface FormRendererProps {
  configuration: FormConfiguration;
  onSubmit: (data: Record<string, any>) => void;
}

const createFieldValidation = (field: FormFieldType) => {
  let schema: any = z.any();

  switch (field.type) {
    case "text": {
      const validation = field.validation as TextValidation;
      schema = z.string();
      if (validation?.minLength) {
        schema = schema.min(validation.minLength, 
          validation.customError || `Minimum ${validation.minLength} characters required`);
      }
      if (validation?.maxLength) {
        schema = schema.max(validation.maxLength,
          validation.customError || `Maximum ${validation.maxLength} characters allowed`);
      }
      if (validation?.pattern) {
        schema = schema.regex(new RegExp(validation.pattern),
          validation.customError || "Invalid format");
      }
      break;
    }
    case "number": {
      const validation = field.validation as NumberValidation;
      schema = z.number();
      if (validation?.min !== undefined) {
        schema = schema.min(validation.min,
          validation.customError || `Minimum value is ${validation.min}`);
      }
      if (validation?.max !== undefined) {
        schema = schema.max(validation.max,
          validation.customError || `Maximum value is ${validation.max}`);
      }
      break;
    }
    case "select": {
      const validation = field.validation as SelectValidation;
      const values = validation?.options?.map(opt => 
        typeof opt.value === "string" ? opt.value : opt.value.toString()
      );
      schema = z.string().refine(
        value => values.includes(value),
        validation.customError || "Please select a valid option"
      );
      break;
    }
  }

  return field.required ? schema : schema.optional();
};

const createFormSchema = (fields: FormFieldType[]) => {
  const shape = fields.reduce((acc, field) => ({
    ...acc,
    [field.name]: createFieldValidation(field),
  }), {});
  
  return z.object(shape);
};

const FormRenderer: React.FC<FormRendererProps> = ({ configuration, onSubmit }) => {
  const formSchema = createFormSchema(configuration.fields);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const renderField = (field: FormFieldType) => {
    return (
      <FormField
        key={field.name}
        control={form.control}
        name={field.name}
        render={({ field: formField }) => (
          <FormItem>
            <FormLabel>{field.title}</FormLabel>
            <FormControl>
              {field.type === "select" ? (
                <Select
                  onValueChange={formField.onChange}
                  defaultValue={formField.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    {(field.validation as SelectValidation)?.options?.map((option) => (
                      <SelectItem
                        key={option.value.toString()}
                        value={option.value.toString()}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  {...formField}
                  type={field.type}
                  placeholder={`Enter ${field.title.toLowerCase()}`}
                />
              )}
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {configuration.fields.map(renderField)}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default FormRenderer;
