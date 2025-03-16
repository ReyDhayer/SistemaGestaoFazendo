
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
import { Textarea } from "@/components/ui/textarea";
import { Receipt, FileText, Building, CreditCard } from "lucide-react";

const fiscalFormSchema = z.object({
  fiscalRegime: z.string().min(1, { message: "Selecione o regime fiscal" }),
  taxId: z.string().min(11, { message: "CNPJ deve ter pelo menos 11 caracteres" }),
  stateRegistration: z.string().min(1, { message: "Inscrição Estadual é obrigatória" }),
  municipalRegistration: z.string().optional(),
  nfceEnabled: z.boolean().default(false),
  nfceEnvironment: z.string().min(1, { message: "Selecione o ambiente" }),
  nfceSeries: z.string().min(1, { message: "Defina a série" }),
  satEnabled: z.boolean().default(false),
  satActivationCode: z.string().optional(),
  satSignCode: z.string().optional(),
  fiscalPrinterEnabled: z.boolean().default(false),
  fiscalPrinterModel: z.string().optional(),
  fiscalPrinterPort: z.string().optional(),
  certificateFile: z.string().optional(),
  certificatePassword: z.string().optional(),
  certificateExpiration: z.string().optional(),
});

type FiscalFormValues = z.infer<typeof fiscalFormSchema>;

const defaultValues: Partial<FiscalFormValues> = {
  fiscalRegime: "simples",
  taxId: "12345678901234",
  stateRegistration: "123456789",
  municipalRegistration: "98765432",
  nfceEnabled: true,
  nfceEnvironment: "production",
  nfceSeries: "1",
  satEnabled: false,
  satActivationCode: "",
  satSignCode: "",
  fiscalPrinterEnabled: false,
  fiscalPrinterModel: "",
  fiscalPrinterPort: "",
  certificateFile: "certificado_digital.pfx",
  certificatePassword: "••••••••",
  certificateExpiration: "2024-12-31",
};

interface FiscalSettingsProps {
  onSave: () => void;
}

const FiscalSettings = ({ onSave }: FiscalSettingsProps) => {
  const form = useForm<FiscalFormValues>({
    resolver: zodResolver(fiscalFormSchema),
    defaultValues,
  });

  function onSubmit(data: FiscalFormValues) {
    console.log("Formulário enviado:", data);
    onSave();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Informações Fiscais da Empresa
            </CardTitle>
            <CardDescription>
              Configure as informações fiscais básicas da sua empresa
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="taxId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CNPJ</FormLabel>
                    <FormControl>
                      <Input placeholder="XX.XXX.XXX/0001-XX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fiscalRegime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Regime Fiscal</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o regime fiscal" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="simples">Simples Nacional</SelectItem>
                        <SelectItem value="presumido">Lucro Presumido</SelectItem>
                        <SelectItem value="real">Lucro Real</SelectItem>
                        <SelectItem value="mei">MEI</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="stateRegistration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Inscrição Estadual</FormLabel>
                    <FormControl>
                      <Input placeholder="Inscrição Estadual" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="municipalRegistration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Inscrição Municipal</FormLabel>
                    <FormControl>
                      <Input placeholder="Inscrição Municipal" {...field} />
                    </FormControl>
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
              <Receipt className="h-5 w-5" />
              NFC-e (Nota Fiscal de Consumidor Eletrônica)
            </CardTitle>
            <CardDescription>
              Configure as opções para emissão de NFC-e
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <FormField
              control={form.control}
              name="nfceEnabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Emissão de NFC-e</FormLabel>
                    <FormDescription>
                      Habilita a emissão de Nota Fiscal de Consumidor Eletrônica
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nfceEnvironment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ambiente</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!form.watch("nfceEnabled")}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o ambiente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="production">Produção</SelectItem>
                        <SelectItem value="homologation">Homologação</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Ambiente para emissão das notas fiscais
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nfceSeries"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Série NFC-e</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Série" 
                        {...field} 
                        disabled={!form.watch("nfceEnabled")}
                      />
                    </FormControl>
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
              <CreditCard className="h-5 w-5" />
              SAT (Sistema Autenticador e Transmissor)
            </CardTitle>
            <CardDescription>
              Configure as opções para uso do SAT fiscal
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <FormField
              control={form.control}
              name="satEnabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Utilizar SAT</FormLabel>
                    <FormDescription>
                      Habilita o uso do Sistema Autenticador e Transmissor
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="satActivationCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código de Ativação</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Código de Ativação" 
                        type="password"
                        {...field} 
                        disabled={!form.watch("satEnabled")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="satSignCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código de Assinatura</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Código de Assinatura" 
                        type="password"
                        {...field} 
                        disabled={!form.watch("satEnabled")}
                      />
                    </FormControl>
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
              <FileText className="h-5 w-5" />
              Certificado Digital
            </CardTitle>
            <CardDescription>
              Configure o certificado digital para emissão de documentos fiscais
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="certificateFile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Arquivo do Certificado</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} disabled />
                    </FormControl>
                    <FormDescription>
                      Arquivo .pfx ou .p12 do certificado
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="certificatePassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha do Certificado</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Senha do certificado"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="certificateExpiration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Expiração</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col p-4 rounded-lg border">
              <div className="flex items-center mb-2 text-amber-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2"
                >
                  <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <span className="font-medium">Atenção</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Seu certificado digital expira em 120 dias. Recomendamos renovar o certificado
                com antecedência para evitar interrupção na emissão de documentos fiscais.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Impressora Fiscal</CardTitle>
            <CardDescription>
              Configure a impressora fiscal para emissão de documentos
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <FormField
              control={form.control}
              name="fiscalPrinterEnabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Utilizar Impressora Fiscal</FormLabel>
                    <FormDescription>
                      Habilita o uso de impressora fiscal para emissão de documentos
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fiscalPrinterModel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modelo da Impressora</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!form.watch("fiscalPrinterEnabled")}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o modelo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="epson">Epson</SelectItem>
                        <SelectItem value="bematech">Bematech</SelectItem>
                        <SelectItem value="daruma">Daruma</SelectItem>
                        <SelectItem value="elgin">Elgin</SelectItem>
                        <SelectItem value="sweda">Sweda</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fiscalPrinterPort"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Porta da Impressora</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!form.watch("fiscalPrinterEnabled")}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a porta" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="usb">USB</SelectItem>
                        <SelectItem value="com1">COM1</SelectItem>
                        <SelectItem value="com2">COM2</SelectItem>
                        <SelectItem value="com3">COM3</SelectItem>
                        <SelectItem value="com4">COM4</SelectItem>
                        <SelectItem value="lan">Rede (TCP/IP)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
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

export default FiscalSettings;
