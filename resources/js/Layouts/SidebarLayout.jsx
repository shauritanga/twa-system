import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import Header from '../Components/Header';
import { HomeIcon, ChartBarIcon, UsersIcon, CurrencyDollarIcon, CogIcon } from '@heroicons/react/24/outline';
import { HiOutlineSquares2X2 } from "react-icons/hi2";

export default function SidebarLayout({ children }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const isAdmin = user?.role?.name === 'admin';
    const [sidebarOpen, setSidebarOpen] = useState(localStorage.getItem('sidebarOpen') ? localStorage.getItem('sidebarOpen') === 'true' : true);

    useEffect(() => {
        localStorage.setItem('sidebarOpen', sidebarOpen);
    }, [sidebarOpen]);

    // Helper for nav items
    const getNavItems = () => {
        if (user && user.role && (user.role.name === 'admin' || user.role.name === 'secretary')) {
            if (user.role.name === 'admin') {
                return [
                    { href: '/admin/dashboard', icon: HiOutlineSquares2X2, label: 'Dashboard' },
                    { href: '/admin/reports', icon: ChartBarIcon, label: 'Reports' },
                    { href: '/admin/members', icon: UsersIcon, label: 'Members' },
                    { href: '/admin/financials', icon: CurrencyDollarIcon, label: 'Financials' },
                    { href: '/admin/roles', icon: UsersIcon, label: 'Roles' },
                    { href: '/admin/settings', icon: CogIcon, label: 'Settings' },
                ];
            } else if (user.role.name === 'secretary') {
                return [
                    { href: '/admin/dashboard', icon: HiOutlineSquares2X2, label: 'Dashboard' },
                    { href: '/admin/reports', icon: ChartBarIcon, label: 'Reports' },
                    { href: '/admin/members', icon: UsersIcon, label: 'Members' },
                    { href: '/admin/financials', icon: CurrencyDollarIcon, label: 'Financials' },
                ];
            }
        }
        return [
            { href: '/member/dashboard', icon: HiOutlineSquares2X2, label: 'Dashboard' },
            { href: '/financials', icon: CurrencyDollarIcon, label: 'Financials' },
            { href: '/member/dependents', icon: UsersIcon, label: 'Dependents' },
        ];
    };
    const navItems = getNavItems();

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            <aside className={`transition-all duration-200 ${sidebarOpen ? 'w-64' : 'w-20'} bg-white dark:bg-gray-800 shadow-lg flex flex-col flex-shrink-0`}>
                <div className={`p-6 font-bold text-xl border-b dark:border-gray-700 text-gray-800 dark:text-white transition-all duration-200 ${sidebarOpen ? '' : 'text-center p-2 text-lg'}`}>{sidebarOpen ? 'Group System' : 'GS'}</div>
                <nav className="flex-1 p-4 space-y-2 flex flex-col items-stretch">
                    {navItems.map(({ href, icon: Icon, label }) => (
                        <Link
                            key={href}
                            href={href}
                            className={`flex items-center py-2 px-4 rounded hover:bg-blue-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white transition-all duration-200 ${sidebarOpen ? '' : 'justify-center px-2'} ${usePage().url === href ? 'bg-blue-500 text-white' : ''}`}
                            title={!sidebarOpen ? label : undefined}
                            preserveScroll
                            onClick={e => {
                                // Do not expand sidebar on click
                            }}
                        >
                            <Icon className={`transition-all duration-200 ${sidebarOpen ? 'w-5 h-5 mr-2' : 'w-8 h-8'} ${sidebarOpen ? '' : 'mr-0'}`} />
                            <span className={`transition-all duration-200 ${sidebarOpen ? 'inline' : 'hidden'}`}>{label}</span>
                        </Link>
                    ))}
                </nav>
                <div className={`border-t dark:border-gray-700 transition-all duration-200 ${sidebarOpen ? 'p-4 text-sm text-gray-500 dark:text-gray-400' : 'flex items-center justify-center p-2 text-xs text-gray-500 dark:text-gray-400'}`}>
                    {sidebarOpen ? (
                        <>&copy; 2025 Group System</>
                    ) : (
                        <>&copy; 2025</>
                    )}
                </div>
            </aside>
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-8 scrollbar-hide">
                    {children}
                </main>
            </div>
        </div>
    );
}
