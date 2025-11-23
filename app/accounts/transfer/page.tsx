'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockAccounts } from '@/data/accounts';
import { mockTransactions } from '@/data/transactions';
import { formatCurrency } from '@/utils/formatters';
import { calculateAccountBalance } from '@/utils/calculations';
import Link from 'next/link';

export default function TransferPage() {
  const router = useRouter();
  const [transferData, setTransferData] = useState({
    fromAccount: '',
    toAccount: '',
    amount: '',
    description: 'Transfer between accounts',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setTransferData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (
      !transferData.fromAccount ||
      !transferData.toAccount ||
      !transferData.amount
    ) {
      setError('Please fill in all fields');
      return;
    }

    if (transferData.fromAccount === transferData.toAccount) {
      setError('From and To accounts must be different');
      return;
    }

    const amount = parseFloat(transferData.amount);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    // Check if from account has sufficient funds
    const fromAccountBalance = calculateAccountBalance(
      transferData.fromAccount,
      mockTransactions,
    );
    if (amount > fromAccountBalance) {
      setError('Insufficient funds in the from account');
      return;
    }

    // In a real app, this would be an API call to create transfer transactions
    console.log('Transfer data:', transferData);

    // Show success message
    setSuccess(true);
    setError('');

    // Reset form after 3 seconds
    setTimeout(() => {
      setTransferData({
        fromAccount: '',
        toAccount: '',
        amount: '',
        description: 'Transfer between accounts',
      });
      setSuccess(false);
    }, 3000);
  };

  // Filter out inactive accounts
  const activeAccounts = mockAccounts.filter((account) => account.isActive);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/"
          className="text-indigo-600 hover:text-indigo-800 flex items-center"
        >
          <svg
            className="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Dashboard
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Transfer Money</h1>
          <p className="mt-1 text-sm text-gray-500">
            Transfer funds between your accounts
          </p>
        </div>

        <div className="p-6">
          {success && (
            <div className="rounded-md bg-green-50 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    Transfer completed successfully!
                  </p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-md bg-red-50 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="fromAccount"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  From Account
                </label>
                <select
                  id="fromAccount"
                  name="fromAccount"
                  value={transferData.fromAccount}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  required
                >
                  <option value="">Select account</option>
                  {activeAccounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name} (
                      {formatCurrency(
                        calculateAccountBalance(account.id, mockTransactions),
                      )}
                      )
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="toAccount"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  To Account
                </label>
                <select
                  id="toAccount"
                  name="toAccount"
                  value={transferData.toAccount}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  required
                >
                  <option value="">Select account</option>
                  {activeAccounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name} (
                      {formatCurrency(
                        calculateAccountBalance(account.id, mockTransactions),
                      )}
                      )
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Amount
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  name="amount"
                  id="amount"
                  value={transferData.amount}
                  onChange={handleChange}
                  step="0.01"
                  min="0.01"
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 py-2 sm:text-sm border-gray-300 rounded-md"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={transferData.description}
                onChange={handleChange}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Transfer Money
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Account Balances Preview */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Account Balances
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeAccounts.map((account) => {
            const balance = calculateAccountBalance(
              account.id,
              mockTransactions,
            );
            return (
              <div
                key={account.id}
                className="bg-white rounded-lg shadow p-4 border border-gray-200"
              >
                <h3 className="font-medium text-gray-900">{account.name}</h3>
                <p className="text-2xl font-bold text-indigo-600 mt-2">
                  {formatCurrency(balance)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {account.accountNumber.replace(/(\d{4})(?=\d)/g, '$1-')}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
