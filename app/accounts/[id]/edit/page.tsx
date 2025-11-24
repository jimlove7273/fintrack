'use client';

import { AccountFormData, Account } from '@/types/account';
import { accountService } from '@/services/accountService';
import { useRouter } from 'next/navigation';
import AccountForm from '@/components/accounts/AccountForm';
import { useEffect, useState } from 'react';

export default function EditAccountPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [account, setAccount] = useState<Account | null>(null);
  const [accountId, setAccountId] = useState<string>('');

  useEffect(() => {
    // Handle the case where params might be a promise or regular object
    Promise.resolve(params).then((resolvedParams) => {
      const id = resolvedParams.id;
      setAccountId(id);

      // Get the account directly
      const foundAccount = accountService.getAccountById(id);
      setAccount(foundAccount || null);
    });
  }, [params]);

  if (!account) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-red-600">Account not found</h1>
        <p className="text-gray-600">
          Looking for account with ID: {accountId}
        </p>
        <button
          onClick={() => router.push('/')}
          className="text-indigo-600 hover:text-indigo-800 mt-4 block"
        >
          ← Back to Dashboard
        </button>
      </div>
    );
  }

  const handleSubmit = (data: AccountFormData) => {
    // Update the account using our service
    const updatedAccount = accountService.updateAccount(accountId, data);

    if (updatedAccount) {
      console.log('Account updated successfully:', updatedAccount);
      // Redirect to the account details page
      router.push(`/accounts/${accountId}`);
    } else {
      console.error('Failed to update account');
      // In a real app, we would show an error message to the user
    }
  };

  const handleCancel = () => {
    router.push(`/accounts/${accountId}`);
  };

  // Prepare initial data for the form
  const initialData: AccountFormData = {
    name: account.name,
    accountNumber: account.accountNumber,
    initialBalance: account.initialBalance,
    contactPerson: account.contactPerson,
    address: account.address,
    city: account.city,
    state: account.state,
    zipCode: account.zipCode,
    contactName: account.contactName,
    email: account.email,
    phone: account.phone,
    fax: account.fax,
    isActive: account.isActive,
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
          {account.name}
        </button>
        <svg className="mx-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
        <span className="text-gray-900 font-medium">Edit Account</span>
      </nav>

      {/* Page Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Account</h1>
              <p className="text-sm text-gray-500 mt-1">
                Modify the account details
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
            <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
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
              <p className="text-sm text-gray-500">{account.name}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            Account Details
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Update the information below
          </p>
        </div>
        <div className="px-6 py-6">
          <AccountForm
            initialData={initialData}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isEditing={true}
          />
        </div>
      </div>
    </div>
  );
}
