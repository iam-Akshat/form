import React from 'react';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type {FormField as TFormField} from "./types"
import { UseFormReturn } from 'react-hook-form';

interface ValidationFieldsProps {
  type: TFormField['type'];
  index: number;
  form: UseFormReturn<{ fields: TFormField[] }>;
}

export const ValidationFields: React.FC<ValidationFieldsProps> = ({ type, index, form }) => {
  switch (type) {
    case 'text':
      return (
        <>
          <FormField
            control={form.control}
            name={`fields.${index}.validation.minLength`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Length</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`fields.${index}.validation.maxLength`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum Length</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </>
      );
    case 'number':
      return (
        <>
          <FormField
            control={form.control}
            name={`fields.${index}.validation.min`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Value</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`fields.${index}.validation.max`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum Value</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </>
      );
    case 'select':
      return (
        <FormField
          control={form.control}
          name={`fields.${index}.validation.options`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Options (comma-separated)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Option1,Option2,Option3"
                  onChange={(e) => {
                    const options = e.target.value.split(',').map(opt => ({
                      label: opt.trim(),
                      value: opt.trim()
                    }));
                    field.onChange(options);
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
      );
    default:
      return null;
  }
};
