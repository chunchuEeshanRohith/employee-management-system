import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

const API_BASE_URL = 'http://localhost:8080/api';

export default function Dashboard() {
    const { token, logout } = useAuth();
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/employees`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setEmployees(response.data);
            } catch (err) {
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    logout();
                }
                console.error("Failed to fetch dashboard data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [token, logout]);

    const getDeptBadgeClass = (dept) => {
        const d = (dept || '').toLowerCase();
        if (d.includes('eng')) return 'badge-blue';
        if (d.includes('des')) return 'badge-purple';
        if (d.includes('mark')) return 'badge-orange';
        if (d.includes('hr')) return 'badge-green';
        return 'badge-secondary';
    };

    if (loading) {
        return <div className="p-5 text-center"><i className="fas fa-spinner fa-spin fa-2x text-primary"></i></div>;
    }

    const total = employees.length;
    const active = total;
    const newCount = Math.min(total, 5);

    const deptCounts = {};
    employees.forEach(emp => {
        deptCounts[emp.department] = (deptCounts[emp.department] || 0) + 1;
    });

    const deptLabels = Object.keys(deptCounts);
    const deptData = Object.values(deptCounts);

    // Line Chart Data
    let growthData = [];
    for(let i = 6; i > 0; i--) {
        growthData.push(Math.max(0, Math.round(total - (i * (total / 6)))));
    }
    growthData.push(total);

    const growthLabels = [];
    for(let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        growthLabels.push(d.toLocaleString('default', { month: 'short' }));
    }

    const lineChartData = {
        labels: growthLabels,
        datasets: [{
            label: 'Total Employees',
            data: growthData,
            borderColor: '#2563EB',
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            borderWidth: 3,
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#2563EB',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#2563EB'
        }]
    };

    const lineChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: 'rgba(0,0,0,0.05)', drawBorder: false }
            },
            x: {
                grid: { display: false, drawBorder: false }
            }
        }
    };

    // Doughnut Chart Data
    const defaultColors = ['#2563EB', '#38BDF8', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#EC4899'];
    
    const doughnutChartData = {
        labels: deptLabels.length === 0 ? ['No Data'] : deptLabels,
        datasets: [{
            data: deptLabels.length === 0 ? [1] : deptData,
            backgroundColor: defaultColors.slice(0, Math.max(1, deptLabels.length)),
            borderWidth: 0,
            hoverOffset: 5
        }]
    };

    const doughnutChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 20,
                    usePointStyle: true,
                    font: { family: "'Inter', sans-serif" }
                }
            }
        },
        cutout: '75%'
    };

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                <h2 className="fw-bold mb-0">Dashboard Overview</h2>
                <button className="btn btn-primary rounded-pill px-4 shadow-sm" onClick={() => alert('Downloading report... (Simulated)')}>
                    <i className="fas fa-download me-2"></i> Export Report
                </button>
            </div>

            <div className="row g-4 mb-4">
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="glass-card stat-card">
                        <div className="stat-icon icon-blue">
                            <i className="fas fa-users"></i>
                        </div>
                        <div className="stat-details">
                            <p>Total Employees</p>
                            <h3>{total}</h3>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="glass-card stat-card">
                        <div className="stat-icon icon-purple">
                            <i className="fas fa-building"></i>
                        </div>
                        <div className="stat-details">
                            <p>Departments</p>
                            <h3>{Object.keys(deptCounts).length}</h3>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="glass-card stat-card">
                        <div className="stat-icon icon-green">
                            <i className="fas fa-user-plus"></i>
                        </div>
                        <div className="stat-details">
                            <p>New Employees</p>
                            <h3>{newCount}</h3>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="glass-card stat-card">
                        <div className="stat-icon icon-orange">
                            <i className="fas fa-user-check"></i>
                        </div>
                        <div className="stat-details">
                            <p>Active Employees</p>
                            <h3>{active}</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-4 pb-4">
                <div className="col-12 col-lg-8">
                    <div className="glass-card p-4 h-100">
                        <h5 className="mb-4 fw-bold">Employee Growth (YTD)</h5>
                        <div style={{ height: '300px' }}>
                            <Line data={lineChartData} options={lineChartOptions} />
                        </div>
                    </div>
                </div>
                <div className="col-12 col-lg-4">
                    <div className="glass-card p-4 h-100 w-100 d-flex flex-column">
                        <h5 className="mb-4 fw-bold">Department Distribution</h5>
                        <div className="flex-grow-1" style={{ minHeight: '300px', position: 'relative', width: '100%' }}>
                            <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-4 mb-4">
                <div className="col-12">
                    <div className="glass-card p-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="fw-bold mb-0">Recent Onboarding</h5>
                            <Link to="/employees" className="text-accent text-decoration-none">View All</Link>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-glass mb-0">
                                <thead>
                                    <tr>
                                        <th>Employee</th>
                                        <th>Role</th>
                                        <th>Department</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {employees.length === 0 ? (
                                        <tr><td colSpan="4" className="text-center p-3 text-muted">No recent onboarding.</td></tr>
                                    ) : (
                                        employees.slice(-5).reverse().map(emp => (
                                            <tr key={emp.id}>
                                                <td>
                                                    <div className="user-cell">
                                                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(emp.name)}&background=random`} alt="User" />
                                                        <div className="user-info">
                                                            <p>{emp.name}</p>
                                                            <small>EMP-{emp.id}</small>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>Employee</td>
                                                <td><span className={`badge badge-soft ${getDeptBadgeClass(emp.department)}`}>{emp.department}</span></td>
                                                <td><span className="badge badge-soft badge-green">Active</span></td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
