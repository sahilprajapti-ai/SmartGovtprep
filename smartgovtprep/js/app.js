// ==========================================
// SmartGovtPrep - Main Application Orchestrator
// ==========================================

// Dynamic current/future year detection
const CURRENT_YEAR = String(new Date().getFullYear()); // '2026'
const FUTURE_YEARS = ['2027', '2028', '2029', '2030'].filter(y => y > CURRENT_YEAR);

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  // Auto-tag exam phases based on actual current year
  UPCOMING_EXAMS.forEach(ex => {
    if (ex.year === CURRENT_YEAR) {
      ex.phase = 'current';
    } else if (ex.year > CURRENT_YEAR) {
      ex.phase = 'target-future';
    }
  });

  initCountdown();
  renderCategories();
  renderUpcomingExams('all', 'all', 'all', '');
  renderLifetimeRoadmap('graduate');
  renderSyllabus('gpsc-class12');
  renderCurrentAffairs('all');
  renderPYQList();
  renderOfficialPortals();
  updateProgressTracker();
  updateHeaderProfile();
  bindGlobalEvents();
  updateYearLabels(); // Update dynamic labels on the page
}

// Update any dynamic year labels in the DOM
function updateYearLabels() {
  const cyElem = document.getElementById('current-year-label');
  if (cyElem) cyElem.textContent = CURRENT_YEAR;
  const fuElem = document.getElementById('future-years-label');
  if (fuElem) fuElem.textContent = FUTURE_YEARS.join(', ');
}

// // ------------------------------------------
// 1. Live Countdown Timer (Dynamic Year Detection)
// ------------------------------------------
let countdownInterval = null;

function initCountdown() {
  const examSelect = document.getElementById('hero-countdown-select');
  if (examSelect) {
    const currentYearExams = UPCOMING_EXAMS.filter(e => e.year === CURRENT_YEAR);
    const futureExams = UPCOMING_EXAMS.filter(e => e.year > CURRENT_YEAR);

    const makeOption = ex =>
      `<option value="${ex.examDate}" data-name="${ex.name}" data-id="${ex.id}">
        ${ex.name} (${formatDateString(ex.examDate)})
      </option>`;

    examSelect.innerHTML =
      `<optgroup label="⚡ Current Year Active Exams">
        ${currentYearExams.map(makeOption).join('')}
       </optgroup>
       <optgroup label="🎯 Future Year Target Exams">
        ${futureExams.map(makeOption).join('')}
       </optgroup>`;

    examSelect.addEventListener('change', (e) => {
      startExamCountdown(e.target.value, e.target.options[e.target.selectedIndex].getAttribute('data-name'));
    });

    // Auto-select user's target exam if set, else first current-year exam
    const user = window.authManager?.getUser();
    const targetExam = user?.targetExam ? UPCOMING_EXAMS.find(e => e.id === user.targetExam) : null;
    const defaultExam = targetExam || currentYearExams[0] || UPCOMING_EXAMS[0];
    if (defaultExam) {
      examSelect.value = defaultExam.examDate;
      startExamCountdown(defaultExam.examDate, defaultExam.name);
    }
  }
}

function startExamCountdown(dateStr, examName) {
  clearInterval(countdownInterval);

  const daysElem = document.getElementById('count-days');
  const hoursElem = document.getElementById('count-hours');
  const minsElem = document.getElementById('count-mins');
  const secsElem = document.getElementById('count-secs');
  const labelElem = document.getElementById('countdown-target-label');

  if (labelElem) labelElem.textContent = examName;

  const targetDate = new Date(`${dateStr}T09:30:00+05:30`).getTime();

  function update() {
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff <= 0) {
      if (daysElem) daysElem.textContent = '00';
      if (hoursElem) hoursElem.textContent = '00';
      if (minsElem) minsElem.textContent = '00';
      if (secsElem) secsElem.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    if (daysElem) daysElem.textContent = String(days).padStart(2, '0');
    if (hoursElem) hoursElem.textContent = String(hours).padStart(2, '0');
    if (minsElem) minsElem.textContent = String(mins).padStart(2, '0');
    if (secsElem) secsElem.textContent = String(secs).padStart(2, '0');
  }

  update();
  countdownInterval = setInterval(update, 1000);
}

