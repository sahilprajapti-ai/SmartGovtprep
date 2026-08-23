import React, { useState } from 'react';
import { 
  Award, 
  Search, 
  Sparkles, 
  User, 
  Bell, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  FileText, 
  BarChart3, 
  Crown,
  Menu,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const { 
    user, 
    setIsAuthModalOpen,
    openAuthModal, 
    setIsProfileModalOpen, 
    setIsPricingModalOpen, 
    setIsAiModalOpen,
    searchQuery,
    setSearchQuery 
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Exams', href: '#upcoming-exams', icon: Clock },
    { label: 'Syllabus', href: '#syllabus-explorer', icon: BookOpen },
    { label: 'Current Affairs', href: '#current-affairs', icon: Bell },
    { label: 'Mock Test', href: '#mock-tests', icon: CheckCircle2 },
    { label: 'Study Planner', href: '#study-planner', icon: Sparkles },
    { label: 'Resources', href: '#resources', icon: FileText },
    { label: 'Tracker', href: '#progress-tracker', icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/70 backdrop-blur-2xl border-b border-white/10 text-slate-100 shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
      {/* Top Ticker Alert */}
      <div className="bg-gradient-to-r from-emerald-600/70 via-teal-600/70 to-indigo-600/70 backdrop-blur-md text-white text-xs py-1.5 px-4 font-medium flex items-center justify-between overflow-hidden border-b border-white/10">
        <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap animate-marquee">
          <span className="bg-white/20 text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full backdrop-blur-md border border-white/20">
            LIVE ALERTS
          </span>
          <span>📢 GPSC Class 1 & 2 Exam scheduled for June 2026</span>
          <span className="opacity-50">•</span>
          <span>🔥 Gujarat Police PSI (12,472 Posts) Physical Test dates announced</span>
          <span className="opacity-50">•</span>
          <span>⚡ SSC CGL 2026 Notification Active</span>
          <span className="opacity-50">•</span>
          <span>✨ UPSC CSE 2026 Prelims Countdown: 78 Days Left</span>
        </div>
        <button 
          onClick={() => setIsPricingModalOpen(true)}
          className="hidden md:flex items-center gap-1 bg-amber-400/90 hover:bg-amber-300 text-slate-950 px-2.5 py-0.5 rounded-lg text-xs font-bold transition shrink-0 ml-4 shadow-sm backdrop-blur-sm border border-amber-300/40"
        >
          <Crown className="w-3.5 h-3.5" />
          <span>Get Premium ₹99</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center text-white shadow-[0_4px_20px_rgba(16,185,129,0.3)] border border-white/20 group-hover:scale-105 transition backdrop-blur-md">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="font-extrabold text-lg sm:text-xl tracking-tight text-white flex items-center gap-1.5">
                <span>SmartGovt</span>
                <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">Prep</span>
                <span className="text-[10px] bg-white/10 text-indigo-300 border border-white/15 px-1.5 py-0.5 rounded-md font-mono backdrop-blur-md">
                  INDIA
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">UPSC • GPSC • SSC • Banking • Police</p>
            </div>
          </a>

          {/* Desktop Search Bar */}
          <div className="hidden lg:flex items-center relative w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search exam, syllabus, PYQ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.05] border border-white/15 text-sm text-slate-200 placeholder-slate-400 rounded-xl pl-9 pr-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-400/50 focus:bg-white/[0.08] backdrop-blur-md transition shadow-inner"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/[0.08] border border-transparent hover:border-white/10 backdrop-blur-sm transition-all"
                >
                  <Icon className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{link.label}</span>
                </a>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* AI Study Assistant Button */}
            <button
              onClick={() => setIsAiModalOpen(true)}
              className="relative flex items-center gap-1.5 bg-gradient-to-r from-indigo-600/90 to-violet-600/90 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-[0_4px_16px_rgba(99,102,241,0.3)] hover:shadow-indigo-500/40 border border-white/20 backdrop-blur-md transition transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span className="hidden sm:inline">AI Assistant</span>
              <span className="sm:hidden">AI Mentor</span>
              <span className="text-[10px] bg-white/20 text-amber-200 px-1.5 py-0.5 rounded-md ml-0.5 backdrop-blur-sm font-mono border border-white/15">
                {user.tier === 'free' ? `${5 - user.aiQueriesUsedToday} left` : 'PRO'}
              </span>
            </button>

            {/* Plan Tier Pill */}
            <button
              onClick={() => setIsPricingModalOpen(true)}
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold border backdrop-blur-md transition ${
                user.tier === 'pro'
                  ? 'bg-purple-900/40 border-purple-400/40 text-purple-300 hover:bg-purple-800/40'
                  : user.tier === 'premium'
                  ? 'bg-amber-900/40 border-amber-400/40 text-amber-300 hover:bg-amber-800/40'
                  : 'bg-white/[0.05] border-white/15 text-slate-300 hover:border-emerald-400/40 hover:bg-white/[0.08]'
              }`}
            >
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span className="capitalize">{user.tier} Plan</span>
            </button>

            {/* Login / Register Quick Action */}
            <button
              onClick={() => openAuthModal('login')}
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 backdrop-blur-md transition"
              title="Sign In or Register Aspirant Account"
            >
              <span>Login / Register</span>
            </button>

            {/* Profile / Auth Button */}
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center gap-2 bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 text-slate-200 text-xs font-semibold px-2.5 py-2 rounded-xl backdrop-blur-md transition shadow-sm"
              title="Student Profile & Dashboard"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-xs shadow-inner">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="hidden lg:inline max-w-[110px] truncate font-medium">
                {user.name ? user.name.split(' ')[0] : 'Profile'}
              </span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-slate-300 hover:text-white rounded-xl bg-white/[0.05] border border-white/10 hover:bg-white/[0.1] transition backdrop-blur-md"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-slate-950/95 backdrop-blur-2xl border-b border-white/10 px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
          {/* Mobile Search */}
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search UPSC, GPSC, Police, SSC..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.05] border border-white/15 text-sm text-slate-200 placeholder-slate-400 rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-400/50 backdrop-blur-md"
            />
          </div>

          {/* Quick Login / Register Mobile Bar */}
          <div className="flex gap-2 p-1.5 bg-white/[0.03] border border-white/10 rounded-2xl">
            <button
              onClick={() => {
                openAuthModal('login');
                setMobileMenuOpen(false);
              }}
              className="flex-1 bg-emerald-600/80 hover:bg-emerald-600 text-white text-xs font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In / Login</span>
            </button>
            <button
              onClick={() => {
                openAuthModal('register');
                setMobileMenuOpen(false);
              }}
              className="flex-1 bg-white/[0.06] hover:bg-white/[0.12] text-emerald-300 text-xs font-semibold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 border border-white/10 transition"
            >
              <span>Register Free</span>
            </button>
          </div>

          {/* Mobile Links */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 backdrop-blur-md transition"
                >
                  <Icon className="w-4 h-4 text-emerald-400" />
                  <span>{link.label}</span>
                </a>
              );
            })}
          </div>

          <div className="flex gap-2 pt-2 border-t border-white/10">
            <button
              onClick={() => {
                setIsPricingModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="flex-1 bg-amber-500/90 hover:bg-amber-400 text-slate-950 text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-md backdrop-blur-md border border-white/20"
            >
              <Crown className="w-4 h-4" />
              <span>Premium ₹99</span>
            </button>
            <button
              onClick={() => {
                setIsProfileModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="flex-1 bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 text-xs font-semibold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 border border-white/15 backdrop-blur-md transition"
            >
              <User className="w-4 h-4" />
              <span>My Profile & Stats</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
