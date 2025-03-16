import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Building, Mail, Phone, MapPin, Package } from 'lucide-react';
import { SupplierFormData, SupplierUpdateData } from '@/types/supplier';

const supplierFormSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  contact: z.string().min(3, { message: "Nome do contato deve ter pelo menos 3 caracteres" }),
  phone: z.string().min(10, { message: "Telefone deve ter pelo menos 10 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  address: z.string().min(5, { message: "Endereço deve ter pelo menos 5 caracteres" }),
  city: z.string().min(2, { message: "Cidade deve ter pelo menos 2 caracteres" }),
  state: z.string().length(2, { message: "Estado deve ter 2 caracteres" }),
  zipCode: z.string().min(8, { message: "CEP deve ter pelo menos 8 caracteres" }),
  taxId: z.string().min(14, { message: "CNPJ deve ter pelo menos 14 caracteres" }),
  categories: z.array(z.string()).min(1, { message: "Selecione pelo menos uma categoria" }),
  paymentTerms: z.string().optional(),
  website: z.string().url({ message: "URL inválida" }).optional(),
  notes: z.string().optional(),
}) satisfies z.ZodType<SupplierFormData>;

interface SupplierFormProps {
  initialData?: Partial<SupplierFormData>;
  onSubmit: (data: SupplierFormData) => void;
  isLoading?: boolean;
}

const categories = [
  'Alimentos',
  'Bebidas',
  'Eletrônicos',
  'Acessórios',
  'Papelaria',
  'Escritório',
  'Limpeza',
  'Higiene',
  'Cosméticos',
  'Outros'
] as const;

const SupplierForm = ({ initialData, onSubmit, isLoading }: SupplierFormProps) => {
  const form = useForm<SupplierFormData>({
    resolver: zodResolver(supplierFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      contact: initialData?.contact || '',
      phone: initialData?.phone || '',
      email: initialData?.email || '',
      address: initialData?.address || '',
      city: initialData?.city || '',
      state: initialData?.state || '',
      zipCode: initialData?.zipCode || '',
      taxId: initialData?.taxId || '',
      categories: initialData?.categories || [],
      paymentTerms: initialData?.paymentTerms || '',
      website: initialData?.website || '',
      notes: initialData?.notes || '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 animate-slide-in">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              Dados do Fornecedor
            </CardTitle>
            <CardDescription>
              Preencha os dados do fornecedor
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da empresa</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o nome da empresa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                name="contact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do contato</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o nome do contato" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="(XX) XXXXX-XXXX" className="pl-9" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input type="email" placeholder="email@empresa.com" className="pl-9" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="www.empresa.com.br" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Rua, número, complemento" className="pl-9" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="city"
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
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <FormControl>
                        <Input placeholder="UF" maxLength={2} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CEP</FormLabel>
                      <FormControl>
                        <Input placeholder="XXXXX-XXX" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="categories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categorias</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Package className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Select
                          value={field.value[0]}
                          onValueChange={(value) => field.onChange([value])}
                        >
                          <SelectTrigger className="pl-9">
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentTerms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Condições de pagamento (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 30 dias" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações (opcional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Digite observações adicionais sobre o fornecedor"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Salvando..." : "Salvar fornecedor"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SupplierForm; 