import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableStatus, TableOrder, TableReservation } from '@/types/tables';
import { tableService } from '@/services/table';
import { X, Users, Calendar, ShoppingCart, Clock, CreditCard, Edit, Trash2 } from 'lucide-react';
import { TableOrderForm } from './TableOrderForm';
import { TableReservationForm } from './TableReservationForm';

interface TableDetailsPanelProps {
  table: Table;
  onClose: () => void;
  onStatusChange: (tableId: number, status: TableStatus) => Promise<void>;
  onEdit: () => void;
}

export function TableDetailsPanel({ table, onClose, onStatusChange, onEdit }: TableDetailsPanelProps) {
  const [activeTab, setActiveTab] = useState("info");
  const [isLoading, setIsLoading] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<TableOrder | null>(null);
  const [reservations, setReservations] = useState<TableReservation[]>([]);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [isReservationDialogOpen, setIsReservationDialogOpen] = useState(false);

  React.useEffect(() => {
    loadTableData();
  }, [table.id]);

  const loadTableData = async () => {
    try {
      setIsLoading(true);
      const order = await tableService.getCurrentOrderByTable(table.id);
      const tableReservations = await tableService.getReservationsByTable(table.id);
      setCurrentOrder(order);
      setReservations(tableReservations);
    } catch (error) {
      console.error("Erro ao carregar dados da mesa:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: TableStatus) => {
    switch (status) {
      case TableStatus.FREE:
        return 'bg-green-500 text-white';
      case TableStatus.OCCUPIED:
        return 'bg-red-500 text-white';
      case TableStatus.RESERVED:
        return 'bg-blue-500 text-white';
      case TableStatus.WAITING_SERVICE:
        return 'bg-yellow-500 text-white';
      case TableStatus.WAITING_PAYMENT:
        return 'bg-purple-500 text-white';
      case TableStatus.CLEANING:
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-300';
    }
  };

  const getStatusText = (status: TableStatus) => {
    switch (status) {
      case TableStatus.FREE:
        return 'Livre';
      case TableStatus.OCCUPIED:
        return 'Ocupada';
      case TableStatus.RESERVED:
        return 'Reservada';
      case TableStatus.WAITING_SERVICE:
        return 'Aguardando Atendimento';
      case TableStatus.WAITING_PAYMENT:
        return 'Aguardando Pagamento';
      case TableStatus.CLEANING:
        return 'Limpeza';
      default:
        return 'Desconhecido';
    }
  };

  const handleStatusChange = async (status: TableStatus) => {
    try {
      setIsLoading(true);
      await onStatusChange(table.id, status);
    } catch (error) {
      console.error("Erro ao alterar status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl flex items-center gap-2">
            Mesa {table.number} - {table.name}
            <Badge className={getStatusColor(table.status)}>
              {getStatusText(table.status)}
            </Badge>
          </CardTitle>
          <CardDescription>
            {table.area} • Capacidade: {table.capacity} pessoas
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={onEdit}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="info" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Informações</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              <span>Pedidos</span>
            </TabsTrigger>
            <TabsTrigger value="reservations" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Reservas</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Status</p>
                <Badge className={getStatusColor(table.status)}>
                  {getStatusText(table.status)}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Capacidade</p>
                <p className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {table.capacity} pessoas
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Área</p>
                <p>{table.area}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Formato</p>
                <p className="capitalize">{table.shape.type}</p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm font-medium mb-2">Alterar Status</p>
              <div className="grid grid-cols-3 gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={table.status === TableStatus.FREE || isLoading}
                  onClick={() => handleStatusChange(TableStatus.FREE)}
                >
                  Livre
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={table.status === TableStatus.OCCUPIED || isLoading}
                  onClick={() => handleStatusChange(TableStatus.OCCUPIED)}
                >
                  Ocupada
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={table.status === TableStatus.RESERVED || isLoading}
                  onClick={() => handleStatusChange(TableStatus.RESERVED)}
                >
                  Reservada
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={table.status === TableStatus.WAITING_SERVICE || isLoading}
                  onClick={() => handleStatusChange(TableStatus.WAITING_SERVICE)}
                >
                  Aguardando Atendimento
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={table.status === TableStatus.WAITING_PAYMENT || isLoading}
                  onClick={() => handleStatusChange(TableStatus.WAITING_PAYMENT)}
                >
                  Aguardando Pagamento
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={table.status === TableStatus.CLEANING || isLoading}
                  onClick={() => handleStatusChange(TableStatus.CLEANING)}
                >
                  Limpeza
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Pedido Atual</h3>
              <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    {currentOrder ? "Editar Pedido" : "Novo Pedido"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {currentOrder ? "Editar Pedido" : "Novo Pedido"}
                    </DialogTitle>
                    <DialogDescription>
                      {currentOrder 
                        ? "Edite os itens do pedido para esta mesa."
                        : "Adicione um novo pedido para esta mesa."}
                    </DialogDescription>
                  </DialogHeader>
                  <TableOrderForm 
                    table={table}
                    initialOrder={currentOrder}
                    onComplete={() => {
                      setIsOrderDialogOpen(false);
                      loadTableData();
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>

            {currentOrder ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 inline mr-1" />
                      {new Date(currentOrder.createdAt).toLocaleString()}
                    </p>
                    <Badge variant="outline" className="ml-2">
                      {currentOrder.status}
                    </Badge>
                  </div>
                  <p className="font-medium">
                    Total: R$ {currentOrder.totalAmount.toFixed(2)}
                  </p>
                </div>

                <div className="border rounded-md">
                  <div className="bg-muted px-4 py-2 rounded-t-md">
                    <div className="grid grid-cols-12 text-sm font-medium">
                      <div className="col-span-6">Item</div>
                      <div className="col-span-2 text-center">Qtd</div>
                      <div className="col-span-2 text-right">Preço</div>
                      <div className="col-span-2 text-right">Subtotal</div>
                    </div>
                  </div>
                  <div className="divide-y">
                    {currentOrder.items.map((item) => (
                      <div key={item.id} className="px-4 py-3 grid grid-cols-12">
                        <div className="col-span-6">
                          <p className="font-medium">{item.productName}</p>
                          {item.notes && (
                            <p className="text-sm text-muted-foreground">{item.notes}</p>
                          )}
                          <Badge variant="outline" className="mt-1">
                            {item.status}
                          </Badge>
                        </div>
                        <div className="col-span-2 text-center self-center">
                          {item.quantity}
                        </div>
                        <div className="col-span-2 text-right self-center">
                          R$ {item.unitPrice.toFixed(2)}
                        </div>
                        <div className="col-span-2 text-right self-center font-medium">
                          R$ {(item.quantity * item.unitPrice).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Pagamento
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p>Nenhum pedido ativo para esta mesa</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setIsOrderDialogOpen(true)}
                >
                  Criar Novo Pedido
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="reservations" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Reservas</h3>
              <Dialog open={isReservationDialogOpen} onOpenChange={setIsReservationDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    Nova Reserva
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      Nova Reserva
                    </DialogTitle>
                    <DialogDescription>
                      Agende uma nova reserva para esta mesa.
                    </DialogDescription>
                  </DialogHeader>
                  <TableReservationForm 
                    tableId={table.id}
                    onComplete={() => {
                      setIsReservationDialogOpen(false);
                      loadTableData();
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>

            {reservations.length > 0 ? (
              <div className="space-y-3">
                {reservations.map((reservation) => (
                  <Card key={reservation.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{reservation.customerName}</p>
                          <p className="text-sm text-muted-foreground">
                            {reservation.customerPhone}
                          </p>
                          {reservation.customerEmail && (
                            <p className="text-sm text-muted-foreground">
                              {reservation.customerEmail}
                            </p>
                          )}
                        </div>
                        <Badge variant={
                          reservation.status === 'confirmed' ? 'default' :
                          reservation.status === 'pending' ? 'secondary' :
                          reservation.status === 'cancelled' ? 'destructive' :
                          'outline'
                        }>
                          {reservation.status}
                        </Badge>
                      </div>
                      <div className="mt-3 flex items-center gap-4">
                        <div>
                          <p className="text-sm font-medium">Data</p>
                          <p className="text-sm">{reservation.date}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Horário</p>
                          <p className="text-sm">{reservation.time}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Duração</p>
                          <p className="text-sm">{reservation.duration} min</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Pessoas</p>
                          <p className="text-sm">{reservation.numberOfGuests}</p>
                        </div>
                      </div>
                      {reservation.notes && (
                        <div className="mt-2">
                          <p className="text-sm font-medium">Observações</p>
                          <p className="text-sm">{reservation.notes}</p>
                        </div>
                      )}
                      <div className="mt-3 flex justify-end gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </Button>
                        <Button variant="outline" size="sm" className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Cancelar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p>Nenhuma reserva para esta mesa</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setIsReservationDialogOpen(true)}
                >
                  Criar Nova Reserva
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onClose}>
          Fechar
        </Button>
        <Button>
          Editar Mesa
        </Button>
      </CardFooter>
    </Card>
  );
} 