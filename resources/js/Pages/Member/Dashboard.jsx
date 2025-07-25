import React from 'react';
import { usePage } from '@inertiajs/react';
import SidebarLayout from '../../Layouts/SidebarLayout';
import { MonthlyComparisonChart, ContributionsComparisonChart } from './Charts';
import { BanknotesIcon, ArrowTrendingDownIcon, ExclamationTriangleIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

const InfoCard = ({ title, items, renderItem, viewAllLink }) => (
    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg mb-6 flex flex-col">
        <div className="p-5 flex-grow">
            <h2 className="text-xl font-semibold mb-2 dark:text-white">{title}</h2>
            <ul className="dark:text-gray-300">
                {items && items.length > 0 ? items.slice(0, 5).map(renderItem) : <li>No items to display.</li>}
            </ul>
        </div>
        {viewAllLink && (
            <div className="p-5 border-t border-gray-200 dark:border-gray-700">
                <a href={viewAllLink} className="text-blue-500 hover:text-blue-600">View All</a>
            </div>
        )}
    </div>
);

const StatCard = ({ title, value, icon }) => (
    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg p-5 flex items-center">
        <div className="flex-shrink-0">{icon}</div>
        <div className="ml-5 w-0 flex-1">
            <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 truncate">{title}</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
    </div>
);

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-TZ', {
        style: 'currency',
        currency: 'TZS',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

export default function MemberDashboard({ contributions, debts, penalties, dependents, certificates, memberContributions, otherContributions, recentDisasterPayments, monthlyContributions, monthlyDisasterPayments, recentDocuments }) {
    const { auth } = usePage().props;

    if (!auth.user.member) {
        return (
            <SidebarLayout>
                <div className="flex justify-center items-center h-full">
                    <p className="text-lg text-gray-500 dark:text-gray-400">Loading member data...</p>
                </div>
            </SidebarLayout>
        );
    }

    const memberId = auth.user.member.id;

    const totalContributions = contributions.reduce((acc, c) => acc + c.amount, 0);
    const totalDebts = debts.reduce((acc, d) => acc + d.amount, 0);
    const totalPenalties = penalties.reduce((acc, p) => acc + p.amount, 0);

    return (
        <SidebarLayout>
            <h1 className="text-2xl font-bold mb-4 dark:text-white">Member Dashboard</h1>
            <p className="mb-6 dark:text-gray-300">Welcome to your dashboard. Here you can view your contributions, debts, penalties, dependents, and certificates.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatCard title="Total Contributions" value={formatCurrency(totalContributions)} icon={<BanknotesIcon className="h-8 w-8 text-green-500" />} />
                <StatCard title="Total Group Contributions" value={formatCurrency(otherContributions)} icon={<ClipboardDocumentListIcon className="h-8 w-8 text-blue-500" />} />
                <StatCard title="Outstanding Debts" value={formatCurrency(totalDebts)} icon={<ArrowTrendingDownIcon className="h-8 w-8 text-red-500" />} />
                <StatCard title="Total Penalties" value={formatCurrency(totalPenalties)} icon={<ExclamationTriangleIcon className="h-8 w-8 text-yellow-500" />} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg p-5 h-[480px]">
                    <h2 className="text-xl font-semibold mb-2 dark:text-white">Monthly Comparison</h2>
                    <MonthlyComparisonChart monthlyContributions={monthlyContributions} monthlyDisasterPayments={monthlyDisasterPayments} />
                </div>
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg p-5 h-[480px]">
                    <h2 className="text-xl font-semibold mb-2 dark:text-white">Contributions Comparison</h2>
                    <div className="w-full h-full flex items-center justify-center">
                        <ContributionsComparisonChart memberContributions={memberContributions} otherContributions={otherContributions} />
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <InfoCard
                    title="Recent Contributions"
                    items={contributions}
                    renderItem={c => (
                        <li key={c.id}>{formatCurrency(c.amount)} on {c.date} ({c.purpose})</li>
                    )}
                    viewAllLink={route('financials.index')}
                />
                <InfoCard
                    title="Outstanding Debts"
                    items={debts}
                    renderItem={d => (
                        <li key={d.id}>{formatCurrency(d.amount)} due {d.due_date} ({d.reason})</li>
                    )}
                    viewAllLink={route('financials.index')}
                />
                <InfoCard
                    title="Recent Penalties"
                    items={penalties}
                    renderItem={p => (
                        <li key={p.id}>{formatCurrency(p.amount)} due {p.due_date} ({p.reason})</li>
                    )}
                    viewAllLink={route('financials.index')}
                />
                <InfoCard
                    title="Recent Documents"
                    items={recentDocuments}
                    renderItem={d => (
                        <li key={d.id} className="flex items-center justify-between py-2">
                            <div className="flex-1">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                    {d.title}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {d.category_display} • {new Date(d.created_at).toLocaleDateString()}
                                </div>
                            </div>
                            <a
                                href={route('member.documents.show', d.id)}
                                className="text-blue-500 hover:text-blue-600 text-xs"
                            >
                                View
                            </a>
                        </li>
                    )}
                    viewAllLink={route('member.documents.index')}
                />
            </div>
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg p-5 mt-6">
                <h2 className="text-xl font-semibold mb-2 dark:text-white">Recent Disaster Payments</h2>
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Member</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {recentDisasterPayments.map(payment => (
                            <tr key={payment.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{payment.member.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{formatCurrency(payment.amount)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{payment.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </SidebarLayout>
    );
}
