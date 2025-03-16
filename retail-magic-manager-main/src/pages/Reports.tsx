import * as React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Calendar as CalendarIcon,
  FileSpreadsheet,
  FileText, 
  SlidersHorizontal,
  Target,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  DollarSign,
  Receipt,
  Percent,
  Search
} from "lucide-react";
import { 
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line, 
  PieChart,
  Pie, 
  Cell,
  XAxis, 
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import PageHeader from "@/components/common/PageHeader";
import { cn } from "@/lib/utils";

import {
  SalesData,
  StockData,
  ProductData,
  FinancialData,
  ReportType,
  PeriodType,
  OrderDirection,
  OrderBy
} from "@/types/reports";

const salesData: SalesData[] = [
  { month: 'Jan', receitas: 4000, despesas: 2400 },
  { month: 'Fev', receitas: 3000, despesas: 1398 },
  { month: 'Mar', receitas: 2000, despesas: 9800 },
  { month: 'Abr', receitas: 2780, despesas: 3908 },
  { month: 'Mai', receitas: 1890, despesas: 4800 },
  { month: 'Jun', receitas: 2390, despesas: 3800 },
  { month: 'Jul', receitas: 3490, despesas: 4300 },
];

const stockData: StockData[] = [
  { name: 'Eletrônicos', value: 400, percentage: 40 },
  { name: 'Móveis', value: 300, percentage: 30 },
  { name: 'Decoração', value: 200, percentage: 20 },
  { name: 'Outros', value: 100, percentage: 10 },
];

const productData: ProductData[] = [
  { id: 1, name: 'Smart TV 55"', category: 'Eletrônicos', stock: 15, sales: 8, value: 2999.90 },
  { id: 2, name: 'Sofá 3 Lugares', category: 'Móveis', stock: 5, sales: 2, value: 1899.90 },
  { id: 3, name: 'Vaso Decorativo', category: 'Decoração', stock: 30, sales: 12, value: 89.90 },
  { id: 4, name: 'Notebook', category: 'Eletrônicos', stock: 10, sales: 6, value: 3499.90 },
  { id: 5, name: 'Mesa de Jantar', category: 'Móveis', stock: 8, sales: 3, value: 1299.90 },
  { id: 6, name: 'Quadro Abstrato', category: 'Decoração', stock: 20, sales: 7, value: 199.90 },
  { id: 7, name: 'Smartphone', category: 'Eletrônicos', stock: 25, sales: 15, value: 1999.90 },
  { id: 8, name: 'Poltrona', category: 'Móveis', stock: 12, sales: 4, value: 899.90 },
  { id: 9, name: 'Luminária', category: 'Decoração', stock: 18, sales: 9, value: 159.90 },
  { id: 10, name: 'Tablet', category: 'Eletrônicos', stock: 20, sales: 10, value: 1499.90 },
];

const mockFinancialData: FinancialData[] = [
  { id: 1, date: '2024-03-15', type: 'income', description: 'Venda Smart TV', value: 2999.90 },
  { id: 2, date: '2024-03-15', type: 'expense', description: 'Aluguel Loja', value: 3500.00 },
  { id: 3, date: '2024-03-14', type: 'income', description: 'Venda Notebook', value: 3499.90 },
  { id: 4, date: '2024-03-14', type: 'expense', description: 'Energia Elétrica', value: 850.00 },
  { id: 5, date: '2024-03-13', type: 'income', description: 'Venda Smartphone', value: 1999.90 },
  { id: 6, date: '2024-03-13', type: 'expense', description: 'Salários', value: 8500.00 },
  { id: 7, date: '2024-03-12', type: 'income', description: 'Venda Sofá', value: 1899.90 },
  { id: 8, date: '2024-03-12', type: 'expense', description: 'Marketing', value: 1200.00 },
  { id: 9, date: '2024-03-11', type: 'income', description: 'Venda Mesa', value: 1299.90 },
  { id: 10, date: '2024-03-11', type: 'expense', description: 'Internet', value: 250.00 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const mockMetas = {
  vendas: { atual: 124750, meta: 150000, anterior: 111500 },
  lucro: { atual: 52480, meta: 60000, anterior: 48500 },
  ticket: { atual: 185, meta: 200, anterior: 176 },
  estoque: { atual: 89750, meta: 100000, anterior: 95000 }
};

export default function Reports() {
  const [selectedPeriod, setSelectedPeriod] = React.useState<PeriodType>('month');
  const [date, setDate] = React.useState<Date>(new Date());
  const [reportType, setReportType] = React.useState<ReportType>('overview');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [transactionType, setTransactionType] = React.useState<'income' | 'expense' | 'all'>('all');
  const [orderBy, setOrderBy] = React.useState<OrderBy>('date');
  const [orderDirection, setOrderDirection] = React.useState<OrderDirection>('desc');
  const [showAdvancedFilters, setShowAdvancedFilters] = React.useState(false);
  const [categoria, setCategoria] = React.useState('todas');

  const formatDate = React.useCallback((date: Date | string) => {
    return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR });
  }, []);

  const formatDateLong = React.useCallback((date: Date | string) => {
    return format(new Date(date), 'PPP', { locale: ptBR });
  }, []);

  const handleExport = React.useCallback((format: 'excel' | 'pdf') => {
    console.log(`Exportando relatório em formato ${format}`);
  }, []);

  const handlePeriodChange = React.useCallback((value: PeriodType) => {
    setSelectedPeriod(value);
  }, []);

  const handleTransactionTypeChange = React.useCallback((value: 'income' | 'expense' | 'all') => {
    setTransactionType(value);
  }, []);

  const handleReportTypeChange = React.useCallback((value: ReportType) => {
    setReportType(value);
  }, []);

  const handleOrderByChange = React.useCallback((value: OrderBy) => {
    setOrderBy(value);
  }, []);

  const handleOrderDirectionChange = React.useCallback((value: OrderDirection) => {
    setOrderDirection(value);
  }, []);

  const renderOverviewReport = React.useCallback(() => {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vendas Totais</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 45.231,89</div>
              <Badge variant="success" className="mt-2">+12% vs período anterior</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 189,50</div>
              <Badge variant="success" className="mt-2">+5% vs período anterior</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lucro Líquido</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 32.688,68</div>
              <Badge variant="success" className="mt-2">+15% vs período anterior</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Margem de Lucro</CardTitle>
              <Percent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">72.3%</div>
              <Badge variant="success" className="mt-2">+3% vs período anterior</Badge>
            </CardContent>
          </Card>
          </div>

        <div className="grid gap-4 md:grid-cols-2">
            <Card>
            <CardHeader>
              <CardTitle>Desempenho de Vendas</CardTitle>
              <CardDescription>Evolução das vendas no período</CardDescription>
              </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="receitas" 
                    stroke="#10b981" 
                    name="Receitas"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Distribuição do Estoque</CardTitle>
              <CardDescription>Por categoria</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stockData}
                    dataKey="value"
                    nameKey="name"
                      cx="50%"
                      cy="50%"
                    outerRadius={100}
                      fill="#8884d8"
                  >
                    {stockData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={['#0ea5e9', '#6366f1', '#8b5cf6', '#f43f5e'][index % 4]} 
                      />
                      ))}
                    </Pie>
                  <Tooltip />
                    <Legend />
                </PieChart>
              </ResponsiveContainer>
              </CardContent>
            </Card>
        </div>
      </div>
    );
  }, []);

  const renderSalesReport = React.useCallback(() => {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vendas no Período</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 45.231,89</div>
              <p className="text-xs text-muted-foreground">239 vendas realizadas</p>
              </CardContent>
            </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Média Diária</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 1.507,73</div>
              <p className="text-xs text-muted-foreground">8 vendas/dia</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">35%</div>
              <Badge variant="success" className="mt-2">+2% vs período anterior</Badge>
            </CardContent>
          </Card>
          </div>

        <div className="grid gap-4 md:grid-cols-2">
            <Card>
            <CardHeader>
              <CardTitle>Vendas por Categoria</CardTitle>
              <CardDescription>Distribuição das vendas</CardDescription>
              </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stockData}>
                  <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Evolução das Vendas</CardTitle>
              <CardDescription>Últimos 30 dias</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="receitas" 
                    stroke="#8884d8" 
                    name="Vendas"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Histórico de Vendas</CardTitle>
                <CardDescription>Detalhamento das vendas no período</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Buscar produto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-[250px]"
                />
                <Select value={categoria} onValueChange={setCategoria}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
                    <SelectItem value="Eletrônicos">Eletrônicos</SelectItem>
                    <SelectItem value="Móveis">Móveis</SelectItem>
                    <SelectItem value="Decoração">Decoração</SelectItem>
                    <SelectItem value="Outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-right">Quantidade</TableHead>
                  <TableHead className="text-right">Preço Unit.</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productData
                  .filter(product => 
                    (categoria === 'todas' || product.category === categoria) &&
                    (searchTerm === '' || 
                      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      product.category.toLowerCase().includes(searchTerm.toLowerCase()))
                  )
                  .map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell className="text-right">{product.sales}</TableCell>
                      <TableCell className="text-right">R$ {product.value.toFixed(2)}</TableCell>
                      <TableCell className="text-right">R$ {(product.sales * product.value).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
          </div>
    );
  }, [searchTerm, categoria]);

  const renderStockReport = React.useCallback(() => {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor em Estoque</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 124.750,00</div>
              <p className="text-xs text-muted-foreground">850 itens em estoque</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Giro de Estoque</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.2x</div>
              <Badge variant="success" className="mt-2">+0.3x vs período anterior</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Itens Críticos</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <Badge variant="destructive" className="mt-2">Reposição necessária</Badge>
              </CardContent>
            </Card>
          </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição do Estoque</CardTitle>
              <CardDescription>Por categoria</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stockData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                  >
                    {stockData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#0ea5e9', '#6366f1', '#8b5cf6', '#f43f5e'][index % 4]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Valor em Estoque</CardTitle>
              <CardDescription>Por categoria</CardDescription>
            </CardHeader>
            <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Categoria</TableHead>
              <TableHead className="text-right">Quantidade</TableHead>
                    <TableHead className="text-right">Participação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
                  {stockData.map((item) => (
                    <TableRow key={item.name}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell className="text-right">{item.value}</TableCell>
                      <TableCell className="text-right">{item.percentage}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
            </CardContent>
          </Card>
      </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Produtos em Estoque</CardTitle>
                <CardDescription>Lista completa de produtos</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Buscar produto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-[250px]"
                />
                <Select value={categoria} onValueChange={setCategoria}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
                    <SelectItem value="Eletrônicos">Eletrônicos</SelectItem>
                    <SelectItem value="Móveis">Móveis</SelectItem>
                    <SelectItem value="Decoração">Decoração</SelectItem>
                    <SelectItem value="Outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produto</TableHead>
              <TableHead>Categoria</TableHead>
                  <TableHead className="text-right">Em Estoque</TableHead>
                  <TableHead className="text-right">Vendas</TableHead>
                  <TableHead className="text-right">Valor Unit.</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
                {productData
                  .filter(product => 
                    (categoria === 'todas' || product.category === categoria) &&
                    (searchTerm === '' || 
                      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      product.category.toLowerCase().includes(searchTerm.toLowerCase()))
                  )
                  .map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell className="text-right">{product.stock}</TableCell>
                      <TableCell className="text-right">{product.sales}</TableCell>
                      <TableCell className="text-right">R$ {product.value.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
          </CardContent>
        </Card>
      </div>
    );
  }, [searchTerm, categoria]);

  const renderFinancialReport = React.useCallback(() => {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
              <div className="text-2xl font-bold">R$ 45.231,89</div>
              <Badge variant="success" className="mt-2">+12% vs período anterior</Badge>
              </CardContent>
            </Card>

            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Despesas</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
              <div className="text-2xl font-bold">R$ 12.543,21</div>
              <Badge variant="warning" className="mt-2">+5% vs período anterior</Badge>
              </CardContent>
            </Card>

            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lucro Líquido</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
              <div className="text-2xl font-bold">R$ 32.688,68</div>
              <Badge variant="success" className="mt-2">+15% vs período anterior</Badge>
              </CardContent>
            </Card>

            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Margem de Lucro</CardTitle>
              <Percent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
              <div className="text-2xl font-bold">72.3%</div>
              <Badge variant="success" className="mt-2">+3% vs período anterior</Badge>
              </CardContent>
            </Card>
          </div>

        <div className="grid gap-4 md:grid-cols-2">
            <Card>
            <CardHeader>
              <CardTitle>Fluxo de Caixa</CardTitle>
              <CardDescription>Entradas e saídas no período</CardDescription>
              </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                    <YAxis />
                  <Tooltip />
                    <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="receitas" 
                    stackId="1"
                    stroke="#10b981" 
                    fill="#10b981"
                    name="Receitas"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="despesas" 
                    stackId="1"
                    stroke="#f43f5e" 
                    fill="#f43f5e"
                    name="Despesas"
                  />
                </AreaChart>
              </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
            <CardHeader>
              <CardTitle>Distribuição de Despesas</CardTitle>
              <CardDescription>Por categoria</CardDescription>
              </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stockData}
                    dataKey="value"
                    nameKey="name"
                      cx="50%"
                      cy="50%"
                    outerRadius={100}
                      fill="#8884d8"
                  >
                    {stockData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={['#0ea5e9', '#6366f1', '#8b5cf6', '#f43f5e'][index % 4]} 
                      />
                      ))}
                    </Pie>
                  <Tooltip />
                    <Legend />
                </PieChart>
              </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Movimentações Financeiras</CardTitle>
                <CardDescription>Histórico detalhado de transações</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Buscar transação..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-[250px]"
                />
                <Select 
                  value={transactionType}
                  onValueChange={handleTransactionTypeChange}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="income">Receitas</SelectItem>
                    <SelectItem value="expense">Despesas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
                  <TableHead>Descrição</TableHead>
              <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
                {mockFinancialData
                  .filter(item => 
                    (transactionType === 'all' || item.type === transactionType) &&
                    (searchTerm === '' || 
                      item.description.toLowerCase().includes(searchTerm.toLowerCase()))
                  )
                  .map((item) => (
              <TableRow key={item.id}>
                      <TableCell>{formatDate(item.date)}</TableCell>
                      <TableCell>{item.description}</TableCell>
                <TableCell>
                        <Badge 
                          variant={item.type === 'income' ? 'success' : 'destructive'}
                        >
                          {item.type === 'income' ? 'Receita' : 'Despesa'}
                        </Badge>
                </TableCell>
                      <TableCell className="text-right">
                        R$ {item.value.toFixed(2)}
                      </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
          </CardContent>
        </Card>
      </div>
    );
  }, [searchTerm, transactionType, handleTransactionTypeChange]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="Relatórios" 
        description="Visualize e analise os dados do seu negócio"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('excel')}
            >
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Excel
                  </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('pdf')}
            >
                    <FileText className="h-4 w-4 mr-2" />
                    PDF
              </Button>
            </div>
        }
      />

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Select
            value={selectedPeriod}
            onValueChange={handlePeriodChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione o período" />
                </SelectTrigger>
                <SelectContent>
              <SelectItem value="day">Hoje</SelectItem>
              <SelectItem value="week">Esta semana</SelectItem>
              <SelectItem value="month">Este mês</SelectItem>
              <SelectItem value="year">Este ano</SelectItem>
                </SelectContent>
              </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? formatDateLong(date) : <span>Selecione uma data</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => date && setDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
              </div>

        {showAdvancedFilters && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Select value={orderBy} onValueChange={handleOrderByChange}>
                  <SelectTrigger>
                <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                <SelectItem value="date">Data</SelectItem>
                <SelectItem value="value">Valor</SelectItem>
                <SelectItem value="name">Nome</SelectItem>
                  </SelectContent>
                </Select>

            <Select value={orderDirection} onValueChange={handleOrderDirectionChange}>
                  <SelectTrigger>
                <SelectValue placeholder="Direção" />
                  </SelectTrigger>
                  <SelectContent>
                <SelectItem value="asc">Crescente</SelectItem>
                <SelectItem value="desc">Decrescente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
        )}

        <Tabs value={reportType} onValueChange={handleReportTypeChange}>
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="sales">Vendas</TabsTrigger>
            <TabsTrigger value="stock">Estoque</TabsTrigger>
            <TabsTrigger value="financial">Financeiro</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            {renderOverviewReport()}
          </TabsContent>
          <TabsContent value="sales">
            {renderSalesReport()}
          </TabsContent>
          <TabsContent value="stock">
            {renderStockReport()}
          </TabsContent>
          <TabsContent value="financial">
            {renderFinancialReport()}
          </TabsContent>
        </Tabs>
              </div>
    </div>
  );
}
