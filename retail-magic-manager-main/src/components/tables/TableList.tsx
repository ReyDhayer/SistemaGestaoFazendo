import React, { useState } from 'react';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table as TableType, TableStatus } from '@/types/tables';
import { tableService } from '@/services/table';
import { TableForm } from './TableForm';
import { Pencil, Trash2, Users, RefreshCw } from 'lucide-react';

interface TableListProps {
  tables: TableType[];
  onStatusChange: (tableId: number, status: TableStatus) => Promise<void>;
  isLoading: boolean;
  onRefresh: () => void;
}

export function TableList({ tables, onStatusChange, isLoading, onRefresh }: TableListProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<TableType | null>(null);
  const [tableToDelete, setTableToDelete] = useState<number | null>(null);

  const handleEdit = (table: TableType) => {
    setSelectedTable(table);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await tableService.delete(id);
      setTableToDelete(null);
      onRefresh();
    } catch (error) {
      console.error("Erro ao excluir mesa:", error);
    }
  };

  const getStatusBadge = (status: TableStatus) => {
    switch (status) {
      case TableStatus.FREE:
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 hover:bg-green-500/20">Livre</Badge>;
      case TableStatus.OCCUPIED:
        return <Badge variant="outline" className="bg-red-500/10 text-red-500 hover:bg-red-500/20">Ocupada</Badge>;
      case TableStatus.RESERVED:
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20">Reservada</Badge>;
      case TableStatus.WAITING_SERVICE:
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">Aguardando Atendimento</Badge>;
      case TableStatus.WAITING_PAYMENT:
        return <Badge variant="outline" className="bg-purple-500/10 text-purple-500 hover:bg-purple-500/20">Aguardando Pagamento</Badge>;
      case TableStatus.CLEANING:
        return <Badge variant="outline" className="bg-gray-500/10 text-gray-500 hover:bg-gray-500/20">Limpeza</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Lista de Mesas</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onRefresh} disabled={isLoading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={() => setSelectedTable(null)}>
                Adicionar Mesa
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {selectedTable ? "Editar Mesa" : "Nova Mesa"}
                </DialogTitle>
                <DialogDescription>
                  {selectedTable 
                    ? "Edite as informações da mesa nos campos abaixo."
                    : "Preencha as informações da nova mesa nos campos abaixo."}
                </DialogDescription>
              </DialogHeader>
              <TableForm 
                initialData={selectedTable}
                onComplete={() => {
                  setIsEditDialogOpen(false);
                  onRefresh();
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Área</TableHead>
              <TableHead>Capacidade</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Formato</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tables.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  Nenhuma mesa encontrada
                </TableCell>
              </TableRow>
            ) : (
              tables.map((table) => (
                <TableRow key={table.id}>
                  <TableCell className="font-medium">{table.number}</TableCell>
                  <TableCell>{table.name}</TableCell>
                  <TableCell>{table.area}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {table.capacity}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(table.status)}</TableCell>
                  <TableCell className="capitalize">{table.shape.type}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(table)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setTableToDelete(table.id)}
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
                              Tem certeza que deseja excluir a mesa {table.number} - {table.name}? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(table.id)}
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
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 