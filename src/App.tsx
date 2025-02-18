import { FormBuilder } from "./components/FormBuilder/FormBuilder";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <>
      <div className="max-w-3xl">
        <FormBuilder />
      </div>
      <Toaster />
    </>
  );
}

export default App;
