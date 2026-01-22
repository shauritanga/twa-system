import React, { useEffect, useState } from 'react';
import { Form, Input, DatePicker, Select, InputNumber, Button, Table, Space, theme, Tag } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;

export default function JournalEntryFormAnt({ entry, accounts, onSubmit, onCancel }) {
    const [form] = Form.useForm();
    const { token } = theme.useToken();
    const [lines, setLines] = useState([]);
    const [totalDebit, setTotalDebit] = useState(0);
    const [totalCredit, setTotalCredit] = useState(0);

    useEffect(() => {
        if (entry) {
            form.setFieldsValue({
                entry_date: entry.entry_date ? dayjs(entry.entry_date) : null,
                reference: entry.reference,
                description: entry.description,
            });
            setLines(entry.lines || []);
        } else {
            form.resetFields();
            form.setFieldsValue({ entry_date: dayjs() });
            setLines([{ account_id: null, description: '', debit: 0, credit: 0 }]);
        }
    }, [entry, form]);

    useEffect(() => {
        const debit = lines.reduce((sum, line) => sum + (parseFloat(line.debit) || 0), 0);
        const credit = lines.reduce((sum, line) => sum + (parseFloat(line.credit) || 0), 0);
        setTotalDebit(debit);
        setTotalCredit(credit);
    }, [lines]);

    const addLine = () => {
        setLines([...lines, { account_id: null, description: '', debit: 0, credit: 0 }]);
    };

    const removeLine = (index) => {
        if (lines.length > 1) {
            setLines(lines.filter((_, i) => i !== index));
        }
    };

    const updateLine = (index, field, value) => {
        const newLines = [...lines];
        newLines[index][field] = value;
        
        // If updating debit, clear credit and vice versa
        if (field === 'debit' && value > 0) {
            newLines[index].credit = 0;
        } else if (field === 'credit' && value > 0) {
            newLines[index].debit = 0;
        }
        
        setLines(newLines);
    };

    const handleSubmit = (values) => {
        // Validate that all lines have an account
        if (lines.some(line => !line.account_id)) {
            return;
        }

        // Validate that each line has either debit or credit (not both, not neither)
        if (lines.some(line => (line.debit > 0 && line.credit > 0) || (line.debit === 0 && line.credit === 0))) {
            return;
        }

        const data = {
            ...values,
            entry_date: values.entry_date.format('YYYY-MM-DD'),
            lines: lines,
        };

        onSubmit(data);
    };

    const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01;

    const columns = [
        {
            title: 'Account',
            dataIndex: 'account_id',
            key: 'account_id',
            width: '30%',
            render: (value, record, index) => (
                <Select
                    value={value}
                    onChange={(val) => updateLine(index, 'account_id', val)}
                    placeholder="Select account"
                    style={{ width: '100%' }}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                        option.children.toLowerCase().includes(input.toLowerCase())
                    }
                >
                    {accounts?.map(account => (
                        <Option key={account.id} value={account.id}>
                            {account.account_code} - {account.account_name}
                        </Option>
                    ))}
                </Select>
            ),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            width: '25%',
            render: (value, record, index) => (
                <Input
                    value={value}
                    onChange={(e) => updateLine(index, 'description', e.target.value)}
                    placeholder="Line description (optional)"
                />
            ),
        },
        {
            title: 'Debit',
            dataIndex: 'debit',
            key: 'debit',
            width: '18%',
            render: (value, record, index) => (
                <InputNumber
                    value={value}
                    onChange={(val) => updateLine(index, 'debit', val || 0)}
                    style={{ width: '100%' }}
                    min={0}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/,/g, '')}
                    placeholder="0.00"
                />
            ),
        },
        {
            title: 'Credit',
            dataIndex: 'credit',
            key: 'credit',
            width: '18%',
            render: (value, record, index) => (
                <InputNumber
                    value={value}
                    onChange={(val) => updateLine(index, 'credit', val || 0)}
                    style={{ width: '100%' }}
                    min={0}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/,/g, '')}
                    placeholder="0.00"
                />
            ),
        },
        {
            title: 'Action',
            key: 'action',
            width: '9%',
            render: (_, record, index) => (
                <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => removeLine(index)}
                    disabled={lines.length === 1}
                />
            ),
        },
    ];

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
                entry_date: dayjs(),
            }}
        >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <Form.Item
                    name="entry_date"
                    label="Entry Date"
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

                <Form.Item
                    name="reference"
                    label="Reference"
                >
                    <Input 
                        placeholder="Reference number or document"
                        style={{
                            backgroundColor: token.colorBgContainer,
                            color: token.colorText,
                        }}
                    />
                </Form.Item>
            </div>

            <Form.Item
                name="description"
                label="Description"
                rules={[{ required: true, message: 'Please enter description' }]}
            >
                <TextArea 
                    rows={2} 
                    placeholder="Journal entry description"
                    style={{
                        backgroundColor: token.colorBgContainer,
                        color: token.colorText,
                    }}
                />
            </Form.Item>

            <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <strong>Journal Entry Lines</strong>
                    <Button
                        type="dashed"
                        icon={<PlusOutlined />}
                        onClick={addLine}
                        size="small"
                    >
                        Add Line
                    </Button>
                </div>

                <Table
                    columns={columns}
                    dataSource={lines}
                    pagination={false}
                    rowKey={(record, index) => index}
                    size="small"
                    bordered
                    footer={() => (
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                            <span>Total:</span>
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <span style={{ width: '120px', textAlign: 'right' }}>
                                    TZS {totalDebit.toLocaleString()}
                                </span>
                                <span style={{ width: '120px', textAlign: 'right' }}>
                                    TZS {totalCredit.toLocaleString()}
                                </span>
                                <span style={{ width: '40px' }}></span>
                            </div>
                        </div>
                    )}
                />

                <div style={{ marginTop: '8px', textAlign: 'right' }}>
                    {isBalanced ? (
                        <Tag color="green">✓ Balanced</Tag>
                    ) : (
                        <Tag color="red">✗ Not Balanced (Difference: TZS {Math.abs(totalDebit - totalCredit).toLocaleString()})</Tag>
                    )}
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '24px' }}>
                <Button onClick={onCancel}>
                    Cancel
                </Button>
                <Button 
                    type="primary" 
                    htmlType="submit"
                    disabled={!isBalanced || lines.length < 2}
                >
                    {entry ? 'Update' : 'Create'} Entry
                </Button>
            </div>
        </Form>
    );
}
