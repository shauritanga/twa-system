import React, { useState, useEffect } from 'react';
import SidebarLayout from '../../Layouts/SidebarLayout';

const Financials = ({ members, contributionsByMonth, filters, debts, penalties, disasterPayments }) => {
    const { props } = usePage();
    const initialTab = props.tab || 'contributions';
    const [activeTab, setActiveTab] = useState(initialTab);

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
            <div className="flex border-b border-gray-200 dark:border-gray-700">
                <button onClick={() => setActiveTab('contributions')} className={`py-2 px-4 text-gray-500 dark:text-gray-400 ${activeTab === 'contributions' ? 'border-b-2 border-blue-500' : ''}`}>Contributions</button>
                <button onClick={() => setActiveTab('debts')} className={`py-2 px-4 text-gray-500 dark:text-gray-400 ${activeTab === 'debts' ? 'border-b-2 border-blue-500' : ''}`}>Debts</button>
                <button onClick={() => setActiveTab('penalties')} className={`py-2 px-4 text-gray-500 dark:text-gray-400 ${activeTab === 'penalties' ? 'border-b-2 border-blue-500' : ''}`}>Penalties</button>
                <button onClick={() => setActiveTab('disaster-payments')} className={`py-2 px-4 text-gray-500 dark:text-gray-400 ${activeTab === 'disaster-payments' ? 'border-b-2 border-blue-500' : ''}`}>Disaster Payments</button>
                <button onClick={() => setActiveTab('list-of-shame')} className={`py-2 px-4 text-gray-500 dark:text-gray-400 ${activeTab === 'list-of-shame' ? 'border-b-2 border-blue-500' : ''}`}>List of Shame</button>
            </div>
            <div className="p-4">
                {renderContent()}
            </div>
        </SidebarLayout>
    );
};

