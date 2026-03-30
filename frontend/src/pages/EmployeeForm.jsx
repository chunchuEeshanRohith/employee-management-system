import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export default function EmployeeForm() {
    const { id } = useParams();
    const isEditMode = !!id;
    const { token, logout } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(isEditMode);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        department: '',
        salary: '',
        joiningDate: ''
    });

    useEffect(() => {
        if (isEditMode) {
            const fetchEmployee = async () => {
                try {
                    const response = await axios.get(`${API_BASE_URL}/employees/${id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setFormData({
                        name: response.data.name,
                        email: response.data.email,
                        phone: response.data.phone,
                        department: response.data.department.toLowerCase(),
                        salary: response.data.salary,
                        joiningDate: response.data.joiningDate || ''
                    });
                } catch (err) {
                    if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                        logout();
                    } else {
                        setError('Failed to fetch employee details');
                    }
                } finally {
                    setLoading(false);
                }
            };
            fetchEmployee();
        }
    }, [id, isEditMode, token, logout]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        const payload = {
            ...formData,
            salary: parseFloat(formData.salary)
        };

        try {
            if (isEditMode) {
                await axios.put(`${API_BASE_URL}/employees/${id}`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post(`${API_BASE_URL}/employees`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            navigate('/employees');
        } catch (err) {
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                logout();
            } else {
                setError(err.response?.data?.message || err.response?.data?.error || 'Failed to save employee');
            }
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="p-5 text-center"><i className="fas fa-spinner fa-spin fa-2x text-primary"></i></div>;
    }

    return (
        <div className="row justify-content-center">
            <div className="col-12 col-xl-8">
                <div className="d-flex justify-content-between align-items-center mb-4 gap-3">
                    <h2 className="fw-bold mb-0">{isEditMode ? 'Edit Employee' : 'Add New Employee'}</h2>
                    <Link to="/employees" className="btn btn-light rounded-pill shadow-sm">
                        <i className="fas fa-arrow-left me-2"></i> Back to List
                    </Link>
                </div>

                <div className="glass-card p-4">
                    {error && <div className="alert alert-danger">{error}</div>}
                    
                    <form onSubmit={handleSubmit}>
                        <div className="row g-4 mb-4">
                            <div className="col-md-6">
                                <label className="form-label text-muted small fw-bold text-uppercase">Full Name</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-transparent border-end-0 border-light"><i className="fas fa-user text-muted"></i></span>
                                    <input type="text" className="form-control border-start-0 border-light bg-transparent" required name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label text-muted small fw-bold text-uppercase">Email Address</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-transparent border-end-0 border-light"><i className="fas fa-envelope text-muted"></i></span>
                                    <input type="email" className="form-control border-start-0 border-light bg-transparent" required name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label text-muted small fw-bold text-uppercase">Phone Number</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-transparent border-end-0 border-light"><i className="fas fa-phone text-muted"></i></span>
                                    <input type="tel" className="form-control border-start-0 border-light bg-transparent" required name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label text-muted small fw-bold text-uppercase">Department</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-transparent border-end-0 border-light"><i className="fas fa-building text-muted"></i></span>
                                    <select className="form-select border-start-0 border-light bg-transparent" required name="department" value={formData.department} onChange={handleChange}>
                                        <option value="" disabled>Select Department...</option>
                                        <option value="engineering">Engineering</option>
                                        <option value="design">Design</option>
                                        <option value="marketing">Marketing</option>
                                        <option value="hr">Human Resources</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label text-muted small fw-bold text-uppercase">Salary</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-transparent border-end-0 border-light"><i className="fas fa-dollar-sign text-muted"></i></span>
                                    <input type="number" step="0.01" className="form-control border-start-0 border-light bg-transparent" required name="salary" value={formData.salary} onChange={handleChange} placeholder="75000" />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label text-muted small fw-bold text-uppercase">Joining Date</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-transparent border-end-0 border-light"><i className="fas fa-calendar-alt text-muted"></i></span>
                                    <input type="date" className="form-control border-start-0 border-light bg-transparent" required name="joiningDate" value={formData.joiningDate} onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                        <div className="d-flex justify-content-end gap-2 pt-3 border-top border-light">
                            <Link to="/employees" className="btn btn-light px-4">Cancel</Link>
                            <button type="submit" className="btn btn-primary px-4 shadow-sm" disabled={saving}>
                                {saving ? <><i className="fas fa-spinner fa-spin me-2"></i>{isEditMode ? 'Updating...' : 'Saving...'}</> : <><i className="fas fa-save me-2"></i>{isEditMode ? 'Update Employee' : 'Save Employee'}</>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
