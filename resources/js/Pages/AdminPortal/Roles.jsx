import React from 'react';
import AdminSidebarLayout from '../../Layouts/AdminSidebarLayout';
import { Card, Table, Button, Modal, Form, Input, Space, theme } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

export default function Roles() {
    const { token } = theme.useToken();
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [form] = Form.useForm();

    const columns = [
        {
            title: 'Role Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Users',
            dataIndex: 'user_count',
            key: 'user_count',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: () => (
                <Space>
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
                            Add Role
                        </Button>
                    </div>
                </Card>                <Card>
                    <Table
                        columns={columns}
                        dataSource={[]}
                        rowKey="id"
                        pagination={{ pageSize: 10 }}
                    />
                </Card>

                <Modal
                    title="Add New Role"
                    open={isModalOpen}
                    onOk={() => form.submit()}
                    onCancel={() => setIsModalOpen(false)}
                >
                    <Form form={form} layout="vertical">
                        <Form.Item
                            label="Role Name"
                            name="name"
                            rules={[{ required: true }]}
                        >
                            <Input />
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
