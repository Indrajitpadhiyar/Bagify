import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

const AdminLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

                {/* Mobile Header */}
                <div className="lg:hidden bg-white h-16 border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-30">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="text-gray-600 hover:text-orange-600 p-2 rounded-lg hover:bg-orange-50 transition-colors"
                    >
                        <Menu size={24} />
                    </button>
                    <span className="font-bold text-gray-800">Bagify Admin</span>
                    <div className="w-8"></div> {/* Spacer */}
                </div>

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50/50 scrollbar-hide">
                    <div className="max-w-7xl mx-auto space-y-6">
                        {children}
                    </div>
                </main>
            </div>
            <Toaster position="top-right" />
        </div>
    );
};

export default AdminLayout;
