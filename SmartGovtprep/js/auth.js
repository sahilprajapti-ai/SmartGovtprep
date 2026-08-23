// ==========================================
// SmartGovtPrep - Authentication & User State
// ==========================================

const TIERS = {
  FREE: {
    id: 'free',
    name: 'Free Aspirant',
    badge: 'Free Tier',
    price: 0,
    dailyAiLimit: 5,
    dailyMcqLimit: 5,
    features: ['5 AI Questions/day', 'Basic Explanations', '5 MCQs/day', 'Access to Public Syllabi']
  },
  PREMIUM: {
    id: 'premium',
    name: 'Premium Aspirant',
    badge: 'Premium (₹99/mo)',
    price: 99,
    period: 'month',
    dailyAiLimit: 50,
    dailyMcqLimit: 999999, // unlimited
    features: ['50 AI Questions/day', 'Unlimited MCQs & Mocks', 'AI Smart Study Timetable', 'Deep Wrong-Answer Breakdown', 'Offline Revision Notes']
  },
  PRO: {
    id: 'pro',
    name: 'Pro Ranker',
    badge: 'Pro Tier (₹299/3mo)',
    price: 299,
    period: '3 months',
    dailyAiLimit: 999999, // unlimited
    dailyMcqLimit: 999999, // unlimited
    features: ['Unlimited AI Mentor Queries', 'PDF & Notes Q&A Solver', 'Weak-Topic AI Diagnostic', 'Personalized Rank Roadmap', 'Priority Mentorship Mode']
  },
  LIFETIME: {
    id: 'lifetime',
    name: '👑 Lifetime Govt Pass',
    badge: '👑 Lifetime VIP',
    price: 499,
    period: 'one-time lifetime',
    dailyAiLimit: 999999, // unlimited
    dailyMcqLimit: 999999, // unlimited
    features: [
      'Lifetime Unlimited Access to ALL Exams (State & Central)',
      'Unlimited 24/7 AI Exam Mentor for Life',
      'All Full-Length Mock Tests & Previous Year Papers',
      'All Future Exam Cycles Included',
      'Lifetime Gujarat & National Current Affairs Archive',
      'Personal Rank Booster & Career Counseling'
    ]
  }
};

class AuthManager {
  constructor() {
    this.storageKey = 'smartgovtprep_user';
    this.usersDatabaseKey = 'smartgovtprep_all_users';
    this.currentUser = this.loadUser();
  }

  getAllUsers() {
    const raw = localStorage.getItem(this.usersDatabaseKey);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch(e) {
      return [];
    }
  }

  saveAllUsers(users) {
    localStorage.setItem(this.usersDatabaseKey, JSON.stringify(users));
  }

  loadUser() {
    const raw = localStorage.getItem(this.storageKey);
    const today = new Date().toISOString().split('T')[0];

    if (!raw) {
      // Default initial guest/free student profile
      const defaultUser = {
        name: 'Aspirant Rahul',
        email: 'rahul.aspirant@smartgovt.in',
        phone: '+91 98765 43210',
        photo: '',
        targetExam: 'gpsc-class12',
        targetExamName: 'GPSC Gujarat Administrative Service Class 1 & 2',
        state: 'Gujarat',
        tier: 'free',
        planExpiry: null,
        joinedDate: '2026-08-01',
        streakDays: 6,
        lastActiveDate: today,
        studyHoursLogged: 42,
        totalQuestionsAttempted: 84,
        totalCorrect: 68,
        bookmarks: ['q1', 'q2', 'ca-1'],
        dailyStats: {
          date: today,
          aiQueriesUsed: 2,
          mcqsUsed: 3
        },
        mockHistory: [
          { examName: 'GPSC GS Paper 1 Mini Mock', score: 18, total: 20, accuracy: 90, date: '2026-08-20' },
          { examName: 'Indian Polity & Governance', score: 16, total: 20, accuracy: 80, date: '2026-08-22' }
        ],
        completedTopics: {}
      };
      localStorage.setItem(this.storageKey, JSON.stringify(defaultUser));
      return defaultUser;
    }

    try {
      const user = JSON.parse(raw);
      if (!user.photo) user.photo = '';
      // Check if daily quota needs reset for new calendar day
      if (!user.dailyStats || user.dailyStats.date !== today) {
        user.dailyStats = {
          date: today,
          aiQueriesUsed: 0,
          mcqsUsed: 0
        };
        // Update streak logic
        const lastDate = new Date(user.lastActiveDate || today);
        const currentDate = new Date(today);
        const diffDays = Math.floor((currentDate - lastDate) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          user.streakDays = (user.streakDays || 0) + 1;
        } else if (diffDays > 1) {
          user.streakDays = 1;
        }
        user.lastActiveDate = today;
        this.saveUser(user);
      }
      return user;
    } catch (e) {
      console.error('Error parsing user data:', e);
      return null;
    }
  }

