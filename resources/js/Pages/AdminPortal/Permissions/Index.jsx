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
    Modal, 
    Dropdown, 
    Typography,
    Empty,
    theme,
    message,
    Form,
    Badge,
} from 'antd';
import { 
    PlusOutlined, 
    SearchOutlined, 
    MoreOutlined,
    EditOutlined,
    DeleteOutlined,
    KeyOutlined,
} from '@ant-design/icons';

const { Text } = Typography;
const { TextArea } = Input;

export default function PermissionsIndex({ permissions, filters }) {
    const { token } = theme.useToken();
    const [messageApi, contextHolder] = message.useMessage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPermission, setEditingPermission] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [permissionToDelete, setPermissionToDelete] = useState(null);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');

    const [form] = Form.useForm();

    const [searchText, setSearchText] = useState(filters.search || '');

    const handleSearch = () => {
        router.get('/admin-portal/permissions', {
            search: searchText,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleReset = () => {
        setSearchText('');
        router.get('/admin-portal/permissions', {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleCreate = () => {
        setEditingPermission(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEdit = (permission) => {
        setEditingPermission(permission);
        form.setFieldsValue({
            name: permission.name,
            description: permission.description,
        });
        setIsModalOpen(true);
    };

    const handleSubmit = () => {
        form.validateFields().then(values => {
            if (editingPermission) {
                router.put(`/admin-portal/permissions/${editingPermission.id}`, values, {
                    preserveScroll: true,
                    onSuccess: () => {
                        setIsModalOpen(false);
                        setEditingPermission(null);
                        form.resetFields();
                        messageApi.success('Permission updated successfully');
                    },
                    onError: (errors) => {
                        const errorMessage = errors?.message || 'Failed to update permission';
                        messageApi.error(errorMessage);
                    },
                });
            } else {
                router.post('/admin-portal/permissions', values, {
                    preserveScroll: true,
                    onSuccess: () => {
                        setIsModalOpen(false);
                        form.resetFields();
                        messageApi.success('Permission created successfully');
                    },
                    onError: (errors) => {
                        const errorMessage = errors?.message || 'Failed to create permission';
                        messageApi.error(errorMessage);
                    },
                });
            }
        });
    };

    const handleDeleteClick = (permission) => {
        setPermissionToDelete(permission);
        setDeleteConfirmText('');
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (permissionToDelete) {
            router.delete(`/admin-portal/permissions/${permissionToDelete.id}`, {
                onSuccess: () => {
                    setDeleteModalOpen(false);
                    setPermissionToDelete(null);
                    setDeleteConfirmText('');
                    messageApi.success('Permission deleted successfully');
                },
                onError: (errors) => {
                    const errorMessage = errors?.message || 'Failed to delete permission';
                    messageApi.error(errorMessage);
                },
            });
        }
    };

    const getActionItems = (permission) => {
        return [
            {
                key: 'edit',
                label: 'Edit',
                icon: <EditOutlined />,
                onClick: () => handleEdit(permission),
            },
            {
                key: 'delete',
                label: 'Delete',
                icon: <DeleteOutlined />,
                danger: true,
                onClick: () => handleDeleteClick(permission),
            },
        ];
    };

    const columns = [
        {
            title: 'Permission Name',
            dataIndex: 'name',
            key: 'name',
            width: 220,
            render: (name) => (
                <Space>
                    <KeyOutlined style={{ fontSize: '14px' }} />
                    <Text strong style={{ fontSize: '13px' }}>{name}</Text>
                </Space>
            ),
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
            title: 'Assigned Roles',
            dataIndex: 'roles_count',
            key: 'roles_count',
            width: 130,
            align: 'center',
            render: (count) => (
                <Badge 
                    count={count} 
                    showZero 
                    style={{ backgroundColor: token.colorPrimary }}
                    overflowCount={999}
                />
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 70,
            fixed: 'right',
            render: (_, record) => (
                <Dropdown
                    menu={{ items: getActionItems(record) }}
                    trigger={['click']}
                >
                    <Button type="text" size="small" icon={<MoreOutlined />} />
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
                            placeholder="Search permissions..."
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            onPressEnter={handleSearch}
                            style={{ width: 250 }}
                            allowClear
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
                        Add Permission
                    </Button>
                </div>

                <Table
                    columns={columns}
                    dataSource={permissions.data}
                    rowKey="id"
                    size="small"
                    pagination={{
                        current: permissions.current_page,
                        pageSize: permissions.per_page,
                        total: permissions.total,
                        showSizeChanger: false,
                        showTotal: (total) => <span style={{ fontSize: '13px' }}>Total {total} permissions</span>,
                        onChange: (page) => {
                            router.get('/admin-portal/permissions', {
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
                                description="No permissions found"
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                            />
                        ),
                    }}
                />
            </Card>

            {/* Create/Edit Modal */}
            <Modal
                title={editingPermission ? 'Edit Permission' : 'Add New Permission'}
                open={isModalOpen}
                onCancel={() => {
                    setIsModalOpen(false);
                    setEditingPermission(null);
                    form.resetFields();
                }}
                onOk={handleSubmit}
                okText={editingPermission ? 'Update' : 'Create'}
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    style={{ marginTop: '24px' }}
                >
                    <Form.Item
                        label="Permission Name"
                        name="name"
                        rules={[
                            { required: true, message: 'Please enter permission name' },
                            { pattern: /^[a-z_]+$/, message: 'Use lowercase with underscores only (e.g., manage_users)' },
                        ]}
                        extra="Use lowercase letters and underscores only (e.g., manage_users)"
                    >
                        <Input placeholder="e.g., manage_users" />
                    </Form.Item>

                    <Form.Item
                        label="Description"
                        name="description"
                    >
                        <TextArea 
                            rows={3} 
                            placeholder="Brief description of this permission"
                        />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Delete Modal */}
            <Modal
                title="Delete Permission"
                open={deleteModalOpen}
                onCancel={() => {
                    setDeleteModalOpen(false);
                    setPermissionToDelete(null);
                    setDeleteConfirmText('');
                }}
                onOk={handleDeleteConfirm}
                okText="Delete"
                okButtonProps={{ 
                    danger: true,
                    disabled: deleteConfirmText !== permissionToDelete?.name,
                }}
            >
                <p>Are you sure you want to delete permission "{permissionToDelete?.name}"?</p>
                <p>Type the permission name to confirm:</p>
                <Input
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    placeholder="Type permission name here"
                />
            </Modal>
        </AdminSidebarLayout>
    );
}
