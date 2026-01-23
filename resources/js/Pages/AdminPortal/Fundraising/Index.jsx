import React, { useState, useEffect } from 'react';
import AdminSidebarLayout from '../../../Layouts/AdminSidebarLayout';
import { usePage, router, Head } from '@inertiajs/react';
import {
    Card,
    Row,
    Col,
    Table,
    Button,
    Input,
    Space,
    Modal,
    Tag,
    Empty,
    theme,
    message,
    Select,
    Dropdown,
    Progress,
    Badge,
} from 'antd';
import {
    PlusOutlined,
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
    SearchOutlined,
    MoreOutlined,
    StarOutlined,
    DollarOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import FundraisingFormAnt from '../../../Components/FundraisingFormAnt';

export default function FundraisingIndex() {
    const { 
        campaigns = { data: [] }, 
        filters = {},
        statuses = {},
        flash = {}
    } = usePage().props;
    
    const { token } = theme.useToken();
    const [searchText, setSearchText] = useState(filters.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');
    const [showCampaignForm, setShowCampaignForm] = useState(false);
    const [editingCampaign, setEditingCampaign] = useState(null);
    const [deleteConfirmModal, setDeleteConfirmModal] = useState(false);
    const [campaignToDelete, setCampaignToDelete] = useState(null);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');

    useEffect(() => {
        if (flash?.success) {
            message.success(flash.success);
        }
        if (flash?.error) {
            message.error(flash.error);
        }
    }, [flash]);

    const openCampaignForm = (campaign = null) => {
        setEditingCampaign(campaign);
        setShowCampaignForm(true);
    };

    const closeCampaignForm = () => {
        setShowCampaignForm(false);
        setEditingCampaign(null);
    };

    const handleSearch = () => {
        router.get(route('admin-portal.fundraising.index'), {
            search: searchText,
            status: selectedStatus,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleClearFilters = () => {
        setSearchText('');
        setSelectedStatus('');
        router.get(route('admin-portal.fundraising.index'));
    };

    const showDeleteConfirm = (campaign) => {
        setCampaignToDelete(campaign);
        setDeleteConfirmText('');
        setDeleteConfirmModal(true);
    };

    const handleDelete = () => {
        if (!campaignToDelete || deleteConfirmText !== campaignToDelete.title) return;

        router.delete(route('admin-portal.fundraising.destroy', campaignToDelete.id), {
            onSuccess: () => {
                message.success(`"${campaignToDelete.title}" deleted successfully`);
                setDeleteConfirmModal(false);
                setCampaignToDelete(null);
                setDeleteConfirmText('');
            },
            onError: () => {
                message.error('Failed to delete campaign');
            },
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-TZ', {
            style: 'currency',
            currency: 'TZS',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount || 0);
    };

    const getStatusTag = (campaign) => {
        const colors = {
            draft: 'default',
            active: 'success',
            paused: 'warning',
            completed: 'blue',
            cancelled: 'error',
        };
        return <Tag color={colors[campaign.status]}>{statuses[campaign.status]}</Tag>;
    };

    const columns = [
        {
            title: 'Campaign',
            dataIndex: 'title',
            key: 'title',
            width: '25%',
            render: (text, record) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {record.is_featured && (
                        <Badge count={<StarOutlined style={{ color: token.colorWarning }} />} />
                    )}
                    <span style={{ fontWeight: 'bold', color: token.colorText }}>
                        {text}
                    </span>
                </div>
            ),
        },
        {
            title: 'Goal',
            dataIndex: 'goal_amount',
            key: 'goal_amount',
            width: '12%',
            render: (amount) => formatCurrency(amount),
        },
        {
            title: 'Raised',
            dataIndex: 'raised_amount',
            key: 'raised_amount',
            width: '12%',
            render: (amount) => formatCurrency(amount),
        },
        {
            title: 'Progress',
            key: 'progress',
            width: '15%',
            render: (_, record) => {
                const percentage = record.goal_amount > 0 
                    ? Math.min(100, (record.raised_amount / record.goal_amount) * 100)
                    : 0;
                return (
                    <Progress 
                        percent={percentage} 
                        size="small"
                        format={(percent) => `${percent.toFixed(0)}%`}
                    />
                );
            },
        },
        {
            title: 'Status',
            key: 'status',
            width: '10%',
            render: (_, record) => getStatusTag(record),
        },
        {
            title: 'Start Date',
            dataIndex: 'start_date',
            key: 'start_date',
            width: '12%',
            render: (date) => dayjs(date).format('DD MMM YYYY'),
        },
        {
            title: 'End Date',
            dataIndex: 'end_date',
            key: 'end_date',
            width: '12%',
            render: (date) => date ? dayjs(date).format('DD MMM YYYY') : '-',
        },
        {
            title: 'Actions',
            key: 'actions',
            width: '10%',
            render: (_, record) => {
                const items = [
                    {
                        key: 'view',
                        label: 'View',
                        icon: <EyeOutlined />,
                        onClick: () => router.visit(route('admin-portal.fundraising.show', record.id)),
                    },
                    {
                        key: 'edit',
                        label: 'Edit',
                        icon: <EditOutlined />,
                        onClick: () => openCampaignForm(record),
                    },
                    {
                        key: 'delete',
                        label: 'Delete',
                        icon: <DeleteOutlined />,
                        danger: true,
                        onClick: () => showDeleteConfirm(record),
                    },
                ];
                return (
                    <Dropdown menu={{ items }} trigger={['click']}>
                        <Button type="text" icon={<MoreOutlined />} />
                    </Dropdown>
                );
            },
        },
    ];

    return (
        <>
            <Head title="Fundraising Campaigns - Tabata Welfare Association" />
            <AdminSidebarLayout>
            <div style={{ padding: '24px 0' }}>
                {campaigns.data && campaigns.data.length > 0 && (
                    <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            size="large"
                            onClick={() => openCampaignForm()}
                        >
                            Create Campaign
                        </Button>
                    </div>
                )}

                <Card style={{ marginBottom: '24px' }}>
                    <Row gutter={[16, 16]} align="middle">
                        <Col xs={24} sm={12} md={10}>
                            <Input
                                placeholder="Search campaigns..."
                                prefix={<SearchOutlined />}
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                onPressEnter={handleSearch}
                                allowClear
                            />
                        </Col>
                        <Col xs={24} sm={6} md={6}>
                            <Select
                                placeholder="Status"
                                value={selectedStatus || undefined}
                                onChange={setSelectedStatus}
                                style={{ width: '100%' }}
                                allowClear
                            >
                                {Object.entries(statuses).map(([key, label]) => (
                                    <Select.Option key={key} value={key}>{label}</Select.Option>
                                ))}
                            </Select>
                        </Col>
                        <Col xs={24} md={8} style={{ textAlign: 'right' }}>
                            <Space>
                                <Button type="primary" onClick={handleSearch}>
                                    Search
                                </Button>
                                <Button onClick={handleClearFilters}>
                                    Clear
                                </Button>
                            </Space>
                        </Col>
                    </Row>
                </Card>

                <Card>
                    <Table
                        columns={columns}
                        dataSource={campaigns.data || []}
                        rowKey="id"
                        pagination={{
                            current: campaigns.current_page,
                            pageSize: campaigns.per_page,
                            total: campaigns.total,
                            showSizeChanger: true,
                            showTotal: (total) => `Total ${total} campaigns`,
                            onChange: (page) => {
                                router.get(route('admin-portal.fundraising.index'), {
                                    ...filters,
                                    page
                                });
                            }
                        }}
                        locale={{
                            emptyText: (
                                <Empty
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    description="No campaigns found"
                                >
                                    <Button
                                        type="primary"
                                        icon={<PlusOutlined />}
                                        onClick={() => openCampaignForm()}
                                    >
                                        Create Your First Campaign
                                    </Button>
                                </Empty>
                            )
                        }}
                    />
                </Card>

                <FundraisingFormAnt
                    open={showCampaignForm}
                    onCancel={closeCampaignForm}
                    campaign={editingCampaign}
                />

                <Modal
                    title="Delete Campaign"
                    open={deleteConfirmModal}
                    onCancel={() => {
                        setDeleteConfirmModal(false);
                        setCampaignToDelete(null);
                        setDeleteConfirmText('');
                    }}
                    onOk={handleDelete}
                    okText="Delete"
                    cancelText="Cancel"
                    okButtonProps={{ 
                        danger: true,
                        disabled: deleteConfirmText !== campaignToDelete?.title
                    }}
                    centered
                    styles={{ 
                        mask: { backgroundColor: 'rgba(0, 0, 0, 0.45)' }
                    }}
                >
                    <p>Are you sure you want to delete "{campaignToDelete?.title}"?</p>
                    <p style={{ color: token.colorTextSecondary, fontSize: '12px', marginBottom: '16px' }}>
                        This action cannot be undone. All associated media files will be permanently deleted.
                    </p>
                    <p style={{ marginBottom: '8px' }}>
                        Type the campaign title to confirm:
                    </p>
                    <Input
                        placeholder="Enter campaign title"
                        value={deleteConfirmText}
                        onChange={(e) => setDeleteConfirmText(e.target.value)}
                        style={{
                            backgroundColor: token.colorBgContainer,
                            borderColor: token.colorBorder,
                            color: token.colorText
                        }}
                    />
                </Modal>
            </div>
        </AdminSidebarLayout>
        </>
    );
}
