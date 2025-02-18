import { FormConfiguration } from "./components/FormBuilder";

export const mockStorage = {
  saveForm: async (data: any): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 10% chance of failure
        if (Math.random() < 0.1) {
          reject(new Error("Failed to save form"));
          return;
        }

        localStorage.setItem("form_config", JSON.stringify(data));
        resolve();
      }, 1000); // Simulate network delay
    });
  },

  loadForm: async (): Promise<FormConfiguration> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = localStorage.getItem("form_config");
        resolve(data ? JSON.parse(data) : null);
      }, 500);
    });
  },
};
