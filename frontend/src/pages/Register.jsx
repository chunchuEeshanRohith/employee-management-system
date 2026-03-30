import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = 'http://localhost:8080/api';

export default function Register() {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setError('Passwords do not match!');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(`${API_BASE_URL}/auth/register`, {
                name,
                username,
                email,
                password
            });
            const token = response.data.token || response.data.accessToken;
            if (token) login(token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-bg py-5">
            <div className="auth-card text-center">
                <div className="mb-4">
                    <i className="fas fa-user-plus fa-3x text-accent mb-3"></i>
                    <h2 className="fw-bold">Create Account</h2>
                    <p className="text-white-50">Join the admin portal</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {error && <div className="alert alert-danger p-2 py-1 text-sm">{error}</div>}

                    <div className="auth-input-group">
                        <input 
                            type="text" 
                            className="auth-input" 
                            placeholder="Full Name" 
                            required 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <i className="fas fa-id-card"></i>
                    </div>

                    <div className="auth-input-group">
                        <input 
                            type="text" 
                            className="auth-input" 
                            placeholder="Username" 
                            required 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <i className="fas fa-user"></i>
                    </div>

                    <div className="auth-input-group">
                        <input 
                            type="email" 
                            className="auth-input" 
                            placeholder="Email Address" 
                            required 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <i className="fas fa-envelope"></i>
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

                    <div className="auth-input-group mb-4">
                        <input 
                            type="password" 
                            className="auth-input" 
                            placeholder="Confirm Password" 
                            required 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <i className="fas fa-lock"></i>
                    </div>

                    <button type="submit" className="btn-auth" disabled={loading}>
                         {loading ? <><i className="fas fa-spinner fa-spin me-2"></i>Registering...</>  : <>Register <i className="fas fa-arrow-right ms-2"></i></>}
                    </button>
                </form>

                <div className="mt-4 text-white-50">
                    Already have an account? <Link to="/" className="text-accent text-decoration-none fw-bold">Login here</Link>
                </div>
            </div>
        </div>
    );
}
