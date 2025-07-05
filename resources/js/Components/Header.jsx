import React, { useState, useEffect, useRef } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';
import { useTheme } from '../Providers/ThemeProvider';

import { BiDockLeft,BiSolidDockLeft } from "react-icons/bi";
export default function Header({ sidebarOpen, setSidebarOpen }) {
    const { auth } = usePage().props;
    const { theme, setTheme } = useTheme();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const getInitials = (name) => {
        const names = name.split(' ');
        if (names.length > 1) {
            return names[0][0] + names[names.length - 1][0];
        }
        return name.substring(0, 2);
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

    return (
        <header className="bg-white dark:bg-gray-800 shadow-md px-8 py-4 flex justify-between items-center sticky top-0 z-10">
            <div className="flex items-center">
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 dark:text-gray-400 focus:outline-none">
                    {sidebarOpen ? <BiSolidDockLeft className="h-6 w-6" /> : <BiDockLeft className="h-6 w-6" />}
                </button>
            </div>
            <div className="flex items-center space-x-4">
                <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                    {theme === 'dark' ? (
                        <SunIcon className="h-6 w-6 text-yellow-500" />
                    ) : (
                        <MoonIcon className="h-6 w-6 text-gray-500" />
                    )}
                </button>
                <div className="relative" ref={dropdownRef}>
                    <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full font-bold text-sm">
                        {auth?.user?.name ? getInitials(auth.user.name) : '?'}
                    </button>
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-20">
                            <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">{auth?.user?.name || 'Unknown User'}</div>
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                            >
                                Logout
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
