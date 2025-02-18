import { useEffect, useRef, useState } from "react";
import debounce from "lodash/debounce";
import { toast } from "sonner";

interface AutoSaveState {
  saving: boolean;
  lastSaved: Date | null;
  error: string | null;
}

export function useAutoSave<T>(
  data: T,
  saveFunction: (data: T) => Promise<void>,
  delay: number = 2000,
  shouldAutoSave: boolean = true
) {
  const [state, setState] = useState<AutoSaveState>({
    saving: false,
    lastSaved: null,
    error: null,
  });

  const previousDataRef = useRef<T>();
  const isFirstRender = useRef(true);
  const isInitialLoadRef = useRef(true);

  // Create a stable reference to the debounced save function
  const debouncedSave = useRef(
    debounce(async (data: T) => {
      // Don't save if this is the initial load
      if (isInitialLoadRef.current) {
        isInitialLoadRef.current = false;
        return;
      }

      setState((prev) => ({ ...prev, saving: true, error: null }));
      try {
        await saveFunction(data);
        setState((prev) => ({
          ...prev,
          saving: false,
          lastSaved: new Date(),
          error: null,
        }));
        toast.success("Form saved successfully");
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to save";
        setState((prev) => ({
          ...prev,
          saving: false,
          error: errorMessage,
        }));
        toast.error("Failed to save form");
      }
    }, delay)
  ).current;

  // Cleanup the debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedSave.cancel();
    };
  }, [debouncedSave]);

  // Handle data changes
  useEffect(() => {
    // Skip the first render and set initial data
    if (isFirstRender.current) {
      isFirstRender.current = false;
      previousDataRef.current = data;
      return;
    }

    // Only save if shouldAutoSave is true and the data has actually changed
    if (shouldAutoSave && JSON.stringify(previousDataRef.current) !== JSON.stringify(data)) {
      debouncedSave(data);
      previousDataRef.current = data;
    }
  }, [data, debouncedSave, shouldAutoSave]);

  return state;
}
