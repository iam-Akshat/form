import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import type {
  FormConfiguration,
  FormField as FormFieldType,
  SelectValidation,
} from "../types";
import { mockStorage } from "@/storage";
import { createFormSchema } from "../utils";
import { FieldRenderer, ShadcnFieldRenderer } from "./FieldRenderer";

interface FormRendererProps {
  onSubmit: (data: Record<string, any>) => void;
}

const FormRenderer: React.FC<FormRendererProps> = ({ onSubmit }) => {
  const [configuration, setConfiguration] = useState<FormConfiguration | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Initialize form with empty schema
  const formSchema = configuration ? createFormSchema(configuration.fields) : z.object({});
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: configuration?.fields.reduce((acc, field) => ({
      ...acc,
      [field.name]: field.defaultValue || '',
    }), {})
  });

  const loadConfiguration = async () => {
    try {
      const data = await mockStorage.loadForm();
      setConfiguration(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load form configuration");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadConfiguration();
  };

  useEffect(() => {
    loadConfiguration();
  }, []);

  useEffect(() => {
    if (configuration) {
      const defaultValues = configuration.fields.reduce((acc, field) => ({
        ...acc,
        [field.name]: field.defaultValue ?? '',
      }), {});
      form.reset(defaultValues);
    }
  }, [configuration]);

  const renderField = (field: FormFieldType, renderer: FieldRenderer = ShadcnFieldRenderer) => {
    return (
      <FormField
        key={field.name}
        control={form.control}
        name={field.name}
        render={({ field: formField }) => {
          const error = form.formState.errors[field.name]?.message as string;
          
          return React.createElement(renderer.renderFormField, {
            label: field.title,
            error,
            children: field.type === "select" ? (
              React.createElement(renderer.renderSelect, {
                value: formField.value,
                onChange: formField.onChange,
                options: (field.validation as SelectValidation)?.options || [],
                placeholder: "Select an option"
              })
            ) : (
              React.createElement(renderer.renderInput, {
                value: formField.value,
                onChange: formField.onChange,
                type: field.type,
                placeholder: `Enter ${field.title.toLowerCase()}`
              })
            ),
          });
        }}
      />
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" data-testid="loading-spinner" />
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
        <p>No form configuration found, after saving form refresh (this crappy design is by Choice, not because I exceeded the 5-6 hour limit)</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Form Preview</h2>
        <Button
          variant="outline"
          size="icon"
          onClick={handleRefresh}
          disabled={isRefreshing}
          aria-label="Refresh form"
        >
          {isRefreshing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
        </Button>
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {configuration.fields.map((field) => renderField(field))}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default FormRenderer;
