import React from 'react';

export default function TopNavbar({ toggleSidebar }) {
    const handleNotification = () => {
        alert('No new notifications right now.');
    };

    return (
        <nav className="top-navbar">
            <button className="toggle-btn" id="sidebarToggle" onClick={toggleSidebar}>
                <i className="fas fa-bars"></i>
            </button>

            <div className="user-profile">
                <button 
                    className="btn btn-sm btn-light rounded-circle shadow-sm me-2 position-relative"
                    style={{ width: '35px', height: '35px' }}
                    onClick={handleNotification}
                >
                    <i className="fas fa-bell text-muted"></i>
                </button>
                <div className="text-end d-none d-md-block">
                    <div className="fw-bold fs-6" style={{ lineHeight: 1 }}>Admin User</div>
                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>Super Admin</div>
                </div>
                <img src="https://ui-avatars.com/api/?name=Admin+User&background=2563EB&color=fff" alt="Profile" />
            </div>
        </nav>
    );
}
