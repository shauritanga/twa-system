import React from 'react';
import AdminSidebarLayout from '../../Layouts/AdminSidebarLayout';
import { usePage } from '@inertiajs/react';
import {
    Card,
    Row,
    Col,
    Statistic,
    Table,
    Tag,
    Empty,
    theme,
    Select,
    Alert,
    Space,
    Typography,
} from 'antd';
import {
    UserOutlined,
    DollarOutlined,
    ExclamationCircleOutlined,
    CheckCircleOutlined,
    BankOutlined,
    RiseOutlined,
    FallOutlined,
    BookOutlined,
} from '@ant-design/icons';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip as ChartTooltip,
    Legend,
    ArcElement,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    ChartTooltip,
    Legend,
    ArcElement
);

const { Text, Title: AntTitle } = Typography;

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-TZ', {
        style: 'currency',
        currency: 'TZS',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

export default function AdminDashboard() {
    const { 
        memberCount = 0,
        contributionSum = 0,
        disasterPaymentSum = 0,
        debtSum = 0,
        activeMembers = 0,
        monthlyContributions = [],
        recentContributions = [],
        recentDisasterPayments = [],
        accountingSummary = {},
        accountBalances = {},
        topAccounts = [],
    } = usePage().props;
    
    // Extract accounting data
    const {
        cash_balance: cashBalance = 0,
        total_revenue: totalRevenue = 0,
        total_expenses: totalExpenses = 0,
        net_income: netIncome = 0,
        recent_entries: recentJournalEntries = [],
        entries_count_today: entriesToday = 0,
        entries_count_month: entriesThisMonth = 0,
    } = accountingSummary;
    
    const { token } = theme.useToken();
    const [selectedYear, setSelectedYear] = React.useState(new Date().getFullYear());

    // Generate years from 2018 to current year
    const currentYear = new Date().getFullYear();
    const yearOptions = React.useMemo(() => {
        const years = [];
        for (let year = currentYear; year >= 2018; year--) {
            years.push({
                label: year.toString(),
                value: year,
            });
        }
        return years;
    }, [currentYear]);

    // All months
    const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Format monthly data for charts - include all months
    const contributionTrend = allMonths.map((month, index) => {
        const monthData = monthlyContributions.find(item => {
            const itemMonth = new Date(item.month + '-01');
            return itemMonth.getMonth() === index && itemMonth.getFullYear() === selectedYear;
        });
        return {
            month: month,
            amount: monthData ? monthData.total : 0,
        };
    });

    // Chart data
    const contributionChartData = {
        labels: contributionTrend.map(item => item.month),
        datasets: [
            {
                label: 'Monthly Contributions',
                data: contributionTrend.map(item => item.amount),
                backgroundColor: token.colorPrimary,
                borderColor: token.colorPrimary,
                borderRadius: 4,
                borderWidth: 2,
            },
        ],
    };

    const memberStatusData = {
        labels: ['Active', 'Inactive'],
        datasets: [
            {
                data: [
                    activeMembers,
                    memberCount - activeMembers,
                ],
                backgroundColor: [
                    token.colorSuccess,
                    token.colorTextSecondary,
                ],
                borderColor: token.colorBgContainer,
                borderWidth: 2,
            },
        ],
    };

    // Combine recent activities
    const recentActivities = [
        ...recentContributions.map(c => ({
            id: `contribution-${c.id}`,
            description: `Contribution of ${formatCurrency(c.amount)} from ${c.member?.name || 'Unknown'}`,
            type: 'contribution',
            created_at: c.date,
        })),
        ...recentDisasterPayments.map(d => ({
            id: `disaster-${d.id}`,
            description: `Disaster payment of ${formatCurrency(d.amount)} to ${d.member?.name || 'Unknown'}`,
            type: 'disaster',
            created_at: d.date,
        })),
    ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5);

    // Recent journal entries table columns
    const journalColumns = [
        {
            title: 'Entry #',
            dataIndex: 'entry_number',
            key: 'entry_number',
            width: 120,
            render: (text) => <Text code style={{ fontSize: '11px' }}>{text}</Text>,
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
            render: (text) => <span style={{ fontSize: '12px' }}>{text}</span>,
        },
        {
            title: 'Amount',
            dataIndex: 'total_debit',
            key: 'amount',
            width: 100,
            align: 'right',
            render: (amount) => <span style={{ fontSize: '12px' }}>{formatCurrency(amount)}</span>,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 80,
            render: (status) => (
                <Tag 
                    color={status === 'posted' ? 'green' : status === 'draft' ? 'orange' : 'red'}
                    style={{ fontSize: '10px' }}
                >
                    {status.toUpperCase()}
                </Tag>
            ),
        },
    ];

    const activityColumns = [
        {
            title: 'Activity',
            dataIndex: 'description',
            key: 'description',
            width: '50%',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            width: '25%',
            render: (type) => {
                const colors = {
                    member: 'blue',
                    contribution: 'green',
                    penalty: 'red',
                    disaster: 'orange',
                    system: 'default',
                };
                return <Tag color={colors[type] || 'default'}>{type}</Tag>;
            },
        },
        {
            title: 'Date',
            dataIndex: 'created_at',
            key: 'created_at',
            width: '25%',
            render: (date) => new Date(date).toLocaleDateString(),
        },
    ];

    return (
        <AdminSidebarLayout>
            {/* Accounting Health Alert */}
            {netIncome < 0 && (
                <Alert
                    message="Financial Alert"
                    description={`Net income is negative (${formatCurrency(netIncome)}). Review expenses and revenue streams.`}
                    type="warning"
                    showIcon
                    closable
                    style={{ marginBottom: 24 }}
                />
            )}

            {/* Key Metrics Row */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Total Members"
                            value={memberCount}
                            prefix={<UserOutlined />}
                            suffix={`(${activeMembers} active)`}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Cash Balance"
                            value={cashBalance}
                            prefix={<BankOutlined />}
                            formatter={(value) => formatCurrency(value)}
                            valueStyle={{ color: cashBalance >= 0 ? token.colorSuccess : token.colorError }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Total Revenue"
                            value={totalRevenue}
                            prefix={<RiseOutlined />}
                            formatter={(value) => formatCurrency(value)}
                            valueStyle={{ color: token.colorSuccess }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Net Income"
                            value={netIncome}
                            prefix={netIncome >= 0 ? <RiseOutlined /> : <FallOutlined />}
                            formatter={(value) => formatCurrency(value)}
                            valueStyle={{ color: netIncome >= 0 ? token.colorSuccess : token.colorError }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Secondary Metrics Row */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Total Contributions"
                            value={contributionSum}
                            prefix={<DollarOutlined />}
                            formatter={(value) => formatCurrency(value)}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Total Expenses"
                            value={totalExpenses}
                            prefix={<FallOutlined />}
                            formatter={(value) => formatCurrency(value)}
                            valueStyle={{ color: token.colorError }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Disaster Payments"
                            value={disasterPaymentSum}
                            prefix={<ExclamationCircleOutlined />}
                            formatter={(value) => formatCurrency(value)}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Outstanding Debts"
                            value={debtSum}
                            prefix={<ExclamationCircleOutlined />}
                            formatter={(value) => formatCurrency(value)}
                            valueStyle={{ color: token.colorWarning }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Charts and Recent Activities */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col xs={24} lg={12}>
                    <Card 
                        title="Monthly Contributions Trend" 
                        extra={
                            <Select
                                value={selectedYear}
                                onChange={setSelectedYear}
                                options={yearOptions}
                                style={{ width: 100 }}
                            />
                        }
                    >
                        <Bar
                            data={contributionChartData}
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: {
                                        position: 'top',
                                    },
                                },
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        ticks: {
                                            callback: function(value) {
                                                return formatCurrency(value);
                                            },
                                        },
                                    },
                                },
                            }}
                        />
                    </Card>
                </Col>
                <Col xs={24} lg={12}>
                    <Card title="Member Status">
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                            <div style={{ width: '160px', height: '160px' }}>
                                <Doughnut
                                    data={memberStatusData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: true,
                                        plugins: {
                                            legend: {
                                                position: 'bottom',
                                            },
                                        },
                                    }}
                                />
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Bottom Row - Journal Entries and Recent Activities */}
            <Row gutter={16}>
                <Col xs={24} lg={12}>
                    <Card 
                        title={
                            <Space>
                                <BookOutlined />
                                Recent Journal Entries
                            </Space>
                        }
                        size="small"
                    >
                        <Table
                            columns={journalColumns}
                            dataSource={recentJournalEntries}
                            rowKey="id"
                            size="small"
                            pagination={false}
                            locale={{
                                emptyText: (
                                    <Empty
                                        description="No recent journal entries"
                                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    />
                                ),
                            }}
                        />
                    </Card>
                </Col>
                <Col xs={24} lg={12}>
                    <Card title="Recent Activities">
                        {recentActivities && recentActivities.length > 0 ? (
                            <Table
                                columns={activityColumns}
                                dataSource={recentActivities}
                                rowKey="id"
                                pagination={false}
                                size="small"
                                locale={{
                                    emptyText: (
                                        <Empty
                                            description="No recent activities"
                                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                                        />
                                    ),
                                }}
                            />
                        ) : (
                            <Empty description="No recent activities" />
                        )}
                    </Card>
                </Col>
            </Row>
        </AdminSidebarLayout>
    );
}
