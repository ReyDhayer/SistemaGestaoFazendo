
import { useParams } from "react-router-dom";
import PageHeader from "@/components/common/PageHeader";
import ProductForm from "@/components/products/ProductForm";

const ProductDetail = () => {
  const { id } = useParams();
  const isNew = id === "new";

  // Mock onSubmit function that would normally connect to an API
  const handleSubmit = (data: any) => {
    console.log("Product form submitted:", data);
    // Here you would typically save the data to your API
  };

  return (
    <div className="container mx-auto py-6 space-y-6 animate-fade-in">
      <PageHeader
        title={isNew ? "Add New Product" : "Edit Product"}
        description={isNew ? "Create a new product in your inventory" : "Update product information and stock"}
        backLink="/products"
      />
      
      <div className="glass-card p-6">
        <ProductForm 
          initialData={isNew ? undefined : { name: "Loading..." }} 
          onSubmit={handleSubmit}
          isLoading={false}
        />
      </div>
    </div>
  );
};

export default ProductDetail;
