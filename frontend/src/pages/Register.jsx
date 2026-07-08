import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UserPlus, Rocket } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', role: 'student', companyName: ''
    });
    const [error, setError] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '4rem auto' }} className="fade-in-up">
            {/* Introduction Section */}
            <div style={{ textAlign: 'center', marginBottom: '3rem', padding: '0 1rem' }}>
                <h2 className="gradient-text" style={{ fontSize: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    Start Your Placement Journey <Rocket className="animated-icon" style={{ color: 'var(--primary-color)' }} size={32} />
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.6', maxWidth: '500px', margin: '0 auto' }}>
                    Create your account to explore job opportunities, track your applications, and stay updated with placement activities. This platform helps you manage your entire placement process in one place.
                </p>
            </div>

            {/* Signup Form */}
            <div className="glass-panel" style={{ padding: '2.5rem' }}>
                
                {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center', background: 'rgba(239,68,68,0.1)', padding: '0.5rem', borderRadius: '4px' }}>{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>I am a...</label>
                        <select className="glass-input" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                            <option value="student">Student</option>
                            <option value="company">Company</option>
                        </select>
                    </div>

                    <div className="input-group">
                        <label>Full Name / Contact Person</label>
                        <input type="text" className="glass-input" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    </div>

                    {formData.role === 'company' && (
                        <div className="input-group">
                            <label>Company Name</label>
                            <input type="text" className="glass-input" required value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} />
                        </div>
                    )}

                    <div className="input-group">
                        <label>Email Address</label>
                        <input type="email" className="glass-input" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                    </div>
                    
                    <div className="input-group">
                        <label>Password</label>
                        <input type="password" className="glass-input" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                    </div>
                    
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '0.875rem', fontSize: '1rem' }}>
                        <UserPlus size={20} className="animated-icon" /> Register
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: '600', textDecoration: 'none' }}>Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
