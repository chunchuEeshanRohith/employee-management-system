import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:8080/api';

export default function EmployeeList() {
    const { token, logout } = useAuth();
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDept, setFilterDept] = useState('');
    const [sortOrder, setSortOrder] = useState('name_asc');

    const fetchEmployees = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/employees`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEmployees(response.data);
        } catch (err) {
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                logout();
            }
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, [token, logout]);

    const deleteEmployee = async (id) => {
        if (!window.confirm('Are you sure you want to delete this employee?')) return;
        try {
            await axios.delete(`${API_BASE_URL}/employees/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchEmployees();
        } catch (err) {
            alert('Error deleting employee');
        }
    };

    const getDeptBadgeClass = (dept) => {
        const d = (dept || '').toLowerCase();
        if (d.includes('eng')) return 'badge-blue';
        if (d.includes('des')) return 'badge-purple';
        if (d.includes('mark')) return 'badge-orange';
        if (d.includes('hr')) return 'badge-green';
        return 'badge-secondary';
    };

    let filteredEmployees = employees.filter(emp => {
        const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              emp.id.toString().includes(searchTerm);
        const matchesDept = filterDept ? emp.department.toLowerCase() === filterDept.toLowerCase() : true;
        return matchesSearch && matchesDept;
    });

    if (sortOrder === 'name_asc') {
        filteredEmployees.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === 'name_desc') {
        filteredEmployees.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortOrder === 'salary_high') {
        filteredEmployees.sort((a, b) => b.salary - a.salary);
    } else if (sortOrder === 'salary_low') {
        filteredEmployees.sort((a, b) => a.salary - b.salary);
    }

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                <h2 className="fw-bold mb-0">Employee Management</h2>
                <Link to="/employees/add" className="btn btn-primary rounded-pill px-4 shadow-sm">
                    <i className="fas fa-plus me-2"></i> Add Employee
                </Link>
            </div>

            <div className="glass-card p-3 mb-4">
                <div className="row g-3">
                    <div className="col-md-4">
                        <div className="input-group">
                            <span className="input-group-text bg-transparent border-end-0 border-light text-muted">
                                <i className="fas fa-search"></i>
                            </span>
                            <input 
                                type="text" 
                                className="form-control border-start-0 border-light bg-transparent"
                                placeholder="Search employees..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <select 
                            className="form-select bg-transparent border-light text-muted"
                            value={filterDept}
                            onChange={e => setFilterDept(e.target.value)}
                        >
                            <option value="">All Departments</option>
                            <option value="engineering">Engineering</option>
                            <option value="design">Design</option>
                            <option value="marketing">Marketing</option>
                            <option value="hr">HR</option>
                        </select>
                    </div>
                    <div className="col-md-3">
                        <select 
                            className="form-select bg-transparent border-light text-muted"
                            value={sortOrder}
                            onChange={e => setSortOrder(e.target.value)}
                        >
                            <option value="name_asc">Sort by Name (A-Z)</option>
                            <option value="name_desc">Sort by Name (Z-A)</option>
                            <option value="salary_high">Salary (High to Low)</option>
                            <option value="salary_low">Salary (Low to High)</option>
                        </select>
                    </div>
                    <div className="col-md-2 text-end">
                        <button className="btn btn-light w-100 text-muted border-light text-nowrap" onClick={() => { setSearchTerm(''); setFilterDept(''); setSortOrder('name_asc'); }}>
                            <i className="fas fa-filter me-2"></i> Clear
                        </button>
                    </div>
                </div>
            </div>

            <div className="glass-card mb-4 overflow-hidden">
                <div className="table-responsive">
                    <table className="table table-glass mb-0">
                        <thead>
                            <tr>
                                <th>Employee ID</th>
                                <th>Name</th>
                                <th>Department</th>
                                <th>Email</th>
                                <th>Salary</th>
                                <th className="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" className="text-center p-5 text-muted"><i className="fas fa-spinner fa-spin me-2"></i>Loading...</td></tr>
                            ) : filteredEmployees.length === 0 ? (
                                <tr><td colSpan="6" className="text-center p-5 text-muted">No employees found.</td></tr>
                            ) : (
                                filteredEmployees.map(emp => (
                                    <tr key={emp.id}>
                                        <td className="text-muted fw-bold">#EMP-{emp.id}</td>
                                        <td>
                                            <div className="user-cell">
                                                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(emp.name)}&background=random`} alt="User" />
                                                <div className="user-info">
                                                    <p>{emp.name}</p>
                                                    <small>{emp.department}</small>
                                                </div>
                                            </div>
                                        </td>
                                        <td><span className={`badge badge-soft ${getDeptBadgeClass(emp.department)}`}>{emp.department}</span></td>
                                        <td className="text-muted">{emp.email}</td>
                                        <td className="fw-bold">${new Intl.NumberFormat().format(emp.salary)}</td>
                                        <td className="text-end">
                                            <div className="action-btns">
                                                <Link to={`/employees/${emp.id}`} className="btn btn-sm btn-light text-primary"><i className="fas fa-eye"></i></Link>
                                                <Link to={`/employees/edit/${emp.id}`} className="btn btn-sm btn-light text-warning ms-1"><i className="fas fa-edit"></i></Link>
                                                <button className="btn btn-sm btn-light text-danger ms-1" onClick={() => deleteEmployee(emp.id)}><i className="fas fa-trash"></i></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="d-flex justify-content-between align-items-center p-3 border-top border-light">
                    <span className="text-muted small">Showing {filteredEmployees.length} entries</span>
                </div>
            </div>
        </>
    );
}
