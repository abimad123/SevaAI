import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../store/slices/authSlice';
import { Sparkles, User, Mail, Lock, ArrowRight, Building2, Shield, Users, Globe, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const ROLES = [
  { value: 'ngo_admin', label: 'roles.ngo_admin', icon: Building2, desc: 'auth.role_ngo_desc' },
  { value: 'government_officer', label: 'roles.government_officer', icon: Shield, desc: 'auth.role_gov_desc' },
  { value: 'volunteer', label: 'roles.volunteer', icon: Users, desc: 'auth.role_vol_desc' },
  { value: 'citizen', label: 'roles.citizen', icon: Globe, desc: 'auth.role_cit_desc' },
];

const ROLE_REDIRECTS = {
  ngo_admin: '/dashboard/ngo',
  government_officer: '/dashboard/gov',
  citizen: '/dashboard/citizen',
  volunteer: '/dashboard/ngo',
};

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: '', phone: '', location: { state: '', city: '' } });
  const { t } = useTranslation();

  const handleRoleSelect = (role) => {
    setForm({ ...form, role });
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.role) return toast.error(t('auth.role_required'));
    const result = await dispatch(register(form));
    if (register.fulfilled.match(result)) {
      toast.success(t('auth.account_created_toast'));
      navigate(ROLE_REDIRECTS[result.payload.user.role] || '/dashboard/ngo');
    } else {
      toast.error(result.payload || t('auth.registration_failed_toast'));
    }
  };

  const selectedRole = ROLES.find(r => r.value === form.role);

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
            Create an official account to access AI-powered verification intelligence, dashboard reporting structures, and state project directories.
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
        <div className="w-full max-w-lg">
          <div className="mb-8 lg:text-left text-center">
            <Link to="/" className="inline-flex lg:hidden items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold font-display text-slate-900">SevaAI</span>
            </Link>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{t('auth.create_account_title')}</h1>
            <p className="text-slate-600 text-sm mt-2">{t('auth.create_account_subtitle')}</p>
            <div className="flex items-center lg:justify-start justify-center gap-2 mt-4">
              {[1, 2].map((s) => (
                <div key={s} className={`h-1.5 rounded-full transition-all duration-300 ${step >= s ? 'bg-blue-600 w-12' : 'bg-slate-200 w-6'}`} />
              ))}
            </div>
          </div>

          <div className="bg-white lg:border-0 border border-slate-200 rounded-2xl p-6 sm:p-8 lg:p-0 shadow-sm lg:shadow-none">
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-800 text-sm font-semibold">{error}</div>
            )}

            {step === 1 && (
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-2">{t('auth.register_as_label')}</h2>
                <p className="text-slate-600 text-sm mb-6 font-medium">{t('auth.register_as_desc')}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {ROLES.map((r) => {
                    const RoleIcon = r.icon;
                    return (
                      <button
                        key={r.value}
                        onClick={() => handleRoleSelect(r.value)}
                        id={`role-${r.value}`}
                        className={`p-5 rounded-2xl border text-left transition-all hover:scale-[1.02] cursor-pointer shadow-sm group
                          ${form.role === r.value 
                            ? 'border-blue-600 border-2 bg-blue-50/50' 
                            : 'border-slate-300 hover:border-blue-400 bg-white'}`}
                      >
                        <RoleIcon className={`w-8 h-8 mb-4 transition-colors ${form.role === r.value ? 'text-blue-600' : 'text-slate-500 group-hover:text-blue-600'}`} />
                        <span className="block font-bold text-slate-900 text-base leading-tight">{t(r.label)}</span>
                        <span className="block text-xs text-slate-500 mt-2 font-medium leading-relaxed">{t(r.desc)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 2 && (
              <form onSubmit={handleSubmit} className="space-y-5">
                <button type="button" onClick={() => setStep(1)} className="text-sm text-slate-500 hover:text-slate-800 flex items-center gap-1 mb-2 font-medium cursor-pointer">
                  ← {t('auth.change_role')}
                </button>
                <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 flex items-center justify-between">
                  <span className="text-sm font-bold text-blue-900">
                    {t('auth.registering_as')}: {selectedRole ? t(selectedRole.label) : ''}
                  </span>
                  <button type="button" onClick={() => setStep(1)} className="text-xs font-bold text-blue-600 hover:text-blue-700 underline cursor-pointer">
                    Change
                  </button>
                </div>

                <div>
                  <label htmlFor="reg-name" className="block text-sm font-semibold text-slate-700 mb-2">{t('auth.name_label')}</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input type="text" className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-slate-900 bg-white transition-all text-base" placeholder={t('auth.name_placeholder')} value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })} required id="reg-name" />
                  </div>
                </div>

                <div>
                  <label htmlFor="reg-email" className="block text-sm font-semibold text-slate-700 mb-2">{t('auth.email_label')}</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input type="email" className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-slate-900 bg-white transition-all text-base" placeholder={t('auth.email_placeholder')} value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })} required id="reg-email" />
                  </div>
                </div>

                <div>
                  <label htmlFor="reg-password" className="block text-sm font-semibold text-slate-700 mb-2">{t('auth.password_label')}</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input type="password" className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-slate-900 bg-white transition-all text-base" placeholder={t('auth.password_placeholder_min')} value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} id="reg-password" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="reg-state" className="block text-sm font-semibold text-slate-700 mb-2">{t('auth.state_label')}</label>
                    <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-slate-900 bg-white transition-all text-base" placeholder={t('auth.state_placeholder')} value={form.location.state}
                      onChange={(e) => setForm({ ...form, location: { ...form.location, state: e.target.value } })} id="reg-state" />
                  </div>
                  <div>
                    <label htmlFor="reg-city" className="block text-sm font-semibold text-slate-700 mb-2">{t('auth.city_label')}</label>
                    <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-slate-900 bg-white transition-all text-base" placeholder={t('auth.city_placeholder')} value={form.location.city}
                      onChange={(e) => setForm({ ...form, location: { ...form.location, city: e.target.value } })} id="reg-city" />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-sm hover:shadow transition-all disabled:opacity-50 cursor-pointer" id="reg-submit">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/35 border-t-white rounded-full animate-spin" />
                      {t('auth.creating_account')}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      {t('auth.create_account_btn')} <ArrowRight className="w-5 h-5" />
                    </span>
                  )}
                </button>
              </form>
            )}

            <div className="mt-8 text-center border-b border-slate-100 pb-6">
              <span className="text-slate-600 text-sm font-medium">
                {t('auth.already_have_account')}{' '}
                <Link to="/login" className="text-blue-600 hover:text-blue-700 font-bold">{t('auth.sign_in_link')}</Link>
              </span>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-slate-500 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Secure 256-bit SSL Encryption Gateway</span>
            </div>

            <p className="text-center text-sm text-slate-500 mt-6">
              <Link to="/" className="hover:text-slate-800 transition-colors font-medium">← {t('auth.back_home')}</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
