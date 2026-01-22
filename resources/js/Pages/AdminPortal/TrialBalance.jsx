import React, { useState } from 'react';
import AdminSidebarLayout from '@/Layouts/AdminSidebarLayout';
import { router } from '@inertiajs/react';
import { 
    Card, 
    Button, 
    Table, 
    Select, 
    Space, 
    Typography,
    theme,
    DatePicker,
    Tag,
    Alert,
    Collapse,
} from 'antd';
import { 
    SearchOutlined,
    DownloadOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    BarChartOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Panel } = Collapse;

const ACCOUNT_TYPES = [
    { value: 'asset', label: 'Assets', color: 'blue' },
    { value: 'liability', label: 'Liabilities', color: 'red' },
    { value: 'equity', label: 'Equity', color: 'purple' },
    { value: 'revenue', label: 'Revenue', color: 'green' },
    { value: 'expense', label: 'Expenses', color: 'orange' },
];

export default function TrialBalance({ trialBalanceData, groupedData, totals, filters }) {
    const { token } = theme.useToken();
    const [asOfDate, setAsOfDate] = useState(filters.as_of_date ? dayjs(filters.as_of_date) : dayjs());
    const [selectedType, setSelectedType] = useState(filters.account_type || null);

    const handleSearch = () => {
        router.get('/admin-portal/trial-balance', {
            as_of_date: asOfDate.format('YYYY-MM-DD'),
            account_type: selectedType,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleReset = () => {
        setAsOfDate(dayjs());
        setSelectedType(null);
        router.get('/admin-portal/trial-balance', {
            as_of_date: dayjs().format('YYYY-MM-DD'),
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleExport = () => {
        // TODO: Implement export functionality
        console.log('Export trial balance');
    };

    const columns = [
        {
            title: 'Account Code',
            dataIndex: 'account_code',
            key: 'account_code',
            width: 120,
        },
        {
            title: 'Account Name',
            dataIndex: 'account_name',
            key: 'account_name',
            ellipsis: true,
        },
        {
            title: 'Type',
            dataIndex: 'account_type',
            key: 'account_type',
            width: 120,
            render: (type) => {
                const typeObj = ACCOUNT_TYPES.find(t => t.value === type);
                return (
                    <Tag color={typeObj?.color}>
                        {typeObj?.label.toUpperCase()}
                    </Tag>
                );
            },
        },
        {
            title: 'Debit Balance',
            dataIndex: 'debit_balance',
            key: 'debit_balance',
            width: 150,
            align: 'right',
            render: (amount) => amount > 0 ? `TZS ${parseFloat(amount).toLocaleString()}` : '-',
        },
        {
            title: 'Credit Balance',
            dataIndex: 'credit_balance',
            key: 'credit_balance',
            width: 150,
            align: 'right',
            render: (amount) => amount > 0 ? `TZS ${parseFloat(amount).toLocaleString()}` : '-',
        },
    ];

    return (
        <AdminSidebarLayout>
            <Card>
                {/* Balance Status Alert */}
                {totals && (
                    <Alert
                        message={totals.is_balanced ? "Books are Balanced" : "Books are Out of Balance"}
                        description={
                            totals.is_balanced 
                                ? "Total debits equal total credits. Your accounting records are balanced."
                                : `There is a difference of TZS ${parseFloat(totals.difference).toLocaleString()} between debits and credits. Please review your journal entries.`
                        }
                        type={totals.is_balanced ? "success" : "error"}
                        icon={totals.is_balanced ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                        showIcon
                        style={{ marginBottom: 16 }}
                    />
                )}

                {/* Filters */}
                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <Space wrap>
                        <DatePicker
                            placeholder="As of Date"
                            value={asOfDate}
                            onChange={setAsOfDate}
                            style={{ width: 160 }}
                        />
                        <Select
                            placeholder="Account Type"
                            value={selectedType}
                            onChange={setSelectedType}
                            style={{ width: 150 }}
                            allowClear
                        >
                            {ACCOUNT_TYPES.map(type => (
                                <Select.Option key={type.value} value={type.value}>
                                    {type.label}
                                </Select.Option>
                            ))}
                        </Select>
                        <Button 
                            onClick={handleSearch} 
                            type="primary"
                            icon={<SearchOutlined />}
                        >
                            Generate
                        </Button>
                        <Button onClick={handleReset}>
                            Reset
                        </Button>
                    </Space>
                    <Button
                        icon={<DownloadOutlined />}
                        onClick={handleExport}
                    >
                        Export
                    </Button>
                </div>

                {/* Summary Cards */}
                <div style={{ 
                    marginBottom: 16, 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: '16px' 
                }}>
                    <Card size="small" style={{ backgroundColor: token.colorPrimaryBg }}>
                        <Text type="secondary">Total Debits</Text>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '8px', color: token.colorPrimary }}>
                            TZS {parseFloat(totals.total_debits).toLocaleString()}
                        </div>
                    </Card>
                    <Card size="small" style={{ backgroundColor: token.colorPrimaryBg }}>
                        <Text type="secondary">Total Credits</Text>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '8px', color: token.colorPrimary }}>
                            TZS {parseFloat(totals.total_credits).toLocaleString()}
                        </div>
                    </Card>
                    <Card size="small" style={{ backgroundColor: totals.is_balanced ? token.colorSuccessBg : token.colorErrorBg }}>
                        <Text type="secondary">Difference</Text>
                        <div style={{ 
                            fontSize: '24px', 
                            fontWeight: 'bold', 
                            marginTop: '8px',
                            color: totals.is_balanced ? token.colorSuccess : token.colorError 
                        }}>
                            TZS {parseFloat(totals.difference).toLocaleString()}
                        </div>
                    </Card>
                </div>

                {/* Grouped by Account Type */}
                {!selectedType && Object.keys(groupedData).length > 0 && (
                    <Collapse 
                        defaultActiveKey={Object.keys(groupedData)} 
                        style={{ marginBottom: 16 }}
                    >
                        {ACCOUNT_TYPES.map(type => {
                            const accounts = groupedData[type.value] || [];
                            if (accounts.length === 0) return null;

                            const typeDebits = accounts.reduce((sum, acc) => sum + parseFloat(acc.debit_balance), 0);
                            const typeCredits = accounts.reduce((sum, acc) => sum + parseFloat(acc.credit_balance), 0);

                            return (
                                <Panel 
                                    header={
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span>
                                                <Tag color={type.color}>{type.label.toUpperCase()}</Tag>
                                                <Text type="secondary">({accounts.length} accounts)</Text>
                                            </span>
                                            <Space>
                                                <Text>Debits: TZS {typeDebits.toLocaleString()}</Text>
                                                <Text>Credits: TZS {typeCredits.toLocaleString()}</Text>
                                            </Space>
                                        </div>
                                    }
                                    key={type.value}
                                >
                                    <Table
                                        columns={columns}
                                        dataSource={accounts}
                                        rowKey="id"
                                        pagination={false}
                                        size="small"
                                        bordered
                                    />
                                </Panel>
                            );
                        })}
                    </Collapse>
                )}

                {/* All Accounts Table */}
                <Table
                    columns={columns}
                    dataSource={trialBalanceData}
                    rowKey="id"
                    pagination={false}
                    size="small"
                    bordered
                    scroll={{ x: 800 }}
                    summary={() => (
                        <Table.Summary.Row style={{ backgroundColor: token.colorPrimaryBg }}>
                            <Table.Summary.Cell index={0} colSpan={3}>
                                <strong style={{ fontSize: '16px' }}>TOTAL</strong>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={1} align="right">
                                <strong style={{ fontSize: '16px', color: token.colorPrimary }}>
                                    TZS {parseFloat(totals.total_debits).toLocaleString()}
                                </strong>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={2} align="right">
                                <strong style={{ fontSize: '16px', color: token.colorPrimary }}>
                                    TZS {parseFloat(totals.total_credits).toLocaleString()}
                                </strong>
                            </Table.Summary.Cell>
                        </Table.Summary.Row>
                    )}
                />

                {/* Report Footer */}
                <div style={{ marginTop: 16, textAlign: 'center' }}>
                    <Text type="secondary">
                        Trial Balance as of {dayjs(filters.as_of_date).format('MMMM DD, YYYY')}
                    </Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                        Generated on {dayjs().format('MMMM DD, YYYY HH:mm')}
                    </Text>
                </div>
            </Card>
        </AdminSidebarLayout>
    );
}
