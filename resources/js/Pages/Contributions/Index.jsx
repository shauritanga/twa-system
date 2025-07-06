import React, { useState } from 'react';
import SidebarLayout from '../../Layouts/SidebarLayout';
import { useForm, usePage } from '@inertiajs/react';
import Modal from '../../Components/Modal';
import InputLabel from '../../Components/InputLabel';
import TextInput from '../../Components/TextInput';
import PrimaryButton from '../../Components/PrimaryButton';
import SecondaryButton from '../../Components/SecondaryButton';
import InputError from '../../Components/InputError';

const ContributionRow = ({ contribution }) => (
    <tr key={contribution.id}>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{contribution.member.name}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contribution.amount}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contribution.date}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contribution.purpose}</td>
    </tr>
);

const ContributionForm = ({ members, closeModel }) => {
    const { data, setData, post, processing, errors } = useForm({
        member_id: '',
        date: '',
        purpose: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('contributions.store'), {
            onSuccess: () => closeModel(),
        });
    };

    return (
        <Modal show={true} onClose={closeModel} title="Add Contribution" maxWidth="lg">
            <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-4">
                    <div>
                        <InputLabel htmlFor="member_id" value="Member" />
                        <select
                            id="member_id"
                            value={data.member_id}
                            onChange={e => setData('member_id', e.target.value)}
                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                        >
                            <option value="">Select Member</option>
                            {members.map(member => (
                                <option key={member.id} value={member.id}>{member.name}</option>
                            ))}
                        </select>
                        <InputError message={errors.member_id} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="date" value="Date" />
                        <TextInput
                            id="date"
                            type="date"
                            value={data.date}
                            onChange={e => setData('date', e.target.value)}
                            className="mt-1 block w-full"
                        />
                        <InputError message={errors.date} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="purpose" value="Purpose" />
                        <TextInput
                            id="purpose"
                            type="text"
                            value={data.purpose}
                            onChange={e => setData('purpose', e.target.value)}
                            placeholder="Purpose"
                            className="mt-1 block w-full"
                        />
                        <InputError message={errors.purpose} className="mt-2" />
                    </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                    <SecondaryButton onClick={closeModel}>
                        Cancel
                    </SecondaryButton>
                    <PrimaryButton type="submit" disabled={processing}>
                        {processing ? 'Creating...' : 'Create'}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
};

import { router } from '@inertiajs/react';
import { useEffect } from 'react';
import ImportModal from '../../Components/ImportModal';

export default function ContributionsIndex({ members, contributionsByMonth, filters }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const { auth } = usePage().props;
    const user = auth?.user;
    const isAdmin = user?.role === 'admin';

    const [search, setSearch] = useState(filters.search || '');
    const [year, setYear] = useState(filters.year || new Date().getFullYear());
    const [month, setMonth] = useState(filters.month || '');
    const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);

    useEffect(() => {
        setYear(filters.year || new Date().getFullYear());
        setMonth(filters.month || '');
        setSearch(filters.search || '');
    }, [filters]);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleFilterChange = () => {
        router.get('/contributions', { search, year, month }, { preserveState: true });
    };

    const handleImport = (file) => {
        const formData = new FormData();
        formData.append('file', file);
        router.post('/contributions/import', formData, {
            onSuccess: () => setIsImportModalOpen(false),
        });
    };

    const clearFilter = () => {
        router.get('/contributions');
    };

    const months = Array.from({ length: 12 }, (_, i) => {
        const month = new Date(null, i + 1, null).toLocaleDateString('en', { month: 'long' });
        return { value: i + 1, label: month };
    });

    const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

    return (
        <SidebarLayout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Contributions</h1>
                <div className="flex items-center">
                    <div className="relative inline-block text-left">
                        <div>
                            <button onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)} type="button" className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" id="options-menu" aria-haspopup="true" aria-expanded="true">
                                Export
                                <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                        {isExportDropdownOpen && (
                            <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                    <a href={route('contributions.export', { format: 'pdf', search, year, month })} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">PDF</a>
                                    <a href={route('contributions.export', { format: 'xlsx', search, year, month })} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Excel</a>
                                    <a href={route('contributions.export', { format: 'csv', search, year, month })} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">CSV</a>
                                </div>
                            </div>
                        )}
                    </div>
                    {isAdmin && <button onClick={() => setIsImportModalOpen(true)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md ml-2">Import</button>}
                    {isAdmin && <button onClick={openModal} className="bg-indigo-600 text-white px-4 py-2 rounded-md ml-4">Add Contribution</button>}
                </div>
            </div>
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name..." className="border rounded p-2" />
                    <select value={year} onChange={e => setYear(e.target.value)} className="border rounded p-2 ml-2">
                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                    <select value={month} onChange={e => setMonth(e.target.value)} className="border rounded p-2 ml-2">
                        <option value="">All Months</option>
                        {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                    </select>
                    <button onClick={handleFilterChange} className="bg-blue-600 text-white px-4 py-2 rounded-md ml-2">Filter</button>
                    <button onClick={clearFilter} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md ml-2">Clear</button>
                </div>
            </div>
            <div className="flex flex-col">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                                        {months.map(m => (
                                            <th key={m.value} scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{m.label} {year}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {members.data.map(member => (
                                        <tr key={member.id}>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{member.name}</td>
                                            {months.map(month => {
                                                const monthIndex = new Date(Date.parse(month.label + " 1, 2012")).getMonth() + 1;
                                                const monthString = `${year}-${String(monthIndex).padStart(2, '0')}`;
                                                const contribution = contributionsByMonth[member.id]?.[monthString];
                                                return (
                                                    <td key={month.value} className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                                        {contribution ? contribution.amount : '0'}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-6">
                {
                    members.links.map(link => (
                        <a key={link.label} href={link.url} dangerouslySetInnerHTML={{ __html: link.label }} className={`px-4 py-2 border ${link.active ? 'bg-blue-500 text-white' : ''}`}></a>
                    ))
                }
            </div>
            {isModalOpen && <ContributionForm members={members.data} closeModel={closeModal} />}
            <ImportModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                onImport={handleImport}
            />
        </SidebarLayout>
    );
}
