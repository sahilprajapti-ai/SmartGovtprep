import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, MockAttemptHistory, ExamCategoryType } from '../types';

interface AppContextType {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  mockHistory: MockAttemptHistory[];
  saveMockResult: (result: MockAttemptHistory) => void;
  toggleSavedExam: (examId: string) => void;
  useAiQuery: () => boolean;
  canAttemptMock: () => boolean;
  useMcqAttempt: () => boolean;
  upgradeTier: (tier: 'free' | 'premium' | 'pro', expiryDate?: string) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register';
  setAuthModalMode: (mode: 'login' | 'register') => void;
  openAuthModal: (mode?: 'login' | 'register') => void;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;
  isPricingModalOpen: boolean;
  setIsPricingModalOpen: (open: boolean) => void;
  isAiModalOpen: boolean;
  setIsAiModalOpen: (open: boolean) => void;
  selectedCategory: ExamCategoryType | 'ALL';
  setSelectedCategory: (cat: ExamCategoryType | 'ALL') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  loginUser: (data: { emailOrMobile: string; password?: string; name?: string; targetExam?: ExamCategoryType; state?: string; tier?: 'free' | 'premium' | 'pro' }) => void;
  registerUser: (data: Partial<UserProfile>) => void;
  logoutUser: () => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  quickDemoLogin: (profileKey: 'rahul_gpsc' | 'ananya_upsc' | 'rohit_police' | 'priya_ssc') => void;
}

const DEFAULT_USER: UserProfile = {
  id: 'usr-guest-101',
  name: 'Aspirant Rahul Patel',
  email: 'rahul.patel@smartgovtprep.in',
  mobile: '+91 98765 43210',
  targetExam: 'GPSC',
  targetYear: '2026',
  state: 'Gujarat',
  tier: 'free',
  aiQueriesUsedToday: 1,
  mcqsAttemptedToday: 2,
  lastResetDate: new Date().toISOString().split('T')[0],
  savedExams: ['gpsc-class12-2026', 'gujarat-police-psi-2026', 'ssc-cgl-2026'],
  streakDays: 4,
  totalStudyHours: 28,
  accuracyRate: 76,
  isLoggedIn: true,
  preferredLanguage: 'Gujarati',
  createdAt: '2026-08-01',
};

