
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Eye, EyeOff, Pencil, Plus, Trash2, UserCog, UserPlus, Users } from "lucide-react";

const userFormSchema = z.object({
  name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  role: z.string().min(1, { message: "Função é obrigatória" }),
  password: z.string().min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
  active: z.boolean().default(true),
});

type UserFormValues = z.infer<typeof userFormSchema>;

// Define a type for our user object
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  active: boolean;
}

const defaultValues: Partial<UserFormValues> = {
  name: "",
  email: "",
  role: "operator",
  password: "",
  active: true,
};

// Mock user data
const mockUsers: User[] = [
  { id: 1, name: "João Silva", email: "joao@example.com", role: "admin", active: true },
  { id: 2, name: "Maria Oliveira", email: "maria@example.com", role: "manager", active: true },
  { id: 3, name: "Carlos Santos", email: "carlos@example.com", role: "operator", active: true },
  { id: 4, name: "Ana Costa", email: "ana@example.com", role: "operator", active: false },
];

interface UserManagementSettingsProps {
  onSave: () => void;
}

const UserManagementSettings = ({ onSave }: UserManagementSettingsProps) => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [showForm, setShowForm] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues,
  });

  function onSubmit(data: UserFormValues) {
    if (editingUserId) {
      // Update existing user, ensuring all required fields are present
      setUsers(
        users.map((user) =>
          user.id === editingUserId ? {
            id: user.id,
            name: data.name,
            email: data.email,
            role: data.role,
            active: data.active
          } : user
        )
      );
      setEditingUserId(null);
    } else {
      // Add new user
      const newUser: User = {
        id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
        name: data.name,
        email: data.email,
        role: data.role,
        active: data.active
      };
      setUsers([...users, newUser]);
    }
    
    setShowForm(false);
    form.reset(defaultValues);
    onSave();
  }

  const handleEditUser = (user: any) => {
    setEditingUserId(user.id);
    form.reset({
      name: user.name,
      email: user.email,
      role: user.role,
      password: "******", // Placeholder password
      active: user.active,
    });
    setShowForm(true);
  };

  const handleDeleteUser = (userId: number) => {
    setUsers(users.filter((user) => user.id !== userId));
  };

  const handleToggleUserActive = (userId: number) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, active: !user.active } : user
      )
    );
  };

  const handleAddNewUser = () => {
    setEditingUserId(null);
    form.reset(defaultValues);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingUserId(null);
    form.reset(defaultValues);
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrador";
      case "manager":
        return "Gerente";
      case "operator":
        return "Operador";
      default:
        return role;
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span>Usuários do Sistema</span>
            </div>
            <Button 
              onClick={handleAddNewUser} 
              className="flex items-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              <span>Novo Usuário</span>
            </Button>
          </CardTitle>
          <CardDescription>
            Gerencie os usuários que têm acesso ao sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Função</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getRoleName(user.role)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={user.active}
                        onCheckedChange={() => handleToggleUserActive(user.id)}
                      />
                      <span className={`text-sm ${user.active ? "text-green-600" : "text-red-600"}`}>
                        {user.active ? "Ativo" : "Inativo"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditUser(user)}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Excluir</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCog className="h-5 w-5" />
              {editingUserId ? "Editar Usuário" : "Novo Usuário"}
            </CardTitle>
            <CardDescription>
              {editingUserId
                ? "Atualize as informações do usuário"
                : "Preencha as informações para criar um novo usuário"}
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome completo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="email@exemplo.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Função</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma função" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="admin">
                              Administrador
                            </SelectItem>
                            <SelectItem value="manager">Gerente</SelectItem>
                            <SelectItem value="operator">Operador</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Define os níveis de acesso do usuário
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Senha"
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                              <span className="sr-only">
                                {showPassword
                                  ? "Esconder senha"
                                  : "Mostrar senha"}
                              </span>
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Ativo</FormLabel>
                        <FormDescription>
                          Determina se o usuário está ativo e pode fazer login
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={handleCancelForm}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingUserId ? "Atualizar Usuário" : "Criar Usuário"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      )}

      {!showForm && (
        <div className="flex justify-end">
          <Button onClick={onSave} size="lg">
            Salvar Configurações
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserManagementSettings;
