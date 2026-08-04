import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchScheme } from '../../store/slices/schemeSlice';
import { ArrowLeft, Globe, IndianRupee, FileText, CheckCircle, Calendar, Link2, Sparkles } from 'lucide-react';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function SchemeDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedScheme: scheme, loading } = useSelector((s) => s.schemes);

  useEffect(() => { dispatch(fetchScheme(id)); }, [dispatch, id]);

  if (loading || !scheme) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <LoadingSpinner size="lg" message="Loading scheme details..." />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <Link to="/schemes" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm mb-6 transition-colors font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Schemes
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="primary" className="capitalize">{scheme.level} Government</Badge>
                <Badge variant="success">{scheme.category?.replace('_', ' ')}</Badge>
                {scheme.deadline?.isOngoing && <Badge variant="active">Ongoing</Badge>}
              </div>
              <h1 className="text-2xl font-bold font-display text-slate-900 mb-3">{scheme.name}</h1>
              <p className="text-slate-500 text-sm font-medium mb-4">{scheme.department} {scheme.ministry && `• ${scheme.ministry}`}</p>
              <p className="text-slate-600 leading-relaxed font-medium">{scheme.description}</p>
            </div>

            {scheme.eligibility && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-600" /> Eligibility</h2>
                <p className="text-slate-600 mb-3 font-medium">{scheme.eligibility.description}</p>
                {scheme.eligibility.targetGroup?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {scheme.eligibility.targetGroup.map((g) => <Badge key={g} variant="info" className="capitalize">{g.replace('_', ' ')}</Badge>)}
                  </div>
                )}
                {scheme.eligibility.ngoEligible && (
                  <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-sm flex items-center gap-2 font-medium">
                    <CheckCircle className="w-4 h-4 text-emerald-700" /> NGOs are eligible to apply for this scheme
                  </div>
                )}
              </div>
            )}

            {scheme.requiredDocuments?.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-blue-700" /> Required Documents</h2>
                <ul className="space-y-2">
                  {scheme.requiredDocuments.map((doc, i) => (
                    <li key={i} className="flex items-center gap-2 text-slate-600 text-sm font-medium">
                      <div className="w-5 h-5 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                        <span className="text-xs text-blue-700 font-bold">{i + 1}</span>
                      </div>
                      {doc}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {scheme.applicationProcess && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Application Process</h2>
                <p className="text-slate-600 mb-4 font-medium">{scheme.applicationProcess.description}</p>
                {scheme.applicationProcess.steps?.length > 0 && (
                  <ol className="space-y-3">
                    {scheme.applicationProcess.steps.map((step, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-xs text-white font-bold">{i + 1}</span>
                        </div>
                        <span className="text-slate-600 text-sm font-medium">{step}</span>
                      </li>
                    ))}
                  </ol>
                )}
                {scheme.applicationProcess.onlineUrl && (
                  <a href={scheme.applicationProcess.onlineUrl} target="_blank" rel="noopener noreferrer"
                    className="btn-primary mt-4 inline-flex text-sm">
                    <Link2 className="w-4 h-4" /> Apply Online
                  </a>
                )}
              </div>
            )}
          </div>

          <div className="space-y-5">
            {scheme.benefits && (
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 mb-3">Benefits</h3>
                {scheme.benefits.financialAmount > 0 && (
                  <div className="flex items-center gap-2 text-emerald-700 mb-2">
                    <IndianRupee className="w-5 h-5" />
                    <span className="text-xl font-extrabold">₹{scheme.benefits.financialAmount.toLocaleString('en-IN')}</span>
                    <span className="text-sm text-slate-500 capitalize">({scheme.benefits.financialType})</span>
                  </div>
                )}
                <p className="text-slate-600 text-sm font-medium">{scheme.benefits.description}</p>
                {scheme.benefits.nonFinancialBenefits?.length > 0 && (
                  <ul className="mt-3 space-y-1.5">
                    {scheme.benefits.nonFinancialBenefits.map((b, i) => (
                      <li key={i} className="text-sm text-slate-600 flex items-center gap-2 font-medium">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2"><Calendar className="w-4 h-4 text-blue-700" /> Timeline</h3>
              {scheme.deadline?.isOngoing ? (
                <Badge variant="active">Ongoing — Applications Open</Badge>
              ) : (
                <div className="space-y-1 text-sm text-slate-500 font-medium">
                  {scheme.deadline?.startDate && <p>Start: {new Date(scheme.deadline.startDate).toLocaleDateString('en-IN')}</p>}
                  {scheme.deadline?.endDate && <p>End: {new Date(scheme.deadline.endDate).toLocaleDateString('en-IN')}</p>}
                </div>
              )}
            </div>

            {scheme.tags?.length > 0 && (
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-1.5">
                  {scheme.tags.map((t) => <span key={t} className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">{t}</span>)}
                </div>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 shadow-sm">
              <Sparkles className="w-6 h-6 text-blue-700 mb-2" />
              <h3 className="text-base font-bold text-slate-900 mb-1">Need Help Applying?</h3>
              <p className="text-slate-600 text-xs mb-3 font-semibold">Ask SevaAI to guide you through the application process, check eligibility, and prepare documents.</p>
              <Link to={`/chat`} className="btn-primary w-full justify-center text-sm py-2">
                <Sparkles className="w-4 h-4" /> Ask AI Assistant
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
