import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import Modal from './Modal';

const DisasterPaymentForm = ({ members, closeModal }) => {
    const { data, setData, post, processing, errors } = useForm({
        member_id: '',
        amount: '',
        date: '',
        purpose: '',
    });

    const [toast, setToast] = useState({ message: '', type: '', visible: false });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('disaster-payments.store'), {
            onSuccess: () => {
                setToast({ message: 'Disaster payment recorded successfully.', type: 'success', visible: true });
                setTimeout(() => {
                    setToast({ message: '', type: '', visible: false });
                    closeModal();
                }, 3000);
            },
            onError: () => {
                setToast({ message: 'Failed to record disaster payment. Please check the form.', type: 'error', visible: true });
                setTimeout(() => setToast({ message: '', type: '', visible: false }), 3000);
            }
        });
    };

    return (
        <>
            {/* Enhanced Toast Notification */}
            {toast.visible && (
                <div className={`fixed top-4 right-4 p-4 rounded-xl shadow-2xl z-[99999] animate-fade-in-out border-l-4 ${
                    toast.type === 'success'
                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 text-green-800 dark:text-green-200 border-green-500'
                        : 'bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 text-red-800 dark:text-red-200 border-red-500'
                }`}>
                    <div className="flex items-center">
                        <div className={`p-1 rounded-full mr-3 ${
                            toast.type === 'success' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
                        }`}>
                            {toast.type === 'success' ? (
                                <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            )}
                        </div>
                        <span className="font-medium">{toast.message}</span>
                    </div>
                </div>
            )}

            {/* Enhanced Modal using Modal Component */}
            <Modal
                show={true}
                onClose={closeModal}
                title="Add Disaster Payment"
                maxWidth="lg"
                className="disaster-payment-modal"
                iconColor="red"
                icon={
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                }
            >
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="member_id" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Member
                            </label>
                            <select
                                id="member_id"
                                value={data.member_id}
                                onChange={e => setData('member_id', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 focus:border-red-500 dark:focus:border-red-600 focus:ring-2 focus:ring-red-500 dark:focus:ring-red-600 rounded-xl shadow-sm transition-all duration-200"
                            >
                                <option value="">Select Member</option>
                                {members.map(member => (
                                    <option key={member.id} value={member.id}>{member.name}</option>
                                ))}
                            </select>
                            {errors.member_id && <div className="text-red-500 text-sm mt-2 flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {errors.member_id}
                            </div>}
                        </div>

                        <div>
                            <label htmlFor="amount" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Amount
                            </label>
                            <input
                                id="amount"
                                type="number"
                                step="0.01"
                                value={data.amount}
                                onChange={e => setData('amount', e.target.value)}
                                placeholder="Enter payment amount"
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 focus:border-red-500 dark:focus:border-red-600 focus:ring-2 focus:ring-red-500 dark:focus:ring-red-600 rounded-xl shadow-sm transition-all duration-200"
                            />
                            {errors.amount && <div className="text-red-500 text-sm mt-2 flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {errors.amount}
                            </div>}
                        </div>

                        <div>
                            <label htmlFor="date" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Date
                            </label>
                            <input
                                id="date"
                                type="date"
                                value={data.date}
                                onChange={e => setData('date', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 focus:border-red-500 dark:focus:border-red-600 focus:ring-2 focus:ring-red-500 dark:focus:ring-red-600 rounded-xl shadow-sm transition-all duration-200"
                            />
                            {errors.date && <div className="text-red-500 text-sm mt-2 flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {errors.date}
                            </div>}
                        </div>

                        <div>
                            <label htmlFor="purpose" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Purpose
                            </label>
                            <input
                                id="purpose"
                                type="text"
                                value={data.purpose}
                                onChange={e => setData('purpose', e.target.value)}
                                placeholder="Purpose of disaster payment"
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 focus:border-red-500 dark:focus:border-red-600 focus:ring-2 focus:ring-red-500 dark:focus:ring-red-600 rounded-xl shadow-sm transition-all duration-200"
                            />
                            {errors.purpose && <div className="text-red-500 text-sm mt-2 flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {errors.purpose}
                            </div>}
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-600 dark:hover:to-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300 transform hover:scale-105"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white text-sm font-semibold rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {processing ? (
                                <div className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Saving...
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Add Payment
                                </div>
                            )}
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    );
};

export default DisasterPaymentForm;
