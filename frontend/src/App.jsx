import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import store from './store';
import PrivateRoute from './components/common/PrivateRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import LoadingSpinner from './components/common/LoadingSpinner';
import { setLanguage } from './store/slices/chatSlice';

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
const KnowledgeBase = lazy(() => import('./pages/KnowledgeBase/KnowledgeBase'));
const NotFound = lazy(() => import('./pages/NotFound'));

const PageLoader = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <LoadingSpinner size="lg" message={t('common.loading') || 'Loading SevaAI...'} />
    </div>
  );
};

function AppRoutes() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { i18n } = useTranslation();

  useEffect(() => {
    if (user && user.language) {
      i18n.changeLanguage(user.language);
      dispatch(setLanguage(user.language));
    }
  }, [user, i18n, dispatch]);

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/schemes" element={<SchemeSearch />} />
        <Route path="/schemes/:id" element={<SchemeDetail />} />

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
            <Route path="/admin/knowledge-base" element={<KnowledgeBase />} />
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
            style: { background: '#ffffff', color: '#0f172a', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' },
            success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
      </BrowserRouter>
    </Provider>
  );
}
