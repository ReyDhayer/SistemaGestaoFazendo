import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { TableMap } from '@/components/tables/TableMap';
import { TableList } from '@/components/tables/TableList';
import { TableReservationList } from '@/components/tables/TableReservationList';
import { TableOrderList } from '@/components/tables/TableOrderList';
import { TableStatisticsView } from '@/components/tables/TableStatisticsView';
import { TableAreaList } from '@/components/tables/TableAreaList';
import { TableSettingsForm } from '@/components/tables/TableSettingsForm';
import { TableStatus } from '@/types/tables';
import { tableService } from '@/services/table';
import { Utensils, Search, Plus, LayoutGrid, List, Calendar, ShoppingCart, BarChart2, Settings, Map } from 'lucide-react';

export default function Tables() {
  const [activeTab, setActiveTab] = useState("map");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tables, setTables] = useState([]);
  const [areas, setAreas] = useState([]);
  const [layout, setLayout] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [orders, setOrders] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [tablesData, areasData, layoutData, reservationsData, ordersData] = await Promise.all([
        tableService.getAll(),
        tableService.getAllAreas(),
        tableService.getLayout(),
        tableService.getAllReservations(),
        tableService.getAllOrders()
      ]);
      
      setTables(tablesData);
      setAreas(areasData);
      setLayout(layoutData);
      setReservations(reservationsData);
      setOrders(ordersData);
    } catch (error) {
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os dados das mesas.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (value: string) => {
    setSearchTerm(value);
    if (!value.trim()) {
      loadData();
      return;
    }
    
    try {
      setIsLoading(true);
      const results = await tableService.search(value);
      setTables(results);
    } catch (error) {
      toast({
        title: "Erro ao buscar mesas",
        description: "Não foi possível realizar a busca.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (tableId: number, status: TableStatus) => {
    try {
      setIsLoading(true);
      await tableService.updateStatus(tableId, status);
      toast({
        title: "Status atualizado",
        description: "O status da mesa foi atualizado com sucesso.",
      });
      loadData();
    } catch (error) {
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status da mesa.",
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
          <Utensils className="h-8 w-8" />
          Mesas
        </h1>
        
        <Button onClick={() => setActiveTab("settings")}>
          <Settings className="h-4 w-4 mr-2" />
          Configurações
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Mesas</CardTitle>
          <CardDescription>
            Visualize e gerencie as mesas do seu estabelecimento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar mesas..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button onClick={() => setActiveTab("new")}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Mesa
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-7 mb-6">
              <TabsTrigger value="map" className="flex items-center gap-2">
                <Map className="h-4 w-4" />
                <span className="hidden sm:inline">Mapa</span>
              </TabsTrigger>
              <TabsTrigger value="list" className="flex items-center gap-2">
                <List className="h-4 w-4" />
                <span className="hidden sm:inline">Lista</span>
              </TabsTrigger>
              <TabsTrigger value="areas" className="flex items-center gap-2">
                <LayoutGrid className="h-4 w-4" />
                <span className="hidden sm:inline">Áreas</span>
              </TabsTrigger>
              <TabsTrigger value="reservations" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Reservas</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                <span className="hidden sm:inline">Pedidos</span>
              </TabsTrigger>
              <TabsTrigger value="statistics" className="flex items-center gap-2">
                <BarChart2 className="h-4 w-4" />
                <span className="hidden sm:inline">Estatísticas</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Configurações</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="map" className="space-y-4">
              <TableMap 
                tables={tables} 
                areas={areas} 
                layout={layout}
                onStatusChange={handleStatusChange}
                isLoading={isLoading}
              />
            </TabsContent>

            <TabsContent value="list" className="space-y-4">
              <TableList 
                tables={tables}
                onStatusChange={handleStatusChange}
                isLoading={isLoading}
                onRefresh={loadData}
              />
            </TabsContent>

            <TabsContent value="areas" className="space-y-4">
              <TableAreaList 
                areas={areas}
                isLoading={isLoading}
                onRefresh={loadData}
              />
            </TabsContent>

            <TabsContent value="reservations" className="space-y-4">
              <TableReservationList 
                reservations={reservations}
                tables={tables}
                isLoading={isLoading}
                onRefresh={loadData}
              />
            </TabsContent>

            <TabsContent value="orders" className="space-y-4">
              <TableOrderList 
                orders={orders}
                tables={tables}
                isLoading={isLoading}
                onRefresh={loadData}
              />
            </TabsContent>

            <TabsContent value="statistics" className="space-y-4">
              <TableStatisticsView 
                tables={tables}
                isLoading={isLoading}
              />
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <TableSettingsForm 
                layout={layout}
                isLoading={isLoading}
                onSave={loadData}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
} 