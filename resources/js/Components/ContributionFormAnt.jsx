import React, { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { Modal, Form, Input, InputNumber, Select, DatePicker, Alert, Space, message, notification } from 'antd';
import { DollarOutlined, InfoCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;

export default function ContributionFormAnt({ open, onClose, members, defaultType = 'monthly' }) {
    const { props } = usePage();
    const settings = props.settings || {};
    
    const monthlyContributionAmount = settings.monthly_contribution_amount
        ? parseFloat(settings.monthly_contribution_amount.value)
        : 50000;

    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [currentType, setCurrentType] = useState(defaultType);

    // Update current type when defaultType changes and modal opens
    React.useEffect(() => {
        if (open) {
            setCurrentType(defaultType);
        }
    }, [open, defaultType]);

    // Reset and initialize form when type changes or modal opens
    React.useEffect(() => {
        if (open) {
            // Small delay to ensure form is ready
            setTimeout(() => {
                form.resetFields();
                
                const initialValues = {
                    member_id: undefined,
                    date: dayjs(),
                    notes: '',
                };
                
                if (currentType === 'monthly') {
                    initialValues.amount = monthlyContributionAmount;
                    initialValues.purpose = 'Monthly Contribution';
                } else {
                    initialValues.amount = undefined;
                    initialValues.purpose = '';
                }
                
                form.setFieldsValue(initialValues);
            }, 0);
        }
    }, [open, currentType, monthlyContributionAmount, form]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-TZ', {
            style: 'currency',
            currency: 'TZS',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount || 0);
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        
        const formData = {
            member_id: values.member_id,
            type: currentType, // Use currentType instead of contributionType
            amount: values.amount,
            date: values.date.format('YYYY-MM-DD'),
            purpose: values.purpose,
            notes: values.notes || ''
        };

        try {
            const response = await window.axios.post(route('contributions.store'), formData, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json'
                }
            });
            
            if (response.data.success) {
                // Show success notification
                notification.success({
                    message: 'Success!',
                    description: 'Contribution recorded successfully!',
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
                message.error('Failed to record contribution. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        onClose();
    };

    // Also reset when modal closes
    React.useEffect(() => {
        if (!open) {
            form.resetFields();
        }
    }, [open, form]);

    return (
        <Modal
            key={`contribution-form-${currentType}-${open}`} // Use currentType for key
            title={
                <Space>
                    <DollarOutlined style={{ color: '#1890ff' }} />
                    <span>{currentType === 'monthly' ? 'Add Monthly Contribution' : 'Add Other Contribution'}</span>
                </Space>
            }
            open={open}
            onCancel={handleCancel}
            onOk={() => form.submit()}
            confirmLoading={loading}
            okText={currentType === 'monthly' ? 'Add Monthly Contribution' : 'Add Other Contribution'}
            cancelText="Cancel"
            width={600}
            styles={{
                body: {
                    maxHeight: '70vh',
                    overflowY: 'auto'
                }
            }}
            centered
            destroyOnClose={true} // Destroy modal content when closed
        >
            <Form
                key={`form-${currentType}`} // Add key to Form as well
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Alert
                    message={currentType === 'monthly' ? 'Monthly Contribution' : 'Other Contribution'}
                    description={
                        currentType === 'monthly'
                            ? 'System handles multiple payments and advance payments automatically. Excess amounts are distributed to future months.'
                            : 'Record special projects, donations, or other non-monthly contributions.'
                    }
                    type="info"
                    icon={<InfoCircleOutlined />}
                    showIcon
                    style={{ marginBottom: 24 }}
                />

                {/* Hidden field to store the contribution type - no switching allowed */}
                <Form.Item name="type" hidden initialValue={currentType}>
                    <Input />
                </Form.Item>

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
                    extra={
                        currentType === 'monthly'
                            ? `Monthly contribution: ${formatCurrency(monthlyContributionAmount)} • Smart distribution enabled`
                            : 'Enter amount for special contribution'
                    }
                >
                    <InputNumber
                        style={{ width: '100%' }}
                        placeholder="Enter amount"
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        prefix="TZS"
                    />
                </Form.Item>

                <Form.Item
                    label="Date"
                    name="date"
                    rules={[{ required: true, message: 'Please select a date' }]}
                >
                    <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
                </Form.Item>

                <Form.Item
                    label="Purpose"
                    name="purpose"
                    rules={[{ required: true, message: 'Please enter a purpose' }]}
                >
                    <Input
                        placeholder={
                            currentType === 'monthly'
                                ? 'Monthly Contribution'
                                : 'Enter purpose (e.g., Building Fund, Equipment)'
                        }
                        autoComplete="new-password"
                        style={{
                            backgroundColor: 'transparent',
                        }}
                        styles={{
                            input: {
                                backgroundColor: 'transparent',
                                WebkitBoxShadow: 'none',
                                boxShadow: 'none',
                            }
                        }}
                    />
                </Form.Item>

                <Form.Item
                    label="Notes (Optional)"
                    name="notes"
                >
                    <TextArea
                        rows={3}
                        placeholder="Additional notes about this contribution..."
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
}
