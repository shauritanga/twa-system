import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';

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
            {toast.visible && (
                <div className="fixed top-4 right-4 p-4 text-sm text-white rounded-lg shadow-lg z-50 animate-fade-in-out" 
                     style={{ backgroundColor: toast.type === 'success' ? '#10B981' : '#EF4444' }}>
                    {toast.message}
                </div>
            )}
            <div className="fixed z-[9999] inset-0 overflow-y-auto">
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <form onSubmit={handleSubmit}>
                        <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Add Disaster Payment</h3>
                            <div className="mt-2">
                                <select value={data.member_id} onChange={e => setData('member_id', e.target.value)} className="w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white">
                                    <option value="">Select Member</option>
                                    {members.map(member => (
                                        <option key={member.id} value={member.id}>{member.name}</option>
                                    ))}
                                </select>
                                {errors.member_id && <div className="text-red-500">{errors.member_id}</div>}
                                <input type="number" value={data.amount} onChange={e => setData('amount', e.target.value)} placeholder="Amount" className="w-full mt-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white" />
                                {errors.amount && <div className="text-red-500">{errors.amount}</div>}
                                <input type="date" value={data.date} onChange={e => setData('date', e.target.value)} className="w-full mt-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white" />
                                {errors.date && <div className="text-red-500">{errors.date}</div>}
                                <input type="text" value={data.purpose} onChange={e => setData('purpose', e.target.value)} placeholder="Purpose of payment" className="w-full mt-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white" />
                                {errors.purpose && <div className="text-red-500">{errors.purpose}</div>}
                            </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button type="submit" disabled={processing} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm">
                                {processing ? 'Saving...' : 'Create'}
                            </button>
                            <button type="button" onClick={closeModal} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </>
    );
};

export default DisasterPaymentForm;
