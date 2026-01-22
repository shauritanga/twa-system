# Ant Design Quick Reference for Admin Pages

## Quick Start

### 1. Import What You Need
```jsx
import { Button, Form, Input, Table, Card, Row, Col, Modal, Select, DatePicker, Space, Tag, Popconfirm } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import AdminSidebarLayout from '../../Layouts/AdminSidebarLayout';
```

### 2. Wrap Your Page
```jsx
export default function MyPage() {
    return (
        <AdminSidebarLayout>
            {/* Your content here */}
        </AdminSidebarLayout>
    );
}
```

## Common Patterns

### Button Variants
```jsx
<Button type="primary">Primary</Button>
<Button>Default</Button>
<Button type="dashed">Dashed</Button>
<Button type="text">Text</Button>
<Button danger>Danger</Button>
<Button disabled>Disabled</Button>
<Button loading>Loading</Button>
<Button icon={<PlusOutlined />}>With Icon</Button>
<Button size="large">Large</Button>
<Button size="small">Small</Button>
```

### Form with Validation
```jsx
const [form] = Form.useForm();

<Form
    form={form}
    layout="vertical"
    onFinish={handleSubmit}
    autoComplete="off"
>
    <Form.Item
        label="Email"
        name="email"
        rules={[
            { required: true, message: 'Email is required' },
            { type: 'email', message: 'Invalid email' }
        ]}
    >
        <Input placeholder="Enter email" />
    </Form.Item>

    <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Password is required' }]}
    >
        <Input.Password placeholder="Enter password" />
    </Form.Item>

    <Form.Item>
        <Button type="primary" htmlType="submit">
            Submit
        </Button>
    </Form.Item>
</Form>
```

### Data Table
```jsx
const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status) => (
            <Tag color={status === 'active' ? 'green' : 'red'}>
                {status}
            </Tag>
        ),
    },
    {
        title: 'Actions',
        key: 'actions',
        render: (_, record) => (
            <Space>
                <Button type="primary" size="small" onClick={() => handleEdit(record)}>
                    Edit
                </Button>
                <Popconfirm
                    title="Delete?"
                    description="Are you sure?"
                    onConfirm={() => handleDelete(record.id)}
                >
                    <Button danger size="small">Delete</Button>
                </Popconfirm>
            </Space>
        ),
    },
];

<Table
    columns={columns}
    dataSource={data}
    rowKey="id"
    loading={isLoading}
    pagination={{ pageSize: 10, total: total }}
/>
```

### Modal Dialog
```jsx
const [isOpen, setIsOpen] = useState(false);
const [form] = Form.useForm();

<Modal
    title="Add New Item"
    open={isOpen}
    onOk={() => form.submit()}
    onCancel={() => setIsOpen(false)}
    okText="Save"
    cancelText="Cancel"
>
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <Input />
        </Form.Item>
    </Form>
</Modal>

<Button type="primary" onClick={() => setIsOpen(true)}>
    Open Modal
</Button>
```

### Responsive Grid
```jsx
<Row gutter={[16, 16]}>
    <Col xs={24} sm={12} md={8} lg={6}>
        <Card>Content 1</Card>
    </Col>
    <Col xs={24} sm={12} md={8} lg={6}>
        <Card>Content 2</Card>
    </Col>
    <Col xs={24} sm={12} md={8} lg={6}>
        <Card>Content 3</Card>
    </Col>
    <Col xs={24} sm={12} md={8} lg={6}>
        <Card>Content 4</Card>
    </Col>
</Row>
```

### Statistics Cards
```jsx
import { Statistic } from 'antd';
import { UserOutlined, DollarOutlined } from '@ant-design/icons';

<Row gutter={16}>
    <Col span={12}>
        <Card>
            <Statistic
                title="Total Users"
                value={1234}
                icon={<UserOutlined />}
            />
        </Card>
    </Col>
    <Col span={12}>
        <Card>
            <Statistic
                title="Revenue"
                value={50000}
                prefix="$"
                icon={<DollarOutlined />}
            />
        </Card>
    </Col>
</Row>
```

### Select Dropdown
```jsx
<Form.Item label="Role" name="role_id">
    <Select
        placeholder="Select a role"
        options={[
            { label: 'Admin', value: 1 },
            { label: 'User', value: 2 },
            { label: 'Guest', value: 3 },
        ]}
    />
</Form.Item>
```

### Date Picker
```jsx
<Form.Item label="Date" name="date">
    <DatePicker />
</Form.Item>

<Form.Item label="Date Range" name="dateRange">
    <DatePicker.RangePicker />
</Form.Item>
```

### Alerts & Messages
```jsx
import { Alert, message, notification } from 'antd';

// Alert (persistent)
<Alert
    message="Success"
    description="Operation completed"
    type="success"
    showIcon
    closable
/>

// Toast message
message.success('Saved!');
message.error('Error occurred');
message.warning('Warning');
message.info('Info');

// Notification
notification.success({
    message: 'Success',
    description: 'Operation completed successfully',
});
```

