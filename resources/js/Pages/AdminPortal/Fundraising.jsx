import React, { useState } from 'react';
import AdminSidebarLayout from '../../Layouts/AdminSidebarLayout';
import { Card, Table, Button, Modal, Form, Input, InputNumber, Space, Tag, theme, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

export default function Fundraising() {
    const { token } = theme.useToken();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    const columns = [
        {
            title: 'Campaign Name',
            dataIndex: 'name',
            key: 'name',
            width: '25%',
        },
        {
            title: 'Target',
            dataIndex: 'target_amount',
            key: 'target_amount',
            render: (amount) => `TZS ${amount?.toLocaleString()}`,
        },
        {
            title: 'Raised',
            dataIndex: 'raised_amount',
            key: 'raised_amount',
            render: (amount) => `TZS ${amount?.toLocaleString()}`,
        },
        {
            title: 'Progress',
            dataIndex: 'progress',
            key: 'progress',
            render: (_, record) => {
                const progress = record.target_amount > 0 
                    ? Math.round((record.raised_amount / record.target_amount) * 100)
                    : 0;
                return `${progress}%`;
            },
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'active' ? 'green' : 'orange'}>
                    {status}
                </Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: () => (
                <Space size="small">
                    <Button type="primary" ghost size="small" icon={<EyeOutlined />} />
                    <Button type="primary" ghost size="small" icon={<EditOutlined />} />
                    <Button type="primary" ghost danger size="small" icon={<DeleteOutlined />} />
                </Space>
            ),
        },
    ];

    return (
        <AdminSidebarLayout>
            <div style={{ padding: '24px 0' }}>
                <Card style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
                            New Campaign
                        </Button>
                    </div>
                </Card>

                <Card>
                    <Table
                        columns={columns}
                        dataSource={[]}
                        rowKey="id"
                        pagination={{ pageSize: 10 }}
                    />
                </Card>

                <Modal
                    title="Create New Campaign"
                    open={isModalOpen}
                    onOk={() => form.submit()}
                    onCancel={() => setIsModalOpen(false)}
                    width={600}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={(values) => {
                            setIsModalOpen(false);
                            message.success('Campaign created successfully');
                        }}
                    >
                        <Form.Item
                            label="Campaign Name"
                            name="name"
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Target Amount"
                            name="target_amount"
                            rules={[{ required: true }]}
                        >
                            <InputNumber style={{ width: '100%' }} prefix="TZS" />
                        </Form.Item>
                        <Form.Item
                            label="Description"
                            name="description"
                        >
                            <Input.TextArea rows={3} />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </AdminSidebarLayout>
    );
}
