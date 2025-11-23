import { Transaction } from '@/types/transaction';
import { mockTransactions } from '@/data/transactions';

export const calculateAccountBalance = (
  accountId: string,
  transactions: Transaction[] = mockTransactions,
): number => {
  const accountTransactions = transactions.filter(
    (transaction) => transaction.accountId === accountId,
  );

  return accountTransactions.reduce(
    (balance, transaction) => balance + transaction.credit - transaction.debit,
    0,
  );
};

export const calculateClearedBalance = (
  accountId: string,
  transactions: Transaction[] = mockTransactions,
): number => {
  const clearedTransactions = transactions.filter(
    (transaction) =>
      transaction.accountId === accountId && transaction.isCleared,
  );

  return clearedTransactions.reduce(
    (balance, transaction) => balance + transaction.credit - transaction.debit,
    0,
  );
};

export const getTransactionsWithRunningBalance = (
  accountId: string,
  transactions: Transaction[] = mockTransactions,
): (Transaction & { runningBalance: number })[] => {
  const accountTransactions = transactions
    .filter((transaction) => transaction.accountId === accountId)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  let runningBalance = 0;

  return accountTransactions.map((transaction) => {
    runningBalance += transaction.credit - transaction.debit;
    return {
      ...transaction,
      runningBalance,
    };
  });
};