import { router, useForm, usePage } from '@inertiajs/react';
import ImportModal from '../../Components/ImportModal';

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
        <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <form onSubmit={handleSubmit}>
                        <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Add Contribution</h3>
                            <div className="mt-2">
                                <select value={data.member_id} onChange={e => setData('member_id', e.target.value)} className="w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white">
                                    <option value="">Select Member</option>
                                    {members.map(member => (
                                        <option key={member.id} value={member.id}>{member.name}</option>
                                    ))}
                                </select>
                                {errors.member_id && <div className="text-red-500">{errors.member_id}</div>}
                                <input type="date" value={data.date} onChange={e => setData('date', e.target.value)} className="w-full mt-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white" />
                                {errors.date && <div className="text-red-500">{errors.date}</div>}
                                <input type="text" value={data.purpose} onChange={e => setData('purpose', e.target.value)} placeholder="Purpose" className="w-full mt-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white" />
                                {errors.purpose && <div className="text-red-500">{errors.purpose}</div>}
                            </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button type="submit" disabled={processing} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm">
                                Create
                            </button>
                            <button type="button" onClick={closeModel} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
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

    useEffect(() => {
        setYear(filters.year || new Date().getFullYear());
        setMonth(filters.month || '');
        setSearch(filters.search || '');
    }, [filters]);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleFilterChange = () => {
        router.get('/financials', { search, year, month }, { preserveState: true });
    };

    const handleImport = (file) => {
        const formData = new FormData();
        formData.append('file', file);
        router.post('/contributions/import', formData, {
            onSuccess: () => setIsImportModalOpen(false),
        });
    };

    const clearFilter = () => {
        router.get('/financials');
    };

    const months = Array.from({ length: 12 }, (_, i) => {
        const month = new Date(null, i + 1, null).toLocaleDateString('en', { month: 'long' });
        return { value: i + 1, label: month };
    });

    const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Contributions</h1>
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
                                    <a href={route('contributions.export', { format: 'pdf', search, year, month })} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600" role="menuitem">PDF</a>
                                    <a href={route('contributions.export', { format: 'xlsx', search, year, month })} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600" role="menuitem">Excel</a>
                                    <a href={route('contributions.export', { format: 'csv', search, year, month })} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600" role="menuitem">CSV</a>
                                </div>
                            </div>
                        )}
                    </div>
                    {isAdmin && <button onClick={() => setIsImportModalOpen(true)} className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md ml-2">Import</button>}
                    {isAdmin && <button onClick={openModal} className="bg-indigo-600 text-white px-4 py-2 rounded-md ml-4">Add Contribution</button>}
                </div>
            </div>
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name..." className="border rounded p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white" />
                    <select value={year} onChange={e => setYear(e.target.value)} className="border rounded p-2 ml-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white">
                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                    <select value={month} onChange={e => setMonth(e.target.value)} className="border rounded p-2 ml-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white">
                        <option value="">All Months</option>
                        {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                    </select>
                    <button onClick={handleFilterChange} className="bg-blue-600 text-white px-4 py-2 rounded-md ml-2">Filter</button>
                    <button onClick={clearFilter} className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md ml-2">Clear</button>
                </div>
            </div>
            <div className="flex flex-col">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                        <div className="shadow overflow-hidden border-b border-gray-200 dark:border-gray-700 sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-800">
                                    <tr>
                                        <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Member</th>
                                        {months.map(m => (
                                            <th key={m.value} scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{m.label} {year}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {members.data.map(member => (
                                        <tr key={member.id}>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{member.name}</td>
                                            {months.map(month => {
                                                const monthIndex = new Date(Date.parse(month.label + " 1, 2012")).getMonth() + 1;
                                                const monthString = `${year}-${String(monthIndex).padStart(2, '0')}`;
                                                const contribution = contributionsByMonth[member.id]?.[monthString];
                                                return (
                                                    <td key={month.value} className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                        {contribution ? contribution.amount : '0'}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-6">
                {
                    members.links.map(link => (
                        <a key={link.label} href={link.url} dangerouslySetInnerHTML={{ __html: link.label }} className={`px-4 py-2 border dark:border-gray-700 ${link.active ? 'bg-blue-500 text-white' : 'text-gray-800 dark:text-white'}`}></a>
                    ))
                }
            </div>
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
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Member</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Reason</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Due Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
                </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {debts.data.map(debt => (
                    <tr key={debt.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{debt.member.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{debt.amount}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{debt.reason}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{debt.due_date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{debt.status}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {debt.status === 'unpaid' && (
                                <button onClick={() => handleMarkAsPaid(debt.id)} className="text-indigo-600 hover:text-indigo-900">Mark as Paid</button>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

const PenaltiesTable = ({ penalties }) => {
    const handleMarkAsPaid = (id) => {
        router.patch(route('penalties.markAsPaid', id));
    };

    return (
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Member</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Reason</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Due Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
                </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {penalties.data.map(penalty => (
                    <tr key={penalty.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{penalty.member.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{penalty.amount}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{penalty.reason}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{penalty.due_date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{penalty.status}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {penalty.status === 'unpaid' && (
                                <button onClick={() => handleMarkAsPaid(penalty.id)} className="text-indigo-600 hover:text-indigo-900">Mark as Paid</button>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

import DisasterPaymentForm from '../../Components/DisasterPaymentForm';

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
        <div>
            <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Members listed below have missed contributions for previous months up to the end of last month. They are automatically removed once all outstanding amounts are paid. 'Total to Clear' includes penalties plus missed contributions (50,000/month) starting from each member's join date.</p>
            </div>
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Phone Number</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Months Not Paid</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Penalties</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total to Clear</th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {shameList.length > 0 ? (
                        shameList.map(member => (
                            <tr key={member.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{member.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{member.phone_number || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{member.monthsNotPaid}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{member.totalPenalties.toFixed(2)}{member.totalPenalties === 0 ? ' (No penalties recorded)' : ''}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{member.totalToClear.toFixed(2)}{member.totalToClear === 0 ? ' (No outstanding amounts)' : ''}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-center">No members with missed contributions at this time.</td>
                        </tr>
                    )}
                </tbody>
            </table>
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
        <div>
            <div className="flex justify-end mb-6">
                {isAdmin && <button onClick={openModal} className="bg-indigo-600 text-white px-4 py-2 rounded-md">Add Disaster Payment</button>}
            </div>
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Member</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Purpose</th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {disasterPayments.data.map(payment => (
                        <tr key={payment.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{payment.member.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{parseFloat(payment.amount).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{payment.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{payment.purpose || 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {isModalOpen && <DisasterPaymentForm members={members.data} closeModal={closeModal} />}
        </div>
    );
};

export default Financials;
