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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={handleCancel}
          className="text-indigo-600 hover:text-indigo-800"
        >
          ← Back to Account
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-6">Edit Account</h1>

      <AccountForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isEditing={true}
      />
    </div>
  );
}
