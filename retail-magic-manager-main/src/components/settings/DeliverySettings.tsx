
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
import { MapPin, Truck, Clock, DollarSign } from "lucide-react";

const deliveryFormSchema = z.object({
  enableDelivery: z.boolean().default(false),
  deliveryFee: z.string().min(1, { message: "Defina a taxa de entrega" }),
  minimumOrderValue: z.string().min(1, { message: "Defina o valor mínimo do pedido" }),
  maximumDistance: z.string().min(1, { message: "Defina a distância máxima" }),
  deliveryTimeEstimate: z.string().min(1, { message: "Defina o tempo estimado de entrega" }),
  deliveryProvider: z.string().min(1, { message: "Selecione o provedor de entrega" }),
  freeDeliveryThreshold: z.string().min(1, { message: "Defina o valor para frete grátis" }),
  storeAddress: z.object({
    street: z.string().min(1, { message: "Rua é obrigatória" }),
    number: z.string().min(1, { message: "Número é obrigatório" }),
    complement: z.string().optional(),
    neighborhood: z.string().min(1, { message: "Bairro é obrigatório" }),
    city: z.string().min(1, { message: "Cidade é obrigatória" }),
    state: z.string().min(2, { message: "Estado é obrigatório" }),
    zipCode: z.string().min(8, { message: "CEP deve ter pelo menos 8 caracteres" }),
  }),
  deliveryInstructions: z.string().optional(),
});

type DeliveryFormValues = z.infer<typeof deliveryFormSchema>;

const defaultValues: Partial<DeliveryFormValues> = {
  enableDelivery: true,
  deliveryFee: "5.00",
  minimumOrderValue: "20.00",
  maximumDistance: "10",
  deliveryTimeEstimate: "45",
  deliveryProvider: "own",
  freeDeliveryThreshold: "80.00",
  storeAddress: {
    street: "Rua Exemplo",
    number: "123",
    complement: "Sala 1",
    neighborhood: "Centro",
    city: "São Paulo",
    state: "SP",
    zipCode: "01234-567",
  },
  deliveryInstructions: "Procure a entrada principal e toque a campainha.",
};

interface DeliverySettingsProps {
  onSave: () => void;
}

const DeliverySettings = ({ onSave }: DeliverySettingsProps) => {
  const form = useForm<DeliveryFormValues>({
    resolver: zodResolver(deliveryFormSchema),
    defaultValues,
  });

  function onSubmit(data: DeliveryFormValues) {
    console.log("Formulário enviado:", data);
    onSave();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Configurações de Entrega
            </CardTitle>
            <CardDescription>
              Configure as opções de entrega para seus clientes
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <FormField
              control={form.control}
              name="enableDelivery"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Ativar Entrega</FormLabel>
                    <FormDescription>
                      Habilita o serviço de entrega para os clientes
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="deliveryFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Taxa de Entrega (R$)</FormLabel>
                    <FormControl>
                      <div className="flex">
                        <DollarSign className="mr-2 h-4 w-4 opacity-50 my-auto" />
                        <Input type="number" step="0.01" min="0" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="minimumOrderValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor Mínimo do Pedido (R$)</FormLabel>
                    <FormControl>
                      <div className="flex">
                        <DollarSign className="mr-2 h-4 w-4 opacity-50 my-auto" />
                        <Input type="number" step="0.01" min="0" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="freeDeliveryThreshold"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor para Frete Grátis (R$)</FormLabel>
                    <FormControl>
                      <div className="flex">
                        <DollarSign className="mr-2 h-4 w-4 opacity-50 my-auto" />
                        <Input type="number" step="0.01" min="0" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="maximumDistance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Distância Máxima (km)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deliveryTimeEstimate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tempo Estimado (minutos)</FormLabel>
                    <FormControl>
                      <div className="flex">
                        <Clock className="mr-2 h-4 w-4 opacity-50 my-auto" />
                        <Input type="number" min="1" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deliveryProvider"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Provedor de Entrega</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o provedor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="own">Entrega Própria</SelectItem>
                        <SelectItem value="ifood">iFood</SelectItem>
                        <SelectItem value="uber_eats">Uber Eats</SelectItem>
                        <SelectItem value="rappi">Rappi</SelectItem>
                        <SelectItem value="third_party">Terceirizado</SelectItem>
                      </SelectContent>
                    </Select>
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
              <MapPin className="h-5 w-5" />
              Endereço de Origem
            </CardTitle>
            <CardDescription>
              Configure o endereço de origem para cálculo de entrega
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="storeAddress.street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rua</FormLabel>
                      <FormControl>
                        <Input placeholder="Rua" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="storeAddress.number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número</FormLabel>
                    <FormControl>
                      <Input placeholder="Número" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="storeAddress.complement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Complemento</FormLabel>
                    <FormControl>
                      <Input placeholder="Complemento" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="storeAddress.neighborhood"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bairro</FormLabel>
                    <FormControl>
                      <Input placeholder="Bairro" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="storeAddress.city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade</FormLabel>
                    <FormControl>
                      <Input placeholder="Cidade" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="storeAddress.state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="AC">Acre</SelectItem>
                        <SelectItem value="AL">Alagoas</SelectItem>
                        <SelectItem value="AP">Amapá</SelectItem>
                        <SelectItem value="AM">Amazonas</SelectItem>
                        <SelectItem value="BA">Bahia</SelectItem>
                        <SelectItem value="CE">Ceará</SelectItem>
                        <SelectItem value="DF">Distrito Federal</SelectItem>
                        <SelectItem value="ES">Espírito Santo</SelectItem>
                        <SelectItem value="GO">Goiás</SelectItem>
                        <SelectItem value="MA">Maranhão</SelectItem>
                        <SelectItem value="MT">Mato Grosso</SelectItem>
                        <SelectItem value="MS">Mato Grosso do Sul</SelectItem>
                        <SelectItem value="MG">Minas Gerais</SelectItem>
                        <SelectItem value="PA">Pará</SelectItem>
                        <SelectItem value="PB">Paraíba</SelectItem>
                        <SelectItem value="PR">Paraná</SelectItem>
                        <SelectItem value="PE">Pernambuco</SelectItem>
                        <SelectItem value="PI">Piauí</SelectItem>
                        <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                        <SelectItem value="RN">Rio Grande do Norte</SelectItem>
                        <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                        <SelectItem value="RO">Rondônia</SelectItem>
                        <SelectItem value="RR">Roraima</SelectItem>
                        <SelectItem value="SC">Santa Catarina</SelectItem>
                        <SelectItem value="SP">São Paulo</SelectItem>
                        <SelectItem value="SE">Sergipe</SelectItem>
                        <SelectItem value="TO">Tocantins</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="storeAddress.zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CEP</FormLabel>
                    <FormControl>
                      <Input placeholder="CEP" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="deliveryInstructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instruções para Entregadores</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Instruções para ajudar os entregadores a encontrar o local"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Essas instruções serão exibidas para os entregadores durante as entregas
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

export default DeliverySettings;
