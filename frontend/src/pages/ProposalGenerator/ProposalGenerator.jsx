import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generateProposal, clearProposal } from '../../store/slices/chatSlice';
import { Lightbulb, Sparkles, Download, Copy, RefreshCw, CheckCircle, MapPin, Users, Calendar, IndianRupee, Target, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';

const FOCUS_AREAS = ['Education', 'Health', 'Women Empowerment', 'Rural Development', 'Skill Development', 'Environment', 'Children', 'Livelihood', 'Agriculture', 'Social Welfare'];

export default function ProposalGenerator() {
  const dispatch = useDispatch();
  const { proposal, proposalLoading } = useSelector((s) => s.chat);
  const [form, setForm] = useState({ projectName: '', location: '', budget: '', targetGroup: '', duration: '', description: '', focusArea: '' });
  const [activeTab, setActiveTab] = useState('summary');

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleGenerate = async (e) => {
    e.preventDefault();
    const result = await dispatch(generateProposal(form));
    if (generateProposal.fulfilled.match(result)) toast.success('Proposal generated successfully!');
    else toast.error('Generation failed. Please try again.');
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
    { id: 'summary', label: 'Summary' },
    { id: 'objectives', label: 'Objectives' },
    { id: 'timeline', label: 'Timeline & Budget' },
    { id: 'impact', label: 'Impact & M&E' },
    { id: 'full', label: 'Full Proposal' },
  ];

  return (
    <div className="space-y-6 fade-in-up">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-display flex items-center gap-2">
          <Lightbulb className="w-7 h-7 text-amber-500" /> AI Proposal Generator
        </h1>
        <p className="text-slate-600 mt-1">Enter project details — AI generates a complete, professional NGO project proposal</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <form onSubmit={handleGenerate} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
            <h2 className="text-base font-bold text-slate-900">Project Information</h2>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-700" /> Project Name *
              </label>
              <input className="input-field" placeholder="e.g. Digital Literacy Initiative for Rural Youth" value={form.projectName}
                onChange={(e) => set('projectName', e.target.value)} required id="prop-name" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-700" /> Location *
                </label>
                <input className="input-field" placeholder="District, State" value={form.location}
                  onChange={(e) => set('location', e.target.value)} required id="prop-location" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <IndianRupee className="w-4 h-4 text-amber-600" /> Budget (₹) *
                </label>
                <input className="input-field" placeholder="e.g. 500000" type="number" value={form.budget}
                  onChange={(e) => set('budget', e.target.value)} required id="prop-budget" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-indigo-700" /> Target Group *
                </label>
                <input className="input-field" placeholder="e.g. Rural women aged 18-35" value={form.targetGroup}
                  onChange={(e) => set('targetGroup', e.target.value)} required id="prop-target" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-cyan-700" /> Duration *
                </label>
                <input className="input-field" placeholder="e.g. 12 months" value={form.duration}
                  onChange={(e) => set('duration', e.target.value)} required id="prop-duration" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-pink-700" /> Focus Area
              </label>
              <div className="flex flex-wrap gap-2">
                {FOCUS_AREAS.map((f) => (
                  <button key={f} type="button" onClick={() => set('focusArea', f)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all
                      ${form.focusArea === f ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-white hover:text-slate-900'}`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Project Description (Optional)</label>
              <textarea className="input-field min-h-24 resize-none" placeholder="Brief description of the project goals and approach..."
                value={form.description} onChange={(e) => set('description', e.target.value)} id="prop-desc" />
            </div>

            <div className="flex gap-3">
              <button type="submit" disabled={proposalLoading} className="btn-primary flex-1 justify-center py-3" id="generate-proposal-btn">
                {proposalLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    AI is writing your proposal...
                  </span>
                ) : (
                  <span className="flex items-center gap-2"><Sparkles className="w-4 h-4" /> Generate Proposal</span>
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
            <p className="text-sm font-bold text-amber-800 mb-2 flex items-center gap-1.5"><Lightbulb className="w-4 h-4" /> Tips for a Better Proposal</p>
            <ul className="space-y-1 text-xs text-slate-600 font-semibold">
              <li>• Be specific about the target group and geographic area</li>
              <li>• Include a realistic budget figure</li>
              <li>• Mention the social problem you are addressing</li>
              <li>• Select a focus area for more targeted content</li>
            </ul>
          </div>
        </div>

        <div>
          {!proposal && !proposalLoading && (
            <div className="bg-white rounded-2xl border border-slate-200 h-full min-h-80 flex flex-col items-center justify-center text-center p-8 shadow-sm">
              <div className="w-20 h-20 rounded-3xl bg-amber-50 border border-amber-100 flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-10 h-10 text-amber-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-display mb-2">Ready to Generate</h3>
              <p className="text-slate-600 text-sm max-w-xs font-semibold">Fill in the project details and click Generate. SevaAI will create a complete professional proposal in seconds.</p>
              <div className="flex flex-wrap gap-2 justify-center mt-5">
                {['Executive Summary', 'Objectives', 'Budget Breakdown', 'Impact Metrics', 'M&E Strategy'].map((f) => (
                  <span key={f} className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs border border-slate-200 font-semibold">{f}</span>
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
                <p className="text-slate-900 font-bold mb-1">AI is crafting your proposal...</p>
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
                    <p className="text-sm font-bold text-emerald-700">Proposal Generated!</p>
                  </div>
                  <p className="text-base font-bold text-slate-900">{proposal.title}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleCopy} className="btn-secondary text-sm py-2 px-3"><Copy className="w-4 h-4" /></button>
                  <button onClick={handleDownload} className="btn-secondary text-sm py-2 px-3"><Download className="w-4 h-4" /></button>
                </div>
              </div>

              <div className="flex overflow-x-auto border-b border-slate-200 px-4 gap-1 bg-slate-50">
                {tabs.map((t) => (
                  <button key={t.id} onClick={() => setActiveTab(t.id)}
                    className={`py-3 px-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap
                      ${activeTab === t.id ? 'border-blue-700 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
                    {t.label}
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
                    <div><p className="text-xs font-bold text-slate-400 uppercase mb-2">Timeline</p><p className="text-sm text-slate-700 font-medium leading-relaxed">{proposal.timeline}</p></div>
                    <div><p className="text-xs font-bold text-slate-400 uppercase mb-2">Budget Breakdown</p><p className="text-sm text-slate-700 font-medium leading-relaxed">{proposal.budget_breakdown}</p></div>
                  </div>
                )}
                {activeTab === 'impact' && (
                  <div className="space-y-4">
                    <div><p className="text-xs font-bold text-slate-400 uppercase mb-2">Expected Impact</p><p className="text-sm text-slate-700 font-medium leading-relaxed">{proposal.expected_impact}</p></div>
                    <div><p className="text-xs font-bold text-slate-400 uppercase mb-2">Monitoring & Evaluation</p><p className="text-sm text-slate-700 font-medium leading-relaxed">{proposal.monitoring_strategy}</p></div>
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