  saveUser(user) {
    this.currentUser = user || this.currentUser;
    localStorage.setItem(this.storageKey, JSON.stringify(this.currentUser));
    
    // Also save in all users
    if (this.currentUser) {
      const allUsers = this.getAllUsers();
      const existingIdx = allUsers.findIndex(u => u.email === this.currentUser.email);
      if (existingIdx > -1) {
        allUsers[existingIdx] = this.currentUser;
      } else {
        allUsers.push(this.currentUser);
      }
      this.saveAllUsers(allUsers);
    }

    this.triggerUserChange();
  }

  setPhoto(photoDataUrl) {
    if (this.currentUser) {
      this.currentUser.photo = photoDataUrl;
      this.saveUser(this.currentUser);
    }
  }

  getUser() {
    return this.currentUser;
  }

  getTier() {
    const tierId = this.currentUser?.tier || 'free';
    return TIERS[tierId.toUpperCase()] || TIERS.FREE;
  }

  isLoggedIn() {
    return !!this.currentUser;
  }

  register(name, email, phone, targetExamId, targetExamName, state, password = '', photo = '') {
    const today = new Date().toISOString().split('T')[0];
    const newUser = {
      name: name || 'Aspirant',
      email: email.trim().toLowerCase(),
      phone: phone || '',
      photo: photo || '',
      password: password || '123456',
      targetExam: targetExamId || 'gpsc-class12',
      targetExamName: targetExamName || 'GPSC Class 1 & 2',
      state: state || 'Gujarat',
      tier: 'free',
      planExpiry: null,
      joinedDate: today,
      streakDays: 1,
      lastActiveDate: today,
      studyHoursLogged: 0,
      totalQuestionsAttempted: 0,
      totalCorrect: 0,
      bookmarks: [],
      dailyStats: {
        date: today,
        aiQueriesUsed: 0,
        mcqsUsed: 0
      },
      mockHistory: [],
      completedTopics: {}
    };
    this.saveUser(newUser);
    return newUser;
  }

  login(identifier, password = '') {
    const cleanId = (identifier || '').trim().toLowerCase();
    const allUsers = this.getAllUsers();
    let found = allUsers.find(u => u.email.toLowerCase() === cleanId || (u.phone && u.phone.includes(cleanId)));

    if (!found) {
      // Auto-create/demo login if not found
      found = {
        name: cleanId.split('@')[0] || 'Aspirant',
        email: cleanId.includes('@') ? cleanId : `${cleanId}@smartgovt.in`,
        phone: cleanId.startsWith('+91') ? cleanId : '+91 98765 00000',
        targetExam: 'gpsc-class12',
        targetExamName: 'GPSC Gujarat Administrative Service Class 1 & 2',
        state: 'Gujarat',
        tier: 'free',
        planExpiry: null,
        joinedDate: new Date().toISOString().split('T')[0],
        streakDays: 1,
        lastActiveDate: new Date().toISOString().split('T')[0],
        studyHoursLogged: 5,
        totalQuestionsAttempted: 10,
        totalCorrect: 8,
        bookmarks: [],
        dailyStats: {
          date: new Date().toISOString().split('T')[0],
          aiQueriesUsed: 0,
          mcqsUsed: 0
        },
        mockHistory: [],
        completedTopics: {}
      };
    }

    this.saveUser(found);
    return found;
  }

