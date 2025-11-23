'use client';

import { useState } from 'react';
import { accountService } from '@/services/accountService';
import { mockTransactions } from '@/data/transactions';
import { formatCurrency } from '@/utils/formatters';
import { calculateAccountBalance } from '@/utils/calculations';
import Link from 'next/link';

export default function Dashboard() {
  const [accounts] = useState(accountService.getAllAccounts());

  // Calculate total balance across all accounts
  const totalBalance = accounts.reduce((sum, account) => {
    return sum + calculateAccountBalance(account.id, mockTransactions);
  }, 0);

  // Calculate active accounts
  const activeAccounts = accounts.filter((acc) => acc.isActive).length;

  // Calculate recent transactions (last 7 days)
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const recentTransactions = mockTransactions.filter(
    (t) => new Date(t.date) > oneWeekAgo,
  ).length;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Financial Dashboard</h1>

      {/* NET WORTH Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-blue-50 text-blue-800 rounded-lg shadow p-6">
          <div className="flex items-center mb-2">
            <svg
              className="h-6 w-6 mr-2 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="text-lg font-semibold">NET WORTH</h2>
          </div>
          <p className="text-3xl font-bold">{formatCurrency(totalBalance)}</p>
          <div className="mt-4 flex justify-between text-sm">
            <div>
              <p className="text-blue-600">Accounts</p>
              <p className="font-medium">{accounts.length}</p>
            </div>
            <div>
              <p className="text-blue-600">Active</p>
              <p className="font-medium">{activeAccounts}</p>
            </div>
          </div>
        </div>

        {/* Additional Stats Cards */}
        <div className="bg-green-50 text-green-800 rounded-lg shadow p-6">
          <div className="flex items-center mb-2">
            <svg
              className="h-6 w-6 mr-2 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h2 className="text-lg font-semibold">Total Accounts</h2>
          </div>
          <p className="text-3xl font-bold">{accounts.length}</p>
          <div className="mt-4">
            <p className="text-sm text-green-600">
              <span className="text-green-800">●</span> Active: {activeAccounts}
            </p>
            <p className="text-sm text-green-600">
              <span className="text-green-800">●</span> Inactive:{' '}
              {accounts.length - activeAccounts}
            </p>
          </div>
        </div>

        <div className="bg-amber-50 text-amber-800 rounded-lg shadow p-6">
          <div className="flex items-center mb-2">
            <svg
              className="h-6 w-6 mr-2 text-amber-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
              />
            </svg>
            <h2 className="text-lg font-semibold">Quick Actions</h2>
          </div>
          <Link
            href="/accounts/transfer"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-amber-700 bg-white hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 mt-2"
          >
            Transfer Money
          </Link>
          <p className="text-sm text-amber-600 mt-3">
            Move funds between accounts
          </p>
        </div>
      </div>

      {/* Accounts Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <svg
              className="h-5 w-5 mr-2 text-indigo-600"
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
            <h2 className="text-xl font-bold">Your Accounts</h2>
          </div>
          <Link
            href="/accounts/new"
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Account
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {accounts.map((account) => {
            const balance = calculateAccountBalance(
              account.id,
              mockTransactions,
            );
            return (
              <div
                key={account.id}
                className={`rounded-lg shadow p-4 ${
                  account.isActive ? 'bg-white' : 'bg-gray-50 opacity-75'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900">{account.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {account.accountNumber.replace(/(\d{4})(?=\d)/g, '$1-')}
                    </p>
                  </div>
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

                <div className="mt-3">
                  <p className="text-lg font-bold text-gray-900">
                    {formatCurrency(balance)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {account.contactPerson || 'No contact'}
                  </p>
                </div>

                <div className="mt-3 flex justify-between">
                  <Link
                    href={`/accounts/${account.id}`}
                    className="text-indigo-600 hover:text-indigo-800 text-xs font-medium"
                  >
                    View Details
                  </Link>
                  <Link
                    href={`/accounts/${account.id}/edit`}
                    className="text-gray-600 hover:text-gray-800 text-xs font-medium"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
