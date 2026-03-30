import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = 'http://localhost:8080/api';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(`${API_BASE_URL}/auth/login`, {
                username: username.trim(),
                password: password.trim()
            });
            login(response.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-bg">
            <div className="auth-card text-center">
                <div className="mb-4">
                    <i className="fas fa-cube fa-3x text-accent mb-3"></i>
                    <h2 className="fw-bold">Welcome Back</h2>
                    <p className="text-white-50">Sign in to your admin panel</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {error && <div className="alert alert-danger p-2 py-1 text-sm">{error}</div>}
                    
                    <div className="auth-input-group">
                        <input 
                            type="text" 
                            className="auth-input" 
                            placeholder="Username or Email" 
                            required 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <i className="fas fa-user"></i>
                    </div>

                    <div className="auth-input-group">
                        <input 
                            type="password" 
                            className="auth-input" 
                            placeholder="Password" 
                            required 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <i className="fas fa-lock"></i>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div className="form-check text-start">
                            <input className="form-check-input" type="checkbox" id="rememberMe" />
                            <label className="form-check-label text-white-50" htmlFor="rememberMe" style={{ fontSize: '0.9rem' }}>
                                Remember me
                            </label>
                        </div>
                        <a href="#" className="text-accent text-decoration-none" style={{ fontSize: '0.9rem' }}>Forgot Password?</a>
                    </div>

                    <button type="submit" className="btn-auth" disabled={loading}>
                        {loading ? <><i className="fas fa-spinner fa-spin me-2"></i>Logging in...</>  : <>Login <i className="fas fa-arrow-right ms-2"></i></>}
                    </button>
                </form>

                <div className="mt-4 text-white-50">
                    Don't have an account? <Link to="/register" className="text-accent text-decoration-none fw-bold">Register here</Link>
                </div>
            </div>
        </div>
    );
}
