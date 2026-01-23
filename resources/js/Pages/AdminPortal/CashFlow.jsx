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
    Tag,
} from 'antd';
import { 
    DownloadOutlined,
    FileTextOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

export default function CashFlow({ 
    operatingActivities, 
    investingActivities, 
    financingActivities, 
    totals, 
    filters 
}) {
    const { token } = theme.useToken();
    const [dateFrom, setDateFrom] = useState(filters.date_from ? dayjs(filters.date_from) : dayjs().startOf('year'));
    const [dateTo, setDateTo] = useState(filters.date_to ? dayjs(filters.date_to) : dayjs());

    const handleGenerate = () => {
        router.get('/admin-portal/cash-flow', {
            date_from: dateFrom.format('YYYY-MM-DD'),
            date_to: dateTo.format('YYYY-MM-DD'),
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleExport = () => {
        // TODO: Implement export functionality
        console.log('Export cash flow statement');
    };

    const renderCashFlowSection = (title, activities, color) => {
        if (!activities || activities.length === 0) {
            return (
                <div style={{ marginBottom: 24 }}>
                    <Title level={5} style={{ 
                        marginBottom: 16, 
                        color: color,
                        borderBottom: `2px solid ${color}`,
                        paddingBottom: 8,
                    }}>
                        {title}
                    </Title>
                    <Text type="secondary" style={{ paddingLeft: 16 }}>No activities in this period</Text>
                </div>
            );
        }

        const total = activities.reduce((sum, activity) => sum + parseFloat(activity.amount), 0);

        return (
            <div style={{ marginBottom: 24 }}>
                <Title level={5} style={{ 
                    marginBottom: 16, 
                    color: color,
                    borderBottom: `2px solid ${color}`,
                    paddingBottom: 8,
                }}>
                    {title}
                </Title>
                {activities.map((activity, index) => (
                    <Row key={index} style={{ marginBottom: 8, paddingLeft: 16 }}>
                        <Col span={16}>
                            <Space>
                                {activity.type === 'inflow' ? (
                                    <ArrowUpOutlined style={{ color: token.colorSuccess }} />
                                ) : (
                                    <ArrowDownOutlined style={{ color: token.colorError }} />
                                )}
                                <Text>{activity.description}</Text>
                            </Space>
                        </Col>
                        <Col span={8} style={{ textAlign: 'right' }}>
                            <Text style={{ color: activity.amount >= 0 ? token.colorSuccess : token.colorError }}>
                                {activity.amount >= 0 ? '+' : ''}TZS {parseFloat(activity.amount).toLocaleString()}
                            </Text>
                        </Col>
                    </Row>
                ))}
                <Row style={{ 
                    marginTop: 12, 
                    paddingTop: 8,
                    borderTop: `1px solid ${token.colorBorder}`,
                    paddingLeft: 16,
                }}>
                    <Col span={16}>
                        <Text strong>Net Cash from {title}</Text>
                    </Col>
                    <Col span={8} style={{ textAlign: 'right' }}>
                        <Text strong style={{ 
                            fontSize: 16,
                            color: total >= 0 ? token.colorSuccess : token.colorError 
                        }}>
                            {total >= 0 ? '+' : ''}TZS {parseFloat(total).toLocaleString()}
                        </Text>
                    </Col>
                </Row>
            </div>
        );
    };

    return (
        <>
            <Head title="Cash Flow Statement - Tabata Welfare Association" />
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
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
                    gap: '12px' 
                }}>
                    <Card size="small" style={{ backgroundColor: token.colorInfoBg }}>
                        <Text type="secondary" style={{ fontSize: '12px' }}>Opening Cash</Text>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '4px', color: token.colorInfo }}>
                            TZS {parseFloat(totals.opening_cash).toLocaleString()}
                        </div>
                    </Card>
                    <Card size="small" style={{ backgroundColor: token.colorPrimaryBg }}>
                        <Text type="secondary" style={{ fontSize: '12px' }}>Operating</Text>
                        <div style={{ 
                            fontSize: '18px', 
                            fontWeight: 'bold', 
                            marginTop: '4px',
                            color: totals.net_operating >= 0 ? token.colorSuccess : token.colorError 
                        }}>
                            {totals.net_operating >= 0 ? '+' : ''}TZS {parseFloat(totals.net_operating).toLocaleString()}
                        </div>
                    </Card>
                    <Card size="small" style={{ backgroundColor: token.colorWarningBg }}>
                        <Text type="secondary" style={{ fontSize: '12px' }}>Investing</Text>
                        <div style={{ 
                            fontSize: '18px', 
                            fontWeight: 'bold', 
                            marginTop: '4px',
                            color: totals.net_investing >= 0 ? token.colorSuccess : token.colorError 
                        }}>
                            {totals.net_investing >= 0 ? '+' : ''}TZS {parseFloat(totals.net_investing).toLocaleString()}
                        </div>
                    </Card>
                    <Card size="small" style={{ backgroundColor: token.colorErrorBg }}>
                        <Text type="secondary" style={{ fontSize: '12px' }}>Financing</Text>
                        <div style={{ 
                            fontSize: '18px', 
                            fontWeight: 'bold', 
                            marginTop: '4px',
                            color: totals.net_financing >= 0 ? token.colorSuccess : token.colorError 
                        }}>
                            {totals.net_financing >= 0 ? '+' : ''}TZS {parseFloat(totals.net_financing).toLocaleString()}
                        </div>
                    </Card>
                    <Card size="small" style={{ backgroundColor: totals.net_cash_change >= 0 ? token.colorSuccessBg : token.colorErrorBg }}>
                        <Text type="secondary" style={{ fontSize: '12px' }}>Net Change</Text>
                        <div style={{ 
                            fontSize: '18px', 
                            fontWeight: 'bold', 
                            marginTop: '4px',
                            color: totals.net_cash_change >= 0 ? token.colorSuccess : token.colorError 
                        }}>
                            {totals.net_cash_change >= 0 ? '+' : ''}TZS {parseFloat(totals.net_cash_change).toLocaleString()}
                        </div>
                    </Card>
                    <Card size="small" style={{ backgroundColor: token.colorSuccessBg }}>
                        <Text type="secondary" style={{ fontSize: '12px' }}>Closing Cash</Text>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '4px', color: token.colorSuccess }}>
                            TZS {parseFloat(totals.closing_cash).toLocaleString()}
                        </div>
                    </Card>
                </div>

                {/* Cash Flow Statement Content */}
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

                    {/* Opening Balance */}
                    <Row style={{ marginBottom: 24, padding: 12, backgroundColor: token.colorInfoBg, borderRadius: 4 }}>
                        <Col span={16}>
                            <Text strong>Cash at Beginning of Period</Text>
                        </Col>
                        <Col span={8} style={{ textAlign: 'right' }}>
                            <Text strong style={{ fontSize: 16 }}>
                                TZS {parseFloat(totals.opening_cash).toLocaleString()}
                            </Text>
                        </Col>
                    </Row>

                    {/* Operating Activities */}
                    {renderCashFlowSection('Operating Activities', operatingActivities, token.colorPrimary)}

                    {/* Investing Activities */}
                    {renderCashFlowSection('Investing Activities', investingActivities, token.colorWarning)}

                    {/* Financing Activities */}
                    {renderCashFlowSection('Financing Activities', financingActivities, token.colorError)}

                    {/* Net Change in Cash */}
                    <Row style={{ 
                        marginBottom: 24, 
                        paddingTop: 16,
                        paddingBottom: 16,
                        borderTop: `2px solid ${token.colorPrimary}`,
                        borderBottom: `2px solid ${token.colorPrimary}`,
                    }}>
                        <Col span={16}>
                            <Text strong style={{ fontSize: 16 }}>Net Increase/(Decrease) in Cash</Text>
                        </Col>
                        <Col span={8} style={{ textAlign: 'right' }}>
                            <Text strong style={{ 
                                fontSize: 18, 
                                color: totals.net_cash_change >= 0 ? token.colorSuccess : token.colorError 
                            }}>
                                {totals.net_cash_change >= 0 ? '+' : ''}TZS {parseFloat(totals.net_cash_change).toLocaleString()}
                            </Text>
                        </Col>
                    </Row>

                    {/* Closing Balance */}
                    <Row style={{ 
                        marginBottom: 24, 
                        padding: 16,
                        backgroundColor: token.colorSuccessBg,
                        borderRadius: 4,
                        borderTop: `3px double ${token.colorSuccess}`,
                        borderBottom: `3px double ${token.colorSuccess}`,
                    }}>
                        <Col span={16}>
                            <Text strong style={{ fontSize: 18 }}>Cash at End of Period</Text>
                        </Col>
                        <Col span={8} style={{ textAlign: 'right' }}>
                            <Text strong style={{ fontSize: 20, color: token.colorSuccess }}>
                                TZS {parseFloat(totals.closing_cash).toLocaleString()}
                            </Text>
                        </Col>
                    </Row>

                    {/* Reconciliation */}
                    <div style={{ 
                        textAlign: 'center', 
                        padding: 12, 
                        backgroundColor: token.colorInfoBg,
                        borderRadius: 4,
                        marginTop: 16,
                    }}>
                        <Text style={{ fontSize: 13 }}>
                            Opening Cash (TZS {parseFloat(totals.opening_cash).toLocaleString()}) 
                            {' + '}
                            Net Change (TZS {parseFloat(totals.net_cash_change).toLocaleString()})
                            {' = '}
                            Closing Cash (TZS {parseFloat(totals.closing_cash).toLocaleString()})
                        </Text>
                    </div>

                    {/* Footer */}
                    <div style={{ marginTop: 32, textAlign: 'center', borderTop: `1px solid ${token.colorBorder}`, paddingTop: 16 }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            Generated on {dayjs().format('MMMM DD, YYYY HH:mm')}
                        </Text>
                    </div>
                </div>

                {/* Activity Summary */}
                <div style={{ marginTop: 24 }}>
                    <Title level={5}>Cash Flow Summary</Title>
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                        gap: '16px',
                        marginTop: 16,
                    }}>
                        <Card size="small">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <Text type="secondary">Operating Activities</Text>
                                    <div style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '4px' }}>
                                        {operatingActivities?.length || 0} transactions
                                    </div>
                                </div>
                                <Tag color={totals.net_operating >= 0 ? 'green' : 'red'} style={{ fontSize: '14px' }}>
                                    {totals.net_operating >= 0 ? 'Positive' : 'Negative'}
                                </Tag>
                            </div>
                        </Card>
                        <Card size="small">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <Text type="secondary">Investing Activities</Text>
                                    <div style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '4px' }}>
                                        {investingActivities?.length || 0} transactions
                                    </div>
                                </div>
                                <Tag color={totals.net_investing >= 0 ? 'green' : 'red'} style={{ fontSize: '14px' }}>
                                    {totals.net_investing >= 0 ? 'Positive' : 'Negative'}
                                </Tag>
                            </div>
                        </Card>
                        <Card size="small">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <Text type="secondary">Financing Activities</Text>
                                    <div style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '4px' }}>
                                        {financingActivities?.length || 0} transactions
                                    </div>
                                </div>
                                <Tag color={totals.net_financing >= 0 ? 'green' : 'red'} style={{ fontSize: '14px' }}>
                                    {totals.net_financing >= 0 ? 'Positive' : 'Negative'}
                                </Tag>
                            </div>
                        </Card>
                    </div>
                </div>
        </AdminSidebarLayout>
        </>
    );
}
