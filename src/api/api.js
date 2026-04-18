/**
 * Axios client for the FastAPI backend (multipart uploads + blob downloads).
 *
 * Default: same-origin `/api` (Vite proxy → http://localhost:8000).
 * Override with `VITE_API_BASE=http://localhost:8000` in `.env` if not using the proxy.
 */
import axios from 'axios';

const baseURL =
  import.meta.env.VITE_API_BASE != null && import.meta.env.VITE_API_BASE !== ''
    ? import.meta.env.VITE_API_BASE
    : '/api';

export const api = axios.create({
  baseURL,
});

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

try {
  const saved = localStorage.getItem('admin_token');
  if (saved) setAuthToken(saved);
} catch {
  /* ignore */
}

/** @param {Blob} blob */
export function triggerDownload(blob, filename = 'download') {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** @param {import('axios').AxiosResponse} response */
export function filenameFromContentDisposition(response) {
  const cd = response.headers['content-disposition'];
  if (!cd) return null;
  const m = /filename="([^"]+)"/.exec(cd);
  return m ? m[1] : null;
}

export async function healthCheck() {
  const { data } = await api.get('/health');
  return data;
}

export async function fetchCourses() {
  const { data } = await api.get('/config/courses');
  return data;
}

export async function fetchJobFilters() {
  const { data } = await api.get('/config/job_filters');
  return data;
}

export async function adminFeedbackStats() {
  const { data } = await api.get('/admin/feedback/stats');
  return data;
}

/**
 * @param {'excel' | 'csv' | 'json'} exportFormat
 */
export async function exportResumes(exportFormat) {
  const response = await api.get('/admin/export/resumes', {
    params: { export_format: exportFormat },
    responseType: 'blob',
  });
  const blob = response.data;
  const fallback =
    exportFormat === 'excel'
      ? 'resume_export.xlsx'
      : exportFormat === 'csv'
        ? 'resume_export.csv'
        : 'resume_export.json';
  const name = filenameFromContentDisposition(response) ?? fallback;
  return { blob, filename: name };
}

export async function loginAdmin(email, password) {
  const { data } = await api.post('/admin/login', { email, password });
  return data;
}

export async function adminMe() {
  const { data } = await api.get('/admin/me');
  return data;
}

/**
 * multipart/form-data: file + AnalysisRequest fields
 * @param {FormData} formData
 */
export async function analyzeBasic(formData) {
  const { data } = await api.post('/analyze/basic', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

/** @param {FormData} formData */
export async function analyzeAi(formData) {
  const { data } = await api.post('/analyze/ai', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

/**
 * JSON body (ResumeData); response is a file blob.
 * @param {Record<string, unknown>} payload
 */
export async function generateResume(payload) {
  const response = await api.post('/builder/generate', payload, {
    responseType: 'blob',
    headers: { 'Content-Type': 'application/json' },
  });
  const blob = response.data;
  const filename = filenameFromContentDisposition(response) ?? 'resume.docx';
  return { blob, filename };
}

export async function jobsSearch(params) {
  const { data } = await api.get('/jobs/search', { params });
  return data;
}

export async function dashboardMetrics() {
  const { data } = await api.get('/dashboard/metrics');
  return data;
}

/** Feedback body includes rating + comment (maps to SQLite fields server-side). */
export async function submitFeedback(payload) {
  const { data } = await api.post('/feedback', payload);
  return data;
}

export async function fetchJobRoles() {
  const { data } = await api.get('/config/job_roles');
  return data;
}
