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
} from 'antd';
import {
    ArrowLeftOutlined,
    UserOutlined,
    ClockCircleOutlined,
    GlobalOutlined,
    CodeOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;

export default function AuditLogShow() {
    const { log } = usePage().props;
    const { token } = theme.useToken();

    const getSeverityColor = (severity) => {
        const colors = {
            low: 'green',
            medium: 'blue',
            high: 'orange',
            critical: 'red',
        };
        return colors[severity] || 'default';
    };

    const getCategoryColor = (category) => {
        const colors = {
            auth: 'purple',
            member: 'blue',
            financial: 'green',
            system: 'orange',
            security: 'red',
            general: 'default',
        };
        return colors[category] || 'default';
    };

    const getActionColor = (action) => {
        const colors = {
            created: 'green',
            updated: 'blue',
            deleted: 'red',
            viewed: 'cyan',
            login: 'purple',
            logout: 'purple',
            posted: 'green',
            reversed: 'orange',
        };
        return colors[action.toLowerCase()] || 'default';
    };

    const class_basename = (className) => {
        if (!className) return '';
        const parts = className.split('\\');
        return parts[parts.length - 1];
    };

    const renderChanges = () => {
        if (!log.old_values || !log.new_values) {
            return <Text type="secondary">No changes recorded</Text>;
        }

        const changes = [];
        const oldValues = typeof log.old_values === 'string' ? JSON.parse(log.old_values) : log.old_values;
        const newValues = typeof log.new_values === 'string' ? JSON.parse(log.new_values) : log.new_values;

        Object.keys(newValues).forEach(key => {
            const oldValue = oldValues[key];
            const newValue = newValues[key];
            
            if (oldValue !== newValue) {
                changes.push(
                    <div key={key} style={{ marginBottom: '12px' }}>
                        <Text strong style={{ fontSize: '14px' }}>{key}:</Text>
                        <div style={{ marginLeft: '16px', marginTop: '4px' }}>
                            <div style={{ marginBottom: '4px' }}>
                                <Text type="secondary" style={{ fontSize: '13px' }}>Old: </Text>
                                <Text delete type="secondary" style={{ fontSize: '13px' }}>
                                    {oldValue || '(empty)'}
                                </Text>
                            </div>
                            <div>
                                <Text type="secondary" style={{ fontSize: '13px' }}>New: </Text>
                                <Text style={{ color: token.colorSuccess, fontSize: '13px' }}>
                                    {newValue || '(empty)'}
                                </Text>
                            </div>
                        </div>
                    </div>
                );
            }
        });

        return changes.length > 0 ? changes : <Text type="secondary">No changes detected</Text>;
    };

    return (
        <AdminSidebarLayout>
            <div style={{ padding: '24px 0' }}>
                {/* Breadcrumb */}
                <Breadcrumb
                    items={[
                        {
                            title: (
                                <span
                                    onClick={() => router.visit(route('admin-portal.audit-logs'))}
                                    style={{ cursor: 'pointer', color: token.colorPrimary }}
                                >
                                    Audit Logs
                                </span>
                            ),
                        },
                        {
                            title: `Log #${log.id}`,
                        },
                    ]}
                    style={{ marginBottom: '24px' }}
                />

                <Card>
                    {/* Header */}
                    <div style={{ marginBottom: '24px' }}>
                        <Title level={3} style={{ margin: 0, marginBottom: '12px' }}>
                            Audit Log Details
                        </Title>
                        <Space size="middle">
                            <Tag color={getActionColor(log.action)}>
                                {log.action.toUpperCase()}
                            </Tag>
                            {log.category && (
                                <Tag color={getCategoryColor(log.category)}>
                                    {log.category.toUpperCase()}
                                </Tag>
                            )}
                            <Tag color={getSeverityColor(log.severity)}>
                                {log.severity.toUpperCase()}
                            </Tag>
                        </Space>
                    </div>

                    <Divider />

                    {/* Basic Information */}
                    <div style={{ marginBottom: '24px' }}>
                        <Title level={5}>Basic Information</Title>
                        <Descriptions bordered column={2} size="small">
                            <Descriptions.Item label="Date & Time" span={2}>
                                <Space>
                                    <ClockCircleOutlined />
                                    {dayjs(log.created_at).format('MMMM DD, YYYY HH:mm:ss')}
                                </Space>
                            </Descriptions.Item>
                            <Descriptions.Item label="User">
                                <Space>
                                    <UserOutlined />
                                    {log.user_name || 'System'}
                                </Space>
                            </Descriptions.Item>
                            <Descriptions.Item label="Email">
                                {log.user_email || '-'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Role">
                                {log.user_role || '-'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Action">
                                <Tag color={getActionColor(log.action)}>
                                    {log.action.toUpperCase()}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Category">
                                {log.category ? (
                                    <Tag color={getCategoryColor(log.category)}>
                                        {log.category.toUpperCase()}
                                    </Tag>
                                ) : '-'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Severity">
                                <Tag color={getSeverityColor(log.severity)}>
                                    {log.severity.toUpperCase()}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Description" span={2}>
                                {log.description || '-'}
                            </Descriptions.Item>
                        </Descriptions>
                    </div>

                    <Divider />

                    {/* Model Information */}
                    <div style={{ marginBottom: '24px' }}>
                        <Title level={5}>Model Information</Title>
                        <Descriptions bordered column={2} size="small">
                            <Descriptions.Item label="Model Type">
                                {log.model_type ? class_basename(log.model_type) : '-'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Model ID">
                                {log.model_id || '-'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Model Name" span={2}>
                                {log.model_name || '-'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Full Model Type" span={2}>
                                <Text code style={{ fontSize: '12px' }}>
                                    {log.model_type || '-'}
                                </Text>
                            </Descriptions.Item>
                        </Descriptions>
                    </div>

                    {/* Changes */}
                    {(log.old_values || log.new_values) && (
                        <>
                            <Divider />
                            <div style={{ marginBottom: '24px' }}>
                                <Title level={5}>Changes</Title>
                                <div style={{ 
                                    padding: '16px', 
                                    backgroundColor: token.colorBgContainer,
                                    border: `1px solid ${token.colorBorder}`,
                                    borderRadius: '6px',
                                }}>
                                    {renderChanges()}
                                </div>
                            </div>
                        </>
                    )}

                    <Divider />

                    {/* Request Information */}
                    <div style={{ marginBottom: '24px' }}>
                        <Title level={5}>Request Information</Title>
                        <Descriptions bordered column={2} size="small">
                            <Descriptions.Item label="IP Address">
                                <Space>
                                    <GlobalOutlined />
                                    {log.ip_address || '-'}
                                </Space>
                            </Descriptions.Item>
                            <Descriptions.Item label="Method">
                                {log.method ? (
                                    <Tag color="blue">{log.method}</Tag>
                                ) : '-'}
                            </Descriptions.Item>
                            <Descriptions.Item label="URL" span={2}>
                                <Text code style={{ fontSize: '12px', wordBreak: 'break-all' }}>
                                    {log.url || '-'}
                                </Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="Session ID" span={2}>
                                <Text code style={{ fontSize: '11px', wordBreak: 'break-all' }}>
                                    {log.session_id || '-'}
                                </Text>
                            </Descriptions.Item>
                            {log.batch_id && (
                                <Descriptions.Item label="Batch ID" span={2}>
                                    <Text code style={{ fontSize: '11px', wordBreak: 'break-all' }}>
                                        {log.batch_id}
                                    </Text>
                                </Descriptions.Item>
                            )}
                        </Descriptions>
                    </div>

                    {/* Additional Properties */}
                    {log.properties && Object.keys(log.properties).length > 0 && (
                        <>
                            <Divider />
                            <div style={{ marginBottom: '24px' }}>
                                <Title level={5}>Additional Properties</Title>
                                <div style={{ 
                                    padding: '12px', 
                                    backgroundColor: token.colorBgContainer,
                                    border: `1px solid ${token.colorBorder}`,
                                    borderRadius: '6px',
                                }}>
                                    <pre style={{ margin: 0, fontSize: '12px', overflow: 'auto' }}>
                                        {JSON.stringify(log.properties, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        </>
                    )}

                    {/* User Agent */}
                    {log.user_agent && (
                        <>
                            <Divider />
                            <div style={{ marginBottom: '24px' }}>
                                <Title level={5}>User Agent</Title>
                                <div style={{ 
                                    padding: '12px', 
                                    backgroundColor: token.colorBgContainer,
                                    border: `1px solid ${token.colorBorder}`,
                                    borderRadius: '6px',
                                    fontSize: '12px',
                                    wordBreak: 'break-all',
                                }}>
                                    {log.user_agent}
                                </div>
                            </div>
                        </>
                    )}

                    <Divider />

                    <Space>
                        <Button
                            icon={<ArrowLeftOutlined />}
                            onClick={() => router.visit(route('admin-portal.audit-logs'))}
                        >
                            Back to Audit Logs
                        </Button>
                    </Space>
                </Card>
            </div>
        </AdminSidebarLayout>
    );
}
