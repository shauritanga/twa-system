import React, { useState, useEffect } from 'react';
import AdminSidebarLayout from '../../../Layouts/AdminSidebarLayout';
import { useForm, usePage, router } from '@inertiajs/react';
import {
    Card,
    Row,
    Col,
    Table,
    Button,
    Input,
    Space,
    Modal,
    Form,
    Select,
    DatePicker,
    Tag,
    theme,
    message,
    Avatar,
    Upload,
    Dropdown,
} from 'antd';
import {
    PlusOutlined,
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
    SearchOutlined,
    DownloadOutlined,
    UploadOutlined,
    MoreOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

export default function MembersIndex() {
    const { members = [], statistics = {} } = usePage().props;
    const { token } = theme.useToken();
    const [form] = Form.useForm();
    const [searchText, setSearchText] = useState('');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingMember, setEditingMember] = useState(null);
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [filteredMembers, setFilteredMembers] = useState(members);
    const [deleteConfirmModal, setDeleteConfirmModal] = useState(false);
    const [memberToDelete, setMemberToDelete] = useState(null);
    const [importLoading, setImportLoading] = useState(false);
    const [importModalOpen, setImportModalOpen] = useState(false);
    const [importFile, setImportFile] = useState(null);

    const { reset } = useForm({
        first_name: '',
        middle_name: '',
        surname: '',
        email: '',
        phone_number: '',
        address: '',
        place_of_birth: '',
        sex: 'Male',
        date_of_birth: null,
        tribe: '',
        occupation: '',
        reason_for_membership: '',
        image: null,
        application_form: null,
    });

    useEffect(() => {
        const filtered = members.filter(member =>
            member.name.toLowerCase().includes(searchText.toLowerCase()) ||
            member.email.toLowerCase().includes(searchText.toLowerCase()) ||
            (member.phone_number && member.phone_number.includes(searchText))
        );
        setFilteredMembers(filtered);
    }, [searchText, members]);

    const handleOpenModal = (member = null) => {
        if (member) {
            setEditingMember(member);
            form.setFieldsValue({
                first_name: member.first_name,
                middle_name: member.middle_name,
                surname: member.surname,
                email: member.email,
                phone_number: member.phone_number,
                address: member.address,
                place_of_birth: member.place_of_birth,
                sex: member.sex,
                date_of_birth: member.date_of_birth ? dayjs(member.date_of_birth) : null,
                tribe: member.tribe,
                occupation: member.occupation,
                reason_for_membership: member.reason_for_membership,
            });
            if (member.image_path) {
                setImagePreview(`/storage/${member.image_path}`);
            }
        } else {
            setEditingMember(null);
            form.resetFields();
            setImagePreview(null);
            reset();
        }
        setIsDrawerOpen(true);
    };

    const handleCloseModal = () => {
        setIsDrawerOpen(false);
        setEditingMember(null);
        setImagePreview(null);
        form.resetFields();
        reset();
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        const formData = new FormData();

        formData.append('first_name', values.first_name);
        formData.append('middle_name', values.middle_name || '');
        formData.append('surname', values.surname);
        formData.append('email', values.email);
        formData.append('phone_number', values.phone_number);
        formData.append('address', values.address);
        formData.append('place_of_birth', values.place_of_birth);
        formData.append('sex', values.sex);
        formData.append('date_of_birth', values.date_of_birth?.format('YYYY-MM-DD'));
        formData.append('tribe', values.tribe || '');
        formData.append('occupation', values.occupation || '');
        formData.append('reason_for_membership', values.reason_for_membership || '');

        if (values.image && values.image.file) {
            formData.append('image', values.image.file);
        }
        if (values.application_form && values.application_form.file) {
            formData.append('application_form', values.application_form.file);
        }

        try {
            if (editingMember) {
                router.post(route('members.update', editingMember.id), formData, {
                    onSuccess: () => {
                        message.success('Member updated successfully');
                        handleCloseModal();
                    },
                    onError: () => {
                        message.error('Failed to update member');
                    },
                    onFinish: () => setLoading(false),
                });
            } else {
                router.post(route('members.store'), formData, {
                    onSuccess: () => {
                        message.success('Member created successfully');
                        handleCloseModal();
                    },
                    onError: () => {
                        message.error('Failed to create member');
                    },
                    onFinish: () => setLoading(false),
                });
            }
        } catch (error) {
            message.error('An error occurred');
            setLoading(false);
        }
    };

    const handleDelete = (memberId) => {
        router.delete(route('members.destroy', memberId), {
            onSuccess: () => {
                message.success('Member archived successfully');
                setDeleteConfirmModal(false);
                setMemberToDelete(null);
            },
            onError: () => {
                message.error('Failed to archive member');
            },
        });
    };

    const showDeleteConfirm = (memberId) => {
        setMemberToDelete(memberId);
        setDeleteConfirmModal(true);
    };

    const handleImport = () => {
        setImportModalOpen(true);
    };

    const handleConfirmImport = () => {
        if (!importFile) return;

        setImportLoading(true);
        const formData = new FormData();
        formData.append('file', importFile);

        router.post(route('members.import'), formData, {
            onSuccess: () => {
                message.success('Members imported successfully');
                setImportModalOpen(false);
                setImportFile(null);
                setImportLoading(false);
            },
            onError: (errors) => {
                message.error(errors.file || 'Failed to import members');
                setImportLoading(false);
            },
            onFinish: () => setImportLoading(false),
        });
    };

    const handleCloseImportModal = () => {
        setImportModalOpen(false);
        setImportFile(null);
    };

    const columns = [
        {
            title: 'Member',
            dataIndex: 'name',
            key: 'name',
            width: 200,
            render: (text, record) => (
                <Space>
                    <Avatar
                        size="large"
                        src={record.image_path ? `/storage/${record.image_path}` : undefined}
                        style={{ backgroundColor: token.colorPrimary }}
                    >
                        {text.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </Avatar>
                    <div>
                        <div style={{ fontWeight: 'bold' }}>{text}</div>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: 180,
        },
        {
            title: 'Phone',
            dataIndex: 'phone_number',
            key: 'phone_number',
            width: 130,
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            width: 150,
        },
        {
            title: 'DOB',
            dataIndex: 'date_of_birth',
            key: 'date_of_birth',
            width: 110,
            render: (date) => date ? new Date(date).toLocaleDateString() : '-',
        },
        {
            title: 'Status',
            dataIndex: 'is_verified',
            key: 'is_verified',
            width: 100,
            render: (isVerified) => (
                <Tag color={isVerified ? 'green' : 'orange'}>
                    {isVerified ? 'Verified' : 'Pending'}
                </Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 80,
            fixed: 'right',
            render: (_, record) => {
                const items = [
                    {
                        key: 'view',
                        label: 'View',
                        icon: <EyeOutlined />,
                        onClick: () => router.visit(route('admin-portal.members.show', record.id)),
                    },
                    {
                        key: 'edit',
                        label: 'Edit',
                        icon: <EditOutlined />,
                        onClick: () => handleOpenModal(record),
                    },
                    {
                        key: 'archive',
                        label: 'Archive',
                        icon: <DeleteOutlined />,
                        danger: true,
                        onClick: () => showDeleteConfirm(record.id),
                    },
                ];
                return (
                    <Dropdown menu={{ items }} trigger={['click']}>
                        <Button type="text" icon={<MoreOutlined />} />
                    </Dropdown>
                );
            },
        },
    ];

    return (
        <AdminSidebarLayout>
            <div style={{ padding: '24px 0' }}>
                {/* Stats Cards */}
                <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                    <Col xs={24} sm={12} md={6}>
                        <Card>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '24px', fontWeight: 'bold', color: token.colorPrimary }}>
                                    {members.length}
                                </div>
                                <div style={{ color: token.colorTextSecondary, marginTop: '8px' }}>
                                    Total Members
                                </div>
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '24px', fontWeight: 'bold', color: token.colorSuccess }}>
                                    {members.filter(m => m.is_verified).length}
                                </div>
                                <div style={{ color: token.colorTextSecondary, marginTop: '8px' }}>
                                    Verified
                                </div>
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '24px', fontWeight: 'bold', color: token.colorWarning }}>
                                    {members.filter(m => !m.is_verified).length}
                                </div>
                                <div style={{ color: token.colorTextSecondary, marginTop: '8px' }}>
                                    Pending
                                </div>
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '24px', fontWeight: 'bold', color: token.colorError }}>
                                    {statistics.deleted_members || 0}
                                </div>
                                <div style={{ color: token.colorTextSecondary, marginTop: '8px' }}>
                                    Archived
                                </div>
                            </div>
                        </Card>
                    </Col>
                </Row>

                {/* Toolbar */}
                <Card style={{ marginBottom: '24px' }}>
                    <Row gutter={[16, 16]} align="middle">
                        <Col xs={24} sm={12} md={8}>
                            <Input
                                placeholder="Search by name, email, or phone..."
                                prefix={<SearchOutlined />}
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                allowClear
                            />
                        </Col>
                        <Col xs={24} sm={12} md={16} style={{ textAlign: 'right' }}>
                            <Space wrap>
                                <Dropdown
                                    menu={{
                                        items: [
                                            {
                                                key: 'pdf',
                                                label: 'Export as PDF',
                                                onClick: () => window.location.href = route('members.export', { format: 'pdf' }),
                                            },
                                            {
                                                key: 'excel',
                                                label: 'Export as Excel',
                                                onClick: () => window.location.href = route('members.export', { format: 'excel' }),
                                            },
                                            {
                                                key: 'json',
                                                label: 'Export as JSON',
                                                onClick: () => window.location.href = route('members.export', { format: 'json' }),
                                            },
                                        ],
                                    }}
                                    trigger={['click']}
                                >
                                    <Button icon={<DownloadOutlined />}>
                                        Export
                                    </Button>
                                </Dropdown>
                                <Button
                                    onClick={() => router.visit(route('admin-portal.members.archived'))}
                                >
                                    View Archived
                                </Button>
                                <Button 
                                    icon={<UploadOutlined />} 
                                    loading={importLoading}
                                    onClick={handleImport}
                                >
                                    Import
                                </Button>
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={() => handleOpenModal()}
                                >
                                    Add Member
                                </Button>
                            </Space>
                        </Col>
                    </Row>
                </Card>

                {/* Members Table */}
                <Card>
                    <Table
                        columns={columns}
                        dataSource={filteredMembers}
                        rowKey="id"
                        pagination={{ pageSize: 10, total: filteredMembers.length }}
                        scroll={{ x: 1200 }}
                        size="middle"
                    />
                </Card>

                {/* Add/Edit Member Modal */}
                <Modal
                    title={editingMember ? 'Edit Member' : 'Add New Member'}
                    open={isDrawerOpen}
                    onCancel={handleCloseModal}
                    width={600}
                    centered
                    footer={[
                        <Button key="cancel" onClick={handleCloseModal}>
                            Cancel
                        </Button>,
                        <Button key="submit" type="primary" loading={loading} onClick={() => form.submit()}>
                            {editingMember ? 'Update Member' : 'Create Member'}
                        </Button>,
                    ]}
                    styles={{ 
                        body: { 
                            maxHeight: 'calc(100vh - 240px)', 
                            overflowY: 'auto',
                            paddingBottom: '16px'
                        },
                        mask: { backgroundColor: 'rgba(0, 0, 0, 0.45)' }
                    }}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        autoComplete="off"
                        style={{
                            color: token.colorText
                        }}
                    >
                        <Form.Item
                            label="First Name"
                            name="first_name"
                            rules={[{ required: true, message: 'First name is required' }]}
                            labelCol={{ style: { color: token.colorText } }}
                        >
                            <Input 
                                placeholder="Enter first name"
                                style={{
                                    backgroundColor: token.colorBgContainer,
                                    borderColor: token.colorBorder,
                                    color: token.colorText
                                }}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Middle Name"
                            name="middle_name"
                            labelCol={{ style: { color: token.colorText } }}
                        >
                            <Input 
                                placeholder="Enter middle name"
                                style={{
                                    backgroundColor: token.colorBgContainer,
                                    borderColor: token.colorBorder,
                                    color: token.colorText
                                }}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Surname"
                            name="surname"
                            rules={[{ required: true, message: 'Surname is required' }]}
                            labelCol={{ style: { color: token.colorText } }}
                        >
                            <Input 
                                placeholder="Enter surname"
                                style={{
                                    backgroundColor: token.colorBgContainer,
                                    borderColor: token.colorBorder,
                                    color: token.colorText
                                }}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Sex"
                            name="sex"
                            rules={[{ required: true, message: 'Sex is required' }]}
                            labelCol={{ style: { color: token.colorText } }}
                        >
                            <Select
                                options={[
                                    { label: 'Male', value: 'Male' },
                                    { label: 'Female', value: 'Female' },
                                ]}
                                style={{
                                    backgroundColor: token.colorBgContainer,
                                    borderColor: token.colorBorder,
                                    color: token.colorText
                                }}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Date of Birth"
                            name="date_of_birth"
                            rules={[{ required: true, message: 'Date of birth is required' }]}
                            labelCol={{ style: { color: token.colorText } }}
                        >
                            <DatePicker 
                                style={{ 
                                    width: '100%',
                                    backgroundColor: token.colorBgContainer,
                                    borderColor: token.colorBorder,
                                    color: token.colorText
                                }} 
                            />
                        </Form.Item>
                        <Form.Item
                            label="Place of Birth"
                            name="place_of_birth"
                            rules={[{ required: true, message: 'Place of birth is required' }]}
                            labelCol={{ style: { color: token.colorText } }}
                        >
                            <Input 
                                placeholder="Enter place of birth"
                                style={{
                                    backgroundColor: token.colorBgContainer,
                                    borderColor: token.colorBorder,
                                    color: token.colorText
                                }}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                { required: true, message: 'Email is required' },
                                { type: 'email', message: 'Invalid email format' },
                            ]}
                            labelCol={{ style: { color: token.colorText } }}
                        >
                            <Input 
                                placeholder="Enter email address"
                                style={{
                                    backgroundColor: token.colorBgContainer,
                                    borderColor: token.colorBorder,
                                    color: token.colorText
                                }}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Phone Number"
                            name="phone_number"
                            rules={[{ required: true, message: 'Phone number is required' }]}
                            labelCol={{ style: { color: token.colorText } }}
                        >
                            <Input 
                                placeholder="Enter phone number"
                                style={{
                                    backgroundColor: token.colorBgContainer,
                                    borderColor: token.colorBorder,
                                    color: token.colorText
                                }}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Address"
                            name="address"
                            rules={[{ required: true, message: 'Address is required' }]}
                            labelCol={{ style: { color: token.colorText } }}
                        >
                            <Input.TextArea 
                                placeholder="Enter address" 
                                rows={3}
                                style={{
                                    backgroundColor: token.colorBgContainer,
                                    borderColor: token.colorBorder,
                                    color: token.colorText
                                }}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Tribe"
                            name="tribe"
                            labelCol={{ style: { color: token.colorText } }}
                        >
                            <Input 
                                placeholder="Enter tribe"
                                style={{
                                    backgroundColor: token.colorBgContainer,
                                    borderColor: token.colorBorder,
                                    color: token.colorText
                                }}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Occupation"
                            name="occupation"
                            labelCol={{ style: { color: token.colorText } }}
                        >
                            <Input 
                                placeholder="Enter occupation"
                                style={{
                                    backgroundColor: token.colorBgContainer,
                                    borderColor: token.colorBorder,
                                    color: token.colorText
                                }}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Reason for Membership"
                            name="reason_for_membership"
                            labelCol={{ style: { color: token.colorText } }}
                        >
                            <Input.TextArea 
                                placeholder="Enter reason for membership" 
                                rows={3}
                                style={{
                                    backgroundColor: token.colorBgContainer,
                                    borderColor: token.colorBorder,
                                    color: token.colorText
                                }}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Profile Image"
                            name="image"
                            valuePropName="file"
                            labelCol={{ style: { color: token.colorText } }}
                        >
                            <Upload
                                maxCount={1}
                                accept="image/*"
                                beforeUpload={() => false}
                            >
                                <Button icon={<UploadOutlined />}>Upload Image</Button>
                            </Upload>
                        </Form.Item>
                        {imagePreview && (
                            <div style={{ marginBottom: '16px' }}>
                                <img src={imagePreview} alt="Preview" style={{ maxWidth: '200px', maxHeight: '200px' }} />
                            </div>
                        )}
                        <Form.Item
                            label="Application Form"
                            name="application_form"
                            valuePropName="file"
                        >
                            <Upload
                                maxCount={1}
                                accept=".pdf,.doc,.docx,.jpeg,.png,.jpg"
                                beforeUpload={() => false}
                            >
                                <Button icon={<UploadOutlined />}>Upload Application Form</Button>
                            </Upload>
                        </Form.Item>
                    </Form>
                </Modal>

                {/* Delete Confirmation Modal */}
                <Modal
                    title="Archive Member"
                    open={deleteConfirmModal}
                    onCancel={() => {
                        setDeleteConfirmModal(false);
                        setMemberToDelete(null);
                    }}
                    onOk={() => handleDelete(memberToDelete)}
                    okText="Archive"
                    cancelText="Cancel"
                    okButtonProps={{ danger: true }}
                    centered
                    styles={{ 
                        mask: { backgroundColor: 'rgba(0, 0, 0, 0.45)' }
                    }}
                >
                    <p>Are you sure you want to archive this member?</p>
                    <p style={{ color: token.colorTextSecondary, fontSize: '12px' }}>
                        This action will soft delete the member record. You can restore it later from the archived members list.
                    </p>
                </Modal>

                {/* Import Dialog Modal */}
                <Modal
                    title="Import Members"
                    open={importModalOpen}
                    onCancel={handleCloseImportModal}
                    width={600}
                    centered
                    footer={[
                        <Button key="cancel" onClick={handleCloseImportModal}>
                            Cancel
                        </Button>,
                        <Button 
                            key="submit" 
                            type="primary" 
                            loading={importLoading} 
                            onClick={handleConfirmImport}
                            disabled={!importFile}
                        >
                            Import Members
                        </Button>,
                    ]}
                    styles={{ 
                        body: { 
                            maxHeight: 'calc(100vh - 240px)', 
                            overflowY: 'auto',
                            paddingBottom: '16px'
                        },
                        mask: { backgroundColor: 'rgba(0, 0, 0, 0.45)' }
                    }}
                >
                    <div>
                        <p style={{ color: token.colorTextSecondary, marginBottom: '16px', fontSize: '13px' }}>
                            Upload a CSV or Excel file to import members in bulk. Make sure your file follows the required format.
                        </p>

                        {/* File Upload Area */}
                        <div style={{ marginBottom: '16px' }}>
                            <Upload
                                accept=".csv,.xlsx,.xls"
                                maxCount={1}
                                beforeUpload={() => false}
                                onChange={(info) => {
                                    if (info.fileList.length > 0) {
                                        setImportFile(info.fileList[0].originFileObj);
                                    } else {
                                        setImportFile(null);
                                    }
                                }}
                                onRemove={() => {
                                    setImportFile(null);
                                }}
                                listType="text"
                                style={{ width: '100%' }}
                            >
                                <div style={{
                                    border: `2px dashed ${token.colorPrimary}`,
                                    borderRadius: '8px',
                                    padding: '32px 24px',
                                    textAlign: 'center',
                                    backgroundColor: token.colorBgContainer,
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    width: '100%'
                                }}>
                                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>📁</div>
                                    <p style={{ color: token.colorText, fontWeight: 'bold', marginBottom: '4px', fontSize: '14px' }}>
                                        Click to upload or drag and drop
                                    </p>
                                    <p style={{ color: token.colorTextSecondary, fontSize: '12px', margin: '0' }}>
                                        CSV, XLSX, or XLS files
                                    </p>
                                </div>
                            </Upload>
                        </div>

                        {/* Download Template Button */}
                        <div style={{ marginBottom: '16px', textAlign: 'center' }}>
                            <a href={route('members.template')} download>
                                <Button
                                    type="dashed"
                                    icon={<DownloadOutlined />}
                                    block
                                    size="small"
                                >
                                    Download Import Template
                                </Button>
                            </a>
                        </div>

                        {/* Format Information */}
                        <div style={{
                            backgroundColor: token.colorBgElevated,
                            border: `1px solid ${token.colorBorder}`,
                            borderRadius: '6px',
                            padding: '12px'
                        }}>
                            <p style={{ color: token.colorText, fontWeight: 'bold', marginBottom: '8px', margin: '0 0 8px 0', fontSize: '12px' }}>
                                Required Columns
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                <div>
                                    <p style={{ color: token.colorSuccess, fontWeight: 'bold', margin: '0 0 2px 0', fontSize: '11px' }}>
                                        ✓ first_name
                                    </p>
                                    <p style={{ color: token.colorTextSecondary, margin: '0', fontSize: '11px' }}>
                                        First name
                                    </p>
                                </div>
                                <div>
                                    <p style={{ color: token.colorSuccess, fontWeight: 'bold', margin: '0 0 2px 0', fontSize: '11px' }}>
                                        ✓ surname
                                    </p>
                                    <p style={{ color: token.colorTextSecondary, margin: '0', fontSize: '11px' }}>
                                        Last name
                                    </p>
                                </div>
                                <div>
                                    <p style={{ color: token.colorSuccess, fontWeight: 'bold', margin: '0 0 2px 0', fontSize: '11px' }}>
                                        ✓ email
                                    </p>
                                    <p style={{ color: token.colorTextSecondary, margin: '0', fontSize: '11px' }}>
                                        Unique email
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        </AdminSidebarLayout>
    );
}
