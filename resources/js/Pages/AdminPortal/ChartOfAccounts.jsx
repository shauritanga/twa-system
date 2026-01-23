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
    Modal, 
    Dropdown, 
    Typography,
    Empty,
    theme,
    message,
    Tooltip,
} from 'antd';
import { 
    PlusOutlined, 
    SearchOutlined, 
    MoreOutlined,
    EditOutlined,
    DeleteOutlined,
    CheckCircleOutlined,
    StopOutlined,
} from '@ant-design/icons';
import AccountFormAnt from '@/Components/AccountFormAnt';

const { Text } = Typography;

const ACCOUNT_TYPES = [
    { value: 'asset', label: 'Asset', color: 'blue' },
    { value: 'liability', label: 'Liability', color: 'red' },
    { value: 'equity', label: 'Equity', color: 'purple' },
    { value: 'revenue', label: 'Revenue', color: 'green' },
    { value: 'expense', label: 'Expense', color: 'orange' },
];

export default function ChartOfAccounts({ accounts, parentAccounts, filters }) {
    const { token } = theme.useToken();
    const [messageApi, contextHolder] = message.useMessage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAccount, setEditingAccount] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [accountToDelete, setAccountToDelete] = useState(null);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');

    const [searchText, setSearchText] = useState(filters.search || '');
    const [selectedType, setSelectedType] = useState(filters.type || null);
    const [selectedSubtype, setSelectedSubtype] = useState(filters.subtype || null);
    const [selectedStatus, setSelectedStatus] = useState(filters.status || null);

    const handleSearch = () => {
        router.get('/admin-portal/chart-of-accounts', {
            search: searchText,
            type: selectedType,
            subtype: selectedSubtype,
            status: selectedStatus,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleReset = () => {
        setSearchText('');
        setSelectedType(null);
        setSelectedSubtype(null);
        setSelectedStatus(null);
        router.get('/admin-portal/chart-of-accounts', {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleCreate = () => {
        setEditingAccount(null);
        setIsModalOpen(true);
    };

    const handleEdit = (account) => {
        setEditingAccount(account);
        setIsModalOpen(true);
    };

    const handleSubmit = (values) => {
        if (editingAccount) {
            router.put(`/admin-portal/chart-of-accounts/${editingAccount.id}`, values, {
                preserveScroll: true,
                onSuccess: () => {
                    setIsModalOpen(false);
                    setEditingAccount(null);
                    messageApi.success('Account updated successfully');
                },
                onError: (errors) => {
                    console.error('Validation errors:', errors);
                    messageApi.error('Failed to update account. Please check the form.');
                },
            });
        } else {
            router.post('/admin-portal/chart-of-accounts', values, {
                preserveScroll: true,
                onSuccess: () => {
                    setIsModalOpen(false);
                    messageApi.success('Account created successfully');
                },
                onError: (errors) => {
                    console.error('Validation errors:', errors);
                    messageApi.error('Failed to create account. Please check the form.');
                },
            });
        }
    };

    const handleDeleteClick = (account) => {
        setAccountToDelete(account);
        setDeleteConfirmText('');
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (accountToDelete) {
            router.delete(`/admin-portal/chart-of-accounts/${accountToDelete.id}`, {
                onSuccess: () => {
                    setDeleteModalOpen(false);
                    setAccountToDelete(null);
                    setDeleteConfirmText('');
                    messageApi.success('Account deleted successfully');
                },
                onError: (errors) => {
                    const errorMessage = errors?.message || 'Failed to delete account';
                    messageApi.error(errorMessage);
                },
            });
        }
    };

    const handleToggleStatus = (account) => {
        router.post(`/admin-portal/chart-of-accounts/${account.id}/toggle-status`, {}, {
            onSuccess: () => {
                const status = !account.is_active ? 'activated' : 'deactivated';
                messageApi.success(`Account ${status} successfully`);
            },
            onError: (errors) => {
                const errorMessage = errors?.message || 'Failed to update account status';
                messageApi.error(errorMessage);
            },
        });
    };

    const getTypeColor = (type) => {
        const typeObj = ACCOUNT_TYPES.find(t => t.value === type);
        return typeObj?.color || 'default';
    };

    const getTypeLabel = (type) => {
        const typeObj = ACCOUNT_TYPES.find(t => t.value === type);
        return typeObj?.label || type;
    };

    const getActionItems = (account) => {
        const items = [
            {
                key: 'edit',
                label: 'Edit',
                icon: <EditOutlined />,
                onClick: () => handleEdit(account),
                disabled: account.is_system_account,
            },
            {
                key: 'toggle-status',
                label: account.is_active ? 'Deactivate' : 'Activate',
                icon: account.is_active ? <StopOutlined /> : <CheckCircleOutlined />,
                onClick: () => handleToggleStatus(account),
                disabled: account.is_system_account,
            },
            {
                key: 'delete',
                label: 'Delete',
                icon: <DeleteOutlined />,
                danger: true,
                onClick: () => handleDeleteClick(account),
                disabled: account.is_system_account,
            },
        ];

        return items;
    };

    const columns = [
        {
            title: 'Code',
            dataIndex: 'account_code',
            key: 'account_code',
            width: 100,
            sorter: (a, b) => a.account_code.localeCompare(b.account_code),
        },
        {
            title: 'Account Name',
            dataIndex: 'account_name',
            key: 'account_name',
            width: 220,
            ellipsis: true,
            render: (name, record) => (
                <div>
                    <div>{name}</div>
                    {record.is_system_account && (
                        <Tag color="gold" style={{ fontSize: '10px', marginTop: '4px' }}>SYSTEM</Tag>
                    )}
                </div>
            ),
        },
        {
            title: 'Type',
            dataIndex: 'account_type',
            key: 'account_type',
            width: 110,
            render: (type) => (
                <Tag color={getTypeColor(type)}>
                    {getTypeLabel(type).toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Subtype',
            dataIndex: 'account_subtype',
            key: 'account_subtype',
            width: 150,
            ellipsis: true,
            render: (subtype) => subtype || '-',
        },
        {
            title: 'Parent Account',
            dataIndex: 'parent_account',
            key: 'parent_account',
            width: 150,
            ellipsis: true,
            render: (_, record) => record.parent_account ? (
                <Tooltip title={`${record.parent_account.account_code} - ${record.parent_account.account_name}`}>
                    {record.parent_account.account_code}
                </Tooltip>
            ) : '-',
        },
        {
            title: 'Normal Balance',
            dataIndex: 'normal_balance',
            key: 'normal_balance',
            width: 110,
            render: (balance) => (
                <Tag color={balance === 'debit' ? 'blue' : 'green'}>
                    {balance.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Current Balance',
            dataIndex: 'current_balance',
            key: 'current_balance',
            width: 140,
            align: 'right',
            render: (balance) => `TZS ${parseFloat(balance).toLocaleString()}`,
        },
        {
            title: 'Status',
            dataIndex: 'is_active',
            key: 'is_active',
            width: 90,
            render: (isActive) => (
                <Tag color={isActive ? 'green' : 'red'}>
                    {isActive ? 'ACTIVE' : 'INACTIVE'}
                </Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 80,
            fixed: 'right',
            render: (_, record) => (
                <Dropdown
                    menu={{ items: getActionItems(record) }}
                    trigger={['click']}
                >
                    <Button type="text" icon={<MoreOutlined />} />
                </Dropdown>
            ),
        },
    ];

    return (
        <>
            <Head title="Chart of Accounts - Tabata Welfare Association" />
            <AdminSidebarLayout>
            {contextHolder}
            <Card>
                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <Space wrap>
                        <Input
                            placeholder="Search accounts..."
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            onPressEnter={handleSearch}
                            style={{ width: 250 }}
                            allowClear
                        />
                        <Select
                            placeholder="Type"
                            value={selectedType}
                            onChange={setSelectedType}
                            style={{ width: 130 }}
                            allowClear
                        >
                            {ACCOUNT_TYPES.map(type => (
                                <Select.Option key={type.value} value={type.value}>{type.label}</Select.Option>
                            ))}
                        </Select>
                        <Select
                            placeholder="Status"
                            value={selectedStatus}
                            onChange={setSelectedStatus}
                            style={{ width: 120 }}
                            allowClear
                        >
                            <Select.Option value="active">Active</Select.Option>
                            <Select.Option value="inactive">Inactive</Select.Option>
                        </Select>
                        <Button onClick={handleSearch} type="primary">
                            Search
                        </Button>
                        <Button onClick={handleReset}>
                            Reset
                        </Button>
                    </Space>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleCreate}
                    >
                        Add Account
                    </Button>
                </div>

                <Table
                    columns={columns}
                    dataSource={accounts.data}
                    rowKey="id"
                    pagination={{
                        current: accounts.current_page,
                        pageSize: accounts.per_page,
                        total: accounts.total,
                        showSizeChanger: false,
                        showTotal: (total) => `Total ${total} accounts`,
                        onChange: (page) => {
                            router.get('/admin-portal/chart-of-accounts', {
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
                                description="No accounts found"
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                            />
                        ),
                    }}
                    scroll={{ x: 1300 }}
                />
            </Card>

            <Modal
                title={editingAccount ? 'Edit Account' : 'Add New Account'}
                open={isModalOpen}
                onCancel={() => {
                    setIsModalOpen(false);
                    setEditingAccount(null);
                }}
                footer={null}
                width={700}
                styles={{
                    body: {
                        maxHeight: 'calc(100vh - 200px)',
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        paddingRight: '24px',
                    },
                }}
            >
                <AccountFormAnt
                    account={editingAccount}
                    parentAccounts={parentAccounts}
                    onSubmit={handleSubmit}
                    onCancel={() => {
                        setIsModalOpen(false);
                        setEditingAccount(null);
                    }}
                />
            </Modal>

            <Modal
                title="Delete Account"
                open={deleteModalOpen}
                onCancel={() => {
                    setDeleteModalOpen(false);
                    setAccountToDelete(null);
                    setDeleteConfirmText('');
                }}
                onOk={handleDeleteConfirm}
                okText="Delete"
                okButtonProps={{ 
                    danger: true,
                    disabled: deleteConfirmText !== accountToDelete?.account_name,
                }}
            >
                <p>Are you sure you want to delete "{accountToDelete?.account_name}"?</p>
                <p>Type the account name to confirm:</p>
                <Input
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    placeholder="Type account name here"
                />
            </Modal>
        </AdminSidebarLayout>
        </>
    );
}
