
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Calculator, Percent, DollarSign, ArrowRight } from "lucide-react";

const markupFormSchema = z.object({
  generalMarkup: z.string().min(1, { message: "Markup geral é obrigatório" }),
  categoryMarkups: z.array(
    z.object({
      categoryId: z.string(),
      name: z.string(),
      markup: z.string().min(1, { message: "Markup é obrigatório" }),
    })
  ),
  autoCalculation: z.boolean(),
  settings: z.object({
    includeTaxes: z.boolean(),
    includeShipping: z.boolean(),
    roundToNearestValue: z.boolean(),
    roundingValue: z.string(),
  }),
  customFormula: z.string().optional(),
});

type MarkupFormValues = z.infer<typeof markupFormSchema>;

// Mock category data
const categoryData = [
  { id: "1", name: "Eletrônicos", markup: "40" },
  { id: "2", name: "Alimentos", markup: "30" },
  { id: "3", name: "Bebidas", markup: "50" },
  { id: "4", name: "Vestuário", markup: "45" },
];

const defaultValues: Partial<MarkupFormValues> = {
  generalMarkup: "35",
  categoryMarkups: categoryData,
  autoCalculation: true,
  settings: {
    includeTaxes: true,
    includeShipping: false,
    roundToNearestValue: true,
    roundingValue: "0.99",
  },
  customFormula: "(custo + despesas) / (1 - margem desejada)",
};

interface MarkupSettingsProps {
  onSave: () => void;
}

const MarkupSettings = ({ onSave }: MarkupSettingsProps) => {
  const form = useForm<MarkupFormValues>({
    resolver: zodResolver(markupFormSchema),
    defaultValues,
  });

  function onSubmit(data: MarkupFormValues) {
    console.log("Formulário de markup enviado:", data);
    onSave();
  }

  // Simple markup calculator example
  const calculatePrice = (cost: number, markup: number) => {
    return cost * (1 + markup / 100);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Configuração de Markup
            </CardTitle>
            <CardDescription>
              Configure o markup padrão para cálculo automático de preços de venda
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <FormField
              control={form.control}
              name="generalMarkup"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Markup Geral (%)</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <Input 
                        type="number" 
                        min="0" 
                        step="0.01" 
                        {...field} 
                        className="w-full" 
                      />
                      <Percent className="ml-2 h-5 w-5 text-muted-foreground" />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Este markup será aplicado a todos os produtos sem markup específico
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="rounded-lg border p-4">
              <h3 className="text-lg font-medium mb-4">Simulador de Markup</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Custo do Produto (R$)</label>
                  <Input 
                    type="number" 
                    min="0" 
                    step="0.01" 
                    defaultValue="100" 
                    className="mt-1" 
                    id="cost-input"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Markup (%)</label>
                  <Input 
                    type="number" 
                    min="0" 
                    step="0.01" 
                    defaultValue={form.getValues("generalMarkup")} 
                    className="mt-1" 
                    id="markup-input"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium">Preço de Venda (R$)</label>
                  <div className="flex items-center mt-1 h-10">
                    <div className="bg-secondary rounded-md px-4 py-2 flex-1 font-medium text-center">
                      {calculatePrice(100, parseInt(form.getValues("generalMarkup") || "0")).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center text-muted-foreground my-4">
                <span>Custo</span>
                <ArrowRight className="mx-2 h-4 w-4" />
                <span>Preço de Venda = Custo × (1 + Markup/100)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Markup por Categoria</CardTitle>
            <CardDescription>
              Configure diferentes valores de markup para cada categoria de produtos
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            {categoryData.map((category, index) => (
              <div key={category.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                <div className="md:col-span-2">
                  <FormLabel>Categoria</FormLabel>
                  <div className="font-medium">{category.name}</div>
                </div>
                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name={`categoryMarkups.${index}.markup`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Markup (%)</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            <Input 
                              type="number" 
                              min="0" 
                              step="0.01" 
                              {...field} 
                              className="w-full" 
                            />
                            <Percent className="ml-2 h-5 w-5 text-muted-foreground" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormLabel>Preço de Exemplo</FormLabel>
                  <div className="bg-secondary rounded-md px-4 py-2 text-center font-medium mt-2">
                    {calculatePrice(100, parseInt(form.getValues(`categoryMarkups.${index}.markup`) || "0")).toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Configurações Avançadas</CardTitle>
            <CardDescription>
              Configure opções avançadas para o cálculo de markup
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <FormField
              control={form.control}
              name="autoCalculation"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Cálculo Automático</FormLabel>
                    <FormDescription>
                      Atualizar automaticamente os preços de venda quando o custo mudar
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
              name="settings.includeTaxes"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Incluir Impostos</FormLabel>
                    <FormDescription>
                      Considerar impostos no cálculo de markup
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
              name="settings.includeShipping"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Incluir Frete</FormLabel>
                    <FormDescription>
                      Considerar custos de frete no cálculo de markup
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
              name="settings.roundToNearestValue"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Arredondar Preço</FormLabel>
                    <FormDescription>
                      Arredondar preço para o valor mais próximo (ex: R$ 19,99)
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
              name="settings.roundingValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor de Arredondamento</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <Input 
                        {...field} 
                        className="w-full" 
                      />
                      <DollarSign className="ml-2 h-5 w-5 text-muted-foreground" />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Ex: 0.99 para arredondar para R$ X,99
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customFormula"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fórmula Personalizada</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Fórmula personalizada para cálculo de markup"
                      {...field}
                      className="min-h-[100px]" 
                    />
                  </FormControl>
                  <FormDescription>
                    Deixe em branco para usar a fórmula padrão
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
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

export default MarkupSettings;
