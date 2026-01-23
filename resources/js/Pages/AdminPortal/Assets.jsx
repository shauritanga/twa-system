import React from 'react';
import AdminSidebarLayout from '@/Layouts/AdminSidebarLayout';
import { Head } from '@inertiajs/react';
import { Card, Typography, Empty } from 'antd';
import { DollarOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function Assets() {
    return (
        <>
            <Head title="Assets Management - Tabata Welfare Association" />
            <AdminSidebarLayout>
            <Card>
                <Empty
                    image={<DollarOutlined style={{ fontSize: 64, color: '#1890ff' }} />}
                    description={
                        <div>
                            <Title level={4}>Assets Management</Title>
                            <Text type="secondary">
                                This feature is coming soon. You'll be able to track and manage all organizational assets here.
                            </Text>
                        </div>
                    }
                />
            </Card>
        </AdminSidebarLayout>
        </>
    );
}
