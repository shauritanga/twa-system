import React, { useState, useEffect } from 'react';
import AdminSidebarLayout from '../../../Layouts/AdminSidebarLayout';
import { usePage, router } from '@inertiajs/react';
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
    Tooltip,
    Select,
    Dropdown,
} from 'antd';
import {
    PlusOutlined,
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
    SearchOutlined,
    DownloadOutlined,
    FileTextOutlined,
    FilePdfOutlined,
    FileWordOutlined,
    FileExcelOutlined,
    FileImageOutlined,
    FileOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    MoreOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import DocumentFormAnt from '../../../Components/DocumentFormAnt';

export default function DocumentsIndex() {
    const { 
        documents = { data: [] }, 
        filters = {},
        categories = {},
        statuses = {},
        flash = {}
    } = usePage().props;
    
    const { token } = theme.useToken();
    const [searchText, setSearchText] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');
    const [showDocumentForm, setShowDocumentForm] = useState(false);
    const [editingDocument, setEditingDocument] = useState(null);
    const [deleteConfirmModal, setDeleteConfirmModal] = useState(false);
    const [documentToDelete, setDocumentToDelete] = useState(null);
    const [publishConfirmModal, setPublishConfirmModal] = useState(false);
    const [documentToPublish, setDocumentToPublish] = useState(null);
    const [publishAction, setPublishAction] = useState(null); // 'publish' or 'unpublish'
    const [deleteConfirmText, setDeleteConfirmText] = useState('');

    // Show flash messages
    useEffect(() => {
        if (flash?.success) {
            message.success(flash.success);
        }
        if (flash?.error) {
            message.error(flash.error);
        }
    }, [flash]);

    const openDocumentForm = (document = null) => {
        setEditingDocument(document);
        setShowDocumentForm(true);
    };

    const closeDocumentForm = () => {
        setShowDocumentForm(false);
        setEditingDocument(null);
    };

    const handleSearch = () => {
        router.get(route('admin-portal.documents.index'), {
            search: searchText,
            category: selectedCategory,
            status: selectedStatus,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleClearFilters = () => {
        setSearchText('');
        setSelectedCategory('');
        setSelectedStatus('');
        router.get(route('admin-portal.documents.index'));
    };

    const handleDelete = () => {
        if (!documentToDelete || deleteConfirmText !== documentToDelete.title) return;

        router.delete(route('admin-portal.documents.destroy', documentToDelete.id), {
            onSuccess: () => {
                message.success(`"${documentToDelete.title}" deleted successfully`);
                setDeleteConfirmModal(false);
                setDocumentToDelete(null);
                setDeleteConfirmText('');
            },
            onError: () => {
                message.error('Failed to delete document');
            },
        });
    };

    const showDeleteConfirm = (document) => {
        setDocumentToDelete(document);
        setDeleteConfirmText('');
        setDeleteConfirmModal(true);
    };

    const showPublishConfirm = (document, action) => {
        setDocumentToPublish(document);
        setPublishAction(action);
        setPublishConfirmModal(true);
    };

    const handlePublishToggle = () => {
        if (!documentToPublish || !publishAction) return;

        const routeName = publishAction === 'publish'
            ? 'admin-portal.documents.publish'
            : 'admin-portal.documents.unpublish';
        
        const actionText = publishAction === 'publish' ? 'published' : 'unpublished';

        router.post(route(routeName, documentToPublish.id), {}, {
            onSuccess: () => {
                message.success(`"${documentToPublish.title}" ${actionText} successfully`);
                setPublishConfirmModal(false);
                setDocumentToPublish(null);
                setPublishAction(null);
            },
            onError: () => {
                message.error(`Failed to ${publishAction} document`);
            },
        });
    };

    const formatFileSize = (bytes) => {
        if (!bytes) return '0 bytes';
        if (bytes >= 1073741824) {
            return (bytes / 1073741824).toFixed(2) + ' GB';
        } else if (bytes >= 1048576) {
            return (bytes / 1048576).toFixed(2) + ' MB';
        } else if (bytes >= 1024) {
            return (bytes / 1024).toFixed(2) + ' KB';
        } else {
            return bytes + ' bytes';
        }
    };

    const getFileIcon = (fileName) => {
        if (!fileName) return <FileOutlined style={{ fontSize: '24px', color: token.colorPrimary }} />;
        
        const ext = fileName.split('.').pop().toLowerCase();
        const iconStyle = { fontSize: '24px' };
        
        if (ext === 'pdf') {
            return <FilePdfOutlined style={{ ...iconStyle, color: '#ff4d4f' }} />;
        } else if (['doc', 'docx'].includes(ext)) {
            return <FileWordOutlined style={{ ...iconStyle, color: '#1890ff' }} />;
        } else if (['xls', 'xlsx'].includes(ext)) {
            return <FileExcelOutlined style={{ ...iconStyle, color: '#52c41a' }} />;
        } else if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) {
            return <FileImageOutlined style={{ ...iconStyle, color: '#faad14' }} />;
        } else if (['txt', 'md'].includes(ext)) {
            return <FileTextOutlined style={{ ...iconStyle, color: token.colorPrimary }} />;
        } else {
            return <FileOutlined style={{ ...iconStyle, color: token.colorPrimary }} />;
        }
    };

    const getStatusTag = (document) => {
        if (document.status === 'draft') {
            return <Tag color="default">Draft</Tag>;
        } else if (document.status === 'archived') {
            return <Tag color="warning">Archived</Tag>;
        } else if (!document.published_at) {
            return <Tag color="orange">Unpublished</Tag>;
        } else {
            return <Tag color="success" icon={<CheckCircleOutlined />}>Published</Tag>;
        }
    };

    const columns = [
        {
            title: 'Document',
            dataIndex: 'title',
            key: 'title',
            width: '35%',
            render: (text, record) => (
                <Space>
                    {getFileIcon(record.file_name)}
                    <div>
                        <div style={{ fontWeight: 'bold', color: token.colorText }}>
                            {text}
                        </div>
                        <div style={{ fontSize: '12px', color: token.colorTextSecondary }}>
                            {record.file_name} • {formatFileSize(record.file_size)}
                        </div>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Category',
            dataIndex: 'category_display',
            key: 'category',
            width: '15%',
            render: (text) => <Tag color="blue">{text}</Tag>,
        },
        {
            title: 'Status',
            key: 'status',
            width: '15%',
            render: (_, record) => getStatusTag(record),
        },
        {
            title: 'Uploaded By',
            dataIndex: ['uploader', 'name'],
            key: 'uploader',
            width: '15%',
        },
        {
            title: 'Date',
            dataIndex: 'created_at',
            key: 'created_at',
            width: '12%',
            render: (date) => dayjs(date).format('DD MMM YYYY'),
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
                        onClick: () => router.visit(route('admin-portal.documents.show', record.id)),
                    },
                    {
                        key: 'edit',
                        label: 'Edit',
                        icon: <EditOutlined />,
                        onClick: () => openDocumentForm(record),
                    },
                    {
                        key: 'publish',
                        label: record.published_at ? 'Unpublish' : 'Publish',
                        icon: record.published_at ? <CloseCircleOutlined /> : <CheckCircleOutlined />,
                        onClick: () => showPublishConfirm(record, record.published_at ? 'unpublish' : 'publish'),
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
        <AdminSidebarLayout>
            <div style={{ padding: '24px 0' }}>
                {/* Header with Upload Button - only show if there are documents */}
                {documents.data && documents.data.length > 0 && (
                    <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            size="large"
                            onClick={() => openDocumentForm()}
                        >
                            Upload Document
                        </Button>
                    </div>
                )}

                {/* Filters */}
                <Card style={{ marginBottom: '24px' }}>
                    <Row gutter={[16, 16]} align="middle">
                        <Col xs={24} sm={12} md={8}>
                            <Input
                                placeholder="Search documents..."
                                prefix={<SearchOutlined />}
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                onPressEnter={handleSearch}
                                allowClear
                            />
                        </Col>
                        <Col xs={24} sm={6} md={4}>
                            <Select
                                placeholder="Category"
                                value={selectedCategory || undefined}
                                onChange={setSelectedCategory}
                                style={{ width: '100%' }}
                                allowClear
                            >
                                {Object.entries(categories).map(([key, label]) => (
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

                {/* Documents Table */}
                <Card>
                    <Table
                        columns={columns}
                        dataSource={documents.data || []}
                        rowKey="id"
                        pagination={{
                            current: documents.current_page,
                            pageSize: documents.per_page,
                            total: documents.total,
                            showSizeChanger: true,
                            showTotal: (total) => `Total ${total} documents`,
                            onChange: (page) => {
                                router.get(route('admin-portal.documents.index'), {
                                    ...filters,
                                    page
                                });
                            }
                        }}
                        locale={{
                            emptyText: (
                                <Empty
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    description="No documents found"
                                >
                                    <Button
                                        type="primary"
                                        icon={<PlusOutlined />}
                                        onClick={() => openDocumentForm()}
                                    >
                                        Upload Your First Document
                                    </Button>
                                </Empty>
                            )
                        }}
                    />
                </Card>

                {/* Document Form Modal */}
                <DocumentFormAnt
                    open={showDocumentForm}
                    onCancel={closeDocumentForm}
                    document={editingDocument}
                    categories={categories}
                    visibilityOptions={{
                        public: 'Public',
                        members_only: 'Members Only',
                        admin_only: 'Admin Only',
                    }}
                />

                {/* Delete Confirmation Modal */}
                <Modal
                    title="Delete Document"
                    open={deleteConfirmModal}
                    onCancel={() => {
                        setDeleteConfirmModal(false);
                        setDocumentToDelete(null);
                        setDeleteConfirmText('');
                    }}
                    onOk={handleDelete}
                    okText="Delete"
                    cancelText="Cancel"
                    okButtonProps={{ 
                        danger: true,
                        disabled: deleteConfirmText !== documentToDelete?.title
                    }}
                    centered
                    styles={{ 
                        mask: { backgroundColor: 'rgba(0, 0, 0, 0.45)' }
                    }}
                >
                    <p>Are you sure you want to delete "{documentToDelete?.title}"?</p>
                    <p style={{ color: token.colorTextSecondary, fontSize: '12px', marginBottom: '16px' }}>
                        This action cannot be undone. The document file will be permanently deleted.
                    </p>
                    <p style={{ marginBottom: '8px' }}>
                        Type the document title to confirm:
                    </p>
                    <Input
                        placeholder="Enter document title"
                        value={deleteConfirmText}
                        onChange={(e) => setDeleteConfirmText(e.target.value)}
                        style={{
                            backgroundColor: token.colorBgContainer,
                            borderColor: token.colorBorder,
                            color: token.colorText
                        }}
                    />
                </Modal>

                {/* Publish/Unpublish Confirmation Modal */}
                <Modal
                    title={publishAction === 'publish' ? 'Publish Document' : 'Unpublish Document'}
                    open={publishConfirmModal}
                    onCancel={() => {
                        setPublishConfirmModal(false);
                        setDocumentToPublish(null);
                        setPublishAction(null);
                    }}
                    onOk={handlePublishToggle}
                    okText={publishAction === 'publish' ? 'Publish' : 'Unpublish'}
                    cancelText="Cancel"
                    centered
                    styles={{ 
                        mask: { backgroundColor: 'rgba(0, 0, 0, 0.45)' }
                    }}
                >
                    <p>
                        Are you sure you want to {publishAction} "{documentToPublish?.title}"?
                    </p>
                    <p style={{ color: token.colorTextSecondary, fontSize: '12px' }}>
                        {publishAction === 'publish' 
                            ? 'This will make the document visible to members based on its visibility settings.'
                            : 'This will hide the document from members until you publish it again.'}
                    </p>
                </Modal>
            </div>
        </AdminSidebarLayout>
    );
}
