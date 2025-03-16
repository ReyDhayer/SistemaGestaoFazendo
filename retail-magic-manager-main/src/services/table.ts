import { 
  Table, 
  TableArea, 
  TableFormData, 
  TableLayout, 
  TableOrder, 
  TableReservation, 
  TableReservationFormData, 
  TableStatus, 
  TableStatistics,
  TableAreaFormData
} from '@/types/tables';

// Dados mockados para desenvolvimento
const mockTables: Table[] = [
  {
    id: 1,
    number: 1,
    name: 'Mesa 1',
    capacity: 4,
    status: TableStatus.FREE,
    position: { x: 100, y: 100 },
    shape: { type: 'circle', width: 80, radius: 40 },
    area: 'Salão Principal',
    isActive: true
  },
  {
    id: 2,
    number: 2,
    name: 'Mesa 2',
    capacity: 2,
    status: TableStatus.OCCUPIED,
    position: { x: 200, y: 100 },
    shape: { type: 'circle', width: 60, radius: 30 },
    area: 'Salão Principal',
    isActive: true
  },
  {
    id: 3,
    number: 3,
    name: 'Mesa 3',
    capacity: 6,
    status: TableStatus.RESERVED,
    position: { x: 300, y: 100 },
    shape: { type: 'rectangle', width: 120, height: 80 },
    area: 'Salão Principal',
    isActive: true
  },
  {
    id: 4,
    number: 4,
    name: 'Mesa 4',
    capacity: 4,
    status: TableStatus.WAITING_SERVICE,
    position: { x: 100, y: 200 },
    shape: { type: 'circle', width: 80, radius: 40 },
    area: 'Terraço',
    isActive: true
  },
  {
    id: 5,
    number: 5,
    name: 'Mesa 5',
    capacity: 8,
    status: TableStatus.WAITING_PAYMENT,
    position: { x: 200, y: 200 },
    shape: { type: 'rectangle', width: 160, height: 80 },
    area: 'Terraço',
    isActive: true
  },
  {
    id: 6,
    number: 6,
    name: 'Mesa 6',
    capacity: 2,
    status: TableStatus.CLEANING,
    position: { x: 300, y: 200 },
    shape: { type: 'circle', width: 60, radius: 30 },
    area: 'Terraço',
    isActive: true
  },
  {
    id: 7,
    number: 7,
    name: 'Mesa 7',
    capacity: 4,
    status: TableStatus.FREE,
    position: { x: 100, y: 300 },
    shape: { type: 'circle', width: 80, radius: 40 },
    area: 'Área VIP',
    isActive: true
  },
  {
    id: 8,
    number: 8,
    name: 'Mesa 8',
    capacity: 6,
    status: TableStatus.FREE,
    position: { x: 200, y: 300 },
    shape: { type: 'rectangle', width: 120, height: 80 },
    area: 'Área VIP',
    isActive: true
  }
];

const mockAreas: TableArea[] = [
  {
    id: 1,
    name: 'Salão Principal',
    description: 'Área principal do restaurante',
    tables: mockTables.filter(table => table.area === 'Salão Principal'),
    position: { x: 50, y: 50, width: 400, height: 150 },
    background: '#f5f5f5'
  },
  {
    id: 2,
    name: 'Terraço',
    description: 'Área externa com vista',
    tables: mockTables.filter(table => table.area === 'Terraço'),
    position: { x: 50, y: 250, width: 400, height: 150 },
    background: '#e6f7ff'
  },
  {
    id: 3,
    name: 'Área VIP',
    description: 'Área reservada para clientes especiais',
    tables: mockTables.filter(table => table.area === 'Área VIP'),
    position: { x: 50, y: 450, width: 400, height: 150 },
    background: '#fff0f6'
  }
];

const mockLayout: TableLayout = {
  id: 1,
  name: 'Layout Padrão',
  description: 'Layout padrão do restaurante',
  areas: mockAreas,
  width: 800,
  height: 600,
  scale: 1
};

