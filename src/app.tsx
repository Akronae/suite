import "./app.css";
import { ThemeProvider } from "./components/theme-provider.tsx";
import { Toaster } from "./components/ui/toaster.tsx";
import { useToast } from "./components/ui/use-toast.ts";
import { RouterProvider } from "./router.tsx";

function App() {
  const { toast } = useToast();

  window.addEventListener("error", (event) => {
    toast({
      variant: "destructive",
      title: (event.error as any).type,
      description: (event.error as any).message,
    });
  });
  window.addEventListener("unhandledrejection", (event) => {
    toast({
      variant: "destructive",
      title: (event.reason as any).type,
      description: (event.reason as any).message,
    });
  });

  return (
    <ThemeProvider defaultTheme="dark" storageKey="ui.theme">
      <RouterProvider>
        <Toaster />
      </RouterProvider>
    </ThemeProvider>
  );
}

export default App;
