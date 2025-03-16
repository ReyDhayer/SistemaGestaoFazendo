import React, { useState } from 'react';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { TableArea } from '@/types/tables';
import { tableService } from '@/services/table';
import { TableAreaForm } from './TableAreaForm';
import { Pencil, Trash2, RefreshCw, Search, LayoutGrid } from 'lucide-react';

interface TableAreaListProps {
  areas: TableArea[];
  isLoading: boolean;
  onRefresh: () => void;
}

export function TableAreaList({ areas, isLoading, onRefresh }: TableAreaListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState<TableArea | null>(null);
  const [areaToDelete, setAreaToDelete] = useState<number | null>(null);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleEdit = (area: TableArea) => {
    setSelectedArea(area);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await tableService.deleteArea(id);
      setAreaToDelete(null);
      onRefresh();
    } catch (error) {
      console.error("Erro ao excluir área:", error);
      alert("Não é possível excluir uma área que contém mesas. Remova as mesas primeiro.");
    }
  };

  const filteredAreas = areas.filter(area => 
    area.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (area.description && area.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Áreas</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onRefresh} disabled={isLoading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={() => setSelectedArea(null)}>
                Nova Área
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {selectedArea ? "Editar Área" : "Nova Área"}
                </DialogTitle>
                <DialogDescription>
                  {selectedArea 
                    ? "Edite as informações da área nos campos abaixo."
                    : "Preencha as informações da nova área nos campos abaixo."}
                </DialogDescription>
              </DialogHeader>
              <TableAreaForm 
                initialData={selectedArea}
                onComplete={() => {
                  setIsEditDialogOpen(false);
                  onRefresh();
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar áreas..."
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
              <TableHead>Descrição</TableHead>
              <TableHead>Mesas</TableHead>
              <TableHead>Dimensões</TableHead>
              <TableHead>Cor de Fundo</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAreas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  Nenhuma área encontrada
                </TableCell>
              </TableRow>
            ) : (
              filteredAreas.map((area) => (
                <TableRow key={area.id}>
                  <TableCell className="font-medium">{area.name}</TableCell>
                  <TableCell>{area.description || "-"}</TableCell>
                  <TableCell>{area.tables.length}</TableCell>
                  <TableCell>
                    {area.position.width} x {area.position.height}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-6 h-6 rounded-full border"
                        style={{ backgroundColor: area.background || 'transparent' }}
                      />
                      {area.background || "Transparente"}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(area)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setAreaToDelete(area.id)}
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
                              Tem certeza que deseja excluir a área "{area.name}"? Esta ação não pode ser desfeita.
                              <br /><br />
                              <strong>Nota:</strong> Não é possível excluir uma área que contém mesas. Remova as mesas primeiro.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(area.id)}
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {filteredAreas.map((area) => (
          <div 
            key={area.id} 
            className="border rounded-md overflow-hidden"
            style={{ backgroundColor: area.background || 'transparent' }}
          >
            <div className="bg-background/80 p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{area.name}</h4>
                  {area.description && (
                    <p className="text-sm text-muted-foreground">{area.description}</p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(area)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="p-4 relative" style={{ height: '150px' }}>
              <div className="absolute bottom-2 right-2 bg-background/80 px-2 py-1 rounded-md text-xs">
                <div className="flex items-center gap-1">
                  <LayoutGrid className="h-3 w-3" />
                  {area.tables.length} mesas
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 