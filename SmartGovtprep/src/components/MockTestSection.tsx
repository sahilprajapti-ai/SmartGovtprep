import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Award, 
  HelpCircle, 
  RotateCcw, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Flame, 
  AlertCircle,
  BarChart3,
  Zap,
  Crown
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { MOCK_TESTS_DATA } from '../data/mockData';
import { MockTest, MockQuestion } from '../types';

export const MockTestSection: React.FC = () => {
  const { 
    user, 
    useMcqAttempt, 
    saveMockResult, 
    setIsPricingModalOpen, 
    setIsAiModalOpen 
  } = useApp();

  const [activeTest, setActiveTest] = useState<MockTest>(MOCK_TESTS_DATA[0]);
  const [testStarted, setTestStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<number, boolean>>({});
  const [secondsRemaining, setSecondsRemaining] = useState(activeTest.durationMinutes * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showExplanations, setShowExplanations] = useState(false);

  // Timer Effect
  useEffect(() => {
    let timer: any;
    if (testStarted && !isSubmitted && secondsRemaining > 0) {
      timer = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [testStarted, isSubmitted, secondsRemaining]);

  const handleStartTest = (test: MockTest) => {
    if (user.tier === 'free' && user.mcqsAttemptedToday >= 5) {
      setIsPricingModalOpen(true);
      return;
    }
    setActiveTest(test);
    setTestStarted(true);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setMarkedForReview({});
    setSecondsRemaining(test.durationMinutes * 60);
    setIsSubmitted(false);
    setShowExplanations(false);
  };

  const handleSelectOption = (optionIndex: number) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: optionIndex,
    }));
    useMcqAttempt();
  };

  const handleToggleReview = () => {
    setMarkedForReview((prev) => ({
      ...prev,
      [currentQuestionIndex]: !prev[currentQuestionIndex],
    }));
  };

  const calculateScore = () => {
    let correct = 0;
    let wrong = 0;
    let unattempted = 0;

    activeTest.questions.forEach((q, idx) => {
      const ans = userAnswers[idx];
      if (ans === undefined) {
        unattempted++;
      } else if (ans === q.correctIndex) {
        correct++;
      } else {
        wrong++;
      }
    });

    const marksPerQ = activeTest.totalMarks / activeTest.questions.length;
    const rawScore = (correct * marksPerQ) - (wrong * activeTest.negativeMarking);
    const finalScore = Math.max(0, Number(rawScore.toFixed(2)));
    const totalAttempted = correct + wrong;
    const accuracy = totalAttempted > 0 ? Math.round((correct / totalAttempted) * 100) : 0;

    return { correct, wrong, unattempted, finalScore, accuracy };
  };

  const handleSubmitTest = () => {
    if (isSubmitted) return;
    setIsSubmitted(true);

    const { correct, wrong, unattempted, finalScore, accuracy } = calculateScore();

    // Trigger celebration if passed well
    if (accuracy >= 60) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {}
    }

    saveMockResult({
      id: `mock-res-${Date.now()}`,
      testId: activeTest.id,
      testTitle: activeTest.title,
      date: new Date().toISOString().split('T')[0],
      score: finalScore,
      totalMarks: activeTest.totalMarks,
      correctCount: correct,
      wrongCount: wrong,
      unattemptedCount: unattempted,
      accuracy,
      timeSpentSeconds: (activeTest.durationMinutes * 60) - secondsRemaining,
    });
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const currentQ: MockQuestion = activeTest.questions[currentQuestionIndex];
  const results = isSubmitted ? calculateScore() : null;

  return (
    <section id="mock-tests" className="py-14 text-slate-100 border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Real Exam Computer-Based Testing (CBT)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Live Mock Test & Speed Simulator
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl font-normal">
              Authentic multi-choice questions with standard negative marking (0.33 / 0.5), live countdown clock, question palette, and bilingual step-by-step solutions.
            </p>
          </div>

          {/* Daily MCQ Quota Pill */}
          <div className="bg-white/[0.05] backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 flex items-center gap-3 text-xs">
            <span className="text-slate-300">Daily Free Quota:</span>
            <span className="font-bold text-amber-400 font-mono">
              {user.tier === 'free' ? `${Math.max(0, 5 - user.mcqsAttemptedToday)} / 5 Left` : 'Unlimited Pro'}
            </span>
            {user.tier === 'free' && (
              <button
                onClick={() => setIsPricingModalOpen(true)}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-2.5 py-1 rounded-lg text-[11px] transition shadow-sm"
              >
                Upgrade ₹99
              </button>
            )}
          </div>
        </div>

        {/* Test Selector Tabs */}
        {!testStarted && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {MOCK_TESTS_DATA.map((test) => (
              <div
                key={test.id}
                onClick={() => setActiveTest(test)}
                className={`cursor-pointer rounded-3xl p-6 border transition-all duration-300 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.37)] flex flex-col justify-between ${
                  activeTest.id === test.id
                    ? 'border-emerald-400/80 ring-2 ring-emerald-500/30 bg-white/[0.08] shadow-[0_8px_32px_rgba(16,185,129,0.25)]'
                    : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/20 hover:-translate-y-1'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/10 text-emerald-300 border border-white/15 backdrop-blur-md">
                      {test.category}
                    </span>
                    <span className="text-xs text-slate-300 flex items-center gap-1.5 font-mono">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      {test.durationMinutes} Mins
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mt-3.5 leading-snug">{test.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{test.description}</p>
                </div>

                <div>
                  <div className="mt-5 pt-3.5 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-slate-400">{test.questions.length} High-Yield MCQs</span>
                    <span className="font-semibold text-amber-400 font-mono">Total Marks: {test.totalMarks}</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartTest(test);
                    }}
                    className="w-full mt-4 bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-bold py-3 rounded-2xl shadow-[0_4px_16px_rgba(16,185,129,0.25)] border border-white/20 flex items-center justify-center gap-2 backdrop-blur-md transition"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Start Live Mock Test</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Active Mock Test Screen */}
        {testStarted && !isSubmitted && (
          <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-[0_12px_48px_rgba(0,0,0,0.5)]">
            
            {/* Header: Test Title & Live Timer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">{activeTest.category} CBT</span>
                <h3 className="text-lg font-bold text-white">{activeTest.title}</h3>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-rose-950/40 border border-rose-500/30 text-rose-300 px-4 py-2 rounded-2xl font-mono text-sm font-bold shadow-inner backdrop-blur-md">
                  <Clock className="w-4 h-4 text-rose-400 animate-pulse" />
                  <span>{formatTimer(secondsRemaining)}</span>
                </div>

                <button
                  onClick={handleSubmitTest}
                  className="bg-red-600/90 hover:bg-red-500 text-white text-xs font-bold px-5 py-2.5 rounded-2xl shadow-[0_4px_16px_rgba(239,68,68,0.3)] border border-white/20 backdrop-blur-md transition"
                >
                  Submit Test
                </button>
              </div>
            </div>

            {/* Test Body: Question Content + Question Palette Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
              
              {/* Question Main Panel */}
              <div className="lg:col-span-8 space-y-5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Question {currentQuestionIndex + 1} of {activeTest.questions.length}</span>
                  <span className="bg-white/[0.05] border border-white/10 px-2.5 py-1 rounded-xl text-indigo-300 backdrop-blur-md">
                    Subject: {currentQ.subject}
                  </span>
                </div>

                {/* Question Statement */}
                <div className="text-base font-semibold text-white leading-relaxed whitespace-pre-line bg-white/[0.03] backdrop-blur-md p-5 rounded-2xl border border-white/10">
                  {currentQ.question}
                </div>

                {/* Options List */}
                <div className="space-y-2.5">
                  {currentQ.options.map((opt, oIdx) => {
                    const isSelected = userAnswers[currentQuestionIndex] === oIdx;
                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleSelectOption(oIdx)}
                        className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm font-medium transition backdrop-blur-md flex items-center gap-3.5 ${
                          isSelected
                            ? 'bg-emerald-600/20 border-emerald-400 text-white ring-1 ring-emerald-400 shadow-[0_4px_16px_rgba(16,185,129,0.2)]'
                            : 'bg-white/[0.03] border-white/10 text-slate-200 hover:bg-white/[0.07] hover:border-white/20'
                        }`}
                      >
                        <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 border ${
                          isSelected ? 'bg-emerald-500 border-white/30 text-white' : 'bg-white/[0.06] border-white/10 text-slate-300'
                        }`}>
                          {String.fromCharCode(65 + oIdx)}
                        </div>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Navigation and Review Controls */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <button
                      disabled={currentQuestionIndex === 0}
                      onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                      className="bg-white/[0.06] hover:bg-white/[0.12] disabled:opacity-40 text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl border border-white/15 flex items-center gap-1.5 backdrop-blur-md transition"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Previous</span>
                    </button>
                    <button
                      disabled={currentQuestionIndex === activeTest.questions.length - 1}
                      onClick={() => setCurrentQuestionIndex((prev) => Math.min(activeTest.questions.length - 1, prev + 1))}
                      className="bg-white/[0.06] hover:bg-white/[0.12] disabled:opacity-40 text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl border border-white/15 flex items-center gap-1.5 backdrop-blur-md transition"
                    >
                      <span>Next</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={handleToggleReview}
                    className={`text-xs font-semibold px-4 py-2.5 rounded-xl border backdrop-blur-md transition ${
                      markedForReview[currentQuestionIndex]
                        ? 'bg-purple-950/50 border-purple-500 text-purple-200 shadow-sm'
                        : 'bg-white/[0.04] border-white/10 text-slate-300 hover:text-white hover:bg-white/[0.08]'
                    }`}
                  >
                    {markedForReview[currentQuestionIndex] ? '★ Marked for Review' : 'Mark for Review'}
                  </button>
                </div>
              </div>

              {/* Question Palette Sidebar */}
              <div className="lg:col-span-4 bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl p-4 space-y-4">
                <div className="font-bold text-xs text-slate-200 uppercase tracking-wider">
                  Question Palette:
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {activeTest.questions.map((_, idx) => {
                    const isAnswered = userAnswers[idx] !== undefined;
                    const isMarked = markedForReview[idx];
                    const isCurrent = currentQuestionIndex === idx;

                    return (
                      <button
                        key={idx}
                        onClick={() => setCurrentQuestionIndex(idx)}
                        className={`h-9 rounded-xl text-xs font-bold transition flex items-center justify-center border backdrop-blur-md ${
                          isCurrent
                            ? 'ring-2 ring-emerald-400 border-emerald-400'
                            : ''
                        } ${
                          isAnswered
                            ? 'bg-emerald-600/90 text-white border-white/30 shadow-sm'
                            : isMarked
                            ? 'bg-purple-600/90 text-white border-white/30'
                            : 'bg-white/[0.04] text-slate-300 border-white/10 hover:bg-white/[0.08]'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="pt-3 border-t border-white/10 space-y-2 text-[11px] text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-600" />
                    <span>Answered ({Object.keys(userAnswers).length})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-purple-600" />
                    <span>Marked for Review ({Object.values(markedForReview).filter(Boolean).length})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-white/[0.08] border border-white/15" />
                    <span>Unattempted ({activeTest.questions.length - Object.keys(userAnswers).length})</span>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* Results & Score Card View */}
        {isSubmitted && results && (
          <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-[0_12px_48px_rgba(0,0,0,0.5)] space-y-6">
            
            {/* Header Result */}
            <div className="text-center space-y-2 pb-6 border-b border-white/10">
              <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3.5 py-1 rounded-full text-xs font-bold backdrop-blur-md">
                <Award className="w-4 h-4" />
                <span>Test Completed Successfully</span>
              </div>
              <h3 className="text-2xl font-black text-white">{activeTest.title}</h3>
              <p className="text-xs text-slate-400">Review your detailed performance diagnostics below</p>
            </div>

            {/* Score Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="bg-white/[0.04] backdrop-blur-md border border-white/10 rounded-2xl p-4">
                <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
                  {results.finalScore} / {activeTest.totalMarks}
                </div>
                <div className="text-xs text-slate-400 mt-1 font-semibold">Final Score</div>
              </div>
              <div className="bg-white/[0.04] backdrop-blur-md border border-white/10 rounded-2xl p-4">
                <div className="text-2xl sm:text-3xl font-black text-indigo-400 font-mono">
                  {results.accuracy}%
                </div>
                <div className="text-xs text-slate-400 mt-1 font-semibold">Accuracy Rate</div>
              </div>
              <div className="bg-white/[0.04] backdrop-blur-md border border-white/10 rounded-2xl p-4">
                <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
                  {results.correct}
                </div>
                <div className="text-xs text-slate-400 mt-1 font-semibold">Correct Answers</div>
              </div>
              <div className="bg-white/[0.04] backdrop-blur-md border border-white/10 rounded-2xl p-4">
                <div className="text-2xl sm:text-3xl font-black text-rose-400 font-mono">
                  {results.wrong}
                </div>
                <div className="text-xs text-slate-400 mt-1 font-semibold">Wrong Answers</div>
              </div>
            </div>

            {/* Actions: Re-take / View Detailed Solutions / Ask AI */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => handleStartTest(activeTest)}
                className="bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 text-xs font-bold px-4 py-3 rounded-2xl border border-white/15 flex items-center gap-2 backdrop-blur-md transition"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Re-Attempt Test</span>
              </button>

              <button
                onClick={() => setShowExplanations(!showExplanations)}
                className="bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-bold px-5 py-3 rounded-2xl shadow-[0_4px_16px_rgba(16,185,129,0.25)] border border-white/20 backdrop-blur-md transition"
              >
                {showExplanations ? 'Hide Solutions' : 'View Question-by-Question Solutions'}
              </button>

              <button
                onClick={() => setIsAiModalOpen(true)}
                className="bg-gradient-to-r from-indigo-600/90 to-violet-600/90 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-[0_4px_16px_rgba(99,102,241,0.25)] border border-white/20 flex items-center gap-2 backdrop-blur-md transition"
              >
                <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                <span>AI Deep Diagnostic Analysis</span>
              </button>
            </div>

            {/* Detailed Solutions Drawer */}
            {showExplanations && (
              <div className="space-y-4 pt-4 border-t border-white/10">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  Detailed Solutions & Explanations:
                </h4>

                {activeTest.questions.map((q, idx) => {
                  const studentAns = userAnswers[idx];
                  const isCorrect = studentAns === q.correctIndex;
                  const isUnattempted = studentAns === undefined;

                  return (
                    <div
                      key={q.id}
                      className={`p-5 rounded-2xl border backdrop-blur-md ${
                        isCorrect
                          ? 'bg-emerald-950/20 border-emerald-500/40'
                          : isUnattempted
                          ? 'bg-white/[0.02] border-white/10'
                          : 'bg-rose-950/20 border-rose-500/40'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
                        <span className="font-bold text-slate-300">Q{idx + 1}. {q.subject}</span>
                        <span className={`font-bold px-2.5 py-0.5 rounded-full text-[11px] border backdrop-blur-md ${
                          isCorrect
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : isUnattempted
                            ? 'bg-white/10 text-slate-300 border-white/10'
                            : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        }`}>
                          {isCorrect ? '✓ Correct' : isUnattempted ? '○ Unattempted' : '✗ Wrong'}
                        </span>
                      </div>

                      <div className="text-xs sm:text-sm font-semibold text-white mt-3 leading-relaxed whitespace-pre-line">
                        {q.question}
                      </div>

                      {/* Options Recap */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3.5 text-xs">
                        {q.options.map((opt, oIdx) => {
                          const isKey = oIdx === q.correctIndex;
                          const isChosen = studentAns === oIdx;

                          return (
                            <div
                              key={oIdx}
                              className={`p-3 rounded-xl border backdrop-blur-md flex items-center justify-between ${
                                isKey
                                  ? 'bg-emerald-900/40 border-emerald-500 text-emerald-200 font-bold'
                                  : isChosen
                                  ? 'bg-rose-900/40 border-rose-500 text-rose-200'
                                  : 'bg-white/[0.03] border-white/10 text-slate-300'
                              }`}
                            >
                              <span>{String.fromCharCode(65 + oIdx)}. {opt}</span>
                              {isKey && <span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded font-bold">CORRECT</span>}
                              {isChosen && !isKey && <span className="text-[10px] bg-rose-500 text-white px-1.5 py-0.5 rounded font-bold">YOU CHOSE</span>}
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation Box */}
                      <div className="mt-3.5 bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-xl p-3.5 text-xs text-slate-300">
                        <strong className="text-amber-400 font-bold">Explanation: </strong>
                        {q.explanation}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

      </div>
    </section>
  );
};
