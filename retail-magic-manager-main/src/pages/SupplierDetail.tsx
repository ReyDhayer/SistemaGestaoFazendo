
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PageHeader from "@/components/common/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, User, Phone, Mail, MapPin, Package, FileText, History, ArrowLeft } from 'lucide-react';

// Mock data para um fornecedor específico
const mockSupplierDetails = {
  id: 1,
  name: "Distribuidora Central Ltda",
  contact: "João Silva",
  phone: "(11) 3456-7890",
  email: "contato@central.com",
  address: "Rua das Indústrias, 1000 - Distrito Industrial",
  city: "São Paulo",
  state: "SP",
  zipCode: "04856-000",
  taxId: "12.345.678/0001-90",
  categories: ["Alimentos", "Bebidas"],
  paymentTerms: "30 dias",
  website: "www.distribuidoracentral.com.br",
  notes: "Fornecedor preferencial para produtos importados. Oferece desconto de 5% para pagamentos à vista.",
  products: [
    { id: 101, name: "Refrigerante Cola 2L", price: 5.49, category: "Bebidas" },
    { id: 102, name: "Água Mineral 500ml", price: 1.99, category: "Bebidas" },
    { id: 103, name: "Biscoito Recheado 200g", price: 3.29, category: "Alimentos" },
    { id: 104, name: "Salgadinho 80g", price: 4.50, category: "Alimentos" },
    { id: 105, name: "Suco Natural 1L", price: 7.90, category: "Bebidas" },
  ],
  history: [
    { id: 1, date: "2023-12-15", type: "Pedido", amount: "R$ 2.450,00", status: "Entregue" },
    { id: 2, date: "2023-11-22", type: "Pagamento", amount: "R$ 1.890,00", status: "Concluído" },
    { id: 3, date: "2023-11-10", type: "Pedido", amount: "R$ 1.890,00", status: "Entregue" },
    { id: 4, date: "2023-10-05", type: "Devolução", amount: "R$ 320,00", status: "Processado" }
  ]
};

const SupplierDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const supplier = mockSupplierDetails;
  
  return (
    <div className="container mx-auto py-6 space-y-6 animate-fade-in">
      <PageHeader 
        title={supplier.name} 
        description={`Detalhes do fornecedor #${id}`}
        backLink="/suppliers"
      />

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
          <TabsTrigger value="details">Informações</TabsTrigger>
          <TabsTrigger value="products">Produtos</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex items-center gap-2">
                <Building className="h-5 w-5 text-primary" />
                Dados do Fornecedor
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Contato</p>
                    <p className="text-muted-foreground">{supplier.contact}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Telefone</p>
                    <p className="text-muted-foreground">{supplier.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">{supplier.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">CNPJ</p>
                    <p className="text-muted-foreground">{supplier.taxId}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Endereço</p>
                    <p className="text-muted-foreground">{supplier.address}</p>
                    <p className="text-muted-foreground">{supplier.city}, {supplier.state} - CEP {supplier.zipCode}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Package className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Categorias</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {supplier.categories.map((category) => (
                        <span key={category} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary text-secondary-foreground">
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Condições de Pagamento</p>
                    <p className="text-muted-foreground">{supplier.paymentTerms}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">Observações</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{supplier.notes}</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Produtos Fornecidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="min-w-full divide-y divide-border">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Produto</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Categoria</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Preço</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="bg-background divide-y divide-border">
                    {supplier.products.map((product) => (
                      <tr key={product.id}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">{product.id}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">{product.name}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary text-secondary-foreground">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">R$ {product.price.toFixed(2)}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                          <Button variant="ghost" size="sm">Ver produto</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex items-center gap-2">
                <History className="h-5 w-5 text-primary" />
                Histórico de Transações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="min-w-full divide-y divide-border">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Data</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Tipo</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Valor</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="bg-background divide-y divide-border">
                    {supplier.history.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">{item.date}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">{item.type}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">{item.amount}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            item.status === 'Entregue' ? 'bg-green-100 text-green-800' :
                            item.status === 'Concluído' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                          <Button variant="ghost" size="sm">Detalhes</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SupplierDetail;
