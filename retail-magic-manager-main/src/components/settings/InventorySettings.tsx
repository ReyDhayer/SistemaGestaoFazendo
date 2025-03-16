
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Package, AlertTriangle, BarChart3, ListChecks } from "lucide-react";

const inventoryFormSchema = z.object({
  lowStockThreshold: z.string().min(1, { message: "Defina o limite de estoque baixo" }),
  inventoryMethod: z.string().min(1, { message: "Selecione o método de inventário" }),
  autoUpdateEnabled: z.boolean().default(false),
  autoOrderEnabled: z.boolean().default(false),
  countFrequency: z.string().min(1, { message: "Selecione a frequência de contagem" }),
  batchTrackingEnabled: z.boolean().default(false),
  expirationTrackingEnabled: z.boolean().default(false),
  notificationThreshold: z.string().min(1, { message: "Defina o limite de notificação" }),
  allowNegativeStock: z.boolean().default(false),
});

type InventoryFormValues = z.infer<typeof inventoryFormSchema>;

const defaultValues: Partial<InventoryFormValues> = {
  lowStockThreshold: "10",
  inventoryMethod: "fifo",
  autoUpdateEnabled: true,
  autoOrderEnabled: false,
  countFrequency: "monthly",
  batchTrackingEnabled: true,
  expirationTrackingEnabled: true,
  notificationThreshold: "3",
  allowNegativeStock: false,
};

interface InventorySettingsProps {
  onSave: () => void;
}

const InventorySettings = ({ onSave }: InventorySettingsProps) => {
  const form = useForm<InventoryFormValues>({
    resolver: zodResolver(inventoryFormSchema),
    defaultValues,
  });

  function onSubmit(data: InventoryFormValues) {
    console.log("Formulário enviado:", data);
    onSave();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Configurações Gerais de Estoque
            </CardTitle>
            <CardDescription>
              Configure as opções gerais para gerenciamento de estoque
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="inventoryMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Método de Inventário</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o método" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="fifo">FIFO (Primeiro a Entrar, Primeiro a Sair)</SelectItem>
                        <SelectItem value="lifo">LIFO (Último a Entrar, Primeiro a Sair)</SelectItem>
                        <SelectItem value="weighted_average">Média Ponderada</SelectItem>
                        <SelectItem value="specific_identification">Identificação Específica</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Define como o sistema calculará os custos de estoque
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="countFrequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frequência de Contagem</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a frequência" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="daily">Diária</SelectItem>
                        <SelectItem value="weekly">Semanal</SelectItem>
                        <SelectItem value="biweekly">Quinzenal</SelectItem>
                        <SelectItem value="monthly">Mensal</SelectItem>
                        <SelectItem value="quarterly">Trimestral</SelectItem>
                        <SelectItem value="yearly">Anual</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Define com que frequência o inventário físico deverá ser contado
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="autoUpdateEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Atualização Automática</FormLabel>
                      <FormDescription>
                        Atualiza automaticamente o estoque após vendas e compras
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
                name="autoOrderEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Pedido Automático</FormLabel>
                      <FormDescription>
                        Gera pedidos automaticamente quando o estoque está baixo
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="batchTrackingEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Rastreamento de Lotes</FormLabel>
                      <FormDescription>
                        Permite rastrear os produtos por lotes de fabricação
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
                name="expirationTrackingEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Rastreamento de Validade</FormLabel>
                      <FormDescription>
                        Monitora datas de validade dos produtos em estoque
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

            <FormField
              control={form.control}
              name="allowNegativeStock"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Permitir Estoque Negativo</FormLabel>
                    <FormDescription>
                      Permite que os produtos sejam vendidos mesmo quando fora de estoque
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Alertas de Estoque
            </CardTitle>
            <CardDescription>
              Configure os alertas e notificações de estoque
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="lowStockThreshold"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Limite de Estoque Baixo</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormDescription>
                      Quantidade mínima em estoque antes de marcar como "estoque baixo"
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notificationThreshold"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Limite de Notificação (dias)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormDescription>
                      Dias antes da data de validade para gerar alertas
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Análise de Estoque
            </CardTitle>
            <CardDescription>
              Visualize e analise estatísticas de estoque
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-primary/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total em Estoque</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">1.243</p>
                  <p className="text-xs text-muted-foreground">Unidades em 327 produtos</p>
                </CardContent>
              </Card>
              
              <Card className="bg-yellow-500/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">24</p>
                  <p className="text-xs text-muted-foreground">Produtos abaixo do limite</p>
                </CardContent>
              </Card>
              
              <Card className="bg-red-500/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Produtos Vencidos</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">5</p>
                  <p className="text-xs text-muted-foreground">Produtos com validade expirada</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListChecks className="h-5 w-5" />
              Lista de Verificação de Estoque
            </CardTitle>
            <CardDescription>
              Itens importantes para verificar em seu estoque
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="mr-2 mt-1 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-700 text-xs">✓</span>
                </div>
                <div>
                  <p className="font-medium">Contagem de estoque mensal</p>
                  <p className="text-sm text-muted-foreground">Última contagem realizada há 12 dias</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-1 h-5 w-5 rounded-full bg-yellow-100 flex items-center justify-center">
                  <span className="text-yellow-700 text-xs">!</span>
                </div>
                <div>
                  <p className="font-medium">Verificar produtos próximos ao vencimento</p>
                  <p className="text-sm text-muted-foreground">8 produtos vencem nos próximos 30 dias</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-1 h-5 w-5 rounded-full bg-red-100 flex items-center justify-center">
                  <span className="text-red-700 text-xs">!</span>
                </div>
                <div>
                  <p className="font-medium">Revisar pedidos pendentes</p>
                  <p className="text-sm text-muted-foreground">3 pedidos aguardando aprovação</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="lg">
            Salvar Configurações
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default InventorySettings;
