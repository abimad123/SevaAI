import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../store/slices/authSlice';
import { Sparkles, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login(form));
    if (login.fulfilled.match(result)) {
      toast.success(`Welcome back, ${result.payload.user.name}!`);
      const redirect = ROLE_REDIRECTS[result.payload.user.role] || '/dashboard/ngo';
      navigate(redirect);
    } else {
      toast.error(result.payload || 'Login failed');
    }
  };

  const fillDemo = (acc) => {
    setForm({ email: acc.email, password: acc.password });
    toast.success(`Demo credentials filled for ${acc.role}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-700 flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold font-display text-slate-900">SevaAI</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 mt-2">Welcome back</h1>
          <p className="text-slate-600 text-sm mt-1">Sign in to your SevaAI account</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-md">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-100 text-red-800 text-sm font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  className="input-field pl-10"
                  placeholder="you@organization.in"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  id="login-email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  className="input-field pl-10 pr-10"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  id="login-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3 text-base"
              id="login-submit"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">Sign In <ArrowRight className="w-4 h-4" /></span>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-600 mt-6 font-medium">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-700 hover:text-blue-800 font-bold">Create one free</Link>
          </p>
        </div>

        <div className="mt-6">
          <p className="text-center text-xs text-slate-500 mb-3 font-bold uppercase tracking-wider">Quick Demo Access</p>
          <div className="grid grid-cols-2 gap-2">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.role}
                onClick={() => fillDemo(acc)}
                className="bg-white border border-slate-200 rounded-xl p-3 text-left hover:border-blue-500/30 transition-all group shadow-sm"
                id={`demo-${acc.role.toLowerCase().replace(' ', '-')}`}
              >
                <p className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{acc.role}</p>
                <p className="text-xs text-slate-500 mt-0.5 truncate">{acc.email}</p>
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          <Link to="/" className="hover:text-slate-800 transition-colors font-medium">← Back to home</Link>
        </p>
      </div>
    </div>
  );
}
