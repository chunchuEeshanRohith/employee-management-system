import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export default function Settings() {
    const { token, logout } = useAuth();
    
    const [profile, setProfile] = useState({ name: '', email: '', theme: 'light', notificationsEnabled: true });
    const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
    
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState({ profile: null, security: null, prefs: null });

    useEffect(() => {
        let isMounted = true;
        const fetchSettings = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/settings`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (isMounted) {
                    setProfile(response.data);
                    applyTheme(response.data.theme);
                }
            } catch (err) {
                if (err.response?.status === 401) logout();
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchSettings();
        return () => isMounted = false;
    }, [token, logout]);

    const applyTheme = (theme) => {
        document.documentElement.setAttribute('data-bs-theme', theme);
        localStorage.setItem('appTheme', theme);
    };

    const handleProfileChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handlePreferenceToggle = async (field) => {
        const newProfile = { ...profile, [field]: field === 'theme' ? (profile.theme === 'light' ? 'dark' : 'light') : !profile.notificationsEnabled };
        setProfile(newProfile);
        
        if (field === 'theme') {
            applyTheme(newProfile.theme);
        }

        try {
            await axios.put(`${API_BASE_URL}/settings/update`, newProfile, {
                headers: { Authorization: `Bearer ${token}` }
            });
            showMessage('prefs', 'Preferences updated automatically', 'success');
        } catch (err) {
            showMessage('prefs', 'Failed to update preferences', 'danger');
            // Revert on failure
            setProfile(profile);
            if (field === 'theme') applyTheme(profile.theme);
        }
    };

    const showMessage = (section, text, type) => {
        setMessages(prev => ({ ...prev, [section]: { text, type } }));
        setTimeout(() => setMessages(prev => ({ ...prev, [section]: null })), 3000);
    };

    const saveProfile = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${API_BASE_URL}/settings/update`, profile, {
                headers: { Authorization: `Bearer ${token}` }
            });
            showMessage('profile', 'Profile updated successfully', 'success');
        } catch (err) {
            showMessage('profile', 'Failed to update profile', 'danger');
        }
    };

    const updatePassword = async (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            return showMessage('security', 'Passwords do not match', 'danger');
        }
        try {
            await axios.put(`${API_BASE_URL}/settings/change-password`, passwords, {
                headers: { Authorization: `Bearer ${token}` }
            });
            showMessage('security', 'Password changed gracefully', 'success');
            setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            showMessage('security', err.response?.data?.message || 'Failed to change password', 'danger');
        }
    };

    if (loading) return <div className="p-5 text-center"><i className="fas fa-spinner fa-spin fa-2x text-primary"></i></div>;

    return (
        <div className="p-4">
            <h2 className="fw-bold mb-4">System Settings</h2>
            
            <div className="row g-4">
                {/* Profile Settings */}
                <div className="col-xl-6">
                    <div className="glass-card p-4 h-100">
                        <h5 className="border-bottom pb-2 mb-4"><i className="fas fa-user-edit me-2 text-primary"></i>Profile Details</h5>
                        {messages.profile && <div className={`alert alert-${messages.profile.type} py-2 small`}>{messages.profile.text}</div>}
                        
                        <form onSubmit={saveProfile}>
                            <div className="mb-3">
                                <label className="form-label small fw-bold text-muted text-uppercase">Full Name</label>
                                <input type="text" className="form-control bg-transparent border-light" name="name" value={profile.name} onChange={handleProfileChange} required />
                            </div>
                            <div className="mb-4">
                                <label className="form-label small fw-bold text-muted text-uppercase">Email Address</label>
                                <input type="email" className="form-control bg-transparent border-light" name="email" value={profile.email} onChange={handleProfileChange} required />
                            </div>
                            <button type="submit" className="btn btn-primary shadow-sm"><i className="fas fa-save me-2"></i>Save Profile</button>
                        </form>
                    </div>
                </div>

                {/* Preferences */}
                <div className="col-xl-6">
                    <div className="glass-card p-4 h-100">
                        <h5 className="border-bottom pb-2 mb-4"><i className="fas fa-sliders-h me-2 text-success"></i>Global Preferences</h5>
                        {messages.prefs && <div className={`alert alert-${messages.prefs.type} py-2 small`}>{messages.prefs.text}</div>}

                        <div className="d-flex justify-content-between align-items-center mb-4 p-3 border border-light rounded">
                            <div>
                                <h6 className="mb-1 fw-bold">Dark Mode</h6>
                                <small className="text-muted">Toggle application theme aesthetic</small>
                            </div>
                            <div className="form-check form-switch fs-4">
                                <input className="form-check-input bg-transparent border-light cursor-pointer" type="checkbox" role="switch" checked={profile.theme === 'dark'} onChange={() => handlePreferenceToggle('theme')} />
                            </div>
                        </div>


                    </div>
                </div>

                {/* Security Settings */}
                <div className="col-xl-6">
                    <div className="glass-card p-4 h-100">
                        <h5 className="border-bottom pb-2 mb-4"><i className="fas fa-shield-alt me-2 text-danger"></i>Security Settings</h5>
                        {messages.security && <div className={`alert alert-${messages.security.type} py-2 small`}>{messages.security.text}</div>}
                        
                        <form onSubmit={updatePassword}>
                            <div className="mb-3">
                                <label className="form-label small fw-bold text-muted text-uppercase">Current Password</label>
                                <input type="password" className="form-control bg-transparent border-light" name="oldPassword" value={passwords.oldPassword} onChange={handlePasswordChange} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label small fw-bold text-muted text-uppercase">New Password</label>
                                <input type="password" className="form-control bg-transparent border-light" name="newPassword" value={passwords.newPassword} onChange={handlePasswordChange} required />
                            </div>
                            <div className="mb-4">
                                <label className="form-label small fw-bold text-muted text-uppercase">Confirm New Password</label>
                                <input type="password" className="form-control bg-transparent border-light" name="confirmPassword" value={passwords.confirmPassword} onChange={handlePasswordChange} required />
                            </div>
                            <button type="submit" className="btn btn-danger shadow-sm"><i className="fas fa-key me-2"></i>Update Password</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
