import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchNGOs } from '../../store/slices/ngoSlice';
import { Building2, CheckCircle, Clock, Users, Search, Check, X, MapPin, Eye } from 'lucide-react';
import { StatsCard } from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';

const stateData = [
  { state: 'MH', count: 420 }, { state: 'KA', count: 310 }, { state: 'TN', count: 280 },
  { state: 'UP', count: 250 }, { state: 'GJ', count: 220 }, { state: 'RJ', count: 180 },
];
const chartStyle = { backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#0f172a' };

const queueKeyMap = {
  'Documents Under Review': 'gov.queue_review',
  'Field Verification': 'gov.queue_field',
  'Final Approval': 'gov.queue_final',
  'Approved This Month': 'gov.queue_approved'
};

const tableHeaderMap = {
  'NGO Name': 'gov.table_ngo_name',
  'Location': 'gov.table_location',
  'Focus Areas': 'gov.table_focus',
  'Registration': 'gov.table_reg',
  'Status': 'gov.table_status',
  'Actions': 'gov.table_actions'
};

export default function GovDashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { ngos, loading } = useSelector((s) => s.ngo);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');
  const [verifying, setVerifying] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(fetchNGOs({ status: statusFilter, search }));
  }, [dispatch, statusFilter, search]);

  const handleVerify = async (ngoId, status) => {
    setVerifying(ngoId);
    try {
      await api.put(`/ngo/${ngoId}/verify`, { status });
      toast.success(`NGO ${status === 'active' ? 'verified' : 'rejected'} successfully`);
      dispatch(fetchNGOs({ status: statusFilter }));
    } catch {
      toast.error('Action failed');
    } finally {
      setVerifying(null);
    }
  };

  return (
    <div className="space-y-6 fade-in-up">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-display">{t('gov.title')}</h1>
        <p className="text-slate-600 mt-1">{user?.department || 'Ministry of Social Justice & Empowerment'}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard label={t('gov.total_ngos')} value="2,400" icon={Building2} color="indigo" />
        <StatsCard label={t('gov.pending_verify')} value="47" icon={Clock} color="amber" change={-5} />
        <StatsCard label={t('gov.active_projects')} value="384" icon={CheckCircle} color="emerald" change={12} />
        <StatsCard label={t('gov.beneficiaries')} value="1.2M" icon={Users} color="violet" change={8} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">{t('gov.ngo_by_state')}</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stateData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="state" stroke="#64748b" tick={{ fontSize: 12 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={chartStyle} />
              <Bar dataKey="count" fill="#1d4ed8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">{t('gov.verification_queue')}</h3>
          <div className="space-y-3">
            {[
              { stage: 'Documents Under Review', count: 23, color: 'amber' },
              { stage: 'Field Verification', count: 12, color: 'indigo' },
              { stage: 'Final Approval', count: 8, color: 'cyan' },
              { stage: 'Approved This Month', count: 54, color: 'emerald' },
            ].map((s, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-sm text-slate-700 font-medium">{t(queueKeyMap[s.stage] || s.stage)}</span>
                <Badge variant={s.color}>{s.count}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-5">
          <h3 className="text-lg font-semibold text-slate-900">{t('gov.ngo_applications')}</h3>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                className="input-field pl-9 py-2 text-sm"
                placeholder={t('common.search')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="input-field py-2 text-sm w-auto"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="pending">{t('common.pending')}</option>
              <option value="active">{t('common.active')}</option>
              <option value="rejected">{t('common.rejected')}</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : ngos.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <Building2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>{t('gov.no_ngos')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  {['NGO Name', 'Location', 'Focus Areas', 'Registration', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="text-left py-3 px-3 text-slate-500 font-semibold">{t(tableHeaderMap[h] || h)}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {ngos.map((ngo) => (
                  <tr key={ngo._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-3">
                      <p className="font-semibold text-slate-900">{ngo.name}</p>
                      <p className="text-slate-500 text-xs">{ngo.email}</p>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1 text-slate-600">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{ngo.location?.city}, {ngo.location?.state}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1">
                        {ngo.focusAreas?.slice(0, 2).map((f) => (
                          <Badge key={f} variant="primary" className="text-xs">{f}</Badge>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-mono text-xs">{ngo.registrationNumber}</td>
                    <td className="py-3 px-3">
                      <Badge variant={ngo.status}>{ngo.status}</Badge>
                    </td>
                    <td className="py-3 px-3">
                      {ngo.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleVerify(ngo._id, 'active')}
                            disabled={verifying === ngo._id}
                            className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-700 hover:bg-emerald-100 transition-colors"
                            title={t('gov.approve')}
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleVerify(ngo._id, 'rejected')}
                            disabled={verifying === ngo._id}
                            className="p-1.5 rounded-lg bg-red-50 border border-red-100 text-red-700 hover:bg-red-100 transition-colors"
                            title={t('gov.reject')}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                      {ngo.status !== 'pending' && (
                        <button className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors" title={t('gov.view')}>
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
