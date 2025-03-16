
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageHeader from "@/components/common/PageHeader";
import MainLayout from "@/components/layout/MainLayout";
import GeneralSettings from "@/components/settings/GeneralSettings";
import NotificationSettings from "@/components/settings/NotificationSettings";
import PaymentSettings from "@/components/settings/PaymentSettings";
import UserManagementSettings from "@/components/settings/UserManagementSettings";
import AbcCurveSettings from "@/components/settings/AbcCurveSettings";
import MarkupSettings from "@/components/settings/MarkupSettings";
import DeliverySettings from "@/components/settings/DeliverySettings";
import TableSettings from "@/components/settings/TableSettings";
import InventorySettings from "@/components/settings/InventorySettings";
import ReportSettings from "@/components/settings/ReportSettings";
import FiscalSettings from "@/components/settings/FiscalSettings";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general");
  const { toast } = useToast();

  const handleSave = (section: string) => {
    toast({
      title: "Configurações salvas",
      description: `As configurações de ${section} foram salvas com sucesso.`,
    });
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-6 space-y-6 animate-fade-in">
        <PageHeader
          title="Configurações do Sistema"
          description="Gerencie todas as configurações do seu PDV"
          backLink="/dashboard"
        />

        <div className="glass-card p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 mb-6 h-auto p-1 w-full">
              <TabsTrigger value="general" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Geral</TabsTrigger>
              <TabsTrigger value="notification" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Notificações</TabsTrigger>
              <TabsTrigger value="payment" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Pagamentos</TabsTrigger>
              <TabsTrigger value="users" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Usuários</TabsTrigger>
              <TabsTrigger value="abc" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Curva ABC</TabsTrigger>
              <TabsTrigger value="markup" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Markup</TabsTrigger>
              <TabsTrigger value="delivery" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Delivery</TabsTrigger>
              <TabsTrigger value="tables" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Mesas</TabsTrigger>
              <TabsTrigger value="inventory" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Estoque</TabsTrigger>
              <TabsTrigger value="reports" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Relatórios</TabsTrigger>
              <TabsTrigger value="fiscal" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Fiscal</TabsTrigger>
              <TabsTrigger value="accounts" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Contas</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4 animate-in fade-in-50">
              <GeneralSettings onSave={() => handleSave("Geral")} />
            </TabsContent>
            
            <TabsContent value="notification" className="space-y-4 animate-in fade-in-50">
              <NotificationSettings onSave={() => handleSave("Notificações")} />
            </TabsContent>
            
            <TabsContent value="payment" className="space-y-4 animate-in fade-in-50">
              <PaymentSettings onSave={() => handleSave("Pagamentos")} />
            </TabsContent>
            
            <TabsContent value="users" className="space-y-4 animate-in fade-in-50">
              <UserManagementSettings onSave={() => handleSave("Usuários")} />
            </TabsContent>
            
            <TabsContent value="abc" className="space-y-4 animate-in fade-in-50">
              <AbcCurveSettings onSave={() => handleSave("Curva ABC")} />
            </TabsContent>
            
            <TabsContent value="markup" className="space-y-4 animate-in fade-in-50">
              <MarkupSettings onSave={() => handleSave("Markup")} />
            </TabsContent>
            
            <TabsContent value="delivery" className="space-y-4 animate-in fade-in-50">
              <DeliverySettings onSave={() => handleSave("Delivery")} />
            </TabsContent>
            
            <TabsContent value="tables" className="space-y-4 animate-in fade-in-50">
              <TableSettings onSave={() => handleSave("Mesas")} />
            </TabsContent>
            
            <TabsContent value="inventory" className="space-y-4 animate-in fade-in-50">
              <InventorySettings onSave={() => handleSave("Estoque")} />
            </TabsContent>
            
            <TabsContent value="reports" className="space-y-4 animate-in fade-in-50">
              <ReportSettings onSave={() => handleSave("Relatórios")} />
            </TabsContent>
            
            <TabsContent value="fiscal" className="space-y-4 animate-in fade-in-50">
              <FiscalSettings onSave={() => handleSave("Fiscal")} />
            </TabsContent>
            
            <TabsContent value="accounts" className="space-y-4 animate-in fade-in-50">
              <ReportSettings onSave={() => handleSave("Contas")} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;
