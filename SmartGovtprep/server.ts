import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({ status: "ok", timestamp: new Date().toISOString(), platform: "SmartGovtPrep India" });
  });

  // AI Study Assistant Endpoint
  app.post("/api/ai/ask", async (req: Request, res: Response) => {
    try {
      const { question, examCategory, language, studentTier } = req.body;

      if (!question || typeof question !== "string") {
        return res.status(400).json({ error: "Question is required." });
      }

      const client = getGeminiClient();

      if (client) {
        try {
          const systemInstruction = `You are "SmartGovtPrep AI Mentor", an expert Indian Government Examination coach specializing in UPSC, GPSC (Gujarat Public Service Commission), SSC, Banking (IBPS/SBI), Railway (RRB), Police PSI/Constable, and Teaching exams.
Answer the student's question with high academic rigor, structured bullet points, clear exam relevance (Prelims vs Mains pointers), factual accuracy, and actionable memorization tips/mnemonics.
Language: Provide answer in clear English with relevant Hindi/Gujarati context when applicable, or directly in ${language || 'English'}.
Exam Context: ${examCategory || 'All Indian & Gujarat Govt Exams'}.
Student Tier: ${studentTier || 'Free'}.
Keep formatting clean using Markdown with bold keywords and concise paragraphs.`;

          const response = await client.models.generateContent({
            model: "gemini-3.7-flash",
            contents: question,
            config: {
              systemInstruction,
              temperature: 0.7,
            },
          });

          return res.json({
            answer: response.text || "Here is the information for your examination preparation.",
            source: "gemini-3.7-flash",
            timestamp: new Date().toISOString(),
          });
        } catch (geminiError: any) {
          console.warn("Gemini API call failed, falling back to smart educational engine:", geminiError?.message);
        }
      }

      // Intelligent curated fallback for instant offline/keyless reliability
      const lowerQ = question.toLowerCase();
      let fallbackAnswer = "";

      if (lowerQ.includes("gpsc") || lowerQ.includes("gujarat")) {
        fallbackAnswer = `### 🏛️ GPSC & Gujarat Government Exam Guidance

**Key Strategy & Exam Insights:**
- **Syllabus Priority:** Focus on Gujarat History & Culture (Indus Valley in Gujarat - Lothal & Dholavira, Solanki Dynasty, Maru-Gurjara Architecture), Gujarat Socio-Economic Review, and Indian Constitution.
- **Language Paper:** GPSC Mains Paper 1 (Gujarati) requires daily practice of *Vichar Vistar*, *Nibandh*, and *Jodnikosh*.
- **Current Affairs:** Read Gujarat Government schemes (Kisan Suryodaya 2.0, GIFT City IFSC, Dholera SIR, Vibrant Gujarat MoUs) alongside national current affairs.
- **Recommended Strategy:** Solve at least 10 previous year papers from 2021 to 2024 to understand question depth.`;
      } else if (lowerQ.includes("upsc") || lowerQ.includes("ias") || lowerQ.includes("ips")) {
        fallbackAnswer = `### 🇮🇳 UPSC Civil Services Exam (CSE) High-Yield Strategy

**Core Fundamentals:**
- **Prelims:** Master Polity (Laxmikanth), Modern History (Spectrum), Geography (NCERTs + Atlas), and Economy (Inflation, Monetary Policy, Budget). Do not neglect CSAT (Qualifying 33%).
- **Mains Answer Writing:** Structure your answers with **Introduction (Definition/Data) -> 3-4 Dimensions (Social, Economic, Political, Environmental) -> Way Forward / Conclusion**.
- **Current Affairs:** Link daily news events with GS Paper 1, 2, 3 syllabus keywords.`;
      } else if (lowerQ.includes("ssc") || lowerQ.includes("cgl") || lowerQ.includes("math") || lowerQ.includes("reasoning")) {
        fallbackAnswer = `### ⚡ SSC CGL & Central Exams Strategy

**Speed & Accuracy Optimization:**
- **Quantitative Aptitude:** Memorize squares up to 50, cubes up to 30, and Pythagorean triplets. Practice DI, Geometry, and Arithmetic shortcuts daily.
- **Reasoning:** Target 23+/25 marks in under 15 minutes.
- **English:** Revise 50 One-Word Substitutions and Idioms daily from standard compendiums.
- **General Awareness:** Focus on Static GK (Classical dances, minerals, festivals, sports awards) and last 6 months current affairs.`;
      } else {
        fallbackAnswer = `### 🎯 SmartGovtPrep Exam Strategy & Preparation Plan

**Target Approach for ${examCategory || 'Government Exams'}:**
1. **Syllabus Mapping:** Break the syllabus into high-weightage topics and revise them in 2-week sprints.
2. **Mock Test Regularity:** Take 2 full-length mock tests per week under strict timer conditions, and spend at least 45 minutes analyzing wrong answers.
3. **Daily Revision Cycle:** Spend the first 45 minutes of each morning revising yesterday's notes and current affairs.
4. **Consistency:** Aim for 6-8 focused hours rather than irregular marathon study sessions.`;
      }

      return res.json({
        answer: fallbackAnswer,
        source: "smartgovtprep-core-engine",
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error("AI Ask error:", error);
      res.status(500).json({ error: "Failed to process AI query" });
    }
  });

  // AI Dynamic Study Planner Generator
  app.post("/api/ai/plan", async (req: Request, res: Response) => {
    try {
      const { examCategory, dailyHours, targetDate, weakSubjects, strongSubjects } = req.body;
      const hours = Number(dailyHours) || 6;
      const client = getGeminiClient();

      if (client) {
        try {
          const prompt = `Generate a customized daily timetable and 7-day study routine for an Indian government exam candidate preparing for ${examCategory || 'GPSC/UPSC/SSC'}.
Daily available study hours: ${hours} hours.
Target Exam Date: ${targetDate || 'Upcoming cycle'}.
Weak Subjects to prioritize: ${Array.isArray(weakSubjects) ? weakSubjects.join(', ') : 'Quantitative Aptitude, History'}.
Strong Subjects for quick revision: ${Array.isArray(strongSubjects) ? strongSubjects.join(', ') : 'Reasoning, Current Affairs'}.

Return a structured plan with:
1. Hourly daily time-table with specific slots (Morning, Afternoon, Evening, Night).
2. Weekly 7-day subject distribution.
3. 3 High-impact exam preparation tips.`;

          const response = await client.models.generateContent({
            model: "gemini-3.7-flash",
            contents: prompt,
            config: {
              systemInstruction: "You are a professional academic time-table planner for Indian government civil service and competitive examinations.",
              temperature: 0.7,
            },
          });

          return res.json({
            planText: response.text,
            hours,
            examCategory,
            timestamp: new Date().toISOString(),
          });
        } catch (e: any) {
          console.warn("AI planner fallback activated:", e?.message);
        }
      }

      // Default smart structured schedule
      const morningHours = Math.max(2, Math.floor(hours * 0.4));
      const afternoonHours = Math.max(1, Math.floor(hours * 0.3));
      const eveningHours = Math.max(1, hours - morningHours - afternoonHours);

      const generatedText = `### 📅 Customized Smart Timetable for ${examCategory || 'Government Exams'} (${hours} Hours/Day)

#### 🌅 Morning Slot (06:30 AM – 09:30 AM | ${morningHours} Hours) - High Alertness
- **06:30 AM – 07:45 AM**: Daily Current Affairs Analysis (National + Gujarat/State Special) & Note-making.
- **07:45 AM – 09:30 AM**: Heavy Core Subject (Weak Area focus: ${Array.isArray(weakSubjects) && weakSubjects.length > 0 ? weakSubjects[0] : 'Constitution & Polity / Advance Math'}).

#### ☀️ Afternoon Slot (02:00 PM – 04:30 PM | ${afternoonHours} Hours) - Practice & Problem Solving
- **02:00 PM – 03:30 PM**: Quantitative Aptitude / Reasoning / Language Grammar practice.
- **03:30 PM – 04:30 PM**: Previous Year Questions (PYQ) solving with timer.

#### 🌙 Evening & Night Slot (07:00 PM – 09:30 PM | ${eveningHours} Hours) - Testing & Revision
- **07:00 PM – 08:15 PM**: Secondary Subject (${Array.isArray(strongSubjects) && strongSubjects.length > 0 ? strongSubjects[0] : 'History / Geography / Science'}).
- **08:30 PM – 09:30 PM**: Daily 20-MCQ Mock Test + Mistake Journaling & next-day plan review.

#### 🎯 Golden Preparation Rules:
1. **The 80/20 Revision Rule**: Devote 80% of testing time to analyzing questions you got wrong or guessed.
2. **Sunday Full Mock Test**: Take 1 full-length CBT test every Sunday morning at the exact exam shift time.`;

      return res.json({
        planText: generatedText,
        hours,
        examCategory,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error("Planner error:", error);
      res.status(500).json({ error: "Failed to generate study plan" });
    }
  });

  // AI Mock Test Diagnostic & Weak-Topic Analysis
  app.post("/api/ai/mock-analysis", async (req: Request, res: Response) => {
    try {
      const { score, totalMarks, correctCount, wrongCount, unattempted, examName, wrongQuestions } = req.body;
      const client = getGeminiClient();

      if (client) {
        try {
          const prompt = `Analyze this student's mock test performance in ${examName || 'Govt Exam'}:
Score: ${score} / ${totalMarks}
Correct: ${correctCount}, Wrong: ${wrongCount}, Unattempted: ${unattempted}
Wrong/Doubt Questions: ${JSON.stringify(wrongQuestions || [])}

Provide:
1. Performance Diagnostic & Accuracy Assessment.
2. Immediate Weak Subject Remediation steps.
3. Recommended question selection strategy for real exam to minimize negative marking.`;

          const response = await client.models.generateContent({
            model: "gemini-3.7-flash",
            contents: prompt,
            config: {
              systemInstruction: "You are a test-taking psychologist and competitive exam ranker coach.",
              temperature: 0.6,
            },
          });

          return res.json({
            analysis: response.text,
            timestamp: new Date().toISOString(),
          });
        } catch (e: any) {
          console.warn("AI Mock Analysis fallback:", e?.message);
        }
      }

      const accuracy = totalMarks > 0 ? Math.round((correctCount / (correctCount + wrongCount || 1)) * 100) : 0;
      const analysisText = `### 📊 Diagnostic Performance Breakdown

- **Overall Accuracy Rate:** ${accuracy}% (${accuracy >= 80 ? '🟢 Excellent' : accuracy >= 60 ? '🟡 Moderate - Needs Polish' : '🔴 Critical Risk of Negative Marking'})
- **Negative Marking Penalty:** -${(wrongCount * 0.33).toFixed(2)} Marks lost to incorrect guesses.

#### 💡 Actionable Improvement Strategy:
1. **Eliminate 50-50 Blind Guesses:** Only attempt questions where you can eliminate at least two options with certainty.
2. **Review High-Weightage Chapters:** Revisit basic NCERT / GCERT definitions for the questions missed.
3. **Speed Management:** Maintain average time per MCQ under 45 seconds for General Awareness and 75 seconds for Numerical problems.`;

      return res.json({
        analysis: analysisText,
        accuracy,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error("Mock analysis error:", error);
      res.status(500).json({ error: "Failed to analyze mock test" });
    }
  });

  // Realistic Payment Verification Simulation
  app.post("/api/payment/verify", (req: Request, res: Response) => {
    try {
      const { planId, paymentMethod, studentEmail, amount } = req.body;

      if (!planId || !studentEmail) {
        return res.status(400).json({ error: "Plan ID and email are required" });
      }

      const transactionId = `TXN_SGP_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
      const expiryDays = planId === 'pro' ? 90 : planId === 'premium' ? 30 : 365;
      const expiryDate = new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000).toISOString();

      return res.json({
        success: true,
        transactionId,
        planId,
        amount: amount || (planId === 'pro' ? 299 : planId === 'premium' ? 99 : 0),
        paymentMethod: paymentMethod || 'UPI / Card',
        status: 'PAID',
        expiryDate,
        message: `Successfully activated ${planId.toUpperCase()} membership for ${studentEmail}`,
      });
    } catch (error: any) {
      console.error("Payment error:", error);
      res.status(500).json({ error: "Payment processing failed" });
    }
  });

  // Vite middleware in development, static files in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SmartGovtPrep server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
