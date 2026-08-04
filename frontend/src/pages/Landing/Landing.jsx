import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Users, Building2, Globe, Shield, BarChart3, MessageSquare, FileText, Lightbulb, ChevronRight, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const stats = [
  { label: 'Active NGOs Partnered', value: '2,400+' },
  { label: 'Government Schemes Indexed', value: '850+' },
  { label: 'Beneficiaries Served', value: '1.2M+' },
  { label: 'States & UTs Covered', value: '28' },
];

const features = [
  { icon: MessageSquare, title: 'AI NGO Assistant', desc: 'Natural language interface answering queries regarding schemes, compliance, and funding matching with citations.', color: 'blue' },
  { icon: Globe, title: 'Scheme Intelligence', desc: 'Centralized database of government schemes with smart recommendations matching your NGO profile.', color: 'blue' },
  { icon: Building2, title: 'NGO Profile & Verification', desc: 'Standardized profiles with official tracking, verification pipelines, and verified audit histories.', color: 'blue' },
  { icon: FileText, title: 'Compliance Document Analyzer', desc: 'Upload documents for automated validation checks, regulatory compliance analysis, and guidance.', color: 'blue' },
  { icon: Lightbulb, title: 'Proposal Generator', desc: 'Generate complete, formatted project proposals including budget allocations and target impact metrics.', color: 'blue' },
  { icon: BarChart3, title: 'Impact Analytics', desc: 'Real-time indicators showing funding status, execution milestones, and verified social progress audits.', color: 'blue' },
];

const stakeholders = [
  { icon: Building2, label: 'NGO Admins', desc: 'Maintain credentials, search schemes, apply for support, and write proposals.' },
  { icon: Shield, label: 'Government Officers', desc: 'Review submissions, verify registration status, and analyze district-level metrics.' },
  { icon: Users, label: 'Volunteers', desc: 'Browse active civic projects, submit applications, and report local progress.' },
  { icon: Globe, label: 'Citizens', desc: 'Search available welfare programs, locate support systems, and ask questions.' },
];

