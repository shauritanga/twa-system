import React, { useState, useEffect } from 'react';
import SidebarLayout from '../../Layouts/SidebarLayout';
import { usePage, router, Link } from '@inertiajs/react';
import DisasterPaymentForm from '../../Components/DisasterPaymentForm';
import DebtForm from '../../Components/DebtForm';
import {
    CurrencyDollarIcon,
    ExclamationTriangleIcon,
    DocumentTextIcon,
    HeartIcon,
    FaceSmileIcon
} from '@heroicons/react/24/outline';
import { LiaCoinsSolid } from "react-icons/lia";

const Financials = ({ members, allMembers, monthlyContributionsByMonth, otherContributions, otherContributionsSummary, filters, debts, penalties, disasterPayments, penaltyStatistics, listOfShameData, statistics }) => {
    const { props } = usePage();
    const initialTab = props.tab || 'contributions';
    const [activeTab, setActiveTab] = useState(initialTab);
    const [activeContributionTab, setActiveContributionTab] = useState('monthly');

    // Currency formatting function
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-TZ', {
            style: 'currency',
            currency: 'TZS',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const tabs = [
        {
            id: 'contributions',
            name: 'Contributions',
            icon: LiaCoinsSolid,
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
            name: 'Disbursements',
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
                return (
                    <ContributionsSection
                        members={members}
                        allMembers={allMembers}
                        monthlyContributionsByMonth={monthlyContributionsByMonth}
                        otherContributions={otherContributions}
                        otherContributionsSummary={otherContributionsSummary}
                        filters={filters}
                        statistics={statistics}
                        activeContributionTab={activeContributionTab}
                        setActiveContributionTab={setActiveContributionTab}
                    />
                );
            case 'debts':
                return <DebtsTable debts={debts} members={allMembers} />;
            case 'penalties':
                return <PenaltiesTable penalties={penalties} />;
            case 'disaster-payments':
                return <DisasterPaymentsTable disasterPayments={disasterPayments} members={allMembers} allMembers={allMembers} />;
            case 'list-of-shame':
                return <ListOfShame listOfShameData={listOfShameData} />;
            default:
                return null;
        }
    };

    return (
        <SidebarLayout>
            {/* Enhanced Page Header with Gradient Background */}
            <div className="relative mb-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 opacity-10 dark:opacity-20"></div>
                <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center mb-3">
                                <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg mr-4">
                                    <LiaCoinsSolid className="h-8 w-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                                        Financial Management
                                    </h1>
                                    <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">
                                        Comprehensive financial tracking and management system
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="hidden lg:block">
                            <div className="flex items-center space-x-6">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                        {statistics?.active_members || 0}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">Active Members</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                        {statistics?.contributors || 0}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">Contributors</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                                        {debts?.data?.filter(d => d.status === 'unpaid').length || 0}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">Outstanding</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Tab Navigation with Modern Design */}
            <div className="mb-8">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-2">
                    <nav className="flex space-x-1 overflow-x-auto scrollbar-hide">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                                        group relative inline-flex items-center py-3 px-6 font-medium text-sm whitespace-nowrap rounded-xl
                                        transition-all duration-300 transform hover:scale-105
                                        ${isActive
                                            ? `${tab.bgColor} ${tab.color} shadow-lg`
                                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                        }
                                    `}
                                >
                                    <Icon className={`
                                        -ml-0.5 mr-3 h-5 w-5 transition-all duration-300
                                        ${isActive ? `${tab.color} transform rotate-12` : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400'}
                                    `} />
                                    <span className="hidden sm:inline font-semibold">{tab.name}</span>
                                    <span className="sm:hidden font-semibold">{tab.name.split(' ')[0]}</span>
                                    {isActive && (
                                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                                    )}
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* Enhanced Content Area with Modern Styling */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden backdrop-blur-sm">
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 dark:from-blue-900/10 dark:via-transparent dark:to-purple-900/10"></div>
                    <div className="relative">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
};

import { useForm } from '@inertiajs/react';
import ImportModal from '../../Components/ImportModal';
import Modal from '../../Components/Modal';
import InputLabel from '../../Components/InputLabel';
import TextInput from '../../Components/TextInput';
import InputError from '../../Components/InputError';

const ContributionForm = ({ members, closeModel, defaultType = 'monthly' }) => {
    const { props } = usePage();
    const settings = props.settings || {};

    // Get monthly contribution amount from settings
    const monthlyContributionAmount = settings.monthly_contribution_amount
        ? settings.monthly_contribution_amount.value
        : '50000';

    // Currency formatting function
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-TZ', {
            style: 'currency',
            currency: 'TZS',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const { data, setData, post, processing, errors } = useForm({
        member_id: '',
        type: defaultType, // Use defaultType prop
        amount: defaultType === 'monthly' ? monthlyContributionAmount : '',
        date: new Date().toISOString().split('T')[0], // Today's date
        purpose: defaultType === 'monthly' ? 'Monthly Contribution' : '',
        notes: '',
    });

    // Handle contribution type change
    const handleTypeChange = (type) => {
        setData(prevData => ({
            ...prevData,
            type: type,
            amount: type === 'monthly' ? monthlyContributionAmount : '',
            purpose: type === 'monthly' ? 'Monthly Contribution' : '',
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('contributions.store'), {
            onSuccess: () => closeModel(),
        });
    };

    return (
        <Modal show={true} onClose={closeModel} title="Add Contribution" maxWidth="lg">
            <div className="flex flex-col h-[600px]"> {/* Fixed height container */}
                {/* Form Header - Fixed */}
                <div className="flex-shrink-0 px-6 pt-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <div className="flex items-center">
                            <svg className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                            <div className="min-w-0">
                                <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                    {data.type === 'monthly' ? 'Monthly Contribution' : 'Other Contribution'}
                                </h4>
                                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                                    {data.type === 'monthly'
                                        ? 'System handles multiple payments and advance payments automatically.'
                                        : 'Record special projects, donations, etc.'
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scrollable Form Content */}
                <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
                    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5"> {/* Scrollable content */}
                        {/* Contribution Type Selector */}
                        <div>
                            <InputLabel htmlFor="type" value="Contribution Type" className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2" />
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => handleTypeChange('monthly')}
                                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${data.type === 'monthly'
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-blue-300 dark:hover:border-blue-600'
                                        }`}
                                >
                                    <div className="text-center">
                                        <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <div className="font-medium">Monthly</div>
                                        <div className="text-xs opacity-75">Regular monthly contribution</div>
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleTypeChange('other')}
                                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${data.type === 'other'
                                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-green-300 dark:hover:border-green-600'
                                        }`}
                                >
                                    <div className="text-center">
                                        <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        <div className="font-medium">Other</div>
                                        <div className="text-xs opacity-75">Special projects, donations</div>
                                    </div>
                                </button>
                            </div>
                            <InputError message={errors.type} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="member_id" value="Member" className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2" />
                            <select
                                id="member_id"
                                value={data.member_id}
                                onChange={e => setData('member_id', e.target.value)}
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-xl shadow-sm transition-all duration-200"
                            >
                                <option value="">Select Member</option>
                                {members.map(member => (
                                    <option key={member.id} value={member.id}>{member.name}</option>
                                ))}
                            </select>
                            <InputError message={errors.member_id} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="amount" value="Amount (TZS)" className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2" />
                            <div className="relative">
                                <TextInput
                                    id="amount"
                                    type="number"
                                    step="0.01"
                                    value={data.amount}
                                    onChange={e => setData('amount', e.target.value)}
                                    placeholder={data.type === 'monthly' ? 'Amount (adjustable)' : 'Enter contribution amount'}
                                    className="mt-1 block w-full px-12 py-3 rounded-xl shadow-sm transition-all duration-200"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">TZS</span>
                                </div>
                            </div>
                            {data.type === 'monthly' ? (
                                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 flex items-center">
                                    <svg className="w-3 h-3 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Monthly: {formatCurrency(monthlyContributionAmount)} • Smart distribution enabled
                                </p>
                            ) : (
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                    Enter amount for special contribution
                                </p>
                            )}
                            <InputError message={errors.amount} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="date" value="Date" className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2" />
                            <TextInput
                                id="date"
                                type="date"
                                value={data.date}
                                onChange={e => setData('date', e.target.value)}
                                className="mt-1 block w-full px-4 py-3 rounded-xl shadow-sm transition-all duration-200"
                            />
                            <InputError message={errors.date} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="purpose" value="Purpose" className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2" />
                            <TextInput
                                id="purpose"
                                type="text"
                                value={data.purpose}
                                onChange={e => setData('purpose', e.target.value)}
                                placeholder={data.type === 'monthly' ? 'Monthly Contribution' : 'Enter purpose (e.g., Building Fund, Equipment)'}
                                className="mt-1 block w-full px-4 py-3 rounded-xl shadow-sm transition-all duration-200"
                            />
                            <InputError message={errors.purpose} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="notes" value="Notes (Optional)" className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2" />
                            <textarea
                                id="notes"
                                value={data.notes}
                                onChange={e => setData('notes', e.target.value)}
                                placeholder="Additional notes about this contribution..."
                                rows={3}
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-xl shadow-sm transition-all duration-200 resize-none"
                            />
                            <InputError message={errors.notes} className="mt-2" />
                        </div>

                    </div>

                    {/* Fixed Footer */}
                    <div className="flex-shrink-0 px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={closeModel}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? (
                                    <div className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating...
                                    </div>
                                ) : (
                                    'Add Contribution'
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

// New ContributionsSection with tabbed interface
const ContributionsSection = ({ members, allMembers, monthlyContributionsByMonth, otherContributions, otherContributionsSummary, filters, statistics, activeContributionTab, setActiveContributionTab }) => {

    const renderContributionContent = () => {
        switch (activeContributionTab) {
            case 'monthly':
                return (
                    <MonthlyContributionsTable
                        members={members}
                        allMembers={allMembers}
                        contributionsByMonth={monthlyContributionsByMonth}
                        filters={filters}
                        statistics={statistics}
                    />
                );
            case 'other':
                return (
                    <OtherContributionsTable
                        otherContributions={otherContributions}
                        otherContributionsSummary={otherContributionsSummary}
                        allMembers={allMembers}
                        filters={filters}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="p-8">
            {/* Enhanced Header with Statistics */}
            <div className="mb-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg mr-4">
                            <LiaCoinsSolid className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                                Member Contributions
                            </h2>
                            <p className="mt-1 text-gray-600 dark:text-gray-400">
                                {(() => {
                                    const { auth } = usePage().props;
                                    const user = auth?.user;
                                    const isAdmin = user?.role?.name === 'admin';
                                    return isAdmin
                                        ? "Track monthly contributions and special projects"
                                        : "View monthly contributions and special projects (Read-only access)";
                                })()}
                            </p>
                        </div>
                    </div>

                    {/* Enhanced Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Monthly Contributions</p>
                                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                                        {new Intl.NumberFormat('en-TZ', {
                                            style: 'currency',
                                            currency: 'TZS',
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 0,
                                        }).format(statistics.monthly_contributions || 0)}
                                    </p>
                                    <p className="text-xs text-blue-500 dark:text-blue-400">
                                        {statistics.monthly_compliance || 0}% Compliance
                                    </p>
                                </div>
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-green-600 dark:text-green-400">Other Contributions</p>
                                    <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                                        {new Intl.NumberFormat('en-TZ', {
                                            style: 'currency',
                                            currency: 'TZS',
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 0,
                                        }).format(statistics.other_contributions || 0)}
                                    </p>
                                    <p className="text-xs text-green-500 dark:text-green-400">
                                        {otherContributionsSummary?.length || 0} Projects
                                    </p>
                                </div>
                                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-xl border border-purple-200 dark:border-purple-800">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Total Contributions</p>
                                    <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                                        {new Intl.NumberFormat('en-TZ', {
                                            style: 'currency',
                                            currency: 'TZS',
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 0,
                                        }).format(statistics.total_contributions || 0)}
                                    </p>
                                    <p className="text-xs text-purple-500 dark:text-purple-400">
                                        {statistics.contributors || 0} Contributors
                                    </p>
                                </div>
                                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contribution Type Tabs */}
            <div className="mb-6">
                {(() => {
                    const { auth } = usePage().props;
                    const user = auth?.user;
                    const isAdmin = user?.role?.name === 'admin';
                    return !isAdmin && (
                        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                                    You have view-only access to contributions. Only administrators can add or modify contributions.
                                </span>
                            </div>
                        </div>
                    );
                })()}
                <div className="border-b border-gray-200 dark:border-gray-700">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setActiveContributionTab('monthly')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${activeContributionTab === 'monthly'
                                ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                }`}
                        >
                            <div className="flex items-center space-x-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>Monthly Contributions</span>
                                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full">
                                    {statistics.monthly_compliance || 0}% Compliance
                                </span>
                            </div>
                        </button>

                        <button
                            onClick={() => setActiveContributionTab('other')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${activeContributionTab === 'other'
                                ? 'border-green-500 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                }`}
                        >
                            <div className="flex items-center space-x-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                <span>Other Contributions</span>
                                <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded-full">
                                    {otherContributionsSummary?.length || 0} Projects
                                </span>
                            </div>
                        </button>
                    </nav>
                </div>
            </div>

            {/* Tab Content */}
            {renderContributionContent()}
        </div>
    );
};

