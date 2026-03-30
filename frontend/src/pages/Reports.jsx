import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export default function Reports() {
    const { token, logout } = useAuth();
    
    // Filters State
    const [filters, setFilters] = useState({
        department: '',
        minSalary: '',
        maxSalary: '',
        startDate: '',
        endDate: ''
    });

    // Pagination State
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    // Data State
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Chart Data State
    const [chartData, setChartData] = useState({
        departments: {},
        salaries: []
    });

    useEffect(() => {
        fetchReports();
    }, [page]); 

    const fetchReports = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams({
                page,
                size,
                sortBy: 'id',
                sortDir: 'asc'
            });

            if (filters.department) params.append('department', filters.department);
            if (filters.minSalary) params.append('minSalary', filters.minSalary);
            if (filters.maxSalary) params.append('maxSalary', filters.maxSalary);
            if (filters.startDate) params.append('startDate', filters.startDate);
            if (filters.endDate) params.append('endDate', filters.endDate);

            const response = await axios.get(`${API_BASE_URL}/reports/employees?${params.toString()}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setData(response.data.content);
            setTotalPages(response.data.totalPages);
            setTotalElements(response.data.totalElements);

            const depts = {};
            const sals = [];
            response.data.content.forEach(emp => {
                depts[emp.department] = (depts[emp.department] || 0) + 1;
                sals.push(emp.salary);
            });
            setChartData({ departments: depts, salaries: sals });

        } catch (err) {
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                logout();
            } else {
                setError('Failed to load reports. ' + (err.response?.data?.message || ''));
            }
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleGenerate = () => {
        setPage(0);
        fetchReports();
    };

    const handleExport = async (type) => {
        try {
            const params = new URLSearchParams();
            if (filters.department) params.append('department', filters.department);
            if (filters.minSalary) params.append('minSalary', filters.minSalary);
            if (filters.maxSalary) params.append('maxSalary', filters.maxSalary);
            if (filters.startDate) params.append('startDate', filters.startDate);
            if (filters.endDate) params.append('endDate', filters.endDate);

            const response = await axios.get(`${API_BASE_URL}/reports/export/${type}?${params.toString()}`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `employee-report.${type}`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (err) {
            alert(`Failed to export ${type.toUpperCase()}`);
        }
    };

    // Chart Configs
    const pieData = {
        labels: Object.keys(chartData.departments).map(d => d.charAt(0).toUpperCase() + d.slice(1)),
        datasets: [{
            data: Object.values(chartData.departments),
            backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b'],
            borderWidth: 0,
        }]
    };

    const barData = {
        labels: data.map(d => d.name),
        datasets: [{
            label: 'Salary ($)',
            data: data.map(d => d.salary),
            backgroundColor: '#4e73df',
        }]
    };

    return (
        <div className="p-4">
            <h2 className="fw-bold mb-4">Employee Reports</h2>

            {/* Filters Section */}
            <div className="glass-card p-4 mb-4">
                <h5 className="mb-3 text-muted border-bottom pb-2">Report Filters</h5>
                <div className="row g-3">
                    <div className="col-md-3">
                        <label className="form-label small">Department</label>
                        <select className="form-select bg-transparent border-light" name="department" value={filters.department} onChange={handleFilterChange}>
                            <option value="">All Departments</option>
                            <option value="engineering">Engineering</option>
                            <option value="design">Design</option>
                            <option value="marketing">Marketing</option>
                            <option value="hr">Human Resources</option>
                        </select>
                    </div>
                    <div className="col-md-2">
                        <label className="form-label small">Min Salary</label>
                        <input type="number" className="form-control bg-transparent border-light" name="minSalary" value={filters.minSalary} onChange={handleFilterChange} placeholder="0" />
                    </div>
                    <div className="col-md-2">
                        <label className="form-label small">Max Salary</label>
                        <input type="number" className="form-control bg-transparent border-light" name="maxSalary" value={filters.maxSalary} onChange={handleFilterChange} placeholder="1000000" />
                    </div>
                    <div className="col-md-2">
                        <label className="form-label small">Joining Start</label>
                        <input type="date" className="form-control bg-transparent border-light" name="startDate" value={filters.startDate} onChange={handleFilterChange} />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label small">Joining End</label>
                        <div className="d-flex gap-2">
                            <input type="date" className="form-control bg-transparent border-light" name="endDate" value={filters.endDate} onChange={handleFilterChange} />
                        </div>
                    </div>
                </div>
                <div className="d-flex gap-2 mt-3 justify-content-end">
                    <button className="btn btn-primary shadow-sm" onClick={handleGenerate}>
                        <i className="fas fa-filter me-2"></i>Generate Report
                    </button>
                    <button className="btn btn-danger shadow-sm" onClick={() => handleExport('pdf')}>
                        <i className="fas fa-file-pdf me-2"></i>Export PDF
                    </button>
                    <button className="btn btn-success shadow-sm" onClick={() => handleExport('csv')}>
                        <i className="fas fa-file-excel me-2"></i>Export CSV
                    </button>
                </div>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            {/* Analytics Section */}
            <div className="row g-4 mb-4">
                <div className="col-xl-3 col-md-6">
                    <div className="glass-card stat-card p-4">
                        <h6 className="text-muted text-uppercase mb-2">Total Results</h6>
                        <div className="d-flex justify-content-between align-items-center">
                            <h2 className="mb-0 fw-bold">{totalElements}</h2>
                            <div className="stat-icon bg-primary bg-opacity-10 text-primary">
                                <i className="fas fa-users"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-4 col-md-6">
                    <div className="glass-card p-4 h-100">
                        <h6 className="text-muted mb-4">Department Distribution</h6>
                        <div style={{ height: '200px' }} className="d-flex justify-content-center">
                            {Object.keys(chartData.departments).length > 0 ? <Pie data={pieData} options={{ maintainAspectRatio: false }} /> : <p className="text-muted mt-5">No Data</p>}
                        </div>
                    </div>
                </div>

                <div className="col-xl-5 col-md-12">
                    <div className="glass-card p-4 h-100">
                        <h6 className="text-muted mb-4">Salary Distribution</h6>
                        <div style={{ height: '200px' }}>
                            {data.length > 0 ? <Bar data={barData} options={{ maintainAspectRatio: false }} /> : <p className="text-muted mt-5 text-center">No Data</p>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Data Table */}
            <div className="glass-card p-0 overflow-hidden">
                <div className="table-responsive">
                    <table className="table table-hover mb-0 custom-table">
                        <thead className="bg-light bg-opacity-50">
                            <tr>
                                <th className="border-0 px-4 py-3">ID</th>
                                <th className="border-0 px-4 py-3">Employee</th>
                                <th className="border-0 py-3">Department</th>
                                <th className="border-0 py-3">Salary</th>
                                <th className="border-0 py-3">Joining Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-5">
                                        <i className="fas fa-spinner fa-spin fa-2x text-primary"></i>
                                    </td>
                                </tr>
                            ) : data.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-5 text-muted">No employees match this criteria.</td>
                                </tr>
                            ) : (
                                data.map(emp => (
                                    <tr key={emp.id}>
                                        <td className="px-4 py-3 fw-bold text-muted">#{emp.id}</td>
                                        <td className="px-4 py-3">
                                            <div className="fw-bold">{emp.name}</div>
                                            <small className="text-muted">{emp.email}</small>
                                        </td>
                                        <td className="py-3">
                                            <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill text-capitalize">
                                                {emp.department}
                                            </span>
                                        </td>
                                        <td className="py-3 fw-bold">${emp.salary.toLocaleString()}</td>
                                        <td className="py-3 text-muted">{emp.joiningDate || 'N/A'}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="p-4 border-top border-light d-flex justify-content-between align-items-center bg-light bg-opacity-25">
                        <span className="text-muted small">Showing Page {page + 1} of {totalPages}</span>
                        <div className="d-flex gap-2">
                            <button className="btn btn-outline-primary btn-sm px-3 shadow-sm" disabled={page === 0} onClick={() => setPage(page - 1)}>
                                Previous
                            </button>
                            <button className="btn btn-outline-primary btn-sm px-3 shadow-sm" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
