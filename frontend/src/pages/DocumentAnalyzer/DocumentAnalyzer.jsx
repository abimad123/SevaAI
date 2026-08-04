import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import api from '../../services/api';
import { Upload, FileText, Sparkles, CheckCircle, AlertTriangle, Info, X, RefreshCw } from 'lucide-react';
import Badge from '../../components/common/Badge';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export default function DocumentAnalyzer() {
  const [files, setFiles] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const { t } = useTranslation();

  const loadDocuments = async () => {
    setLoadingDocs(true);
    try {
      const res = await api.get('/documents');
      setDocuments(res.data.data);
    } catch {
      toast.error('Failed to load documents');
    } finally {
      setLoadingDocs(false);
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const dropped = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...dropped]);
  }, []);

  const handleFileSelect = (e) => {
    setFiles((prev) => [...prev, ...Array.from(e.target.files)]);
  };

  const removeFile = (i) => setFiles((prev) => prev.filter((_, idx) => idx !== i));

  const handleUpload = async () => {
    if (!files.length) return;
    setUploading(true);
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', file.name);
      formData.append('type', guessType(file.name));
      try {
        const res = await api.post('/documents/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setDocuments((prev) => [res.data.data, ...prev]);
        toast.success(`${file.name} uploaded successfully`);
      } catch {
        toast.error(`Failed to upload ${file.name}`);
      }
    }
    setFiles([]);
    setUploading(false);
    loadDocuments();
  };

  const triggerReanalyze = async (docId) => {
    try {
      await api.post(`/documents/${docId}/analyze`);
      toast.success('AI analysis triggered. Refresh in a moment.');
    } catch {
      toast.error('Failed to trigger analysis');
    }
  };

  function guessType(name) {
    const lower = name.toLowerCase();
    if (lower.includes('certificate') || lower.includes('reg')) return 'registration_certificate';
    if (lower.includes('annual') || lower.includes('report')) return 'project_report';
    if (lower.includes('financial') || lower.includes('audit')) return 'financial_report';
    return 'other';
  }

  return (
    <div className="space-y-6 fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">{t('doc.title')}</h1>
          <p className="text-slate-600 mt-1">{t('doc.desc')}</p>
        </div>
        <button onClick={loadDocuments} className="btn-secondary text-sm" id="doc-refresh-btn">
          <RefreshCw className="w-4 h-4" /> {t('doc.refresh')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer
              ${dragging ? 'border-blue-600 bg-blue-50/50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'}`}
          >
            <input type="file" multiple accept=".pdf,.doc,.docx,.txt,.xlsx,.csv,.png,.jpg"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleFileSelect} id="doc-upload" />
            <div className="pointer-events-none">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all
                ${dragging ? 'bg-blue-700 shadow-md' : 'bg-slate-100 border border-slate-200'}`}>
                <Upload className={`w-8 h-8 ${dragging ? 'text-white' : 'text-slate-400'}`} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">{dragging ? t('doc.drag_drop') : t('doc.drag_drop')}</h3>
              <p className="text-slate-600 text-sm mb-1 font-semibold">{t('doc.browse')}</p>
              <p className="text-xs text-slate-500">{t('doc.info')}</p>
            </div>
          </div>

          {files.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-2">
              <p className="text-sm font-bold text-slate-900 mb-3">{files.length} {t('doc.ready')}</p>
              {files.map((f, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <FileText className="w-4 h-4 text-blue-700 shrink-0" />
                  <span className="text-sm text-slate-700 flex-1 truncate font-semibold">{f.name}</span>
                  <span className="text-xs text-slate-500 shrink-0 font-semibold">{(f.size / 1024).toFixed(0)}KB</span>
                  <button onClick={() => removeFile(i)} className="text-slate-400 hover:text-red-600 transition-colors shrink-0">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button onClick={handleUpload} disabled={uploading} className="btn-primary w-full justify-center mt-2 py-2.5" id="doc-upload-btn">
                {uploading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t('doc.uploading')}
                  </span>
                ) : (
                  <span className="flex items-center gap-2"><Upload className="w-4 h-4" /> {t('doc.upload_analyze')}</span>
                )}
              </button>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-blue-700" />
              <h3 className="text-base font-bold text-slate-900">{t('doc.includes')}</h3>
            </div>
            {[0, 1, 2, 3, 4].map((idx) => (
              <div key={idx} className="flex items-start gap-2 py-2 border-b border-slate-200 last:border-0">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-slate-950">{t('doc.incl_title_' + idx)}</p>
                  <p className="text-xs text-slate-500 font-semibold">{t('doc.incl_desc_' + idx)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {selectedDoc ? (
            <AnalysisPanel doc={selectedDoc} onClose={() => setSelectedDoc(null)} onReanalyze={triggerReanalyze} />
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm text-center h-64 flex flex-col items-center justify-center">
              <Sparkles className="w-10 h-10 text-slate-300 mb-3" />
              <p className="text-slate-600 font-medium">{t('doc.placeholder_select')}</p>
            </div>
          )}

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-3">{t('doc.your_documents')}</h3>
            {loadingDocs ? (
              <div className="flex justify-center py-4"><div className="w-6 h-6 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" /></div>
            ) : documents.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-4 font-semibold">{t('doc.no_documents')}</p>
            ) : (
              <div className="space-y-2">
                {documents.map((doc) => (
                  <button key={doc._id} onClick={() => setSelectedDoc(doc)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all
                      ${selectedDoc?._id === doc._id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-slate-50 border border-transparent'}`}>
                    <FileText className="w-4 h-4 text-blue-700 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">{doc.name}</p>
                      <p className="text-xs text-slate-500 font-semibold">{new Date(doc.createdAt).toLocaleDateString('en-IN')}</p>
                    </div>
                    {doc.aiAnalysis?.isAnalyzed ? (
                      <Badge variant="success" className="text-xs shrink-0">{t('doc.status_analyzed')}</Badge>
                    ) : (
                      <Badge variant="warning" className="text-xs shrink-0">{t('doc.status_pending')}</Badge>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function AnalysisPanel({ doc, onClose, onReanalyze }) {
  const a = doc.aiAnalysis;
  const { t } = useTranslation();
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-700" />
          <h3 className="text-base font-bold text-slate-900">{t('doc.ai_analysis')}</h3>
          {a?.isAnalyzed && <Badge variant="success" className="text-xs">{t('doc.complete')}</Badge>}
        </div>
        <div className="flex gap-2">
          <button onClick={() => onReanalyze(doc._id)} className="p-1.5 text-slate-400 hover:text-slate-800" title="Re-analyze">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-800"><X className="w-4 h-4" /></button>
        </div>
      </div>

      <h4 className="text-sm font-bold text-slate-950 mb-1 truncate">{doc.name}</h4>
      {a?.confidence !== undefined && (
        <p className="text-xs text-slate-500 mb-4 font-semibold">{t('doc.confidence')}: <span className={a.confidence > 0.6 ? 'text-emerald-700' : 'text-amber-800'}>{Math.round(a.confidence * 100)}%</span></p>
      )}

      {!a?.isAnalyzed ? (
        <div className="text-center py-6 text-slate-500 text-sm font-semibold">
          <div className="w-6 h-6 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mx-auto mb-2" />
          {t('doc.in_progress')}
        </div>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
          {a.summary && (
            <section>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1"><Info className="w-3.5 h-3.5" /> {t('doc.summary')}</p>
              <p className="text-sm text-slate-700 leading-relaxed font-semibold">{a.summary}</p>
            </section>
          )}
          {a.keyInformation?.length > 0 && (
            <section>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> {t('doc.key_info')}</p>
              <div className="space-y-1.5">
                {a.keyInformation.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-xs font-bold text-blue-700 shrink-0">{item.key}:</span>
                    <span className="text-xs text-slate-700 font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
          {a.missingInformation?.length > 0 && (
            <section>
              <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> {t('doc.missing_info')}</p>
              <ul className="space-y-1">
                {a.missingInformation.map((m, i) => <li key={i} className="text-xs text-slate-700 flex items-center gap-2 font-medium"><span className="w-1.5 h-1.5 rounded-full bg-amber-600" />{m}</li>)}
              </ul>
            </section>
          )}
          {a.complianceIssues?.length > 0 && (
            <section>
              <p className="text-xs font-bold text-red-800 uppercase tracking-wider mb-2 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> {t('doc.compliance')}</p>
              <ul className="space-y-1">
                {a.complianceIssues.map((c, i) => <li key={i} className="text-xs text-red-800 flex items-center gap-2 font-medium"><span className="w-1.5 h-1.5 rounded-full bg-red-600" />{c}</li>)}
              </ul>
            </section>
          )}
          {a.suggestions?.length > 0 && (
            <section>
              <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">{t('doc.suggestions')}</p>
              <ul className="space-y-1.5">
                {a.suggestions.map((s, i) => <li key={i} className="text-xs text-slate-700 flex items-start gap-2 font-semibold"><CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />{s}</li>)}
              </ul>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
