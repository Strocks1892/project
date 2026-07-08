import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import CompanyDashboard from './pages/CompanyDashboard';
import AdminDashboard from './pages/AdminDashboard';
import JobsBrowser from './pages/JobsBrowser';
import Events from './pages/Events';
import ResumeUpload from './pages/ResumeUpload';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Dashboards based on role */}
          <Route path="/" element={
            <ProtectedRoute>
              {user?.role === 'student' && <StudentDashboard />}
              {user?.role === 'company' && <CompanyDashboard />}
              {user?.role === 'admin' && <AdminDashboard />}
            </ProtectedRoute>
          } />

          {/* Student Routes */}
          <Route path="/jobs" element={
            <ProtectedRoute roles={['student']}>
              <JobsBrowser />
            </ProtectedRoute>
          } />
          
          <Route path="/resume" element={
            <ProtectedRoute roles={['student']}>
              <ResumeUpload />
            </ProtectedRoute>
          } />

          {/* Shared Routes */}
          <Route path="/events" element={
            <ProtectedRoute>
              <Events />
            </ProtectedRoute>
          } />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
