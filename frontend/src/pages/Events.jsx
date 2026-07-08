import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Calendar as CalendarIcon, MapPin, Clock } from 'lucide-react';

const Events = () => {
    const [events, setEvents] = useState([]);
    const { user } = useContext(AuthContext);

    // Form states for creating event (admin/company)
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [location, setLocation] = useState('');

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const { data } = await axios.get('/api/events', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setEvents(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleRegister = async (eventId) => {
        try {
            await axios.post(`/api/events/${eventId}/register`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            alert('Registered successfully!');
        } catch (err) {
            alert(err.response?.data?.message || 'Error registering');
        }
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/events', { title, description, date, time, location }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            alert('Event created!');
            setTitle(''); setDescription(''); setDate(''); setTime(''); setLocation('');
            fetchEvents();
        } catch (err) {
            alert(err.response?.data?.message || 'Error creating event');
        }
    };

    return (
        <div>
            <div className="page-header">
                <h2>Placement Events & Job Fairs</h2>
            </div>
            
            <div className="grid-layout">
                {/* Event Creation Form (Admins & Companies) */}
                {user?.role !== 'student' && (
                    <div className="glass-panel" style={{ padding: '2rem', height: 'fit-content' }}>
                        <h3>Schedule an Event</h3>
                        <form onSubmit={handleCreateEvent} style={{ marginTop: '1.5rem' }}>
                            <div className="input-group">
                                <label>Event Title</label>
                                <input type="text" className="glass-input" required value={title} onChange={e => setTitle(e.target.value)} />
                            </div>
                            <div className="input-group">
                                <label>Date</label>
                                <input type="date" className="glass-input" required value={date} onChange={e => setDate(e.target.value)} />
                            </div>
                            <div className="input-group">
                                <label>Time</label>
                                <input type="time" className="glass-input" required value={time} onChange={e => setTime(e.target.value)} />
                            </div>
                            <div className="input-group">
                                <label>Location</label>
                                <input type="text" className="glass-input" required value={location} onChange={e => setLocation(e.target.value)} />
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                                Create Event
                            </button>
                        </form>
                    </div>
                )}

                {/* Event List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', gridColumn: user?.role === 'student' ? '1 / -1' : 'auto' }}>
                    {events.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>No upcoming events scheduled.</p>}
                    
                    {events.map((event) => {
                        const eventDate = new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                        return (
                            <div key={event.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <h3 style={{ margin: 0, color: 'var(--primary-color)' }}>{event.title}</h3>
                                    <span className={`badge badge-${event.status === 'Upcoming' ? 'success' : 'secondary'}`}>{event.status}</span>
                                </div>
                                
                                <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <CalendarIcon size={16} /> {eventDate}
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <Clock size={16} /> {event.time}
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <MapPin size={16} /> {event.location}
                                    </span>
                                </div>

                                {user?.role === 'student' && (
                                    <button onClick={() => handleRegister(event.id)} className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '1rem' }}>
                                        Register Now
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Events;
