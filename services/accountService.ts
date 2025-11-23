import { Account, AccountFormData } from '@/types/account';
import { mockAccounts as initialMockAccounts } from '@/data/accounts';

// Create a mutable copy of the mock accounts
let mockAccounts: Account[] = [...initialMockAccounts];

// Service to manage accounts
export const accountService = {
  getAllAccounts: (): Account[] => {
    return mockAccounts;
  },

  getAccountById: (id: string): Account | undefined => {
    return mockAccounts.find((account) => account.id === id);
  },

  updateAccount: (id: string, data: AccountFormData): Account | null => {
    const index = mockAccounts.findIndex((account) => account.id === id);
    if (index === -1) return null;

    // Update the account with new data
    mockAccounts[index] = {
      ...mockAccounts[index],
      ...data,
      updatedAt: new Date(),
    };

    return mockAccounts[index];
  },

  createAccount: (data: AccountFormData): Account => {
    const newAccount: Account = {
      id: Date.now().toString(), // Simple ID generation for mock
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockAccounts.push(newAccount);
    return newAccount;
  },

  deleteAccount: (id: string): boolean => {
    const initialLength = mockAccounts.length;
    mockAccounts = mockAccounts.filter((account) => account.id !== id);
    return mockAccounts.length < initialLength;
  },

  // Reset to initial state (useful for testing)
  reset: (): void => {
    mockAccounts = [...initialMockAccounts];
  },
};
