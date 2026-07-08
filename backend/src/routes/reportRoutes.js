const express = require('express');
const router = express.Router();
const { reportCompany, getCompaniesHealth, updateCompanyStatus } = require('../controllers/reportController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.post('/:companyId', protect, authorize('student'), reportCompany);
router.get('/companies', protect, getCompaniesHealth);
router.put('/companies/:id/status', protect, authorize('admin'), updateCompanyStatus);

module.exports = router;
