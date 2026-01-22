import React, { useState } from 'react';
import { Modal, Form, Input, InputNumber, Select, DatePicker, Space, message, notification } from 'antd';
import { ExclamationCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;

export default function DebtFormAnt({ open, onClose, members }) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values) => {
        setLoading(true);
        
        const formData = {
            member_id: values.member_id,
            amount: values.amount,
            reason: values.reason,
            due_date: values.due_date.format('YYYY-MM-DD')
        };

        try {
            const response = await window.axios.post(route('debts.store'), formData, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json'
                }
            });
            
            if (response.data.success) {
                // Show success notification
                notification.success({
                    message: 'Success!',
                    description: 'Debt added successfully!',
                    icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
                    placement: 'topRight',
                    duration: 3
                });
                
                form.resetFields();
                onClose();
                
                // Reload page to show updated data
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            }
        } catch (error) {
            console.error('Error:', error);
            
            if (error.response?.status === 422) {
                // Validation errors
                const errors = error.response.data.errors;
                Object.keys(errors).forEach(key => {
                    message.error(errors[key][0]);
                });
            } else if (error.response?.data?.message) {
                message.error(error.response.data.message);
            } else {
                message.error('Failed to add debt. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        onClose();
    };

    return (
        <Modal
            title={
                <Space>
                    <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
                    <span>Add Debt</span>
                </Space>
            }
            open={open}
            onCancel={handleCancel}
            onOk={() => form.submit()}
            confirmLoading={loading}
            okText="Add Debt"
            cancelText="Cancel"
            width={600}
            okButtonProps={{ danger: true }}
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
                    due_date: dayjs().add(30, 'days')
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
                    >
                        {(members?.data || members || []).map(member => (
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
                        placeholder="Enter debt amount"
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        prefix="TZS"
                    />
                </Form.Item>

                <Form.Item
                    label="Reason"
                    name="reason"
                    rules={[{ required: true, message: 'Please enter a reason' }]}
                >
                    <Input placeholder="Enter reason for debt" />
                </Form.Item>

                <Form.Item
                    label="Due Date"
                    name="due_date"
                    rules={[{ required: true, message: 'Please select a due date' }]}
                >
                    <DatePicker
                        style={{ width: '100%' }}
                        format="YYYY-MM-DD"
                        disabledDate={(current) => current && current < dayjs().startOf('day')}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
}
