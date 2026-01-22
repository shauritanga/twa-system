import React, { useState } from 'react';
import AdminSidebarLayout from '@/Layouts/AdminSidebarLayout';
import { router } from '@inertiajs/react';
import { 
    Card, 
    Button, 
    Tabs,
    Form,
    Input,
    InputNumber,
    Select,
    Switch,
    Space,
    Typography,
    Divider,
    theme,
    message,
    Alert,
} from 'antd';
import { 
    SaveOutlined,
    SettingOutlined,
    DollarOutlined,
    UserOutlined,
    MailOutlined,
    SafetyOutlined,
    ToolOutlined,
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

export default function SettingsIndex({ settings, timezones, currencies, dateFormats }) {
    const { token } = theme.useToken();
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    // Helper to get setting value
    const getSetting = (key, defaultValue = '') => {
        return settings[key]?.value || defaultValue;
    };

    // Initialize form with current settings
    React.useEffect(() => {
        form.setFieldsValue({
            // General
            organization_name: getSetting('organization_name', 'TWAOR'),
            organization_email: getSetting('organization_email'),
            organization_phone: getSetting('organization_phone'),
            organization_address: getSetting('organization_address'),
            timezone: getSetting('timezone', 'Africa/Dar_es_Salaam'),
            date_format: getSetting('date_format', 'Y-m-d'),
            currency: getSetting('currency', 'TZS'),
            
            // Member Settings
            monthly_contribution_amount: getSetting('monthly_contribution_amount', '50000'),
            penalty_percentage_rate: getSetting('penalty_percentage_rate', '10'),
            apply_penalty_to_existing: getSetting('apply_penalty_to_existing', '0') === '1',
            member_id_prefix: getSetting('member_id_prefix', 'MEM'),
            auto_approve_members: getSetting('auto_approve_members', '0') === '1',
            
            // Financial Settings
            fiscal_year_start_month: getSetting('fiscal_year_start_month', '1'),
            receipt_number_prefix: getSetting('receipt_number_prefix', 'RCP'),
            invoice_number_prefix: getSetting('invoice_number_prefix', 'INV'),
            tax_rate: getSetting('tax_rate', '0'),
            
            // Email Settings
            smtp_host: getSetting('smtp_host'),
            smtp_port: getSetting('smtp_port', '587'),
            smtp_username: getSetting('smtp_username'),
            smtp_encryption: getSetting('smtp_encryption', 'tls'),
            mail_from_address: getSetting('mail_from_address'),
            mail_from_name: getSetting('mail_from_name'),
            
            // Security Settings
            session_timeout: getSetting('session_timeout', '120'),
            enable_two_factor_auth: getSetting('enable_two_factor_auth', '1') === '1',
            otp_grace_period_days: getSetting('otp_grace_period_days', '7'),
            max_login_attempts: getSetting('max_login_attempts', '5'),
            password_min_length: getSetting('password_min_length', '8'),
            require_password_special_char: getSetting('require_password_special_char', '1') === '1',
            
            // System Settings
            maintenance_mode: getSetting('maintenance_mode', '0') === '1',
            items_per_page: getSetting('items_per_page', '20'),
            enable_debug_mode: getSetting('enable_debug_mode', '0') === '1',
            backup_frequency: getSetting('backup_frequency', 'weekly'),
        });
    }, [settings]);

    const handleSubmit = (values) => {
        setLoading(true);

        // Convert boolean values to '1' or '0'
        const processedValues = Object.entries(values).map(([key, value]) => ({
            key,
            value: typeof value === 'boolean' ? (value ? '1' : '0') : String(value || ''),
            description: settings[key]?.description || null,
        }));

        router.post('/admin-portal/settings', {
            settings: processedValues,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setLoading(false);
                messageApi.success('Settings updated successfully');
            },
            onError: (errors) => {
                setLoading(false);
                messageApi.error('Failed to update settings');
                console.error(errors);
            },
        });
    };

    const tabItems = [
        {
            key: 'general',
            label: (
                <Space>
                    <SettingOutlined />
                    <span>General</span>
                </Space>
            ),
            children: (
                <div style={{ padding: '8px 0' }}>
                    <div style={{ 
                        marginBottom: '24px', 
                        paddingBottom: '16px', 
                        borderBottom: `1px solid ${token.colorBorderSecondary}` 
                    }}>
                        <Title level={5} style={{ marginBottom: '4px' }}>Organization Information</Title>
                        <Text type="secondary" style={{ fontSize: '13px' }}>
                            Basic information about your organization
                        </Text>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
                        <Form.Item
                            label="Organization Name"
                            name="organization_name"
                            rules={[{ required: true, message: 'Please enter organization name' }]}
                        >
                            <Input 
                                placeholder="e.g., TWAOR"
                                style={{
                                    backgroundColor: token.colorBgContainer,
                                    borderColor: token.colorBorder,
                                }}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Email"
                            name="organization_email"
                            rules={[{ type: 'email', message: 'Please enter valid email' }]}
                        >
                            <Input 
                                placeholder="contact@organization.com"
                                style={{
                                    backgroundColor: token.colorBgContainer,
                                    borderColor: token.colorBorder,
                                }}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Phone"
                            name="organization_phone"
                        >
                            <Input 
                                placeholder="+255 XXX XXX XXX"
                                style={{
                                    backgroundColor: token.colorBgContainer,
                                    borderColor: token.colorBorder,
                                }}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Currency"
                            name="currency"
                        >
                            <Select>
                                {Object.entries(currencies).map(([value, label]) => (
                                    <Select.Option key={value} value={value}>{label}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>

                    <Form.Item
                        label="Address"
                        name="organization_address"
                    >
                        <TextArea 
                            rows={3} 
                            placeholder="Organization address"
                            style={{
                                backgroundColor: token.colorBgContainer,
                                borderColor: token.colorBorder,
                            }}
                        />
                    </Form.Item>

                    <div style={{ 
                        marginTop: '32px',
                        marginBottom: '24px', 
                        paddingBottom: '16px', 
                        borderBottom: `1px solid ${token.colorBorderSecondary}` 
                    }}>
                        <Title level={5} style={{ marginBottom: '4px' }}>Regional Settings</Title>
                        <Text type="secondary" style={{ fontSize: '13px' }}>
                            Configure timezone, date format, and currency
                        </Text>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
                        <Form.Item
                            label="Timezone"
                            name="timezone"
                        >
                            <Select>
                                {Object.entries(timezones).map(([value, label]) => (
                                    <Select.Option key={value} value={value}>{label}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Date Format"
                            name="date_format"
                        >
                            <Select>
                                {Object.entries(dateFormats).map(([value, label]) => (
                                    <Select.Option key={value} value={value}>{label}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>
                </div>
            ),
        },
        {
            key: 'members',
            label: (
                <Space>
                    <UserOutlined />
                    <span>Members</span>
                </Space>
            ),
            children: (
                <div style={{ padding: '8px 0' }}>
                    <div style={{ 
                        marginBottom: '24px', 
                        paddingBottom: '16px', 
                        borderBottom: `1px solid ${token.colorBorderSecondary}` 
                    }}>
                        <Title level={5} style={{ marginBottom: '4px' }}>Contribution Settings</Title>
                        <Text type="secondary" style={{ fontSize: '13px' }}>
                            Default contribution amounts and rules
                        </Text>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
                        <Form.Item
                            label="Default Monthly Contribution"
                            name="monthly_contribution_amount"
                            rules={[{ required: true, message: 'Please enter contribution amount' }]}
                            extra="Default monthly contribution amount for new members"
                        >
                            <InputNumber
                                min={0}
                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                style={{ 
                                    width: '100%',
                                    backgroundColor: token.colorBgContainer,
                                    borderColor: token.colorBorder,
                                }}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Penalty Rate (%)"
                            name="penalty_percentage_rate"
                            rules={[{ required: true, message: 'Please enter penalty rate' }]}
                            extra="Percentage rate applied to missed contributions"
                        >
                            <InputNumber
                                min={0}
                                max={100}
                                style={{ 
                                    width: '100%',
                                    backgroundColor: token.colorBgContainer,
                                    borderColor: token.colorBorder,
                                }}
                            />
                        </Form.Item>
                    </div>

                    <div style={{ 
                        marginTop: '32px',
                        marginBottom: '24px', 
                        paddingBottom: '16px', 
                        borderBottom: `1px solid ${token.colorBorderSecondary}` 
                    }}>
                        <Title level={5} style={{ marginBottom: '4px' }}>Penalty Settings</Title>
                        <Text type="secondary" style={{ fontSize: '13px' }}>
                            Configure penalty rates and application rules
                        </Text>
                    </div>
                    <Form.Item
                        label="Penalty Rate (%)"
                        name="penalty_percentage_rate"
                        rules={[{ required: true, message: 'Please enter penalty rate' }]}
                        extra="Percentage rate applied to missed contributions"
                    >
                        <InputNumber
                            min={0}
                            max={100}
                            style={{ 
                                width: '100%',
                                backgroundColor: token.colorBgContainer,
                                borderColor: token.colorBorder,
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Apply to Existing Penalties"
                        name="apply_penalty_to_existing"
                        valuePropName="checked"
                        extra="Apply rate changes to existing unpaid penalties"
                    >
                        <Switch />
                    </Form.Item>

                    <div style={{ 
                        marginTop: '32px',
                        marginBottom: '24px', 
                        paddingBottom: '16px', 
                        borderBottom: `1px solid ${token.colorBorderSecondary}` 
                    }}>
                        <Title level={5} style={{ marginBottom: '4px' }}>Member Management</Title>
                        <Text type="secondary" style={{ fontSize: '13px' }}>
                            Member ID format and approval settings
                        </Text>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
                        <Form.Item
                            label="Member ID Prefix"
                            name="member_id_prefix"
                            extra="Prefix for auto-generated member IDs"
                        >
                            <Input 
                                placeholder="e.g., MEM" 
                                style={{ 
                                    backgroundColor: token.colorBgContainer,
                                    borderColor: token.colorBorder,
                                }} 
                            />
                        </Form.Item>

                        <Form.Item
                            label="Auto-Approve Members"
                            name="auto_approve_members"
                            valuePropName="checked"
                            extra="Automatically approve new member registrations"
                        >
                            <Switch />
                        </Form.Item>
                    </div>
                </div>
            ),
        },
        {
            key: 'financial',
            label: (
                <Space>
                    <DollarOutlined />
                    <span>Financial</span>
                </Space>
            ),
            children: (
                <div style={{ padding: '8px 0' }}>
                    <div style={{ 
                        marginBottom: '24px', 
                        paddingBottom: '16px', 
                        borderBottom: `1px solid ${token.colorBorderSecondary}` 
                    }}>
                        <Title level={5} style={{ marginBottom: '4px' }}>Fiscal Year</Title>
                        <Text type="secondary" style={{ fontSize: '13px' }}>
                            Configure fiscal year start date
                        </Text>
                    </div>
                    <Form.Item
                        label="Fiscal Year Start Month"
                        name="fiscal_year_start_month"
                        extra="Month when fiscal year begins (1-12)"
                    >
                        <Select>
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                                <Select.Option key={month} value={String(month)}>
                                    {new Date(2000, month - 1).toLocaleString('default', { month: 'long' })}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <div style={{ 
                        marginTop: '32px',
                        marginBottom: '24px', 
                        paddingBottom: '16px', 
                        borderBottom: `1px solid ${token.colorBorderSecondary}` 
                    }}>
                        <Title level={5} style={{ marginBottom: '4px' }}>Numbering Format</Title>
                        <Text type="secondary" style={{ fontSize: '13px' }}>
                            Prefixes for receipts and invoices
                        </Text>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
                        <Form.Item
                            label="Receipt Number Prefix"
                            name="receipt_number_prefix"
                            extra="Prefix for receipt numbers"
                        >
                            <Input 
                                placeholder="e.g., RCP" 
                                style={{ 
                                    backgroundColor: token.colorBgContainer,
                                    borderColor: token.colorBorder,
                                }} 
                            />
                        </Form.Item>

                        <Form.Item
                            label="Invoice Number Prefix"
                            name="invoice_number_prefix"
                            extra="Prefix for invoice numbers"
                        >
                            <Input 
                                placeholder="e.g., INV" 
                                style={{ 
                                    backgroundColor: token.colorBgContainer,
                                    borderColor: token.colorBorder,
                                }} 
                            />
                        </Form.Item>
                    </div>

                    <div style={{ 
                        marginTop: '32px',
                        marginBottom: '24px', 
                        paddingBottom: '16px', 
                        borderBottom: `1px solid ${token.colorBorderSecondary}` 
                    }}>
                        <Title level={5} style={{ marginBottom: '4px' }}>Tax Settings</Title>
                        <Text type="secondary" style={{ fontSize: '13px' }}>
                            Default tax rate for transactions
                        </Text>
                    </div>
                    <Form.Item
                        label="Tax Rate (%)"
                        name="tax_rate"
                        extra="Default tax rate for transactions"
                    >
                        <InputNumber
                            min={0}
                            max={100}
                            style={{ 
                                width: '100%',
                                backgroundColor: token.colorBgContainer,
                                borderColor: token.colorBorder,
                            }}
                        />
                    </Form.Item>
                </div>
            ),
        },
        {
            key: 'email',
            label: (
                <Space>
                    <MailOutlined />
                    <span>Email</span>
                </Space>
            ),
            children: (
                <div style={{ padding: '8px 0' }}>
                    <Alert
                        message="Email Configuration"
                        description="Configure SMTP settings for sending emails. Leave blank to use default mail driver."
                        type="info"
                        showIcon
                        style={{ 
                            marginBottom: 32,
                            backgroundColor: token.colorInfoBg,
                            border: `1px solid ${token.colorInfoBorder}`,
                        }}
                    />

                    <div style={{ 
                        marginBottom: '24px', 
                        paddingBottom: '16px', 
                        borderBottom: `1px solid ${token.colorBorderSecondary}` 
                    }}>
                        <Title level={5} style={{ marginBottom: '4px' }}>SMTP Settings</Title>
                        <Text type="secondary" style={{ fontSize: '13px' }}>
                            Configure your SMTP server connection
                        </Text>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
                        <Form.Item
                            label="SMTP Host"
                            name="smtp_host"
                        >
                            <Input 
                                placeholder="smtp.gmail.com"
                                style={{
                                    backgroundColor: token.colorBgContainer,
                                    borderColor: token.colorBorder,
                                }}
                            />
                        </Form.Item>

                        <Form.Item
                            label="SMTP Port"
                            name="smtp_port"
                        >
                            <InputNumber 
                                placeholder="587" 
                                style={{ 
                                    width: '100%',
                                    backgroundColor: token.colorBgContainer,
                                    borderColor: token.colorBorder,
                                }}
                            />
                        </Form.Item>

                        <Form.Item
                            label="SMTP Username"
                            name="smtp_username"
                        >
                            <Input 
                                placeholder="your-email@gmail.com"
                                style={{
                                    backgroundColor: token.colorBgContainer,
                                    borderColor: token.colorBorder,
                                }}
                            />
                        </Form.Item>

                        <Form.Item
                            label="SMTP Encryption"
                            name="smtp_encryption"
                        >
                            <Select>
                                <Select.Option value="tls">TLS</Select.Option>
                                <Select.Option value="ssl">SSL</Select.Option>
                                <Select.Option value="none">None</Select.Option>
                            </Select>
                        </Form.Item>
                    </div>

                    <div style={{ 
                        marginTop: '32px',
                        marginBottom: '24px', 
                        paddingBottom: '16px', 
                        borderBottom: `1px solid ${token.colorBorderSecondary}` 
                    }}>
                        <Title level={5} style={{ marginBottom: '4px' }}>Mail From Settings</Title>
                        <Text type="secondary" style={{ fontSize: '13px' }}>
                            Default sender information for outgoing emails
                        </Text>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
                        <Form.Item
                            label="From Address"
                            name="mail_from_address"
                            rules={[{ type: 'email', message: 'Please enter valid email' }]}
                        >
                            <Input 
                                placeholder="noreply@organization.com"
                                style={{
                                    backgroundColor: token.colorBgContainer,
                                    borderColor: token.colorBorder,
                                }}
                            />
                        </Form.Item>

                        <Form.Item
                            label="From Name"
                            name="mail_from_name"
                        >
                            <Input 
                                placeholder="Organization Name"
                                style={{
                                    backgroundColor: token.colorBgContainer,
                                    borderColor: token.colorBorder,
                                }}
                            />
                        </Form.Item>
                    </div>
                </div>
            ),
        },
        {
            key: 'security',
            label: (
                <Space>
                    <SafetyOutlined />
                    <span>Security</span>
                </Space>
            ),
            children: (
                <div style={{ padding: '8px 0' }}>
                    <div style={{ 
                        marginBottom: '24px', 
                        paddingBottom: '16px', 
                        borderBottom: `1px solid ${token.colorBorderSecondary}` 
                    }}>
                        <Title level={5} style={{ marginBottom: '4px' }}>Session Settings</Title>
                        <Text type="secondary" style={{ fontSize: '13px' }}>
                            Configure user session timeout
                        </Text>
                    </div>
                    <Form.Item
                        label="Session Timeout (minutes)"
                        name="session_timeout"
                        extra="Automatically log out users after this period of inactivity"
                    >
                        <InputNumber 
                            min={5} 
                            max={1440} 
                            style={{ 
                                width: '100%',
                                backgroundColor: token.colorBgContainer,
                                borderColor: token.colorBorder,
                            }}
                        />
                    </Form.Item>

                    <div style={{ 
                        marginTop: '32px',
                        marginBottom: '24px', 
                        paddingBottom: '16px', 
                        borderBottom: `1px solid ${token.colorBorderSecondary}` 
                    }}>
                        <Title level={5} style={{ marginBottom: '4px' }}>Two-Factor Authentication</Title>
                        <Text type="secondary" style={{ fontSize: '13px' }}>
                            Enable and configure 2FA for enhanced security
                        </Text>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
                        <Form.Item
                            label="Enable 2FA"
                            name="enable_two_factor_auth"
                            valuePropName="checked"
                            extra="Require two-factor authentication for all users"
                        >
                            <Switch />
                        </Form.Item>

                        <Form.Item
                            label="OTP Grace Period (days)"
                            name="otp_grace_period_days"
                            extra="Days to allow login without OTP for existing users"
                        >
                            <InputNumber 
                                min={0} 
                                max={30} 
                                style={{ 
                                    width: '100%',
                                    backgroundColor: token.colorBgContainer,
                                    borderColor: token.colorBorder,
                                }}
                            />
                        </Form.Item>
                    </div>

                    <div style={{ 
                        marginTop: '32px',
                        marginBottom: '24px', 
                        paddingBottom: '16px', 
                        borderBottom: `1px solid ${token.colorBorderSecondary}` 
                    }}>
                        <Title level={5} style={{ marginBottom: '4px' }}>Login Security</Title>
                        <Text type="secondary" style={{ fontSize: '13px' }}>
                            Configure login attempt limits
                        </Text>
                    </div>
                    <Form.Item
                        label="Max Login Attempts"
                        name="max_login_attempts"
                        extra="Lock account after this many failed login attempts"
                    >
                        <InputNumber 
                            min={3} 
                            max={10} 
                            style={{ 
                                width: '100%',
                                backgroundColor: token.colorBgContainer,
                                borderColor: token.colorBorder,
                            }}
                        />
                    </Form.Item>

                    <div style={{ 
                        marginTop: '32px',
                        marginBottom: '24px', 
                        paddingBottom: '16px', 
                        borderBottom: `1px solid ${token.colorBorderSecondary}` 
                    }}>
                        <Title level={5} style={{ marginBottom: '4px' }}>Password Requirements</Title>
                        <Text type="secondary" style={{ fontSize: '13px' }}>
                            Set password complexity requirements
                        </Text>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
                        <Form.Item
                            label="Minimum Length"
                            name="password_min_length"
                            extra="Minimum number of characters for passwords"
                        >
                            <InputNumber 
                                min={6} 
                                max={20} 
                                style={{ 
                                    width: '100%',
                                    backgroundColor: token.colorBgContainer,
                                    borderColor: token.colorBorder,
                                }}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Require Special Character"
                            name="require_password_special_char"
                            valuePropName="checked"
                            extra="Require at least one special character in passwords"
                        >
                            <Switch />
                        </Form.Item>
                    </div>
                </div>
            ),
        },
        {
            key: 'system',
            label: (
                <Space>
                    <ToolOutlined />
                    <span>System</span>
                </Space>
            ),
            children: (
                <div style={{ padding: '8px 0' }}>
                    <div style={{ 
                        marginBottom: '24px', 
                        paddingBottom: '16px', 
                        borderBottom: `1px solid ${token.colorBorderSecondary}` 
                    }}>
                        <Title level={5} style={{ marginBottom: '4px' }}>System Mode</Title>
                        <Text type="secondary" style={{ fontSize: '13px' }}>
                            Control maintenance and debug modes
                        </Text>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
                        <Form.Item
                            label="Maintenance Mode"
                            name="maintenance_mode"
                            valuePropName="checked"
                            extra="Enable maintenance mode to prevent user access"
                        >
                            <Switch />
                        </Form.Item>

                        <Form.Item
                            label="Debug Mode"
                            name="enable_debug_mode"
                            valuePropName="checked"
                            extra="Enable debug mode for development (not recommended for production)"
                        >
                            <Switch />
                        </Form.Item>
                    </div>

                    <div style={{ 
                        marginTop: '32px',
                        marginBottom: '24px', 
                        paddingBottom: '16px', 
                        borderBottom: `1px solid ${token.colorBorderSecondary}` 
                    }}>
                        <Title level={5} style={{ marginBottom: '4px' }}>Display Settings</Title>
                        <Text type="secondary" style={{ fontSize: '13px' }}>
                            Configure default display preferences
                        </Text>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
                        <Form.Item
                            label="Items Per Page"
                            name="items_per_page"
                            extra="Default number of items to display per page in tables"
                        >
                            <Select>
                                <Select.Option value="10">10</Select.Option>
                                <Select.Option value="20">20</Select.Option>
                                <Select.Option value="50">50</Select.Option>
                                <Select.Option value="100">100</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Backup Frequency"
                            name="backup_frequency"
                            extra="How often to automatically create backups"
                        >
                            <Select>
                                <Select.Option value="daily">Daily</Select.Option>
                                <Select.Option value="weekly">Weekly</Select.Option>
                                <Select.Option value="monthly">Monthly</Select.Option>
                                <Select.Option value="manual">Manual Only</Select.Option>
                            </Select>
                        </Form.Item>
                    </div>
                </div>
            ),
        },
    ];

    return (
        <AdminSidebarLayout>
            {contextHolder}
            <Card>
                <div style={{ marginBottom: 24 }}>
                    <Title level={3} style={{ margin: 0 }}>System Settings</Title>
                    <Text type="secondary">Configure system-wide settings and preferences</Text>
                </div>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Tabs
                        defaultActiveKey="general"
                        items={tabItems}
                        size="large"
                        style={{ marginBottom: 32 }}
                        tabBarStyle={{ marginBottom: 24 }}
                    />

                    <div style={{ 
                        padding: '20px 0',
                        borderTop: `1px solid ${token.colorBorderSecondary}`,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                        <Text type="secondary">
                            Changes will be applied immediately after saving
                        </Text>
                        <Button
                            type="primary"
                            htmlType="submit"
                            icon={<SaveOutlined />}
                            loading={loading}
                            size="large"
                        >
                            Save All Settings
                        </Button>
                    </div>
                </Form>
            </Card>
        </AdminSidebarLayout>
    );
}
