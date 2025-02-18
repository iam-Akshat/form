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

  const previousDataRef = useRef<T | null>(null);
  const isFirstRender = useRef(true);

  const saveWithState = async (data: T) => {
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

  const debouncedSave = useRef(
    debounce(saveWithState, delay)
  ).current;

  useEffect(() => {
    return () => {
      debouncedSave.cancel();
    };
  }, [debouncedSave]);

  useEffect(() => {
    if (!data) return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      previousDataRef.current = data;
      return;
    }

    if (
      shouldAutoSave && (
        previousDataRef.current === null ||
        JSON.stringify(previousDataRef.current) !== JSON.stringify(data)
      )
    ) {
      debouncedSave(data);
      previousDataRef.current = data;
    }
  }, [data, debouncedSave, shouldAutoSave]);

  return state;
}
