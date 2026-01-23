import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, DatePicker, Space, message, notification } from 'antd';
import { DollarOutlined, CheckCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

export default function LoanFormAnt({ open, onClose, members, editingLoan }) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values) => {
        setLoading(true);
        
        const formData = {
            member_id: values.member_id,
            amount: values.amount,
            interest_rate: values.interest_rate,
            purpose: values.purpose,
            term_months: values.term_months,
            due_date: values.due_date.format('YYYY-MM-DD')
        };

        try {
            let response;
            if (editingLoan) {
                // Update existing loan
                response = await window.axios.put(route('loans.update', editingLoan.id), formData, {
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'Accept': 'application/json'
                    }
                });
            } else {
                // Create new loan
                response = await window.axios.post(route('loans.store'), formData, {
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'Accept': 'application/json'
                    }
                });
            }
            
            if (response.data.success) {
                // Show success notification
                notification.success({
                    message: 'Success!',
                    description: editingLoan ? 'Loan updated successfully!' : 'Loan created successfully!',
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
                message.error(editingLoan ? 'Failed to update loan. Please try again.' : 'Failed to create loan. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        onClose();
    };

    // Set form values when editing
    useEffect(() => {
        if (editingLoan && open) {
            form.setFieldsValue({
                member_id: editingLoan.member_id,
                amount: editingLoan.amount,
                interest_rate: editingLoan.interest_rate,
                purpose: editingLoan.purpose,
                term_months: editingLoan.term_months,
                due_date: editingLoan.due_date ? dayjs(editingLoan.due_date) : dayjs().add(12, 'months'),
            });
        } else if (!editingLoan && open) {
            // Reset to defaults for new loan
            form.setFieldsValue({
                interest_rate: 13,
                term_months: 12,
                due_date: dayjs().add(12, 'months')
            });
        }
    }, [editingLoan, open, form]);

    return (
        <Modal
            title={
                <Space>
                    <DollarOutlined style={{ color: '#1890ff' }} />
                    <span>{editingLoan ? 'Edit Loan' : 'Create Loan'}</span>
                </Space>
            }
            open={open}
            onCancel={handleCancel}
            onOk={() => form.submit()}
            confirmLoading={loading}
            okText={editingLoan ? "Update Loan" : "Create Loan"}
            cancelText="Cancel"
            width={600}
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
                    interest_rate: 13, // Default 13% monthly
                    term_months: 12, // Default 12 months
                    due_date: dayjs().add(12, 'months')
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
                    label="Loan Amount (TZS)"
                    name="amount"
                    rules={[
                        { required: true, message: 'Please enter loan amount' },
                        { type: 'number', min: 1, message: 'Amount must be greater than 0' }
                    ]}
                >
                    <InputNumber
                        style={{ width: '100%' }}
                        placeholder="Enter loan amount"
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        prefix="TZS"
                    />
                </Form.Item>

                <Form.Item
                    label="Interest Rate (% per month)"
                    name="interest_rate"
                    rules={[
                        { required: true, message: 'Please enter interest rate' },
                        { type: 'number', min: 0, max: 100, message: 'Interest rate must be between 0 and 100' }
                    ]}
                >
                    <InputNumber
                        style={{ width: '100%' }}
                        placeholder="Enter monthly interest rate"
                        suffix="%"
                        step={0.1}
                        precision={2}
                    />
                </Form.Item>

                <Form.Item
                    label="Purpose"
                    name="purpose"
                    rules={[{ required: true, message: 'Please enter loan purpose' }]}
                >
                    <Input placeholder="Enter loan purpose (e.g., Business expansion, Emergency, etc.)" />
                </Form.Item>

                <Form.Item
                    label="Loan Term (Months)"
                    name="term_months"
                    rules={[
                        { required: true, message: 'Please enter loan term' },
                        { type: 'number', min: 1, max: 60, message: 'Term must be between 1 and 60 months' }
                    ]}
                >
                    <InputNumber
                        style={{ width: '100%' }}
                        placeholder="Enter loan term in months"
                        min={1}
                        max={60}
                    />
                </Form.Item>

                <Form.Item
                    label="Due Date"
                    name="due_date"
                    rules={[{ required: true, message: 'Please select due date' }]}
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