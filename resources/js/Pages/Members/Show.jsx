import React, { useState, useEffect } from 'react';
import SidebarLayout from '../../Layouts/SidebarLayout';
import { useForm, router, usePage } from '@inertiajs/react';
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
    const { props } = usePage();

    // Track previous dependent count to detect successful additions
    const [previousDependentCount, setPreviousDependentCount] = useState(member.dependents.length);

    useEffect(() => {
        if (props.toast) {
            if (props.toast.type === 'success') {
                toast.success(props.toast.message, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } else if (props.toast.type === 'error') {
                toast.error(props.toast.message, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        }
    }, [props.toast]);

    // Detect when dependents are added (successful save) and close modal if it's open
    useEffect(() => {
        if (member.dependents.length > previousDependentCount && isSubmitting) {
            // A new dependent was added successfully
            setIsSubmitting(false);
            reset();
            setImagePreview(null);
            setShowAddDependentForm(false);
            toast.success('Dependent added successfully!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
        setPreviousDependentCount(member.dependents.length);
    }, [member.dependents.length]);
    const { patch, data, setData, post, errors, reset } = useForm({
        name: '',
        relationship: '',
        date_of_birth: '',
        tribe: '',
        residence: '',
        image: null,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
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
    const [imagePreview, setImagePreview] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image', file);
            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setData('image', null);
        setImagePreview(null);
        // Reset the file input
        const fileInput = document.getElementById('image');
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const submitDependent = (e) => {
        e.preventDefault();

        // Validate required fields
        if (!data.name || !data.relationship) {
            toast.error('Please fill in all required fields (Name and Relationship).', {
                position: "top-right",
                autoClose: 5000,
            });
            return;
        }

        // Use FormData for file uploads
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('relationship', data.relationship);
        formData.append('date_of_birth', data.date_of_birth);
        formData.append('tribe', data.tribe);
        formData.append('residence', data.residence);
        formData.append('member_id', member.id.toString());
        if (data.image) {
            formData.append('image', data.image);
        }

        setIsSubmitting(true); // Set submission state to true

        // Track if the request has been handled to prevent race conditions
        let requestHandled = false;

        // Set a more reasonable timeout for file uploads and network delays
        const timeoutId = setTimeout(() => {
            if (!requestHandled) {
                requestHandled = true;
                setIsSubmitting(false);

                // Don't close modal immediately on timeout - let user see what happened
                toast.error('Request is taking longer than expected. The data may have been saved. Please refresh the page to check.', {
                    position: "top-right",
                    autoClose: 8000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

                // Auto-refresh after a short delay to check if data was saved
                setTimeout(() => {
                    if (!requestHandled) {
                        router.reload({ only: ['member'] });
                    }
                }, 2000);
            }
        }, 20000); // Increased timeout to 20 seconds for file uploads

        post(route('dependents.store'), formData, {
            onSuccess: () => {
                if (!requestHandled) {
                    requestHandled = true;
                    clearTimeout(timeoutId);
                    setIsSubmitting(false);
                    reset();
                    setImagePreview(null);
                    setShowAddDependentForm(false);
                    toast.success('Dependent added successfully!', {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    router.reload(); // Refresh data to show the new dependent
                }
            },
            onError: (errors, response) => {
                if (!requestHandled) {
                    requestHandled = true;
                    clearTimeout(timeoutId);
                    setIsSubmitting(false);

                    let errorMessage = 'An error occurred while adding the dependent. Please try again.';
                    let shouldCloseModal = true;

                    // Check for specific error status or messages
                    if (response && response.status === 422 && errors && errors.name) {
                        errorMessage = errors.name;
                        shouldCloseModal = false; // Keep modal open for validation errors
                    } else if (response && response.status === 403) {
                        errorMessage = 'You are not authorized to perform this action.';
                    }

                    if (shouldCloseModal) {
                        setShowAddDependentForm(false);
                    }

                    toast.error(errorMessage, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    console.error('Submission error:', errors, response);
                }
            },
            onFinish: () => {
                // Final cleanup
                if (!requestHandled) {
                    requestHandled = true;
                    clearTimeout(timeoutId);
                    setIsSubmitting(false);
                }
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
                // Refresh the page to show updated dependent status
                router.reload();
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
                    {auth.user.role && auth.user.role.name === 'admin' && (
                        <div className="self-start">
                            <button
                                onClick={() => setShowAddDependentForm(!showAddDependentForm)}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                            >
                                <PlusCircleIcon className="h-5 w-5 mr-2" />
                                {showAddDependentForm ? 'Cancel' : 'Add Dependant'}
                            </button>
                        </div>
                    )}
                </div>
                {auth.user.role && auth.user.role.name === 'admin' && (
                    <div className="mt-6">
                        <h2 className="text-xl font-semibold mb-3 dark:text-white">Verification</h2>
                        <div className="dark:text-gray-100 mb-3">
                            <p>Review the member's dependants to verify their account. The status is determined by dependant approvals.</p>
                        </div>
                    </div>
                )}
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 dark:text-white">Dependants</h2>
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
                    <p className="dark:text-gray-400">No dependants found for this member.</p>
                )}
            </div>

            {auth.user.role && auth.user.role.name === 'admin' && (
                <Modal show={showAddDependentForm} onClose={() => setShowAddDependentForm(false)} closeable={false}>
                    <div className="flex flex-col bg-white dark:bg-gray-800 rounded-xl text-left overflow-hidden shadow-2xl transform transition-all w-full max-w-2xl border border-gray-200 dark:border-gray-700 max-h-[90vh]">
                        {/* Fixed Header */}
                        <div className="flex-shrink-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-3">
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                            <PlusCircleIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                        </div>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Dependant</h2>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Complete the form below to register a new dependant</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowAddDependentForm(false)}
                                    className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors duration-200 p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-800 px-6 py-6">
                            <form onSubmit={submitDependent} className="space-y-8">
                                {/* Personal Information Section */}
                                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Personal Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <InputLabel htmlFor="name" value="Dependent's Full Name" className="text-gray-900 dark:text-gray-100 font-medium flex items-center">
                                                <span className="text-red-500 mr-1">*</span>
                                                Full Name
                                            </InputLabel>
                                            <TextInput
                                                id="name"
                                                name="name"
                                                value={data.name}
                                                placeholder="Enter full name (e.g., John Doe)"
                                                className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-400 dark:focus:ring-blue-400"
                                                onChange={(e) => setData('name', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.name} className="mt-2" />
                                        </div>
                                        <div className="space-y-2">
                                            <InputLabel htmlFor="relationship" value="Relationship to Member" className="text-gray-900 dark:text-gray-100 font-medium flex items-center">
                                                <svg className="w-4 h-4 mr-1 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                                Relationship
                                            </InputLabel>
                                            <select
                                                id="relationship"
                                                name="relationship"
                                                value={data.relationship}
                                                onChange={(e) => setData('relationship', e.target.value)}
                                                className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-400 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                            >
                                                <option value="">Select relationship...</option>
                                                <option value="Husband">Husband</option>
                                                <option value="Wife">Wife</option>
                                                <option value="Father">Father</option>
                                                <option value="Mother">Mother</option>
                                                <option value="Son">Son</option>
                                                <option value="Daughter">Daughter</option>
                                                <option value="Father in Law">Father in Law</option>
                                                <option value="Mother in Law">Mother in Law</option>
                                            </select>
                                            <InputError message={errors.relationship} className="mt-2" />
                                        </div>
                                    </div>
                                </div>

                                {/* Additional Details Section */}
                                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Additional Details
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <InputLabel htmlFor="date_of_birth" value="Date of Birth" className="text-gray-900 dark:text-gray-100 font-medium flex items-center">
                                                <svg className="w-4 h-4 mr-1 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                Date of Birth
                                            </InputLabel>
                                            <TextInput
                                                id="date_of_birth"
                                                name="date_of_birth"
                                                type="date"
                                                value={data.date_of_birth || ''}
                                                className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:border-green-500 focus:ring-green-500 dark:focus:border-green-400 dark:focus:ring-green-400"
                                                onChange={(e) => setData('date_of_birth', e.target.value)}
                                            />
                                            <InputError message={errors.date_of_birth} className="mt-2" />
                                        </div>
                                        <div className="space-y-2">
                                            <InputLabel htmlFor="tribe" value="Tribal Affiliation" className="text-gray-900 dark:text-gray-100 font-medium flex items-center">
                                                <svg className="w-4 h-4 mr-1 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                Tribe
                                            </InputLabel>
                                            <TextInput
                                                id="tribe"
                                                name="tribe"
                                                value={data.tribe || ''}
                                                placeholder="Enter tribal affiliation (e.g., Fipa, Nyakyusa)"
                                                className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:border-green-500 focus:ring-green-500 dark:focus:border-green-400 dark:focus:ring-green-400"
                                                onChange={(e) => setData('tribe', e.target.value)}
                                            />
                                            <InputError message={errors.tribe} className="mt-2" />
                                        </div>
                                    </div>
                                    <div className="space-y-6 mt-6">
                                        <div className="space-y-2">
                                            <InputLabel htmlFor="residence" value="Current Residence" className="text-gray-900 dark:text-gray-100 font-medium flex items-center">
                                                <svg className="w-4 h-4 mr-1 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                                </svg>
                                                Residence
                                            </InputLabel>
                                            <TextInput
                                                id="residence"
                                                name="residence"
                                                value={data.residence || ''}
                                                placeholder="Enter current address (e.g., Skuli Street, Mbezi Beach)"
                                                className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:border-green-500 focus:ring-green-500 dark:focus:border-green-400 dark:focus:ring-green-400"
                                                onChange={(e) => setData('residence', e.target.value)}
                                            />
                                            <InputError message={errors.residence} className="mt-2" />
                                        </div>
                                        <div className="space-y-2">
                                            <InputLabel htmlFor="image" value="Profile Image" className="text-gray-900 dark:text-gray-100 font-medium flex items-center">
                                                <svg className="w-4 h-4 mr-1 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                Profile Image
                                            </InputLabel>

                                            {imagePreview ? (
                                                <div className="mt-1 relative">
                                                    <div className="relative inline-block">
                                                        <img
                                                            src={imagePreview}
                                                            alt="Preview"
                                                            className="h-32 w-32 object-cover rounded-lg border-2 border-gray-300 dark:border-gray-600"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={removeImage}
                                                            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition-colors duration-200"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                                        {data.image?.name} - Click the × to remove
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg hover:border-gray-400 dark:hover:border-gray-500 transition-colors duration-200">
                                                    <div className="space-y-1 text-center">
                                                        <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                        <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                                            <label htmlFor="image" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                                                <span>Upload a file</span>
                                                                <input
                                                                    id="image"
                                                                    name="image"
                                                                    type="file"
                                                                    accept="image/*"
                                                                    className="sr-only"
                                                                    onChange={handleImageChange}
                                                                />
                                                            </label>
                                                            <p className="pl-1">or drag and drop</p>
                                                        </div>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF up to 10MB</p>
                                                    </div>
                                                </div>
                                            )}
                                            <InputError message={errors.image} className="mt-2" />
                                        </div>
                                    </div>
                                </div>

                                {/* Form Actions */}
                                <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
                                    <SecondaryButton
                                        type="button"
                                        onClick={() => setShowAddDependentForm(false)}
                                        className="px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                                    >
                                        Cancel
                                    </SecondaryButton>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Submitting...
                                            </>
                                        ) : (
                                            <>
                                                <PlusCircleIcon className="w-4 h-4 mr-2" />
                                                Submit
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </Modal>
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
