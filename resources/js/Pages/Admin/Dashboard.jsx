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

const StatCard = ({ title, value, icon, isCurrency, trend, trendValue }) => {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-TZ', {
            style: 'currency',
            currency: 'TZS',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className="card hover:shadow-lg transition-all duration-300 group">
            <div className="card-body">
                <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate mb-1">
                            {title}
                        </dt>
                        <dd className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            {isCurrency ? formatCurrency(value) : value}
                        </dd>
                    {trend && (
                        <div className={`flex items-center text-xs font-medium ${
                            trend === 'up' ? 'text-green-600 dark:text-green-400' :
                            trend === 'down' ? 'text-red-600 dark:text-red-400' :
                            'text-gray-500 dark:text-gray-400'
                        }`}>
                            {trend === 'up' && (
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                            )}
                            {trend === 'down' && (
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            )}
                            {trendValue}
                        </div>
                    )}
                    </div>
                    <div className="flex-shrink-0 ml-4">
                        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg group-hover:scale-110 transition-transform duration-300">
                            {icon}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function AdminDashboard({ memberCount, contributionSum, debtSum, penaltySum, disasterPaymentSum, beneficiaryCount, dependentCount, availableAmount, monthlyContributions = [], monthlyDisasterPayments = [], monthlyDebts = [], monthlyPenalties = [], recentDisasterPayments = [] }) {
    const data = {
        labels: ['Contributions', 'Debts', 'Penalties', 'Disaster Payments'],
        datasets: [
            {
                label: 'Amount in TZS',
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
        router.get('/admin/financials', { tab }, { preserveState: true });
    };

    return (
        <SidebarLayout>
            {/* Header Section */}
            <div className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-heading mb-2">
                    Admin Dashboard
                </h1>
                <p className="text-body text-sm sm:text-base">
                    Overview of your group's financial status and member activities
                </p>
            </div>

            {/* Stats Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10">
                {statCardData.map((card) => (
                    <StatCard
                        key={card.title}
                        title={card.title}
                        value={Intl.NumberFormat().format(card.value)}
                        icon={card.icon}
                        isCurrency={card.isCurrency}
                    />
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 mb-8">
                {/* Monthly Financials Chart */}
                <div className="card">
                    <div className="card-header">
                        <h2 className="text-lg sm:text-xl font-bold text-heading flex items-center gap-2">
                            <ChartBarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />
                            Monthly Financials
                        </h2>
                    </div>
                    <div className="card-body">
                        <div className="h-64 sm:h-80 lg:h-96">
                            <Bar data={comparisonData} options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        position: 'top',
                                        labels: {
                                            usePointStyle: true,
                                            padding: 20,
                                            font: {
                                                size: window.innerWidth < 640 ? 10 : 12
                                            }
                                        }
                                    }
                                },
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        ticks: {
                                            font: {
                                                size: window.innerWidth < 640 ? 10 : 12
                                            }
                                        }
                                    },
                                    x: {
                                        ticks: {
                                            font: {
                                                size: window.innerWidth < 640 ? 10 : 12
                                            }
                                        }
                                    }
                                }
                            }} />
                        </div>
                    </div>
                </div>

                {/* Financial Summary Chart */}
                <div className="card">
                    <div className="card-header">
                        <h2 className="text-lg sm:text-xl font-bold text-heading flex items-center gap-2">
                            <ChartBarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                            Financial Summary
                        </h2>
                    </div>
                    <div className="card-body">
                        <div className="h-64 sm:h-80 lg:h-96">
                            <Bar data={data} options={{
                                ...options,
                                plugins: {
                                    ...options.plugins,
                                    legend: {
                                        ...options.plugins.legend,
                                        labels: {
                                            font: {
                                                size: window.innerWidth < 640 ? 10 : 12
                                            }
                                        }
                                    }
                                },
                                scales: {
                                    ...options.scales,
                                    y: {
                                        ...options.scales.y,
                                        ticks: {
                                            font: {
                                                size: window.innerWidth < 640 ? 10 : 12
                                            }
                                        }
                                    },
                                    x: {
                                        ticks: {
                                            font: {
                                                size: window.innerWidth < 640 ? 10 : 12
                                            }
                                        }
                                    }
                                }
                            }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Disaster Payments Table */}
            <div className="card">
                <div className="card-header">
                    <h2 className="text-lg sm:text-xl font-bold text-heading">Recent Disaster Payments</h2>
                </div>
                <div className="card-body p-0">
                    {/* Mobile-friendly table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Member
                                    </th>
                                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Amount (TZS)
                                    </th>
                                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Date
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {recentDisasterPayments.length > 0 ? (
                                    recentDisasterPayments.map(payment => (
                                        <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                                            <td className="px-3 sm:px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                                <div className="truncate max-w-xs sm:max-w-none">
                                                    {payment.member.name}
                                                </div>
                                            </td>
                                            <td className="px-3 sm:px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                {Intl.NumberFormat().format(payment.amount)}
                                            </td>
                                            <td className="px-3 sm:px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                <div className="truncate">
                                                    {payment.date}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="px-3 sm:px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                            <div className="flex flex-col items-center">
                                                <svg className="w-12 h-12 mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                <p className="text-sm">No recent disaster payments found</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}
