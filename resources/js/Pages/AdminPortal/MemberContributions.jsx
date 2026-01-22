import React, { useState } from 'react';
import AdminSidebarLayout from '../../Layouts/AdminSidebarLayout';
import { router, usePage } from '@inertiajs/react';
import {
    Card,
    Row,
    Col,
    Table,
    Button,
    Space,
    Tag,
    theme,
    Breadcrumb,
    Statistic,
    Descriptions,
    Avatar,
} from 'antd';
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    ClockCircleOutlined,
    DollarOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

export default function MemberContributions() {
    const { 
        member = {}, 
        year = new Date().getFullYear(),
        monthlyContributions = {},
        otherContributions = [],
        penalties = [],
        summary = {}
    } = usePage().props;
    
    const { token } = theme.useToken();

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-TZ', {
            style: 'currency',
            currency: 'TZS',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount || 0);
    };

    // Generate month-by-month data
    const monthlyData = Array.from({ length: 12 }, (_, i) => {
        const month = i + 1;
        const monthKey = `${year}-${String(month).padStart(2, '0')}`;
        const contributions = monthlyContributions[monthKey] || [];
        const totalPaid = contributions.reduce((sum, c) => sum + parseFloat(c.amount || 0), 0);
        const expectedAmount = summary.monthly_contribution_amount || 50000;
        
        let status = 'unpaid';
        if (totalPaid >= expectedAmount) {
            status = 'paid';
        } else if (totalPaid > 0) {
            status = 'partial';
        }

        return {
            month,
            monthName: dayjs().month(i).format('MMMM'),
            monthKey,
            contributions,
            totalPaid,
            expectedAmount,
            status,
        };
    });

    const monthlyColumns = [
        {
            title: 'Month',
            dataIndex: 'monthName',
            key: 'monthName',
            width: 150,
            render: (text, record) => (
                <div>
                    <div style={{ fontWeight: 'bold' }}>{text}</div>
                    <div style={{ fontSize: '12px', color: token.colorTextSecondary }}>
                        {year}
                    </div>
                </div>
            ),
        },
        {
            title: 'Expected',
            dataIndex: 'expectedAmount',
            key: 'expectedAmount',
            width: 150,
            render: (amount) => formatCurrency(amount),
        },
        {
            title: 'Paid',
            dataIndex: 'totalPaid',
            key: 'totalPaid',
            width: 150,
            render: (amount) => formatCurrency(amount),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            render: (status) => {
                const config = {
                    paid: { color: 'green', icon: <CheckCircleOutlined />, text: 'Paid' },
                    partial: { color: 'orange', icon: <ClockCircleOutlined />, text: 'Partial' },
                    unpaid: { color: 'red', icon: <CloseCircleOutlined />, text: 'Unpaid' },
                };
                const { color, icon, text } = config[status];
                return (
                    <Tag color={color} icon={icon}>
                        {text}
                    </Tag>
                );
            },
        },
        {
            title: 'Payment Details',
            key: 'details',
            render: (_, record) => {
                if (record.contributions.length === 0) {
                    return <span style={{ color: token.colorTextSecondary }}>No payments</span>;
                }
                return (
                    <div>
                        {record.contributions.map((contribution, idx) => (
                            <div key={idx} style={{ fontSize: '12px', marginBottom: '4px' }}>
                                <span style={{ color: token.colorTextSecondary }}>
                                    {dayjs(contribution.date).format('DD MMM')}:
                                </span>{' '}
                                <span style={{ fontWeight: 'bold' }}>
                                    {formatCurrency(contribution.amount)}
                                </span>
                                {contribution.notes && (
                                    <div style={{ color: token.colorTextSecondary, fontSize: '11px' }}>
                                        {contribution.notes}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                );
            },
        },
    ];

    const otherContributionsColumns = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            width: 150,
            render: (date) => dayjs(date).format('DD MMM YYYY'),
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            width: 150,
            render: (amount) => formatCurrency(amount),
        },
        {
            title: 'Purpose',
            dataIndex: 'purpose',
            key: 'purpose',
        },
        {
            title: 'Notes',
            dataIndex: 'notes',
            key: 'notes',
            ellipsis: true,
        },
    ];

    const penaltyColumns = [
        {
            title: 'Date',
            dataIndex: 'created_at',
            key: 'created_at',
            width: 150,
            render: (date) => dayjs(date).format('DD MMM YYYY'),
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            width: 150,
            render: (amount) => formatCurrency(amount),
        },
        {
            title: 'Reason',
            dataIndex: 'reason',
            key: 'reason',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            render: (status) => (
                <Tag color={status === 'paid' ? 'green' : 'orange'}>
                    {status}
                </Tag>
            ),
        },
    ];

    return (
        <AdminSidebarLayout>
            <div style={{ padding: '24px 0' }}>
                {/* Breadcrumb */}
                <Breadcrumb
                    items={[
                        {
                            title: (
                                <span
                                    onClick={() => router.visit(route('admin-portal.financials'))}
                                    style={{ cursor: 'pointer', color: token.colorPrimary }}
                                >
                                    Financials
                                </span>
                            ),
                        },
                        {
                            title: `${member.name} - ${year}`,
                        },
                    ]}
                    style={{ marginBottom: '24px' }}
                />

                {/* Member Info Card */}
                <Card style={{ marginBottom: '24px' }}>
                    <Row gutter={[24, 24]} align="middle">
                        <Col>
                            <Avatar
                                size={80}
                                src={member.image_path ? `/storage/${member.image_path}` : undefined}
                                style={{ backgroundColor: token.colorPrimary }}
                            >
                                {member.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </Avatar>
                        </Col>
                        <Col flex="auto">
                            <h2 style={{ margin: 0, marginBottom: '8px' }}>{member.name}</h2>
                            <Descriptions column={3} size="small">
                                <Descriptions.Item label="Email">{member.email}</Descriptions.Item>
                                <Descriptions.Item label="Phone">{member.phone_number}</Descriptions.Item>
                                <Descriptions.Item label="Year">{year}</Descriptions.Item>
                            </Descriptions>
                        </Col>
                    </Row>
                </Card>

                {/* Summary Statistics */}
                <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                    <Col xs={24} sm={12} md={6}>
                        <Card>
                            <Statistic
                                title="Total Monthly Contributions"
                                value={summary.total_monthly_contributions || 0}
                                formatter={(value) => formatCurrency(value)}
                                prefix={<DollarOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card>
                            <Statistic
                                title="Total Other Contributions"
                                value={summary.total_other_contributions || 0}
                                formatter={(value) => formatCurrency(value)}
                                prefix={<DollarOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card>
                            <Statistic
                                title="Total Penalties"
                                value={summary.total_penalties || 0}
                                formatter={(value) => formatCurrency(value)}
                                valueStyle={{ color: token.colorError }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card>
                            <Statistic
                                title="Months Paid"
                                value={`${summary.months_paid || 0}/12`}
                                suffix="months"
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Monthly Contributions Table */}
                <Card 
                    title={`Monthly Contributions - ${year}`}
                    style={{ marginBottom: '24px' }}
                >
                    <Table
                        columns={monthlyColumns}
                        dataSource={monthlyData}
                        rowKey="month"
                        pagination={false}
                        scroll={{ x: 800 }}
                    />
                </Card>

                {/* Other Contributions Table */}
                {otherContributions.length > 0 && (
                    <Card 
                        title="Other Contributions"
                        style={{ marginBottom: '24px' }}
                    >
                        <Table
                            columns={otherContributionsColumns}
                            dataSource={otherContributions}
                            rowKey="id"
                            pagination={{ pageSize: 10 }}
                            scroll={{ x: 800 }}
                        />
                    </Card>
                )}

                {/* Penalties Table */}
                {penalties.length > 0 && (
                    <Card title="Penalties">
                        <Table
                            columns={penaltyColumns}
                            dataSource={penalties}
                            rowKey="id"
                            pagination={{ pageSize: 10 }}
                            scroll={{ x: 800 }}
                        />
                    </Card>
                )}
            </div>
        </AdminSidebarLayout>
    );
}
