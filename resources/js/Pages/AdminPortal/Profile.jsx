import React, { useState } from 'react';
import AdminSidebarLayout from '../../Layouts/AdminSidebarLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import {
    Card,
    Row,
    Col,
    Avatar,
    Typography,
    Descriptions,
    Button,
    Space,
    Tag,
    Timeline,
    Tabs,
    Form,
    Input,
    Upload,
    message,
    Modal,
    theme,
    Divider,
    Alert,
    Progress,
    Badge,
    Statistic,
    List,
    Empty,
    Tooltip,
    Switch,
    Select,
    DatePicker,
    Spin,
    Result,
    Breadcrumb,
    FloatButton,
    Drawer,
    Steps,
    notification,
} from 'antd';
import {
    UserOutlined,
    EditOutlined,
    MailOutlined,
    PhoneOutlined,
    CalendarOutlined,
    EnvironmentOutlined,
    SafetyOutlined,
    SettingOutlined,
    HistoryOutlined,
    CameraOutlined,
    ExclamationCircleOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    LoginOutlined,
    LockOutlined,
    KeyOutlined,
    BellOutlined,
    GlobalOutlined,
    EyeOutlined,
    DeleteOutlined,
    UploadOutlined,
    HomeOutlined,
    ReloadOutlined,
    QuestionCircleOutlined,
    StarOutlined,
    TrophyOutlined,
    FireOutlined,
    ThunderboltOutlined,
    HeartOutlined,
    TeamOutlined,
    DashboardOutlined,
    WarningOutlined,
    InfoCircleOutlined,
    PlusOutlined,
    MinusCircleOutlined,
    SyncOutlined,
    CloudUploadOutlined,
    SaveOutlined,
    LogoutOutlined,
} from '@ant-design/icons';
import { ComputerDesktopIcon } from '@heroicons/react/24/outline';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { Step } = Steps;

