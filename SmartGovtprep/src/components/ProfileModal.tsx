import React, { useState } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Crown, 
  Flame, 
  Clock, 
  Award, 
  Target, 
  LogOut, 
  Edit3, 
  Save, 
  BookOpen, 
  ShieldCheck, 
  Sparkles,
  ChevronRight,
  UserPlus
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EXAM_CATEGORIES } from '../data/mockData';
import { ExamCategoryType } from '../types';

export const ProfileModal: React.FC = () => {
  const { 
    user, 
    isProfileModalOpen, 
    setIsProfileModalOpen, 
    openAuthModal, 
    logoutUser, 
    updateUserProfile,
    setIsPricingModalOpen,
    quickDemoLogin
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [mobile, setMobile] = useState(user.mobile);
  const [targetExam, setTargetExam] = useState<ExamCategoryType>(user.targetExam);
  const [targetYear, setTargetYear] = useState(user.targetYear || '2026');
  const [state, setState] = useState(user.state || 'Gujarat');
  const [language, setLanguage] = useState<'English' | 'Gujarati' | 'Hindi'>(user.preferredLanguage || 'English');
  const [showToast, setShowToast] = useState(false);

  if (!isProfileModalOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      email,
      mobile,
      targetExam,
      targetYear,
      state,
      preferredLanguage: language,
    });
    setIsEditing(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xl animate-fadeIn">
      <div className="bg-slate-900/90 backdrop-blur-2xl border border-white/15 rounded-3xl w-full max-w-2xl max-h-[90vh] shadow-[0_16px_48px_rgba(0,0,0,0.6)] overflow-y-auto flex flex-col">
        
        {/* Modal Header */}
        <div className="bg-white/[0.04] px-6 py-5 border-b border-white/10 flex items-center justify-between backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center text-white shadow-md border border-white/20 backdrop-blur-md font-black text-sm">
              {user.name ? user.name.charAt(0).toUpperCase() : 'S'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg text-white">
                  Student Aspirant Profile
                </h3>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border backdrop-blur-md uppercase ${
                  user.tier === 'pro'
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                    : user.tier === 'premium'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                }`}>
                  {user.tier} Pass
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {user.email || 'SmartGovtPrep Aspirant ID: ' + user.id}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsProfileModalOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/[0.08] transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          
          {/* Toast Notification */}
          {showToast && (
            <div className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs px-4 py-2.5 rounded-2xl flex items-center gap-2 backdrop-blur-md animate-fadeIn">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Profile details updated successfully!</span>
            </div>
          )}

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-3.5 backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Daily Streak</span>
              </div>
              <div className="text-xl font-black text-amber-400 font-mono">
                {user.streakDays} Days
              </div>
            </div>

            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-3.5 backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>Study Time</span>
              </div>
              <div className="text-xl font-black text-emerald-400 font-mono">
                {user.totalStudyHours}h Total
              </div>
            </div>

            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-3.5 backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                <Award className="w-4 h-4 text-indigo-400" />
                <span>Mock Accuracy</span>
              </div>
              <div className="text-xl font-black text-indigo-400 font-mono">
                {user.accuracyRate}%
              </div>
            </div>

            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-3.5 backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                <Target className="w-4 h-4 text-rose-400" />
                <span>Target Exam</span>
              </div>
              <div className="text-sm font-black text-white truncate">
                {user.targetExam} {user.targetYear}
              </div>
            </div>
          </div>

          {/* Profile Details (View or Edit Form) */}
          <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-5 sm:p-6 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-400" />
                <h4 className="font-bold text-white text-sm">Personal & Preparation Info</h4>
              </div>
              {!isEditing ? (
                <button
                  onClick={() => {
                    setName(user.name);
                    setEmail(user.email);
                    setMobile(user.mobile);
                    setTargetExam(user.targetExam);
                    setTargetYear(user.targetYear || '2026');
                    setState(user.state || 'Gujarat');
                    setLanguage(user.preferredLanguage || 'English');
                    setIsEditing(true);
                  }}
                  className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md transition"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Info</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-xs text-slate-400 hover:text-white px-3 py-1 rounded-xl bg-white/[0.04]"
                >
                  Cancel
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1 font-medium">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white/[0.04] border border-white/15 rounded-2xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 backdrop-blur-md"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-1 font-medium">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/[0.04] border border-white/15 rounded-2xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 backdrop-blur-md"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-1 font-medium">Mobile Number</label>
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className="w-full bg-white/[0.04] border border-white/15 rounded-2xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 backdrop-blur-md"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-1 font-medium">Primary Target Exam</label>
                    <select
                      value={targetExam}
                      onChange={(e) => setTargetExam(e.target.value as ExamCategoryType)}
                      className="w-full bg-slate-900 border border-white/15 rounded-2xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50 backdrop-blur-md"
                    >
                      {EXAM_CATEGORIES.map((c) => (
                        <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-1 font-medium">State / Domicile</label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full bg-slate-900 border border-white/15 rounded-2xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50 backdrop-blur-md"
                    >
                      <option value="Gujarat" className="bg-slate-900 text-white">Gujarat (GPSC / OJAS / Police)</option>
                      <option value="All India" className="bg-slate-900 text-white">All India / Central (UPSC / SSC / IBPS)</option>
                      <option value="Maharashtra" className="bg-slate-900 text-white">Maharashtra</option>
                      <option value="Rajasthan" className="bg-slate-900 text-white">Rajasthan</option>
                      <option value="Uttar Pradesh" className="bg-slate-900 text-white">Uttar Pradesh</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-1 font-medium">Preferred Language</label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value as any)}
                      className="w-full bg-slate-900 border border-white/15 rounded-2xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50 backdrop-blur-md"
                    >
                      <option value="English" className="bg-slate-900 text-white">English</option>
                      <option value="Gujarati" className="bg-slate-900 text-white">Gujarati (ગુજરાતી)</option>
                      <option value="Hindi" className="bg-slate-900 text-white">Hindi (हिन्दी)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 rounded-2xl shadow-md flex items-center gap-1.5 transition border border-white/10"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
                <div className="space-y-1">
                  <span className="text-slate-400 block text-[11px]">Full Name</span>
                  <div className="text-white font-semibold text-sm">{user.name}</div>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 block text-[11px]">Registered Email</span>
                  <div className="text-white font-medium">{user.email}</div>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 block text-[11px]">Mobile Number</span>
                  <div className="text-white font-medium">{user.mobile || 'Not set'}</div>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 block text-[11px]">Target Focus</span>
                  <div className="text-emerald-400 font-semibold">{user.targetExam} Exam ({user.targetYear})</div>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 block text-[11px]">State / Region</span>
                  <div className="text-white font-medium">{user.state || 'Gujarat'}</div>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 block text-[11px]">Study Language</span>
                  <div className="text-white font-medium">{user.preferredLanguage || 'English'}</div>
                </div>
              </div>
            )}
          </div>

          {/* Membership Tier Card */}
          <div className="bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-emerald-500/10 border border-white/15 rounded-3xl p-5 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 backdrop-blur-md">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <div className="text-white font-bold text-sm">
                  Active Subscription: <span className="capitalize text-amber-300">{user.tier} Pass</span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  {user.tier === 'free' ? 'Daily limit: 5 AI queries & 5 MCQs' : 'Unlimited AI queries, test analytics & ranker mock series'}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setIsProfileModalOpen(false);
                setIsPricingModalOpen(true);
              }}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-2xl shadow-md transition shrink-0 border border-white/20"
            >
              {user.tier === 'free' ? 'Upgrade Plan (₹99)' : 'Manage Plan'}
            </button>
          </div>

          {/* Quick Demo Aspirant Account Switcher */}
          <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-5 backdrop-blur-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">Quick Test Drive / Switch Aspirant Profile:</span>
              <span className="text-[10px] text-slate-400">Instant Demo</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => quickDemoLogin('rahul_gpsc')}
                className="bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-emerald-400/40 p-2.5 rounded-2xl text-left transition"
              >
                <div className="text-xs font-bold text-white">Rahul Patel</div>
                <div className="text-[10px] text-emerald-400">GPSC DySO (Guj)</div>
              </button>
              <button
                onClick={() => quickDemoLogin('ananya_upsc')}
                className="bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-purple-400/40 p-2.5 rounded-2xl text-left transition"
              >
                <div className="text-xs font-bold text-white">Ananya Sharma</div>
                <div className="text-[10px] text-purple-400">UPSC IAS (PRO)</div>
              </button>
              <button
                onClick={() => quickDemoLogin('rohit_police')}
                className="bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-amber-400/40 p-2.5 rounded-2xl text-left transition"
              >
                <div className="text-xs font-bold text-white">Rohit Parmar</div>
                <div className="text-[10px] text-amber-400">Gujarat PSI</div>
              </button>
              <button
                onClick={() => quickDemoLogin('priya_ssc')}
                className="bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-cyan-400/40 p-2.5 rounded-2xl text-left transition"
              >
                <div className="text-xs font-bold text-white">Priya Joshi</div>
                <div className="text-[10px] text-cyan-400">SSC CGL Tier-1</div>
              </button>
            </div>
          </div>

          {/* Account Actions (Log In with another, Register new, or Log Out) */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsProfileModalOpen(false);
                  openAuthModal('login');
                }}
                className="bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 text-xs font-semibold px-3.5 py-2 rounded-2xl border border-white/15 backdrop-blur-md transition flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
                <span>Switch / Login</span>
              </button>
              <button
                onClick={() => {
                  setIsProfileModalOpen(false);
                  openAuthModal('register');
                }}
                className="bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 text-xs font-semibold px-3.5 py-2 rounded-2xl border border-white/15 backdrop-blur-md transition flex items-center gap-1.5"
              >
                <span>Create New Account</span>
              </button>
            </div>

            <button
              onClick={logoutUser}
              className="text-rose-400 hover:text-rose-300 text-xs font-semibold px-3.5 py-2 rounded-2xl hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
