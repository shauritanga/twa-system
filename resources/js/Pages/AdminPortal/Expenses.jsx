import React from 'react';
import AdminSidebarLayout from '@/Layouts/AdminSidebarLayout';
import { Card, Typography, Empty } from 'antd';
import { DollarOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function Expenses() {
    return (
        <AdminSidebarLayout>
            <Card>
                <Empty
                    image={<DollarOutlined style={{ fontSize: 64, color: '#1890ff' }} />}
                    description={
                        <div>
                            <Title level={4}>Expenses Management</Title>
                            <Text type="secondary">
                                This feature is coming soon. You'll be able to track and manage all organizational expenses here.
                            </Text>
                        </div>
                    }
                />
            </Card>
        </AdminSidebarLayout>
    );
}
