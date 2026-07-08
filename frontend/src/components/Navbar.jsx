import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShieldCheck, LogOut, User, Home, PieChart, Building2, FileText, Power } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="glass-nav">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck className="animated-icon" color="#6366f1" size={28} />
                <h2 className="gradient-text" style={{ margin: 0 }}>SmartPlace</h2>
            </div>
            
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                {user ? (
                    <>
                        <Link to="/" className="nav-link">
                            <Home className="animated-icon" size={18} /> Home
                        </Link>
                        {user.role === 'student' && (
                            <Link to="/jobs" className="nav-link">
                                <Building2 className="animated-icon" size={18} /> Companies
                            </Link>
                        )}
                        {user.role === 'student' && (
                            <Link to="/resume" className="nav-link">
                                <PieChart className="animated-icon" size={18} /> Dashboard
                            </Link>
                        )}
                        <Link to="/events" className="nav-link">
                            <FileText className="animated-icon" size={18} /> Applications
                        </Link>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '1rem', borderLeft: '1px solid var(--card-border)', paddingLeft: '1rem' }}>
                            <User size={18} className="animated-icon" />
                            <span>{user.name}</span>
                            <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', marginLeft: '0.5rem' }}>
                                <Power className="animated-icon icon-danger" size={16} />
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="btn btn-secondary">Login</Link>
                        <Link to="/register" className="btn btn-primary">Sign up</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
