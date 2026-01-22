/**
 * Settings Page - Ant Design Example
 * 
 * This is an example of how to convert the Settings page to use Ant Design.
 * This file demonstrates best practices for forms, tabs, and various Ant Design components.
 * 
 * To use this, rename it to Settings.jsx and replace the existing file.
 */

import React, { useState } from 'react';
import AdminSidebarLayout from '../../Layouts/AdminSidebarLayout';
import { usePage, router } from '@inertiajs/react';
import {
    Form,
    Input,
    Button,
    Card,
    Row,
    Col,
    Tabs,
    Switch,
    InputNumber,
    Select,
    Space,
    Divider,
    Alert,
    Spin,
    message,
    theme,
} from 'antd';
import {
    SaveOutlined,
    ReloadOutlined,
    SettingOutlined,
    SecurityScanOutlined,
    CloudUploadOutlined,
    BellOutlined,
    DesktopOutlined,
} from '@ant-design/icons';

export default function Settings() {
    const { settings, recentLogins, systemStats } = usePage().props;
    const { token } = theme.useToken();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // Financial Settings
    const [monthlyContribution, setMonthlyContribution] = useState(
        settings.monthly_contribution_amount?.value || 50000
    );
    const [penaltyRate, setPenaltyRate] = useState(
        settings.penalty_percentage_rate?.value || 10
    );
    const [applyToExisting, setApplyToExisting] = useState(
        settings.apply_penalty_to_existing?.value === '1'
    );

    // Email Settings
    const [emailNewMember, setEmailNewMember] = useState(
        settings.email_new_member?.value === '1'
    );
    const [emailContributionReminder, setEmailContributionReminder] = useState(
        settings.email_contribution_reminder?.value === '1'
    );
    const [emailPenaltyNotice, setEmailPenaltyNotice] = useState(
        settings.email_penalty_notice?.value === '1'
    );
    const [emailSystemAlerts, setEmailSystemAlerts] = useState(
        settings.email_system_alerts?.value === '1'
    );

    // Security Settings
    const [sessionTimeout, setSessionTimeout] = useState(
        settings.session_timeout_minutes?.value || 120
    );
    const [maxLoginAttempts, setMaxLoginAttempts] = useState(
        settings.max_login_attempts?.value || 5
    );
    const [enableTwoFactorAuth, setEnableTwoFactorAuth] = useState(
        settings.enable_two_factor_auth?.value === '1'
    );

    // System Settings
    const [systemTimezone, setSystemTimezone] = useState(
        settings.system_timezone?.value || 'Africa/Dar_es_Salaam'
    );
    const [dateFormat, setDateFormat] = useState(
        settings.date_format?.value || 'Y-m-d'
    );
    const [currencySymbol, setCurrencySymbol] = useState(
        settings.currency_symbol?.value || 'TZS'
    );

    const handleFinancialSubmit = (values) => {
        setLoading(true);
        router.post(
            route('admin.settings.update'),
            {
                monthly_contribution_amount: monthlyContribution,
                penalty_percentage_rate: penaltyRate,
                apply_penalty_to_existing: applyToExisting ? 1 : 0,
            },
            {
                onSuccess: () => {
                    message.success('Financial settings updated successfully');
                    setLoading(false);
                },
                onError: () => {
                    message.error('Failed to update settings');
                    setLoading(false);
                },
            }
        );
    };

    const handleEmailSubmit = () => {
        setLoading(true);
        router.post(
            route('admin.settings.update'),
            {
                email_new_member: emailNewMember ? 1 : 0,
                email_contribution_reminder: emailContributionReminder ? 1 : 0,
                email_penalty_notice: emailPenaltyNotice ? 1 : 0,
                email_system_alerts: emailSystemAlerts ? 1 : 0,
            },
            {
                onSuccess: () => {
                    message.success('Email settings updated successfully');
                    setLoading(false);
                },
                onError: () => {
                    message.error('Failed to update settings');
                    setLoading(false);
                },
            }
        );
    };

    const handleSecuritySubmit = () => {
        setLoading(true);
        router.post(
            route('admin.settings.update'),
            {
                session_timeout_minutes: sessionTimeout,
                max_login_attempts: maxLoginAttempts,
                enable_two_factor_auth: enableTwoFactorAuth ? 1 : 0,
            },
            {
                onSuccess: () => {
                    message.success('Security settings updated successfully');
                    setLoading(false);
                },
                onError: () => {
                    message.error('Failed to update settings');
                    setLoading(false);
                },
            }
        );
    };

    const handleSystemSubmit = () => {
        setLoading(true);
        router.post(
            route('admin.settings.update'),
            {
                system_timezone: systemTimezone,
                date_format: dateFormat,
                currency_symbol: currencySymbol,
            },
            {
                onSuccess: () => {
                    message.success('System settings updated successfully');
                    setLoading(false);
                },
                onError: () => {
                    message.error('Failed to update settings');
                    setLoading(false);
                },
            }
        );
    };

    const tabItems = [
        {
            key: 'financial',
            label: (
                <span>
                    <SettingOutlined /> Financial
                </span>
            ),
            children: (
                <Card style={{ marginTop: '16px' }}>
                    <Form layout="vertical" onFinish={handleFinancialSubmit}>
                        <Form.Item
                            label="Monthly Contribution Amount (TZS)"
                            required
                        >
                            <InputNumber
                                value={monthlyContribution}
                                onChange={setMonthlyContribution}
                                min={0}
                                step={1000}
                                style={{ width: '100%' }}
                                formatter={(value) =>
                                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                }
                                parser={(value) =>
                                    value.replace(/\$\s?|(,*)/g, '')
                                }
                            />
                        </Form.Item>

                        <Form.Item label="Penalty Percentage Rate (%)" required>
                            <InputNumber
                                value={penaltyRate}
                                onChange={setPenaltyRate}
                                min={0}
                                max={100}
                                step={0.1}
                                style={{ width: '100%' }}
                            />
                        </Form.Item>

                        <Form.Item label="Apply Penalty to Existing Members">
                            <Switch
                                checked={applyToExisting}
                                onChange={setApplyToExisting}
                            />
                        </Form.Item>

                        <Divider />

                        <Form.Item>
                            <Space>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    icon={<SaveOutlined />}
                                    loading={loading}
                                >
                                    Save Changes
                                </Button>
                                <Button icon={<ReloadOutlined />}>Reset</Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Card>
            ),
        },
        {
            key: 'email',
            label: (
                <span>
                    <BellOutlined /> Email Notifications
                </span>
            ),
            children: (
                <Card style={{ marginTop: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '12px',
                                backgroundColor: token.colorBgContainer,
                                borderRadius: '4px',
                            }}
                        >
                            <span>Email on New Member Registration</span>
                            <Switch
                                checked={emailNewMember}
                                onChange={setEmailNewMember}
                            />
                        </div>

                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '12px',
                                backgroundColor: token.colorBgContainer,
                                borderRadius: '4px',
                            }}
                        >
                            <span>Email Contribution Reminders</span>
                            <Switch
                                checked={emailContributionReminder}
                                onChange={setEmailContributionReminder}
                            />
                        </div>

                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '12px',
                                backgroundColor: token.colorBgContainer,
                                borderRadius: '4px',
                            }}
                        >
                            <span>Email Penalty Notices</span>
                            <Switch
                                checked={emailPenaltyNotice}
                                onChange={setEmailPenaltyNotice}
                            />
                        </div>

                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '12px',
                                backgroundColor: token.colorBgContainer,
                                borderRadius: '4px',
                            }}
                        >
                            <span>Email System Alerts</span>
                            <Switch
                                checked={emailSystemAlerts}
                                onChange={setEmailSystemAlerts}
                            />
                        </div>
                    </div>

                    <Divider />

                    <Button
                        type="primary"
                        icon={<SaveOutlined />}
                        onClick={handleEmailSubmit}
                        loading={loading}
                    >
                        Save Email Settings
                    </Button>
                </Card>
            ),
        },
        {
            key: 'security',
            label: (
                <span>
                    <SecurityScanOutlined /> Security
                </span>
            ),
            children: (
                <Card style={{ marginTop: '16px' }}>
                    <Form layout="vertical">
                        <Form.Item label="Session Timeout (minutes)" required>
                            <InputNumber
                                value={sessionTimeout}
                                onChange={setSessionTimeout}
                                min={5}
                                max={1440}
                                step={5}
                                style={{ width: '100%' }}
                            />
                        </Form.Item>

                        <Form.Item label="Max Login Attempts" required>
                            <InputNumber
                                value={maxLoginAttempts}
                                onChange={setMaxLoginAttempts}
                                min={1}
                                max={10}
                                style={{ width: '100%' }}
                            />
                        </Form.Item>

                        <Form.Item label="Enable Two-Factor Authentication">
                            <Switch
                                checked={enableTwoFactorAuth}
                                onChange={setEnableTwoFactorAuth}
                            />
                        </Form.Item>

                        <Divider />

                        <Button
                            type="primary"
                            icon={<SaveOutlined />}
                            onClick={handleSecuritySubmit}
                            loading={loading}
                        >
                            Save Security Settings
                        </Button>
                    </Form>
                </Card>
            ),
        },
        {
            key: 'system',
            label: (
                <span>
                    <CpuChipOutlined /> System
                </span>
            ),
            children: (
                <Card style={{ marginTop: '16px' }}>
                    <Form layout="vertical">
                        <Form.Item label="Timezone" required>
                            <Select
                                value={systemTimezone}
                                onChange={setSystemTimezone}
                                options={[
                                    {
                                        label: 'Africa/Dar_es_Salaam',
                                        value: 'Africa/Dar_es_Salaam',
                                    },
                                    { label: 'UTC', value: 'UTC' },
                                    { label: 'Europe/London', value: 'Europe/London' },
                                    { label: 'America/New_York', value: 'America/New_York' },
                                ]}
                            />
                        </Form.Item>

                        <Form.Item label="Date Format" required>
                            <Select
                                value={dateFormat}
                                onChange={setDateFormat}
                                options={[
                                    { label: 'Y-m-d', value: 'Y-m-d' },
                                    { label: 'd/m/Y', value: 'd/m/Y' },
                                    { label: 'm/d/Y', value: 'm/d/Y' },
                                ]}
                            />
                        </Form.Item>

                        <Form.Item label="Currency Symbol" required>
                            <Input
                                value={currencySymbol}
                                onChange={(e) => setCurrencySymbol(e.target.value)}
                                maxLength={3}
                            />
                        </Form.Item>

                        <Divider />

                        <Button
                            type="primary"
                            icon={<SaveOutlined />}
                            onClick={handleSystemSubmit}
                            loading={loading}
                        >
                            Save System Settings
                        </Button>
                    </Form>
                </Card>
            ),
        },
    ];

    return (
        <AdminSidebarLayout>
            <div style={{ padding: '24px 0' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px' }}>
                    Settings
                </h1>

                {successMessage && (
                    <Alert
                        message="Success"
                        description={successMessage}
                        type="success"
                        showIcon
                        closable
                        style={{ marginBottom: '24px' }}
                    />
                )}

                <Row gutter={[16, 16]}>
                    <Col xs={24} lg={18}>
                        <Card>
                            <Tabs items={tabItems} />
                        </Card>
                    </Col>

                    <Col xs={24} lg={6}>
                        <Card title="System Information">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div>
                                    <strong>Total Users:</strong>
                                    <div>{systemStats?.total_users || 0}</div>
                                </div>
                                <div>
                                    <strong>Online Users:</strong>
                                    <div>{systemStats?.online_users || 0}</div>
                                </div>
                                <div>
                                    <strong>Database Size:</strong>
                                    <div>{systemStats?.database_size || 'N/A'}</div>
                                </div>
                                <div>
                                    <strong>Storage Used:</strong>
                                    <div>{systemStats?.storage_used || 'N/A'}</div>
                                </div>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        </AdminSidebarLayout>
    );
}
