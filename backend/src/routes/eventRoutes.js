const express = require('express');
const router = express.Router();
const { getEvents, createEvent, registerEvent } = require('../controllers/eventController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.route('/')
    .get(protect, getEvents)
    .post(protect, authorize('admin', 'company'), createEvent);

router.post('/:id/register', protect, authorize('student'), registerEvent);

module.exports = router;
