import React from 'react';
import { useForm } from '@inertiajs/react';
import { toast } from 'react-toastify';
import Modal from './Modal';
import InputLabel from './InputLabel';
import TextInput from './TextInput';
import InputError from './InputError';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const DebtForm = ({ isOpen, onClose, members }) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        member_id: '',
        amount: '',
        reason: '',
        due_date: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route('debts.store'), {
            onSuccess: () => {
                toast.success('Debt added successfully!');
                reset();
                onClose();
            },
            onError: (errors) => {
                console.error('Debt creation errors:', errors);
                if (errors.member_id) {
                    toast.error('Please select a valid member');
                } else if (errors.amount) {
                    toast.error('Please enter a valid amount');
                } else if (errors.reason) {
                    toast.error('Please provide a reason for the debt');
                } else if (errors.due_date) {
                    toast.error('Please select a valid due date');
                } else {
                    toast.error('Failed to add debt. Please try again.');
                }
            }
        });
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    // Get today's date in YYYY-MM-DD format for min date
    const today = new Date().toISOString().split('T')[0];

    return (
        <Modal
            show={isOpen}
            onClose={handleClose}
            title="Add Debt"
            maxWidth="lg"
            icon={<ExclamationTriangleIcon className="w-6 h-6" />}
            iconColor="red"
        >
            <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-6">
                    {/* Member Selection */}
                    <div>
                        <InputLabel htmlFor="member_id" value="Member" className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2" />
                        <select
                            id="member_id"
                            value={data.member_id}
                            onChange={(e) => setData('member_id', e.target.value)}
                            className="mt-1 block w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:focus:ring-red-400 dark:focus:border-red-400 text-gray-900 dark:text-white transition-all duration-300"
                            required
                        >
                            <option value="">Select a member</option>
                            {(members?.data || members || []).map((member) => (
                                <option key={member.id} value={member.id}>
                                    {member.name}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.member_id} className="mt-2" />
                    </div>

                    {/* Amount */}
                    <div>
                        <InputLabel htmlFor="amount" value="Amount" className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2" />
                        <TextInput
                            id="amount"
                            type="number"
                            step="0.01"
                            min="0"
                            value={data.amount}
                            onChange={(e) => setData('amount', e.target.value)}
                            className="mt-1 block w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:focus:ring-red-400 dark:focus:border-red-400 text-gray-900 dark:text-white transition-all duration-300"
                            placeholder="Enter debt amount"
                            required
                        />
                        <InputError message={errors.amount} className="mt-2" />
                    </div>

                    {/* Reason */}
                    <div>
                        <InputLabel htmlFor="reason" value="Reason" className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2" />
                        <TextInput
                            id="reason"
                            type="text"
                            value={data.reason}
                            onChange={(e) => setData('reason', e.target.value)}
                            className="mt-1 block w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:focus:ring-red-400 dark:focus:border-red-400 text-gray-900 dark:text-white transition-all duration-300"
                            placeholder="Enter reason for debt"
                            required
                        />
                        <InputError message={errors.reason} className="mt-2" />
                    </div>

                    {/* Due Date */}
                    <div>
                        <InputLabel htmlFor="due_date" value="Due Date" className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2" />
                        <TextInput
                            id="due_date"
                            type="date"
                            min={today}
                            value={data.due_date}
                            onChange={(e) => setData('due_date', e.target.value)}
                            className="mt-1 block w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:focus:ring-red-400 dark:focus:border-red-400 text-gray-900 dark:text-white transition-all duration-300"
                            required
                        />
                        <InputError message={errors.due_date} className="mt-2" />
                    </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-600 dark:hover:to-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300 transform hover:scale-105"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {processing ? (
                            <div className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Adding Debt...
                            </div>
                        ) : (
                            'Add Debt'
                        )}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default DebtForm;
