'use client';

import { useState } from 'react';
import { mockAccounts } from '@/data/accounts';
import { mockTransactions } from '@/data/transactions';
import { formatCurrency } from '@/utils/formatters';
import { calculateAccountBalance } from '@/utils/calculations';
import Link from 'next/link';

export default function TransferPage() {
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-gray-500 mb-6">
        <Link
          href="/"
          className="hover:text-indigo-600 transition-colors duration-200"
        >
          Dashboard
        </Link>
        <svg className="mx-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
        <span className="text-gray-900 font-medium">Transfer Money</span>
      </nav>

      {/* Page Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Transfer Money
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Transfer funds between your accounts
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            Transfer Details
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Enter the transfer information below
          </p>
        </div>
        <div className="px-6 py-6">
          {success && (
            <div className="rounded-lg bg-green-50 p-4 mb-6">
              <div className="flex">
                <div className="shrink-0">
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
            <div className="rounded-lg bg-red-50 p-4 mb-6">
              <div className="flex">
                <div className="shrink-0">
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

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Left Column - Form Info */}
              <div className="md:col-span-1">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Transfer Funds
                  </h3>
                  <p className="text-sm text-gray-600">
                    Transfer money between your accounts securely.
                  </p>
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        <svg
                          className="h-4 w-4 text-indigo-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          Required Fields
                        </p>
                        <p className="text-xs text-gray-500">Marked with *</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Form Fields */}
              <div className="md:col-span-2">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                      <label
                        htmlFor="fromAccount"
                        className="block text-sm font-semibold text-gray-600 mb-2"
                      >
                        From Account <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="fromAccount"
                        name="fromAccount"
                        value={transferData.fromAccount}
                        onChange={handleChange}
                        className="block w-full rounded-lg border border-gray-300 bg-white p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all duration-200"
                        required
                      >
                        <option value="">Select account</option>
                        {activeAccounts.map((account) => (
                          <option key={account.id} value={account.id}>
                            {account.name} (
                            {formatCurrency(
                              calculateAccountBalance(
                                account.id,
                                mockTransactions,
                              ),
                            )}
                            )
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-1">
                      <label
                        htmlFor="toAccount"
                        className="block text-sm font-semibold text-gray-600 mb-2"
                      >
                        To Account <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="toAccount"
                        name="toAccount"
                        value={transferData.toAccount}
                        onChange={handleChange}
                        className="block w-full rounded-lg border border-gray-300 bg-white p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all duration-200"
                        required
                      >
                        <option value="">Select account</option>
                        {activeAccounts.map((account) => (
                          <option key={account.id} value={account.id}>
                            {account.name} (
                            {formatCurrency(
                              calculateAccountBalance(
                                account.id,
                                mockTransactions,
                              ),
                            )}
                            )
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-1">
                      <label
                        htmlFor="amount"
                        className="block text-sm font-semibold text-gray-600 mb-2"
                      >
                        Amount <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
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
                          className="block w-full rounded-lg border border-gray-300 bg-white p-2 pl-7 pr-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all duration-200"
                          placeholder="0.00"
                          required
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="description"
                        className="block text-sm font-semibold text-gray-600 mb-2"
                      >
                        Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        rows={3}
                        value={transferData.description}
                        onChange={handleChange}
                        className="block w-full rounded-lg border border-gray-300 bg-white p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <Link
                href="/"
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
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
