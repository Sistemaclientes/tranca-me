import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AuthChoice from "./pages/AuthChoice";
import Buscar from "./pages/Buscar";
import BraiderProfile from "./pages/BraiderProfile";
import BraiderProfileEdit from "./pages/BraiderProfileEdit";
import Assinatura from "./pages/Assinatura";
import NotFound from "./pages/NotFound";
import BraiderNotFound from "./pages/BraiderNotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/escolher" element={<AuthChoice />} />
          <Route path="/buscar" element={<Buscar />} />
          <Route path="/trancista/:id" element={<BraiderProfile />} />
          <Route path="/trancista-nao-encontrada" element={<BraiderNotFound />} />
          <Route path="/perfil" element={<BraiderProfileEdit />} />
          <Route path="/assinatura" element={<Assinatura />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
