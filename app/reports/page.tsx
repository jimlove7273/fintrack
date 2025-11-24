'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { mockAccounts } from '@/data/accounts';
import { mockTransactions } from '@/data/transactions';
import { formatCurrency } from '@/utils/formatters';
import { calculateAccountBalance } from '@/utils/calculations';
import Link from 'next/link';

export default function ReportsPage() {
  // Calculate category spending
  const categorySpending = mockTransactions.reduce((acc, transaction) => {
    if (transaction.debit > 0) {
      if (!acc[transaction.category]) {
        acc[transaction.category] = 0;
      }
      acc[transaction.category] += transaction.debit;
    }
    return acc;
  }, {} as Record<string, number>);

  // Convert to array and sort by amount
  const categorySpendingArray = Object.entries(categorySpending)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);

  // Calculate account balances for line chart
  const accountBalances = mockAccounts.map((account) => ({
    name: account.name,
    balance: calculateAccountBalance(account.id, mockTransactions),
  }));

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/" className="text-indigo-600 hover:text-indigo-800">
            ← Back to Dashboard
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-8">Financial Reports</h1>

        {/* Category Spending Pie Chart */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-6">Spending by Category</h2>

          {categorySpendingArray.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No spending data available
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Pie Chart Visualization (text-based for now) */}
              <div>
                <div className="space-y-4">
                  {categorySpendingArray.map(({ category, amount }, index) => (
                    <div key={category} className="flex items-center">
                      <div
                        className="w-4 h-4 rounded-sm mr-3"
                        style={{
                          backgroundColor: `hsl(${index * 30}, 70%, 50%)`,
                        }}
                      ></div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="font-medium">{category}</span>
                          <span>{formatCurrency(amount)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className="bg-indigo-600 h-2 rounded-full"
                            style={{
                              width: `${
                                (amount / categorySpendingArray[0].amount) * 100
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary Table */}
              <div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Category
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Amount
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Percentage
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {categorySpendingArray.map(
                        ({ category, amount }, index) => {
                          const percentage = (
                            (amount /
                              categorySpendingArray.reduce(
                                (sum, item) => sum + item.amount,
                                0,
                              )) *
                            100
                          ).toFixed(1);
                          return (
                            <tr key={category}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div
                                    className="w-3 h-3 rounded-sm mr-2"
                                    style={{
                                      backgroundColor: `hsl(${
                                        index * 30
                                      }, 70%, 50%)`,
                                    }}
                                  ></div>
                                  <span className="text-sm font-medium text-gray-900">
                                    {category}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatCurrency(amount)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {percentage}%
                              </td>
                            </tr>
                          );
                        },
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Account Balances Line Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-6">
            Account Balances Comparison
          </h2>

          {accountBalances.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No account data available
            </p>
          ) : (
            <div className="space-y-6">
              {/* Bar Chart Visualization */}
              <div className="space-y-4">
                {accountBalances.map((account, index) => {
                  const maxBalance = Math.max(
                    ...accountBalances.map((a) => Math.abs(a.balance)),
                  );
                  const barWidth =
                    maxBalance > 0
                      ? (Math.abs(account.balance) / maxBalance) * 100
                      : 0;

                  return (
                    <div key={index} className="flex items-center">
                      <div className="w-1/4 text-sm font-medium text-gray-900 truncate">
                        {account.name}
                      </div>
                      <div className="w-3/4">
                        <div className="flex items-center">
                          <div className="w-full">
                            <div className="flex justify-between text-sm mb-1">
                              <span>{formatCurrency(account.balance)}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-6">
                              <div
                                className={`h-6 rounded-full flex items-center justify-end pr-2 text-xs font-medium text-white ${
                                  account.balance >= 0
                                    ? 'bg-green-500'
                                    : 'bg-red-500'
                                }`}
                                style={{ width: `${barWidth}%` }}
                              >
                                {barWidth > 10 &&
                                  formatCurrency(account.balance)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Summary Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Account
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Balance
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {accountBalances.map((account, index) => {
                      const relatedAccount = mockAccounts.find(
                        (acc) => acc.id === mockAccounts[index].id,
                      );
                      return (
                        <tr key={account.name}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {account.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div
                              className={`text-sm font-medium ${
                                account.balance >= 0
                                  ? 'text-green-600'
                                  : 'text-red-600'
                              }`}
                            >
                              {formatCurrency(account.balance)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                relatedAccount?.isActive
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {relatedAccount?.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