// ------------------------------------------
// 2. Exam Categories Grid
// ------------------------------------------
function renderCategories() {
  const container = document.getElementById('categories-grid');
  if (!container) return;

  container.innerHTML = EXAM_CATEGORIES.map(cat => `
    <div class="category-card" data-cat-id="${cat.id}">
      <div class="cat-icon-box">
        <i class="fa-solid ${cat.icon}"></i>
      </div>
      <div class="cat-info">
        <div class="cat-title-row">
          <h3>${cat.name}</h3>
          ${cat.badge ? `<span class="cat-badge">${cat.badge}</span>` : ''}
        </div>
        <p class="cat-count">${cat.count}+ Vacancies (Current &amp; Future Years)</p>
      </div>
      <div class="cat-arrow"><i class="fa-solid fa-arrow-right"></i></div>
    </div>
  `).join('');

  // Bind click
  container.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
      const catId = card.getAttribute('data-cat-id');
      renderUpcomingExams(catId, currentYearFilter, currentPhaseFilter);
      // Highlight active category filter pill
      document.querySelectorAll('.cat-filter-pill').forEach(p => {
        p.classList.toggle('active', p.getAttribute('data-filter') === catId);
      });
      // Smooth scroll to upcoming exams
      document.getElementById('upcoming-exams-section')?.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

// ------------------------------------------
// 3. Upcoming Exams Tracker (Current & Target Future Multi-Year)
// ------------------------------------------
let currentExamFilter = 'all';
let currentYearFilter = 'all';
let currentPhaseFilter = 'all';

function renderUpcomingExams(category = 'all', year = 'all', phase = 'all', searchQuery = '') {
  currentExamFilter = category;
  currentYearFilter = year;
  currentPhaseFilter = phase;
  const container = document.getElementById('upcoming-exams-list');
  if (!container) return;

  let list = UPCOMING_EXAMS;

  // Filter by Phase (Current vs Target Future)
  if (phase !== 'all') {
    list = list.filter(ex => ex.phase === phase);
  }

  // Filter by Category
  if (category !== 'all') {
    list = list.filter(ex => ex.category === category);
  }

  // Filter by Timeline / Year
  if (year !== 'all') {
    if (year === 'current') {
      list = list.filter(ex => ex.year === CURRENT_YEAR);
    } else if (year === 'next') {
      const nextYear = String(Number(CURRENT_YEAR) + 1);
      list = list.filter(ex => ex.year === nextYear);
    } else if (year === 'future') {
      list = list.filter(ex => ex.year > CURRENT_YEAR);
    } else {
      list = list.filter(ex => ex.year === year);
    }
  }

  // Filter by Search Query
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    list = list.filter(ex => 
      ex.name.toLowerCase().includes(q) ||
      ex.conductingBody.toLowerCase().includes(q) ||
      ex.posts.toLowerCase().includes(q) ||
      ex.state.toLowerCase().includes(q) ||
      (ex.year && ex.year.includes(q))
    );
  }

  if (list.length === 0) {
    container.innerHTML = `
      <div class="no-results-box">
        <i class="fa-solid fa-magnifying-glass"></i>
        <h3>No exams found matching your criteria</h3>
        <p>Try clearing phase/timeline/category filters or search with another keyword.</p>
        <button class="btn btn-secondary" onclick="renderUpcomingExams('all', 'all', 'all', '')">Reset All Filters</button>
      </div>
    `;
    return;
  }

  const auth = window.authManager;
  const currentUser = auth.getUser();

  container.innerHTML = list.map(ex => {
    const isBookmarked = auth.isBookmarked(ex.id);
    const isTarget = currentUser && currentUser.targetExam === ex.id;

    // Phase classification using CURRENT_YEAR
    const isCurrent = ex.year === CURRENT_YEAR;
    const isFuture  = ex.year > CURRENT_YEAR;

    // Status pill colour
    const statusClass = ex.status.toLowerCase().includes('live') ? 'status-live'
      : (ex.status.toLowerCase().includes('upcoming') ? 'status-upcoming' : 'status-future');

    // Year badge colour class
    const yearBadgeClass = isCurrent ? 'year-badge-current' : 'year-badge-future';

    // Year group label in card header
    const phaseLabel  = isCurrent ? '⚡ Current Year Exam' : '🎯 Future Year Exam';
    const phaseClass  = isCurrent ? 'phase-current'        : 'phase-future';
    const phaseIcon   = isCurrent ? 'fa-bolt'               : 'fa-crosshairs';

    return `
      <div class="exam-card-row ${ex.featured ? 'featured-exam' : ''} ${isTarget ? 'user-target-highlight' : ''}">
        <div class="exam-main-col">
          <div class="exam-tag-row">
            <span class="exam-phase-pill ${phaseClass}">
              <i class="fa-solid ${phaseIcon}"></i> ${phaseLabel}
            </span>
            <span class="exam-year-badge ${yearBadgeClass}">
              <i class="fa-solid fa-calendar-check"></i> ${ex.year}
            </span>
            <span class="exam-category-pill">${ex.category.toUpperCase()}</span>
            <span class="exam-status-pill ${statusClass}"><i class="fa-solid fa-circle"></i> ${ex.status}</span>
            <span class="exam-state-pill"><i class="fa-solid fa-location-dot"></i> ${ex.state}</span>
            ${isTarget ? `<span class="target-active-tag"><i class="fa-solid fa-star"></i> My Primary Target</span>` : ''}
          </div>
          <h3 class="exam-title">${ex.name}</h3>
          <p class="exam-posts"><i class="fa-solid fa-id-card"></i> <strong>Posts:</strong> ${ex.posts}</p>
          <div class="exam-details-chips">
            <div class="chip"><i class="fa-solid fa-users"></i> <strong>Vacancies:</strong> ${ex.vacancies}</div>
            <div class="chip"><i class="fa-solid fa-graduation-cap"></i> <strong>Eligibility:</strong> ${ex.eligibility}</div>
            <div class="chip"><i class="fa-regular fa-clock"></i> <strong>Age Limit:</strong> ${ex.ageLimit}</div>
            ${ex.strategyTip ? `<div class="chip strategy-chip"><i class="fa-solid fa-lightbulb"></i> <strong>Strategy:</strong> ${ex.strategyTip}</div>` : ''}
          </div>
        </div>

        <div class="exam-timeline-col">
          <div class="timeline-item">
            <span class="tl-label">Apply Window:</span>
            <span class="tl-val">${formatDateString(ex.appStart)} – ${formatDateString(ex.appEnd)}</span>
          </div>
          <div class="timeline-item highlight-exam-date">
            <span class="tl-label">Exam Scheduled:</span>
            <span class="tl-val"><i class="fa-regular fa-calendar-check"></i> ${formatDateString(ex.examDate)}</span>
          </div>
          <button class="btn ${isTarget ? 'btn-target-active' : 'btn-outline'} btn-sm set-target-btn" onclick="window.setAsMyTargetExam('${ex.id}', '${ex.name.replace(/'/g, "\\'")}')">
            <i class="fa-solid ${isTarget ? 'fa-check' : 'fa-crosshairs'}"></i> ${isTarget ? '★ Primary Goal' : 'Set as My Target'}
          </button>
        </div>

        <div class="exam-actions-col">
          <button class="btn btn-primary btn-sm" onclick="window.viewSyllabusFor('${ex.syllabusId}')">
            <i class="fa-solid fa-book-open"></i> Syllabus
          </button>
          <button class="btn btn-secondary btn-sm" onclick="window.openNotificationModal('${ex.id}')">
            <i class="fa-solid fa-file-lines"></i> Notification
          </button>
          <a href="${ex.officialUrl}" target="_blank" rel="noopener" class="btn btn-outline btn-sm">
            <i class="fa-solid fa-arrow-up-right-from-square"></i> Apply
          </a>
          <button class="bookmark-icon-btn ${isBookmarked ? 'bookmarked' : ''}" onclick="window.toggleExamBookmark('${ex.id}', this)" title="Bookmark Exam">
            <i class="fa-solid fa-bell"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

window.setAsMyTargetExam = function(examId, examName) {
  const auth = window.authManager;
  auth.setTargetExam(examId, examName);
  
  // Set hero countdown to this exam if found
  const examObj = UPCOMING_EXAMS.find(e => e.id === examId);
  if (examObj) {
    const select = document.getElementById('hero-countdown-select');
    if (select) select.value = examObj.examDate;
    startExamCountdown(examObj.examDate, examObj.name);
  }

  // Refresh upcoming exams list
  renderUpcomingExams(currentExamFilter, currentYearFilter, currentPhaseFilter);
  updateHeaderProfile();
  window.showToast('🎯 Target Exam Configured!', `Your primary preparation goal is set to "${examName}". Countdown and study roadmap updated!`, 'success');
};

// ------------------------------------------
// 3.5 Lifetime Government Exam Career Roadmap & Eligibility Engine
// ------------------------------------------
let currentLifetimeStage = 'graduate';

function renderLifetimeRoadmap(stage = 'graduate') {
  currentLifetimeStage = stage;
  const container = document.getElementById('lifetime-cards-grid');
  if (!container) return;

  let list = LIFETIME_CAREER_ROADMAP;
  if (stage !== 'all') {
    list = list.filter(item => item.stage === stage);
  }

  container.innerHTML = list.map(item => `
    <div class="lifetime-exam-card">
      <div class="lec-header">
        <div class="lec-icon-box">
          <i class="fa-solid ${item.icon}"></i>
        </div>
        <div class="lec-title-wrap">
          <span class="lec-badge">${item.badge}</span>
          <h4>${item.name}</h4>
          <span class="lec-authority"><i class="fa-solid fa-building-columns"></i> ${item.authority}</span>
        </div>
      </div>

      <div class="lec-body">
        <div class="lec-info-row">
          <span class="lec-label"><i class="fa-solid fa-id-badge"></i> Cadre &amp; Posts:</span>
          <span class="lec-val">${item.posts}</span>
        </div>
        <div class="lec-info-row">
          <span class="lec-label"><i class="fa-regular fa-clock"></i> Lifetime Age Window:</span>
          <span class="lec-val highlight-age">${item.ageRange}</span>
        </div>
        <div class="lec-info-row">
          <span class="lec-label"><i class="fa-solid fa-indian-rupee-sign"></i> Salary &amp; Scale:</span>
          <span class="lec-val highlight-salary">${item.salary}</span>
        </div>
        <div class="lec-info-row">
          <span class="lec-label"><i class="fa-solid fa-arrows-rotate"></i> Attempt Limits:</span>
          <span class="lec-val">${item.attempts}</span>
        </div>
      </div>

      <div class="lec-footer">
        <p class="lec-highlights"><i class="fa-solid fa-lightbulb"></i> ${item.highlights}</p>
      </div>
    </div>
  `).join('');
}

// Interactive Lifetime Eligibility Calculator
window.calculateLifetimeEligibility = function() {
  const age = parseInt(document.getElementById('calc-age-input')?.value || '23', 10);
  const edu = document.getElementById('calc-edu-input')?.value || 'graduate';
  const cat = document.getElementById('calc-cat-input')?.value || 'general';
  const resultBox = document.getElementById('lifetime-calc-results');

  if (!resultBox) return;

  // Category age relaxation logic
  let extraAge = 0;
  if (cat === 'obc') extraAge = 3;
  else if (cat === 'scst') extraAge = 5;
  else if (cat === 'female') extraAge = 5;
  else if (cat === 'pwd') extraAge = 10;
  else if (cat === 'ews') extraAge = 0;

  // Find eligible exams
  const eligibleExams = LIFETIME_CAREER_ROADMAP.filter(ex => {
    const effectiveMaxAge = Math.min(ex.maxAgeRelaxed, ex.maxAgeGeneral + extraAge);
    const ageEligible = age >= ex.minAge && age <= effectiveMaxAge;
    const eduEligible = ex.educationReq.includes(edu);
    return ageEligible && eduEligible;
  });

  // Calculate max remaining years in any govt exam
  const maxFutureAge = cat === 'general' ? 42 : 47;
  const remainingYears = Math.max(0, maxFutureAge - age);

  resultBox.classList.remove('hidden');
  resultBox.innerHTML = `
    <div class="calc-results-summary-grid">
      <div class="cres-stat-card green">
        <span class="cres-num">${eligibleExams.length}</span>
        <span class="cres-label">Eligible Exam Streams Right Now</span>
      </div>
      <div class="cres-stat-card blue">
        <span class="cres-num">${remainingYears} Years</span>
        <span class="cres-label">Remaining Lifetime Govt Career Window</span>
      </div>
      <div class="cres-stat-card amber">
        <span class="cres-num">${eligibleExams[0]?.name.split(' ')[0] || 'State/Central'}</span>
        <span class="cres-label">Top Recommended Career Goal</span>
      </div>
    </div>

    <div class="calc-results-exams-list" style="margin-top: 20px;">
      <h4 style="font-size: 1.05rem; color: #fff; margin-bottom: 12px;">
        <i class="fa-solid fa-list-check" style="color: #10b981;"></i> Your Lifetime Government Exam Opportunities (Age ${age}):
      </h4>
      <div class="cres-items-grid">
        ${eligibleExams.length > 0 ? eligibleExams.map(ex => {
          const effectiveMax = Math.min(ex.maxAgeRelaxed, ex.maxAgeGeneral + extraAge);
          const yearsLeft = Math.max(0, effectiveMax - age);
          return `
            <div class="cres-exam-item">
              <div class="cres-item-left">
                <div class="cres-icon"><i class="fa-solid ${ex.icon}"></i></div>
                <div>
                  <h5>${ex.name}</h5>
                  <span class="cres-post-text">${ex.posts}</span>
                </div>
              </div>
              <div class="cres-item-right">
                <span class="cres-window-tag"><i class="fa-regular fa-clock"></i> ${yearsLeft} yrs eligibility left (till age ${effectiveMax})</span>
                <a href="#upcoming-exams-section" class="btn btn-primary btn-sm" onclick="renderUpcomingExams('all')">View Schedule</a>
              </div>
            </div>
          `;
        }).join('') : `
          <p style="color: var(--text-muted);">No exact matching exams for this specific age/education combination. Try changing qualification or check age relaxations.</p>
        `}
      </div>
    </div>
  `;

  window.showToast('🎯 Lifetime Eligibility Calculated!', `You have ${eligibleExams.length} active government exam options and ${remainingYears} years of eligibility!`, 'success');
};

function renderSyllabus(syllabusKey) {
  const syllabus = EXAM_SYLLABI[syllabusKey] || EXAM_SYLLABI['gpsc-class12'];
  const container = document.getElementById('syllabus-content-display');
  const titleElem = document.getElementById('syllabus-exam-title');
  const overviewElem = document.getElementById('syllabus-exam-overview');

  if (titleElem) titleElem.textContent = `${syllabus.name} – Complete Syllabus & Exam Pattern`;
  if (overviewElem) overviewElem.textContent = syllabus.overview;

  if (!container) return;

  const auth = window.authManager;

  container.innerHTML = syllabus.stages.map((stage, stageIdx) => `
    <div class="syllabus-stage-card">
      <div class="stage-header">
        <h3><i class="fa-solid fa-layer-group"></i> ${stage.stageName}</h3>
      </div>
      <div class="stage-papers-list">
        ${stage.papers.map((paper, pIdx) => `
          <div class="paper-accordion-item">
            <div class="paper-title-row">
              <h4>${paper.title}</h4>
            </div>
            <ul class="syllabus-topics-checklist">
              ${paper.topics.map((topic, tIdx) => {
                const topicKey = `${syllabusKey}_s${stageIdx}_p${pIdx}_t${tIdx}`;
                const isDone = auth.isTopicCompleted(topicKey);
                return `
                  <li class="topic-item ${isDone ? 'completed' : ''}">
                    <label class="checkbox-label">
                      <input type="checkbox" ${isDone ? 'checked' : ''} onchange="window.toggleTopicCheck('${topicKey}', this)">
                      <span class="topic-text">${topic}</span>
                    </label>
                  </li>
                `;
              }).join('')}
            </ul>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

// ------------------------------------------
// 5. Daily Current Affairs Hub
// ------------------------------------------
function renderCurrentAffairs(category = 'all') {
  const container = document.getElementById('current-affairs-feed');
  if (!container) return;

  let list = DAILY_CURRENT_AFFAIRS;
  if (category !== 'all') {
    list = list.filter(ca => ca.category.toLowerCase() === category.toLowerCase());
  }

  container.innerHTML = list.map(ca => `
    <div class="ca-card">
      <div class="ca-header">
        <span class="ca-badge ${ca.category.toLowerCase()}">${ca.categoryBadge}</span>
        <span class="ca-date"><i class="fa-regular fa-calendar"></i> ${formatDateString(ca.date)}</span>
      </div>
      <h3 class="ca-title">${ca.title}</h3>
      <p class="ca-summary">${ca.summary}</p>
      
      <div class="ca-keypoints">
        <strong>Exam Key Takeaways:</strong>
        <ul>
          ${ca.keyPoints.map(kp => `<li><i class="fa-solid fa-angle-right"></i> ${kp}</li>`).join('')}
        </ul>
      </div>

      ${ca.quiz ? `
        <div class="ca-flash-quiz">
          <div class="quiz-q-title"><i class="fa-solid fa-circle-question"></i> <strong>Daily Flash Quiz:</strong> ${ca.quiz.question}</div>
          <div class="quiz-options-grid">
            ${ca.quiz.options.map((opt, optIdx) => `
              <button class="quiz-opt-btn" onclick="window.checkFlashQuiz(this, ${optIdx}, ${ca.quiz.correctIndex})">
                ${opt}
              </button>
            `).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  `).join('');
}

// ------------------------------------------
// 6. Resources & PYQs
// ------------------------------------------
function renderPYQList() {
  const container = document.getElementById('pyq-papers-list');
  if (!container) return;

  container.innerHTML = PREVIOUS_YEAR_PAPERS.map(pyq => `
    <div class="resource-card">
      <div class="res-icon"><i class="fa-solid fa-file-pdf"></i></div>
      <div class="res-info">
        <h4>${pyq.exam} (${pyq.year})</h4>
        <p>${pyq.paper}</p>
        <div class="res-meta">
          <span><i class="fa-solid fa-language"></i> ${pyq.language}</span>
          <span><i class="fa-solid fa-hard-drive"></i> ${pyq.fileSize}</span>
        </div>
      </div>
      <button class="btn btn-outline btn-sm" onclick="window.downloadResource('${pyq.paper}')">
        <i class="fa-solid fa-download"></i> Download PDF
      </button>
    </div>
  `).join('');
}

function renderOfficialPortals() {
  const container = document.getElementById('official-portals-grid');
  if (!container) return;

  container.innerHTML = OFFICIAL_PORTAL_DIRECTORY.map(port => `
    <a href="${port.url}" target="_blank" rel="noopener" class="portal-card">
      <div class="portal-header">
        <h4>${port.name}</h4>
        <i class="fa-solid fa-arrow-up-right-from-square"></i>
      </div>
      <p>${port.description}</p>
      <span class="portal-link-text">${port.url}</span>
    </a>
  `).join('');
}

// ------------------------------------------
// 7. Student Progress Tracker Analytics
// ------------------------------------------
function updateProgressTracker() {
  const auth = window.authManager;
  const user = auth.getUser();
  if (!user) return;

  const totalAttempted = user.totalQuestionsAttempted || 0;
  const totalCorrect = user.totalCorrect || 0;
  const accuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 82;
  const streak = user.streakDays || 1;
  const hours = user.studyHoursLogged || 0;

  const attemptedElem = document.getElementById('tracker-attempted');
  const accuracyElem = document.getElementById('tracker-accuracy');
  const streakElem = document.getElementById('tracker-streak');
  const hoursElem = document.getElementById('tracker-hours');

  if (attemptedElem) attemptedElem.textContent = totalAttempted;
  if (accuracyElem) accuracyElem.textContent = `${accuracy}%`;
  if (streakElem) streakElem.textContent = `${streak} Days 🔥`;
  if (hoursElem) hoursElem.textContent = `${hours} Hrs`;

  // Render recent mock history table
  const historyContainer = document.getElementById('tracker-history-table-body');
  if (historyContainer && user.mockHistory) {
    historyContainer.innerHTML = user.mockHistory.map(m => `
      <tr>
        <td><strong>${m.examName}</strong></td>
        <td>${m.date}</td>
        <td><span class="score-badge">${m.score} / ${m.total}</span></td>
        <td><span class="accuracy-pill ${m.accuracy >= 75 ? 'high' : 'medium'}">${m.accuracy}%</span></td>
        <td><span class="badge badge-success">Completed</span></td>
      </tr>
    `).join('');
  }
}

// ------------------------------------------
// 8. Header & User Profile State
// ------------------------------------------
function updateHeaderProfile() {
  const auth = window.authManager;
  const user = auth.getUser();
  const tier = auth.getTier();

  const userNameElem = document.getElementById('header-user-name');
  const userTierElem = document.getElementById('header-user-tier');
  const userAvatarElem = document.getElementById('header-user-avatar');

  if (userNameElem && user) userNameElem.textContent = user.name;
  if (userTierElem) {
    userTierElem.textContent = tier.badge;
    userTierElem.className = `tier-badge ${tier.id}`;
  }
  if (userAvatarElem && user) {
    if (user.photo) {
      userAvatarElem.innerHTML = `<img src="${user.photo}" alt="${user.name}" class="header-avatar-img">`;
    } else {
      const initial = (user.name || 'A').trim()[0].toUpperCase();
      userAvatarElem.innerHTML = `<span class="avatar-initial">${initial}</span>`;
    }
  }
}

// ------------------------------------------
// Global Event Bindings
// ------------------------------------------
function bindGlobalEvents() {
  // Phase filter tabs (All vs Current Active vs Target Future)
  document.querySelectorAll('.phase-tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.phase-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const phase = btn.getAttribute('data-phase') || 'all';
      const searchInput = document.getElementById('exam-search-input');
      renderUpcomingExams(currentExamFilter, currentYearFilter, phase, searchInput ? searchInput.value : '');
    });
  });

  // Category filter pills in upcoming section
  document.querySelectorAll('.cat-filter-pill').forEach(pill => {
    pill.addEventListener('click', (e) => {
      document.querySelectorAll('.cat-filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const cat = pill.getAttribute('data-filter') || 'all';
      const searchInput = document.getElementById('exam-search-input');
      renderUpcomingExams(cat, currentYearFilter, currentPhaseFilter, searchInput ? searchInput.value : '');
    });
  });

  // Lifetime stage navigator buttons
  document.querySelectorAll('.lifetime-stage-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.lifetime-stage-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const stage = btn.getAttribute('data-stage') || 'graduate';
      renderLifetimeRoadmap(stage);
    });
  });

  // Year filter pills (2026, 2027, 2028, 2029, 2030)
  document.querySelectorAll('.year-filter-pill').forEach(pill => {
    pill.addEventListener('click', (e) => {
      document.querySelectorAll('.year-filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const year = pill.getAttribute('data-year') || 'all';
      const searchInput = document.getElementById('exam-search-input');
      renderUpcomingExams(currentExamFilter, year, currentPhaseFilter, searchInput ? searchInput.value : '');
    });
  });

  // Search input in upcoming exams section
  const searchInput = document.getElementById('exam-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderUpcomingExams(currentExamFilter, currentYearFilter, currentPhaseFilter, e.target.value);
    });
  }

  // Hero Quick Search
  const heroSearch = document.getElementById('hero-quick-search');
  if (heroSearch) {
    heroSearch.addEventListener('input', (e) => {
      const q = e.target.value;
      if (searchInput) searchInput.value = q;
      renderUpcomingExams('all', 'all', 'all', q);
    });
  }

  // Syllabus exam switcher dropdown
  const syllabusSelect = document.getElementById('syllabus-exam-select');
  if (syllabusSelect) {
    syllabusSelect.addEventListener('change', (e) => {
      renderSyllabus(e.target.value);
    });
  }

  // Current affairs category tabs
  document.querySelectorAll('.ca-tab-btn').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.ca-tab-btn').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.getAttribute('data-cat') || 'all';
      renderCurrentAffairs(cat);
    });
  });

  // Auth / Profile Modals
  const profileTrigger = document.getElementById('header-profile-trigger');
  if (profileTrigger) {
    profileTrigger.addEventListener('click', () => openProfileModal());
  }

  const registerTrigger = document.getElementById('header-register-btn');
  if (registerTrigger) {
    registerTrigger.addEventListener('click', () => openAuthModal('register'));
  }

  // Listen to user changes across modules
  window.addEventListener('smartgovtprep:user-updated', () => {
    updateHeaderProfile();
    updateProgressTracker();
  });
}

