
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Edit, 
  Trash, 
  Phone, 
  Mail 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'individual' | 'business';
  city: string;
}

// Mock data
const mockClients: Client[] = [
  { id: '1', name: 'João Silva', email: 'joao.silva@email.com', phone: '(11) 99999-1234', type: 'individual', city: 'São Paulo' },
  { id: '2', name: 'Empresa ABC Ltda', email: 'contato@abcltda.com', phone: '(11) 3333-4444', type: 'business', city: 'São Paulo' },
  { id: '3', name: 'Maria Oliveira', email: 'maria.oliveira@email.com', phone: '(21) 98888-5678', type: 'individual', city: 'Rio de Janeiro' },
  { id: '4', name: 'Pedro Santos', email: 'pedro.santos@email.com', phone: '(31) 97777-9012', type: 'individual', city: 'Belo Horizonte' },
  { id: '5', name: 'Tech Solutions Inc', email: 'contato@techsolutions.com', phone: '(11) 2222-3333', type: 'business', city: 'São Paulo' },
  { id: '6', name: 'Ana Costa', email: 'ana.costa@email.com', phone: '(41) 96666-7890', type: 'individual', city: 'Curitiba' },
  { id: '7', name: 'Carlos Mendes', email: 'carlos.mendes@email.com', phone: '(51) 95555-4321', type: 'individual', city: 'Porto Alegre' },
];

interface SortConfig {
  key: keyof Client;
  direction: 'asc' | 'desc';
}

interface ClientListProps {
  onDelete?: (id: string) => void;
}

const ClientList = ({ onDelete }: ClientListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: 'asc' });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (key: keyof Client) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Filter and sort clients
  const filteredClients = mockClients
    .filter(client => 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm) ||
      client.city.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

  return (
    <div className="space-y-4 animate-slide-in">
      <div className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar clientes..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-9"
          />
        </div>
      </div>

      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center">
                  Nome
                  {sortConfig.key === 'name' && (
                    sortConfig.direction === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hidden md:table-cell"
                onClick={() => handleSort('email')}
              >
                <div className="flex items-center">
                  Email
                  {sortConfig.key === 'email' && (
                    sortConfig.direction === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead className="hidden sm:table-cell">Telefone</TableHead>
              <TableHead 
                className="cursor-pointer hidden lg:table-cell"
                onClick={() => handleSort('city')}
              >
                <div className="flex items-center">
                  Cidade
                  {sortConfig.key === 'city' && (
                    sortConfig.direction === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('type')}
              >
                <div className="flex items-center">
                  Tipo
                  {sortConfig.key === 'type' && (
                    sortConfig.direction === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <TableRow key={client.id} className="group">
                  <TableCell>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      <Link 
                        to={`/clients/${client.id}`}
                        className="font-medium hover:text-primary transition-colors"
                      >
                        {client.name}
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-muted-foreground">{client.email}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-muted-foreground">{client.phone}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {client.city}
                  </TableCell>
                  <TableCell>
                    <Badge variant={client.type === 'business' ? 'default' : 'secondary'} className="font-normal">
                      {client.type === 'business' ? 'Empresa' : 'Pessoa Física'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/clients/${client.id}/edit`}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Link>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => onDelete?.(client.id)}
                      >
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Excluir</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Nenhum cliente encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ClientList;
