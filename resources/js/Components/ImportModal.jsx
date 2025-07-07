import React, { useState } from 'react';
import axios from 'axios';
import Modal from './Modal';

const ImportModal = ({ isOpen, onClose, onImport }) => {
    const [file, setFile] = useState(null);
    const [validationResults, setValidationResults] = useState(null);
    const [isValidating, setIsValidating] = useState(false);

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setValidationResults(null);

        if (selectedFile) {
            setIsValidating(true);
            const formData = new FormData();
            formData.append('file', selectedFile);

            try {
                const response = await axios.post(route('contributions.validateImport'), formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                setValidationResults(response.data);
            } catch (error) {
                console.error('Validation failed:', error);
            }
            setIsValidating(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setFile(e.dataTransfer.files[0]);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleImport = () => {
        if (file) {
            onImport(file);
            onClose();
        }
    };

    return (
        <Modal
            show={isOpen}
            onClose={onClose}
            title="Import Contributions"
            maxWidth="4xl"
            className="import-modal"
            iconColor="blue"
            icon={
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
            }
        >
            <div className="p-6">
                <div className="space-y-6">
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200">Import Instructions</h4>
                                        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                                            Upload a CSV file with columns: <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">member_id</code>, <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">amount</code>, <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">date</code>, and <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">purpose</code>.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-center">
                                <a
                                    href="/contributions/template"
                                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border border-indigo-300 dark:border-indigo-600 rounded-xl text-sm font-semibold text-indigo-700 dark:text-indigo-300 hover:from-indigo-100 hover:to-blue-100 dark:hover:from-indigo-900/30 dark:hover:to-blue-900/30 transition-all duration-300 transform hover:scale-105"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Download Template
                                </a>
                            </div>

                            <div
                                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors duration-300"
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                            >
                                {file ? (
                                    <div className="flex items-center justify-center">
                                        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl mr-3">
                                            <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{file.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Ready for validation</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="mx-auto w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center mb-4">
                                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                                            </svg>
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-400 mb-2">
                                            Drag and drop your CSV file here, or{' '}
                                            <label htmlFor="import-file-modal" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 cursor-pointer font-semibold">
                                                click to select a file
                                            </label>
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">CSV files only, up to 10MB</p>
                                    </div>
                                )}
                                <input type="file" id="import-file-modal" className="hidden" onChange={handleFileChange} accept=".csv" />
                            </div>
                            {validationResults && (
                                <div className="mt-6">
                                    {validationResults.errors.length > 0 ? (
                                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0">
                                                    <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <div className="ml-3">
                                                    <h4 className="text-sm font-semibold text-red-800 dark:text-red-200">Validation Failed</h4>
                                                    <p className="text-sm text-red-700 dark:text-red-300">{validationResults.errors.length} validation errors found. Please fix the issues and try again.</p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                                            <div className="flex items-center mb-4">
                                                <div className="flex-shrink-0">
                                                    <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <div className="ml-3">
                                                    <h4 className="text-sm font-semibold text-green-800 dark:text-green-200">Validation Successful!</h4>
                                                    <p className="text-sm text-green-700 dark:text-green-300">Found {validationResults.valid_rows_count} valid records ready for import.</p>
                                                </div>
                                            </div>

                                            {validationResults.valid_rows_preview && validationResults.valid_rows_preview.length > 0 && (
                                                <div className="bg-white dark:bg-gray-800 rounded-lg border border-green-200 dark:border-green-700 overflow-hidden">
                                                    <div className="px-4 py-2 bg-green-100 dark:bg-green-900/30 border-b border-green-200 dark:border-green-700">
                                                        <h5 className="text-xs font-semibold text-green-800 dark:text-green-200 uppercase tracking-wider">Preview (First 5 Records)</h5>
                                                    </div>
                                                    <div className="overflow-x-auto">
                                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                                            <thead className="bg-gray-50 dark:bg-gray-800">
                                                                <tr>
                                                                    {Object.keys(validationResults.valid_rows_preview[0] || {}).map(key => (
                                                                        <th key={key} scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{key}</th>
                                                                    ))}
                                                                </tr>
                                                            </thead>
                                                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                                                {validationResults.valid_rows_preview.map((row, index) => (
                                                                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                                        {Object.values(row).map((value, i) => (
                                                                            <td key={i} className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">{value}</td>
                                                                        ))}
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    {validationResults.valid_rows_count > 5 && (
                                                        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">...and {validationResults.valid_rows_count - 5} more records</p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                    </div>

                    {/* Modal Footer */}
                    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-600 dark:hover:to-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300 transform hover:scale-105"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleImport}
                        disabled={!file || isValidating || !validationResults || validationResults.errors.length > 0 || validationResults.valid_rows_count === 0}
                        className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-semibold rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {isValidating ? (
                            <div className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Validating...
                            </div>
                        ) : (
                            <div className="flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                Import Data
                            </div>
                        )}
                    </button>
                    </div>
                </div>
        </Modal>
    );
};

export default ImportModal;
