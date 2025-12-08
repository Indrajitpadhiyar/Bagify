import React from 'react';
import AdminLayout from './AdminLayout';

const Dashboard = () => {
    return (
        <AdminLayout>
            <div className="text-center py-20">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Admin Dashboard</h1>
                <p className="text-gray-500">Select an option from the sidebar to manage your store.</p>
            </div>
        </AdminLayout>
    );
};

export default Dashboard;
