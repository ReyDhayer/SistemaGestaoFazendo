
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  RadioGroup, 
  RadioGroupItem 
} from '@/components/ui/radio-group';

const clientSchema = z.object({
  name: z.string().min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
  type: z.enum(['individual', 'business']),
  email: z.string().email({ message: 'Email inválido' }),
  phone: z.string().min(8, { message: 'Telefone deve ter pelo menos 8 dígitos' }),
  cpfCnpj: z.string().min(11, { message: 'CPF/CNPJ inválido' }),
  address: z.string().min(5, { message: 'Endereço deve ter pelo menos 5 caracteres' }),
  city: z.string().min(2, { message: 'Cidade deve ter pelo menos 2 caracteres' }),
  state: z.string().length(2, { message: 'Estado deve ter 2 caracteres' }),
  postalCode: z.string().min(8, { message: 'CEP inválido' }),
});

type ClientFormValues = z.infer<typeof clientSchema>;

interface ClientFormProps {
  initialData?: Partial<ClientFormValues>;
  onSubmit: (data: ClientFormValues) => void;
  isLoading?: boolean;
}

const states = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

const ClientForm = ({ initialData, onSubmit, isLoading }: ClientFormProps) => {
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: initialData?.name || '',
      type: initialData?.type || 'individual',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      cpfCnpj: initialData?.cpfCnpj || '',
      address: initialData?.address || '',
      city: initialData?.city || '',
      state: initialData?.state || '',
      postalCode: initialData?.postalCode || '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 animate-slide-in">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel>Tipo de cliente</FormLabel>
              <FormControl>
                <RadioGroup 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  className="flex space-x-4"
                >
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="individual" />
                    </FormControl>
                    <FormLabel className="cursor-pointer">Pessoa Física</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="business" />
                    </FormControl>
                    <FormLabel className="cursor-pointer">Empresa</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {form.watch('type') === 'business' ? 'Nome da empresa' : 'Nome completo'}
                </FormLabel>
                <FormControl>
                  <Input placeholder="Digite o nome" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cpfCnpj"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {form.watch('type') === 'business' ? 'CNPJ' : 'CPF'}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={form.watch('type') === 'business' ? 'Digite o CNPJ' : 'Digite o CPF'}
                    {...field}
                  />
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
                  <Input type="email" placeholder="Digite o email" {...field} />
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
                  <Input placeholder="Digite o telefone" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endereço</FormLabel>
              <FormControl>
                <Input placeholder="Digite o endereço completo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cidade</FormLabel>
                <FormControl>
                  <Input placeholder="Digite a cidade" {...field} />
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
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value} 
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="UF" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {states.map(state => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="postalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CEP</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o CEP" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline">
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {initialData ? 'Atualizar cliente' : 'Cadastrar cliente'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ClientForm;
