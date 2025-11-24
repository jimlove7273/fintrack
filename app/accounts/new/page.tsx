'use client';

import { useRouter } from 'next/navigation';
import AccountForm from '@/components/accounts/AccountForm';
import { AccountFormData } from '@/types/account';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function NewAccountPage() {
  const router = useRouter();

  const handleSubmit = (data: AccountFormData) => {
    // In a real app, this would be an API call
    console.log('Creating account:', data);
    // Redirect to accounts list or dashboard
    router.push('/');
  };

  const handleCancel = () => {
    router.push('/');
  };

  return (
    <ProtectedRoute>
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
          <span className="text-gray-900 font-medium">Create Account</span>
        </nav>

        {/* Page Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Create New Account
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  Fill in the details below to create a new account
                </p>
              </div>
              <button
                onClick={handleCancel}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>

        <AccountForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isEditing={false}
        />
      </div>
    </ProtectedRoute>
  );
}
