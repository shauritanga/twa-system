import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import {
    Modal,
    Form,
    Input,
    Select,
    Upload,
    DatePicker,
    Checkbox,
    Radio,
    InputNumber,
    Space,
    message,
    Row,
    Col,
    theme,
} from 'antd';
import {
    InboxOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Dragger } = Upload;

export default function AnnouncementFormAnt({ 
    open, 
    onCancel, 
    announcement = null,
}) {
    const { token } = theme.useToken();
    const [form] = Form.useForm();
    const [imageFile, setImageFile] = useState([]);
    const [videoFile, setVideoFile] = useState([]);
    const [mediaType, setMediaType] = useState(announcement?.media_type || 'none');
    const [loading, setLoading] = useState(false);
    const isEdit = !!announcement;

    useEffect(() => {
        if (open) {
            if (isEdit) {
                form.setFieldsValue({
                    title: announcement.title,
                    content: announcement.content,
                    type: announcement.type,
                    status: announcement.status,
                    link_url: announcement.link_url,
                    link_text: announcement.link_text,
                    video_url: announcement.video_url,
                    media_type: announcement.media_type,
                    image_alt_text: announcement.image_alt_text,
                    announcement_date: announcement.announcement_date ? dayjs(announcement.announcement_date) : null,
                    expires_at: announcement.expires_at ? dayjs(announcement.expires_at) : null,
                    is_featured: announcement.is_featured,
                    sort_order: announcement.sort_order || 0,
                });
                setMediaType(announcement.media_type);
            } else {
                form.resetFields();
                setImageFile([]);
                setVideoFile([]);
                setMediaType('none');
            }
        }
    }, [open, announcement, isEdit]);

    const handleSubmit = (values) => {
        setLoading(true);

        const formData = new FormData();
        
        if (isEdit) {
            formData.append('_method', 'PUT');
        }
        
        formData.append('title', values.title);
        formData.append('content', values.content);
        formData.append('type', values.type);
        formData.append('status', values.status);
        formData.append('link_url', values.link_url || '');
        formData.append('link_text', values.link_text || '');
        formData.append('media_type', values.media_type);
        formData.append('video_url', values.video_url || '');
        formData.append('image_alt_text', values.image_alt_text || '');
        formData.append('announcement_date', values.announcement_date ? dayjs(values.announcement_date).format('YYYY-MM-DD') : '');
        formData.append('expires_at', values.expires_at ? dayjs(values.expires_at).format('YYYY-MM-DD') : '');
        formData.append('is_featured', values.is_featured ? '1' : '0');
        formData.append('sort_order', values.sort_order || 0);
        
        if (imageFile.length > 0 && values.media_type === 'image') {
            const file = imageFile[0].originFileObj || imageFile[0];
            formData.append('image_file', file);
        }
        
        if (videoFile.length > 0 && values.media_type === 'video') {
            const file = videoFile[0].originFileObj || videoFile[0];
            formData.append('video_file', file);
        }

        const routeName = isEdit 
            ? route('admin-portal.announcements.update', announcement.id)
            : route('admin-portal.announcements.store');

        router.post(routeName, formData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                message.success(isEdit ? 'Announcement updated successfully' : 'Announcement created successfully');
                handleCancel();
            },
            onError: (errors) => {
                console.error('Announcement submission errors:', errors);
                if (errors.title) {
                    message.error(errors.title);
                } else if (errors.image_file) {
                    message.error(errors.image_file);
                } else if (errors.video_file) {
                    message.error(errors.video_file);
                } else {
                    message.error(isEdit ? 'Failed to update announcement' : 'Failed to create announcement');
                }
            },
            onFinish: () => {
                setLoading(false);
            },
        });
    };

    const handleCancel = () => {
        form.resetFields();
        setImageFile([]);
        setVideoFile([]);
        setMediaType('none');
        onCancel();
    };

    const imageUploadProps = {
        beforeUpload: (file) => {
            const isImage = file.type.startsWith('image/');
            if (!isImage) {
                message.error('You can only upload image files!');
                return Upload.LIST_IGNORE;
            }
            const isLt5M = file.size / 1024 / 1024 < 5;
            if (!isLt5M) {
                message.error('Image must be smaller than 5MB');
                return Upload.LIST_IGNORE;
            }
            setImageFile([{
                uid: file.uid,
                name: file.name,
                status: 'done',
                originFileObj: file
            }]);
            return false;
        },
        fileList: imageFile,
        onRemove: () => {
            setImageFile([]);
        },
        maxCount: 1,
    };

    const videoUploadProps = {
        beforeUpload: (file) => {
            const isVideo = file.type.startsWith('video/');
            if (!isVideo) {
                message.error('You can only upload video files!');
                return Upload.LIST_IGNORE;
            }
            const isLt50M = file.size / 1024 / 1024 < 50;
            if (!isLt50M) {
                message.error('Video must be smaller than 50MB');
                return Upload.LIST_IGNORE;
            }
            setVideoFile([{
                uid: file.uid,
                name: file.name,
                status: 'done',
                originFileObj: file
            }]);
            return false;
        },
        fileList: videoFile,
        onRemove: () => {
            setVideoFile([]);
        },
        maxCount: 1,
    };

    return (
        <Modal
            title={isEdit ? 'Edit Announcement' : 'Create Announcement'}
            open={open}
            onCancel={handleCancel}
            onOk={() => form.submit()}
            confirmLoading={loading}
            width={900}
            centered
            okText={isEdit ? 'Update' : 'Create'}
            cancelText="Cancel"
            destroyOnClose
            styles={{ 
                body: { 
                    maxHeight: 'calc(100vh - 240px)', 
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    paddingBottom: '16px',
                    paddingRight: '24px'
                },
                mask: { backgroundColor: 'rgba(0, 0, 0, 0.45)' }
            }}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                    type: 'general',
                    status: 'draft',
                    media_type: 'none',
                    is_featured: false,
                    sort_order: 0,
                }}
                style={{
                    color: token.colorText
                }}
            >
                <Form.Item
                    label="Title"
                    name="title"
                    rules={[{ required: true, message: 'Please enter announcement title' }]}
                    labelCol={{ style: { color: token.colorText } }}
                >
                    <Input 
                        placeholder="Enter announcement title"
                        style={{
                            backgroundColor: token.colorBgContainer,
                            borderColor: token.colorBorder,
                            color: token.colorText
                        }}
                    />
                </Form.Item>

                <Form.Item
                    label="Content"
                    name="content"
                    rules={[{ required: true, message: 'Please enter announcement content' }]}
                    labelCol={{ style: { color: token.colorText } }}
                >
                    <TextArea 
                        rows={6} 
                        placeholder="Enter announcement content"
                        style={{
                            backgroundColor: token.colorBgContainer,
                            borderColor: token.colorBorder,
                            color: token.colorText
                        }}
                    />
                </Form.Item>

                <Row gutter={16}>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Type"
                            name="type"
                            rules={[{ required: true, message: 'Please select type' }]}
                            labelCol={{ style: { color: token.colorText } }}
                        >
                            <Select style={{ color: token.colorText }}>
                                <Select.Option value="important">Important</Select.Option>
                                <Select.Option value="event">Event</Select.Option>
                                <Select.Option value="update">Update</Select.Option>
                                <Select.Option value="general">General</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Status"
                            name="status"
                            rules={[{ required: true, message: 'Please select status' }]}
                            labelCol={{ style: { color: token.colorText } }}
                        >
                            <Select style={{ color: token.colorText }}>
                                <Select.Option value="active">Active</Select.Option>
                                <Select.Option value="inactive">Inactive</Select.Option>
                                <Select.Option value="draft">Draft</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Announcement Date"
                            name="announcement_date"
                            rules={[{ required: true, message: 'Please select date' }]}
                            labelCol={{ style: { color: token.colorText } }}
                        >
                            <DatePicker 
                                style={{ 
                                    width: '100%',
                                    backgroundColor: token.colorBgContainer,
                                    borderColor: token.colorBorder,
                                    color: token.colorText
                                }} 
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Expires At (Optional)"
                            name="expires_at"
                            labelCol={{ style: { color: token.colorText } }}
                        >
                            <DatePicker 
                                style={{ 
                                    width: '100%',
                                    backgroundColor: token.colorBgContainer,
                                    borderColor: token.colorBorder,
                                    color: token.colorText
                                }} 
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    label="Media Type"
                    name="media_type"
                    labelCol={{ style: { color: token.colorText } }}
                >
                    <Radio.Group onChange={(e) => setMediaType(e.target.value)}>
                        <Radio value="none">None</Radio>
                        <Radio value="image">Image</Radio>
                        <Radio value="video">Video File</Radio>
                        <Radio value="video_url">Video URL</Radio>
                    </Radio.Group>
                </Form.Item>

                {mediaType === 'image' && (
                    <>
                        <Form.Item
                            label="Upload Image"
                            help={isEdit && announcement.image_path ? `Current: ${announcement.image_path}` : 'JPEG, PNG, GIF, WebP up to 5MB'}
                            labelCol={{ style: { color: token.colorText } }}
                        >
                            <Dragger 
                                {...imageUploadProps}
                                style={{
                                    backgroundColor: token.colorBgContainer,
                                    borderColor: token.colorBorder,
                                }}
                            >
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined style={{ color: token.colorPrimary }} />
                                </p>
                                <p className="ant-upload-text" style={{ color: token.colorText }}>
                                    Click or drag image to upload
                                </p>
                            </Dragger>
                        </Form.Item>
                        <Form.Item
                            label="Image Alt Text"
                            name="image_alt_text"
                            labelCol={{ style: { color: token.colorText } }}
                        >
                            <Input 
                                placeholder="Enter image description"
                                style={{
                                    backgroundColor: token.colorBgContainer,
                                    borderColor: token.colorBorder,
                                    color: token.colorText
                                }}
                            />
                        </Form.Item>
                    </>
                )}

                {mediaType === 'video' && (
                    <Form.Item
                        label="Upload Video"
                        help={isEdit && announcement.video_path ? `Current: ${announcement.video_path}` : 'MP4, AVI, MOV, WMV, FLV, WebM up to 50MB'}
                        labelCol={{ style: { color: token.colorText } }}
                    >
                        <Dragger 
                            {...videoUploadProps}
                            style={{
                                backgroundColor: token.colorBgContainer,
                                borderColor: token.colorBorder,
                            }}
                        >
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined style={{ color: token.colorPrimary }} />
                            </p>
                            <p className="ant-upload-text" style={{ color: token.colorText }}>
                                Click or drag video to upload
                            </p>
                        </Dragger>
                    </Form.Item>
                )}

                {mediaType === 'video_url' && (
                    <Form.Item
                        label="Video URL"
                        name="video_url"
                        help="YouTube, Vimeo, or direct video URL"
                        labelCol={{ style: { color: token.colorText } }}
                    >
                        <Input 
                            placeholder="https://www.youtube.com/watch?v=..."
                            style={{
                                backgroundColor: token.colorBgContainer,
                                borderColor: token.colorBorder,
                                color: token.colorText
                            }}
                        />
                    </Form.Item>
                )}

                <Row gutter={16}>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Link URL (Optional)"
                            name="link_url"
                            labelCol={{ style: { color: token.colorText } }}
                        >
                            <Input 
                                placeholder="https://example.com"
                                style={{
                                    backgroundColor: token.colorBgContainer,
                                    borderColor: token.colorBorder,
                                    color: token.colorText
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Link Text (Optional)"
                            name="link_text"
                            labelCol={{ style: { color: token.colorText } }}
                        >
                            <Input 
                                placeholder="Read More"
                                style={{
                                    backgroundColor: token.colorBgContainer,
                                    borderColor: token.colorBorder,
                                    color: token.colorText
                                }}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col xs={24} sm={12}>
                        <Form.Item name="is_featured" valuePropName="checked">
                            <Checkbox style={{ color: token.colorText }}>
                                Featured Announcement
                            </Checkbox>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Sort Order"
                            name="sort_order"
                            labelCol={{ style: { color: token.colorText } }}
                        >
                            <InputNumber 
                                min={0} 
                                style={{ 
                                    width: '100%',
                                    backgroundColor: token.colorBgContainer,
                                    borderColor: token.colorBorder,
                                    color: token.colorText
                                }} 
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
}
