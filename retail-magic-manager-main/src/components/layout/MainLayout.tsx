import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingCart, 
  BarChart, 
  Settings, 
  Menu, 
  X,
  Truck,
  Utensils
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarLinkProps {
  to: string;
  icon: React.ElementType;
  children: React.ReactNode;
  isActive: boolean;
  onClick?: () => void;
}

const SidebarLink = ({ to, icon: Icon, children, isActive, onClick }: SidebarLinkProps) => (
  <Link
    to={to}
    className={cn(
      "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 group",
      isActive 
        ? "bg-accent text-accent-foreground font-medium" 
        : "text-foreground/70 hover:bg-secondary"
    )}
    onClick={onClick}
  >
    <Icon className={cn(
      "h-5 w-5 transition-all",
      isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
    )} />
    <span>{children}</span>
  </Link>
);

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar - mobile only */}
      <header className="md:hidden bg-background border-b px-4 h-14 flex items-center justify-between">
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-secondary"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex-1 flex justify-center">
          <h1 className="text-lg font-semibold tracking-tight">PDV System</h1>
        </div>
        <div className="w-8"></div> {/* Placeholder to center the title */}
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside 
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 bg-background border-r shadow-sm transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {/* Mobile sidebar header */}
          <div className="md:hidden flex items-center justify-between h-14 px-4 border-b">
            <h1 className="text-lg font-semibold tracking-tight">PDV System</h1>
            <button 
              onClick={closeSidebar}
              className="p-2 rounded-md hover:bg-secondary"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Desktop sidebar header */}
          <div className="hidden md:flex items-center h-14 px-6">
            <h1 className="text-lg font-semibold tracking-tight">PDV System</h1>
          </div>

          {/* Sidebar content */}
          <nav className="p-4 space-y-1">
            <SidebarLink 
              to="/" 
              icon={LayoutDashboard} 
              isActive={location.pathname === '/'} 
              onClick={closeSidebar}
            >
              Dashboard
            </SidebarLink>
            <SidebarLink 
              to="/products" 
              icon={Package} 
              isActive={location.pathname.startsWith('/products')} 
              onClick={closeSidebar}
            >
              Produtos
            </SidebarLink>
            <SidebarLink 
              to="/tables" 
              icon={Utensils} 
              isActive={location.pathname.startsWith('/tables')} 
              onClick={closeSidebar}
            >
              Mesas
            </SidebarLink>
            <SidebarLink 
              to="/clients" 
              icon={Users} 
              isActive={location.pathname.startsWith('/clients')} 
              onClick={closeSidebar}
            >
              Clientes
            </SidebarLink>
            <SidebarLink 
              to="/suppliers" 
              icon={Truck} 
              isActive={location.pathname.startsWith('/suppliers')} 
              onClick={closeSidebar}
            >
              Fornecedores
            </SidebarLink>
            <SidebarLink 
              to="/sales" 
              icon={ShoppingCart} 
              isActive={location.pathname.startsWith('/sales')} 
              onClick={closeSidebar}
            >
              Vendas
            </SidebarLink>
            <SidebarLink 
              to="/reports" 
              icon={BarChart} 
              isActive={location.pathname.startsWith('/reports')} 
              onClick={closeSidebar}
            >
              Relatórios
            </SidebarLink>
            <SidebarLink 
              to="/settings" 
              icon={Settings} 
              isActive={location.pathname.startsWith('/settings')} 
              onClick={closeSidebar}
            >
              Configurações
            </SidebarLink>
          </nav>
        </aside>

        {/* Backdrop - mobile only */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            onClick={closeSidebar}
          />
        )}

        {/* Main content */}
        <main className="flex-1 overflow-auto p-6 md:p-8 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