// Renamed original ContributionsTable to MonthlyContributionsTable
const MonthlyContributionsTable = ({ members, allMembers, contributionsByMonth, filters, statistics }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const { auth } = usePage().props;
    const user = auth?.user;
    const isAdmin = user?.role?.name === 'admin';

    // Currency formatting function
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-TZ', {
            style: 'currency',
            currency: 'TZS',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

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
        <div className="p-8">
            {/* Enhanced Header Section with Statistics */}
            <div className="mb-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg mr-4">
                            <LiaCoinsSolid className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                                Member Contributions
                            </h2>
                            <p className="mt-1 text-gray-600 dark:text-gray-400">
                                Track monthly contributions across all members
                            </p>
                        </div>
                    </div>

                    {/* Quick Stats Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                {statistics?.total_members || 0}
                            </div>
                            <div className="text-sm text-green-700 dark:text-green-300">Total Members</div>
                        </div>
                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                {statistics?.contributors || 0}
                            </div>
                            <div className="text-sm text-blue-700 dark:text-blue-300">Contributors</div>
                        </div>
                        <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
                            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                {year}
                            </div>
                            <div className="text-sm text-purple-700 dark:text-purple-300">Current Year</div>
                        </div>
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
                            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                                {month ? months.find(m => m.value == month)?.label.substring(0, 3) : 'All'}
                            </div>
                            <div className="text-sm text-amber-700 dark:text-amber-300">Filter Month</div>
                        </div>
                    </div>
                </div>

                {/* Enhanced Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    {/* Export Dropdown with Modern Design */}
                    <div className="relative">
                        <button
                            onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border border-gray-300 dark:border-gray-600 rounded-xl shadow-lg text-sm font-semibold text-gray-700 dark:text-gray-300 hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-600 dark:hover:to-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Export Data
                            <svg className="w-4 h-4 ml-2 transition-transform duration-200" fill="currentColor" viewBox="0 0 20 20" style={{ transform: isExportDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>

                        {isExportDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-56 rounded-xl shadow-2xl bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-20 border border-gray-200 dark:border-gray-700">
                                <div className="py-2">
                                    <a href={route('contributions.export', { format: 'pdf', search, year, month })}
                                        className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 group">
                                        <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg mr-3 group-hover:bg-red-200 dark:group-hover:bg-red-900/50 transition-colors duration-200">
                                            <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="font-medium">Export as PDF</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">Formatted document</div>
                                        </div>
                                    </a>
                                    <a href={route('contributions.export', { format: 'xlsx', search, year, month })}
                                        className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors duration-200 group">
                                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg mr-3 group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors duration-200">
                                            <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="font-medium">Export as Excel</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">Spreadsheet format</div>
                                        </div>
                                    </a>
                                    <a href={route('contributions.export', { format: 'csv', search, year, month })}
                                        className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200 group">
                                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors duration-200">
                                            <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="font-medium">Export as CSV</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">Raw data format</div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>

                    {isAdmin && (
                        <>
                            <button
                                onClick={() => setIsImportModalOpen(true)}
                                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-300 dark:border-blue-600 rounded-xl shadow-lg text-sm font-semibold text-blue-700 dark:text-blue-300 hover:from-blue-100 hover:to-cyan-100 dark:hover:from-blue-900/30 dark:hover:to-cyan-900/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                                </svg>
                                Import Data
                            </button>
                            <button
                                onClick={openModal}
                                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-semibold rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Add Contribution
                            </button>
                        </>
                    )}
                </div>
            </div>
            {/* Enhanced Filters Section */}
            <div className="bg-gradient-to-r from-gray-50 via-white to-gray-50 dark:from-gray-800/50 dark:via-gray-800/30 dark:to-gray-800/50 rounded-2xl p-6 mb-8 border border-gray-200 dark:border-gray-700 shadow-lg">
                <div className="flex items-center mb-4">
                    <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg mr-3">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filter & Search</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
                    <div className="lg:col-span-5">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                            Search Members
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search by member name..."
                                className="block w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all duration-200"
                            />
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                            Year
                        </label>
                        <select
                            value={year}
                            onChange={e => setYear(e.target.value)}
                            className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all duration-200"
                        >
                            {years.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>

                    <div className="lg:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                            Month
                        </label>
                        <select
                            value={month}
                            onChange={e => setMonth(e.target.value)}
                            className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all duration-200"
                        >
                            <option value="">All Months</option>
                            {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                        </select>
                    </div>

                    <div className="lg:col-span-3 flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={handleFilterChange}
                            className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-semibold rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                            </svg>
                            Apply
                        </button>
                        <button
                            onClick={clearFilter}
                            className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border border-gray-300 dark:border-gray-600 rounded-xl shadow-lg text-sm font-semibold text-gray-700 dark:text-gray-300 hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-600 dark:hover:to-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300 transform hover:scale-105"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Clear
                        </button>
                    </div>
                </div>
            </div>
            {/* Enhanced Contributions Table */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800">
                            <tr>
                                <th scope="col" className="sticky left-0 z-10 bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 px-6 py-5 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-r border-gray-300 dark:border-gray-600 shadow-sm">
                                    <div className="flex items-center">
                                        <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                        </svg>
                                        Member
                                    </div>
                                </th>
                                {months.map(m => (
                                    <th key={m.value} scope="col" className="px-4 py-5 text-center text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider min-w-[120px] border-r border-gray-200 dark:border-gray-600 last:border-r-0">
                                        <div className="flex flex-col items-center">
                                            <div className="p-2 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-lg mb-1">
                                                <span className="hidden sm:inline text-indigo-700 dark:text-indigo-300 font-semibold">{m.label}</span>
                                                <span className="sm:hidden text-indigo-700 dark:text-indigo-300 font-semibold">{m.label.substring(0, 3)}</span>
                                            </div>
                                            <span className="text-gray-500 dark:text-gray-400 font-normal text-xs">{year}</span>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {members.data.map((member, memberIndex) => (
                                <tr key={member.id} className={`transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 ${memberIndex % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50/50 dark:bg-gray-800/50'}`}>
                                    <td className="sticky left-0 z-10 bg-inherit px-6 py-5 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-700 shadow-sm">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center ring-2 ring-indigo-200 dark:ring-indigo-800">
                                                    <span className="text-sm font-bold text-indigo-700 dark:text-indigo-300">
                                                        {member.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                                    {member.name}
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    ID: {member.id}
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
                                            <td key={month.value} className="px-4 py-5 whitespace-nowrap text-center border-r border-gray-200 dark:border-gray-600 last:border-r-0">
                                                <div className="flex flex-col items-center space-y-2">
                                                    {amount > 0 ? (
                                                        <>
                                                            <div className="flex items-center space-x-2">
                                                                <div className="p-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                                                                    <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                    </svg>
                                                                </div>
                                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 dark:from-green-900/20 dark:to-emerald-900/20 dark:text-green-400 border border-green-200 dark:border-green-800">
                                                                    {formatCurrency(amount)}
                                                                </span>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="flex items-center space-x-2">
                                                                <div className="p-1 bg-red-100 dark:bg-red-900/30 rounded-full">
                                                                    <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                                    </svg>
                                                                </div>
                                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-red-100 to-pink-100 text-red-800 dark:from-red-900/20 dark:to-pink-900/20 dark:text-red-400 border border-red-200 dark:border-red-800">
                                                                    Not Paid
                                                                </span>
                                                            </div>
                                                        </>
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
            {/* Enhanced Pagination */}
            {members.links && members.links.length > 3 && (
                <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex-1 flex justify-between sm:hidden">
                            {members.links.find(link => link.label.includes('Previous')) && (
                                <a
                                    href={members.links.find(link => link.label.includes('Previous')).url}
                                    className="relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border border-gray-300 dark:border-gray-600 text-sm font-semibold rounded-xl text-gray-700 dark:text-gray-300 hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all duration-300 transform hover:scale-105"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Previous
                                </a>
                            )}
                            {members.links.find(link => link.label.includes('Next')) && (
                                <a
                                    href={members.links.find(link => link.label.includes('Next')).url}
                                    className="ml-3 relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border border-gray-300 dark:border-gray-600 text-sm font-semibold rounded-xl text-gray-700 dark:text-gray-300 hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all duration-300 transform hover:scale-105"
                                >
                                    Next
                                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </a>
                            )}
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div className="flex items-center">
                                <div className="p-2 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-lg mr-3">
                                    <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Showing <span className="font-bold text-indigo-600 dark:text-indigo-400">{members.from || 0}</span> to{' '}
                                        <span className="font-bold text-indigo-600 dark:text-indigo-400">{members.to || 0}</span> of{' '}
                                        <span className="font-bold text-indigo-600 dark:text-indigo-400">{members.total || 0}</span> results
                                    </p>
                                </div>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-xl shadow-lg overflow-hidden" aria-label="Pagination">
                                    {members.links.map((link, index) => (
                                        <a
                                            key={index}
                                            href={link.url}
                                            className={`relative inline-flex items-center px-4 py-3 border text-sm font-semibold transition-all duration-300 ${link.active
                                                ? 'z-10 bg-gradient-to-r from-indigo-600 to-purple-600 border-indigo-500 text-white shadow-lg transform scale-105'
                                                : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-600 dark:hover:to-gray-500 hover:scale-105'
                                                } ${index === 0 ? 'rounded-l-xl' : ''
                                                } ${index === members.links.length - 1 ? 'rounded-r-xl' : ''
                                                }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {isModalOpen && <ContributionForm members={allMembers || members.data} closeModel={closeModal} />}
            {isImportModalOpen && (
                <ImportModal
                    isOpen={isImportModalOpen}
                    onClose={() => setIsImportModalOpen(false)}
                    onImport={handleImport}
                />
            )}
        </div>
    );
};

const DebtsTable = ({ debts, members }) => {
    const [showDebtForm, setShowDebtForm] = useState(false);

    // Currency formatting function
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-TZ', {
            style: 'currency',
            currency: 'TZS',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const handleMarkAsPaid = (id) => {
        router.patch(route('debts.markAsPaid', id));
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Outstanding Debts</h2>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Manage and track member debts and payment status
                    </p>
                </div>
                <div className="mt-4 sm:mt-0">
                    <button
                        onClick={() => setShowDebtForm(true)}
                        className="inline-flex items-center px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                        <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
                        Add Debt
                    </button>
                </div>
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
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${debt.status === 'paid'
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
                                    {formatCurrency(parseFloat(debt.amount))}
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
                                        {formatCurrency(parseFloat(debt.amount))}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {debt.reason}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {debt.due_date}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${debt.status === 'paid'
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

            {/* Debt Form Modal */}
            <DebtForm
                isOpen={showDebtForm}
                onClose={() => setShowDebtForm(false)}
                members={members}
            />
        </div>
    );
};

const PenaltiesTable = ({ penalties }) => {
    // Currency formatting function
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-TZ', {
            style: 'currency',
            currency: 'TZS',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

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
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${penalty.status === 'paid'
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
                                    {formatCurrency(parseFloat(penalty.amount))}
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
                                        {formatCurrency(parseFloat(penalty.amount))}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {penalty.reason}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {penalty.due_date}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${penalty.status === 'paid'
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

// Other Contributions Table Component
const OtherContributionsTable = ({ otherContributions, otherContributionsSummary, allMembers, filters }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { auth } = usePage().props;
    const user = auth?.user;
    const isAdmin = user?.role?.name === 'admin';

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-TZ', {
            style: 'currency',
            currency: 'TZS',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {otherContributionsSummary?.map((summary, index) => (
                    <div key={index} className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-green-600 dark:text-green-400 truncate">
                                    {summary.purpose}
                                </p>
                                <p className="text-xl font-bold text-green-900 dark:text-green-100">
                                    {formatCurrency(summary.total)}
                                </p>
                                <p className="text-xs text-green-500 dark:text-green-400">
                                    {summary.count} contribution{summary.count !== 1 ? 's' : ''}
                                </p>
                            </div>
                            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Other Contributions History
                    </h3>
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm px-3 py-1 rounded-full">
                        {otherContributions?.total || 0} total
                    </span>
                </div>
                {isAdmin && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-sm font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Other Contribution
                    </button>
                )}
            </div>

            {/* Contributions Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-900/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Member
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Purpose
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Notes
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {otherContributions?.data?.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center">
                                            <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                                                No other contributions yet
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                                {isAdmin
                                                    ? "Start by adding contributions for special projects, building funds, or donations."
                                                    : "No special project contributions have been recorded yet."
                                                }
                                            </p>
                                            {isAdmin && (
                                                <button
                                                    onClick={() => setIsModalOpen(true)}
                                                    className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg"
                                                >
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                    </svg>
                                                    Add First Contribution
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                otherContributions?.data?.map((contribution) => (
                                    <tr key={contribution.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            {new Date(contribution.date).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-8 w-8">
                                                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center">
                                                        <span className="text-xs font-medium text-white">
                                                            {contribution.member?.name?.charAt(0) || 'M'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="ml-3">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {contribution.member?.name || 'Unknown Member'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200">
                                                {contribution.purpose}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                            {formatCurrency(contribution.amount)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                                            {contribution.notes || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {isAdmin ? (
                                                <>
                                                    <button className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-200 mr-3">
                                                        View
                                                    </button>
                                                    <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200">
                                                        Delete
                                                    </button>
                                                </>
                                            ) : (
                                                <span className="text-gray-400 dark:text-gray-500 text-xs">
                                                    View Only
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {otherContributions?.links && otherContributions.links.length > 3 && (
                    <div className="bg-white dark:bg-gray-800 px-4 py-3 border-t border-gray-200 dark:border-gray-700 sm:px-6">
                        <div className="flex items-center justify-between">
                            <div className="flex-1 flex justify-between sm:hidden">
                                {otherContributions.prev_page_url && (
                                    <Link
                                        href={otherContributions.prev_page_url}
                                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        Previous
                                    </Link>
                                )}
                                {otherContributions.next_page_url && (
                                    <Link
                                        href={otherContributions.next_page_url}
                                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        Next
                                    </Link>
                                )}
                            </div>
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        Showing <span className="font-medium">{otherContributions.from || 0}</span> to{' '}
                                        <span className="font-medium">{otherContributions.to || 0}</span> of{' '}
                                        <span className="font-medium">{otherContributions.total || 0}</span> results
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                        {otherContributions.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${link.active
                                                    ? 'z-10 bg-green-50 border-green-500 text-green-600 dark:bg-green-900/20 dark:border-green-400 dark:text-green-200'
                                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
                                                    } ${index === 0 ? 'rounded-l-md' : ''
                                                    } ${index === otherContributions.links.length - 1 ? 'rounded-r-md' : ''
                                                    }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Add Contribution Modal */}
            {isModalOpen && (
                <ContributionForm
                    members={allMembers}
                    closeModel={() => setIsModalOpen(false)}
                    defaultType="other"
                />
            )}
        </div>
    );
};

const ListOfShame = ({ listOfShameData }) => {
    const { props } = usePage();

    // Currency formatting function
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-TZ', {
            style: 'currency',
            currency: 'TZS',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // Use optimized data from backend
    const shameList = listOfShameData || [];

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
                        missed contributions starting from each member's join date.
                    </p>
                </div>
            </div>

            {/* Mobile Cards View */}
            <div className="block lg:hidden space-y-4">
                {shameList.length > 0 ? (
                    shameList.map(item => (
                        <div key={item.member.id} className="bg-white dark:bg-gray-800 border-l-4 border-red-500 rounded-lg p-4 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10">
                                        <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                                            <span className="text-sm font-medium text-red-600 dark:text-red-400">
                                                {item.member.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">{item.member.name}</h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{item.member.phone_number || 'No phone'}</p>
                                    </div>
                                </div>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                                    {item.missed_months_count} months
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">Penalties:</span>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {formatCurrency(item.total_penalties)}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">Total to Clear:</span>
                                    <p className="text-sm font-bold text-red-600 dark:text-red-400">
                                        {formatCurrency(item.total_owed)}
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
                                shameList.map((item, index) => (
                                    <tr key={item.member.id} className={`${index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-800/50'} border-l-4 border-red-500`}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-8 w-8">
                                                    <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                                                        <span className="text-sm font-medium text-red-600 dark:text-red-400">
                                                            {item.member.name.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="ml-3">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {item.member.name}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {item.member.phone_number || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                                                {item.missed_months_count} months
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900 dark:text-white">
                                            {formatCurrency(item.total_penalties)}
                                            {item.total_penalties === 0 && (
                                                <span className="block text-xs text-gray-400">No penalties</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-red-600 dark:text-red-400">
                                            {formatCurrency(item.total_owed)}
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

const DisasterPaymentsTable = ({ disasterPayments, members, allMembers }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { auth } = usePage().props;
    const user = auth?.user;
    const isAdmin = user?.role?.name === 'admin';

    // Currency formatting function
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-TZ', {
            style: 'currency',
            currency: 'TZS',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Relief Payments</h2>
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
                                    +{formatCurrency(parseFloat(payment.amount))}
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
                                            +{formatCurrency(parseFloat(payment.amount))}
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

            {isModalOpen && <DisasterPaymentForm members={allMembers || members} closeModal={closeModal} />}
        </div>
    );
};

export default Financials;
