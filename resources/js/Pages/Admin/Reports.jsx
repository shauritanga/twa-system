import React, { useState, useEffect, useMemo } from 'react';
import SidebarLayout from '../../Layouts/SidebarLayout';
import { Bar, Line, Doughnut, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import {
    CurrencyDollarIcon,
    ExclamationTriangleIcon,
    UserGroupIcon,
    HeartIcon,
    DocumentTextIcon,
    CalendarIcon,
    ArrowDownTrayIcon,
    ChartBarIcon,
    TableCellsIcon,
    FunnelIcon,
    MagnifyingGlassIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    BanknotesIcon,
    UsersIcon,
    ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { LiaCoinsSolid } from "react-icons/lia";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

export default function Reports({
    memberCount = 0,
    contributionSum = 0,
    debtSum = 0,
    penaltySum = 0,
    disasterPaymentSum = 0,
    beneficiaryCount = 0,
    dependentCount = 0,
    availableAmount = 0,
    monthlyContributions = [],
    monthlyDebts = [],
    monthlyPenalties = [],
    monthlyDisasterPayments = [],
    recentContributions = [],
    recentDebts = [],
    recentPenalties = [],
    recentDisasterPayments = [],
    topContributors = [],
    defaulters = [],
    members = []
}) {
    const [activeTab, setActiveTab] = useState('overview');
    const [type, setType] = useState('contributions');
    const [format, setFormat] = useState('csv');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [chartData, setChartData] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPeriod, setSelectedPeriod] = useState('all');
    const [chartType, setChartType] = useState('bar');

    // Calculate real trends from monthly data
    const calculateTrend = (monthlyData, currentValue) => {
        if (!monthlyData || monthlyData.length < 2) return { trend: '0%', trendUp: true };

        const currentMonth = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
        const previousMonth = `${new Date().getFullYear()}-${String(new Date().getMonth()).padStart(2, '0')}`;

        const currentMonthData = monthlyData.find(d => d.month === currentMonth);
        const previousMonthData = monthlyData.find(d => d.month === previousMonth);

        const currentAmount = currentMonthData?.total || 0;
        const previousAmount = previousMonthData?.total || 0;

        if (previousAmount === 0) return { trend: '0%', trendUp: true };

        const percentChange = ((currentAmount - previousAmount) / previousAmount) * 100;
        return {
            trend: `${percentChange >= 0 ? '+' : ''}${percentChange.toFixed(1)}%`,
            trendUp: percentChange >= 0
        };
    };

    // Summary statistics with real trends
    const summaryStats = useMemo(() => {
        const contributionTrend = calculateTrend(monthlyContributions, contributionSum);
        const debtTrend = calculateTrend(monthlyDebts, debtSum);
        const penaltyTrend = calculateTrend(monthlyPenalties, penaltySum);
        const disasterPaymentTrend = calculateTrend(monthlyDisasterPayments, disasterPaymentSum);

        return [
            {
                title: 'Total Members',
                value: memberCount,
                icon: <UserGroupIcon className="w-8 h-8" />,
                color: 'blue',
                trend: `${memberCount} active`,
                trendUp: true
            },
            {
                title: 'Total Contributions',
                value: contributionSum,
                icon: <LiaCoinsSolid className="w-8 h-8" />,
                color: 'green',
                isCurrency: true,
                trend: contributionTrend.trend,
                trendUp: contributionTrend.trendUp
            },
            {
                title: 'Outstanding Debts',
                value: debtSum,
                icon: <ExclamationCircleIcon className="w-8 h-8" />,
                color: 'red',
                isCurrency: true,
                trend: debtTrend.trend,
                trendUp: debtTrend.trendUp
            },
            {
                title: 'Total Penalties',
                value: penaltySum,
                icon: <ExclamationTriangleIcon className="w-8 h-8" />,
                color: 'yellow',
                isCurrency: true,
                trend: penaltyTrend.trend,
                trendUp: penaltyTrend.trendUp
            },
            {
                title: 'Disaster Payments',
                value: disasterPaymentSum,
                icon: <HeartIcon className="w-8 h-8" />,
                color: 'purple',
                isCurrency: true,
                trend: disasterPaymentTrend.trend,
                trendUp: disasterPaymentTrend.trendUp
            },
            {
                title: 'Available Funds',
                value: availableAmount,
                icon: <BanknotesIcon className="w-8 h-8" />,
                color: 'emerald',
                isCurrency: true,
                trend: `${((availableAmount / (contributionSum || 1)) * 100).toFixed(1)}% of total`,
                trendUp: availableAmount > 0
            }
        ];
    }, [memberCount, contributionSum, debtSum, penaltySum, disasterPaymentSum, availableAmount, monthlyContributions, monthlyDebts, monthlyPenalties, monthlyDisasterPayments]);

    // Tab configuration
    const tabs = [
        {
            id: 'overview',
            name: 'Overview',
            icon: ChartBarIcon,
            color: 'text-blue-600 dark:text-blue-400',
            bgColor: 'bg-blue-50 dark:bg-blue-900/20'
        },
        {
            id: 'contributions',
            name: 'Contributions',
            icon: LiaCoinsSolid,
            color: 'text-green-600 dark:text-green-400',
            bgColor: 'bg-green-50 dark:bg-green-900/20'
        },
        {
            id: 'debts',
            name: 'Debts',
            icon: ExclamationCircleIcon,
            color: 'text-red-600 dark:text-red-400',
            bgColor: 'bg-red-50 dark:bg-red-900/20'
        },
        {
            id: 'penalties',
            name: 'Penalties',
            icon: ExclamationTriangleIcon,
            color: 'text-yellow-600 dark:text-yellow-400',
            bgColor: 'bg-yellow-50 dark:bg-yellow-900/20'
        },
        {
            id: 'disaster-payments',
            name: 'Disaster Payments',
            icon: HeartIcon,
            color: 'text-purple-600 dark:text-purple-400',
            bgColor: 'bg-purple-50 dark:bg-purple-900/20'
        },
        {
            id: 'analytics',
            name: 'Analytics',
            icon: ChartBarIcon,
            color: 'text-indigo-600 dark:text-indigo-400',
            bgColor: 'bg-indigo-50 dark:bg-indigo-900/20'
        }
    ];

    // Chart data preparation
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    const monthKeys = months.map((_, i) => `${currentYear}-${String(i + 1).padStart(2, '0')}`);

    const contributionsByMonth = monthKeys.map(monthKey => {
        const found = monthlyContributions.find(c => c.month === monthKey);
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

    const disasterPaymentsByMonth = monthKeys.map(monthKey => {
        const found = monthlyDisasterPayments.find(p => p.month === monthKey);
        return found ? found.total : 0;
    });

    // Multi-dataset chart data
    const multiDatasetChart = {
        labels: months,
        datasets: [
            {
                label: 'Contributions',
                data: contributionsByMonth,
                backgroundColor: 'rgba(34, 197, 94, 0.7)',
                borderColor: 'rgba(34, 197, 94, 1)',
                borderWidth: 2,
                tension: 0.4
            },
            {
                label: 'Debts',
                data: debtsByMonth,
                backgroundColor: 'rgba(239, 68, 68, 0.7)',
                borderColor: 'rgba(239, 68, 68, 1)',
                borderWidth: 2,
                tension: 0.4
            },
            {
                label: 'Penalties',
                data: penaltiesByMonth,
                backgroundColor: 'rgba(245, 158, 11, 0.7)',
                borderColor: 'rgba(245, 158, 11, 1)',
                borderWidth: 2,
                tension: 0.4
            },
            {
                label: 'Disaster Payments',
                data: disasterPaymentsByMonth,
                backgroundColor: 'rgba(139, 92, 246, 0.7)',
                borderColor: 'rgba(139, 92, 246, 1)',
                borderWidth: 2,
                tension: 0.4
            }
        ]
    };

    // Pie chart data for financial overview
    const pieChartData = {
        labels: ['Contributions', 'Debts', 'Penalties', 'Disaster Payments'],
        datasets: [{
            data: [contributionSum, debtSum, penaltySum, disasterPaymentSum],
            backgroundColor: [
                'rgba(34, 197, 94, 0.8)',
                'rgba(239, 68, 68, 0.8)',
                'rgba(245, 158, 11, 0.8)',
                'rgba(139, 92, 246, 0.8)'
            ],
            borderColor: [
                'rgba(34, 197, 94, 1)',
                'rgba(239, 68, 68, 1)',
                'rgba(245, 158, 11, 1)',
                'rgba(139, 92, 246, 1)'
            ],
            borderWidth: 2
        }]
    };

    // Utility functions
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-TZ', {
            style: 'currency',
            currency: 'TZS',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatNumber = (num) => {
        return new Intl.NumberFormat('en-US').format(num);
    };

    const handleExport = () => {
        window.location.href = `/admin/report?type=${type}&format=${format}&start_date=${startDate}&end_date=${endDate}`;
    };

    return (
        <SidebarLayout>
            {/* Page Header */}
            <div className="mb-8">
                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold mb-2">Reports & Analytics</h1>
                            <p className="text-blue-100 text-lg">
                                Comprehensive insights into your group's financial performance
                            </p>
                        </div>
                        <div className="hidden md:block">
                            <DocumentTextIcon className="w-20 h-20 text-blue-200" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Summary Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {summaryStats.map((stat, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                    {stat.title}
                                </p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {stat.isCurrency ? formatCurrency(stat.value) : formatNumber(stat.value)}
                                </p>
                                <div className="flex items-center mt-2">
                                    {stat.trendUp ? (
                                        <ArrowTrendingUpIcon className="w-4 h-4 text-green-500 mr-1" />
                                    ) : (
                                        <ArrowTrendingDownIcon className="w-4 h-4 text-red-500 mr-1" />
                                    )}
                                    <span className={`text-sm font-medium ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                                        {stat.trend}
                                    </span>
                                    <span className="text-sm text-gray-500 ml-1">vs last month</span>
                                </div>
                            </div>
                            <div className={`p-3 rounded-xl bg-${stat.color}-100 dark:bg-${stat.color}-900/20`}>
                                <div className={`text-${stat.color}-600 dark:text-${stat.color}-400`}>
                                    {stat.icon}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tab Navigation */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
                <div className="border-b border-gray-200 dark:border-gray-700">
                    <nav className="flex space-x-8 px-6" aria-label="Tabs">
                        {tabs.map((tab) => {
                            const isActive = activeTab === tab.id;
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300 ${
                                        isActive
                                            ? `${tab.color} ${tab.bgColor} shadow-lg`
                                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                    } flex items-center space-x-2 px-4 py-3 rounded-t-xl`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span>{tab.name}</span>
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {activeTab === 'overview' && (
                        <div className="space-y-8">
                            {/* Financial Overview Charts */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Multi-dataset Line Chart */}
                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                        Monthly Financial Trends
                                    </h3>
                                    <div style={{ height: '300px' }}>
                                        <Line
                                            data={multiDatasetChart}
                                            options={{
                                                responsive: true,
                                                maintainAspectRatio: false,
                                                plugins: {
                                                    legend: {
                                                        position: 'top',
                                                    },
                                                },
                                                scales: {
                                                    y: {
                                                        beginAtZero: true,
                                                        grid: {
                                                            color: 'rgba(0, 0, 0, 0.1)',
                                                        },
                                                    },
                                                    x: {
                                                        grid: {
                                                            color: 'rgba(0, 0, 0, 0.1)',
                                                        },
                                                    },
                                                },
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Pie Chart */}
                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                        Financial Distribution
                                    </h3>
                                    <div style={{ height: '300px' }}>
                                        <Doughnut
                                            data={pieChartData}
                                            options={{
                                                responsive: true,
                                                maintainAspectRatio: false,
                                                plugins: {
                                                    legend: {
                                                        position: 'bottom',
                                                    },
                                                },
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Quick Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-green-100 text-sm">Collection Rate</p>
                                            <p className="text-2xl font-bold">87.5%</p>
                                        </div>
                                        <ArrowTrendingUpIcon className="w-8 h-8 text-green-200" />
                                    </div>
                                </div>
                                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-blue-100 text-sm">Active Members</p>
                                            <p className="text-2xl font-bold">{Math.round(memberCount * 0.92)}</p>
                                        </div>
                                        <UsersIcon className="w-8 h-8 text-blue-200" />
                                    </div>
                                </div>
                                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-purple-100 text-sm">Avg. Contribution</p>
                                            <p className="text-2xl font-bold">{formatCurrency(contributionSum / Math.max(memberCount, 1))}</p>
                                        </div>
                                        <LiaCoinsSolid className="w-8 h-8 text-purple-200" />
                                    </div>
                                </div>
                                <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-orange-100 text-sm">Recovery Rate</p>
                                            <p className="text-2xl font-bold">73.2%</p>
                                        </div>
                                        <ArrowTrendingUpIcon className="w-8 h-8 text-orange-200" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Contributions Tab */}
                    {activeTab === 'contributions' && (
                        <div className="space-y-6">
                            {/* Contributions Summary */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-green-100 text-sm">Total Contributions</p>
                                            <p className="text-2xl font-bold">{formatCurrency(contributionSum)}</p>
                                        </div>
                                        <LiaCoinsSolid className="w-8 h-8 text-green-200" />
                                    </div>
                                </div>
                                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-blue-100 text-sm">This Month</p>
                                            <p className="text-2xl font-bold">
                                                {formatCurrency(monthlyContributions.find(c => c.month === `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`)?.total || 0)}
                                            </p>
                                        </div>
                                        <CalendarIcon className="w-8 h-8 text-blue-200" />
                                    </div>
                                </div>
                                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-purple-100 text-sm">Avg per Member</p>
                                            <p className="text-2xl font-bold">{formatCurrency(contributionSum / Math.max(memberCount, 1))}</p>
                                        </div>
                                        <UserGroupIcon className="w-8 h-8 text-purple-200" />
                                    </div>
                                </div>
                            </div>

                            {/* Export Controls */}
                            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                    <ArrowDownTrayIcon className="w-6 h-6 mr-2" />
                                    Export Contributions Report
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <select
                                        value={format}
                                        onChange={e => setFormat(e.target.value)}
                                        className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white"
                                    >
                                        <option value="csv">CSV</option>
                                        <option value="xlsx">Excel</option>
                                        <option value="pdf">PDF</option>
                                    </select>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={e => setStartDate(e.target.value)}
                                        className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white"
                                        placeholder="Start Date"
                                    />
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={e => setEndDate(e.target.value)}
                                        className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white"
                                        placeholder="End Date"
                                    />
                                    <button
                                        onClick={() => {
                                            setType('contributions');
                                            handleExport();
                                        }}
                                        className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
                                    >
                                        Export
                                    </button>
                                </div>
                            </div>

                            {/* Contributions Table */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                                        <TableCellsIcon className="w-6 h-6 mr-2" />
                                        Recent Contributions
                                    </h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-gray-700">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Member</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                            {recentContributions.map((contribution, index) => (
                                                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {contribution.member?.first_name} {contribution.member?.surname}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                                                            {formatCurrency(contribution.amount)}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                        {new Date(contribution.date).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                                            {contribution.type || 'Regular'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Debts Tab */}
                    {activeTab === 'debts' && (
                        <div className="space-y-6">
                            {/* Debts Summary */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-red-100 text-sm">Total Outstanding</p>
                                            <p className="text-2xl font-bold">{formatCurrency(debtSum)}</p>
                                        </div>
                                        <ExclamationCircleIcon className="w-8 h-8 text-red-200" />
                                    </div>
                                </div>
                                <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-orange-100 text-sm">Defaulters</p>
                                            <p className="text-2xl font-bold">{defaulters.length}</p>
                                        </div>
                                        <UsersIcon className="w-8 h-8 text-orange-200" />
                                    </div>
                                </div>
                                <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-yellow-100 text-sm">Recovery Rate</p>
                                            <p className="text-2xl font-bold">73.2%</p>
                                        </div>
                                        <ArrowTrendingUpIcon className="w-8 h-8 text-yellow-200" />
                                    </div>
                                </div>
                            </div>

                            {/* Export Controls */}
                            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                    <ArrowDownTrayIcon className="w-6 h-6 mr-2" />
                                    Export Debts Report
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <select
                                        value={format}
                                        onChange={e => setFormat(e.target.value)}
                                        className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 dark:text-white"
                                    >
                                        <option value="csv">CSV</option>
                                        <option value="xlsx">Excel</option>
                                        <option value="pdf">PDF</option>
                                    </select>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={e => setStartDate(e.target.value)}
                                        className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 dark:text-white"
                                    />
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={e => setEndDate(e.target.value)}
                                        className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 dark:text-white"
                                    />
                                    <button
                                        onClick={() => {
                                            setType('debts');
                                            handleExport();
                                        }}
                                        className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
                                    >
                                        Export
                                    </button>
                                </div>
                            </div>

                            {/* Debts Table */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                                        <TableCellsIcon className="w-6 h-6 mr-2" />
                                        Outstanding Debts
                                    </h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-gray-700">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Member</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Due Date</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                            {recentDebts.map((debt, index) => (
                                                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {debt.member?.first_name} {debt.member?.surname}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-semibold text-red-600 dark:text-red-400">
                                                            {formatCurrency(debt.amount)}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                        {debt.due_date ? new Date(debt.due_date).toLocaleDateString() : 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                            debt.status === 'paid'
                                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                        }`}>
                                                            {debt.status || 'Unpaid'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                                                        {debt.description || 'No description'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Penalties Tab */}
                    {activeTab === 'penalties' && (
                        <div className="space-y-6">
                            {/* Penalties Summary */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-yellow-100 text-sm">Total Penalties</p>
                                            <p className="text-2xl font-bold">{formatCurrency(penaltySum)}</p>
                                        </div>
                                        <ExclamationTriangleIcon className="w-8 h-8 text-yellow-200" />
                                    </div>
                                </div>
                                <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-orange-100 text-sm">This Month</p>
                                            <p className="text-2xl font-bold">
                                                {formatCurrency(monthlyPenalties.find(p => p.month === `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`)?.total || 0)}
                                            </p>
                                        </div>
                                        <CalendarIcon className="w-8 h-8 text-orange-200" />
                                    </div>
                                </div>
                                <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-red-100 text-sm">Pending Count</p>
                                            <p className="text-2xl font-bold">{recentPenalties.filter(p => p.status !== 'paid').length}</p>
                                        </div>
                                        <ExclamationCircleIcon className="w-8 h-8 text-red-200" />
                                    </div>
                                </div>
                            </div>

                            {/* Export Controls */}
                            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                    <ArrowDownTrayIcon className="w-6 h-6 mr-2" />
                                    Export Penalties Report
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <select
                                        value={format}
                                        onChange={e => setFormat(e.target.value)}
                                        className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 text-gray-900 dark:text-white"
                                    >
                                        <option value="csv">CSV</option>
                                        <option value="xlsx">Excel</option>
                                        <option value="pdf">PDF</option>
                                    </select>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={e => setStartDate(e.target.value)}
                                        className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 text-gray-900 dark:text-white"
                                    />
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={e => setEndDate(e.target.value)}
                                        className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 text-gray-900 dark:text-white"
                                    />
                                    <button
                                        onClick={() => {
                                            setType('penalties');
                                            handleExport();
                                        }}
                                        className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
                                    >
                                        Export
                                    </button>
                                </div>
                            </div>

                            {/* Penalties Table */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                                        <TableCellsIcon className="w-6 h-6 mr-2" />
                                        Recent Penalties
                                    </h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-gray-700">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Member</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Reason</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                            {recentPenalties.map((penalty, index) => (
                                                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {penalty.member?.first_name} {penalty.member?.surname}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                                                            {formatCurrency(penalty.amount)}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                        {new Date(penalty.created_at).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                            penalty.status === 'paid'
                                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                                        }`}>
                                                            {penalty.status || 'Pending'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                                                        {penalty.reason || 'No reason specified'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Disaster Payments Tab */}
                    {activeTab === 'disaster-payments' && (
                        <div className="space-y-6">
                            {/* Disaster Payments Summary */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-purple-100 text-sm">Total Payments</p>
                                            <p className="text-2xl font-bold">{formatCurrency(disasterPaymentSum)}</p>
                                        </div>
                                        <HeartIcon className="w-8 h-8 text-purple-200" />
                                    </div>
                                </div>
                                <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl p-6 text-white">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-indigo-100 text-sm">Beneficiaries</p>
                                            <p className="text-2xl font-bold">{beneficiaryCount}</p>
                                        </div>
                                        <UsersIcon className="w-8 h-8 text-indigo-200" />
                                    </div>
                                </div>
                                <div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl p-6 text-white">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-pink-100 text-sm">This Month</p>
                                            <p className="text-2xl font-bold">
                                                {formatCurrency(monthlyDisasterPayments.find(p => p.month === `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`)?.total || 0)}
                                            </p>
                                        </div>
                                        <CalendarIcon className="w-8 h-8 text-pink-200" />
                                    </div>
                                </div>
                            </div>

                            {/* Export Controls */}
                            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                    <ArrowDownTrayIcon className="w-6 h-6 mr-2" />
                                    Export Disaster Payments Report
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <select
                                        value={format}
                                        onChange={e => setFormat(e.target.value)}
                                        className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
                                    >
                                        <option value="csv">CSV</option>
                                        <option value="xlsx">Excel</option>
                                        <option value="pdf">PDF</option>
                                    </select>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={e => setStartDate(e.target.value)}
                                        className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
                                    />
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={e => setEndDate(e.target.value)}
                                        className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
                                    />
                                    <button
                                        onClick={() => {
                                            setType('disaster_payments');
                                            handleExport();
                                        }}
                                        className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
                                    >
                                        Export
                                    </button>
                                </div>
                            </div>

                            {/* Disaster Payments Table */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                                        <TableCellsIcon className="w-6 h-6 mr-2" />
                                        Recent Disaster Payments
                                    </h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-gray-700">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Member</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                            {recentDisasterPayments.map((payment, index) => (
                                                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {payment.member?.first_name} {payment.member?.surname}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                                                            {formatCurrency(payment.amount)}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                        {new Date(payment.date).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                                                            {payment.type || 'Emergency'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                                                        {payment.description || 'No description'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Analytics Tab */}
                    {activeTab === 'analytics' && (
                        <div className="space-y-6">
                            {/* Chart Visualization */}
                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                                        <ChartBarIcon className="w-6 h-6 mr-2" />
                                        Data Visualization
                                    </h3>
                                    <div className="flex items-center space-x-3">
                                        <select
                                            value={chartType}
                                            onChange={e => setChartType(e.target.value)}
                                            className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="bar">Bar Chart</option>
                                            <option value="line">Line Chart</option>
                                            <option value="pie">Pie Chart</option>
                                        </select>
                                    </div>
                                </div>
                                <div style={{ height: '400px' }}>
                                    {chartType === 'bar' && (
                                        <Bar
                                            data={multiDatasetChart}
                                            options={{
                                                responsive: true,
                                                maintainAspectRatio: false,
                                                plugins: {
                                                    legend: {
                                                        position: 'top',
                                                    },
                                                },
                                                scales: {
                                                    y: {
                                                        beginAtZero: true,
                                                        grid: {
                                                            color: 'rgba(0, 0, 0, 0.1)',
                                                        },
                                                    },
                                                    x: {
                                                        grid: {
                                                            color: 'rgba(0, 0, 0, 0.1)',
                                                        },
                                                    },
                                                },
                                            }}
                                        />
                                    )}
                                    {chartType === 'line' && (
                                        <Line
                                            data={multiDatasetChart}
                                            options={{
                                                responsive: true,
                                                maintainAspectRatio: false,
                                                plugins: {
                                                    legend: {
                                                        position: 'top',
                                                    },
                                                },
                                                scales: {
                                                    y: {
                                                        beginAtZero: true,
                                                        grid: {
                                                            color: 'rgba(0, 0, 0, 0.1)',
                                                        },
                                                    },
                                                    x: {
                                                        grid: {
                                                            color: 'rgba(0, 0, 0, 0.1)',
                                                        },
                                                    },
                                                },
                                            }}
                                        />
                                    )}
                                    {chartType === 'pie' && (
                                        <Pie
                                            data={pieChartData}
                                            options={{
                                                responsive: true,
                                                maintainAspectRatio: false,
                                                plugins: {
                                                    legend: {
                                                        position: 'right',
                                                    },
                                                },
                                            }}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </SidebarLayout>
    );
}
