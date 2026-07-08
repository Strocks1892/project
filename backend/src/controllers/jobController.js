const asyncHandler = require('express-async-handler');
const pool = require('../config/db');

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private/Company
const createJob = asyncHandler(async (req, res) => {
    const { title, description, required_skills, package } = req.body;

    if (!title || !description || !required_skills) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    // Get company ID for this user
    const [companies] = await pool.query('SELECT id FROM companies WHERE user_id = ?', [req.user.id]);
    
    if (companies.length === 0) {
        res.status(404);
        throw new Error('Company profile not found');
    }
    
    const companyId = companies[0].id;

    const [result] = await pool.query(
        'INSERT INTO jobs (company_id, title, description, required_skills, package) VALUES (?, ?, ?, ?, ?)',
        [companyId, title, description, required_skills, package || 'Not Specified']
    );

    res.status(201).json({
        id: result.insertId,
        title,
        description
    });
});

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Private
const getJobs = asyncHandler(async (req, res) => {
    // Join with companies to get company details
    const [jobs] = await pool.query(`
        SELECT j.*, c.name as company_name, c.status as company_status 
        FROM jobs j 
        JOIN companies c ON j.company_id = c.id
        ORDER BY j.created_at DESC
    `);
    
    res.json(jobs);
});

// @desc    Apply to a job
// @route   POST /api/jobs/:id/apply
// @access  Private/Student
const applyJob = asyncHandler(async (req, res) => {
    const jobId = req.params.id;

    // Check if already applied
    const [existing] = await pool.query(
        'SELECT * FROM applications WHERE student_id = ? AND job_id = ?',
        [req.user.id, jobId]
    );

    if (existing.length > 0) {
        res.status(400);
        throw new Error('You have already applied to this job');
    }

    // Attempt to get resume score and match. Here we'll do a simple mock or 0 if no resume.
    const [resumes] = await pool.query('SELECT extracted_skills, score FROM resumes WHERE student_id = ?', [req.user.id]);
    let matchScore = 0;
    
    if (resumes.length > 0) {
        matchScore = resumes[0].score || 50; // Mock calculation logic for now
    }

    const [result] = await pool.query(
        'INSERT INTO applications (student_id, job_id, match_score) VALUES (?, ?, ?)',
        [req.user.id, jobId, matchScore]
    );

    res.status(201).json({
        message: 'Successfully applied to job',
        applicationId: result.insertId,
        matchScore
    });
});

// @desc    Get applications for my job
// @route   GET /api/jobs/:id/applications
// @access  Private/Company
const getApplications = asyncHandler(async (req, res) => {
    const jobId = req.params.id;

    // Verify job belongs to this company
    const [companies] = await pool.query('SELECT id FROM companies WHERE user_id = ?', [req.user.id]);
    const companyId = companies[0]?.id;

    const [jobs] = await pool.query('SELECT * FROM jobs WHERE id = ? AND company_id = ?', [jobId, companyId]);
    
    if (jobs.length === 0) {
        res.status(403);
        throw new Error('Not authorized to view these applications');
    }

    // Get applications with student details and resume link
    const [applications] = await pool.query(`
        SELECT a.*, u.name as student_name, u.email as student_email, r.file_path as resume_path 
        FROM applications a
        JOIN users u ON a.student_id = u.id
        LEFT JOIN resumes r ON u.id = r.student_id
        WHERE a.job_id = ?
    `, [jobId]);

    res.json(applications);
});

module.exports = {
    createJob,
    getJobs,
    applyJob,
    getApplications
};
