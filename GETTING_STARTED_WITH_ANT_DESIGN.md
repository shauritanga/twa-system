# Getting Started with Ant Design - Developer Guide

This is a quick start guide for developers who want to convert admin pages to use Ant Design.

## 5-Minute Quick Start

### Step 1: Copy the Layout
```jsx
import AdminSidebarLayout from '../../Layouts/AdminSidebarLayout';

export default function MyPage() {
    return (
        <AdminSidebarLayout>
            {/* Your content here */}
        </AdminSidebarLayout>
    );
}
```

### Step 2: Import Components
```jsx
import { Button, Form, Input, Table, Card, Row, Col, Space } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
```

### Step 3: Build Your UI
```jsx
<Row gutter={16}>
    <Col span={12}>
        <Card title="My Card">
            <Button type="primary" icon={<PlusOutlined />}>
                Add New
            </Button>
        </Card>
    </Col>
</Row>
```

## Common Tasks

### Create a Form
```jsx
const [form] = Form.useForm();

<Form form={form} layout="vertical" onFinish={handleSubmit}>
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

    <Form.Item>
        <Button type="primary" htmlType="submit">
            Submit
        </Button>
    </Form.Item>
</Form>
```

### Display a Table
```jsx
const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
        title: 'Actions',
        key: 'actions',
        render: (_, record) => (
            <Space>
                <Button size="small" onClick={() => handleEdit(record)}>
                    Edit
                </Button>
                <Button danger size="small" onClick={() => handleDelete(record.id)}>
                    Delete
                </Button>
            </Space>
        ),
    },
];

<Table columns={columns} dataSource={data} rowKey="id" />
```

### Show a Modal
```jsx
const [isOpen, setIsOpen] = useState(false);

<Modal
    title="Add New Item"
    open={isOpen}
    onOk={handleOk}
    onCancel={() => setIsOpen(false)}
>
    <Form layout="vertical">
        <Form.Item label="Name" name="name">
            <Input />
        </Form.Item>
    </Form>
</Modal>

<Button onClick={() => setIsOpen(true)}>Open Modal</Button>
```

### Create a Responsive Grid
```jsx
<Row gutter={[16, 16]}>
    <Col xs={24} sm={12} md={8} lg={6}>
        <Card>Item 1</Card>
    </Col>
    <Col xs={24} sm={12} md={8} lg={6}>
        <Card>Item 2</Card>
    </Col>
    <Col xs={24} sm={12} md={8} lg={6}>
        <Card>Item 3</Card>
    </Col>
    <Col xs={24} sm={12} md={8} lg={6}>
        <Card>Item 4</Card>
    </Col>
</Row>
```

### Show Statistics
```jsx
import { Statistic } from 'antd';
import { UserOutlined } from '@ant-design/icons';

<Card>
    <Statistic
        title="Total Users"
        value={1234}
        icon={<UserOutlined />}
    />
</Card>
```

### Display Messages
```jsx
import { message } from 'antd';

// Success
message.success('Saved successfully!');

// Error
message.error('An error occurred');

// Loading
message.loading('Processing...');

// Info
message.info('Information');

// Warning
message.warning('Warning');
```

### Show Notifications
```jsx
import { notification } from 'antd';

notification.success({
    message: 'Success',
    description: 'Operation completed successfully',
});

notification.error({
    message: 'Error',
    description: 'Something went wrong',
});
```

### Confirm Before Delete
```jsx
import { Popconfirm } from 'antd';

<Popconfirm
    title="Delete?"
    description="Are you sure you want to delete this?"
    onConfirm={() => handleDelete(id)}
    okText="Yes"
    cancelText="No"
>
    <Button danger>Delete</Button>
</Popconfirm>
```

## Component Cheat Sheet

