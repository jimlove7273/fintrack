export interface Account {
  id: string;
  name: string;
  accountNumber: string;
  initialBalance: number;
  contactPerson: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  contactName: string;
  email: string;
  phone: string;
  fax: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AccountFormData {
  name: string;
  accountNumber: string;
  initialBalance: number;
  contactPerson: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  contactName: string;
  email: string;
  phone: string;
  fax: string;
  isActive: boolean;
}
