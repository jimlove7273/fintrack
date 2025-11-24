'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AccountFormData } from '@/types/account';

interface AccountFormProps {
  initialData?: AccountFormData;
  onSubmit: (data: AccountFormData) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

export default function AccountForm({
  initialData,
  onSubmit,
  onCancel,
  isEditing = false,
}: AccountFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState<AccountFormData>({
    name: initialData?.name || '',
    accountNumber: initialData?.accountNumber || '',
    initialBalance: initialData?.initialBalance || 0,
    contactPerson: initialData?.contactPerson || '',
    address: initialData?.address || '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    zipCode: initialData?.zipCode || '',
    contactName: initialData?.contactName || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    fax: initialData?.fax || '',
    isActive: initialData?.isActive !== undefined ? initialData.isActive : true,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, type } = e.target;

    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData((prev) => ({
        ...prev,
        [name]: target.checked,
      }));
    } else {
      const target = e.target as HTMLInputElement | HTMLTextAreaElement;
      setFormData((prev) => ({
        ...prev,
        [name]: target.value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-10">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Left Column - Form Info */}
        <div className="md:col-span-1 mx-auto">
          <div className="bg-gray-50 rounded-lg p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {isEditing ? 'Edit Account' : 'Create Account'}
            </h3>
            <p className="text-sm text-gray-600">
              {isEditing
                ? 'Edit the account details below.'
                : 'Enter the details for the new account.'}
            </p>
            <div className="mt-6 space-y-4">
              <div className="flex items-center">
                <div className="shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
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
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
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
        <div className="md:col-span-2 ml-0">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-gray-600 mb-2"
                >
                  Account Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-lg border border-gray-300 bg-white p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all duration-200"
                  />
                </div>
              </div>

              <div className="sm:col-span-1">
                <label
                  htmlFor="accountNumber"
                  className="block text-sm font-semibold text-gray-600 mb-2"
                >
                  Account Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="accountNumber"
                    id="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-lg border border-gray-300 bg-white p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all duration-200"
                  />
                </div>
              </div>

              <div className="sm:col-span-1">
                <label
                  htmlFor="initialBalance"
                  className="block text-sm font-semibold text-gray-600 mb-2"
                >
                  Initial Balance
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    name="initialBalance"
                    id="initialBalance"
                    value={formData.initialBalance}
                    onChange={handleChange}
                    step="0.01"
                    className="block w-full rounded-lg border border-gray-300 bg-white p-2 pl-7 pr-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all duration-200"
                  />
                </div>
              </div>

              <div className="sm:col-span-1">
                <label
                  htmlFor="isActive"
                  className="block text-sm font-semibold text-gray-600 mb-2"
                >
                  Account Status
                </label>
                <div className="mt-1 flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="isActive"
                    className="ml-3 block text-sm font-semibold text-gray-600"
                  >
                    Active
                  </label>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="contactPerson"
                  className="block text-sm font-semibold text-gray-600 mb-2"
                >
                  Contact Person
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="contactPerson"
                    id="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    className="block w-full rounded-lg border border-gray-300 bg-white p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all duration-200"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="address"
                  className="block text-sm font-semibold text-gray-600 mb-2"
                >
                  Address
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="address"
                    id="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="block w-full rounded-lg border border-gray-300 bg-white p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all duration-200"
                  />
                </div>
              </div>

              <div className="sm:col-span-1">
                <label
                  htmlFor="city"
                  className="block text-sm font-semibold text-gray-600 mb-2"
                >
                  City
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="city"
                    id="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="block w-full rounded-lg border border-gray-300 bg-white p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all duration-200"
                  />
                </div>
              </div>

              <div className="sm:col-span-1">
                <label
                  htmlFor="state"
                  className="block text-sm font-semibold text-gray-600 mb-2"
                >
                  State
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="state"
                    id="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="block w-full rounded-lg border border-gray-300 bg-white p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all duration-200"
                  />
                </div>
              </div>

              <div className="sm:col-span-1">
                <label
                  htmlFor="zipCode"
                  className="block text-sm font-semibold text-gray-600 mb-2"
                >
                  ZIP Code
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="zipCode"
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className="block w-full rounded-lg border border-gray-300 bg-white p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all duration-200"
                  />
                </div>
              </div>

              <div className="sm:col-span-1">
                <label
                  htmlFor="contactName"
                  className="block text-sm font-semibold text-gray-600 mb-2"
                >
                  Contact Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="contactName"
                    id="contactName"
                    value={formData.contactName}
                    onChange={handleChange}
                    className="block w-full rounded-lg border border-gray-300 bg-white p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all duration-200"
                  />
                </div>
              </div>

              <div className="sm:col-span-1">
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-600 mb-2"
                >
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full rounded-lg border border-gray-300 bg-white p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all duration-200"
                  />
                </div>
              </div>

              <div className="sm:col-span-1">
                <label
                  htmlFor="phone"
                  className="block text-sm font-semibold text-gray-600 mb-2"
                >
                  Phone
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="phone"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="block w-full rounded-lg border border-gray-300 bg-white p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all duration-200"
                  />
                </div>
              </div>

              <div className="sm:col-span-1">
                <label
                  htmlFor="fax"
                  className="block text-sm font-semibold text-gray-600 mb-2"
                >
                  Fax
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="fax"
                    id="fax"
                    value={formData.fax}
                    onChange={handleChange}
                    className="block w-full rounded-lg border border-gray-300 bg-white p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all duration-200"
                  />
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
          {isEditing ? 'Update Account' : 'Create Account'}
        </button>
      </div>
    </form>
  );
}
