import React, { useState } from 'react';
import axios from 'axios';
import { UploadCloud, FileText } from 'lucide-react';

const ResumeUpload = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append('resume', file);

        setLoading(true);
        try {
            const { data } = await axios.post('/api/resumes/upload', formData, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}` 
                }
            });
            setResult(data);
        } catch (err) {
            alert(err.response?.data?.message || 'Error uploading file');
        }
        setLoading(false);
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="page-header" style={{ justifyContent: 'center' }}>
                <h2>Resume Analyzer</h2>
            </div>

            <div className="glass-panel" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
                <UploadCloud size={64} color="var(--primary-color)" style={{ marginBottom: '1rem' }} />
                <h3>Upload Your Resume</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Only PDF and DOC files are supported (Max 5MB)</p>

                <form onSubmit={handleUpload}>
                    <input 
                        type="file" 
                        accept=".pdf,.doc,.docx" 
                        onChange={handleFileChange} 
                        style={{ display: 'none' }} 
                        id="file-upload" 
                    />
                    <label 
                        htmlFor="file-upload" 
                        className="btn btn-secondary" 
                        style={{ width: '100%', marginBottom: '1rem', borderStyle: 'dashed' }}
                    >
                        {file ? file.name : "Select File"}
                    </label>

                    <button type="submit" disabled={!file || loading} className="btn btn-primary" style={{ width: '100%' }}>
                        {loading ? 'Analyzing...' : 'Analyze Resume'}
                    </button>
                </form>

                {result && (
                    <div style={{ marginTop: '3rem', textAlign: 'left', borderTop: '1px solid var(--card-border)', paddingTop: '2rem' }}>
                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)' }}>
                            <FileText size={20} /> Analysis Complete
                        </h4>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1.5rem 0' }}>
                            <span style={{ fontSize: '1.1rem' }}>Overall Score:</span>
                            <strong style={{ fontSize: '1.5rem', color: 'var(--primary-color)' }}>{result.score}/100</strong>
                        </div>

                        <div style={{ marginTop: '1.5rem' }}>
                            <span style={{ marginBottom: '0.5rem', display: 'block' }}>Detected Skills:</span>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                {result.extractedSkills.length > 0 ? (
                                    result.extractedSkills.map((skill, i) => <span key={i} className="badge badge-info">{skill}</span>)
                                ) : (
                                    <span style={{ color: 'var(--text-secondary)' }}>No matching skills detected. Expand your resume tech keywords!</span>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResumeUpload;
