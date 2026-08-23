import React from 'react';
import { 
  Award, 
  Compass, 
  ShieldCheck, 
  Landmark, 
  Train, 
  Shield, 
  GraduationCap, 
  ArrowRight,
  Sparkles,
  Users
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EXAM_CATEGORIES } from '../data/mockData';
import { ExamCategoryType } from '../types';

export const ExamCategoriesSection: React.FC = () => {
  const { selectedCategory, setSelectedCategory, setSearchQuery } = useApp();

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'UPSC': return Award;
      case 'GPSC': return Compass;
      case 'SSC': return ShieldCheck;
      case 'Banking': return Landmark;
      case 'Railway': return Train;
      case 'Police': return Shield;
      case 'Teaching': return GraduationCap;
      default: return Sparkles;
    }
  };

  const getCategoryDetails = (id: string) => {
    switch (id) {
      case 'UPSC':
        return {
          tagline: 'IAS, IPS, IFS & Central Group-A Services',
          difficulty: 'Highest Tier',
          eligibility: 'Any Graduation (21-32 Yrs)',
          popular: 'CSE, NDA, CDS, CAPF',
          color: 'from-indigo-600/20 to-blue-600/10 border-indigo-500/30 text-indigo-400',
        };
      case 'GPSC':
        return {
          tagline: 'Gujarat Administrative & Civil Services',
          difficulty: 'State Top Tier',
          eligibility: 'Any Graduate (20-35 Yrs)',
          popular: 'Class 1-2, DySO, Nayab Mamlatdar, PI',
          color: 'from-emerald-600/20 to-teal-600/10 border-emerald-500/30 text-emerald-400',
        };
      case 'SSC':
        return {
          tagline: 'Central Ministries & Inspector Grade',
          difficulty: 'Speed & Accuracy',
          eligibility: '10th / 12th / Graduate',
          popular: 'CGL, CHSL, MTS, CPO, GD',
          color: 'from-blue-600/20 to-cyan-600/10 border-blue-500/30 text-blue-400',
        };
      case 'Banking':
        return {
          tagline: 'Public & Private Banks Recruitment',
          difficulty: 'Puzzles & Quant Focus',
          eligibility: 'Any Graduate (20-30 Yrs)',
          popular: 'SBI PO, IBPS PO, Clerk, RRB',
          color: 'from-amber-600/20 to-yellow-600/10 border-amber-500/30 text-amber-400',
        };
      case 'Railway':
        return {
          tagline: 'Indian Railways RRB Nationwide Drives',
          difficulty: 'High Competition',
          eligibility: '10th / 12th / Degree',
          popular: 'RRB NTPC, Group D, ALP, JE',
          color: 'from-orange-600/20 to-red-600/10 border-orange-500/30 text-orange-400',
        };
      case 'Police':
        return {
          tagline: 'Gujarat Police & State Law Enforcement',
          difficulty: 'Physical + Law CBT',
          eligibility: '12th / Any Graduate',
          popular: 'PSI, Lokrakshak (LRD), SRPF, Jail Sepoy',
          color: 'from-rose-600/20 to-red-600/10 border-rose-500/30 text-rose-400',
        };
      case 'Teaching':
        return {
          tagline: 'Government & Grant-in-Aid Schools',
          difficulty: 'Pedagogy & Subject Mastery',
          eligibility: 'B.Ed / D.El.Ed / Master Degree',
          popular: 'TET-1/2, TAT-Secondary/Higher, CTET',
          color: 'from-purple-600/20 to-fuchsia-600/10 border-purple-500/30 text-purple-400',
        };
      default:
        return {
          tagline: 'National & State Competitive Exams',
          difficulty: 'Moderate to High',
          eligibility: 'Various',
          popular: 'General Tests',
          color: 'from-slate-800 to-slate-900 border-slate-700 text-slate-300',
        };
    }
  };

  return (
    <section id="exam-categories" className="py-14 text-slate-100 border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Target Career Pathways</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Explore Government Exam Categories
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl font-normal">
              Select your targeted domain to instantly view dedicated syllabus subjects, active notification calendars, and standard previous year papers.
            </p>
          </div>

          {/* Quick Filter Pill */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition backdrop-blur-md border ${
                selectedCategory === 'ALL'
                  ? 'bg-emerald-600/90 text-white border-white/20 shadow-[0_4px_16px_rgba(16,185,129,0.3)]'
                  : 'bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 border-white/10'
              }`}
            >
              Show All Categories
            </button>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {EXAM_CATEGORIES.map((cat) => {
            const Icon = getCategoryIcon(cat.id);
            const details = getCategoryDetails(cat.id);
            const isSelected = selectedCategory === cat.id;

            return (
              <div
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id as ExamCategoryType);
                  // Scroll smoothly to upcoming exams
                  const el = document.getElementById('upcoming-exams');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`cursor-pointer rounded-2xl p-5 border transition-all duration-300 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.3)] flex flex-col justify-between ${
                  isSelected
                    ? 'border-emerald-400/80 ring-2 ring-emerald-500/30 bg-white/[0.08] shadow-[0_8px_32px_rgba(16,185,129,0.25)]'
                    : 'border-white/10 hover:border-white/25 bg-white/[0.03] hover:bg-white/[0.07] hover:-translate-y-1'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-white/[0.06] border border-white/15 shadow-inner backdrop-blur-md ${details.color.split(' ')[details.color.split(' ').length - 1]}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-slate-200 border border-white/15 backdrop-blur-md">
                      {details.difficulty}
                    </span>
                  </div>

                  <div className="mt-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{details.tagline}</p>
                  </div>
                </div>

                <div>
                  <div className="mt-4 pt-3 border-t border-white/10 space-y-1.5 text-xs text-slate-300">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-400">Total Active Posts:</span>
                      <span className="font-bold text-emerald-400 font-mono">{cat.count}</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-400">Key Exams:</span>
                      <span className="font-semibold text-slate-200 truncate max-w-[140px]">{details.popular}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs font-bold text-emerald-400 pt-1 group">
                    <span>View Exams & Syllabus</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
