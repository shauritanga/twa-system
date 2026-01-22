import React, { useState } from 'react';
import AdminSidebarLayout from '@/Layouts/AdminSidebarLayout';
import { router } from '@inertiajs/react';
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
    Descriptions,
    DatePicker,
} from 'antd';
import { 
    PlusOutlined, 
    SearchOutlined, 
    MoreOutlined,
    EditOutlined,
    DeleteOutlined,
    CheckCircleOutlined,
    EyeOutlined,
    RollbackOutlined,
} from '@ant-design/icons';
import JournalEntryFormAnt from '@/Components/JournalEntryFormAnt';
import dayjs from 'dayjs';

const { Text } = Typography;
const { TextArea } = Input;

export default function JournalEntries({ entries, accounts, filters }) {
    const { token } = theme.useToken();
    const [messageApi, contextHolder] = message.useMessage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEntry, setEditingEntry] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [entryToDelete, setEntryToDelete] = useState(null);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [viewingEntry, setViewingEntry] = useState(null);
    const [reverseModalOpen, setReverseModalOpen] = useState(false);
    const [entryToReverse, setEntryToReverse] = useState(null);
    const [reversalReason, setReversalReason] = useState('');

    const [searchText, setSearchText] = useState(filters.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || null);
    const [dateFrom, setDateFrom] = useState(filters.date_from ? dayjs(filters.date_from) : null);
    const [dateTo, setDateTo] = useState(filters.date_to ? dayjs(filters.date_to) : null);

    const handleSearch = () => {
        router.get('/admin-portal/journal-entries', {
            search: searchText,
            status: selectedStatus,
            date_from: dateFrom ? dateFrom.format('YYYY-MM-DD') : null,
            date_to: dateTo ? dateTo.format('YYYY-MM-DD') : null,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleReset = () => {
        setSearchText('');
        setSelectedStatus(null);
        setDateFrom(null);
        setDateTo(null);
        router.get('/admin-portal/journal-entries', {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleCreate = () => {
        setEditingEntry(null);
        setIsModalOpen(true);
    };

    const handleEdit = (entry) => {
        setEditingEntry(entry);
        setIsModalOpen(true);
    };

    const handleView = (entry) => {
        setViewingEntry(entry);
        setViewModalOpen(true);
    };

    const handleSubmit = (values) => {
        if (editingEntry) {
            router.put(`/admin-portal/journal-entries/${editingEntry.id}`, values, {
                preserveScroll: true,
                onSuccess: () => {
                    setIsModalOpen(false);
                    setEditingEntry(null);
                    messageApi.success('Journal entry updated successfully');
                },
                onError: (errors) => {
                    console.error('Validation errors:', errors);
                    messageApi.error('Failed to update entry. Please check the form.');
                },
            });
        } else {
            router.post('/admin-portal/journal-entries', values, {
                preserveScroll: true,
                onSuccess: () => {
                    setIsModalOpen(false);
                    messageApi.success('Journal entry created successfully');
                },
                onError: (errors) => {
                    console.error('Validation errors:', errors);
                    messageApi.error('Failed to create entry. Please check the form.');
                },
            });
        }
    };

    const handleDeleteClick = (entry) => {
        setEntryToDelete(entry);
        setDeleteConfirmText('');
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (entryToDelete) {
            router.delete(`/admin-portal/journal-entries/${entryToDelete.id}`, {
                onSuccess: () => {
                    setDeleteModalOpen(false);
                    setEntryToDelete(null);
                    setDeleteConfirmText('');
                    messageApi.success('Journal entry deleted successfully');
                },
                onError: (errors) => {
                    const errorMessage = errors?.message || 'Failed to delete entry';
                    messageApi.error(errorMessage);
                },
            });
        }
    };

    const handlePost = (entry) => {
        router.post(`/admin-portal/journal-entries/${entry.id}/post`, {}, {
            onSuccess: () => {
                messageApi.success('Journal entry posted successfully');
            },
            onError: (errors) => {
                const errorMessage = errors?.message || 'Failed to post entry';
                messageApi.error(errorMessage);
            },
        });
    };

    const handleReverseClick = (entry) => {
        setEntryToReverse(entry);
        setReversalReason('');
        setReverseModalOpen(true);
    };

    const handleReverseConfirm = () => {
        if (entryToReverse && reversalReason) {
            router.post(`/admin-portal/journal-entries/${entryToReverse.id}/reverse`, {
                reversal_reason: reversalReason,
            }, {
                onSuccess: () => {
                    setReverseModalOpen(false);
                    setEntryToReverse(null);
                    setReversalReason('');
                    messageApi.success('Journal entry reversed successfully');
                },
                onError: (errors) => {
                    const errorMessage = errors?.message || 'Failed to reverse entry';
                    messageApi.error(errorMessage);
                },
            });
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            draft: 'default',
            posted: 'green',
            reversed: 'red',
        };
        return colors[status] || 'default';
    };

    const getStatusLabel = (status) => {
        const labels = {
            draft: 'Draft',
            posted: 'Posted',
            reversed: 'Reversed',
        };
        return labels[status] || status;
    };

    const getActionItems = (entry) => {
        const items = [];

        items.push({
            key: 'view',
            label: 'View Details',
            icon: <EyeOutlined />,
            onClick: () => handleView(entry),
        });

        if (entry.status === 'draft') {
            items.push({
                key: 'edit',
                label: 'Edit',
                icon: <EditOutlined />,
                onClick: () => handleEdit(entry),
            });

            items.push({
                key: 'post',
                label: 'Post Entry',
                icon: <CheckCircleOutlined />,
                onClick: () => handlePost(entry),
            });

            items.push({
                key: 'delete',
                label: 'Delete',
                icon: <DeleteOutlined />,
                danger: true,
                onClick: () => handleDeleteClick(entry),
            });
        }

        if (entry.status === 'posted') {
            items.push({
                key: 'reverse',
                label: 'Reverse Entry',
                icon: <RollbackOutlined />,
                danger: true,
                onClick: () => handleReverseClick(entry),
            });
        }

        return items;
    };

    const columns = [
        {
            title: 'Entry Number',
            dataIndex: 'entry_number',
            key: 'entry_number',
            width: 140,
        },
        {
            title: 'Date',
            dataIndex: 'entry_date',
            key: 'entry_date',
            width: 110,
            render: (date) => dayjs(date).format('MMM DD, YYYY'),
        },
        {
            title: 'Reference',
            dataIndex: 'reference',
            key: 'reference',
            width: 120,
            ellipsis: true,
            render: (ref) => ref || '-',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            width: 250,
            ellipsis: true,
        },
        {
            title: 'Total Debit',
            dataIndex: 'total_debit',
            key: 'total_debit',
            width: 130,
            align: 'right',
            render: (amount) => `TZS ${parseFloat(amount).toLocaleString()}`,
        },
        {
            title: 'Total Credit',
            dataIndex: 'total_credit',
            key: 'total_credit',
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
                    {getStatusLabel(status).toUpperCase()}
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
        <AdminSidebarLayout>
            {contextHolder}
            <Card>
                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <Space wrap>
                        <Input
                            placeholder="Search entries..."
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            onPressEnter={handleSearch}
                            style={{ width: 200 }}
                            allowClear
                        />
                        <Select
                            placeholder="Status"
                            value={selectedStatus}
                            onChange={setSelectedStatus}
                            style={{ width: 120 }}
                            allowClear
                        >
                            <Select.Option value="draft">Draft</Select.Option>
                            <Select.Option value="posted">Posted</Select.Option>
                            <Select.Option value="reversed">Reversed</Select.Option>
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
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleCreate}
                    >
                        New Entry
                    </Button>
                </div>

                <Table
                    columns={columns}
                    dataSource={entries.data}
                    rowKey="id"
                    pagination={{
                        current: entries.current_page,
                        pageSize: entries.per_page,
                        total: entries.total,
                        showSizeChanger: false,
                        showTotal: (total) => `Total ${total} entries`,
                        onChange: (page) => {
                            router.get('/admin-portal/journal-entries', {
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
                                description="No journal entries found"
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                            />
                        ),
                    }}
                    scroll={{ x: 1200 }}
                />
            </Card>

            {/* Create/Edit Modal */}
            <Modal
                title={editingEntry ? 'Edit Journal Entry' : 'New Journal Entry'}
                open={isModalOpen}
                onCancel={() => {
                    setIsModalOpen(false);
                    setEditingEntry(null);
                }}
                footer={null}
                width={1000}
                styles={{
                    body: {
                        maxHeight: 'calc(100vh - 200px)',
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        paddingRight: '24px',
                    },
                }}
            >
                <JournalEntryFormAnt
                    entry={editingEntry}
                    accounts={accounts}
                    onSubmit={handleSubmit}
                    onCancel={() => {
                        setIsModalOpen(false);
                        setEditingEntry(null);
                    }}
                />
            </Modal>

            {/* View Modal */}
            <Modal
                title="Journal Entry Details"
                open={viewModalOpen}
                onCancel={() => {
                    setViewModalOpen(false);
                    setViewingEntry(null);
                }}
                footer={null}
                width={900}
            >
                {viewingEntry && (
                    <div>
                        <Descriptions bordered column={2} size="small">
                            <Descriptions.Item label="Entry Number">{viewingEntry.entry_number}</Descriptions.Item>
                            <Descriptions.Item label="Date">{dayjs(viewingEntry.entry_date).format('MMM DD, YYYY')}</Descriptions.Item>
                            <Descriptions.Item label="Reference">{viewingEntry.reference || '-'}</Descriptions.Item>
                            <Descriptions.Item label="Status">
                                <Tag color={getStatusColor(viewingEntry.status)}>
                                    {getStatusLabel(viewingEntry.status).toUpperCase()}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Description" span={2}>{viewingEntry.description}</Descriptions.Item>
                        </Descriptions>

                        <div style={{ marginTop: '16px' }}>
                            <strong>Entry Lines:</strong>
                            <Table
                                dataSource={viewingEntry.lines}
                                rowKey="id"
                                pagination={false}
                                size="small"
                                style={{ marginTop: '8px' }}
                                columns={[
                                    {
                                        title: 'Account',
                                        dataIndex: 'account',
                                        key: 'account',
                                        render: (account) => `${account.account_code} - ${account.account_name}`,
                                    },
                                    {
                                        title: 'Description',
                                        dataIndex: 'description',
                                        key: 'description',
                                        render: (desc) => desc || '-',
                                    },
                                    {
                                        title: 'Debit',
                                        dataIndex: 'debit',
                                        key: 'debit',
                                        align: 'right',
                                        render: (amount) => amount > 0 ? `TZS ${parseFloat(amount).toLocaleString()}` : '-',
                                    },
                                    {
                                        title: 'Credit',
                                        dataIndex: 'credit',
                                        key: 'credit',
                                        align: 'right',
                                        render: (amount) => amount > 0 ? `TZS ${parseFloat(amount).toLocaleString()}` : '-',
                                    },
                                ]}
                                footer={() => (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                                        <span>Total:</span>
                                        <div style={{ display: 'flex', gap: '80px' }}>
                                            <span>TZS {parseFloat(viewingEntry.total_debit).toLocaleString()}</span>
                                            <span>TZS {parseFloat(viewingEntry.total_credit).toLocaleString()}</span>
                                        </div>
                                    </div>
                                )}
                            />
                        </div>

                        {viewingEntry.status === 'reversed' && (
                            <div style={{ marginTop: '16px', padding: '12px', backgroundColor: token.colorErrorBg, borderRadius: '4px' }}>
                                <strong>Reversal Information:</strong>
                                <p style={{ margin: '8px 0 0 0' }}>{viewingEntry.reversal_reason}</p>
                                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: token.colorTextSecondary }}>
                                    Reversed on {dayjs(viewingEntry.reversed_at).format('MMM DD, YYYY HH:mm')}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </Modal>

            {/* Delete Modal */}
            <Modal
                title="Delete Journal Entry"
                open={deleteModalOpen}
                onCancel={() => {
                    setDeleteModalOpen(false);
                    setEntryToDelete(null);
                    setDeleteConfirmText('');
                }}
                onOk={handleDeleteConfirm}
                okText="Delete"
                okButtonProps={{ 
                    danger: true,
                    disabled: deleteConfirmText !== entryToDelete?.entry_number,
                }}
            >
                <p>Are you sure you want to delete entry "{entryToDelete?.entry_number}"?</p>
                <p>Type the entry number to confirm:</p>
                <Input
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    placeholder="Type entry number here"
                />
            </Modal>

            {/* Reverse Modal */}
            <Modal
                title="Reverse Journal Entry"
                open={reverseModalOpen}
                onCancel={() => {
                    setReverseModalOpen(false);
                    setEntryToReverse(null);
                    setReversalReason('');
                }}
                onOk={handleReverseConfirm}
                okText="Reverse Entry"
                okButtonProps={{ 
                    danger: true,
                    disabled: !reversalReason,
                }}
            >
                <p>Are you sure you want to reverse entry "{entryToReverse?.entry_number}"?</p>
                <p>This will reverse all account balance changes. Please provide a reason:</p>
                <TextArea
                    value={reversalReason}
                    onChange={(e) => setReversalReason(e.target.value)}
                    placeholder="Reason for reversal"
                    rows={3}
                    required
                />
            </Modal>
        </AdminSidebarLayout>
    );
}
