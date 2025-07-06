import React, { useState } from 'react';
import axios from 'axios';

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

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed z-[9999] inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                    <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Import Contributions</h3>
                        <div className="mt-2">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                To import contributions, please upload a CSV file with the following columns: `member_id`, `amount`, `date`, and `purpose`.
                            </p>
                            <div className="mt-4">
                                <a href="/contributions/template" className="text-indigo-600 hover:text-indigo-900">Download Template</a>
                            </div>
                            <div
                                className="mt-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md p-6 text-center"
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                            >
                                {file ? (
                                    <p className="text-gray-800 dark:text-white">{file.name}</p>
                                ) : (
                                    <p className="text-gray-500 dark:text-gray-400">Drag and drop your CSV file here, or <label htmlFor="import-file-modal" className="text-indigo-600 cursor-pointer">click to select a file</label>.</p>
                                )}
                                <input type="file" id="import-file-modal" className="hidden" onChange={handleFileChange} accept=".csv" />
                            </div>
                            {validationResults && (
                                <div className="mt-4">
                                    {validationResults.errors.length > 0 ? (
                                        <p className="text-red-600">{validationResults.errors.length} validation errors found.</p>
                                    ) : (
                                        <div>
                                            <h4 className="text-green-600">Validation Successful!</h4>
                                            <table className="min-w-full divide-y divide-gray-200 mt-2">
                                            <thead className="bg-gray-50 dark:bg-gray-800">
                                            <tr>
                                            {Object.keys(validationResults.valid_rows_preview[0] || {}).map(key => (
                                            <th key={key} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{key}</th>
                                            ))}
                                            </tr>
                                            </thead>
                                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                            {validationResults.valid_rows_preview.map((row, index) => (
                                            <tr key={index} className="bg-green-100 dark:bg-green-900">
                                            {Object.values(row).map((value, i) => (
                                            <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{value}</td>
                                            ))}
                                            </tr>
                                            ))}
                                            </tbody>
                                            </table>
                                            {validationResults.valid_rows_count > 5 && (
                                            <p className="text-sm text-gray-500 mt-2">...and {validationResults.valid_rows_count - 5} more.</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button onClick={handleImport} disabled={!file || isValidating || !validationResults || validationResults.errors.length > 0 || validationResults.valid_rows_count === 0} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm">
                            {isValidating ? 'Validating...' : 'Import'}
                        </button>
                        <button type="button" onClick={onClose} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImportModal;
