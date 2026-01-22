import React, { useState } from 'react';
import { Modal, Form, Input, InputNumber, Select, DatePicker, Space, message, Alert, Progress } from 'antd';
import { HeartOutlined, LoadingOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;

export default function DisbursementFormAnt({ open, onClose, members }) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [emailProgress, setEmailProgress] = useState({
        isProcessing: false,
        total: 0,
        sent: 0,
        failed: 0,
        currentStep: 'idle',
        errors: []
    });

    const handleSubmit = async (values) => {
        setLoading(true);
        setEmailProgress({
            isProcessing: true,
            total: 0,
            sent: 0,
            failed: 0,
            currentStep: 'creating',
            errors: []
        });
        
        const formData = {
            member_id: values.member_id,
            amount: values.amount,
            date: values.date.format('YYYY-MM-DD'),
            purpose: values.purpose
        };

        try {
            const response = await window.axios.post(route('disaster-payments.store'), formData, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            const result = response.data;

            if (result.success) {
                setEmailProgress({
                    isProcessing: false,
                    total: result.email_results.total,
                    sent: result.email_results.sent,
                    failed: result.email_results.failed,
                    currentStep: 'complete',
                    errors: result.email_results.errors || []
                });

                message.success(`Disbursement recorded! Notifications sent to ${result.email_results.sent} members.`);
                
                setTimeout(() => {
                    form.resetFields();
                    onClose();
                    window.location.reload();
                }, 3000);
            }
        } catch (error) {
            console.error('Error:', error);
            setEmailProgress({
                isProcessing: false,
                total: 0,
                sent: 0,
                failed: 0,
                currentStep: 'idle',
                errors: []
            });
            
            if (error.response?.data?.errors) {
                Object.keys(error.response.data.errors).forEach(key => {
                    message.error(error.response.data.errors[key][0]);
                });
            } else {
                message.error('Failed to record disbursement. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        if (!emailProgress.isProcessing) {
            form.resetFields();
            setEmailProgress({
                isProcessing: false,
                total: 0,
                sent: 0,
                failed: 0,
                currentStep: 'idle',
                errors: []
            });
            onClose();
        }
    };

    return (
        <Modal
            title={
                <Space>
                    <HeartOutlined style={{ color: '#1890ff' }} />
                    <span>Add Disbursement</span>
                </Space>
            }
            open={open}
            onCancel={handleCancel}
            onOk={() => form.submit()}
            confirmLoading={loading || emailProgress.isProcessing}
            okText={emailProgress.isProcessing ? 'Processing...' : 'Add Disbursement'}
            cancelText="Cancel"
            width={600}
            closable={!emailProgress.isProcessing}
            maskClosable={!emailProgress.isProcessing}
            styles={{
                body: {
                    maxHeight: '70vh',
                    overflowY: 'auto'
                }
            }}
            centered
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                    date: dayjs()
                }}
            >
                <Form.Item
                    label="Member"
                    name="member_id"
                    rules={[{ required: true, message: 'Please select a member' }]}
                >
                    <Select
                        showSearch
                        placeholder="Select a member"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.children.toLowerCase().includes(input.toLowerCase())
                        }
                        disabled={emailProgress.isProcessing}
                    >
                        {members.map(member => (
                            <Option key={member.id} value={member.id}>
                                {member.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Amount (TZS)"
                    name="amount"
                    rules={[
                        { required: true, message: 'Please enter an amount' },
                        { type: 'number', min: 0, message: 'Amount must be positive' }
                    ]}
                >
                    <InputNumber
                        style={{ width: '100%' }}
                        placeholder="Enter disbursement amount"
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        prefix="TZS"
                        disabled={emailProgress.isProcessing}
                    />
                </Form.Item>

                <Form.Item
                    label="Date"
                    name="date"
                    rules={[{ required: true, message: 'Please select a date' }]}
                >
                    <DatePicker
                        style={{ width: '100%' }}
                        format="YYYY-MM-DD"
                        disabled={emailProgress.isProcessing}
                    />
                </Form.Item>

                <Form.Item
                    label="Purpose"
                    name="purpose"
                    rules={[{ required: true, message: 'Please enter a purpose' }]}
                >
                    <Input
                        placeholder="Purpose of disbursement (e.g., Medical Emergency, Funeral)"
                        disabled={emailProgress.isProcessing}
                    />
                </Form.Item>

                {emailProgress.isProcessing && (
                    <Alert
                        message={emailProgress.currentStep === 'creating' ? 'Creating disbursement...' : 'Sending email notifications...'}
                        description={
                            emailProgress.total > 0 && (
                                <div style={{ marginTop: 12 }}>
                                    <Progress
                                        percent={Math.round((emailProgress.sent / emailProgress.total) * 100)}
                                        status="active"
                                    />
                                    <div style={{ marginTop: 8, fontSize: 12 }}>
                                        Sent {emailProgress.sent} of {emailProgress.total} notifications
                                        {emailProgress.failed > 0 && ` (${emailProgress.failed} failed)`}
                                    </div>
                                </div>
                            )
                        }
                        type="info"
                        icon={<LoadingOutlined />}
                        showIcon
                    />
                )}

                {emailProgress.currentStep === 'complete' && (
                    <Alert
                        message="Email Notifications Complete"
                        description={
                            <div>
                                <div>✅ Successfully sent to {emailProgress.sent} members</div>
                                {emailProgress.failed > 0 && (
                                    <div style={{ color: '#fa8c16' }}>
                                        ⚠️ Failed to send to {emailProgress.failed} members
                                    </div>
                                )}
                            </div>
                        }
                        type="success"
                        showIcon
                    />
                )}
            </Form>
        </Modal>
    );
}
