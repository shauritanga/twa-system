import React, { useState } from 'react';
import AdminSidebarLayout from '../../Layouts/AdminSidebarLayout';
import { usePage, router, Head } from '@inertiajs/react';
import {
    Card,
    Row,
    Col,
    Table,
    Button,
    Input,
    Space,
    Tabs,
    Tag,
    Statistic,
    theme,
    message,
    Dropdown,
    Select,
    Modal,
} from 'antd';
import {
    DollarOutlined,
    SearchOutlined,
    DownloadOutlined,
    PlusOutlined,
    UploadOutlined,
    EditOutlined,
    DeleteOutlined,
    CheckOutlined,
    CheckCircleOutlined,
    BankOutlined,
    MoreOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import ContributionFormAnt from '../../Components/ContributionFormAnt';
import LoanFormAnt from '../../Components/LoanFormAnt';
import DisbursementFormAnt from '../../Components/DisbursementFormAnt';

export default function Financials() {
    const { 
        members = [], 
        allMembers = [], 
        monthlyContributionsByMonth = {}, 
        memberMonthlyTotal = {}, // Monthly contributions per member
        memberOtherTotal = {}, // Other contributions per member
        otherContributions = {}, 
        otherContributionsSummary = [],
        loans = {},
        penalties = {},
        disasterPayments = {},
        statistics = {},
        filters = {}
    } = usePage().props;
    
    const { token } = theme.useToken();
    const [activeTab, setActiveTab] = useState(filters.tab || 'contributions');
    const [searchText, setSearchText] = useState(filters.search || '');
    const [selectedYear, setSelectedYear] = useState(filters.year || new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(filters.month || '');
    
    // Sync activeTab with filters when they change (after page reload)
    React.useEffect(() => {
        if (filters.tab && filters.tab !== activeTab) {
            setActiveTab(filters.tab);
        }
    }, [filters.tab]);
    
    // Modal states
    const [showContributionForm, setShowContributionForm] = useState(false);
    const [contributionFormType, setContributionFormType] = useState('monthly'); // Track which type to show
    const [showLoanForm, setShowLoanForm] = useState(false);
    const [showDisbursementForm, setShowDisbursementForm] = useState(false);
    const [editingLoan, setEditingLoan] = useState(null);

    // Helper function to open contribution form with specific type
    const openContributionForm = (type) => {
        // Close first if already open
        if (showContributionForm) {
            setShowContributionForm(false);
            // Wait for modal to close before opening with new type
            setTimeout(() => {
                setContributionFormType(type);
                setShowContributionForm(true);
            }, 100);
        } else {
            setContributionFormType(type);
            setShowContributionForm(true);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-TZ', {
            style: 'currency',
            currency: 'TZS',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount || 0);
    };

    // Generate year options from 2018 to current year
    const yearOptions = Array.from({ length: new Date().getFullYear() - 2018 + 1 }, (_, i) => ({
        label: String(2018 + i),
        value: 2018 + i,
    })).reverse();

    // Generate month options
    const monthOptions = [
        { label: 'All Months', value: '' },
        { label: 'January', value: 1 },
        { label: 'February', value: 2 },
        { label: 'March', value: 3 },
        { label: 'April', value: 4 },
        { label: 'May', value: 5 },
        { label: 'June', value: 6 },
        { label: 'July', value: 7 },
        { label: 'August', value: 8 },
        { label: 'September', value: 9 },
        { label: 'October', value: 10 },
        { label: 'November', value: 11 },
        { label: 'December', value: 12 },
    ];

    const handleFilterChange = () => {
        router.get(route('admin-portal.financials'), {
            search: searchText,
            year: selectedYear,
            month: selectedMonth,
            tab: activeTab, // Include current tab
        });
    };

    const handleClearFilter = () => {
        setSearchText('');
        setSelectedYear(new Date().getFullYear());
        setSelectedMonth('');
        router.get(route('admin-portal.financials'), {
            tab: activeTab, // Keep current tab when clearing
        });
    };

    // State for confirmation modals
    const [confirmModal, setConfirmModal] = useState({
        open: false,
        type: '',
        loan: null,
        confirmText: '',
        loading: false
    });

    const handleLoanAction = async (loanId, action) => {
        setConfirmModal(prev => ({ ...prev, loading: true }));
        
        try {
            let response;
            switch (action) {
                case 'disburse':
                    response = await window.axios.patch(route('loans.disburse', loanId));
                    break;
                case 'repaid':
                    response = await window.axios.patch(route('loans.markAsRepaid', loanId));
                    break;
                case 'delete':
                    response = await window.axios.delete(route('loans.destroy', loanId));
                    break;
                default:
                    throw new Error('Unknown action');
            }

            if (response.data.success) {
                message.success(response.data.message);
                setConfirmModal({ open: false, type: '', loan: null, confirmText: '', loading: false });
                // Reload page to show updated data
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
        } catch (error) {
            console.error('Error:', error);
            if (error.response?.data?.message) {
                message.error(error.response.data.message);
            } else {
                message.error(`Failed to ${action} loan. Please try again.`);
            }
        } finally {
            setConfirmModal(prev => ({ ...prev, loading: false }));
        }
    };

    const confirmLoanAction = (loan, action) => {
        setConfirmModal({
            open: true,
            type: action,
            loan: loan,
            confirmText: '',
            loading: false
        });
    };

    const handleConfirmModalOk = () => {
        const { type, loan, confirmText } = confirmModal;
        
        // For delete action, require typing the member name
        if (type === 'delete') {
            if (confirmText !== loan.member?.name) {
                message.error(`Please type "${loan.member?.name}" to confirm deletion`);
                return;
            }
        }
        
        handleLoanAction(loan.id, type);
    };

    const handleConfirmModalCancel = () => {
        setConfirmModal({ open: false, type: '', loan: null, confirmText: '', loading: false });
    };

    const handleMarkPenaltyAsPaid = async (penalty) => {
        try {
            await router.patch(route('penalties.markAsPaid', penalty.id), {}, {
                onSuccess: () => {
                    message.success(`Penalty for ${penalty.member.name} marked as paid successfully`);
                },
                onError: (errors) => {
                    message.error('Failed to mark penalty as paid');
                    console.error('Error:', errors);
                }
            });
        } catch (error) {
            message.error('An error occurred while marking penalty as paid');
            console.error('Error:', error);
        }
    };

    const getConfirmModalConfig = () => {
        const { type, loan } = confirmModal;
        
        switch (type) {
            case 'disburse':
                return {
                    title: (
                        <Space>
                            <BankOutlined style={{ color: '#1890ff' }} />
                            <span>Disburse Loan</span>
                        </Space>
                    ),
                    content: (
                        <div style={{ color: token.colorText }}>
                            <p style={{ 
                                marginBottom: '16px',
                                fontSize: '14px',
                                color: token.colorTextSecondary
                            }}>
                                Are you sure you want to disburse this loan?
                            </p>
                            <div style={{ 
                                background: token.colorBgElevated,
                                border: `1px solid ${token.colorBorder}`,
                                padding: '16px', 
                                borderRadius: '8px', 
                                marginBottom: '16px'
                            }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <div>
                                        <div style={{ 
                                            fontSize: '11px', 
                                            color: token.colorTextTertiary,
                                            textTransform: 'uppercase',
                                            fontWeight: 600,
                                            marginBottom: '4px'
                                        }}>
                                            Member
                                        </div>
                                        <div style={{ 
                                            fontSize: '14px',
                                            fontWeight: 500,
                                            color: token.colorText
                                        }}>
                                            {loan?.member?.name}
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ 
                                            fontSize: '11px', 
                                            color: token.colorTextTertiary,
                                            textTransform: 'uppercase',
                                            fontWeight: 600,
                                            marginBottom: '4px'
                                        }}>
                                            Principal
                                        </div>
                                        <div style={{ 
                                            fontSize: '14px',
                                            fontWeight: 600,
                                            color: token.colorPrimary,
                                            fontFamily: 'monospace'
                                        }}>
                                            {formatCurrency(loan?.amount)}
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ 
                                            fontSize: '11px', 
                                            color: token.colorTextTertiary,
                                            textTransform: 'uppercase',
                                            fontWeight: 600,
                                            marginBottom: '4px'
                                        }}>
                                            Interest Rate
                                        </div>
                                        <div style={{ 
                                            fontSize: '14px',
                                            fontWeight: 500,
                                            color: token.colorText
                                        }}>
                                            {loan?.interest_rate}% monthly
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ 
                                            fontSize: '11px', 
                                            color: token.colorTextTertiary,
                                            textTransform: 'uppercase',
                                            fontWeight: 600,
                                            marginBottom: '4px'
                                        }}>
                                            Total Amount
                                        </div>
                                        <div style={{ 
                                            fontSize: '14px',
                                            fontWeight: 600,
                                            color: token.colorSuccess,
                                            fontFamily: 'monospace'
                                        }}>
                                            {formatCurrency(loan?.total_amount || loan?.amount)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style={{ 
                                background: token.colorInfoBg,
                                border: `1px solid ${token.colorInfoBorder}`,
                                padding: '12px',
                                borderRadius: '6px',
                                fontSize: '13px',
                                color: token.colorTextSecondary
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ 
                                        width: '20px', 
                                        height: '20px', 
                                        borderRadius: '50%', 
                                        background: token.colorInfo,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '12px',
                                        color: 'white'
                                    }}>
                                        📊
                                    </div>
                                    <div>
                                        <strong style={{ color: token.colorInfo }}>Accounting Impact:</strong><br />
                                        This will create journal entries: Loans Receivable ↔ Cash
                                    </div>
                                </div>
                            </div>
                        </div>
                    ),
                    okText: 'Disburse Loan',
                    okType: 'primary'
                };
            case 'repaid':
                return {
                    title: (
                        <Space>
                            <CheckOutlined style={{ color: '#52c41a' }} />
                            <span>Mark Loan as Repaid</span>
                        </Space>
                    ),
                    content: (
                        <div style={{ color: token.colorText }}>
                            <p style={{ 
                                marginBottom: '16px',
                                fontSize: '14px',
                                color: token.colorTextSecondary
                            }}>
                                Are you sure you want to mark this loan as repaid?
                            </p>
                            <div style={{ 
                                background: token.colorBgElevated,
                                border: `1px solid ${token.colorBorder}`,
                                padding: '16px', 
                                borderRadius: '8px', 
                                marginBottom: '16px'
                            }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <div>
                                        <div style={{ 
                                            fontSize: '11px', 
                                            color: token.colorTextTertiary,
                                            textTransform: 'uppercase',
                                            fontWeight: 600,
                                            marginBottom: '4px'
                                        }}>
                                            Member
                                        </div>
                                        <div style={{ 
                                            fontSize: '14px',
                                            fontWeight: 500,
                                            color: token.colorText
                                        }}>
                                            {loan?.member?.name}
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ 
                                            fontSize: '11px', 
                                            color: token.colorTextTertiary,
                                            textTransform: 'uppercase',
                                            fontWeight: 600,
                                            marginBottom: '4px'
                                        }}>
                                            Principal
                                        </div>
                                        <div style={{ 
                                            fontSize: '14px',
                                            fontWeight: 500,
                                            color: token.colorText,
                                            fontFamily: 'monospace'
                                        }}>
                                            {formatCurrency(loan?.amount)}
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ 
                                            fontSize: '11px', 
                                            color: token.colorTextTertiary,
                                            textTransform: 'uppercase',
                                            fontWeight: 600,
                                            marginBottom: '4px'
                                        }}>
                                            Interest Earned
                                        </div>
                                        <div style={{ 
                                            fontSize: '14px',
                                            fontWeight: 500,
                                            color: token.colorWarning,
                                            fontFamily: 'monospace'
                                        }}>
                                            {formatCurrency((loan?.total_amount || loan?.amount) - loan?.amount)}
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ 
                                            fontSize: '11px', 
                                            color: token.colorTextTertiary,
                                            textTransform: 'uppercase',
                                            fontWeight: 600,
                                            marginBottom: '4px'
                                        }}>
                                            Total Repayment
                                        </div>
                                        <div style={{ 
                                            fontSize: '14px',
                                            fontWeight: 600,
                                            color: token.colorSuccess,
                                            fontFamily: 'monospace'
                                        }}>
                                            {formatCurrency(loan?.total_amount || loan?.amount)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style={{ 
                                background: token.colorInfoBg,
                                border: `1px solid ${token.colorInfoBorder}`,
                                padding: '12px',
                                borderRadius: '6px',
                                fontSize: '13px',
                                color: token.colorTextSecondary
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ 
                                        width: '20px', 
                                        height: '20px', 
                                        borderRadius: '50%', 
                                        background: token.colorInfo,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '12px',
                                        color: 'white'
                                    }}>
                                        📊
                                    </div>
                                    <div>
                                        <strong style={{ color: token.colorInfo }}>Accounting Impact:</strong><br />
                                        This will create journal entries: Cash ↔ Loans Receivable + Interest Income
                                    </div>
                                </div>
                            </div>
                        </div>
                    ),
                    okText: 'Mark as Repaid',
                    okType: 'primary'
                };
            case 'delete':
                return {
                    title: (
                        <Space>
                            <DeleteOutlined style={{ color: '#ff4d4f' }} />
                            <span>Delete Loan</span>
                        </Space>
                    ),
                    content: (
                        <div style={{ color: token.colorText }}>
                            <div style={{ 
                                background: token.colorErrorBg,
                                border: `1px solid ${token.colorErrorBorder}`,
                                padding: '12px',
                                borderRadius: '6px',
                                marginBottom: '16px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ 
                                        width: '20px', 
                                        height: '20px', 
                                        borderRadius: '50%', 
                                        background: token.colorError,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '12px',
                                        color: 'white'
                                    }}>
                                        ⚠️
                                    </div>
                                    <div>
                                        <div style={{ 
                                            color: token.colorError,
                                            fontWeight: 600,
                                            fontSize: '14px',
                                            marginBottom: '4px'
                                        }}>
                                            This action cannot be undone!
                                        </div>
                                        <div style={{ 
                                            fontSize: '13px',
                                            color: token.colorTextSecondary
                                        }}>
                                            You are about to permanently delete this loan.
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style={{ 
                                background: token.colorBgElevated,
                                border: `1px solid ${token.colorBorder}`,
                                padding: '16px', 
                                borderRadius: '8px', 
                                marginBottom: '16px'
                            }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <div>
                                        <div style={{ 
                                            fontSize: '11px', 
                                            color: token.colorTextTertiary,
                                            textTransform: 'uppercase',
                                            fontWeight: 600,
                                            marginBottom: '4px'
                                        }}>
                                            Member
                                        </div>
                                        <div style={{ 
                                            fontSize: '14px',
                                            fontWeight: 500,
                                            color: token.colorText
                                        }}>
                                            {loan?.member?.name}
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ 
                                            fontSize: '11px', 
                                            color: token.colorTextTertiary,
                                            textTransform: 'uppercase',
                                            fontWeight: 600,
                                            marginBottom: '4px'
                                        }}>
                                            Amount
                                        </div>
                                        <div style={{ 
                                            fontSize: '14px',
                                            fontWeight: 500,
                                            color: token.colorText,
                                            fontFamily: 'monospace'
                                        }}>
                                            {formatCurrency(loan?.amount)}
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ 
                                            fontSize: '11px', 
                                            color: token.colorTextTertiary,
                                            textTransform: 'uppercase',
                                            fontWeight: 600,
                                            marginBottom: '4px'
                                        }}>
                                            Purpose
                                        </div>
                                        <div style={{ 
                                            fontSize: '14px',
                                            fontWeight: 500,
                                            color: token.colorText
                                        }}>
                                            {loan?.purpose}
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ 
                                            fontSize: '11px', 
                                            color: token.colorTextTertiary,
                                            textTransform: 'uppercase',
                                            fontWeight: 600,
                                            marginBottom: '4px'
                                        }}>
                                            Status
                                        </div>
                                        <Tag 
                                            color="orange" 
                                            style={{ 
                                                fontSize: '11px',
                                                fontWeight: 500,
                                                margin: 0
                                            }}
                                        >
                                            {loan?.status}
                                        </Tag>
                                    </div>
                                </div>
                            </div>
                            <div style={{ marginBottom: '8px' }}>
                                <div style={{ 
                                    fontSize: '13px',
                                    color: token.colorTextSecondary,
                                    marginBottom: '8px'
                                }}>
                                    To confirm deletion, please type the member's name:
                                </div>
                                <div style={{ 
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    color: token.colorText,
                                    marginBottom: '8px',
                                    padding: '8px 12px',
                                    background: token.colorBgElevated,
                                    border: `1px solid ${token.colorBorder}`,
                                    borderRadius: '4px',
                                    fontFamily: 'monospace'
                                }}>
                                    {loan?.member?.name}
                                </div>
                            </div>
                            <Input
                                placeholder={`Type "${loan?.member?.name}" to confirm`}
                                value={confirmModal.confirmText}
                                onChange={(e) => setConfirmModal(prev => ({ ...prev, confirmText: e.target.value }))}
                                style={{ 
                                    backgroundColor: token.colorBgContainer,
                                    borderColor: token.colorBorder,
                                    color: token.colorText
                                }}
                            />
                        </div>
                    ),
                    okText: 'Delete Loan',
                    okType: 'danger'
                };
            default:
                return {};
        }
    };

    const handleTabChange = (key) => {
        setActiveTab(key);
        // Update URL with tab parameter without reloading
        router.get(route('admin-portal.financials'), {
            ...filters,
            tab: key,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const contributionColumns = [
        {
            title: 'Member',
            dataIndex: 'name',
            key: 'name',
            width: 200,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: 200,
        },
        {
            title: 'Phone',
            dataIndex: 'phone_number',
            key: 'phone_number',
            width: 150,
        },
        {
            title: 'Monthly Contributions',
            key: 'monthly_total',
            width: 150,
            render: (_, record) => {
                const total = memberMonthlyTotal[record.id] || 0;
                return formatCurrency(total);
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 120,
            render: (_, record) => (
                <Button
                    type="link"
                    onClick={() => router.visit(route('admin-portal.member-contributions', {
                        member: record.id,
                        year: selectedYear
                    }))}
                >
                    View Details
                </Button>
            ),
        },
    ];

    const otherContributionColumns = [
        {
            title: 'Member',
            dataIndex: ['member', 'name'],
            key: 'member_name',
            width: 200,
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            width: 150,
            render: (amount) => formatCurrency(amount),
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            width: 150,
            render: (date) => dayjs(date).format('DD MMM YYYY'),
        },
        {
            title: 'Purpose',
            dataIndex: 'purpose',
            key: 'purpose',
            width: 250,
        },
        {
            title: 'Notes',
            dataIndex: 'notes',
            key: 'notes',
            ellipsis: true,
        },
    ];

    const loanColumns = [
        {
            title: 'Member',
            dataIndex: ['member', 'name'],
            key: 'member_name',
            width: 180,
            render: (name) => (
                <div style={{ 
                    fontWeight: 500, 
                    fontSize: '14px',
                    color: token.colorText 
                }}>
                    {name}
                </div>
            ),
        },
        {
            title: 'Principal',
            dataIndex: 'amount',
            key: 'amount',
            width: 120,
            align: 'right',
            render: (amount) => (
                <div style={{ 
                    fontWeight: 500, 
                    fontSize: '13px',
                    color: token.colorText,
                    fontFamily: 'monospace'
                }}>
                    {formatCurrency(amount)}
                </div>
            ),
        },
        {
            title: 'Rate',
            dataIndex: 'interest_rate',
            key: 'interest_rate',
            width: 80,
            align: 'center',
            render: (rate) => (
                <Tag 
                    color="blue" 
                    style={{ 
                        fontSize: '11px',
                        fontWeight: 500,
                        margin: 0
                    }}
                >
                    {rate}%
                </Tag>
            ),
        },
        {
            title: 'Total Amount',
            dataIndex: 'total_amount',
            key: 'total_amount',
            width: 130,
            align: 'right',
            render: (amount, record) => (
                <div style={{ 
                    fontWeight: 600, 
                    fontSize: '13px',
                    color: token.colorPrimary,
                    fontFamily: 'monospace'
                }}>
                    {formatCurrency(amount || record.amount)}
                </div>
            ),
        },
        {
            title: 'Purpose',
            dataIndex: 'purpose',
            key: 'purpose',
            width: 160,
            ellipsis: true,
            render: (purpose) => (
                <div style={{ 
                    fontSize: '13px',
                    color: token.colorTextSecondary
                }}>
                    {purpose}
                </div>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            align: 'center',
            render: (status) => {
                const statusConfig = {
                    'pending': { color: 'orange', text: 'Pending' },
                    'disbursed': { color: 'blue', text: 'Disbursed' },
                    'repaid': { color: 'green', text: 'Repaid' }
                };
                const config = statusConfig[status] || { color: 'default', text: status?.toUpperCase() };
                return (
                    <Tag 
                        color={config.color}
                        style={{ 
                            fontSize: '11px',
                            fontWeight: 500,
                            margin: 0,
                            minWidth: '70px',
                            textAlign: 'center'
                        }}
                    >
                        {config.text}
                    </Tag>
                );
            },
        },
        {
            title: 'Date',
            dataIndex: 'disbursement_date',
            key: 'disbursement_date',
            width: 100,
            align: 'center',
            render: (date, record) => (
                <div style={{ 
                    fontSize: '12px',
                    color: token.colorTextTertiary
                }}>
                    {date ? dayjs(date).format('MMM DD') : dayjs(record.created_at).format('MMM DD')}
                </div>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 60,
            align: 'center',
            fixed: 'right',
            render: (_, record) => {
                const items = [];
                
                if (record.status === 'pending') {
                    items.push(
                        {
                            key: 'disburse',
                            label: 'Disburse',
                            icon: <BankOutlined />,
                            onClick: () => confirmLoanAction(record, 'disburse'),
                        },
                        {
                            key: 'edit',
                            label: 'Edit',
                            icon: <EditOutlined />,
                            onClick: () => setEditingLoan(record),
                        },
                        {
                            type: 'divider',
                        },
                        {
                            key: 'delete',
                            label: 'Delete',
                            icon: <DeleteOutlined />,
                            danger: true,
                            onClick: () => confirmLoanAction(record, 'delete'),
                        }
                    );
                } else if (record.status === 'disbursed') {
                    items.push(
                        {
                            key: 'repaid',
                            label: 'Mark as Repaid',
                            icon: <CheckOutlined />,
                            onClick: () => confirmLoanAction(record, 'repaid'),
                        }
                    );
                }
                
                return (
                    <Dropdown 
                        menu={{ items }} 
                        trigger={['click']} 
                        disabled={items.length === 0}
                        placement="bottomRight"
                    >
                        <Button 
                            type="text" 
                            icon={<MoreOutlined />} 
                            size="small"
                            style={{
                                color: token.colorTextTertiary,
                                border: 'none'
                            }}
                        />
                    </Dropdown>
                );
            },
        },
    ];

    const penaltyColumns = [
        {
            title: 'Member',
            dataIndex: ['member', 'name'],
            key: 'member_name',
            width: 200,
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount) => formatCurrency(amount),
        },
        {
            title: 'Reason',
            dataIndex: 'reason',
            key: 'reason',
            width: 200,
        },
        {
            title: 'Month',
            dataIndex: 'penalty_month',
            key: 'penalty_month',
            render: (month) => {
                if (!month) return 'N/A';
                const date = dayjs(month + '-01');
                return date.format('MMM YYYY');
            },
        },
        {
            title: 'Due Date',
            dataIndex: 'due_date',
            key: 'due_date',
            render: (date) => dayjs(date).format('DD MMM YYYY'),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'paid' ? 'green' : 'orange'}>
                    {status.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 120,
            render: (_, record) => (
                <Dropdown
                    menu={{
                        items: [
                            {
                                key: 'mark-paid',
                                label: 'Mark as Paid',
                                icon: <CheckCircleOutlined />,
                                disabled: record.status === 'paid',
                                onClick: () => handleMarkPenaltyAsPaid(record),
                            },
                        ],
                    }}
                    trigger={['click']}
                >
                    <Button type="text" icon={<MoreOutlined />} />
                </Dropdown>
            ),
        },
    ];

    const disasterColumns = [
        {
            title: 'Member',
            dataIndex: ['member', 'name'],
            key: 'member_name',
            width: 200,
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount) => formatCurrency(amount),
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (date) => dayjs(date).format('DD MMM YYYY'),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            width: 200,
        },
    ];

    const tabItems = [
        {
            key: 'contributions',
            label: 'Monthly Contributions',
            children: (
                <div style={{ padding: '24px' }}>
                    {/* Add Contribution Button */}
                    <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => openContributionForm('monthly')}
                            size="large"
                        >
                            Add Contribution
                        </Button>
                    </div>
                    
                    {/* Filters for Monthly Contributions */}
                    <Card style={{ marginBottom: '16px' }}>
                        <Row gutter={[16, 16]} align="middle">
                            <Col xs={24} sm={12} md={8}>
                                <Input
                                    placeholder="Search by member name..."
                                    prefix={<SearchOutlined />}
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    allowClear
                                />
                            </Col>
                            <Col xs={24} sm={6} md={4}>
                                <Select
                                    placeholder="Year"
                                    value={selectedYear}
                                    onChange={(value) => setSelectedYear(value)}
                                    options={yearOptions}
                                    style={{ width: '100%' }}
                                />
                            </Col>
                            <Col xs={24} sm={6} md={4}>
                                <Select
                                    placeholder="Month"
                                    value={selectedMonth}
                                    onChange={(value) => setSelectedMonth(value)}
                                    options={monthOptions}
                                    style={{ width: '100%' }}
                                />
                            </Col>
                            <Col xs={24} md={8} style={{ textAlign: 'right' }}>
                                <Space>
                                    <Button type="primary" onClick={handleFilterChange}>
                                        Apply
                                    </Button>
                                    <Button onClick={handleClearFilter}>
                                        Clear
                                    </Button>
                                </Space>
                            </Col>
                        </Row>
                    </Card>
                    
                    <Card title="Monthly Contributions">
                        <Table
                            columns={contributionColumns}
                            dataSource={members.data || members}
                            rowKey="id"
                            pagination={members.data ? {
                                current: members.current_page,
                                pageSize: members.per_page,
                                total: members.total,
                                onChange: (page) => {
                                    router.get(route('admin-portal.financials'), {
                                        ...filters,
                                        page
                                    });
                                }
                            } : { pageSize: 10 }}
                            scroll={{ x: 800 }}
                        />
                    </Card>
                </div>
            ),
        },
        {
            key: 'other-contributions',
            label: 'Other Contributions',
            children: (
                <div style={{ padding: '24px' }}>
                    {/* Add Other Contribution Button */}
                    <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => openContributionForm('other')}
                            size="large"
                        >
                            Add Other Contribution
                        </Button>
                    </div>
                    
                    {/* Filters for Other Contributions */}
                    <Card style={{ marginBottom: '16px' }}>
                        <Row gutter={[16, 16]} align="middle">
                            <Col xs={24} sm={12} md={8}>
                                <Input
                                    placeholder="Search by member name..."
                                    prefix={<SearchOutlined />}
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    allowClear
                                />
                            </Col>
                            <Col xs={24} sm={6} md={4}>
                                <Select
                                    placeholder="Year"
                                    value={selectedYear}
                                    onChange={(value) => setSelectedYear(value)}
                                    options={yearOptions}
                                    style={{ width: '100%' }}
                                />
                            </Col>
                            <Col xs={24} sm={6} md={4}>
                                <Select
                                    placeholder="Month"
                                    value={selectedMonth}
                                    onChange={(value) => setSelectedMonth(value)}
                                    options={monthOptions}
                                    style={{ width: '100%' }}
                                />
                            </Col>
                            <Col xs={24} md={8} style={{ textAlign: 'right' }}>
                                <Space>
                                    <Button type="primary" onClick={handleFilterChange}>
                                        Apply
                                    </Button>
                                    <Button onClick={handleClearFilter}>
                                        Clear
                                    </Button>
                                </Space>
                            </Col>
                        </Row>
                    </Card>
                    
                    <Card title="Other Contributions (Projects, Donations, etc.)">
                        <Table
                            columns={otherContributionColumns}
                            dataSource={otherContributions.data || []}
                            rowKey="id"
                            pagination={{ pageSize: 10 }}
                            scroll={{ x: 800 }}
                            summary={(pageData) => {
                                const total = pageData.reduce((sum, record) => sum + parseFloat(record.amount || 0), 0);
                                return (
                                    <Table.Summary fixed>
                                        <Table.Summary.Row>
                                            <Table.Summary.Cell index={0} colSpan={1}>
                                                <strong>Total</strong>
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell index={1}>
                                                <strong>{formatCurrency(total)}</strong>
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell index={2} colSpan={3} />
                                        </Table.Summary.Row>
                                    </Table.Summary>
                                );
                            }}
                        />
                    </Card>
                </div>
            ),
        },
        {
            key: 'loans',
            label: 'Loans',
            children: (
                <div style={{ padding: '24px' }}>
                    <Card 
                        title="Member Loans"
                        extra={
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => setShowLoanForm(true)}
                            >
                                Create Loan
                            </Button>
                        }
                    >
                        <Table
                            columns={loanColumns}
                            dataSource={loans.data || []}
                            rowKey="id"
                            pagination={{ 
                                pageSize: 10,
                                showSizeChanger: false,
                                showQuickJumper: false,
                                size: 'small'
                            }}
                            scroll={{ x: 900 }}
                            size="small"
                            style={{
                                backgroundColor: token.colorBgContainer
                            }}
                            rowClassName={(record, index) => 
                                index % 2 === 0 ? '' : 'ant-table-row-striped'
                            }
                            summary={(pageData) => {
                                const totalPrincipal = pageData.reduce((sum, record) => sum + parseFloat(record.amount || 0), 0);
                                const totalWithInterest = pageData.reduce((sum, record) => sum + parseFloat(record.total_amount || record.amount || 0), 0);
                                return (
                                    <Table.Summary fixed>
                                        <Table.Summary.Row style={{ backgroundColor: token.colorBgElevated }}>
                                            <Table.Summary.Cell index={0}>
                                                <strong style={{ fontSize: '12px', color: token.colorText }}>Total</strong>
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell index={1} align="right">
                                                <strong style={{ 
                                                    fontSize: '12px', 
                                                    color: token.colorText,
                                                    fontFamily: 'monospace'
                                                }}>
                                                    {formatCurrency(totalPrincipal)}
                                                </strong>
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell index={2} />
                                            <Table.Summary.Cell index={3} align="right">
                                                <strong style={{ 
                                                    fontSize: '12px', 
                                                    color: token.colorPrimary,
                                                    fontFamily: 'monospace'
                                                }}>
                                                    {formatCurrency(totalWithInterest)}
                                                </strong>
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell index={4} colSpan={4} />
                                        </Table.Summary.Row>
                                    </Table.Summary>
                                );
                            }}
                        />
                    </Card>
                </div>
            ),
        },
        {
            key: 'penalties',
            label: 'Penalties',
            children: (
                <div style={{ padding: '24px' }}>
                    <Card title="Member Penalties">
                        <Table
                            columns={penaltyColumns}
                            dataSource={penalties.data || []}
                            rowKey="id"
                            pagination={{ pageSize: 10 }}
                            scroll={{ x: 800 }}
                        />
                    </Card>
                </div>
            ),
        },
        {
            key: 'disaster-payments',
            label: 'Disbursements',
            children: (
                <div style={{ padding: '24px' }}>
                    <Card 
                        title="Disaster Payments"
                        extra={
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => setShowDisbursementForm(true)}
                            >
                                Add Disbursement
                            </Button>
                        }
                    >
                        <Table
                            columns={disasterColumns}
                            dataSource={disasterPayments.data || []}
                            rowKey="id"
                            pagination={{ pageSize: 10 }}
                            scroll={{ x: 800 }}
                        />
                    </Card>
                </div>
            ),
        },
    ];

    return (
        <>
            <Head title="Contributions - Tabata Welfare Association" />
            <AdminSidebarLayout>
            <div style={{ padding: '24px 0' }}>
                {/* Tabs */}
                <Card
                    style={{ 
                        borderRadius: '12px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                    }}
                >
                    <Tabs 
                        items={tabItems} 
                        activeKey={activeTab} 
                        onChange={handleTabChange}
                    />
                </Card>
            </div>
            
            {/* Modals */}
            {showContributionForm && (
                <ContributionFormAnt
                    key={contributionFormType} // Key at parent level to force new instance
                    open={showContributionForm}
                    onClose={() => setShowContributionForm(false)}
                    members={allMembers}
                    defaultType={contributionFormType}
                />
            )}
            <LoanFormAnt
                open={showLoanForm || !!editingLoan}
                onClose={() => {
                    setShowLoanForm(false);
                    setEditingLoan(null);
                }}
                members={allMembers}
                editingLoan={editingLoan}
            />
            <DisbursementFormAnt
                open={showDisbursementForm}
                onClose={() => setShowDisbursementForm(false)}
                members={allMembers}
            />

            {/* Loan Action Confirmation Modal */}
            <Modal
                title={getConfirmModalConfig().title}
                open={confirmModal.open}
                onCancel={handleConfirmModalCancel}
                onOk={handleConfirmModalOk}
                okText={getConfirmModalConfig().okText}
                okType={getConfirmModalConfig().okType}
                cancelText="Cancel"
                confirmLoading={confirmModal.loading}
                okButtonProps={{
                    disabled: confirmModal.type === 'delete' && confirmModal.confirmText !== confirmModal.loan?.member?.name
                }}
                centered
                width={520}
                styles={{
                    mask: { backgroundColor: 'rgba(0, 0, 0, 0.45)' },
                    body: { 
                        backgroundColor: token.colorBgContainer,
                        padding: '20px'
                    }
                }}
            >
                {getConfirmModalConfig().content}
            </Modal>
        </AdminSidebarLayout>
        </>
    );
}
