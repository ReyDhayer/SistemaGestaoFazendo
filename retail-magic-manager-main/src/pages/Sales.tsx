
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/common/PageHeader";
import SaleList from "@/components/sales/SaleList";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Sales = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-6 space-y-6 animate-fade-in">
      <PageHeader
        title="Sales"
        description="Manage your sales records"
        actions={
          <Button onClick={() => navigate("/sales/new")}>
            <Plus className="mr-2 h-4 w-4" />
            New Sale
          </Button>
        }
      />
      
      <div className="glass-card p-6">
        <SaleList />
      </div>
    </div>
  );
};

export default Sales;
