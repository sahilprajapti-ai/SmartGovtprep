# SmartGovtPrep – Government Exam Preparation Portal 🇮🇳

**SmartGovtPrep** is an all-in-one, modern single-page web portal designed for Indian government examination aspirants (UPSC, GPSC, SSC, Banking, Railway, Police Bharti, Teaching, and Defense).

---

## 📁 Project Directory Structure

```
smartgovtprep/
├── index.html                  # Main Single-Page HTML Entry with all 10+ sections
├── README.md                   # Project documentation & run guide
├── css/
│   ├── style.css               # Core styling, tokens, glassmorphism & typography
│   ├── components.css          # Component styles: Hero, Modals, Mock Engine, AI Chat, Pricing
│   └── responsive.css          # Mobile, tablet, and widescreen responsive breakpoints
└── js/
    ├── data.js                 # Central data store (Exams, Syllabi, Current Affairs, MCQs, Portals)
    ├── auth.js                 # Multi-user authentication, registration, tiers & daily quotas
    ├── mockTest.js             # Interactive MCQ Mock Test Engine with timer & score metrics
    ├── aiAssistant.js          # SmartGovtPrep India AI Mentor & doubt solver
    ├── studyPlanner.js         # Automated hourly daily timetable & routine generator
    ├── payment.js              # Subscription checkout modal & coupon system (SMART50, GOVT2026)
    └── app.js                  # App orchestrator, live countdown ticker, filters & notifications
```

---

## 🚀 How to Run the Website Locally

1. Open a terminal / command prompt inside the project folder:
   ```bash
   cd C:\Users\ACS\.gemini\antigravity-ide\scratch\smartgovtprep
   ```

2. Start a local HTTP server:
   ```bash
   # Using Python:
   python -m http.server 3000

   # Or using Node.js:
   npx serve . -p 3000
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## 🌟 Feature Checklist

- ✅ **Hero Section**: Live ticking exam countdown for GPSC, UPSC, SSC, Banking, and Police Bharti.
- ✅ **Exam Categories**: Interactive filter grid across 8+ major categories.
- ✅ **Upcoming Exams Tracker**: Live notifications, application deadlines, eligibility criteria, and PDF previews.
- ✅ **Interactive Exam Syllabus**: Stage-wise breakdown with topic completion checklist saved in `localStorage`.
- ✅ **Daily Current Affairs**: High-yield exam digests + 5-question interactive daily flash quiz.
- ✅ **Interactive Mock Test Arena**: 10-minute timer, question palette navigation, score report, accuracy %, and step-by-step solutions.
- ✅ **AI Study Assistant**: 24/7 competitive exam mentor with quick prompt pills (*Article 32, Time & Work shortcuts, Gujarat schemes*).
- ✅ **Smart Study Planner**: Custom hourly timetable generator based on available study hours and target subjects.
- ✅ **Student Auth & Profile**: Sign up / Register, Login, 1-Click Demo accounts, and daily quota tracking.
- ✅ **Pricing & Checkout Simulation**: Free, Premium (₹99/mo), and Pro (₹299/3mo) plans with coupons (`SMART50`, `GOVT2026`, `GPSC100`).
