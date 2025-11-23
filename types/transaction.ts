export interface Transaction {
  id: string;
  accountId: string;
  date: Date;
  checkNumber: string;
  payee: string;
  category: string;
  description: string;
  debit: number;
  credit: number;
  isCleared: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TransactionFormData {
  date: Date;
  checkNumber: string;
  payee: string;
  category: string;
  description: string;
  debit: number;
  credit: number;
  isCleared: boolean;
}

export interface TransactionWithBalance extends Transaction {
  runningBalance: number;
}
