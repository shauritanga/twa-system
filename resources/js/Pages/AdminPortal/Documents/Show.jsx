import React from 'react';
import AdminSidebarLayout from '../../../Layouts/AdminSidebarLayout';
import { usePage, router } from '@inertiajs/react';
import {
    Card,
    Descriptions,
    Button,
    Space,
    Tag,
    Typography,
    Divider,
    Breadcrumb,
    theme,
} from 'antd';
import {
    ArrowLeftOutlined,
    EditOutlined,
    DownloadOutlined,
    EyeOutlined,
    FilePdfOutlined,
    FileWordOutlined,
    FileExcelOutlined,
    FileImageOutlined,
    FileTextOutlined,
    FileOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

export default function DocumentShow() {
    const { document } = usePage().props;
    const { token } = theme.useToken();

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
        if (!fileName) return <FileOutlined style={{ fontSize: '48px' }} />;
        
        const ext = fileName.split('.').pop().toLowerCase();
        const iconStyle = { fontSize: '48px' };
        
        if (ext === 'pdf') {
            return <FilePdfOutlined style={{ ...iconStyle, color: '#ff4d4f' }} />;
        } else if (['doc', 'docx'].includes(ext)) {
            return <FileWordOutlined style={{ ...iconStyle, color: '#1890ff' }} />;
        } else if (['xls', 'xlsx'].includes(ext)) {
            return <FileExcelOutlined style={{ ...iconStyle, color: '#52c41a' }} />;
        } else if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) {
            return <FileImageOutlined style={{ ...iconStyle, color: '#faad14' }} />;
        } else if (['txt', 'md'].includes(ext)) {
            return <FileTextOutlined style={{ ...iconStyle }} />;
        } else {
            return <FileOutlined style={{ ...iconStyle }} />;
        }
    };

    const getStatusTag = () => {
        if (document.status === 'draft') {
            return <Tag color="default">Draft</Tag>;
        } else if (document.status === 'archived') {
            return <Tag color="warning">Archived</Tag>;
        } else if (!document.published_at) {
            return <Tag color="orange">Unpublished</Tag>;
        } else {
            return <Tag color="success">Published</Tag>;
        }
    };

    return (
        <AdminSidebarLayout>
            <div style={{ padding: '24px 0' }}>
                {/* Breadcrumb */}
                <Breadcrumb
                    items={[
                        {
                            title: (
                                <span
                                    onClick={() => router.visit(route('admin-portal.documents.index'))}
                                    style={{ cursor: 'pointer', color: token.colorPrimary }}
                                >
                                    Documents
                                </span>
                            ),
                        },
                        {
                            title: document.title,
                        },
                    ]}
                    style={{ marginBottom: '24px' }}
                />

                <Card>
                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                        {getFileIcon(document.file_name)}
                        <Title level={3} style={{ marginTop: '16px', marginBottom: '8px' }}>
                            {document.title}
                        </Title>
                        {getStatusTag()}
                    </div>

                    <Divider />

                    <Descriptions bordered column={1}>
                        <Descriptions.Item label="File Name">
                            {document.file_name}
                        </Descriptions.Item>
                        <Descriptions.Item label="File Size">
                            {formatFileSize(document.file_size)}
                        </Descriptions.Item>
                        <Descriptions.Item label="File Type">
                            {document.file_type?.toUpperCase()}
                        </Descriptions.Item>
                        <Descriptions.Item label="Category">
                            <Tag color="blue">{document.category_display}</Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Visibility">
                            {document.visibility_display}
                        </Descriptions.Item>
                        <Descriptions.Item label="Status">
                            {getStatusTag()}
                        </Descriptions.Item>
                        {document.description && (
                            <Descriptions.Item label="Description">
                                {document.description}
                            </Descriptions.Item>
                        )}
                        {document.document_date && (
                            <Descriptions.Item label="Document Date">
                                {dayjs(document.document_date).format('DD MMM YYYY')}
                            </Descriptions.Item>
                        )}
                        {document.tags && document.tags.length > 0 && (
                            <Descriptions.Item label="Tags">
                                {document.tags.map((tag) => (
                                    <Tag key={tag}>{tag}</Tag>
                                ))}
                            </Descriptions.Item>
                        )}
                        <Descriptions.Item label="Uploaded By">
                            {document.uploader?.name}
                        </Descriptions.Item>
                        <Descriptions.Item label="Upload Date">
                            {dayjs(document.created_at).format('DD MMM YYYY HH:mm')}
                        </Descriptions.Item>
                        {document.published_at && (
                            <Descriptions.Item label="Published Date">
                                {dayjs(document.published_at).format('DD MMM YYYY HH:mm')}
                            </Descriptions.Item>
                        )}
                        <Descriptions.Item label="Download Count">
                            {document.download_count || 0}
                        </Descriptions.Item>
                    </Descriptions>

                    <Divider />

                    <Space>
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={() => router.visit(route('admin-portal.documents.edit', document.id))}
                        >
                            Edit Document
                        </Button>
                        <Button
                            icon={<DownloadOutlined />}
                            onClick={() => window.open(route('documents.download', document.id), '_blank')}
                        >
                            Download
                        </Button>
                        <Button
                            icon={<EyeOutlined />}
                            onClick={() => window.open(route('documents.preview', document.id), '_blank')}
                        >
                            Preview
                        </Button>
                    </Space>
                </Card>
            </div>
        </AdminSidebarLayout>
    );
}
