import { useEffect, useState } from 'react';
import api from '../../services/api';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { BarChart3, Users, Building2, Globe, IndianRupee, TrendingUp, RefreshCw } from 'lucide-react';
import { StatsCard } from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useTranslation } from 'react-i18next';

const chartStyle = { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#0f172a' };
const COLORS = ['#1d4ed8', '#10b981', '#f59e0b', '#06b6d4', '#ec4899', '#8b5cf6'];

const monthlyTrend = [
  { month: 'Aug', ngos: 180, projects: 45, beneficiaries: 8200 },
  { month: 'Sep', ngos: 210, projects: 52, beneficiaries: 9800 },
  { month: 'Oct', ngos: 240, projects: 61, beneficiaries: 11500 },
  { month: 'Nov', ngos: 265, projects: 74, beneficiaries: 14200 },
  { month: 'Dec', ngos: 290, projects: 82, beneficiaries: 17800 },
  { month: 'Jan', ngos: 320, projects: 98, beneficiaries: 21000 },
  { month: 'Feb', ngos: 360, projects: 115, beneficiaries: 26500 },
];

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { t } = useTranslation();

  const load = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const res = await api.get('/analytics/overview');
      setData(res.data.data);
    } catch {
      setData({
        summary: { activeNGOs: 2400, totalProjects: 384, activeSchemes: 850, registeredUsers: 12500, beneficiariesServed: 45000, totalFunding: 125000000, totalBeneficiaries: 125000 },
        projectsByStatus: [
          { _id: 'active', count: 142 }, { _id: 'completed', count: 198 }, { _id: 'draft', count: 34 }, { _id: 'approved', count: 10 },
        ],
        ngosByState: [
          { _id: 'Maharashtra', count: 420 }, { _id: 'Karnataka', count: 310 }, { _id: 'Tamil Nadu', count: 280 },
          { _id: 'Uttar Pradesh', count: 250 }, { _id: 'Gujarat', count: 220 }, { _id: 'Rajasthan', count: 180 },
          { _id: 'Delhi', count: 165 }, { _id: 'West Bengal', count: 155 },
        ],
        schemesByCategory: [
          { _id: 'education', count: 145 }, { _id: 'health', count: 98 }, { _id: 'rural_development', count: 87 },
          { _id: 'women_empowerment', count: 76 }, { _id: 'skill_development', count: 65 }, { _id: 'other', count: 379 },
        ],
      });
    } finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => { load(); }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><LoadingSpinner size="lg" message={t('analytics_page.loading')} /></div>;

  const s = data?.summary || {};

  const categoryLabels = {
    education: t('schemes.category_education'),
    health: t('schemes.category_health'),
    women_empowerment: t('schemes.category_women_empowerment'),
    rural_development: t('schemes.category_rural_development'),
    skill_development: t('schemes.category_skill_development'),
    agriculture: t('schemes.category_agriculture'),
    environment: t('schemes.category_environment'),
    social_welfare: t('schemes.category_social_welfare'),
    housing: t('schemes.category_housing'),
    livelihood: t('schemes.category_livelihood'),
    children: t('schemes.category_children'),
    elderly: t('schemes.category_elderly'),
    disability: t('schemes.category_disability'),
    other: t('schemes.category_other'),
  };

  return (
    <div className="space-y-6 fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">{t('analytics_page.title')}</h1>
          <p className="text-slate-600 mt-1">{t('analytics_page.desc')}</p>
        </div>
        <button onClick={() => load(true)} disabled={refreshing} className="btn-secondary text-sm">
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} /> {t('common.refresh')}
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard label={t('analytics_page.metric_ngos')} value={s.activeNGOs?.toLocaleString('en-IN') || '—'} icon={Building2} color="indigo" change={8} />
        <StatsCard label={t('analytics_page.metric_projects')} value={s.totalProjects?.toLocaleString('en-IN') || '—'} icon={BarChart3} color="emerald" change={15} />
        <StatsCard label={t('analytics_page.metric_schemes')} value={s.activeSchemes?.toLocaleString('en-IN') || '—'} icon={Globe} color="amber" />
        <StatsCard label={t('analytics_page.metric_beneficiaries')} value={s.totalBeneficiaries ? (s.totalBeneficiaries / 1000).toFixed(1) + 'K' : '—'} icon={Users} color="violet" change={22} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100">
            <IndianRupee className="w-6 h-6 text-emerald-700" />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-semibold">{t('analytics_page.funding_tracked')}</p>
            <p className="text-2xl font-bold text-slate-900">₹{s.totalFunding ? (s.totalFunding / 10000000).toFixed(1) + ' Cr' : '—'}</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
            <Users className="w-6 h-6 text-blue-700" />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-semibold">{t('analytics_page.registered_users')}</p>
            <p className="text-2xl font-bold text-slate-900">{s.registeredUsers?.toLocaleString('en-IN') || '—'}</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 border border-amber-100">
            <TrendingUp className="w-6 h-6 text-amber-800" />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-semibold">{t('analytics_page.avg_impact')}</p>
            <p className="text-2xl font-bold text-slate-900">74 <span className="text-base text-slate-500">/100</span></p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-4">{t('analytics_page.growth_title')}</h2>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={monthlyTrend}>
            <defs>
              <linearGradient id="ngoGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1d4ed8" stopOpacity={0.3} /><stop offset="95%" stopColor="#1d4ed8" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="projGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} /><stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 12 }} />
            <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={chartStyle} />
            <Legend wrapperStyle={{ color: '#475569', fontSize: 12 }} />
            <Area type="monotone" dataKey="ngos" name={t('analytics_page.growth_ngos_legend')} stroke="#1d4ed8" fill="url(#ngoGrad)" strokeWidth={2} />
            <Area type="monotone" dataKey="projects" name={t('analytics_page.growth_projects_legend')} stroke="#10b981" fill="url(#projGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-4">{t('analytics_page.ngos_by_state')}</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={(data?.ngosByState || []).slice(0, 6)} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
              <XAxis type="number" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="_id" stroke="#64748b" tick={{ fontSize: 11 }} width={90} />
              <Tooltip contentStyle={chartStyle} />
              <Bar dataKey="count" name={t('analytics_page.growth_ngos_legend')} fill="#1d4ed8" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-4">{t('analytics_page.projects_by_status')}</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={data?.projectsByStatus || []} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="count" nameKey="_id">
                {(data?.projectsByStatus || []).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={chartStyle} formatter={(v, n) => [v, n]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-1 mt-2">
            {(data?.projectsByStatus || []).map((sItem, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ background: COLORS[i] }} />
                <span className="text-slate-500 font-semibold capitalize">{t('common.' + sItem._id) || sItem._id}</span>
                <span className="text-slate-900 font-bold ml-auto">{sItem.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-4">{t('analytics_page.schemes_by_category')}</h3>
          <div className="space-y-3">
            {(data?.schemesByCategory || []).slice(0, 6).map((cVal, i) => {
              const total = (data?.schemesByCategory || []).reduce((sum, x) => sum + x.count, 0);
              const pct = Math.round((cVal.count / total) * 100);
              return (
                <div key={i}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-500 font-semibold capitalize">{categoryLabels[cVal._id] || cVal._id?.replace('_', ' ')}</span>
                    <span className="text-slate-900 font-bold">{cVal.count}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: COLORS[i % COLORS.length] }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-4">{t('analytics_page.reached_title')}</h2>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={monthlyTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 12 }} />
            <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={chartStyle} formatter={(v) => [v.toLocaleString('en-IN'), t('analytics_page.reached_legend')]} />
            <Line type="monotone" dataKey="beneficiaries" stroke="#10b981" strokeWidth={2.5} dot={{ fill: '#10b981', r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
