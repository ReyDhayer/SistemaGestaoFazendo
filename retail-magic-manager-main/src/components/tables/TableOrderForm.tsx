import React, { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableOrder, OrderItem } from '@/types/tables';
import { Loader2, Plus, Trash2 } from 'lucide-react';

interface TableOrderFormProps {
  table: Table;
  initialOrder: TableOrder | null;
  onComplete: () => void;
}

const orderItemSchema = z.object({
  productId: z.coerce.number().int().positive("Selecione um produto"),
  productName: z.string().min(1, "Nome do produto é obrigatório"),
  quantity: z.coerce.number().int().positive("A quantidade deve ser positiva"),
  unitPrice: z.coerce.number().positive("O preço deve ser positivo"),
  notes: z.string().optional(),
});

const formSchema = z.object({
  items: z.array(orderItemSchema).min(1, "Adicione pelo menos um item ao pedido"),
});

export function TableOrderForm({ table, initialOrder, onComplete }: TableOrderFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<{ id: number; name: string; price: number }[]>([]);

  useEffect(() => {
    // Simulação de carregamento de produtos
    // Em um caso real, você buscaria os produtos da API
    setProducts([
      { id: 101, name: 'Filé Mignon', price: 45.90 },
      { id: 102, name: 'Picanha', price: 52.90 },
      { id: 103, name: 'Frango Grelhado', price: 32.90 },
      { id: 104, name: 'Salmão', price: 48.90 },
      { id: 105, name: 'Pizza Margherita', price: 35.90 },
      { id: 201, name: 'Água Mineral', price: 4.50 },
      { id: 202, name: 'Refrigerante', price: 6.50 },
      { id: 203, name: 'Suco Natural', price: 8.90 },
      { id: 204, name: 'Cerveja', price: 9.90 },
      { id: 301, name: 'Pudim', price: 12.90 },
      { id: 302, name: 'Sorvete', price: 10.90 },
      { id: 303, name: 'Petit Gateau', price: 15.90 },
    ]);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      items: initialOrder?.items.map(item => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        notes: item.notes || '',
      })) || [],
    },
  });

  const { fields, append, remove } = form.control._formValues.items;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      
      // Simulação de envio para API
      // Em um caso real, você enviaria os dados para a API
      console.log('Enviando pedido:', values);
      
      // Simular um delay para mostrar o loading
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onComplete();
    } catch (error) {
      console.error("Erro ao salvar pedido:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addItem = () => {
    append({
      productId: 0,
      productName: '',
      quantity: 1,
      unitPrice: 0,
      notes: '',
    });
  };

  const handleProductChange = (productId: number, index: number) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      const items = [...form.getValues().items];
      items[index] = {
        ...items[index],
        productId: product.id,
        productName: product.name,
        unitPrice: product.price,
      };
      form.setValue('items', items);
    }
  };

  const calculateTotal = () => {
    return form.getValues().items.reduce((total, item) => {
      return total + (item.quantity * item.unitPrice);
    }, 0);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Mesa {table.number} - {table.name}</h3>
            <Button type="button" onClick={addItem} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Item
            </Button>
          </div>

          {fields && fields.length > 0 ? (
            <div className="space-y-4">
              {fields.map((field, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-medium">Item {index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`items.${index}.productId`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Produto</FormLabel>
                            <Select
                              onValueChange={(value) => {
                                field.onChange(parseInt(value));
                                handleProductChange(parseInt(value), index);
                              }}
                              defaultValue={field.value.toString()}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione um produto" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {products.map((product) => (
                                  <SelectItem key={product.id} value={product.id.toString()}>
                                    {product.name} - R$ {product.price.toFixed(2)}
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
                        name={`items.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantidade</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} min={1} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`items.${index}.notes`}
                        render={({ field }) => (
                          <FormItem className="col-span-2">
                            <FormLabel>Observações</FormLabel>
                            <FormControl>
                              <Textarea {...field} placeholder="Ex: Sem cebola, bem passado, etc." />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="mt-4 text-right">
                      <p className="text-sm text-muted-foreground">
                        Preço unitário: R$ {form.getValues().items[index]?.unitPrice.toFixed(2) || '0.00'}
                      </p>
                      <p className="font-medium">
                        Subtotal: R$ {((form.getValues().items[index]?.quantity || 0) * (form.getValues().items[index]?.unitPrice || 0)).toFixed(2)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <div className="flex justify-between items-center p-4 bg-muted rounded-md">
                <p className="font-medium">Total do Pedido:</p>
                <p className="text-xl font-bold">R$ {calculateTotal().toFixed(2)}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 border rounded-md">
              <p className="text-muted-foreground">Nenhum item adicionado</p>
              <Button type="button" onClick={addItem} variant="outline" className="mt-4">
                Adicionar Primeiro Item
              </Button>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onComplete}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialOrder ? "Atualizar Pedido" : "Criar Pedido"}
          </Button>
        </div>
      </form>
    </Form>
  );
} 