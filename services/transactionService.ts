import { Transaction } from '@/types/transaction';
import { mockTransactions as initialMockTransactions } from '@/data/transactions';

// Create a mutable copy of the mock transactions
let mockTransactions: Transaction[] = [...initialMockTransactions];

// Service to manage transactions
export const transactionService = {
  getAllTransactions: (): Transaction[] => {
    return mockTransactions;
  },

  getTransactionsByAccountId: (accountId: string): Transaction[] => {
    return mockTransactions.filter(
      (transaction) => transaction.accountId === accountId,
    );
  },

  getTransactionById: (id: string): Transaction | undefined => {
    return mockTransactions.find((transaction) => transaction.id === id);
  },

  updateTransaction: (
    id: string,
    data: Partial<Transaction>,
  ): Transaction | null => {
    const index = mockTransactions.findIndex(
      (transaction) => transaction.id === id,
    );
    if (index === -1) return null;

    // Update the transaction with new data
    mockTransactions[index] = {
      ...mockTransactions[index],
      ...data,
      updatedAt: new Date(),
    };

    return mockTransactions[index];
  },

  updateMultipleTransactions: (
    ids: string[],
    data: Partial<Transaction>,
  ): Transaction[] => {
    return ids
      .map((id) => {
        const index = mockTransactions.findIndex(
          (transaction) => transaction.id === id,
        );
        if (index === -1) return null;

        // Update the transaction with new data
        mockTransactions[index] = {
          ...mockTransactions[index],
          ...data,
          updatedAt: new Date(),
        };

        return mockTransactions[index];
      })
      .filter(Boolean) as Transaction[];
  },

  markTransactionsAsCleared: (ids: string[]): Transaction[] => {
    return ids
      .map((id) => {
        const index = mockTransactions.findIndex(
          (transaction) => transaction.id === id,
        );
        if (index === -1) return null;

        // Update the transaction with new data
        mockTransactions[index] = {
          ...mockTransactions[index],
          isCleared: true,
          updatedAt: new Date(),
        };

        return mockTransactions[index];
      })
      .filter(Boolean) as Transaction[];
  },

  createTransaction: (
    data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>,
  ): Transaction => {
    const newTransaction: Transaction = {
      id: Date.now().toString(), // Simple ID generation for mock
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockTransactions.push(newTransaction);
    return newTransaction;
  },

  deleteTransaction: (id: string): boolean => {
    const initialLength = mockTransactions.length;
    mockTransactions = mockTransactions.filter(
      (transaction) => transaction.id !== id,
    );
    return mockTransactions.length < initialLength;
  },

  // Reset to initial state (useful for testing)
  reset: (): void => {
    mockTransactions = [...initialMockTransactions];
  },
};
