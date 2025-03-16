import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
import MainLayout from "./components/layout/MainLayout";
import Login from './pages/Login';
import './App.css';

const queryClient = new QueryClient();

const App = () => {
  // Simulando autenticação - em um app real, isso viria de um contexto/estado
  const isAuthenticated = true;

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            {/* Rotas protegidas */}
            <Route 
              path="/" 
              element={
                isAuthenticated ? (
                  <MainLayout>
                    <Dashboard />
                  </MainLayout>
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            
            <Route 
              path="/products" 
              element={
                isAuthenticated ? (
                  <MainLayout>
                    <Products />
                  </MainLayout>
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            
            <Route 
              path="/products/:id" 
              element={
                isAuthenticated ? (
                  <MainLayout>
                    <ProductDetail />
                  </MainLayout>
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            
            <Route 
              path="/clients" 
              element={
                isAuthenticated ? (
                  <MainLayout>
                    <Clients />
                  </MainLayout>
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            
            <Route 
              path="/clients/:id" 
              element={
                isAuthenticated ? (
                  <MainLayout>
                    <ClientDetail />
                  </MainLayout>
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            
            <Route 
              path="/suppliers" 
              element={
                isAuthenticated ? (
                  <MainLayout>
                    <Suppliers />
                  </MainLayout>
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            
            <Route 
              path="/suppliers/:id" 
              element={
                isAuthenticated ? (
                  <MainLayout>
                    <SupplierDetail />
                  </MainLayout>
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            
            <Route 
              path="/sales" 
              element={
                isAuthenticated ? (
                  <MainLayout>
                    <Sales />
                  </MainLayout>
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            
            <Route 
              path="/sales/:id" 
              element={
                isAuthenticated ? (
                  <MainLayout>
                    <SaleDetail />
                  </MainLayout>
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            
            <Route 
              path="/reports" 
              element={
                isAuthenticated ? (
                  <MainLayout>
                    <Reports />
                  </MainLayout>
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            
            <Route 
              path="/settings" 
              element={
                isAuthenticated ? (
                  <MainLayout>
                    <Settings />
                  </MainLayout>
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            
            {/* Rota de fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
