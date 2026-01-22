import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Select, Switch, Button, theme } from 'antd';

const { TextArea } = Input;
const { Option } = Select;

const ACCOUNT_TYPES = [
    { value: 'asset', label: 'Asset', normalBalance: 'debit' },
    { value: 'liability', label: 'Liability', normalBalance: 'credit' },
    { value: 'equity', label: 'Equity', normalBalance: 'credit' },
    { value: 'revenue', label: 'Revenue', normalBalance: 'credit' },
    { value: 'expense', label: 'Expense', normalBalance: 'debit' },
];

const ACCOUNT_SUBTYPES = {
    asset: ['Current Asset', 'Fixed Asset', 'Intangible Asset', 'Other Asset'],
    liability: ['Current Liability', 'Long-term Liability', 'Other Liability'],
    equity: ['Owner\'s Equity', 'Retained Earnings', 'Capital', 'Drawings'],
    revenue: ['Operating Revenue', 'Non-operating Revenue', 'Other Income'],
    expense: ['Operating Expense', 'Non-operating Expense', 'Cost of Goods Sold'],
};

export default function AccountFormAnt({ account, parentAccounts, onSubmit, onCancel }) {
    const [form] = Form.useForm();
    const { token } = theme.useToken();
    const [selectedType, setSelectedType] = React.useState(account?.account_type || null);

    useEffect(() => {
        if (account) {
            form.setFieldsValue({
                ...account,
                is_active: account.is_active ?? true,
            });
            setSelectedType(account.account_type);
        } else {
            form.resetFields();
            form.setFieldsValue({ is_active: true });
        }
    }, [account, form]);

    const handleTypeChange = (value) => {
        setSelectedType(value);
        // Auto-set normal balance based on account type
        const accountType = ACCOUNT_TYPES.find(t => t.value === value);
        if (accountType) {
            form.setFieldValue('normal_balance', accountType.normalBalance);
        }
        // Clear subtype when type changes
        form.setFieldValue('account_subtype', null);
    };

    const handleSubmit = (values) => {
        onSubmit(values);
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
                is_active: true,
                opening_balance: 0,
            }}
        >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <Form.Item
                    name="account_code"
                    label="Account Code"
                    rules={[{ required: true, message: 'Please enter account code' }]}
                >
                    <Input 
                        placeholder="e.g., 1000, 1100, 2000"
                        style={{
                            backgroundColor: token.colorBgContainer,
                            color: token.colorText,
                        }}
                    />
                </Form.Item>

                <Form.Item
                    name="account_name"
                    label="Account Name"
                    rules={[{ required: true, message: 'Please enter account name' }]}
                >
                    <Input 
                        placeholder="e.g., Cash, Accounts Receivable"
                        style={{
                            backgroundColor: token.colorBgContainer,
                            color: token.colorText,
                        }}
                    />
                </Form.Item>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <Form.Item
                    name="account_type"
                    label="Account Type"
                    rules={[{ required: true, message: 'Please select account type' }]}
                >
                    <Select 
                        placeholder="Select type"
                        onChange={handleTypeChange}
                        style={{
                            backgroundColor: token.colorBgContainer,
                        }}
                    >
                        {ACCOUNT_TYPES.map(type => (
                            <Option key={type.value} value={type.value}>{type.label}</Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="account_subtype"
                    label="Account Subtype"
                >
                    <Select 
                        placeholder="Select subtype (optional)"
                        disabled={!selectedType}
                        style={{
                            backgroundColor: token.colorBgContainer,
                        }}
                        allowClear
                    >
                        {selectedType && ACCOUNT_SUBTYPES[selectedType]?.map(subtype => (
                            <Option key={subtype} value={subtype}>{subtype}</Option>
                        ))}
                    </Select>
                </Form.Item>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <Form.Item
                    name="normal_balance"
                    label="Normal Balance"
                    rules={[{ required: true, message: 'Please select normal balance' }]}
                >
                    <Select 
                        placeholder="Select normal balance"
                        style={{
                            backgroundColor: token.colorBgContainer,
                        }}
                    >
                        <Option value="debit">Debit</Option>
                        <Option value="credit">Credit</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="opening_balance"
                    label="Opening Balance (TZS)"
                >
                    <InputNumber
                        style={{ 
                            width: '100%',
                            backgroundColor: token.colorBgContainer,
                            color: token.colorText,
                        }}
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/,/g, '')}
                        placeholder="0.00"
                    />
                </Form.Item>
            </div>

            <Form.Item
                name="parent_account_id"
                label="Parent Account (Optional)"
            >
                <Select 
                    placeholder="Select parent account"
                    style={{
                        backgroundColor: token.colorBgContainer,
                    }}
                    allowClear
                    showSearch
                    optionFilterProp="children"
                >
                    {parentAccounts?.map(parent => (
                        <Option key={parent.id} value={parent.id}>
                            {parent.account_code} - {parent.account_name}
                        </Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                name="description"
                label="Description"
            >
                <TextArea 
                    rows={3} 
                    placeholder="Account description and purpose"
                    style={{
                        backgroundColor: token.colorBgContainer,
                        color: token.colorText,
                    }}
                />
            </Form.Item>

            <Form.Item
                name="is_active"
                label="Active Status"
                valuePropName="checked"
            >
                <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
            </Form.Item>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '24px' }}>
                <Button onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                    {account ? 'Update' : 'Create'} Account
                </Button>
            </div>
        </Form>
    );
}
