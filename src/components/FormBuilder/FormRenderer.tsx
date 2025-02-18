import React, { useEffect, useState } from "react";
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
import { Loader2 } from "lucide-react";
import type {
  FormConfiguration,
  FormField as FormFieldType,
  TextValidation,
  NumberValidation,
  SelectValidation,
} from "./types";
import { mockStorage } from "@/storage";

interface FormRendererProps {
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

const FormRenderer: React.FC<FormRendererProps> = ({ onSubmit }) => {
  const [configuration, setConfiguration] = useState<FormConfiguration | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize form with empty schema
  const formSchema = configuration ? createFormSchema(configuration.fields) : z.object({});
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const loadConfiguration = async () => {
      try {
        const data = await mockStorage.loadForm();
        setConfiguration(data);
      } catch (err) {
        setError("Failed to load form configuration");
      } finally {
        setIsLoading(false);
      }
    };

    loadConfiguration();
  }, []);

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-destructive">
        <p>{error}</p>
      </div>
    );
  }

  if (!configuration) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <p>No form configuration found</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {configuration.fields.map((field) => renderField(field))}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default FormRenderer;
