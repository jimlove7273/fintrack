import NewTransactionClient from '@/components/transactions/NewTransactionClient';
import { mockAccounts } from '@/data/accounts';
import { redirect } from 'next/navigation';

export default async function NewTransactionPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  // Handle the case where params might be a promise
  const { id } = await Promise.resolve(params);

  // Find the account
  const account = mockAccounts.find((acc) => acc.id === id);

  if (!account) {
    // Redirect to dashboard if account not found
    redirect('/');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <NewTransactionClient accountId={id} accountName={account.name} />
    </div>
  );
}