const mockReservations: TableReservation[] = [
  {
    id: 1,
    tableId: 3,
    customerName: 'João Silva',
    customerPhone: '(11) 98765-4321',
    customerEmail: 'joao.silva@email.com',
    date: '2023-06-15',
    time: '19:00',
    duration: 120,
    numberOfGuests: 4,
    status: 'confirmed'
  },
  {
    id: 2,
    tableId: 7,
    customerName: 'Maria Oliveira',
    customerPhone: '(11) 91234-5678',
    customerEmail: 'maria.oliveira@email.com',
    date: '2023-06-16',
    time: '20:00',
    duration: 90,
    numberOfGuests: 2,
    status: 'pending'
  }
];

const mockOrders: TableOrder[] = [
  {
    id: 1,
    tableId: 2,
    items: [
      {
        id: 1,
        productId: 101,
        productName: 'Filé Mignon',
        quantity: 2,
        unitPrice: 45.90,
        status: 'delivered'
      },
      {
        id: 2,
        productId: 203,
        productName: 'Refrigerante',
        quantity: 2,
        unitPrice: 6.50,
        status: 'delivered'
      }
    ],
    status: 'delivered',
    createdAt: '2023-06-15T19:30:00Z',
    updatedAt: '2023-06-15T20:45:00Z',
    totalAmount: 104.80
  },
  {
    id: 2,
    tableId: 4,
    items: [
      {
        id: 3,
        productId: 105,
        productName: 'Pizza Margherita',
        quantity: 1,
        unitPrice: 35.90,
        status: 'preparing'
      },
      {
        id: 4,
        productId: 205,
        productName: 'Suco Natural',
        quantity: 3,
        unitPrice: 8.90,
        status: 'pending'
      }
    ],
    status: 'preparing',
    createdAt: '2023-06-15T20:15:00Z',
    updatedAt: '2023-06-15T20:25:00Z',
    totalAmount: 62.60
  },
  {
    id: 3,
    tableId: 5,
    items: [
      {
        id: 5,
        productId: 110,
        productName: 'Risoto de Camarão',
        quantity: 4,
        unitPrice: 52.90,
        status: 'delivered'
      },
      {
        id: 6,
        productId: 210,
        productName: 'Água Mineral',
        quantity: 4,
        unitPrice: 4.50,
        status: 'delivered'
      },
      {
        id: 7,
        productId: 301,
        productName: 'Pudim',
        quantity: 2,
        unitPrice: 12.90,
        status: 'delivered'
      }
    ],
    status: 'delivered',
    createdAt: '2023-06-15T19:00:00Z',
    updatedAt: '2023-06-15T20:30:00Z',
    totalAmount: 247.40
  }
];

