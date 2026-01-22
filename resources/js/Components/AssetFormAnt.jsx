import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Select, DatePicker, Upload, Button, theme } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;

const ASSET_CATEGORIES = [
    'Land',
    'Buildings',
    'Vehicles',
    'Equipment',
    'Furniture',
    'Electronics',
    'Computers',
    'Software',
    'Tools',
    'Other',
];

const ASSET_CONDITIONS = [
    'Excellent',
    'Good',
    'Fair',
    'Poor',
    'Needs Repair',
];

const ASSET_STATUSES = [
    { value: 'active', label: 'Active' },
    { value: 'under_maintenance', label: 'Under Maintenance' },
    { value: 'disposed', label: 'Disposed' },
    { value: 'sold', label: 'Sold' },
];

export default function AssetFormAnt({ asset, onSubmit, onCancel }) {
    const [form] = Form.useForm();
    const { token } = theme.useToken();

    useEffect(() => {
        if (asset) {
            form.setFieldsValue({
                ...asset,
                purchase_date: asset.purchase_date ? dayjs(asset.purchase_date) : null,
            });
        } else {
            form.resetFields();
        }
    }, [asset, form]);

    const handleSubmit = (values) => {
        const formData = new FormData();
        
        Object.keys(values).forEach(key => {
            if (values[key] !== undefined && values[key] !== null) {
                if (key === 'purchase_date') {
                    formData.append(key, values[key].format('YYYY-MM-DD'));
                } else if (key === 'photo') {
                    // Only append photo if a file was actually selected
                    if (values[key]?.file?.originFileObj) {
                        formData.append(key, values[key].file.originFileObj);
                    }
                } else {
                    formData.append(key, values[key]);
                }
            }
        });

        if (asset) {
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
                purchase_date: dayjs(),
                status: 'active',
                condition: 'Good',
            }}
        >
            <Form.Item
                name="name"
                label="Asset Name"
                rules={[{ required: true, message: 'Please enter asset name' }]}
            >
                <Input 
                    placeholder="e.g., Toyota Land Cruiser"
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
                    rows={2} 
                    placeholder="Detailed description of the asset"
                    style={{
                        backgroundColor: token.colorBgContainer,
                        color: token.colorText,
                    }}
                />
            </Form.Item>

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
                        {ASSET_CATEGORIES.map(cat => (
                            <Option key={cat} value={cat}>{cat}</Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="serial_number"
                    label="Serial Number"
                >
                    <Input 
                        placeholder="Serial or identification number"
                        style={{
                            backgroundColor: token.colorBgContainer,
                            color: token.colorText,
                        }}
                    />
                </Form.Item>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <Form.Item
                    name="purchase_cost"
                    label="Purchase Cost (TZS)"
                    rules={[{ required: true, message: 'Please enter purchase cost' }]}
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
                    name="purchase_date"
                    label="Purchase Date"
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
                    name="current_value"
                    label="Current Value (TZS)"
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
                        placeholder="Leave empty for auto-calculation"
                    />
                </Form.Item>

                <Form.Item
                    name="useful_life_years"
                    label="Useful Life (Years)"
                >
                    <InputNumber
                        style={{ 
                            width: '100%',
                            backgroundColor: token.colorBgContainer,
                            color: token.colorText,
                        }}
                        min={1}
                        placeholder="For depreciation calculation"
                    />
                </Form.Item>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <Form.Item
                    name="location"
                    label="Location"
                >
                    <Input 
                        placeholder="Where the asset is located"
                        style={{
                            backgroundColor: token.colorBgContainer,
                            color: token.colorText,
                        }}
                    />
                </Form.Item>

                <Form.Item
                    name="condition"
                    label="Condition"
                >
                    <Select 
                        placeholder="Select condition"
                        style={{
                            backgroundColor: token.colorBgContainer,
                        }}
                    >
                        {ASSET_CONDITIONS.map(cond => (
                            <Option key={cond} value={cond}>{cond}</Option>
                        ))}
                    </Select>
                </Form.Item>
            </div>

            <Form.Item
                name="supplier"
                label="Supplier"
            >
                <Input 
                    placeholder="Supplier or vendor name"
                    style={{
                        backgroundColor: token.colorBgContainer,
                        color: token.colorText,
                    }}
                />
            </Form.Item>

            <Form.Item
                name="photo"
                label="Asset Photo"
                valuePropName="file"
            >
                <Upload
                    maxCount={1}
                    beforeUpload={() => false}
                    accept=".jpg,.jpeg,.png"
                    listType="picture"
                >
                    <Button icon={<UploadOutlined />}>Upload Photo</Button>
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
                    {asset ? 'Update' : 'Create'} Asset
                </Button>
            </div>
        </Form>
    );
}
