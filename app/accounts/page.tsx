'use client';

import { useState } from 'react';
import { mockAccounts } from '@/data/accounts';
import { mockTransactions } from '@/data/transactions';
import { formatCurrency } from '@/utils/formatters';
import { calculateAccountBalance } from '@/utils/calculations';
import Link from 'next/link';

export default function AccountsPage() {
  const [accounts] = useState(mockAccounts);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <svg
            className="h-6 w-6 mr-3 text-indigo-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
          </svg>
          <h1 className="text-3xl font-bold text-gray-900">All Accounts</h1>
        </div>
        <div className="flex space-x-3">
          <Link
            href="/accounts/transfer"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg
              className="h-5 w-5 mr-2"
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
            Transfer Money
          </Link>
          <Link
            href="/accounts/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Add New Account
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-700">
            Account Summary
          </h2>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
            {accounts.length} Accounts
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-700">Total Accounts</p>
            <p className="text-2xl font-bold text-blue-900">
              {accounts.length}
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-green-700">Active Accounts</p>
            <p className="text-2xl font-bold text-green-900">
              {accounts.filter((acc) => acc.isActive).length}
            </p>
          </div>
          <div className="bg-amber-50 rounded-lg p-4">
            <p className="text-sm text-amber-700">Inactive Accounts</p>
            <p className="text-2xl font-bold text-amber-900">
              {accounts.filter((acc) => !acc.isActive).length}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((account) => {
          const balance = calculateAccountBalance(account.id, mockTransactions);
          return (
            <div
              key={account.id}
              className={`rounded-xl shadow-md overflow-hidden border-l-4 ${
                account.isActive
                  ? 'border-indigo-500 bg-white'
                  : 'border-gray-300 bg-gray-50 opacity-75'
              }`}
            >
              <Link href={`/accounts/${account.id}`} className="block p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-xl text-gray-900">
                      {account.name}
                      <span
                        className={`ml-2 px-3 py-1 text-sm rounded-full ${
                          account.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {account.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </h3>
                    <p className="text-gray-600 mt-1 text-sm">
                      {account.accountNumber.replace(/(\d{4})(?=\d)/g, '$1-')}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Current Balance</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {formatCurrency(balance)}
                    </p>
                  </div>
                </div>
              </Link>

              <div className="px-6 py-1 bg-gray-50 border-t border-gray-200">
                <div className="flex justify-end">
                  <Link
                    href={`/accounts/${account.id}/edit`}
                    className="inline-flex items-center p-2 text-gray-600 hover:text-indigo-600 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
