import React from 'react';
import AdminSidebarLayout from '@/Layouts/AdminSidebarLayout';
import { router, usePage } from '@inertiajs/react';
import {
    Card,
    Descriptions,
    Button,
    Space,
    Tag,
    Typography,
    Divider,
    Breadcrumb,
    theme,
    List,
    Badge,
} from 'antd';
import {
    ArrowLeftOutlined,
    SafetyOutlined,
    KeyOutlined,
    UserOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

export default function RoleShow() {
    const { role } = usePage().props;
    const { token } = theme.useToken();

    const isSystemRole = ['admin', 'secretary', 'member'].includes(role.name);

    return (
        <AdminSidebarLayout>
            <div style={{ padding: '24px 0' }}>
                {/* Breadcrumb */}
                <Breadcrumb
                    items={[
                        {
                            title: (
                                <span
                                    onClick={() => router.visit(route('admin-portal.roles'))}
                                    style={{ cursor: 'pointer', color: token.colorPrimary }}
                                >
                                    Roles
                                </span>
                            ),
                        },
                        {
                            title: role.name,
                        },
                    ]}
                    style={{ marginBottom: '24px' }}
                />

                <Card>
                    {/* Header */}
                    <div style={{ marginBottom: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                            <SafetyOutlined style={{ fontSize: '24px', color: token.colorPrimary }} />
                            <Title level={3} style={{ margin: 0 }}>
                                {role.name}
                            </Title>
                            {isSystemRole && (
                                <Tag color="gold">SYSTEM ROLE</Tag>
                            )}
                        </div>
                        {role.description && (
                            <Text type="secondary">{role.description}</Text>
                        )}
                    </div>

                    <Divider />

                    {/* Basic Information */}
                    <div style={{ marginBottom: '24px' }}>
                        <Title level={5}>Basic Information</Title>
                        <Descriptions bordered column={2} size="small">
                            <Descriptions.Item label="Role Name">
                                {role.name}
                            </Descriptions.Item>
                            <Descriptions.Item label="Type">
                                {isSystemRole ? (
                                    <Tag color="gold">System Role</Tag>
                                ) : (
                                    <Tag color="blue">Custom Role</Tag>
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Description" span={2}>
                                {role.description || '-'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Total Users">
                                <Badge 
                                    count={role.users?.length || 0} 
                                    showZero 
                                    style={{ backgroundColor: token.colorPrimary }}
                                />
                            </Descriptions.Item>
                            <Descriptions.Item label="Total Permissions">
                                <Badge 
                                    count={role.permissions?.length || 0} 
                                    showZero 
                                    style={{ backgroundColor: token.colorSuccess }}
                                />
                            </Descriptions.Item>
                        </Descriptions>
                    </div>

                    <Divider />

                    {/* Permissions */}
                    <div style={{ marginBottom: '24px' }}>
                        <Title level={5}>
                            <Space>
                                <KeyOutlined />
                                Permissions ({role.permissions?.length || 0})
                            </Space>
                        </Title>
                        {role.permissions && role.permissions.length > 0 ? (
                            <List
                                bordered
                                dataSource={role.permissions}
                                renderItem={(permission) => (
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={<KeyOutlined style={{ color: token.colorPrimary }} />}
                                            title={permission.name}
                                            description={permission.description}
                                        />
                                    </List.Item>
                                )}
                                style={{ marginTop: '12px' }}
                            />
                        ) : (
                            <Text type="secondary">No permissions assigned to this role</Text>
                        )}
                    </div>

                    <Divider />

                    {/* Users */}
                    <div style={{ marginBottom: '24px' }}>
                        <Title level={5}>
                            <Space>
                                <UserOutlined />
                                Users ({role.users?.length || 0})
                            </Space>
                        </Title>
                        {role.users && role.users.length > 0 ? (
                            <List
                                bordered
                                dataSource={role.users}
                                renderItem={(user) => (
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={<UserOutlined style={{ color: token.colorPrimary }} />}
                                            title={user.name}
                                            description={user.email}
                                        />
                                    </List.Item>
                                )}
                                style={{ marginTop: '12px' }}
                            />
                        ) : (
                            <Text type="secondary">No users assigned to this role</Text>
                        )}
                    </div>

                    <Divider />

                    <Space>
                        <Button
                            icon={<ArrowLeftOutlined />}
                            onClick={() => router.visit(route('admin-portal.roles'))}
                        >
                            Back to Roles
                        </Button>
                    </Space>
                </Card>
            </div>
        </AdminSidebarLayout>
    );
}