  logout() {
    this.currentUser = {
      name: 'Guest Aspirant',
      email: 'guest@smartgovt.in',
      phone: '',
      targetExam: 'gpsc-class12',
      targetExamName: 'GPSC Gujarat Administrative Service Class 1 & 2',
      state: 'Gujarat',
      tier: 'free',
      planExpiry: null,
      joinedDate: new Date().toISOString().split('T')[0],
      streakDays: 0,
      lastActiveDate: new Date().toISOString().split('T')[0],
      studyHoursLogged: 0,
      totalQuestionsAttempted: 0,
      totalCorrect: 0,
      bookmarks: [],
      dailyStats: {
        date: new Date().toISOString().split('T')[0],
        aiQueriesUsed: 0,
        mcqsUsed: 0
      },
      mockHistory: [],
      completedTopics: {}
    };
    this.saveUser(this.currentUser);
    return true;
  }

  upgradeTier(tierId, planName) {
    const validTier = tierId.toLowerCase();
    if (!TIERS[validTier.toUpperCase()]) return false;

    const expiry = new Date();
    if (validTier === 'premium') {
      expiry.setMonth(expiry.getMonth() + 1);
    } else if (validTier === 'pro') {
      expiry.setMonth(expiry.getMonth() + 3);
    }

    this.currentUser.tier = validTier;
    this.currentUser.planExpiry = expiry.toISOString().split('T')[0];
    this.saveUser(this.currentUser);
    return true;
  }

  canAskAi() {
    const tier = this.getTier();
    const used = this.currentUser.dailyStats?.aiQueriesUsed || 0;
    return used < tier.dailyAiLimit;
  }

  recordAiQuery() {
    if (!this.canAskAi()) return false;
    this.currentUser.dailyStats.aiQueriesUsed = (this.currentUser.dailyStats.aiQueriesUsed || 0) + 1;
    this.saveUser(this.currentUser);
    return true;
  }

  canAttemptMcq() {
    const tier = this.getTier();
    const used = this.currentUser.dailyStats?.mcqsUsed || 0;
    return used < tier.dailyMcqLimit;
  }

  recordMcqAttempt(isCorrect = false) {
    const tier = this.getTier();
    const used = this.currentUser.dailyStats?.mcqsUsed || 0;

    if (tier.id === 'free' && used >= tier.dailyMcqLimit) {
      return false;
    }

    this.currentUser.dailyStats.mcqsUsed = used + 1;
    this.currentUser.totalQuestionsAttempted = (this.currentUser.totalQuestionsAttempted || 0) + 1;
    if (isCorrect) {
      this.currentUser.totalCorrect = (this.currentUser.totalCorrect || 0) + 1;
    }
    this.saveUser(this.currentUser);
    return true;
  }

  recordMockTestResult(result) {
    if (!this.currentUser.mockHistory) {
      this.currentUser.mockHistory = [];
    }
    this.currentUser.mockHistory.unshift(result);
    // Keep max 20 recent records
    if (this.currentUser.mockHistory.length > 20) {
      this.currentUser.mockHistory.pop();
    }
    this.saveUser(this.currentUser);
  }

  toggleBookmark(itemId) {
    if (!this.currentUser.bookmarks) {
      this.currentUser.bookmarks = [];
    }
    const idx = this.currentUser.bookmarks.indexOf(itemId);
    if (idx > -1) {
      this.currentUser.bookmarks.splice(idx, 1);
    } else {
      this.currentUser.bookmarks.push(itemId);
    }
    this.saveUser(this.currentUser);
    return this.currentUser.bookmarks.includes(itemId);
  }

  isBookmarked(itemId) {
    return this.currentUser?.bookmarks?.includes(itemId) || false;
  }

  toggleTopicComplete(topicKey) {
    if (!this.currentUser.completedTopics) {
      this.currentUser.completedTopics = {};
    }
    this.currentUser.completedTopics[topicKey] = !this.currentUser.completedTopics[topicKey];
    this.saveUser(this.currentUser);
    return this.currentUser.completedTopics[topicKey];
  }

  isTopicCompleted(topicKey) {
    return !!this.currentUser?.completedTopics?.[topicKey];
  }

  setTargetExam(examId, examName) {
    if (!this.currentUser) return;
    this.currentUser.targetExam = examId;
    if (examName) this.currentUser.targetExamName = examName;
    this.saveUser(this.currentUser);
    this.triggerUserChange();
    return true;
  }

  triggerUserChange() {
    window.dispatchEvent(new CustomEvent('smartgovtprep:user-updated', { detail: this.currentUser }));
  }
}

// Global singleton instance
window.authManager = new AuthManager();
