import React, { useState } from 'react';
import AdminSidebarLayout from '@/Layouts/AdminSidebarLayout';
import { router, Head } from '@inertiajs/react';
import { 
    Card, 
    Button, 
    Table, 
    Tag, 
    Space, 
    Input, 
    Select, 
    Typography,
    Empty,
    theme,
    DatePicker,
    Tooltip,
} from 'antd';
import { 
    SearchOutlined, 
    EyeOutlined,
    UserOutlined,
    GlobalOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Text } = Typography;

export default function AuditLogs({ logs, users, actions, categories, modelTypes, filters }) {
    const { token } = theme.useToken();

    const [searchText, setSearchText] = useState(filters.search || '');
    const [selectedUser, setSelectedUser] = useState(filters.user_id || null);
    const [selectedAction, setSelectedAction] = useState(filters.action || null);
    const [selectedCategory, setSelectedCategory] = useState(filters.category || null);
    const [selectedSeverity, setSelectedSeverity] = useState(filters.severity || null);
    const [selectedModelType, setSelectedModelType] = useState(filters.model_type || null);
    const [dateFrom, setDateFrom] = useState(filters.date_from ? dayjs(filters.date_from) : null);
    const [dateTo, setDateTo] = useState(filters.date_to ? dayjs(filters.date_to) : null);

    const handleSearch = () => {
        router.get('/admin-portal/audit-logs', {
            search: searchText,
            user_id: selectedUser,
            action: selectedAction,
            category: selectedCategory,
            severity: selectedSeverity,
            model_type: selectedModelType,
            date_from: dateFrom ? dateFrom.format('YYYY-MM-DD') : null,
            date_to: dateTo ? dateTo.format('YYYY-MM-DD') : null,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleReset = () => {
        setSearchText('');
        setSelectedUser(null);
        setSelectedAction(null);
        setSelectedCategory(null);
        setSelectedSeverity(null);
        setSelectedModelType(null);
        setDateFrom(null);
        setDateTo(null);
        router.get('/admin-portal/audit-logs', {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleView = (log) => {
        router.visit(route('admin-portal.audit-logs.show', log.id));
    };

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

    const columns = [
        {
            title: 'Date & Time',
            dataIndex: 'created_at',
            key: 'created_at',
            width: 150,
            render: (date) => (
                <Tooltip title={dayjs(date).format('YYYY-MM-DD HH:mm:ss')}>
                    <span style={{ fontSize: '13px' }}>
                        {dayjs(date).format('MMM DD, YYYY HH:mm')}
                    </span>
                </Tooltip>
            ),
        },
        {
            title: 'User',
            dataIndex: 'user_name',
            key: 'user_name',
            width: 140,
            ellipsis: true,
            render: (name, record) => (
                <Tooltip title={record.user_email}>
                    <Space size="small">
                        <UserOutlined style={{ fontSize: '12px' }} />
                        <span style={{ fontSize: '13px' }}>{name || 'System'}</span>
                    </Space>
                </Tooltip>
            ),
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            width: 110,
            render: (action) => (
                <Tag color={getActionColor(action)} style={{ fontSize: '11px' }}>
                    {action.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            width: 100,
            render: (category) => category ? (
                <Tag color={getCategoryColor(category)} style={{ fontSize: '11px' }}>
                    {category.toUpperCase()}
                </Tag>
            ) : <span style={{ fontSize: '13px' }}>-</span>,
        },
        {
            title: 'Model',
            dataIndex: 'model_type',
            key: 'model_type',
            width: 120,
            ellipsis: true,
            render: (type, record) => type ? (
                <Tooltip title={`${type} (ID: ${record.model_id})`}>
                    <span style={{ fontSize: '13px' }}>
                        {record.model_name || class_basename(type)}
                    </span>
                </Tooltip>
            ) : <span style={{ fontSize: '13px' }}>-</span>,
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
            render: (desc) => (
                <span style={{ fontSize: '13px' }}>{desc || '-'}</span>
            ),
        },
        {
            title: 'Severity',
            dataIndex: 'severity',
            key: 'severity',
            width: 90,
            render: (severity) => (
                <Tag color={getSeverityColor(severity)} style={{ fontSize: '11px' }}>
                    {severity.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'IP Address',
            dataIndex: 'ip_address',
            key: 'ip_address',
            width: 120,
            render: (ip) => ip ? (
                <Tooltip title={ip}>
                    <Space size="small">
                        <GlobalOutlined style={{ fontSize: '12px' }} />
                        <span style={{ fontSize: '12px' }}>{ip}</span>
                    </Space>
                </Tooltip>
            ) : <span style={{ fontSize: '13px' }}>-</span>,
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 70,
            fixed: 'right',
            render: (_, record) => (
                <Button
                    type="text"
                    size="small"
                    icon={<EyeOutlined />}
                    onClick={() => handleView(record)}
                />
            ),
        },
    ];

    // Helper function to get class basename
    const class_basename = (className) => {
        if (!className) return '';
        const parts = className.split('\\');
        return parts[parts.length - 1];
    };

    return (
        <>
            <Head title="Audit Logs - Tabata Welfare Association" />
            <AdminSidebarLayout>
            <Card>
                <div style={{ marginBottom: 16 }}>
                    <Space wrap style={{ marginBottom: 12 }}>
                        <Input
                            placeholder="Search logs..."
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            onPressEnter={handleSearch}
                            style={{ width: 200 }}
                            allowClear
                        />
                        <Select
                            placeholder="User"
                            value={selectedUser}
                            onChange={setSelectedUser}
                            style={{ width: 180 }}
                            allowClear
                            showSearch
                            optionFilterProp="children"
                        >
                            {users.map(user => (
                                <Select.Option key={user.id} value={user.id}>
                                    {user.name}
                                </Select.Option>
                            ))}
                        </Select>
                        <Select
                            placeholder="Action"
                            value={selectedAction}
                            onChange={setSelectedAction}
                            style={{ width: 130 }}
                            allowClear
                        >
                            {actions.map(action => (
                                <Select.Option key={action} value={action}>
                                    {action}
                                </Select.Option>
                            ))}
                        </Select>
                        <Select
                            placeholder="Category"
                            value={selectedCategory}
                            onChange={setSelectedCategory}
                            style={{ width: 130 }}
                            allowClear
                        >
                            {categories.map(category => (
                                <Select.Option key={category} value={category}>
                                    {category}
                                </Select.Option>
                            ))}
                        </Select>
                        <Select
                            placeholder="Severity"
                            value={selectedSeverity}
                            onChange={setSelectedSeverity}
                            style={{ width: 120 }}
                            allowClear
                        >
                            <Select.Option value="low">Low</Select.Option>
                            <Select.Option value="medium">Medium</Select.Option>
                            <Select.Option value="high">High</Select.Option>
                            <Select.Option value="critical">Critical</Select.Option>
                        </Select>
                    </Space>
                    <Space wrap>
                        <Select
                            placeholder="Model Type"
                            value={selectedModelType}
                            onChange={setSelectedModelType}
                            style={{ width: 150 }}
                            allowClear
                        >
                            {modelTypes.map(type => (
                                <Select.Option key={type.value} value={type.value}>
                                    {type.label}
                                </Select.Option>
                            ))}
                        </Select>
                        <DatePicker
                            placeholder="From Date"
                            value={dateFrom}
                            onChange={setDateFrom}
                            style={{ width: 140 }}
                        />
                        <DatePicker
                            placeholder="To Date"
                            value={dateTo}
                            onChange={setDateTo}
                            style={{ width: 140 }}
                        />
                        <Button onClick={handleSearch} type="primary">
                            Search
                        </Button>
                        <Button onClick={handleReset}>
                            Reset
                        </Button>
                    </Space>
                </div>

                <Table
                    columns={columns}
                    dataSource={logs.data}
                    rowKey="id"
                    size="small"
                    pagination={{
                        current: logs.current_page,
                        pageSize: logs.per_page,
                        total: logs.total,
                        showSizeChanger: false,
                        showTotal: (total) => <span style={{ fontSize: '13px' }}>Total {total} logs</span>,
                        onChange: (page) => {
                            router.get('/admin-portal/audit-logs', {
                                ...filters,
                                page,
                            }, {
                                preserveState: true,
                                preserveScroll: true,
                            });
                        },
                    }}
                    locale={{
                        emptyText: (
                            <Empty
                                description="No audit logs found"
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                            />
                        ),
                    }}
                    scroll={{ x: 1300 }}
                />
            </Card>
        </AdminSidebarLayout>
        </>
    );
}
