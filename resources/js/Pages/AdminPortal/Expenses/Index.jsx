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
    DatePicker, 
    Modal, 
    Dropdown, 
    Typography,
    Empty,
    theme,
    Popconfirm,
    message,
} from 'antd';
import { 
    PlusOutlined, 
    SearchOutlined, 
    MoreOutlined,
    EditOutlined,
    DeleteOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    DollarOutlined,
    DownloadOutlined,
} from '@ant-design/icons';
import ExpenseFormAnt from '@/Components/ExpenseFormAnt';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Text } = Typography;

const EXPENSE_CATEGORIES = [
    'Utilities',
    'Maintenance',
    'Events',
    'Salaries',
    'Office Supplies',
    'Transportation',
    'Communication',
    'Insurance',
    'Legal & Professional',
    'Marketing',
    'Training',
    'Other',
];

function ExpensesIndex({ expenses, filters }) {
    // Ant Design hooks
    const { token } = theme.useToken();
    const [messageApi, contextHolder] = message.useMessage();
    
    // Component state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [expenseToDelete, setExpenseToDelete] = useState(null);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');

    // Filter state
    const [searchText, setSearchText] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || null);
    const [selectedStatus, setSelectedStatus] = useState(filters.status || null);
    const [dateRange, setDateRange] = useState(
        filters.start_date && filters.end_date 
            ? [dayjs(filters.start_date), dayjs(filters.end_date)]
            : null
    );

    const handleSearch = () => {
        router.get('/admin-portal/expenses', {
            search: searchText,
            category: selectedCategory,
            status: selectedStatus,
            start_date: dateRange?.[0]?.format('YYYY-MM-DD'),
            end_date: dateRange?.[1]?.format('YYYY-MM-DD'),
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleReset = () => {
        setSearchText('');
        setSelectedCategory(null);
        setSelectedStatus(null);
        setDateRange(null);
        router.get('/admin-portal/expenses', {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleCreate = () => {
        setEditingExpense(null);
        setIsModalOpen(true);
    };

    const handleEdit = (expense) => {
        setEditingExpense(expense);
        setIsModalOpen(true);
    };

    const handleSubmit = (formData) => {
        if (editingExpense) {
            router.post(`/admin-portal/expenses/${editingExpense.id}`, formData, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    setEditingExpense(null);
                    messageApi.success('Expense updated successfully');
                },
                onError: () => {
                    messageApi.error('Failed to update expense');
                },
            });
        } else {
            router.post('/admin-portal/expenses', formData, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    messageApi.success('Expense created successfully');
                },
                onError: () => {
                    messageApi.error('Failed to create expense');
                },
            });
        }
    };

    const handleDeleteClick = (expense) => {
        setExpenseToDelete(expense);
        setDeleteConfirmText('');
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (expenseToDelete) {
            router.delete(`/admin-portal/expenses/${expenseToDelete.id}`, {
                onSuccess: () => {
                    setDeleteModalOpen(false);
                    setExpenseToDelete(null);
                    setDeleteConfirmText('');
                    messageApi.success('Expense deleted successfully');
                },
                onError: () => {
                    messageApi.error('Failed to delete expense');
                },
            });
        }
    };

    const handleApprove = (expense) => {
        router.post(`/admin-portal/expenses/${expense.id}/approve`, {}, {
            onSuccess: () => {
                messageApi.success('Expense approved successfully');
            },
            onError: () => {
                messageApi.error('Failed to approve expense');
            },
        });
    };

    const handleReject = (expense) => {
        router.post(`/admin-portal/expenses/${expense.id}/reject`, {}, {
            onSuccess: () => {
                messageApi.success('Expense rejected successfully');
            },
            onError: () => {
                messageApi.error('Failed to reject expense');
            },
        });
    };

    const handleMarkAsPaid = (expense) => {
        router.post(`/admin-portal/expenses/${expense.id}/mark-as-paid`, {}, {
            onSuccess: () => {
                messageApi.success('Expense marked as paid successfully');
            },
            onError: () => {
                messageApi.error('Failed to mark expense as paid');
            },
        });
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'orange',
            approved: 'blue',
            paid: 'green',
            rejected: 'red',
        };
        return colors[status] || 'default';
    };

    const getActionItems = (expense) => {
        const items = [
            {
                key: 'edit',
                label: 'Edit',
                icon: <EditOutlined />,
                onClick: () => handleEdit(expense),
            },
        ];

        if (expense.status === 'pending') {
            items.push(
                {
                    key: 'approve',
                    label: 'Approve',
                    icon: <CheckCircleOutlined />,
                    onClick: () => handleApprove(expense),
                },
                {
                    key: 'reject',
                    label: 'Reject',
                    icon: <CloseCircleOutlined />,
                    onClick: () => handleReject(expense),
                }
            );
        }

        if (expense.status === 'approved') {
            items.push({
                key: 'mark-paid',
                label: 'Mark as Paid',
                icon: <DollarOutlined />,
                onClick: () => handleMarkAsPaid(expense),
            });
        }

        if (expense.receipt_path) {
            items.push({
                key: 'download',
                label: 'Download Receipt',
                icon: <DownloadOutlined />,
                onClick: () => window.open(`/storage/${expense.receipt_path}`, '_blank'),
            });
        }

        items.push({
            key: 'delete',
            label: 'Delete',
            icon: <DeleteOutlined />,
            danger: true,
            onClick: () => handleDeleteClick(expense),
        });

        return items;
    };

    const columns = [
        {
            title: 'Date',
            dataIndex: 'expense_date',
            key: 'expense_date',
            width: 110,
            render: (date) => dayjs(date).format('MMM DD, YYYY'),
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            width: 200,
            ellipsis: true,
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            width: 130,
        },
        {
            title: 'Vendor',
            dataIndex: 'vendor',
            key: 'vendor',
            width: 130,
            ellipsis: true,
            render: (vendor) => vendor || '-',
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            width: 130,
            align: 'right',
            render: (amount) => `TZS ${parseFloat(amount).toLocaleString()}`,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status) => (
                <Tag color={getStatusColor(status)}>
                    {status.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Created By',
            dataIndex: 'creator',
            key: 'creator',
            width: 130,
            ellipsis: true,
            render: (creator) => creator?.name || '-',
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
            <Head title="Expenses Management - Tabata Welfare Association" />
            <AdminSidebarLayout>
            {contextHolder}
            <Card>
                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <Space wrap>
                        <Input
                            placeholder="Search expenses..."
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            onPressEnter={handleSearch}
                            style={{ width: 250 }}
                            allowClear
                        />
                        <Select
                            placeholder="Category"
                            value={selectedCategory}
                            onChange={setSelectedCategory}
                            style={{ width: 150 }}
                            allowClear
                        >
                            {EXPENSE_CATEGORIES.map(cat => (
                                <Select.Option key={cat} value={cat}>{cat}</Select.Option>
                            ))}
                        </Select>
                        <Select
                            placeholder="Status"
                            value={selectedStatus}
                            onChange={setSelectedStatus}
                            style={{ width: 120 }}
                            allowClear
                        >
                            <Select.Option value="pending">Pending</Select.Option>
                            <Select.Option value="approved">Approved</Select.Option>
                            <Select.Option value="paid">Paid</Select.Option>
                            <Select.Option value="rejected">Rejected</Select.Option>
                        </Select>
                        <RangePicker
                            value={dateRange}
                            onChange={setDateRange}
                            format="YYYY-MM-DD"
                        />
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
                        Add Expense
                    </Button>
                </div>

                <Table
                    columns={columns}
                    dataSource={expenses.data}
                    rowKey="id"
                    pagination={{
                        current: expenses.current_page,
                        pageSize: expenses.per_page,
                        total: expenses.total,
                        showSizeChanger: false,
                        showTotal: (total) => `Total ${total} expenses`,
                        onChange: (page) => {
                            router.get('/admin-portal/expenses', {
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
                                description="No expenses found"
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                            />
                        ),
                    }}
                    scroll={{ x: 1100 }}
                />
            </Card>

            <Modal
                title={editingExpense ? 'Edit Expense' : 'Add New Expense'}
                open={isModalOpen}
                onCancel={() => {
                    setIsModalOpen(false);
                    setEditingExpense(null);
                }}
                footer={null}
                width={800}
                styles={{
                    body: {
                        maxHeight: 'calc(100vh - 200px)',
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        paddingRight: '24px',
                    },
                }}
            >
                <ExpenseFormAnt
                    expense={editingExpense}
                    onSubmit={handleSubmit}
                    onCancel={() => {
                        setIsModalOpen(false);
                        setEditingExpense(null);
                    }}
                />
            </Modal>

            <Modal
                title="Delete Expense"
                open={deleteModalOpen}
                onCancel={() => {
                    setDeleteModalOpen(false);
                    setExpenseToDelete(null);
                    setDeleteConfirmText('');
                }}
                onOk={handleDeleteConfirm}
                okText="Delete"
                okButtonProps={{ 
                    danger: true,
                    disabled: deleteConfirmText !== expenseToDelete?.title,
                }}
            >
                <p>Are you sure you want to delete "{expenseToDelete?.title}"?</p>
                <p>Type the expense title to confirm:</p>
                <Input
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    placeholder="Type expense title here"
                />
            </Modal>
        </AdminSidebarLayout>
        </>
    );
}

export default ExpensesIndex;
