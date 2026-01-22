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
    Space,
    message,
    Tag,
    Row,
    Col,
    theme,
} from 'antd';
import {
    UploadOutlined,
    InboxOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Dragger } = Upload;

export default function DocumentFormAnt({ 
    open, 
    onCancel, 
    document = null,
    categories = {},
    visibilityOptions = {},
}) {
    const { token } = theme.useToken();
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [tags, setTags] = useState(document?.tags || []);
    const [tagInput, setTagInput] = useState('');
    const [loading, setLoading] = useState(false);
    const isEdit = !!document;

    useEffect(() => {
        if (open) {
            if (isEdit) {
                form.setFieldsValue({
                    title: document.title,
                    description: document.description,
                    category: document.category,
                    visibility: document.visibility,
                    status: document.status,
                    document_date: document.document_date ? dayjs(document.document_date) : null,
                });
                setTags(document.tags || []);
            } else {
                form.resetFields();
                setFileList([]);
                setTags([]);
            }
        }
    }, [open, document, isEdit]);

    const handleSubmit = (values) => {
        if (!isEdit && fileList.length === 0) {
            message.error('Please select a file to upload');
            return;
        }

        setLoading(true);

        const formData = new FormData();
        
        if (isEdit) {
            formData.append('_method', 'PUT');
        }
        
        formData.append('title', values.title);
        formData.append('description', values.description || '');
        formData.append('category', values.category);
        formData.append('visibility', values.visibility);
        
        if (isEdit) {
            formData.append('status', values.status);
        } else {
            formData.append('publish_immediately', values.publish_immediately ? '1' : '0');
        }
        
        formData.append('document_date', values.document_date ? dayjs(values.document_date).format('YYYY-MM-DD') : '');
        
        if (fileList.length > 0) {
            // Get the actual file object
            const file = fileList[0].originFileObj || fileList[0];
            formData.append('file', file);
        }
        
        tags.forEach((tag, index) => {
            formData.append(`tags[${index}]`, tag);
        });

        const routeName = isEdit 
            ? route('admin-portal.documents.update', document.id)
            : route('admin-portal.documents.store');

        router.post(routeName, formData, {
            forceFormData: true,
            onSuccess: () => {
                message.success(isEdit ? 'Document updated successfully' : 'Document uploaded successfully');
                handleCancel();
            },
            onError: (errors) => {
                if (errors.file) {
                    message.error(errors.file);
                } else if (errors.title) {
                    message.error(errors.title);
                } else {
                    message.error(isEdit ? 'Failed to update document' : 'Failed to upload document');
                }
            },
            onFinish: () => {
                setLoading(false);
            },
        });
    };

    const handleCancel = () => {
        form.resetFields();
        setFileList([]);
        setTags([]);
        setTagInput('');
        onCancel();
    };

    const uploadProps = {
        beforeUpload: (file) => {
            const isValidType = [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/vnd.ms-powerpoint',
                'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                'text/plain',
                'image/jpeg',
                'image/png',
            ].includes(file.type);

            if (!isValidType) {
                message.error('Invalid file type. Please upload PDF, DOC, XLS, PPT, TXT, or image files.');
                return Upload.LIST_IGNORE;
            }

            const isLt15M = file.size / 1024 / 1024 < 15;
            if (!isLt15M) {
                message.error('File must be smaller than 15MB');
                return Upload.LIST_IGNORE;
            }

            // Auto-fill title if empty
            if (!form.getFieldValue('title')) {
                const fileName = file.name.replace(/\.[^/.]+$/, '');
                form.setFieldsValue({ title: fileName });
            }

            // Store the file with originFileObj
            setFileList([{
                uid: file.uid,
                name: file.name,
                status: 'done',
                originFileObj: file
            }]);
            return false;
        },
        fileList,
        onRemove: () => {
            setFileList([]);
        },
        maxCount: 1,
    };

    const handleAddTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()]);
            setTagInput('');
        }
    };

    const handleRemoveTag = (removedTag) => {
        setTags(tags.filter(tag => tag !== removedTag));
    };

    return (
        <Modal
            title={isEdit ? 'Edit Document' : 'Upload Document'}
            open={open}
            onCancel={handleCancel}
            onOk={() => form.submit()}
            confirmLoading={loading}
            width={900}
            centered
            okText={isEdit ? 'Update' : 'Upload'}
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
                    visibility: 'members_only',
                    publish_immediately: true,
                    status: 'active',
                }}
                style={{
                    color: token.colorText
                }}
            >
                <Form.Item
                    label={isEdit ? 'Replace Document File (Optional)' : 'Document File'}
                    required={!isEdit}
                    help={isEdit ? `Current file: ${document?.file_name}` : 'PDF, DOC, XLS, PPT, TXT, JPG, PNG up to 15MB'}
                    labelCol={{ style: { color: token.colorText } }}
                >
                    <Dragger 
                        {...uploadProps}
                        style={{
                            backgroundColor: token.colorBgContainer,
                            borderColor: token.colorBorder,
                        }}
                    >
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined style={{ color: token.colorPrimary }} />
                        </p>
                        <p className="ant-upload-text" style={{ color: token.colorText }}>
                            Click or drag file to upload
                        </p>
                        <p className="ant-upload-hint" style={{ color: token.colorTextSecondary }}>
                            Support for PDF, DOC, XLS, PPT, TXT, and image files
                        </p>
                    </Dragger>
                </Form.Item>

                <Form.Item
                    label="Document Title"
                    name="title"
                    rules={[{ required: true, message: 'Please enter document title' }]}
                    labelCol={{ style: { color: token.colorText } }}
                >
                    <Input 
                        placeholder="Enter document title"
                        style={{
                            backgroundColor: token.colorBgContainer,
                            borderColor: token.colorBorder,
                            color: token.colorText
                        }}
                    />
                </Form.Item>

                <Form.Item
                    label="Description"
                    name="description"
                    labelCol={{ style: { color: token.colorText } }}
                >
                    <TextArea 
                        rows={3} 
                        placeholder="Enter document description (optional)"
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
                            label="Category"
                            name="category"
                            rules={[{ required: true, message: 'Please select a category' }]}
                            labelCol={{ style: { color: token.colorText } }}
                        >
                            <Select 
                                placeholder="Select category"
                                style={{
                                    color: token.colorText
                                }}
                            >
                                {Object.entries(categories).map(([key, label]) => (
                                    <Select.Option key={key} value={key}>{label}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Visibility"
                            name="visibility"
                            rules={[{ required: true, message: 'Please select visibility' }]}
                            labelCol={{ style: { color: token.colorText } }}
                        >
                            <Select
                                style={{
                                    color: token.colorText
                                }}
                            >
                                {Object.entries(visibilityOptions).map(([key, label]) => (
                                    <Select.Option key={key} value={key}>{label}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                {isEdit && (
                    <Form.Item
                        label="Status"
                        name="status"
                        rules={[{ required: true, message: 'Please select status' }]}
                        labelCol={{ style: { color: token.colorText } }}
                    >
                        <Select
                            style={{
                                color: token.colorText
                            }}
                        >
                            <Select.Option value="active">Active</Select.Option>
                            <Select.Option value="archived">Archived</Select.Option>
                            <Select.Option value="draft">Draft</Select.Option>
                        </Select>
                    </Form.Item>
                )}

                <Form.Item
                    label="Document Date"
                    name="document_date"
                    help="The date this document refers to (e.g., meeting date)"
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

                <Form.Item 
                    label="Tags" 
                    help="Add tags to help categorize and search for this document"
                    labelCol={{ style: { color: token.colorText } }}
                >
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <div style={{ marginBottom: '8px' }}>
                            {tags.map((tag) => (
                                <Tag
                                    key={tag}
                                    closable
                                    onClose={() => handleRemoveTag(tag)}
                                    style={{ marginBottom: '4px' }}
                                >
                                    {tag}
                                </Tag>
                            ))}
                        </div>
                        <Space.Compact style={{ width: '100%' }}>
                            <Input
                                placeholder="Add tags (press Enter to add)"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onPressEnter={handleAddTag}
                                style={{
                                    backgroundColor: token.colorBgContainer,
                                    borderColor: token.colorBorder,
                                    color: token.colorText
                                }}
                            />
                            <button
                                type="button"
                                onClick={handleAddTag}
                                style={{
                                    padding: '4px 15px',
                                    border: `1px solid ${token.colorBorder}`,
                                    background: token.colorBgContainer,
                                    color: token.colorText,
                                    cursor: 'pointer',
                                    borderRadius: '0 6px 6px 0',
                                }}
                            >
                                Add
                            </button>
                        </Space.Compact>
                    </Space>
                </Form.Item>

                {!isEdit && (
                    <Form.Item name="publish_immediately" valuePropName="checked">
                        <Checkbox style={{ color: token.colorText }}>
                            Publish immediately (make visible to members)
                        </Checkbox>
                    </Form.Item>
                )}
            </Form>
        </Modal>
    );
}
