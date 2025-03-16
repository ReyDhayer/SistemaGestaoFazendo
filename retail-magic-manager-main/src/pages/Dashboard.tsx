
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/common/PageHeader';
import DashboardStats from '@/components/dashboard/DashboardStats';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { ShoppingCart, ArrowRight, Package, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  // Mock data for recent sales
  const recentSales = [
    { id: '1', client: 'João Silva', date: '2023-05-25 14:30', total: 3749.89 },
    { id: '2', client: 'Empresa ABC Ltda', date: '2023-05-25 10:15', total: 1299.00 },
    { id: '3', client: 'Maria Oliveira', date: '2023-05-24 16:45', total: 649.80 },
  ];

  // Mock data for low stock products
  const lowStockProducts = [
    { id: '3', name: 'Teclado Mecânico Redragon', stock: 3, minStock: 5 },
    { id: '5', name: 'Headset Gamer HyperX', stock: 2, minStock: 5 },
    { id: '8', name: 'Câmera Canon EOS Rebel', stock: 4, minStock: 5 },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  };

  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-in">
        <PageHeader 
          title="Dashboard" 
          description="Visão geral do seu negócio"
        />

        <DashboardStats />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Vendas recentes</CardTitle>
                  <CardDescription>Últimas transações realizadas</CardDescription>
                </div>
                <Link to="/sales">
                  <Button variant="ghost" size="sm" className="gap-1">
                    Ver todas
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pedido</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentSales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                          #{sale.id}
                        </div>
                      </TableCell>
                      <TableCell>{sale.client}</TableCell>
                      <TableCell className="text-right">{formatPrice(sale.total)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Estoque baixo</CardTitle>
                  <CardDescription>Produtos que precisam de reposição</CardDescription>
                </div>
                <Link to="/products">
                  <Button variant="ghost" size="sm" className="gap-1">
                    Ver todos
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead className="text-right">Estoque</TableHead>
                    <TableHead className="text-right">Mínimo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lowStockProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          {product.name}
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-destructive">{product.stock}</TableCell>
                      <TableCell className="text-right">{product.minStock}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Desempenho de Vendas</CardTitle>
                <CardDescription>Últimos 7 dias</CardDescription>
              </div>
              <Link to="/reports">
                <Button variant="ghost" size="sm" className="gap-1">
                  Ver relatórios
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[200px] flex items-center justify-center p-4">
              <div className="text-center flex flex-col items-center space-y-3 text-muted-foreground">
                <BarChart2 className="h-16 w-16" />
                <p>Dados de vendas serão exibidos aqui</p>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/reports">
                    Gerar relatórios
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
