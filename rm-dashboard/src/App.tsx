import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  useLocation
} from 'react-router-dom';
import { useEffect, useState } from 'react';

import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import ApplicationDetails from './components/ApplicationDetails';
import JourneyManager from './components/JourneyManager';
import FeedbackViewer from './components/FeedbackViewer';

import './index.css';


function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const rmName = localStorage.getItem('rmName');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('rmName');
    localStorage.removeItem('role');
    navigate('/');
  };

  return (
    <div className="header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <img src="/lloyds-logo.png" alt="Lloyds Logo" height="40" />
        <h1 style={{ margin: 0 }}>RM Dashboard</h1>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {role === 'Admin' && location.pathname !== '/journeys' && (
          <button
            onClick={() => navigate('/journeys')}
            style={{
              backgroundColor: '#007a33',
              color: 'white',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '4px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Manage Journeys
          </button>
        )}
        {rmName && location.pathname !== '/' && (
          <button
            onClick={handleLogout}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#007a33',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/application/:id" element={<ApplicationDetails />} />
      <Route path="/feedback/:id" element={<FeedbackViewer />} />
      <Route path="/journeys" element={<JourneyManager />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <Header />
      <AppRoutes />
    </Router>
  );
}

export default App;
