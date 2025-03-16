
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/common/PageHeader';
import ProductList from '@/components/products/ProductList';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const Products = () => {
  const navigate = useNavigate();

  const handleAddProduct = () => {
    navigate('/products/new');
  };

  const handleDeleteProduct = (id: string) => {
    // Here would be the API call to delete the product
    console.log(`Deleting product with id: ${id}`);
    
    // Show success toast notification
    toast({
      title: "Produto excluído",
      description: `O produto foi removido com sucesso.`,
    });
  };

  return (
    <MainLayout>
      <div className="animate-fade-in">
        <PageHeader 
          title="Produtos" 
          description="Gerencie seu catálogo de produtos"
          actions={
            <Button onClick={handleAddProduct}>
              <Plus className="mr-2 h-4 w-4" />
              Novo produto
            </Button>
          }
        />

        <ProductList onDelete={handleDeleteProduct} />
      </div>
    </MainLayout>
  );
};

export default Products;