// ------------------------------------------
// Window Helper Utilities & Action Callbacks
// ------------------------------------------
window.viewSyllabusFor = function(syllabusId) {
  const syllabusSelect = document.getElementById('syllabus-exam-select');
  if (syllabusSelect) {
    syllabusSelect.value = syllabusId;
  }
  renderSyllabus(syllabusId);
  document.getElementById('syllabus-section')?.scrollIntoView({ behavior: 'smooth' });
};

window.toggleExamBookmark = function(examId, btn) {
  const isBookmarked = window.authManager.toggleBookmark(examId);
  btn.classList.toggle('bookmarked', isBookmarked);
  if (isBookmarked) {
    window.showToast('Reminder Set!', 'You will receive notifications before application deadline & exam dates.', 'success');
  } else {
    window.showToast('Removed', 'Exam removed from your alert list.', 'info');
  }
};

window.toggleTopicCheck = function(topicKey, checkbox) {
  const isDone = window.authManager.toggleTopicComplete(topicKey);
  const parentLi = checkbox.closest('.topic-item');
  if (parentLi) parentLi.classList.toggle('completed', isDone);
  window.showToast(isDone ? 'Topic Completed! 🎉' : 'Topic Reset', 'Your preparation syllabus checklist has been updated.', 'info');
};

