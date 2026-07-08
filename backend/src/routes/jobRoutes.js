const express = require('express');
const router = express.Router();
const { createJob, getJobs, applyJob, getApplications } = require('../controllers/jobController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.route('/')
    .get(protect, getJobs)
    .post(protect, authorize('company', 'admin'), createJob);

router.post('/:id/apply', protect, authorize('student'), applyJob);
router.get('/:id/applications', protect, authorize('company', 'admin'), getApplications);

module.exports = router;
