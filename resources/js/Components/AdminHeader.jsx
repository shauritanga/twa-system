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

    const handleLogout = (e) => {
        e.preventDefault();
        router.post(route('logout'), {}, {
            onSuccess: () => {
                window.location.href = route('marketing.index');
            },
            onError: () => {
                // Fallback to alternative logout route
                window.location.href = route('logout.alt');
            }
        });
    };

    const userMenuItems = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: (
                <Link href={auth?.user?.role?.name === 'admin' || auth?.user?.role?.name === 'secretary' ? '/admin/profile' : '/member/profile'}>
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
            label: 'Logout',
            onClick: handleLogout,
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
                    <Avatar
                        style={{
                            backgroundColor: token.colorPrimary,
                            cursor: 'pointer',
                        }}
                        size="large"
                    >
                        {getInitials(auth?.user?.name)}
                    </Avatar>
                </Dropdown>
            </Space>
        </Header>
    );
}
