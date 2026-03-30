import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ isOpen, toggleSidebar }) {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = (e) => {
        e.preventDefault();
        logout();
        navigate('/');
    };

    return (
        <aside className={`sidebar glass-panel ${!isOpen ? 'collapsed' : ''} ${window.innerWidth <= 991 && isOpen ? 'mobile-open' : ''}`} id="sidebar">
            <div className="logo-area">
                <i className="fas fa-cube logo-icon"></i>
                <h4>EMP Admin</h4>
            </div>

            <ul className="sidebar-menu">
                <li>
                    <NavLink to="/dashboard" end className={({ isActive }) => isActive ? 'active' : ''}>
                        <i className="fas fa-home"></i>
                        <span>Dashboard</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/employees" end className={({ isActive }) => isActive ? 'active' : ''}>
                        <i className="fas fa-users"></i>
                        <span>Employees</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/employees/add" className={({ isActive }) => isActive ? 'active' : ''}>
                        <i className="fas fa-user-plus"></i>
                        <span>Add Employee</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/reports" className={({ isActive }) => isActive ? 'active' : ''}>
                        <i className="fas fa-chart-bar"></i>
                        <span>Reports</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/settings" className={({ isActive }) => isActive ? 'active' : ''}>
                        <i className="fas fa-cog"></i>
                        <span>Settings</span>
                    </NavLink>
                </li>
            </ul>

            <div className="mt-auto p-4">
                <button onClick={handleLogout} className="btn w-100 d-flex align-items-center justify-content-center gap-2"
                    style={{ borderRadius: '0.75rem', background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', transition: 'all 0.3s' }}>
                    <i className="fas fa-sign-out-alt"></i>
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}
