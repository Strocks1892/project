import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { FileText, CheckCircle, XCircle, Star } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

const StudentDashboard = () => {
    const [resumeData, setResumeData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get('/api/resumes/me', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setResumeData(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    const chartData = {
        labels: ['Match Score', 'Remaining'],
        datasets: [
            {
                data: [resumeData?.score || 0, 100 - (resumeData?.score || 0)],
                backgroundColor: ['#6366f1', 'rgba(255, 255, 255, 0.1)'],
                borderColor: ['transparent', 'transparent'],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div>
            <div className="page-header">
                <h2>Student Dashboard</h2>
            </div>

            <div className="stats-grid">
                <div className="glass-panel stat-card-small">
                    <div className="stat-icon-wrapper" style={{ color: 'var(--primary-color)' }}>
                        <FileText className="animated-icon" size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Total Applications</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>12</div>
                    </div>
                </div>
                
                <div className="glass-panel stat-card-small">
                    <div className="stat-icon-wrapper" style={{ color: 'var(--success)' }}>
                        <CheckCircle className="animated-icon icon-success" size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Selected</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>1</div>
                    </div>
                </div>

                <div className="glass-panel stat-card-small">
                    <div className="stat-icon-wrapper" style={{ color: 'var(--warning)' }}>
                        <Star className="animated-icon icon-warning" size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Shortlisted</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>3</div>
                    </div>
                </div>

                <div className="glass-panel stat-card-small">
                    <div className="stat-icon-wrapper" style={{ color: 'var(--danger)' }}>
                        <XCircle className="animated-icon icon-danger" size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Rejected</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>4</div>
                    </div>
                </div>
            </div>
            
            <div className="grid-layout">
                <div className="glass-panel stat-card">
                    <h3>Resume Strength Score</h3>
                    {resumeData ? (
                        <>
                            <div className="stat-value">{resumeData.score}/100</div>
                            <div style={{ width: '150px', height: '150px', margin: '1rem auto' }}>
                                <Doughnut data={chartData} options={{ cutout: '75%' }} />
                            </div>
                        </>
                    ) : (
                        <p style={{ color: 'var(--text-secondary)' }}>No resume uploaded. Upload a resume to see your score.</p>
                    )}
                </div>

                <div className="glass-panel stat-card">
                    <h3>Skills Identified</h3>
                    {resumeData?.extracted_skills ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
                            {resumeData.extracted_skills.map((skill, i) => (
                                <span key={i} className="badge badge-info">{skill}</span>
                            ))}
                        </div>
                    ) : (
                        <p style={{ color: 'var(--text-secondary)' }}>Upload your resume to extract skills.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
