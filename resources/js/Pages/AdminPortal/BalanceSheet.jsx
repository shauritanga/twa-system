import React, { useState } from 'react';
import AdminSidebarLayout from '@/Layouts/AdminSidebarLayout';
import { router } from '@inertiajs/react';
import { 
    Card, 
    Button, 
    Space, 
    Typography,
    theme,
    DatePicker,
    Alert,
    Divider,
    Row,
    Col,
} from 'antd';
import { 
    DownloadOutlined,
    FileTextOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

export default function BalanceSheet({ 
    assets, 
    liabilities, 
    equity, 
    groupedAssets, 
    groupedLiabilities, 
    groupedEquity, 
    totals, 
    filters 
}) {
    const { token } = theme.useToken();
    const [asOfDate, setAsOfDate] = useState(filters.as_of_date ? dayjs(filters.as_of_date) : dayjs());

    const handleGenerate = () => {
        router.get('/admin-portal/balance-sheet', {
            as_of_date: asOfDate.format('YYYY-MM-DD'),
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleExport = () => {
        // TODO: Implement export functionality
        console.log('Export balance sheet');
    };

    const renderAccountGroup = (title, accounts, showSubtotals = true) => {
        if (!accounts || accounts.length === 0) return null;

        const grouped = accounts.reduce((acc, account) => {
            const subtype = account.account_subtype || 'Other';
            if (!acc[subtype]) acc[subtype] = [];
            acc[subtype].push(account);
            return acc;
        }, {});

        return (
            <div style={{ marginBottom: 24 }}>
                <Title level={5} style={{ 
                    marginBottom: 16, 
                    color: token.colorPrimary,
                    borderBottom: `2px solid ${token.colorPrimary}`,
                    paddingBottom: 8,
                }}>
                    {title}
                </Title>
                {Object.entries(grouped).map(([subtype, subtypeAccounts]) => {
                    const subtotal = subtypeAccounts.reduce((sum, acc) => sum + parseFloat(acc.balance), 0);
                    return (
                        <div key={subtype} style={{ marginBottom: 16 }}>
                            {showSubtotals && (
                                <div style={{ 
                                    fontWeight: 'bold', 
                                    marginBottom: 8,
                                    color: token.colorTextSecondary,
                                }}>
                                    {subtype}
                                </div>
                            )}
                            {subtypeAccounts.map(account => (
                                <Row key={account.id} style={{ marginBottom: 4, paddingLeft: showSubtotals ? 16 : 0 }}>
                                    <Col span={16}>
                                        <Text>{account.account_name}</Text>
                                    </Col>
                                    <Col span={8} style={{ textAlign: 'right' }}>
                                        <Text>TZS {parseFloat(account.balance).toLocaleString()}</Text>
                                    </Col>
                                </Row>
                            ))}
                            {showSubtotals && subtypeAccounts.length > 1 && (
                                <Row style={{ marginTop: 8, paddingLeft: 16, borderTop: `1px solid ${token.colorBorder}`, paddingTop: 4 }}>
                                    <Col span={16}>
                                        <Text strong>Total {subtype}</Text>
                                    </Col>
                                    <Col span={8} style={{ textAlign: 'right' }}>
                                        <Text strong>TZS {subtotal.toLocaleString()}</Text>
                                    </Col>
                                </Row>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <AdminSidebarLayout>
                {/* Balance Status Alert */}
                {totals && (
                    <Alert
                        message={totals.is_balanced ? "Balance Sheet is Balanced" : "Balance Sheet is Out of Balance"}
                        description={
                            totals.is_balanced 
                                ? "Assets equal Liabilities plus Equity. Your financial position is properly stated."
                                : `There is a difference of TZS ${parseFloat(totals.difference).toLocaleString()}. Please review your accounts.`
                        }
                        type={totals.is_balanced ? "success" : "error"}
                        icon={totals.is_balanced ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                        showIcon
                        style={{ marginBottom: 16 }}
                    />
                )}

                {/* Controls */}
                <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <Space>
                        <DatePicker
                            placeholder="As of Date"
                            value={asOfDate}
                            onChange={setAsOfDate}
                            style={{ width: 160 }}
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

                {/* Balance Sheet Content */}
                <div style={{ 
                    padding: 24,
                    backgroundColor: token.colorBgContainer,
                    border: `1px solid ${token.colorBorder}`,
                    borderRadius: 8,
                }}>
                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: 32 }}>
                        <Text type="secondary">As of {dayjs(filters.as_of_date).format('MMMM DD, YYYY')}</Text>
                    </div>

                    {/* Assets Section */}
                    {renderAccountGroup('ASSETS', assets)}
                    
                    <Row style={{ 
                        marginBottom: 32, 
                        paddingTop: 12,
                        borderTop: `2px solid ${token.colorPrimary}`,
                        borderBottom: `3px double ${token.colorPrimary}`,
                        paddingBottom: 12,
                    }}>
                        <Col span={16}>
                            <Text strong style={{ fontSize: 16 }}>TOTAL ASSETS</Text>
                        </Col>
                        <Col span={8} style={{ textAlign: 'right' }}>
                            <Text strong style={{ fontSize: 16, color: token.colorPrimary }}>
                                TZS {parseFloat(totals.total_assets).toLocaleString()}
                            </Text>
                        </Col>
                    </Row>

                    {/* Liabilities Section */}
                    {renderAccountGroup('LIABILITIES', liabilities)}
                    
                    <Row style={{ 
                        marginBottom: 16, 
                        paddingTop: 8,
                        borderTop: `1px solid ${token.colorBorder}`,
                        paddingBottom: 8,
                    }}>
                        <Col span={16}>
                            <Text strong>TOTAL LIABILITIES</Text>
                        </Col>
                        <Col span={8} style={{ textAlign: 'right' }}>
                            <Text strong>TZS {parseFloat(totals.total_liabilities).toLocaleString()}</Text>
                        </Col>
                    </Row>

                    {/* Equity Section */}
                    {renderAccountGroup('EQUITY', equity, false)}
                    
                    {/* Net Income */}
                    {totals.net_income !== 0 && (
                        <Row style={{ marginBottom: 8 }}>
                            <Col span={16}>
                                <Text>Net Income (Current Period)</Text>
                            </Col>
                            <Col span={8} style={{ textAlign: 'right' }}>
                                <Text style={{ color: totals.net_income >= 0 ? token.colorSuccess : token.colorError }}>
                                    TZS {parseFloat(totals.net_income).toLocaleString()}
                                </Text>
                            </Col>
                        </Row>
                    )}

                    <Row style={{ 
                        marginBottom: 16, 
                        paddingTop: 8,
                        borderTop: `1px solid ${token.colorBorder}`,
                        paddingBottom: 8,
                    }}>
                        <Col span={16}>
                            <Text strong>TOTAL EQUITY</Text>
                        </Col>
                        <Col span={8} style={{ textAlign: 'right' }}>
                            <Text strong>TZS {parseFloat(totals.total_equity_with_income).toLocaleString()}</Text>
                        </Col>
                    </Row>

                    <Row style={{ 
                        marginBottom: 24, 
                        paddingTop: 12,
                        borderTop: `2px solid ${token.colorPrimary}`,
                        borderBottom: `3px double ${token.colorPrimary}`,
                        paddingBottom: 12,
                    }}>
                        <Col span={16}>
                            <Text strong style={{ fontSize: 16 }}>TOTAL LIABILITIES & EQUITY</Text>
                        </Col>
                        <Col span={8} style={{ textAlign: 'right' }}>
                            <Text strong style={{ fontSize: 16, color: token.colorPrimary }}>
                                TZS {parseFloat(totals.total_liabilities_and_equity).toLocaleString()}
                            </Text>
                        </Col>
                    </Row>

                    {/* Accounting Equation */}
                    <div style={{ 
                        textAlign: 'center', 
                        padding: 16, 
                        backgroundColor: totals.is_balanced ? token.colorSuccessBg : token.colorErrorBg,
                        borderRadius: 8,
                        marginTop: 24,
                    }}>
                        <Text strong style={{ fontSize: 14 }}>
                            Assets (TZS {parseFloat(totals.total_assets).toLocaleString()}) 
                            {' = '}
                            Liabilities (TZS {parseFloat(totals.total_liabilities).toLocaleString()})
                            {' + '}
                            Equity (TZS {parseFloat(totals.total_equity_with_income).toLocaleString()})
                        </Text>
                        {!totals.is_balanced && (
                            <div style={{ marginTop: 8 }}>
                                <Text type="danger">
                                    Difference: TZS {parseFloat(totals.difference).toLocaleString()}
                                </Text>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div style={{ marginTop: 32, textAlign: 'center', borderTop: `1px solid ${token.colorBorder}`, paddingTop: 16 }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            Generated on {dayjs().format('MMMM DD, YYYY HH:mm')}
                        </Text>
                    </div>
                </div>

                {/* Summary Cards */}
                <div style={{ 
                    marginTop: 24, 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: '16px' 
                }}>
                    <Card size="small" style={{ backgroundColor: token.colorInfoBg }}>
                        <Text type="secondary">Total Assets</Text>
                        <div style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '8px', color: token.colorInfo }}>
                            TZS {parseFloat(totals.total_assets).toLocaleString()}
                        </div>
                    </Card>
                    <Card size="small" style={{ backgroundColor: token.colorWarningBg }}>
                        <Text type="secondary">Total Liabilities</Text>
                        <div style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '8px', color: token.colorWarning }}>
                            TZS {parseFloat(totals.total_liabilities).toLocaleString()}
                        </div>
                    </Card>
                    <Card size="small" style={{ backgroundColor: token.colorSuccessBg }}>
                        <Text type="secondary">Total Equity</Text>
                        <div style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '8px', color: token.colorSuccess }}>
                            TZS {parseFloat(totals.total_equity_with_income).toLocaleString()}
                        </div>
                    </Card>
                    <Card size="small" style={{ backgroundColor: totals.net_income >= 0 ? token.colorSuccessBg : token.colorErrorBg }}>
                        <Text type="secondary">Net Income</Text>
                        <div style={{ 
                            fontSize: '20px', 
                            fontWeight: 'bold', 
                            marginTop: '8px',
                            color: totals.net_income >= 0 ? token.colorSuccess : token.colorError 
                        }}>
                            TZS {parseFloat(totals.net_income).toLocaleString()}
                        </div>
                    </Card>
                </div>
        </AdminSidebarLayout>
    );
}
