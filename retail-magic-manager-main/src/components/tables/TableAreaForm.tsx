import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Loader2 } from 'lucide-react';
import { TableArea, TableAreaFormData } from '@/types/tables';
import { tableService } from '@/services/table';

const formSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  description: z.string().optional(),
  positionX: z.coerce.number().int(),
  positionY: z.coerce.number().int(),
  width: z.coerce.number().int().positive("A largura deve ser positiva"),
  height: z.coerce.number().int().positive("A altura deve ser positiva"),
  background: z.string().optional(),
});

interface TableAreaFormProps {
  initialData: TableArea | null;
  onComplete: () => void;
}

export function TableAreaForm({ initialData, onComplete }: TableAreaFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      description: initialData.description || '',
      positionX: initialData.position.x,
      positionY: initialData.position.y,
      width: initialData.position.width,
      height: initialData.position.height,
      background: initialData.background || '',
    } : {
      name: '',
      description: '',
      positionX: 50,
      positionY: 50,
      width: 400,
      height: 200,
      background: '#f5f5f5',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      
      const areaData: TableAreaFormData = {
        name: values.name,
        description: values.description,
        position: {
          x: values.positionX,
          y: values.positionY,
          width: values.width,
          height: values.height,
        },
        background: values.background,
      };

      if (initialData) {
        await tableService.updateArea(initialData.id, areaData);
      } else {
        await tableService.createArea(areaData);
      }

      onComplete();
    } catch (error) {
      console.error("Erro ao salvar área:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Área</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Nome que identifica a área no mapa
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição (opcional)</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormDescription>
                    Breve descrição da área
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="background"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cor de Fundo</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="w-10 p-0" 
                          style={{ backgroundColor: field.value || 'transparent' }}
                        />
                      </PopoverTrigger>
                      <PopoverContent className="w-64">
                        <div className="grid grid-cols-5 gap-2">
                          {[
                            '#f5f5f5', '#e6f7ff', '#fff0f6', '#f0f5ff', '#f6ffed',
                            '#fffbe6', '#fff2e8', '#f9f0ff', '#e6fffb', '#f0f2f5',
                            '#ffffff', '#d9d9d9', '#bfbfbf', '#8c8c8c', '#595959',
                            '#f5222d', '#fa8c16', '#fadb14', '#52c41a', '#1890ff',
                            '#722ed1', '#eb2f96', '#faad14', '#a0d911', '#13c2c2'
                          ].map((color) => (
                            <Button
                              key={color}
                              variant="outline"
                              className="w-8 h-8 p-0 rounded-md"
                              style={{ backgroundColor: color }}
                              onClick={() => {
                                form.setValue('background', color);
                                return false;
                              }}
                            />
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <FormDescription>
                    Cor de fundo da área no mapa (código hexadecimal)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="positionX"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Posição X</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="positionY"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Posição Y</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="width"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Largura</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Altura</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="border rounded-md p-4 mt-4">
              <h4 className="text-sm font-medium mb-2">Visualização</h4>
              <div 
                className="border border-dashed border-gray-400 rounded-md relative"
                style={{ 
                  width: '100%', 
                  height: '200px',
                  backgroundColor: '#f0f0f0'
                }}
              >
                <div
                  className="absolute border border-dashed border-gray-400 rounded-md flex items-center justify-center"
                  style={{
                    left: `${form.watch('positionX')}px`,
                    top: `${form.watch('positionY')}px`,
                    width: `${form.watch('width')}px`,
                    height: `${form.watch('height')}px`,
                    backgroundColor: form.watch('background') || 'transparent',
                    transform: 'scale(0.3) translate(-50%, -50%)',
                    transformOrigin: '0 0',
                  }}
                >
                  <span className="text-xs font-medium">{form.watch('name')}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Visualização em escala reduzida. As posições e dimensões são em pixels no mapa real.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onComplete}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Salvar Alterações" : "Criar Área"}
          </Button>
        </div>
      </form>
    </Form>
  );
} 