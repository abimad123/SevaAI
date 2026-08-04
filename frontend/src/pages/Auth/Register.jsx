import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../store/slices/authSlice';
import { Sparkles, User, Mail, Lock, ArrowRight, Building2, Shield, Users, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

const ROLES = [
  { value: 'ngo_admin', label: 'NGO Admin', icon: Building2, desc: 'Register & manage an NGO', color: 'indigo' },
  { value: 'government_officer', label: 'Government Officer', icon: Shield, desc: 'Monitor & verify NGOs', color: 'amber' },
  { value: 'volunteer', label: 'Volunteer', icon: Users, desc: 'Contribute to projects', color: 'emerald' },
  { value: 'citizen', label: 'Citizen', icon: Globe, desc: 'Find schemes & benefits', color: 'cyan' },
];

const ROLE_REDIRECTS = {
  ngo_admin: '/dashboard/ngo',
  government_officer: '/dashboard/gov',
  citizen: '/dashboard/citizen',
  volunteer: '/dashboard/ngo',
};

const colorBorder = { indigo: 'border-blue-600 bg-blue-50/50', amber: 'border-blue-600 bg-blue-50/50', emerald: 'border-blue-600 bg-blue-50/50', cyan: 'border-blue-600 bg-blue-50/50' };
const colorText = { indigo: 'text-blue-700', amber: 'text-blue-700', emerald: 'text-blue-700', cyan: 'text-blue-700' };

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: '', phone: '', location: { state: '', city: '' } });

  const handleRoleSelect = (role) => { setForm({ ...form, role }); setStep(2); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.role) return toast.error('Please select a role');
    const result = await dispatch(register(form));
    if (register.fulfilled.match(result)) {
      toast.success('Account created! Welcome to SevaAI 🎉');
      navigate(ROLE_REDIRECTS[result.payload.user.role] || '/dashboard/ngo');
    } else {
      toast.error(result.payload || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="w-full max-w-lg relative">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-700 flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold font-display text-slate-900">SevaAI</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 mt-2">Create your account</h1>
          <p className="text-slate-600 text-sm mt-1">Join India's AI-powered NGO platform</p>
          <div className="flex items-center justify-center gap-2 mt-4">
            {[1, 2].map((s) => (
              <div key={s} className={`h-1.5 rounded-full transition-all duration-300 ${step >= s ? 'bg-blue-600 w-12' : 'bg-slate-200 w-6'}`} />
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-md">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-100 text-red-800 text-sm font-semibold">{error}</div>
          )}

          {step === 1 && (
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-2">I am a...</h2>
              <p className="text-slate-600 text-sm mb-6 font-medium">Select your role to get a personalized experience</p>
              <div className="grid grid-cols-2 gap-3">
                {ROLES.map((r) => (
                  <button
                    key={r.value}
                    onClick={() => handleRoleSelect(r.value)}
                    id={`role-${r.value}`}
                    className={`p-4 rounded-xl border text-left transition-all hover:scale-105 shadow-sm
                      ${form.role === r.value ? `${colorBorder[r.color]} border-blue-600 border-2` : 'border-slate-200 hover:border-blue-300 bg-white'}`}
                  >
                    <r.icon className={`w-6 h-6 mb-2 ${colorText[r.color]}`} />
                    <p className="font-bold text-slate-950 text-sm">{r.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">{r.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <button type="button" onClick={() => setStep(1)} className="text-sm text-slate-500 hover:text-slate-800 flex items-center gap-1 mb-2 font-medium">
                ← Change role
              </button>
              <div className={`p-3 rounded-xl border ${colorBorder[ROLES.find(r => r.value === form.role)?.color || 'indigo']} mb-4`}>
                <p className="text-sm font-bold text-blue-800">Registering as: {ROLES.find(r => r.value === form.role)?.label}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="text" className="input-field pl-10" placeholder="Your full name" value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })} required id="reg-name" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="email" className="input-field pl-10" placeholder="you@organization.in" value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })} required id="reg-email" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="password" className="input-field pl-10" placeholder="Min 6 characters" value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} id="reg-password" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">State</label>
                  <input type="text" className="input-field" placeholder="Maharashtra" value={form.location.state}
                    onChange={(e) => setForm({ ...form, location: { ...form.location, state: e.target.value } })} id="reg-state" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">City</label>
                  <input type="text" className="input-field" placeholder="Pune" value={form.location.city}
                    onChange={(e) => setForm({ ...form, location: { ...form.location, city: e.target.value } })} id="reg-city" />
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-base shadow-sm" id="reg-submit">
                {loading ? <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating account...</span>
                  : <span className="flex items-center gap-2">Create Account <ArrowRight className="w-4 h-4" /></span>}
              </button>
            </form>
          )}

          <p className="text-center text-sm text-slate-600 mt-6 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-700 hover:text-blue-800 font-bold">Sign in</Link>
          </p>
        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          <Link to="/" className="hover:text-slate-800 transition-colors font-medium">← Back to home</Link>
        </p>
      </div>
    </div>
  );
}
