import React, { useState } from 'react';
import { 
  Bell, 
  Calendar, 
  Globe, 
  Cpu, 
  TrendingUp, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle,
  Tag
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DAILY_CURRENT_AFFAIRS } from '../data/mockData';

export const CurrentAffairsSection: React.FC = () => {
  const { setIsAiModalOpen } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = [
    { id: 'ALL', label: 'All Updates', icon: Bell },
    { id: 'Gujarat Special', label: 'Gujarat Special (GPSC/PSI)', icon: MapPin },
    { id: 'National', label: 'National Polity & Governance', icon: Globe },
    { id: 'Economy', label: 'Economy & Banking', icon: TrendingUp },
    { id: 'Science & Tech', label: 'Science, Space & Tech', icon: Cpu },
    { id: 'International', label: 'International Relations', icon: Globe },
  ];

  const filteredAffairs = selectedCategory === 'ALL'
    ? DAILY_CURRENT_AFFAIRS
    : DAILY_CURRENT_AFFAIRS.filter((item) => item.category === selectedCategory);

  return (
    <section id="current-affairs" className="py-14 text-slate-100 border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
              <Bell className="w-4 h-4" />
              <span>Exam-Oriented News & Editorial Analysis</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Daily Current Affairs for Prelims & Mains
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl font-normal">
              Categorized daily updates across National, International, Economy, Science & Tech, and exclusive Gujarat Current Affairs with factual Prelims pointers.
            </p>
          </div>

          <button
            onClick={() => setIsAiModalOpen(true)}
            className="flex items-center gap-2 bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 hover:text-white text-xs font-bold px-4 py-3 rounded-2xl border border-white/15 backdrop-blur-md transition shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Generate Current Affairs Quiz with AI</span>
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-thin">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition border backdrop-blur-md flex items-center gap-2 ${
                  isSelected
                    ? 'bg-emerald-600/90 border-white/30 text-white shadow-[0_4px_16px_rgba(16,185,129,0.3)]'
                    : 'bg-white/[0.04] border-white/10 text-slate-300 hover:border-white/25 hover:text-white hover:bg-white/[0.08]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Current Affairs Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredAffairs.map((item) => (
            <div
              key={item.id}
              className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:border-white/20 hover:shadow-[0_12px_40px_rgba(0,0,0,0.45)] transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header Meta */}
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-white/10">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border backdrop-blur-md ${
                    item.category === 'Gujarat Special'
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      : item.category === 'Economy'
                      ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                      : item.category === 'Science & Tech'
                      ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                      : 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
                  }`}>
                    {item.category}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.date}</span>
                  </span>
                </div>

                {/* Title & Summary */}
                <div className="mt-3.5">
                  <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                {/* Key Points */}
                <div className="mt-4 space-y-1.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Key Highlights:
                  </div>
                  {item.keyPoints.map((pt, pIdx) => (
                    <div key={pIdx} className="flex items-start gap-2 text-xs text-slate-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>

                {/* Prelims Exam Pointers Box */}
                <div className="mt-4 bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl p-4 space-y-2">
                  <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Prelims High-Yield Facts:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-xs text-slate-200 pl-1">
                    {item.prelimsPointers.map((p, ptrIdx) => (
                      <li key={ptrIdx}>{p}</li>
                    ))}
                  </ul>
                </div>

                {/* Mains Relevance */}
                <div className="mt-3 text-xs text-indigo-200 bg-indigo-950/25 border border-indigo-500/25 rounded-2xl p-3 backdrop-blur-md">
                  <strong className="text-indigo-100 font-semibold">Mains Syllabus Link: </strong>
                  {item.mainsRelevance}
                </div>
              </div>

              {/* Tags and Action */}
              <div className="mt-5 pt-3.5 border-t border-white/10 flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <span key={tag} className="text-[10px] bg-white/[0.06] border border-white/10 text-slate-300 px-2 py-0.5 rounded-lg backdrop-blur-md">
                      #{tag}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => setIsAiModalOpen(true)}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 transition"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Analyze with AI</span>
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
