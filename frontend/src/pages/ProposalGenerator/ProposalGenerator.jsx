import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generateProposal, clearProposal } from '../../store/slices/chatSlice';
import { Lightbulb, Sparkles, Download, Copy, RefreshCw, CheckCircle, MapPin, Users, Calendar, IndianRupee, Target, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const FOCUS_AREAS = ['Education', 'Health', 'Women Empowerment', 'Rural Development', 'Skill Development', 'Environment', 'Children', 'Livelihood', 'Agriculture', 'Social Welfare'];

export default function ProposalGenerator() {
  const dispatch = useDispatch();
  const { proposal, proposalLoading } = useSelector((s) => s.chat);
  const [form, setForm] = useState({ projectName: '', location: '', budget: '', targetGroup: '', duration: '', description: '', focusArea: '' });
  const [activeTab, setActiveTab] = useState('summary');
  const { t } = useTranslation();

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleGenerate = async (e) => {
    e.preventDefault();
    const result = await dispatch(generateProposal(form));
    if (generateProposal.fulfilled.match(result)) {
      toast.success('Proposal generated successfully!');
    } else {
      toast.error('Generation failed. Please try again.');
    }
  };

  const handleCopy = () => {
    const text = proposal?.proposal_text || Object.entries(proposal || {}).filter(([k]) => k !== 'title').map(([k, v]) => `## ${k.replace(/_/g, ' ').toUpperCase()}\n${Array.isArray(v) ? v.join('\n- ') : v}`).join('\n\n');
    navigator.clipboard.writeText(text);
    toast.success('Proposal copied to clipboard!');
  };

  const handleDownload = () => {
    const text = proposal?.proposal_text || 'Proposal content';
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${form.projectName || 'proposal'}_SevaAI.txt`;
    a.click();
  };

  const tabs = [
    { id: 'summary', label: t('doc.summary') },
    { id: 'objectives', label: t('proposal.tab_objectives') },
    { id: 'timeline', label: t('proposal.tab_timeline') },
    { id: 'impact', label: t('proposal.tab_impact') },
    { id: 'full', label: t('proposal.tab_full') },
  ];

  return (
    <div className="space-y-6 fade-in-up">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-display flex items-center gap-2">
          <Lightbulb className="w-7 h-7 text-amber-500" /> {t('proposal.title')}
        </h1>
        <p className="text-slate-600 mt-1">{t('proposal.desc')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <form onSubmit={handleGenerate} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
            <h2 className="text-base font-bold text-slate-900">{t('proposal.project_info')}</h2>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-700" /> {t('proposal.project_name')}
              </label>
              <input className="input-field" placeholder={t('proposal.placeholder_name')} value={form.projectName}
                onChange={(e) => set('projectName', e.target.value)} required id="prop-name" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-700" /> {t('proposal.location')}
                </label>
                <input className="input-field" placeholder={t('proposal.placeholder_location')} value={form.location}
                  onChange={(e) => set('location', e.target.value)} required id="prop-location" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <IndianRupee className="w-4 h-4 text-amber-600" /> {t('proposal.budget')}
                </label>
                <input className="input-field" placeholder={t('proposal.placeholder_budget')} type="number" value={form.budget}
                  onChange={(e) => set('budget', e.target.value)} required id="prop-budget" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-indigo-700" /> {t('proposal.target_group')}
                </label>
                <input className="input-field" placeholder={t('proposal.placeholder_target')} value={form.targetGroup}
                  onChange={(e) => set('targetGroup', e.target.value)} required id="prop-target" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-cyan-700" /> {t('proposal.duration')}
                </label>
                <input className="input-field" placeholder={t('proposal.placeholder_duration')} value={form.duration}
                  onChange={(e) => set('duration', e.target.value)} required id="prop-duration" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-pink-700" /> {t('proposal.focus_area')}
              </label>
              <div className="flex flex-wrap gap-2">
                {FOCUS_AREAS.map((f) => (
                  <button key={f} type="button" onClick={() => set('focusArea', f)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all
                      ${form.focusArea === f ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-white hover:text-slate-900'}`}>
                    {t('ngo.focus_area_' + f.toLowerCase().replace(' ', '_')) || f}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t('proposal.project_desc')}</label>
              <textarea className="input-field min-h-24 resize-none" placeholder={t('proposal.placeholder_desc')}
                value={form.description} onChange={(e) => set('description', e.target.value)} id="prop-desc" />
            </div>

            <div className="flex gap-3">
              <button type="submit" disabled={proposalLoading} className="btn-primary flex-1 justify-center py-3" id="generate-proposal-btn">
                {proposalLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t('proposal.generating')}
                  </span>
                ) : (
                  <span className="flex items-center gap-2"><Sparkles className="w-4 h-4" /> {t('proposal.generate')}</span>
                )}
              </button>
              {proposal && (
                <button type="button" onClick={() => dispatch(clearProposal())} className="btn-secondary py-3 px-4">
                  <RefreshCw className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>

          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mt-4 shadow-sm">
            <p className="text-sm font-bold text-amber-800 mb-2 flex items-center gap-1.5"><Lightbulb className="w-4 h-4" /> {t('proposal.tips_title')}</p>
            <ul className="space-y-1 text-xs text-slate-600 font-semibold">
              {[0, 1, 2, 3].map((idx) => (
                <li key={idx}>• {t('proposal.tip_' + idx)}</li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          {!proposal && !proposalLoading && (
            <div className="bg-white rounded-2xl border border-slate-200 h-full min-h-80 flex flex-col items-center justify-center text-center p-8 shadow-sm">
              <div className="w-20 h-20 rounded-3xl bg-amber-50 border border-amber-100 flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-10 h-10 text-amber-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-display mb-2">{t('proposal.ready_title')}</h3>
              <p className="text-slate-600 text-sm max-w-xs font-semibold">{t('proposal.ready_desc')}</p>
              <div className="flex flex-wrap gap-2 justify-center mt-5">
                {[0, 1, 2, 3, 4].map((idx) => (
                  <span key={idx} className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs border border-slate-200 font-semibold">{t('proposal.ready_item_' + idx)}</span>
                ))}
              </div>
            </div>
          )}

          {proposalLoading && (
            <div className="bg-white rounded-2xl border border-slate-200 h-full min-h-80 flex items-center justify-center shadow-sm">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-blue-700 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-white animate-pulse" />
                </div>
                <p className="text-slate-900 font-bold mb-1">{t('proposal.generating')}</p>
                <p className="text-slate-500 text-sm font-semibold">This may take 10–30 seconds</p>
                <div className="flex gap-1 justify-center mt-4">
                  {[0, 1, 2].map((i) => <div key={i} className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />)}
                </div>
              </div>
            </div>
          )}

          {proposal && !proposalLoading && (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-5 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="w-4 h-4 text-emerald-700" />
                    <p className="text-sm font-bold text-emerald-700">{t('proposal.output_title')}</p>
                  </div>
                  <p className="text-base font-bold text-slate-900">{proposal.title}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleCopy} className="btn-secondary text-sm py-2 px-3"><Copy className="w-4 h-4" /></button>
                  <button onClick={handleDownload} className="btn-secondary text-sm py-2 px-3"><Download className="w-4 h-4" /></button>
                </div>
              </div>

              <div className="flex overflow-x-auto border-b border-slate-200 px-4 gap-1 bg-slate-50">
                {tabs.map((tItem) => (
                  <button key={tItem.id} onClick={() => setActiveTab(tItem.id)}
                    className={`py-3 px-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap
                      ${activeTab === tItem.id ? 'border-blue-700 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
                    {tItem.label}
                  </button>
                ))}
              </div>

              <div className="p-5 max-h-[500px] overflow-y-auto">
                {activeTab === 'summary' && <p className="text-slate-700 text-sm leading-relaxed font-medium">{proposal.executive_summary}</p>}
                {activeTab === 'objectives' && (
                  <ul className="space-y-2">
                    {(Array.isArray(proposal.objectives) ? proposal.objectives : [proposal.objectives]).map((o, i) => (
                      <li key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="w-6 h-6 rounded-full bg-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-xs text-white font-bold">{i + 1}</span>
                        </div>
                        <span className="text-sm text-slate-700 font-medium">{o}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {activeTab === 'timeline' && (
                  <div className="space-y-4">
                    <div><p className="text-xs font-bold text-slate-400 uppercase mb-2">{t('proposal.timeline')}</p><p className="text-sm text-slate-700 font-medium leading-relaxed">{proposal.timeline}</p></div>
                    <div><p className="text-xs font-bold text-slate-400 uppercase mb-2">{t('proposal.budget_breakdown')}</p><p className="text-sm text-slate-700 font-medium leading-relaxed">{proposal.budget_breakdown}</p></div>
                  </div>
                )}
                {activeTab === 'impact' && (
                  <div className="space-y-4">
                    <div><p className="text-xs font-bold text-slate-400 uppercase mb-2">{t('proposal.expected_impact')}</p><p className="text-sm text-slate-700 font-medium leading-relaxed">{proposal.expected_impact}</p></div>
                    <div><p className="text-xs font-bold text-slate-400 uppercase mb-2">{t('proposal.monitoring_evaluation')}</p><p className="text-sm text-slate-700 font-medium leading-relaxed">{proposal.monitoring_strategy}</p></div>
                  </div>
                )}
                {activeTab === 'full' && (
                  <div className="prose prose-slate prose-sm max-w-none text-slate-700 font-medium">
                    <ReactMarkdown>{proposal.proposal_text || 'Full proposal text not available.'}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
