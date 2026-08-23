// ==========================================
// SmartGovtPrep - Smart AI Study Planner (Current & Future Target Modes)
// ==========================================

class StudyPlanner {
  constructor() {
    this.initElements();
    this.bindEvents();
  }

  initElements() {
    this.form = document.getElementById('planner-form');
    this.examSelect = document.getElementById('planner-target-exam');
    this.hoursInput = document.getElementById('planner-hours');
    this.hoursDisplay = document.getElementById('planner-hours-val');
    this.routineSelect = document.getElementById('planner-routine-type');
    this.timelineSelect = document.getElementById('planner-timeline-mode');
    this.subjectCheckboxes = document.querySelectorAll('.planner-subject-check');
    this.resultContainer = document.getElementById('planner-result-container');
    this.timetableList = document.getElementById('planner-timetable-list');
    this.summaryBox = document.getElementById('planner-summary-box');
  }

  bindEvents() {
    if (this.hoursInput && this.hoursDisplay) {
      this.hoursInput.addEventListener('input', (e) => {
        this.hoursDisplay.textContent = `${e.target.value} Hours / Day`;
      });
    }

    if (this.form) {
      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.generateTimetable();
      });
    }

    const saveBtn = document.getElementById('planner-save-btn');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => this.saveToProfile());
    }

    const printBtn = document.getElementById('planner-print-btn');
    if (printBtn) {
      printBtn.addEventListener('click', () => window.print());
    }
  }

  generateTimetable() {
    const hours = parseInt(this.hoursInput?.value || '6', 10);
    const exam = this.examSelect?.value || 'gpsc';
    const examName = this.examSelect?.options[this.examSelect.selectedIndex]?.text || 'Target Exam';
    const routine = this.routineSelect?.value || 'morning';
    const timeline = this.timelineSelect?.value || 'future'; // 'current' or 'future'

    // Collect selected subjects
    const selectedSubjects = [];
    if (this.subjectCheckboxes) {
      this.subjectCheckboxes.forEach(cb => {
        if (cb.checked) selectedSubjects.push(cb.value);
      });
    }

    if (selectedSubjects.length === 0) {
      selectedSubjects.push('General Studies', 'Polity & Constitution', 'Current Affairs', 'Aptitude & Reasoning');
    }

    const schedule = this.buildSchedule(hours, routine, selectedSubjects, examName, timeline);
    this.renderSchedule(schedule, hours, examName, routine, timeline);
  }

  buildSchedule(hours, routine, subjects, examName, timeline) {
    const slots = [];
    let startHour = routine === 'morning' ? 6 : (routine === 'night' ? 9 : 7);

    // Helper to format time
    const formatTime = (h, m = 0) => {
      const actualH = h % 24;
      const period = actualH >= 12 ? 'PM' : 'AM';
      const displayH = actualH % 12 === 0 ? 12 : actualH % 12;
      return `${String(displayH).padStart(2, '0')}:${String(m).padStart(2, '0')} ${period}`;
    };

    if (timeline === 'current') {
      // ----------------- Current Imminent Exam Mode (Crash & Full Mock Focus) -----------------
      // Slot 1: Morning Current Affairs & Quick Revision
      slots.push({
        time: `${formatTime(startHour)} - ${formatTime(startHour + 1)}`,
        title: 'High-Yield Current Affairs & Scheme Revision',
        category: 'Crash Review',
        icon: 'fa-bolt',
        color: 'accent-amber',
        description: 'Rapid 6-month current affairs compilation + last year questions review.'
      });
      startHour += 1;

      // Slot 2: Full Length Timed Mock Test
      slots.push({
        time: `${formatTime(startHour)} - ${formatTime(startHour + 2)}`,
        title: `Full-Length Timed Mock Exam (${examName})`,
        category: 'Intense Mock Test',
        icon: 'fa-stopwatch-20',
        color: 'accent-rose',
        description: 'Simulate 100-200 questions under real exam pressure with negative marking.'
      });
      startHour += 2;

      // Break
      slots.push({
        time: `${formatTime(startHour)} - ${formatTime(startHour, 30)}`,
        title: 'Test Decompression & Refreshment Break',
        category: 'Break',
        icon: 'fa-mug-hot',
        color: 'accent-cyan',
        description: 'Rest eyes and brain before diving into mistake diagnostics.'
      });
      startHour += 1;

      // Slot 3: Deep Mock Analysis & Weak Topic Fixing
      slots.push({
        time: `${formatTime(startHour)} - ${formatTime(startHour + Math.max(1, hours - 5))}`,
        title: `Mistake Notebook & Weak Topic Remediation (${subjects[0] || 'Core Areas'})`,
        category: 'Weak Area Fix',
        icon: 'fa-screwdriver-wrench',
        color: 'accent-primary',
        description: 'Review every incorrect/unattempted question from today’s mock test using SmartGovtPrep AI Mentor explanations.'
      });
      startHour += Math.max(1, hours - 5);

      // Slot 4: Speed Formula Drills & Flashcards
      slots.push({
        time: `${formatTime(startHour)} - ${formatTime(startHour + 1)}`,
        title: 'Formula Sheets, Articles & Speed Math Drills',
        category: 'Speed Drills',
        icon: 'fa-fire',
        color: 'accent-emerald',
        description: 'Rapid active recall of constitutional articles, shortcuts, and static GK tables.'
      });

    } else {
      // ----------------- Target Future Exam Mode (Foundation & In-Depth Conceptual Master) -----------------
      // Slot 1: Morning Current Affairs & Newspaper Analysis
      slots.push({
        time: `${formatTime(startHour)} - ${formatTime(startHour + 1)}`,
        title: 'In-Depth Newspaper Editorial & Notes Making',
        category: 'Current Affairs',
        icon: 'fa-newspaper',
        color: 'accent-cyan',
        description: 'Read national & Gujarat state editorials, link with syllabus topics, and make digital notes.'
      });
      startHour += 1;

      // Core Subject Study Slots
      const coreCount = Math.min(subjects.length, Math.max(2, Math.floor((hours - 2) / 1.5)));
      for (let i = 0; i < coreCount; i++) {
        const subj = subjects[i % subjects.length];
        const durationHours = hours >= 8 ? 2 : 1.5;
        const endHour = startHour + Math.floor(durationHours);
        const endMin = (durationHours % 1) * 60;

        slots.push({
          time: `${formatTime(startHour)} - ${formatTime(endHour, endMin)}`,
          title: `Comprehensive Foundation Slot ${i + 1}: ${subj}`,
          category: 'Standard Books / NCERT',
          icon: 'fa-book-open',
          color: 'accent-primary',
          description: `Deep theoretical reading, chapter mastery, and structured handwritten/digital notes for ${subj}.`
        });

        startHour = endHour;
        if (endMin > 0) startHour += 1;

        // Break
        slots.push({
          time: `${formatTime(startHour)} - ${formatTime(startHour, 20)}`,
          title: 'Mind Recharge & Hydration',
          category: 'Break',
          icon: 'fa-mug-hot',
          color: 'accent-amber',
          description: 'Step away from desk, relax memory consolidation.'
        });
        startHour += 1;
      }

      // Slot: Topic Chapter-wise Practice MCQs & Answer Writing
      slots.push({
        time: `${formatTime(startHour)} - ${formatTime(startHour + 1)}`,
        title: `Chapter-wise Topic Test & Mains Answer Writing`,
        category: 'Practice & Writing',
        icon: 'fa-pen-nib',
        color: 'accent-emerald',
        description: 'Solve 25 chapter-wise questions + write 1 structured 150-word answer for target future examination.'
      });
      startHour += 1;

      // Slot: Active Recall & Spaced Repetition
      slots.push({
        time: `${formatTime(startHour)} - ${formatTime(startHour + 1)}`,
        title: 'Spaced Repetition & Day Summary Review',
        category: 'Revision',
        icon: 'fa-rotate',
        color: 'accent-purple',
        description: 'Review everything learned today and 3 days ago without looking at reference material.'
      });
    }

    return slots;
  }

  renderSchedule(slots, hours, examName, routine, timeline) {
    if (!this.resultContainer || !this.timetableList) return;

    this.timetableList.innerHTML = '';

    const strategyText = timeline === 'current'
      ? '⚡ Imminent Mode: 40% Full Mock Test + 35% Mistake Diagnostics + 25% Rapid Formula Revision'
      : '🎯 Long-Term Target Mode: 60% Core NCERT/Standard Books + 20% Answer Writing + 20% Current Affairs';

    const timelineBadge = timeline === 'current'
      ? '⚡ Current Imminent Exam (0-3 Months Focus)'
      : '🎯 Target Future Career Roadmap (Future Years)';

    if (this.summaryBox) {
      this.summaryBox.innerHTML = `
        <div class="planner-meta-grid">
          <div class="planner-meta-item">
            <span class="meta-label">Target Exam</span>
            <span class="meta-val">${examName}</span>
          </div>
          <div class="planner-meta-item">
            <span class="meta-label">Preparation Track</span>
            <span class="meta-val" style="color: ${timeline === 'current' ? '#f59e0b' : '#38bdf8'};">${timelineBadge}</span>
          </div>
          <div class="planner-meta-item">
            <span class="meta-label">Daily Capacity</span>
            <span class="meta-val">${hours} Hours / Day</span>
          </div>
          <div class="planner-meta-item">
            <span class="meta-label">Strategy Formula</span>
            <span class="meta-val" style="font-size: 0.82rem;">${strategyText}</span>
          </div>
        </div>
      `;
    }

    slots.forEach((slot, idx) => {
      const card = document.createElement('div');
      card.className = `timetable-card-item ${slot.color}`;
      card.innerHTML = `
        <div class="tt-time-col">
          <div class="tt-time-badge"><i class="fa-regular fa-clock"></i> ${slot.time}</div>
          <span class="tt-category-tag">${slot.category}</span>
        </div>
        <div class="tt-content-col">
          <div class="tt-header">
            <div class="tt-icon-wrap"><i class="fa-solid ${slot.icon}"></i></div>
            <h4>${slot.title}</h4>
          </div>
          <p class="tt-desc">${slot.description}</p>
        </div>
      `;
      this.timetableList.appendChild(card);
    });

    this.resultContainer.classList.remove('hidden');
    this.resultContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  saveToProfile() {
    window.showToast('Schedule Saved!', 'Your customized daily study timetable has been saved to your student profile dashboard.', 'success');
  }
}

window.studyPlanner = new StudyPlanner();
