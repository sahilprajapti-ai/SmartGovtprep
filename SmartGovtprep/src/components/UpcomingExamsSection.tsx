import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ExternalLink, 
  Bookmark, 
  BookmarkCheck, 
  FileText, 
  Building2, 
  GraduationCap, 
  IndianRupee,
  Filter,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UPCOMING_EXAMS_DATA } from '../data/mockData';
import { ExamCategoryType } from '../types';

export const UpcomingExamsSection: React.FC = () => {
  const { 
    selectedCategory, 
    setSelectedCategory, 
    searchQuery, 
    user, 
    toggleSavedExam,
    setIsAiModalOpen 
  } = useApp();

  const [filterState, setFilterState] = useState<'ALL' | 'Gujarat' | 'National'>('ALL');

  // Filter exams based on category, search query, and state filter
  const filteredExams = UPCOMING_EXAMS_DATA.filter((exam) => {
    // Category match
    const categoryMatch = selectedCategory === 'ALL' || exam.category === selectedCategory;
    
    // Search query match
    const query = searchQuery.toLowerCase().trim();
    const searchMatch = !query || 
      exam.name.toLowerCase().includes(query) ||
      exam.fullName.toLowerCase().includes(query) ||
      exam.category.toLowerCase().includes(query) ||
      exam.conductingBody.toLowerCase().includes(query) ||
      exam.vacancies.toLowerCase().includes(query);

    // State focus match
    const stateMatch = filterState === 'ALL' || 
      (filterState === 'Gujarat' && (exam.stateFocus === 'Gujarat' || exam.category === 'GPSC' || exam.category === 'Police')) ||
      (filterState === 'National' && exam.stateFocus !== 'Gujarat');

    return categoryMatch && searchMatch && stateMatch;
  });

  return (
    <section id="upcoming-exams" className="py-14 text-slate-100 border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
              <Calendar className="w-4 h-4" />
              <span>Live Examination Tracker</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Upcoming Government Exams & Notifications
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl font-normal">
              Track real-time official application dates, countdown days, eligibility criteria, and direct links to apply on official portals (OJAS Gujarat, UPSC, SSC, IBPS).
            </p>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Gujarat vs National Toggle */}
            <div className="bg-white/[0.05] p-1 rounded-2xl border border-white/10 flex items-center gap-1 text-xs font-semibold backdrop-blur-md">
              <button
                onClick={() => setFilterState('ALL')}
                className={`px-3 py-1.5 rounded-xl transition ${
                  filterState === 'ALL' ? 'bg-emerald-600/90 text-white shadow-sm border border-white/20' : 'text-slate-400 hover:text-white'
                }`}
              >
                All India
              </button>
              <button
                onClick={() => setFilterState('Gujarat')}
                className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1 ${
                  filterState === 'Gujarat' ? 'bg-emerald-600/90 text-white shadow-sm border border-white/20' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Gujarat State (GPSC/OJAS)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Categories Pill Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-thin">
          {['ALL', 'GPSC', 'UPSC', 'SSC', 'Banking', 'Railway', 'Police', 'Teaching'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat as ExamCategoryType | 'ALL')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition border backdrop-blur-md ${
                selectedCategory === cat
                  ? 'bg-indigo-600/90 border-white/30 text-white shadow-[0_4px_16px_rgba(99,102,241,0.3)]'
                  : 'bg-white/[0.04] border-white/10 text-slate-300 hover:border-white/25 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              {cat === 'ALL' ? '🌟 All Exams' : cat}
            </button>
          ))}
        </div>

        {/* Exams List / Cards */}
        {filteredExams.length === 0 ? (
          <div className="text-center py-16 bg-white/[0.03] backdrop-blur-xl rounded-3xl border border-white/10">
            <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">No upcoming exams found matching your filter</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto mt-1">
              Try changing the search keyword or reset the category filter to explore all national and Gujarat vacancies.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setFilterState('ALL');
              }}
              className="mt-4 bg-white/[0.08] hover:bg-white/[0.14] text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl border border-white/15 backdrop-blur-md transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExams.map((exam) => {
              const isSaved = user.savedExams.includes(exam.id);

              return (
                <div
                  key={exam.id}
                  className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-5 hover:border-white/25 hover:bg-white/[0.06] hover:shadow-[0_12px_40px_rgba(0,0,0,0.45)] transition-all flex flex-col justify-between"
                >
                  {/* Card Header */}
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full font-mono backdrop-blur-md">
                          {exam.category}
                        </span>
                        {exam.badge && (
                          <span className="bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-md">
                            {exam.badge}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => toggleSavedExam(exam.id)}
                        className={`p-2 rounded-xl border transition backdrop-blur-md ${
                          isSaved
                            ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                            : 'bg-white/[0.05] border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/[0.1]'
                        }`}
                        title={isSaved ? 'Remove from Saved' : 'Save this Exam'}
                      >
                        {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Title & Organization */}
                    <div className="mt-3">
                      <h3 className="text-lg font-bold text-white tracking-tight leading-snug">
                        {exam.name}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{exam.fullName}</p>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{exam.conductingBody}</span>
                      </p>
                    </div>

                    {/* Dates & Countdown Highlights Box */}
                    <div className="mt-4 bg-white/[0.04] backdrop-blur-md border border-white/10 rounded-2xl p-3.5 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Exam Date:</span>
                        </span>
                        <span className="font-bold text-white font-mono">{exam.examDate}</span>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                          <span>Application End:</span>
                        </span>
                        <span className="font-semibold text-rose-300">{exam.applicationEnd}</span>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1.5 border-t border-white/10">
                        <span className="text-slate-400">Total Vacancies:</span>
                        <span className="font-bold text-emerald-400 font-mono">{exam.vacancies}</span>
                      </div>
                    </div>

                    {/* Eligibility & Salary Snippet */}
                    <div className="mt-4 space-y-1.5 text-xs text-slate-300">
                      <div className="flex items-start gap-2">
                        <GraduationCap className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-2 text-slate-300">
                          <strong className="text-white font-semibold">Eligibility:</strong> {exam.eligibility.education} ({exam.eligibility.ageLimit})
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <IndianRupee className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Pay Scale: {exam.salaryScale}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="mt-5 pt-3 border-t border-white/10 flex items-center gap-2">
                    <a
                      href={exam.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 text-xs font-semibold py-2.5 px-3 rounded-xl border border-white/15 flex items-center justify-center gap-1.5 backdrop-blur-md transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                      <span>Official Notice</span>
                    </a>
                    <a
                      href="#syllabus-explorer"
                      onClick={() => setSelectedCategory(exam.category)}
                      className="bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 px-3.5 rounded-xl shadow-[0_4px_16px_rgba(16,185,129,0.25)] border border-white/20 flex items-center justify-center gap-1 backdrop-blur-md transition"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Syllabus</span>
                    </a>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