| Task | Component | Example |
|------|-----------|---------|
| Button | `Button` | `<Button type="primary">Click</Button>` |
| Input | `Input` | `<Input placeholder="Enter text" />` |
| Select | `Select` | `<Select options={[...]} />` |
| Date | `DatePicker` | `<DatePicker />` |
| Checkbox | `Checkbox` | `<Checkbox>Option</Checkbox>` |
| Radio | `Radio` | `<Radio>Option</Radio>` |
| Switch | `Switch` | `<Switch />` |
| Table | `Table` | `<Table columns={cols} dataSource={data} />` |
| Form | `Form` | `<Form form={form} onFinish={submit}>` |
| Modal | `Modal` | `<Modal open={open} onOk={ok}>` |
| Card | `Card` | `<Card title="Title">Content</Card>` |
| Alert | `Alert` | `<Alert type="success" message="..." />` |
| Tag | `Tag` | `<Tag color="blue">Label</Tag>` |
| Badge | `Badge` | `<Badge count={5} />` |
| Spin | `Spin` | `<Spin />` |
| Empty | `Empty` | `<Empty />` |
| Tabs | `Tabs` | `<Tabs items={[...]} />` |
| Collapse | `Collapse` | `<Collapse items={[...]} />` |
| Drawer | `Drawer` | `<Drawer open={open} onClose={close}>` |
| Tooltip | `Tooltip` | `<Tooltip title="Help">Content</Tooltip>` |
| Dropdown | `Dropdown` | `<Dropdown menu={{items}}>` |
| Menu | `Menu` | `<Menu items={[...]} />` |
| Breadcrumb | `Breadcrumb` | `<Breadcrumb items={[...]} />` |
| Pagination | `Pagination` | `<Pagination total={100} />` |
| Progress | `Progress` | `<Progress percent={50} />` |
| Rate | `Rate` | `<Rate />` |
| Slider | `Slider` | `<Slider />` |
| Upload | `Upload` | `<Upload>` |
| Tree | `Tree` | `<Tree data={data} />` |
| Statistic | `Statistic` | `<Statistic title="..." value={123} />` |

## Icon Reference

Common icons from `@ant-design/icons`:

```jsx
import {
    PlusOutlined,              // +
    DeleteOutlined,            // Trash
    EditOutlined,              // Pencil
    SaveOutlined,              // Save
    SearchOutlined,            // Search
    CheckCircleOutlined,       // Check
    ExclamationCircleOutlined, // Warning
    CloseCircleOutlined,       // X
    UserOutlined,              // User
    TeamOutlined,              // Team
    DollarOutlined,            // Dollar
    FileOutlined,              // File
    DownloadOutlined,          // Download
    UploadOutlined,            // Upload
    PrintOutlined,             // Print
    MailOutlined,              // Mail
    PhoneOutlined,             // Phone
    EnvironmentOutlined,       // Location
    CalendarOutlined,          // Calendar
    ClockCircleOutlined,       // Clock
    BellOutlined,              // Bell
    SettingOutlined,           // Settings
    LogoutOutlined,            // Logout
    LoginOutlined,             // Login
    MenuOutlined,              // Menu
    MenuFoldOutlined,          // Fold
    MenuUnfoldOutlined,        // Unfold
    SunOutlined,               // Sun
    MoonOutlined,              // Moon
    LoadingOutlined,           // Loading
    ReloadOutlined,            // Reload
    EyeOutlined,               // Eye
    EyeInvisibleOutlined,      // Eye off
    LockOutlined,              // Lock
    UnlockOutlined,            // Unlock
    HomeOutlined,              // Home
    ShoppingCartOutlined,      // Cart
    HeartOutlined,             // Heart
    StarOutlined,              // Star
    ShareAltOutlined,          // Share
    CopyOutlined,              // Copy
    DeleteOutlined,            // Delete
    ClearOutlined,             // Clear
    FilterOutlined,            // Filter
    SortAscendingOutlined,     // Sort up
    SortDescendingOutlined,    // Sort down
} from '@ant-design/icons';
```

## Responsive Breakpoints

