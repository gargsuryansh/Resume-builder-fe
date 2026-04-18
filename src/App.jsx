import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import AnalyzeBasic from './pages/AnalyzeBasic.jsx';
import AnalyzeAI from './pages/AnalyzeAI.jsx';
import Builder from './pages/Builder.jsx';
import Jobs from './pages/Jobs.jsx';
import Feedback from './pages/Feedback.jsx';
import Reference from './pages/Reference.jsx';
import AdminTools from './pages/AdminTools.jsx';

/** Code-split Plotly (large dependency) until that route is opened. */
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route
          path="analyze/basic"
          element={
            <ProtectedRoute>
              <AnalyzeBasic />
            </ProtectedRoute>
          }
        />
        <Route
          path="analyze/ai"
          element={
            <ProtectedRoute>
              <AnalyzeAI />
            </ProtectedRoute>
          }
        />
        <Route
          path="builder"
          element={
            <ProtectedRoute>
              <Builder />
            </ProtectedRoute>
          }
        />
        <Route
          path="jobs"
          element={
            <ProtectedRoute>
              <Jobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <Suspense
                fallback={
                  <div className="card">
                    <p>Loading charts…</p>
                  </div>
                }
              >
                <Dashboard />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route path="feedback" element={<Feedback />} />
        <Route path="reference" element={<Reference />} />
        <Route
          path="admin/tools"
          element={
            <ProtectedRoute>
              <AdminTools />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
