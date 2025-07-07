import React from 'react';
import SidebarLayout from '../../Layouts/SidebarLayout';
import { Bar, Doughnut } from 'react-chartjs-2';
import { usePage, router } from '@inertiajs/react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import {
    UserGroupIcon,
    CurrencyDollarIcon,
    ExclamationCircleIcon,
    ExclamationTriangleIcon,
    UsersIcon,
    BanknotesIcon,
    ChartBarIcon,
    ClockIcon,
    CheckCircleIcon,
    ArrowUpIcon,
    ArrowDownIcon,
    EyeIcon,
    CalendarIcon,
    StarIcon,
    ShieldExclamationIcon,
    PresentationChartLineIcon,
    ChartPieIcon
} from '@heroicons/react/24/outline';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-TZ', {
        style: 'currency',
        currency: 'TZS',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

const StatCard = ({ title, value, icon, isCurrency, trend, trendValue, gradient, onClick }) => {
    return (
        <div
            className={`relative overflow-hidden rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group cursor-pointer ${gradient} ${onClick ? 'hover:scale-105' : ''}`}
            onClick={onClick}
        >
            <div className="absolute inset-0 bg-gradient-to-br opacity-10"></div>
            <div className="relative p-6">
                <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                        <dt className="text-sm font-medium text-white/80 truncate mb-2">
                            {title}
                        </dt>
                        <dd className="text-2xl sm:text-3xl font-bold text-white mb-3">
                            {isCurrency ? formatCurrency(value) : typeof value === 'number' ? value.toLocaleString() : value}
                        </dd>
                        {trend && (
                            <div className={`flex items-center text-sm font-medium ${
                                trend === 'up' ? 'text-green-200' :
                                trend === 'down' ? 'text-red-200' :
                                'text-white/70'
                            }`}>
                                {trend === 'up' && <ArrowUpIcon className="w-4 h-4 mr-1" />}
                                {trend === 'down' && <ArrowDownIcon className="w-4 h-4 mr-1" />}
                                {trendValue}% from last month
                            </div>
                        )}
                    </div>
                    <div className="flex-shrink-0 ml-4">
                        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg group-hover:scale-110 transition-transform duration-300">
                            {icon}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const QuickActionCard = ({ title, description, icon, onClick, color = "blue" }) => {
    const colorClasses = {
        blue: "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
        green: "from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
        purple: "from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700",
        orange: "from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700",
    };

    return (
        <div
            className={`bg-gradient-to-r ${colorClasses[color]} rounded-xl p-6 text-white cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105`}
            onClick={onClick}
        >
            <div className="flex items-center">
                <div className="p-3 bg-white/20 rounded-lg mr-4">
                    {icon}
                </div>
                <div>
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <p className="text-white/80 text-sm">{description}</p>
                </div>
            </div>
        </div>
    );
};

const ActivityCard = ({ title, items, icon, emptyMessage, type }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 px-6 py-4 border-b border-gray-200 dark:border-gray-600 rounded-t-xl">
                <div className="flex items-center">
                    <div className="p-2 bg-white dark:bg-gray-800 rounded-lg mr-3">
                        {icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
                </div>
            </div>
            <div className="p-6">
                {items && items.length > 0 ? (
                    <div className="space-y-4">
                        {items.slice(0, 5).map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                                        {item.member?.name?.charAt(0)?.toUpperCase() || 'M'}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {item.member?.name || 'Unknown Member'}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {type === 'contributions' && item.date}
                                            {type === 'debts' && new Date(item.created_at).toLocaleDateString()}
                                            {type === 'disaster_payments' && item.date}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        {formatCurrency(item.amount)}
                                    </p>
                                    {item.status && (
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            item.status === 'paid' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                                            'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                        }`}>
                                            {item.status}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                            {icon}
                        </div>
                        <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default function AdminDashboard({
    memberCount,
    contributionSum,
    debtSum,
    penaltySum,
    disasterPaymentSum,
    availableAmount,
    activeMembers,
    pendingMembers,
    unpaidDebts,
    unpaidPenalties,
    thisMonthContributions,
    contributionGrowth,
    memberGrowth,
    monthlyContributions = [],
    monthlyDisasterPayments = [],
    monthlyDebts = [],
    monthlyPenalties = [],
    recentDisasterPayments = [],
    recentContributions = [],
    recentDebts = [],
    topContributors = [],
    defaulters = [],
    genderDistribution = {}
}) {
    // Format currency function
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-TZ', {
            style: 'currency',
            currency: 'TZS',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const statCardData = [
        {
            title: 'Total Members',
            value: memberCount,
            icon: <UserGroupIcon className="w-8 h-8 text-white" />,
            isCurrency: false,
            gradient: 'bg-gradient-to-br from-blue-500 to-blue-600',
            trend: memberGrowth > 0 ? 'up' : memberGrowth < 0 ? 'down' : null,
            trendValue: Math.abs(memberGrowth),
            onClick: () => router.get('/admin/members')
        },
        {
            title: 'Total Contributions',
            value: contributionSum,
            icon: <CurrencyDollarIcon className="w-8 h-8 text-white" />,
            isCurrency: true,
            gradient: 'bg-gradient-to-br from-green-500 to-green-600',
            trend: contributionGrowth > 0 ? 'up' : contributionGrowth < 0 ? 'down' : null,
            trendValue: Math.abs(contributionGrowth),
            onClick: () => router.get('/admin/financials', { tab: 'contributions' })
        },
        {
            title: 'Outstanding Debts',
            value: unpaidDebts,
            icon: <ExclamationCircleIcon className="w-8 h-8 text-white" />,
            isCurrency: true,
            gradient: 'bg-gradient-to-br from-red-500 to-red-600',
            onClick: () => router.get('/admin/financials', { tab: 'debts' })
        },
        {
            title: 'Unpaid Penalties',
            value: unpaidPenalties,
            icon: <ExclamationTriangleIcon className="w-8 h-8 text-white" />,
            isCurrency: true,
            gradient: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
            onClick: () => router.get('/admin/financials', { tab: 'penalties' })
        },
        {
            title: 'Disaster Payments',
            value: disasterPaymentSum,
            icon: <BanknotesIcon className="w-8 h-8 text-white" />,
            isCurrency: true,
            gradient: 'bg-gradient-to-br from-purple-500 to-purple-600',
            onClick: () => router.get('/admin/financials', { tab: 'disaster_payments' })
        },
        {
            title: 'Active Members',
            value: activeMembers,
            icon: <CheckCircleIcon className="w-8 h-8 text-white" />,
            isCurrency: false,
            gradient: 'bg-gradient-to-br from-emerald-500 to-emerald-600'
        },
        {
            title: 'Pending Members',
            value: pendingMembers,
            icon: <ClockIcon className="w-8 h-8 text-white" />,
            isCurrency: false,
            gradient: 'bg-gradient-to-br from-orange-500 to-orange-600'
        },
        {
            title: 'Available Amount',
            value: availableAmount,
            icon: <CurrencyDollarIcon className="w-8 h-8 text-white" />,
            isCurrency: true,
            gradient: 'bg-gradient-to-br from-teal-500 to-teal-600'
        },
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

    return (
        <SidebarLayout>
            {/* Enhanced Header Section */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 rounded-xl p-8 mb-8 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold mb-2 flex items-center">
                                <PresentationChartLineIcon className="w-10 h-10 mr-4" />
                                Admin Dashboard
                            </h1>
                            <p className="text-indigo-100 text-lg">
                                Welcome back, {user?.name}! Here's your group's performance overview
                            </p>
                            <div className="flex items-center mt-4 space-x-6">
                                <div className="flex items-center">
                                    <CalendarIcon className="w-5 h-5 mr-2" />
                                    <span className="text-indigo-100">
                                        {new Date().toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="hidden lg:flex space-x-4">
                            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold">{thisMonthContributions ? formatCurrency(thisMonthContributions) : formatCurrency(0)}</div>
                                <div className="text-sm text-indigo-100">This Month</div>
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold">{activeMembers}</div>
                                <div className="text-sm text-indigo-100">Active Members</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Stats Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCardData.map((card) => (
                    <StatCard
                        key={card.title}
                        title={card.title}
                        value={card.value}
                        icon={card.icon}
                        isCurrency={card.isCurrency}
                        gradient={card.gradient}
                        trend={card.trend}
                        trendValue={card.trendValue}
                        onClick={card.onClick}
                    />
                ))}
            </div>

            {/* Quick Actions Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <QuickActionCard
                    title="Add Member"
                    description="Register new member"
                    icon={<UserGroupIcon className="w-6 h-6" />}
                    onClick={() => router.get('/admin/members')}
                    color="blue"
                />
                <QuickActionCard
                    title="Record Contribution"
                    description="Add new contribution"
                    icon={<CurrencyDollarIcon className="w-6 h-6" />}
                    onClick={() => router.get('/admin/financials')}
                    color="green"
                />
                <QuickActionCard
                    title="View Reports"
                    description="Generate reports"
                    icon={<ChartBarIcon className="w-6 h-6" />}
                    onClick={() => router.get('/admin/reports')}
                    color="purple"
                />
                <QuickActionCard
                    title="Manage Roles"
                    description="User permissions"
                    icon={<UsersIcon className="w-6 h-6" />}
                    onClick={() => router.get('/admin/roles')}
                    color="orange"
                />
            </div>

            {/* Recent Activities Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <ActivityCard
                    title="Recent Contributions"
                    items={recentContributions}
                    icon={<CurrencyDollarIcon className="w-5 h-5 text-green-600" />}
                    emptyMessage="No recent contributions"
                    type="contributions"
                />
                <ActivityCard
                    title="Recent Debts"
                    items={recentDebts}
                    icon={<ExclamationCircleIcon className="w-5 h-5 text-red-600" />}
                    emptyMessage="No recent debts"
                    type="debts"
                />
                <ActivityCard
                    title="Recent Disaster Payments"
                    items={recentDisasterPayments}
                    icon={<BanknotesIcon className="w-5 h-5 text-purple-600" />}
                    emptyMessage="No recent disaster payments"
                    type="disaster_payments"
                />
            </div>

            {/* Enhanced Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-8">
                {/* Monthly Financials Chart */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 px-6 py-4 border-b border-gray-200 dark:border-gray-600 rounded-t-xl">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="p-2 bg-purple-500 rounded-lg mr-3">
                                    <ChartBarIcon className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Monthly Financial Trends
                                </h2>
                            </div>
                            <button
                                onClick={() => router.get('/admin/reports')}
                                className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium text-sm flex items-center"
                            >
                                <EyeIcon className="w-4 h-4 mr-1" />
                                View Details
                            </button>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="h-80">
                            <Bar data={comparisonData} options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        position: 'top',
                                        labels: {
                                            usePointStyle: true,
                                            padding: 20,
                                            font: { size: 12 }
                                        }
                                    },
                                    tooltip: {
                                        callbacks: {
                                            label: function(context) {
                                                return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`;
                                            }
                                        }
                                    }
                                },
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        ticks: {
                                            callback: function(value) {
                                                return formatCurrency(value);
                                            },
                                            font: { size: 11 }
                                        },
                                        grid: {
                                            color: 'rgba(0, 0, 0, 0.1)'
                                        }
                                    },
                                    x: {
                                        ticks: {
                                            font: { size: 11 }
                                        },
                                        grid: {
                                            display: false
                                        }
                                    }
                                }
                            }} />
                        </div>
                    </div>
                </div>

                {/* Financial Summary Doughnut Chart */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 px-6 py-4 border-b border-gray-200 dark:border-gray-600 rounded-t-xl">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="p-2 bg-blue-500 rounded-lg mr-3">
                                    <ChartPieIcon className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Financial Distribution
                                </h2>
                            </div>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="h-80">
                            <Doughnut
                                data={{
                                    labels: ['Contributions', 'Debts', 'Penalties', 'Disaster Payments'],
                                    datasets: [{
                                        data: [contributionSum, debtSum, penaltySum, disasterPaymentSum],
                                        backgroundColor: [
                                            'rgba(34, 197, 94, 0.8)',
                                            'rgba(239, 68, 68, 0.8)',
                                            'rgba(245, 158, 11, 0.8)',
                                            'rgba(139, 92, 246, 0.8)',
                                        ],
                                        borderColor: [
                                            'rgba(34, 197, 94, 1)',
                                            'rgba(239, 68, 68, 1)',
                                            'rgba(245, 158, 11, 1)',
                                            'rgba(139, 92, 246, 1)',
                                        ],
                                        borderWidth: 2,
                                    }]
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            position: 'bottom',
                                            labels: {
                                                padding: 20,
                                                usePointStyle: true,
                                                font: { size: 12 }
                                            }
                                        },
                                        tooltip: {
                                            callbacks: {
                                                label: function(context) {
                                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                                    const percentage = ((context.parsed / total) * 100).toFixed(1);
                                                    return `${context.label}: ${formatCurrency(context.parsed)} (${percentage}%)`;
                                                }
                                            }
                                        }
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Gender Distribution Chart */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="bg-gradient-to-r from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 px-6 py-4 border-b border-gray-200 dark:border-gray-600 rounded-t-xl">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="p-2 bg-pink-500 rounded-lg mr-3">
                                    <UsersIcon className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Gender Distribution
                                </h2>
                            </div>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="h-80">
                            <Doughnut
                                data={{
                                    labels: Object.keys(genderDistribution || {}),
                                    datasets: [{
                                        data: Object.values(genderDistribution || {}),
                                        backgroundColor: [
                                            'rgba(236, 72, 153, 0.8)', // Pink for Female
                                            'rgba(59, 130, 246, 0.8)', // Blue for Male
                                            'rgba(156, 163, 175, 0.8)', // Gray for Other/Unknown
                                        ],
                                        borderColor: [
                                            'rgba(236, 72, 153, 1)',
                                            'rgba(59, 130, 246, 1)',
                                            'rgba(156, 163, 175, 1)',
                                        ],
                                        borderWidth: 2,
                                    }]
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            position: 'bottom',
                                            labels: {
                                                padding: 20,
                                                usePointStyle: true,
                                                font: { size: 12 }
                                            }
                                        },
                                        tooltip: {
                                            callbacks: {
                                                label: function(context) {
                                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                                    const percentage = ((context.parsed / total) * 100).toFixed(1);
                                                    return `${context.label}: ${context.parsed} members (${percentage}%)`;
                                                }
                                            }
                                        }
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Performers and Insights Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Top Contributors */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 px-6 py-4 border-b border-gray-200 dark:border-gray-600 rounded-t-xl">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-500 rounded-lg mr-3">
                                <StarIcon className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Top Contributors</h3>
                        </div>
                    </div>
                    <div className="p-6">
                        {topContributors && topContributors.length > 0 ? (
                            <div className="space-y-4">
                                {topContributors.map((contributor, index) => (
                                    <div key={contributor.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/10 dark:to-green-800/10 rounded-lg">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4">
                                                #{index + 1}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900 dark:text-white">
                                                    {contributor.name}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Member since {new Date(contributor.created_at).getFullYear()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-green-600 dark:text-green-400">
                                                {formatCurrency(contributor.contributions_sum_amount || 0)}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Total Contributions</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <StarIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                                <p className="text-gray-500 dark:text-gray-400">No contribution data available</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Members with Outstanding Debts */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 px-6 py-4 border-b border-gray-200 dark:border-gray-600 rounded-t-xl">
                        <div className="flex items-center">
                            <div className="p-2 bg-red-500 rounded-lg mr-3">
                                <ShieldExclamationIcon className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Outstanding Debts</h3>
                        </div>
                    </div>
                    <div className="p-6">
                        {defaulters && defaulters.length > 0 ? (
                            <div className="space-y-4">
                                {defaulters.map((defaulter) => (
                                    <div key={defaulter.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/10 dark:to-red-800/10 rounded-lg">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4">
                                                !
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900 dark:text-white">
                                                    {defaulter.name}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Unpaid debt
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-red-600 dark:text-red-400">
                                                {formatCurrency(defaulter.debts_sum_amount || 0)}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Outstanding</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <CheckCircleIcon className="w-12 h-12 text-green-300 dark:text-green-600 mx-auto mb-4" />
                                <p className="text-gray-500 dark:text-gray-400">No outstanding debts!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* System Health and Alerts */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">System Health</h3>
                        <div className="flex items-center space-x-6">
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                                <span className="text-sm text-gray-600 dark:text-gray-300">All systems operational</span>
                            </div>
                            <div className="flex items-center">
                                <ClockIcon className="w-4 h-4 text-gray-500 mr-2" />
                                <span className="text-sm text-gray-600 dark:text-gray-300">
                                    Last updated: {new Date().toLocaleTimeString()}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex space-x-3">
                        <button
                            onClick={() => router.get('/admin/settings')}
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors duration-200"
                        >
                            Settings
                        </button>
                        <button
                            onClick={() => router.get('/admin/reports')}
                            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors duration-200"
                        >
                            Full Reports
                        </button>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}
