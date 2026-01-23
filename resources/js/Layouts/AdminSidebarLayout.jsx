import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Layout, Menu, Button, Drawer, theme } from 'antd';
import {
    DashboardOutlined,
    UserOutlined,
    DollarOutlined,
    FileOutlined,
    BellOutlined,
    HeartOutlined,
    BarChartOutlined,
    SecurityScanOutlined,
    CloudUploadOutlined,
    AuditOutlined,
    SettingOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import AdminHeader from '../Components/AdminHeader';
import SessionTimeout from '@/Components/SessionTimeout';
import { useTheme } from '../Providers/ThemeProvider';

const { Sider, Content } = Layout;

// Map URLs to page titles
const PAGE_TITLES = {
    '/admin-portal/dashboard': 'Dashboard',
    '/admin-portal/members': 'Members',
    '/admin-portal/members-archived': 'Archived Members',
    '/admin-portal/financials': 'Contributions',
    '/admin-portal/expenses': 'Expenses Management',
    '/admin-portal/assets': 'Assets Management',
    '/admin-portal/chart-of-accounts': 'Chart of Accounts',
    '/admin-portal/journal-entries': 'Journal Entries',
    '/admin-portal/general-ledger': 'General Ledger',
    '/admin-portal/trial-balance': 'Trial Balance',
    '/admin-portal/balance-sheet': 'Balance Sheet',
    '/admin-portal/income-statement': 'Income Statement',
    '/admin-portal/cash-flow': 'Cash Flow Statement',
    '/admin-portal/documents': 'Documents',
    '/admin-portal/announcements': 'Announcements',
    '/admin-portal/fundraising': 'Fundraising Campaigns',
    '/admin-portal/reports': 'Reports',
    '/admin-portal/roles': 'Roles & Permissions',
    '/admin-portal/backups': 'Backup Management',
    '/admin-portal/audit-logs': 'Audit Logs',
    '/admin-portal/settings': 'Settings',
};

export default function AdminSidebarLayout({ children }) {
    const { auth } = usePage().props;
    const { url } = usePage();
    const user = auth?.user;
    const { theme: themeMode } = useTheme();
    const { token } = theme.useToken();

    const [sidebarOpen, setSidebarOpen] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('adminSidebarOpen');
            const isMobile = window.innerWidth < 1024;
            return saved ? saved === 'true' : !isMobile;
        }
        return true;
    });

    const [isMobile, setIsMobile] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            if (mobile && sidebarOpen) {
                setSidebarOpen(false);
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        localStorage.setItem('adminSidebarOpen', sidebarOpen);
    }, [sidebarOpen]);

    const getNavItems = () => {
        if (user?.role?.name === 'admin') {
            return [
                { key: '/admin-portal/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
                { key: '/admin-portal/members', icon: <UserOutlined />, label: 'Members' },
                { 
                    key: 'finance', 
                    icon: <DollarOutlined />, 
                    label: 'Finance',
                    children: [
                        { key: '/admin-portal/financials', icon: <DollarOutlined />, label: 'Contributions' },
                        { key: '/admin-portal/expenses', icon: <DollarOutlined />, label: 'Expenses' },
                        { key: '/admin-portal/assets', icon: <DollarOutlined />, label: 'Assets' },
                    ]
                },
                { 
                    key: 'accounting', 
                    icon: <BarChartOutlined />, 
                    label: 'Accounting',
                    children: [
                        { key: '/admin-portal/chart-of-accounts', icon: <BarChartOutlined />, label: 'Chart of Accounts' },
                        { key: '/admin-portal/journal-entries', icon: <BarChartOutlined />, label: 'Journal Entries' },
                        { key: '/admin-portal/general-ledger', icon: <BarChartOutlined />, label: 'General Ledger' },
                        { key: '/admin-portal/trial-balance', icon: <BarChartOutlined />, label: 'Trial Balance' },
                        { key: '/admin-portal/balance-sheet', icon: <BarChartOutlined />, label: 'Balance Sheet' },
                        { key: '/admin-portal/income-statement', icon: <BarChartOutlined />, label: 'Income Statement' },
                        { key: '/admin-portal/cash-flow', icon: <BarChartOutlined />, label: 'Cash Flow' },
                    ]
                },
                { key: '/admin-portal/documents', icon: <FileOutlined />, label: 'Documents' },
                { key: '/admin-portal/announcements', icon: <BellOutlined />, label: 'Announcements' },
                { key: '/admin-portal/fundraising', icon: <HeartOutlined />, label: 'Fundraising' },
                { key: '/admin-portal/reports', icon: <BarChartOutlined />, label: 'Reports' },
                { 
                    key: 'administration', 
                    icon: <SettingOutlined />, 
                    label: 'Administration',
                    children: [
                        { key: '/admin-portal/roles', icon: <SecurityScanOutlined />, label: 'Roles' },
                        { key: '/admin-portal/backups', icon: <CloudUploadOutlined />, label: 'Backups' },
                        { key: '/admin-portal/audit-logs', icon: <AuditOutlined />, label: 'Audit Trail' },
                        { key: '/admin-portal/settings', icon: <SettingOutlined />, label: 'Settings' },
                    ]
                },
            ];
        } else if (user?.role?.name === 'secretary') {
            return [
                { key: '/admin-portal/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
                { key: '/admin-portal/members', icon: <UserOutlined />, label: 'Members' },
                { 
                    key: 'finance', 
                    icon: <DollarOutlined />, 
                    label: 'Finance',
                    children: [
                        { key: '/admin-portal/financials', icon: <DollarOutlined />, label: 'Contributions' },
                        { key: '/admin-portal/expenses', icon: <DollarOutlined />, label: 'Expenses' },
                        { key: '/admin-portal/assets', icon: <DollarOutlined />, label: 'Assets' },
                    ]
                },
                { key: '/admin-portal/documents', icon: <FileOutlined />, label: 'Documents' },
                { key: '/admin-portal/announcements', icon: <BellOutlined />, label: 'Announcements' },
                { key: '/admin-portal/reports', icon: <BarChartOutlined />, label: 'Reports' },
            ];
        }
        return [];
    };

    const navItems = getNavItems();
    const menuItems = navItems.map(item => {
        if (item.children) {
            // Create submenu
            return {
                key: item.key,
                icon: item.icon,
                label: item.label,
                children: item.children.map(child => ({
                    key: child.key,
                    icon: child.icon,
                    label: <Link href={child.key} preserveScroll>{child.label}</Link>,
                })),
            };
        }
        // Regular menu item
        return {
            key: item.key,
            icon: item.icon,
            label: <Link href={item.key} preserveScroll>{item.label}</Link>,
        };
    });

    const cleanUrl = url.split('?')[0];
    let pageTitle = PAGE_TITLES[cleanUrl];
    
    if (!pageTitle) {
        if (cleanUrl.match(/^\/admin-portal\/members\/\d+$/)) {
            pageTitle = 'Member Details';
        } else if (cleanUrl.match(/^\/admin-portal\/member-contributions\/\d+$/)) {
            pageTitle = 'Member Contribution Details';
        } else if (cleanUrl.match(/^\/admin-portal\/documents\/\d+$/)) {
            pageTitle = 'Document Details';
        } else if (cleanUrl.match(/^\/admin-portal\/announcements\/\d+$/)) {
            pageTitle = 'Announcement Details';
        } else if (cleanUrl.includes('/admin-portal/members-archived')) {
            pageTitle = 'Archived Members';
        } else {
            pageTitle = 'Admin Portal';
        }
    }

    // Determine which submenu should be open based on current URL
    const getDefaultOpenKeys = () => {
        const openKeys = [];
        
        // Finance submenu
        if (cleanUrl.includes('/admin-portal/financials') || 
            cleanUrl.includes('/admin-portal/expenses') || 
            cleanUrl.includes('/admin-portal/assets')) {
            openKeys.push('finance');
        }
        
        // Accounting submenu
        if (cleanUrl.includes('/admin-portal/chart-of-accounts') ||
            cleanUrl.includes('/admin-portal/journal-entries') ||
            cleanUrl.includes('/admin-portal/general-ledger') ||
            cleanUrl.includes('/admin-portal/trial-balance') ||
            cleanUrl.includes('/admin-portal/balance-sheet') ||
            cleanUrl.includes('/admin-portal/income-statement') ||
            cleanUrl.includes('/admin-portal/cash-flow')) {
            openKeys.push('accounting');
        }
        
        // Administration submenu
        if (cleanUrl.includes('/admin-portal/roles') ||
            cleanUrl.includes('/admin-portal/backups') ||
            cleanUrl.includes('/admin-portal/audit-logs') ||
            cleanUrl.includes('/admin-portal/settings')) {
            openKeys.push('administration');
        }
        
        return openKeys;
    };

    const sidebarContent = (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{
                padding: '0 16px',
                textAlign: 'center',
                borderBottom: `1px solid ${token.colorBorder}`,
                flexShrink: 0,
                height: '64px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <div style={{
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: token.colorText,
                }}>
                    TWA System
                </div>
            </div>
            <Menu
                mode="inline"
                selectedKeys={[cleanUrl]}
                defaultOpenKeys={getDefaultOpenKeys()}
                items={menuItems}
                style={{ 
                    border: 'none',
                    flex: 1,
                    overflow: 'auto',
                }}
            />
        </div>
    );

    return (
        <Layout style={{ minHeight: '100vh' }}>
            {/* Desktop Sidebar */}
            {!isMobile && (
                <Sider
                    trigger={null}
                    collapsible
                    collapsed={!sidebarOpen}
                    width={256}
                    collapsedWidth={80}
                    style={{
                        overflow: 'auto',
                        height: '100vh',
                        position: 'fixed',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        transition: 'all 0.2s',
                        backgroundColor: token.colorBgContainer,
                    }}
                    theme="light"
                >
                    {sidebarContent}
                </Sider>
            )}

            {/* Mobile Drawer */}
            {isMobile && (
                <Drawer
                    title="Navigation"
                    placement="left"
                    onClose={() => setDrawerOpen(false)}
                    open={drawerOpen}
                    styles={{ body: { padding: 0 } }}
                >
                    {sidebarContent}
                </Drawer>
            )}

            {/* Main Layout */}
            <Layout
                style={{
                    marginLeft: !isMobile ? (sidebarOpen ? 256 : 80) : 0,
                    transition: 'margin-left 0.2s',
                }}
            >
                <AdminHeader
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    isMobile={isMobile}
                    onMobileMenuClick={() => setDrawerOpen(true)}
                    pageTitle={pageTitle}
                />
                <Content
                    style={{
                        padding: isMobile ? '16px' : '24px',
                        overflow: 'auto',
                        backgroundColor: token.colorBgLayout,
                    }}
                >
                    {children}
                </Content>
            </Layout>

            <SessionTimeout enabled={true} />
        </Layout>
    );
}
