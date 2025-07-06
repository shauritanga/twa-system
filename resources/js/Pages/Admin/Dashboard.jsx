import React from 'react';
import SidebarLayout from '../../Layouts/SidebarLayout';
import { Bar } from 'react-chartjs-2';
import { usePage, router } from '@inertiajs/react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { UserGroupIcon, CurrencyDollarIcon, ExclamationCircleIcon, ExclamationTriangleIcon, UsersIcon, BanknotesIcon, ChartBarIcon } from '@heroicons/react/24/outline';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const StatCard = ({ title, value, icon, isCurrency }) => (
    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
        <div className="p-5">
            <div className="flex items-center">
                <div className="flex-shrink-0">
                    {icon}
                </div>
                <div className="ml-5 w-0 flex-1">
                    <dl>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                            {title}
                        </dt>
                        <dd className="text-lg font-semibold text-gray-900 dark:text-white">
                            {isCurrency === true? `TZS ${value}`: value}
                        </dd>
                    </dl>
                </div>
            </div>
        </div>
    </div>
);

export default function AdminDashboard({ memberCount, contributionSum, debtSum, penaltySum, disasterPaymentSum, beneficiaryCount, dependentCount, availableAmount, monthlyContributions = [], monthlyDisasterPayments = [], monthlyDebts = [], monthlyPenalties = [], recentDisasterPayments = [] }) {
    const data = {
        labels: ['Contributions', 'Debts', 'Penalties', 'Disaster Payments'],
        datasets: [
            {
                label: 'Amount in USD',
                data: [contributionSum, debtSum, penaltySum, disasterPaymentSum],
                backgroundColor: [
                    'rgba(59, 130, 246, 0.7)',
                    'rgba(239, 68, 68, 0.7)',
                    'rgba(245, 158, 11, 0.7)',
                    'rgba(139, 92, 246, 0.7)',
                ],
                borderColor: [
                    'rgba(59, 130, 246, 1)',
                    'rgba(239, 68, 68, 1)',
                    'rgba(245, 158, 11, 1)',
                    'rgba(139, 92, 246, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
            },
        },
        plugins: {
            legend: {
                display: false,
            },
        },
    };

    const statCardData = [
        { title: 'Total Members', value: memberCount, icon: <UserGroupIcon className="w-8 h-8 text-blue-500" />, isCurrency: false },
        { title: 'Total Contributions', value: contributionSum, icon: <CurrencyDollarIcon className="w-8 h-8 text-green-500" />, isCurrency: true },
        { title: 'Total Debts', value: debtSum, icon: <ExclamationCircleIcon className="w-8 h-8 text-red-500" />, isCurrency: true },
        { title: 'Total Penalties', value: penaltySum, icon: <ExclamationTriangleIcon className="w-8 h-8 text-yellow-500" />, isCurrency: true },
        { title: 'Disaster Payments', value: disasterPaymentSum, icon: <BanknotesIcon className="w-8 h-8 text-purple-500" />, isCurrency: true },
        { title: 'Total Beneficiaries', value: beneficiaryCount, icon: <UsersIcon className="w-8 h-8 text-indigo-500" />, isCurrency: false },
        { title: 'Total Dependants', value: dependentCount, icon: <UsersIcon className="w-8 h-8 text-pink-500" />, isCurrency: false },
        { title: 'Available Amount', value: availableAmount, icon: <CurrencyDollarIcon className="w-8 h-8 text-emerald-500" />, isCurrency: true },
    ];

    // Prepare monthly data for all 12 months (expects array of { month: 'YYYY-MM', total: number })
    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const currentYear = new Date().getFullYear();
    const monthKeys = months.map((_, i) => `${currentYear}-${String(i + 1).padStart(2, '0')}`);
    const contributionsByMonth = monthKeys.map(monthKey => {
        const found = monthlyContributions.find(c => c.month === monthKey);
        return found ? found.total : 0;
    });
    const disasterPaymentsByMonth = monthKeys.map(monthKey => {
        const found = monthlyDisasterPayments.find(p => p.month === monthKey);
        return found ? found.total : 0;
    });
    const debtsByMonth = monthKeys.map(monthKey => {
        const found = monthlyDebts.find(d => d.month === monthKey);
        return found ? found.total : 0;
    });
    const penaltiesByMonth = monthKeys.map(monthKey => {
        const found = monthlyPenalties.find(p => p.month === monthKey);
        return found ? found.total : 0;
    });
    const comparisonData = {
        labels: months,
        datasets: [
            {
                label: 'Contributions',
                data: contributionsByMonth,
                backgroundColor: 'rgba(59, 130, 246, 0.7)', // blue-500
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 1,
            },
            {
                label: 'Disaster Payments',
                data: disasterPaymentsByMonth,
                backgroundColor: 'rgba(168, 85, 247, 0.7)', // purple-500
                borderColor: 'rgba(168, 85, 247, 1)',
                borderWidth: 1,
            },
            {
                label: 'Debts',
                data: debtsByMonth,
                backgroundColor: 'rgba(239, 68, 68, 0.7)', // red-500
                borderColor: 'rgba(239, 68, 68, 1)',
                borderWidth: 1,
            },
            {
                label: 'Penalties',
                data: penaltiesByMonth,
                backgroundColor: 'rgba(245, 158, 11, 0.7)', // yellow-500
                borderColor: 'rgba(245, 158, 11, 1)',
                borderWidth: 1,
            },
        ],
    };

    const { auth } = usePage().props;
    const user = auth?.user;
    const isAdmin = user?.role?.name === 'admin';

    const navigateToFinancials = (tab) => {
        router.get('/financials', { tab }, { preserveState: true });
    };

    return (
        <SidebarLayout>
            <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white tracking-tight mb-8">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {statCardData.map((card, idx) => (
                    <StatCard key={card.title} title={card.title} value={Intl.NumberFormat().format(card.value)} icon={card.icon} isCurrency={card.isCurrency} />
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl rounded-xl p-8">
                    <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
                        <ChartBarIcon className="w-6 h-6 text-purple-500" /> Monthly Financials
                    </h2>
                    <div style={{ height: '400px' }}>
                        <Bar data={comparisonData} options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: { legend: { position: 'top' } },
                            scales: { y: { beginAtZero: true } }
                        }} />
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl rounded-xl p-8">
                    <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
                        <ChartBarIcon className="w-6 h-6 text-blue-500" /> Financial Summary
                    </h2>
                    <div style={{ height: '400px' }}>
                        <Bar data={data} options={options} />
                    </div>
                </div>
            </div>
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl rounded-xl p-8 mt-8">
                <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">Recent Disaster Payments</h2>
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Member</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount (TZS)</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {recentDisasterPayments.map(payment => (
                            <tr key={payment.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{payment.member.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{Intl.NumberFormat().format(payment.amount)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{payment.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </SidebarLayout>
    );
}
