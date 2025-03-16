export interface Supplier {
  id: number;
  name: string;
  contact: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  taxId: string;
  categories: string[];
  paymentTerms?: string;
  website?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type SupplierFormData = Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>;

export type SupplierUpdateData = Partial<SupplierFormData>; 