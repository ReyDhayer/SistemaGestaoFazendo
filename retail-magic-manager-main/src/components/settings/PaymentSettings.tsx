import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { CreditCard, Building, Wallet, ReceiptText } from "lucide-react";

const paymentFormSchema = z.object({
  methods: z.object({
    creditCard: z.boolean(),
    debitCard: z.boolean(),
    bankTransfer: z.boolean(),
    pix: z.boolean(),
    cash: z.boolean(),
    digitalWallet: z.boolean(),
  }),
  gateways: z.object({
    stripe: z.object({
      enabled: z.boolean(),
      apiKey: z.string().optional(),
      webhookSecret: z.string().optional(),
    }),
    paypal: z.object({
      enabled: z.boolean(),
      clientId: z.string().optional(),
      secret: z.string().optional(),
    }),
    mercadoPago: z.object({
      enabled: z.boolean(),
      accessToken: z.string().optional(),
    }),
  }),
  fees: z.object({
    creditCardFee: z.string(),
    debitCardFee: z.string(),
    installmentFee: z.string(),
  }),
  rules: z.object({
    minValue: z.string(),
    maxInstallments: z.string(),
    installmentMinValue: z.string(),
  }),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

const defaultValues: Partial<PaymentFormValues> = {
  methods: {
    creditCard: true,
    debitCard: true,
    bankTransfer: true,
    pix: true,
    cash: true,
    digitalWallet: false,
  },
  gateways: {
    stripe: {
      enabled: false,
      apiKey: "",
      webhookSecret: "",
    },
    paypal: {
      enabled: false,
      clientId: "",
      secret: "",
    },
    mercadoPago: {
      enabled: true,
      accessToken: "",
    },
  },
  fees: {
    creditCardFee: "2.99",
    debitCardFee: "1.99",
    installmentFee: "3.99",
  },
  rules: {
    minValue: "5.00",
    maxInstallments: "12",
    installmentMinValue: "10.00",
  },
};

interface PaymentSettingsProps {
  onSave: () => void;
}

const PaymentSettings = ({ onSave }: PaymentSettingsProps) => {
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues,
  });

  function onSubmit(data: PaymentFormValues) {
    console.log("Formulário de pagamentos enviado:", data);
    onSave();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Métodos de Pagamento
            </CardTitle>
            <CardDescription>
              Habilite os métodos de pagamento que sua empresa aceita
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="methods.creditCard"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Cartão de Crédito
                      </FormLabel>
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
                name="methods.debitCard"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Cartão de Débito
                      </FormLabel>
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
                name="methods.bankTransfer"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base flex items-center gap-2">
                        <Building className="h-5 w-5" />
                        Transferência Bancária
                      </FormLabel>
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
                name="methods.pix"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base flex items-center gap-2">
                        <ReceiptText className="h-5 w-5" />
                        PIX
                      </FormLabel>
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
                name="methods.cash"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base flex items-center gap-2">
                        <Wallet className="h-5 w-5" />
                        Dinheiro
                      </FormLabel>
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
                name="methods.digitalWallet"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base flex items-center gap-2">
                        <Wallet className="h-5 w-5" />
                        Carteiras Digitais
                      </FormLabel>
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
            <CardTitle>Gateways de Pagamento</CardTitle>
            <CardDescription>
              Configure as integrações com gateways de pagamento
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid gap-6">
              <div className="rounded-lg border p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Stripe</h3>
                  <FormField
                    control={form.control}
                    name="gateways.stripe.enabled"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2 space-y-0">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Habilitado</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="gateways.stripe.apiKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>API Key</FormLabel>
                        <FormControl>
                          <Input placeholder="sk_..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="gateways.stripe.webhookSecret"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Webhook Secret</FormLabel>
                        <FormControl>
                          <Input placeholder="whsec_..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">PayPal</h3>
                  <FormField
                    control={form.control}
                    name="gateways.paypal.enabled"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2 space-y-0">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Habilitado</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="gateways.paypal.clientId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client ID</FormLabel>
                        <FormControl>
                          <Input placeholder="Client ID" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="gateways.paypal.secret"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Secret</FormLabel>
                        <FormControl>
                          <Input placeholder="Secret" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Mercado Pago</h3>
                  <FormField
                    control={form.control}
                    name="gateways.mercadoPago.enabled"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2 space-y-0">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Habilitado</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="gateways.mercadoPago.accessToken"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Access Token</FormLabel>
                        <FormControl>
                          <Input placeholder="APP_USR-..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Taxas e Regras</CardTitle>
            <CardDescription>
              Configure as taxas e regras para os métodos de pagamento
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="fees.creditCardFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Taxa de Cartão de Crédito (%)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" min="0" {...field} />
                    </FormControl>
                    <FormDescription>
                      Taxa cobrada em transações de cartão de crédito
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fees.debitCardFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Taxa de Cartão de Débito (%)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" min="0" {...field} />
                    </FormControl>
                    <FormDescription>
                      Taxa cobrada em transações de cartão de débito
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fees.installmentFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Taxa de Parcelamento (%)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" min="0" {...field} />
                    </FormControl>
                    <FormDescription>
                      Taxa adicional cobrada por parcelamento
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="rules.minValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor Mínimo (R$)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" min="0" {...field} />
                    </FormControl>
                    <FormDescription>
                      Valor mínimo para pagamentos
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rules.maxInstallments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Máximo de Parcelas</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" max="24" {...field} />
                    </FormControl>
                    <FormDescription>
                      Número máximo de parcelas permitidas
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rules.installmentMinValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor Mínimo da Parcela (R$)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" min="0" {...field} />
                    </FormControl>
                    <FormDescription>
                      Valor mínimo para cada parcela
                    </FormDescription>
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

export default PaymentSettings;