window.checkFlashQuiz = function(btn, chosenIdx, correctIdx) {
  const parentGrid = btn.closest('.quiz-options-grid');
  if (!parentGrid) return;
  const allBtns = parentGrid.querySelectorAll('.quiz-opt-btn');

  allBtns.forEach((b, idx) => {
    b.disabled = true;
    if (idx === correctIdx) {
      b.classList.add('correct');
      b.innerHTML += ' <i class="fa-solid fa-check"></i>';
    }
  });

  if (chosenIdx !== correctIdx) {
    btn.classList.add('wrong');
    btn.innerHTML += ' <i class="fa-solid fa-xmark"></i>';
  } else {
    window.authManager.recordMcqAttempt(true);
    window.showToast('Correct Answer! 🌟', '+2 Marks added to your daily progress score.', 'success');
  }
};

window.downloadResource = function(resName) {
  window.showToast('Downloading Resource...', `Generating official copy of "${resName}".`, 'success');
};

window.openNotificationModal = function(examId) {
  const exam = UPCOMING_EXAMS.find(e => e.id === examId);
  if (!exam) return;

  const modalHtml = `
    <div class="notification-modal-content">
      <div class="modal-header">
        <h3><i class="fa-solid fa-file-pdf"></i> Official Notification Summary</h3>
        <button class="modal-close-icon" onclick="window.closeCustomModal()"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="modal-body">
        <h4>${exam.name}</h4>
        <p class="conducting-lead"><strong>Conducted By:</strong> ${exam.conductingBody} (${exam.state})</p>
        <div class="notification-highlights-grid">
          <div class="nh-item"><strong>Vacancies:</strong> ${exam.vacancies}</div>
          <div class="nh-item"><strong>Application Window:</strong> ${formatDateString(exam.appStart)} to ${formatDateString(exam.appEnd)}</div>
          <div class="nh-item"><strong>Scheduled Exam Date:</strong> ${formatDateString(exam.examDate)}</div>
          <div class="nh-item"><strong>Age Eligibility:</strong> ${exam.ageLimit}</div>
        </div>
        <div class="nh-qualifications">
          <strong>Educational Qualification & Eligibility:</strong>
          <p>${exam.eligibility}</p>
        </div>
        <div class="nh-actions">
          <a href="${exam.officialUrl}" target="_blank" rel="noopener" class="btn btn-primary">
            <i class="fa-solid fa-arrow-up-right-from-square"></i> Visit Official Portal (${exam.conductingBody})
          </a>
          <button class="btn btn-secondary" onclick="window.downloadResource('${exam.name} Official Advt'); window.closeCustomModal();">
            <i class="fa-solid fa-download"></i> Download PDF Advt
          </button>
        </div>
      </div>
    </div>
  `;
  window.showCustomModal(modalHtml);
};

