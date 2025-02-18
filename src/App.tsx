import { FormBuilder } from "./components/FormBuilder/builder/FormBuilder";
import { Toaster } from "@/components/ui/sonner";
import FormRenderer from "./components/FormBuilder/renderer/FormRenderer";
import { Button } from "./components/ui/button";

function App() {
  return (
    <>
      <div className="max-w-3xl mx-auto">
        <FormBuilder />
        <div className="mt-4">
          <Button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            className="bg-destructive text-background hover:bg-destructive/90 px-4 py-2 rounded-md"
          >
            Reset LocalStorage and Refresh
          </Button>
        </div>

        <div className="space-y-8 mt-8 max-w-xl">
          <h2 className="text-lg font-semibold">Form Preview</h2>
          <FormRenderer
            onSubmit={(data) => {
              console.log("Form submitted with data:", data);
            }}
          />
        </div>
      </div>
      <Toaster />
    </>
  );
}

export default App;
