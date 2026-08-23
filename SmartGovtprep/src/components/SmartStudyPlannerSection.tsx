import React, { useState } from 'react';
import { 
  Sparkles, 
  Clock, 
  Calendar, 
  BookOpen, 
  CheckCircle2, 
  Printer, 
  Copy, 
  RotateCcw, 
  ArrowRight,
  Flame,
  Zap,
  ListTodo
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EXAM_CATEGORIES } from '../data/mockData';

export const SmartStudyPlannerSection: React.FC = () => {
  const { user, useAiQuery, setIsPricingModalOpen } = useApp();

  const [examCategory, setExamCategory] = useState<string>(user.targetExam || 'GPSC');
  const [dailyHours, setDailyHours] = useState<number>(6);
  const [targetMonths, setTargetMonths] = useState<number>(4);
  const [selectedWeakSubjects, setSelectedWeakSubjects] = useState<string[]>(['Polity & Constitution', 'Math & Quantitative Aptitude']);
  const [selectedStrongSubjects, setSelectedStrongSubjects] = useState<string[]>(['Current Affairs', 'Reasoning Ability']);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const allSubjectOptions = [
    'Polity & Constitution',
    'History & Gujarat Culture',
    'Geography & Environment',
    'Economy & Budget',
    'Math & Quantitative Aptitude',
    'Reasoning Ability',
    'General Science & Tech',
    'Current Affairs',
    'English Grammar & Vocab',
    'Gujarati Grammar & Essay',
    'Criminal Laws (BNS/BNSS)',
    'Pedagogy & Child Development',
  ];

  const toggleWeak = (sub: string) => {
    setSelectedWeakSubjects((prev) =>
      prev.includes(sub) ? prev.filter((s) => s !== sub) : [...prev, sub]
    );
  };

  const toggleStrong = (sub: string) => {
    setSelectedStrongSubjects((prev) =>
      prev.includes(sub) ? prev.filter((s) => s !== sub) : [...prev, sub]
    );
  };

  const handleGeneratePlan = async () => {
    if (!useAiQuery()) {
      return;
    }

    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examCategory,
          dailyHours,
          targetDate: `${targetMonths} months from now`,
          weakSubjects: selectedWeakSubjects,
          strongSubjects: selectedStrongSubjects,
        }),
      });

      const data = await res.json();
      setGeneratedPlan(data.planText || data.plan || 'Generated timetable successfully.');
    } catch (e) {
      console.error('Plan generation failed', e);
      // Fallback
      setGeneratedPlan(`### 📅 Smart Timetable for ${examCategory} (${dailyHours} Hours/Day)\n\n- **Morning (06:30 - 09:30 AM)**: Current Affairs + ${selectedWeakSubjects[0] || 'Core Subject'}\n- **Afternoon (02:00 - 04:30 PM)**: Practice MCQs & Problem Solving\n- **Evening (07:30 - 09:30 PM)**: ${selectedStrongSubjects[0] || 'Revision'} & Daily 20-MCQ Mock Test`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!generatedPlan) return;
    navigator.clipboard.writeText(generatedPlan);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section id="study-planner" className="py-14 text-slate-100 border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Smart AI Study Timetable Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Personalized Daily Study Planner
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl font-normal">
              Apne daily study hours aur weak/strong subjects select karein — hamara AI ranker engine aapke target exam ke liye customized hourly schedule aur revision routine generate karega.
            </p>
          </div>

          <div className="text-xs text-slate-300 bg-white/[0.05] border border-white/10 px-4 py-2.5 rounded-2xl backdrop-blur-md">
            Target Exam: <strong className="text-emerald-400 font-bold">{examCategory}</strong>
          </div>
        </div>

        {/* Planner Inputs Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Controls Column */}
          <div className="lg:col-span-5 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-7 shadow-[0_8px_32px_rgba(0,0,0,0.37)] space-y-6">
            
            {/* Target Exam Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                1. Select Target Exam:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {EXAM_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setExamCategory(cat.id)}
                    className={`p-2.5 rounded-xl text-xs font-bold border transition text-center backdrop-blur-md ${
                      examCategory === cat.id
                        ? 'bg-emerald-600/90 border-white/30 text-white shadow-md'
                        : 'bg-white/[0.04] border-white/10 text-slate-300 hover:border-white/20 hover:bg-white/[0.08]'
                    }`}
                  >
                    {cat.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Daily Hours Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-bold mb-2">
                <span className="uppercase tracking-wider text-slate-300">2. Daily Available Study Hours:</span>
                <span className="text-emerald-400 bg-emerald-950/40 px-3 py-0.5 rounded-full border border-emerald-500/30 font-mono backdrop-blur-md">
                  {dailyHours} Hours / Day
                </span>
              </div>
              <input
                type="range"
                min="2"
                max="14"
                step="1"
                value={dailyHours}
                onChange={(e) => setDailyHours(Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                <span>2 Hrs (Working)</span>
                <span>6 Hrs (Standard)</span>
                <span>10+ Hrs (Full Time)</span>
              </div>
            </div>

            {/* Target Timeline */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                3. Preparation Window:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[2, 4, 8].map((m) => (
                  <button
                    key={m}
                    onClick={() => setTargetMonths(m)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition backdrop-blur-md ${
                      targetMonths === m
                        ? 'bg-indigo-600/90 border-white/30 text-white shadow-sm'
                        : 'bg-white/[0.04] border-white/10 text-slate-300 hover:border-white/20 hover:bg-white/[0.08]'
                    }`}
                  >
                    {m} Months ({m * 30} Days)
                  </button>
                ))}
              </div>
            </div>

            {/* Weak Subjects Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-rose-400 mb-2">
                4. Priority Weak Subjects (Need Extra Hours):
              </label>
              <div className="flex flex-wrap gap-1.5">
                {allSubjectOptions.map((sub) => {
                  const isWeak = selectedWeakSubjects.includes(sub);
                  return (
                    <button
                      key={sub}
                      onClick={() => toggleWeak(sub)}
                      className={`text-xs px-3 py-1.5 rounded-xl border transition backdrop-blur-md ${
                        isWeak
                          ? 'bg-rose-950/50 border-rose-500 text-rose-300 font-bold'
                          : 'bg-white/[0.04] border-white/10 text-slate-300 hover:text-white hover:bg-white/[0.08]'
                      }`}
                    >
                      {isWeak ? `✓ ${sub}` : `+ ${sub}`}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Strong Subjects Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
                5. Strong Subjects (Quick Revision Only):
              </label>
              <div className="flex flex-wrap gap-1.5">
                {allSubjectOptions.map((sub) => {
                  const isStrong = selectedStrongSubjects.includes(sub);
                  return (
                    <button
                      key={sub}
                      onClick={() => toggleStrong(sub)}
                      className={`text-xs px-3 py-1.5 rounded-xl border transition backdrop-blur-md ${
                        isStrong
                          ? 'bg-emerald-950/50 border-emerald-500 text-emerald-300 font-bold'
                          : 'bg-white/[0.04] border-white/10 text-slate-300 hover:text-white hover:bg-white/[0.08]'
                      }`}
                    >
                      {isStrong ? `✓ ${sub}` : `+ ${sub}`}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleGeneratePlan}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-emerald-600/90 via-teal-600/90 to-indigo-600/90 hover:from-emerald-500 hover:to-indigo-500 text-white font-bold text-sm py-3.5 px-4 rounded-2xl shadow-[0_4px_16px_rgba(16,185,129,0.3)] border border-white/20 flex items-center justify-center gap-2 backdrop-blur-md transition transform active:scale-98 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>{isGenerating ? 'AI Generating Timetable...' : 'Generate My Daily Timetable'}</span>
            </button>

          </div>

          {/* Generated Plan Output Column */}
          <div className="lg:col-span-7 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-7 shadow-[0_8px_32px_rgba(0,0,0,0.37)] flex flex-col justify-between">
            
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <ListTodo className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-base font-bold text-white">Daily Execution Timetable</h3>
                </div>

                {generatedPlan && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopy}
                      className="bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-xl border border-white/15 flex items-center gap-1.5 backdrop-blur-md transition"
                      title="Copy to Clipboard"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copied ? 'Copied!' : 'Copy'}</span>
                    </button>
                    <button
                      onClick={handlePrint}
                      className="bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-xl border border-white/15 flex items-center gap-1.5 backdrop-blur-md transition"
                      title="Print Timetable"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Plan Output Content */}
              <div className="mt-4">
                {isGenerating ? (
                  <div className="py-20 text-center space-y-3">
                    <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-sm text-slate-300 font-semibold">AI is analyzing weightage & scheduling {dailyHours} hours slots...</p>
                  </div>
                ) : generatedPlan ? (
                  <div className="prose prose-invert max-w-none text-xs sm:text-sm text-slate-200 space-y-3 leading-relaxed whitespace-pre-line bg-white/[0.03] backdrop-blur-md p-5 rounded-2xl border border-white/10">
                    {generatedPlan}
                  </div>
                ) : (
                  <div className="py-16 text-center space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-white/[0.06] border border-white/15 flex items-center justify-center text-emerald-400 mx-auto shadow-inner backdrop-blur-md">
                      <Clock className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-base font-bold text-white">No Timetable Generated Yet</h4>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto">
                        Adjust your daily study hours and weak subjects on the left, then click <strong>Generate My Daily Timetable</strong>.
                      </p>
                    </div>
                    <button
                      onClick={handleGeneratePlan}
                      className="bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-white/20 shadow-md backdrop-blur-md transition"
                    >
                      Create Default 6-Hour Schedule
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Timetable Golden Rules Banner */}
            <div className="mt-6 pt-4 border-t border-white/10 text-xs text-slate-400 flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Tip: Follow the 50-minute study + 10-minute active recall Pomodoro rhythm for peak retention.</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
