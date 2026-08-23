import React from 'react';
import { 
  BarChart3, 
  Flame, 
  CheckCircle2, 
  Target, 
  Award, 
  Clock, 
  TrendingUp, 
  RotateCcw,
  Sparkles,
  Zap,
  User,
  UserCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ProgressTrackerSection: React.FC = () => {
  const { user, mockHistory, setIsPricingModalOpen, setIsAiModalOpen, setIsProfileModalOpen, openAuthModal } = useApp();

  const totalMockTestsTaken = mockHistory.length;
  const totalQuestionsSolved = mockHistory.reduce((acc, cur) => acc + (cur.correctCount + cur.wrongCount), 0);
  const totalCorrect = mockHistory.reduce((acc, cur) => acc + cur.correctCount, 0);
  const accuracy = totalQuestionsSolved > 0 ? Math.round((totalCorrect / totalQuestionsSolved) * 100) : user.accuracyRate;

  const subjectProgress = [
    { subject: 'Gujarat History & Heritage', score: 85, color: 'bg-emerald-500', status: 'Strong' },
    { subject: 'Indian Polity & Constitution', score: 78, color: 'bg-teal-500', status: 'Good' },
    { subject: 'Current Affairs (National & State)', score: 72, color: 'bg-indigo-500', status: 'Good' },
    { subject: 'Quantitative Aptitude & Math', score: 58, color: 'bg-amber-500', status: 'Needs Practice' },
    { subject: 'Reasoning & Mental Ability', score: 82, color: 'bg-blue-500', status: 'Strong' },
    { subject: 'General Science & Environment', score: 64, color: 'bg-purple-500', status: 'Moderate' },
  ];

  return (
    <section id="progress-tracker" className="py-14 text-slate-100 border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
              <BarChart3 className="w-4 h-4" />
              <span>Student Performance Analytics</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Your Preparation Progress & Analytics
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl font-normal">
              Track your mock test accuracy, total questions attempted, daily study streak, and subject-wise strength breakdown in real-time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center gap-2 bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 text-xs font-semibold px-3.5 py-2.5 rounded-2xl border border-white/15 backdrop-blur-md transition shadow-sm"
              title="View & Edit Student Profile"
            >
              <User className="w-4 h-4 text-emerald-400" />
              <span className="max-w-[120px] truncate">{user.name ? user.name.split(' ')[0] : 'Profile'}</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono">
                {user.targetExam}
              </span>
            </button>

            <button
              onClick={() => openAuthModal('login')}
              className="hidden sm:flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-3 py-2.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 transition backdrop-blur-md"
            >
              <span>Switch / Login</span>
            </button>

            <button
              onClick={() => setIsAiModalOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600/90 to-violet-600/90 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-[0_4px_16px_rgba(99,102,241,0.25)] border border-white/20 backdrop-blur-md transition"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>AI Diagnostic</span>
            </button>
          </div>
        </div>

        {/* Top 4 KPI Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          
          {/* Streak */}
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.37)] flex items-center gap-4 hover:border-white/20 hover:bg-white/[0.06] transition">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 backdrop-blur-md">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white font-mono">{user.streakDays} Days</div>
              <div className="text-xs text-slate-400 font-semibold">Active Study Streak</div>
            </div>
          </div>

          {/* Accuracy */}
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.37)] flex items-center gap-4 hover:border-white/20 hover:bg-white/[0.06] transition">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 backdrop-blur-md">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white font-mono">{accuracy}%</div>
              <div className="text-xs text-slate-400 font-semibold">Overall MCQ Accuracy</div>
            </div>
          </div>

          {/* Questions Solved */}
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.37)] flex items-center gap-4 hover:border-white/20 hover:bg-white/[0.06] transition">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 backdrop-blur-md">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white font-mono">{totalQuestionsSolved} MCQs</div>
              <div className="text-xs text-slate-400 font-semibold">Questions Attempted</div>
            </div>
          </div>

          {/* Total Study Hours */}
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.37)] flex items-center gap-4 hover:border-white/20 hover:bg-white/[0.06] transition">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 backdrop-blur-md">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white font-mono">{user.totalStudyHours} Hours</div>
              <div className="text-xs text-slate-400 font-semibold">Study Time Logged</div>
            </div>
          </div>

        </div>

        {/* Detailed Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Subject Strength Breakdown (7 cols) */}
          <div className="lg:col-span-7 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-7 shadow-[0_8px_32px_rgba(0,0,0,0.37)] space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Subject-Wise Proficiency Breakdown</h3>
              </div>
              <span className="text-xs text-slate-400">Target: {user.targetExam}</span>
            </div>

            <div className="space-y-4">
              {subjectProgress.map((sub) => (
                <div key={sub.subject} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-200">{sub.subject}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border backdrop-blur-md ${
                        sub.status === 'Strong'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : sub.status === 'Needs Practice'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                          : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                      }`}>
                        {sub.status}
                      </span>
                      <span className="font-mono font-bold text-white">{sub.score}%</span>
                    </div>
                  </div>

                  <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden p-0.5">
                    <div
                      className={`h-full ${sub.color} rounded-full transition-all duration-500 shadow-sm`}
                      style={{ width: `${sub.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 text-xs text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Tip: Improve Quantitative Aptitude by 15% to increase overall cut-off probability.</span>
            </div>
          </div>

          {/* Recent Mock Test Attempts (5 cols) */}
          <div className="lg:col-span-5 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-7 shadow-[0_8px_32px_rgba(0,0,0,0.37)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">Recent Mock Test History</h3>
              </div>
              <span className="text-xs font-bold text-emerald-400 font-mono">{mockHistory.length} Recorded</span>
            </div>

            {mockHistory.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                No mock test attempts recorded yet. Take your first test in the Mock Test section above!
              </div>
            ) : (
              <div className="space-y-3">
                {mockHistory.slice(0, 4).map((hist) => (
                  <div
                    key={hist.id}
                    className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl p-4 space-y-2 hover:border-white/20 hover:bg-white/[0.06] transition"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-xs font-bold text-white line-clamp-1">{hist.testTitle}</h4>
                        <span className="text-[10px] text-slate-400">{hist.date}</span>
                      </div>
                      <span className="text-xs font-bold font-mono text-emerald-400 bg-emerald-950/40 px-2.5 py-0.5 rounded-xl border border-emerald-500/30 backdrop-blur-md">
                        {hist.score} / {hist.totalMarks}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-1 text-[11px] text-slate-300 pt-2 border-t border-white/10 font-medium">
                      <div>Accuracy: <strong className="text-white">{hist.accuracy}%</strong></div>
                      <div>Correct: <strong className="text-emerald-400">{hist.correctCount}</strong></div>
                      <div>Wrong: <strong className="text-rose-400">{hist.wrongCount}</strong></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <a
              href="#mock-tests"
              className="block w-full text-center bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 hover:text-white text-xs font-bold py-3 rounded-2xl border border-white/15 backdrop-blur-md transition shadow-sm"
            >
              Take Another Full Mock Test
            </a>
          </div>

        </div>

      </div>
    </section>
  );
};
