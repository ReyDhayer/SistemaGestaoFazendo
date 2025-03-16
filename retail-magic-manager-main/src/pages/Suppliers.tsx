import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Building2, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import SupplierForm from '@/components/suppliers/SupplierForm';
import { Supplier, SupplierFormData } from '@/types/supplier';
import { supplierService } from '@/services/supplier';

export default function Suppliers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<number | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      setIsLoading(true);
      const data = await supplierService.getAll();
      setSuppliers(data);
    } catch (error) {
      toast({
        title: "Erro ao carregar fornecedores",
        description: "Não foi possível carregar a lista de fornecedores.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (value: string) => {
    setSearchTerm(value);
    try {
      setIsLoading(true);
      const results = await supplierService.search(value);
      setSuppliers(results);
    } catch (error) {
      toast({
        title: "Erro ao buscar fornecedores",
        description: "Não foi possível realizar a busca.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setIsLoading(true);
      await supplierService.delete(id);
      toast({
        title: "Fornecedor removido",
        description: "O fornecedor foi removido com sucesso.",
      });
      setSupplierToDelete(null);
      loadSuppliers();
    } catch (error) {
      toast({
        title: "Erro ao remover fornecedor",
        description: "Não foi possível remover o fornecedor.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: SupplierFormData) => {
    try {
      setIsLoading(true);
      if (selectedSupplier) {
        await supplierService.update(selectedSupplier.id, data);
        toast({
          title: "Fornecedor atualizado",
          description: "As alterações foram salvas com sucesso.",
        });
      } else {
        await supplierService.create(data);
        toast({
          title: "Fornecedor criado",
          description: "O novo fornecedor foi cadastrado com sucesso.",
        });
      }
      setIsEditDialogOpen(false);
      setSelectedSupplier(null);
      loadSuppliers();
    } catch (error) {
      toast({
        title: selectedSupplier ? "Erro ao atualizar fornecedor" : "Erro ao criar fornecedor",
        description: "Não foi possível salvar as alterações.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Building2 className="h-8 w-8" />
          Fornecedores
        </h1>
        
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelectedSupplier(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo fornecedor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedSupplier ? "Editar fornecedor" : "Novo fornecedor"}
              </DialogTitle>
              <DialogDescription>
                {selectedSupplier 
                  ? "Edite as informações do fornecedor nos campos abaixo."
                  : "Preencha as informações do novo fornecedor nos campos abaixo."}
              </DialogDescription>
            </DialogHeader>
            <SupplierForm
              initialData={selectedSupplier}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Fornecedores</CardTitle>
          <CardDescription>
            Gerencie seus fornecedores e suas informações
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar fornecedores..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Cidade</TableHead>
                  <TableHead>Categorias</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell>{supplier.name}</TableCell>
                    <TableCell>{supplier.contact}</TableCell>
                    <TableCell>{supplier.email}</TableCell>
                    <TableCell>{supplier.phone}</TableCell>
                    <TableCell>{supplier.city}</TableCell>
                    <TableCell>{supplier.categories.join(", ")}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedSupplier(supplier);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSupplierToDelete(supplier.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Confirmar exclusão
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir este fornecedor? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(supplier.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
