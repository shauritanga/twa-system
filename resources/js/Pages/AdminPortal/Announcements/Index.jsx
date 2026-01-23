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
    Badge,
} from 'antd';
import {
    PlusOutlined,
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
    SearchOutlined,
    MoreOutlined,
    BellOutlined,
    CalendarOutlined,
    InfoCircleOutlined,
    StarOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import AnnouncementFormAnt from '../../../Components/AnnouncementFormAnt';

export default function AnnouncementsIndex() {
    const { 
        announcements = { data: [] }, 
        filters = {},
        types = {},
        statuses = {},
        flash = {}
    } = usePage().props;
    
    const { token } = theme.useToken();
    const [searchText, setSearchText] = useState(filters.search || '');
    const [selectedType, setSelectedType] = useState(filters.type || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');
    const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
    const [editingAnnouncement, setEditingAnnouncement] = useState(null);
    const [deleteConfirmModal, setDeleteConfirmModal] = useState(false);
    const [announcementToDelete, setAnnouncementToDelete] = useState(null);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');

    useEffect(() => {
        if (flash?.success) {
            message.success(flash.success);
        }
        if (flash?.error) {
            message.error(flash.error);
        }
    }, [flash]);

    const openAnnouncementForm = (announcement = null) => {
        setEditingAnnouncement(announcement);
        setShowAnnouncementForm(true);
    };

    const closeAnnouncementForm = () => {
        setShowAnnouncementForm(false);
        setEditingAnnouncement(null);
    };

    const handleSearch = () => {
        router.get(route('admin-portal.announcements.index'), {
            search: searchText,
            type: selectedType,
            status: selectedStatus,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleClearFilters = () => {
        setSearchText('');
        setSelectedType('');
        setSelectedStatus('');
        router.get(route('admin-portal.announcements.index'));
    };

    const showDeleteConfirm = (announcement) => {
        setAnnouncementToDelete(announcement);
        setDeleteConfirmText('');
        setDeleteConfirmModal(true);
    };

    const handleDelete = () => {
        if (!announcementToDelete || deleteConfirmText !== announcementToDelete.title) return;

        router.delete(route('admin-portal.announcements.destroy', announcementToDelete.id), {
            onSuccess: () => {
                message.success(`"${announcementToDelete.title}" deleted successfully`);
                setDeleteConfirmModal(false);
                setAnnouncementToDelete(null);
                setDeleteConfirmText('');
            },
            onError: () => {
                message.error('Failed to delete announcement');
            },
        });
    };

    const getTypeTag = (type) => {
        const colors = {
            important: 'red',
            event: 'green',
            update: 'blue',
            general: 'default',
        };
        const icons = {
            important: <InfoCircleOutlined />,
            event: <CalendarOutlined />,
            update: <BellOutlined />,
            general: <StarOutlined />,
        };
        return (
            <Tag color={colors[type]} icon={icons[type]}>
                {types[type]}
            </Tag>
        );
    };

    const getStatusTag = (announcement) => {
        if (announcement.status === 'draft') {
            return <Tag color="default">Draft</Tag>;
        } else if (announcement.status === 'inactive') {
            return <Tag color="warning">Inactive</Tag>;
        } else if (announcement.expires_at && dayjs(announcement.expires_at).isBefore(dayjs())) {
            return <Tag color="error">Expired</Tag>;
        } else {
            return <Tag color="success">Active</Tag>;
        }
    };

    const columns = [
        {
            title: 'Announcement',
            dataIndex: 'title',
            key: 'title',
            width: '30%',
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
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            width: '12%',
            render: (type) => getTypeTag(type),
        },
        {
            title: 'Status',
            key: 'status',
            width: '12%',
            render: (_, record) => getStatusTag(record),
        },
        {
            title: 'Date',
            dataIndex: 'announcement_date',
            key: 'announcement_date',
            width: '12%',
            render: (date) => dayjs(date).format('DD MMM YYYY'),
        },
        {
            title: 'Expires',
            dataIndex: 'expires_at',
            key: 'expires_at',
            width: '12%',
            render: (date) => date ? dayjs(date).format('DD MMM YYYY') : '-',
        },
        {
            title: 'Created By',
            dataIndex: ['creator', 'name'],
            key: 'creator',
            width: '12%',
            ellipsis: true,
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
                        onClick: () => router.visit(route('admin-portal.announcements.show', record.id)),
                    },
                    {
                        key: 'edit',
                        label: 'Edit',
                        icon: <EditOutlined />,
                        onClick: () => openAnnouncementForm(record),
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
            <Head title="Announcements - Tabata Welfare Association" />
            <AdminSidebarLayout>
            <div style={{ padding: '24px 0' }}>
                {/* Header with Create Button - only show if there are announcements */}
                {announcements.data && announcements.data.length > 0 && (
                    <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            size="large"
                            onClick={() => openAnnouncementForm()}
                        >
                            Create Announcement
                        </Button>
                    </div>
                )}

                {/* Filters */}
                <Card style={{ marginBottom: '24px' }}>
                    <Row gutter={[16, 16]} align="middle">
                        <Col xs={24} sm={12} md={8}>
                            <Input
                                placeholder="Search announcements..."
                                prefix={<SearchOutlined />}
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                onPressEnter={handleSearch}
                                allowClear
                            />
                        </Col>
                        <Col xs={24} sm={6} md={4}>
                            <Select
                                placeholder="Type"
                                value={selectedType || undefined}
                                onChange={setSelectedType}
                                style={{ width: '100%' }}
                                allowClear
                            >
                                {Object.entries(types).map(([key, label]) => (
                                    <Select.Option key={key} value={key}>{label}</Select.Option>
                                ))}
                            </Select>
                        </Col>
                        <Col xs={24} sm={6} md={4}>
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

                {/* Announcements Table */}
                <Card>
                    <Table
                        columns={columns}
                        dataSource={announcements.data || []}
                        rowKey="id"
                        pagination={{
                            current: announcements.current_page,
                            pageSize: announcements.per_page,
                            total: announcements.total,
                            showSizeChanger: true,
                            showTotal: (total) => `Total ${total} announcements`,
                            onChange: (page) => {
                                router.get(route('admin-portal.announcements.index'), {
                                    ...filters,
                                    page
                                });
                            }
                        }}
                        locale={{
                            emptyText: (
                                <Empty
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    description="No announcements found"
                                >
                                    <Button
                                        type="primary"
                                        icon={<PlusOutlined />}
                                        onClick={() => openAnnouncementForm()}
                                    >
                                        Create Your First Announcement
                                    </Button>
                                </Empty>
                            )
                        }}
                    />
                </Card>

                {/* Announcement Form Modal */}
                <AnnouncementFormAnt
                    open={showAnnouncementForm}
                    onCancel={closeAnnouncementForm}
                    announcement={editingAnnouncement}
                />

                {/* Delete Confirmation Modal */}
                <Modal
                    title="Delete Announcement"
                    open={deleteConfirmModal}
                    onCancel={() => {
                        setDeleteConfirmModal(false);
                        setAnnouncementToDelete(null);
                        setDeleteConfirmText('');
                    }}
                    onOk={handleDelete}
                    okText="Delete"
                    cancelText="Cancel"
                    okButtonProps={{ 
                        danger: true,
                        disabled: deleteConfirmText !== announcementToDelete?.title
                    }}
                    centered
                    styles={{ 
                        mask: { backgroundColor: 'rgba(0, 0, 0, 0.45)' }
                    }}
                >
                    <p>Are you sure you want to delete "{announcementToDelete?.title}"?</p>
                    <p style={{ color: token.colorTextSecondary, fontSize: '12px', marginBottom: '16px' }}>
                        This action cannot be undone. All associated media files will be permanently deleted.
                    </p>
                    <p style={{ marginBottom: '8px' }}>
                        Type the announcement title to confirm:
                    </p>
                    <Input
                        placeholder="Enter announcement title"
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
