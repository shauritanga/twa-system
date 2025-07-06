import React, { useState } from 'react';
import SidebarLayout from '../../Layouts/SidebarLayout';
import { useForm, usePage } from '@inertiajs/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MemberRow = ({ member, onEdit, onDelete, auth }) => {
    return (
        <tr key={member.id} className="bg-white dark:bg-gray-800">
            <td className="px-6 py-4 whitespace-nowrap">
                {member.image_path ? (
                    <img 
                        src={`/storage/${member.image_path}`} 
                        alt={member.name} 
                        className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                    />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                        <span className="text-gray-600 dark:text-gray-400 font-bold">{member.name.charAt(0)}</span>
                    </div>
                )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{member.name}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{member.email}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{member.phone_number}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{member.address}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{member.date_of_birth}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {member.is_verified ? 'Verified' : 'Unverified'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <a href={auth.user && auth.user.role && auth.user.role.name === 'admin' ? route('admin.members.show', member.id) : route('members.show', member.id)} className="text-blue-600 hover:text-blue-900">View</a>
                <button onClick={() => onEdit(member)} className="text-indigo-600 hover:text-indigo-900 ml-4">Edit</button>
                <button onClick={() => onDelete(member)} className="text-red-600 hover:text-red-900 ml-4">Delete</button>
            </td>
        </tr>
    );
};

const MemberForm = ({ model, closeModal, member }) => {
    const { data, setData, post, put, processing, errors } = useForm({
        name: member ? member.name : '',
        email: member ? member.email : '',
        phone_number: member ? member.phone_number : '',
        address: member ? member.address : '',
        date_of_birth: member ? member.date_of_birth : '',
        tribe: member ? member.tribe : '',
        occupation: member ? member.occupation : '',
        reason_for_membership: member ? member.reason_for_membership : '',
        applicant_date: member ? member.applicant_date : '',
        declaration_name: member ? member.declaration_name : '',
        witness_name: member ? member.witness_name : '',
        witness_date: member ? member.witness_date : '',
        image: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('phone_number', data.phone_number);
        formData.append('address', data.address);
        formData.append('date_of_birth', data.date_of_birth);
        formData.append('tribe', data.tribe);
        formData.append('occupation', data.occupation);
        formData.append('reason_for_membership', data.reason_for_membership);
        formData.append('applicant_date', data.applicant_date);
        formData.append('declaration_name', data.declaration_name);
        formData.append('witness_name', data.witness_name);
        formData.append('witness_date', data.witness_date);
        if (data.image) {
            formData.append('image', data.image);
        }
        // Debug FormData contents
        console.log('FormData contents before submission:');
        for (const [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }
        
        if (member) {
            put(route('members.update', member.id), {
                data: formData,
                onSuccess: () => {
                    toast.success('Member updated successfully.', {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    closeModal();
                },
                onError: (errors) => {
                    let errorMessage = 'An error occurred while updating the member. Please try again.';
                    if (errors.email && errors.email.includes('unique')) {
                        errorMessage = 'A member with this email already exists. Please use a different email.';
                    }
                    toast.error(errorMessage, {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }
            });
        } else {
            post(route('members.store'), {
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onSuccess: () => {
                    toast.success('Member created successfully.', {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    closeModal();
                },
                onError: (errors) => {
                    let errorMessage = 'An error occurred while creating the member. Please try again.';
                    if (errors.email && errors.email.includes('unique')) {
                        errorMessage = 'A member with this email already exists. Please use a different email.';
                    }
                    toast.error(errorMessage, {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }
            });
        }
    };

    return (
        <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
                    <form onSubmit={handleSubmit}>
                        <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4 max-h-[80vh] overflow-y-auto">
                            <h3 className="text-xl leading-6 font-semibold text-gray-900 dark:text-white mb-4">{member ? 'Edit Member' : 'Add Member'}</h3>
                            <div className="mt-4 space-y-6">
                                <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
                                    <h4 className="text-lg font-medium text-gray-700 dark:text-gray-300">Personal Information</h4>
                                </div>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                                        <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white" />
                                        {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                                        <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white" />
                                        {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                                        <input type="text" value={data.phone_number} onChange={e => setData('phone_number', e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white" />
                                        {errors.phone_number && <div className="text-red-500 text-sm mt-1">{errors.phone_number}</div>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date of Birth</label>
                                        <input type="date" value={data.date_of_birth} onChange={e => setData('date_of_birth', e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white" />
                                        {errors.date_of_birth && <div className="text-red-500 text-sm mt-1">{errors.date_of_birth}</div>}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                                    <input type="text" value={data.address} onChange={e => setData('address', e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white" />
                                    {errors.address && <div className="text-red-500 text-sm mt-1">{errors.address}</div>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Profile Image</label>
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={e => setData('image', e.target.files[0])} 
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white" 
                                    />
                                    {errors.image && <div className="text-red-500 text-sm mt-1">{errors.image}</div>}
                                </div>
                                
                                <div className="border-b border-gray-200 dark:border-gray-700 pb-2 mt-6">
                                    <h4 className="text-lg font-medium text-gray-700 dark:text-gray-300">Additional Information</h4>
                                </div>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tribe</label>
                                        <input type="text" value={data.tribe} onChange={e => setData('tribe', e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white" />
                                        {errors.tribe && <div className="text-red-500 text-sm mt-1">{errors.tribe}</div>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Occupation</label>
                                        <input type="text" value={data.occupation} onChange={e => setData('occupation', e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white" />
                                        {errors.occupation && <div className="text-red-500 text-sm mt-1">{errors.occupation}</div>}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reason for Membership</label>
                                    <textarea value={data.reason_for_membership} onChange={e => setData('reason_for_membership', e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white" rows="3" />
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Briefly explain why you wish to join this group.</p>
                                    {errors.reason_for_membership && <div className="text-red-500 text-sm mt-1">{errors.reason_for_membership}</div>}
                                </div>
                                
                                <div className="border-b border-gray-200 dark:border-gray-700 pb-2 mt-6">
                                    <h4 className="text-lg font-medium text-gray-700 dark:text-gray-300">Declaration & Witness</h4>
                                </div>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Applicant Date</label>
                                        <input type="date" value={data.applicant_date} onChange={e => setData('applicant_date', e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white" />
                                        {errors.applicant_date && <div className="text-red-500 text-sm mt-1">{errors.applicant_date}</div>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Declaration Name</label>
                                        <input type="text" value={data.declaration_name} onChange={e => setData('declaration_name', e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white" />
                                        {errors.declaration_name && <div className="text-red-500 text-sm mt-1">{errors.declaration_name}</div>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Witness Name</label>
                                        <input type="text" value={data.witness_name} onChange={e => setData('witness_name', e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white" />
                                        {errors.witness_name && <div className="text-red-500 text-sm mt-1">{errors.witness_name}</div>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Witness Date</label>
                                        <input type="date" value={data.witness_date} onChange={e => setData('witness_date', e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white" />
                                        {errors.witness_date && <div className="text-red-500 text-sm mt-1">{errors.witness_date}</div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button type="submit" disabled={processing} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                                {processing ? (
                                    <svg className="animate-spin h-5 w-5 text-white mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    <>{member ? 'Update' : 'Create'}</>
                                )}
                            </button>
            <button type="button" onClick={closeModal} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                Cancel
            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default function MembersIndex({ members }) {
    const { auth } = usePage().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState(null);
    const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setEditingMember(null);
    };

    const handleEdit = (member) => {
        setEditingMember(member);
        openModal();
    };

    const { delete: destroy } = useForm();

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingMember, setDeletingMember] = useState(null);

    const openDeleteModal = (member) => {
        setDeletingMember(member);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setDeletingMember(null);
        setIsDeleteModalOpen(false);
        setDeleteConfirmation('');
    };

    const [deleteConfirmation, setDeleteConfirmation] = useState('');

    const handleDelete = () => {
        if (deletingMember && deleteConfirmation === deletingMember.name) {
            destroy(route('members.destroy', deletingMember.id), {
                onSuccess: () => {
                    toast.success('Member deleted successfully.', {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    closeDeleteModal();
                },
                onError: (errors) => {
                    let errorMessage = 'An error occurred while updating the member. Please try again.';
                    if (errors.email && errors.email.includes('unique')) {
                        errorMessage = 'A member with this email already exists. Please use a different email.';
                    }
                    toast.error(errorMessage, {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }
            });
        }
    };

    return (
        <SidebarLayout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Members</h1>
                <div className="flex items-center">
                    <div className="relative inline-block text-left">
                        <div>
                            <button onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)} type="button" className="inline-flex justify-center w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" id="options-menu" aria-haspopup="true" aria-expanded="true">
                                Export
                                <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                        {isExportDropdownOpen && (
                            <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5">
                                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                <a href={route('members.export', { format: 'pdf' })} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600" role="menuitem">PDF</a>
                                <a href={route('members.export', { format: 'xlsx' })} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600" role="menuitem">Excel</a>
                                <a href={route('members.export', { format: 'csv' })} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600" role="menuitem">CSV</a>
                                </div>
                            </div>
                        )}
                    </div>
                    <button onClick={openModal} className="bg-indigo-600 text-white px-4 py-2 rounded-md ml-4">Add Member</button>
                </div>
            </div>
            <div className="flex flex-col">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                        <div className="shadow overflow-hidden border-b border-gray-200 dark:border-gray-700 sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-800">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Image</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Phone Number</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Address</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date of Birth</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                        <th scope="col" className="relative px-6 py-3">
                                            <span className="sr-only">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {members.map(member => (
                                        <MemberRow key={member.id} member={member} onEdit={handleEdit} onDelete={() => openDeleteModal(member)} auth={auth} />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            {/* Toast Container for Notifications */}
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            {isModalOpen && <MemberForm model={isModalOpen} closeModal={closeModal} member={editingMember} />}
            {isDeleteModalOpen && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Delete Member</h3>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Are you sure you want to delete this member? This action will also delete all related data, including contributions, debts, penalties, dependents, and certificates. This action cannot be undone.</p>
                                    <input type="text" value={deleteConfirmation} onChange={e => setDeleteConfirmation(e.target.value)} placeholder={`Type "${deletingMember.name}" to confirm`} className="w-full mt-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white" />
                                </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button onClick={handleDelete} disabled={deleteConfirmation !== deletingMember.name} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50">
                                    Delete
                                </button>
                                <button onClick={closeDeleteModal} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </SidebarLayout>
    );
}
