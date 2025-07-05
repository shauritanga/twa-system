import React, { useState } from 'react';
import SidebarLayout from '../../Layouts/SidebarLayout';
import { useForm } from '@inertiajs/react';
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { AiOutlineClose } from "react-icons/ai";
import Modal from '../../Components/Modal';
import InputLabel from '../../Components/InputLabel';
import TextInput from '../../Components/TextInput';
import PrimaryButton from '../../Components/PrimaryButton';
import SecondaryButton from '../../Components/SecondaryButton';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import InputError from '../../Components/InputError';

const MemberShow = ({ member, auth }) => {
    const { patch, data, setData, post, processing, errors, reset } = useForm({
        name: '',
        relationship: '',
        date_of_birth: '',
        tribe: '',
        residence: '',
        image: null,
    });
    const [selectedDependents, setSelectedDependents] = useState([]);
    const [showRejectionModal, setShowRejectionModal] = useState(false);
    const [showNoPendingModal, setShowNoPendingModal] = useState(false);
    const [showIndividualApproveModal, setShowIndividualApproveModal] = useState(false);
    const [showIndividualRejectModal, setShowIndividualRejectModal] = useState(false);
    const [showBulkApproveModal, setShowBulkApproveModal] = useState(false);
    const [showAddDependentForm, setShowAddDependentForm] = useState(false);
    const [currentDependentId, setCurrentDependentId] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [notification, setNotification] = useState('');

    const submitDependent = (e) => {
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
        formData.append('member_id', member.id);
        post(route('dependents.store'), {
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onSuccess: () => {
                reset();
                setShowAddDependentForm(false);
                toast.success('Dependent added successfully.', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            },
            onError: (errors) => {
                let errorMessage = 'An error occurred while adding the dependent. Please try again.';
                if (errors.name) {
                    errorMessage = errors.name;
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
    };

    const handleMemberVerification = (is_verified) => {
        patch(route('members.update', { member: member.id, is_verified }), {
            onSuccess: () => {
                toast.success(is_verified ? 'Member verified successfully.' : 'Member verification status updated.', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            },
            onError: () => {
                toast.error('An error occurred while updating member verification status. Please try again.', {
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
    };

    const handleDependentVerification = (dependentId, status, reason = '') => {
        const data = { status };
        if (status === 'rejected' && reason) {
            data.rejection_reason = reason;
        }
        patch(route('dependents.update', { dependent: dependentId, ...data }), {
            onSuccess: () => {
                toast.success(status === 'approved' ? 'Dependent approved successfully.' : 'Dependent rejected successfully.', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            },
            onError: () => {
                toast.error('An error occurred. Please try again.', {
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
    };

    const handleBulkVerification = (status) => {
        const pendingDependents = selectedDependents.filter(depId => {
            const dep = member.dependents.find(d => d.id === depId);
            return dep && dep.status !== 'approved' && dep.status !== 'rejected';
        });

        if (pendingDependents.length === 0) {
            setShowNoPendingModal(true);
            return;
        }

        if (status === 'rejected') {
            setShowRejectionModal(true);
        } else {
            setShowBulkApproveModal(true);
        }
    };

    const confirmBulkApprove = () => {
        const pendingDependents = selectedDependents.filter(depId => {
            const dep = member.dependents.find(d => d.id === depId);
            return dep && dep.status !== 'approved' && dep.status !== 'rejected';
        });
        pendingDependents.forEach(dependentId => {
            patch(route('dependents.update', { dependent: dependentId, status: 'approved' }), {
                onSuccess: () => {
                    toast.success(`${pendingDependents.length} dependents approved successfully.`, {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                },
                onError: () => {
                    toast.error('An error occurred during bulk approval. Please try again.', {
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
        });
        setSelectedDependents([]);
        setShowBulkApproveModal(false);
    };

    const handleRejectionSubmit = () => {
        const pendingDependents = selectedDependents.filter(depId => {
            const dep = member.dependents.find(d => d.id === depId);
            return dep && dep.status !== 'approved' && dep.status !== 'rejected';
        });

        if (rejectionReason.trim() === '') {
            return;
        }

        pendingDependents.forEach(dependentId => {
            patch(route('dependents.update', { dependent: dependentId, status: 'rejected', rejection_reason: rejectionReason }), {
                onSuccess: () => {
                    toast.success(`${pendingDependents.length} dependents rejected successfully.`, {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                },
                onError: () => {
                    toast.error('An error occurred during bulk rejection. Please try again.', {
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
        });
        setSelectedDependents([]);
        setShowRejectionModal(false);
        setRejectionReason('');
    };

    const handleIndividualApprove = (dependentId) => {
        setCurrentDependentId(dependentId);
        setShowIndividualApproveModal(true);
    };

    const handleIndividualReject = (dependentId) => {
        setCurrentDependentId(dependentId);
        setShowIndividualRejectModal(true);
        setRejectionReason('');
    };

    const confirmIndividualApprove = () => {
        handleDependentVerification(currentDependentId, 'approved');
        setShowIndividualApproveModal(false);
        setCurrentDependentId(null);
    };

    const confirmIndividualReject = () => {
        if (rejectionReason.trim() === '') {
            return;
        }
        handleDependentVerification(currentDependentId, 'rejected', rejectionReason);
        setShowIndividualRejectModal(false);
        setCurrentDependentId(null);
        setRejectionReason('');
    };

    const toggleDependentSelection = (dependentId) => {
        setSelectedDependents(prev => 
            prev.includes(dependentId) 
                ? prev.filter(id => id !== dependentId) 
                : [...prev, dependentId]
        );
    };

    const toggleSelectAll = () => {
        if (selectedDependents.length === member.dependents.length) {
            setSelectedDependents([]);
        } else {
            setSelectedDependents(member.dependents.map(dep => dep.id));
        }
    };

    const isAllVerified = member.dependents.length > 0 && member.dependents.every(dep => dep.status === 'approved');

    return (
        <SidebarLayout>
            <div className="mb-6 dark:text-white">
                <a href={route('admin.members.index')} className="text-blue-500 hover:text-blue-700 dark:text-blue-400">Members</a> / {member.name}
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-start">
                        {member.image_path ? (
                            <img 
                                src={`/storage/${member.image_path}`} 
                                alt={member.name} 
                                className="w-48 h-48 rounded-lg object-cover mr-6 border-2 border-gray-200 dark:border-gray-700"
                            />
                        ) : (
                            <div className="w-48 h-48 rounded-lg bg-gray-300 dark:bg-gray-600 flex items-center justify-center mr-6">
                                <span className="text-gray-600 dark:text-gray-400 text-5xl font-bold">{member.name.charAt(0)}</span>
                            </div>
                        )}
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold dark:text-white flex items-center">
                                {member.name}
                                {/* <span className="ml-2 flex items-center text-sm font-normal dark:text-white">
                                    {member.is_verified ? (
                                        <>
                                           <IoMdCheckmarkCircleOutline className='h-4 w-4 text-blue-500' /> 
                                            <span className='text-blue-500'>Verified</span>
                                        </>
                                    ) : (
                                        <>
                                            <AiOutlineClose className="h-4 w-4 text-red-500" />
                                            <span className='text-red-400'>Unverified</span>
                                        </>
                                    )}
                                </span> */}
                            </h1>
                            <div className="mt-2 space-y-2 dark:text-gray-100">
                                <p><strong>Email:</strong> {member.email}</p>
                                <p><strong>Phone Number:</strong> {member.phone_number}</p>
                                <p><strong>Address:</strong> {member.address}</p>
                                <p><strong>Date of Birth:</strong> {member.date_of_birth}</p>
                                <p><strong>Status:</strong> {member.is_verified ? <><IoMdCheckmarkCircleOutline className='h-4 w-4 text-blue-500 inline-block' /><span className='text-blue-500'>Verified</span></> : <>
                                            <AiOutlineClose className="h-4 w-4 text-red-500 inline-block" />
                                            <span className='text-red-400'>Unverified</span>
                                        </>}</p>
                            </div>
                        </div>
                    </div>
                    <div className="self-start">
                        {console.log("User Role:", auth.user.role)}
                        <button
                            onClick={() => setShowAddDependentForm(!showAddDependentForm)}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                        >
                            <PlusCircleIcon className="h-5 w-5 mr-2" />
                            {showAddDependentForm ? 'Cancel' : 'Add Dependent'}
                        </button>
                    </div>
                </div>
                {auth.user.role && auth.user.role.name === 'admin' && (
                    <div className="mt-6">
                        <h2 className="text-xl font-semibold mb-3 dark:text-white">Verification</h2>
                        <div className="dark:text-gray-100 mb-3">
                            <p>Review the member's dependents to verify their account. The status is determined by dependent approvals.</p>
                        </div>
                    </div>
                )}
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 dark:text-white">Dependents</h2>
                {member.dependents.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    {auth.user.role && auth.user.role.name === 'admin' && (
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            <input 
                                                type="checkbox" 
                                                checked={selectedDependents.length === member.dependents.length} 
                                                onChange={toggleSelectAll}
                                                className="rounded"
                                            />
                                        </th>
                                    )}
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Image</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Relationship</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date of Birth</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tribe</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Residence</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                    {auth.user.role && auth.user.role.name === 'admin' && (
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {member.dependents.map(dependent => (
                                    <tr key={dependent.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        {auth.user.role && auth.user.role.name === 'admin' && (
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <input 
                                                    type="checkbox" 
                                                    checked={selectedDependents.includes(dependent.id)} 
                                                    onChange={() => toggleDependentSelection(dependent.id)}
                                                    className="rounded"
                                                />
                                            </td>
                                        )}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {dependent.image_path ? (
                                                <img 
                                                    src={`/storage/${dependent.image_path}`} 
                                                    alt={dependent.name} 
                                                    className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                                                    <span className="text-gray-600 dark:text-gray-400 font-bold">{dependent.name.charAt(0)}</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{dependent.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{dependent.relationship}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{dependent.date_of_birth}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{dependent.tribe || '-'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{dependent.residence || '-'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${dependent.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : dependent.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'}`}>
                                                {dependent.status}
                                            </span>
                                        </td>
                                        {auth.user.role && auth.user.role.name === 'admin' && (
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 flex space-x-2">
                                                {dependent.status !== 'approved' && dependent.status !== 'rejected' && (
                                                    <>
                                                        <button 
                                                            onClick={() => handleIndividualApprove(dependent.id)}
                                                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button 
                                                            onClick={() => handleIndividualReject(dependent.id)}
                                                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                )}
                                                {dependent.status === 'approved' && (
                                                    <span className="text-gray-500 dark:text-gray-400">Already Approved</span>
                                                )}
                                                {dependent.status === 'rejected' && (
                                                    <span className="text-gray-500 dark:text-gray-400">Already Rejected</span>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {auth.user.role && auth.user.role.name === 'admin' && selectedDependents.length > 0 && (
                            <div className="mt-4 flex space-x-3">
                                <button 
                                    onClick={() => handleBulkVerification('approved')}
                                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                                >
                                    Approve Selected ({selectedDependents.filter(depId => {
                                        const dep = member.dependents.find(d => d.id === depId);
                                        return dep && dep.status !== 'approved' && dep.status !== 'rejected';
                                    }).length})
                                </button>
                                <button 
                                    onClick={() => handleBulkVerification('rejected')}
                                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                                >
                                    Reject Selected ({selectedDependents.filter(depId => {
                                        const dep = member.dependents.find(d => d.id === depId);
                                        return dep && dep.status !== 'approved' && dep.status !== 'rejected';
                                    }).length})
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <p className="dark:text-gray-400">No dependents found for this member.</p>
                )}
            </div>

            {auth.user.role && auth.user.role.name === 'admin' && showAddDependentForm && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Add New Dependent</h2>
                                    <button onClick={() => setShowAddDependentForm(false)} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Please provide the details of the dependent you wish to add. All fields are optional except for the name.</p>
                                <form onSubmit={submitDependent}>
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <InputLabel htmlFor="name" value="Dependent's Full Name *" className="text-gray-900 dark:text-gray-100 font-medium" />
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
                                                <InputLabel htmlFor="relationship" value="Relationship to Member" className="text-gray-900 dark:text-gray-100 font-medium" />
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
                                                <InputLabel htmlFor="date_of_birth" value="Date of Birth (Dependent)" className="text-gray-900 dark:text-gray-100 font-medium" />
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
                                        <SecondaryButton type="button" onClick={() => setShowAddDependentForm(false)} className="mr-3">Cancel</SecondaryButton>
                                        <PrimaryButton disabled={processing}>Add Dependent</PrimaryButton>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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

            {/* Bulk Rejection Reason Modal */}
            <Modal show={showRejectionModal} onClose={() => setShowRejectionModal(false)}>
                <div className="p-6 bg-white dark:bg-gray-800">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Reason for Rejection</h2>
                    <div className="mb-4">
                        <InputLabel htmlFor="rejection_reason" value="Rejection Reason" className="text-gray-700 dark:text-gray-300" />
                        <TextInput
                            id="rejection_reason"
                            type="text"
                            className="mt-1 block w-full text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex justify-end space-x-3">
                        <SecondaryButton onClick={() => setShowRejectionModal(false)}>Cancel</SecondaryButton>
                        <PrimaryButton onClick={handleRejectionSubmit} disabled={!rejectionReason.trim()}>Submit</PrimaryButton>
                    </div>
                </div>
            </Modal>

            {/* No Pending Dependents Modal */}
            <Modal show={showNoPendingModal} onClose={() => setShowNoPendingModal(false)}>
                <div className="p-6 bg-white dark:bg-gray-800">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">No Pending Dependents</h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">No pending dependents selected for this action. Already approved or rejected dependents cannot be modified.</p>
                    <div className="flex justify-end">
                        <PrimaryButton onClick={() => setShowNoPendingModal(false)}>OK</PrimaryButton>
                    </div>
                </div>
            </Modal>

            {/* Individual Approve Confirmation Modal */}
            <Modal show={showIndividualApproveModal} onClose={() => setShowIndividualApproveModal(false)}>
                <div className="p-6 bg-white dark:bg-gray-800">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Confirm Approval</h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">Are you sure you want to approve this dependent?</p>
                    <div className="flex justify-end space-x-3">
                        <SecondaryButton onClick={() => setShowIndividualApproveModal(false)}>Cancel</SecondaryButton>
                        <PrimaryButton onClick={confirmIndividualApprove}>Confirm</PrimaryButton>
                    </div>
                </div>
            </Modal>

            {/* Individual Reject Reason Modal */}
            <Modal show={showIndividualRejectModal} onClose={() => setShowIndividualRejectModal(false)}>
                <div className="p-6 bg-white dark:bg-gray-800">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Reason for Rejection</h2>
                    <div className="mb-4">
                        <InputLabel htmlFor="individual_rejection_reason" value="Rejection Reason" className="text-gray-700 dark:text-gray-300" />
                        <TextInput
                            id="individual_rejection_reason"
                            type="text"
                            className="mt-1 block w-full text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex justify-end space-x-3">
                        <SecondaryButton onClick={() => setShowIndividualRejectModal(false)}>Cancel</SecondaryButton>
                        <PrimaryButton onClick={confirmIndividualReject} disabled={!rejectionReason.trim()}>Submit</PrimaryButton>
                    </div>
                </div>
            </Modal>

            {/* Bulk Approve Confirmation Modal */}
            <Modal show={showBulkApproveModal} onClose={() => setShowBulkApproveModal(false)}>
                <div className="p-6 bg-white dark:bg-gray-800">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Confirm Bulk Approval</h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">Are you sure you want to approve {selectedDependents.filter(depId => { const dep = member.dependents.find(d => d.id === depId); return dep && dep.status !== 'approved' && dep.status !== 'rejected'; }).length} selected dependents?</p>
                    <div className="flex justify-end space-x-3">
                        <SecondaryButton onClick={() => setShowBulkApproveModal(false)}>Cancel</SecondaryButton>
                        <PrimaryButton onClick={confirmBulkApprove}>Confirm</PrimaryButton>
                    </div>
                </div>
            </Modal>
        </SidebarLayout>
    );
};

export default MemberShow;
