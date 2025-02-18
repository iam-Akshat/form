// FieldCard.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ValidationFields } from './ValidationFields';
import { FIELD_TYPES, NUMBER_VARIANTS } from './constants';
import type { FormField as TFormField } from './types';
import { UseFormReturn } from 'react-hook-form';
import {FormControl,FormItem,FormLabel,FormDescription,FormField} from "@/components/ui/form"
import { Input } from '@/components/ui/input';

interface FieldCardProps {
  index: number;
  onRemove: () => void;
  form: UseFormReturn<{ fields: TFormField[] }>;
  isLatest?: boolean;
}

export const FieldCard: React.FC<FieldCardProps> = ({ index, onRemove, form, isLatest }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Expand the card if it's the latest one
    if (isLatest) {
      setIsExpanded(true);
    }
  }, [isLatest]);

  return (
    <Card className="p-4">
      <CardHeader className="flex flex-row items-center justify-between p-0 pb-4">
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg">Field {index + 1}</CardTitle>
         
        </div>
        <div className="flex items-center gap-2">
          {!isExpanded && (
            <span className="text-sm text-muted-foreground">
              {form.watch(`fields.${index}.title`) || form.watch(`fields.${index}.name`) || 'Untitled Field'}
            </span>
          )}
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={onRemove}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="lg"
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 p-0"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent className="p-0 space-y-4">
          <FormField
            control={form.control}
            name={`fields.${index}.name`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Field Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter field name" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`fields.${index}.title`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Question Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter question title" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`fields.${index}.type`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Field Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select field type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {FIELD_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          {form.watch(`fields.${index}.type`) === 'number' && (
            <FormField
              control={form.control}
              name={`fields.${index}.variant`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number Variant</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select variant" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {NUMBER_VARIANTS.map(variant => (
                        <SelectItem key={variant.value} value={variant.value}>
                          {variant.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name={`fields.${index}.required`}
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>Required</FormLabel>
                  <FormDescription>
                    Make this field mandatory
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <ValidationFields 
            type={form.watch(`fields.${index}.type`)}
            index={index}
            form={form}
          />
        </CardContent>
      )}
    </Card>
  );
};
