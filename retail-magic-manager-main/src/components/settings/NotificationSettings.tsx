
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Bell, Mail, Smartphone, MessageSquare } from "lucide-react";

const notificationFormSchema = z.object({
  channels: z.object({
    email: z.boolean(),
    sms: z.boolean(),
    push: z.boolean(),
  }),
  types: z.object({
    orders: z.boolean(),
    payments: z.boolean(),
    updates: z.boolean(),
    alerts: z.boolean(),
  }),
  frequency: z.object({
    orders: z.string(),
    payments: z.string(),
    updates: z.string(),
    alerts: z.string(),
  }),
  contact: z.object({
    email: z.string().email({ message: "Email inválido" }).optional(),
    phone: z.string().optional(),
  }),
});

type NotificationFormValues = z.infer<typeof notificationFormSchema>;

const defaultValues: Partial<NotificationFormValues> = {
  channels: {
    email: true,
    sms: false,
    push: true,
  },
  types: {
    orders: true,
    payments: true,
    updates: false,
    alerts: true,
  },
  frequency: {
    orders: "immediate",
    payments: "immediate",
    updates: "daily",
    alerts: "immediate",
  },
  contact: {
    email: "contato@minhaempresa.com",
    phone: "(11) 99999-9999",
  },
};

interface NotificationSettingsProps {
  onSave: () => void;
}

const NotificationSettings = ({ onSave }: NotificationSettingsProps) => {
  const form = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues,
  });

  function onSubmit(data: NotificationFormValues) {
    console.log("Formulário de notificações enviado:", data);
    onSave();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Canais de Notificação
            </CardTitle>
            <CardDescription>
              Escolha quais canais deseja utilizar para receber notificações
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="channels.email"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        Email
                      </FormLabel>
                      <FormDescription>
                        Receba notificações por email
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
                name="channels.sms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base flex items-center gap-2">
                        <Smartphone className="h-5 w-5" />
                        SMS
                      </FormLabel>
                      <FormDescription>
                        Receba notificações por SMS
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
                name="channels.push"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        Push
                      </FormLabel>
                      <FormDescription>
                        Receba notificações push no navegador
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
                name="contact.email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email para Notificações</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormDescription>
                      Email que receberá as notificações
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contact.phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone para SMS</FormLabel>
                    <FormControl>
                      <Input placeholder="Telefone" {...field} />
                    </FormControl>
                    <FormDescription>
                      Telefone que receberá as mensagens SMS
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
            <CardTitle>Tipos de Notificações</CardTitle>
            <CardDescription>
              Selecione quais tipos de notificações deseja receber
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="types.orders"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Novos Pedidos</FormLabel>
                      <FormDescription>
                        Receba notificações quando novos pedidos forem criados
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="types.payments"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Pagamentos</FormLabel>
                      <FormDescription>
                        Receba notificações sobre pagamentos
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="types.updates"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Atualizações do Sistema</FormLabel>
                      <FormDescription>
                        Receba notificações sobre atualizações do sistema
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="types.alerts"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Alertas Importantes</FormLabel>
                      <FormDescription>
                        Receba alertas importantes do sistema
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Frequência de Notificações</CardTitle>
            <CardDescription>
              Configure a frequência com que deseja receber cada tipo de notificação
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="frequency.orders"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pedidos</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Frequência" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="immediate">Imediatamente</SelectItem>
                        <SelectItem value="hourly">A cada hora</SelectItem>
                        <SelectItem value="daily">Diariamente</SelectItem>
                        <SelectItem value="weekly">Semanalmente</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Frequência das notificações de novos pedidos
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="frequency.payments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pagamentos</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Frequência" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="immediate">Imediatamente</SelectItem>
                        <SelectItem value="hourly">A cada hora</SelectItem>
                        <SelectItem value="daily">Diariamente</SelectItem>
                        <SelectItem value="weekly">Semanalmente</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Frequência das notificações de pagamentos
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="frequency.updates"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Atualizações</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Frequência" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="immediate">Imediatamente</SelectItem>
                        <SelectItem value="hourly">A cada hora</SelectItem>
                        <SelectItem value="daily">Diariamente</SelectItem>
                        <SelectItem value="weekly">Semanalmente</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Frequência das notificações de atualizações
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="frequency.alerts"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alertas</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Frequência" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="immediate">Imediatamente</SelectItem>
                        <SelectItem value="hourly">A cada hora</SelectItem>
                        <SelectItem value="daily">Diariamente</SelectItem>
                        <SelectItem value="weekly">Semanalmente</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Frequência das notificações de alertas
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

export default NotificationSettings;
