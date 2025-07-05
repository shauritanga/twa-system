import React, { useState, useEffect } from 'react';
import SidebarLayout from '../../Layouts/SidebarLayout';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function Reports() {
    const [type, setType] = useState('contributions');
    const [format, setFormat] = useState('csv');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        fetch(`/admin/charts?type=${type}`)
            .then(response => response.json())
            .then(data => {
                const months = [
                    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
                ];
                const chart = {
                    labels: months,
                    datasets: [
                        {
                            label: data.chartData.datasets[0].label,
                            data: months.map((month, index) => {
                                const monthIndex = data.chartData.labels.indexOf(month);
                                return monthIndex !== -1 ? data.chartData.datasets[0].data[monthIndex] : 0;
                            }),
                            backgroundColor: 'rgba(59, 130, 246, 0.7)',
                            borderColor: 'rgba(59, 130, 246, 1)',
                            borderWidth: 1,
                        },
                    ],
                };
                setChartData(chart);
            });
    }, [type]);

    const handleExport = () => {
        window.location.href = `/admin/report?type=${type}&format=${format}&start_date=${startDate}&end_date=${endDate}`;
    };

    return (
        <SidebarLayout>
            <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Admin Reports</h1>
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block mb-2 text-gray-700 dark:text-gray-300">Select Report Type:</label>
                        <select value={type} onChange={e => setType(e.target.value)} className="border rounded p-2 w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white">
                            <option value="contributions">Contributions</option>
                            <option value="debts">Debts</option>
                            <option value="penalties">Penalties</option>
                            <option value="disaster_payments">Disaster Payments</option>
                        </select>
                    </div>
                    <div>
                        <label className="block mb-2 text-gray-700 dark:text-gray-300">Select Export Format:</label>
                        <select value={format} onChange={e => setFormat(e.target.value)} className="border rounded p-2 w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white">
                            <option value="csv">CSV</option>
                            <option value="xlsx">Excel</option>
                            <option value="pdf">PDF</option>
                        </select>
                    </div>
                    <div>
                        <label className="block mb-2 text-gray-700 dark:text-gray-300">Start Date:</label>
                        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="border rounded p-2 w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white" />
                    </div>
                    <div>
                        <label className="block mb-2 text-gray-700 dark:text-gray-300">End Date:</label>
                        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="border rounded p-2 w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white" />
                    </div>
                </div>
                <div className="mt-6">
                    <button onClick={handleExport} className="bg-blue-600 text-white px-4 py-2 rounded">Export</button>
                </div>
            </div>
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg p-5 mt-6">
                <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Report Chart</h2>
                {chartData && (
                    <div style={{ height: '400px' }}>
                        <Bar
                            data={chartData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        position: 'top',
                                    },
                                },
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                    },
                                },
                            }}
                        />
                    </div>
                )}
            </div>
        </SidebarLayout>
    );
}
