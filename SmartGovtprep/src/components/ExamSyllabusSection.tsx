import React, { useState } from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  Bookmark, 
  Sparkles, 
  Layers, 
  HelpCircle, 
  ArrowRight,
  BookMarked,
  Lightbulb
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EXAM_SYLLABUS_MAP, EXAM_CATEGORIES } from '../data/mockData';
import { ExamCategoryType } from '../types';

export const ExamSyllabusSection: React.FC = () => {
  const { selectedCategory, setSelectedCategory, setIsAiModalOpen } = useApp();
  const [activeTab, setActiveTab] = useState<ExamCategoryType>(
    selectedCategory !== 'ALL' ? (selectedCategory as ExamCategoryType) : 'GPSC'
  );

  const subjects = EXAM_SYLLABUS_MAP[activeTab] || EXAM_SYLLABUS_MAP['GPSC'] || [];

  return (
    <section id="syllabus-explorer" className="py-14 text-slate-100 border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
              <BookOpen className="w-4 h-4" />
              <span>Interactive Syllabus Explorer</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Exam Syllabus & Subject-Wise Weightage
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl font-normal">
              Student exam select karein aur structured subject breakdown, Prelims vs Mains marks distribution, recommended reference books, aur topper tips payein.
            </p>
          </div>

          {/* AI Doubt Clearer CTA */}
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600/90 to-purple-600/90 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-[0_4px_16px_rgba(99,102,241,0.3)] border border-white/20 backdrop-blur-md transition"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>Ask AI: Syllabus Doubts & Strategy</span>
          </button>
        </div>

        {/* Exam Selection Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-thin">
          {EXAM_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveTab(cat.id as ExamCategoryType);
                setSelectedCategory(cat.id as ExamCategoryType);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition border backdrop-blur-md flex items-center gap-2 ${
                activeTab === cat.id
                  ? 'bg-emerald-600/90 border-white/30 text-white shadow-[0_4px_16px_rgba(16,185,129,0.3)]'
                  : 'bg-white/[0.04] border-white/10 text-slate-300 hover:border-white/25 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Syllabus Subject Breakdown Cards */}
        <div className="space-y-6">
          {subjects.map((sub, idx) => (
            <div
              key={sub.id}
              className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.37)] hover:border-white/20 transition"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-white/[0.06] border border-white/15 flex items-center justify-center text-emerald-400 font-bold text-sm shadow-inner backdrop-blur-md">
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-tight">{sub.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 px-2.5 py-0.5 rounded-full backdrop-blur-md">
                        Stage: {sub.stage}
                      </span>
                      <span className="text-[11px] font-bold text-emerald-400 font-mono">
                        Weightage: {sub.weightage}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsAiModalOpen(true)}
                  className="self-start md:self-auto bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 hover:text-white text-xs font-semibold px-3 py-2 rounded-xl border border-white/15 flex items-center gap-1.5 backdrop-blur-md transition"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Explain with AI</span>
                </button>
              </div>

              {/* Topics Grid */}
              <div className="mt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                  Prescribed Core Topics:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {sub.topics.map((topic, tIdx) => (
                    <div
                      key={tIdx}
                      className="flex items-start gap-2.5 bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl p-3 text-xs text-slate-200"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{topic}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Books & Tips Row */}
              <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
                {/* Standard Reference Books */}
                <div className="bg-white/[0.02] backdrop-blur-md border border-white/10 rounded-2xl p-4 space-y-2">
                  <div className="font-bold text-slate-200 flex items-center gap-1.5">
                    <BookMarked className="w-4 h-4 text-amber-400" />
                    <span>Recommended Standard Books & Sources:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-slate-300 pl-1">
                    {sub.recommendedBooks.map((b, bIdx) => (
                      <li key={bIdx} className="text-slate-300">{b}</li>
                    ))}
                  </ul>
                </div>

                {/* Topper Preparation Tip */}
                <div className="bg-emerald-950/20 backdrop-blur-md border border-emerald-500/25 rounded-2xl p-4 space-y-2">
                  <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-emerald-400" />
                    <span>High-Yield Topper Tip:</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {sub.keyTips}
                  </p>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
