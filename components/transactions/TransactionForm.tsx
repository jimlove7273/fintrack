'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TransactionFormData } from '@/types/transaction';
import { formatCurrency } from '@/utils/formatters';

interface TransactionFormProps {
  accountId: string;
  initialData?: TransactionFormData;
  onSubmit: (data: TransactionFormData) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

export default function TransactionForm({
  accountId,
  initialData,
  onSubmit,
  onCancel,
  isEditing = false,
}: TransactionFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState<TransactionFormData>({
    date: initialData?.date || new Date(),
    checkNumber: initialData?.checkNumber || '',
    payee: initialData?.payee || '',
    category: initialData?.category || '',
    description: initialData?.description || '',
    debit: initialData?.debit || 0,
    credit: initialData?.credit || 0,
    isCleared:
      initialData?.isCleared !== undefined ? initialData.isCleared : false,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData((prev) => ({
        ...prev,
        [name]: target.checked,
      }));
    } else if (name === 'debit' || name === 'credit') {
      setFormData((prev) => ({
        ...prev,
        [name]: parseFloat(value) || 0,
      }));
    } else {
      const target = e.target as
        | HTMLInputElement
        | HTMLTextAreaElement
        | HTMLSelectElement;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                {isEditing ? 'Edit Transaction' : 'Create Transaction'}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {isEditing
                  ? 'Edit the transaction details below.'
                  : 'Enter the details for the new transaction.'}
              </p>
            </div>

            <div className="mt-5 md:mt-0 md:col-span-2">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="date"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    id="date"
                    value={
                      formData.date instanceof Date
                        ? formData.date.toISOString().split('T')[0]
                        : new Date().toISOString().split('T')[0]
                    }
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="checkNumber"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Check Number
                  </label>
                  <input
                    type="text"
                    name="checkNumber"
                    id="checkNumber"
                    value={formData.checkNumber}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="col-span-6">
                  <label
                    htmlFor="payee"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Payee
                  </label>
                  <input
                    type="text"
                    name="payee"
                    id="payee"
                    value={formData.payee}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="col-span-6">
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Category
                  </label>
                  <select
                    name="category"
                    id="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="">Select a category</option>
                    <option value="Income">Income</option>
                    <option value="Housing">Housing</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Food & Dining">Food & Dining</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Groceries">Groceries</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Insurance">Insurance</option>
                    <option value="Transfer">Transfer</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="col-span-6">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="debit"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Debit ({formatCurrency(formData.debit)})
                  </label>
                  <input
                    type="number"
                    name="debit"
                    id="debit"
                    value={formData.debit || ''}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="credit"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Credit ({formatCurrency(formData.credit)})
                  </label>
                  <input
                    type="number"
                    name="credit"
                    id="credit"
                    value={formData.credit || ''}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="col-span-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isCleared"
                      id="isCleared"
                      checked={formData.isCleared}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="isCleared"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Cleared
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {isEditing ? 'Update Transaction' : 'Create Transaction'}
          </button>
        </div>
      </form>
    </div>
  );
}
