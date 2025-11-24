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

export default function AccountDetails() {
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
    <div className="container mx-auto p-4">
      <div className="mb-2">
        <Link
          href="/"
          className="text-sm text-indigo-600 hover:text-indigo-800"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{account.name}</h1>
          <div className="flex items-center mt-1">
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
        <div className="flex space-x-2">
          <button
            className="text-sm font-semibold px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            onClick={() => router.push(`/accounts/${accountId}/edit`)}
          >
            Edit Account
          </button>
          <button
            className="text-sm font-semibold px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            onClick={() => router.push(`/accounts/${accountId}/reconciliation`)}
          >
            Reconcile
          </button>
          <button
            className="text-sm font-semibold px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            onClick={() =>
              router.push(`/accounts/${accountId}/transactions/new`)
            }
          >
            Add Transaction
          </button>
        </div>
      </div>

      {/* Balance Summary */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Account Balances</h2>
          <div className="flex space-x-8">
            <div className="text-right">
              <p className="text-sm text-gray-600">All Transactions</p>
              <p className="text-2xl font-bold">
                {formatCurrency(accountBalance)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Cleared Transactions</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(clearedBalance)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Section */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Transactions</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <span className="mr-2 text-sm text-gray-600">Show All:</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={showAll}
                  onChange={() => setShowAll(!showAll)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <div className="flex items-center">
              <span className="mr-2 text-sm text-gray-600">Rec per page:</span>
              <select
                value={recordsPerPage}
                onChange={handleRecordsPerPageChange}
                className="block w-1/2 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            <div
              className="border-dotted border-l border-gray-400 px-3 cursor-pointer"
              onClick={() => setShowFilters(!showFilters)}
            >
              <svg
                width="19"
                height="19"
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
            <div className="flex flex-wrap gap-4 mb-2 p-2">
              <div className="flex-1 w-full max-w-[140px]">
                <input
                  type="date"
                  name="startDate"
                  value={searchFilters.startDate}
                  onChange={handleSearchChange}
                  className="bg-white mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div className="flex-1 w-full max-w-[140px]">
                <input
                  type="date"
                  name="endDate"
                  value={searchFilters.endDate}
                  onChange={handleSearchChange}
                  className="bg-white mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div className="flex-1 w-full max-w-[90px]">
                <input
                  type="text"
                  name="checkNumber"
                  placeholder="Check #"
                  value={searchFilters.checkNumber}
                  onChange={handleSearchChange}
                  className="bg-white mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div className="flex-1 w-full max-w-[180px]">
                <input
                  type="text"
                  name="payee"
                  placeholder="Payee"
                  value={searchFilters.payee}
                  onChange={handleSearchChange}
                  className="bg-white mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div className="flex-1 w-full max-w-[110px]">
                <input
                  type="text"
                  name="category"
                  placeholder="Category"
                  value={searchFilters.category}
                  onChange={handleSearchChange}
                  className="bg-white mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div className="flex-1 w-full max-w-[200px]">
                <input
                  type="text"
                  name="description"
                  placeholder="Description"
                  value={searchFilters.description}
                  onChange={handleSearchChange}
                  className="bg-white mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div className="flex-1 w-full max-w-[150px]">
                <input
                  type="number"
                  name="amount"
                  placeholder="Amount"
                  value={searchFilters.amount}
                  onChange={handleSearchChange}
                  step="0.01"
                  className="bg-white mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50"
                >
                  Check #
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50"
                >
                  Payee
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50"
                >
                  Category
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50"
                >
                  Description
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-red-600 uppercase tracking-wider bg-gray-50"
                >
                  Debit (-)
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-green-600 uppercase tracking-wider bg-gray-50"
                >
                  Credit (+)
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50"
                >
                  Balance
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50"
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
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No transactions found
                  </td>
                </tr>
              ) : (
                paginatedTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className={transaction.isCleared ? 'bg-green-50' : ''}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(new Date(transaction.date))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.checkNumber || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {transaction.payee}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.category}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {transaction.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {transaction.debit > 0 ? (
                        <span className="text-red-600">
                          {formatCurrency(transaction.debit)}
                        </span>
                      ) : (
                        ''
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {transaction.credit > 0 ? (
                        <span className="text-green-600">
                          {formatCurrency(transaction.credit)}
                        </span>
                      ) : (
                        ''
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {formatCurrency(transaction.runningBalance)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          transaction.isCleared
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {transaction.isCleared ? 'Cleared' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        className="text-indigo-400 hover:text-indigo-900 mr-3"
                        onClick={() =>
                          router.push(
                            `/accounts/${accountId}/transactions/${transaction.id}/edit`,
                          )
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      <button className="text-red-400 hover:text-red-900">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
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
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(
                  startIndex + recordsPerPage,
                  searchedTransactions.length,
                )}
              </span>{' '}
              of{' '}
              <span className="font-medium">{searchedTransactions.length}</span>{' '}
              results
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
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
                      className={`px-4 py-2 text-sm font-medium rounded-md ${
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
                      className="px-2 py-2 text-sm text-gray-500"
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
                className={`px-4 py-2 text-sm font-medium rounded-md ${
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
  );
}
