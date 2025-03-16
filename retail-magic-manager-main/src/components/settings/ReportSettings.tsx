
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
import { FileSpreadsheet, Mail, Clock, Download, LineChart } from "lucide-react";

const reportFormSchema = z.object({
  exportFormat: z.string().min(1, { message: "Selecione o formato de exportação" }),
  emailReports: z.boolean().default(false),
  emailRecipients: z.string().optional(),
  automaticReports: z.boolean().default(false),
  reportFrequency: z.string().min(1, { message: "Selecione a frequência dos relatórios" }),
  reportTime: z.string().min(1, { message: "Defina o horário dos relatórios" }),
  salesReportEnabled: z.boolean().default(true),
  inventoryReportEnabled: z.boolean().default(true),
  financialReportEnabled: z.boolean().default(true),
  customerReportEnabled: z.boolean().default(true),
  attendanceReportEnabled: z.boolean().default(false),
});

type ReportFormValues = z.infer<typeof reportFormSchema>;

const defaultValues: Partial<ReportFormValues> = {
  exportFormat: "excel",
  emailReports: true,
  emailRecipients: "gerente@empresa.com,financeiro@empresa.com",
  automaticReports: true,
  reportFrequency: "daily",
  reportTime: "23:00",
  salesReportEnabled: true,
  inventoryReportEnabled: true,
  financialReportEnabled: true,
  customerReportEnabled: true,
  attendanceReportEnabled: false,
};

interface ReportSettingsProps {
  onSave: () => void;
}

const ReportSettings = ({ onSave }: ReportSettingsProps) => {
  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportFormSchema),
    defaultValues,
  });

  function onSubmit(data: ReportFormValues) {
    console.log("Formulário enviado:", data);
    onSave();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5" />
              Configurações de Relatórios
            </CardTitle>
            <CardDescription>
              Configure as opções para geração e envio de relatórios
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="exportFormat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Formato de Exportação</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o formato" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                        <SelectItem value="csv">CSV (.csv)</SelectItem>
                        <SelectItem value="pdf">PDF (.pdf)</SelectItem>
                        <SelectItem value="html">HTML (.html)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Formato padrão para exportação de relatórios
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reportTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horário dos Relatórios</FormLabel>
                    <FormControl>
                      <div className="flex">
                        <Clock className="mr-2 h-4 w-4 opacity-50 my-auto" />
                        <Input type="time" {...field} />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Horário para geração de relatórios automáticos
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="automaticReports"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Relatórios Automáticos</FormLabel>
                      <FormDescription>
                        Gera relatórios automaticamente com a frequência definida
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
                name="reportFrequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frequência dos Relatórios</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!form.watch("automaticReports")}
                    >
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
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="emailReports"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Envio por Email</FormLabel>
                    <FormDescription>
                      Envia relatórios automaticamente por email
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
              name="emailRecipients"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Destinatários de Email</FormLabel>
                  <FormControl>
                    <div className="flex">
                      <Mail className="mr-2 h-4 w-4 opacity-50 my-auto" />
                      <Input 
                        placeholder="email1@exemplo.com,email2@exemplo.com" 
                        {...field} 
                        disabled={!form.watch("emailReports")}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Lista de emails separados por vírgula para receber os relatórios
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-5 w-5" />
              Tipos de Relatórios
            </CardTitle>
            <CardDescription>
              Configurar quais relatórios serão gerados automaticamente
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="salesReportEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Relatório de Vendas</FormLabel>
                      <FormDescription>
                        Inclui dados de vendas, produtos mais vendidos e análise de receita
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
                name="inventoryReportEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Relatório de Estoque</FormLabel>
                      <FormDescription>
                        Inclui níveis de estoque, validade e necessidades de reposição
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
                name="financialReportEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Relatório Financeiro</FormLabel>
                      <FormDescription>
                        Inclui receitas, despesas, lucros e análise de margem
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
                name="customerReportEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Relatório de Clientes</FormLabel>
                      <FormDescription>
                        Inclui análise de clientes, frequência de compras e valor médio
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
              name="attendanceReportEnabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Relatório de Atendimento</FormLabel>
                    <FormDescription>
                      Inclui tempo de atendimento, satisfação e performance dos atendentes
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
            <CardTitle>Relatórios Disponíveis</CardTitle>
            <CardDescription>
              Acesse relatórios pré-configurados para o seu negócio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="w-full justify-start">
                <Download className="mr-2 h-4 w-4" />
                Relatório de Vendas do Dia
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="mr-2 h-4 w-4" />
                Relatório de Estoque Atual
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="mr-2 h-4 w-4" />
                Relatório Financeiro Mensal
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="mr-2 h-4 w-4" />
                Relatório de Clientes Ativos
              </Button>
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

export default ReportSettings;
