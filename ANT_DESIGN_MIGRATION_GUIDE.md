# Ant Design Integration Guide

This document outlines how to migrate admin pages from Tailwind CSS to Ant Design.

## Setup Complete ✅

The following has been set up:

1. **Ant Design Installed**: `antd` v6.2.0 and `@ant-design/icons` v6.1.0
2. **Theme Provider**: `AntThemeProvider.jsx` - Handles light/dark mode with Ant Design
3. **Admin Layout**: `AdminSidebarLayout.jsx` - Ant Design Layout with responsive sidebar
4. **Admin Header**: `AdminHeader.jsx` - Ant Design Header with theme toggle and user menu
5. **App Integration**: Updated `app.jsx` to wrap app with `AntThemeProvider`

## How to Use Ant Design in Admin Pages

### 1. Import Components

```jsx
import { Button, Form, Input, Table, Card, Row, Col, Space, Modal, Select, DatePicker } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
```

### 2. Update Layout

Replace the old `SidebarLayout` with `AdminSidebarLayout`:

```jsx
// OLD
import SidebarLayout from '../../Layouts/SidebarLayout';

// NEW
import AdminSidebarLayout from '../../Layouts/AdminSidebarLayout';

export default function Dashboard() {
    return (
        <AdminSidebarLayout>
            {/* Your content */}
        </AdminSidebarLayout>
    );
}
```

### 3. Common Component Patterns

#### Buttons
```jsx
// Primary button
<Button type="primary">Save</Button>

// Danger button
<Button danger>Delete</Button>

// Loading state
<Button loading={isLoading}>Processing...</Button>

// Icon button
<Button icon={<PlusOutlined />}>Add New</Button>
```

#### Forms
```jsx
import { Form, Input, Button, Select } from 'antd';

const [form] = Form.useForm();

<Form
    form={form}
    layout="vertical"
    onFinish={onSubmit}
>
    <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: 'Please enter name' }]}
    >
        <Input placeholder="Enter name" />
    </Form.Item>

    <Form.Item
        label="Role"
        name="role_id"
        rules={[{ required: true, message: 'Please select role' }]}
    >
        <Select
            placeholder="Select role"
            options={roles.map(r => ({ label: r.name, value: r.id }))}
        />
    </Form.Item>

    <Form.Item>
        <Button type="primary" htmlType="submit">
            Submit
        </Button>
    </Form.Item>
</Form>
```

#### Tables
```jsx
import { Table, Button, Space, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: 'Actions',
        key: 'actions',
        render: (_, record) => (
            <Space>
                <Button
                    type="primary"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => handleEdit(record)}
                >
                    Edit
                </Button>
                <Popconfirm
                    title="Delete"
                    description="Are you sure?"
                    onConfirm={() => handleDelete(record.id)}
                >
                    <Button danger size="small" icon={<DeleteOutlined />}>
                        Delete
                    </Button>
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
    pagination={{
        pageSize: 10,
        total: total,
        onChange: (page) => setCurrentPage(page),
    }}
/>
```

#### Cards
```jsx
import { Card, Row, Col, Statistic } from 'antd';
import { UserOutlined, DollarOutlined } from '@ant-design/icons';

<Row gutter={[16, 16]}>
    <Col xs={24} sm={12} lg={6}>
        <Card>
            <Statistic
                title="Total Users"
                value={1234}
                icon={<UserOutlined />}
            />
        </Card>
    </Col>
    <Col xs={24} sm={12} lg={6}>
        <Card>
            <Statistic
                title="Total Revenue"
                value={50000}
                prefix="$"
                icon={<DollarOutlined />}
            />
        </Card>
    </Col>
</Row>
```

#### Modals
```jsx
import { Modal, Form, Input, Button } from 'antd';

const [isModalOpen, setIsModalOpen] = useState(false);
const [form] = Form.useForm();

<Modal
    title="Add New Item"
    open={isModalOpen}
    onOk={() => form.submit()}
    onCancel={() => setIsModalOpen(false)}
>
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true }]}
        >
            <Input />
        </Form.Item>
    </Form>
</Modal>
```

#### Alerts & Messages
```jsx
import { Alert, message, notification } from 'antd';

// Alert (persistent)
<Alert
    message="Success"
    description="Operation completed successfully"
    type="success"
    showIcon
    closable
/>

// Message (temporary toast)
message.success('Saved successfully!');
message.error('An error occurred');
message.loading('Processing...');

// Notification (top-right corner)
notification.success({
    message: 'Success',
    description: 'Operation completed',
});
```

### 4. Responsive Grid System

```jsx
import { Row, Col } from 'antd';

<Row gutter={[16, 16]}>
    <Col xs={24} sm={12} md={8} lg={6}>
        {/* Content */}
    </Col>
    <Col xs={24} sm={12} md={8} lg={6}>
        {/* Content */}
    </Col>
</Row>
```

Breakpoints:
- `xs`: 0px and up
- `sm`: 576px and up
- `md`: 768px and up
- `lg`: 992px and up
- `xl`: 1200px and up
- `xxl`: 1600px and up

### 5. Theme Customization

The theme is automatically managed by `AntThemeProvider`. To customize:

Edit `resources/js/Providers/AntThemeProvider.jsx`:

```jsx
const antTheme = useMemo(() => {
    const isDark = themeMode === 'dark';
    
    return {
        token: {
            colorPrimary: '#1890ff', // Change primary color
            colorSuccess: '#52c41a',
            colorWarning: '#faad14',
            colorError: '#ff4d4f',
            borderRadius: 6,
            // Add more token customizations
        },
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
    };
}, [themeMode]);
```

## Migration Checklist

For each admin page, follow these steps:

- [ ] Replace `SidebarLayout` with `AdminSidebarLayout`
- [ ] Replace Tailwind classes with Ant Design components
- [ ] Update form components to use `Form` component
- [ ] Replace custom buttons with Ant Design `Button`
- [ ] Replace custom tables with Ant Design `Table`
- [ ] Replace custom modals with Ant Design `Modal`
- [ ] Update icons to use `@ant-design/icons`
- [ ] Test responsive behavior
- [ ] Test dark mode
- [ ] Test all interactions

## Pages to Migrate

Priority order:

1. **Dashboard.jsx** - Main dashboard with stats and charts
2. **Settings.jsx** - Settings page with forms
3. **RolesManagement.jsx** - Roles and permissions management
4. **Members/** - Member management pages
5. **Documents/** - Document management pages
6. **Announcements/** - Announcement management pages
7. **Reports.jsx** - Reports page
8. **Backups.jsx** - Backup management
9. **AuditLogs/** - Audit logs
10. **FundraisingCampaigns/** - Fundraising campaigns

## Useful Resources

- [Ant Design Documentation](https://ant.design/components/overview/)
- [Ant Design Icons](https://ant.design/components/icon/)
- [Ant Design Theme Customization](https://ant.design/docs/react/customize-theme)
- [Ant Design Form](https://ant.design/components/form/)
- [Ant Design Table](https://ant.design/components/table/)

## Notes

- Keep Tailwind CSS for non-admin pages (member pages)
- The theme provider automatically handles light/dark mode
- All Ant Design components are already available through the ConfigProvider
- Use `theme.useToken()` to access current theme colors in custom styles
- Maintain consistency with existing Ant Design components

## Example: Converting Dashboard

See the updated `Dashboard.jsx` for a complete example of how to convert a page to use Ant Design.
