import React from 'react';
import AdminSidebarLayout from '../../Layouts/AdminSidebarLayout';
import { Card, Row, Col, Button, Select, DatePicker, Space, Table, theme } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

export default function Reports() {
    const { token } = theme.useToken();

    const columns = [
        {
            title: 'Report Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Generated',
            dataIndex: 'generated_at',
            key: 'generated_at',
            render: (date) => dayjs(date).format('DD MMM YYYY HH:mm'),
        },
        {
            title: 'Action',
            key: 'action',
            render: () => <Button icon={<DownloadOutlined />} size="small">Download</Button>,
        },
    ];

    return (
        <AdminSidebarLayout>
            <div style={{ padding: '24px 0' }}>
                <Card style={{ marginBottom: '24px' }}>
                    <Row gutter={[16, 16]} align="middle">
                        <Col xs={24} sm={12} lg={6}>
                            <Select
                                placeholder="Select report type"
                                style={{ width: '100%' }}
                                options={[
                                    { label: 'Members Report', value: 'members' },
                                    { label: 'Contributions Report', value: 'contributions' },
                                    { label: 'Financial Report', value: 'financial' },
                                    { label: 'Penalties Report', value: 'penalties' },
                                ]}
                            />
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <DatePicker style={{ width: '100%' }} placeholder="From Date" />
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <DatePicker style={{ width: '100%' }} placeholder="To Date" />
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <Button type="primary" block>
                                Generate Report
                            </Button>
                        </Col>
                    </Row>
                </Card>

                <Card title="Generated Reports">
                    <Table
                        columns={columns}
                        dataSource={[]}
                        rowKey="id"
                        pagination={{ pageSize: 10 }}
                    />
                </Card>
            </div>
        </AdminSidebarLayout>
    );
}