// Simulação de delay para simular chamadas de API
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class TableService {
  // Métodos para gerenciar mesas
  async getAll(): Promise<Table[]> {
    await delay(500);
    return [...mockTables];
  }

  async getById(id: number): Promise<Table | null> {
    await delay(300);
    const table = mockTables.find(table => table.id === id);
    return table ? { ...table } : null;
  }

  async create(data: TableFormData): Promise<Table> {
    await delay(700);
    const newTable: Table = {
      id: Math.max(...mockTables.map(t => t.id)) + 1,
      number: data.number,
      name: data.name,
      capacity: data.capacity,
      status: TableStatus.FREE,
      position: data.position,
      shape: data.shape,
      area: data.area,
      isActive: data.isActive
    };
    mockTables.push(newTable);
    return { ...newTable };
  }

  async update(id: number, data: TableFormData): Promise<Table> {
    await delay(700);
    const index = mockTables.findIndex(table => table.id === id);
    if (index === -1) {
      throw new Error('Mesa não encontrada');
    }
    
    const updatedTable: Table = {
      ...mockTables[index],
      number: data.number,
      name: data.name,
      capacity: data.capacity,
      position: data.position,
      shape: data.shape,
      area: data.area,
      isActive: data.isActive
    };
    
    mockTables[index] = updatedTable;
    return { ...updatedTable };
  }

  async delete(id: number): Promise<void> {
    await delay(500);
    const index = mockTables.findIndex(table => table.id === id);
    if (index === -1) {
      throw new Error('Mesa não encontrada');
    }
    mockTables.splice(index, 1);
  }

  async updateStatus(id: number, status: TableStatus): Promise<Table> {
    await delay(300);
    const index = mockTables.findIndex(table => table.id === id);
    if (index === -1) {
      throw new Error('Mesa não encontrada');
    }
    
    mockTables[index].status = status;
    return { ...mockTables[index] };
  }

  async search(query: string): Promise<Table[]> {
    await delay(300);
    const lowerQuery = query.toLowerCase();
    return mockTables.filter(table => 
      table.name.toLowerCase().includes(lowerQuery) || 
      table.number.toString().includes(lowerQuery) ||
      table.area.toLowerCase().includes(lowerQuery)
    );
  }

  // Métodos para gerenciar áreas
  async getAllAreas(): Promise<TableArea[]> {
    await delay(500);
    return [...mockAreas];
  }

  async getAreaById(id: number): Promise<TableArea | null> {
    await delay(300);
    const area = mockAreas.find(area => area.id === id);
    return area ? { ...area } : null;
  }

  async createArea(data: TableAreaFormData): Promise<TableArea> {
    await delay(700);
    const newArea: TableArea = {
      id: Math.max(...mockAreas.map(a => a.id)) + 1,
      name: data.name,
      description: data.description,
      position: data.position,
      background: data.background,
      tables: []
    };
    mockAreas.push(newArea);
    return { ...newArea };
  }

  async updateArea(id: number, data: TableAreaFormData): Promise<TableArea> {
    await delay(700);
    const index = mockAreas.findIndex(area => area.id === id);
    if (index === -1) {
      throw new Error('Área não encontrada');
    }
    
    const updatedArea: TableArea = {
      ...mockAreas[index],
      name: data.name,
      description: data.description,
      position: data.position,
      background: data.background
    };
    
    mockAreas[index] = updatedArea;
    return { ...updatedArea };
  }

  async deleteArea(id: number): Promise<void> {
    await delay(500);
    const index = mockAreas.findIndex(area => area.id === id);
    if (index === -1) {
      throw new Error('Área não encontrada');
    }
    
    // Verificar se existem mesas nesta área
    const tablesInArea = mockTables.some(table => table.area === mockAreas[index].name);
    if (tablesInArea) {
      throw new Error('Não é possível excluir uma área que contém mesas');
    }
    
    mockAreas.splice(index, 1);
  }

  // Métodos para gerenciar layout
  async getLayout(): Promise<TableLayout> {
    await delay(500);
    return { ...mockLayout };
  }

  async updateLayout(layout: TableLayout): Promise<TableLayout> {
    await delay(700);
    mockLayout.name = layout.name;
    mockLayout.description = layout.description;
    mockLayout.width = layout.width;
    mockLayout.height = layout.height;
    mockLayout.scale = layout.scale;
    mockLayout.backgroundImage = layout.backgroundImage;
    return { ...mockLayout };
  }

  // Métodos para gerenciar reservas
  async getAllReservations(): Promise<TableReservation[]> {
    await delay(500);
    return [...mockReservations];
  }

  async getReservationById(id: number): Promise<TableReservation | null> {
    await delay(300);
    const reservation = mockReservations.find(res => res.id === id);
    return reservation ? { ...reservation } : null;
  }

  async getReservationsByTable(tableId: number): Promise<TableReservation[]> {
    await delay(300);
    return mockReservations.filter(res => res.tableId === tableId);
  }

  async createReservation(data: TableReservationFormData): Promise<TableReservation> {
    await delay(700);
    const newReservation: TableReservation = {
      id: Math.max(...mockReservations.map(r => r.id), 0) + 1,
      tableId: data.tableId,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail,
      date: data.date,
      time: data.time,
      duration: data.duration,
      numberOfGuests: data.numberOfGuests,
      notes: data.notes,
      status: 'confirmed'
    };
    mockReservations.push(newReservation);
    
    // Atualizar status da mesa
    const tableIndex = mockTables.findIndex(table => table.id === data.tableId);
    if (tableIndex !== -1) {
      mockTables[tableIndex].status = TableStatus.RESERVED;
      mockTables[tableIndex].currentReservation = newReservation;
    }
    
    return { ...newReservation };
  }

  async updateReservation(id: number, data: TableReservationFormData): Promise<TableReservation> {
    await delay(700);
    const index = mockReservations.findIndex(res => res.id === id);
    if (index === -1) {
      throw new Error('Reserva não encontrada');
    }
    
    const updatedReservation: TableReservation = {
      ...mockReservations[index],
      tableId: data.tableId,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail,
      date: data.date,
      time: data.time,
      duration: data.duration,
      numberOfGuests: data.numberOfGuests,
      notes: data.notes
    };
    
    mockReservations[index] = updatedReservation;
    
    // Atualizar referência na mesa
    const tableIndex = mockTables.findIndex(table => table.id === data.tableId);
    if (tableIndex !== -1) {
      mockTables[tableIndex].currentReservation = updatedReservation;
    }
    
    return { ...updatedReservation };
  }

  async cancelReservation(id: number): Promise<void> {
    await delay(500);
    const index = mockReservations.findIndex(res => res.id === id);
    if (index === -1) {
      throw new Error('Reserva não encontrada');
    }
    
    mockReservations[index].status = 'cancelled';
    
    // Atualizar status da mesa se necessário
    const tableId = mockReservations[index].tableId;
    const tableIndex = mockTables.findIndex(table => table.id === tableId);
    if (tableIndex !== -1 && mockTables[tableIndex].status === TableStatus.RESERVED) {
      mockTables[tableIndex].status = TableStatus.FREE;
      mockTables[tableIndex].currentReservation = undefined;
    }
  }

  // Métodos para gerenciar pedidos
  async getAllOrders(): Promise<TableOrder[]> {
    await delay(500);
    return [...mockOrders];
  }

  async getOrderById(id: number): Promise<TableOrder | null> {
    await delay(300);
    const order = mockOrders.find(order => order.id === id);
    return order ? { ...order } : null;
  }

  async getOrdersByTable(tableId: number): Promise<TableOrder[]> {
    await delay(300);
    return mockOrders.filter(order => order.tableId === tableId);
  }

  async getCurrentOrderByTable(tableId: number): Promise<TableOrder | null> {
    await delay(300);
    const order = mockOrders.find(
      order => order.tableId === tableId && 
      (order.status === 'pending' || order.status === 'preparing' || order.status === 'ready')
    );
    return order ? { ...order } : null;
  }

  // Métodos para estatísticas
  async getTableStatistics(tableId: number): Promise<TableStatistics> {
    await delay(700);
    // Dados mockados para estatísticas
    return {
      averageOccupationTime: 95, // minutos
      turnoverRate: 4.2, // vezes por dia
      revenueGenerated: 1250.75,
      popularHours: [
        { hour: 12, count: 15 },
        { hour: 13, count: 18 },
        { hour: 19, count: 22 },
        { hour: 20, count: 25 },
        { hour: 21, count: 20 }
      ],
      popularDays: [
        { day: 'Segunda', count: 45 },
        { day: 'Terça', count: 38 },
        { day: 'Quarta', count: 42 },
        { day: 'Quinta', count: 50 },
        { day: 'Sexta', count: 85 },
        { day: 'Sábado', count: 95 },
        { day: 'Domingo', count: 75 }
      ],
      averagePartySize: 3.5
    };
  }

  async updateTablePosition(tableId: number, position: { x: number; y: number }): Promise<Table | null> {
    await delay(300);
    const table = await this.getById(tableId);
    if (!table) return null;

    const updatedTable = {
      ...table,
      position
    };

    await this.update(tableId, updatedTable);
    return updatedTable;
  }

  async updateTableShape(tableId: number, shape: { width: number; height?: number }): Promise<Table | null> {
    await delay(300);
    const table = await this.getById(tableId);
    if (!table) return null;

    const updatedTable = {
      ...table,
      shape: {
        ...table.shape,
        ...shape
      }
    };

    await this.update(tableId, updatedTable);
    return updatedTable;
  }

  async updateAreaPosition(areaId: number, position: { x: number; y: number; width: number; height: number }): Promise<TableArea | null> {
    await delay(300);
    const area = await this.getAreaById(areaId);
    if (!area) return null;

    const updatedArea = {
      ...area,
      position
    };

    await this.updateArea(areaId, updatedArea);
    return updatedArea;
  }
}

export const tableService = new TableService(); 