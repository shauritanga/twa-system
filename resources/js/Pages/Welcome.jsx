
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Welcome to the Group Contribution System" />
            <div className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen flex flex-col">
                {/* Header */}
                <header className="shadow-md">
                    <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            TWA System
                        </div>
                        <div>
                            {auth.user ? (
                                <Link
                                    href={auth.user.role === 'admin' ? route('admin.dashboard') : route('member.dashboard')}
                                    className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-500 transition duration-300 text-sm sm:text-base"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <Link
                                    href={route('login')}
                                    className="px-3 sm:px-4 py-2 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 transition duration-300 text-sm sm:text-base"
                                >
                                    Log in
                                </Link>
                            )}
                        </div>
                    </nav>
                </header>

                {/* Hero Section */}
                <main className="container mx-auto px-4 sm:px-6 lg:px-8 h-[40vh] flex items-center justify-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-blue-800 dark:text-blue-300 mb-4">
                            Manage Your Group Finances with Ease
                        </h1>
                        <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                            A simple and powerful system to track contributions, debts, and disaster payments for your group.
                        </p>
                    </motion.div>
                </main>

                {/* Features Section */}
                <section className="bg-white dark:bg-gray-800 py-12 sm:py-16 md:py-20 flex-grow">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-center text-blue-800 dark:text-blue-300 mb-8 sm:mb-12">
                            Key Features
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                            <motion.div
                                className="p-6 sm:p-8 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-lg"
                                whileHover={{ scale: 1.03 }}
                                transition={{ duration: 0.3 }}
                            >
                                <h3 className="text-xl sm:text-2xl font-bold text-blue-700 dark:text-blue-400">Track Contributions</h3>
                                <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                                    Easily record and monitor contributions from all members of your group.
                                </p>
                            </motion.div>
                            <motion.div
                                className="p-6 sm:p-8 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-lg"
                                whileHover={{ scale: 1.03 }}
                                transition={{ duration: 0.3 }}
                            >
                                <h3 className="text-xl sm:text-2xl font-bold text-blue-700 dark:text-blue-400">Manage Debts</h3>
                                <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                                    Keep track of outstanding debts and payments within the group.
                                </p>
                            </motion.div>
                            <motion.div
                                className="p-6 sm:p-8 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-lg"
                                whileHover={{ scale: 1.03 }}
                                transition={{ duration: 0.3 }}
                            >
                                <h3 className="text-xl sm:text-2xl font-bold text-blue-700 dark:text-blue-400">Disaster Payments</h3>
                                <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                                    Handle and record disaster payments to support members in need.
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-gray-200 dark:bg-gray-800 py-8">
                    <div className="container mx-auto px-6 text-center text-gray-600 dark:text-gray-400">
                        <p>&copy; {new Date().getFullYear()} Group Contributions System. All rights reserved.</p>
                    </div>
                </footer>
            </div>
        </>
    );
}
