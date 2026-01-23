import React, { useState } from 'react';
import AdminSidebarLayout from '@/Layouts/AdminSidebarLayout';
import { router, Head } from '@inertiajs/react';
import { 
    Card, 
    Button, 
    Space, 
    Typography,
    theme,
    DatePicker,
    Row,
    Col,
    Progress,
} from 'antd';
import { 
    DownloadOutlined,
    FileTextOutlined,
    RiseOutlined,
    FallOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

export default function IncomeStatement({ 
    revenue, 
    expenses, 
    groupedRevenue, 
    groupedExpenses, 
    totals, 
    filters 
}) {
    const { token } = theme.useToken();
    const [dateFrom, setDateFrom] = useState(filters.date_from ? dayjs(filters.date_from) : dayjs().startOf('year'));
    const [dateTo, setDateTo] = useState(filters.date_to ? dayjs(filters.date_to) : dayjs());

    const handleGenerate = () => {
        router.get('/admin-portal/income-statement', {
            date_from: dateFrom.format('YYYY-MM-DD'),
            date_to: dateTo.format('YYYY-MM-DD'),
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleExport = () => {
        // TODO: Implement export functionality
        console.log('Export income statement');
    };

    const renderAccountGroup = (title, accounts, isRevenue = false) => {
        if (!accounts || accounts.length === 0) return null;

        const grouped = accounts.reduce((acc, account) => {
            const subtype = account.account_subtype || 'Other';
            if (!acc[subtype]) acc[subtype] = [];
            acc[subtype].push(account);
            return acc;
        }, {});

        const total = accounts.reduce((sum, acc) => sum + parseFloat(acc.balance), 0);

        return (
            <div style={{ marginBottom: 24 }}>
                <Title level={5} style={{ 
                    marginBottom: 16, 
                    color: isRevenue ? token.colorSuccess : token.colorError,
                    borderBottom: `2px solid ${isRevenue ? token.colorSuccess : token.colorError}`,
                    paddingBottom: 8,
                }}>
                    {title}
                </Title>
                {Object.entries(grouped).map(([subtype, subtypeAccounts]) => {
                    const subtotal = subtypeAccounts.reduce((sum, acc) => sum + parseFloat(acc.balance), 0);
                    return (
                        <div key={subtype} style={{ marginBottom: 16 }}>
                            {subtypeAccounts.length > 1 && (
                                <div style={{ 
                                    fontWeight: 'bold', 
                                    marginBottom: 8,
                                    color: token.colorTextSecondary,
                                }}>
                                    {subtype}
                                </div>
                            )}
                            {subtypeAccounts.map(account => (
                                <Row key={account.id} style={{ marginBottom: 4, paddingLeft: subtypeAccounts.length > 1 ? 16 : 0 }}>
                                    <Col span={14}>
                                        <Text>{account.account_name}</Text>
                                    </Col>
                                    <Col span={6} style={{ textAlign: 'right' }}>
                                        <Text>TZS {parseFloat(account.balance).toLocaleString()}</Text>
                                    </Col>
                                    <Col span={4} style={{ textAlign: 'right', paddingLeft: 8 }}>
                                        <Text type="secondary" style={{ fontSize: '12px' }}>
                                            {account.percentage?.toFixed(1)}%
                                        </Text>
                                    </Col>
                                </Row>
                            ))}
                            {subtypeAccounts.length > 1 && (
                                <Row style={{ 
                                    marginTop: 8, 
                                    paddingLeft: 16, 
                                    borderTop: `1px solid ${token.colorBorder}`, 
                                    paddingTop: 4 
                                }}>
                                    <Col span={14}>
                                        <Text strong>Total {subtype}</Text>
                                    </Col>
                                    <Col span={6} style={{ textAlign: 'right' }}>
                                        <Text strong>TZS {subtotal.toLocaleString()}</Text>
                                    </Col>
                                    <Col span={4}></Col>
                                </Row>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    const isProfitable = totals.net_income >= 0;

    return (
        <>
            <Head title="Income Statement - Tabata Welfare Association" />
            <AdminSidebarLayout>
                {/* Controls */}
                <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <Space>
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
                            onClick={handleGenerate} 
                            type="primary"
                        >
                            Generate Report
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
                    marginBottom: 24, 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: '16px' 
                }}>
                    <Card size="small" style={{ backgroundColor: token.colorSuccessBg }}>
                        <Text type="secondary">Total Revenue</Text>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '8px', color: token.colorSuccess }}>
                            TZS {parseFloat(totals.total_revenue).toLocaleString()}
                        </div>
                    </Card>
                    <Card size="small" style={{ backgroundColor: token.colorErrorBg }}>
                        <Text type="secondary">Total Expenses</Text>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '8px', color: token.colorError }}>
                            TZS {parseFloat(totals.total_expenses).toLocaleString()}
                        </div>
                    </Card>
                    <Card size="small" style={{ backgroundColor: isProfitable ? token.colorSuccessBg : token.colorErrorBg }}>
                        <Text type="secondary">Net Income</Text>
                        <div style={{ 
                            fontSize: '24px', 
                            fontWeight: 'bold', 
                            marginTop: '8px',
                            color: isProfitable ? token.colorSuccess : token.colorError,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                        }}>
                            {isProfitable ? <RiseOutlined /> : <FallOutlined />}
                            TZS {parseFloat(totals.net_income).toLocaleString()}
                        </div>
                    </Card>
                    <Card size="small" style={{ backgroundColor: token.colorPrimaryBg }}>
                        <Text type="secondary">Profit Margin</Text>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '8px', color: token.colorPrimary }}>
                            {totals.profit_margin.toFixed(1)}%
                        </div>
                        <Progress 
                            percent={Math.abs(totals.profit_margin)} 
                            showInfo={false} 
                            strokeColor={isProfitable ? token.colorSuccess : token.colorError}
                            size="small"
                            style={{ marginTop: 8 }}
                        />
                    </Card>
                </div>

                {/* Income Statement Content */}
                <div style={{ 
                    padding: 24,
                    backgroundColor: token.colorBgContainer,
                    border: `1px solid ${token.colorBorder}`,
                    borderRadius: 8,
                }}>
                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: 32 }}>
                        <Text type="secondary">
                            For the Period: {dayjs(filters.date_from).format('MMM DD, YYYY')} to {dayjs(filters.date_to).format('MMM DD, YYYY')}
                        </Text>
                    </div>

                    {/* Revenue Section */}
                    {renderAccountGroup('REVENUE', revenue, true)}
                    
                    <Row style={{ 
                        marginBottom: 32, 
                        paddingTop: 12,
                        borderTop: `2px solid ${token.colorSuccess}`,
                        paddingBottom: 12,
                    }}>
                        <Col span={14}>
                            <Text strong style={{ fontSize: 16 }}>TOTAL REVENUE</Text>
                        </Col>
                        <Col span={6} style={{ textAlign: 'right' }}>
                            <Text strong style={{ fontSize: 16, color: token.colorSuccess }}>
                                TZS {parseFloat(totals.total_revenue).toLocaleString()}
                            </Text>
                        </Col>
                        <Col span={4} style={{ textAlign: 'right' }}>
                            <Text strong style={{ fontSize: 14 }}>100%</Text>
                        </Col>
                    </Row>

                    {/* Expenses Section */}
                    {renderAccountGroup('EXPENSES', expenses, false)}
                    
                    <Row style={{ 
                        marginBottom: 24, 
                        paddingTop: 12,
                        borderTop: `2px solid ${token.colorError}`,
                        paddingBottom: 12,
                    }}>
                        <Col span={14}>
                            <Text strong style={{ fontSize: 16 }}>TOTAL EXPENSES</Text>
                        </Col>
                        <Col span={6} style={{ textAlign: 'right' }}>
                            <Text strong style={{ fontSize: 16, color: token.colorError }}>
                                TZS {parseFloat(totals.total_expenses).toLocaleString()}
                            </Text>
                        </Col>
                        <Col span={4} style={{ textAlign: 'right' }}>
                            <Text strong style={{ fontSize: 14 }}>
                                {totals.total_revenue > 0 ? ((totals.total_expenses / totals.total_revenue) * 100).toFixed(1) : 0}%
                            </Text>
                        </Col>
                    </Row>

                    {/* Net Income */}
                    <Row style={{ 
                        marginBottom: 24, 
                        paddingTop: 16,
                        paddingBottom: 16,
                        borderTop: `3px double ${token.colorPrimary}`,
                        borderBottom: `3px double ${token.colorPrimary}`,
                        backgroundColor: isProfitable ? token.colorSuccessBg : token.colorErrorBg,
                        marginLeft: -24,
                        marginRight: -24,
                        paddingLeft: 24,
                        paddingRight: 24,
                    }}>
                        <Col span={14}>
                            <Text strong style={{ fontSize: 18 }}>
                                {isProfitable ? 'NET INCOME (PROFIT)' : 'NET LOSS'}
                            </Text>
                        </Col>
                        <Col span={6} style={{ textAlign: 'right' }}>
                            <Text strong style={{ 
                                fontSize: 18, 
                                color: isProfitable ? token.colorSuccess : token.colorError 
                            }}>
                                TZS {parseFloat(totals.net_income).toLocaleString()}
                            </Text>
                        </Col>
                        <Col span={4} style={{ textAlign: 'right' }}>
                            <Text strong style={{ fontSize: 16 }}>
                                {totals.profit_margin.toFixed(1)}%
                            </Text>
                        </Col>
                    </Row>

                    {/* Performance Indicator */}
                    <div style={{ 
                        textAlign: 'center', 
                        padding: 16, 
                        backgroundColor: isProfitable ? token.colorSuccessBg : token.colorErrorBg,
                        borderRadius: 8,
                        marginTop: 24,
                    }}>
                        <Text strong style={{ fontSize: 14 }}>
                            {isProfitable 
                                ? `✓ Organization generated a profit of TZS ${parseFloat(totals.net_income).toLocaleString()} (${totals.profit_margin.toFixed(1)}% margin)`
                                : `⚠ Organization incurred a loss of TZS ${parseFloat(Math.abs(totals.net_income)).toLocaleString()}`
                            }
                        </Text>
                    </div>

                    {/* Footer */}
                    <div style={{ marginTop: 32, textAlign: 'center', borderTop: `1px solid ${token.colorBorder}`, paddingTop: 16 }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            Generated on {dayjs().format('MMMM DD, YYYY HH:mm')}
                        </Text>
                    </div>
                </div>

                {/* Expense Breakdown Chart */}
                {expenses && expenses.length > 0 && (
                    <div style={{ marginTop: 24 }}>
                        <Title level={5}>Expense Breakdown</Title>
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
                            gap: '12px',
                            marginTop: 16,
                        }}>
                            {expenses.slice(0, 6).map(expense => (
                                <Card key={expense.id} size="small">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                        <Text strong>{expense.account_name}</Text>
                                        <Text type="secondary">{expense.percentage?.toFixed(1)}%</Text>
                                    </div>
                                    <Progress 
                                        percent={expense.percentage} 
                                        strokeColor={token.colorError}
                                        size="small"
                                    />
                                    <Text type="secondary" style={{ fontSize: '12px' }}>
                                        TZS {parseFloat(expense.balance).toLocaleString()}
                                    </Text>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
        </AdminSidebarLayout>
        </>
    );
}
