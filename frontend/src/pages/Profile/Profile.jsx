import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../../store/slices/authSlice';
import { User, Mail, Phone, MapPin, Globe, Lock, Shield, Save, CheckCircle } from 'lucide-react';
import Badge from '../../components/common/Badge';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ROLE_LABELS = {
  ngo_admin: 'NGO Admin', government_officer: 'Government Officer',
  volunteer: 'Volunteer', citizen: 'Citizen', system_admin: 'System Admin',
};
const ROLE_COLORS = { ngo_admin: 'primary', government_officer: 'warning', volunteer: 'success', citizen: 'info', system_admin: 'danger' };

export default function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    language: user?.language || 'en',
    location: { state: user?.location?.state || '', city: user?.location?.city || '', district: user?.location?.district || '' },
    department: user?.department || '',
  });
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [saving, setSaving] = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);
  const [tab, setTab] = useState('profile');

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const result = await dispatch(updateProfile(form));
    if (updateProfile.fulfilled.match(result)) toast.success('Profile updated successfully!');
    else toast.error('Update failed');
    setSaving(false);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) return toast.error('Passwords do not match');
    if (passwords.new.length < 6) return toast.error('Password must be at least 6 characters');
    setSavingPwd(true);
    try {
      await api.put('/auth/change-password', { currentPassword: passwords.current, newPassword: passwords.new });
      toast.success('Password changed successfully!');
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    }
    setSavingPwd(false);
  };

  const tabs = [
    { id: 'profile', label: 'Profile Information', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'preferences', label: 'Preferences', icon: Globe },
  ];

  return (
    <div className="max-w-3xl space-y-6 fade-in-up">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-display">Profile & Settings</h1>
        <p className="text-slate-600 mt-1">Manage your account information and preferences</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-700 flex items-center justify-center shrink-0 shadow-sm">
            <span className="text-2xl font-bold text-white">{user?.name?.[0]?.toUpperCase()}</span>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
            <p className="text-slate-500 text-sm">{user?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={ROLE_COLORS[user?.role] || 'default'}>{ROLE_LABELS[user?.role] || user?.role}</Badge>
              {user?.isVerified && <Badge variant="success" className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-emerald-700" /> Verified</Badge>}
            </div>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-xs text-slate-500">Member since</p>
            <p className="text-sm text-slate-900 font-semibold">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' }) : 'N/A'}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-1 bg-slate-100 border border-slate-200 rounded-xl p-1 w-fit">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all
              ${tab === t.id ? 'bg-blue-700 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>
            <t.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {tab === 'profile' && (
        <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
          <h3 className="text-base font-bold text-slate-900">Personal Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <User className="w-4 h-4 text-blue-700" /> Full Name
              </label>
              <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} id="profile-name" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-blue-700" /> Email (read-only)
              </label>
              <input className="input-field opacity-60 bg-slate-50 cursor-not-allowed border-slate-200" value={user?.email} readOnly />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-emerald-700" /> Phone Number
              </label>
              <input className="input-field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" id="profile-phone" />
            </div>
            {user?.role === 'government_officer' && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-amber-700" /> Department
                </label>
                <input className="input-field" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} placeholder="Ministry of Education" id="profile-dept" />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-indigo-700" /> Location
            </label>
            <div className="grid grid-cols-3 gap-3">
              <input className="input-field" placeholder="State" value={form.location.state}
                onChange={(e) => setForm({ ...form, location: { ...form.location, state: e.target.value } })} id="profile-state" />
              <input className="input-field" placeholder="District" value={form.location.district}
                onChange={(e) => setForm({ ...form, location: { ...form.location, district: e.target.value } })} id="profile-district" />
              <input className="input-field" placeholder="City" value={form.location.city}
                onChange={(e) => setForm({ ...form, location: { ...form.location, city: e.target.value } })} id="profile-city" />
            </div>
          </div>

          <button type="submit" disabled={saving} className="btn-primary py-2.5 px-6" id="save-profile">
            {saving ? <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</span>
              : <span className="flex items-center gap-2"><Save className="w-4 h-4" /> Save Changes</span>}
          </button>
        </form>
      )}

      {tab === 'security' && (
        <form onSubmit={handlePasswordChange} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
          <h3 className="text-base font-bold text-slate-900">Change Password</h3>
          {['current', 'new', 'confirm'].map((field) => (
            <div key={field}>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 capitalize">
                {field === 'current' ? 'Current Password' : field === 'new' ? 'New Password' : 'Confirm New Password'}
              </label>
              <input type="password" className="input-field" placeholder="••••••••" value={passwords[field]}
                onChange={(e) => setPasswords({ ...passwords, [field]: e.target.value })} required id={`pwd-${field}`} />
            </div>
          ))}
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 text-blue-800">
            <p className="text-sm font-bold text-blue-800 mb-1">Password requirements:</p>
            <ul className="text-xs text-slate-600 font-semibold space-y-0.5">
              <li>• At least 6 characters long</li>
              <li>• Mix of letters, numbers, and symbols recommended</li>
            </ul>
          </div>
          <button type="submit" disabled={savingPwd} className="btn-primary py-2.5 px-6" id="change-password-btn">
            {savingPwd ? 'Changing...' : <span className="flex items-center gap-2"><Lock className="w-4 h-4" /> Change Password</span>}
          </button>
        </form>
      )}

      {tab === 'preferences' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
          <h3 className="text-base font-bold text-slate-900">Preferences</h3>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Interface Language</label>
            <div className="flex gap-3">
              {[{ value: 'en', label: '🇬🇧 English' }, { value: 'hi', label: '🇮🇳 हिंदी' }].map((l) => (
                <button key={l.value} type="button" onClick={() => setForm({ ...form, language: l.value })}
                  className={`px-5 py-2.5 rounded-xl border text-sm font-semibold transition-all
                    ${form.language === l.value ? 'bg-blue-50 border-blue-200 text-blue-700 font-bold' : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-white hover:text-slate-900'}`}>
                  {l.label}
                </button>
              ))}
            </div>
          </div>
          <button onClick={handleSave} disabled={saving} className="btn-primary py-2.5 px-6">
            <Save className="w-4 h-4" /> Save Preferences
          </button>
        </div>
      )}
    </div>
  );
}
