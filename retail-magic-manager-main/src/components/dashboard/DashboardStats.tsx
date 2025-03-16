
import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Users, Package, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string;
  description?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
}

const StatCard = ({ title, value, description, icon, trend, trendValue, className }: StatCardProps) => (
  <div className={cn("stat-card", className, "group transition-all hover:shadow-md")}>
    <div className="flex justify-between items-start">
      <div className="flex flex-col">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <h3 className="text-2xl font-semibold mt-1 tracking-tight">{value}</h3>
      </div>
      <div className="p-2 rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
    </div>
    
    {(trend || description) && (
      <div className="mt-4 flex items-center text-xs">
        {trend && (
          <div 
            className={cn(
              "flex items-center mr-2 px-1.5 py-0.5 rounded",
              trend === 'up' && "text-green-700 bg-green-100",
              trend === 'down' && "text-red-700 bg-red-100"
            )}
          >
            {trend === 'up' ? (
              <TrendingUp className="h-3 w-3 mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 mr-1" />
            )}
            <span>{trendValue}</span>
          </div>
        )}
        {description && (
          <span className="text-muted-foreground">{description}</span>
        )}
      </div>
    )}
  </div>
);

const DashboardStats = () => {
  return (
    <div className="layout-grid">
      <StatCard
        title="Vendas do dia"
        value="R$ 1.280,00"
        description="8 vendas hoje"
        icon={<DollarSign className="h-5 w-5" />}
        trend="up"
        trendValue="12%"
      />
      <StatCard
        title="Novos clientes"
        value="5"
        description="Nos últimos 7 dias"
        icon={<Users className="h-5 w-5" />}
        trend="up"
        trendValue="8%"
      />
      <StatCard
        title="Produtos em estoque"
        value="284"
        description="24 com estoque baixo"
        icon={<Package className="h-5 w-5" />}
        trend="down"
        trendValue="3%"
      />
      <StatCard
        title="Vendas do mês"
        value="R$ 25.400,00"
        description="132 vendas no total"
        icon={<ShoppingCart className="h-5 w-5" />}
        trend="up"
        trendValue="18%"
      />
    </div>
  );
};

export default DashboardStats;
