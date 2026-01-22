import React, { useState } from 'react';
import AdminSidebarLayout from '@/Layouts/AdminSidebarLayout';
import { router } from '@inertiajs/react';
import { 
    Card, 
    Table, 
    Button, 
    Space, 
    Tag, 
    theme, 
    message, 
    Modal, 
    Input,
    Dropdown,
    Statistic,
    Row,
    Col,
    Alert,
} from 'antd';
import { 
    DownloadOutlined, 
    DeleteOutlined, 
    PlusOutlined, 
    DatabaseOutlined,
    ClearOutlined,
    MoreOutlined,
    CloudDownloadOutlined,
    ExclamationCircleOutlined,
} from '@ant-design/icons';

export default function Backups({ backups, settings }) {
    const { token } = theme.useToken();
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [backupToDelete, setBackupToDelete] = useState(null);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');

    const handleCreateBackup = () => {
        setLoading(true);
        messageApi.loading('Creating backup...', 0);

        window.axios.post('/admin-portal/backups/create')
            .then(response => {
                messageApi.destroy();
                messageApi.success(response.data.message);
                router.reload({ only: ['backups'] });
            })
            .catch(error => {
                messageApi.destroy();
                messageApi.error(error.response?.data?.message || 'Failed to create backup');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleCreateDatabaseBackup = () => {
        setLoading(true);
        messageApi.loading('Creating database backup...', 0);

        window.axios.post('/admin-portal/backups/create-database')
            .then(response => {
                messageApi.destroy();
                messageApi.success(response.data.message);
                router.reload({ only: ['backups'] });
            })
            .catch(error => {
                messageApi.destroy();
                messageApi.error(error.response?.data?.message || 'Failed to create database backup');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleDownload = (filename) => {
        window.location.href = `/admin-portal/backups/download/${filename}`;
        messageApi.success('Downloading backup...');
    };

    const handleDeleteClick = (backup) => {
        setBackupToDelete(backup);
        setDeleteConfirmText('');
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (backupToDelete) {
            window.axios.delete(`/admin-portal/backups/${backupToDelete.filename}`)
                .then(response => {
                    messageApi.success(response.data.message);
                    setDeleteModalOpen(false);
                    setBackupToDelete(null);
                    setDeleteConfirmText('');
                    router.reload({ only: ['backups'] });
                })
                .catch(error => {
                    messageApi.error(error.response?.data?.message || 'Failed to delete backup');
                });
        }
    };

    const handleCleanOld = () => {
        Modal.confirm({
            title: 'Clean Old Backups',
            icon: <ExclamationCircleOutlined />,
            content: 'This will delete all backups older than the retention period. Continue?',
            okText: 'Clean',
            okType: 'danger',
            onOk() {
                return window.axios.post('/admin-portal/backups/clean')
                    .then(response => {
                        messageApi.success(response.data.message);
                        router.reload({ only: ['backups'] });
                    })
                    .catch(error => {
                        messageApi.error(error.response?.data?.message || 'Failed to clean backups');
                    });
            },
        });
    };

    const getActionItems = (backup) => [
        {
            key: 'download',
            label: 'Download',
            icon: <DownloadOutlined />,
            onClick: () => handleDownload(backup.filename),
        },
        {
            key: 'delete',
            label: 'Delete',
            icon: <DeleteOutlined />,
            danger: true,
            onClick: () => handleDeleteClick(backup),
        },
    ];

    const columns = [
        {
            title: 'Filename',
            dataIndex: 'filename',
            key: 'filename',
            ellipsis: true,
            render: (filename) => (
                <span style={{ fontSize: '13px', fontFamily: 'monospace' }}>{filename}</span>
            ),
        },
        {
            title: 'Size',
            dataIndex: 'size',
            key: 'size',
            width: 120,
            render: (size) => <span style={{ fontSize: '13px' }}>{size}</span>,
        },
        {
            title: 'Created',
            dataIndex: 'age',
            key: 'age',
            width: 150,
            render: (age) => <span style={{ fontSize: '13px' }}>{age}</span>,
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 70,
            fixed: 'right',
            render: (_, record) => (
                <Dropdown
                    menu={{ items: getActionItems(record) }}
                    trigger={['click']}
                >
                    <Button type="text" size="small" icon={<MoreOutlined />} />
                </Dropdown>
            ),
        },
    ];

    const totalSize = backups.reduce((acc, backup) => {
        const sizeMatch = backup.size.match(/[\d.]+/);
        const size = sizeMatch ? parseFloat(sizeMatch[0]) : 0;
        const unit = backup.size.match(/[A-Z]+/)?.[0];
        
        let sizeInMB = size;
        if (unit === 'GB') sizeInMB = size * 1024;
        if (unit === 'KB') sizeInMB = size / 1024;
        
        return acc + sizeInMB;
    }, 0);

    return (
        <AdminSidebarLayout>
            {contextHolder}
            
            {/* Statistics Cards */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Total Backups"
                            value={backups.length}
                            prefix={<CloudDownloadOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Total Size"
                            value={totalSize.toFixed(2)}
                            suffix="MB"
                            prefix={<DatabaseOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Auto Backup"
                            value={settings.auto_backup_enabled ? 'Enabled' : 'Disabled'}
                            valueStyle={{ 
                                fontSize: '20px',
                                color: settings.auto_backup_enabled ? token.colorSuccess : token.colorTextSecondary 
                            }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Frequency"
                            value={settings.backup_frequency}
                            valueStyle={{ fontSize: '20px', textTransform: 'capitalize' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Info Alert */}
            <Alert
                message="Backup Information"
                description="Backups include your database and important files. Database-only backups are faster and smaller. Download backups regularly and store them securely."
                type="info"
                showIcon
                closable
                style={{ marginBottom: 24 }}
            />

            {/* Main Card */}
            <Card>
                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <Space wrap>
                        <Button
                            icon={<ClearOutlined />}
                            onClick={handleCleanOld}
                            disabled={backups.length === 0}
                        >
                            Clean Old
                        </Button>
                    </Space>
                    <Space wrap>
                        <Button
                            type="default"
                            icon={<DatabaseOutlined />}
                            onClick={handleCreateDatabaseBackup}
                            loading={loading}
                        >
                            Database Only
                        </Button>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={handleCreateBackup}
                            loading={loading}
                        >
                            Full Backup
                        </Button>
                    </Space>
                </div>

                <Table
                    columns={columns}
                    dataSource={backups}
                    rowKey="filename"
                    size="small"
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: false,
                        showTotal: (total) => <span style={{ fontSize: '13px' }}>Total {total} backups</span>,
                    }}
                    locale={{
                        emptyText: 'No backups found. Create your first backup to get started.',
                    }}
                />
            </Card>

            {/* Delete Confirmation Modal */}
            <Modal
                title="Delete Backup"
                open={deleteModalOpen}
                onCancel={() => {
                    setDeleteModalOpen(false);
                    setBackupToDelete(null);
                    setDeleteConfirmText('');
                }}
                onOk={handleDeleteConfirm}
                okText="Delete"
                okButtonProps={{ 
                    danger: true,
                    disabled: deleteConfirmText !== backupToDelete?.filename,
                }}
            >
                <p>Are you sure you want to delete this backup?</p>
                <p><strong>{backupToDelete?.filename}</strong></p>
                <p>Type the filename to confirm:</p>
                <Input
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    placeholder="Type filename here"
                />
            </Modal>
        </AdminSidebarLayout>
    );
}
