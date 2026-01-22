import React, { useState, useEffect } from 'react';
import AdminSidebarLayout from '../../../Layouts/AdminSidebarLayout';
import { usePage, router } from '@inertiajs/react';
import {
    Table,
    Card,
    Button,
    Space,
    Input,
    Row,
    Col,
    Modal,
    message,
    Tag,
    Avatar,
    Dropdown,
    theme,
    Empty,
    Breadcrumb,
} from 'antd';
import {
    DeleteOutlined,
    UndoOutlined,
    SearchOutlined,
    ExclamationCircleOutlined,
    MoreOutlined,
} from '@ant-design/icons';

export default function ArchivedMembers() {
    const { archivedMembers = [] } = usePage().props;
    const { token } = theme.useToken();
    const [searchText, setSearchText] = useState('');
    const [filteredMembers, setFilteredMembers] = useState(archivedMembers);
    const [deleteConfirmation, setDeleteConfirmation] = useState('');
    const [deletingMember, setDeletingMember] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showRestoreModal, setShowRestoreModal] = useState(false);
    const [restoringMember, setRestoringMember] = useState(null);

    // Filter archived members based on search
    useEffect(() => {
        const filtered = archivedMembers.filter(member =>
            member.name.toLowerCase().includes(searchText.toLowerCase()) ||
            member.email.toLowerCase().includes(searchText.toLowerCase()) ||
            (member.phone_number && member.phone_number.includes(searchText))
        );
        setFilteredMembers(filtered);
    }, [searchText, archivedMembers]);

    const handleRestore = (member) => {
        setRestoringMember(member);
        setShowRestoreModal(true);
    };

    const confirmRestore = () => {
        router.post(route('members.restore', restoringMember.id), {}, {
            onSuccess: () => {
                message.success('Member restored successfully');
                setShowRestoreModal(false);
                setRestoringMember(null);
            },
            onError: () => {
                message.error('Failed to restore member');
            },
        });
    };

    const handlePermanentDelete = () => {
        if (deleteConfirmation !== deletingMember?.name) {
            message.error('Member name does not match');
            return;
        }

        router.delete(route('members.force-delete', deletingMember.id), {
            onSuccess: () => {
                message.success('Member permanently deleted from the system');
                setShowDeleteModal(false);
                setDeleteConfirmation('');
                setDeletingMember(null);
            },
            onError: () => {
                message.error('Failed to permanently delete member');
            },
        });
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
            title: 'Archived Date',
            dataIndex: 'deleted_at',
            key: 'deleted_at',
            width: 130,
            render: (date) => date ? new Date(date).toLocaleDateString() : '-',
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 80,
            fixed: 'right',
            render: (_, record) => {
                const items = [
                    {
                        key: 'restore',
                        label: 'Restore',
                        icon: <UndoOutlined />,
                        onClick: () => handleRestore(record),
                    },
                    {
                        key: 'delete',
                        label: 'Permanently Delete',
                        icon: <DeleteOutlined />,
                        danger: true,
                        onClick: () => {
                            setDeletingMember(record);
                            setShowDeleteModal(true);
                        },
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
                                title: 'Archived',
                            },
                        ]}
                        style={{ marginBottom: '24px' }}
                    />
                </div>

                {/* Warning Alert */}
                <Card
                    style={{
                        marginBottom: '24px',
                        backgroundColor: token.colorWarningBg,
                        borderColor: token.colorWarning,
                        border: `1px solid ${token.colorWarning}`,
                    }}
                >
                    <Space>
                        <ExclamationCircleOutlined style={{ color: token.colorWarning, fontSize: '18px' }} />
                        <div>
                            <strong style={{ color: token.colorText }}>Archived Members</strong>
                            <p style={{ margin: '4px 0 0 0', color: token.colorTextSecondary }}>
                                These members have been archived. You can restore them or permanently delete them from the system.
                            </p>
                        </div>
                    </Space>
                </Card>

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
                                style={{
                                    backgroundColor: token.colorBgContainer,
                                    borderColor: token.colorBorder,
                                    color: token.colorText
                                }}
                            />
                        </Col>
                    </Row>
                </Card>

                {/* Archived Members Table */}
                {filteredMembers.length > 0 ? (
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
                ) : (
                    <Card>
                        <Empty
                            description={searchText ? 'No archived members found' : 'No archived members'}
                            style={{ padding: '48px 0' }}
                        />
                    </Card>
                )}

                {/* Permanent Delete Modal */}
                <Modal
                    title="Permanently Delete Member"
                    open={showDeleteModal}
                    onCancel={() => {
                        setShowDeleteModal(false);
                        setDeleteConfirmation('');
                        setDeletingMember(null);
                    }}
                    onOk={handlePermanentDelete}
                    okText="Delete"
                    okButtonProps={{ danger: true, disabled: deleteConfirmation !== deletingMember?.name }}
                    cancelText="Cancel"
                    width={600}
                    centered
                    styles={{ 
                        body: { 
                            maxHeight: 'calc(100vh - 240px)', 
                            overflowY: 'auto',
                            paddingBottom: '16px'
                        },
                        mask: { backgroundColor: 'rgba(0, 0, 0, 0.45)' }
                    }}
                >
                    <div style={{ marginBottom: '16px' }}>
                        <p style={{ color: token.colorError, fontWeight: 'bold', marginBottom: '12px' }}>
                            ⚠️ This action cannot be undone!
                        </p>
                        <p style={{ color: token.colorText }}>
                            You are about to permanently delete <strong>{deletingMember?.name}</strong> from the system.
                            All associated data will be removed.
                        </p>
                        <p style={{ marginTop: '12px', color: token.colorTextSecondary }}>
                            To confirm, please type the member's name below:
                        </p>
                    </div>
                    <input
                        type="text"
                        placeholder="Type member name to confirm"
                        value={deleteConfirmation}
                        onChange={(e) => setDeleteConfirmation(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: `1px solid ${token.colorBorder}`,
                            borderRadius: '4px',
                            fontSize: '14px',
                            backgroundColor: token.colorBgContainer,
                            color: token.colorText,
                        }}
                    />
                </Modal>

                {/* Restore Confirmation Modal */}
                <Modal
                    title="Restore Member"
                    open={showRestoreModal}
                    onCancel={() => {
                        setShowRestoreModal(false);
                        setRestoringMember(null);
                    }}
                    onOk={confirmRestore}
                    okText="Restore"
                    cancelText="Cancel"
                    centered
                    styles={{ 
                        mask: { backgroundColor: 'rgba(0, 0, 0, 0.45)' }
                    }}
                >
                    <p>Are you sure you want to restore <strong>{restoringMember?.name}</strong>?</p>
                    <p style={{ color: token.colorTextSecondary, fontSize: '12px' }}>
                        This member will be restored to the active members list.
                    </p>
                </Modal>
            </div>
        </AdminSidebarLayout>
    );
}
