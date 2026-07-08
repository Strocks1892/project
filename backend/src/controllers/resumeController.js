const asyncHandler = require('express-async-handler');
const pool = require('../config/db');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');

// Target skills we might look for - simple mock dictionary
const TARGET_SKILLS = [
    'react', 'node.js', 'express', 'mysql', 'sql', 'javascript', 'python', 
    'java', 'c++', 'html', 'css', 'docker', 'aws', 'git', 'communication', 'leadership'
];

// @desc    Upload resume and analyze
// @route   POST /api/resumes/upload
// @access  Private/Student
const uploadResume = asyncHandler(async (req, res) => {
    if (!req.file) {
        res.status(400);
        throw new Error('Please upload a file');
    }

    const filePath = `/uploads/${req.file.filename}`;
    const absolutePath = req.file.path;
    let extractedSkills = [];
    let score = 0;

    const fileExt = path.extname(req.file.originalname).toLowerCase();

    try {
        let textContent = "";

        if (fileExt === '.pdf') {
            const dataBuffer = fs.readFileSync(absolutePath);
            const data = await pdfParse(dataBuffer);
            textContent = data.text.toLowerCase();
        } else if (fileExt === '.docx') {
            const result = await mammoth.extractRawText({ path: absolutePath });
            textContent = result.value.toLowerCase();
        }

        if (textContent) {
            // Simple Keyword matching algorithm
            extractedSkills = TARGET_SKILLS.filter(skill => textContent.includes(skill));
            // Calculate a score out of 100 based on number of skills found
            score = Math.min(Math.round((extractedSkills.length / 10) * 100), 100);
        }
    } catch (err) {
        console.error("Document Parse error", err);
    }

    const skillsString = JSON.stringify(extractedSkills);

    // Update or create resume record
    const [existing] = await pool.query('SELECT * FROM resumes WHERE student_id = ?', [req.user.id]);
    
    if (existing.length > 0) {
        await pool.query(
            'UPDATE resumes SET file_path = ?, extracted_skills = ?, score = ? WHERE student_id = ?',
            [filePath, skillsString, score, req.user.id]
        );
    } else {
        await pool.query(
            'INSERT INTO resumes (student_id, file_path, extracted_skills, score) VALUES (?, ?, ?, ?)',
            [req.user.id, filePath, skillsString, score]
        );
    }

    res.json({
        message: 'Resume uploaded and analyzed successfully',
        filePath,
        extractedSkills,
        score
    });
});

// @desc    Get user resume details
// @route   GET /api/resumes/me
// @access  Private/Student
const getMyResume = asyncHandler(async (req, res) => {
    const [resumes] = await pool.query('SELECT * FROM resumes WHERE student_id = ?', [req.user.id]);
    
    if (resumes.length === 0) {
        return res.json(null);
    }

    const resume = resumes[0];
    if (resume.extracted_skills) {
        try {
            resume.extracted_skills = JSON.parse(resume.extracted_skills);
        } catch(e) {}
    }
    
    res.json(resume);
});

module.exports = {
    uploadResume,
    getMyResume
};
