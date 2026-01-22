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

export default function FundraisingFormAnt({ 
    open, 
    onCancel, 
    campaign = null,
}) {
    const { token } = theme.useToken();
    const [form] = Form.useForm();
    const [imageFile, setImageFile] = useState([]);
    const [videoFile, setVideoFile] = useState([]);
    const [loading, setLoading] = useState(false);
    const isEdit = !!campaign;

    useEffect(() => {
        if (open) {
            if (isEdit) {
                form.setFieldsValue({
                    title: campaign.title,
                    description: campaign.description,
                    full_description: campaign.full_description,
                    goal_amount: campaign.goal_amount,
                    raised_amount: campaign.raised_amount,
                    status: campaign.status,
                    start_date: campaign.start_date ? dayjs(campaign.start_date) : null,
                    end_date: campaign.end_date ? dayjs(campaign.end_date) : null,
                    video_url: campaign.video_url,
                    payment_methods: campaign.payment_methods || [],
                    bank_details: campaign.bank_details,
                    mobile_money_number: campaign.mobile_money_number,
                    is_featured: campaign.is_featured,
                    sort_order: campaign.sort_order || 0,
                });
            } else {
                form.resetFields();
                setImageFile([]);
                setVideoFile([]);
            }
        }
    }, [open, campaign, isEdit]);

    const handleSubmit = (values) => {
        setLoading(true);

        const formData = new FormData();
        
        if (isEdit) {
            formData.append('_method', 'PUT');
        }
        
        formData.append('title', values.title);
        formData.append('description', values.description);
        formData.append('full_description', values.full_description || '');
        formData.append('goal_amount', values.goal_amount);
        formData.append('raised_amount', values.raised_amount || 0);
        formData.append('status', values.status);
        formData.append('start_date', values.start_date ? dayjs(values.start_date).format('YYYY-MM-DD') : '');
        formData.append('end_date', values.end_date ? dayjs(values.end_date).format('YYYY-MM-DD') : '');
        formData.append('video_url', values.video_url || '');
        formData.append('bank_details', values.bank_details || '');
        formData.append('mobile_money_number', values.mobile_money_number || '');
        formData.append('is_featured', values.is_featured ? '1' : '0');
        formData.append('sort_order', values.sort_order || 0);
        
        if (values.payment_methods && values.payment_methods.length > 0) {
            values.payment_methods.forEach((method, index) => {
                formData.append(`payment_methods[${index}]`, method);
            });
        }
        
        if (imageFile.length > 0) {
            const file = imageFile[0].originFileObj || imageFile[0];
            formData.append('image_file', file);
        }
        
        if (videoFile.length > 0) {
            const file = videoFile[0].originFileObj || videoFile[0];
            formData.append('video_file', file);
        }

        const routeName = isEdit 
            ? route('admin-portal.fundraising.update', campaign.id)
            : route('admin-portal.fundraising.store');

        router.post(routeName, formData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                message.success(isEdit ? 'Campaign updated successfully' : 'Campaign created successfully');
                handleCancel();
            },
            onError: (errors) => {
                console.error('Campaign submission errors:', errors);
                if (errors.title) {
                    message.error(errors.title);
                } else if (errors.goal_amount) {
                    message.error(errors.goal_amount);
                } else {
                    message.error(isEdit ? 'Failed to update campaign' : 'Failed to create campaign');
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
            title={isEdit ? 'Edit Campaign' : 'Create Campaign'}
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
                    status: 'draft',
                    is_featured: false,
                    sort_order: 0,
                    raised_amount: 0,
                    payment_methods: [],
                }}
                style={{
                    color: token.colorText
                }}
            >
                <Form.Item
                    label="Campaign Title"
                    name="title"
                    rules={[{ required: true, message: 'Please enter campaign title' }]}
                    labelCol={{ style: { color: token.colorText } }}
                >
                    <Input 
                        placeholder="Enter campaign title"
                        style={{
                            backgroundColor: token.colorBgContainer,
                            borderColor: token.colorBorder,
                            color: token.colorText
                        }}
                    />
                </Form.Item>

                <Form.Item
                    label="Short Description"
                    name="description"
                    rules={[{ required: true, message: 'Please enter description' }]}
                    labelCol={{ style: { color: token.colorText } }}
                >
                    <TextArea 
                        rows={3} 
                        placeholder="Brief description for campaign card"
                        style={{
                            backgroundColor: token.colorBgContainer,
                            borderColor: token.colorBorder,
                            color: token.colorText
                        }}
                    />
                </Form.Item>

                <Form.Item
                    label="Full Description"
                    name="full_description"
                    labelCol={{ style: { color: token.colorText } }}
                >
                    <TextArea 
                        rows={6} 
                        placeholder="Detailed campaign description"
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
                            label="Goal Amount (TZS)"
                            name="goal_amount"
                            rules={[{ required: true, message: 'Please enter goal amount' }]}
                            labelCol={{ style: { color: token.colorText } }}
                        >
                            <InputNumber 
                                min={1}
                                style={{ 
                                    width: '100%',
                                    backgroundColor: token.colorBgContainer,
                                    borderColor: token.colorBorder,
                                    color: token.colorText
                                }}
                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                            />
                        </Form.Item>
                    </Col>
                    {isEdit && (
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Raised Amount (TZS)"
                                name="raised_amount"
                                rules={[{ required: true, message: 'Please enter raised amount' }]}
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
                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                />
                            </Form.Item>
                        </Col>
                    )}
                </Row>

                <Row gutter={16}>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Start Date"
                            name="start_date"
                            rules={[{ required: true, message: 'Please select start date' }]}
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
                            label="End Date (Optional)"
                            name="end_date"
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
                    label="Status"
                    name="status"
                    rules={[{ required: true, message: 'Please select status' }]}
                    labelCol={{ style: { color: token.colorText } }}
                >
                    <Select style={{ color: token.colorText }}>
                        <Select.Option value="draft">Draft</Select.Option>
                        <Select.Option value="active">Active</Select.Option>
                        <Select.Option value="paused">Paused</Select.Option>
                        <Select.Option value="completed">Completed</Select.Option>
                        <Select.Option value="cancelled">Cancelled</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Campaign Image"
                    help={isEdit && campaign.image_path ? `Current: ${campaign.image_path}` : 'JPEG, PNG, GIF, WebP up to 5MB'}
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
                    label="Campaign Video (Optional)"
                    help={isEdit && campaign.video_path ? `Current: ${campaign.video_path}` : 'MP4, AVI, MOV up to 50MB'}
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

                <Form.Item
                    label="Video URL (Optional)"
                    name="video_url"
                    help="YouTube or Vimeo URL"
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

                <Form.Item
                    label="Payment Methods"
                    name="payment_methods"
                    labelCol={{ style: { color: token.colorText } }}
                >
                    <Checkbox.Group>
                        <Row>
                            <Col span={12}>
                                <Checkbox value="bank_transfer" style={{ color: token.colorText }}>
                                    Bank Transfer
                                </Checkbox>
                            </Col>
                            <Col span={12}>
                                <Checkbox value="mobile_money" style={{ color: token.colorText }}>
                                    Mobile Money
                                </Checkbox>
                            </Col>
                        </Row>
                    </Checkbox.Group>
                </Form.Item>

                <Form.Item
                    label="Bank Details"
                    name="bank_details"
                    labelCol={{ style: { color: token.colorText } }}
                >
                    <TextArea 
                        rows={3} 
                        placeholder="Bank name, account number, account name"
                        style={{
                            backgroundColor: token.colorBgContainer,
                            borderColor: token.colorBorder,
                            color: token.colorText
                        }}
                    />
                </Form.Item>

                <Form.Item
                    label="Mobile Money Number"
                    name="mobile_money_number"
                    labelCol={{ style: { color: token.colorText } }}
                >
                    <Input 
                        placeholder="+255 XXX XXX XXX"
                        style={{
                            backgroundColor: token.colorBgContainer,
                            borderColor: token.colorBorder,
                            color: token.colorText
                        }}
                    />
                </Form.Item>

                <Row gutter={16}>
                    <Col xs={24} sm={12}>
                        <Form.Item name="is_featured" valuePropName="checked">
                            <Checkbox style={{ color: token.colorText }}>
                                Featured Campaign
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
