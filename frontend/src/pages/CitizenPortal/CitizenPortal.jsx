import { Link } from 'react-router-dom';
import { Sparkles, Globe, MessageSquare, MapPin, ArrowRight, Phone, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const QUICK_LINKS = [
  { label: 'PM Poshan Shakti Nirman', category: 'Education', color: 'indigo' },
  { label: 'PM Awas Yojana', category: 'Housing', color: 'amber' },
  { label: 'MGNREGS', category: 'Employment', color: 'emerald' },
  { label: 'National Health Mission', category: 'Health', color: 'rose' },
  { label: 'Skill India (PMKVY)', category: 'Skills', color: 'cyan' },
  { label: 'POSHAN Abhiyaan', category: 'Nutrition', color: 'violet' },
];

const colorMap = {
  indigo: 'text-blue-700 bg-blue-50 border border-blue-100',
  amber: 'text-amber-800 bg-amber-50 border border-amber-100',
  emerald: 'text-emerald-700 bg-emerald-50 border border-emerald-100',
  rose: 'text-rose-700 bg-rose-50 border border-rose-100',
  cyan: 'text-cyan-700 bg-cyan-50 border border-cyan-100',
  violet: 'text-indigo-700 bg-indigo-50 border border-indigo-100',
};

export default function CitizenPortal() {
  const { t } = useTranslation();

  return (
    <div className="space-y-8 fade-in-up">
      <div className="relative rounded-3xl p-8 md:p-12 overflow-hidden text-center bg-blue-50/50 border border-blue-100 shadow-sm">
        <div className="absolute top-0 left-1/3 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm mb-5 font-semibold">
            <Heart className="w-4 h-4 text-rose-500 animate-pulse" /> {t('citizen.badge')}
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold font-display text-slate-900 mb-3">
            {t('citizen.hero_title')}
          </h1>
          <p className="text-slate-600 mb-8 max-w-xl mx-auto font-semibold">{t('citizen.hero_desc')}</p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/schemes" className="btn-primary py-3 px-6">
              <Globe className="w-5 h-5" /> {t('citizen.browse_schemes')}
            </Link>
            <Link to="/chat" className="btn-secondary py-3 px-6">
              <MessageSquare className="w-5 h-5" /> {t('citizen.ask_ai')}
            </Link>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-900 font-display mb-4">{t('citizen.our_services')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: Globe, title: t('citizen.service_schemes_title'), color: 'indigo',
              desc: t('citizen.service_schemes_desc'),
              action: t('citizen.service_schemes_action'), to: '/schemes',
            },
            {
              icon: MessageSquare, title: t('citizen.service_assistant_title'), color: 'emerald',
              desc: t('citizen.service_assistant_desc'),
              action: t('citizen.service_assistant_action'), to: '/chat',
            },
            {
              icon: MapPin, title: t('citizen.service_ngos_title'), color: 'amber',
              desc: t('citizen.service_ngos_desc'),
              action: t('citizen.service_ngos_action'), to: '/schemes',
            },
          ].map((s, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm card-hover flex flex-col">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colorMap[s.color]}`}>
                <s.icon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">{s.title}</h3>
              <p className="text-slate-600 text-sm flex-1 mb-4 leading-relaxed font-semibold">{s.desc}</p>
              <Link to={s.to} className="btn-secondary text-sm justify-center py-2">
                {s.action} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-900 font-display mb-4">{t('citizen.popular_schemes')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {QUICK_LINKS.map((s, i) => (
            <Link key={i} to="/schemes"
              className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${colorMap[s.color]} hover:scale-[1.02] shadow-sm`}>
              <Globe className="w-5 h-5 shrink-0" />
              <div>
                <p className="text-sm font-bold">{s.label}</p>
                <p className="text-xs font-semibold opacity-80 mt-0.5">{s.category}</p>
              </div>
              <ArrowRight className="w-4 h-4 ml-auto shrink-0" />
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-700 flex items-center justify-center shrink-0 shadow-sm">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900 mb-2">{t('citizen.hindi_support_title')}</h3>
            <p className="text-slate-600 text-sm mb-4 font-semibold">{t('citizen.hindi_support_desc')}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {[t('citizen.hindi_query_1'), t('citizen.hindi_query_2'), t('citizen.hindi_query_3')].map((q, i) => (
                <Link key={i} to="/chat" className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-600 hover:text-slate-900 hover:border-blue-500/40 hover:bg-slate-50 transition-all font-bold shadow-sm">
                  {q}
                </Link>
              ))}
            </div>
            <Link to="/chat" className="btn-primary text-sm">
              <MessageSquare className="w-4 h-4" /> {t('citizen.hindi_action')}
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2"><Phone className="w-5 h-5 text-emerald-700" /> {t('citizen.helplines')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { name: 'PM Kisan Samman', number: '1551' },
            { name: 'PM Awas Yojana', number: '1800-11-6163' },
            { name: 'Ayushman Bharat', number: '14555' },
            { name: 'Skill India', number: '1800-123-9626' },
          ].map((h, i) => (
            <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200 shadow-sm">
              <p className="text-xs text-slate-500 mb-1 font-semibold">{h.name}</p>
              <p className="text-base font-extrabold text-emerald-700">{h.number}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