// ------------------------------------------
// Student Profile & Auth Modals with Photo Upload
// ------------------------------------------
let currentRegisterPhotoDataUrl = '';
let currentEditPhotoDataUrl = '';

function openProfileModal() {
  const auth = window.authManager;
  const user = auth.getUser();
  const tier = auth.getTier();

  const modalHtml = `
    <div class="profile-modal-content">
      <div class="modal-header">
        <h3><i class="fa-solid fa-id-badge"></i> Student Aspirant Profile</h3>
        <button class="modal-close-icon" onclick="window.closeCustomModal()"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="profile-body">
        <div class="profile-hero-card">
          <div class="profile-avatar-large">
            ${user.photo ? `<img src="${user.photo}" alt="${user.name}" class="profile-large-img">` : `<span class="profile-large-initial">${(user.name || 'A').trim()[0].toUpperCase()}</span>`}
          </div>
          <div class="profile-details">
            <h2>${user.name}</h2>
            <p><i class="fa-solid fa-envelope"></i> ${user.email} | <i class="fa-solid fa-location-dot"></i> ${user.state}</p>
            <div class="profile-badges-row">
              <span class="tier-pill-large ${tier.id}"><i class="fa-solid fa-crown"></i> ${tier.name}</span>
              <span class="streak-pill-large"><i class="fa-solid fa-fire"></i> ${user.streakDays || 1} Day Streak</span>
            </div>
          </div>
        </div>

        <div class="profile-quotas-card">
          <h4><i class="fa-solid fa-bolt"></i> Daily Resource Quotas (Today)</h4>
          <div class="quotas-row">
            <div class="quota-box">
              <span class="q-label">AI Mentor Queries</span>
              <span class="q-val">${user.dailyStats?.aiQueriesUsed || 0} / ${tier.dailyAiLimit === 999999 ? '∞ Unlimited' : tier.dailyAiLimit}</span>
            </div>
            <div class="quota-box">
              <span class="q-label">MCQs Practiced Today</span>
              <span class="q-val">${user.dailyStats?.mcqsUsed || 0} / ${tier.dailyMcqLimit === 999999 ? '∞ Unlimited' : tier.dailyMcqLimit}</span>
            </div>
            <div class="quota-box">
              <span class="q-label">Target Exam</span>
              <span class="q-val">${user.targetExamName}</span>
            </div>
          </div>
          ${tier.id === 'free' ? `
            <div class="profile-upgrade-callout">
              <p>Unlock Unlimited MCQs, 50 AI questions/day, and Personalized Rank Roadmaps for just ₹99/mo!</p>
              <button class="btn btn-primary btn-sm" onclick="window.paymentManager.openCheckout('premium'); window.closeCustomModal();">
                Upgrade to Premium
              </button>
            </div>
          ` : ''}
        </div>

        <div class="profile-actions-row">
          <button class="btn btn-outline btn-sm" onclick="window.authManager.logout(); window.closeCustomModal(); window.showToast('Logged Out', 'You are now in Guest mode.', 'info'); openAuthModal('login');">
            <i class="fa-solid fa-arrow-right-from-bracket"></i> Switch / Logout
          </button>
          <button class="btn btn-secondary btn-sm" onclick="openAuthModal('edit');">
            <i class="fa-solid fa-camera"></i> Edit Profile &amp; Photo
          </button>
          <button class="btn btn-primary btn-sm" onclick="window.closeCustomModal()">
            Done
          </button>
        </div>
      </div>
    </div>
  `;
  window.showCustomModal(modalHtml);
}

