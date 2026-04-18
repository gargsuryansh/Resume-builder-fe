import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
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
        <Route path="analyze/basic" element={<AnalyzeBasic />} />
        <Route path="analyze/ai" element={<AnalyzeAI />} />
        <Route path="builder" element={<Builder />} />
        <Route path="jobs" element={<Jobs />} />
        <Route
          path="dashboard"
          element={
            <Suspense
              fallback={
                <div className="card">
                  <p>Loading charts…</p>
                </div>
              }
            >
              <Dashboard />
            </Suspense>
          }
        />
        <Route path="feedback" element={<Feedback />} />
        <Route path="reference" element={<Reference />} />
        <Route path="admin/tools" element={<AdminTools />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
