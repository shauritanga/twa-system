import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

export default function ResponsiveTable({
    columns,
    data,
    loading = false,
    emptyMessage = "No data available",
    onRowClick,
    sortable = false,
    className = ""
}) {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [expandedRows, setExpandedRows] = useState(new Set());

    const handleSort = (key) => {
        if (!sortable) return;

        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedData = React.useMemo(() => {
        if (!sortConfig.key) return data;

        return [...data].sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (aValue < bValue) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }, [data, sortConfig]);

    const toggleRowExpansion = (rowId) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(rowId)) {
            newExpanded.delete(rowId);
        } else {
            newExpanded.add(rowId);
        }
        setExpandedRows(newExpanded);
    };

    if (loading) {
        return (
            <div className={`card ${className}`}>
                <div className="card-body">
                    <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`card ${className}`}>
            {/* Desktop Table */}
            <div className="hidden md:block">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                {columns.map((column) => (
                                    <th
                                        key={column.key}
                                        className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${
                                            sortable && column.sortable !== false ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600' : ''
                                        }`}
                                        onClick={() => sortable && column.sortable !== false && handleSort(column.key)}
                                    >
                                        <div className="flex items-center space-x-1">
                                            <span>{column.label}</span>
                                            {sortable && column.sortable !== false && sortConfig.key === column.key && (
                                                sortConfig.direction === 'asc' ?
                                                <ChevronUpIcon className="w-4 h-4" /> :
                                                <ChevronDownIcon className="w-4 h-4" />
                                            )}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {sortedData.length > 0 ? (
                                sortedData.map((row, index) => (
                                    <tr
                                        key={row.id || index}
                                        className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 ${
                                            onRowClick ? 'cursor-pointer' : ''
                                        }`}
                                        onClick={() => onRowClick && onRowClick(row)}
                                    >
                                        {columns.map((column) => (
                                            <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                {column.render ? column.render(row[column.key], row) : row[column.key]}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                        <div className="flex flex-col items-center">
                                            <svg className="w-12 h-12 mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <p>{emptyMessage}</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden">
                <div className="space-y-4 p-4">
                    {sortedData.length > 0 ? (
                        sortedData.map((row, index) => (
                            <div
                                key={row.id || index}
                                className={`bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-4 ${
                                    onRowClick ? 'cursor-pointer hover:shadow-md' : ''
                                } transition-all duration-200`}
                                onClick={() => onRowClick && onRowClick(row)}
                            >
                                {columns.slice(0, 2).map((column) => (
                                    <div key={column.key} className="flex justify-between items-start mb-2 last:mb-0">
                                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            {column.label}:
                                        </span>
                                        <span className="text-sm text-gray-900 dark:text-white ml-2 text-right">
                                            {column.render ? column.render(row[column.key], row) : row[column.key]}
                                        </span>
                                    </div>
                                ))}

                                {columns.length > 2 && (
                                    <>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleRowExpansion(row.id || index);
                                            }}
                                            className="mt-2 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center"
                                        >
                                            {expandedRows.has(row.id || index) ? 'Show less' : 'Show more'}
                                            {expandedRows.has(row.id || index) ?
                                                <ChevronUpIcon className="w-3 h-3 ml-1" /> :
                                                <ChevronDownIcon className="w-3 h-3 ml-1" />
                                            }
                                        </button>

                                        {expandedRows.has(row.id || index) && (
                                            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600 space-y-2">
                                                {columns.slice(2).map((column) => (
                                                    <div key={column.key} className="flex justify-between items-start">
                                                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                            {column.label}:
                                                        </span>
                                                        <span className="text-sm text-gray-900 dark:text-white ml-2 text-right">
                                                            {column.render ? column.render(row[column.key], row) : row[column.key]}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12">
                            <svg className="w-12 h-12 mb-4 text-gray-300 dark:text-gray-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}