function openAuthModal(initialTab = 'register') {
  const auth = window.authManager;
  const user = auth.getUser();
  currentRegisterPhotoDataUrl = '';
  currentEditPhotoDataUrl = user?.photo || '';

  const modalHtml = `
    <div class="auth-modal-content auth-enhanced-card">
      <div class="modal-header">
        <div class="auth-tabs-nav">
          <button class="auth-tab-btn ${initialTab === 'register' ? 'active' : ''}" onclick="window.switchAuthTab('register')">
            <i class="fa-solid fa-user-plus"></i> Sign Up / Register
          </button>
          <button class="auth-tab-btn ${initialTab === 'login' ? 'active' : ''}" onclick="window.switchAuthTab('login')">
            <i class="fa-solid fa-right-to-bracket"></i> Login / Sign In
          </button>
          ${initialTab === 'edit' ? `
            <button class="auth-tab-btn active" onclick="window.switchAuthTab('edit')">
              <i class="fa-solid fa-user-pen"></i> Edit Profile &amp; Photo
            </button>
          ` : ''}
        </div>
        <button class="modal-close-icon" onclick="window.closeCustomModal()"><i class="fa-solid fa-xmark"></i></button>
      </div>

      <!-- Tab 1: Register / Sign Up -->
      <div id="auth-tab-register-view" class="auth-tab-view ${initialTab === 'register' ? '' : 'hidden'}">
        <div class="auth-intro-badge">
          <i class="fa-solid fa-gift"></i> <strong>Free Student Registration:</strong> 5 AI Mentor Questions &amp; 5 MCQs daily included!
        </div>

        <form id="student-register-form" onsubmit="window.handleRegisterSubmit(event)">
          <!-- User Photo Upload Section -->
          <div class="reg-photo-upload-container">
            <div class="avatar-circle-wrap">
              <div class="avatar-circle-preview" id="reg-avatar-circle">
                <img id="reg-photo-preview" class="avatar-preview-img hidden" alt="Aspirant Photo">
                <span id="reg-photo-placeholder" class="avatar-placeholder"><i class="fa-solid fa-camera"></i></span>
              </div>
              <label for="reg-photo-file-input" class="avatar-upload-badge" title="Upload Photo">
                <i class="fa-solid fa-camera"></i>
              </label>
              <input type="file" id="reg-photo-file-input" accept="image/*" style="display:none;" onchange="window.previewRegisterPhoto(event)">
            </div>
            <div class="avatar-info-col">
              <span class="avatar-title"><i class="fa-solid fa-image"></i> Student Profile Photo (Optional)</span>
              <div class="avatar-btn-row">
                <button type="button" class="btn btn-secondary btn-sm" onclick="document.getElementById('reg-photo-file-input').click()">
                  <i class="fa-solid fa-cloud-arrow-up"></i> Upload Photo
                </button>
                <button type="button" id="reg-photo-clear-btn" class="btn btn-outline btn-sm hidden" onclick="window.removeRegisterPhoto()">
                  <i class="fa-solid fa-xmark"></i> Remove
                </button>
              </div>
              <div class="avatar-presets-row">
                <span style="font-size: 0.72rem; color: var(--text-dim);">Or pick avatar:</span>
                <button type="button" class="avatar-preset-btn" onclick="window.setPresetAvatar('👨‍🎓', 'register')" title="Aspirant Male">👨‍🎓</button>
                <button type="button" class="avatar-preset-btn" onclick="window.setPresetAvatar('👩‍🎓', 'register')" title="Aspirant Female">👩‍🎓</button>
                <button type="button" class="avatar-preset-btn" onclick="window.setPresetAvatar('👨‍💼', 'register')" title="Officer Male">👨‍💼</button>
                <button type="button" class="avatar-preset-btn" onclick="window.setPresetAvatar('👩‍💼', 'register')" title="Officer Female">👩‍💼</button>
                <button type="button" class="avatar-preset-btn" onclick="window.setPresetAvatar('🦁', 'register')" title="Gujarat Lion">🦁</button>
                <button type="button" class="avatar-preset-btn" onclick="window.setPresetAvatar('🇮🇳', 'register')" title="India">🇮🇳</button>
              </div>
            </div>
          </div>

          <div class="form-grid-2">
            <div class="form-group">
              <label><i class="fa-solid fa-user"></i> Full Name *</label>
              <input type="text" id="reg-name" class="form-control" placeholder="e.g. Rahul Sharma" required>
            </div>
            <div class="form-group">
              <label><i class="fa-solid fa-phone"></i> Mobile Number *</label>
              <input type="tel" id="reg-phone" class="form-control" placeholder="+91 98765 43210" required>
            </div>
          </div>

          <div class="form-group">
            <label><i class="fa-solid fa-envelope"></i> Email Address *</label>
            <input type="email" id="reg-email" class="form-control" placeholder="e.g. rahul@smartgovt.in" required>
          </div>

          <div class="form-grid-2">
            <div class="form-group">
              <label><i class="fa-solid fa-bullseye"></i> Target Exam *</label>
              <select id="reg-target-exam" class="form-control">
                ${UPCOMING_EXAMS.map(ex => `
                  <option value="${ex.id}">${ex.name}</option>
                `).join('')}
              </select>
            </div>
            <div class="form-group">
              <label><i class="fa-solid fa-location-dot"></i> State / Region *</label>
              <select id="reg-state" class="form-control">
                <option value="Gujarat">Gujarat</option>
                <option value="Delhi NCR">Delhi NCR</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="Other All India">Other (All India)</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label><i class="fa-solid fa-lock"></i> Create Password *</label>
            <input type="password" id="reg-password" class="form-control" placeholder="Create a secure password (min 6 chars)" minlength="6" required value="smart2026">
          </div>

          <div class="auth-consent-row">
            <label class="checkbox-label" style="font-size: 0.82rem; color: var(--text-muted);">
              <input type="checkbox" checked required>
              <span>I agree to SmartGovtPrep terms and would like to receive free live exam notification alerts.</span>
            </label>
          </div>

          <button type="submit" class="btn btn-gold btn-block btn-lg" style="margin-top: 16px;">
            <i class="fa-solid fa-user-plus"></i> Create Free Aspirant Account
          </button>
        </form>

        <div class="auth-footer-switch">
          Already registered? <a href="javascript:void(0)" onclick="window.switchAuthTab('login')"><strong>Log in here</strong></a>
        </div>
      </div>

      <!-- Tab 2: Login / Sign In -->
      <div id="auth-tab-login-view" class="auth-tab-view ${initialTab === 'login' ? '' : 'hidden'}">
        <form id="student-login-form" onsubmit="window.handleLoginSubmit(event)">
          <div class="form-group">
            <label><i class="fa-solid fa-envelope"></i> Email or Mobile Number</label>
            <input type="text" id="login-identifier" class="form-control" placeholder="e.g. rahul@smartgovt.in or 9876543210" required value="rahul.aspirant@smartgovt.in">
          </div>
          <div class="form-group">
            <label><i class="fa-solid fa-lock"></i> Password / OTP</label>
            <input type="password" id="login-password" class="form-control" placeholder="Enter your password" required value="123456">
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; font-size: 0.82rem;">
            <label class="checkbox-label"><input type="checkbox" checked> <span>Remember me</span></label>
            <a href="javascript:void(0)" onclick="window.showToast('OTP Sent', 'Demo login OTP 2026 sent to your registered mobile.', 'info')">Forgot Password / Login with OTP</a>
          </div>

          <button type="submit" class="btn btn-primary btn-block btn-lg">
            <i class="fa-solid fa-right-to-bracket"></i> Sign In to Dashboard
          </button>
        </form>

        <div class="auth-demo-presets">
          <div class="demo-divider"><span>OR QUICK 1-CLICK DEMO LOGIN</span></div>
          <div class="demo-buttons-row">
            <button class="btn btn-secondary btn-sm" onclick="window.quickDemoLogin('free')">
              👨‍🎓 Aspirant Rahul (Free)
            </button>
            <button class="btn btn-secondary btn-sm" onclick="window.quickDemoLogin('premium')">
              ⚡ Priya (Premium ₹99)
            </button>
            <button class="btn btn-secondary btn-sm" onclick="window.quickDemoLogin('pro')">
              👑 Arjun (Pro ₹299)
            </button>
          </div>
        </div>

        <div class="auth-footer-switch">
          New to SmartGovtPrep? <a href="javascript:void(0)" onclick="window.switchAuthTab('register')"><strong>Create a free account</strong></a>
        </div>
      </div>

      <!-- Tab 3: Edit Profile -->
      <div id="auth-tab-edit-view" class="auth-tab-view ${initialTab === 'edit' ? '' : 'hidden'}">
        <form id="student-edit-form" onsubmit="window.handleEditSubmit(event)">
          <!-- Edit Photo Upload Section -->
          <div class="reg-photo-upload-container">
            <div class="avatar-circle-wrap">
              <div class="avatar-circle-preview" id="edit-avatar-circle">
                <img id="edit-photo-preview" class="avatar-preview-img ${user?.photo ? '' : 'hidden'}" src="${user?.photo || ''}" alt="Profile Photo">
                <span id="edit-photo-placeholder" class="avatar-placeholder ${user?.photo ? 'hidden' : ''}"><i class="fa-solid fa-camera"></i></span>
              </div>
              <label for="edit-photo-file-input" class="avatar-upload-badge" title="Change Photo">
                <i class="fa-solid fa-camera"></i>
              </label>
              <input type="file" id="edit-photo-file-input" accept="image/*" style="display:none;" onchange="window.previewEditPhoto(event)">
            </div>
            <div class="avatar-info-col">
              <span class="avatar-title"><i class="fa-solid fa-image"></i> Change Profile Photo</span>
              <div class="avatar-btn-row">
                <button type="button" class="btn btn-secondary btn-sm" onclick="document.getElementById('edit-photo-file-input').click()">
                  <i class="fa-solid fa-cloud-arrow-up"></i> Upload New Photo
                </button>
                <button type="button" id="edit-photo-clear-btn" class="btn btn-outline btn-sm ${user?.photo ? '' : 'hidden'}" onclick="window.removeEditPhoto()">
                  <i class="fa-solid fa-xmark"></i> Remove
                </button>
              </div>
              <div class="avatar-presets-row">
                <span style="font-size: 0.72rem; color: var(--text-dim);">Or pick avatar:</span>
                <button type="button" class="avatar-preset-btn" onclick="window.setPresetAvatar('👨‍🎓', 'edit')">👨‍🎓</button>
                <button type="button" class="avatar-preset-btn" onclick="window.setPresetAvatar('👩‍🎓', 'edit')">👩‍🎓</button>
                <button type="button" class="avatar-preset-btn" onclick="window.setPresetAvatar('👨‍💼', 'edit')">👨‍💼</button>
                <button type="button" class="avatar-preset-btn" onclick="window.setPresetAvatar('👩‍💼', 'edit')">👩‍💼</button>
                <button type="button" class="avatar-preset-btn" onclick="window.setPresetAvatar('🦁', 'edit')">🦁</button>
                <button type="button" class="avatar-preset-btn" onclick="window.setPresetAvatar('🇮🇳', 'edit')">🇮🇳</button>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label>Full Name</label>
            <input type="text" id="edit-name" class="form-control" value="${user?.name || ''}" required>
          </div>
          <div class="form-group">
            <label>Email Address</label>
            <input type="email" id="edit-email" class="form-control" value="${user?.email || ''}" required>
          </div>
          <div class="form-group">
            <label>Target Competitive Exam</label>
            <select id="edit-target-exam" class="form-control">
              ${UPCOMING_EXAMS.map(ex => `
                <option value="${ex.id}" ${user?.targetExam === ex.id ? 'selected' : ''}>${ex.name}</option>
              `).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>State / Region</label>
            <select id="edit-state" class="form-control">
              <option value="Gujarat" ${user?.state === 'Gujarat' ? 'selected' : ''}>Gujarat</option>
              <option value="Delhi NCR" ${user?.state === 'Delhi NCR' ? 'selected' : ''}>Delhi NCR</option>
              <option value="Maharashtra" ${user?.state === 'Maharashtra' ? 'selected' : ''}>Maharashtra</option>
              <option value="Rajasthan" ${user?.state === 'Rajasthan' ? 'selected' : ''}>Rajasthan</option>
              <option value="Uttar Pradesh" ${user?.state === 'Uttar Pradesh' ? 'selected' : ''}>Uttar Pradesh</option>
              <option value="Other All India" ${user?.state === 'Other All India' ? 'selected' : ''}>Other (All India)</option>
            </select>
          </div>
          <button type="submit" class="btn btn-primary btn-block">
            Save Profile Changes
          </button>
        </form>
      </div>
    </div>
  `;
  window.showCustomModal(modalHtml);
}

