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
    Modal, 
    Dropdown, 
    Typography,
    Empty,
    theme,
    message,
    Form,
    Select,
    Badge,
    Tooltip,
} from 'antd';
import { 
    PlusOutlined, 
    SearchOutlined, 
    MoreOutlined,
    EditOutlined,
    DeleteOutlined,
    SafetyOutlined,
    UserOutlined,
    KeyOutlined,
    EyeOutlined,
} from '@ant-design/icons';

const { Text } = Typography;
const { TextArea } = Input;

export default function RolesIndex({ roles, allPermissions, filters }) {
    const { token } = theme.useToken();
    const [messageApi, contextHolder] = message.useMessage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState(null);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');
    const [permissionsModalOpen, setPermissionsModalOpen] = useState(false);
    const [roleForPermissions, setRoleForPermissions] = useState(null);
    const [selectedPermissions, setSelectedPermissions] = useState([]);

    const [form] = Form.useForm();
    const [permissionsForm] = Form.useForm();

    const [searchText, setSearchText] = useState(filters.search || '');

    const handleSearch = () => {
        router.get('/admin-portal/roles', {
            search: searchText,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleReset = () => {
        setSearchText('');
        router.get('/admin-portal/roles', {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleCreate = () => {
        setEditingRole(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEdit = (role) => {
        setEditingRole(role);
        form.setFieldsValue({
            name: role.name,
            description: role.description,
        });
        setIsModalOpen(true);
    };

    const handleSubmit = () => {
        form.validateFields().then(values => {
            if (editingRole) {
                router.put(`/admin-portal/roles/${editingRole.id}`, values, {
                    preserveScroll: true,
                    onSuccess: () => {
                        setIsModalOpen(false);
                        setEditingRole(null);
                        form.resetFields();
                        messageApi.success('Role updated successfully');
                    },
                    onError: (errors) => {
                        const errorMessage = errors?.message || 'Failed to update role';
                        messageApi.error(errorMessage);
                    },
                });
            } else {
                router.post('/admin-portal/roles', values, {
                    preserveScroll: true,
                    onSuccess: () => {
                        setIsModalOpen(false);
                        form.resetFields();
                        messageApi.success('Role created successfully');
                    },
                    onError: (errors) => {
                        const errorMessage = errors?.message || 'Failed to create role';
                        messageApi.error(errorMessage);
                    },
                });
            }
        });
    };

    const handleDeleteClick = (role) => {
        setRoleToDelete(role);
        setDeleteConfirmText('');
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (roleToDelete) {
            router.delete(`/admin-portal/roles/${roleToDelete.id}`, {
                onSuccess: () => {
                    setDeleteModalOpen(false);
                    setRoleToDelete(null);
                    setDeleteConfirmText('');
                    messageApi.success('Role deleted successfully');
                },
                onError: (errors) => {
                    const errorMessage = errors?.message || 'Failed to delete role';
                    messageApi.error(errorMessage);
                },
            });
        }
    };

    const handleManagePermissions = (role) => {
        // Fetch role's current permissions via API
        console.log('Fetching permissions for role:', role.id);
        window.axios.get(`/admin-portal/roles/${role.id}/permissions`)
            .then(response => {
                console.log('Response received:', response);
                const { role: roleData, permissions: permissionIds } = response.data;
                setRoleForPermissions(roleData);
                setSelectedPermissions(permissionIds);
                permissionsForm.setFieldsValue({
                    permissions: permissionIds,
                });
                setPermissionsModalOpen(true);
            })
            .catch(error => {
                console.error('Full error object:', error);
                console.error('Error response:', error.response);
                console.error('Error message:', error.message);
                messageApi.error('Failed to load role permissions');
            });
    };

    const handlePermissionsSubmit = () => {
        permissionsForm.validateFields().then(values => {
            router.post(`/admin-portal/roles/${roleForPermissions.id}/sync-permissions`, values, {
                preserveScroll: true,
                onSuccess: () => {
                    setPermissionsModalOpen(false);
                    setRoleForPermissions(null);
                    permissionsForm.resetFields();
                    messageApi.success('Permissions updated successfully');
                },
                onError: (errors) => {
                    const errorMessage = errors?.message || 'Failed to update permissions';
                    messageApi.error(errorMessage);
                },
            });
        });
    };



    const isSystemRole = (roleName) => {
        return ['admin', 'secretary', 'member'].includes(roleName);
    };

    const getActionItems = (role) => {
        const items = [
            {
                key: 'permissions',
                label: 'Manage Permissions',
                icon: <KeyOutlined />,
                onClick: () => handleManagePermissions(role),
            },
        ];

        if (!isSystemRole(role.name)) {
            items.push({
                key: 'edit',
                label: 'Edit',
                icon: <EditOutlined />,
                onClick: () => handleEdit(role),
            });

            items.push({
                key: 'delete',
                label: 'Delete',
                icon: <DeleteOutlined />,
                danger: true,
                onClick: () => handleDeleteClick(role),
            });
        }

        return items;
    };

    const columns = [
        {
            title: 'Role Name',
            dataIndex: 'name',
            key: 'name',
            width: 180,
            render: (name) => (
                <Space>
                    <SafetyOutlined style={{ fontSize: '14px' }} />
                    <Text strong style={{ fontSize: '13px' }}>{name}</Text>
                    {isSystemRole(name) && (
                        <Tag color="gold" style={{ fontSize: '10px' }}>SYSTEM</Tag>
                    )}
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
            title: 'Users',
            dataIndex: 'users_count',
            key: 'users_count',
            width: 100,
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
            title: 'Permissions',
            dataIndex: 'permissions_count',
            key: 'permissions_count',
            width: 120,
            align: 'center',
            render: (count) => (
                <Badge 
                    count={count} 
                    showZero 
                    style={{ backgroundColor: token.colorSuccess }}
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
        <>
            <Head title="Roles & Permissions - Tabata Welfare Association" />
            <AdminSidebarLayout>
            {contextHolder}
            <Card>
                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <Space wrap>
                        <Input
                            placeholder="Search roles..."
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
                        Add Role
                    </Button>
                </div>

                <Table
                    columns={columns}
                    dataSource={roles.data}
                    rowKey="id"
                    size="small"
                    pagination={{
                        current: roles.current_page,
                        pageSize: roles.per_page,
                        total: roles.total,
                        showSizeChanger: false,
                        showTotal: (total) => <span style={{ fontSize: '13px' }}>Total {total} roles</span>,
                        onChange: (page) => {
                            router.get('/admin-portal/roles', {
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
                                description="No roles found"
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                            />
                        ),
                    }}
                />
            </Card>

            {/* Create/Edit Modal */}
            <Modal
                title={editingRole ? 'Edit Role' : 'Add New Role'}
                open={isModalOpen}
                onCancel={() => {
                    setIsModalOpen(false);
                    setEditingRole(null);
                    form.resetFields();
                }}
                onOk={handleSubmit}
                okText={editingRole ? 'Update' : 'Create'}
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    style={{ marginTop: '24px' }}
                >
                    <Form.Item
                        label="Role Name"
                        name="name"
                        rules={[
                            { required: true, message: 'Please enter role name' },
                            { pattern: /^[a-z_]+$/, message: 'Use lowercase with underscores only (e.g., custom_role)' },
                        ]}
                        extra="Use lowercase letters and underscores only (e.g., custom_role)"
                    >
                        <Input placeholder="e.g., custom_role" />
                    </Form.Item>

                    <Form.Item
                        label="Description"
                        name="description"
                    >
                        <TextArea 
                            rows={3} 
                            placeholder="Brief description of this role"
                        />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Delete Modal */}
            <Modal
                title="Delete Role"
                open={deleteModalOpen}
                onCancel={() => {
                    setDeleteModalOpen(false);
                    setRoleToDelete(null);
                    setDeleteConfirmText('');
                }}
                onOk={handleDeleteConfirm}
                okText="Delete"
                okButtonProps={{ 
                    danger: true,
                    disabled: deleteConfirmText !== roleToDelete?.name,
                }}
            >
                <p>Are you sure you want to delete role "{roleToDelete?.name}"?</p>
                <p>Type the role name to confirm:</p>
                <Input
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    placeholder="Type role name here"
                />
            </Modal>

            {/* Manage Permissions Modal */}
            <Modal
                title={`Manage Permissions: ${roleForPermissions?.name || ''}`}
                open={permissionsModalOpen}
                onCancel={() => {
                    setPermissionsModalOpen(false);
                    setRoleForPermissions(null);
                    permissionsForm.resetFields();
                }}
                onOk={handlePermissionsSubmit}
                okText="Update Permissions"
                width={700}
                styles={{
                    body: {
                        maxHeight: 'calc(100vh - 250px)',
                        overflowY: 'auto',
                    },
                }}
            >
                <Form
                    form={permissionsForm}
                    layout="vertical"
                    style={{ marginTop: '24px' }}
                >
                    <Form.Item
                        label={`Select Permissions (${selectedPermissions.length} selected)`}
                        name="permissions"
                        rules={[{ required: true, message: 'Please select at least one permission' }]}
                    >
                        <Select
                            mode="multiple"
                            placeholder="Select permissions"
                            style={{ width: '100%' }}
                            onChange={setSelectedPermissions}
                            optionFilterProp="children"
                            showSearch
                        >
                            {allPermissions.map(permission => (
                                <Select.Option key={permission.id} value={permission.id}>
                                    <Space>
                                        <KeyOutlined style={{ fontSize: '12px' }} />
                                        <span>{permission.name}</span>
                                        {permission.description && (
                                            <Text type="secondary" style={{ fontSize: '11px' }}>
                                                - {permission.description}
                                            </Text>
                                        )}
                                    </Space>
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

        </AdminSidebarLayout>
        </>
    );
}
