const asyncHandler = require('express-async-handler');
const pool = require('../config/db');

// @desc    Report a company
// @route   POST /api/reports/:companyId
// @access  Private/Student
const reportCompany = asyncHandler(async (req, res) => {
    const companyId = req.params.companyId;
    const { reason, description } = req.body;

    if (!reason) {
        res.status(400);
        throw new Error('Please provide a reason for reporting');
    }

    // Check if student already reported this company
    const [existing] = await pool.query(
        'SELECT * FROM reports WHERE student_id = ? AND company_id = ?',
        [req.user.id, companyId]
    );

    if (existing.length > 0) {
        res.status(400);
        throw new Error('You have already reported this company');
    }

    // Create report
    await pool.query(
        'INSERT INTO reports (student_id, company_id, reason, description) VALUES (?, ?, ?, ?)',
        [req.user.id, companyId, reason, description || '']
    );

    // Dynamic risk checks will be performed when company data is fetched
    res.status(201).json({ message: 'Company reported successfully' });
});

// @desc    Get all companies with their risk score & reports
// @route   GET /api/reports/companies
// @access  Private (Everyone can see, but Admin might have a different view later)
const getCompaniesHealth = asyncHandler(async (req, res) => {
    // Left join reports to dynamically count them
    const [companies] = await pool.query(`
        SELECT c.id, c.name, c.description, c.status, COUNT(r.id) as report_count
        FROM companies c
        LEFT JOIN reports r ON c.id = r.company_id
        GROUP BY c.id
    `);

    // Calculate Risk Score and Risk Level
    const healthData = companies.map(c => {
        const riskScore = c.report_count * 10;
        let riskLevel = 'Low';
        if (riskScore >= 50) riskLevel = 'High';
        else if (riskScore >= 20) riskLevel = 'Medium';

        return {
            ...c,
            riskScore,
            riskLevel
        };
    });

    res.json(healthData);
});

// @desc    Admin updates company status explicitly
// @route   PUT /api/reports/companies/:id/status
// @access  Private/Admin
const updateCompanyStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const companyId = req.params.id;

    if (!['Safe', 'Under Review', 'Fraudulent'].includes(status)) {
        res.status(400);
        throw new Error('Invalid status type');
    }

    await pool.query('UPDATE companies SET status = ? WHERE id = ?', [status, companyId]);

    res.json({ message: 'Company status updated to ' + status });
});

module.exports = {
    reportCompany,
    getCompaniesHealth,
    updateCompanyStatus
};
