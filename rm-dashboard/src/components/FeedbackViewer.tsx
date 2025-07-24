// React‑Router hooks for route params, navigation, and location state
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../constants';

import './FeedbackViewer.css'; // Optional CSS for component styling

function FeedbackViewer() {
  /* -----------------------------  Hooks & State  ----------------------------- */

  // 1. Extract the dynamic :id from the route (e.g., /feedback/:id)
  const { id } = useParams();

  // 2. Programmatic navigation (back to dashboard, etc.)
  const navigate = useNavigate();

  // 3. Access data passed via <Link state={{ appid }} />
  const location   = useLocation();
  const appid      = location.state?.appid;

  // 4. Component state: list of feedback entries and loading flag
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading,   setLoading]   = useState(true);

  /* ----------------------------  Data Fetching  ------------------------------ */
  useEffect(() => {
    // Fetch customer feedback for the given application ID
    axios
      .get(`${API_BASE_URL}/customerfeedback/${id}`)
      .then(res => {
        setFeedbacks(res.data);  // Save feedback list to state
        setLoading(false);       // Switch off the loading spinner
      })
      .catch(err => {
        console.error('Failed to fetch feedback', err);
        setLoading(false);
      });
  }, [id]); // Re‑run if the route id ever changes

  /* ----------------------------  Render Logic  ------------------------------- */

  // Show a simple loading state while the request is in flight
  if (loading) return <div className="container">Loading...</div>;

  return (
    <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Back button to return to the dashboard */}
      <button
        onClick={() => navigate('/dashboard')}
        style={{ marginBottom: '20px' }}
      >
        ← Back to Dashboard
      </button>

      {/* Page title with dynamic Application ID */}
      <h2>Customer Feedback for Application ID: {appid}</h2>

      {/* If there’s no feedback, tell the user; otherwise list each entry */}
      {feedbacks.length === 0 ? (
        <p>No feedback available for this application.</p>
      ) : (
        <ul style={{ padding: 0, listStyle: 'none' }}>
          {feedbacks.map((fb: any, index: number) => (
            <li
              key={index}
              style={{
                border: '1px solid #ccc',
                padding: '10px',
                borderRadius: '6px',
                marginBottom: '10px',
              }}
            >
              {/* Timestamp */}
              <div style={{ fontSize: '14px', color: '#666' }}>
                {new Date(fb.createddate).toLocaleString()}
              </div>

              {/* Feedback text */}
              <div style={{ marginTop: '6px', fontSize: '16px' }}>
                {fb.feedback}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FeedbackViewer;
