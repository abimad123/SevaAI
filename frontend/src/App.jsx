import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import store from './store';
import PrivateRoute from './components/common/PrivateRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import LoadingSpinner from './components/common/LoadingSpinner';

// Lazy-loaded pages
const Landing = lazy(() => import('./pages/Landing/Landing'));
const Login = lazy(() => import('./pages/Auth/Login'));
const Register = lazy(() => import('./pages/Auth/Register'));
const NGODashboard = lazy(() => import('./pages/NGODashboard/NGODashboard'));
const GovDashboard = lazy(() => import('./pages/GovDashboard/GovDashboard'));
const CitizenPortal = lazy(() => import('./pages/CitizenPortal/CitizenPortal'));
const AIChat = lazy(() => import('./pages/AIChat/AIChat'));
const SchemeSearch = lazy(() => import('./pages/SchemeSearch/SchemeSearch'));
const SchemeDetail = lazy(() => import('./pages/SchemeSearch/SchemeDetail'));
const DocumentAnalyzer = lazy(() => import('./pages/DocumentAnalyzer/DocumentAnalyzer'));
const ProposalGenerator = lazy(() => import('./pages/ProposalGenerator/ProposalGenerator'));
const Analytics = lazy(() => import('./pages/Analytics/Analytics'));
const Profile = lazy(() => import('./pages/Profile/Profile'));
const NGOProfile = lazy(() => import('./pages/NGODashboard/NGOProfile'));
const NotFound = lazy(() => import('./pages/NotFound'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center" style={{ background: '#0f172a' }}>
    <LoadingSpinner size="lg" message="Loading SevaAI..." />
  </div>
);

function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/schemes" element={<SchemeSearch />} />
        <Route path="/schemes/:id" element={<SchemeDetail />} />

        {/* Protected — Dashboard Layout */}
        <Route element={<PrivateRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Navigate to="/dashboard/ngo" replace />} />
            <Route path="/dashboard/ngo" element={<NGODashboard />} />
            <Route path="/dashboard/gov" element={<GovDashboard />} />
            <Route path="/dashboard/citizen" element={<CitizenPortal />} />
            <Route path="/chat" element={<AIChat />} />
            <Route path="/documents" element={<DocumentAnalyzer />} />
            <Route path="/proposal" element={<ProposalGenerator />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/ngo/profile" element={<NGOProfile />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#1e293b', color: '#f1f5f9', border: '1px solid rgba(255,255,255,0.1)' },
            success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
      </BrowserRouter>
    </Provider>
  );
}
