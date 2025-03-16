import React, { useState } from 'react';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table as TableType, TableReservation } from '@/types/tables';
import { tableService } from '@/services/table';
import { TableReservationForm } from './TableReservationForm';
import { Pencil, Trash2, RefreshCw, Search, Calendar, Users, Clock, Phone, Mail } from 'lucide-react';

interface TableReservationListProps {
  reservations: TableReservation[];
  tables: TableType[];
  isLoading: boolean;
  onRefresh: () => void;
}

export function TableReservationList({ reservations, tables, isLoading, onRefresh }: TableReservationListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isNewReservationDialogOpen, setIsNewReservationDialogOpen] = useState(false);
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
  const [reservationToCancel, setReservationToCancel] = useState<number | null>(null);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
  };

  const handleNewReservation = (tableId: number) => {
    setSelectedTableId(tableId);
    setIsNewReservationDialogOpen(true);
  };

  const handleCancelReservation = async (id: number) => {
    try {
      await tableService.cancelReservation(id);
      setReservationToCancel(null);
      onRefresh();
    } catch (error) {
      console.error("Erro ao cancelar reserva:", error);
    }
  };

  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = 
      reservation.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.customerPhone.includes(searchTerm) ||
      (reservation.customerEmail && reservation.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === "all" || reservation.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="default">Confirmada</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pendente</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelada</Badge>;
      case 'completed':
        return <Badge variant="outline">Concluída</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTableName = (tableId: number) => {
    const table = tables.find(t => t.id === tableId);
    return table ? `Mesa ${table.number} - ${table.name}` : `Mesa ${tableId}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Reservas</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onRefresh} disabled={isLoading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <Dialog open={isNewReservationDialogOpen} onOpenChange={setIsNewReservationDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={() => setSelectedTableId(null)}>
                Nova Reserva
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  Nova Reserva
                </DialogTitle>
                <DialogDescription>
                  Agende uma nova reserva para uma mesa
                </DialogDescription>
              </DialogHeader>
              
              {selectedTableId === null ? (
                <div className="py-4">
                  <h4 className="text-sm font-medium mb-3">Selecione uma mesa para a reserva:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {tables.map((table) => (
                      <Button
                        key={table.id}
                        variant="outline"
                        className="h-auto py-3 flex flex-col items-center justify-center"
                        onClick={() => setSelectedTableId(table.id)}
                      >
                        <span className="font-bold">Mesa {table.number}</span>
                        <span className="text-xs text-muted-foreground">{table.name}</span>
                        <div className="flex items-center mt-1 text-xs">
                          <Users className="h-3 w-3 mr-1" />
                          <span>{table.capacity}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                <TableReservationForm 
                  tableId={selectedTableId}
                  onComplete={() => {
                    setIsNewReservationDialogOpen(false);
                    onRefresh();
                  }}
                />
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, telefone ou email..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="confirmed">Confirmadas</SelectItem>
            <SelectItem value="pending">Pendentes</SelectItem>
            <SelectItem value="cancelled">Canceladas</SelectItem>
            <SelectItem value="completed">Concluídas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mesa</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Horário</TableHead>
              <TableHead>Pessoas</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReservations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                  Nenhuma reserva encontrada
                </TableCell>
              </TableRow>
            ) : (
              filteredReservations.map((reservation) => (
                <TableRow key={reservation.id}>
                  <TableCell>{getTableName(reservation.tableId)}</TableCell>
                  <TableCell className="font-medium">{reservation.customerName}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center text-sm">
                        <Phone className="h-3 w-3 mr-1" />
                        {reservation.customerPhone}
                      </div>
                      {reservation.customerEmail && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Mail className="h-3 w-3 mr-1" />
                          {reservation.customerEmail}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {reservation.date}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      {reservation.time}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      {reservation.numberOfGuests}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(reservation.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={reservation.status === 'cancelled' || reservation.status === 'completed'}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={reservation.status === 'cancelled' || reservation.status === 'completed'}
                            onClick={() => setReservationToCancel(reservation.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Cancelar Reserva
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja cancelar a reserva de {reservation.customerName} para {reservation.date} às {reservation.time}?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Voltar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleCancelReservation(reservation.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Cancelar Reserva
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