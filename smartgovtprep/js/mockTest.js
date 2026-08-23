// ==========================================
// SmartGovtPrep - Interactive Mock Test Engine
// ==========================================

class MockTestEngine {
  constructor() {
    this.questions = [];
    this.currentIndex = 0;
    this.userAnswers = {}; // { questionId: selectedOptionIndex }
    this.markedForReview = {}; // { questionId: boolean }
    this.visitedQuestions = {}; // { questionId: boolean }
    this.timerInterval = null;
    this.totalSeconds = 600; // 10 minutes default
    this.remainingSeconds = 600;
    this.isTestActive = false;
    this.activeSubject = 'all';
    this.testName = 'General Studies Full Mock Mini Test';

    this.initElements();
    this.bindEvents();
  }

  initElements() {
    this.container = document.getElementById('mock-test-section');
    this.introView = document.getElementById('mock-test-intro');
    this.arenaView = document.getElementById('mock-test-arena');
    this.resultView = document.getElementById('mock-test-result');
    this.timerDisplay = document.getElementById('mock-timer-display');
    this.questionNum = document.getElementById('mock-q-number');
    this.questionSubject = document.getElementById('mock-q-subject');
    this.questionText = document.getElementById('mock-q-text');
    this.optionsContainer = document.getElementById('mock-options-container');
    this.paletteContainer = document.getElementById('mock-palette-grid');
    this.summaryAnswered = document.getElementById('summary-answered');
    this.summaryReview = document.getElementById('summary-review');
    this.summaryRemaining = document.getElementById('summary-remaining');
  }