export default function Profile({ user, recentActivities, profileCompletion, isProfileComplete }) {
    const { token } = theme.useToken();
    const [activeTab, setActiveTab] = useState('overview');
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [passwordModalVisible, setPasswordModalVisible] = useState(false);
    const [avatarModalVisible, setAvatarModalVisible] = useState(false);
    const [preferencesDrawerVisible, setPreferencesDrawerVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [passwordForm] = Form.useForm();
    const [preferencesForm] = Form.useForm();

    // Profile form
    const { data, setData, patch, processing, errors, reset } = useForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        date_of_birth: user.date_of_birth || '',
        bio: user.bio || '',
        address: user.address || '',
        city: user.city || '',
        region: user.region || '',
        postal_code: user.postal_code || '',
    });

    // Password form
    const { data: passwordData, setData: setPasswordData, post: postPassword, processing: passwordProcessing } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    // Preferences form
    const { data: preferencesData, setData: setPreferencesData, post: postPreferences, processing: preferencesProcessing } = useForm({
        theme: user.preferences?.theme || 'light',
        language: user.preferences?.language || 'en',
        timezone: user.preferences?.timezone || 'UTC',
        notifications: {
            email: user.preferences?.notifications?.email ?? true,
            sms: user.preferences?.notifications?.sms ?? false,
            push: user.preferences?.notifications?.push ?? true,
        }
    });

    const getActivityIcon = (action) => {
        const iconStyle = { fontSize: '16px' };
        switch (action) {
            case 'profile_updated':
                return <UserOutlined style={{ ...iconStyle, color: token.colorPrimary }} />;
            case 'password_changed':
                return <LockOutlined style={{ ...iconStyle, color: token.colorSuccess }} />;
            case 'avatar_uploaded':
                return <CameraOutlined style={{ ...iconStyle, color: token.colorWarning }} />;
            case 'login':
                return <LoginOutlined style={{ ...iconStyle, color: token.colorInfo }} />;
            case 'logout':
                return <LogoutOutlined style={{ ...iconStyle, color: token.colorTextSecondary }} />;
            case 'preferences_updated':
                return <SettingOutlined style={{ ...iconStyle, color: token.colorPrimary }} />;
            default:
                return <ClockCircleOutlined style={{ ...iconStyle, color: token.colorTextSecondary }} />;
        }
    };

    const getActivityColor = (action) => {
        switch (action) {
            case 'profile_updated': return 'blue';
            case 'password_changed': return 'green';
            case 'avatar_uploaded': return 'orange';
            case 'login': return 'cyan';
            case 'logout': return 'default';
            case 'preferences_updated': return 'purple';
            default: return 'default';
        }
    };

    const handleUpdateProfile = () => {
        patch(route('admin.profile.update'), {
            onSuccess: () => {
                message.success('Profile updated successfully');
                setEditModalVisible(false);
                notification.success({
                    message: 'Profile Updated',
                    description: 'Your profile information has been updated successfully.',
                    placement: 'topRight',
                });
            },
            onError: (errors) => {
                message.error('Failed to update profile');
                console.error('Profile update errors:', errors);
            }
        });
    };

    const handleUpdatePassword = () => {
        postPassword(route('admin.profile.password.update'), {
            onSuccess: () => {
                message.success('Password updated successfully');
                setPasswordModalVisible(false);
                passwordForm.resetFields();
                setPasswordData({
                    current_password: '',
                    password: '',
                    password_confirmation: '',
                });
                notification.success({
                    message: 'Password Changed',
                    description: 'Your password has been changed successfully.',
                    placement: 'topRight',
                });
            },
            onError: (errors) => {
                message.error('Failed to update password');
                console.error('Password update errors:', errors);
            }
        });
    };

    const handleUpdatePreferences = () => {
        postPreferences(route('admin.profile.preferences.update'), {
            onSuccess: () => {
                message.success('Preferences updated successfully');
                setPreferencesDrawerVisible(false);
                notification.success({
                    message: 'Preferences Updated',
                    description: 'Your account preferences have been saved.',
                    placement: 'topRight',
                });
            },
            onError: (errors) => {
                message.error('Failed to update preferences');
                console.error('Preferences update errors:', errors);
            }
        });
    };

    const handleAvatarUpload = (info) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            setLoading(false);
            message.success('Avatar uploaded successfully');
            // Refresh the page to show new avatar
            router.reload();
        }
        if (info.file.status === 'error') {
            setLoading(false);
            message.error('Avatar upload failed');
        }
    };

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };

    const profileStats = [
        {
            title: 'Profile Completion',
            value: profileCompletion,
            suffix: '%',
            prefix: <TrophyOutlined />,
            valueStyle: { color: profileCompletion >= 80 ? token.colorSuccess : token.colorWarning },
        },
        {
            title: 'Last Login',
            value: user.last_login ? window.dayjs(user.last_login).fromNow() : 'Never',
            prefix: <ClockCircleOutlined />,
        },
        {
            title: 'Account Status',
            value: user.email_verified_at ? 'Verified' : 'Unverified',
            prefix: user.email_verified_at ? <CheckCircleOutlined /> : <WarningOutlined />,
            valueStyle: { color: user.email_verified_at ? token.colorSuccess : token.colorWarning },
        },
        {
            title: 'Role',
            value: user.role?.name || 'Member',
            prefix: <TeamOutlined />,
            valueStyle: { textTransform: 'capitalize' },
        },
    ];

    const securityFeatures = [
        {
            title: 'Two-Factor Authentication',
            description: 'Add an extra layer of security to your account',
            status: user.otp_enabled,
            action: user.otp_enabled ? 'Disable' : 'Enable',
            icon: <SafetyOutlined />,
            color: user.otp_enabled ? 'success' : 'warning',
        },
        {
            title: 'Email Notifications',
            description: 'Receive security alerts via email',
            status: user.preferences?.notifications?.email ?? true,
            action: 'Configure',
            icon: <BellOutlined />,
            color: 'info',
        },
        {
            title: 'Session Management',
            description: 'Manage your active sessions',
            status: true,
            action: 'View Sessions',
            icon: <GlobalOutlined />,
            color: 'info',
        },
    ];

    const profileItems = [
        {
            key: '1',
            label: <Text strong>Full Name</Text>,
            children: (
                <Space>
                    <UserOutlined style={{ color: token.colorPrimary }} />
                    <Text>{user.name || 'Not provided'}</Text>
                </Space>
            ),
            span: 2,
        },
        {
            key: '2',
            label: <Text strong>Email Address</Text>,
            children: (
                <Space>
                    <MailOutlined style={{ color: token.colorPrimary }} />
                    <Text>{user.email}</Text>
                    {user.email_verified_at && (
                        <Badge status="success" text="Verified" />
                    )}
                </Space>
            ),
            span: 2,
        },
        {
            key: '3',
            label: <Text strong>Phone Number</Text>,
            children: user.phone ? (
                <Space>
                    <PhoneOutlined style={{ color: token.colorPrimary }} />
                    <Text>{user.phone}</Text>
                </Space>
            ) : (
                <Text type="secondary">Not provided</Text>
            ),
        },
        {
            key: '4',
            label: <Text strong>Role & Permissions</Text>,
            children: (
                <Space>
                    <TeamOutlined style={{ color: token.colorPrimary }} />
                    <Tag color="blue" style={{ textTransform: 'capitalize' }}>
                        {user.role?.name || 'Member'}
                    </Tag>
                </Space>
            ),
        },
        {
            key: '5',
            label: <Text strong>Date of Birth</Text>,
            children: user.date_of_birth ? (
                <Space>
                    <CalendarOutlined style={{ color: token.colorPrimary }} />
                    <Text>{window.dayjs(user.date_of_birth).format('MMMM D, YYYY')}</Text>
                </Space>
            ) : (
                <Text type="secondary">Not provided</Text>
            ),
        },
        {
            key: '6',
            label: <Text strong>Member Since</Text>,
            children: (
                <Space>
                    <StarOutlined style={{ color: token.colorPrimary }} />
                    <Text>{window.dayjs(user.created_at).format('MMMM D, YYYY')}</Text>
                </Space>
            ),
        },
        {
            key: '7',
            label: <Text strong>Location</Text>,
            children: user.full_address ? (
                <Space>
                    <EnvironmentOutlined style={{ color: token.colorPrimary }} />
                    <Text>{user.full_address}</Text>
                </Space>
            ) : (
                <Text type="secondary">Not provided</Text>
            ),
            span: 3,
        },
        {
            key: '8',
            label: <Text strong>Bio</Text>,
            children: user.bio ? (
                <Paragraph style={{ margin: 0 }}>
                    {user.bio}
                </Paragraph>
            ) : (
                <Text type="secondary">No bio provided</Text>
            ),
            span: 3,
        },
    ];

    const tabItems = [
        {
            key: 'overview',
            label: (
                <Space>
                    <UserOutlined />
                    <span>Overview</span>
                </Space>
            ),
            children: (
                <div>
                    {/* Profile Statistics */}
                    <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                        {profileStats.map((stat, index) => (
                            <Col xs={12} sm={6} key={index}>
                                <Card size="small" hoverable>
                                    <Statistic
                                        title={stat.title}
                                        value={stat.value}
                                        suffix={stat.suffix}
                                        prefix={stat.prefix}
                                        valueStyle={stat.valueStyle}
                                    />
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    <Row gutter={[24, 24]}>
                        <Col xs={24} lg={16}>
                            <Card
                                title={
                                    <Space>
                                        <UserOutlined />
                                        <span>Personal Information</span>
                                    </Space>
                                }
                                extra={
                                    <Button
                                        type="primary"
                                        icon={<EditOutlined />}
                                        onClick={() => setEditModalVisible(true)}
                                    >
                                        Edit Profile
                                    </Button>
                                }
                                hoverable
                            >
                                <Descriptions
                                    items={profileItems}
                                    column={{ xs: 1, sm: 2, md: 2, lg: 2, xl: 3 }}
                                    bordered
                                    size="middle"
                                />
                            </Card>
                        </Col>
                        <Col xs={24} lg={8}>
                            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                {/* Profile Completion */}
                                {!isProfileComplete && (
                                    <Card size="small" hoverable>
                                        <Alert
                                            message="Complete Your Profile"
                                            description={
                                                <Space direction="vertical" style={{ width: '100%' }}>
                                                    <Text>Your profile is {profileCompletion}% complete</Text>
                                                    <Progress 
                                                        percent={profileCompletion} 
                                                        size="small"
                                                        strokeColor={{
                                                            '0%': '#108ee9',
                                                            '100%': '#87d068',
                                                        }}
                                                    />
                                                    <Button
                                                        type="link"
                                                        size="small"
                                                        onClick={() => setEditModalVisible(true)}
                                                        icon={<EditOutlined />}
                                                    >
                                                        Complete now
                                                    </Button>
                                                </Space>
                                            }
                                            type="warning"
                                            showIcon
                                        />
                                    </Card>
                                )}

                                {/* Quick Actions */}
                                <Card 
                                    title={
                                        <Space>
                                            <ThunderboltOutlined />
                                            <span>Quick Actions</span>
                                        </Space>
                                    } 
                                    size="small" 
                                    hoverable
                                >
                                    <Space direction="vertical" style={{ width: '100%' }}>
                                        <Button
                                            block
                                            icon={<EditOutlined />}
                                            onClick={() => setEditModalVisible(true)}
                                        >
                                            Edit Profile
                                        </Button>
                                        <Button
                                            block
                                            icon={<CameraOutlined />}
                                            onClick={() => setAvatarModalVisible(true)}
                                        >
                                            Change Avatar
                                        </Button>
                                        <Button
                                            block
                                            icon={<LockOutlined />}
                                            onClick={() => setPasswordModalVisible(true)}
                                        >
                                            Change Password
                                        </Button>
                                        <Button
                                            block
                                            icon={<SettingOutlined />}
                                            onClick={() => setPreferencesDrawerVisible(true)}
                                        >
                                            Preferences
                                        </Button>
                                        <Button
                                            block
                                            icon={<HistoryOutlined />}
                                            onClick={() => setActiveTab('activity')}
                                        >
                                            View Activity
                                        </Button>
                                    </Space>
                                </Card>

                                {/* Account Health */}
                                <Card 
                                    title={
                                        <Space>
                                            <HeartOutlined />
                                            <span>Account Health</span>
                                        </Space>
                                    } 
                                    size="small" 
                                    hoverable
                                >
                                    <List
                                        size="small"
                                        dataSource={[
                                            {
                                                title: 'Email Verified',
                                                status: user.email_verified_at ? 'success' : 'error',
                                                icon: user.email_verified_at ? <CheckCircleOutlined /> : <WarningOutlined />,
                                            },
                                            {
                                                title: '2FA Enabled',
                                                status: user.otp_enabled ? 'success' : 'warning',
                                                icon: user.otp_enabled ? <SafetyOutlined /> : <ExclamationCircleOutlined />,
                                            },
                                            {
                                                title: 'Profile Complete',
                                                status: isProfileComplete ? 'success' : 'warning',
                                                icon: isProfileComplete ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />,
                                            },
                                        ]}
                                        renderItem={(item) => (
                                            <List.Item>
                                                <Space>
                                                    <Badge 
                                                        status={item.status} 
                                                        icon={item.icon}
                                                    />
                                                    <Text>{item.title}</Text>
                                                </Space>
                                            </List.Item>
                                        )}
                                    />
                                </Card>
                            </Space>
                        </Col>
                    </Row>
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
                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={12}>
                        <Card 
                            title={
                                <Space>
                                    <LockOutlined />
                                    <span>Password & Authentication</span>
                                </Space>
                            }
                            hoverable
                        >
                            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                <div>
                                    <Title level={5}>
                                        <Space>
                                            <KeyOutlined />
                                            Password Security
                                        </Space>
                                    </Title>
                                    <Paragraph type="secondary">
                                        Last changed: {user.password_changed_at ? window.dayjs(user.password_changed_at).format('MMMM D, YYYY') : 'Never'}
                                    </Paragraph>
                                    <Button 
                                        type="primary" 
                                        icon={<LockOutlined />}
                                        onClick={() => setPasswordModalVisible(true)}
                                    >
                                        Change Password
                                    </Button>
                                </div>
                                <Divider />
                                {securityFeatures.map((feature, index) => (
                                    <div key={index}>
                                        <Row justify="space-between" align="middle">
                                            <Col>
                                                <Space>
                                                    {feature.icon}
                                                    <div>
                                                        <Text strong>{feature.title}</Text>
                                                        <br />
                                                        <Text type="secondary" style={{ fontSize: '12px' }}>
                                                            {feature.description}
                                                        </Text>
                                                    </div>
                                                </Space>
                                            </Col>
                                            <Col>
                                                <Space>
                                                    <Badge 
                                                        status={feature.status ? 'success' : 'default'} 
                                                        text={feature.status ? 'Active' : 'Inactive'}
                                                    />
                                                    <Button size="small" type="link">
                                                        {feature.action}
                                                    </Button>
                                                </Space>
                                            </Col>
                                        </Row>
                                        {index < securityFeatures.length - 1 && <Divider />}
                                    </div>
                                ))}
                            </Space>
                        </Card>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Space direction="vertical" size="large" style={{ width: '100%' }}>
                            <Card 
                                title={
                                    <Space>
                                        <HistoryOutlined />
                                        <span>Recent Login Activity</span>
                                    </Space>
                                }
                                hoverable
                            >
                                {recentActivities.filter(activity => activity.action === 'login').length > 0 ? (
                                    <Timeline
                                        size="small"
                                        items={recentActivities
                                            .filter(activity => activity.action === 'login')
                                            .slice(0, 5)
                                            .map(activity => ({
                                                dot: <LoginOutlined style={{ color: token.colorSuccess }} />,
                                                children: (
                                                    <div>
                                                        <Text strong>Successful login</Text>
                                                        <br />
                                                        <Text type="secondary" style={{ fontSize: '12px' }}>
                                                            {window.dayjs(activity.created_at).format('MMM D, YYYY h:mm A')}
                                                        </Text>
                                                    </div>
                                                ),
                                            }))}
                                    />
                                ) : (
                                    <Empty 
                                        description="No recent login activity"
                                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    />
                                )}
                            </Card>

                            <Card 
                                title={
                                    <Space>
                                        <GlobalOutlined />
                                        <span>Active Sessions</span>
                                    </Space>
                                }
                                hoverable
                            >
                                <List
                                    size="small"
                                    dataSource={[
                                        {
                                            device: 'Current Session',
                                            location: 'Tanzania',
                                            time: 'Active now',
                                            current: true,
                                        }
                                    ]}
                                    renderItem={(session) => (
                                        <List.Item
                                            actions={[
                                                session.current ? (
                                                    <Tag color="green">Current</Tag>
                                                ) : (
                                                    <Button size="small" danger type="text">
                                                        Revoke
                                                    </Button>
                                                )
                                            ]}
                                        >
                                            <List.Item.Meta
                                                avatar={<ComputerDesktopIcon style={{ width: 16, height: 16 }} />}
                                                title={session.device}
                                                description={`${session.location} • ${session.time}`}
                                            />
                                        </List.Item>
                                    )}
                                />
                            </Card>
                        </Space>
                    </Col>
                </Row>
            ),
        },
        {
            key: 'activity',
            label: (
                <Space>
                    <HistoryOutlined />
                    <span>Activity Log</span>
                    <Badge count={recentActivities.length} size="small" />
                </Space>
            ),
            children: (
                <Card 
                    title={
                        <Space>
                            <HistoryOutlined />
                            <span>Recent Activity</span>
                        </Space>
                    }
                    extra={
                        <Space>
                            <Button icon={<ReloadOutlined />} size="small">
                                Refresh
                            </Button>
                            <Link href={route('admin.profile.activities')}>
                                <Button type="primary" size="small">
                                    View All
                                </Button>
                            </Link>
                        </Space>
                    }
                    hoverable
                >
                    {recentActivities.length > 0 ? (
                        <Timeline
                            mode="left"
                            items={recentActivities.slice(0, 15).map((activity, index) => ({
                                dot: getActivityIcon(activity.action),
                                color: getActivityColor(activity.action),
                                children: (
                                    <div>
                                        <Row justify="space-between" align="top">
                                            <Col flex={1}>
                                                <Text strong>{activity.description}</Text>
                                                <br />
                                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                                    {window.dayjs(activity.created_at).format('MMM D, YYYY h:mm A')}
                                                </Text>
                                            </Col>
                                            <Col>
                                                <Tag color={getActivityColor(activity.action)} size="small">
                                                    {activity.action.replace('_', ' ').toUpperCase()}
                                                </Tag>
                                            </Col>
                                        </Row>
                                    </div>
                                ),
                            }))}
                        />
                    ) : (
                        <Empty 
                            description="No activity recorded yet"
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                    )}
                </Card>
            ),
        },
        {
            key: 'preferences',
            label: (
                <Space>
                    <SettingOutlined />
                    <span>Preferences</span>
                </Space>
            ),
            children: (
                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={12}>
                        <Card 
                            title={
                                <Space>
                                    <SettingOutlined />
                                    <span>Account Preferences</span>
                                </Space>
                            }
                            hoverable
                        >
                            <Form
                                form={preferencesForm}
                                layout="vertical"
                                initialValues={preferencesData}
                                onFinish={handleUpdatePreferences}
                            >
                                <Form.Item
                                    label="Theme Preference"
                                    name="theme"
                                    tooltip="Choose your preferred theme"
                                >
                                    <Select>
                                        <Option value="light">Light Theme</Option>
                                        <Option value="dark">Dark Theme</Option>
                                        <Option value="auto">Auto (System)</Option>
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    label="Language"
                                    name="language"
                                    tooltip="Select your preferred language"
                                >
                                    <Select>
                                        <Option value="en">English</Option>
                                        <Option value="sw">Swahili</Option>
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    label="Timezone"
                                    name="timezone"
                                    tooltip="Your local timezone"
                                >
                                    <Select>
                                        <Option value="UTC">UTC</Option>
                                        <Option value="Africa/Dar_es_Salaam">East Africa Time</Option>
                                    </Select>
                                </Form.Item>

                                <Divider />

                                <Title level={5}>Notification Preferences</Title>
                                
                                <Form.Item name={['notifications', 'email']} valuePropName="checked">
                                    <Row justify="space-between" align="middle">
                                        <Col>
                                            <Space>
                                                <MailOutlined />
                                                <div>
                                                    <Text>Email Notifications</Text>
                                                    <br />
                                                    <Text type="secondary" style={{ fontSize: '12px' }}>
                                                        Receive updates via email
                                                    </Text>
                                                </div>
                                            </Space>
                                        </Col>
                                        <Col>
                                            <Switch />
                                        </Col>
                                    </Row>
                                </Form.Item>

                                <Form.Item name={['notifications', 'sms']} valuePropName="checked">
                                    <Row justify="space-between" align="middle">
                                        <Col>
                                            <Space>
                                                <PhoneOutlined />
                                                <div>
                                                    <Text>SMS Notifications</Text>
                                                    <br />
                                                    <Text type="secondary" style={{ fontSize: '12px' }}>
                                                        Receive updates via SMS
                                                    </Text>
                                                </div>
                                            </Space>
                                        </Col>
                                        <Col>
                                            <Switch />
                                        </Col>
                                    </Row>
                                </Form.Item>

                                <Form.Item name={['notifications', 'push']} valuePropName="checked">
                                    <Row justify="space-between" align="middle">
                                        <Col>
                                            <Space>
                                                <BellOutlined />
                                                <div>
                                                    <Text>Push Notifications</Text>
                                                    <br />
                                                    <Text type="secondary" style={{ fontSize: '12px' }}>
                                                        Receive browser notifications
                                                    </Text>
                                                </div>
                                            </Space>
                                        </Col>
                                        <Col>
                                            <Switch />
                                        </Col>
                                    </Row>
                                </Form.Item>

                                <Form.Item>
                                    <Button 
                                        type="primary" 
                                        htmlType="submit" 
                                        loading={preferencesProcessing}
                                        icon={<SaveOutlined />}
                                        block
                                    >
                                        Save Preferences
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Card>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Card 
                            title={
                                <Space>
                                    <InfoCircleOutlined />
                                    <span>Account Information</span>
                                </Space>
                            }
                            hoverable
                        >
                            <Descriptions
                                column={1}
                                items={[
                                    {
                                        key: '1',
                                        label: 'Account Created',
                                        children: window.dayjs(user.created_at).format('MMMM D, YYYY'),
                                    },
                                    {
                                        key: '2',
                                        label: 'Last Updated',
                                        children: user.last_profile_update ? window.dayjs(user.last_profile_update).format('MMMM D, YYYY') : 'Never',
                                    },
                                    {
                                        key: '3',
                                        label: 'Account ID',
                                        children: user.id,
                                    },
                                    {
                                        key: '4',
                                        label: 'Email Verified',
                                        children: user.email_verified_at ? (
                                            <Badge status="success" text="Verified" />
                                        ) : (
                                            <Badge status="error" text="Not Verified" />
                                        ),
                                    },
                                ]}
                            />
                        </Card>
                    </Col>
                </Row>
            ),
        },
    ];

    return (
        <AdminSidebarLayout>
            <Head title="Profile - Tabata Welfare Association" />
            
            <div style={{ padding: '24px' }}>
                {/* Breadcrumb */}
                <Breadcrumb style={{ marginBottom: 24 }}>
                    <Breadcrumb.Item>
                        <Link href={route('admin-portal.dashboard')}>
                            <Space>
                                <DashboardOutlined />
                                Dashboard
                            </Space>
                        </Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <UserOutlined />
                        Profile
                    </Breadcrumb.Item>
                </Breadcrumb>

                {/* Profile Header */}
                <Card style={{ marginBottom: 24 }} hoverable>
                    <Row align="middle" gutter={24}>
                        <Col>
                            <Badge.Ribbon 
                                text={user.role?.name || 'Member'} 
                                color="blue"
                                style={{ textTransform: 'capitalize' }}
                            >
                                <div style={{ position: 'relative' }}>
                                    <Avatar
                                        size={100}
                                        src={user.avatar_url}
                                        style={{
                                            backgroundColor: token.colorPrimary,
                                            fontSize: '36px',
                                            border: `4px solid ${token.colorBorder}`,
                                        }}
                                    >
                                        {user.name?.charAt(0)?.toUpperCase()}
                                    </Avatar>
                                    <Button
                                        type="primary"
                                        shape="circle"
                                        icon={<CameraOutlined />}
                                        size="small"
                                        style={{
                                            position: 'absolute',
                                            bottom: 0,
                                            right: 0,
                                        }}
                                        onClick={() => setAvatarModalVisible(true)}
                                    />
                                </div>
                            </Badge.Ribbon>
                        </Col>
                        <Col flex={1}>
                            <Space direction="vertical" size="small">
                                <Title level={2} style={{ margin: 0 }}>
                                    {user.name}
                                    {user.email_verified_at && (
                                        <Tooltip title="Verified Account">
                                            <CheckCircleOutlined 
                                                style={{ 
                                                    color: token.colorSuccess, 
                                                    marginLeft: 8,
                                                    fontSize: '20px'
                                                }} 
                                            />
                                        </Tooltip>
                                    )}
                                </Title>
                                <Space wrap>
                                    <Tag color="blue" icon={<TeamOutlined />} style={{ textTransform: 'capitalize' }}>
                                        {user.role?.name || 'Member'}
                                    </Tag>
                                    <Tag color="green" icon={<MailOutlined />}>
                                        {user.email}
                                    </Tag>
                                    {user.phone && (
                                        <Tag color="orange" icon={<PhoneOutlined />}>
                                            {user.phone}
                                        </Tag>
                                    )}
                                </Space>
                                {user.bio && (
                                    <Paragraph 
                                        style={{ 
                                            marginTop: 8, 
                                            marginBottom: 0,
                                            maxWidth: '500px'
                                        }}
                                        ellipsis={{ rows: 2, expandable: true }}
                                    >
                                        {user.bio}
                                    </Paragraph>
                                )}
                            </Space>
                        </Col>
                        <Col>
                            <Space>
                                <Tooltip title="Edit Profile">
                                    <Button
                                        type="primary"
                                        icon={<EditOutlined />}
                                        onClick={() => setEditModalVisible(true)}
                                    >
                                        Edit Profile
                                    </Button>
                                </Tooltip>
                                <Tooltip title="Quick Settings">
                                    <Button
                                        icon={<SettingOutlined />}
                                        onClick={() => setPreferencesDrawerVisible(true)}
                                    />
                                </Tooltip>
                            </Space>
                        </Col>
                    </Row>
                </Card>

                {/* Profile Tabs */}
                <Card>
                    <Tabs
                        activeKey={activeTab}
                        onChange={setActiveTab}
                        items={tabItems}
                        size="large"
                        tabBarStyle={{ marginBottom: 24 }}
                    />
                </Card>

                {/* Edit Profile Modal */}
                <Modal
                    title={
                        <Space>
                            <EditOutlined />
                            Edit Profile Information
                        </Space>
                    }
                    open={editModalVisible}
                    onCancel={() => setEditModalVisible(false)}
                    onOk={handleUpdateProfile}
                    confirmLoading={processing}
                    width={700}
                    destroyOnClose
                >
                    <Form
                        form={form}
                        layout="vertical"
                        initialValues={data}
                        onValuesChange={(_, values) => setData(values)}
                    >
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    label="Full Name"
                                    name="name"
                                    rules={[{ required: true, message: 'Please enter your name' }]}
                                >
                                    <Input prefix={<UserOutlined />} placeholder="Enter your full name" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Email Address"
                                    name="email"
                                    rules={[
                                        { required: true, message: 'Please enter your email' },
                                        { type: 'email', message: 'Please enter a valid email' }
                                    ]}
                                >
                                    <Input prefix={<MailOutlined />} placeholder="Enter your email" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Phone Number" name="phone">
                                    <Input prefix={<PhoneOutlined />} placeholder="Enter your phone number" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Date of Birth" name="date_of_birth">
                                    <DatePicker 
                                        style={{ width: '100%' }}
                                        placeholder="Select your birth date"
                                        format="YYYY-MM-DD"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item label="Bio" name="bio">
                            <Input.TextArea 
                                rows={3} 
                                placeholder="Tell us about yourself..."
                                showCount
                                maxLength={500}
                            />
                        </Form.Item>
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item label="Address" name="address">
                                    <Input prefix={<EnvironmentOutlined />} placeholder="Street address" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="City" name="city">
                                    <Input placeholder="City" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="Region" name="region">
                                    <Input placeholder="Region/State" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Modal>

                {/* Change Password Modal */}
                <Modal
                    title={
                        <Space>
                            <LockOutlined />
                            Change Password
                        </Space>
                    }
                    open={passwordModalVisible}
                    onCancel={() => setPasswordModalVisible(false)}
                    onOk={handleUpdatePassword}
                    confirmLoading={passwordProcessing}
                    width={500}
                    destroyOnClose
                >
                    <Alert
                        message="Password Security"
                        description="Choose a strong password with at least 8 characters, including uppercase, lowercase, numbers, and special characters."
                        type="info"
                        showIcon
                        style={{ marginBottom: 24 }}
                    />
                    <Form
                        form={passwordForm}
                        layout="vertical"
                        onValuesChange={(_, values) => setPasswordData(values)}
                    >
                        <Form.Item
                            label="Current Password"
                            name="current_password"
                            rules={[{ required: true, message: 'Please enter your current password' }]}
                        >
                            <Input.Password 
                                prefix={<LockOutlined />} 
                                placeholder="Enter current password"
                            />
                        </Form.Item>
                        <Form.Item
                            label="New Password"
                            name="password"
                            rules={[
                                { required: true, message: 'Please enter new password' },
                                { min: 8, message: 'Password must be at least 8 characters' }
                            ]}
                        >
                            <Input.Password 
                                prefix={<KeyOutlined />} 
                                placeholder="Enter new password"
                            />
                        </Form.Item>
                        <Form.Item
                            label="Confirm New Password"
                            name="password_confirmation"
                            dependencies={['password']}
                            rules={[
                                { required: true, message: 'Please confirm your password' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Passwords do not match!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password 
                                prefix={<KeyOutlined />} 
                                placeholder="Confirm new password"
                            />
                        </Form.Item>
                    </Form>
                </Modal>

                {/* Avatar Upload Modal */}
                <Modal
                    title={
                        <Space>
                            <CameraOutlined />
                            Change Profile Picture
                        </Space>
                    }
                    open={avatarModalVisible}
                    onCancel={() => setAvatarModalVisible(false)}
                    footer={null}
                    width={400}
                >
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                        <Avatar
                            size={120}
                            src={user.avatar_url}
                            style={{
                                backgroundColor: token.colorPrimary,
                                fontSize: '48px',
                                marginBottom: 24,
                            }}
                        >
                            {user.name?.charAt(0)?.toUpperCase()}
                        </Avatar>
                        <Upload
                            name="avatar"
                            action={route('admin.profile.avatar.upload')}
                            headers={{
                                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                            }}
                            beforeUpload={beforeUpload}
                            onChange={handleAvatarUpload}
                            showUploadList={false}
                        >
                            <Button 
                                type="primary" 
                                icon={loading ? <SyncOutlined spin /> : <CloudUploadOutlined />}
                                loading={loading}
                                size="large"
                                block
                            >
                                {loading ? 'Uploading...' : 'Upload New Picture'}
                            </Button>
                        </Upload>
                        <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
                            JPG or PNG, max 2MB
                        </Text>
                        {user.avatar && (
                            <Button 
                                danger 
                                type="text" 
                                icon={<DeleteOutlined />}
                                style={{ marginTop: 16 }}
                                onClick={() => {
                                    Modal.confirm({
                                        title: 'Remove Profile Picture',
                                        content: 'Are you sure you want to remove your profile picture?',
                                        onOk: () => {
                                            router.delete(route('admin.profile.avatar.remove'), {
                                                onSuccess: () => {
                                                    message.success('Profile picture removed');
                                                    setAvatarModalVisible(false);
                                                }
                                            });
                                        }
                                    });
                                }}
                            >
                                Remove Picture
                            </Button>
                        )}
                    </div>
                </Modal>

                {/* Preferences Drawer */}
                <Drawer
                    title={
                        <Space>
                            <SettingOutlined />
                            Quick Settings
                        </Space>
                    }
                    placement="right"
                    onClose={() => setPreferencesDrawerVisible(false)}
                    open={preferencesDrawerVisible}
                    width={400}
                >
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        <Card size="small" title="Theme">
                            <Select
                                value={preferencesData.theme}
                                onChange={(value) => setPreferencesData('theme', value)}
                                style={{ width: '100%' }}
                            >
                                <Option value="light">Light</Option>
                                <Option value="dark">Dark</Option>
                                <Option value="auto">Auto</Option>
                            </Select>
                        </Card>

                        <Card size="small" title="Notifications">
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <Row justify="space-between" align="middle">
                                    <Col>Email Notifications</Col>
                                    <Col>
                                        <Switch 
                                            checked={preferencesData.notifications.email}
                                            onChange={(checked) => 
                                                setPreferencesData('notifications', {
                                                    ...preferencesData.notifications,
                                                    email: checked
                                                })
                                            }
                                        />
                                    </Col>
                                </Row>
                                <Row justify="space-between" align="middle">
                                    <Col>Push Notifications</Col>
                                    <Col>
                                        <Switch 
                                            checked={preferencesData.notifications.push}
                                            onChange={(checked) => 
                                                setPreferencesData('notifications', {
                                                    ...preferencesData.notifications,
                                                    push: checked
                                                })
                                            }
                                        />
                                    </Col>
                                </Row>
                            </Space>
                        </Card>

                        <Button 
                            type="primary" 
                            block 
                            onClick={handleUpdatePreferences}
                            loading={preferencesProcessing}
                        >
                            Save Settings
                        </Button>
                    </Space>
                </Drawer>

                {/* Floating Action Button */}
                <FloatButton.Group
                    trigger="hover"
                    type="primary"
                    style={{ right: 24 }}
                    icon={<SettingOutlined />}
                >
                    <FloatButton 
                        icon={<EditOutlined />} 
                        tooltip="Edit Profile"
                        onClick={() => setEditModalVisible(true)}
                    />
                    <FloatButton 
                        icon={<LockOutlined />} 
                        tooltip="Change Password"
                        onClick={() => setPasswordModalVisible(true)}
                    />
                    <FloatButton 
                        icon={<CameraOutlined />} 
                        tooltip="Change Avatar"
                        onClick={() => setAvatarModalVisible(true)}
                    />
                </FloatButton.Group>
            </div>
        </AdminSidebarLayout>
    );
}