const INITIAL_MOCK_HISTORY: MockAttemptHistory[] = [
  {
    id: 'att-1',
    testId: 'mock-gpsc-gs1',
    testTitle: 'GPSC Class 1 & 2 Prelims Full Mock Test',
    date: '2026-08-21',
    score: 16.67,
    totalMarks: 20,
    correctCount: 7,
    wrongCount: 1,
    unattemptedCount: 0,
    accuracy: 87.5,
    timeSpentSeconds: 640,
  },
  {
    id: 'att-2',
    testId: 'mock-ssc-cgl',
    testTitle: 'SSC CGL 2026 Tier-1 Speed Booster Test',
    date: '2026-08-19',
    score: 14.5,
    totalMarks: 20,
    correctCount: 4,
    wrongCount: 1,
    unattemptedCount: 0,
    accuracy: 80,
    timeSpentSeconds: 480,
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('sgp_user_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const today = new Date().toISOString().split('T')[0];
        if (parsed.lastResetDate !== today) {
          parsed.aiQueriesUsedToday = 0;
          parsed.mcqsAttemptedToday = 0;
          parsed.lastResetDate = today;
        }
        return parsed;
      } catch (e) {
        console.error('Failed to parse user profile', e);
      }
    }
    return DEFAULT_USER;
  });

  const [mockHistory, setMockHistory] = useState<MockAttemptHistory[]>(() => {
    const saved = localStorage.getItem('sgp_mock_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse mock history', e);
      }
    }
    return INITIAL_MOCK_HISTORY;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ExamCategoryType | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const loginUser = (data: {
    emailOrMobile: string;
    password?: string;
    name?: string;
    targetExam?: ExamCategoryType;
    state?: string;
    tier?: 'free' | 'premium' | 'pro';
  }) => {
    setUser((prev) => {
      const isEmail = data.emailOrMobile.includes('@');
      const inferredName = data.name || (isEmail ? data.emailOrMobile.split('@')[0] : 'Aspirant Student');
      const formattedName = inferredName.charAt(0).toUpperCase() + inferredName.slice(1);
      return {
        ...prev,
        isLoggedIn: true,
        name: data.name || (prev.name && prev.name !== 'Aspirant Rahul Patel' ? prev.name : formattedName),
        email: isEmail ? data.emailOrMobile : (prev.email || 'student@smartgovtprep.in'),
        mobile: !isEmail ? data.emailOrMobile : (prev.mobile || '+91 98765 43210'),
        targetExam: data.targetExam || prev.targetExam,
        state: data.state || prev.state,
        tier: data.tier || prev.tier,
      };
    });
    setIsAuthModalOpen(false);
  };

  const registerUser = (data: Partial<UserProfile>) => {
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: data.name || 'New Aspirant',
      email: data.email || 'aspirant@govtprep.in',
      mobile: data.mobile || '+91 98765 43210',
      targetExam: data.targetExam || 'GPSC',
      targetYear: data.targetYear || '2026',
      state: data.state || 'Gujarat',
      tier: data.tier || 'free',
      aiQueriesUsedToday: 0,
      mcqsAttemptedToday: 0,
      lastResetDate: new Date().toISOString().split('T')[0],
      savedExams: data.targetExam === 'GPSC' ? ['gpsc-class12-2026', 'gujarat-police-psi-2026'] : ['upsc-cse-2026', 'ssc-cgl-2026'],
      streakDays: 1,
      totalStudyHours: 2,
      accuracyRate: 75,
      isLoggedIn: true,
      preferredLanguage: data.preferredLanguage || 'English',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setUser(newUser);
    setIsAuthModalOpen(false);
  };

  const logoutUser = () => {
    setUser({
      ...DEFAULT_USER,
      id: `guest-${Date.now()}`,
      name: 'Guest Aspirant',
      email: 'guest@smartgovtprep.in',
      mobile: '',
      isLoggedIn: false,
      streakDays: 0,
      totalStudyHours: 0,
      accuracyRate: 0,
      savedExams: [],
    });
    setIsProfileModalOpen(false);
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUser((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const quickDemoLogin = (profileKey: 'rahul_gpsc' | 'ananya_upsc' | 'rohit_police' | 'priya_ssc') => {
    if (profileKey === 'rahul_gpsc') {
      setUser({
        id: 'usr-rahul-gpsc',
        name: 'Rahul Patel (GPSC DySO)',
        email: 'rahul.patel@smartgovtprep.in',
        mobile: '+91 98250 12345',
        targetExam: 'GPSC',
        targetYear: '2026',
        state: 'Gujarat',
        tier: 'free',
        aiQueriesUsedToday: 1,
        mcqsAttemptedToday: 2,
        lastResetDate: new Date().toISOString().split('T')[0],
        savedExams: ['gpsc-class12-2026', 'gujarat-police-psi-2026'],
        streakDays: 7,
        totalStudyHours: 42,
        accuracyRate: 82,
        isLoggedIn: true,
        preferredLanguage: 'Gujarati',
      });
    } else if (profileKey === 'ananya_upsc') {
      setUser({
        id: 'usr-ananya-upsc',
        name: 'Ananya Sharma (UPSC IAS)',
        email: 'ananya.ias@smartgovtprep.in',
        mobile: '+91 99110 54321',
        targetExam: 'UPSC',
        targetYear: '2026',
        state: 'All India',
        tier: 'pro',
        aiQueriesUsedToday: 8,
        mcqsAttemptedToday: 15,
        lastResetDate: new Date().toISOString().split('T')[0],
        savedExams: ['upsc-cse-2026', 'ssc-cgl-2026'],
        streakDays: 24,
        totalStudyHours: 110,
        accuracyRate: 88,
        isLoggedIn: true,
        preferredLanguage: 'English',
      });
    } else if (profileKey === 'rohit_police') {
      setUser({
        id: 'usr-rohit-police',
        name: 'Rohit Parmar (Gujarat PSI)',
        email: 'rohit.psi@smartgovtprep.in',
        mobile: '+91 97234 98765',
        targetExam: 'Police',
        targetYear: '2026',
        state: 'Gujarat',
        tier: 'premium',
        aiQueriesUsedToday: 3,
        mcqsAttemptedToday: 8,
        lastResetDate: new Date().toISOString().split('T')[0],
        savedExams: ['gujarat-police-psi-2026', 'gpsc-class12-2026'],
        streakDays: 14,
        totalStudyHours: 58,
        accuracyRate: 79,
        isLoggedIn: true,
        preferredLanguage: 'Gujarati',
      });
    } else {
      setUser({
        id: 'usr-priya-ssc',
        name: 'Priya Joshi (SSC CGL ASO)',
        email: 'priya.ssc@smartgovtprep.in',
        mobile: '+91 98980 11223',
        targetExam: 'SSC',
        targetYear: '2026',
        state: 'Gujarat',
        tier: 'free',
        aiQueriesUsedToday: 0,
        mcqsAttemptedToday: 4,
        lastResetDate: new Date().toISOString().split('T')[0],
        savedExams: ['ssc-cgl-2026', 'ibps-po-2026'],
        streakDays: 5,
        totalStudyHours: 31,
        accuracyRate: 84,
        isLoggedIn: true,
        preferredLanguage: 'Hindi',
      });
    }
    setIsAuthModalOpen(false);
  };

  useEffect(() => {
    localStorage.setItem('sgp_user_profile', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('sgp_mock_history', JSON.stringify(mockHistory));
  }, [mockHistory]);

  const toggleSavedExam = (examId: string) => {
    setUser((prev) => {
      const exists = prev.savedExams.includes(examId);
      const updated = exists
        ? prev.savedExams.filter((id) => id !== examId)
        : [...prev.savedExams, examId];
      return { ...prev, savedExams: updated };
    });
  };

  const useAiQuery = (): boolean => {
    const maxLimits: Record<'free' | 'premium' | 'pro', number> = {
      free: 5,
      premium: 50,
      pro: 9999,
    };
    const limit = maxLimits[user.tier] || 5;

    if (user.aiQueriesUsedToday >= limit) {
      setIsPricingModalOpen(true);
      return false;
    }

    setUser((prev) => ({
      ...prev,
      aiQueriesUsedToday: prev.aiQueriesUsedToday + 1,
    }));
    return true;
  };

  const canAttemptMock = (): boolean => {
    return true;
  };

  const useMcqAttempt = (): boolean => {
    if (user.tier === 'free' && user.mcqsAttemptedToday >= 5) {
      setIsPricingModalOpen(true);
      return false;
    }
    setUser((prev) => ({
      ...prev,
      mcqsAttemptedToday: prev.mcqsAttemptedToday + 1,
    }));
    return true;
  };

  const upgradeTier = (tier: 'free' | 'premium' | 'pro', expiryDate?: string) => {
    setUser((prev) => ({
      ...prev,
      tier,
      planExpiry: expiryDate || new Date(Date.now() + 30 * 86400000).toISOString(),
      aiQueriesUsedToday: 0,
      mcqsAttemptedToday: 0,
    }));
  };

  const saveMockResult = (result: MockAttemptHistory) => {
    setMockHistory((prev) => [result, ...prev]);
    setUser((prev) => {
      const allResults = [result, ...mockHistory];
      const totalCorrect = allResults.reduce((acc, cur) => acc + cur.correctCount, 0);
      const totalAttempted = allResults.reduce((acc, cur) => acc + (cur.correctCount + cur.wrongCount), 0);
      const accuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : prev.accuracyRate;
      return {
        ...prev,
        accuracyRate: accuracy,
        totalStudyHours: prev.totalStudyHours + Math.max(1, Math.round(result.timeSpentSeconds / 3600)),
        streakDays: prev.streakDays + 1,
      };
    });
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        mockHistory,
        saveMockResult,
        toggleSavedExam,
        useAiQuery,
        canAttemptMock,
        useMcqAttempt,
        upgradeTier,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        openAuthModal,
        isProfileModalOpen,
        setIsProfileModalOpen,
        isPricingModalOpen,
        setIsPricingModalOpen,
        isAiModalOpen,
        setIsAiModalOpen,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        loginUser,
        registerUser,
        logoutUser,
        updateUserProfile,
        quickDemoLogin,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
