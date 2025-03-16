
import { useParams } from "react-router-dom";
import PageHeader from "@/components/common/PageHeader";
import ClientForm from "@/components/clients/ClientForm";

const ClientDetail = () => {
  const { id } = useParams();
  const isNew = id === "new";

  // Mock onSubmit function that would normally connect to an API
  const handleSubmit = (data: any) => {
    console.log("Client form submitted:", data);
    // Here you would typically save the data to your API
  };

  return (
    <div className="container mx-auto py-6 space-y-6 animate-fade-in">
      <PageHeader
        title={isNew ? "Add New Client" : "Edit Client"}
        description={isNew ? "Register a new client in your system" : "Update client information"}
        backLink="/clients"
      />
      
      <div className="glass-card p-6">
        <ClientForm 
          initialData={isNew ? undefined : { name: "Loading..." }} 
          onSubmit={handleSubmit}
          isLoading={false}
        />
      </div>
    </div>
  );
};

export default ClientDetail;
