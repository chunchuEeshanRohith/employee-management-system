import { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
    const { isAuthenticated } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        document.body.classList.add('page-enter');
        return () => document.body.classList.remove('page-enter');
    }, []);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
        if (window.innerWidth > 991) {
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'));
            }, 300);
        }
    };

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="dashboard-wrapper">
            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            <main className="main-content">
                <TopNavbar toggleSidebar={toggleSidebar} />
                <div className="page-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
