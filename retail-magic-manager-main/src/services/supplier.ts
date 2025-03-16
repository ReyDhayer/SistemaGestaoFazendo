import { Supplier, SupplierFormData, SupplierUpdateData } from "@/types/supplier";

// Simula um banco de dados em memória
let suppliers: Supplier[] = [
  {
    id: 1,
    name: "Fornecedor A Ltda",
    contact: "João Silva",
    email: "joao@fornecedora.com",
    phone: "(11) 99999-9999",
    address: "Rua A, 123",
    city: "São Paulo",
    state: "SP",
    zipCode: "01234-567",
    taxId: "12.345.678/0001-90",
    categories: ["Eletrônicos"],
    website: "https://fornecedora.com.br",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    name: "Distribuidora B",
    contact: "Maria Santos",
    email: "maria@distribuidorab.com",
    phone: "(21) 98888-8888",
    address: "Av B, 456",
    city: "Rio de Janeiro",
    state: "RJ",
    zipCode: "20000-000",
    taxId: "98.765.432/0001-10",
    categories: ["Alimentos"],
    paymentTerms: "30 dias",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const supplierService = {
  getAll: async (): Promise<Supplier[]> => {
    // Simula uma chamada à API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(suppliers);
      }, 500);
    });
  },

  getById: async (id: number): Promise<Supplier | null> => {
    // Simula uma chamada à API
    return new Promise((resolve) => {
      setTimeout(() => {
        const supplier = suppliers.find((s) => s.id === id);
        resolve(supplier || null);
      }, 500);
    });
  },

  create: async (data: SupplierFormData): Promise<Supplier> => {
    // Simula uma chamada à API
    return new Promise((resolve) => {
      setTimeout(() => {
        const newSupplier: Supplier = {
          ...data,
          id: suppliers.length + 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        suppliers.push(newSupplier);
        resolve(newSupplier);
      }, 500);
    });
  },

  update: async (id: number, data: SupplierUpdateData): Promise<Supplier> => {
    // Simula uma chamada à API
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = suppliers.findIndex((s) => s.id === id);
        if (index === -1) {
          reject(new Error("Fornecedor não encontrado"));
          return;
        }

        const updatedSupplier: Supplier = {
          ...suppliers[index],
          ...data,
          updatedAt: new Date(),
        };

        suppliers[index] = updatedSupplier;
        resolve(updatedSupplier);
      }, 500);
    });
  },

  delete: async (id: number): Promise<void> => {
    // Simula uma chamada à API
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = suppliers.findIndex((s) => s.id === id);
        if (index === -1) {
          reject(new Error("Fornecedor não encontrado"));
          return;
        }

        suppliers = suppliers.filter((s) => s.id !== id);
        resolve();
      }, 500);
    });
  },

  search: async (query: string): Promise<Supplier[]> => {
    // Simula uma chamada à API
    return new Promise((resolve) => {
      setTimeout(() => {
        const results = suppliers.filter((supplier) =>
          Object.values(supplier).some((value) =>
            value.toString().toLowerCase().includes(query.toLowerCase())
          )
        );
        resolve(results);
      }, 500);
    });
  },
}; 