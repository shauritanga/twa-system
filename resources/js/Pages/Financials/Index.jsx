import React, { useState, useEffect } from 'react';
import SidebarLayout from '../../Layouts/SidebarLayout';
import { usePage, router } from '@inertiajs/react';
import DisasterPaymentForm from '../../Components/DisasterPaymentForm';
import {
    CurrencyDollarIcon,
    ExclamationTriangleIcon,
    DocumentTextIcon,
    HeartIcon,
    FaceSmileIcon
} from '@heroicons/react/24/outline';

const Financials = ({ members, contributionsByMonth, filters, debts, penalties, disasterPayments }) => {
    const { props } = usePage();
    const initialTab = props.tab || 'contributions';
    const [activeTab, setActiveTab] = useState(initialTab);

    const tabs = [
        {
            id: 'contributions',
            name: 'Contributions',
            icon: CurrencyDollarIcon,
            color: 'text-green-600 dark:text-green-400',
            bgColor: 'bg-green-50 dark:bg-green-900/20',
            borderColor: 'border-green-500'
        },
        {
            id: 'debts',
            name: 'Debts',
            icon: ExclamationTriangleIcon,
            color: 'text-red-600 dark:text-red-400',
            bgColor: 'bg-red-50 dark:bg-red-900/20',
            borderColor: 'border-red-500'
        },
        {
            id: 'penalties',
            name: 'Penalties',
            icon: DocumentTextIcon,
            color: 'text-orange-600 dark:text-orange-400',
            bgColor: 'bg-orange-50 dark:bg-orange-900/20',
            borderColor: 'border-orange-500'
        },
        {
            id: 'disaster-payments',
            name: 'Disaster Payments',
            icon: HeartIcon,
            color: 'text-blue-600 dark:text-blue-400',
            bgColor: 'bg-blue-50 dark:bg-blue-900/20',
            borderColor: 'border-blue-500'
        },
        {
            id: 'list-of-shame',
            name: 'List of Shame',
            icon: FaceSmileIcon,
            color: 'text-purple-600 dark:text-purple-400',
            bgColor: 'bg-purple-50 dark:bg-purple-900/20',
            borderColor: 'border-purple-500'
        }
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'contributions':
                return <ContributionsTable members={members} contributionsByMonth={contributionsByMonth} filters={filters} />;
            case 'debts':
                return <DebtsTable debts={debts} />;
            case 'penalties':
                return <PenaltiesTable penalties={penalties} />;
            case 'disaster-payments':
                return <DisasterPaymentsTable disasterPayments={disasterPayments} members={members} />;
            case 'list-of-shame':
                return <ListOfShame members={members} contributionsByMonth={contributionsByMonth} debts={debts} penalties={penalties} />;
            default:
                return null;
        }
    };

    return (
        <SidebarLayout>
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Financial Management
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Track contributions, manage debts, and monitor financial health
                </p>
            </div>

            {/* Modern Tab Navigation */}
            <div className="mb-8">
                <div className="border-b border-gray-200 dark:border-gray-700">
                    <nav className="-mb-px flex space-x-1 overflow-x-auto scrollbar-hide">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                                        group inline-flex items-center py-3 px-4 border-b-2 font-medium text-sm whitespace-nowrap
                                        transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600
                                        ${isActive
                                            ? `${tab.borderColor} ${tab.color}`
                                            : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                        }
                                    `}
                                >
                                    <Icon className={`
                                        -ml-0.5 mr-2 h-5 w-5 transition-colors duration-200
                                        ${isActive ? tab.color : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400'}
                                    `} />
                                    <span className="hidden sm:inline">{tab.name}</span>
                                    <span className="sm:hidden">{tab.name.split(' ')[0]}</span>
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* Content Area */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                {renderContent()}
            </div>
        </SidebarLayout>
    );
};

import { useForm } from '@inertiajs/react';
import ImportModal from '../../Components/ImportModal';
import Modal from '../../Components/Modal';
import InputLabel from '../../Components/InputLabel';
import TextInput from '../../Components/TextInput';
import PrimaryButton from '../../Components/PrimaryButton';
import SecondaryButton from '../../Components/SecondaryButton';
import InputError from '../../Components/InputError';

const ContributionForm = ({ members, closeModel }) => {
    const { data, setData, post, processing, errors } = useForm({
        member_id: '',
        date: '',
        purpose: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('contributions.store'), {
            onSuccess: () => closeModel(),
        });
    };

    return (
        <Modal show={true} onClose={closeModel} title="Add Contribution" maxWidth="lg">
            <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-4">
                    <div>
                        <InputLabel htmlFor="member_id" value="Member" />
                        <select
                            id="member_id"
                            value={data.member_id}
                            onChange={e => setData('member_id', e.target.value)}
                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                        >
                            <option value="">Select Member</option>
                            {members.map(member => (
                                <option key={member.id} value={member.id}>{member.name}</option>
                            ))}
                        </select>
                        <InputError message={errors.member_id} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="date" value="Date" />
                        <TextInput
                            id="date"
                            type="date"
                            value={data.date}
                            onChange={e => setData('date', e.target.value)}
                            className="mt-1 block w-full"
                        />
                        <InputError message={errors.date} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="purpose" value="Purpose" />
                        <TextInput
                            id="purpose"
                            type="text"
                            value={data.purpose}
                            onChange={e => setData('purpose', e.target.value)}
                            placeholder="Purpose"
                            className="mt-1 block w-full"
                        />
                        <InputError message={errors.purpose} className="mt-2" />
                    </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                    <SecondaryButton onClick={closeModel}>
                        Cancel
                    </SecondaryButton>
                    <PrimaryButton type="submit" disabled={processing}>
                        {processing ? 'Creating...' : 'Create'}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
};

const ContributionsTable = ({ members, contributionsByMonth, filters }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const { auth } = usePage().props;
    const user = auth?.user;
    const isAdmin = user?.role?.name === 'admin';

    const [search, setSearch] = useState(filters.search || '');
    const [year, setYear] = useState(filters.year || new Date().getFullYear());
    const [month, setMonth] = useState(filters.month || '');
    const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);

    // Determine the current route to maintain context
    const getCurrentRoute = () => {
        const currentUrl = window.location.pathname;
        return currentUrl.includes('/admin/financials') ? '/admin/financials' : '/financials';
    };

    useEffect(() => {
        setYear(filters.year || new Date().getFullYear());
        setMonth(filters.month || '');
        setSearch(filters.search || '');
    }, [filters]);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleFilterChange = () => {
        const currentRoute = getCurrentRoute();
        router.get(currentRoute, { search, year, month }, { preserveState: true });
    };

    const handleImport = (file) => {
        const formData = new FormData();
        formData.append('file', file);
        router.post('/contributions/import', formData, {
            onSuccess: () => setIsImportModalOpen(false),
        });
    };

    const clearFilter = () => {
        const currentRoute = getCurrentRoute();
        router.get(currentRoute);
    };

    const months = Array.from({ length: 12 }, (_, i) => {
        const month = new Date(null, i + 1, null).toLocaleDateString('en', { month: 'long' });
        return { value: i + 1, label: month };
    });

    const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

    return (
        <div className="p-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Member Contributions</h2>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Track monthly contributions across all members
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Export Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Export
                            <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>

                        {isExportDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 z-10">
                                <div className="py-1">
                                    <a href={route('contributions.export', { format: 'pdf', search, year, month })}
                                       className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200">
                                        <svg className="w-4 h-4 mr-3 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                        </svg>
                                        Export as PDF
                                    </a>
                                    <a href={route('contributions.export', { format: 'xlsx', search, year, month })}
                                       className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200">
                                        <svg className="w-4 h-4 mr-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                        </svg>
                                        Export as Excel
                                    </a>
                                    <a href={route('contributions.export', { format: 'csv', search, year, month })}
                                       className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200">
                                        <svg className="w-4 h-4 mr-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                        </svg>
                                        Export as CSV
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>

                    {isAdmin && (
                        <>
                            <button
                                onClick={() => setIsImportModalOpen(true)}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                                </svg>
                                Import
                            </button>
                            <button
                                onClick={openModal}
                                className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Add Contribution
                            </button>
                        </>
                    )}
                </div>
            </div>
            {/* Filters Section */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 mb-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Search Members
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search by member name..."
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Year
                            </label>
                            <select
                                value={year}
                                onChange={e => setYear(e.target.value)}
                                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                {years.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Month
                            </label>
                            <select
                                value={month}
                                onChange={e => setMonth(e.target.value)}
                                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                <option value="">All Months</option>
                                {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
                        <div className="hidden sm:block sm:h-6"></div> {/* Spacer for alignment */}
                        <button
                            onClick={handleFilterChange}
                            className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                            </svg>
                            Apply Filters
                        </button>
                        <button
                            onClick={clearFilter}
                            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Clear All
                        </button>
                    </div>
                </div>
            </div>
            {/* Contributions Table */}
            <div className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th scope="col" className="sticky left-0 z-10 bg-gray-50 dark:bg-gray-800 px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-r border-gray-200 dark:border-gray-700">
                                    Member
                                </th>
                                {months.map(m => (
                                    <th key={m.value} scope="col" className="px-4 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[100px]">
                                        <div className="flex flex-col">
                                            <span className="hidden sm:inline">{m.label}</span>
                                            <span className="sm:hidden">{m.label.substring(0, 3)}</span>
                                            <span className="text-gray-400 dark:text-gray-500 font-normal">{year}</span>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {members.data.map((member, memberIndex) => (
                                <tr key={member.id} className={memberIndex % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-800/50'}>
                                    <td className="sticky left-0 z-10 bg-inherit px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-700">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-8 w-8">
                                                <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                                                    <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                                                        {member.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="ml-3">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {member.name}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    {months.map(month => {
                                        const monthIndex = new Date(Date.parse(month.label + " 1, 2012")).getMonth() + 1;
                                        const monthString = `${year}-${String(monthIndex).padStart(2, '0')}`;
                                        const contribution = contributionsByMonth[member.id]?.[monthString];
                                        const amount = contribution ? parseFloat(contribution.amount) : 0;

                                        return (
                                            <td key={month.value} className="px-4 py-4 whitespace-nowrap text-center">
                                                <div className="flex flex-col items-center">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        amount > 0
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                                            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                                    }`}>
                                                        {amount > 0 ? `${amount.toLocaleString()}` : 'Not Paid'}
                                                    </span>
                                                    {amount > 0 && (
                                                        <div className="mt-1">
                                                            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Pagination */}
            {members.links && members.links.length > 3 && (
                <div className="mt-8 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-6">
                    <div className="flex-1 flex justify-between sm:hidden">
                        {members.links.find(link => link.label.includes('Previous')) && (
                            <a
                                href={members.links.find(link => link.label.includes('Previous')).url}
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                            >
                                Previous
                            </a>
                        )}
                        {members.links.find(link => link.label.includes('Next')) && (
                            <a
                                href={members.links.find(link => link.label.includes('Next')).url}
                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                            >
                                Next
                            </a>
                        )}
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                Showing <span className="font-medium">{members.from || 0}</span> to{' '}
                                <span className="font-medium">{members.to || 0}</span> of{' '}
                                <span className="font-medium">{members.total || 0}</span> results
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                {members.links.map((link, index) => (
                                    <a
                                        key={index}
                                        href={link.url}
                                        className={`relative inline-flex items-center px-2 py-2 border text-sm font-medium ${
                                            link.active
                                                ? 'z-10 bg-indigo-50 dark:bg-indigo-900/20 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                                                : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600'
                                        } ${
                                            index === 0 ? 'rounded-l-md' : ''
                                        } ${
                                            index === members.links.length - 1 ? 'rounded-r-md' : ''
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </nav>
                        </div>
                    </div>
                </div>
            )}
            {isModalOpen && <ContributionForm members={members.data} closeModel={closeModal} />}
            <ImportModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                onImport={handleImport}
            />
        </div>
    );
};

const DebtsTable = ({ debts }) => {
    const handleMarkAsPaid = (id) => {
        router.patch(route('debts.markAsPaid', id));
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Outstanding Debts</h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Manage and track member debts and payment status
                </p>
            </div>

            {/* Mobile Cards View */}
            <div className="block sm:hidden space-y-4">
                {debts.data.map(debt => (
                    <div key={debt.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 h-8 w-8">
                                    <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                                        <span className="text-sm font-medium text-red-600 dark:text-red-400">
                                            {debt.member.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">{debt.member.name}</h3>
                                </div>
                            </div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                debt.status === 'paid'
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                    : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                            }`}>
                                {debt.status}
                            </span>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-500 dark:text-gray-400">Amount:</span>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    {parseFloat(debt.amount).toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-500 dark:text-gray-400">Reason:</span>
                                <span className="text-sm text-gray-900 dark:text-white">{debt.reason}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-500 dark:text-gray-400">Due Date:</span>
                                <span className="text-sm text-gray-900 dark:text-white">{debt.due_date}</span>
                            </div>
                        </div>
                        {debt.status === 'unpaid' && (
                            <div className="mt-4">
                                <button
                                    onClick={() => handleMarkAsPaid(debt.id)}
                                    className="w-full inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                                >
                                    Mark as Paid
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Member</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Reason</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Due Date</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {debts.data.map((debt, index) => (
                                <tr key={debt.id} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-800/50'}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-8 w-8">
                                                <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                                                    <span className="text-sm font-medium text-red-600 dark:text-red-400">
                                                        {debt.member.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="ml-3">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {debt.member.name}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                        {parseFloat(debt.amount).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {debt.reason}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {debt.due_date}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            debt.status === 'paid'
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                                : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                        }`}>
                                            {debt.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {debt.status === 'unpaid' && (
                                            <button
                                                onClick={() => handleMarkAsPaid(debt.id)}
                                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                                            >
                                                Mark as Paid
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Empty State */}
            {debts.data.length === 0 && (
                <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No debts found</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        All members are up to date with their payments.
                    </p>
                </div>
            )}
        </div>
    );
};

const PenaltiesTable = ({ penalties }) => {
    const handleMarkAsPaid = (id) => {
        router.patch(route('penalties.markAsPaid', id));
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Member Penalties</h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Track penalty fees and payment status
                </p>
            </div>

            {/* Mobile Cards View */}
            <div className="block sm:hidden space-y-4">
                {penalties.data.map(penalty => (
                    <div key={penalty.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 h-8 w-8">
                                    <div className="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                                        <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                                            {penalty.member.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">{penalty.member.name}</h3>
                                </div>
                            </div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                penalty.status === 'paid'
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                    : 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
                            }`}>
                                {penalty.status}
                            </span>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-500 dark:text-gray-400">Amount:</span>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    {parseFloat(penalty.amount).toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-500 dark:text-gray-400">Reason:</span>
                                <span className="text-sm text-gray-900 dark:text-white">{penalty.reason}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-500 dark:text-gray-400">Due Date:</span>
                                <span className="text-sm text-gray-900 dark:text-white">{penalty.due_date}</span>
                            </div>
                        </div>
                        {penalty.status === 'unpaid' && (
                            <div className="mt-4">
                                <button
                                    onClick={() => handleMarkAsPaid(penalty.id)}
                                    className="w-full inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                                >
                                    Mark as Paid
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Member</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Reason</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Due Date</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {penalties.data.map((penalty, index) => (
                                <tr key={penalty.id} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-800/50'}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-8 w-8">
                                                <div className="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                                                    <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                                                        {penalty.member.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="ml-3">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {penalty.member.name}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                        {parseFloat(penalty.amount).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {penalty.reason}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {penalty.due_date}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            penalty.status === 'paid'
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                                : 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
                                        }`}>
                                            {penalty.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {penalty.status === 'unpaid' && (
                                            <button
                                                onClick={() => handleMarkAsPaid(penalty.id)}
                                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                                            >
                                                Mark as Paid
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Empty State */}
            {penalties.data.length === 0 && (
                <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No penalties found</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        No penalty fees have been recorded.
                    </p>
                </div>
            )}
        </div>
    );
};

const ListOfShame = ({ members, contributionsByMonth, debts, penalties }) => {
    const { props } = usePage();
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // 1-12
    const previousMonth = currentMonth > 1 ? currentMonth - 1 : 12;
    const previousMonthYear = currentMonth > 1 ? currentYear : currentYear - 1;

    // Calculate members who have not paid for previous months up to the end of last month
    const shameList = members.data.map(member => {
        const memberContributions = contributionsByMonth[member.id] || {};
        let monthsNotPaid = 0;

        // Determine the start date from member's join date (created_at)
        const joinDate = new Date(member.created_at);
        const startYear = joinDate.getFullYear();
        const startMonth = joinDate.getMonth() + 1; // 1-12

        // Count missed months from join date to the previous month
        for (let year = startYear; year <= previousMonthYear; year++) {
            const monthStart = year === startYear ? startMonth : 1;
            const monthEnd = year === previousMonthYear ? previousMonth : 12;

            for (let month = monthStart; month <= monthEnd; month++) {
                const monthString = `${year}-${String(month).padStart(2, '0')}`;
                if (!memberContributions[monthString]) {
                    monthsNotPaid++;
                }
            }
        }

        // Calculate total penalties for this member
        const memberPenalties = penalties.data.filter(p => p.member_id === member.id && p.status === 'unpaid');
        const totalPenalties = memberPenalties.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

        // Calculate total owed from missed contributions (using dynamic monthly contribution amount from settings)
        const monthlyContributionAmount = props.settings && props.settings.monthly_contribution_amount ? parseFloat(props.settings.monthly_contribution_amount.value) : 50000;
        const missedContributionsTotal = monthsNotPaid * monthlyContributionAmount;

        // Total amount to clear (penalties + missed contributions)
        const totalToClear = totalPenalties + missedContributionsTotal;

        return {
            ...member,
            monthsNotPaid,
            totalPenalties,
            totalToClear
        };
    }).filter(member => member.monthsNotPaid > 0); // Only show members with missed payments

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                    <span className="mr-2">📋</span>
                    Outstanding Payments Tracker
                </h2>
                <div className="mt-2 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                        <strong>Note:</strong> Members listed below have missed contributions for previous months up to the end of last month.
                        They are automatically removed once all outstanding amounts are paid. 'Total to Clear' includes penalties plus
                        missed contributions (50,000/month) starting from each member's join date.
                    </p>
                </div>
            </div>

            {/* Mobile Cards View */}
            <div className="block lg:hidden space-y-4">
                {shameList.length > 0 ? (
                    shameList.map(member => (
                        <div key={member.id} className="bg-white dark:bg-gray-800 border-l-4 border-red-500 rounded-lg p-4 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10">
                                        <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                                            <span className="text-sm font-medium text-red-600 dark:text-red-400">
                                                {member.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">{member.name}</h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{member.phone_number || 'No phone'}</p>
                                    </div>
                                </div>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                                    {member.monthsNotPaid} months
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">Penalties:</span>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {member.totalPenalties.toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">Total to Clear:</span>
                                    <p className="text-sm font-bold text-red-600 dark:text-red-400">
                                        {member.totalToClear.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12">
                        <svg className="mx-auto h-12 w-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">All caught up! 🎉</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            No members have missed contributions at this time.
                        </p>
                    </div>
                )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Member</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Months Behind</th>
                                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Penalties</th>
                                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total to Clear</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {shameList.length > 0 ? (
                                shameList.map((member, index) => (
                                    <tr key={member.id} className={`${index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-800/50'} border-l-4 border-red-500`}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-8 w-8">
                                                    <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                                                        <span className="text-sm font-medium text-red-600 dark:text-red-400">
                                                            {member.name.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="ml-3">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {member.name}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {member.phone_number || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                                                {member.monthsNotPaid} months
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900 dark:text-white">
                                            {member.totalPenalties.toLocaleString()}
                                            {member.totalPenalties === 0 && (
                                                <span className="block text-xs text-gray-400">No penalties</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-red-600 dark:text-red-400">
                                            {member.totalToClear.toLocaleString()}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center">
                                            <svg className="h-12 w-12 text-green-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <h3 className="text-sm font-medium text-gray-900 dark:text-white">All caught up! 🎉</h3>
                                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                No members have missed contributions at this time.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const DisasterPaymentsTable = ({ disasterPayments, members }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { auth } = usePage().props;
    const user = auth?.user;
    const isAdmin = user?.role?.name === 'admin';

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Disaster Relief Payments</h2>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Emergency financial assistance provided to members
                    </p>
                </div>
                {isAdmin && (
                    <button
                        onClick={openModal}
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Payment
                    </button>
                )}
            </div>

            {/* Mobile Cards View */}
            <div className="block sm:hidden space-y-4">
                {disasterPayments.data.map(payment => (
                    <div key={payment.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm">
                        <div className="flex items-center mb-3">
                            <div className="flex-shrink-0 h-8 w-8">
                                <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                        {payment.member.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-gray-900 dark:text-white">{payment.member.name}</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{payment.date}</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-500 dark:text-gray-400">Amount:</span>
                                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                                    +{parseFloat(payment.amount).toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-500 dark:text-gray-400">Purpose:</span>
                                <span className="text-sm text-gray-900 dark:text-white">{payment.purpose || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Member</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Purpose</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {disasterPayments.data.map((payment, index) => (
                                <tr key={payment.id} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-800/50'}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-8 w-8">
                                                <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                                                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                                        {payment.member.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="ml-3">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {payment.member.name}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-medium text-green-600 dark:text-green-400">
                                            +{parseFloat(payment.amount).toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {payment.date}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {payment.purpose || 'N/A'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Empty State */}
            {disasterPayments.data.length === 0 && (
                <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No disaster payments</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        No emergency assistance payments have been recorded.
                    </p>
                </div>
            )}

            {isModalOpen && <DisasterPaymentForm members={members.data} closeModal={closeModal} />}
        </div>
    );
};

export default Financials;
