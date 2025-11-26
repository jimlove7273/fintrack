'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { accountService } from '@/services/accountService';
import { transactionService } from '@/services/transactionService';
import { Transaction } from '@/types/transaction';
import { formatCurrency, formatDate } from '@/utils/formatters';
import {
  getTransactionsWithRunningBalance,
  calculateAccountBalance,
  calculateClearedBalance,
  calculateClearedBalanceWithInitial,
} from '@/utils/calculations';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function ReconciliationPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const router = useRouter();

  // Hardcoded for now, will fix routing later
  const accountId = '1';

  // State for reconciliation
  const [statementBalance, setStatementBalance] = useState('');
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>(
    [],
  );
  const [showClearedOnly, setShowClearedOnly] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Find the account
  const account = accountService.getAccountById(accountId);

  // Get transactions for this account
  useEffect(() => {
    const fetchTransactions = () => {
      const accountTransactions =
        transactionService.getTransactionsByAccountId(accountId);
      setTransactions(accountTransactions);
    };

    fetchTransactions();
  }, [accountId]);

  if (!account) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-red-600">Account not found</h1>
        <Link
          href="/"
          className="text-indigo-600 hover:text-indigo-800 mt-4 block"
        >
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  // Get transactions with running balance
  const transactionsWithBalance = getTransactionsWithRunningBalance(
    accountId,
    transactions,
  );

  // Filter transactions based on showClearedOnly state
  const filteredTransactions = showClearedOnly
    ? transactionsWithBalance.filter((t) => t.isCleared)
    : transactionsWithBalance.filter((t) => !t.isCleared);

  // Calculate book balance (based on cleared transactions)
  const bookBalance = calculateClearedBalanceWithInitial(
    accountId,
    account.initialBalance,
    transactions,
  );

  // Calculate difference
  const difference = statementBalance
    ? parseFloat(statementBalance) - bookBalance
    : 0;

  // Handle transaction selection
  const handleTransactionSelect = (transactionId: string) => {
    setSelectedTransactions((prev) => {
      if (prev.includes(transactionId)) {
        return prev.filter((id) => id !== transactionId);
      } else {
        return [...prev, transactionId];
      }
    });
  };

  // Mark selected transactions as cleared
  const markAsCleared = () => {
    // Update transactions in the service
    const updatedTransactions = transactionService.updateMultipleTransactions(
      selectedTransactions,
      { isCleared: true },
    );

    // Update local state with the updated transactions
    setTransactions((prev) =>
      prev.map((t) => {
        const updatedTransaction = updatedTransactions.find(
          (ut) => ut.id === t.id,
        );
        return updatedTransaction ? updatedTransaction : t;
      }),
    );

    // Clear selection
    setSelectedTransactions([]);

    // Show confirmation
    alert(`${selectedTransactions.length} transactions marked as cleared`);
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-2">
          <Link
            href={`/accounts/${accountId}`}
            className="text-sm text-indigo-600 hover:text-indigo-800"
          >
            ← Back to Account
          </Link>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6">
          <div className="w-full md:w-auto mb-4 md:mb-0">
            <h1 className="text-2xl md:text-3xl font-bold">
              {account.name} - Reconciliation
            </h1>
            <div className="flex flex-wrap items-center mt-1">
              <span className="text-sm text-gray-500 mr-3">
                {account.accountNumber}
              </span>
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  account.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {account.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>

        {/* Reconciliation Summary Card */}
        <div className="bg-white rounded-xl shadow p-4 md:p-6 mb-6 md:mb-8">
          <h2 className="text-lg md:text-xl font-semibold mb-4">
            Reconciliation Summary
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {/* Statement Balance Input */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-700 mb-2">
                Statement Balance
              </h3>
              <div className="flex items-center">
                <span className="text-gray-500 mr-2">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={statementBalance}
                  onChange={(e) => setStatementBalance(e.target.value)}
                  className="block w-full px-2 py-1 md:px-3 md:py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm md:text-base"
                  placeholder="0.00"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Enter the ending balance from your bank statement
              </p>
            </div>

            {/* Book Balance */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-700 mb-2">Book Balance</h3>
              <p className="text-xl md:text-2xl font-bold text-indigo-600">
                {formatCurrency(bookBalance)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Based on cleared transactions
              </p>
            </div>

            {/* Difference */}
            <div
              className={`border rounded-lg p-4 ${
                difference === 0
                  ? 'border-green-500 bg-green-50'
                  : difference > 0
                  ? 'border-red-500 bg-red-50'
                  : 'border-yellow-500 bg-yellow-50'
              }`}
            >
              <h3 className="font-medium text-gray-700 mb-2">Difference</h3>
              <p
                className={`text-xl md:text-2xl font-bold ${
                  difference === 0
                    ? 'text-green-600'
                    : difference > 0
                    ? 'text-red-600'
                    : 'text-yellow-600'
                }`}
              >
                {formatCurrency(difference)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {difference === 0
                  ? 'Balances match'
                  : difference > 0
                  ? 'Statement balance is higher'
                  : 'Book balance is higher'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 md:mt-6 flex flex-wrap gap-2 md:gap-3">
            <button
              onClick={markAsCleared}
              disabled={selectedTransactions.length === 0}
              className={`px-3 py-2 md:px-4 md:py-2 rounded-md font-medium text-sm md:text-base ${
                selectedTransactions.length === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              Mark {selectedTransactions.length} Selected as Cleared
            </button>

            <button
              onClick={() => {
                setStatementBalance('');
                setSelectedTransactions([]);
              }}
              className="px-3 py-2 md:px-4 md:py-2 bg-gray-200 text-gray-800 rounded-md font-medium text-sm md:text-base hover:bg-gray-300"
            >
              Reset
            </button>

            <button
              onClick={() => {
                if (difference === 0) {
                  alert('Reconciliation complete! All balances match.');
                } else {
                  alert(
                    'Please reconcile all transactions to match the statement balance.',
                  );
                }
              }}
              className={`px-3 py-2 md:px-4 md:py-2 rounded-md font-medium text-sm md:text-base ${
                difference === 0
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={difference !== 0}
            >
              Complete Reconciliation
            </button>
          </div>
        </div>

        {/* Transactions Section */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-3 md:px-6 md:py-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <h2 className="text-lg md:text-xl font-semibold">
              Uncleared Transactions
            </h2>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center">
                <span className="mr-2 text-xs text-gray-600">
                  Show Cleared:
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={showClearedOnly}
                    onChange={() => setShowClearedOnly(!showClearedOnly)}
                  />
                  <div className="w-7 h-4 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              <div className="text-xs text-gray-600">
                Selected: {selectedTransactions.length}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-2 md:px-6 md:py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 rounded"
                      checked={
                        selectedTransactions.length > 0 &&
                        selectedTransactions.length ===
                          filteredTransactions.length
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTransactions(
                            filteredTransactions.map((t) => t.id),
                          );
                        } else {
                          setSelectedTransactions([]);
                        }
                      }}
                    />
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 md:px-6 md:py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 md:px-6 md:py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50"
                  >
                    Check #
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 md:px-6 md:py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50"
                  >
                    Payee
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 md:px-6 md:py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50"
                  >
                    Description
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 md:px-6 md:py-3 text-left text-xs font-semibold text-red-600 uppercase tracking-wider bg-gray-50"
                  >
                    Debit (-)
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 md:px-6 md:py-3 text-left text-xs font-semibold text-green-600 uppercase tracking-wider bg-gray-50"
                  >
                    Credit (+)
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 md:px-6 md:py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50"
                  >
                    Balance
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-3 md:px-6 md:py-4 text-center text-gray-500"
                    >
                      {showClearedOnly
                        ? 'No cleared transactions found'
                        : 'No uncleared transactions found. All transactions are cleared!'}
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className={`${
                        selectedTransactions.includes(transaction.id)
                          ? 'bg-indigo-50'
                          : transaction.isCleared
                          ? 'bg-green-50'
                          : ''
                      }`}
                    >
                      <td className="px-4 py-2 md:px-6 md:py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 rounded"
                          checked={selectedTransactions.includes(
                            transaction.id,
                          )}
                          onChange={() =>
                            handleTransactionSelect(transaction.id)
                          }
                        />
                      </td>
                      <td className="px-4 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                        {formatDate(new Date(transaction.date))}
                      </td>
                      <td className="px-4 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                        {transaction.checkNumber || '-'}
                      </td>
                      <td className="px-4 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm font-medium text-gray-900">
                        {transaction.payee}
                      </td>
                      <td className="px-4 py-2 md:px-6 md:py-4 text-xs md:text-sm text-gray-500">
                        {transaction.description}
                      </td>
                      <td className="px-4 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm font-medium">
                        {transaction.debit > 0 ? (
                          <span className="text-red-600">
                            {formatCurrency(transaction.debit)}
                          </span>
                        ) : (
                          ''
                        )}
                      </td>
                      <td className="px-4 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm font-medium">
                        {transaction.credit > 0 ? (
                          <span className="text-green-600">
                            {formatCurrency(transaction.credit)}
                          </span>
                        ) : (
                          ''
                        )}
                      </td>
                      <td className="px-4 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm font-medium">
                        {formatCurrency(transaction.runningBalance)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
