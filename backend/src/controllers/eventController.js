const asyncHandler = require('express-async-handler');
const pool = require('../config/db');

// @desc    Get all events
// @route   GET /api/events
// @access  Private
const getEvents = asyncHandler(async (req, res) => {
    const [events] = await pool.query('SELECT * FROM events ORDER BY date ASC, time ASC');
    res.json(events);
});

// @desc    Create an event
// @route   POST /api/events
// @access  Private/Admin, Company
const createEvent = asyncHandler(async (req, res) => {
    const { title, description, date, time, location } = req.body;

    if (!title || !date || !time) {
        res.status(400);
        throw new Error('Please include title, date, and time');
    }

    const [result] = await pool.query(
        'INSERT INTO events (title, description, date, time, location, created_by) VALUES (?, ?, ?, ?, ?, ?)',
        [title, description, date, time, location, req.user.id]
    );

    res.status(201).json({ id: result.insertId, title, status: 'Upcoming' });
});

// @desc    Register for an event
// @route   POST /api/events/:id/register
// @access  Private/Student
const registerEvent = asyncHandler(async (req, res) => {
    const eventId = req.params.id;

    // Check if already registered
    const [existing] = await pool.query(
        'SELECT * FROM event_registrations WHERE student_id = ? AND event_id = ?',
        [req.user.id, eventId]
    );

    if (existing.length > 0) {
        res.status(400);
        throw new Error('Wait, you are already registered for this event');
    }

    await pool.query(
        'INSERT INTO event_registrations (student_id, event_id) VALUES (?, ?)',
        [req.user.id, eventId]
    );

    res.status(201).json({ message: 'Successfully registered for event' });
});

module.exports = {
    getEvents,
    createEvent,
    registerEvent
};
