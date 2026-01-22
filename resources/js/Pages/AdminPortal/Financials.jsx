import React, { useState } from 'react';
import AdminSidebarLayout from '../../Layouts/AdminSidebarLayout';
import { usePage, router } from '@inertiajs/react';
import {
    Card,
    Row,
    Col,
    Table,
    Button,
    Input,
    Space,
    Tabs,
    Tag,
    Statistic,
    theme,
    message,
    Dropdown,
    Select,
} from 'antd';
import {
    DollarOutlined,
    SearchOutlined,
    DownloadOutlined,
    PlusOutlined,
    UploadOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import ContributionFormAnt from '../../Components/ContributionFormAnt';
import DebtFormAnt from '../../Components/DebtFormAnt';
import DisbursementFormAnt from '../../Components/DisbursementFormAnt';

export default function Financials() {
    const { 
        members = [], 
        allMembers = [], 
        monthlyContributionsByMonth = {}, 
        memberMonthlyTotal = {}, // Monthly contributions per member
        memberOtherTotal = {}, // Other contributions per member
        otherContributions = {}, 
        otherContributionsSummary = [],
        debts = {},
        penalties = {},
        disasterPayments = {},
        statistics = {},
        filters = {}
    } = usePage().props;
    
    const { token } = theme.useToken();
    const [activeTab, setActiveTab] = useState(filters.tab || 'contributions');
    const [searchText, setSearchText] = useState(filters.search || '');
    const [selectedYear, setSelectedYear] = useState(filters.year || new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(filters.month || '');
    
    // Sync activeTab with filters when they change (after page reload)
    React.useEffect(() => {
        if (filters.tab && filters.tab !== activeTab) {
            setActiveTab(filters.tab);
        }
    }, [filters.tab]);
    
    // Modal states
    const [showContributionForm, setShowContributionForm] = useState(false);
    const [contributionFormType, setContributionFormType] = useState('monthly'); // Track which type to show
    const [showDebtForm, setShowDebtForm] = useState(false);
    const [showDisbursementForm, setShowDisbursementForm] = useState(false);

    // Helper function to open contribution form with specific type
    const openContributionForm = (type) => {
        // Close first if already open
        if (showContributionForm) {
            setShowContributionForm(false);
            // Wait for modal to close before opening with new type
            setTimeout(() => {
                setContributionFormType(type);
                setShowContributionForm(true);
            }, 100);
        } else {
            setContributionFormType(type);
            setShowContributionForm(true);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-TZ', {
            style: 'currency',
            currency: 'TZS',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount || 0);
    };

    // Generate year options from 2018 to current year
    const yearOptions = Array.from({ length: new Date().getFullYear() - 2018 + 1 }, (_, i) => ({
        label: String(2018 + i),
        value: 2018 + i,
    })).reverse();

    // Generate month options
    const monthOptions = [
        { label: 'All Months', value: '' },
        { label: 'January', value: 1 },
        { label: 'February', value: 2 },
        { label: 'March', value: 3 },
        { label: 'April', value: 4 },
        { label: 'May', value: 5 },
        { label: 'June', value: 6 },
        { label: 'July', value: 7 },
        { label: 'August', value: 8 },
        { label: 'September', value: 9 },
        { label: 'October', value: 10 },
        { label: 'November', value: 11 },
        { label: 'December', value: 12 },
    ];

    const handleFilterChange = () => {
        router.get(route('admin-portal.financials'), {
            search: searchText,
            year: selectedYear,
            month: selectedMonth,
            tab: activeTab, // Include current tab
        });
    };

    const handleClearFilter = () => {
        setSearchText('');
        setSelectedYear(new Date().getFullYear());
        setSelectedMonth('');
        router.get(route('admin-portal.financials'), {
            tab: activeTab, // Keep current tab when clearing
        });
    };

    const handleTabChange = (key) => {
        setActiveTab(key);
        // Update URL with tab parameter without reloading
        router.get(route('admin-portal.financials'), {
            ...filters,
            tab: key,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const contributionColumns = [
        {
            title: 'Member',
            dataIndex: 'name',
            key: 'name',
            width: 200,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: 200,
        },
        {
            title: 'Phone',
            dataIndex: 'phone_number',
            key: 'phone_number',
            width: 150,
        },
        {
            title: 'Monthly Contributions',
            key: 'monthly_total',
            width: 150,
            render: (_, record) => {
                const total = memberMonthlyTotal[record.id] || 0;
                return formatCurrency(total);
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 120,
            render: (_, record) => (
                <Button
                    type="link"
                    onClick={() => router.visit(route('admin-portal.member-contributions', {
                        member: record.id,
                        year: selectedYear
                    }))}
                >
                    View Details
                </Button>
            ),
        },
    ];

    const otherContributionColumns = [
        {
            title: 'Member',
            dataIndex: ['member', 'name'],
            key: 'member_name',
            width: 200,
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            width: 150,
            render: (amount) => formatCurrency(amount),
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            width: 150,
            render: (date) => dayjs(date).format('DD MMM YYYY'),
        },
        {
            title: 'Purpose',
            dataIndex: 'purpose',
            key: 'purpose',
            width: 250,
        },
        {
            title: 'Notes',
            dataIndex: 'notes',
            key: 'notes',
            ellipsis: true,
        },
    ];

    const debtColumns = [
        {
            title: 'Member',
            dataIndex: ['member', 'name'],
            key: 'member_name',
            width: 200,
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount) => formatCurrency(amount),
        },
        {
            title: 'Reason',
            dataIndex: 'reason',
            key: 'reason',
            width: 200,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'paid' ? 'green' : 'red'}>
                    {status}
                </Tag>
            ),
        },
    ];

    const penaltyColumns = [
        {
            title: 'Member',
            dataIndex: ['member', 'name'],
            key: 'member_name',
            width: 200,
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount) => formatCurrency(amount),
        },
        {
            title: 'Reason',
            dataIndex: 'reason',
            key: 'reason',
            width: 200,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'paid' ? 'green' : 'orange'}>
                    {status}
                </Tag>
            ),
        },
    ];

    const disasterColumns = [
        {
            title: 'Member',
            dataIndex: ['member', 'name'],
            key: 'member_name',
            width: 200,
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount) => formatCurrency(amount),
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (date) => dayjs(date).format('DD MMM YYYY'),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            width: 200,
        },
    ];

    const tabItems = [
        {
            key: 'contributions',
            label: 'Monthly Contributions',
            children: (
                <div style={{ padding: '24px' }}>
                    {/* Add Contribution Button */}
                    <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => openContributionForm('monthly')}
                            size="large"
                        >
                            Add Contribution
                        </Button>
                    </div>
                    
                    {/* Filters for Monthly Contributions */}
                    <Card style={{ marginBottom: '16px' }}>
                        <Row gutter={[16, 16]} align="middle">
                            <Col xs={24} sm={12} md={8}>
                                <Input
                                    placeholder="Search by member name..."
                                    prefix={<SearchOutlined />}
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    allowClear
                                />
                            </Col>
                            <Col xs={24} sm={6} md={4}>
                                <Select
                                    placeholder="Year"
                                    value={selectedYear}
                                    onChange={(value) => setSelectedYear(value)}
                                    options={yearOptions}
                                    style={{ width: '100%' }}
                                />
                            </Col>
                            <Col xs={24} sm={6} md={4}>
                                <Select
                                    placeholder="Month"
                                    value={selectedMonth}
                                    onChange={(value) => setSelectedMonth(value)}
                                    options={monthOptions}
                                    style={{ width: '100%' }}
                                />
                            </Col>
                            <Col xs={24} md={8} style={{ textAlign: 'right' }}>
                                <Space>
                                    <Button type="primary" onClick={handleFilterChange}>
                                        Apply
                                    </Button>
                                    <Button onClick={handleClearFilter}>
                                        Clear
                                    </Button>
                                </Space>
                            </Col>
                        </Row>
                    </Card>
                    
                    <Card title="Monthly Contributions">
                        <Table
                            columns={contributionColumns}
                            dataSource={members.data || members}
                            rowKey="id"
                            pagination={members.data ? {
                                current: members.current_page,
                                pageSize: members.per_page,
                                total: members.total,
                                onChange: (page) => {
                                    router.get(route('admin-portal.financials'), {
                                        ...filters,
                                        page
                                    });
                                }
                            } : { pageSize: 10 }}
                            scroll={{ x: 800 }}
                        />
                    </Card>
                </div>
            ),
        },
        {
            key: 'other-contributions',
            label: 'Other Contributions',
            children: (
                <div style={{ padding: '24px' }}>
                    {/* Add Other Contribution Button */}
                    <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => openContributionForm('other')}
                            size="large"
                        >
                            Add Other Contribution
                        </Button>
                    </div>
                    
                    {/* Filters for Other Contributions */}
                    <Card style={{ marginBottom: '16px' }}>
                        <Row gutter={[16, 16]} align="middle">
                            <Col xs={24} sm={12} md={8}>
                                <Input
                                    placeholder="Search by member name..."
                                    prefix={<SearchOutlined />}
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    allowClear
                                />
                            </Col>
                            <Col xs={24} sm={6} md={4}>
                                <Select
                                    placeholder="Year"
                                    value={selectedYear}
                                    onChange={(value) => setSelectedYear(value)}
                                    options={yearOptions}
                                    style={{ width: '100%' }}
                                />
                            </Col>
                            <Col xs={24} sm={6} md={4}>
                                <Select
                                    placeholder="Month"
                                    value={selectedMonth}
                                    onChange={(value) => setSelectedMonth(value)}
                                    options={monthOptions}
                                    style={{ width: '100%' }}
                                />
                            </Col>
                            <Col xs={24} md={8} style={{ textAlign: 'right' }}>
                                <Space>
                                    <Button type="primary" onClick={handleFilterChange}>
                                        Apply
                                    </Button>
                                    <Button onClick={handleClearFilter}>
                                        Clear
                                    </Button>
                                </Space>
                            </Col>
                        </Row>
                    </Card>
                    
                    <Card title="Other Contributions (Projects, Donations, etc.)">
                        <Table
                            columns={otherContributionColumns}
                            dataSource={otherContributions.data || []}
                            rowKey="id"
                            pagination={{ pageSize: 10 }}
                            scroll={{ x: 800 }}
                            summary={(pageData) => {
                                const total = pageData.reduce((sum, record) => sum + parseFloat(record.amount || 0), 0);
                                return (
                                    <Table.Summary fixed>
                                        <Table.Summary.Row>
                                            <Table.Summary.Cell index={0} colSpan={1}>
                                                <strong>Total</strong>
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell index={1}>
                                                <strong>{formatCurrency(total)}</strong>
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell index={2} colSpan={3} />
                                        </Table.Summary.Row>
                                    </Table.Summary>
                                );
                            }}
                        />
                    </Card>
                </div>
            ),
        },
        {
            key: 'debts',
            label: 'Debts',
            children: (
                <div style={{ padding: '24px' }}>
                    <Card 
                        title="Member Debts"
                        extra={
                            <Button
                                type="primary"
                                danger
                                icon={<PlusOutlined />}
                                onClick={() => setShowDebtForm(true)}
                            >
                                Add Debt
                            </Button>
                        }
                    >
                        <Table
                            columns={debtColumns}
                            dataSource={debts.data || []}
                            rowKey="id"
                            pagination={{ pageSize: 10 }}
                            scroll={{ x: 800 }}
                        />
                    </Card>
                </div>
            ),
        },
        {
            key: 'penalties',
            label: 'Penalties',
            children: (
                <div style={{ padding: '24px' }}>
                    <Card title="Member Penalties">
                        <Table
                            columns={penaltyColumns}
                            dataSource={penalties.data || []}
                            rowKey="id"
                            pagination={{ pageSize: 10 }}
                            scroll={{ x: 800 }}
                        />
                    </Card>
                </div>
            ),
        },
        {
            key: 'disaster-payments',
            label: 'Disbursements',
            children: (
                <div style={{ padding: '24px' }}>
                    <Card 
                        title="Disaster Payments"
                        extra={
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => setShowDisbursementForm(true)}
                            >
                                Add Disbursement
                            </Button>
                        }
                    >
                        <Table
                            columns={disasterColumns}
                            dataSource={disasterPayments.data || []}
                            rowKey="id"
                            pagination={{ pageSize: 10 }}
                            scroll={{ x: 800 }}
                        />
                    </Card>
                </div>
            ),
        },
    ];

    return (
        <AdminSidebarLayout>
            <div style={{ padding: '24px 0' }}>
                {/* Tabs */}
                <Card
                    style={{ 
                        borderRadius: '12px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                    }}
                >
                    <Tabs 
                        items={tabItems} 
                        activeKey={activeTab} 
                        onChange={handleTabChange}
                    />
                </Card>
            </div>
            
            {/* Modals */}
            {showContributionForm && (
                <ContributionFormAnt
                    key={contributionFormType} // Key at parent level to force new instance
                    open={showContributionForm}
                    onClose={() => setShowContributionForm(false)}
                    members={allMembers}
                    defaultType={contributionFormType}
                />
            )}
            <DebtFormAnt
                open={showDebtForm}
                onClose={() => setShowDebtForm(false)}
                members={allMembers}
            />
            <DisbursementFormAnt
                open={showDisbursementForm}
                onClose={() => setShowDisbursementForm(false)}
                members={allMembers}
            />
        </AdminSidebarLayout>
    );
}
