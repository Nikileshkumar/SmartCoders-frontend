import { useEffect, useState } from 'react';
// Importing service functions to interact with the backend API
import {
  getAllJourneys,
  addJourney,
  updateJourney,
  deleteJourney,
} from '../services/apiService';
import { API_BASE_URL } from '../constants';

function JourneyManager() {
  /* --------------------------- Component State --------------------------- */

  // Stores the list of journeys fetched from the backend
  const [journeys, setJourneys] = useState<any[]>([]);

  // Stores the ID of the journey currently being edited (null = add mode)
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form input state for journey type, version, and JSON template
  const [form, setForm] = useState({
    journeytype: '',
    version: 'v1',
    templatedata: '',
  });

  /* ---------------------------- Lifecycle Hook ---------------------------- */

  // On component mount, fetch all journeys
  useEffect(() => {
    fetchJourneys();
  }, []);

  // Function to fetch journeys from the backend and update state
  const fetchJourneys = async () => {
    const data = await getAllJourneys();
    setJourneys(data);
  };

  /* ----------------------------- Form Submit ----------------------------- */

  // Handles the form submission for both adding and updating journeys
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // If editing an existing journey, call update API
    if (editingId !== null) {
      await updateJourney(editingId, form);
    } else {
      // Otherwise, call add API
      await addJourney(form);
    }

    // Reset form and edit state after submission
    setForm({ journeytype: '', version: 'v1', templatedata: '' });
    setEditingId(null);

    // Refresh the journey list
    fetchJourneys();
  };

  /* ------------------------------ Edit Journey ---------------------------- */

  // Populate the form with existing data for editing
  const handleEdit = (journey: any) => {
    setEditingId(journey.id);
    setForm({
      journeytype: journey.journeytype,
      version: journey.version || 'v1',
      templatedata: journey.templatedata,
    });
  };

  /* ----------------------------- Delete Journey --------------------------- */

  // Confirm and delete the journey
  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this journey?')) {
      await deleteJourney(id);
      fetchJourneys(); // Refresh the list after deletion
    }
  };

  /* ------------------------------- UI Render ------------------------------ */

  return (
    <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <h2>Journey Manager</h2>

      {/* ------------------------ Form Section ------------------------ */}
      {/* Reusable form for both adding and editing journeys */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <label>
          Journey Type:
          <input
            type="text"
            required
            value={form.journeytype}
            onChange={(e) => setForm({ ...form, journeytype: e.target.value })}
          />
        </label>

        <label>
          Version:
          <input
            type="text"
            value={form.version}
            onChange={(e) => setForm({ ...form, version: e.target.value })}
          />
        </label>

        <label>
          Template JSON:
          <textarea
            required
            rows={5}
            value={form.templatedata}
            onChange={(e) => setForm({ ...form, templatedata: e.target.value })}
          />
        </label>

        <button type="submit">
          {editingId !== null ? 'Update' : 'Add'} Journey
        </button>
      </form>

      {/* ---------------------- Journey List Table --------------------- */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Journey Type</th>
            <th>Version</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {journeys.map((j) => (
            <tr key={j.id}>
              <td>{j.id}</td>
              <td>{j.journeytype}</td>
              <td>{j.version}</td>
              <td>{j.createddate?.replace('T', ' ').slice(0, 16)}</td>
              <td>
                <button onClick={() => handleEdit(j)}>Edit</button>
                <button
                  onClick={() => handleDelete(j.id)}
                  style={{ marginLeft: '8px' }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {/* If no journeys found */}
          {journeys.length === 0 && (
            <tr>
              <td colSpan={5} style={{ textAlign: 'center', padding: '10px' }}>
                No journeys found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default JourneyManager;