export default function Landing() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased font-sans">
      <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl font-display text-slate-900">SevaAI</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-slate-600 font-medium">
            <a href="#features" className="hover:text-blue-700 transition-colors">{t('landing.nav_features')}</a>
            <a href="#roles" className="hover:text-blue-700 transition-colors">{t('landing.nav_roles')}</a>
            <a href="#stats" className="hover:text-blue-700 transition-colors">{t('landing.nav_impact')}</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-slate-700 hover:text-slate-900 font-medium text-sm px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors">{t('landing.nav_signin')}</Link>
            <Link to="/register" className="bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm px-5 py-2 rounded-lg shadow-sm transition-colors">{t('landing.cta_get_started')}</Link>
          </div>
        </div>
      </nav>

      <section className="relative pt-32 pb-20 px-6 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-800 text-sm font-semibold mb-8">
            <Sparkles className="w-4 h-4 text-blue-700" />
            {t('landing.hero_badge')}
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold font-display leading-tight text-slate-900 tracking-tight mb-6">
            {t('landing.hero_title')}
            <span className="block text-blue-700">{t('landing.hero_title_span')}</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed">
            {t('landing.hero_desc')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="bg-blue-700 hover:bg-blue-800 text-white font-bold text-base px-8 py-3.5 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2">
              {t('landing.cta_get_started')} <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/schemes" className="border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 font-semibold text-base px-8 py-3.5 rounded-lg shadow-sm transition-all flex items-center gap-2">
              {t('landing.cta_browse_schemes')} <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="mt-16 relative">
            <div className="bg-slate-100 rounded-2xl p-2 border border-slate-200 max-w-4xl mx-auto shadow-xl">
              <div className="bg-white rounded-xl overflow-hidden border border-slate-200">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-200 bg-slate-50">
                  <div className="w-3 h-3 rounded-full bg-slate-300" />
                  <div className="w-3 h-3 rounded-full bg-slate-300" />
                  <div className="w-3 h-3 rounded-full bg-slate-300" />
                  <div className="flex-1 text-center text-xs text-slate-500 font-mono">sevaai.gov.in</div>
                </div>
                
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                  <div className="space-y-1.5 md:border-r md:border-slate-200 md:pr-6">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">{t('landing.dashboard_nav')}</div>
                    <div className="px-3 py-2 rounded-lg text-sm bg-blue-50 text-blue-800 font-semibold">{t('landing.dashboard_overview')}</div>
                    <div className="px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 font-medium">{t('landing.dashboard_ai_chat')}</div>
                    <div className="px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 font-medium">{t('landing.dashboard_welfare')}</div>
                    <div className="px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 font-medium">{t('landing.dashboard_doc')}</div>
                    <div className="px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 font-medium">{t('landing.dashboard_impact')}</div>
                  </div>
                  
                  <div className="md:col-span-2 space-y-4">
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-500">{t('landing.ai_session')}</span>
                        <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-medium">{t('landing.verified_source')}</span>
                      </div>
                      <div className="space-y-3">
                        <div className="bg-blue-600 text-white rounded-lg p-3 text-sm max-w-xs ml-auto shadow-sm">
                          {t('landing.ai_user_msg')}
                        </div>
                        <div className="bg-white border border-slate-200 text-slate-700 rounded-lg p-3 text-sm max-w-md shadow-sm space-y-2">
                          <p>{t('landing.ai_resp_msg')}</p>
                          <div className="flex gap-2">
                            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200 font-medium">{t('landing.sec_4_guidelines')}</span>
                            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200 font-medium">{t('landing.min_education')}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{t('landing.ngo_verification')}</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{t('landing.ngo_verified')}</p>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{t('landing.social_impact_rating')}</p>
                        <p className="text-2xl font-bold text-blue-700 mt-1">82 / 100</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="stats" className="py-16 px-6 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-3xl md:text-4xl font-extrabold text-blue-700 font-display">{s.value}</p>
              <p className="text-slate-600 text-sm font-semibold mt-2">{t('landing.stat_label_' + i)}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              {t('landing.features_title')}
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              {t('landing.features_desc')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{t('landing.feature_title_' + i)}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{t('landing.feature_desc_' + i)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="roles" className="py-24 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              {t('landing.roles_title')}
            </h2>
            <p className="text-slate-600 text-lg">
              {t('landing.roles_desc')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stakeholders.map((r, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-blue-700 flex items-center justify-center mb-4">
                  <r.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{t('landing.role_title_' + i)}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{t('landing.role_desc_' + i)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-800 text-sm font-semibold mb-6">
            <Shield className="w-4 h-4 text-emerald-700" />
            {t('landing.compliance_badge')}
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-6">{t('landing.compliance_title')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[0, 1, 2, 3].map((idx) => (
              <div key={idx} className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col items-center gap-2">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
                <span className="text-sm font-semibold text-slate-700">{t('landing.compliance_item_' + idx)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-slate-50 border-t border-slate-200">
        <div className="max-w-3xl mx-auto text-center bg-white border border-slate-200 rounded-3xl p-12 shadow-sm">
          <Sparkles className="w-12 h-12 text-blue-700 mx-auto mb-4" />
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-4">{t('landing.infra_title')}</h2>
          <p className="text-slate-600 mb-8 max-w-xl mx-auto leading-relaxed">
            {t('landing.infra_desc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="bg-blue-700 hover:bg-blue-800 text-white font-bold text-base px-8 py-3.5 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2">
              {t('landing.infra_create')} <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/login" className="border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 font-semibold text-base px-8 py-3.5 rounded-lg shadow-sm transition-all flex items-center justify-center">{t('landing.infra_signin')}</Link>
          </div>
        </div>
      </section>

      <footer className="py-12 px-6 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-700 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-slate-900 font-display">SevaAI</span>
            <span className="text-slate-500 text-sm ml-2">{t('landing.footer_rights')}</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-500 font-medium">
            <a href="#" className="hover:text-blue-700 transition-colors">{t('landing.privacy')}</a>
            <a href="#" className="hover:text-blue-700 transition-colors">{t('landing.terms')}</a>
            <Link to="/schemes" className="hover:text-blue-700 transition-colors">{t('landing.welfare_db')}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
