import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { PlusCircleIcon, UserGroupIcon } from '@heroicons/react/24/outline';

export default function Dependents({ dependents }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        relationship: '',
        date_of_birth: '',
        tribe: '',
        residence: '',
        image: null,
    });

    const [showForm, setShowForm] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('relationship', data.relationship);
        formData.append('date_of_birth', data.date_of_birth);
        formData.append('tribe', data.tribe);
        formData.append('residence', data.residence);
        if (data.image) {
            formData.append('image', data.image);
        }
        post(route('dependents.store'), {
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onSuccess: () => {
                reset();
                setShowForm(false);
            },
        });
    };

    return (
        <SidebarLayout>
            <div className="w-full py-12 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Your Dependants</h1>
                    {dependents.length < 5 && (
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                        >
                            <PlusCircleIcon className="h-5 w-5 mr-2" />
                            {showForm ? 'Cancel' : 'Add Dependant'}
                        </button>
                    )}
                </div>

                {showForm && (
                    <div className="fixed z-10 inset-0 overflow-y-auto">
                        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                            </div>
                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Add New Dependant</h2>
                                        <button onClick={() => setShowForm(false)} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Please provide the details of the dependant you wish to add. This information helps us maintain accurate records and process approvals. All fields are optional except for the name, but providing more details can expedite the verification process.</p>
                                    <form onSubmit={submit}>
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <InputLabel htmlFor="name" value="Dependant's Full Name *" className="text-gray-900 dark:text-gray-100 font-medium" />
                                                    <TextInput
                                                        id="name"
                                                        name="name"
                                                        value={data.name}
                                                        placeholder="e.g., John Doe"
                                                        className="mt-1 block w-full"
                                                        onChange={(e) => setData('name', e.target.value)}
                                                    />
                                                    <InputError message={errors.name} className="mt-2" />
                                                </div>
                                                <div>
                                                    <InputLabel htmlFor="relationship" value="Relationship to You" className="text-gray-900 dark:text-gray-100 font-medium" />
                                                    <TextInput
                                                        id="relationship"
                                                        name="relationship"
                                                        value={data.relationship}
                                                        placeholder="e.g., Spouse, Child, Parent"
                                                        className="mt-1 block w-full"
                                                        onChange={(e) => setData('relationship', e.target.value)}
                                                    />
                                                    <InputError message={errors.relationship} className="mt-2" />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <InputLabel htmlFor="date_of_birth" value="Date of Birth (Dependant)" className="text-gray-900 dark:text-gray-100 font-medium" />
                                                    <TextInput
                                                        id="date_of_birth"
                                                        name="date_of_birth"
                                                        type="date"
                                                        value={data.date_of_birth || ''}
                                                        placeholder="Select date"
                                                        className="mt-1 block w-full"
                                                        onChange={(e) => setData('date_of_birth', e.target.value)}
                                                    />
                                                    <InputError message={errors.date_of_birth} className="mt-2" />
                                                </div>
                                                <div>
                                                    <InputLabel htmlFor="tribe" value="Tribal Affiliation" className="text-gray-900 dark:text-gray-100 font-medium" />
                                                    <TextInput
                                                        id="tribe"
                                                        name="tribe"
                                                        value={data.tribe || ''}
                                                        placeholder="e.g., Kikuyu, Maasai"
                                                        className="mt-1 block w-full"
                                                        onChange={(e) => setData('tribe', e.target.value)}
                                                    />
                                                    <InputError message={errors.tribe} className="mt-2" />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 gap-6">
                                                <div>
                                                    <InputLabel htmlFor="residence" value="Current Residence Address" className="text-gray-900 dark:text-gray-100 font-medium" />
                                                    <TextInput
                                                        id="residence"
                                                        name="residence"
                                                        value={data.residence || ''}
                                                        placeholder="e.g., 123 Main St, Nairobi"
                                                        className="mt-1 block w-full"
                                                        onChange={(e) => setData('residence', e.target.value)}
                                                    />
                                                    <InputError message={errors.residence} className="mt-2" />
                                                </div>
                                                <div>
                                                    <InputLabel htmlFor="image" value="Dependent's Image" className="text-gray-900 dark:text-gray-100 font-medium" />
                                                    <input
                                                        id="image"
                                                        type="file"
                                                        accept="image/*"
                                                        className="mt-1 block w-full text-gray-900 dark:text-gray-100"
                                                        onChange={(e) => setData('image', e.target.files[0])}
                                                    />
                                                    <InputError message={errors.image} className="mt-2" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-6 flex justify-end">
                                            <button type="button" onClick={() => setShowForm(false)} className="mr-3 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                                Cancel
                                            </button>
                                            <PrimaryButton disabled={processing}>Add Dependant</PrimaryButton>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
                            <UserGroupIcon className="h-6 w-6 mr-3 text-blue-500" />
                            Existing Dependants
                        </h2>
                    </div>
                    <div className="p-6">
                        {dependents.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
                                {dependents.map((dependent) => (
                                    <div key={dependent.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                                        <div className="p-5">
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center">
                                                {dependent.name}
                                                {dependent.status === 'approved' && (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{dependent.relationship}</p>
                                            <div className="mt-3">
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${dependent.status === 'approved' ? 'bg-green-100 text-green-800' : dependent.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                    {dependent.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 dark:text-gray-400 py-6">No dependants found.</p>
                        )}
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}
