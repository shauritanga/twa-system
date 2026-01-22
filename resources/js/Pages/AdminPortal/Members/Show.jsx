import React, { useState } from 'react';
import AdminSidebarLayout from '../../../Layouts/AdminSidebarLayout';
import { useForm, router, usePage } from '@inertiajs/react';
import {
    Card,
    Row,
    Col,
    Button,
    Space,
    Table,
    Modal,
    Form,
    Input,
    Select,
    DatePicker,
    Upload,
    message,
    Tabs,
    Tag,
    Avatar,
    Divider,
    Descriptions,
    theme,
    Dropdown,
    Breadcrumb,
} from 'antd';
import {
    PlusOutlined,
    DeleteOutlined,
    EditOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    UploadOutlined,
    DownloadOutlined,
    MoreOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

export default function MemberShow() {
    const { member = {} } = usePage().props;
    const { token } = theme.useToken();
    const [form] = Form.useForm();
    const [dependentForm] = Form.useForm();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDependentModalOpen, setIsDependentModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedDependents, setSelectedDependents] = useState([]);
    const [rejectionReason, setRejectionReason] = useState('');
    const [showRejectionModal, setShowRejectionModal] = useState(false);
    const [rejectingDependentId, setRejectingDependentId] = useState(null);
    const [deleteConfirmModal, setDeleteConfirmModal] = useState(false);
    const [activeTab, setActiveTab] = useState('details');

    const handleEditMember = () => {
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
        setIsEditModalOpen(true);
    };

    const handleSubmitMember = async (values) => {
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

        router.post(route('members.update', member.id), formData, {
            onSuccess: () => {
                message.success('Member updated successfully');
                setIsEditModalOpen(false);
            },
            onError: () => {
                message.error('Failed to update member');
            },
            onFinish: () => setLoading(false),
        });
    };

    const handleAddDependent = () => {
        dependentForm.resetFields();
        setIsDependentModalOpen(true);
    };

    const handleSubmitDependent = async (values) => {
        setLoading(true);
        const formData = new FormData();

        formData.append('name', values.name);
        formData.append('relationship', values.relationship || '');
        formData.append('date_of_birth', values.date_of_birth?.format('YYYY-MM-DD'));
        formData.append('tribe', values.tribe || '');
        formData.append('residence', values.residence || '');
        formData.append('member_id', member.id);

        if (values.image && values.image.file) {
            formData.append('image', values.image.file);
        }

        router.post(route('dependents.store'), formData, {
            onSuccess: () => {
                message.success('Dependent added successfully');
                setIsDependentModalOpen(false);
                dependentForm.resetFields();
            },
            onError: () => {
                message.error('Failed to add dependent');
            },
            onFinish: () => setLoading(false),
        });
    };

    const handleApproveDependents = () => {
        if (selectedDependents.length === 0) {
            message.warning('Please select dependents to approve');
            return;
        }

        Modal.confirm({
            title: 'Approve Dependents',
            content: `Are you sure you want to approve ${selectedDependents.length} dependent(s)?`,
            okText: 'Yes',
            cancelText: 'No',
            onOk() {
                selectedDependents.forEach(dependentId => {
                    router.post(route('dependents.approve', dependentId), {}, {
                        onSuccess: () => {
                            message.success('Dependent approved');
                            setSelectedDependents([]);
                        },
                        onError: () => {
                            message.error('Failed to approve dependent');
                        },
                    });
                });
            },
        });
    };

    const handleRejectDependent = (dependentId) => {
        setRejectingDependentId(dependentId);
        setShowRejectionModal(true);
    };

    const handleSubmitRejection = () => {
        if (!rejectionReason.trim()) {
            message.warning('Please provide a rejection reason');
            return;
        }

        router.post(route('dependents.reject', rejectingDependentId), {
            reason: rejectionReason,
        }, {
            onSuccess: () => {
                message.success('Dependent rejected');
                setShowRejectionModal(false);
                setRejectionReason('');
                setRejectingDependentId(null);
            },
            onError: () => {
                message.error('Failed to reject dependent');
            },
        });
    };

    const handleDeleteMember = () => {
        setDeleteConfirmModal(true);
    };

    const confirmDeleteMember = () => {
        router.delete(route('members.destroy', member.id), {
            onSuccess: () => {
                message.success('Member archived successfully');
                router.visit(route('admin-portal.members.index'));
            },
            onError: () => {
                message.error('Failed to archive member');
            },
        });
    };

    const dependentColumns = [
        {
            title: 'Dependent',
            dataIndex: 'name',
            key: 'name',
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
                        <div style={{ fontSize: '12px', color: token.colorTextSecondary }}>
                            {record.relationship}
                        </div>
                    </div>
                </Space>
            ),
        },
        {
            title: 'DOB',
            dataIndex: 'date_of_birth',
            key: 'date_of_birth',
            render: (date) => date ? new Date(date).toLocaleDateString() : '-',
        },
        {
            title: 'Tribe',
            dataIndex: 'tribe',
            key: 'tribe',
        },
        {
            title: 'Residence',
            dataIndex: 'residence',
            key: 'residence',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                const colors = {
                    approved: 'green',
                    rejected: 'red',
                    pending: 'orange',
                };
                return <Tag color={colors[status] || 'default'}>{status}</Tag>;
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 80,
            render: (_, record) => {
                const items = [];
                if (record.status === 'pending') {
                    items.push({
                        key: 'approve',
                        label: 'Approve',
                        icon: <CheckCircleOutlined />,
                        onClick: () => {
                            router.post(route('dependents.approve', record.id), {}, {
                                onSuccess: () => message.success('Dependent approved'),
                                onError: () => message.error('Failed to approve'),
                            });
                        },
                    });
                    items.push({
                        key: 'reject',
                        label: 'Reject',
                        icon: <CloseCircleOutlined />,
                        danger: true,
                        onClick: () => handleRejectDependent(record.id),
                    });
                } else if (record.status === 'rejected') {
                    items.push({
                        key: 'rejected',
                        label: 'Rejected',
                        disabled: true,
                    });
                } else if (record.status === 'approved') {
                    items.push({
                        key: 'approved',
                        label: 'Approved',
                        disabled: true,
                    });
                }
                return (
                    <Dropdown menu={{ items }} trigger={['click']}>
                        <Button type="text" icon={<MoreOutlined />} />
                    </Dropdown>
                );
            },
        },
    ];

    const tabItems = [
        {
            key: 'details',
            label: 'Member Details',
            children: (
                <div style={{ marginTop: '16px' }}>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={16}>
                            <Card title="Personal Information">
                                <Descriptions column={2} size="small">
                                    <Descriptions.Item label="First Name">
                                        {member.first_name}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Middle Name">
                                        {member.middle_name || '-'}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Surname">
                                        {member.surname}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Sex">
                                        {member.sex}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Date of Birth">
                                        {member.date_of_birth ? new Date(member.date_of_birth).toLocaleDateString() : '-'}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Place of Birth">
                                        {member.place_of_birth}
                                    </Descriptions.Item>
                                </Descriptions>

                                <Divider />

                                <h4 style={{ fontWeight: 'bold', marginBottom: '12px' }}>Contact Information</h4>
                                <Descriptions column={1} size="small">
                                    <Descriptions.Item label="Email">
                                        {member.email}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Phone">
                                        {member.phone_number}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Address">
                                        {member.address}
                                    </Descriptions.Item>
                                </Descriptions>

                                <Divider />

                                <h4 style={{ fontWeight: 'bold', marginBottom: '12px' }}>Additional Information</h4>
                                <Descriptions column={2} size="small">
                                    <Descriptions.Item label="Tribe">
                                        {member.tribe || '-'}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Occupation">
                                        {member.occupation || '-'}
                                    </Descriptions.Item>
                                </Descriptions>
                                {member.reason_for_membership && (
                                    <>
                                        <Divider />
                                        <h4 style={{ fontWeight: 'bold', marginBottom: '12px' }}>Reason for Membership</h4>
                                        <p>{member.reason_for_membership}</p>
                                    </>
                                )}
                            </Card>
                        </Col>
                        <Col xs={24} md={8}>
                            <Card title="Member Status">
                                <div style={{ marginBottom: '16px' }}>
                                    <div style={{ color: token.colorTextSecondary, marginBottom: '8px' }}>
                                        Verification Status
                                    </div>
                                    <Tag color={member.is_verified ? 'green' : 'orange'} style={{ fontSize: '14px', padding: '4px 12px' }}>
                                        {member.is_verified ? 'Verified' : 'Pending'}
                                    </Tag>
                                </div>
                                <div style={{ marginBottom: '16px' }}>
                                    <div style={{ color: token.colorTextSecondary, marginBottom: '8px' }}>
                                        Member Since
                                    </div>
                                    <div style={{ fontWeight: 'bold' }}>
                                        {member.created_at ? new Date(member.created_at).toLocaleDateString() : '-'}
                                    </div>
                                </div>
                                {member.image_path && (
                                    <div>
                                        <div style={{ color: token.colorTextSecondary, marginBottom: '8px' }}>
                                            Profile Image
                                        </div>
                                        <img
                                            src={`/storage/${member.image_path}`}
                                            alt={member.name}
                                            style={{ maxWidth: '100%', borderRadius: '8px' }}
                                        />
                                    </div>
                                )}
                            </Card>
                        </Col>
                    </Row>
                </div>
            ),
        },
        {
            key: 'dependents',
            label: `Dependents (${member.dependents?.length || 0})`,
            children: (
                <div style={{ marginTop: '16px' }}>
                    <Card>
                        {selectedDependents.length > 0 && (
                            <Space style={{ marginBottom: '16px' }}>
                                <Button
                                    type="primary"
                                    icon={<CheckCircleOutlined />}
                                    onClick={handleApproveDependents}
                                >
                                    Approve Selected ({selectedDependents.length})
                                </Button>
                                <Button
                                    onClick={() => setSelectedDependents([])}
                                >
                                    Clear Selection
                                </Button>
                            </Space>
                        )}

                        <Table
                            columns={dependentColumns}
                            dataSource={member.dependents || []}
                            rowKey="id"
                            pagination={{ pageSize: 10 }}
                            rowSelection={{
                                selectedRowKeys: selectedDependents,
                                onChange: (selectedKeys) => setSelectedDependents(selectedKeys),
                                getCheckboxProps: (record) => ({
                                    disabled: record.status !== 'pending',
                                }),
                            }}
                        />
                    </Card>
                </div>
            ),
        },
        {
            key: 'documents',
            label: 'Documents',
            children: (
                <div style={{ marginTop: '16px' }}>
                    <Card>
                        {member.application_form_path ? (
                            <div>
                                <h4 style={{ fontWeight: 'bold', marginBottom: '12px' }}>Application Form</h4>
                                <Button
                                    icon={<DownloadOutlined />}
                                    onClick={() => router.visit(route('admin.members.application-form', member.id))}
                                >
                                    Download Application Form
                                </Button>
                            </div>
                        ) : (
                            <p style={{ color: token.colorTextSecondary }}>No application form uploaded</p>
                        )}
                    </Card>
                </div>
            ),
        },
    ];

    return (
        <AdminSidebarLayout>
            <div style={{ padding: '24px 0' }}>
                {/* Header */}
                <div style={{ marginBottom: '24px' }}>
                    <Breadcrumb
                        items={[
                            {
                                title: (
                                    <span
                                        onClick={() => router.visit(route('admin-portal.members.index'))}
                                        style={{ cursor: 'pointer', color: token.colorPrimary }}
                                    >
                                        Members
                                    </span>
                                ),
                            },
                            {
                                title: member.name,
                            },
                        ]}
                        style={{ marginBottom: '24px' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Dropdown
                            menu={{
                                items: [
                                    {
                                        key: 'edit',
                                        label: 'Edit Member',
                                        icon: <EditOutlined />,
                                        onClick: handleEditMember,
                                    },
                                    {
                                        key: 'archive',
                                        label: 'Archive Member',
                                        icon: <DeleteOutlined />,
                                        danger: true,
                                        onClick: handleDeleteMember,
                                    },
                                ],
                            }}
                            trigger={['click']}
                        >
                            <Button type="text" icon={<MoreOutlined />} size="large" />
                        </Dropdown>
                    </div>
                </div>

                {/* Tabs */}
                <Card>
                    <div style={{ position: 'relative' }}>
                        <Tabs 
                            items={tabItems} 
                            activeKey={activeTab}
                            onChange={setActiveTab}
                        />
                        {activeTab === 'dependents' && (
                            <div style={{ position: 'absolute', top: '0', right: '0', display: 'flex', alignItems: 'center', height: '40px' }}>
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={handleAddDependent}
                                    size="small"
                                >
                                    Add Dependent
                                </Button>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Edit Member Modal */}
                <Modal
                    title="Edit Member"
                    open={isEditModalOpen}
                    onCancel={() => setIsEditModalOpen(false)}
                    width={600}
                    centered
                    footer={[
                        <Button key="cancel" onClick={() => setIsEditModalOpen(false)}>
                            Cancel
                        </Button>,
                        <Button key="submit" type="primary" loading={loading} onClick={() => form.submit()}>
                            Update Member
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
                        onFinish={handleSubmitMember}
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
                            <Input.TextArea rows={3} />
                        </Form.Item>
                    </Form>
                </Modal>

                {/* Add Dependent Modal */}
                <Modal
                    title="Add Dependent"
                    open={isDependentModalOpen}
                    onCancel={() => setIsDependentModalOpen(false)}
                    width={600}
                    centered
                    footer={[
                        <Button key="cancel" onClick={() => setIsDependentModalOpen(false)}>
                            Cancel
                        </Button>,
                        <Button key="submit" type="primary" loading={loading} onClick={() => dependentForm.submit()}>
                            Add Dependent
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
                        form={dependentForm}
                        layout="vertical"
                        onFinish={handleSubmitDependent}
                        autoComplete="off"
                        style={{
                            color: token.colorText
                        }}
                    >
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[{ required: true, message: 'Name is required' }]}
                            labelCol={{ style: { color: token.colorText } }}
                        >
                            <Input 
                                placeholder="Enter dependent name"
                                style={{
                                    backgroundColor: token.colorBgContainer,
                                    borderColor: token.colorBorder,
                                    color: token.colorText
                                }}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Relationship"
                            name="relationship"
                            labelCol={{ style: { color: token.colorText } }}
                        >
                            <Input 
                                placeholder="e.g., Son, Daughter, Spouse"
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
                            label="Tribe"
                            name="tribe"
                            labelCol={{ style: { color: token.colorText } }}
                        >
                            <Input 
                                style={{
                                    backgroundColor: token.colorBgContainer,
                                    borderColor: token.colorBorder,
                                    color: token.colorText
                                }}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Residence"
                            name="residence"
                            labelCol={{ style: { color: token.colorText } }}
                        >
                            <Input 
                                style={{
                                    backgroundColor: token.colorBgContainer,
                                    borderColor: token.colorBorder,
                                    color: token.colorText
                                }}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Image"
                            name="image"
                            valuePropName="file"
                            labelCol={{ style: { color: token.colorText } }}
                        >
                            <Upload maxCount={1} accept="image/*" beforeUpload={() => false}>
                                <Button icon={<UploadOutlined />}>Upload Image</Button>
                            </Upload>
                        </Form.Item>
                    </Form>
                </Modal>

                {/* Rejection Modal */}
                <Modal
                    title="Reject Dependent"
                    open={showRejectionModal}
                    onCancel={() => {
                        setShowRejectionModal(false);
                        setRejectionReason('');
                    }}
                    onOk={handleSubmitRejection}
                    okText="Reject"
                    cancelText="Cancel"
                    centered
                    styles={{ 
                        mask: { backgroundColor: 'rgba(0, 0, 0, 0.45)' }
                    }}
                >
                    <Form layout="vertical">
                        <Form.Item label="Rejection Reason" required>
                            <Input.TextArea
                                rows={4}
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="Enter reason for rejection"
                            />
                        </Form.Item>
                    </Form>
                </Modal>

                {/* Delete Confirmation Modal */}
                <Modal
                    title="Archive Member"
                    open={deleteConfirmModal}
                    onCancel={() => setDeleteConfirmModal(false)}
                    onOk={confirmDeleteMember}
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
            </div>
        </AdminSidebarLayout>
    );
}
