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
    Empty,
    theme,
    DatePicker,
    Descriptions,
    Tag,
    Divider,
} from 'antd';
import { 
    SearchOutlined,
    DownloadOutlined,
    FileTextOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

export default function GeneralLedger({ accounts, ledgerData, filters }) {
    const { token } = theme.useToken();
    const [selectedAccount, setSelectedAccount] = useState(filters.account_id || null);
    const [dateFrom, setDateFrom] = useState(filters.date_from ? dayjs(filters.date_from) : null);
    const [dateTo, setDateTo] = useState(filters.date_to ? dayjs(filters.date_to) : null);

    const handleSearch = () => {
        router.get('/admin-portal/general-ledger', {
            account_id: selectedAccount,
            date_from: dateFrom ? dateFrom.format('YYYY-MM-DD') : null,
            date_to: dateTo ? dateTo.format('YYYY-MM-DD') : null,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleReset = () => {
        setSelectedAccount(null);
        setDateFrom(null);
        setDateTo(null);
        router.get('/admin-portal/general-ledger', {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleExport = () => {
        // TODO: Implement export functionality
        console.log('Export ledger');
    };

    const getAccountTypeColor = (type) => {
        const colors = {
            asset: 'blue',
            liability: 'red',
            equity: 'purple',
            revenue: 'green',
            expense: 'orange',
        };
        return colors[type] || 'default';
    };

    const columns = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            width: 120,
            render: (date) => dayjs(date).format('MMM DD, YYYY'),
        },
        {
            title: 'Entry Number',
            dataIndex: 'entry_number',
            key: 'entry_number',
            width: 140,
        },
        {
            title: 'Reference',
            dataIndex: 'reference',
            key: 'reference',
            width: 120,
            render: (ref) => ref || '-',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
        },
        {
            title: 'Debit',
            dataIndex: 'debit',
            key: 'debit',
            width: 140,
            align: 'right',
            render: (amount) => amount > 0 ? `TZS ${parseFloat(amount).toLocaleString()}` : '-',
        },
        {
            title: 'Credit',
            dataIndex: 'credit',
            key: 'credit',
            width: 140,
            align: 'right',
            render: (amount) => amount > 0 ? `TZS ${parseFloat(amount).toLocaleString()}` : '-',
        },
        {
            title: 'Balance',
            dataIndex: 'balance',
            key: 'balance',
            width: 150,
            align: 'right',
            render: (balance) => (
                <strong style={{ color: balance < 0 ? token.colorError : token.colorText }}>
                    TZS {parseFloat(balance).toLocaleString()}
                </strong>
            ),
        },
    ];

    return (
        <AdminSidebarLayout>
            <Card>
                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <Space wrap>
                        <Select
                            placeholder="Select Account"
                            value={selectedAccount}
                            onChange={setSelectedAccount}
                            style={{ width: 300 }}
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().includes(input.toLowerCase())
                            }
                        >
                            {accounts?.map(account => (
                                <Select.Option key={account.id} value={account.id}>
                                    {account.account_code} - {account.account_name}
                                </Select.Option>
                            ))}
                        </Select>
                        <DatePicker
                            placeholder="From Date"
                            value={dateFrom}
                            onChange={setDateFrom}
                            style={{ width: 140 }}
                        />
                        <DatePicker
                            placeholder="To Date"
                            value={dateTo}
                            onChange={setDateTo}
                            style={{ width: 140 }}
                        />
                        <Button 
                            onClick={handleSearch} 
                            type="primary"
                            icon={<SearchOutlined />}
                            disabled={!selectedAccount}
                        >
                            View Ledger
                        </Button>
                        <Button onClick={handleReset}>
                            Reset
                        </Button>
                    </Space>
                    {ledgerData && (
                        <Button
                            icon={<DownloadOutlined />}
                            onClick={handleExport}
                        >
                            Export
                        </Button>
                    )}
                </div>

                {!ledgerData ? (
                    <Empty
                        description="Select an account to view its general ledger"
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                ) : (
                    <div>
                        {/* Account Information */}
                        <Card 
                            size="small" 
                            style={{ 
                                marginBottom: 16,
                                backgroundColor: token.colorBgContainer,
                            }}
                        >
                            <Descriptions column={4} size="small">
                                <Descriptions.Item label="Account Code">
                                    <strong>{ledgerData.account.account_code}</strong>
                                </Descriptions.Item>
                                <Descriptions.Item label="Account Name">
                                    <strong>{ledgerData.account.account_name}</strong>
                                </Descriptions.Item>
                                <Descriptions.Item label="Type">
                                    <Tag color={getAccountTypeColor(ledgerData.account.account_type)}>
                                        {ledgerData.account.account_type.toUpperCase()}
                                    </Tag>
                                </Descriptions.Item>
                                <Descriptions.Item label="Normal Balance">
                                    <Tag color={ledgerData.account.normal_balance === 'debit' ? 'blue' : 'green'}>
                                        {ledgerData.account.normal_balance.toUpperCase()}
                                    </Tag>
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>

                        {/* Transactions Table */}
                        <Table
                            columns={columns}
                            dataSource={ledgerData.transactions}
                            rowKey="id"
                            pagination={false}
                            size="small"
                            bordered
                            scroll={{ x: 1000 }}
                            locale={{
                                emptyText: (
                                    <Empty
                                        description="No transactions found for this account"
                                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    />
                                ),
                            }}
                            summary={() => (
                                <>
                                    <Table.Summary.Row style={{ backgroundColor: token.colorBgLayout }}>
                                        <Table.Summary.Cell index={0} colSpan={4}>
                                            <strong>Opening Balance</strong>
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={1} colSpan={2} align="right">
                                            <strong>TZS {parseFloat(ledgerData.opening_balance).toLocaleString()}</strong>
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={2}></Table.Summary.Cell>
                                    </Table.Summary.Row>
                                    <Table.Summary.Row style={{ backgroundColor: token.colorBgLayout }}>
                                        <Table.Summary.Cell index={0} colSpan={4}>
                                            <strong>Total Transactions</strong>
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={1} align="right">
                                            <strong style={{ color: token.colorPrimary }}>
                                                TZS {parseFloat(ledgerData.total_debit).toLocaleString()}
                                            </strong>
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={2} align="right">
                                            <strong style={{ color: token.colorPrimary }}>
                                                TZS {parseFloat(ledgerData.total_credit).toLocaleString()}
                                            </strong>
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={3}></Table.Summary.Cell>
                                    </Table.Summary.Row>
                                    <Table.Summary.Row style={{ backgroundColor: token.colorPrimaryBg }}>
                                        <Table.Summary.Cell index={0} colSpan={4}>
                                            <strong>Ending Balance</strong>
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={1} colSpan={2} align="right">
                                            <strong style={{ 
                                                fontSize: '16px',
                                                color: ledgerData.ending_balance < 0 ? token.colorError : token.colorSuccess 
                                            }}>
                                                TZS {parseFloat(ledgerData.ending_balance).toLocaleString()}
                                            </strong>
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={2}></Table.Summary.Cell>
                                    </Table.Summary.Row>
                                </>
                            )}
                        />

                        {/* Summary Cards */}
                        <div style={{ 
                            marginTop: 16, 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                            gap: '16px' 
                        }}>
                            <Card size="small">
                                <Text type="secondary">Opening Balance</Text>
                                <div style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '8px' }}>
                                    TZS {parseFloat(ledgerData.opening_balance).toLocaleString()}
                                </div>
                            </Card>
                            <Card size="small">
                                <Text type="secondary">Total Debits</Text>
                                <div style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '8px', color: token.colorPrimary }}>
                                    TZS {parseFloat(ledgerData.total_debit).toLocaleString()}
                                </div>
                            </Card>
                            <Card size="small">
                                <Text type="secondary">Total Credits</Text>
                                <div style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '8px', color: token.colorPrimary }}>
                                    TZS {parseFloat(ledgerData.total_credit).toLocaleString()}
                                </div>
                            </Card>
                            <Card size="small">
                                <Text type="secondary">Ending Balance</Text>
                                <div style={{ 
                                    fontSize: '20px', 
                                    fontWeight: 'bold', 
                                    marginTop: '8px',
                                    color: ledgerData.ending_balance < 0 ? token.colorError : token.colorSuccess 
                                }}>
                                    TZS {parseFloat(ledgerData.ending_balance).toLocaleString()}
                                </div>
                            </Card>
                        </div>

                        {/* Period Information */}
                        {(dateFrom || dateTo) && (
                            <div style={{ marginTop: 16, textAlign: 'center' }}>
                                <Text type="secondary">
                                    Period: {dateFrom ? dayjs(dateFrom).format('MMM DD, YYYY') : 'Beginning'} 
                                    {' to '}
                                    {dateTo ? dayjs(dateTo).format('MMM DD, YYYY') : 'Present'}
                                </Text>
                            </div>
                        )}
                    </div>
                )}
            </Card>
        </AdminSidebarLayout>
    );
}
