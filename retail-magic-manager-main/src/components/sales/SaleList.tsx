
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  User, 
  Calendar, 
  Tag 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Sale {
  id: string;
  date: string;
  client: {
    id: string;
    name: string;
  };
  total: number;
  items: number;
  status: 'completed' | 'pending' | 'canceled';
  paymentMethod: string;
}

// Mock data
const mockSales: Sale[] = [
  { 
    id: '1', 
    date: '2023-05-25T14:30:00', 
    client: { id: '1', name: 'João Silva' }, 
    total: 3749.89, 
    items: 2, 
    status: 'completed',
    paymentMethod: 'credit_card'
  },
  { 
    id: '2', 
    date: '2023-05-25T10:15:00', 
    client: { id: '2', name: 'Empresa ABC Ltda' }, 
    total: 1299.00, 
    items: 1, 
    status: 'completed',
    paymentMethod: 'bank_slip'
  },
  { 
    id: '3', 
    date: '2023-05-24T16:45:00', 
    client: { id: '3', name: 'Maria Oliveira' }, 
    total: 649.80, 
    items: 2, 
    status: 'completed',
    paymentMethod: 'pix'
  },
  { 
    id: '4', 
    date: '2023-05-24T09:30:00', 
    client: { id: '4', name: 'Pedro Santos' }, 
    total: 2599.90, 
    items: 3, 
    status: 'pending',
    paymentMethod: 'bank_slip'
  },
  { 
    id: '5', 
    date: '2023-05-23T11:20:00', 
    client: { id: '5', name: 'Tech Solutions Inc' }, 
    total: 4998.00, 
    items: 4, 
    status: 'canceled',
    paymentMethod: 'credit_card'
  },
  { 
    id: '6', 
    date: '2023-05-23T15:10:00', 
    client: { id: '6', name: 'Ana Costa' }, 
    total: 349.90, 
    items: 1, 
    status: 'completed',
    paymentMethod: 'cash'
  },
  { 
    id: '7', 
    date: '2023-05-22T13:40:00', 
    client: { id: '7', name: 'Carlos Mendes' }, 
    total: 1299.00, 
    items: 1, 
    status: 'completed',
    paymentMethod: 'debit_card'
  },
];

interface SortConfig {
  key: keyof Sale | 'client.name';
  direction: 'asc' | 'desc';
}

const SaleList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'date', direction: 'desc' });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (key: keyof Sale | 'client.name') => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'credit_card': return 'Cartão de Crédito';
      case 'debit_card': return 'Cartão de Débito';
      case 'cash': return 'Dinheiro';
      case 'pix': return 'PIX';
      case 'bank_slip': return 'Boleto';
      default: return method;
    }
  };

  // Filter and sort sales
  const filteredSales = mockSales
    .filter(sale => 
      sale.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.id.includes(searchTerm) ||
      formatDate(sale.date).includes(searchTerm) ||
      getPaymentMethodLabel(sale.paymentMethod).toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortConfig.key === 'client.name') {
        const aValue = a.client.name;
        const bValue = b.client.name;
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      } else {
        const aValue = a[sortConfig.key as keyof Sale];
        const bValue = b[sortConfig.key as keyof Sale];
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      }
    });

  return (
    <div className="space-y-4 animate-slide-in">
      <div className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar vendas..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-9"
          />
        </div>
      </div>

      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('id')}
              >
                <div className="flex items-center">
                  Pedido
                  {sortConfig.key === 'id' && (
                    sortConfig.direction === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center">
                  Data
                  {sortConfig.key === 'date' && (
                    sortConfig.direction === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('client.name')}
              >
                <div className="flex items-center">
                  Cliente
                  {sortConfig.key === 'client.name' && (
                    sortConfig.direction === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead className="hidden md:table-cell">
                Pagamento
              </TableHead>
              <TableHead 
                className="cursor-pointer text-right"
                onClick={() => handleSort('total')}
              >
                <div className="flex items-center justify-end">
                  Total
                  {sortConfig.key === 'total' && (
                    sortConfig.direction === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSales.length > 0 ? (
              filteredSales.map((sale) => (
                <TableRow key={sale.id} className="group">
                  <TableCell>
                    <div className="flex items-center">
                      <ShoppingCart className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="font-medium">#{sale.id}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{formatDate(sale.date)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      <Link 
                        to={`/clients/${sale.client.id}`}
                        className="hover:text-primary transition-colors"
                      >
                        {sale.client.name}
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center">
                      <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{getPaymentMethodLabel(sale.paymentMethod)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatPrice(sale.total)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        sale.status === 'completed' ? 'default' :
                        sale.status === 'pending' ? 'outline' : 'destructive'
                      }
                      className="font-normal"
                    >
                      {sale.status === 'completed' ? 'Concluído' :
                       sale.status === 'pending' ? 'Pendente' : 'Cancelado'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" asChild>
                      <Link to={`/sales/${sale.id}`}>
                        <FileText className="h-4 w-4" />
                        <span className="sr-only">Detalhes</span>
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Nenhuma venda encontrada
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SaleList;