// Client-side Image Processing & Resizing helper
function processImageFile(file, callback) {
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    window.showToast('Invalid File', 'Please select an image file (JPG, PNG, WEBP).', 'error');
    return;
  }
  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      const size = 180;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      // Centered square crop
      const minSide = Math.min(img.width, img.height);
      const sx = (img.width - minSide) / 2;
      const sy = (img.height - minSide) / 2;
      ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, size, size);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      callback(dataUrl);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// Emoji / SVG Avatar generator
function generateEmojiAvatar(emoji) {
  const canvas = document.createElement('canvas');
  canvas.width = 160;
  canvas.height = 160;
  const ctx = canvas.getContext('2d');
  
  // Background gradient circle
  const grad = ctx.createLinearGradient(0, 0, 160, 160);
  grad.addColorStop(0, '#4f46e5');
  grad.addColorStop(1, '#0ea5e9');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(80, 80, 80, 0, Math.PI * 2);
  ctx.fill();

  // Draw emoji centered
  ctx.font = '72px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(emoji, 80, 88);

  return canvas.toDataURL('image/png');
}

window.previewRegisterPhoto = function(event) {
  const file = event.target.files?.[0];
  processImageFile(file, (dataUrl) => {
    currentRegisterPhotoDataUrl = dataUrl;
    const previewImg = document.getElementById('reg-photo-preview');
    const placeholder = document.getElementById('reg-photo-placeholder');
    const clearBtn = document.getElementById('reg-photo-clear-btn');
    if (previewImg) {
      previewImg.src = dataUrl;
      previewImg.classList.remove('hidden');
    }
    if (placeholder) placeholder.classList.add('hidden');
    if (clearBtn) clearBtn.classList.remove('hidden');
    window.showToast('Photo Ready! 📷', 'Profile photo attached to registration.', 'info');
  });
};

window.removeRegisterPhoto = function() {
  currentRegisterPhotoDataUrl = '';
  const previewImg = document.getElementById('reg-photo-preview');
  const placeholder = document.getElementById('reg-photo-placeholder');
  const clearBtn = document.getElementById('reg-photo-clear-btn');
  const fileInput = document.getElementById('reg-photo-file-input');
  if (previewImg) { previewImg.src = ''; previewImg.classList.add('hidden'); }
  if (placeholder) placeholder.classList.remove('hidden');
  if (clearBtn) clearBtn.classList.add('hidden');
  if (fileInput) fileInput.value = '';
};

window.previewEditPhoto = function(event) {
  const file = event.target.files?.[0];
  processImageFile(file, (dataUrl) => {
    currentEditPhotoDataUrl = dataUrl;
    const previewImg = document.getElementById('edit-photo-preview');
    const placeholder = document.getElementById('edit-photo-placeholder');
    const clearBtn = document.getElementById('edit-photo-clear-btn');
    if (previewImg) {
      previewImg.src = dataUrl;
      previewImg.classList.remove('hidden');
    }
    if (placeholder) placeholder.classList.add('hidden');
    if (clearBtn) clearBtn.classList.remove('hidden');
  });
};

window.removeEditPhoto = function() {
  currentEditPhotoDataUrl = '';
  const previewImg = document.getElementById('edit-photo-preview');
  const placeholder = document.getElementById('edit-photo-placeholder');
  const clearBtn = document.getElementById('edit-photo-clear-btn');
  const fileInput = document.getElementById('edit-photo-file-input');
  if (previewImg) { previewImg.src = ''; previewImg.classList.add('hidden'); }
  if (placeholder) placeholder.classList.remove('hidden');
  if (clearBtn) clearBtn.classList.add('hidden');
  if (fileInput) fileInput.value = '';
};

window.setPresetAvatar = function(emoji, formType = 'register') {
  const avatarData = generateEmojiAvatar(emoji);
  if (formType === 'register') {
    currentRegisterPhotoDataUrl = avatarData;
    const previewImg = document.getElementById('reg-photo-preview');
    const placeholder = document.getElementById('reg-photo-placeholder');
    const clearBtn = document.getElementById('reg-photo-clear-btn');
    if (previewImg) { previewImg.src = avatarData; previewImg.classList.remove('hidden'); }
    if (placeholder) placeholder.classList.add('hidden');
    if (clearBtn) clearBtn.classList.remove('hidden');
  } else {
    currentEditPhotoDataUrl = avatarData;
    const previewImg = document.getElementById('edit-photo-preview');
    const placeholder = document.getElementById('edit-photo-placeholder');
    const clearBtn = document.getElementById('edit-photo-clear-btn');
    if (previewImg) { previewImg.src = avatarData; previewImg.classList.remove('hidden'); }
    if (placeholder) placeholder.classList.add('hidden');
    if (clearBtn) clearBtn.classList.remove('hidden');
  }
};

