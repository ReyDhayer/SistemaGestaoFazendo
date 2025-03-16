import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Clients from "./pages/Clients";
import ClientDetail from "./pages/ClientDetail";
import Sales from "./pages/Sales";
import SaleDetail from "./pages/SaleDetail";
import Settings from "./pages/Settings";
import Reports from "./pages/Reports";
import Suppliers from "./pages/Suppliers";
import SupplierDetail from "./pages/SupplierDetail";
import Tables from "./pages/Tables";
import MainLayout from "./components/layout/MainLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename="/retail-magic-manager">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
          <Route path="/products" element={<MainLayout><Products /></MainLayout>} />
          <Route path="/products/:id" element={<MainLayout><ProductDetail /></MainLayout>} />
          <Route path="/tables" element={<MainLayout><Tables /></MainLayout>} />
          <Route path="/clients" element={<MainLayout><Clients /></MainLayout>} />
          <Route path="/clients/:id" element={<MainLayout><ClientDetail /></MainLayout>} />
          <Route path="/suppliers" element={<MainLayout><Suppliers /></MainLayout>} />
          <Route path="/suppliers/:id" element={<MainLayout><SupplierDetail /></MainLayout>} />
          <Route path="/sales" element={<MainLayout><Sales /></MainLayout>} />
          <Route path="/sales/:id" element={<MainLayout><SaleDetail /></MainLayout>} />
          <Route path="/reports" element={<MainLayout><Reports /></MainLayout>} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
