'use client';

import { useRouter } from 'next/navigation';
import TransactionForm from '@/components/transactions/TransactionForm';
import { TransactionFormData } from '@/types/transaction';
import { mockAccounts } from '@/data/accounts';

export default function NewTransactionPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const accountId = params.id;

  // Find the account
  const account = mockAccounts.find((acc) => acc.id === accountId);

  if (!account) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-red-600">Account not found</h1>
        <button
          onClick={() => router.push('/')}
          className="text-indigo-600 hover:text-indigo-800 mt-4 block"
        >
          ← Back to Dashboard
        </button>
      </div>
    );
  }

  const handleSubmit = (data: TransactionFormData) => {
    // In a real app, this would be an API call
    console.log('Creating transaction:', data);
    // Redirect to account details
    router.push(`/accounts/${accountId}`);
  };

  const handleCancel = () => {
    router.push(`/accounts/${accountId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => router.push(`/accounts/${accountId}`)}
          className="text-indigo-600 hover:text-indigo-800"
        >
          ← Back to {account.name}
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-6">Add New Transaction</h1>
      <h2 className="text-xl font-semibold mb-6">Account: {account.name}</h2>

      <TransactionForm
        accountId={accountId}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isEditing={false}
      />
    </div>
  );
}
