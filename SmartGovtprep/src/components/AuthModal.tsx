import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck,
  Eye,
  EyeOff,
  Sparkles,
  KeyRound,
  Send,
  Check,
  Award,
  Globe,
  Flame,
  Crown
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EXAM_CATEGORIES } from '../data/mockData';
import { ExamCategoryType } from '../types';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authModalMode, 
    setAuthModalMode,
    loginUser,
    registerUser,
    quickDemoLogin
  } = useApp();

  // Login form state
  const [loginMethod, setLoginMethod] = useState<'email' | 'mobile'>('email');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regTargetExam, setRegTargetExam] = useState<ExamCategoryType>('GPSC');
  const [regTargetYear, setRegTargetYear] = useState('2026');
  const [regState, setRegState] = useState('Gujarat');
  const [regLanguage, setRegLanguage] = useState<'English' | 'Gujarati' | 'Hindi'>('Gujarati');
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Reset states when modal opens
  useEffect(() => {
    if (isAuthModalOpen) {
      setSuccessMessage(null);
      setErrorMessage(null);
      setOtpSent(false);
      setOtpCode('');
      setGeneratedOtp(null);
    }
  }, [isAuthModalOpen, authModalMode]);

  if (!isAuthModalOpen) return null;

  // Handle Send OTP
  const handleSendOtp = () => {
    if (loginMethod === 'mobile' && (!loginPhone || loginPhone.length < 10)) {
      setErrorMessage('Please enter a valid 10-digit mobile number');
      return;
    }
    if (loginMethod === 'email' && (!loginEmail || !loginEmail.includes('@'))) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    setErrorMessage(null);
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
    setOtpSent(true);
  };

  // Handle Login Submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    setTimeout(() => {
      const emailOrMobile = loginMethod === 'email' ? loginEmail : loginPhone;
      
      if (!emailOrMobile) {
        setErrorMessage('Please fill in your login credentials');
        setLoading(false);
        return;
      }

      if (otpSent && otpCode !== generatedOtp && otpCode !== '1234') {
        setErrorMessage(`Invalid OTP code. Please enter: ${generatedOtp || '1234'}`);
        setLoading(false);
        return;
      }

      loginUser({
        emailOrMobile,
        password: loginPassword,
      });

      setLoading(false);
      setSuccessMessage(`Welcome back! Logged in successfully.`);
      setTimeout(() => {
        setIsAuthModalOpen(false);
      }, 1000);
    }, 600);
  };

  // Handle Register Submit
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!regName.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }
    if (!regEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address');
      return;
    }
    if (!agreeTerms) {
      setErrorMessage('Please accept the Aspirant Community Code & Terms');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      registerUser({
        name: regName,
        email: regEmail,
        mobile: regPhone || '+91 98765 43210',
        targetExam: regTargetExam,
        targetYear: regTargetYear,
        state: regState,
        preferredLanguage: regLanguage,
        tier: 'free',
      });

      setLoading(false);
      setSuccessMessage(`Account created! Welcome to SmartGovtPrep, ${regName.split(' ')[0]}!`);
      setTimeout(() => {
        setIsAuthModalOpen(false);
      }, 1200);
    }, 700);
  };

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, text: 'None', color: 'bg-slate-700' };
    if (pass.length < 6) return { score: 1, text: 'Weak', color: 'bg-rose-500' };
    if (pass.length < 9) return { score: 2, text: 'Medium', color: 'bg-amber-500' };
    return { score: 3, text: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(regPassword);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xl animate-fadeIn">
      <div className="bg-slate-900/90 backdrop-blur-2xl border border-white/15 rounded-3xl w-full max-w-lg shadow-[0_20px_60px_rgba(0,0,0,0.7)] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="bg-white/[0.04] px-6 py-4.5 border-b border-white/10 flex items-center justify-between backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-600 flex items-center justify-center text-white shadow-md border border-white/20 backdrop-blur-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white tracking-tight flex items-center gap-1.5">
                <span>SmartGovtPrep</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
                  ASPIRANT AUTH
                </span>
              </h3>
              <p className="text-xs text-slate-300">
                {authModalMode === 'login' 
                  ? 'Sign in to access your test series, timetable & bookmarks'
                  : 'Create a free student profile & start mock tests'
                }
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/[0.08] transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Login vs Register */}
        <div className="p-4 sm:px-6 pb-0">
          <div className="grid grid-cols-2 p-1 bg-white/[0.04] border border-white/10 rounded-2xl backdrop-blur-md">
            <button
              type="button"
              onClick={() => {
                setAuthModalMode('login');
                setErrorMessage(null);
              }}
              className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                authModalMode === 'login'
                  ? 'bg-emerald-600 text-white shadow-md border border-white/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In / Login</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthModalMode('register');
                setErrorMessage(null);
              }}
              className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                authModalMode === 'register'
                  ? 'bg-emerald-600 text-white shadow-md border border-white/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Register / New Account</span>
            </button>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          
          {/* Alerts */}
          {errorMessage && (
            <div className="bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs px-3.5 py-2.5 rounded-2xl backdrop-blur-md animate-fadeIn flex items-center justify-between">
              <span>{errorMessage}</span>
              <button onClick={() => setErrorMessage(null)} className="text-rose-400 font-bold ml-2">✕</button>
            </div>
          )}

          {successMessage && (
            <div className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs px-4 py-3 rounded-2xl backdrop-blur-md animate-fadeIn flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-semibold">{successMessage}</span>
            </div>
          )}

          {/* ======================= LOGIN VIEW ======================= */}
          {authModalMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              
              {/* Method Switch: Email vs Mobile OTP */}
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs text-slate-300 font-medium">Sign in with:</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginMethod('email');
                      setOtpSent(false);
                    }}
                    className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition ${
                      loginMethod === 'email' 
                        ? 'bg-white/[0.1] text-emerald-400 border border-emerald-400/30' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Email Address
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginMethod('mobile')}
                    className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition ${
                      loginMethod === 'mobile' 
                        ? 'bg-white/[0.1] text-emerald-400 border border-emerald-400/30' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Mobile & OTP
                  </button>
                </div>
              </div>

              {loginMethod === 'email' ? (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="aspirant@gmail.com"
                        className="w-full bg-white/[0.04] border border-white/15 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/80 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-slate-300">Password</label>
                      <button
                        type="button"
                        onClick={() => {
                          setLoginPassword('smartgovt2026');
                          setErrorMessage('Demo password autofilled: smartgovt2026');
                        }}
                        className="text-[11px] text-emerald-400 hover:underline"
                      >
                        Autofill Demo Password
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-white/[0.04] border border-white/15 rounded-2xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-400 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/80 transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3 text-slate-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Mobile Number</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type="tel"
                          required
                          value={loginPhone}
                          onChange={(e) => setLoginPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full bg-white/[0.04] border border-white/15 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/80 transition"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="bg-indigo-600/90 hover:bg-indigo-500 text-white text-xs font-bold px-3.5 py-2.5 rounded-2xl border border-white/20 shrink-0 transition flex items-center gap-1 shadow-sm"
                      >
                        <Send className="w-3 h-3" />
                        <span>{otpSent ? 'Resend OTP' : 'Send OTP'}</span>
                      </button>
                    </div>
                  </div>

                  {otpSent && (
                    <div className="space-y-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-3.5 backdrop-blur-md animate-fadeIn">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-emerald-300 font-semibold">Verification OTP Sent!</span>
                        {generatedOtp && (
                          <button
                            type="button"
                            onClick={() => setOtpCode(generatedOtp)}
                            className="text-[11px] text-amber-300 underline font-mono"
                          >
                            Autofill ({generatedOtp})
                          </button>
                        )}
                      </div>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3" />
                        <input
                          type="text"
                          maxLength={6}
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value)}
                          placeholder="Enter 4-digit OTP"
                          className="w-full bg-white/[0.06] border border-emerald-400/40 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition"
                        />
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Remember & Options */}
              <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-white/20 bg-slate-800 text-emerald-500 focus:ring-0 w-3.5 h-3.5"
                  />
                  <span>Keep me logged in</span>
                </label>
                <button
                  type="button"
                  onClick={() => setErrorMessage('Password reset link sent to your registered contact.')}
                  className="text-slate-400 hover:text-emerald-400 transition"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3 px-4 rounded-2xl shadow-[0_4px_16px_rgba(16,185,129,0.3)] transition flex items-center justify-center gap-2 border border-white/10 active:scale-[0.99] disabled:opacity-50"
              >
                {loading ? (
                  <span className="animate-pulse">Authenticating Aspirant Account...</span>
                ) : (
                  <>
                    <span>Log In to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* 1-Click Quick Demo Aspirant Logins */}
              <div className="pt-3 border-t border-white/10 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-semibold text-slate-300">Quick 1-Click Test Drive Logins:</span>
                  <span>Instant Access</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => quickDemoLogin('rahul_gpsc')}
                    className="bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-emerald-400/40 p-2.5 rounded-2xl text-left transition backdrop-blur-md"
                  >
                    <div className="text-xs font-bold text-white flex items-center justify-between">
                      <span>Rahul Patel</span>
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">GPSC</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Gujarat DySO • 4 Day Streak</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => quickDemoLogin('ananya_upsc')}
                    className="bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-purple-400/40 p-2.5 rounded-2xl text-left transition backdrop-blur-md"
                  >
                    <div className="text-xs font-bold text-white flex items-center justify-between">
                      <span>Ananya Sharma</span>
                      <span className="text-[9px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded">PRO</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">UPSC CSE • 24 Day Streak</div>
                  </button>
                </div>
              </div>

            </form>
          )}

          {/* ======================= REGISTER VIEW ======================= */}
          {authModalMode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Rahul Patel / Ananya Sharma"
                    className="w-full bg-white/[0.04] border border-white/15 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/80 transition"
                  />
                </div>
              </div>

              {/* Email & Mobile in 2 cols */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="aspirant@gmail.com"
                      className="w-full bg-white/[0.04] border border-white/15 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Mobile Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-white/[0.04] border border-white/15 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition"
                    />
                  </div>
                </div>
              </div>

              {/* Password & Strength */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Create Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full bg-white/[0.04] border border-white/15 rounded-2xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-400 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {regPassword && (
                  <div className="flex items-center gap-2 mt-1.5 px-1">
                    <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden flex gap-1">
                      <div className={`h-full flex-1 ${strength.score >= 1 ? strength.color : 'bg-slate-700'}`} />
                      <div className={`h-full flex-1 ${strength.score >= 2 ? strength.color : 'bg-slate-700'}`} />
                      <div className={`h-full flex-1 ${strength.score >= 3 ? strength.color : 'bg-slate-700'}`} />
                    </div>
                    <span className="text-[10px] text-slate-400">Strength: {strength.text}</span>
                  </div>
                )}
              </div>

              {/* Target Exam & Year in 2 cols */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Target Exam</label>
                  <select
                    value={regTargetExam}
                    onChange={(e) => setRegTargetExam(e.target.value as ExamCategoryType)}
                    className="w-full bg-slate-900 border border-white/15 rounded-2xl px-3.5 py-2.5 text-xs text-white backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition"
                  >
                    {EXAM_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id} className="bg-slate-900 text-white">
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Target Exam Year</label>
                  <select
                    value={regTargetYear}
                    onChange={(e) => setRegTargetYear(e.target.value)}
                    className="w-full bg-slate-900 border border-white/15 rounded-2xl px-3.5 py-2.5 text-xs text-white backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition"
                  >
                    <option value="2026" className="bg-slate-900 text-white">2026 (Current Cycle)</option>
                    <option value="2027" className="bg-slate-900 text-white">2027 (Next Cycle)</option>
                    <option value="2028" className="bg-slate-900 text-white">2028</option>
                  </select>
                </div>
              </div>

              {/* State & Language Preference */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">State Domicile</label>
                  <select
                    value={regState}
                    onChange={(e) => setRegState(e.target.value)}
                    className="w-full bg-slate-900 border border-white/15 rounded-2xl px-3.5 py-2.5 text-xs text-white backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition"
                  >
                    <option value="Gujarat" className="bg-slate-900 text-white">Gujarat (GPSC / Police / OJAS)</option>
                    <option value="All India" className="bg-slate-900 text-white">All India (UPSC / SSC / IBPS)</option>
                    <option value="Maharashtra" className="bg-slate-900 text-white">Maharashtra</option>
                    <option value="Rajasthan" className="bg-slate-900 text-white">Rajasthan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Study Language</label>
                  <select
                    value={regLanguage}
                    onChange={(e) => setRegLanguage(e.target.value as any)}
                    className="w-full bg-slate-900 border border-white/15 rounded-2xl px-3.5 py-2.5 text-xs text-white backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition"
                  >
                    <option value="English" className="bg-slate-900 text-white">English</option>
                    <option value="Gujarati" className="bg-slate-900 text-white">Gujarati (ગુજરાતી)</option>
                    <option value="Hindi" className="bg-slate-900 text-white">Hindi (हिन्दी)</option>
                  </select>
                </div>
              </div>

              {/* Agreement */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-300 select-none">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 rounded border-white/20 bg-slate-800 text-emerald-500 focus:ring-0 w-3.5 h-3.5"
                  />
                  <span>
                    I agree to the SmartGovtPrep Code of Conduct and Aspirant Terms of Use.
                  </span>
                </label>
              </div>

              {/* Submit Registration */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs py-3 px-4 rounded-2xl shadow-[0_4px_16px_rgba(16,185,129,0.3)] transition flex items-center justify-center gap-2 border border-white/10 active:scale-[0.99] disabled:opacity-50"
              >
                {loading ? (
                  <span className="animate-pulse">Setting up your Aspirant Dashboard...</span>
                ) : (
                  <>
                    <span>Create Free Account & Start Preparing</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>
          )}

          {/* Bottom Switcher */}
          <div className="text-center pt-2 text-xs text-slate-400">
            {authModalMode === 'login' ? (
              <p>
                Don't have an aspirant profile yet?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalMode('register');
                    setErrorMessage(null);
                  }}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold underline ml-1"
                >
                  Create Free Account
                </button>
              </p>
            ) : (
              <p>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalMode('login');
                    setErrorMessage(null);
                  }}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold underline ml-1"
                >
                  Sign In / Login
                </button>
              </p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
