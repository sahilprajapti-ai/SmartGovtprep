import React from 'react';
import { 
  Award, 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink, 
  ShieldAlert, 
  Heart,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { setSelectedCategory, setIsAiModalOpen, openAuthModal, setIsProfileModalOpen } = useApp();

  return (
    <footer className="text-slate-400 text-xs border-t border-white/10 relative">
      
      {/* Disclaimer Banner */}
      <div className="bg-white/[0.03] backdrop-blur-xl border-b border-white/10 py-3.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2.5 text-[11px] text-slate-300">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong className="text-white">Disclaimer:</strong> SmartGovtPrep is an independent educational technology and test preparation portal. We are not affiliated with or endorsed by UPSC, GPSC, SSC, IBPS, Indian Railways, or any Central/State Government agency. All examination notices and links are for informational & educational reference.
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-[0_4px_16px_rgba(16,185,129,0.3)] border border-white/20 backdrop-blur-md">
                S
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight">
                SmartGovt<span className="text-emerald-400">Prep</span>
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
              India's premier AI-powered single-page competitive examination preparation ecosystem for UPSC, GPSC, SSC, Banking, Railways & Gujarat Police aspirants.
            </p>
            <div className="pt-1 text-xs text-slate-300 space-y-1.5">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Gandhinagar & Ahmedabad, Gujarat, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                <span>support@smartgovtprep.in</span>
              </div>
            </div>
          </div>

          {/* Col 2: Top Gujarat Exams */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3">
              Gujarat State (GPSC)
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="#upcoming-exams"
                  onClick={() => setSelectedCategory('GPSC')}
                  className="hover:text-emerald-400 transition text-slate-300"
                >
                  GPSC Class 1 & 2 Officers
                </a>
              </li>
              <li>
                <a
                  href="#upcoming-exams"
                  onClick={() => setSelectedCategory('GPSC')}
                  className="hover:text-emerald-400 transition text-slate-300"
                >
                  DySO & Nayab Mamlatdar
                </a>
              </li>
              <li>
                <a
                  href="#upcoming-exams"
                  onClick={() => setSelectedCategory('Police')}
                  className="hover:text-emerald-400 transition text-slate-300"
                >
                  Gujarat Police PSI & LRD
                </a>
              </li>
              <li>
                <a
                  href="#upcoming-exams"
                  onClick={() => setSelectedCategory('Teaching')}
                  className="hover:text-emerald-400 transition text-slate-300"
                >
                  GSERC TET-1/2 & TAT Exam
                </a>
              </li>
              <li>
                <a
                  href="https://ojas.gujarat.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition flex items-center gap-1 text-slate-300"
                >
                  <span>OJAS Gujarat Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Central Govt Exams */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3">
              All-India Central Exams
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="#upcoming-exams"
                  onClick={() => setSelectedCategory('UPSC')}
                  className="hover:text-emerald-400 transition text-slate-300"
                >
                  UPSC Civil Services (CSE)
                </a>
              </li>
              <li>
                <a
                  href="#upcoming-exams"
                  onClick={() => setSelectedCategory('SSC')}
                  className="hover:text-emerald-400 transition text-slate-300"
                >
                  SSC CGL & CHSL 2026
                </a>
              </li>
              <li>
                <a
                  href="#upcoming-exams"
                  onClick={() => setSelectedCategory('Banking')}
                  className="hover:text-emerald-400 transition text-slate-300"
                >
                  IBPS PO & SBI Clerk
                </a>
              </li>
              <li>
                <a
                  href="#upcoming-exams"
                  onClick={() => setSelectedCategory('Railway')}
                  className="hover:text-emerald-400 transition text-slate-300"
                >
                  RRB NTPC & Group D
                </a>
              </li>
              <li>
                <a
                  href="https://upsc.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition flex items-center gap-1 text-slate-300"
                >
                  <span>UPSC Official Website</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Quick Portals & AI */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3">
              Tools & Legal
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#study-planner" className="hover:text-emerald-400 transition text-slate-300">
                  AI Study Timetable Generator
                </a>
              </li>
              <li>
                <a href="#mock-tests" className="hover:text-emerald-400 transition text-slate-300">
                  CBT Live Mock Tests
                </a>
              </li>
              <li>
                <a href="#current-affairs" className="hover:text-emerald-400 transition text-slate-300">
                  Daily Current Affairs
                </a>
              </li>
              <li>
                <a href="#resources" className="hover:text-emerald-400 transition text-slate-300">
                  Download PYQ Papers
                </a>
              </li>
              <li>
                <button
                  onClick={() => openAuthModal('login')}
                  className="hover:text-emerald-400 transition text-slate-300"
                >
                  Student Login
                </button>
              </li>
              <li>
                <button
                  onClick={() => openAuthModal('register')}
                  className="hover:text-emerald-400 transition text-slate-300"
                >
                  Create Aspirant Account
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsProfileModalOpen(true)}
                  className="hover:text-emerald-400 transition text-slate-300"
                >
                  My Dashboard & Stats
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsAiModalOpen(true)}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Ask AI Mentor 24/7</span>
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © 2026 SmartGovtPrep Portal. Built for Indian Civil Services & Competitive Aspirants.
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="hover:text-slate-200 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-200 cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-slate-200 cursor-pointer">Syllabus Archive</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
