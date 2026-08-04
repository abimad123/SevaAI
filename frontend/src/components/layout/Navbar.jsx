import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar } from '../../store/slices/uiSlice';
import { Menu, Bell, Sparkles, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { setLanguage } from '../../store/slices/chatSlice';
import { updateProfile } from '../../store/slices/authSlice';

export default function Navbar({ title = '' }) {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { sidebarOpen } = useSelector((s) => s.ui);
  const { i18n } = useTranslation();

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    dispatch(setLanguage(lang));
    if (user) {
      dispatch(updateProfile({ language: lang }));
    }
  };

  return (
    <header className="fixed top-0 right-0 z-40 h-16 flex items-center justify-between px-6 border-b border-slate-200 bg-white/80 backdrop-blur-xl"
      style={{ left: sidebarOpen ? '256px' : '72px', transition: 'left 0.3s ease' }}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        {title && <h1 className="text-lg font-semibold text-slate-900 hidden md:block">{title}</h1>}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative inline-block">
          <Globe className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          <select
            value={i18n.language || 'en'}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="pl-8 pr-6 py-1.5 bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-semibold rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer appearance-none"
            id="navbar-language-select"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="ml">മലയാളം</option>
            <option value="ta">தமிழ்</option>
            <option value="te">తెలుగు</option>
            <option value="kn">ಕನ್ನಡ</option>
            <option value="mr">मराठी</option>
            <option value="bn">বাংলা</option>
            <option value="gu">ગુજરાતી</option>
            <option value="pa">ਪੰਜਾਬी</option>
          </select>
          <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-[10px]">▼</span>
        </div>

        <Link
          to="/chat"
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium hover:bg-blue-100 transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          Ask AI
        </Link>

        <button className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-700 rounded-full" />
        </button>

        <Link to="/profile" className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center hover:opacity-90 transition-opacity">
          <span className="text-sm font-bold text-white">{user?.name?.[0]?.toUpperCase()}</span>
        </Link>
      </div>
    </header>
  );
}
