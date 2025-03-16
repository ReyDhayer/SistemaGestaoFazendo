export interface TablePosition {
  x: number;
  y: number;
}

export interface TableShape {
  type: 'circle' | 'rectangle' | 'square';
  width: number;
  height?: number; // Opcional para círculos
  radius?: number; // Para círculos
}

export enum TableStatus {
  FREE = 'free',
  OCCUPIED = 'occupied',
  RESERVED = 'reserved',
  WAITING_SERVICE = 'waiting_service',
  WAITING_PAYMENT = 'waiting_payment',
  CLEANING = 'cleaning'
}

export interface TableReservation {
  id: number;
  tableId: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  date: string; // ISO date string
  time: string;
  duration: number; // Em minutos
  numberOfGuests: number;
  notes?: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
}

export interface TableOrder {
  id: number;
  tableId: number;
  items: OrderItem[];
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'paid';
  createdAt: string;
  updatedAt: string;
  totalAmount: number;
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  notes?: string;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
}

export interface TablePayment {
  id: number;
  tableId: number;
  orderId: number;
  amount: number;
  method: 'cash' | 'credit_card' | 'debit_card' | 'pix' | 'other';
  status: 'pending' | 'completed' | 'cancelled';
  splitBetween?: number; // Número de pessoas para dividir a conta
  createdAt: string;
}

export interface Table {
  id: number;
  number: number;
  name: string;
  capacity: number;
  status: TableStatus;
  position: TablePosition;
  shape: TableShape;
  area: string; // Área do estabelecimento (ex: "Terraço", "Salão Principal")
  currentOrder?: TableOrder;
  currentReservation?: TableReservation;
  isActive: boolean;
}

export interface TableArea {
  id: number;
  name: string;
  description?: string;
  tables: Table[];
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  background?: string; // URL da imagem de fundo ou cor
}

export interface TableLayout {
  id: number;
  name: string;
  description?: string;
  areas: TableArea[];
  width: number;
  height: number;
  scale: number;
  backgroundImage?: string;
}

export interface TableFormData {
  number: number;
  name: string;
  capacity: number;
  position: TablePosition;
  shape: TableShape;
  area: string;
  isActive: boolean;
}

export interface TableAreaFormData {
  name: string;
  description?: string;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  background?: string;
}

export interface TableReservationFormData {
  tableId: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  date: string;
  time: string;
  duration: number;
  numberOfGuests: number;
  notes?: string;
}

export interface TableStatistics {
  averageOccupationTime: number; // Em minutos
  turnoverRate: number; // Número de vezes que a mesa é ocupada por dia
  revenueGenerated: number;
  popularHours: { hour: number; count: number }[];
  popularDays: { day: string; count: number }[];
  averagePartySize: number;
}

export interface TableMapSettings {
  showTableNumbers: boolean;
  showTableStatus: boolean;
  showTableCapacity: boolean;
  showTableOrders: boolean;
  showTableReservations: boolean;
  enableDragAndDrop: boolean;
  enableZoom: boolean;
  autoRefreshInterval: number; // Em segundos
} 