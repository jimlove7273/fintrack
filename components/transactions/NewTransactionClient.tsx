'use client';

import { useRouter } from 'next/navigation';
import NewTransactionForm from './NewTransactionForm';

interface NewTransactionFormData {
  date: Date;
  checkNumber: string;
  payee: string;
  category: string;
  description: string;
  debit: number;
  credit: number;
  isCleared: boolean;
  isRecurring: boolean;
  recurrenceType: 'endDate' | 'count';
  endDate?: string;
  repeatCount?: number;
  endOfMonth: boolean;
}

interface NewTransactionClientProps {
  accountId: string;
  accountName: string;
}

export default function NewTransactionClient({
  accountId,
  accountName,
}: NewTransactionClientProps) {
  const router = useRouter();

  const handleSubmit = (data: NewTransactionFormData) => {
    // In a real app, this would be an API call
    console.log('Creating transaction(s):', data);
    // Redirect to account details
    router.push(`/accounts/${accountId}`);
  };

  const handleCancel = () => {
    router.push(`/accounts/${accountId}`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-gray-500 mb-6">
        <button
          onClick={() => router.push('/')}
          className="hover:text-indigo-600 transition-colors duration-200"
        >
          Dashboard
        </button>
        <svg className="mx-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
        <button
          onClick={() => router.push(`/accounts/${accountId}`)}
          className="hover:text-indigo-600 transition-colors duration-200"
        >
          {accountName}
        </button>
        <svg className="mx-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
        <span className="text-gray-900 font-medium">New Transaction</span>
      </nav>

      {/* Page Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                New Transaction
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Add a new transaction or recurring transactions
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleCancel}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className="px-6 py-4 bg-gray-50 rounded-b-xl">
          <div className="flex items-center">
            <div className="shrink-0 h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
              <svg
                className="h-6 w-6 text-indigo-600"
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
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-900">Account</h3>
              <p className="text-sm text-gray-500">{accountName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            Transaction Details
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Enter the information below
          </p>
        </div>
        <div className="px-6 py-6">
          <NewTransactionForm
            accountId={accountId}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
}
