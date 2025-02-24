import React, { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { FieldCard } from "./FieldCard";
import { useAutoSave } from "@/hooks/useAutoSave";
import { mockStorage } from "@/storage";
import { formSchema } from "../validation";
import type { FormConfiguration, FormField } from "../types";
import { isFormRenderable } from "../utils";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {toast} from 'sonner';

const defaultField: FormField = {
  name: "",
  title: "",
  type: "",
  required: false,
  defaultValue: "",
  validation: {},
};

export const FormBuilder: React.FC = () => {
  const form = useForm<FormConfiguration>({
    defaultValues: {
      fields: [],
    },
    resolver: zodResolver(formSchema),
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "fields",
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((field) => field.id === active.id);
      const newIndex = fields.findIndex((field) => field.id === over.id);
      move(oldIndex, newIndex);
    }
  };

  const formState = form.watch();
  
  // Only auto-save when the form is renderable
  const shouldAutoSave = isFormRenderable(formState.fields);
  const autoSaveState = useAutoSave(
    formState,
    mockStorage.saveForm,
    2000,
    shouldAutoSave
  );

  const handleSave = async () => {
    const isValid = await form.trigger();
    if (!isValid) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    if (!isFormRenderable(formState.fields)) {
      toast.error("Please ensure all fields have the required data");
      return;
    }

    try {
      await mockStorage.saveForm(formState);
      toast.success("Form saved successfully");
    } catch (error) {
      console.error("Failed to save form:", error);
      toast.error("Failed to save form");
    }
  };

  // Load saved form on mount
  useEffect(() => {
    const loadSavedForm = async () => {
      try {
        const savedForm = await mockStorage.loadForm();
        if (savedForm) {
          form.reset(savedForm);
        }
      } catch (error) {
        console.error("Failed to load saved form:", error);
      }
    };
    loadSavedForm();
  }, [form]);

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-8">
          <Form {...form}>
            <form className="space-y-8">
              {autoSaveState.error && (
                <Alert variant="destructive">
                  <AlertDescription>{autoSaveState.error}</AlertDescription>
                </Alert>
              )}

              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Form Builder</h2>
                <div className="flex items-center space-x-4">
                  {autoSaveState.saving ? (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </div>
                  ) : autoSaveState.lastSaved && (
                    <span className="text-sm text-muted-foreground">
                      Last saved: {autoSaveState.lastSaved.toLocaleTimeString()}
                    </span>
                  )}
                  <Button 
                    type="button" 
                    onClick={handleSave}
                    variant="outline"
                  >
                    Save Form
                  </Button>
                </div>
              </div>

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={fields.map(field => field.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-4">
                    {fields.map((field, index) => (
                      <FieldCard
                        key={field.id}
                        id={field.id}
                        index={index}
                        onRemove={() => remove(index)}
                        form={form}
                        isLatest={index === fields.length - 1}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>

              <Button
                type="button"
                variant="outline"
                onClick={() => append(defaultField)}
              >
                Add Field
              </Button>
            </form>
          </Form>
        </div>

      </div>
    </div>
  );
};
