import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Send, 
  Bot, 
  User as UserIcon, 
  Crown, 
  Flame, 
  RotateCcw, 
  Copy, 
  Check, 
  BookOpen, 
  Languages
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AIQueryMessage } from '../types';

export const AIAssistantModal: React.FC = () => {
  const { 
    user, 
    isAiModalOpen, 
    setIsAiModalOpen, 
    useAiQuery, 
    setIsPricingModalOpen 
  } = useApp();

  const [inputQuery, setInputQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<'English' | 'Gujarati' | 'Hindi'>('English');
  const [messages, setMessages] = useState<AIQueryMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Namaste **${user.name}**! 🙏\n\nI am your **SmartGovtPrep AI Mentor & Exam Strategist**. I specialize in:\n- **GPSC & Gujarat State Exams** (History, Culture, BNS Law, OJAS Schemes)\n- **UPSC Civil Services** (Polity, Economy, Geography, CSAT)\n- **SSC, Banking & Railway** (Quant tricks, Puzzles, Static GK)\n\nAsk me any concept, syllabus doubt, essay outline, or exam preparation strategy!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAiModalOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isAiModalOpen]);

  if (!isAiModalOpen) return null;

  const quickPrompts = [
    'GPSC Class 1-2 Prelims 60 Days High-Yield Strategy',
    'Explain key changes in Bharatiya Nyaya Sanhita (BNS) 2023 for Police PSI',
    'How to master CSAT for UPSC Prelims without math background?',
    'Gujarat History: Solanki Dynasty & Maru-Gurjara Architecture summary',
    'SSC CGL Quantitative Aptitude speed calculation formula cheat sheet',
  ];

  const handleSend = async (queryToSend?: string) => {
    const text = queryToSend || inputQuery;
    if (!text.trim() || isLoading) return;

    if (!useAiQuery()) {
      return;
    }

    const userMsg: AIQueryMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: text.trim(),
          examCategory: user.targetExam,
          language: selectedLanguage,
          studentTier: user.tier,
        }),
      });

      const data = await response.json();
      const aiReply: AIQueryMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.answer || 'Thank you for your question. Here is your structured government exam strategy.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiReply]);
    } catch (error) {
      console.error('AI assistant error', error);
      const errorMsg: AIQueryMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: '### 🎯 SmartGovtPrep High-Yield Exam Tip\n\n- Focus on revising previous 5 years official papers.\n- Practice at least 20 daily MCQs under 15-minute timer.\n- Master the core constitutional articles (Articles 12 to 51A).',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xl animate-fadeIn">
      <div className="bg-slate-900/85 backdrop-blur-2xl border border-white/15 rounded-3xl w-full max-w-3xl h-[88vh] max-h-[750px] shadow-[0_16px_48px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="bg-white/[0.04] px-5 sm:px-6 py-4.5 border-b border-white/10 flex items-center justify-between backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg border border-white/20 backdrop-blur-md">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white tracking-tight">
                  SmartGovtPrep AI Mentor
                </h3>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-md">
                  Gemini 3.7 Online
                </span>
              </div>
              <p className="text-xs text-slate-300">Personal AI Exam Coach for UPSC • GPSC • SSC • Police</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <div className="hidden sm:flex items-center gap-1 bg-white/[0.05] border border-white/10 rounded-xl p-1 text-xs backdrop-blur-md">
              {(['English', 'Gujarati', 'Hindi'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`px-2.5 py-1 rounded-lg transition text-xs font-semibold ${
                    selectedLanguage === lang
                      ? 'bg-emerald-600/90 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            {/* Quota Indicator */}
            <div className="text-xs font-semibold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-3 py-1.5 rounded-xl backdrop-blur-md">
              {user.tier === 'free' ? `${Math.max(0, 5 - user.aiQueriesUsedToday)} / 5 Qs Left` : 'PRO Unlimited'}
            </div>

            <button
              onClick={() => setIsAiModalOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/[0.08] transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-black/20">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-indigo-600/80 border border-white/20 flex items-center justify-center text-white shrink-0 mt-1 shadow-md backdrop-blur-md">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                  </div>
                )}

                <div className={`relative max-w-[85%] rounded-3xl p-5 text-xs sm:text-sm leading-relaxed backdrop-blur-xl border ${
                  isUser
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 border-emerald-400/30 text-white rounded-tr-none shadow-[0_8px_24px_rgba(16,185,129,0.3)]'
                    : 'bg-white/[0.05] border-white/10 text-slate-200 rounded-tl-none shadow-[0_8px_32px_rgba(0,0,0,0.37)]'
                }`}>
                  <div className="whitespace-pre-line prose prose-invert max-w-none text-xs sm:text-sm">
                    {msg.text}
                  </div>

                  <div className="flex items-center justify-between pt-2.5 mt-3 border-t border-white/10 text-[10px] text-slate-400">
                    <span>{msg.timestamp}</span>
                    {!isUser && (
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="text-slate-400 hover:text-emerald-400 flex items-center gap-1 ml-4 transition"
                        title="Copy text"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-emerald-700/80 border border-white/20 flex items-center justify-center text-white shrink-0 mt-1 shadow-md font-bold text-xs backdrop-blur-md">
                    {user.name.charAt(0)}
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 items-center text-slate-300 text-xs py-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-600/80 border border-white/20 flex items-center justify-center text-white animate-pulse">
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
              <div className="flex items-center gap-2 bg-white/[0.05] border border-white/10 px-4 py-2.5 rounded-2xl backdrop-blur-md shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]" />
                <span className="ml-2 font-medium">SmartGovtPrep AI is formulating answer...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="bg-white/[0.02] backdrop-blur-md px-4 py-2.5 border-t border-white/10 flex items-center gap-2 overflow-x-auto scrollbar-thin">
          <span className="text-[11px] font-bold text-slate-400 shrink-0">Prompts:</span>
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              disabled={isLoading}
              className="bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white text-xs px-3 py-1.5 rounded-xl border border-white/10 whitespace-nowrap transition backdrop-blur-md"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 sm:p-5 bg-white/[0.03] border-t border-white/10 backdrop-blur-md">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2.5"
          >
            <input
              type="text"
              placeholder={`Ask doubt in ${selectedLanguage} (e.g. Dholavira features, Supreme Court judgments, CSAT formulas)...`}
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              disabled={isLoading}
              className="flex-1 bg-white/[0.04] border border-white/15 text-white placeholder-slate-400 rounded-2xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/80 backdrop-blur-md transition shadow-inner"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isLoading}
              className="bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 disabled:opacity-40 text-white font-bold px-5 py-3 rounded-2xl shadow-[0_4px_16px_rgba(16,185,129,0.3)] flex items-center gap-1.5 transition border border-white/10"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Ask</span>
            </button>
          </form>

          {user.tier === 'free' && (
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2.5">
              <span>Free Plan: 5 AI queries/day</span>
              <button
                onClick={() => {
                  setIsAiModalOpen(false);
                  setIsPricingModalOpen(true);
                }}
                className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
              >
                <Crown className="w-3.5 h-3.5" />
                <span>Upgrade to Premium (50 Qs/Day) for ₹99</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
