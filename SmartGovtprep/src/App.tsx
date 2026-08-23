import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ExamCategoriesSection } from './components/ExamCategoriesSection';
import { UpcomingExamsSection } from './components/UpcomingExamsSection';
import { ExamSyllabusSection } from './components/ExamSyllabusSection';
import { CurrentAffairsSection } from './components/CurrentAffairsSection';
import { MockTestSection } from './components/MockTestSection';
import { SmartStudyPlannerSection } from './components/SmartStudyPlannerSection';
import { ProgressTrackerSection } from './components/ProgressTrackerSection';
import { ResourcesSection } from './components/ResourcesSection';
import { Footer } from './components/Footer';
import { AIAssistantModal } from './components/AIAssistantModal';
import { PricingModal } from './components/PricingModal';
import { AuthModal } from './components/AuthModal';
import { ProfileModal } from './components/ProfileModal';
import { Sparkles, Bot } from 'lucide-react';

const MainPortalContent: React.FC = () => {
  const { setIsAiModalOpen, user } = useApp();

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 selection:bg-emerald-500 selection:text-white relative overflow-x-hidden">
      {/* Dynamic Ambient Background Glowing Mesh / Frosted Light Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Top-left Teal/Emerald Glow */}
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-emerald-500/12 rounded-full blur-[140px]" />
        {/* Center Cyan Glow */}
        <div className="absolute top-[25%] -right-40 w-[550px] h-[550px] bg-cyan-500/10 rounded-full blur-[150px]" />
        {/* Mid-page Indigo Glow */}
        <div className="absolute top-[50%] left-[10%] w-[650px] h-[650px] bg-indigo-600/12 rounded-full blur-[160px]" />
        {/* Lower Violet Glow */}
        <div className="absolute top-[75%] right-[5%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px]" />
        {/* Bottom Emerald Glow */}
        <div className="absolute -bottom-40 left-1/3 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[160px]" />
        {/* Subtle noise/grid overlay feel */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:32px_32px] opacity-40" />
      </div>

      {/* Top Navbar */}
      <Navbar />

      <main className="relative z-10">
        {/* 1. Hero Section with Live Countdown & Search */}
        <HeroSection />

        {/* 2. Exam Categories (UPSC, GPSC, SSC, Banking, Railway, Police, Teaching) */}
        <ExamCategoriesSection />

        {/* 3. Upcoming Exams with Live Notifications & Eligibility */}
        <UpcomingExamsSection />

        {/* 4. Exam Syllabus Explorer & Weightage Breakdown */}
        <ExamSyllabusSection />

        {/* 5. Daily Current Affairs (National, Gujarat Special, Economy, Science) */}
        <CurrentAffairsSection />

        {/* 6. Real CBT Mock Test Simulator with Timer & Scorecard */}
        <MockTestSection />

        {/* 7. Smart AI Daily Study Timetable Planner */}
        <SmartStudyPlannerSection />

        {/* 8. Student Progress & Analytics Tracker */}
        <ProgressTrackerSection />

        {/* 9. Important PYQs, Notes & Official Govt Portals */}
        <ResourcesSection />
      </main>

      {/* Footer & Non-Affiliation Legal Disclaimer */}
      <Footer />

      {/* Floating AI Mentor Button - Frosted Glass Pill */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsAiModalOpen(true)}
          className="group relative flex items-center gap-2.5 bg-slate-900/80 hover:bg-slate-800/90 backdrop-blur-xl text-white font-bold text-xs sm:text-sm px-4 py-3.5 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.5)] hover:shadow-emerald-500/25 transition-all duration-300 transform hover:-translate-y-1 active:scale-95 border border-white/20 hover:border-emerald-400/50"
          title="Ask AI Exam Mentor"
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-emerald-500 to-indigo-500 flex items-center justify-center shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
          </div>
          <span className="font-extrabold tracking-wide bg-gradient-to-r from-white via-slate-100 to-slate-200 bg-clip-text text-transparent">
            Ask AI Mentor
          </span>
          <span className="hidden sm:inline-block bg-white/10 text-emerald-300 text-[10px] font-mono px-2 py-0.5 rounded-full border border-white/15 backdrop-blur-md">
            {user.tier === 'free' ? `${Math.max(0, 5 - user.aiQueriesUsedToday)} left` : 'PRO'}
          </span>
        </button>
      </div>

      {/* Global Interactive Modals */}
      <AIAssistantModal />
      <PricingModal />
      <AuthModal />
      <ProfileModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainPortalContent />
    </AppProvider>
  );
}
