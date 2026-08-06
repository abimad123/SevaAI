import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage, fetchSessions, fetchSession, renameSession, deleteSession, startNewSession, addOptimisticMessage, truncateMessages, setLanguage } from '../../store/slices/chatSlice';
import { updateProfile } from '../../store/slices/authSlice';
import { Send, Sparkles, Plus, MessageSquare, ThumbsUp, ThumbsDown, Copy, BookOpen, Pencil, Trash2, Check, X, RotateCcw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import { useTranslation } from 'react-i18next';

const QUICK_PROMPTS_KEYS = [
  'chat.prompt_0',
  'chat.prompt_1',
  'chat.prompt_2',
  'chat.prompt_3',
  'chat.prompt_4',
  'chat.prompt_5',
];

export default function AIChat() {
  const dispatch = useDispatch();
  const { messages, sessions, currentSessionId, sendingMessage, language } = useSelector((s) => s.chat);
  const { user } = useSelector((s) => s.auth);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState(() => currentSessionId || uuidv4());
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [editingSessionId, setEditingSessionId] = useState(null);
  const [editingSessionTitle, setEditingSessionTitle] = useState('');
  const [editingMessageIndex, setEditingMessageIndex] = useState(null);
  const [editingMessageText, setEditingMessageText] = useState('');
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    dispatch(fetchSessions());
  }, [dispatch]);

  useEffect(() => {
    if (sessionId) {
      dispatch(fetchSession(sessionId));
    }
  }, [sessionId, dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

  const handleSaveRename = async (sid) => {
    const title = editingSessionTitle.trim();
    if (!title) return;
    await dispatch(renameSession({ sessionId: sid, title }));
    setEditingSessionId(null);
    dispatch(fetchSessions());
  };

  const handleDeleteSession = async (sid) => {
    await dispatch(deleteSession(sid));
    if (sessionId === sid) {
      handleNewChat();
    }
    dispatch(fetchSessions());
  };

  const handleSaveEditMessage = async (index) => {
    const trimmed = editingMessageText.trim();
    if (!trimmed || sendingMessage) return;
    setEditingMessageIndex(null);
    dispatch(truncateMessages(index));
    dispatch(addOptimisticMessage(trimmed));
    await dispatch(sendMessage({ message: trimmed, sessionId, language }));
  };

  const handleRegenerate = async (index) => {
    if (sendingMessage) return;
    const userMsgIndex = index - 1;
    if (userMsgIndex >= 0 && messages[userMsgIndex].role === 'user') {
      const promptText = messages[userMsgIndex].content;
      dispatch(truncateMessages(userMsgIndex));
      dispatch(addOptimisticMessage(promptText));
      await dispatch(sendMessage({ message: promptText, sessionId, language }));
    }
  };

  const handleFeedback = (index, helpful) => {
    toast.success('Feedback submitted');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyMessage = (content) => {
    navigator.clipboard.writeText(content);
    toast.success('Copied to clipboard');
  };

  const handleLocalLanguageChange = (l) => {
    dispatch(setLanguage(l));
    i18n.changeLanguage(l);
    if (user) {
      dispatch(updateProfile({ language: l }));
    }
  };

  return (
    <div className="h-[calc(100vh-112px)] flex gap-0 -m-6 rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-white">
      <div className={`${sidebarOpen ? 'w-66' : 'w-0'} transition-all duration-300 overflow-hidden border-r border-slate-200 bg-white flex flex-col`}>
        <div className="p-4 border-b border-slate-200">
          <button onClick={handleNewChat} className="btn-primary w-full justify-center text-sm py-2" id="new-chat-btn">
            <Plus className="w-4 h-4" /> {t('chat.new_chat')}
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider px-2 mb-2">{t('chat.recent_chats')}</p>
          {sessions.map((s) => (
            <div key={s.sessionId} className="w-full">
              {s.sessionId === editingSessionId ? (
                <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50/50 rounded-xl border border-blue-200">
                  <input
                    type="text"
                    className="w-full bg-white text-xs px-2 py-1 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-900 font-semibold"
                    value={editingSessionTitle}
                    onChange={(e) => setEditingSessionTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveRename(s.sessionId);
                      if (e.key === 'Escape') setEditingSessionId(null);
                    }}
                    autoFocus
                  />
                  <button onClick={() => handleSaveRename(s.sessionId)} className="p-1 text-emerald-600 hover:text-emerald-700 rounded cursor-pointer">
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setEditingSessionId(null)} className="p-1 text-red-600 hover:text-red-700 rounded cursor-pointer">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="relative group flex items-center w-full">
                  <button
                    onClick={() => setSessionId(s.sessionId)}
                    className={`flex-1 text-left px-3 py-2.5 rounded-xl text-sm transition-all font-medium pr-14
                      ${s.sessionId === sessionId ? 'bg-blue-50 text-blue-700 font-bold border-l-2 border-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                  >
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{s.title}</span>
                    </div>
                  </button>
                  <div className={`absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pl-2 rounded-lg ${s.sessionId === sessionId ? 'bg-blue-50' : 'bg-white group-hover:bg-slate-50'}`}>
                    <button
                      onClick={() => {
                        setEditingSessionId(s.sessionId);
                        setEditingSessionTitle(s.title);
                      }}
                      className="p-1 text-slate-400 hover:text-slate-900 transition-colors rounded cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteSession(s.sessionId)}
                      className="p-1 text-slate-400 hover:text-red-600 transition-colors rounded cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {sessions.length === 0 && (
            <div className="text-center py-8">
              <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-500 font-semibold">{t('chat.no_conversations')}</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-slate-50">
        <div className="h-14 flex items-center justify-between px-4 border-b border-slate-200 bg-white">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 cursor-pointer" id="chat-toggle-sidebar">
              <MessageSquare className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-700 flex items-center justify-center pulse-ring">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 leading-tight">{t('chat.title')}</p>
                <p className="text-xs text-emerald-700 flex items-center gap-1 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block animate-pulse" />
                  Online
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-100 border border-slate-200 rounded-lg p-1">
              {['en', 'hi'].map((l) => (
                <button key={l} onClick={() => handleLocalLanguageChange(l)}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${language === l ? 'bg-blue-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
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
              <h2 className="text-2xl font-bold font-display text-slate-900 mb-2">{t('chat.title')}</h2>
              <p className="text-slate-600 text-sm mb-8 leading-relaxed font-semibold">
                {t('chat.desc')}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                {QUICK_PROMPTS_KEYS.map((pKey, i) => (
                  <button key={i} onClick={() => handleSend(t(pKey))}
                    className="p-4 rounded-xl bg-white border-t-2 border-t-blue-600 border-x border-b border-slate-200 text-left text-sm text-slate-700 hover:text-slate-900 shadow-sm hover:shadow-md font-semibold transition-all cursor-pointer">
                    <span>{t(pKey)}</span>
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
              <div className={`max-w-[75%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1 w-full`}>
                <div className="relative group w-full flex justify-end">
                  <div className={msg.role === 'user' ? 'chat-bubble-user px-4 py-3 text-white text-sm shadow-sm relative pr-10 w-full' : 'chat-bubble-ai px-4 py-3 text-slate-800 text-sm shadow-sm w-full'}>
                    {msg.role === 'user' ? (
                      editingMessageIndex === i ? (
                        <div className="flex flex-col gap-2 w-full">
                          <textarea
                            className="w-full text-slate-950 bg-white border border-slate-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 font-semibold"
                            value={editingMessageText}
                            onChange={(e) => setEditingMessageText(e.target.value)}
                            rows={2}
                          />
                          <div className="flex justify-end gap-1.5">
                            <button onClick={() => handleSaveEditMessage(i)} className="px-2.5 py-1 bg-blue-700 text-white rounded text-xs font-bold hover:bg-blue-800 transition-colors cursor-pointer">Save & Resend</button>
                            <button onClick={() => setEditingMessageIndex(null)} className="px-2.5 py-1 bg-slate-200 text-slate-700 rounded text-xs font-bold hover:bg-slate-300 transition-colors cursor-pointer">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="font-medium">{msg.content}</p>
                          <button
                            onClick={() => {
                              setEditingMessageIndex(i);
                              setEditingMessageText(msg.content);
                            }}
                            className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 p-1 text-blue-200 hover:text-white rounded cursor-pointer"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )
                    ) : (
                      <div className="prose prose-sm max-w-none prose-slate text-slate-800 font-medium">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>

                {msg.role === 'assistant' && msg.sources?.length > 0 && (
                  <div className="w-full">
                    <p className="text-xs text-slate-500 mb-1 flex items-center gap-1 font-semibold">
                      <BookOpen className="w-3 h-3" /> {t('chat.sources')} ({msg.sources.length})
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
                  <div className="flex items-center gap-3 mt-2 border-t border-slate-100 pt-2 w-full">
                    {msg.confidence && (
                      <span className="text-xs text-slate-500 font-semibold mr-auto">
                        {t('chat.confidence')}: <span className={msg.confidence > 0.7 ? 'text-emerald-700 font-bold' : 'text-amber-800 font-bold'}>{Math.round(msg.confidence * 100)}%</span>
                      </span>
                    )}
                    <div className="flex items-center gap-1 ml-auto">
                      <button onClick={() => copyMessage(msg.content)} className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
                        <Copy className="w-3.5 h-3.5" /> {t('common.copy') || 'Copy'}
                      </button>
                      <button onClick={() => handleRegenerate(i)} className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
                        <RotateCcw className="w-3.5 h-3.5" /> {t('common.regenerate') || 'Regenerate'}
                      </button>
                      <div className="w-px h-3.5 bg-slate-200 mx-1" />
                      <button onClick={() => handleFeedback(i, true)} className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-emerald-700 transition-colors cursor-pointer">
                        <ThumbsUp className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleFeedback(i, false)} className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-red-700 transition-colors cursor-pointer">
                        <ThumbsDown className="w-3.5 h-3.5" />
                      </button>
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
          <div className="flex items-end gap-3 max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('chat.placeholder')}
                className="w-full resize-none min-h-12 max-h-36 py-3 px-4 pr-12 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:outline-none text-slate-900 bg-white transition-all text-base font-semibold leading-relaxed"
                rows={1}
                style={{ height: 'auto' }}
                onInput={(e) => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
                id="chat-input"
              />
            </div>
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || sendingMessage}
              className="flex items-center justify-center py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-sm hover:shadow transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
              id="chat-send"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-slate-500 text-center mt-2 font-medium">{t('chat.disclaimer')}</p>
        </div>
      </div>
    </div>
  );
}
