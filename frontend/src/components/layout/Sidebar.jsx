import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { toggleSidebar } from '../../store/slices/uiSlice';
import {
  LayoutDashboard, MessageSquare, FileSearch, Lightbulb, BarChart3,
  Building2, Users, FileText, LogOut, Settings, ChevronLeft, Sparkles,
  Globe, Shield
} from 'lucide-react';
import toast from 'react-hot-toast';

const navItems = {
  ngo_admin: [
    { label: 'Dashboard', path: '/dashboard/ngo', icon: LayoutDashboard },
    { label: 'AI Assistant', path: '/chat', icon: MessageSquare },
    { label: 'Schemes', path: '/schemes', icon: Globe },
    { label: 'Documents', path: '/documents', icon: FileText },
    { label: 'Proposal Generator', path: '/proposal', icon: Lightbulb },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'NGO Profile', path: '/ngo/profile', icon: Building2 },
  ],
  government_officer: [
    { label: 'Dashboard', path: '/dashboard/gov', icon: LayoutDashboard },
    { label: 'AI Assistant', path: '/chat', icon: MessageSquare },
    { label: 'NGOs', path: '/schemes', icon: Building2 },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
  ],
  citizen: [
    { label: 'Portal', path: '/dashboard/citizen', icon: LayoutDashboard },
    { label: 'AI Assistant', path: '/chat', icon: MessageSquare },
    { label: 'Browse Schemes', path: '/schemes', icon: Globe },
  ],
  volunteer: [
    { label: 'Dashboard', path: '/dashboard/ngo', icon: LayoutDashboard },
    { label: 'AI Assistant', path: '/chat', icon: MessageSquare },
    { label: 'Schemes', path: '/schemes', icon: Globe },
  ],
  system_admin: [
    { label: 'Overview', path: '/analytics', icon: BarChart3 },
    { label: 'AI Assistant', path: '/chat', icon: MessageSquare },
    { label: 'NGOs', path: '/dashboard/gov', icon: Building2 },
    { label: 'Schemes', path: '/schemes', icon: Globe },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Admin', path: '/profile', icon: Shield },
  ],
};

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const { sidebarOpen } = useSelector((s) => s.ui);

  const items = navItems[user?.role] || navItems.citizen;

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/');
  };

  const roleLabels = {
    ngo_admin: 'NGO Admin', government_officer: 'Government Officer',
    volunteer: 'Volunteer', citizen: 'Citizen', system_admin: 'System Admin',
  };
  const roleColors = {
    ngo_admin: 'text-blue-700', government_officer: 'text-slate-700',
    volunteer: 'text-emerald-700', citizen: 'text-slate-600', system_admin: 'text-indigo-700',
  };

  return (
    <aside
      className={`
        fixed left-0 top-0 h-full z-50 flex flex-col
        bg-white border-r border-slate-200
        transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'w-64' : 'w-18'}
      `}
    >
      <div className="flex items-center justify-between p-4 border-b border-slate-200 h-16">
        {sidebarOpen && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-900 font-display">SevaAI</span>
          </div>
        )}
        {!sidebarOpen && (
          <div className="mx-auto w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        )}
        {sidebarOpen && (
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {sidebarOpen && (
        <div className="px-4 py-3 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-700 flex items-center justify-center shrink-0">
              <span className="text-sm font-bold text-white">{user?.name?.[0]?.toUpperCase()}</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{user?.name}</p>
              <p className={`text-xs font-semibold ${roleColors[user?.role]}`}>{roleLabels[user?.role]}</p>
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-1">
          {items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-link flex items-center gap-3 px-3 py-2.5 text-sm font-medium
                ${isActive ? 'active text-blue-700 bg-blue-50' : 'text-slate-500 hover:text-slate-800'}
                ${!sidebarOpen ? 'justify-center' : ''}`
              }
              title={!sidebarOpen ? item.label : undefined}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="p-3 border-t border-slate-200 space-y-1">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `sidebar-link flex items-center gap-3 px-3 py-2.5 text-sm font-medium
            ${isActive ? 'active text-blue-700 bg-blue-50' : 'text-slate-500 hover:text-slate-800'}
            ${!sidebarOpen ? 'justify-center' : ''}`
          }
          title={!sidebarOpen ? 'Profile' : undefined}
        >
          <Settings className="w-5 h-5 shrink-0" />
          {sidebarOpen && <span>Profile & Settings</span>}
        </NavLink>
        <button
          onClick={handleLogout}
          className={`sidebar-link w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 ${!sidebarOpen ? 'justify-center' : ''}`}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {sidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
