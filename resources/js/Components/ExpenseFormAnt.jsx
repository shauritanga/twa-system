import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Select, DatePicker, Upload, Button, theme } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;

const EXPENSE_CATEGORIES = [
    'Utilities',
    'Maintenance',
    'Events',
    'Salaries',
    'Office Supplies',
    'Transportation',
    'Communication',
    'Insurance',
    'Legal & Professional',
    'Marketing',
    'Training',
    'Other',
];

const PAYMENT_METHODS = [
    'Cash',
    'Bank Transfer',
    'Mobile Money',
    'Cheque',
    'Credit Card',
];

export default function ExpenseFormAnt({ expense, onSubmit, onCancel }) {
    const [form] = Form.useForm();
    const { token } = theme.useToken();

    useEffect(() => {
        if (expense) {
            form.setFieldsValue({
                ...expense,
                expense_date: expense.expense_date ? dayjs(expense.expense_date) : null,
            });
        } else {
            form.resetFields();
        }
    }, [expense, form]);

    const handleSubmit = (values) => {
        const formData = new FormData();
        
        Object.keys(values).forEach(key => {
            if (values[key] !== undefined && values[key] !== null) {
                if (key === 'expense_date') {
                    formData.append(key, values[key].format('YYYY-MM-DD'));
                } else if (key === 'receipt' && values[key]?.file) {
                    formData.append(key, values[key].file.originFileObj);
                } else if (key !== 'receipt') {
                    formData.append(key, values[key]);
                }
            }
        });

        if (expense) {
            formData.append('_method', 'PUT');
        }

        onSubmit(formData);
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
                expense_date: dayjs(),
                category: 'Other',
            }}
        >
            <Form.Item
                name="title"
                label="Expense Title"
                rules={[{ required: true, message: 'Please enter expense title' }]}
            >
                <Input 
                    placeholder="e.g., Office Rent Payment"
                    style={{
                        backgroundColor: token.colorBgContainer,
                        color: token.colorText,
                    }}
                />
            </Form.Item>

            <Form.Item
                name="description"
                label="Description"
            >
                <TextArea 
                    rows={3} 
                    placeholder="Detailed description of the expense"
                    style={{
                        backgroundColor: token.colorBgContainer,
                        color: token.colorText,
                    }}
                />
            </Form.Item>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <Form.Item
                    name="amount"
                    label="Amount (TZS)"
                    rules={[{ required: true, message: 'Please enter amount' }]}
                >
                    <InputNumber
                        style={{ 
                            width: '100%',
                            backgroundColor: token.colorBgContainer,
                            color: token.colorText,
                        }}
                        min={0}
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/,/g, '')}
                        placeholder="0.00"
                    />
                </Form.Item>

                <Form.Item
                    name="expense_date"
                    label="Expense Date"
                    rules={[{ required: true, message: 'Please select date' }]}
                >
                    <DatePicker 
                        style={{ 
                            width: '100%',
                            backgroundColor: token.colorBgContainer,
                            color: token.colorText,
                        }} 
                    />
                </Form.Item>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <Form.Item
                    name="category"
                    label="Category"
                    rules={[{ required: true, message: 'Please select category' }]}
                >
                    <Select 
                        placeholder="Select category"
                        style={{
                            backgroundColor: token.colorBgContainer,
                        }}
                    >
                        {EXPENSE_CATEGORIES.map(cat => (
                            <Option key={cat} value={cat}>{cat}</Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="payment_method"
                    label="Payment Method"
                >
                    <Select 
                        placeholder="Select payment method" 
                        allowClear
                        style={{
                            backgroundColor: token.colorBgContainer,
                        }}
                    >
                        {PAYMENT_METHODS.map(method => (
                            <Option key={method} value={method}>{method}</Option>
                        ))}
                    </Select>
                </Form.Item>
            </div>

            <Form.Item
                name="vendor"
                label="Vendor/Payee"
            >
                <Input 
                    placeholder="Name of vendor or person paid"
                    style={{
                        backgroundColor: token.colorBgContainer,
                        color: token.colorText,
                    }}
                />
            </Form.Item>

            <Form.Item
                name="receipt"
                label="Receipt/Attachment"
                valuePropName="file"
            >
                <Upload
                    maxCount={1}
                    beforeUpload={() => false}
                    accept=".pdf,.jpg,.jpeg,.png"
                >
                    <Button icon={<UploadOutlined />}>Upload Receipt</Button>
                </Upload>
            </Form.Item>

            <Form.Item
                name="notes"
                label="Additional Notes"
            >
                <TextArea 
                    rows={2} 
                    placeholder="Any additional information"
                    style={{
                        backgroundColor: token.colorBgContainer,
                        color: token.colorText,
                    }}
                />
            </Form.Item>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '24px' }}>
                <Button onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                    {expense ? 'Update' : 'Create'} Expense
                </Button>
            </div>
        </Form>
    );
}
