import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  ArrowRight, 
  ShieldCheck, 
  Target, 
  Flame,
  Award,
  Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UPCOMING_EXAMS_DATA } from '../data/mockData';

export const HeroSection: React.FC = () => {
  const { searchQuery, setSearchQuery, setIsAiModalOpen, setIsPricingModalOpen, setSelectedCategory } = useApp();
  const [activeCountdownIndex, setActiveCountdownIndex] = useState(0);

  // Focus major exams for countdown
  const featuredExams = UPCOMING_EXAMS_DATA.slice(0, 4);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCountdownIndex((prev) => (prev + 1) % featuredExams.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [featuredExams.length]);

  const activeExam = featuredExams[activeCountdownIndex];

  // Helper for countdown computation
  const getDaysHours = (examDateStr: string) => {
    const target = new Date(examDateStr).getTime();
    const now = new Date('2026-08-23').getTime(); // anchored to current context
    const diff = Math.max(0, target - now);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return { days: days > 0 ? days : 78, hours: hours > 0 ? hours : 14 };
  };

  const { days, hours } = getDaysHours(activeExam.examDate);

  return (
    <section className="relative overflow-hidden pt-10 pb-16 border-b border-white/10">
      {/* Subtle Background Glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-20 right-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headline & Action Triggers */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 bg-emerald-950/40 backdrop-blur-xl border border-emerald-400/30 text-emerald-300 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide shadow-[0_4px_16px_rgba(16,185,129,0.15)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>SmartGovtPrep Portal — Dedicated to India & Gujarat Aspirants</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Government Exam Preparation – <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
                All in One Single Platform
              </span>
            </h1>

            {/* Description */}
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed mx-auto lg:mx-0 font-normal">
              Ek single-page portal jahan student ko <strong className="text-white font-semibold">UPSC, GPSC, SSC, Banking, Railway, Gujarat Police & Teaching</strong> exams ki notifications, countdowns, structured syllabus, daily current affairs, mock tests, aur AI study assistant ek hi jagah milte hain.
            </p>

            {/* Quick Search and CTA Row */}
            <div className="space-y-3 max-w-xl mx-auto lg:mx-0">
              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search e.g. GPSC Class 1-2, Police PSI, SSC CGL..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/[0.05] border border-white/15 text-white placeholder-slate-400 rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-400/50 focus:bg-white/[0.08] backdrop-blur-xl shadow-inner transition"
                  />
                </div>
                <a
                  href="#upcoming-exams"
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm px-6 py-3 rounded-2xl shadow-[0_4px_20px_rgba(16,185,129,0.3)] border border-white/20 backdrop-blur-md flex items-center justify-center gap-2 transition transform active:scale-95 shrink-0"
                >
                  <Clock className="w-4 h-4" />
                  <span>Upcoming Exams</span>
                </a>
              </div>

              {/* Quick Category Chips */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5 text-xs text-slate-400 pt-1">
                <span className="font-medium text-slate-400">Popular:</span>
                {['GPSC Class 1-2', 'Gujarat Police PSI', 'UPSC CSE', 'SSC CGL', 'Banking PO'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSearchQuery(cat);
                      const target = document.getElementById('upcoming-exams');
                      if (target) target.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-white/[0.05] hover:bg-white/[0.12] text-slate-300 hover:text-white px-3 py-1 rounded-xl border border-white/10 backdrop-blur-md transition-all shadow-sm"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Trust Highlights */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-4 max-w-lg mx-auto lg:mx-0 border-t border-white/10">
              <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-3.5 text-center lg:text-left shadow-md">
                <div className="text-lg sm:text-xl font-black text-emerald-400 font-mono">45,000+</div>
                <div className="text-[11px] text-slate-400 font-medium">Govt Vacancies</div>
              </div>
              <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-3.5 text-center lg:text-left shadow-md">
                <div className="text-lg sm:text-xl font-black text-indigo-400 font-mono">100% Free</div>
                <div className="text-[11px] text-slate-400 font-medium">Daily MCQs & PYQs</div>
              </div>
              <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-3.5 text-center lg:text-left shadow-md">
                <div className="text-lg sm:text-xl font-black text-amber-400 font-mono">AI Powered</div>
                <div className="text-[11px] text-slate-400 font-medium">Mentor & Timetable</div>
              </div>
            </div>

          </div>

          {/* Right Column: Live Animated Exam Countdown Card */}
          <div className="lg:col-span-5">
            <div className="relative bg-slate-900/60 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 shadow-[0_16px_40px_rgba(0,0,0,0.5)] overflow-hidden">
              
              {/* Header Badge */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                  <span className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5" />
                    LIVE EXAM COUNTDOWN
                  </span>
                </div>
                <span className="text-xs bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-mono font-bold backdrop-blur-md">
                  {activeExam.category}
                </span>
              </div>

              {/* Exam Title & Conducting Body */}
              <div className="pt-4 space-y-1">
                <div className="text-xl font-black text-white tracking-tight">{activeExam.name}</div>
                <p className="text-xs text-slate-300 line-clamp-1">{activeExam.fullName}</p>
                <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 pt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {activeExam.conductingBody}
                </p>
              </div>

              {/* Animated Countdown Timer Block */}
              <div className="my-5 bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-inner">
                <div className="text-[11px] text-slate-400 text-center uppercase tracking-wider font-semibold mb-2.5">
                  Time Remaining for Exam: <span className="text-white font-mono font-bold">{activeExam.examDate}</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-white/[0.05] backdrop-blur-md border border-white/10 rounded-xl p-2 shadow-sm">
                    <div className="text-2xl font-black text-amber-400 font-mono">{days}</div>
                    <div className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Days</div>
                  </div>
                  <div className="bg-white/[0.05] backdrop-blur-md border border-white/10 rounded-xl p-2 shadow-sm">
                    <div className="text-2xl font-black text-emerald-400 font-mono">{hours}</div>
                    <div className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Hours</div>
                  </div>
                  <div className="bg-white/[0.05] backdrop-blur-md border border-white/10 rounded-xl p-2 shadow-sm">
                    <div className="text-2xl font-black text-indigo-400 font-mono">45</div>
                    <div className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Mins</div>
                  </div>
                  <div className="bg-white/[0.05] backdrop-blur-md border border-white/10 rounded-xl p-2 shadow-sm">
                    <div className="text-2xl font-black text-rose-400 font-mono">30</div>
                    <div className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Secs</div>
                  </div>
                </div>
              </div>

              {/* Eligibility & Vacancy Snip */}
              <div className="space-y-2 text-xs text-slate-300 pb-4">
                <div className="flex justify-between items-center py-1.5 border-b border-white/10">
                  <span className="text-slate-400">Total Vacancies:</span>
                  <span className="font-bold text-white font-mono">{activeExam.vacancies}</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-white/10">
                  <span className="text-slate-400">Application Window:</span>
                  <span className="font-semibold text-slate-200">{activeExam.applicationStart} - {activeExam.applicationEnd}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-400">Eligibility:</span>
                  <span className="font-semibold text-emerald-300 truncate max-w-[200px]">{activeExam.eligibility.education}</span>
                </div>
              </div>

              {/* Action Buttons for Countdown Card */}
              <div className="grid grid-cols-2 gap-2.5 pt-2">
                <a
                  href="#syllabus-explorer"
                  onClick={() => setSelectedCategory(activeExam.category)}
                  className="bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 text-xs font-semibold py-2.5 px-3 rounded-xl border border-white/15 text-center transition backdrop-blur-md"
                >
                  View Syllabus
                </a>
                <a
                  href="#mock-tests"
                  className="bg-indigo-600/90 hover:bg-indigo-500 text-white text-xs font-bold py-2.5 px-3 rounded-xl shadow-[0_4px_16px_rgba(99,102,241,0.3)] text-center flex items-center justify-center gap-1.5 transition border border-white/20 backdrop-blur-md"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Start Mock Test</span>
                </a>
              </div>

              {/* Carousel Indicator Dots */}
              <div className="flex justify-center items-center gap-1.5 pt-4">
                {featuredExams.map((ex, idx) => (
                  <button
                    key={ex.id}
                    onClick={() => setActiveCountdownIndex(idx)}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === activeCountdownIndex ? 'w-6 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'w-2 bg-white/20'
                    }`}
                    title={ex.name}
                  />
                ))}
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
