import React from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { FieldCard } from './FieldCard';
import type { FormConfiguration, FormField } from './types';

const defaultField: FormField = {
  name: '',
  title: '',
  type: 'text',
  required: false,
  validation: {}
};

export const FormBuilder: React.FC = () => {
  const form = useForm<FormConfiguration>({
    defaultValues: {
      fields: [defaultField]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'fields'
  });

  const onSubmit = (data: FormConfiguration) => {
    console.log('Form Configuration:', data);
    // Here you would typically save the form configuration
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          {fields.map((field, index) => (
            <FieldCard
              key={field.id}
              index={index}
              onRemove={() => remove(index)}
              form={form}
            />
          ))}
        </div>

        <div className="flex space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => append(defaultField)}
          >
            Add Field
          </Button>
          <Button type="submit">Save Form Configuration</Button>
        </div>
      </form>
    </Form>
  );
};