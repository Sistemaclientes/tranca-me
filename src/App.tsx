import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";

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
          <Route path="/" element={<Suspense fallback={<LoadingFallback />}><Index /></Suspense>} />
          <Route path="/auth" element={<Suspense fallback={<LoadingFallback />}><Auth /></Suspense>} />
          <Route path="/escolher" element={<Suspense fallback={<LoadingFallback />}><AuthChoice /></Suspense>} />
          <Route path="/buscar" element={<Suspense fallback={<LoadingFallback />}><Buscar /></Suspense>} />
          <Route path="/favoritos" element={<Suspense fallback={<LoadingFallback />}><Favoritos /></Suspense>} />
          <Route path="/trancista/:id" element={<Suspense fallback={<LoadingFallback />}><BraiderProfile /></Suspense>} />
          <Route path="/trancista-nao-encontrada" element={<Suspense fallback={<LoadingFallback />}><BraiderNotFound /></Suspense>} />
          <Route path="/perfil" element={<Suspense fallback={<LoadingFallback />}><BraiderProfileEdit /></Suspense>} />
          <Route path="/meu-perfil" element={<Suspense fallback={<LoadingFallback />}><MeuPerfil /></Suspense>} />
          <Route path="/assinatura" element={<Suspense fallback={<LoadingFallback />}><Assinatura /></Suspense>} />
          <Route path="/checkout" element={<Suspense fallback={<LoadingFallback />}><Checkout /></Suspense>} />
          <Route path="/admin/sugestoes" element={<Suspense fallback={<LoadingFallback />}><AdminSuggestions /></Suspense>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<Suspense fallback={<LoadingFallback />}><NotFound /></Suspense>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
