import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Briefcase, AlertTriangle, Send } from 'lucide-react';

const JobsBrowser = () => {
    const [jobs, setJobs] = useState([]);
    const [companies, setCompanies] = useState({});

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const jobsRes = await axios.get('/api/jobs', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setJobs(jobsRes.data);

            const companiesRes = await axios.get('/api/reports/companies', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            const compMap = {};
            companiesRes.data.forEach(c => compMap[c.id] = c);
            setCompanies(compMap);
        } catch (err) {
            console.error(err);
        }
    };

    const handleApply = async (jobId) => {
        try {
            const { data } = await axios.post(`/api/jobs/${jobId}/apply`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            alert(`Applied successfully! Resume match score: ${data.matchScore}`);
        } catch (err) {
            alert(err.response?.data?.message || 'Error applying');
        }
    };

    const handleReport = async (companyId) => {
        const reason = prompt("Enter a reason for reporting this company for fraud:");
        if (!reason) return;
        
        try {
            await axios.post(`/api/reports/${companyId}`, { reason, description: '' }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            alert('Report submitted successfully.');
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Error reporting');
        }
    };

    return (
        <div>
            <div className="page-header">
                <h2>Browse Job Postings</h2>
                <div style={{ position: 'relative', width: '300px' }}>
                    <Search size={18} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '1rem', color: 'var(--text-secondary)' }} />
                    <input type="text" className="glass-input" placeholder="Search jobs..." style={{ width: '100%', paddingLeft: '2.5rem' }} />
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {jobs.map(job => {
                    const company = companies[job.company_id];
                    const isRisky = company?.status === 'Under Review' || company?.riskLevel === 'High';
                    const isFraud = company?.status === 'Fraudulent';

                    if (isFraud) return null; // Don't show jobs from fraudulent companies

                    return (
                        <div key={job.id} className="glass-panel" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: isRisky ? '1px solid rgba(245, 158, 11, 0.5)' : '' }}>
                            <div style={{ maxWidth: '70%' }}>
                                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <Briefcase size={20} color="var(--primary-color)" /> {job.title}
                                </h3>
                                <p style={{ fontSize: '1.1rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                                    {job.company_name}
                                    {isRisky && <span className="badge badge-warning" style={{ marginLeft: '1rem' }}><AlertTriangle size={12} style={{ marginRight: '0.2rem' }}/> Reported</span>}
                                </p>
                                <p style={{ marginTop: '1rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>{job.description}</p>
                                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    {job.required_skills.split(',').map((skill, i) => (
                                        <span key={i} className="badge badge-info">{skill.trim()}</span>
                                    ))}
                                    <span className="badge badge-success">{job.package}</span>
                                </div>
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-end' }}>
                                <button onClick={() => handleApply(job.id)} className="btn btn-primary">
                                    <Send size={16} /> Apply Now
                                </button>
                                <button onClick={() => handleReport(job.company_id)} className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem', color: 'var(--text-secondary)' }}>
                                    Report Fraud Let
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default JobsBrowser;
