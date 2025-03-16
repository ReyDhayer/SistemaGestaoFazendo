
import { useParams } from "react-router-dom";
import PageHeader from "@/components/common/PageHeader";
import SaleForm from "@/components/sales/SaleForm";

const SaleDetail = () => {
  const { id } = useParams();
  const isNew = id === "new";

  // Mock onSubmit function that would normally connect to an API
  const handleSubmit = (data: any, items: any[]) => {
    console.log("Sale form submitted:", data, "Items:", items);
    // Here you would typically save the data to your API
  };

  return (
    <div className="container mx-auto py-6 space-y-6 animate-fade-in">
      <PageHeader
        title={isNew ? "New Sale" : "Sale Details"}
        description={isNew ? "Register a new sale" : "View or edit sale information"}
        backLink="/sales"
      />
      
      <div className="glass-card p-6">
        <SaleForm 
          onSubmit={handleSubmit}
          isLoading={false}
        />
      </div>
    </div>
  );
};

export default SaleDetail;
