
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/common/PageHeader";
import ClientList from "@/components/clients/ClientList";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Clients = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-6 space-y-6 animate-fade-in">
      <PageHeader
        title="Clients"
        description="Manage your client database"
        actions={
          <Button onClick={() => navigate("/clients/new")}>
            <Plus className="mr-2 h-4 w-4" />
            Add Client
          </Button>
        }
      />
      
      <div className="glass-card p-6">
        <ClientList />
      </div>
    </div>
  );
};

export default Clients;
