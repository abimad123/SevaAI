import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchMyNGO } from '../../store/slices/ngoSlice';
import { BarChart3, FileText, MessageSquare, Lightbulb, Building2, Users, CheckCircle, Clock, TrendingUp, ArrowRight, Plus } from 'lucide-react';
import { StatsCard } from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { useTranslation } from 'react-i18next';

const monthlyData = [
  { month: 'Jan', beneficiaries: 120, budget: 150000 },
  { month: 'Feb', beneficiaries: 180, budget: 200000 },
  { month: 'Mar', beneficiaries: 240, budget: 180000 },
  { month: 'Apr', beneficiaries: 310, budget: 250000 },
  { month: 'May', beneficiaries: 280, budget: 220000 },
  { month: 'Jun', beneficiaries: 390, budget: 300000 },
  { month: 'Jul', beneficiaries: 450, budget: 350000 },
];

const focusData = [
  { name: 'Education', value: 45 }, { name: 'Health', value: 25 },
  { name: 'Livelihood', value: 20 }, { name: 'Environment', value: 10 },
];
const COLORS = ['#1d4ed8', '#10b981', '#f59e0b', '#06b6d4'];
const chartTooltipStyle = { backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#0f172a' };

const quickActionMap = {
  'Ask AI Assistant': 'sidebar.ai_assistant',
  'Upload Document': 'ngo.upload_doc',
  'Generate Proposal': 'ngo.gen_proposal',
  'View Analytics': 'ngo.view_analytics',
  'Browse Schemes': 'ngo.browse_schemes'
};

export default function NGODashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { myNGO } = useSelector((s) => s.ngo);
  const { t } = useTranslation();

  useEffect(() => {
    if (user?.role === 'ngo_admin') dispatch(fetchMyNGO());
  }, [dispatch, user]);

  const hasNGO = !!myNGO;

  return (
    <div className="space-y-6 fade-in-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">
            {t('common.welcome')}, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-slate-500 mt-1">
            {hasNGO ? `${t('ngo.manage')} ${myNGO.name}` : t('ngo.complete_profile')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/chat" className="btn-primary text-sm">
            <MessageSquare className="w-4 h-4" /> {t('sidebar.ai_assistant')}
          </Link>
          {hasNGO && (
            <Link to="/proposal" className="btn-secondary text-sm">
              <Lightbulb className="w-4 h-4" /> {t('ngo.gen_proposal')}
            </Link>
          )}
        </div>
      </div>

      {!hasNGO && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6 text-blue-700" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-900 mb-1">{t('ngo.register_title')}</h3>
              <p className="text-slate-600 text-sm">{t('ngo.register_desc')}</p>
              <Link to="/ngo/profile" className="btn-primary text-sm mt-4 inline-flex">
                <Plus className="w-4 h-4" /> {t('ngo.register_btn')}
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard label={t('ngo.stats_beneficiaries')} value="780" icon={Users} color="indigo" change={12} />
        <StatsCard label={t('ngo.stats_active_projects')} value="3" icon={CheckCircle} color="emerald" change={50} />
        <StatsCard label={t('ngo.stats_budget')} value="₹9L" icon={TrendingUp} color="amber" change={8} />
        <StatsCard label={t('ngo.stats_impact')} value="82/100" icon={BarChart3} color="violet" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">{t('ngo.monthly_chart')}</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="benGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1d4ed8" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 12 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Area type="monotone" dataKey="beneficiaries" stroke="#1d4ed8" fill="url(#benGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">{t('ngo.focus_areas')}</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={focusData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3} dataKey="value">
                {focusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={chartTooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {focusData.map((d, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i] }} />
                  <span className="text-slate-500 font-medium">{t('ngo.focus_area_' + d.name.toLowerCase())}</span>
                </div>
                <span className="text-slate-900 font-semibold">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">{t('ngo.recent_projects')}</h3>
            <Link to="/dashboard/ngo" className="text-sm text-blue-700 hover:text-blue-800 font-semibold flex items-center gap-1">
              {t('ngo.view_all')} <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {[
              { name: 'Digital Learning Centers – Maharashtra', status: 'active', budget: '₹15L', progress: 60 },
              { name: 'Women Skill Development – Rajasthan', status: 'active', budget: '₹8L', progress: 25 },
              { name: 'Teacher Training Program 2023', status: 'completed', budget: '₹8L', progress: 100 },
            ].map((p, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-slate-900">{p.name}</p>
                  <Badge variant={p.status === 'active' ? 'active' : 'completed'}>{p.status}</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${p.progress}%` }} />
                  </div>
                  <span className="text-xs text-slate-500 font-semibold whitespace-nowrap">{p.progress}%</span>
                  <span className="text-xs text-slate-500 font-semibold whitespace-nowrap">{p.budget}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">{t('ngo.quick_actions')}</h3>
          <div className="space-y-3">
            {[
              { label: 'Ask AI Assistant', icon: MessageSquare, to: '/chat', color: 'text-blue-700 bg-blue-50' },
              { label: 'Upload Document', icon: FileText, to: '/documents', color: 'text-amber-700 bg-amber-50' },
              { label: 'Generate Proposal', icon: Lightbulb, to: '/proposal', color: 'text-emerald-700 bg-emerald-50' },
              { label: 'View Analytics', icon: BarChart3, to: '/analytics', color: 'text-indigo-700 bg-indigo-50' },
              { label: 'Browse Schemes', icon: TrendingUp, to: '/schemes', color: 'text-cyan-700 bg-cyan-50' },
            ].map((a, i) => (
              <Link key={i} to={a.to} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group border border-transparent hover:border-slate-200">
                <div className={`p-2 rounded-lg ${a.color}`}>
                  <a.icon className="w-4 h-4" />
                </div>
                <span className="text-sm text-slate-600 font-medium group-hover:text-slate-900 transition-colors">{t(quickActionMap[a.label] || a.label)}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 ml-auto transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
