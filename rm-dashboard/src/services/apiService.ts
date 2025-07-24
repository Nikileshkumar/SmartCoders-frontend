import axios from 'axios';
import { API_BASE_URL } from '../constants';

// ---------------------------
// LOGIN
// ---------------------------
export const getAllJourneys = async () => {
  const res = await fetch(`${API_BASE_URL}/journeys`);
  return res.json();
};

export const addJourney = async (data: any) => {
  const res = await fetch(`${API_BASE_URL}/journeys`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateJourney = async (id: number, data: any) => {
  const res = await fetch(`${API_BASE_URL}/journeys/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteJourney = async (id: number) => {
  return fetch(`${API_BASE_URL}/journeys/${id}`, {
    method: 'DELETE',
  });
};


export const loginUser = async (rmName: string, password: string) => {
  const response = await axios.post(`${API_BASE_URL}/login`, { rmName, password });
  return response.data; // expects { role: 'Admin' | 'RM', rmName: '...' }
};

// ---------------------------
// APPLICATIONS
// ---------------------------
export const fetchApplications = async () => {
  const response = await axios.get(`${API_BASE_URL}/applications`);
  return response.data;
};

export const addAuditLog = async (applicationId: number, note: string, by: string) => {
  const response = await axios.post(`${API_BASE_URL}/applications/${applicationId}/audit`, {
    note,
    by
  });
  return response.data;
};

export const assignApplication = async (applicationId: number, assignedTo: string) => {
  const response = await axios.post(`${API_BASE_URL}/applications/${applicationId}/assign`, {
    assignedTo
  });
  return response.data;
};

// ---------------------------
// JOURNEYS
// ---------------------------
export const fetchJourneys = async () => {
  const response = await axios.get(`${API_BASE_URL}/journeys`);
  return response.data;
};

export const createJourney = async (
  journeytype: string,
  version: string,
  templatedata: object
) => {
  const response = await axios.post(`${API_BASE_URL}/journeys`, {
    journeytype,
    version,
    templatedata
  });
  return response.data;
};
