const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const { uploadResume, getMyResume } = require('../controllers/resumeController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.post('/upload', protect, authorize('student'), upload.single('resume'), uploadResume);
router.get('/me', protect, authorize('student'), getMyResume);

module.exports = router;