window.switchAuthTab = function(tabName) {
  const regView = document.getElementById('auth-tab-register-view');
  const loginView = document.getElementById('auth-tab-login-view');
  const editView = document.getElementById('auth-tab-edit-view');

  if (regView) regView.classList.toggle('hidden', tabName !== 'register');
  if (loginView) loginView.classList.toggle('hidden', tabName !== 'login');
  if (editView) editView.classList.toggle('hidden', tabName !== 'edit');

  document.querySelectorAll('.auth-tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  event?.currentTarget?.classList.add('active');
};

window.handleRegisterSubmit = function(e) {
  e.preventDefault();
  const name = document.getElementById('reg-name')?.value;
  const email = document.getElementById('reg-email')?.value;
  const phone = document.getElementById('reg-phone')?.value;
  const password = document.getElementById('reg-password')?.value;
  const examSelect = document.getElementById('reg-target-exam');
  const targetExamId = examSelect?.value;
  const targetExamName = examSelect?.options[examSelect.selectedIndex]?.text;
  const state = document.getElementById('reg-state')?.value;

  window.authManager.register(name, email, phone, targetExamId, targetExamName, state, password, currentRegisterPhotoDataUrl);
  updateHeaderProfile();
  window.closeCustomModal();
  window.showCelebrationModal(
    `🎉 Welcome ${name}!`,
    `Your SmartGovtPrep account with profile photo is ready. Target: <strong>${targetExamName}</strong>. You have <strong>5 Free AI Mentor Questions & 5 Free MCQs</strong> ready today!`
  );
};

window.handleLoginSubmit = function(e) {
  e.preventDefault();
  const identifier = document.getElementById('login-identifier')?.value;
  const password = document.getElementById('login-password')?.value;

  const user = window.authManager.login(identifier, password);
  updateHeaderProfile();
  window.closeCustomModal();
  window.showToast('Login Successful! 🚀', `Welcome back, ${user.name}! Ready for today's mock tests and current affairs?`, 'success');
};

window.handleEditSubmit = function(e) {
  e.preventDefault();
  const name = document.getElementById('edit-name')?.value;
  const email = document.getElementById('edit-email')?.value;
  const examSelect = document.getElementById('edit-target-exam');
  const targetExamId = examSelect?.value;
  const targetExamName = examSelect?.options[examSelect.selectedIndex]?.text;
  const state = document.getElementById('edit-state')?.value;

  const current = window.authManager.getUser();
  current.name = name;
  current.email = email;
  current.photo = currentEditPhotoDataUrl;
  current.targetExam = targetExamId;
  current.targetExamName = targetExamName;
  current.state = state;
  window.authManager.saveUser(current);
  updateHeaderProfile();

  window.closeCustomModal();
  window.showToast('Profile & Photo Updated! ✅', 'Your changes have been saved.', 'success');
};

window.quickDemoLogin = function(tier = 'free') {
  if (tier === 'pro') {
    const user = {
      name: 'Arjun Patel',
      email: 'arjun.pro@smartgovt.in',
      phone: '+91 98989 89898',
      targetExam: 'gpsc-class12',
      targetExamName: 'GPSC Gujarat Administrative Service Class 1 & 2',
      state: 'Gujarat',
      tier: 'pro',
      planExpiry: '2026-11-23',
      joinedDate: '2026-07-01',
      streakDays: 14,
      lastActiveDate: new Date().toISOString().split('T')[0],
      studyHoursLogged: 120,
      totalQuestionsAttempted: 350,
      totalCorrect: 310,
      bookmarks: ['q1', 'q2', 'q3', 'ca-1'],
      dailyStats: {
        date: new Date().toISOString().split('T')[0],
        aiQueriesUsed: 8,
        mcqsUsed: 25
      },
      mockHistory: [
        { examName: 'GPSC GS Paper 1 Full Mock', score: 148, total: 200, accuracy: 88, date: '2026-08-21' },
        { examName: 'Gujarat History & Heritage Deep Test', score: 46, total: 50, accuracy: 92, date: '2026-08-22' }
      ],
      completedTopics: {}
    };
    window.authManager.saveUser(user);
    window.closeCustomModal();
    window.showToast('Logged in as Pro Ranker 👑', 'Welcome Arjun! Unlimited AI Mentorship & Mock Tests active.', 'success');
  } else if (tier === 'premium') {
    const user = {
      name: 'Priya Mehta',
      email: 'priya.prep@smartgovt.in',
      phone: '+91 97777 66666',
      targetExam: 'ssc-cgl',
      targetExamName: 'SSC Combined Graduate Level (CGL)',
      state: 'Delhi NCR',
      tier: 'premium',
      planExpiry: '2026-09-23',
      joinedDate: '2026-08-01',
      streakDays: 8,
      lastActiveDate: new Date().toISOString().split('T')[0],
      studyHoursLogged: 65,
      totalQuestionsAttempted: 180,
      totalCorrect: 154,
      bookmarks: ['q4', 'q5', 'ca-2'],
      dailyStats: {
        date: new Date().toISOString().split('T')[0],
        aiQueriesUsed: 12,
        mcqsUsed: 18
      },
      mockHistory: [
        { examName: 'SSC CGL Tier 1 Full Mock', score: 156, total: 200, accuracy: 86, date: '2026-08-22' }
      ],
      completedTopics: {}
    };
    window.authManager.saveUser(user);
    window.closeCustomModal();
    window.showToast('Logged in as Premium Aspirant ⚡', 'Welcome Priya! 50 AI queries/day & unlimited MCQs active.', 'success');
  } else {
    const user = {
      name: 'Aspirant Rahul',
      email: 'rahul.aspirant@smartgovt.in',
      phone: '+91 98765 43210',
      targetExam: 'gpsc-class12',
      targetExamName: 'GPSC Gujarat Administrative Service Class 1 & 2',
      state: 'Gujarat',
      tier: 'free',
      planExpiry: null,
      joinedDate: '2026-08-01',
      streakDays: 6,
      lastActiveDate: new Date().toISOString().split('T')[0],
      studyHoursLogged: 42,
      totalQuestionsAttempted: 84,
      totalCorrect: 68,
      bookmarks: ['q1', 'q2', 'ca-1'],
      dailyStats: {
        date: new Date().toISOString().split('T')[0],
        aiQueriesUsed: 2,
        mcqsUsed: 3
      },
      mockHistory: [
        { examName: 'GPSC GS Paper 1 Mini Mock', score: 18, total: 20, accuracy: 90, date: '2026-08-20' }
      ],
      completedTopics: {}
    };
    window.authManager.saveUser(user);
    window.closeCustomModal();
    window.showToast('Logged in as Free Aspirant 👨‍🎓', 'Welcome Rahul! 5 Free daily AI queries and MCQs ready.', 'info');
  }
};

// ------------------------------------------
// Modal & Toast Helpers
// ------------------------------------------
window.showCustomModal = function(html) {
  let modalContainer = document.getElementById('custom-modal-container');
  if (!modalContainer) {
    modalContainer = document.createElement('div');
    modalContainer.id = 'custom-modal-container';
    modalContainer.className = 'custom-modal-overlay';
    document.body.appendChild(modalContainer);
  }
  modalContainer.innerHTML = html;
  modalContainer.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  // Backdrop click
  modalContainer.onclick = function(e) {
    if (e.target === modalContainer) {
      window.closeCustomModal();
    }
  };
};

window.closeCustomModal = function() {
  const modalContainer = document.getElementById('custom-modal-container');
  if (modalContainer) {
    modalContainer.classList.add('hidden');
    document.body.style.overflow = '';
  }
};

window.showQuotaAlert = function(title, msg, upgradeTier = 'premium') {
  const modalHtml = `
    <div class="quota-alert-modal">
      <div class="qa-icon"><i class="fa-solid fa-lock"></i></div>
      <h3>${title}</h3>
      <p>${msg}</p>
      <div class="qa-actions">
        <button class="btn btn-secondary" onclick="window.closeCustomModal()">Cancel</button>
        <button class="btn btn-primary" onclick="window.paymentManager.openCheckout('${upgradeTier}'); window.closeCustomModal();">
          Upgrade Now (From ₹99)
        </button>
      </div>
    </div>
  `;
  window.showCustomModal(modalHtml);
};

window.showCelebrationModal = function(title, msg) {
  const modalHtml = `
    <div class="celebration-modal">
      <div class="celeb-icon">🎉</div>
      <h3>${title}</h3>
      <p>${msg}</p>
      <button class="btn btn-primary btn-block" onclick="window.closeCustomModal()">
        Start Using Premium Features 🚀
      </button>
    </div>
  `;
  window.showCustomModal(modalHtml);
};

window.showToast = function(title, msg, type = 'info') {
  let toastBox = document.getElementById('toast-notification-box');
  if (!toastBox) {
    toastBox = document.createElement('div');
    toastBox.id = 'toast-notification-box';
    toastBox.className = 'toast-container';
    document.body.appendChild(toastBox);
  }

  const toast = document.createElement('div');
  toast.className = `toast-item toast-${type}`;
  toast.innerHTML = `
    <div class="toast-icon">
      <i class="fa-solid ${type === 'success' ? 'fa-circle-check' : type === 'warning' ? 'fa-triangle-exclamation' : 'fa-circle-info'}"></i>
    </div>
    <div class="toast-content">
      <strong>${title}</strong>
      <span>${msg}</span>
    </div>
  `;

  toastBox.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('toast-fade-out');
    setTimeout(() => toast.remove(), 400);
  }, 4000);
};

function formatDateString(str) {
  if (!str) return 'TBA';
  const d = new Date(str);
  if (isNaN(d.getTime())) return str;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
