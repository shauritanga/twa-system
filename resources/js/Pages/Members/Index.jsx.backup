import React, { useState, useEffect } from 'react';
import SidebarLayout from '../../Layouts/SidebarLayout';
import { useForm, usePage, router, Link } from '@inertiajs/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MemberCard = ({ member, onEdit, onDelete }) => {
    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        {member.image_path ? (
                            <img
                                className="h-16 w-16 rounded-full border-4 border-white shadow-lg object-cover"
                                src={`/storage/${member.image_path}`}
                                alt={member.name}
                            />
                        ) : (
                            <div className="h-16 w-16 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                                <span className="text-white font-bold text-lg">{getInitials(member.name)}</span>
                            </div>
                        )}
                    </div>
                    <div className="ml-4 flex-1">
                        <h3 className="text-xl font-bold text-white">{member.name}</h3>
                        <div className="flex items-center mt-1">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${member.is_verified
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                <svg className={`w-3 h-3 mr-1 ${member.is_verified ? 'text-green-500' : 'text-yellow-500'
                                    }`} fill="currentColor" viewBox="0 0 20 20">
                                    {member.is_verified ? (
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    ) : (
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    )}
                                </svg>
                                {member.is_verified ? 'Verified' : 'Pending'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Card Body */}
            <div className="px-6 py-4 space-y-4">
                <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                        <span className="truncate">{member.email}</span>
                    </div>

                    {member.phone_number && (
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span>{member.phone_number}</span>
                        </div>
                    )}

                    {member.address && (
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="truncate">{member.address}</span>
                        </div>
                    )}

                    {member.date_of_birth && (
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{new Date(member.date_of_birth).toLocaleDateString()}</span>
                        </div>
                    )}
                </div>

                {/* Additional Info */}
                {(member.occupation || member.tribe) && (
                    <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
                        <div className="grid grid-cols-1 gap-2">
                            {member.occupation && (
                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                    <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                                    </svg>
                                    <span className="truncate">{member.occupation}</span>
                                </div>
                            )}
                            {member.tribe && (
                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                    <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <span className="truncate">{member.tribe}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Card Footer */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                        Member since {new Date(member.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => onEdit(member)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                        >
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                        </button>
                        <button
                            onClick={() => onDelete(member)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                        >
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MemberRow = ({ member, onEdit, onDelete, auth }) => {
    return (
        <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 border-b border-gray-100 dark:border-gray-700">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    {member.image_path ? (
                        <img
                            src={`/storage/${member.image_path}`}
                            alt={member.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600 shadow-sm"
                        />
                    ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-sm">
                            <span className="text-white font-bold text-lg">{member.name.charAt(0).toUpperCase()}</span>
                        </div>
                    )}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">{member.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Member ID: #{member.id}</div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                    <span className="text-sm text-gray-600 dark:text-gray-300">{member.email}</span>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-sm text-gray-600 dark:text-gray-300">{member.phone_number}</span>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-32" title={member.address}>{member.address}</span>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm text-gray-600 dark:text-gray-300">{member.date_of_birth}</span>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                {member.is_verified ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Verified
                    </span>
                ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Pending
                    </span>
                )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end space-x-2">
                    <a
                        href={auth.user && auth.user.role && auth.user.role.name === 'admin' ? route('admin.members.show', member.id) : route('members.show', member.id)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800 transition-colors duration-200"
                        title="View Details"
                    >
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View
                    </a>
                    <button
                        onClick={() => onEdit(member)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900 dark:text-indigo-200 dark:hover:bg-indigo-800 transition-colors duration-200"
                        title="Edit Member"
                    >
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                    </button>
                    <button
                        onClick={() => onDelete(member)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800 transition-colors duration-200"
                        title="Delete Member"
                    >
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                    </button>
                </div>
            </td>
        </tr>
    );
};

const MemberForm = ({ closeModal, member }) => {
    const { data, setData, processing, errors, setError, clearErrors } = useForm({
        first_name: member ? member.first_name : '',
        middle_name: member ? member.middle_name : '',
        surname: member ? member.surname : '',
        name: member ? member.name : '', // Keep for backward compatibility
        email: member ? member.email : '',
        phone_number: member ? member.phone_number : '',
        address: member ? member.address : '',
        place_of_birth: member ? member.place_of_birth : '',
        sex: member ? member.sex : '',
        date_of_birth: member ? member.date_of_birth : '',
        tribe: member ? member.tribe : '',
        occupation: member ? member.occupation : '',
        reason_for_membership: member ? member.reason_for_membership : '',
        applicant_date: member ? member.applicant_date : '',
        declaration_name: member ? member.declaration_name : '',
        witness_name: member ? member.witness_name : '',
        witness_date: member ? member.witness_date : '',
        image: null,
        application_form: null,
    });

    // State for image previews
    const [imagePreview, setImagePreview] = useState(member?.image_path ? `/storage/${member.image_path}` : null);
    const [applicationFormPreview, setApplicationFormPreview] = useState(null);

    // Manual loading state for form submission
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Reset form data when member prop changes (switching between create/edit modes)
    useEffect(() => {
        // For backward compatibility, if new name fields don't exist, try to parse from full name
        let firstName = '';
        let middleName = '';
        let surname = '';

        if (member) {
            if (member.first_name || member.middle_name || member.surname) {
                // New fields exist
                firstName = member.first_name || '';
                middleName = member.middle_name || '';
                surname = member.surname || '';
            } else if (member.name) {
                // Parse from full name for backward compatibility
                const nameParts = member.name.trim().split(' ');
                if (nameParts.length >= 2) {
                    firstName = nameParts[0];
                    surname = nameParts[nameParts.length - 1];
                    if (nameParts.length > 2) {
                        middleName = nameParts.slice(1, -1).join(' ');
                    }
                } else if (nameParts.length === 1) {
                    firstName = nameParts[0];
                }
            }
        }

        setData({
            first_name: firstName,
            middle_name: middleName,
            surname: surname,
            name: member ? member.name || '' : '',
            email: member ? member.email || '' : '',
            phone_number: member ? member.phone_number || '' : '',
            address: member ? member.address || '' : '',
            place_of_birth: member ? member.place_of_birth || '' : '',
            sex: member ? member.sex || '' : '',
            date_of_birth: member ? member.date_of_birth || '' : '',
            tribe: member ? member.tribe || '' : '',
            occupation: member ? member.occupation || '' : '',
            reason_for_membership: member ? member.reason_for_membership || '' : '',
            applicant_date: member ? member.applicant_date || '' : '',
            declaration_name: member ? member.declaration_name || '' : '',
            witness_name: member ? member.witness_name || '' : '',
            witness_date: member ? member.witness_date || '' : '',
            image: null,
            application_form: null,
        });

        // Reset image preview
        if (member?.image_path) {
            setImagePreview(`/storage/${member.image_path}`);
        } else {
            setImagePreview(null);
        }

        // Reset application form preview
        setApplicationFormPreview(null);

        // Clear any existing errors when switching between create/edit modes
        clearErrors();
    }, [member]);

    // Handle image file selection with preview
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle application form file selection with preview
    const handleApplicationFormChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('application_form', file);
            // For documents, just show file info instead of preview
            setApplicationFormPreview({
                name: file.name,
                size: (file.size / 1024 / 1024).toFixed(2), // Size in MB
                type: file.type
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Show immediate feedback to user
        toast.info(member ? 'Updating member...' : 'Creating member...', {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });

        const formData = new FormData();

        // New name fields
        formData.append('first_name', data.first_name);
        formData.append('middle_name', data.middle_name);
        formData.append('surname', data.surname);

        // Construct full name for backward compatibility
        const fullName = [data.first_name, data.middle_name, data.surname].filter(Boolean).join(' ');
        formData.append('name', fullName);

        // Contact and personal info
        formData.append('email', data.email);
        formData.append('phone_number', data.phone_number);
        formData.append('address', data.address);
        formData.append('place_of_birth', data.place_of_birth);
        formData.append('sex', data.sex);
        formData.append('date_of_birth', data.date_of_birth);
        formData.append('tribe', data.tribe);
        formData.append('occupation', data.occupation);

        // Membership info
        formData.append('reason_for_membership', data.reason_for_membership);
        formData.append('applicant_date', data.applicant_date);
        formData.append('declaration_name', data.declaration_name);
        formData.append('witness_name', data.witness_name);
        formData.append('witness_date', data.witness_date);

        // File uploads
        if (data.image) {
            formData.append('image', data.image);
        }
        if (data.application_form) {
            formData.append('application_form', data.application_form);
        }
        // Debug FormData contents
        console.log('FormData contents before submission:');
        for (const [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }

        if (member) {
            // For updates with file uploads, we use router.post with _method override
            formData.append('_method', 'PUT');
            setIsSubmitting(true); // Set loading state
            router.post(route('members.update', member.id), formData, {
                onSuccess: () => {
                    setIsSubmitting(false); // Clear loading state
                    clearErrors(); // Clear any existing errors
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
                    setIsSubmitting(false); // Clear loading state on error
                    console.log('Update errors:', errors);

                    // Set form errors for field validation display
                    Object.keys(errors).forEach(key => {
                        setError(key, Array.isArray(errors[key]) ? errors[key][0] : errors[key]);
                    });

                    let errorMessage = 'An error occurred while updating the member. Please try again.';

                    // Check for email validation errors
                    if (errors.email) {
                        const emailError = Array.isArray(errors.email) ? errors.email[0] : errors.email;
                        if (emailError.toLowerCase().includes('already been taken') ||
                            emailError.toLowerCase().includes('unique') ||
                            emailError.toLowerCase().includes('duplicate')) {
                            errorMessage = 'A member with this email already exists. Please use a different email.';
                        } else {
                            errorMessage = `Email error: ${emailError}`;
                        }
                    }
                    // Check for other specific validation errors
                    else if (Object.keys(errors).length > 0) {
                        const firstError = Object.values(errors)[0];
                        const firstErrorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
                        errorMessage = firstErrorMessage;
                    }

                    toast.error(errorMessage, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        style: { zIndex: 99999 },
                    });
                }
            });
        } else {
            setIsSubmitting(true); // Set loading state
            router.post(route('members.store'), formData, {
                onSuccess: () => {
                    setIsSubmitting(false); // Clear loading state
                    clearErrors(); // Clear any existing errors
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
                    setIsSubmitting(false); // Clear loading state on error
                    console.log('Create errors:', errors);

                    // Set form errors for field validation display
                    Object.keys(errors).forEach(key => {
                        setError(key, Array.isArray(errors[key]) ? errors[key][0] : errors[key]);
                    });

                    let errorMessage = 'An error occurred while creating the member. Please try again.';

                    // Check for email validation errors
                    if (errors.email) {
                        const emailError = Array.isArray(errors.email) ? errors.email[0] : errors.email;
                        if (emailError.toLowerCase().includes('already been taken') ||
                            emailError.toLowerCase().includes('unique') ||
                            emailError.toLowerCase().includes('duplicate')) {
                            errorMessage = 'A member with this email already exists. Please use a different email.';
                        } else {
                            errorMessage = `Email error: ${emailError}`;
                        }
                    }
                    // Check for other specific validation errors
                    else if (Object.keys(errors).length > 0) {
                        const firstError = Object.values(errors)[0];
                        const firstErrorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
                        errorMessage = firstErrorMessage;
                    }

                    toast.error(errorMessage, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        style: { zIndex: 99999 },
                    });
                }
            });
        }
    };

    return (
        <div className="fixed z-[9999] inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={closeModal}>
                    <div className="absolute inset-0 bg-gray-900 bg-opacity-75 backdrop-blur-sm"></div>
                </div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full border border-gray-200 dark:border-gray-700">
                    <form onSubmit={handleSubmit}>
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-xl font-bold text-white">
                                            {member ? 'Edit Member Profile' : 'Add New Member'}
                                        </h3>
                                        <p className="text-indigo-100 text-sm">
                                            {member ? 'Update member information and details' : 'Fill in the details to create a new member profile'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-2 transition-colors duration-200"
                                >
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="bg-white dark:bg-gray-800 px-6 py-6 max-h-[70vh] overflow-y-auto">
                            <div className="space-y-8">
                                {/* Personal Information Section */}
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                                    <div className="flex items-center mb-6">
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
                                                <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="ml-3">
                                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Personal Information</h4>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Basic member details and contact information</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                        {/* First Name */}
                                        <div>
                                            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                First Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={data.first_name}
                                                onChange={e => setData('first_name', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white transition-colors duration-200"
                                                placeholder="Enter first name"
                                                required
                                            />
                                            {errors.first_name && <div className="flex items-center text-red-500 text-sm mt-2">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {errors.first_name}
                                            </div>}
                                        </div>

                                        {/* Middle Name */}
                                        <div>
                                            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                Middle Name
                                                <span className="text-xs text-gray-400 ml-1">(Optional)</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={data.middle_name}
                                                onChange={e => setData('middle_name', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white transition-colors duration-200"
                                                placeholder="Enter middle name"
                                            />
                                            {errors.middle_name && <div className="flex items-center text-red-500 text-sm mt-2">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {errors.middle_name}
                                            </div>}
                                        </div>

                                        {/* Surname */}
                                        <div>
                                            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                Surname *
                                            </label>
                                            <input
                                                type="text"
                                                value={data.surname}
                                                onChange={e => setData('surname', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white transition-colors duration-200"
                                                placeholder="Enter surname"
                                                required
                                            />
                                            {errors.surname && <div className="flex items-center text-red-500 text-sm mt-2">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {errors.surname}
                                            </div>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mt-6">

                                        <div>
                                            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                                </svg>
                                                Email Address *
                                            </label>
                                            <input
                                                type="email"
                                                value={data.email}
                                                onChange={e => {
                                                    setData('email', e.target.value);
                                                    if (errors.email) {
                                                        clearErrors('email');
                                                    }
                                                }}
                                                className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 dark:bg-gray-800 dark:text-white transition-colors duration-200 ${errors.email
                                                    ? 'border-red-500 dark:border-red-500 focus:ring-red-500 focus:border-red-500'
                                                    : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500'
                                                    }`}
                                                placeholder="Enter email address"
                                            />
                                            {errors.email && <div className="flex items-center text-red-500 text-sm mt-2">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {errors.email}
                                            </div>}
                                        </div>

                                        <div>
                                            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                </svg>
                                                Phone Number
                                            </label>
                                            <input
                                                type="text"
                                                value={data.phone_number}
                                                onChange={e => setData('phone_number', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white transition-colors duration-200"
                                                placeholder="Enter phone number"
                                            />
                                            {errors.phone_number && <div className="flex items-center text-red-500 text-sm mt-2">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {errors.phone_number}
                                            </div>}
                                        </div>

                                        <div>
                                            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                Date of Birth
                                            </label>
                                            <input
                                                type="date"
                                                value={data.date_of_birth}
                                                onChange={e => setData('date_of_birth', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white transition-colors duration-200"
                                            />
                                            {errors.date_of_birth && <div className="flex items-center text-red-500 text-sm mt-2">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {errors.date_of_birth}
                                            </div>}
                                        </div>

                                        {/* Place of Birth */}
                                        <div>
                                            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                Place of Birth *
                                            </label>
                                            <input
                                                type="text"
                                                value={data.place_of_birth}
                                                onChange={e => setData('place_of_birth', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white transition-colors duration-200"
                                                placeholder="Enter place of birth"
                                                required
                                            />
                                            {errors.place_of_birth && <div className="flex items-center text-red-500 text-sm mt-2">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {errors.place_of_birth}
                                            </div>}
                                        </div>

                                        {/* Sex */}
                                        <div>
                                            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                Sex *
                                            </label>
                                            <select
                                                value={data.sex}
                                                onChange={e => setData('sex', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white transition-colors duration-200"
                                                required
                                            >
                                                <option value="">Select sex</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                            </select>
                                            {errors.sex && <div className="flex items-center text-red-500 text-sm mt-2">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {errors.sex}
                                            </div>}
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            Address
                                        </label>
                                        <input
                                            type="text"
                                            value={data.address}
                                            onChange={e => setData('address', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white transition-colors duration-200"
                                            placeholder="Enter full address"
                                        />
                                        {errors.address && <div className="flex items-center text-red-500 text-sm mt-2">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {errors.address}
                                        </div>}
                                    </div>

                                    <div className="mt-6">
                                        <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            Profile Image
                                        </label>
                                        <div className="mt-1">
                                            {imagePreview ? (
                                                <div className="relative">
                                                    <div className="w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                                                        <img
                                                            src={imagePreview}
                                                            alt="Profile preview"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="absolute top-2 right-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setImagePreview(null);
                                                                setData('image', null);
                                                            }}
                                                            className="bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition-colors duration-200"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                    <div className="mt-2 text-center">
                                                        <label htmlFor="file-upload" className="cursor-pointer text-sm text-indigo-600 hover:text-indigo-500 font-medium">
                                                            Change image
                                                            <input
                                                                id="file-upload"
                                                                name="file-upload"
                                                                type="file"
                                                                className="sr-only"
                                                                accept="image/*"
                                                                onChange={handleImageChange}
                                                            />
                                                        </label>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors duration-200">
                                                    <div className="space-y-1 text-center">
                                                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                        <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                                                <span>Upload a file</span>
                                                                <input
                                                                    id="file-upload"
                                                                    name="file-upload"
                                                                    type="file"
                                                                    className="sr-only"
                                                                    accept="image/*"
                                                                    onChange={handleImageChange}
                                                                />
                                                            </label>
                                                            <p className="pl-1">or drag and drop</p>
                                                        </div>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF up to 10MB</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        {errors.image && <div className="flex items-center text-red-500 text-sm mt-2">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {errors.image}
                                        </div>}
                                    </div>

                                    {/* Application Form Upload */}
                                    <div className="mt-6">
                                        <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            Application Form
                                            <span className="text-xs text-gray-400 ml-1">(Optional)</span>
                                        </label>
                                        <div className="mt-1">
                                            {applicationFormPreview ? (
                                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="flex-shrink-0">
                                                                {applicationFormPreview.type?.includes('pdf') ? (
                                                                    <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                                                    </svg>
                                                                ) : applicationFormPreview.type?.includes('doc') ? (
                                                                    <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                                                    </svg>
                                                                ) : (
                                                                    <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                                                    </svg>
                                                                )}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                                    {applicationFormPreview.name}
                                                                </p>
                                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                    {applicationFormPreview.size} MB
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setApplicationFormPreview(null);
                                                                setData('application_form', null);
                                                            }}
                                                            className="text-red-500 hover:text-red-700 transition-colors duration-200"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                    <div className="mt-3 text-center">
                                                        <label htmlFor="application-form-upload" className="cursor-pointer text-sm text-indigo-600 hover:text-indigo-500 font-medium">
                                                            Change file
                                                            <input
                                                                id="application-form-upload"
                                                                name="application-form-upload"
                                                                type="file"
                                                                className="sr-only"
                                                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                                onChange={handleApplicationFormChange}
                                                            />
                                                        </label>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors duration-200">
                                                    <div className="space-y-1 text-center">
                                                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                        <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                                            <label htmlFor="application-form-upload" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                                                <span>Upload application form</span>
                                                                <input
                                                                    id="application-form-upload"
                                                                    name="application-form-upload"
                                                                    type="file"
                                                                    className="sr-only"
                                                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                                    onChange={handleApplicationFormChange}
                                                                />
                                                            </label>
                                                            <p className="pl-1">or drag and drop</p>
                                                        </div>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            PDF, DOC, DOCX, JPG, PNG up to 10MB
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        {errors.application_form && <div className="flex items-center text-red-500 text-sm mt-2">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {errors.application_form}
                                        </div>}
                                    </div>
                                </div>

                                {/* Additional Information Section */}
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                                    <div className="flex items-center mb-6">
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                                                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="ml-3">
                                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Additional Information</h4>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Cultural background and professional details</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                        <div>
                                            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                                Tribe/Ethnicity
                                            </label>
                                            <input
                                                type="text"
                                                value={data.tribe}
                                                onChange={e => setData('tribe', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:text-white transition-colors duration-200"
                                                placeholder="Enter tribe or ethnicity"
                                            />
                                            {errors.tribe && <div className="flex items-center text-red-500 text-sm mt-2">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {errors.tribe}
                                            </div>}
                                        </div>

                                        <div>
                                            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                                                </svg>
                                                Occupation
                                            </label>
                                            <input
                                                type="text"
                                                value={data.occupation}
                                                onChange={e => setData('occupation', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:text-white transition-colors duration-200"
                                                placeholder="Enter occupation or profession"
                                            />
                                            {errors.occupation && <div className="flex items-center text-red-500 text-sm mt-2">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {errors.occupation}
                                            </div>}
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Reason for Membership
                                        </label>
                                        <textarea
                                            value={data.reason_for_membership}
                                            onChange={e => setData('reason_for_membership', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:text-white transition-colors duration-200"
                                            rows="4"
                                            placeholder="Please explain your motivation for joining this group and what you hope to contribute..."
                                        />
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center">
                                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            This helps us understand your goals and how you can contribute to the community.
                                        </p>
                                        {errors.reason_for_membership && <div className="flex items-center text-red-500 text-sm mt-2">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {errors.reason_for_membership}
                                        </div>}
                                    </div>
                                </div>

                                {/* Declaration & Witness Section */}
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                                    <div className="flex items-center mb-6">
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                                                <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="ml-3">
                                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Declaration & Witness</h4>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Application verification and witness information</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                        <div>
                                            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                Application Date
                                            </label>
                                            <input
                                                type="date"
                                                value={data.applicant_date}
                                                onChange={e => setData('applicant_date', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-800 dark:text-white transition-colors duration-200"
                                            />
                                            {errors.applicant_date && <div className="flex items-center text-red-500 text-sm mt-2">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {errors.applicant_date}
                                            </div>}
                                        </div>

                                        <div>
                                            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                Declaration Name
                                            </label>
                                            <input
                                                type="text"
                                                value={data.declaration_name}
                                                onChange={e => setData('declaration_name', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-800 dark:text-white transition-colors duration-200"
                                                placeholder="Enter declaration name"
                                            />
                                            {errors.declaration_name && <div className="flex items-center text-red-500 text-sm mt-2">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {errors.declaration_name}
                                            </div>}
                                        </div>

                                        <div>
                                            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                Witness Name
                                            </label>
                                            <input
                                                type="text"
                                                value={data.witness_name}
                                                onChange={e => setData('witness_name', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-800 dark:text-white transition-colors duration-200"
                                                placeholder="Enter witness name"
                                            />
                                            {errors.witness_name && <div className="flex items-center text-red-500 text-sm mt-2">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {errors.witness_name}
                                            </div>}
                                        </div>

                                        <div>
                                            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                Witness Date
                                            </label>
                                            <input
                                                type="date"
                                                value={data.witness_date}
                                                onChange={e => setData('witness_date', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-800 dark:text-white transition-colors duration-200"
                                            />
                                            {errors.witness_date && <div className="flex items-center text-red-500 text-sm mt-2">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {errors.witness_date}
                                            </div>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-t border-gray-200 dark:border-gray-600">
                            <div className="flex flex-col sm:flex-row-reverse gap-3">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            {member ? 'Updating...' : 'Creating...'}
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            {member ? 'Update Member' : 'Create Member'}
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={isSubmitting}
                                    className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default function MembersIndex({ members, statistics = {} }) {
    const { auth, flash } = usePage().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState(null);
    const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'

    // Search and filtering states
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'verified', 'pending'
    const [sortBy, setSortBy] = useState('name'); // 'name', 'email', 'created_at'
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc', 'desc'

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(12);

    // Handle flash messages
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
        if (flash?.error) {
            toast.error(flash.error, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    }, [flash]);

    // Filter and sort members
    const filteredAndSortedMembers = React.useMemo(() => {
        let filtered = members.filter(member => {
            // Search filter
            const matchesSearch = searchTerm === '' ||
                member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (member.phone_number && member.phone_number.includes(searchTerm)) ||
                (member.address && member.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (member.occupation && member.occupation.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (member.tribe && member.tribe.toLowerCase().includes(searchTerm.toLowerCase()));

            // Status filter
            const matchesStatus = statusFilter === 'all' ||
                (statusFilter === 'verified' && member.is_verified) ||
                (statusFilter === 'pending' && !member.is_verified);

            return matchesSearch && matchesStatus;
        });

        // Sort members
        filtered.sort((a, b) => {
            let aValue, bValue;

            switch (sortBy) {
                case 'name':
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
                    break;
                case 'email':
                    aValue = a.email.toLowerCase();
                    bValue = b.email.toLowerCase();
                    break;
                case 'created_at':
                    aValue = new Date(a.created_at);
                    bValue = new Date(b.created_at);
                    break;
                default:
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
            }

            if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        return filtered;
    }, [members, searchTerm, statusFilter, sortBy, sortOrder]);

    // Pagination calculations
    const totalPages = Math.ceil(filteredAndSortedMembers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentMembers = filteredAndSortedMembers.slice(startIndex, endIndex);

    // Reset to first page when filters change
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter, sortBy, sortOrder]);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setEditingMember(null);
    };

    const handleEdit = (member) => {
        setEditingMember(member);
        openModal();
    };



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
            const deleteRoute = route('members.destroy', deletingMember.id);
            console.log('Delete route:', deleteRoute);
            console.log('Member ID:', deletingMember.id);

            router.delete(deleteRoute, {
                onSuccess: () => {
                    toast.success('Member archived successfully.', {
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
                    console.error('Archive errors:', errors);
                    let errorMessage = 'An error occurred while archiving the member. Please try again.';

                    // Check for specific error messages
                    if (errors.message) {
                        errorMessage = errors.message;
                    } else if (typeof errors === 'string') {
                        errorMessage = errors;
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
                }
            });
        }
    };

    const handleImportFile = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleImportSubmit = () => {
        if (selectedFile) {
            setIsImporting(true);
            const formData = new FormData();
            formData.append('file', selectedFile);

            router.post(route('members.import'), formData, {
                onSuccess: (page) => {
                    setIsImportModalOpen(false);
                    setSelectedFile(null);
                    setIsImporting(false);

                    // Show success message from server or default
                    const message = page.props.flash?.message || 'Members imported successfully!';
                    toast.success(message, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });

                    // Clear browser cache and refresh the page to show new members
                    if ('caches' in window) {
                        caches.keys().then(names => {
                            names.forEach(name => {
                                caches.delete(name);
                            });
                        });
                    }

                    // Force reload with cache bypass
                    window.location.reload(true);
                },
                onError: (errors) => {
                    setIsImporting(false);
                    console.error('Import errors:', errors);
                    let errorMessage = 'An error occurred while importing members. Please check your file format and try again.';

                    if (errors.message) {
                        errorMessage = errors.message;
                    } else if (errors.file) {
                        errorMessage = errors.file[0];
                    }

                    toast.error(errorMessage, {
                        position: "top-right",
                        autoClose: 8000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });

                    // Show detailed import errors if available
                    if (errors.import_errors && errors.import_errors.length > 0) {
                        setTimeout(() => {
                            const detailedErrors = errors.import_errors.slice(0, 5).join('\n');
                            toast.error(`Import errors:\n${detailedErrors}`, {
                                position: "top-right",
                                autoClose: 10000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                            });
                        }, 1000);
                    }
                }
            });
        }
    };



    return (
        <SidebarLayout>
            <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Members</h1>
                        <p className="text-gray-600 dark:text-gray-400 text-lg">Manage your group members and their information</p>
                        <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Total Members: {members.length} | Showing: {filteredAndSortedMembers.length} | Page: {currentPage} of {totalPages}
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <div className="relative">
                            <button
                                onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
                                className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Export Data
                                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {isExportDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                                    <div className="py-1">
                                        <a
                                            href={route('members.export', { format: 'csv' })}
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                                        >
                                            <svg className="w-4 h-4 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            Export as CSV
                                        </a>
                                        <a
                                            href={route('members.export', { format: 'xlsx' })}
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                                        >
                                            <svg className="w-4 h-4 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            Export as Excel
                                        </a>
                                        <a
                                            href={route('members.export', { format: 'pdf' })}
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                                        >
                                            <svg className="w-4 h-4 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                            </svg>
                                            Export as PDF
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Import Button */}
                        <button
                            onClick={() => setIsImportModalOpen(true)}
                            className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                            </svg>
                            Import Members
                        </button>



                        {/* View Toggle Buttons */}
                        <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('table')}
                                className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${viewMode === 'table'
                                    ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                    }`}
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 6h18m-9 8h9m-9 4h9m-9-8h9m-9 4h9" />
                                </svg>
                                Table
                            </button>
                            <button
                                onClick={() => setViewMode('cards')}
                                className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${viewMode === 'cards'
                                    ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                    }`}
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z" />
                                </svg>
                                Cards
                            </button>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <Link
                                href={route('admin.members.archived')}
                                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 shadow-lg hover:shadow-xl transition-all duration-200"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8l6 6m0 0l6-6m-6 6V3" />
                                </svg>
                                View Archive ({statistics?.deleted_members || 0})
                            </Link>

                            <button
                                onClick={openModal}
                                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg hover:shadow-xl transition-all duration-200"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Add New Member
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filter Section */}
            <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search Bar */}
                    <div className="flex-1">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Search members by name, email, phone, address, occupation, or tribe..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Filters Row */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Status Filter */}
                        <div className="min-w-[140px]">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                            >
                                <option value="all">All Status</option>
                                <option value="verified">Verified</option>
                                <option value="pending">Pending</option>
                            </select>
                        </div>

                        {/* Sort By */}
                        <div className="min-w-[140px]">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                            >
                                <option value="name">Sort by Name</option>
                                <option value="email">Sort by Email</option>
                                <option value="created_at">Sort by Date</option>
                            </select>
                        </div>

                        {/* Sort Order */}
                        <button
                            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                            className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
                            title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
                        >
                            <svg className={`w-5 h-5 transform ${sortOrder === 'desc' ? 'rotate-180' : ''} transition-transform duration-200`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                            </svg>
                        </button>

                        {/* Items Per Page */}
                        <div className="min-w-[100px]">
                            <select
                                value={itemsPerPage}
                                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                                className="block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                            >
                                <option value={6}>6 per page</option>
                                <option value={12}>12 per page</option>
                                <option value={24}>24 per page</option>
                                <option value={48}>48 per page</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Active Filters Display */}
                {(searchTerm || statusFilter !== 'all') && (
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
                        {searchTerm && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                                Search: "{searchTerm}"
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-indigo-200 dark:hover:bg-indigo-800"
                                >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </span>
                        )}
                        {statusFilter !== 'all' && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                Status: {statusFilter}
                                <button
                                    onClick={() => setStatusFilter('all')}
                                    className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-green-200 dark:hover:bg-green-800"
                                >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </span>
                        )}
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setStatusFilter('all');
                            }}
                            className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 font-medium"
                        >
                            Clear all
                        </button>
                    </div>
                )}
            </div>

            {/* Conditional Rendering: Table or Cards View */}
            {viewMode === 'table' ? (
                <div className="flex flex-col">
                    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                            <div className="shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700 sm:rounded-xl bg-white dark:bg-gray-800">
                                <table className="min-w-full">
                                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-600">
                                        <tr>
                                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                                <div className="flex items-center">
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                    Profile
                                                </div>
                                            </th>
                                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                                <div className="flex items-center">
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                    Member Details
                                                </div>
                                            </th>
                                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                                <div className="flex items-center">
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                                    </svg>
                                                    Email
                                                </div>
                                            </th>
                                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                                <div className="flex items-center">
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                    </svg>
                                                    Phone
                                                </div>
                                            </th>
                                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                                <div className="flex items-center">
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    Address
                                                </div>
                                            </th>
                                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                                <div className="flex items-center">
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    Birth Date
                                                </div>
                                            </th>
                                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                                <div className="flex items-center">
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    Status
                                                </div>
                                            </th>
                                            <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                                <div className="flex items-center justify-end">
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                                    </svg>
                                                    Actions
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
                                        {currentMembers.length > 0 ? (
                                            currentMembers.map(member => (
                                                <MemberRow key={member.id} member={member} onEdit={handleEdit} onDelete={() => openDeleteModal(member)} auth={auth} />
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="8" className="px-6 py-12 text-center">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                        </svg>
                                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                                            {members.length === 0 ? 'No members found' : 'No members match your filters'}
                                                        </h3>
                                                        <p className="text-gray-500 dark:text-gray-400 mb-4">
                                                            {members.length === 0
                                                                ? 'Get started by adding your first member to the group.'
                                                                : 'Try adjusting your search terms or filters to find what you\'re looking for.'
                                                            }
                                                        </p>
                                                        {members.length === 0 ? (
                                                            <button
                                                                onClick={openModal}
                                                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                            >
                                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                                </svg>
                                                                Add First Member
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => {
                                                                    setSearchTerm('');
                                                                    setStatusFilter('all');
                                                                }}
                                                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                            >
                                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                                </svg>
                                                                Clear Filters
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* Cards View */
                <div className="px-4 sm:px-6 lg:px-8">
                    {currentMembers.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {currentMembers.map(member => (
                                <MemberCard key={member.id} member={member} onEdit={handleEdit} onDelete={() => openDeleteModal(member)} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="flex flex-col items-center justify-center">
                                <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                                    {members.length === 0 ? 'No members found' : 'No members match your filters'}
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-6">
                                    {members.length === 0
                                        ? 'Get started by adding your first member to the group.'
                                        : 'Try adjusting your search terms or filters to find what you\'re looking for.'
                                    }
                                </p>
                                {members.length === 0 ? (
                                    <button
                                        onClick={openModal}
                                        className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg hover:shadow-xl transition-all duration-200"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Add First Member
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => {
                                            setSearchTerm('');
                                            setStatusFilter('all');
                                        }}
                                        className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg hover:shadow-xl transition-all duration-200"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        Clear Filters
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Pagination */}
            {filteredAndSortedMembers.length > itemsPerPage && (
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between bg-white dark:bg-gray-800 px-6 py-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center text-sm text-gray-700 dark:text-gray-300 mb-4 sm:mb-0">
                        <span>
                            Showing {startIndex + 1} to {Math.min(endIndex, filteredAndSortedMembers.length)} of {filteredAndSortedMembers.length} results
                        </span>
                    </div>

                    <div className="flex items-center space-x-2">
                        {/* Previous Button */}
                        <button
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${currentPage === 1
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600'
                                }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        {/* Page Numbers */}
                        <div className="flex items-center space-x-1">
                            {(() => {
                                const pages = [];
                                const maxVisiblePages = 5;
                                let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                                let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

                                if (endPage - startPage + 1 < maxVisiblePages) {
                                    startPage = Math.max(1, endPage - maxVisiblePages + 1);
                                }

                                // First page
                                if (startPage > 1) {
                                    pages.push(
                                        <button
                                            key={1}
                                            onClick={() => setCurrentPage(1)}
                                            className="px-3 py-2 rounded-lg text-sm font-medium bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 transition-colors duration-200"
                                        >
                                            1
                                        </button>
                                    );
                                    if (startPage > 2) {
                                        pages.push(<span key="ellipsis1" className="px-2 text-gray-500">...</span>);
                                    }
                                }

                                // Visible pages
                                for (let i = startPage; i <= endPage; i++) {
                                    pages.push(
                                        <button
                                            key={i}
                                            onClick={() => setCurrentPage(i)}
                                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${i === currentPage
                                                ? 'bg-indigo-600 text-white shadow-lg'
                                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600'
                                                }`}
                                        >
                                            {i}
                                        </button>
                                    );
                                }

                                // Last page
                                if (endPage < totalPages) {
                                    if (endPage < totalPages - 1) {
                                        pages.push(<span key="ellipsis2" className="px-2 text-gray-500">...</span>);
                                    }
                                    pages.push(
                                        <button
                                            key={totalPages}
                                            onClick={() => setCurrentPage(totalPages)}
                                            className="px-3 py-2 rounded-lg text-sm font-medium bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 transition-colors duration-200"
                                        >
                                            {totalPages}
                                        </button>
                                    );
                                }

                                return pages;
                            })()}
                        </div>

                        {/* Next Button */}
                        <button
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${currentPage === totalPages
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600'
                                }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
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
                style={{ zIndex: 99999 }}
            />
            {isModalOpen && <MemberForm model={isModalOpen} closeModal={closeModal} member={editingMember} />}
            {isDeleteModalOpen && (
                <div className="fixed z-[9999] inset-0 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Archive Member</h3>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Are you sure you want to archive this member? The member will be moved to the archive but can be restored later if needed. All related data (contributions, debts, penalties, dependents) will be preserved.</p>
                                    <input type="text" value={deleteConfirmation} onChange={e => setDeleteConfirmation(e.target.value)} placeholder={`Type "${deletingMember?.name || ''}" to confirm`} className="w-full mt-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500" />
                                </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button onClick={handleDelete} disabled={deleteConfirmation !== deletingMember?.name} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-600 text-base font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                                    Archive Member
                                </button>
                                <button onClick={closeDeleteModal} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Import Modal */}
            {isImportModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
                    <div className="relative p-6 border max-w-2xl w-full shadow-lg rounded-lg bg-white dark:bg-gray-800 max-h-[90vh] overflow-y-auto">
                        <div className="mt-3">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Import Members</h3>
                                <button
                                    onClick={() => {
                                        setIsImportModalOpen(false);
                                        setSelectedFile(null);
                                    }}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                    disabled={isImporting}
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Import Instructions */}
                                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                                    <div className="flex items-start">
                                        <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <div>
                                            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-3">📋 Import Instructions</h4>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div>
                                                    <h5 className="text-xs font-semibold text-blue-900 dark:text-blue-100 mb-2">📝 Required Fields</h5>
                                                    <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                                                        <li>• <strong>first_name</strong> - Member's first name</li>
                                                        <li>• <strong>surname</strong> - Member's last name</li>
                                                        <li>• <strong>email</strong> - Unique email address</li>
                                                    </ul>
                                                </div>
                                                <div>
                                                    <h5 className="text-xs font-semibold text-blue-900 dark:text-blue-100 mb-2">📋 Optional Fields</h5>
                                                    <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                                                        <li>• <strong>middle_name</strong> - Middle name</li>
                                                        <li>• <strong>phone_number</strong> - Contact number</li>
                                                        <li>• <strong>address</strong> - Physical address</li>
                                                        <li>• <strong>place_of_birth</strong> - Birth location</li>
                                                        <li>• <strong>sex</strong> - Male/Female</li>
                                                        <li>• <strong>date_of_birth</strong> - YYYY-MM-DD format</li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div className="mt-4 pt-3 border-t border-blue-200 dark:border-blue-700">
                                                <h5 className="text-xs font-semibold text-blue-900 dark:text-blue-100 mb-2">⚠️ Important Notes</h5>
                                                <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                                                    <li>• Download the template file first to see the exact format</li>
                                                    <li>• Email addresses must be unique (no duplicates allowed)</li>
                                                    <li>• Date format: YYYY-MM-DD (example: 1990-01-15)</li>
                                                    <li>• Default passwords will be auto-generated and emailed to members</li>
                                                    <li>• Supported file formats: CSV, XLSX, XLS</li>
                                                    <li>• Empty rows will be automatically skipped</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                        Upload a CSV or Excel file to import multiple members at once.
                                    </p>

                                    <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${selectedFile
                                        ? 'border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/20'
                                        : 'border-gray-300 dark:border-gray-600'
                                        }`}>
                                        {selectedFile ? (
                                            <div>
                                                <svg className="mx-auto h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <div className="mt-4">
                                                    <p className="text-sm font-medium text-green-900 dark:text-green-100">
                                                        {selectedFile.name}
                                                    </p>
                                                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                                                        File selected successfully
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <div className="mt-4">
                                                    <label htmlFor="import-file" className="cursor-pointer">
                                                        <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-white">
                                                            Choose file to upload
                                                        </span>
                                                        <input
                                                            id="import-file"
                                                            name="import-file"
                                                            type="file"
                                                            className="sr-only"
                                                            accept=".csv,.xlsx,.xls"
                                                            onChange={handleImportFile}
                                                            disabled={isImporting}
                                                        />
                                                    </label>
                                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                        CSV, XLSX, or XLS files only
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                                    <div className="flex items-center space-x-3">
                                        <a
                                            href={route('members.template')}
                                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors duration-200"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            Download Template
                                        </a>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            Start with our template for best results
                                        </span>
                                    </div>
                                    {selectedFile && (
                                        <button
                                            onClick={() => setSelectedFile(null)}
                                            className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors duration-200"
                                            disabled={isImporting}
                                        >
                                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            Clear File
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Quick Tips */}
                            <div className="mt-6 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                                <div className="flex items-start">
                                    <svg className="w-4 h-4 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                    <div>
                                        <h5 className="text-xs font-semibold text-yellow-800 dark:text-yellow-200 mb-1">💡 Pro Tips</h5>
                                        <ul className="text-xs text-yellow-700 dark:text-yellow-300 space-y-0.5">
                                            <li>• Test with a small batch first (2-3 members) to verify format</li>
                                            <li>• Keep a backup of your original data before importing</li>
                                            <li>• Check for duplicate emails before uploading</li>
                                            <li>• Members will receive welcome emails with login credentials</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    onClick={() => {
                                        setIsImportModalOpen(false);
                                        setSelectedFile(null);
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    disabled={isImporting}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleImportSubmit}
                                    disabled={!selectedFile || isImporting}
                                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                >
                                    {isImporting ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Importing...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                                            </svg>
                                            Import Members
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </SidebarLayout>
    );
}
