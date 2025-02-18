import { useCallback, useEffect, useRef, useState } from "react";
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
  delay: number = 2000
) {
  const [state, setState] = useState<AutoSaveState>({
    saving: false,
    lastSaved: null,
    error: null,
  });

  const previousDataRef = useRef<T>();
  const isFirstRender = useRef(true);

  // Create the save function
  const saveData = async (data: T) => {
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
  };

  // Create a stable reference to the debounced save function
  const debouncedSave = useRef(
    debounce((data: T) => {
      saveData(data);
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
    // Skip the first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      previousDataRef.current = data;
      return;
    }

    // Only save if the data has actually changed
    if (JSON.stringify(previousDataRef.current) !== JSON.stringify(data)) {
      debouncedSave(data);
      previousDataRef.current = data;
    }
  }, [data, debouncedSave]);

  return state;
}
