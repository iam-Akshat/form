import React from "react";
import {
  FormControl,
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

// Field renderer interface for UI library implementations
export interface FieldRenderer {
  renderInput: (props: {
    value: string;
    onChange: (value: string) => void;
    type: string;
    placeholder?: string;
  }) => React.ReactNode;
  
  renderSelect: (props: {
    value: string;
    onChange: (value: string) => void;
    options: Array<{ label: string; value: string }>;
    placeholder?: string;
  }) => React.ReactNode;
  
  renderFormField: (props: {
    label: string;
    error?: string;
    children: React.ReactNode;
  }) => React.ReactNode;
}

// Default implementation using shadcn/ui
export const ShadcnFieldRenderer: FieldRenderer = {
  renderInput: ({ value, onChange, type, placeholder }) => (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      type={type}
      placeholder={placeholder}
    />
  ),

  renderSelect: ({ value, onChange, options, placeholder }) => (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem
            key={option.value.toString()}
            value={option.value.toString()}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ),

  renderFormField: ({ label, error, children }) => (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>{children}</FormControl>
      {error && <FormMessage>{error}</FormMessage>}
    </FormItem>
  ),
};
