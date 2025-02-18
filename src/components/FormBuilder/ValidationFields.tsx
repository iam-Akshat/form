import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type {FormField as TFormField} from "./types"
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';

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
          render={({ field }) => {
            const addOption = () => {
              const currentOptions = field.value || [];
              field.onChange([...currentOptions, { label: '', value: '' }]);
            };

            const removeOption = (optionIndex: number) => {
              const currentOptions = field.value || [];
              if (currentOptions.length <= 1) {
                toast.error('At least one option is required');
                return;
              }
              field.onChange(currentOptions.filter((_, i) => i !== optionIndex));
            };

            const updateOption = (optionIndex: number, key: 'label' | 'value', newValue: string) => {
              const currentOptions = [...(field.value || [])];
              currentOptions[optionIndex] = {
                ...currentOptions[optionIndex],
                [key]: newValue
              };
              field.onChange(currentOptions);
            };

            return (
              <FormItem className="space-y-4">
                <FormLabel>Options</FormLabel>
                <FormDescription>
                  Add options for the select field. Each option must have a label (displayed to users) and a value (stored in form data).
                </FormDescription>
                <div className="space-y-2">
                  {(field.value || [{ label: '', value: '' }]).map((option, optionIndex) => (
                    <div key={optionIndex} className="flex gap-2 items-start">
                      <div className="flex-1">
                        <Input
                          placeholder="Option Label"
                          value={option.label}
                          onChange={(e) => updateOption(optionIndex, 'label', e.target.value)}
                        />
                      </div>
                      <div className="flex-1">
                        <Input
                          placeholder="Option Value"
                          value={option.value}
                          onChange={(e) => updateOption(optionIndex, 'value', e.target.value)}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeOption(optionIndex)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addOption}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Option
                </Button>
              </FormItem>
            );
          }}
        />
      );
    default:
      return null;
  }
};
