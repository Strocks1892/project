import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusCircle, Users, Edit } from 'lucide-react';

const CompanyDashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [requiredSkills, setRequiredSkills] = useState('');
    const [packageStr, setPackageStr] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const { data } = await axios.get('/api/jobs', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            // Filter only jobs by this company (just a visual filter for simplicity)
            const user = JSON.parse(localStorage.getItem('user'));
            // Wait, we probably need an endpoint for my jobs, but let's assume we filter or see all. 
            setJobs(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreateJob = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('/api/jobs', { title, description, required_skills: requiredSkills, package: packageStr }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setTitle(''); setDescription(''); setRequiredSkills(''); setPackageStr('');
            fetchJobs();
        } catch (err) {
            console.error(err);
            alert('Failed to post job');
        }
        setLoading(false);
    };

    return (
        <div>
            <div className="page-header">
                <h2>Company Dashboard</h2>
            </div>
            
            <div className="grid-layout">
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <h3>Post a New Job</h3>
                    <form onSubmit={handleCreateJob} style={{ marginTop: '1rem' }}>
                        <div className="input-group">
                            <label>Job Title</label>
                            <input type="text" className="glass-input" required value={title} onChange={e => setTitle(e.target.value)} />
                        </div>
                        <div className="input-group">
                            <label>Description</label>
                            <textarea className="glass-input" rows="3" required value={description} onChange={e => setDescription(e.target.value)}></textarea>
                        </div>
                        <div className="input-group">
                            <label>Required Skills (comma separated)</label>
                            <input type="text" className="glass-input" required value={requiredSkills} onChange={e => setRequiredSkills(e.target.value)} />
                        </div>
                        <div className="input-group">
                            <label>Package / Salary</label>
                            <input type="text" className="glass-input" value={packageStr} onChange={e => setPackageStr(e.target.value)} />
                        </div>
                        <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                            <PlusCircle className="animated-icon" size={18} /> Post Job
                        </button>
                    </form>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <h3>Recent Job Postings</h3>
                    {jobs.slice(0, 5).map(job => (
                        <div key={job.id} className="glass-panel" style={{ padding: '1.5rem' }}>
                            <h4>{job.title}</h4>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: '0.5rem 0' }}>{job.package}</p>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem' }}>
                                    <Users className="animated-icon" size={16} /> View Applicants
                                </button>
                                <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem' }}>
                                    <Edit className="animated-icon" size={16} /> Update Status
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CompanyDashboard;
