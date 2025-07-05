import React from 'react';
import { Line, Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement);

export const MonthlyComparisonChart = ({ monthlyContributions = [], monthlyDisasterPayments = [] }) => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    const labels = monthNames.map((month, index) => `${month} ${currentYear}`);

    const data = {
        labels,
        datasets: [
            {
                label: 'Contributions',
                data: monthNames.map((month, index) => {
                    const monthString = `${currentYear}-${String(index + 1).padStart(2, '0')}`;
                    const contribution = monthlyContributions.find(c => c.month === monthString);
                    return contribution ? contribution.total : 0;
                }),
                backgroundColor: 'rgb(75, 192, 192)',
            },
            {
                label: 'Disaster Payments',
                data: monthNames.map((month, index) => {
                    const monthString = `${currentYear}-${String(index + 1).padStart(2, '0')}`;
                    const payment = monthlyDisasterPayments.find(p => p.month === monthString);
                    return payment ? payment.total : 0;
                }),
                backgroundColor: 'rgb(255, 99, 132)',
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
            padding: {
                bottom: 40, // Add extra space for axis/legend
            },
        },
        plugins: {
            legend: {
                position: 'top',
            },
        },
    };

    return <Bar data={data} options={options} />;
};

export const ContributionsComparisonChart = ({ memberContributions, otherContributions }) => {
    const data = {
        labels: ['Your Contributions', 'Others Contributions'],
        datasets: [
            {
                data: [memberContributions, otherContributions],
                backgroundColor: ['rgb(75, 192, 192)', 'rgb(255, 99, 132)'],
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
            padding: {
                bottom: 40, // Add extra space for legend
            },
        },
        plugins: {
            legend: {
                position: 'top',
            },
        },
    };

    return <Pie data={data} options={options} />;
};