### Tags & Badges
```jsx
import { Tag, Badge } from 'antd';

<Tag color="blue">Blue</Tag>
<Tag color="green">Green</Tag>
<Tag color="red">Red</Tag>
<Tag color="orange">Orange</Tag>

<Badge count={5} />
<Badge count={99} overflowCount={99} />
<Badge status="success" text="Success" />
<Badge status="error" text="Error" />
```

### Space (Spacing)
```jsx
<Space>
    <Button>Button 1</Button>
    <Button>Button 2</Button>
    <Button>Button 3</Button>
</Space>

<Space direction="vertical" style={{ width: '100%' }}>
    <div>Item 1</div>
    <div>Item 2</div>
    <div>Item 3</div>
</Space>
```

### Tabs
```jsx
import { Tabs } from 'antd';

<Tabs
    items={[
        {
            key: '1',
            label: 'Tab 1',
            children: <div>Content 1</div>,
        },
        {
            key: '2',
            label: 'Tab 2',
            children: <div>Content 2</div>,
        },
    ]}
/>
```

### Collapse
```jsx
import { Collapse } from 'antd';

<Collapse
    items={[
        {
            key: '1',
            label: 'Section 1',
            children: <p>Content 1</p>,
        },
        {
            key: '2',
            label: 'Section 2',
            children: <p>Content 2</p>,
        },
    ]}
/>
```

## Theme Colors

Access theme colors in your components:

```jsx
import { theme } from 'antd';

const { token } = theme.useToken();

// Available colors:
token.colorPrimary      // Blue
token.colorSuccess      // Green
token.colorWarning      // Orange
token.colorError        // Red
token.colorInfo         // Blue
token.colorBgContainer  // Background
token.colorBorder       // Border
token.colorText         // Text
```

## Icons

Common icons from `@ant-design/icons`:

```jsx
import {
    PlusOutlined,           // +
    DeleteOutlined,         // Trash
    EditOutlined,           // Pencil
    SaveOutlined,           // Save
    SearchOutlined,         // Search
    LoadingOutlined,        // Loading spinner
    CheckCircleOutlined,    // Check mark
    ExclamationCircleOutlined, // Warning
    CloseCircleOutlined,    // X mark
    UserOutlined,           // User
    TeamOutlined,           // Team
    DollarOutlined,         // Dollar
    FileOutlined,           // File
    DownloadOutlined,       // Download
    UploadOutlined,         // Upload
    PrintOutlined,          // Print
    MailOutlined,           // Mail
    PhoneOutlined,          // Phone
    EnvironmentOutlined,    // Location
    CalendarOutlined,       // Calendar
    ClockCircleOutlined,    // Clock
    BellOutlined,           // Bell
    SettingOutlined,        // Settings
    LogoutOutlined,         // Logout
    LoginOutlined,          // Login
    MenuOutlined,           // Menu
    MenuFoldOutlined,       // Fold menu
    MenuUnfoldOutlined,     // Unfold menu
    SunOutlined,            // Sun
    MoonOutlined,           // Moon
} from '@ant-design/icons';
```

## Responsive Breakpoints

```jsx
// xs: 0px and up
// sm: 576px and up
// md: 768px and up
// lg: 992px and up
// xl: 1200px and up
// xxl: 1600px and up

<Col xs={24} sm={12} md={8} lg={6}>
    Content
</Col>
```

## Common Props

### Button
- `type`: "primary" | "default" | "dashed" | "text"
- `danger`: boolean
- `loading`: boolean
- `disabled`: boolean
- `size`: "large" | "middle" | "small"
- `icon`: ReactNode
- `onClick`: function

### Form.Item
- `label`: string
- `name`: string
- `rules`: array of validation rules
- `required`: boolean
- `tooltip`: string
- `help`: string
- `validateStatus`: "success" | "warning" | "error" | "validating"

### Table
- `columns`: array of column definitions
- `dataSource`: array of data
- `rowKey`: string or function
- `loading`: boolean
- `pagination`: object or false
- `size`: "large" | "middle" | "small"
- `bordered`: boolean
- `scroll`: object

## Tips & Tricks

1. **Use Form.useForm()** for better form control
2. **Always set rowKey** on tables for proper rendering
3. **Use Popconfirm** for destructive actions
4. **Use Space** for consistent spacing between elements
5. **Use Tag** for status indicators
6. **Use Statistic** for displaying numbers
7. **Use Empty** when there's no data
8. **Use Spin** for loading states
9. **Use message** for quick feedback
10. **Use notification** for important alerts

## Need Help?

- [Ant Design Docs](https://ant.design/components/overview/)
- [Ant Design Icons](https://ant.design/components/icon/)
- Check existing admin pages for examples
- See `ANT_DESIGN_MIGRATION_GUIDE.md` for detailed guide
