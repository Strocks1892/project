import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShieldAlert, CheckCircle, AlertTriangle, PlusCircle, Users, BarChart2 } from 'lucide-react';

const AdminDashboard = () => {
    const [companies, setCompanies] = useState([]);

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            const { data } = await axios.get('/api/reports/companies', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setCompanies(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await axios.put(`/api/reports/companies/${id}/status`, { status }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            fetchCompanies();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <div className="page-header">
                <h2>Admin Control Panel & Fraud Detection</h2>
            </div>

            <div className="stats-grid">
                <div className="glass-panel stat-card-small" style={{ cursor: 'pointer' }} onClick={() => alert('Add Company modal coming soon!')}>
                    <div className="stat-icon-wrapper" style={{ color: 'var(--primary-color)' }}>
                        <PlusCircle className="animated-icon" size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>Add Company</div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Onboard new partner</div>
                    </div>
                </div>
                
                <div className="glass-panel stat-card-small" style={{ cursor: 'pointer' }} onClick={() => alert('Manage Students panel coming soon!')}>
                    <div className="stat-icon-wrapper" style={{ color: 'var(--primary-color)' }}>
                        <Users className="animated-icon" size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>Manage Students</div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>View and edit profiles</div>
                    </div>
                </div>

                <div className="glass-panel stat-card-small" style={{ cursor: 'pointer' }} onClick={() => {
                    document.getElementById('reports-section').scrollIntoView({ behavior: 'smooth' });
                }}>
                    <div className="stat-icon-wrapper" style={{ color: 'var(--primary-color)' }}>
                        <BarChart2 className="animated-icon" size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>Reports</div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>View analytics</div>
                    </div>
                </div>
            </div>
            
            <div id="reports-section" className="glass-panel" style={{ padding: '2rem' }}>
                <h3>Company Risk Profiles</h3>
                <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {companies.map(company => (
                        <div key={company.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    {company.name}
                                    {company.riskLevel === 'High' && <span className="badge badge-danger">High Risk</span>}
                                    {company.status === 'Fraudulent' && <span className="badge badge-danger" style={{ background: 'var(--danger)', color: 'white' }}>BANNED</span>}
                                </h4>
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                    <span>Reports: <strong>{company.report_count}</strong></span>
                                    <span>Risk Score: <strong>{company.riskScore}/100</strong></span>
                                    <span>Current Status: {company.status}</span>
                                </div>
                            </div>
                            
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button onClick={() => handleUpdateStatus(company.id, 'Safe')} className="btn btn-secondary" style={{ color: 'var(--success)', borderColor: 'var(--success)' }}>
                                    <CheckCircle className="animated-icon icon-success" size={16} /> Mark Safe
                                </button>
                                <button onClick={() => handleUpdateStatus(company.id, 'Under Review')} className="btn btn-secondary" style={{ color: 'var(--warning)', borderColor: 'var(--warning)' }}>
                                    <AlertTriangle className="animated-icon icon-warning" size={16} /> Review
                                </button>
                                <button onClick={() => handleUpdateStatus(company.id, 'Fraudulent')} className="btn btn-danger">
                                    <ShieldAlert className="animated-icon icon-danger" size={16} /> Mark Fraud
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
