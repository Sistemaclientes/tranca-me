import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Lazy load pages for optimization
const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const AuthChoice = lazy(() => import("./pages/AuthChoice"));
const Buscar = lazy(() => import("./pages/Buscar"));
const BraiderProfile = lazy(() => import("./pages/BraiderProfile"));
const BraiderProfileEdit = lazy(() => import("./pages/BraiderProfileEdit"));
const MeuPerfil = lazy(() => import("./pages/MeuPerfil"));
const Assinatura = lazy(() => import("./pages/Assinatura"));
const Checkout = lazy(() => import("./pages/Checkout"));
const AdminSuggestions = lazy(() => import("./pages/AdminSuggestions"));
const Favoritos = lazy(() => import("./pages/Favoritos"));
const NotFound = lazy(() => import("./pages/NotFound"));
const BraiderNotFound = lazy(() => import("./pages/BraiderNotFound"));

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-warm">
    <div className="animate-pulse flex flex-col items-center gap-4">
      <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      <p className="text-muted-foreground font-medium">Carregando...</p>
    </div>
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/escolher" element={<AuthChoice />} />
          <Route path="/buscar" element={<Buscar />} />
          <Route path="/favoritos" element={<Favoritos />} />
          <Route path="/trancista/:id" element={<BraiderProfile />} />
          <Route path="/trancista-nao-encontrada" element={<BraiderNotFound />} />
          <Route path="/perfil" element={<BraiderProfileEdit />} />
          <Route path="/meu-perfil" element={<MeuPerfil />} />
          <Route path="/assinatura" element={<Assinatura />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin/sugestoes" element={<AdminSuggestions />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
