import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createNGO, updateNGO } from '../../store/slices/ngoSlice';
import { Building2, MapPin, Users, Globe, Phone, Mail, FileText, Plus, Save, CheckCircle } from 'lucide-react';
import Badge from '../../components/common/Badge';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const FOCUS_OPTIONS = [
  'education', 'health', 'women_empowerment', 'rural_development', 'skill_development',
  'agriculture', 'environment', 'social_welfare', 'housing', 'livelihood', 'children', 'elderly', 'disability',
];

export default function NGOProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { myNGO } = useSelector((s) => s.ngo);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: myNGO?.name || '',
    registrationNumber: myNGO?.registrationNumber || '',
    registrationType: myNGO?.registrationType || 'trust',
    pan: myNGO?.pan || '',
    establishedYear: myNGO?.establishedYear || '',
    description: myNGO?.description || '',
    mission: myNGO?.mission || '',
    focusAreas: myNGO?.focusAreas || [],
    location: { address: myNGO?.location?.address || '', city: myNGO?.location?.city || '', district: myNGO?.location?.district || '', state: myNGO?.location?.state || '', pincode: myNGO?.location?.pincode || '' },
    contactPerson: { name: myNGO?.contactPerson?.name || '', designation: myNGO?.contactPerson?.designation || '', email: myNGO?.contactPerson?.email || '', phone: myNGO?.contactPerson?.phone || '' },
    email: myNGO?.email || '',
    phone: myNGO?.phone || '',
    website: myNGO?.website || '',
    teamSize: myNGO?.teamSize || '',
    annualBudget: myNGO?.annualBudget || '',
    fundingRequirement: myNGO?.fundingRequirement || '',
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const setNested = (parent, k, v) => setForm((f) => ({ ...f, [parent]: { ...f[parent], [k]: v } }));

  const toggleFocus = (area) => {
    setForm((f) => ({
      ...f,
      focusAreas: f.focusAreas.includes(area) ? f.focusAreas.filter((a) => a !== area) : [...f.focusAreas, area],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    if (myNGO?._id) {
      const result = await dispatch(updateNGO({ id: myNGO._id, data: form }));
      if (updateNGO.fulfilled.match(result)) { toast.success('NGO profile updated!'); }
      else toast.error(result.payload || 'Update failed');
    } else {
      const result = await dispatch(createNGO(form));
      if (createNGO.fulfilled.match(result)) { toast.success('NGO registered successfully!'); navigate('/dashboard/ngo'); }
      else toast.error(result.payload || 'Registration failed');
    }
    setSaving(false);
  };

  return (
    <div className="max-w-3xl space-y-6 fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">{myNGO ? 'Edit NGO Profile' : 'Register Your NGO'}</h1>
          <p className="text-slate-600 mt-1 font-semibold">{myNGO ? `Last updated: ${new Date(myNGO.updatedAt).toLocaleDateString('en-IN')}` : 'Complete your profile to access all features'}</p>
        </div>
        {myNGO && <Badge variant={myNGO.status} className="capitalize">{myNGO.status}</Badge>}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2"><Building2 className="w-4 h-4 text-blue-700" /> Basic Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">NGO Name *</label>
              <input className="input-field" value={form.name} onChange={(e) => set('name', e.target.value)} required placeholder="Full legal name of NGO" id="ngo-name" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Registration Number *</label>
              <input className="input-field" value={form.registrationNumber} onChange={(e) => set('registrationNumber', e.target.value)} required placeholder="MH/2019/0001234" id="ngo-regno" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Registration Type</label>
              <select className="input-field" value={form.registrationType} onChange={(e) => set('registrationType', e.target.value)} id="ngo-regtype">
                {['trust', 'society', 'section_8', 'fcra', 'other'].map((t) => <option key={t} value={t} className="capitalize">{t.replace('_', ' ').toUpperCase()}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">PAN Number</label>
              <input className="input-field" value={form.pan} onChange={(e) => set('pan', e.target.value)} placeholder="AAPTS1234B" id="ngo-pan" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Established Year</label>
              <input className="input-field" type="number" value={form.establishedYear} onChange={(e) => set('establishedYear', e.target.value)} placeholder="2015" min={1900} max={2024} id="ngo-year" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Website</label>
              <input className="input-field" value={form.website} onChange={(e) => set('website', e.target.value)} placeholder="https://yourorg.org" id="ngo-website" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description *</label>
            <textarea className="input-field min-h-24 resize-none" value={form.description} onChange={(e) => set('description', e.target.value)} required
              placeholder="Describe your NGO's work, impact, and approach..." id="ngo-desc" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mission Statement</label>
            <textarea className="input-field min-h-16 resize-none" value={form.mission} onChange={(e) => set('mission', e.target.value)}
              placeholder="Your NGO's mission in one or two sentences..." id="ngo-mission" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-600" /> Focus Areas</h2>
          <p className="text-slate-600 text-sm font-semibold">Select all that apply — used for AI scheme recommendations</p>
          <div className="flex flex-wrap gap-2">
            {FOCUS_OPTIONS.map((area) => (
              <button key={area} type="button" onClick={() => toggleFocus(area)}
                className={`px-3 py-1.5 rounded-full text-sm border font-semibold transition-all capitalize
                  ${form.focusAreas.includes(area) ? 'bg-blue-50 border-blue-200 text-blue-700 font-bold' : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-white hover:text-slate-900'}`}>
                {area.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2"><MapPin className="w-4 h-4 text-indigo-700" /> Location</h2>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Address</label>
            <input className="input-field" value={form.location.address} onChange={(e) => setNested('location', 'address', e.target.value)} placeholder="Street address" id="ngo-addr" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['city', 'district', 'state', 'pincode'].map((f) => (
              <div key={f}>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5 capitalize">{f}</label>
                <input className="input-field" value={form.location[f]} onChange={(e) => setNested('location', f, e.target.value)} id={`ngo-${f}`} />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2"><Users className="w-4 h-4 text-cyan-700" /> Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-blue-700" /> Official Email</label>
              <input className="input-field" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="contact@yourorg.org" id="ngo-email" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-emerald-700" /> Phone</label>
              <input className="input-field" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+91 98765 43210" id="ngo-phone" />
            </div>
          </div>
          <h3 className="text-sm font-bold text-slate-700 mt-2">Contact Person</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[['name', 'Full Name'], ['designation', 'Designation'], ['email', 'Email'], ['phone', 'Phone']].map(([f, l]) => (
              <div key={f}>
                <label className="block text-xs font-semibold text-slate-500 mb-1">{l}</label>
                <input className="input-field text-sm py-2" value={form.contactPerson[f]} onChange={(e) => setNested('contactPerson', f, e.target.value)} id={`ngo-cp-${f}`} />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2"><FileText className="w-4 h-4 text-amber-700" /> Team & Financial Info</h2>
          <div className="grid grid-cols-3 gap-4">
            {[['teamSize', 'Team Size'], ['annualBudget', 'Annual Budget (₹)'], ['fundingRequirement', 'Funding Needed (₹)']].map(([f, l]) => (
              <div key={f}>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">{l}</label>
                <input className="input-field" type="number" value={form[f]} onChange={(e) => set(f, e.target.value)} min={0} id={`ngo-${f}`} />
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn-primary py-3 px-8 shadow-sm" id="save-ngo-btn">
          {saving ? <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{myNGO ? 'Updating...' : 'Registering...'}</span>
            : <span className="flex items-center gap-2">{myNGO ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}{myNGO ? 'Update NGO Profile' : 'Register NGO'}</span>}
        </button>
      </form>
    </div>
  );
}
