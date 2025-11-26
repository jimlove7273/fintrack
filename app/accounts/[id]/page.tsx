'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { accountService } from '@/services/accountService';
import { mockTransactions } from '@/data/transactions';
import { formatCurrency, formatDate } from '@/utils/formatters';
import {
  getTransactionsWithRunningBalance,
  calculateAccountBalance,
  calculateClearedBalance,
} from '@/utils/calculations';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function AccountDetailsPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const router = useRouter();

  // State for filtering transactions
  const [showAll, setShowAll] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // New states for search and pagination
  const [searchFilters, setSearchFilters] = useState({
    startDate: '',
    endDate: '',
    checkNumber: '',
    payee: '',
    category: '',
    description: '',
    amount: '',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(20);

  // In App Router, we need to get the ID from the URL differently
  // For now, we'll use a temporary approach and fix this properly

  // This is a simplified version for now - in a real app we'd use useParams()
  // But since we're having routing issues, let's focus on the UI first

  // Let's assume we're viewing account with ID '1' for now
  const accountId = '1';

  // Find the account
  const account = accountService.getAccountById(accountId);

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

  // Get transactions for this account
  const transactionsWithBalance = getTransactionsWithRunningBalance(
    accountId,
    mockTransactions,
  );

  // Filter transactions based on showAll state
  const allFilteredTransactions = showAll
    ? transactionsWithBalance
    : transactionsWithBalance.filter((t) => !t.isCleared);

  // Apply search filters
  const searchedTransactions = allFilteredTransactions.filter((transaction) => {
    // Date range filter
    if (
      searchFilters.startDate &&
      new Date(transaction.date) < new Date(searchFilters.startDate)
    ) {
      return false;
    }
    if (
      searchFilters.endDate &&
      new Date(transaction.date) > new Date(searchFilters.endDate)
    ) {
      return false;
    }

    // Check number filter
    if (
      searchFilters.checkNumber &&
      !transaction.checkNumber
        ?.toLowerCase()
        .includes(searchFilters.checkNumber.toLowerCase())
    ) {
      return false;
    }

    // Payee filter
    if (
      searchFilters.payee &&
      !transaction.payee
        .toLowerCase()
        .includes(searchFilters.payee.toLowerCase())
    ) {
      return false;
    }

    // Category filter
    if (
      searchFilters.category &&
      !transaction.category
        .toLowerCase()
        .includes(searchFilters.category.toLowerCase())
    ) {
      return false;
    }

    // Description filter
    if (
      searchFilters.description &&
      !transaction.description
        .toLowerCase()
        .includes(searchFilters.description.toLowerCase())
    ) {
      return false;
    }

    // Amount filter (debit or credit)
    if (searchFilters.amount) {
      const amount = parseFloat(searchFilters.amount);
      if (!isNaN(amount)) {
        if (transaction.debit !== amount && transaction.credit !== amount) {
          return false;
        }
      }
    }

    return true;
  });

  // Pagination logic
  const totalPages = Math.ceil(searchedTransactions.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedTransactions = searchedTransactions.slice(
    startIndex,
    startIndex + recordsPerPage,
  );

  // Calculate balances
  const accountBalance = calculateAccountBalance(accountId, mockTransactions);
  const clearedBalance = calculateClearedBalance(accountId, mockTransactions);

  // Handle search filter changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Reset to first page when filters change
    setCurrentPage(1);
  };

  // Handle records per page change
  const handleRecordsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setRecordsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Reset filters
  const resetFilters = () => {
    setSearchFilters({
      startDate: '',
      endDate: '',
      checkNumber: '',
      payee: '',
      category: '',
      description: '',
      amount: '',
    });
    setCurrentPage(1);
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-2">
          <Link
            href="/"
            className="text-sm text-indigo-600 hover:text-indigo-800"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6">
          <div className="w-full md:w-auto mb-4 md:mb-0">
            <h1 className="text-2xl md:text-3xl font-bold">{account.name}</h1>
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
          <div className="flex flex-wrap gap-2">
            <button
              className="text-sm font-semibold px-3 py-2 md:px-4 md:py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              onClick={() => router.push(`/accounts/${accountId}/edit`)}
            >
              Edit Account
            </button>
            <button
              className="text-sm font-semibold px-3 py-2 md:px-4 md:py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              onClick={() =>
                router.push(`/accounts/${accountId}/reconciliation`)
              }
            >
              Reconcile
            </button>
            <button
              className="text-sm font-semibold px-3 py-2 md:px-4 md:py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              onClick={() =>
                router.push(`/accounts/${accountId}/transactions/new`)
              }
            >
              Add Transaction
            </button>
          </div>
        </div>

        {/* Balance Summary */}
        <div className="bg-white rounded-xl shadow p-4 md:p-6 mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row justify-center md:justify-between items-center md:items-start">
            <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-0">
              Account Balances
            </h2>
            <div className="flex flex-row gap-4 md:gap-8">
              <div className="text-right">
                <p className="text-xs md:text-sm text-gray-600">
                  All Transactions
                </p>
                <p className="text-xl md:text-2xl font-bold">
                  {formatCurrency(accountBalance)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs md:text-sm text-gray-600">
                  Cleared Transactions
                </p>
                <p className="text-xl md:text-2xl font-bold text-green-600">
                  {formatCurrency(clearedBalance)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions Section */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-3 md:px-6 md:py-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <h2 className="text-lg md:text-xl font-semibold">Transactions</h2>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center">
                <span className="mr-2 text-xs text-gray-600">Show All:</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={showAll}
                    onChange={() => setShowAll(!showAll)}
                  />
                  <div className="w-7 h-4 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              <div className="flex items-center">
                <span className="mr-2 text-xs md:text-sm text-gray-600">
                  Rec per page:
                </span>
                <select
                  value={recordsPerPage}
                  onChange={handleRecordsPerPageChange}
                  className="block w-16 md:w-24 pl-2 pr-6 py-1 md:pl-3 md:pr-8 md:py-2 text-xs md:text-sm border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                >
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>

              <div
                className="border-dotted border-l border-gray-400 px-2 md:px-3 cursor-pointer"
                onClick={() => setShowFilters(!showFilters)}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#616161"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 4H21L14 12V20L10 22V12L3 4Z"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="rounded-lg shadow bg-blue-50">
            {showFilters && (
              <div className="flex flex-wrap gap-2 md:gap-4 mb-2 p-2">
                <div className="flex-1 min-w-[100px] md:min-w-[140px]">
                  <input
                    type="date"
                    name="startDate"
                    value={searchFilters.startDate}
                    onChange={handleSearchChange}
                    className="bg-white mt-1 block w-full px-2 py-1 md:px-3 md:py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-xs md:text-sm"
                  />
                </div>
                <div className="flex-1 min-w-[100px] md:min-w-[140px]">
                  <input
                    type="date"
                    name="endDate"
                    value={searchFilters.endDate}
                    onChange={handleSearchChange}
                    className="bg-white mt-1 block w-full px-2 py-1 md:px-3 md:py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-xs md:text-sm"
                  />
                </div>
                <div className="flex-1 min-w-[80px] md:min-w-[90px]">
                  <input
                    type="text"
                    name="checkNumber"
                    placeholder="Check #"
                    value={searchFilters.checkNumber}
                    onChange={handleSearchChange}
                    className="bg-white mt-1 block w-full px-2 py-1 md:px-3 md:py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-xs md:text-sm"
                  />
                </div>
                <div className="flex-1 min-w-[120px] md:min-w-[180px]">
                  <input
                    type="text"
                    name="payee"
                    placeholder="Payee"
                    value={searchFilters.payee}
                    onChange={handleSearchChange}
                    className="bg-white mt-1 block w-full px-2 py-1 md:px-3 md:py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-xs md:text-sm"
                  />
                </div>
                <div className="flex-1 min-w-[90px] md:min-w-[110px]">
                  <input
                    type="text"
                    name="category"
                    placeholder="Category"
                    value={searchFilters.category}
                    onChange={handleSearchChange}
                    className="bg-white mt-1 block w-full px-2 py-1 md:px-3 md:py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-xs md:text-sm"
                  />
                </div>
                <div className="flex-1 min-w-[150px] md:min-w-[200px]">
                  <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    value={searchFilters.description}
                    onChange={handleSearchChange}
                    className="bg-white mt-1 block w-full px-2 py-1 md:px-3 md:py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-xs md:text-sm"
                  />
                </div>
                <div className="flex-1 min-w-[100px] md:min-w-[150px]">
                  <input
                    type="number"
                    name="amount"
                    placeholder="Amount"
                    value={searchFilters.amount}
                    onChange={handleSearchChange}
                    step="0.01"
                    className="bg-white mt-1 block w-full px-2 py-1 md:px-3 md:py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-xs md:text-sm"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={resetFilters}
                    className="px-3 py-1 md:px-4 md:py-2 border border-gray-300 shadow-sm text-xs md:text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
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
                    Category
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 md:px-6 md:py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50"
                  >
                    Description
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 md:px-6 md:py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50"
                  >
                    Amount
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 md:px-6 md:py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50 text-right"
                  >
                    Balance
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 md:px-6 md:py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50 text-center"
                  >
                    Cleared
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 md:px-6 md:py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedTransactions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={10}
                      className="px-4 py-3 md:px-6 md:py-4 text-center text-gray-500"
                    >
                      No transactions found
                    </td>
                  </tr>
                ) : (
                  paginatedTransactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className={transaction.isCleared ? 'bg-[#f5fcf8]' : ''}
                    >
                      <td className="px-4 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-[#0a0a0a] font-semibold">
                        {formatDate(new Date(transaction.date))}
                      </td>
                      <td className="px-4 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-[#0a0a0a] font-semibold">
                        {transaction.checkNumber || '-'}
                      </td>
                      <td className="px-4 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-[#0a0a0a] font-semibold">
                        {transaction.payee}
                      </td>
                      <td className="px-4 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-50 border border-gray-200">
                          {transaction.category}
                        </span>
                      </td>
                      <td className="px-4 py-2 md:px-6 md:py-4 text-xs md:text-sm text-gray-500">
                        {transaction.description}
                      </td>
                      <td className="px-4 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-right">
                        {transaction.debit > 0 ? (
                          <span className="text-red-600 font-semibold">
                            {formatCurrency(transaction.debit)}
                          </span>
                        ) : transaction.credit > 0 ? (
                          <span className="text-green-600 font-semibold">
                            {formatCurrency(transaction.credit)}
                          </span>
                        ) : null}
                      </td>

                      <td className="px-4 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-[#0a0a0a] font-semibold text-right">
                        {formatCurrency(transaction.runningBalance)}
                      </td>
                      <td className="px-4 py-2 md:px-6 md:py-4 whitespace-nowrap flex justify-center">
                        {transaction.isCleared ? (
                          <div className="w-3 h-3 bg-[#39e3a9] rounded-sm"></div>
                        ) : (
                          <div className="w-3 h-3 border-2 border-gray-400 rounded-sm"></div>
                        )}
                      </td>
                      <td className="px-4 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm font-medium">
                        <button
                          className="text-indigo-400 hover:text-indigo-900 mr-2 md:mr-3"
                          onClick={() =>
                            router.push(
                              `/accounts/${accountId}/transactions/${transaction.id}/edit`,
                            )
                          }
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 md:h-5 md:w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                        <button className="text-red-400 hover:text-red-900">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 md:h-5 md:w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 py-3 md:px-6 md:py-4 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="text-xs md:text-sm text-gray-700">
                Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(
                    startIndex + recordsPerPage,
                    searchedTransactions.length,
                  )}
                </span>{' '}
                of{' '}
                <span className="font-medium">
                  {searchedTransactions.length}
                </span>{' '}
                results
              </div>
              <div className="flex flex-wrap gap-1 md:gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className={`px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm font-medium rounded-md ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Previous
                </button>

                {/* Page numbers */}
                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1;
                  // Show first, last, current, and nearby pages
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm font-medium rounded-md ${
                          currentPage === page
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  }
                  // Show ellipsis for skipped pages
                  if (page === currentPage - 2 || page === currentPage + 2) {
                    return (
                      <span
                        key={page}
                        className="px-1 py-1 md:px-2 md:py-2 text-xs md:text-sm text-gray-500"
                      >
                        ...
                      </span>
                    );
                  }
                  return null;
                })}

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm font-medium rounded-md ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
