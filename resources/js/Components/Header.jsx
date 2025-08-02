import React, { useState, useEffect, useRef } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { SunIcon, MoonIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import { useTheme } from '../Providers/ThemeProvider';

export default function Header({ sidebarOpen, setSidebarOpen, isMobile = false }) {
    const { auth } = usePage().props;
    const { theme, setTheme } = useTheme();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

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
        setDropdownOpen(false);

        // Force a complete page redirect using the alternative logout route
        // This bypasses Inertia.js SPA behavior and ensures URL changes
        window.location.href = route('logout.alt');
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    // Close dropdown when clicking outside or on mobile navigation
    useEffect(() => {
        if (isMobile && sidebarOpen) {
            setDropdownOpen(false);
        }
    }, [sidebarOpen, isMobile]);

    return (
        <header className="bg-white dark:bg-gray-800 shadow-md px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex justify-between items-center sticky top-0 z-30 border-b border-gray-200 dark:border-gray-700">
            {/* Left section - Logo and Menu Toggle */}
            <div className="flex items-center space-x-3 sm:space-x-4">
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 -ml-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                    aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
                >
                    {sidebarOpen ? (
                        <XMarkIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                    ) : (
                        <Bars3Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                    )}
                </button>

                {/* Mobile Logo - only show when sidebar is closed */}
                <div className={`${sidebarOpen ? 'hidden' : 'block'} sm:hidden`}>
                    <h1 className="text-lg font-bold text-gray-900 dark:text-white">GS</h1>
                </div>
            </div>

            {/* Right section - Theme toggle and User menu */}
            <div className="flex items-center space-x-2 sm:space-x-4">
                {/* Theme Toggle */}
                <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                    aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                >
                    {theme === 'dark' ? (
                        <SunIcon className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500" />
                    ) : (
                        <MoonIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500" />
                    )}
                </button>

                {/* User Menu */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full font-bold text-xs sm:text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 shadow-md hover:shadow-lg"
                        aria-label="User menu"
                        aria-expanded={dropdownOpen}
                    >
                        {getInitials(auth?.user?.name)}
                    </button>

                    {/* Dropdown Menu */}
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-white dark:bg-gray-700 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 py-1 z-50 transform transition-all duration-200 origin-top-right">
                            {/* User Info */}
                            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                    {auth?.user?.name || 'Unknown User'}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                    {auth?.user?.email || ''}
                                </p>
                            </div>

                            {/* Menu Items */}
                            <div className="py-1">
                                <Link
                                    href={auth?.user?.role?.name === 'admin' || auth?.user?.role?.name === 'secretary' ? '/admin/profile' : '/member/profile'}
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                                >
                                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    My Profile
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                                >
                                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
