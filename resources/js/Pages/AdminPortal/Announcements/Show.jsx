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
    Image,
    Badge,
} from 'antd';
import {
    EditOutlined,
    BellOutlined,
    CalendarOutlined,
    InfoCircleOutlined,
    StarOutlined,
    LinkOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Paragraph } = Typography;

export default function AnnouncementShow() {
    const { announcement } = usePage().props;
    const { token } = theme.useToken();

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
        const labels = {
            important: 'Important',
            event: 'Event',
            update: 'Update',
            general: 'General',
        };
        return (
            <Tag color={colors[type]} icon={icons[type]}>
                {labels[type]}
            </Tag>
        );
    };

    const getStatusTag = () => {
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

    return (
        <AdminSidebarLayout>
            <div style={{ padding: '24px 0' }}>
                {/* Breadcrumb */}
                <Breadcrumb
                    items={[
                        {
                            title: (
                                <span
                                    onClick={() => router.visit(route('admin-portal.announcements.index'))}
                                    style={{ cursor: 'pointer', color: token.colorPrimary }}
                                >
                                    Announcements
                                </span>
                            ),
                        },
                        {
                            title: announcement.title,
                        },
                    ]}
                    style={{ marginBottom: '24px' }}
                />

                <Card>
                    {/* Header */}
                    <div style={{ marginBottom: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                            {announcement.is_featured && (
                                <Badge count={<StarOutlined style={{ color: token.colorWarning, fontSize: '20px' }} />} />
                            )}
                            <Title level={2} style={{ margin: 0 }}>
                                {announcement.title}
                            </Title>
                        </div>
                        <Space size="middle">
                            {getTypeTag(announcement.type)}
                            {getStatusTag()}
                        </Space>
                    </div>

                    <Divider />

                    {/* Content */}
                    <div style={{ marginBottom: '24px' }}>
                        <Title level={4}>Content</Title>
                        <Paragraph style={{ whiteSpace: 'pre-wrap', fontSize: '15px' }}>
                            {announcement.content}
                        </Paragraph>
                    </div>

                    {/* Media */}
                    {announcement.media_type !== 'none' && (
                        <>
                            <Divider />
                            <div style={{ marginBottom: '24px' }}>
                                <Title level={4}>Media</Title>
                                {announcement.media_type === 'image' && announcement.image_path && (
                                    <div>
                                        <Image
                                            src={`/storage/${announcement.image_path}`}
                                            alt={announcement.image_alt_text || announcement.title}
                                            style={{ maxWidth: '100%', maxHeight: '500px' }}
                                        />
                                        {announcement.image_alt_text && (
                                            <p style={{ marginTop: '8px', color: token.colorTextSecondary, fontSize: '13px' }}>
                                                {announcement.image_alt_text}
                                            </p>
                                        )}
                                    </div>
                                )}
                                {announcement.media_type === 'video' && announcement.video_path && (
                                    <video 
                                        controls 
                                        style={{ maxWidth: '100%', maxHeight: '500px' }}
                                    >
                                        <source src={`/storage/${announcement.video_path}`} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                )}
                                {announcement.media_type === 'video_url' && announcement.video_url && (
                                    <div>
                                        {announcement.video_url.includes('youtube.com') || announcement.video_url.includes('youtu.be') ? (
                                            <iframe
                                                width="100%"
                                                height="500"
                                                src={announcement.video_url.replace('watch?v=', 'embed/')}
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                        ) : (
                                            <a href={announcement.video_url} target="_blank" rel="noopener noreferrer">
                                                <Button icon={<LinkOutlined />}>
                                                    Watch Video
                                                </Button>
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    <Divider />

                    {/* Details */}
                    <Descriptions bordered column={2}>
                        <Descriptions.Item label="Type">
                            {getTypeTag(announcement.type)}
                        </Descriptions.Item>
                        <Descriptions.Item label="Status">
                            {getStatusTag()}
                        </Descriptions.Item>
                        <Descriptions.Item label="Announcement Date">
                            {dayjs(announcement.announcement_date).format('DD MMM YYYY')}
                        </Descriptions.Item>
                        <Descriptions.Item label="Expires At">
                            {announcement.expires_at ? dayjs(announcement.expires_at).format('DD MMM YYYY') : 'Never'}
                        </Descriptions.Item>
                        {announcement.link_url && (
                            <>
                                <Descriptions.Item label="Link URL" span={2}>
                                    <a href={announcement.link_url} target="_blank" rel="noopener noreferrer">
                                        {announcement.link_text || announcement.link_url}
                                    </a>
                                </Descriptions.Item>
                            </>
                        )}
                        <Descriptions.Item label="Featured">
                            {announcement.is_featured ? (
                                <Tag color="gold" icon={<StarOutlined />}>Yes</Tag>
                            ) : (
                                <Tag>No</Tag>
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item label="Sort Order">
                            {announcement.sort_order}
                        </Descriptions.Item>
                        <Descriptions.Item label="Created By">
                            {announcement.creator?.name}
                        </Descriptions.Item>
                        <Descriptions.Item label="Created At">
                            {dayjs(announcement.created_at).format('DD MMM YYYY HH:mm')}
                        </Descriptions.Item>
                        <Descriptions.Item label="Last Updated" span={2}>
                            {dayjs(announcement.updated_at).format('DD MMM YYYY HH:mm')}
                        </Descriptions.Item>
                    </Descriptions>

                    <Divider />

                    <Space>
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={() => router.visit(route('admin-portal.announcements.index'))}
                        >
                            Edit Announcement
                        </Button>
                        <Button
                            onClick={() => router.visit(route('admin-portal.announcements.index'))}
                        >
                            Back to Announcements
                        </Button>
                    </Space>
                </Card>
            </div>
        </AdminSidebarLayout>
    );
}
