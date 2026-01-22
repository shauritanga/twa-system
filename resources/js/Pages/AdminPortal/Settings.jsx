import React from 'react';
import AdminSidebarLayout from '../../Layouts/AdminSidebarLayout';
import { Card, Form, Input, InputNumber, Switch, Button, Row, Col, Tabs, message, theme } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

export default function Settings() {
    const { token } = theme.useToken();
    const [form] = Form.useForm();
    const [loading, setLoading] = React.useState(false);

    const handleSubmit = (values) => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            message.success('Settings saved successfully');
        }, 1000);
    };

    const tabItems = [
        {
            key: 'financial',
            label: 'Financial Settings',
            children: (
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{
                        monthly_contribution: 50000,
                        penalty_rate: 5,
                    }}
                >
                    <Form.Item
                        label="Monthly Contribution Amount"
                        name="monthly_contribution"
                        rules={[{ required: true }]}
                    >
                        <InputNumber style={{ width: '100%' }} prefix="TZS" />
                    </Form.Item>
                    <Form.Item
                        label="Penalty Rate (%)"
                        name="penalty_rate"
                        rules={[{ required: true }]}
                    >
                        <InputNumber min={0} max={100} suffix="%" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>
                            Save Settings
                        </Button>
                    </Form.Item>
                </Form>
            ),
        },
        {
            key: 'email',
            label: 'Email Settings',
            children: (
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{
                        email_notifications: true,
                        email_reports: true,
                    }}
                >
                    <Form.Item
                        label="Send Email Notifications"
                        name="email_notifications"
                        valuePropName="checked"
                    >
                        <Switch />
                    </Form.Item>
                    <Form.Item
                        label="Send Email Reports"
                        name="email_reports"
                        valuePropName="checked"
                    >
                        <Switch />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>
                            Save Settings
                        </Button>
                    </Form.Item>
                </Form>
            ),
        },
        {
            key: 'security',
            label: 'Security Settings',
            children: (
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{
                        two_factor_auth: false,
                        session_timeout: 30,
                    }}
                >
                    <Form.Item
                        label="Enable Two-Factor Authentication"
                        name="two_factor_auth"
                        valuePropName="checked"
                    >
                        <Switch />
                    </Form.Item>
                    <Form.Item
                        label="Session Timeout (minutes)"
                        name="session_timeout"
                        rules={[{ required: true }]}
                    >
                        <InputNumber min={5} max={480} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>
                            Save Settings
                        </Button>
                    </Form.Item>
                </Form>
            ),
        },
    ];

    return (
        <AdminSidebarLayout>
            <div style={{ padding: '24px 0' }}>
                <Card>
                    <Tabs items={tabItems} />
                </Card>
            </div>
        </AdminSidebarLayout>
    );
}
