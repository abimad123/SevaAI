import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import api from '../../services/api';
import { Database, FileText, Trash2, RefreshCw, Upload, FileUp, Languages, MapPin, Tag } from 'lucide-react';
import toast from 'react-hot-toast';

export default function KnowledgeBase() {
  const { user } = useSelector((s) => s.auth);
  const [documents, setDocuments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [rebuilding, setRebuilding] = useState(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('General');
  const [state, setState] = useState('All');
  const [language, setLanguage] = useState('en');
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (user?.role === 'system_admin') {
      fetchDocuments();
      fetchStats();
    }
  }, [user]);

  if (user?.role !== 'system_admin') {
    return <Navigate to="/analytics" replace />;
  }

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/documents');
      setDocuments(response.data.data || []);
    } catch (err) {
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/statistics');
      setStats(response.data.data || null);
    } catch (err) {
      toast.error('Failed to load vector statistics');
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('category', category);
    formData.append('state', state);
    formData.append('language', language);

    setUploading(true);
    try {
      await api.post('/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Document uploaded and indexed successfully');
      setTitle('');
      setFile(null);
      fetchDocuments();
      fetchStats();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this document from the Knowledge Base and vector index?')) {
      return;
    }

    try {
      await api.delete(`/admin/documents/${id}`);
      toast.success('Document deleted successfully');
      fetchDocuments();
      fetchStats();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const handleRebuild = async () => {
    if (!window.confirm('Warning: This will clear the vector database and rebuild all document embeddings. Proceed?')) {
      return;
    }

    setRebuilding(true);
    try {
      const response = await api.post('/admin/rebuild');
      toast.success(`Embeddings rebuilt. Total chunks: ${response.data.count}`);
      fetchDocuments();
      fetchStats();
    } catch (err) {
      toast.error('Rebuilding failed');
    } finally {
      setRebuilding(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900">Knowledge Base Management</h1>
          <p className="text-slate-600 text-sm font-semibold">Upload and manage official reference documents for RAG vector search grounding</p>
        </div>
        <button
          onClick={handleRebuild}
          disabled={rebuilding || documents.length === 0}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-sm hover:shadow transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${rebuilding ? 'animate-spin' : ''}`} />
          Rebuild Vector Index
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2.5">
              <Database className="w-4 h-4 text-blue-600" /> Vector Database Statistics
            </h3>
            {stats ? (
              <div className="space-y-3">
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-xs text-slate-500 font-bold">Total Index Chunks</span>
                  <span className="text-sm font-bold text-slate-900">{stats.total_chunks}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-xs text-slate-500 font-bold">Documents Registered</span>
                  <span className="text-sm font-bold text-slate-900">{documents.length}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-xs text-slate-500 font-bold">Vector Collection</span>
                  <span className="text-xs font-semibold text-slate-800 font-mono truncate max-w-[150px]">{stats.collection_name}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-bold block mb-1">Local Storage Path</span>
                  <p className="text-[10px] font-semibold text-slate-700 font-mono bg-slate-50 p-1.5 rounded border border-slate-100 break-all">{stats.persist_directory}</p>
                </div>
              </div>
            ) : (
              <p className="text-slate-500 text-sm font-semibold">Loading stats...</p>
            )}
          </div>

          <form onSubmit={handleUpload} className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2.5">
              <Upload className="w-4 h-4 text-blue-600" /> Upload New Document
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-500 font-bold block mb-1">Custom Document Title</label>
                <input
                  type="text"
                  placeholder="e.g. Samagra Shiksha Guidelines 2024"
                  className="w-full text-sm font-semibold px-3 py-2 border border-slate-300 rounded-xl focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none bg-white text-slate-900"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-500 font-bold block mb-1">Category</label>
                  <select
                    className="w-full text-xs font-semibold px-2 py-2 border border-slate-300 rounded-xl focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none bg-white text-slate-900"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="General">General</option>
                    <option value="Education">Education</option>
                    <option value="Health">Health</option>
                    <option value="Livelihood">Livelihood</option>
                    <option value="Environment">Environment</option>
                    <option value="Social Welfare">Social Welfare</option>
                    <option value="Rural Development">Rural Development</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-500 font-bold block mb-1">Language</label>
                  <select
                    className="w-full text-xs font-semibold px-2 py-2 border border-slate-300 rounded-xl focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none bg-white text-slate-900"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-500 font-bold block mb-1">Target State Constraint</label>
                <input
                  type="text"
                  placeholder="e.g. Maharashtra or All"
                  className="w-full text-sm font-semibold px-3 py-2 border border-slate-300 rounded-xl focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none bg-white text-slate-900"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs text-slate-500 font-bold block mb-1">Upload File (PDF, DOCX, TXT)</label>
                <div className="relative border border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors">
                  <input
                    type="file"
                    accept=".pdf,.docx,.txt"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                  />
                  <FileUp className="w-8 h-8 text-slate-400 mx-auto mb-1" />
                  <span className="text-xs text-slate-600 block font-semibold truncate">
                    {file ? file.name : 'Select file (PDF, DOCX, TXT)'}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={uploading || !file}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-sm hover:shadow transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-1.5"
              >
                {uploading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Ingesting Document...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" /> Upload & Index
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="md:col-span-2">
          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2.5">
              <FileText className="w-4 h-4 text-blue-600" /> Ingested Reference Documents
            </h3>
            {loading ? (
              <div className="text-center py-12">
                <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-slate-500 font-semibold">Loading documents list...</p>
              </div>
            ) : documents.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs font-bold text-slate-500 uppercase bg-slate-50/50">
                      <th className="py-3 px-4">Document Title</th>
                      <th className="py-3 px-4">Metadata</th>
                      <th className="py-3 px-4">Vector Chunks</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((doc) => (
                      <tr key={doc._id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-all">
                        <td className="py-3 px-4">
                          <p className="text-sm font-bold text-slate-900 leading-tight">{doc.title}</p>
                          <span className="text-[10px] text-slate-400 font-mono block break-all mt-0.5">{doc.source}</span>
                        </td>
                        <td className="py-3 px-4 space-y-1.5">
                          <div className="flex flex-wrap gap-1">
                            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[10px] text-blue-700 font-semibold border border-blue-100 flex items-center gap-0.5">
                              <Tag className="w-2.5 h-2.5" /> {doc.category}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-slate-50 text-[10px] text-slate-600 font-semibold border border-slate-200 flex items-center gap-0.5">
                              <MapPin className="w-2.5 h-2.5" /> {doc.state}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-[10px] text-indigo-700 font-semibold border border-indigo-100 flex items-center gap-0.5">
                              <Languages className="w-2.5 h-2.5" /> {doc.language.toUpperCase()}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm font-bold text-slate-800">{doc.chunkCount} chunks</span>
                          <span className="text-[10px] text-slate-400 block font-semibold">{Math.round((doc.size || 0) / 1024)} KB</span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleDelete(doc._id)}
                            className="p-2 text-slate-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
                            title="Delete document and vector chunks"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-16">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-base font-bold text-slate-800">No official documents uploaded</p>
                <p className="text-slate-500 text-sm font-semibold max-w-sm mx-auto mt-1">Upload PDF, DOCX, or TXT welfare programs and registration standards to ground the SevaAI system</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
