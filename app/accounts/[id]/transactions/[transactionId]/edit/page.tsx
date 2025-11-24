import EditTransactionClient from '@/components/transactions/EditTransactionClient';
import { mockAccounts } from '@/data/accounts';
import { mockTransactions } from '@/data/transactions';
import { redirect } from 'next/navigation';

export default async function EditTransactionPage({
  params,
}: {
  params:
    | Promise<{ id: string; transactionId: string }>
    | { id: string; transactionId: string };
}) {
  // Handle the case where params might be a promise
  const { id, transactionId } = await Promise.resolve(params);

  // Find the account
  const account = mockAccounts.find((acc) => acc.id === id);

  if (!account) {
    // Redirect to dashboard if account not found
    redirect('/');
  }

  // Find the transaction
  const transaction = mockTransactions.find((t) => t.id === transactionId);

  if (!transaction) {
    // Redirect to account page if transaction not found
    redirect(`/accounts/${id}`);
  }

  // Prepare initial data for the form
  const initialData = {
    date: transaction.date,
    checkNumber: transaction.checkNumber,
    payee: transaction.payee,
    category: transaction.category,
    description: transaction.description,
    debit: transaction.debit,
    credit: transaction.credit,
    isCleared: transaction.isCleared,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <EditTransactionClient
        accountId={id}
        accountName={account.name}
        initialData={initialData}
      />
    </div>
  );
}
