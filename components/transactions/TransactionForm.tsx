'use client';

import { useState } from 'react';
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
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Left Column - Form Info */}
        <div className="md:col-span-1">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {isEditing ? 'Edit Transaction' : 'New Transaction'}
            </h3>
            <p className="text-sm text-gray-600">
              {isEditing
                ? 'Update the details for this transaction.'
                : 'Enter the details for the new transaction.'}
            </p>
            <div className="mt-6 space-y-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <svg
                    className="h-4 w-4 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    Required Fields
                  </p>
                  <p className="text-xs text-gray-500">Marked with *</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Form Fields */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Date Field */}
              <div className="sm:col-span-1">
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-900 mb-2"
                >
                  Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
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
                    className="block w-full rounded-lg border border-gray-300 bg-white p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all duration-200"
                  />
                </div>
              </div>

              {/* Check Number Field */}
              <div className="sm:col-span-1">
                <label
                  htmlFor="checkNumber"
                  className="block text-sm font-medium text-gray-900 mb-2"
                >
                  Check Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="checkNumber"
                    id="checkNumber"
                    value={formData.checkNumber}
                    onChange={handleChange}
                    className="block w-full rounded-lg border border-gray-300 bg-white p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all duration-200"
                  />
                </div>
              </div>

              {/* Payee Field */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="payee"
                  className="block text-sm font-medium text-gray-900 mb-2"
                >
                  Payee <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="payee"
                    id="payee"
                    value={formData.payee}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-lg border border-gray-300 bg-white p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all duration-200"
                  />
                </div>
              </div>

              {/* Category Field */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-900 mb-2"
                >
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  id="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-lg border border-gray-300 bg-white p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all duration-200"
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

              {/* Description Field */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-900 mb-2"
                >
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-gray-300 bg-white p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all duration-200"
                />
              </div>

              {/* Debit Field */}
              <div className="sm:col-span-1">
                <label
                  htmlFor="debit"
                  className="block text-sm font-medium text-gray-900 mb-2"
                >
                  Debit ({formatCurrency(formData.debit)})
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    name="debit"
                    id="debit"
                    value={formData.debit || ''}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className="block w-full rounded-lg border border-gray-300 bg-white p-2 pl-7 pr-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all duration-200"
                  />
                </div>
              </div>

              {/* Credit Field */}
              <div className="sm:col-span-1">
                <label
                  htmlFor="credit"
                  className="block text-sm font-medium text-gray-900 mb-2"
                >
                  Credit ({formatCurrency(formData.credit)})
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    name="credit"
                    id="credit"
                    value={formData.credit || ''}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className="block w-full rounded-lg border border-gray-300 bg-white p-2 pl-7 pr-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all duration-200"
                  />
                </div>
              </div>

              {/* Cleared Checkbox */}
              <div className="sm:col-span-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isCleared"
                    id="isCleared"
                    checked={formData.isCleared}
                    onChange={handleChange}
                    className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="isCleared"
                    className="ml-3 block text-sm font-medium text-gray-900"
                  >
                    Cleared
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
        >
          {isEditing ? 'Update Transaction' : 'Create Transaction'}
        </button>
      </div>
    </form>
  );
}
