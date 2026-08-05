import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../store/slices/authSlice';
import { Sparkles, Mail, Lock, ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const DEMO_ACCOUNTS = [
  { role: 'NGO Admin', email: 'ngo@sevaai.in', password: 'NGO@123', color: 'indigo' },
  { role: 'Govt Officer', email: 'govt@sevaai.in', password: 'Govt@123', color: 'amber' },
  { role: 'Citizen', email: 'citizen@sevaai.in', password: 'Cit@123', color: 'cyan' },
  { role: 'System Admin', email: 'admin@sevaai.in', password: 'Admin@123', color: 'violet' },
];

const ROLE_REDIRECTS = {
  ngo_admin: '/dashboard/ngo',
  government_officer: '/dashboard/gov',
  citizen: '/dashboard/citizen',
  volunteer: '/dashboard/ngo',
  system_admin: '/analytics',
};

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const { t } = useTranslation();

  const roleTranslation = {
    'NGO Admin': t('roles.ngo_admin'),
    'Govt Officer': t('roles.government_officer'),
    'Citizen': t('roles.citizen'),
    'System Admin': t('roles.system_admin'),
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login(form));
    if (login.fulfilled.match(result)) {
      toast.success(`${t('auth.welcome_toast')}, ${result.payload.user.name}!`);
      const redirect = ROLE_REDIRECTS[result.payload.user.role] || '/dashboard/ngo';
      navigate(redirect);
    } else {
      toast.error(result.payload || t('auth.login_failed_toast'));
    }
  };

  const fillDemo = (acc) => {
    setForm({ email: acc.email, password: acc.password });
    toast.success(`${t('auth.demo_toast')} ${roleTranslation[acc.role] || acc.role}`);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-white">
      <div className="hidden lg:flex lg:col-span-5 bg-slate-950 text-white p-12 flex-col justify-between relative overflow-hidden">
        <svg className="absolute inset-0 w-full h-full object-cover opacity-15" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M -100 300 C 100 200, 300 450, 500 300 C 700 150, 800 350, 900 250" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
          <path d="M -100 400 C 150 300, 250 550, 450 400 C 650 250, 750 450, 900 350" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
          <path d="M -100 500 C 120 400, 280 600, 480 450 C 680 300, 780 500, 900 400" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
          <path d="M -100 200 C 80 150, 320 350, 520 200 C 720 50, 820 250, 900 150" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
          <circle cx="200" cy="300" r="3" fill="#3b82f6" />
          <circle cx="450" cy="400" r="4" fill="#60a5fa" />
          <circle cx="700" cy="200" r="3" fill="#93c5fd" />
        </svg>

        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight font-display text-white">SevaAI</span>
          </Link>
        </div>

        <div className="relative z-10 my-auto backdrop-blur-lg bg-white/[0.04] border border-white/10 shadow-2xl rounded-2xl p-10">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-950/90 to-slate-900/90 border border-blue-500/30 text-blue-300 text-xs font-semibold shadow-[0_0_15px_rgba(59,130,246,0.1)]">
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Official Platform</span>
            </div>
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight leading-tight font-display text-white">
            Empowering India's Social Sector
          </h2>
          <p className="text-blue-100/80 text-base leading-relaxed mt-4">
            A secure digital gateway bridging non-governmental organizations, administrative entities, and citizens for direct social impact verification.
          </p>

          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <div className="w-7 h-7 rounded-full bg-blue-600 border border-slate-950 flex items-center justify-center text-[10px] font-bold text-white">NGO</div>
                <div className="w-7 h-7 rounded-full bg-emerald-600 border border-slate-950 flex items-center justify-center text-[10px] font-bold text-white">GOV</div>
                <div className="w-7 h-7 rounded-full bg-amber-600 border border-slate-950 flex items-center justify-center text-[10px] font-bold text-white">CIT</div>
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-none">Trusted Nationwide</p>
                <p className="text-[10px] text-blue-200/60 mt-0.5">10,000+ Verified Entities</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex justify-between items-center text-[11px] text-slate-400 font-medium">
          <span>Ministry of Electronics & IT Compliant</span>
          <span>v1.2.0</span>
        </div>
      </div>

      <div className="col-span-1 lg:col-span-7 flex flex-col justify-center items-center px-6 sm:px-16 py-12 bg-slate-50 lg:bg-white overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:text-left text-center">
            <Link to="/" className="inline-flex lg:hidden items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold font-display text-slate-900">SevaAI</span>
            </Link>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{t('auth.login_title')}</h1>
            <p className="text-slate-600 text-sm mt-2">{t('auth.login_subtitle')}</p>
          </div>

          <div className="bg-white lg:border-0 border border-slate-200 rounded-2xl p-6 sm:p-8 lg:p-0 shadow-sm lg:shadow-none">
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-800 text-sm font-semibold">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="login-email" className="block text-sm font-semibold text-slate-700 mb-2">
                  {t('auth.email_label')}
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-slate-900 bg-white transition-all text-base"
                    placeholder={t('auth.email_placeholder')}
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    id="login-email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="login-password" className="block text-sm font-semibold text-slate-700 mb-2">
                  {t('auth.password_label')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    className="w-full pl-12 pr-12 py-3 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-slate-900 bg-white transition-all text-base"
                    placeholder={t('auth.password_placeholder')}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    id="login-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-sm hover:shadow transition-all disabled:opacity-50 cursor-pointer"
                id="login-submit"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/35 border-t-white rounded-full animate-spin" />
                    {t('auth.signing_in')}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    {t('auth.sign_in')} <ArrowRight className="w-5 h-5" />
                  </span>
                )}
              </button>
            </form>

            <div className="mt-8 text-center border-b border-slate-100 pb-6">
              <span className="text-slate-600 text-sm font-medium">
                {t('auth.no_account')}{' '}
                <Link to="/register" className="text-blue-600 hover:text-blue-700 font-bold">
                  {t('auth.create_free')}
                </Link>
              </span>
            </div>

            <div className="mt-8">
              <span className="block text-center text-xs text-slate-400 font-bold uppercase tracking-wider mb-4">
                {t('auth.demo_title')}
              </span>
              <div className="grid grid-cols-2 gap-3">
                {DEMO_ACCOUNTS.map((acc) => (
                  <button
                    key={acc.role}
                    onClick={() => fillDemo(acc)}
                    className="bg-white border border-slate-200 rounded-xl p-3.5 text-left hover:border-blue-600 hover:bg-blue-50/10 transition-all cursor-pointer shadow-sm"
                    id={`demo-${acc.role.toLowerCase().replace(' ', '-')}`}
                  >
                    <span className="block text-sm font-bold text-slate-800">
                      {roleTranslation[acc.role] || acc.role}
                    </span>
                    <span className="block text-xs text-slate-500 mt-1 truncate">
                      {acc.email}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-slate-500 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Secure 256-bit SSL Encryption Gateway</span>
            </div>

            <p className="text-center text-sm text-slate-500 mt-6">
              <Link to="/" className="hover:text-slate-800 transition-colors font-medium">
                ← {t('auth.back_to_home')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
