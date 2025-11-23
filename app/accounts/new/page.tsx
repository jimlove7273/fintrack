'use client';

import { useRouter } from 'next/navigation';
import AccountForm from '@/components/accounts/AccountForm';
import { AccountFormData } from '@/types/account';

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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => router.push('/')}
          className="text-indigo-600 hover:text-indigo-800"
        >
          ← Back to Dashboard
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-6">Create New Account</h1>

      <AccountForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isEditing={false}
      />
    </div>
  );
}
