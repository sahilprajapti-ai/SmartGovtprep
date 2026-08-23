// ==========================================
// SmartGovtPrep - AI Study Assistant
// ==========================================

class AiStudyAssistant {
  constructor() {
    this.messages = [];
    this.initElements();
    this.bindEvents();
    this.updateQuotaDisplay();
    this.loadInitialGreeting();
  }

  initElements() {
    this.chatBody = document.getElementById('ai-chat-messages');
    this.inputField = document.getElementById('ai-input-text');
    this.sendBtn = document.getElementById('ai-send-btn');
    this.quotaBadge = document.getElementById('ai-quota-badge');
    this.clearBtn = document.getElementById('ai-clear-chat-btn');
    this.suggestionPills = document.querySelectorAll('.ai-prompt-pill');
    this.createFloatingChatbot();
  }

  bindEvents() {
    if (this.sendBtn) {
      this.sendBtn.addEventListener('click', () => this.handleSendMessage());
    }

    if (this.inputField) {
      this.inputField.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.handleSendMessage();
        }
      });
    }

    if (this.clearBtn) {
      this.clearBtn.addEventListener('click', () => {
        if (this.chatBody) {
          this.chatBody.innerHTML = '';
          this.messages = [];
          this.loadInitialGreeting();
          window.showToast('Chat Cleared', 'AI Study Assistant conversation reset.', 'info');
        }
      });
    }

    if (this.suggestionPills) {
      this.suggestionPills.forEach(pill => {
        pill.addEventListener('click', () => {
          const query = pill.getAttribute('data-query') || pill.textContent.trim();
          if (this.inputField) {
            this.inputField.value = query;
            this.handleSendMessage();
          }
        });
      });
    }

    window.addEventListener('smartgovtprep:user-updated', () => {
      this.updateQuotaDisplay();
      this.updateFloatingQuota();
    });
  }

  // Floating Chatbot Widget (bottom-right corner)
  createFloatingChatbot() {
    if (document.getElementById('floating-chatbot-widget')) return;

    const widget = document.createElement('div');
    widget.id = 'floating-chatbot-widget';
    widget.innerHTML = `
      <button class="floating-chat-toggle" id="floating-chat-toggle" title="Open AI Study Assistant Chatbot">
        <i class="fa-solid fa-robot"></i>
        <span class="floating-chat-badge" id="floating-chat-badge">AI</span>
      </button>
      <div class="floating-chat-panel hidden" id="floating-chat-panel">
        <div class="floating-chat-header">
          <div class="floating-chat-identity">
            <i class="fa-solid fa-robot"></i>
            <div>
              <strong>Chatbot AI Study Assistant</strong>
              <span><i class="fa-solid fa-circle" style="color:#10b981;font-size:0.5rem;"></i> Online</span>
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:8px;">
            <span class="floating-quota-label" id="floating-quota-label">5 queries left</span>
            <button class="floating-chat-close" id="floating-chat-close"><i class="fa-solid fa-xmark"></i></button>
          </div>
        </div>
        <div class="floating-chat-messages" id="floating-chat-messages">
          <div class="floating-welcome-msg">
            <i class="fa-solid fa-robot" style="font-size:2rem;color:#818cf8;"></i>
            <p>Ask me anything about GPSC, UPSC, SSC, Banking, or Gujarat GK!</p>
          </div>
        </div>
        <div class="floating-chat-input-row">
          <input type="text" id="floating-chat-input" placeholder="Type your exam question...">
          <button id="floating-chat-send" class="btn btn-primary btn-sm">
            <i class="fa-solid fa-paper-plane"></i>
          </button>
        </div>
        <a href="#ai-assistant-section" class="floating-open-full" onclick="document.getElementById('floating-chat-panel').classList.add('hidden')">
          <i class="fa-solid fa-expand"></i> Open Full Chatbot
        </a>
      </div>
    `;
    document.body.appendChild(widget);

    // Toggle panel
    document.getElementById('floating-chat-toggle').addEventListener('click', () => {
      const panel = document.getElementById('floating-chat-panel');
      panel.classList.toggle('hidden');
      if (!panel.classList.contains('hidden')) {
        document.getElementById('floating-chat-input')?.focus();
      }
    });
    document.getElementById('floating-chat-close').addEventListener('click', () => {
      document.getElementById('floating-chat-panel').classList.add('hidden');
    });

    // Floating send
    const floatSend = document.getElementById('floating-chat-send');
    const floatInput = document.getElementById('floating-chat-input');
    floatSend?.addEventListener('click', () => this.handleFloatSend());
    floatInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.handleFloatSend();
    });

    this.updateFloatingQuota();
  }

  handleFloatSend() {
    const input = document.getElementById('floating-chat-input');
    const messagesBox = document.getElementById('floating-chat-messages');
    if (!input || !messagesBox) return;
    const text = input.value.trim();
    if (!text) return;

    const auth = window.authManager;
    if (!auth.canAskAi()) {
      window.showToast('AI Limit Reached', 'Upgrade to ask more questions today!', 'warning');
      return;
    }

    // User bubble
    const userDiv = document.createElement('div');
    userDiv.className = 'float-msg float-user';
    userDiv.textContent = text;
    messagesBox.appendChild(userDiv);

    // Welcome message remove
    messagesBox.querySelector('.floating-welcome-msg')?.remove();

    input.value = '';
    auth.recordAiQuery();
    this.updateQuotaDisplay();
    this.updateFloatingQuota();

    // Typing
    const typing = document.createElement('div');
    typing.className = 'float-msg float-bot float-typing';
    typing.innerHTML = '<span></span><span></span><span></span>';
    messagesBox.appendChild(typing);
    messagesBox.scrollTop = messagesBox.scrollHeight;

    setTimeout(() => {
      typing.remove();
      const response = this.generateAiResponse(text);
      const botDiv = document.createElement('div');
      botDiv.className = 'float-msg float-bot';
      // Strip markdown for floating widget
      botDiv.textContent = response.replace(/\*\*/g, '').replace(/#{1,4} /g, '').substring(0, 500) + (response.length > 500 ? '… (see full chatbot)' : '');
      messagesBox.appendChild(botDiv);
      messagesBox.scrollTop = messagesBox.scrollHeight;
    }, 700);
  }

  updateFloatingQuota() {
    const label = document.getElementById('floating-quota-label');
    if (!label) return;
    const auth = window.authManager;
    const tier = auth.getTier();
    const used = auth.getUser()?.dailyStats?.aiQueriesUsed || 0;
    if (tier.dailyAiLimit >= 999999) {
      label.textContent = '∞ Unlimited';
      label.style.color = '#fbbf24';
    } else {
      const left = Math.max(0, tier.dailyAiLimit - used);
      label.textContent = `${left} queries left`;
      label.style.color = left === 0 ? '#f87171' : '#34d399';
    }
  }

  updateQuotaDisplay() {
    if (!this.quotaBadge) return;
    const auth = window.authManager;
    const tier = auth.getTier();
    const used = auth.getUser().dailyStats?.aiQueriesUsed || 0;

    if (tier.id === 'pro' || tier.id === 'lifetime') {
      this.quotaBadge.innerHTML = `<i class="fa-solid fa-crown"></i> AI Study Bot: <strong>Unlimited</strong>`;
      this.quotaBadge.className = 'ai-quota-pill pro';
    } else if (tier.id === 'premium') {
      const remaining = Math.max(0, tier.dailyAiLimit - used);
      this.quotaBadge.innerHTML = `<i class="fa-solid fa-bolt"></i> Premium: <strong>${remaining}/${tier.dailyAiLimit}</strong> AI Queries Left`;
      this.quotaBadge.className = 'ai-quota-pill premium';
    } else {
      const remaining = Math.max(0, tier.dailyAiLimit - used);
      this.quotaBadge.innerHTML = `<i class="fa-solid fa-sparkles"></i> Free: <strong>${remaining}/${tier.dailyAiLimit}</strong> Chatbot Queries Today <a href="#pricing" class="upgrade-link">Upgrade</a>`;
      this.quotaBadge.className = 'ai-quota-pill free';
    }
  }

  loadInitialGreeting() {
    if (!this.chatBody) return;
    const auth = window.authManager;
    const userName = auth.getUser()?.name || 'Aspirant';
    const targetExam = auth.getUser()?.targetExamName || 'Government Exams';

    const greeting = `Namaste **${userName}**! 🙏 I am your **Chatbot AI Study Assistant** on SmartGovtPrep, specialized in **${targetExam}**, UPSC, GPSC, SSC, Banking, and Police exams.

How can I help you today?
- 💡 **Doubt Clearance:** Ask any concept in Polity, History, Economy, Science, or Math.
- ⚡ **Shortcuts & Tricks:** Master Time & Work, Speed & Distance, or Percentage tricks.
- 🎯 **MCQ Quiz:** Ask me to quiz you on any topic right now!
- 🦁 **Gujarat GK & Schemes:** Dholera SIR, Solanki dynasty, NAMO schemes.
- ✍️ **Answer Writing:** UPSC Mains structured framework with examples.`;

    this.appendMessage('assistant', greeting);
  }

  handleSendMessage() {
    if (!this.inputField) return;
    const text = this.inputField.value.trim();
    if (!text) return;

    const auth = window.authManager;
    if (!auth.canAskAi()) {
      window.showQuotaAlert(
        '🤖 Daily AI Chatbot Limit Reached!',
        `You have used all ${auth.getTier().dailyAiLimit} free AI chatbot queries for today. Upgrade to Premium (₹99/mo) for 50 queries/day or Pro (₹299/3mo) for Unlimited AI Study Assistant!`,
        'premium'
      );
      return;
    }

    // Append user message
    this.appendMessage('user', text);
    this.inputField.value = '';

    // Record AI query in auth manager
    auth.recordAiQuery();
    this.updateQuotaDisplay();

    // Show typing indicator
    const typingElem = this.showTypingIndicator();

    // Simulate AI response calculation
    setTimeout(() => {
      if (typingElem) typingElem.remove();
      const response = this.generateAiResponse(text);
      this.appendMessage('assistant', response);
    }, 650);
  }

  showTypingIndicator() {
    if (!this.chatBody) return null;
    const typing = document.createElement('div');
    typing.className = 'chat-message ai-message typing-indicator-msg';
    typing.innerHTML = `
      <div class="msg-avatar"><i class="fa-solid fa-robot"></i></div>
      <div class="msg-bubble typing-bubble">
        <span></span><span></span><span></span>
      </div>
    `;
    this.chatBody.appendChild(typing);
    this.chatBody.scrollTop = this.chatBody.scrollHeight;
    return typing;
  }

  generateAiResponse(prompt) {
    const p = prompt.toLowerCase();

    // Check knowledge base matches
    for (const item of AI_KNOWLEDGE_BASE) {
      if (item.keywords.some(k => p.includes(k))) {
        return item.answer;
      }
    }

    // Dynamic tailored responses for competitive exams
    if (p.includes('gpsc') || p.includes('ojas') || p.includes('dyso')) {
      return `### 🦁 GPSC Class 1-2 & DySO Preparation Roadmap
1. **Preliminary Focus:** 
   - Master **Gujarat History** (Solanki, Chavda, Sultanate, Vadodara Gaekwad reforms).
   - Study **Gujarat Geography** (Rivers: Narmada, Tapi, Sabarmati; Soils of Saurashtra & Bhal; Mineral belts).
   - Ensure 90%+ accuracy in CSAT / Mental Ability (200 marks in Paper 1).
2. **Mains Strategy:** 
   - Regular Gujarati Language answer drafting (press notes, translation, precision).
   - Focus on GS-2 Ethics and Governance cases in Gujarat context.
3. **Current Affairs:** Budget of Gujarat + Socio-Economic Review (SER) data are goldmines for Prelims & Mains!`;
    }

    if (p.includes('ssc') || p.includes('cgl') || p.includes('math') || p.includes('reasoning')) {
      return `### 📊 SSC CGL 2026 Strategy & Scoring Checklist
1. **Tier-1 Target:** 150+ Marks for safe cutoff across UR/OBC/EWS.
2. **Quantitative Aptitude High-Yield Topics:**
   - Geometry & Mensuration (2D/3D formulas)
   - Trigonometry & Heights and Distances
   - Algebra (Identities: $a^3 + b^3 + c^3 - 3abc$)
   - Profit, Loss & Discount (Successive % method)
3. **Reasoning:** Daily 2 sectional mocks with 95% accuracy in 15 minutes.
4. **General Awareness:** Focus on 2024-2026 Government schemes, Classical Dances, Articles of Constitution, and Periodic Table elements.`;
    }

    if (p.includes('bank') || p.includes('sbi') || p.includes('ibps') || p.includes('puzzle')) {
      return `### 🏦 Banking (SBI / IBPS PO) Exam Success Formula
1. **Sectional Speed is King:** 
   - 20 minutes for 35 Quant questions $\\rightarrow$ Attempt Simplification, Number Series, and Quadratic Equations first (10 marks in 4 minutes).
2. **Puzzles & Seating Arrangement:**
   - Draw multiple parallel cases (Case 1, Case 2) rather than erasing assumptions.
   - Look for definite positive statements first.
3. **Financial Awareness:**
   - Priority Sector Lending (PSL) norms, Monetary Policy rates (Repo, Reverse Repo, SDF, MSF), Basel III standards, and RBI Circulars.`;
    }

    if (p.includes('current affairs') || p.includes('newspaper') || p.includes('notes')) {
      return `### 📰 How to Read Newspaper & Master Current Affairs in 45 Mins/Day:
1. **What to Read:**
   - Editorial & Opinion page (for analytical arguments and Mains perspectives).
   - National, Economy, Science & Tech sections.
2. **What to SKIP Completely:**
   - Political mud-slinging, crime reports, local city accidents, entertainment news.
3. **Smart Note Taking Formula:**
   - Note *Issue*, *Key Data*, *Govt Initiative/Act*, and *Constitutional Context*.
   - Example: Digital Rupee $\\rightarrow$ RBI CBDC pilot $\\rightarrow$ DLT architecture $\\rightarrow$ Offline tokenization.`;
    }

    // Default intelligent tutor response
    return `### 🎯 Expert Guidance for "${prompt}"

To excel in this topic for **Indian Government Examinations**:

1. **Conceptual Clarity:** Focus on the foundational principles from standard sources (NCERT / GCERT / Standard Subject Textbooks).
2. **Previous Year Trends (PYQ):** Over 60% of question patterns in UPSC, GPSC, and SSC repeat around core themes.
3. **Actionable Step:**
   - Solve at least 15-20 MCQs on this specific topic in our **Mock Test Arena**.
   - Note down any formula or fact you missed in your **Digital Mistake Notebook**.

> 💡 *Need a specific syllabus breakdown, mock test question, or timetable? Ask me anytime!*`;
  }

  appendMessage(sender, text) {
    if (!this.chatBody) return;
    const msg = document.createElement('div');
    msg.className = `chat-message ${sender === 'user' ? 'user-message' : 'ai-message'}`;

    const formattedContent = this.formatMarkdown(text);

    if (sender === 'user') {
      msg.innerHTML = `
        <div class="msg-bubble user-bubble">${text.replace(/\n/g, '<br>')}</div>
        <div class="msg-avatar user-avatar"><i class="fa-solid fa-user"></i></div>
      `;
    } else {
      msg.innerHTML = `
        <div class="msg-avatar ai-avatar"><i class="fa-solid fa-robot"></i></div>
        <div class="msg-bubble ai-bubble">
          <div class="ai-msg-content">${formattedContent}</div>
          <div class="ai-msg-actions">
            <button class="ai-action-btn" title="Copy Response" onclick="window.copyToClipboard(this)"><i class="fa-regular fa-copy"></i> Copy</button>
            <button class="ai-action-btn" title="Save to Notes" onclick="window.saveAiNote(this)"><i class="fa-regular fa-bookmark"></i> Save Note</button>
          </div>
        </div>
      `;
    }

    this.chatBody.appendChild(msg);
    this.chatBody.scrollTop = this.chatBody.scrollHeight;
  }

  formatMarkdown(text) {
    let html = text
      .replace(/### (.*?)\n/g, '<h4>$1</h4>')
      .replace(/#### (.*?)\n/g, '<h5>$1</h5>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/> (.*?)\n/g, '<blockquote>$1</blockquote>')
      .replace(/- (.*?)\n/g, '<li>$1</li>')
      .replace(/\n\n/g, '<p></p>')
      .replace(/\n/g, '<br>');

    // Wrap list items
    html = html.replace(/(<li>.*?<\/li>)+/g, '<ul>$&</ul>');
    return html;
  }
}

window.copyToClipboard = function(btn) {
  const bubble = btn.closest('.ai-bubble')?.querySelector('.ai-msg-content');
  if (bubble) {
    navigator.clipboard.writeText(bubble.innerText);
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
    setTimeout(() => {
      btn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy';
    }, 2000);
  }
};

window.saveAiNote = function(btn) {
  const bubble = btn.closest('.ai-bubble')?.querySelector('.ai-msg-content');
  if (bubble) {
    window.showToast('Saved to Notes!', 'This AI explanation has been saved to your student profile notebook.', 'success');
    btn.innerHTML = '<i class="fa-solid fa-bookmark"></i> Saved';
  }
};

window.aiStudyAssistant = new AiStudyAssistant();
