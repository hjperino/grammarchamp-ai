import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import Module1 from "./pages/Module1";
import Module2 from "./pages/Module2";
import Module3 from "./pages/Module3";
import Module4 from "./pages/Module4";
import Reference from "./pages/Reference";
import NotFound from "./pages/NotFound";
import Results from "./pages/Results";
import StudentEntry from "./pages/StudentEntry";
import TeacherLogin from "./pages/TeacherLogin";
import TeacherDashboard from "./pages/TeacherDashboard";
import MyResults from "./pages/MyResults";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Index />} />
          <Route path="/module/1" element={<Module1 />} />
          <Route path="/module/2" element={<Module2 />} />
          <Route path="/module/3" element={<Module3 />} />
          <Route path="/module/4" element={<Module4 />} />
          <Route path="/reference" element={<Reference />} />
          <Route path="/results" element={<Results />} />
          <Route path="/student" element={<StudentEntry />} />
          <Route path="/teacher/login" element={<TeacherLogin />} />
          <Route path="/teacher" element={<TeacherDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
