export interface SalesData {
  month: string;
  receitas: number;
  despesas: number;
}

export interface StockData {
  name: string;
  value: number;
  percentage: number;
}

export interface ProductData {
  id: number;
  name: string;
  category: string;
  stock: number;
  sales: number;
  value: number;
}

export interface FinancialData {
  id: number;
  date: string;
  type: 'income' | 'expense';
  description: string;
  value: number;
}

export type ReportType = 'overview' | 'sales' | 'stock' | 'financial';
export type PeriodType = 'day' | 'week' | 'month' | 'year';
export type OrderDirection = 'asc' | 'desc';
export type OrderBy = 'date' | 'value' | 'name'; 