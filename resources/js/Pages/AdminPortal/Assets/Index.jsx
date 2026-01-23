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
    Image,
} from 'antd';
import { 
    PlusOutlined, 
    SearchOutlined, 
    MoreOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
} from '@ant-design/icons';
import AssetFormAnt from '@/Components/AssetFormAnt';

const { Text } = Typography;

const ASSET_CATEGORIES = [
    'Land',
    'Buildings',
    'Vehicles',
    'Equipment',
    'Furniture',
    'Electronics',
    'Computers',
    'Software',
    'Tools',
    'Other',
];

const ASSET_CONDITIONS = [
    'Excellent',
    'Good',
    'Fair',
    'Poor',
    'Needs Repair',
];

export default function AssetsIndex({ assets, filters }) {
    const { token } = theme.useToken();
    const [messageApi, contextHolder] = message.useMessage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAsset, setEditingAsset] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [assetToDelete, setAssetToDelete] = useState(null);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');

    const [searchText, setSearchText] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || null);
    const [selectedStatus, setSelectedStatus] = useState(filters.status || null);
    const [selectedCondition, setSelectedCondition] = useState(filters.condition || null);

    const handleSearch = () => {
        router.get('/admin-portal/assets', {
            search: searchText,
            category: selectedCategory,
            status: selectedStatus,
            condition: selectedCondition,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleReset = () => {
        setSearchText('');
        setSelectedCategory(null);
        setSelectedStatus(null);
        setSelectedCondition(null);
        router.get('/admin-portal/assets', {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleCreate = () => {
        setEditingAsset(null);
        setIsModalOpen(true);
    };

    const handleEdit = (asset) => {
        setEditingAsset(asset);
        setIsModalOpen(true);
    };

    const handleSubmit = (formData) => {
        if (editingAsset) {
            router.post(`/admin-portal/assets/${editingAsset.id}`, formData, {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => {
                    setIsModalOpen(false);
                    setEditingAsset(null);
                    messageApi.success('Asset updated successfully');
                },
                onError: (errors) => {
                    console.error('Validation errors:', errors);
                    messageApi.error('Failed to update asset. Please check the form.');
                },
            });
        } else {
            router.post('/admin-portal/assets', formData, {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => {
                    setIsModalOpen(false);
                    messageApi.success('Asset created successfully');
                },
                onError: (errors) => {
                    console.error('Validation errors:', errors);
                    messageApi.error('Failed to create asset. Please check the form.');
                },
            });
        }
    };

    const handleDeleteClick = (asset) => {
        setAssetToDelete(asset);
        setDeleteConfirmText('');
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (assetToDelete) {
            router.delete(`/admin-portal/assets/${assetToDelete.id}`, {
                onSuccess: () => {
                    setDeleteModalOpen(false);
                    setAssetToDelete(null);
                    setDeleteConfirmText('');
                    messageApi.success('Asset deleted successfully');
                },
                onError: () => {
                    messageApi.error('Failed to delete asset');
                },
            });
        }
    };

    const handleStatusChange = (asset, newStatus) => {
        router.post(`/admin-portal/assets/${asset.id}/update-status`, {
            status: newStatus,
        }, {
            onSuccess: () => {
                messageApi.success('Asset status updated successfully');
            },
            onError: () => {
                messageApi.error('Failed to update asset status');
            },
        });
    };

    const getStatusColor = (status) => {
        const colors = {
            active: 'green',
            under_maintenance: 'orange',
            disposed: 'red',
            sold: 'blue',
        };
        return colors[status] || 'default';
    };

    const getStatusLabel = (status) => {
        const labels = {
            active: 'Active',
            under_maintenance: 'Under Maintenance',
            disposed: 'Disposed',
            sold: 'Sold',
        };
        return labels[status] || status;
    };

    const getActionItems = (asset) => {
        const items = [
            {
                key: 'edit',
                label: 'Edit',
                icon: <EditOutlined />,
                onClick: () => handleEdit(asset),
            },
        ];

        if (asset.photo_path) {
            items.push({
                key: 'view-photo',
                label: 'View Photo',
                icon: <EyeOutlined />,
                onClick: () => window.open(`/storage/${asset.photo_path}`, '_blank'),
            });
        }

        // Status change options
        if (asset.status !== 'active') {
            items.push({
                key: 'mark-active',
                label: 'Mark as Active',
                onClick: () => handleStatusChange(asset, 'active'),
            });
        }
        if (asset.status !== 'under_maintenance') {
            items.push({
                key: 'mark-maintenance',
                label: 'Mark as Under Maintenance',
                onClick: () => handleStatusChange(asset, 'under_maintenance'),
            });
        }
        if (asset.status !== 'disposed') {
            items.push({
                key: 'mark-disposed',
                label: 'Mark as Disposed',
                onClick: () => handleStatusChange(asset, 'disposed'),
            });
        }
        if (asset.status !== 'sold') {
            items.push({
                key: 'mark-sold',
                label: 'Mark as Sold',
                onClick: () => handleStatusChange(asset, 'sold'),
            });
        }

        items.push({
            key: 'delete',
            label: 'Delete',
            icon: <DeleteOutlined />,
            danger: true,
            onClick: () => handleDeleteClick(asset),
        });

        return items;
    };

    const columns = [
        {
            title: 'Asset Code',
            dataIndex: 'asset_code',
            key: 'asset_code',
            width: 110,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: 180,
            ellipsis: true,
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            width: 120,
        },
        {
            title: 'Location',
            dataIndex: 'location',
            key: 'location',
            width: 130,
            ellipsis: true,
            render: (location) => location || '-',
        },
        {
            title: 'Purchase Cost',
            dataIndex: 'purchase_cost',
            key: 'purchase_cost',
            width: 130,
            align: 'right',
            render: (cost) => `TZS ${parseFloat(cost).toLocaleString()}`,
        },
        {
            title: 'Current Value',
            dataIndex: 'current_value',
            key: 'current_value',
            width: 130,
            align: 'right',
            render: (value) => value ? `TZS ${parseFloat(value).toLocaleString()}` : '-',
        },
        {
            title: 'Condition',
            dataIndex: 'condition',
            key: 'condition',
            width: 110,
            render: (condition) => condition || '-',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 130,
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
        <>
            <Head title="Assets Management - Tabata Welfare Association" />
            <AdminSidebarLayout>
            {contextHolder}
            <Card>
                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <Space wrap>
                        <Input
                            placeholder="Search assets..."
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
                            style={{ width: 130 }}
                            allowClear
                        >
                            {ASSET_CATEGORIES.map(cat => (
                                <Select.Option key={cat} value={cat}>{cat}</Select.Option>
                            ))}
                        </Select>
                        <Select
                            placeholder="Status"
                            value={selectedStatus}
                            onChange={setSelectedStatus}
                            style={{ width: 150 }}
                            allowClear
                        >
                            <Select.Option value="active">Active</Select.Option>
                            <Select.Option value="under_maintenance">Under Maintenance</Select.Option>
                            <Select.Option value="disposed">Disposed</Select.Option>
                            <Select.Option value="sold">Sold</Select.Option>
                        </Select>
                        <Select
                            placeholder="Condition"
                            value={selectedCondition}
                            onChange={setSelectedCondition}
                            style={{ width: 130 }}
                            allowClear
                        >
                            {ASSET_CONDITIONS.map(cond => (
                                <Select.Option key={cond} value={cond}>{cond}</Select.Option>
                            ))}
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
                        Add Asset
                    </Button>
                </div>

                <Table
                    columns={columns}
                    dataSource={assets.data}
                    rowKey="id"
                    pagination={{
                        current: assets.current_page,
                        pageSize: assets.per_page,
                        total: assets.total,
                        showSizeChanger: false,
                        showTotal: (total) => `Total ${total} assets`,
                        onChange: (page) => {
                            router.get('/admin-portal/assets', {
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
                                description="No assets found"
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                            />
                        ),
                    }}
                    scroll={{ x: 1200 }}
                />
            </Card>

            <Modal
                title={editingAsset ? 'Edit Asset' : 'Add New Asset'}
                open={isModalOpen}
                onCancel={() => {
                    setIsModalOpen(false);
                    setEditingAsset(null);
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
                <AssetFormAnt
                    asset={editingAsset}
                    onSubmit={handleSubmit}
                    onCancel={() => {
                        setIsModalOpen(false);
                        setEditingAsset(null);
                    }}
                />
            </Modal>

            <Modal
                title="Delete Asset"
                open={deleteModalOpen}
                onCancel={() => {
                    setDeleteModalOpen(false);
                    setAssetToDelete(null);
                    setDeleteConfirmText('');
                }}
                onOk={handleDeleteConfirm}
                okText="Delete"
                okButtonProps={{ 
                    danger: true,
                    disabled: deleteConfirmText !== assetToDelete?.name,
                }}
            >
                <p>Are you sure you want to delete "{assetToDelete?.name}"?</p>
                <p>Type the asset name to confirm:</p>
                <Input
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    placeholder="Type asset name here"
                />
            </Modal>
        </AdminSidebarLayout>
        </>
    );
}