```jsx
// xs: 0px and up (mobile)
// sm: 576px and up (tablet)
// md: 768px and up (small desktop)
// lg: 992px and up (desktop)
// xl: 1200px and up (large desktop)
// xxl: 1600px and up (extra large)

<Col xs={24} sm={12} md={8} lg={6}>
    Full width on mobile, half on tablet, 1/3 on small desktop, 1/4 on desktop
</Col>
```

## Theme Colors

Access theme colors in your code:

```jsx
import { theme } from 'antd';

const { token } = theme.useToken();

// Available colors:
token.colorPrimary      // Main color (blue)
token.colorSuccess      // Success (green)
token.colorWarning      // Warning (orange)
token.colorError        // Error (red)
token.colorInfo         // Info (blue)
token.colorBgContainer  // Background
token.colorBorder       // Border
token.colorText         // Text
token.colorTextSecondary // Secondary text
```

## Form Validation Rules

```jsx
<Form.Item
    name="email"
    rules={[
        { required: true, message: 'Email is required' },
        { type: 'email', message: 'Invalid email format' },
        { min: 5, message: 'Minimum 5 characters' },
        { max: 50, message: 'Maximum 50 characters' },
        { pattern: /^[A-Z]/, message: 'Must start with uppercase' },
        { validator: customValidator }, // Custom validation
    ]}
>
    <Input />
</Form.Item>
```

## Common Patterns

### Loading State
```jsx
const [loading, setLoading] = useState(false);

<Button loading={loading} onClick={handleClick}>
    Submit
</Button>
```

### Disabled State
```jsx
<Button disabled={!isValid}>
    Submit
</Button>
```

### Size Variants
```jsx
<Button size="large">Large</Button>
<Button size="middle">Middle</Button>
<Button size="small">Small</Button>
```

### Button Types
```jsx
<Button type="primary">Primary</Button>
<Button type="default">Default</Button>
<Button type="dashed">Dashed</Button>
<Button type="text">Text</Button>
<Button danger>Danger</Button>
```

## Tips & Tricks

1. **Always use Form component** for forms - it handles validation
2. **Use Popconfirm** for delete actions - safer UX
3. **Use Space** for consistent spacing between elements
4. **Use Tag** for status indicators
5. **Use Statistic** for displaying numbers
6. **Use Empty** when there's no data
7. **Use Spin** for loading states
8. **Use message** for quick feedback
9. **Use notification** for important alerts
10. **Test on mobile** - use responsive breakpoints

## Debugging

### Check Console
Open browser console (F12) and look for errors

### Check Network
Check Network tab for failed requests

### Check React DevTools
Use React DevTools to inspect component state

### Check Ant Design Docs
Most issues are covered in the documentation

## Common Mistakes

❌ **Don't**: Use Tailwind classes with Ant Design
✅ **Do**: Use Ant Design components and style prop

❌ **Don't**: Forget to set `rowKey` on tables
✅ **Do**: Always set `rowKey="id"` on tables

❌ **Don't**: Use custom buttons
✅ **Do**: Use `Button` component

❌ **Don't**: Use custom forms
✅ **Do**: Use `Form` component

❌ **Don't**: Forget to wrap with `AdminSidebarLayout`
✅ **Do**: Always use `AdminSidebarLayout` for admin pages

## Next Steps

1. ✅ Read this guide
2. ✅ Review example pages (Dashboard, Settings)
3. ✅ Pick a page to convert
4. ✅ Follow the patterns in this guide
5. ✅ Test thoroughly
6. ✅ Ask for help if needed

## Resources

- [Ant Design Docs](https://ant.design/components/overview/)
- [Ant Design Icons](https://ant.design/components/icon/)
- [Migration Guide](./ANT_DESIGN_MIGRATION_GUIDE.md)
- [Quick Reference](./ANT_DESIGN_QUICK_REFERENCE.md)
- [Main README](./ANT_DESIGN_README.md)

---

**Happy coding!** 🚀

If you have questions, check the documentation or ask the team.