  bindEvents() {
    const startBtn = document.getElementById('start-mock-btn');
    if (startBtn) {
      startBtn.addEventListener('click', () => this.startTest());
    }

    const prevBtn = document.getElementById('mock-prev-btn');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.navigatePrev());
    }

    const nextBtn = document.getElementById('mock-next-btn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.navigateNext());
    }

    const reviewBtn = document.getElementById('mock-review-btn');
    if (reviewBtn) {
      reviewBtn.addEventListener('click', () => this.toggleReview());
    }

    const clearBtn = document.getElementById('mock-clear-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => this.clearCurrentResponse());
    }

    const submitBtn = document.getElementById('mock-submit-btn');
    if (submitBtn) {
      submitBtn.addEventListener('click', () => this.confirmSubmit());
    }

    const reattemptBtn = document.getElementById('mock-reattempt-btn');
    if (reattemptBtn) {
      reattemptBtn.addEventListener('click', () => this.resetToIntro());
    }

    // Filter selectors in intro
    const subjectSelect = document.getElementById('mock-subject-filter');
    if (subjectSelect) {
      subjectSelect.addEventListener('change', (e) => {
        this.activeSubject = e.target.value;
      });
    }
  }

  startTest() {
    const auth = window.authManager;
    const tier = auth.getTier();

    // Check Free quota
    if (tier.id === 'free' && (auth.getUser().dailyStats?.mcqsUsed || 0) >= tier.dailyMcqLimit) {
      window.showQuotaAlert(
        'Daily MCQ Limit Reached!',
        `You have used your 5 free daily MCQs. Upgrade to Premium for ₹99/month for UNLIMITED Mock Tests, real-time analytics & deep explanations!`,
        'premium'
      );
      return;
    }

    // Filter questions by subject
    if (this.activeSubject === 'all') {
      this.questions = [...MOCK_QUESTION_BANK];
    } else {
      this.questions = MOCK_QUESTION_BANK.filter(q => q.examCategory === this.activeSubject || q.subject.toLowerCase().includes(this.activeSubject.toLowerCase()));
      if (this.questions.length === 0) {
        this.questions = [...MOCK_QUESTION_BANK];
      }
    }

    this.currentIndex = 0;
    this.userAnswers = {};
    this.markedForReview = {};
    this.visitedQuestions = { 0: true };
    this.totalSeconds = this.questions.length * 60; // 1 min per question
    this.remainingSeconds = this.totalSeconds;
    this.isTestActive = true;

    // Switch view
    this.introView.classList.add('hidden');
    this.resultView.classList.add('hidden');
    this.arenaView.classList.remove('hidden');

    this.renderPalette();
    this.renderQuestion(0);
    this.startTimer();
    this.updateStatsBar();

    // Scroll to arena
    this.arenaView.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  startTimer() {
    clearInterval(this.timerInterval);
    this.updateTimerDisplay();

    this.timerInterval = setInterval(() => {
      this.remainingSeconds--;
      this.updateTimerDisplay();

      if (this.remainingSeconds <= 0) {
        clearInterval(this.timerInterval);
        window.showToast('Time Up!', 'Your mock test has been automatically submitted.', 'info');
        this.submitTest(true);
      }
    }, 1000);
  }

  updateTimerDisplay() {
    if (!this.timerDisplay) return;
    const mins = Math.floor(this.remainingSeconds / 60);
    const secs = this.remainingSeconds % 60;
    this.timerDisplay.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    if (this.remainingSeconds < 60) {
      this.timerDisplay.parentElement.classList.add('timer-warning');
    } else {
      this.timerDisplay.parentElement?.classList.remove('timer-warning');
    }
  }

  renderQuestion(index) {
    if (index < 0 || index >= this.questions.length) return;
    this.currentIndex = index;
    this.visitedQuestions[index] = true;

    const q = this.questions[index];
    this.questionNum.textContent = `Question ${index + 1} of ${this.questions.length}`;
    this.questionSubject.textContent = `${q.subject} • ${q.difficulty} • Target: ${q.examCategory.toUpperCase()}`;
    this.questionText.textContent = q.question;

    // Render Options
    this.optionsContainer.innerHTML = '';
    const selected = this.userAnswers[q.id];

    q.options.forEach((opt, optIndex) => {
      const optBtn = document.createElement('div');
      optBtn.className = `mock-option-item ${selected === optIndex ? 'selected' : ''}`;
      optBtn.innerHTML = `
        <span class="opt-label">${String.fromCharCode(65 + optIndex)}</span>
        <span class="opt-text">${opt}</span>
        <span class="opt-check"><i class="fa-solid ${selected === optIndex ? 'fa-circle-check' : 'fa-circle'}"></i></span>
      `;
      optBtn.addEventListener('click', () => this.selectOption(q.id, optIndex));
      this.optionsContainer.appendChild(optBtn);
    });

    // Update buttons
    const prevBtn = document.getElementById('mock-prev-btn');
    if (prevBtn) prevBtn.disabled = index === 0;

    const nextBtn = document.getElementById('mock-next-btn');
    if (nextBtn) {
      nextBtn.textContent = index === this.questions.length - 1 ? 'Review & Submit' : 'Save & Next';
    }

    const reviewBtn = document.getElementById('mock-review-btn');
    if (reviewBtn) {
      const isReview = !!this.markedForReview[q.id];
      reviewBtn.innerHTML = isReview ?
        '<i class="fa-solid fa-bookmark"></i> Marked for Review' :
        '<i class="fa-regular fa-bookmark"></i> Mark for Review';
      if (isReview) reviewBtn.classList.add('active-review');
      else reviewBtn.classList.remove('active-review');
    }

    this.renderPalette();
    this.updateStatsBar();
  }

  selectOption(qId, optionIndex) {
    const auth = window.authManager;
    const tier = auth.getTier();

    // Check quota for free users if this is a newly answered question
    if (tier.id === 'free' && this.userAnswers[qId] === undefined) {
      const usedToday = auth.getUser().dailyStats?.mcqsUsed || 0;
      if (usedToday >= tier.dailyMcqLimit) {
        window.showQuotaAlert(
          'Daily 5 MCQ Limit Reached!',
          'Free aspirants get 5 MCQs per day. Upgrade to Premium for ₹99/month for UNLIMITED Mock Tests & Explanations!',
          'premium'
        );
        return;
      }
    }

    this.userAnswers[qId] = optionIndex;
    this.renderQuestion(this.currentIndex);
  }

  clearCurrentResponse() {
    const q = this.questions[this.currentIndex];
    delete this.userAnswers[q.id];
    this.renderQuestion(this.currentIndex);
  }

  toggleReview() {
    const q = this.questions[this.currentIndex];
    this.markedForReview[q.id] = !this.markedForReview[q.id];
    this.renderQuestion(this.currentIndex);
  }

  navigatePrev() {
    if (this.currentIndex > 0) {
      this.renderQuestion(this.currentIndex - 1);
    }
  }

  navigateNext() {
    if (this.currentIndex < this.questions.length - 1) {
      this.renderQuestion(this.currentIndex + 1);
    } else {
      this.confirmSubmit();
    }
  }

  renderPalette() {
    if (!this.paletteContainer) return;
    this.paletteContainer.innerHTML = '';

    this.questions.forEach((q, index) => {
      const item = document.createElement('button');
      item.className = 'palette-btn';

      const isAnswered = this.userAnswers[q.id] !== undefined;
      const isReview = !!this.markedForReview[q.id];
      const isCurrent = index === this.currentIndex;

      if (isAnswered && isReview) {
        item.classList.add('status-answered-review');
      } else if (isAnswered) {
        item.classList.add('status-answered');
      } else if (isReview) {
        item.classList.add('status-review');
      } else if (this.visitedQuestions[index]) {
        item.classList.add('status-visited');
      } else {
        item.classList.add('status-not-visited');
      }

      if (isCurrent) item.classList.add('status-current');

      item.textContent = index + 1;
      item.addEventListener('click', () => this.renderQuestion(index));
      this.paletteContainer.appendChild(item);
    });
  }

  updateStatsBar() {
    const answeredCount = Object.keys(this.userAnswers).length;
    const reviewCount = Object.keys(this.markedForReview).filter(k => this.markedForReview[k]).length;
    const remainingCount = this.questions.length - answeredCount;

    if (this.summaryAnswered) this.summaryAnswered.textContent = answeredCount;
    if (this.summaryReview) this.summaryReview.textContent = reviewCount;
    if (this.summaryRemaining) this.summaryRemaining.textContent = remainingCount;
  }

  confirmSubmit() {
    const answeredCount = Object.keys(this.userAnswers).length;
    const unanswered = this.questions.length - answeredCount;

    const modalHtml = `
      <div class="confirm-modal-box">
        <div class="modal-icon"><i class="fa-solid fa-clipboard-check"></i></div>
        <h3>Submit Mock Test?</h3>
        <p>You have attempted <strong>${answeredCount}</strong> of <strong>${this.questions.length}</strong> questions (${unanswered} unattempted).</p>
        <div class="modal-actions">
          <button class="btn btn-secondary" onclick="window.closeCustomModal()">Continue Test</button>
          <button class="btn btn-primary" onclick="window.mockTestEngine.submitTest(); window.closeCustomModal();">Yes, Submit Now</button>
        </div>
      </div>
    `;
    window.showCustomModal(modalHtml);
  }

  submitTest(auto = false) {
    clearInterval(this.timerInterval);
    this.isTestActive = false;

    let correctCount = 0;
    let wrongCount = 0;
    let skippedCount = 0;
    let score = 0;

    const auth = window.authManager;
    const timeSpentSeconds = this.totalSeconds - this.remainingSeconds;

    this.questions.forEach(q => {
      const userAns = this.userAnswers[q.id];
      if (userAns === undefined) {
        skippedCount++;
      } else if (userAns === q.correctIndex) {
        correctCount++;
        score += 2; // +2 marks for correct
        auth.recordMcqAttempt(true);
      } else {
        wrongCount++;
        score -= 0.66; // -0.66 negative marking
        auth.recordMcqAttempt(false);
      }
    });

    const totalPossibleMarks = this.questions.length * 2;
    const finalScore = Math.max(0, score).toFixed(2);
    const accuracy = (correctCount + wrongCount > 0) ? Math.round((correctCount / (correctCount + wrongCount)) * 100) : 0;

    // Save history
    const resultSummary = {
      examName: this.testName,
      score: parseFloat(finalScore),
      total: totalPossibleMarks,
      accuracy: accuracy,
      date: new Date().toISOString().split('T')[0],
      timeSpent: `${Math.floor(timeSpentSeconds / 60)}m ${timeSpentSeconds % 60}s`
    };
    auth.recordMockTestResult(resultSummary);

    // Render Results
    this.renderResults({
      score: finalScore,
      totalPossibleMarks,
      accuracy,
      correctCount,
      wrongCount,
      skippedCount,
      timeSpentSeconds
    });
  }

  renderResults(res) {
    this.arenaView.classList.add('hidden');
    this.resultView.classList.remove('hidden');

    const scoreElem = document.getElementById('result-score-val');
    const accuracyElem = document.getElementById('result-accuracy-val');
    const correctElem = document.getElementById('result-correct-val');
    const wrongElem = document.getElementById('result-wrong-val');
    const skippedElem = document.getElementById('result-skipped-val');
    const timeElem = document.getElementById('result-time-val');
    const solutionsContainer = document.getElementById('result-solutions-list');

    if (scoreElem) scoreElem.textContent = `${res.score} / ${res.totalPossibleMarks}`;
    if (accuracyElem) accuracyElem.textContent = `${res.accuracy}%`;
    if (correctElem) correctElem.textContent = res.correctCount;
    if (wrongElem) wrongElem.textContent = res.wrongCount;
    if (skippedElem) skippedElem.textContent = res.skippedCount;
    if (timeElem) timeElem.textContent = `${Math.floor(res.timeSpentSeconds / 60)}m ${res.timeSpentSeconds % 60}s`;

    // Render Solutions list
    if (solutionsContainer) {
      solutionsContainer.innerHTML = '';
      this.questions.forEach((q, idx) => {
        const userChoice = this.userAnswers[q.id];
        const isCorrect = userChoice === q.correctIndex;
        const isSkipped = userChoice === undefined;

        const solCard = document.createElement('div');
        solCard.className = `solution-card ${isCorrect ? 'sol-correct' : isSkipped ? 'sol-skipped' : 'sol-wrong'}`;

        let statusBadge = '';
        if (isCorrect) statusBadge = '<span class="badge badge-success"><i class="fa-solid fa-check"></i> Correct (+2)</span>';
        else if (isSkipped) statusBadge = '<span class="badge badge-secondary"><i class="fa-solid fa-minus"></i> Skipped (0)</span>';
        else statusBadge = '<span class="badge badge-danger"><i class="fa-solid fa-xmark"></i> Incorrect (-0.66)</span>';

        let optionsListHtml = q.options.map((opt, optIdx) => {
          let optClass = 'sol-option';
          if (optIdx === q.correctIndex) optClass += ' correct-option';
          if (userChoice === optIdx && !isCorrect) optClass += ' user-wrong-option';

          return `
            <div class="${optClass}">
              <strong>${String.fromCharCode(65 + optIdx)}.</strong> ${opt}
              ${optIdx === q.correctIndex ? '<span class="correct-tag">✓ Correct Answer</span>' : ''}
              ${userChoice === optIdx && !isCorrect ? '<span class="wrong-tag">✗ Your Answer</span>' : ''}
            </div>
          `;
        }).join('');

        solCard.innerHTML = `
          <div class="sol-header">
            <h4>Q${idx + 1}. ${q.subject}</h4>
            ${statusBadge}
          </div>
          <p class="sol-question">${q.question}</p>
          <div class="sol-options-wrap">
            ${optionsListHtml}
          </div>
          <div class="sol-explanation-box">
            <div class="sol-exp-title"><i class="fa-solid fa-lightbulb"></i> Step-by-Step Explanation & Concept:</div>
            <p>${q.explanation.replace(/\n/g, '<br>')}</p>
            ${q.hint ? `<div class="sol-hint"><strong>💡 Exam Shortcut / Tip:</strong> ${q.hint}</div>` : ''}
          </div>
        `;
        solutionsContainer.appendChild(solCard);
      });
    }

    this.resultView.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  resetToIntro() {
    this.arenaView.classList.add('hidden');
    this.resultView.classList.add('hidden');
    this.introView.classList.remove('hidden');
    this.introView.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

window.mockTestEngine = new MockTestEngine();
