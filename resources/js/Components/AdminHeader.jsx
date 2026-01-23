import React, { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { Layout, Button, Dropdown, Avatar, Space, theme } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, SunOutlined, MoonOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { useTheme } from '../Providers/ThemeProvider';

const { Header } = Layout;

export default function AdminHeader({ sidebarOpen, setSidebarOpen, isMobile = false, onMobileMenuClick, pageTitle = 'Admin Portal' }) {
    const { auth } = usePage().props;
    const { theme: themeMode, setTheme } = useTheme();
    const { token } = theme.useToken();

    const getInitials = (name) => {
        if (!name) return '?';
        const names = name.split(' ');
        if (names.length > 1) {
            return names[0][0] + names[names.length - 1][0];
        }
        return name.substring(0, 2);
    };

    const handleLogout = () => {
        console.log('Logout function called');
        console.log('Route logout.alt:', route('logout.alt'));
        
        // Use the GET logout route which should work reliably
        window.location.href = route('logout.alt');
    };

    const userMenuItems = [
        {
            key: 'user-info',
            label: (
                <div style={{ padding: '8px 0', borderBottom: `1px solid ${token.colorBorder}`, marginBottom: '8px' }}>
                    <div style={{ 
                        fontSize: '14px', 
                        fontWeight: '500', 
                        color: token.colorText,
                        marginBottom: '4px'
                    }}>
                        {auth?.user?.name || 'User'}
                    </div>
                    <div style={{ 
                        fontSize: '12px', 
                        color: token.colorTextSecondary
                    }}>
                        {auth?.user?.email || 'user@example.com'}
                    </div>
                </div>
            ),
            disabled: true,
        },
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: (
                <Link href={route('admin.profile.show')}>
                    My Profile
                </Link>
            ),
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: (
                <button 
                    onClick={handleLogout}
                    style={{ 
                        border: 'none', 
                        background: 'none', 
                        padding: 0, 
                        cursor: 'pointer',
                        width: '100%',
                        textAlign: 'left'
                    }}
                >
                    Logout
                </button>
            ),
        },
    ];

    return (
        <Header
            style={{
                padding: '0 24px',
                background: token.colorBgContainer,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: `1px solid ${token.colorBorder}`,
                position: 'sticky',
                top: 0,
                zIndex: 999,
                height: '64px',
            }}
        >
            {/* Left side - Menu toggle and title */}
            <Space size="large" style={{ flex: 1 }}>
                {isMobile ? (
                    <Button
                        type="text"
                        icon={<MenuUnfoldOutlined />}
                        onClick={onMobileMenuClick}
                        size="large"
                    />
                ) : (
                    <Button
                        type="text"
                        icon={sidebarOpen ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        size="large"
                    />
                )}
                <h1 style={{
                    margin: 0,
                    fontSize: '20px',
                    fontWeight: '600',
                    color: token.colorText,
                }}>
                    {pageTitle}
                </h1>
            </Space>

            {/* Right side - Theme toggle and user menu */}
            <Space>
                <Button
                    type="text"
                    icon={themeMode === 'dark' ? <SunOutlined /> : <MoonOutlined />}
                    onClick={() => setTheme(themeMode === 'dark' ? 'light' : 'dark')}
                    size="large"
                />

                <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                    <Space style={{ cursor: 'pointer', padding: '8px', borderRadius: '6px' }}>
                        <Avatar
                            style={{
                                backgroundColor: token.colorPrimary,
                            }}
                            size="default"
                        >
                            {getInitials(auth?.user?.name)}
                        </Avatar>
                    </Space>
                </Dropdown>
            </Space>
        </Header>
    );
}
