import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';
import './ApplicationDetails.css';
import { API_BASE_URL } from '../constants';

function ApplicationDetails() {
  // Get application ID from route parameters
  const { id } = useParams();

  // Hook for navigating to other routes
  const navigate = useNavigate();

  // State to store audit logs
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // State to hold new audit note being entered
  const [note, setNote] = useState('');

  // Get RM name from localStorage (fallback to "RM")
  const rmName = localStorage.getItem('rmId') || 'RM';

  // Fetch audit logs when component mounts or when 'id' changes
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/rmaudit/${id}`)
      .then(res => setAuditLogs(res.data))
      .catch(err => console.error('Failed to fetch audit logs', err));
  }, [id]);

  // Add a new audit log to the backend and update state
  const handleAddLog = async () => {
    if (!note.trim()) return; // Avoid empty submissions

    try {
      const response = await axios.post(`${API_BASE_URL}/rmaudit`, {
        rmid: rmName,
        applicationid: id,
        message: note,
      });

      // Prepend new log to the audit logs list
      setAuditLogs(prev => [response.data, ...prev]);
      setNote(''); // Clear the input
    } catch (error) {
      console.error('Failed to add log', error);
    }
  };

  // Activate speech-to-text using Web Speech API
  const handleSpeech = () => {
    const SpeechRecognition =
      (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech Recognition not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    // Append recognized speech to note
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setNote(prev => prev + ' ' + transcript);
    };

    // Handle speech errors
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      alert('Speech recognition error: ' + event.error);
    };

    // Start listening
    recognition.start();
  };

  // Render loading state if auditLogs is not ready
  if (!auditLogs) return <div className="container">Loading...</div>;

  return (
    <div className="container" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Back button to return to dashboard */}
      <div className="back-button">
        <button onClick={() => navigate('/dashboard')} aria-label="Back to Dashboard">
          ← Back to Dashboard
        </button>
      </div>

      <h2>Audit History</h2>

      {/* Audit history list */}
      <div className="audit-history">
        <ul>
          {auditLogs.map((log, index) => (
            <li key={index}>
              <div className="audit-meta">
                {log.rmid}{' '}
                <span className="audit-date">
                  at {new Date(log.createddate).toLocaleString()}
                </span>
              </div>
              <div className="audit-note">{log.message}</div>
            </li>
          ))}
        </ul>
      </div>

      {/* Section to add a new audit log */}
      <div className="add-audit-section">
        <h3>Add New Audit Entry</h3>

        <div className="audit-input-wrapper">
          {/* Textarea to type the audit note */}
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Enter audit log or use speech..."
            aria-label="Audit entry"
          />
          {/* Button to trigger speech-to-text */}
          <button
            onClick={handleSpeech}
            title="Click to speak"
            aria-label="Voice input"
            className="speech-button"
          >
            <FontAwesomeIcon icon={faMicrophone} />
          </button>
        </div>

        {/* Submit button to add log */}
        <button onClick={handleAddLog} className="add-log-btn">
          Add Log
        </button>
      </div>
    </div>
  );
}

export default ApplicationDetails;
