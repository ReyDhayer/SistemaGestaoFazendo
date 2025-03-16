import React, { useState } from 'react';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table as TableType, TableOrder } from '@/types/tables';
import { RefreshCw, Search, ShoppingCart, Clock, CreditCard, ChevronDown, ChevronUp } from 'lucide-react';

interface TableOrderListProps {
  orders: TableOrder[];
  tables: TableType[];
  isLoading: boolean;
  onRefresh: () => void;
}

export function TableOrderList({ orders, tables, isLoading, onRefresh }: TableOrderListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<TableOrder | null>(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
  };

  const toggleOrderDetails = (orderId: number) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const handlePayment = (order: TableOrder) => {
    setSelectedOrder(order);
    setIsPaymentDialogOpen(true);
  };

  const filteredOrders = orders.filter(order => {
    const table = tables.find(t => t.id === order.tableId);
    const tableName = table ? `Mesa ${table.number} - ${table.name}` : `Mesa ${order.tableId}`;
    
    const matchesSearch = 
      tableName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some(item => item.productName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pendente</Badge>;
      case 'preparing':
        return <Badge variant="warning" className="bg-yellow-500 text-white">Preparando</Badge>;
      case 'ready':
        return <Badge variant="outline" className="bg-blue-500 text-white">Pronto</Badge>;
      case 'delivered':
        return <Badge variant="default">Entregue</Badge>;
      case 'paid':
        return <Badge variant="success" className="bg-green-500 text-white">Pago</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTableName = (tableId: number) => {
    const table = tables.find(t => t.id === tableId);
    return table ? `Mesa ${table.number} - ${table.name}` : `Mesa ${tableId}`;
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Pedidos</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onRefresh} disabled={isLoading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <Button size="sm">
            Novo Pedido
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por mesa ou produto..."
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
            <SelectItem value="pending">Pendentes</SelectItem>
            <SelectItem value="preparing">Preparando</SelectItem>
            <SelectItem value="ready">Prontos</SelectItem>
            <SelectItem value="delivered">Entregues</SelectItem>
            <SelectItem value="paid">Pagos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-8 border rounded-md">
            <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-20" />
            <p className="text-muted-foreground">Nenhum pedido encontrado</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <div 
                className="p-4 flex justify-between items-center cursor-pointer hover:bg-muted/50"
                onClick={() => toggleOrderDetails(order.id)}
              >
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{getTableName(order.tableId)}</span>
                    {getStatusBadge(order.status)}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatDateTime(order.createdAt)}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Total</div>
                    <div className="font-medium">R$ {order.totalAmount.toFixed(2)}</div>
                  </div>
                  {expandedOrderId === order.id ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </div>

              {expandedOrderId === order.id && (
                <CardContent className="border-t pt-4">
                  <div className="space-y-4">
                    <div className="bg-muted px-4 py-2 rounded-md">
                      <div className="grid grid-cols-12 text-sm font-medium">
                        <div className="col-span-6">Item</div>
                        <div className="col-span-2 text-center">Qtd</div>
                        <div className="col-span-2 text-right">Preço</div>
                        <div className="col-span-2 text-right">Subtotal</div>
                      </div>
                    </div>
                    <div className="divide-y">
                      {order.items.map((item) => (
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

                    <div className="flex justify-between items-center p-4 bg-muted rounded-md">
                      <div>
                        <p className="text-sm text-muted-foreground">Atualizado em: {formatDateTime(order.updatedAt)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Total do Pedido</p>
                        <p className="text-xl font-bold">R$ {order.totalAmount.toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      {order.status !== 'paid' && (
                        <Button 
                          variant="default" 
                          onClick={() => handlePayment(order)}
                        >
                          <CreditCard className="h-4 w-4 mr-2" />
                          Pagamento
                        </Button>
                      )}
                      <Button variant="outline">
                        Detalhes
                      </Button>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>

      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Pagamento</DialogTitle>
            <DialogDescription>
              Registre o pagamento para este pedido
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-4 py-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{getTableName(selectedOrder.tableId)}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDateTime(selectedOrder.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-xl font-bold">R$ {selectedOrder.totalAmount.toFixed(2)}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Forma de Pagamento</p>
                <Select defaultValue="credit_card">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a forma de pagamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
                    <SelectItem value="debit_card">Cartão de Débito</SelectItem>
                    <SelectItem value="cash">Dinheiro</SelectItem>
                    <SelectItem value="pix">PIX</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Dividir entre</p>
                <Select defaultValue="1">
                  <SelectTrigger>
                    <SelectValue placeholder="Número de pessoas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 pessoa</SelectItem>
                    <SelectItem value="2">2 pessoas</SelectItem>
                    <SelectItem value="3">3 pessoas</SelectItem>
                    <SelectItem value="4">4 pessoas</SelectItem>
                    <SelectItem value="5">5 pessoas</SelectItem>
                    <SelectItem value="6">6 pessoas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-medium">Subtotal</p>
                  <p>R$ {selectedOrder.totalAmount.toFixed(2)}</p>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <p className="font-medium">Taxa de Serviço (10%)</p>
                  <p>R$ {(selectedOrder.totalAmount * 0.1).toFixed(2)}</p>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <p className="font-medium">Total a Pagar</p>
                  <p className="text-xl font-bold">R$ {(selectedOrder.totalAmount * 1.1).toFixed(2)}</p>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button>
                  Confirmar Pagamento
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 