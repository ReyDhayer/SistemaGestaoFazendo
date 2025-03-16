
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Plus, X, Search } from 'lucide-react';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

// Types
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface SaleItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  total: number;
  product: Product;
}

// Mock data
const mockProducts: Product[] = [
  { id: '1', name: 'Notebook Acer Aspire 5', price: 3299.99, stock: 15 },
  { id: '2', name: 'Mouse Logitech MX Master 3', price: 449.90, stock: 28 },
  { id: '3', name: 'Teclado Mecânico Redragon', price: 299.90, stock: 3 },
  { id: '4', name: 'Monitor LG 29" UltraWide', price: 1299.00, stock: 7 },
  { id: '5', name: 'Headset Gamer HyperX', price: 349.90, stock: 2 },
];

const mockClients: Client[] = [
  { id: '1', name: 'João Silva', email: 'joao.silva@email.com', phone: '(11) 99999-1234' },
  { id: '2', name: 'Empresa ABC Ltda', email: 'contato@abcltda.com', phone: '(11) 3333-4444' },
  { id: '3', name: 'Maria Oliveira', email: 'maria.oliveira@email.com', phone: '(21) 98888-5678' },
];

// Form schema
const saleSchema = z.object({
  clientId: z.string().min(1, { message: 'Selecione um cliente' }),
  paymentMethod: z.string().min(1, { message: 'Selecione um método de pagamento' }),
  note: z.string().optional(),
});

type SaleFormValues = z.infer<typeof saleSchema>;

interface SaleFormProps {
  onSubmit: (data: SaleFormValues, items: SaleItem[]) => void;
  isLoading?: boolean;
}

const SaleForm = ({ onSubmit, isLoading }: SaleFormProps) => {
  const [items, setItems] = useState<SaleItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);

  const form = useForm<SaleFormValues>({
    resolver: zodResolver(saleSchema),
    defaultValues: {
      clientId: '',
      paymentMethod: 'credit_card',
      note: '',
    },
  });

  const handleAddItem = () => {
    if (!selectedProduct) return;
    
    if (quantity <= 0) {
      alert('A quantidade deve ser maior que zero');
      return;
    }

    const total = selectedProduct.price * quantity;
    
    const existingItemIndex = items.findIndex(item => item.productId === selectedProduct.id);
    
    if (existingItemIndex >= 0) {
      const updatedItems = [...items];
      const updatedItem = { ...updatedItems[existingItemIndex] };
      updatedItem.quantity += quantity;
      updatedItem.total = updatedItem.unitPrice * updatedItem.quantity;
      updatedItems[existingItemIndex] = updatedItem;
      setItems(updatedItems);
    } else {
      const newItem: SaleItem = {
        productId: selectedProduct.id,
        quantity,
        unitPrice: selectedProduct.price,
        total,
        product: selectedProduct,
      };
      setItems([...items, newItem]);
    }
    
    setSelectedProduct(null);
    setQuantity(1);
    setSearchTerm('');
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  const handleSubmitForm = (data: SaleFormValues) => {
    if (items.length === 0) {
      alert('Adicione pelo menos um produto');
      return;
    }
    
    onSubmit(data, items);
  };

  const filteredProducts = mockProducts
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !items.some(item => item.productId === product.id)
    );

  const getTotal = () => {
    return items.reduce((sum, item) => sum + item.total, 0);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  };

  return (
    <div className="space-y-6 animate-slide-in">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmitForm)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value} 
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um cliente" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockClients.map(client => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Método de pagamento</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value} 
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um método de pagamento" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
                      <SelectItem value="debit_card">Cartão de Débito</SelectItem>
                      <SelectItem value="cash">Dinheiro</SelectItem>
                      <SelectItem value="pix">PIX</SelectItem>
                      <SelectItem value="bank_slip">Boleto Bancário</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Produtos</h3>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar produto
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <h4 className="font-medium">Adicionar produto</h4>
                    
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar produto..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    
                    {searchTerm.length > 0 && (
                      <div className="border rounded-md max-h-40 overflow-y-auto">
                        {filteredProducts.length > 0 ? (
                          <div className="divide-y">
                            {filteredProducts.map(product => (
                              <div 
                                key={product.id}
                                className="p-2 cursor-pointer hover:bg-secondary flex justify-between items-center"
                                onClick={() => setSelectedProduct(product)}
                              >
                                <div className="truncate">
                                  <div className="font-medium">{product.name}</div>
                                  <div className="text-sm text-muted-foreground">{formatPrice(product.price)}</div>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Estoque: {product.stock}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-2 text-center text-sm text-muted-foreground">
                            Nenhum produto encontrado
                          </div>
                        )}
                      </div>
                    )}

                    {selectedProduct && (
                      <div className="space-y-4 pt-2">
                        <div className="border rounded-md p-3 bg-secondary bg-opacity-50">
                          <div className="font-medium">{selectedProduct.name}</div>
                          <div className="text-sm text-muted-foreground">{formatPrice(selectedProduct.price)}</div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Quantidade
                          </label>
                          <Input
                            type="number"
                            min="1"
                            max={selectedProduct.stock}
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value))}
                          />
                        </div>
                        
                        <Button 
                          type="button" 
                          onClick={handleAddItem}
                          className="w-full"
                        >
                          Adicionar à venda
                        </Button>
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead className="text-right">Qtd.</TableHead>
                    <TableHead className="text-right">Preço Unit.</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.length > 0 ? (
                    items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.product.name}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">{formatPrice(item.unitPrice)}</TableCell>
                        <TableCell className="text-right">{formatPrice(item.total)}</TableCell>
                        <TableCell>
                          <Button 
                            type="button"
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleRemoveItem(index)}
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Remover</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                        Nenhum produto adicionado
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Observações (opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="Adicione uma observação sobre esta venda" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Card className="bg-accent/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Resumo da venda</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(getTotal())}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Desconto</span>
                  <span>{formatPrice(0)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <div className="w-full flex justify-between font-medium">
                <span>Total</span>
                <span className="text-lg">{formatPrice(getTotal())}</span>
              </div>
            </CardFooter>
          </Card>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline">
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || items.length === 0}>
              Finalizar venda
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SaleForm;
