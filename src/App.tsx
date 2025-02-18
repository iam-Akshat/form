import { FormBuilder } from "./components/FormBuilder/FormBuilder";
import { Toaster } from "@/components/ui/sonner";
import FormRenderer from "./components/FormBuilder/FormRenderer";

function App() {
  return (
    <>
      <div className="max-w-3xl">
        <FormBuilder />

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
