import React from 'react';
import { Bar } from 'react-chartjs-2';
import SidebarLayout from '../../Layouts/SidebarLayout';

export default function Charts({ chartData }) {
    return (
        <SidebarLayout>
            <h1 className="text-2xl font-bold mb-4">Admin Charts</h1>
            <Bar data={chartData} />
        </SidebarLayout>
    );
}
