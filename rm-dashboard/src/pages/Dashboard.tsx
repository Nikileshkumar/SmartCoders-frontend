// React hooks and router import
import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// FontAwesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardList, faCommentDots } from '@fortawesome/free-solid-svg-icons';
import { API_BASE_URL } from '../constants';

// Dashboard-specific styles
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();

  // Retrieve logged-in RM details from localStorage
  const rmId = localStorage.getItem('rmId');
  const rmName = localStorage.getItem('rmName');

  // App state for application list and loading spinner
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search filters for table columns
  const [appIdSearch, setAppIdSearch] = useState('');
  const [firstNameSearch, setFirstNameSearch] = useState('');
  const [lastNameSearch, setLastNameSearch] = useState('');
  const [emailSearch, setEmailSearch] = useState('');
  const [phoneSearch, setPhoneSearch] = useState('');
  const [journeySearch, setJourneySearch] = useState('');

  // Fetch all applications from the backend on component mount
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/applications`)
      .then(res => {
        setApplications(res.data); // Populate application list
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching applications', err);
        setLoading(false); // Stop loading spinner
      });
  }, []);

  // Assign application to logged-in RM and log the assignment in audit trail
  const handleAssign = async (id: number) => {
    try {
      await axios.put(`${API_BASE_URL}/applications/${id}/assign`, {
        assignedTo: rmId
      });

      // Add audit log for this assignment
      await axios.post(`${API_BASE_URL}/rmaudit`, {
        rmid: rmId,
        applicationid: id,
        message: `Application assigned to ${rmName}`
      });

      // Update local state to reflect assignment
      setApplications(prev =>
        prev.map(app =>
          app.id === id ? { ...app, rmid: rmId } : app
        )
      );
    } catch (err) {
      console.error('Assign failed', err);
    }
  };

  // Get status dot color based on how recent the application's update is
  const getStatusColorClass = (updatedDate: string): 'green' | 'amber' | 'red' => {
    const updated = new Date(updatedDate);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - updated.getTime()) / (1000 * 60 * 60 * 24));
    if (diffInDays <= 1) return 'green';  // Updated within 1 day
    if (diffInDays <= 3) return 'amber';  // Updated within 1-3 days
    return 'red';                         // Updated > 3 days ago
  };

  // Filter applications using search inputs and sort by assignment (own apps first)
  const filtered = useMemo(() => {
    return applications
      .filter(app => {
        return (
          app.appid?.toLowerCase().includes(appIdSearch.toLowerCase()) &&
          app.firstname?.toLowerCase().includes(firstNameSearch.toLowerCase()) &&
          app.lastname?.toLowerCase().includes(lastNameSearch.toLowerCase()) &&
          app.email?.toLowerCase().includes(emailSearch.toLowerCase()) &&
          app.mobilenumber?.includes(phoneSearch) &&
          app.journeytype?.toLowerCase().includes(journeySearch.toLowerCase())
        );
      })
      .sort((a, b) => {
        // Bring assigned (to me) apps on top
        const aMine = a.rmid === rmId ? -1 : 1;
        const bMine = b.rmid === rmId ? -1 : 1;
        return aMine - bMine;
      });
  }, [applications, appIdSearch, firstNameSearch, lastNameSearch, emailSearch, phoneSearch, journeySearch, rmName]);

  // Show loader while data is being fetched
  if (loading) return <div>Loading...</div>;

  return (
    <div className="container" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center' }}>Welcome, {rmName}</h2>

      {/* Responsive table container */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1100px' }}>
          <thead>
            <tr>
              <th>App ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Journey</th>
              <th>Status</th>
              <th>Assigned</th>
            </tr>
            <tr>
              {/* Search input fields for each column */}
              <th><input type="text" value={appIdSearch} onChange={e => setAppIdSearch(e.target.value)} placeholder="Search App ID" style={searchBoxStyle} /></th>
              <th><input type="text" value={firstNameSearch} onChange={e => setFirstNameSearch(e.target.value)} placeholder="Search First" style={searchBoxStyle} /></th>
              <th><input type="text" value={lastNameSearch} onChange={e => setLastNameSearch(e.target.value)} placeholder="Search Last" style={searchBoxStyle} /></th>
              <th><input type="text" value={emailSearch} onChange={e => setEmailSearch(e.target.value)} placeholder="Search Email" style={searchBoxStyle} /></th>
              <th><input type="text" value={phoneSearch} onChange={e => setPhoneSearch(e.target.value)} placeholder="Search Phone" style={searchBoxStyle} /></th>
              <th><input type="text" value={journeySearch} onChange={e => setJourneySearch(e.target.value)} placeholder="Search Journey" style={searchBoxStyle} /></th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(app => (
              <tr key={app.id}>
                <td>
                  <div className="icon-cell">
                    {/* App ID Display */}
                    <span className="app-id-text">{app.appid}</span>
                    
                    {/* Only show audit/feedback buttons for RM's assigned apps */}
                    {app.rmid === rmId && (
                      <div className="icon-actions">
                        {/* Audit Log Button */}
                        <button
                          onClick={() => navigate(`/application/${app.id}`)}
                          title="Add audit to application"
                          aria-label={`Add audit for ${app.appid}`}
                          className="icon-button"
                        >
                          <FontAwesomeIcon icon={faClipboardList} />
                        </button>

                        {/* Customer Feedback Button */}
                        <button
                          onClick={() => navigate(`/feedback/${app.id}`, { state: { appid: app.appid } })}
                          title="View customer feedback"
                          aria-label={`View feedback for ${app.appid}`}
                          className="icon-button"
                        >
                          <FontAwesomeIcon icon={faCommentDots} />
                        </button>
                      </div>
                    )}
                  </div>
                </td>
                <td>{app.firstname}</td>
                <td>{app.lastname}</td>
                <td>{app.email}</td>
                <td>{app.mobilenumber}</td>
                <td>{app.journeytype}</td>
                <td>
                  {/* Status dot showing freshness of update */}
                  <span
                    className={`status-dot ${getStatusColorClass(app.updateddate)}`}
                    title={`Last updated ${new Date(app.updateddate).toLocaleString()}`}
                    aria-label={`Status for ${app.appid}`}
                  >
                    {/* Screen reader support */}
                    <span className="sr-only">
                      {
                        getStatusColorClass(app.updateddate) === 'green' ? 'Updated within 1 day' :
                        getStatusColorClass(app.updateddate) === 'amber' ? 'Updated within 1–3 days' :
                        'Updated over 3 days ago'
                      }
                    </span>
                  </span>
                </td>
                <td>
                  {/* Show RM ID if assigned to current RM, else show assign button */}
                  {app.rmid === rmId ? (
                    <span>{app.rmid}</span>
                  ) : (
                    <button
                      onClick={() => handleAssign(app.id)}
                      style={assignBtnStyle}
                    >
                      Assign to Me
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Search box styling
const searchBoxStyle: React.CSSProperties = {
  width: '100%',
  padding: '6px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  fontSize: '12px'
};

// Assign to Me button styling
const assignBtnStyle: React.CSSProperties = {
  backgroundColor: '#007a33', // Lloyds green
  color: 'white',
  border: 'none',
  padding: '6px 10px',
  borderRadius: '4px',
  fontSize: '12px',
  cursor: 'pointer'
};

export default Dashboard;
