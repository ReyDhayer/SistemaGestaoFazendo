
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
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { BarChart, Bar } from "recharts";
import { Activity, BarChart2 } from "lucide-react";

const mockProductData = [
  { name: "Produto A", revenue: 12000, percentage: 45, category: "A" },
  { name: "Produto B", revenue: 8000, percentage: 30, category: "A" },
  { name: "Produto C", revenue: 3500, percentage: 13, category: "B" },
  { name: "Produto D", revenue: 1500, percentage: 7, category: "B" },
  { name: "Produto E", revenue: 800, percentage: 3, category: "C" },
  { name: "Produto F", revenue: 500, percentage: 2, category: "C" },
];

const cumulativeData = mockProductData.reduce((acc, product, index) => {
  const prevCumulative = index > 0 ? acc[index - 1].cumulative : 0;
  acc.push({
    name: product.name,
    revenue: product.revenue,
    percentage: product.percentage,
    cumulative: prevCumulative + product.percentage,
    category: product.category,
  });
  return acc;
}, [] as any[]);

const abcFormSchema = z.object({
  analysisFrequency: z.string().min(1, { message: "Selecione a frequência de análise" }),
  categoryAThreshold: z.string().min(1, { message: "Defina o limite da categoria A" }),
  categoryBThreshold: z.string().min(1, { message: "Defina o limite da categoria B" }),
  autoCategorizationEnabled: z.boolean().default(false),
  includeInactiveProducts: z.boolean().default(false),
});

type AbcFormValues = z.infer<typeof abcFormSchema>;

const defaultValues: Partial<AbcFormValues> = {
  analysisFrequency: "monthly",
  categoryAThreshold: "80",
  categoryBThreshold: "95",
  autoCategorizationEnabled: true,
  includeInactiveProducts: false,
};

interface AbcCurveSettingsProps {
  onSave: () => void;
}

const AbcCurveSettings = ({ onSave }: AbcCurveSettingsProps) => {
  const form = useForm<AbcFormValues>({
    resolver: zodResolver(abcFormSchema),
    defaultValues,
  });

  function onSubmit(data: AbcFormValues) {
    console.log("Formulário enviado:", data);
    onSave();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Configurações da Curva ABC
            </CardTitle>
            <CardDescription>
              Configure os parâmetros para análise da curva ABC de produtos
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="analysisFrequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frequência de Análise</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a frequência" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="daily">Diária</SelectItem>
                        <SelectItem value="weekly">Semanal</SelectItem>
                        <SelectItem value="monthly">Mensal</SelectItem>
                        <SelectItem value="quarterly">Trimestral</SelectItem>
                        <SelectItem value="yearly">Anual</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Define a frequência com que a análise ABC será atualizada
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="categoryAThreshold"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Limite Categoria A (%)</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" max="100" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categoryBThreshold"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Limite Categoria B (%)</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" max="100" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="autoCategorizationEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Categorização Automática</FormLabel>
                      <FormDescription>
                        Atualiza automaticamente as categorias dos produtos
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
                name="includeInactiveProducts"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Incluir Produtos Inativos</FormLabel>
                      <FormDescription>
                        Inclui produtos inativos na análise ABC
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
            <CardTitle className="flex items-center gap-2">
              <BarChart2 className="h-5 w-5" />
              Visualização da Curva ABC
            </CardTitle>
            <CardDescription>
              Análise atual dos produtos por categoria
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="h-[400px] w-full">
                <p className="text-sm font-medium mb-2">Distribuição por Categoria</p>
                <ResponsiveContainer width="100%" height="90%">
                  <BarChart data={mockProductData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="revenue" name="Receita (R$)" fill="#0ea5e9" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="h-[400px] w-full">
                <p className="text-sm font-medium mb-2">Curva ABC Cumulativa</p>
                <ResponsiveContainer width="100%" height="90%">
                  <LineChart data={cumulativeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="cumulative"
                      name="% Cumulativo"
                      stroke="#0ea5e9"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted">
                    <th className="border px-4 py-2 text-left">Produto</th>
                    <th className="border px-4 py-2 text-right">Receita (R$)</th>
                    <th className="border px-4 py-2 text-right">% do Total</th>
                    <th className="border px-4 py-2 text-right">% Cumulativo</th>
                    <th className="border px-4 py-2 text-center">Categoria</th>
                  </tr>
                </thead>
                <tbody>
                  {cumulativeData.map((product) => (
                    <tr key={product.name}>
                      <td className="border px-4 py-2">{product.name}</td>
                      <td className="border px-4 py-2 text-right">{product.revenue.toLocaleString('pt-BR')}</td>
                      <td className="border px-4 py-2 text-right">{product.percentage}%</td>
                      <td className="border px-4 py-2 text-right">{product.cumulative}%</td>
                      <td className="border px-4 py-2 text-center">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            product.category === 'A'
                              ? 'bg-green-100 text-green-800'
                              : product.category === 'B'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {product.category}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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

export default AbcCurveSettings;
