import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save } from 'lucide-react';
import { TableMapSettings } from '@/types/tables';

const formSchema = z.object({
  showTableNumbers: z.boolean().default(true),
  showTableStatus: z.boolean().default(true),
  showTableCapacity: z.boolean().default(true),
  showTableOrders: z.boolean().default(true),
  showTableReservations: z.boolean().default(true),
  enableDragAndDrop: z.boolean().default(true),
  enableZoom: z.boolean().default(true),
  autoRefreshInterval: z.coerce.number().min(0).max(300).default(30),
});

interface TableSettingsFormProps {
  initialData?: TableMapSettings;
  onSubmit: (data: TableMapSettings) => void;
  isLoading?: boolean;
}

export function TableSettingsForm({ initialData, onSubmit, isLoading = false }: TableSettingsFormProps) {
  const defaultValues: TableMapSettings = {
    showTableNumbers: true,
    showTableStatus: true,
    showTableCapacity: true,
    showTableOrders: true,
    showTableReservations: true,
    enableDragAndDrop: true,
    enableZoom: true,
    autoRefreshInterval: 30,
    ...initialData
  };

  const form = useForm<TableMapSettings>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = (data: TableMapSettings) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Configurações de Visualização</CardTitle>
            <CardDescription>
              Configure como as mesas são exibidas no mapa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="showTableNumbers"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Mostrar números das mesas</FormLabel>
                      <FormDescription>
                        Exibe o número de cada mesa no mapa
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="showTableStatus"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Mostrar status das mesas</FormLabel>
                      <FormDescription>
                        Exibe o status atual de cada mesa com cores
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="showTableCapacity"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Mostrar capacidade</FormLabel>
                      <FormDescription>
                        Exibe a capacidade de cada mesa
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="showTableOrders"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Mostrar pedidos</FormLabel>
                      <FormDescription>
                        Exibe indicador de pedidos ativos
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="showTableReservations"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Mostrar reservas</FormLabel>
                      <FormDescription>
                        Exibe indicador de reservas futuras
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Configurações de Interação</CardTitle>
            <CardDescription>
              Configure como você pode interagir com o mapa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="enableDragAndDrop"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Arrastar e soltar</FormLabel>
                      <FormDescription>
                        Permite mover mesas arrastando-as
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="enableZoom"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Habilitar zoom</FormLabel>
                      <FormDescription>
                        Permite aumentar e diminuir o zoom do mapa
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="autoRefreshInterval"
                render={({ field }) => (
                  <FormItem className="col-span-1 md:col-span-2">
                    <FormLabel>Intervalo de atualização automática (segundos)</FormLabel>
                    <FormDescription>
                      Define com que frequência o mapa será atualizado automaticamente (0 para desativar)
                    </FormDescription>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        max={300}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar configurações
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
} 