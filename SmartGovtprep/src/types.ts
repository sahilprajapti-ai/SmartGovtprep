export type ExamCategoryType = 
  | 'UPSC' 
  | 'GPSC' 
  | 'SSC' 
  | 'Banking' 
  | 'Railway' 
  | 'Police' 
  | 'Teaching';

export interface ExamItem {
  id: string;
  name: string;
  category: ExamCategoryType;
  fullName: string;
  conductingBody: string;
  notificationDate: string;
  applicationStart: string;
  applicationEnd: string;
  examDate: string; // ISO string or format YYYY-MM-DD
  daysLeft: number;
  eligibility: {
    education: string;
    ageLimit: string;
    attempts?: string;
  };
  vacancies: string;
  salaryScale: string;
  officialUrl: string;
  notificationPdfUrl: string;
  stages: string[];
  description: string;
  badge?: string;
  stateFocus?: 'Gujarat' | 'National' | 'All India';
}

export interface SyllabusSubject {
  id: string;
  name: string;
  stage: 'Prelims' | 'Mains' | 'Interview' | 'Tier-1' | 'Tier-2';
  weightage: string;
  topics: string[];
  recommendedBooks: string[];
  keyTips: string;
}

export interface CurrentAffairItem {
  id: string;
  title: string;
  category: 'National' | 'International' | 'Economy' | 'Science & Tech' | 'Gujarat Special';
  date: string;
  summary: string;
  keyPoints: string[];
  prelimsPointers: string[];
  mainsRelevance: string;
  tags: string[];
}

export interface MockQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  subject: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  examTag: string;
}

export interface MockTest {
  id: string;
  title: string;
  category: ExamCategoryType;
  durationMinutes: number;
  totalMarks: number;
  negativeMarking: number;
  questions: MockQuestion[];
  description: string;
}

export interface UserPlanTier {
  id: 'free' | 'premium' | 'pro';
  name: string;
  price: number;
  period: string;
  dailyAiLimit: number;
  dailyMcqLimit: number; // 9999 for unlimited
  features: string[];
  badge?: string;
  isPopular?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  mobile: string;
  targetExam: ExamCategoryType;
  targetYear: string;
  state: string;
  tier: 'free' | 'premium' | 'pro';
  planExpiry?: string;
  aiQueriesUsedToday: number;
  mcqsAttemptedToday: number;
  lastResetDate: string;
  savedExams: string[];
  streakDays: number;
  totalStudyHours: number;
  accuracyRate: number;
  isLoggedIn?: boolean;
  preferredLanguage?: 'English' | 'Gujarati' | 'Hindi';
  createdAt?: string;
}

export interface MockAttemptHistory {
  id: string;
  testId: string;
  testTitle: string;
  date: string;
  score: number;
  totalMarks: number;
  correctCount: number;
  wrongCount: number;
  unattemptedCount: number;
  accuracy: number;
  timeSpentSeconds: number;
}

export interface StudyTimeSlot {
  time: string;
  subject: string;
  topic: string;
  type: 'Theory' | 'MCQ Practice' | 'Current Affairs' | 'Revision' | 'Mock Test';
  duration: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface GeneratedStudyPlan {
  id: string;
  exam: string;
  dailyHours: number;
  targetDate: string;
  summary: string;
  schedule: StudyTimeSlot[];
  tips: string[];
  weeklyBreakdown: { day: string; focus: string; hours: number }[];
}

export interface ResourceItem {
  id: string;
  title: string;
  exam: string;
  type: 'PYQ Paper' | 'Syllabus PDF' | 'Exam Pattern' | 'Study Notes';
  year?: string;
  fileSize?: string;
  url: string;
  description: string;
}

export interface AIQueryMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  category?: string;
}
