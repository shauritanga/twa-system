import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import Header from '../Components/Header';
import SessionTimeout from '@/Components/SessionTimeout';
import { ChartBarIcon, UsersIcon, CogIcon, ShieldCheckIcon, CloudArrowUpIcon, DocumentTextIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import { HiOutlineSquares2X2 } from "react-icons/hi2";
import { LiaCoinsSolid } from "react-icons/lia";

export default function SidebarLayout({ children }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const isAdmin = user?.role?.name === 'admin';

    // Mobile-first approach: sidebar closed by default on mobile, open on desktop
    const [sidebarOpen, setSidebarOpen] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('sidebarOpen');
            const isMobile = window.innerWidth < 1024; // lg breakpoint
            return saved ? saved === 'true' : !isMobile;
        }
        return false;
    });

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 1024; // lg breakpoint
            setIsMobile(mobile);

            // Auto-close sidebar on mobile when screen size changes
            if (mobile && sidebarOpen) {
                setSidebarOpen(false);
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        localStorage.setItem('sidebarOpen', sidebarOpen);
    }, [sidebarOpen]);

    // Close sidebar when clicking on mobile overlay
    const handleOverlayClick = () => {
        if (isMobile) {
            setSidebarOpen(false);
        }
    };

    // Helper for nav items
    const getNavItems = () => {
        if (user && user.role && (user.role.name === 'admin' || user.role.name === 'secretary')) {
            if (user.role.name === 'admin') {
                return [
                    { href: '/admin/dashboard', icon: HiOutlineSquares2X2, label: 'Dashboard' },
                    { href: '/admin/members', icon: UsersIcon, label: 'Members' },
                    { href: '/admin/financials', icon: LiaCoinsSolid, label: 'Financials' },
                    { href: '/admin/documents', icon: DocumentTextIcon, label: 'Documents' },
                    { href: '/admin/reports', icon: ChartBarIcon, label: 'Reports' },
                    { href: '/admin/roles', icon: ShieldCheckIcon, label: 'Roles' },
                    { href: '/admin/backups', icon: CloudArrowUpIcon, label: 'Backups' },
                    { href: '/admin/audit-logs', icon: ClipboardDocumentListIcon, label: 'Audit Trail' },
                    { href: '/admin/settings', icon: CogIcon, label: 'Settings' },
                ];
            } else if (user.role.name === 'secretary') {
                return [
                    { href: '/admin/dashboard', icon: HiOutlineSquares2X2, label: 'Dashboard' },
                    { href: '/admin/members', icon: UsersIcon, label: 'Members' },
                    { href: '/admin/financials', icon: LiaCoinsSolid, label: 'Financials' },
                    { href: '/admin/documents', icon: DocumentTextIcon, label: 'Documents' },
                    { href: '/admin/reports', icon: ChartBarIcon, label: 'Reports' },
                ];
            }
        }
        return [
            { href: '/member/dashboard', icon: HiOutlineSquares2X2, label: 'Dashboard' },
            { href: '/financials', icon: LiaCoinsSolid, label: 'Financials' },
            { href: '/member/documents', icon: DocumentTextIcon, label: 'Documents' },
            { href: '/member/dependents', icon: UsersIcon, label: 'Dependents' },
        ];
    };
    const navItems = getNavItems();

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
            {/* Mobile Overlay */}
            {isMobile && sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300"
                    onClick={handleOverlayClick}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar */}
            <aside className={`
                ${isMobile ? 'fixed' : 'relative'}
                ${isMobile ? 'inset-y-0 left-0 z-50' : ''}
                ${sidebarOpen ? (isMobile ? 'w-80' : 'w-64') : (isMobile ? '-translate-x-full' : 'w-20')}
                bg-white dark:bg-gray-800 shadow-xl flex flex-col flex-shrink-0
                transition-all duration-300 ease-in-out transform
                ${isMobile ? 'h-full' : 'h-screen'}
                border-r border-gray-200 dark:border-gray-700
            `}>
                {/* Logo/Brand */}
                <div className={`
                    ${sidebarOpen ? 'p-6' : 'p-4'}
                    font-bold border-b border-gray-200 dark:border-gray-700
                    text-gray-800 dark:text-white transition-all duration-300
                    ${sidebarOpen ? 'text-xl' : 'text-center text-lg'}
                    flex items-center justify-center
                `}>
                    {sidebarOpen ? (
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">TWA</span>
                            </div>
                            <span>Group System</span>
                        </div>
                    ) : (
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold">TWA</span>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navItems.map(({ href, icon: Icon, label }) => {
                        const isActive = usePage().url === href;
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`
                                    flex items-center rounded-lg transition-all duration-200 group
                                    ${sidebarOpen ? 'py-3 px-4' : 'py-3 px-2 justify-center'}
                                    ${isActive
                                        ? 'bg-blue-500 text-white shadow-md'
                                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                                    }
                                    ${isMobile ? 'text-base' : 'text-sm'}
                                `}
                                title={!sidebarOpen ? label : undefined}
                                preserveScroll
                                onClick={() => {
                                    // Close sidebar on mobile after navigation
                                    if (isMobile) {
                                        setSidebarOpen(false);
                                    }
                                }}
                            >
                                <Icon className={`
                                    ${sidebarOpen ? 'w-5 h-5 mr-3' : 'w-6 h-6'}
                                    transition-all duration-200
                                    ${isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200'}
                                `} />
                                <span className={`
                                    transition-all duration-200 font-medium
                                    ${sidebarOpen ? 'inline' : 'hidden'}
                                `}>
                                    {label}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className={`
                    border-t border-gray-200 dark:border-gray-700
                    transition-all duration-200
                    ${sidebarOpen ? 'p-4 text-sm' : 'flex items-center justify-center p-3 text-xs'}
                    text-gray-500 dark:text-gray-400
                `}>
                    {sidebarOpen ? (
                        <div className="text-center">
                            <p>&copy; 2025 Group System</p>
                            <p className="text-xs mt-1">Version 1.0</p>
                        </div>
                    ) : (
                        <span>&copy;</span>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden min-w-0">
                <Header
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    isMobile={isMobile}
                />
                <main className={`
                    flex-1 overflow-x-hidden overflow-y-auto
                    bg-gray-50 dark:bg-gray-900
                    ${isMobile ? 'p-4' : 'p-6 lg:p-8'}
                    scrollbar-hide
                `}>
                    {children}
                </main>
            </div>

            {/* Session Timeout Component */}
            <SessionTimeout enabled={true} />
        </div>
    );
}
