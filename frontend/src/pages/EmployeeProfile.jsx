import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = 'http://localhost:8080/api';

export default function EmployeeProfile() {
    const { id } = useParams();
    const { token, logout } = useAuth();
    const navigate = useNavigate();
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/employees/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setEmployee(response.data);
            } catch (err) {
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    logout();
                }
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchEmployee();
    }, [id, token, logout]);

    const deleteEmployee = async () => {
        if (!window.confirm('Are you sure you want to delete this employee?')) return;
        try {
            await axios.delete(`${API_BASE_URL}/employees/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate('/employees');
        } catch (err) {
            alert('Error deleting employee');
        }
    };

    if (loading) {
        return <div className="p-5 text-center"><i className="fas fa-spinner fa-spin fa-2x text-primary"></i></div>;
    }

    if (!employee) {
        return <div className="p-5 text-center text-danger">Employee not found.</div>;
    }

    return (
        <div className="row justify-content-center">
            <div className="col-12 col-xl-10">
                <div className="d-flex justify-content-between align-items-center mb-4 gap-3">
                    <h2 className="fw-bold mb-0">Employee Profile</h2>
                    <Link to="/employees" className="btn btn-light rounded-pill shadow-sm">
                        <i className="fas fa-arrow-left me-2"></i> Back to List
                    </Link>
                </div>

                <div className="row g-4">
                    <div className="col-12 col-md-4">
                        <div className="glass-card p-4 text-center h-100">
                            <div className="position-relative d-inline-block mb-3">
                                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(employee.name)}&background=random&size=150`} alt="Profile" className="rounded-circle shadow-sm" style={{ width: '150px', height: '150px' }} />
                                <span className="position-absolute bottom-0 end-0 p-2 bg-success border border-light rounded-circle" style={{ transform: 'translate(-10px, -10px)' }}></span>
                            </div>
                            <h4 className="fw-bold mb-1">{employee.name}</h4>
                            <p className="text-muted mb-3">{employee.department} Department</p>
                            
                            <div className="d-flex justify-content-center gap-2 mb-4">
                                <Link to={`/employees/edit/${employee.id}`} className="btn btn-sm btn-outline-primary px-3">
                                    <i className="fas fa-edit me-1"></i> Edit
                                </Link>
                                <button className="btn btn-sm btn-outline-danger px-3" onClick={deleteEmployee}>
                                    <i className="fas fa-trash me-1"></i> Delete
                                </button>
                            </div>

                            <div className="border-top border-light pt-3 text-start">
                                <div className="mb-2">
                                    <small className="text-muted d-block text-uppercase fw-bold" style={{ fontSize: '0.7rem' }}>Employee ID</small>
                                    <span className="fw-medium">EMP-{employee.id}</span>
                                </div>
                                <div className="mb-2">
                                    <small className="text-muted d-block text-uppercase fw-bold" style={{ fontSize: '0.7rem' }}>Status</small>
                                    <span className="badge badge-soft badge-green">Active</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-md-8">
                        <div className="glass-card p-4 h-100">
                            <h5 className="fw-bold mb-4 border-bottom border-light pb-2">Personal Information</h5>
                            
                            <div className="row g-4 mb-4">
                                <div className="col-sm-6">
                                    <div className="d-flex align-items-start gap-3">
                                        <div className="p-3 bg-light rounded-circle text-primary" style={{ background: 'rgba(255,255,255,0.5) !important' }}>
                                            <i className="fas fa-envelope fa-lg"></i>
                                        </div>
                                        <div>
                                            <small className="text-muted d-block text-uppercase fw-bold" style={{ fontSize: '0.7rem' }}>Email Address</small>
                                            <span className="fw-medium">{employee.email}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="d-flex align-items-start gap-3">
                                        <div className="p-3 bg-light rounded-circle text-primary" style={{ background: 'rgba(255,255,255,0.5) !important' }}>
                                            <i className="fas fa-phone fa-lg"></i>
                                        </div>
                                        <div>
                                            <small className="text-muted d-block text-uppercase fw-bold" style={{ fontSize: '0.7rem' }}>Phone Number</small>
                                            <span className="fw-medium">{employee.phone}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="d-flex align-items-start gap-3">
                                        <div className="p-3 bg-light rounded-circle text-primary" style={{ background: 'rgba(255,255,255,0.5) !important' }}>
                                            <i className="fas fa-building fa-lg"></i>
                                        </div>
                                        <div>
                                            <small className="text-muted d-block text-uppercase fw-bold" style={{ fontSize: '0.7rem' }}>Department</small>
                                            <span className="fw-medium text-capitalize">{employee.department}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="d-flex align-items-start gap-3">
                                        <div className="p-3 bg-light rounded-circle text-primary" style={{ background: 'rgba(255,255,255,0.5) !important' }}>
                                            <i className="fas fa-money-bill-wave fa-lg"></i>
                                        </div>
                                        <div>
                                            <small className="text-muted d-block text-uppercase fw-bold" style={{ fontSize: '0.7rem' }}>Salary</small>
                                            <span className="fw-medium">${new Intl.NumberFormat().format(employee.salary)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
