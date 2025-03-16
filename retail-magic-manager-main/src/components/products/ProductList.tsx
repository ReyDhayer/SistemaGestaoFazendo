
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Edit, 
  Trash, 
  AlertTriangle 
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

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  lowStock: boolean;
}

// Mock data
const mockProducts: Product[] = [
  { id: '1', name: 'Notebook Acer Aspire 5', price: 3299.99, stock: 15, category: 'Eletrônicos', lowStock: false },
  { id: '2', name: 'Mouse Logitech MX Master 3', price: 449.90, stock: 28, category: 'Periféricos', lowStock: false },
  { id: '3', name: 'Teclado Mecânico Redragon', price: 299.90, stock: 3, category: 'Periféricos', lowStock: true },
  { id: '4', name: 'Monitor LG 29" UltraWide', price: 1299.00, stock: 7, category: 'Monitores', lowStock: false },
  { id: '5', name: 'Headset Gamer HyperX', price: 349.90, stock: 2, category: 'Áudio', lowStock: true },
  { id: '6', name: 'Smartphone Samsung Galaxy S21', price: 3999.00, stock: 12, category: 'Celulares', lowStock: false },
  { id: '7', name: 'Impressora HP Laser', price: 1899.90, stock: 5, category: 'Impressoras', lowStock: false },
  { id: '8', name: 'Câmera Canon EOS Rebel', price: 2499.00, stock: 4, category: 'Fotografia', lowStock: true },
];

interface SortConfig {
  key: keyof Product;
  direction: 'asc' | 'desc';
}

interface ProductListProps {
  onDelete?: (id: string) => void;
}

const ProductList = ({ onDelete }: ProductListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: 'asc' });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (key: keyof Product) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  };

  // Filter and sort products
  const filteredProducts = mockProducts
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

  return (
    <div className="space-y-4 animate-slide-in">
      <div className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar produtos..."
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
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center">
                  Produto
                  {sortConfig.key === 'name' && (
                    sortConfig.direction === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('price')}
              >
                <div className="flex items-center">
                  Preço
                  {sortConfig.key === 'price' && (
                    sortConfig.direction === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('stock')}
              >
                <div className="flex items-center">
                  Estoque
                  {sortConfig.key === 'stock' && (
                    sortConfig.direction === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('category')}
              >
                <div className="flex items-center">
                  Categoria
                  {sortConfig.key === 'category' && (
                    sortConfig.direction === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <TableRow key={product.id} className="group">
                  <TableCell>
                    <div className="flex items-center">
                      <Package className="h-4 w-4 mr-2 text-muted-foreground" />
                      <Link 
                        to={`/products/${product.id}`}
                        className="font-medium hover:text-primary transition-colors"
                      >
                        {product.name}
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell>{formatPrice(product.price)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className={cn(
                        product.lowStock ? "text-destructive" : "text-foreground"
                      )}>
                        {product.stock}
                      </span>
                      {product.lowStock && (
                        <AlertTriangle className="h-4 w-4 ml-2 text-destructive" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-normal">
                      {product.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/products/${product.id}/edit`}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Link>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => onDelete?.(product.id)}
                      >
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Excluir</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Nenhum produto encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ProductList;
