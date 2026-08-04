import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage, fetchSessions, startNewSession, addOptimisticMessage, setLanguage } from '../../store/slices/chatSlice';
import { Send, Sparkles, Plus, MessageSquare, ThumbsUp, ThumbsDown, Copy, BookOpen } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

const QUICK_PROMPTS = [
  'What schemes are available for rural education NGOs?',
  'How do I apply for FCRA registration?',
  'Explain PMKVY scheme eligibility and benefits',
  'What CSR funding opportunities exist for health NGOs?',
  'Generate a compliance checklist for NGO registration',
  'What documents are needed for Samagra Shiksha funding?',
];

export default function AIChat() {
  const dispatch = useDispatch();
  const { messages, sessions, currentSessionId, sendingMessage, language } = useSelector((s) => s.chat);
  const { user } = useSelector((s) => s.auth);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState(() => currentSessionId || uuidv4());
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { dispatch(fetchSessions()); }, [dispatch]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async (text) => {
    const msg = text || input.trim();
    if (!msg || sendingMessage) return;
    setInput('');
    dispatch(addOptimisticMessage(msg));
    await dispatch(sendMessage({ message: msg, sessionId, language }));
    inputRef.current?.focus();
  };

  const handleNewChat = () => {
    const newId = uuidv4();
    setSessionId(newId);
    dispatch(startNewSession());
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const copyMessage = (content) => {
    navigator.clipboard.writeText(content);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="h-[calc(100vh-112px)] flex gap-0 -m-6 rounded-2xl overflow-hidden shadow-sm border border-slate-200">
      <div className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden border-r border-slate-200 bg-white flex flex-col`}>
        <div className="p-4 border-b border-slate-200">
          <button onClick={handleNewChat} className="btn-primary w-full justify-center text-sm py-2">
            <Plus className="w-4 h-4" /> New Chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider px-2 mb-2">Recent Chats</p>
          {sessions.map((s) => (
            <button key={s.sessionId}
              onClick={() => setSessionId(s.sessionId)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-colors font-medium
                ${s.sessionId === sessionId ? 'bg-blue-50 text-blue-700 font-bold border-l-2 border-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{s.title}</span>
              </div>
            </button>
          ))}
          {sessions.length === 0 && (
            <div className="text-center py-8">
              <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-500 font-semibold">No conversations yet</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-slate-50">
        <div className="h-14 flex items-center justify-between px-4 border-b border-slate-200 bg-white">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800">
              <MessageSquare className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-700 flex items-center justify-center pulse-ring">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 leading-tight">SevaAI Assistant</p>
                <p className="text-xs text-emerald-700 flex items-center gap-1 font-semibold"><span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block animate-pulse" />Online</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-100 border border-slate-200 rounded-lg p-1">
              {['en', 'hi'].map((l) => (
                <button key={l} onClick={() => dispatch(setLanguage(l))}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${language === l ? 'bg-blue-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
                  {l === 'en' ? '🇬🇧 EN' : '🇮🇳 HI'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-blue-700 flex items-center justify-center mb-4 shadow-md">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold font-display text-slate-900 mb-2">SevaAI Assistant</h2>
              <p className="text-slate-600 text-sm mb-8 leading-relaxed font-semibold">
                I'm your AI guide for India's NGO-Government ecosystem. Ask me about government schemes,
                compliance requirements, funding opportunities, or get help with proposals.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                {QUICK_PROMPTS.map((p, i) => (
                  <button key={i} onClick={() => handleSend(p)}
                    className="p-3 rounded-xl bg-white border border-slate-200 text-left text-sm text-slate-600 hover:text-slate-900 hover:border-blue-500/40 hover:bg-slate-50/50 shadow-sm font-semibold transition-all">
                    <span>{p}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''} fade-in-up`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center shrink-0 mt-1 shadow-sm">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              )}
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center shrink-0 mt-1">
                  <span className="text-sm font-bold text-slate-700">{user?.name?.[0]}</span>
                </div>
              )}
              <div className={`max-w-[75%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                <div className={msg.role === 'user' ? 'chat-bubble-user px-4 py-3 text-white text-sm shadow-sm' : 'chat-bubble-ai px-4 py-3 text-slate-800 text-sm shadow-sm'}>
                  {msg.role === 'assistant' ? (
                    <div className="prose prose-sm max-w-none prose-slate text-slate-800 font-medium">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="font-medium">{msg.content}</p>
                  )}
                </div>

                {msg.role === 'assistant' && msg.sources?.length > 0 && (
                  <div className="w-full">
                    <p className="text-xs text-slate-500 mb-1 flex items-center gap-1 font-semibold">
                      <BookOpen className="w-3 h-3" /> Sources ({msg.sources.length})
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.sources.map((src, si) => (
                        <div key={si} className="px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs text-blue-700 font-semibold flex items-center gap-1">
                          <span>📄</span>
                          <span className="max-w-24 truncate">{src.title || src.source}</span>
                          <span className="text-blue-500 font-bold">{Math.round((src.relevanceScore || 0.8) * 100)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-3 mt-1">
                    {msg.confidence && (
                      <span className="text-xs text-slate-500 font-semibold">
                        Confidence: <span className={msg.confidence > 0.7 ? 'text-emerald-700' : 'text-amber-800'}>{Math.round(msg.confidence * 100)}%</span>
                      </span>
                    )}
                    <div className="flex items-center gap-1">
                      <button className="p-1 rounded hover:bg-slate-200 text-slate-400 hover:text-emerald-700 transition-colors"><ThumbsUp className="w-3.5 h-3.5" /></button>
                      <button className="p-1 rounded hover:bg-slate-200 text-slate-400 hover:text-red-600 transition-colors"><ThumbsDown className="w-3.5 h-3.5" /></button>
                      <button onClick={() => copyMessage(msg.content)} className="p-1 rounded hover:bg-slate-200 text-slate-400 hover:text-slate-800 transition-colors"><Copy className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {sendingMessage && (
            <div className="flex gap-3 fade-in-up">
              <div className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center shrink-0 shadow-sm">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="chat-bubble-ai px-4 py-3 shadow-sm border border-slate-200 bg-white">
                <div className="flex gap-1 items-center h-5">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-slate-200 bg-white">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={language === 'hi' ? 'अपना प्रश्न यहाँ लिखें...' : 'Ask about government schemes, NGO compliance, funding opportunities...'}
                className="input-field resize-none min-h-12 max-h-36 py-3 pr-4 leading-relaxed font-semibold"
                rows={1}
                style={{ height: 'auto' }}
                onInput={(e) => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
                id="chat-input"
              />
            </div>
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || sendingMessage}
              className="p-2.5 rounded-xl bg-blue-700 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-800 transition-colors shrink-0 shadow-md"
              id="chat-send"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-slate-500 text-center mt-2 font-medium">SevaAI uses RAG technology. Always verify critical information with official sources.</p>
        </div>
      </div>
    </div>
  );
}
