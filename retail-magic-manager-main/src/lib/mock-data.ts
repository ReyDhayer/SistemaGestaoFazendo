
// Mock data types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface SaleItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Sale {
  id: string;
  clientId: string;
  items: SaleItem[];
  total: number;
  paymentMethod: "credit_card" | "pix" | "cash" | "bank_transfer";
  status: "pending" | "completed" | "canceled";
  createdAt: string;
  updatedAt: string;
}

// Mock data
export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Smartphone X",
    description: "Latest smartphone with high-end features",
    price: 1299.99,
    stock: 25,
    createdAt: "2023-01-15T10:30:00Z",
    updatedAt: "2023-01-15T10:30:00Z",
  },
  {
    id: "2",
    name: "Laptop Pro",
    description: "Professional laptop with powerful specs",
    price: 2499.99,
    stock: 10,
    createdAt: "2023-01-20T14:15:00Z",
    updatedAt: "2023-01-20T14:15:00Z",
  },
  {
    id: "3",
    name: "Wireless Earbuds",
    description: "Premium sound quality wireless earbuds",
    price: 159.99,
    stock: 50,
    createdAt: "2023-01-25T09:45:00Z",
    updatedAt: "2023-01-25T09:45:00Z",
  },
];

export const mockClients: Client[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "(555) 123-4567",
    address: "123 Main St, Anytown, CA 12345",
    createdAt: "2023-01-10T11:20:00Z",
    updatedAt: "2023-01-10T11:20:00Z",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "(555) 987-6543",
    address: "456 Oak Ave, Somewhere, NY 67890",
    createdAt: "2023-01-12T13:40:00Z",
    updatedAt: "2023-01-12T13:40:00Z",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    phone: "(555) 456-7890",
    address: "789 Pine Rd, Nowhere, TX 54321",
    createdAt: "2023-01-14T15:10:00Z",
    updatedAt: "2023-01-14T15:10:00Z",
  },
];

export const mockSales: Sale[] = [
  {
    id: "1",
    clientId: "1",
    items: [
      {
        id: "1",
        productId: "1",
        quantity: 1,
        unitPrice: 1299.99,
        total: 1299.99,
      },
      {
        id: "2",
        productId: "3",
        quantity: 1,
        unitPrice: 159.99,
        total: 159.99,
      },
    ],
    total: 1459.98,
    paymentMethod: "credit_card",
    status: "completed",
    createdAt: "2023-02-01T14:30:00Z",
    updatedAt: "2023-02-01T14:30:00Z",
  },
  {
    id: "2",
    clientId: "2",
    items: [
      {
        id: "3",
        productId: "2",
        quantity: 1,
        unitPrice: 2499.99,
        total: 2499.99,
      },
    ],
    total: 2499.99,
    paymentMethod: "pix",
    status: "completed",
    createdAt: "2023-02-05T11:15:00Z",
    updatedAt: "2023-02-05T11:15:00Z",
  },
];

// Mock API service (simulates backend calls)
export const mockApiService = {
  // Products
  getProducts: () => Promise.resolve([...mockProducts]),
  getProduct: (id: string) => Promise.resolve(mockProducts.find(p => p.id === id) || null),
  
  // Clients
  getClients: () => Promise.resolve([...mockClients]),
  getClient: (id: string) => Promise.resolve(mockClients.find(c => c.id === id) || null),
  
  // Sales
  getSales: () => Promise.resolve([...mockSales]),
  getSale: (id: string) => Promise.resolve(mockSales.find(s => s.id === id) || null),
  
  // Dashboard
  getDashboardStats: () => Promise.resolve({
    totalSales: mockSales.length,
    totalRevenue: mockSales.reduce((acc, sale) => acc + sale.total, 0),
    totalProducts: mockProducts.length,
    totalClients: mockClients.length,
    lowStockProducts: mockProducts.filter(p => p.stock < 5),
    recentSales: mockSales.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5),
  }),
};
