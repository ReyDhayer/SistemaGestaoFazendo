
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { LayoutGrid, Timer, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const tableFormSchema = z.object({
  enableTables: z.boolean().default(false),
  tableTimeout: z.string().min(1, { message: "Defina o tempo limite" }),
  tablePrefix: z.string().min(1, { message: "Defina o prefixo da mesa" }),
  tableCount: z.string().min(1, { message: "Defina a quantidade de mesas" }),
  tableCapacity: z.string().min(1, { message: "Defina a capacidade padrão" }),
  requiresReservation: z.boolean().default(false),
  autoReleaseTables: z.boolean().default(true),
  tableServiceFee: z.string().min(1, { message: "Defina a taxa de serviço" }),
});

type TableFormValues = z.infer<typeof tableFormSchema>;

const defaultValues: Partial<TableFormValues> = {
  enableTables: true,
  tableTimeout: "120",
  tablePrefix: "Mesa",
  tableCount: "15",
  tableCapacity: "4",
  requiresReservation: false,
  autoReleaseTables: true,
  tableServiceFee: "10",
};

interface TableSettingsProps {
  onSave: () => void;
}

// Mock data for tables
const mockTables = [
  { id: 1, name: "Mesa 01", capacity: 4, status: "available" },
  { id: 2, name: "Mesa 02", capacity: 4, status: "available" },
  { id: 3, name: "Mesa 03", capacity: 2, status: "occupied" },
  { id: 4, name: "Mesa 04", capacity: 6, status: "occupied" },
  { id: 5, name: "Mesa 05", capacity: 4, status: "reserved" },
  { id: 6, name: "Mesa 06", capacity: 8, status: "available" },
];

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  let badgeClass = "";
  let label = "";

  switch (status) {
    case "available":
      badgeClass = "bg-green-100 text-green-800";
      label = "Disponível";
      break;
    case "occupied":
      badgeClass = "bg-red-100 text-red-800";
      label = "Ocupada";
      break;
    case "reserved":
      badgeClass = "bg-blue-100 text-blue-800";
      label = "Reservada";
      break;
    default:
      badgeClass = "bg-gray-100 text-gray-800";
      label = "Desconhecido";
  }

  return <Badge className={badgeClass}>{label}</Badge>;
};

const TableSettings = ({ onSave }: TableSettingsProps) => {
  const form = useForm<TableFormValues>({
    resolver: zodResolver(tableFormSchema),
    defaultValues,
  });

  function onSubmit(data: TableFormValues) {
    console.log("Formulário enviado:", data);
    onSave();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LayoutGrid className="h-5 w-5" />
              Configurações de Mesas
            </CardTitle>
            <CardDescription>
              Configure as opções para gerenciamento de mesas
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <FormField
              control={form.control}
              name="enableTables"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Ativar Gerenciamento de Mesas</FormLabel>
                    <FormDescription>
                      Habilita o gerenciamento de mesas e comandas
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
                name="tablePrefix"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prefixo das Mesas</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Texto que aparecerá antes do número da mesa (ex: Mesa, Table)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tableCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantidade de Mesas</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="tableCapacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacidade Padrão</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormDescription>
                      Número padrão de pessoas por mesa
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tableTimeout"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tempo Limite (minutos)</FormLabel>
                    <FormControl>
                      <div className="flex">
                        <Timer className="mr-2 h-4 w-4 opacity-50 my-auto" />
                        <Input type="number" min="1" {...field} />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Tempo para liberação automática da mesa sem atividade
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="requiresReservation"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Exigir Reserva</FormLabel>
                      <FormDescription>
                        Exige que as mesas sejam reservadas antecipadamente
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
                name="autoReleaseTables"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Liberação Automática</FormLabel>
                      <FormDescription>
                        Libera mesas automaticamente após o tempo limite
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
              name="tableServiceFee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Taxa de Serviço (%)</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" max="100" {...field} />
                  </FormControl>
                  <FormDescription>
                    Percentual de taxa de serviço aplicado às mesas
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Mesas Configuradas</CardTitle>
              <CardDescription>
                Gerencie as mesas disponíveis no estabelecimento
              </CardDescription>
            </div>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Nova Mesa
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted">
                    <th className="border px-4 py-2 text-left">ID</th>
                    <th className="border px-4 py-2 text-left">Nome</th>
                    <th className="border px-4 py-2 text-center">Capacidade</th>
                    <th className="border px-4 py-2 text-center">Status</th>
                    <th className="border px-4 py-2 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {mockTables.map((table) => (
                    <tr key={table.id}>
                      <td className="border px-4 py-2">{table.id}</td>
                      <td className="border px-4 py-2">{table.name}</td>
                      <td className="border px-4 py-2 text-center">{table.capacity}</td>
                      <td className="border px-4 py-2 text-center">
                        <StatusBadge status={table.status} />
                      </td>
                      <td className="border px-4 py-2 text-center">
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <p className="text-sm text-muted-foreground">
              Mostrando {mockTables.length} mesas. Total de mesas: {mockTables.length}
            </p>
          </CardFooter>
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

export default TableSettings;
