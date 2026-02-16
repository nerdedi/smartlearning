/* ============================================================
   Smart Learning for Independence – App Core
   Routing, screen rendering, activity handlers, accessibility
   ============================================================ */
const App = (() => {
  /* ---------- State ---------- */
  let screen = 'welcome';      // welcome | dashboard | module | portfolio | checklist | settings | educator | educator-learner | educator-checklist | media-manager | export
  let activeModuleId = null;
  let modulePhase = 'learn';    // learn | activity | quiz | done
  let quizIndex = 0;
  let quizScore = 0;
  let quizAnswered = [];
  let activityState = {};

  /* ---------- DOM refs ---------- */
  const root = () => document.getElementById('app');

  /* ---------- Routing ---------- */
  function go(newScreen, opts) {
    screen = newScreen;
    if (opts?.moduleId) activeModuleId = opts.moduleId;
    if (opts?.phase) modulePhase = opts.phase;
    render();
    root().querySelector('.screen')?.scrollTo(0, 0);
    // announce to screen readers
    const title = root().querySelector('h1');
    if (title) title.setAttribute('tabindex', '-1'), title.focus({ preventScroll: true });
  }

  /* ---------- Accessibility ---------- */
  function applySettings() {
    const s = Storage.getSettings();
    document.documentElement.classList.toggle('high-contrast', !!s.highContrast);
    document.documentElement.classList.toggle('large-text', !!s.largeText);
  }

  /* ---------- Toast ---------- */
  function toast(msg, type = 'info') {
    document.querySelectorAll('.toast').forEach(t => t.remove());
    const el = document.createElement('div');
    el.className = `toast toast-${type}`;
    el.setAttribute('role', 'alert');
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3200);
  }

  /* ---------- Speak aloud helper ---------- */
  function speak(text) {
    const s = Storage.getSettings();
    if (!s.speakAloud || !('speechSynthesis' in window)) return;
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.9;
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  }

  /* ---------- HTML helpers ---------- */
  function h(tag, attrs, ...children) {
    let html = `<${tag}`;
    if (attrs) Object.entries(attrs).forEach(([k, v]) => {
      if (v === false || v == null) return;
      if (v === true) html += ` ${k}`;
      else html += ` ${k}="${String(v).replace(/"/g, '&quot;')}"`;
    });
    html += '>';
    const voidTags = ['img','input','br','hr','meta','link'];
    if (!voidTags.includes(tag)) {
      html += children.flat().join('');
      html += `</${tag}>`;
    }
    return html;
  }

  /* ---------- A11y toolbar ---------- */
  function renderA11yToolbar() {
    const s = Storage.getSettings();
    return `
      <div class="a11y-toolbar" role="toolbar" aria-label="Accessibility options">
        <button class="btn btn-sm btn-ghost" onclick="App.toggleSetting('highContrast')" aria-pressed="${s.highContrast}" title="High Contrast">🎨 Contrast</button>
        <button class="btn btn-sm btn-ghost" onclick="App.toggleSetting('largeText')" aria-pressed="${s.largeText}" title="Larger Text">🔤 Big Text</button>
        <button class="btn btn-sm btn-ghost" onclick="App.toggleSetting('speakAloud')" aria-pressed="${s.speakAloud}" title="Read Aloud">🔊 Read Aloud</button>
      </div>`;
  }

  function toggleSetting(key) {
    const s = Storage.getSettings();
    s[key] = !s[key];
    Storage.saveSettings(s);
    applySettings();
    toast(`${key === 'highContrast' ? 'High Contrast' : key === 'largeText' ? 'Large Text' : 'Read Aloud'} ${s[key] ? 'ON' : 'OFF'}`, 'info');
    render();
  }

  /* ---------- Screen: Welcome ---------- */
  function renderWelcome() {
    const profiles = Storage.getAllProfiles();
    return `
    <div class="screen" style="display:flex;align-items:center;justify-content:center;padding:1.5rem;">
      <div class="bounce-in text-center" style="max-width:28rem;width:100%;">
        <div style="margin-bottom:1.5rem;">
          <span style="font-size:4rem;" role="img" aria-label="Graduation cap">🎓</span>
        </div>
        <h1 class="heading" style="font-size:var(--fs-xxl);margin-bottom:0.25rem;">Smart Learning</h1>
        <p class="text-accent heading" style="font-size:var(--fs-lg);margin-bottom:1rem;">for Independence</p>
        <p class="text-muted" style="margin-bottom:2rem;">Learn digital skills through interactive modules — at your own pace.</p>

        <div class="card" style="margin-bottom:1.5rem;text-align:left;">
          <label for="learner-name" style="display:block;font-weight:700;margin-bottom:0.5rem;">What's your name?</label>
          <input id="learner-name" class="input" type="text" placeholder="Enter your name…" maxlength="30" autocomplete="off">
        </div>

        <button class="btn btn-primary btn-lg btn-block" onclick="App.startNew()" style="margin-bottom:1rem;">
          🚀 Let's Start!
        </button>

        ${profiles.length ? `
          <div style="border-top:1px solid rgba(255,255,255,0.15);padding-top:1rem;margin-top:1rem;">
            <p class="text-muted" style="font-size:0.85rem;margin-bottom:0.75rem;">Continue as:</p>
            <div class="flex gap-sm justify-center flex-wrap">
              ${profiles.slice(-5).map(p => `
                <button class="btn btn-sm btn-ghost" onclick="App.loadProfile('${p.id}')">👤 ${esc(p.name)}</button>
              `).join('')}
            </div>
          </div>` : ''}

        <div style="margin-top:1.5rem;">
          ${renderA11yToolbar()}
        </div>

        <button class="btn btn-ghost btn-sm" onclick="App.go('educator')" style="margin-top:1.5rem;opacity:0.7;">
          🔐 Educator Login
        </button>
      </div>
    </div>`;
  }

  function startNew() {
    const input = document.getElementById('learner-name');
    const name = input?.value.trim() || 'Learner';
    Storage.createProfile(name);
    toast(`Welcome, ${name}! 🎉`, 'success');
    go('dashboard');
  }

  function loadProfile(id) {
    Storage.setActiveProfile(id);
    go('dashboard');
  }

  /* ---------- Screen: Dashboard ---------- */
  function renderDashboard() {
    const p = Storage.getActiveProfile();
    if (!p) return renderWelcome();
    const completed = p.modulesCompleted || [];
    const badges = p.badges || [];
    const progress = Math.round((completed.length / MODULES.length) * 100);

    return `
    <div class="screen">
      <header class="app-header">
        <div class="header-inner">
          <div class="header-title-group">
            <h1 class="heading" style="font-size:var(--fs-xl);">G'day, ${esc(p.name)}! 👋</h1>
            <p class="text-muted" style="font-size:0.85rem;">Level ${Math.floor(completed.length / 4) + 1} · ${completed.length}/${MODULES.length} modules</p>
          </div>
          <div class="header-actions">
            <div class="stat-pill">
              <span class="stat-icon">⭐</span>
              <div><span class="stat-label">Points</span><br><span class="stat-value text-accent">${p.totalPoints}</span></div>
            </div>
            <button class="btn btn-sm btn-ghost" onclick="App.go('portfolio')" title="My Portfolio">📁 Portfolio</button>
            <button class="btn btn-sm btn-ghost" onclick="App.go('checklist')" title="Skills Checklist">📋 Checklist</button>
          </div>
        </div>
      </header>

      <div class="container space-y-lg" style="padding-bottom:3rem;">
        <!-- Progress -->
        <div class="card slide-up">
          <div class="flex justify-between items-center" style="margin-bottom:0.5rem;">
            <span class="heading" style="font-weight:700;">Progress</span>
            <span class="text-accent heading">${progress}%</span>
          </div>
          <div class="progress-track"><div class="progress-fill" style="width:${progress}%;"></div></div>
        </div>

        <!-- Badges -->
        ${badges.length ? `
        <div class="card slide-up">
          <p class="heading" style="font-weight:700;margin-bottom:0.75rem;">🏅 Badges Earned</p>
          <div class="flex gap-sm flex-wrap">${badges.map(b => `<span class="badge badge-gold">${esc(b)}</span>`).join('')}</div>
        </div>` : ''}

        <!-- A11y toolbar -->
        <div class="slide-up">${renderA11yToolbar()}</div>

        <!-- Strands -->
        ${STRANDS.map((strand, si) => {
          const strandMods = MODULES.filter(m => m.strand === strand.id);
          return `
          <div class="slide-up" style="animation-delay:${si * 0.08}s;">
            <h2 class="heading flex items-center gap-sm" style="font-size:var(--fs-lg);margin-bottom:0.75rem;">
              <span>${strand.icon}</span> ${esc(strand.title)}
            </h2>
            <div class="grid grid-3 stagger">
              ${strandMods.map(mod => {
                const done = completed.includes(mod.id);
                const score = p.quizScores[mod.id];
                return `
                <button class="card card-clickable module-card ${done ? 'card-success' : ''}" onclick="App.openModule('${mod.id}')" aria-label="${esc(mod.title)} ${done ? '(completed)' : ''}">
                  <div class="strand-indicator" style="--strand-color:${strand.color};"></div>
                  <span class="module-icon">${mod.icon}</span>
                  <div class="module-info">
                    <span class="module-title">Module ${mod.num}: ${esc(mod.title)}</span>
                    <span class="module-desc">${esc(mod.description)}</span>
                    ${done ? '<span class="badge badge-green" style="margin-top:0.25rem;">✅ Complete</span>' : ''}
                    ${score ? `<span class="badge badge-blue" style="margin-top:0.25rem;">Quiz: ${score.score}/${score.total}</span>` : ''}
                  </div>
                </button>`;
              }).join('')}
            </div>
          </div>`;
        }).join('')}

        <button class="btn btn-ghost btn-block" onclick="App.go('welcome')" style="margin-top:2rem;">🔙 Switch Learner</button>
      </div>
    </div>`;
  }

  /* ---------- Screen: Module ---------- */
  function openModule(id) {
    activeModuleId = id;
    modulePhase = 'learn';
    quizIndex = 0;
    quizScore = 0;
    quizAnswered = [];
    activityState = {};
    go('module', { moduleId: id, phase: 'learn' });
  }

  function getModule() {
    return MODULES.find(m => m.id === activeModuleId);
  }

  function renderModule() {
    const mod = getModule();
    if (!mod) return renderDashboard();
    const strand = strandFor(mod.num);

    return `
    <div class="screen">
      <header class="app-header">
        <div class="header-inner">
          <button class="btn btn-round" onclick="App.go('dashboard')" aria-label="Back to dashboard">←</button>
          <div class="header-title-group">
            <h1 class="heading" style="font-size:var(--fs-lg);">${mod.icon} Module ${mod.num}: ${esc(mod.title)}</h1>
            <p class="text-muted" style="font-size:0.8rem;">${esc(strand.title)}</p>
          </div>
        </div>
        <!-- Visual schedule -->
        <div class="visual-schedule" style="margin-top:0.75rem;" role="navigation" aria-label="Module phases">
          ${['learn', 'activity', 'quiz', 'done'].map((ph, i) => {
            const icons = ['📖', '🎯', '❓', '🏆'];
            const labels = ['Learn', 'Activity', 'Quiz', 'Done'];
            const cls = modulePhase === ph ? 'active' : (['learn','activity','quiz','done'].indexOf(modulePhase) > i ? 'done' : '');
            return `<div class="schedule-step ${cls}"><span class="schedule-icon">${icons[i]}</span>${labels[i]}</div>`;
          }).join('')}
        </div>
      </header>

      <div class="container space-y-lg" style="padding-bottom:3rem;">
        ${modulePhase === 'learn' ? renderLearnPhase(mod) :
          modulePhase === 'activity' ? renderActivityPhase(mod) :
          modulePhase === 'quiz' ? renderQuizPhase(mod) :
          renderDonePhase(mod)}
      </div>
    </div>`;
  }

  /* --- Learn phase --- */
  function renderLearnPhase(mod) {
    return `
      <div class="space-y stagger">
        <!-- Outcomes -->
        <div class="card card-info slide-up">
          <h2 class="heading" style="font-size:var(--fs-lg);margin-bottom:0.5rem;">🎯 What You'll Learn</h2>
          <ul class="checklist">${mod.outcomes.map(o => `<li><span>✅</span><span>${esc(o)}</span></li>`).join('')}</ul>
        </div>

        <!-- Vocabulary -->
        <div class="card slide-up">
          <h3 class="heading" style="margin-bottom:0.5rem;">📝 Key Words</h3>
          <div class="flex gap-sm flex-wrap">${mod.vocabulary.map(v => `<span class="badge badge-blue">${esc(v)}</span>`).join('')}</div>
        </div>

        <!-- Teach content -->
        ${mod.teachContent.map((tc, i) => `
          <div class="card slide-up step-card" style="animation-delay:${(i + 2) * 0.06}s;">
            <h3 class="step-title">${esc(tc.title)}</h3>
            <p class="step-body">${esc(tc.body)}</p>
            <button class="btn btn-sm btn-ghost" style="margin-top:0.5rem;" onclick="App.speak(\`${esc(tc.body)}\`)">🔊 Read Aloud</button>
          </div>
        `).join('')}

        <button class="btn btn-primary btn-lg btn-block" onclick="App.nextPhase('activity')">
          Next: Activity 🎯 →
        </button>
      </div>`;
  }

  /* --- Activity phase --- */
  function renderActivityPhase(mod) {
    const act = mod.activities[0];
    if (!act) return '<p>No activity for this module.</p>';

    let activityHTML = '';

    if (act.type === 'sort' || act.type === 'sort-buckets') {
      activityHTML = renderSortActivity(act);
    } else if (act.type === 'checklist') {
      activityHTML = renderChecklistActivity(act);
    } else if (act.type === 'passphrase-builder') {
      activityHTML = renderPassphraseBuilder(act);
    } else if (act.type === 'scenario') {
      activityHTML = renderScenarioActivity(act);
    } else if (act.type === 'budget-builder' || act.type === 'budget-challenge') {
      activityHTML = renderBudgetActivity(act);
    } else if (act.type === 'money-game') {
      activityHTML = renderMoneyGameActivity(act);
    } else if (act.type === 'steps-order') {
      activityHTML = renderStepsOrderActivity(act);
    } else if (act.type === 'spot-the-danger' || act.type === 'spot-the-risk') {
      activityHTML = renderSpotDangerActivity(act);
    } else if (act.type === 'safety-plan' || act.type === 'plan-builder') {
      activityHTML = renderPlanBuilderActivity(act);
    } else if (act.type === 'trip-planner') {
      activityHTML = renderTripPlannerActivity(act);
    } else if (act.type === 'video-call-sim') {
      activityHTML = renderVideoCallSimActivity(act);
    } else if (act.type === 'portal-explorer') {
      activityHTML = renderPortalExplorerActivity(act);
    } else if (act.type === 'comparison') {
      activityHTML = renderComparisonActivity(act);
    } else if (act.type === 'routine-builder') {
      activityHTML = renderRoutineBuilderActivity(act);
    } else if (act.type === 'job-explorer') {
      activityHTML = renderJobExplorerActivity(act);
    } else if (act.type === 'cv-builder') {
      activityHTML = renderCVBuilderActivity(act);
    } else if (act.type === 'email-composer') {
      activityHTML = renderEmailComposerActivity(act);
    } else if (act.type === 'interview-sim') {
      activityHTML = renderInterviewSimActivity(act);
    } else if (act.type === 'pledge-builder') {
      activityHTML = renderPledgeBuilderActivity(act);
    } else if (act.type === 'portfolio-review') {
      activityHTML = renderPortfolioReviewActivity(act);
    } else {
      activityHTML = `<div class="card"><p>Interactive activity: <strong>${esc(act.title)}</strong></p><p>${esc(act.instruction || '')}</p></div>`;
    }

    return `
      <div class="space-y stagger">
        <div class="card card-accent slide-up">
          <h2 class="heading" style="font-size:var(--fs-lg);margin-bottom:0.25rem;">🎯 ${esc(act.title)}</h2>
          <p>${esc(act.instruction || '')}</p>
        </div>
        ${activityHTML}
        <button class="btn btn-primary btn-lg btn-block" onclick="App.nextPhase('quiz')">
          Next: Quiz ❓ →
        </button>
      </div>`;
  }

  /* --- Activity renderers --- */

  function renderSortActivity(act) {
    if (!activityState.sortAnswers) activityState.sortAnswers = {};
    const items = act.items || [];

    if (act.type === 'sort-buckets') {
      return `
        <div class="space-y">
          <div class="grid grid-2">
            ${act.buckets.map((b, bi) => `
              <div class="activity-zone" id="bucket-${bi}">
                <p class="heading" style="margin-bottom:0.5rem;">${esc(b)}</p>
                <div id="bucket-items-${bi}" class="space-y-sm"></div>
              </div>
            `).join('')}
          </div>
          <div class="space-y-sm stagger">
            ${items.map((item, idx) => {
              const answered = activityState.sortAnswers[idx];
              return `
              <div class="flex gap-sm items-center ${answered !== undefined ? (answered ? 'drag-item correct' : 'drag-item incorrect') : 'drag-item'}" style="justify-content:space-between;">
                <span>${esc(item.text)}</span>
                ${answered === undefined ? `
                  <div class="flex gap-sm">
                    ${act.buckets.map((b, bi) => `<button class="btn btn-sm ${bi === 0 ? 'btn-primary' : 'btn-danger'}" onclick="App.sortAnswer(${idx}, ${bi}, ${item.bucket})">${esc(b)}</button>`).join('')}
                  </div>` : ''}
              </div>`;
            }).join('')}
          </div>
        </div>`;
    }

    // type === 'sort' (match pairs)
    return `
      <div class="space-y-sm stagger">
        ${items.map((item, idx) => {
          const answered = activityState.sortAnswers[idx];
          return `
          <div class="card ${answered !== undefined ? (answered ? 'card-success' : 'card-danger') : ''}" style="padding:1rem;">
            <p class="heading" style="font-weight:700;margin-bottom:0.5rem;">${esc(item.text)}</p>
            ${answered === undefined ? `
              <div class="flex gap-sm flex-wrap">
                ${items.map((other, oi) => `<button class="btn btn-sm btn-ghost" onclick="App.matchAnswer(${idx}, ${oi})">${esc(other.match)}</button>`).join('')}
              </div>` : `<p class="text-success">→ ${esc(item.match)}</p>`}
          </div>`;
        }).join('')}
      </div>`;
  }

  function sortAnswer(idx, chosen, correct) {
    activityState.sortAnswers[idx] = (chosen === correct);
    if (chosen === correct) toast('✅ Correct!', 'success');
    else toast('❌ Try again next time!', 'error');
    render();
  }

  function matchAnswer(itemIdx, matchIdx) {
    activityState.sortAnswers[itemIdx] = (itemIdx === matchIdx);
    if (itemIdx === matchIdx) toast('✅ Correct match!', 'success');
    else toast('❌ Not quite — keep trying!', 'error');
    render();
  }

  function renderChecklistActivity(act) {
    if (!activityState.checked) activityState.checked = {};
    return `
      <div class="card">
        <ul class="checklist">
          ${act.items.map((item, i) => `
            <li>
              <button class="check-box ${activityState.checked[i] ? 'checked' : ''}" onclick="App.toggleCheck(${i})" aria-label="${esc(item)} ${activityState.checked[i] ? 'done' : 'not done'}">
                ${activityState.checked[i] ? '✓' : ''}
              </button>
              <span>${esc(item)}</span>
            </li>
          `).join('')}
        </ul>
      </div>`;
  }

  function toggleCheck(i) {
    if (!activityState.checked) activityState.checked = {};
    activityState.checked[i] = !activityState.checked[i];
    render();
  }

  function renderPassphraseBuilder(act) {
    if (!activityState.passphrase) activityState.passphrase = ['', '', ''];
    const phrase = activityState.passphrase.filter(w => w).join('') + (activityState.passphraseNum || '');
    return `
      <div class="card space-y">
        <div class="grid grid-3">
          ${act.columns.map((col, ci) => `
            <div class="space-y-sm">
              <p class="heading" style="font-size:0.85rem;">Word ${ci + 1}</p>
              ${col.map(word => `
                <button class="option-btn ${activityState.passphrase[ci] === word ? 'correct' : ''}" onclick="App.pickPassWord(${ci},'${word}')" style="padding:0.5rem;">${esc(word)}</button>
              `).join('')}
            </div>
          `).join('')}
        </div>
        <div class="card card-accent">
          <p class="heading" style="margin-bottom:0.25rem;">Your Passphrase:</p>
          <p style="font-size:var(--fs-lg);font-weight:800;letter-spacing:1px;word-break:break-all;">${phrase || '(Pick words above!)'}</p>
          <p class="text-muted" style="font-size:0.8rem;margin-top:0.25rem;">Add a number too!</p>
          <div class="flex gap-sm flex-wrap" style="margin-top:0.5rem;">
            ${[1,2,3,4,5,6,7,8,9,0].map(n => `<button class="btn btn-sm ${activityState.passphraseNum == n ? 'btn-accent' : 'btn-ghost'}" onclick="App.pickPassNum(${n})">${n}</button>`).join('')}
          </div>
        </div>
      </div>`;
  }

  function pickPassWord(col, word) { activityState.passphrase[col] = word; render(); }
  function pickPassNum(n) { activityState.passphraseNum = n; render(); }

  function renderScenarioActivity(act) {
    if (!activityState.scenarioIdx) activityState.scenarioIdx = 0;
    if (!activityState.scenarioAnswers) activityState.scenarioAnswers = {};
    const scenarios = act.scenarios || [];
    const idx = activityState.scenarioIdx;
    if (idx >= scenarios.length) {
      return `<div class="card card-success"><p class="heading">✅ All scenarios complete!</p></div>`;
    }
    const sc = scenarios[idx];
    const answered = activityState.scenarioAnswers[idx];
    return `
      <div class="card space-y">
        <p class="heading" style="font-size:var(--fs-lg);">${esc(sc.situation)}</p>
        <div class="space-y-sm">
          ${sc.options.map((opt, oi) => `
            <button class="option-btn ${answered !== undefined ? (oi === sc.correct ? 'correct' : (answered === oi ? 'incorrect' : '')) : ''}"
              onclick="App.answerScenario(${idx},${oi},${sc.correct})" ${answered !== undefined ? 'disabled' : ''}>
              ${esc(opt)}
            </button>
          `).join('')}
        </div>
        ${answered !== undefined ? `
          <p style="margin-top:0.5rem;">${answered === sc.correct ? '✅ Great choice!' : '❌ ' + esc(sc.explanation || 'Not the best choice.')}</p>
          <button class="btn btn-primary btn-sm" onclick="App.nextScenario()">Next →</button>
        ` : ''}
      </div>`;
  }

  function answerScenario(idx, chosen, correct) {
    activityState.scenarioAnswers[idx] = chosen;
    if (chosen === correct) toast('✅ Great choice!', 'success');
    else toast('❌ Think about it differently next time.', 'error');
    render();
  }
  function nextScenario() {
    activityState.scenarioIdx = (activityState.scenarioIdx || 0) + 1;
    render();
  }

  function renderBudgetActivity(act) {
    if (!activityState.budgetSelected) activityState.budgetSelected = {};
    const items = act.items || [];
    const budget = act.budget || 50;
    let spent = 0;
    items.forEach((item, i) => { if (activityState.budgetSelected[i]) spent += item.price; });
    const remaining = budget - spent;
    return `
      <div class="card space-y">
        <div class="flex justify-between items-center">
          <span class="heading">Budget: $${budget}</span>
          <span class="heading ${remaining < 0 ? 'text-danger' : 'text-success'}">Left: $${remaining.toFixed(2)}</span>
        </div>
        <div class="progress-track"><div class="progress-fill" style="width:${Math.min(100, (spent / budget) * 100)}%;${remaining < 0 ? 'background:var(--clr-danger);' : ''}"></div></div>
        <div class="grid grid-2">
          ${items.map((item, i) => `
            <button class="card card-clickable ${activityState.budgetSelected[i] ? 'card-success' : ''}" onclick="App.toggleBudgetItem(${i})" style="text-align:center;">
              <span style="font-size:2rem;">${item.icon || '🛍️'}</span>
              <p class="heading" style="font-size:0.9rem;">${esc(item.name)}</p>
              <p class="text-accent heading">$${item.price.toFixed(2)}</p>
              ${item.isNeed !== undefined ? `<span class="badge ${item.isNeed ? 'badge-green' : 'badge-gold'}">${item.isNeed ? 'Need' : 'Want'}</span>` : ''}
            </button>
          `).join('')}
        </div>
      </div>`;
  }
  function toggleBudgetItem(i) {
    activityState.budgetSelected[i] = !activityState.budgetSelected[i];
    render();
  }

  function renderMoneyGameActivity(act) {
    // Uses the MoneyGame module to render an interactive money matching game
    if (typeof MoneyGame !== 'undefined') {
      return MoneyGame.renderWidget();
    }
    return `<div class="card"><p>Money Game loading...</p></div>`;
  }

  /* --- Generic activity renderers for remaining types --- */
  function renderStepsOrderActivity(act) {
    if (!activityState.stepsChecked) activityState.stepsChecked = {};
    const steps = act.steps || [];
    return `<div class="card"><h3 class="heading" style="margin-bottom:0.75rem;">Put the steps in order:</h3>
      <ol class="checklist">${steps.map((s, i) => `
        <li><button class="check-box ${activityState.stepsChecked[i] ? 'checked' : ''}" onclick="App.toggleStepCheck(${i})">${activityState.stepsChecked[i] ? '✓' : i + 1}</button><span>${esc(s)}</span></li>
      `).join('')}</ol></div>`;
  }
  function toggleStepCheck(i) { if (!activityState.stepsChecked) activityState.stepsChecked = {}; activityState.stepsChecked[i] = !activityState.stepsChecked[i]; render(); }

  function renderSpotDangerActivity(act) {
    if (!activityState.dangerFound) activityState.dangerFound = {};
    const items = act.items || [];
    return `<div class="space-y-sm stagger">${items.map((item, i) => `
      <button class="option-btn ${activityState.dangerFound[i] !== undefined ? (item.isDanger ? 'correct' : 'incorrect') : ''}" onclick="App.spotDanger(${i}, ${item.isDanger})">
        ${item.icon || ''} ${esc(item.text)} ${activityState.dangerFound[i] !== undefined ? (item.isDanger ? ' ⚠️ DANGER!' : ' ✅ Safe') : ''}
      </button>
    `).join('')}</div>`;
  }
  function spotDanger(i, isDanger) { activityState.dangerFound[i] = true; toast(isDanger ? '⚠️ Good catch — that\'s a danger!' : '✅ That one is safe.', isDanger ? 'error' : 'success'); render(); }

  function renderPlanBuilderActivity(act) {
    return `<div class="card space-y">
      <h3 class="heading">${esc(act.title)}</h3>
      ${(act.fields || act.sections || ['My plan']).map((f, i) => `
        <div><label class="heading" style="font-size:0.9rem;display:block;margin-bottom:0.25rem;">${esc(typeof f === 'string' ? f : f.label)}</label>
        <textarea class="input" rows="2" placeholder="${esc(typeof f === 'string' ? 'Write here…' : (f.hint || 'Write here…'))}" id="plan-field-${i}"></textarea></div>
      `).join('')}
      <button class="btn btn-primary btn-sm" onclick="App.savePlan()">💾 Save to Portfolio</button>
    </div>`;
  }
  function savePlan() {
    const mod = getModule();
    const fields = document.querySelectorAll('[id^="plan-field-"]');
    const data = Array.from(fields).map(f => f.value).join('\n---\n');
    if (data.trim()) {
      Storage.addPortfolioItem(mod.id, 'text', mod.title + ' Plan', data);
      toast('📁 Saved to portfolio!', 'success');
    }
  }

  function renderTripPlannerActivity(act) {
    return `<div class="card space-y">
      <h3 class="heading">🗺️ Plan Your Trip</h3>
      <div><label class="heading" style="font-size:0.9rem;">Where are you going?</label><input class="input" id="trip-dest" placeholder="e.g. Shopping centre, library…"></div>
      <div><label class="heading" style="font-size:0.9rem;">How will you get there?</label>
        <div class="flex gap-sm flex-wrap" style="margin-top:0.5rem;">
          ${['🚌 Bus', '🚂 Train', '🚶 Walk', '🚗 Car', '🚲 Bike'].map(t => `<button class="btn btn-sm btn-ghost" onclick="this.classList.toggle('btn-primary');this.classList.toggle('btn-ghost');">${t}</button>`).join('')}
        </div>
      </div>
      <div><label class="heading" style="font-size:0.9rem;">What time will you leave?</label><input class="input" type="time" id="trip-time"></div>
      <button class="btn btn-primary btn-sm" onclick="App.savePlan()">💾 Save Trip Plan</button>
    </div>`;
  }

  function renderVideoCallSimActivity(act) {
    return `<div class="card space-y text-center">
      <span style="font-size:4rem;">📹</span>
      <h3 class="heading">Practice Video Call</h3>
      <div class="grid grid-3">
        <div class="card"><span style="font-size:2rem;">📷</span><p style="font-size:0.85rem;font-weight:700;">Camera</p><button class="btn btn-sm btn-primary" onclick="toast('📷 Camera ON!','success')">Turn On</button></div>
        <div class="card"><span style="font-size:2rem;">🎤</span><p style="font-size:0.85rem;font-weight:700;">Microphone</p><button class="btn btn-sm btn-primary" onclick="toast('🎤 Mic ON!','success')">Turn On</button></div>
        <div class="card"><span style="font-size:2rem;">🔊</span><p style="font-size:0.85rem;font-weight:700;">Speaker</p><button class="btn btn-sm btn-primary" onclick="toast('🔊 Speaker ON!','success')">Turn On</button></div>
      </div>
      <ul class="checklist" style="text-align:left;"><li>✅ Find a quiet place</li><li>✅ Check your camera shows your face</li><li>✅ Say hello clearly</li><li>✅ Mute when not talking</li></ul>
    </div>`;
  }

  function renderPortalExplorerActivity(act) {
    const portals = act.portals || [
      { name: 'MyGov', icon: '🏛️', description: 'Access government services' },
      { name: 'My Health Record', icon: '🏥', description: 'View your health information' },
    ];
    return `<div class="space-y-sm stagger">
      ${portals.map(p => `<div class="card"><div class="flex gap items-center"><span style="font-size:2rem;">${p.icon}</span><div><p class="heading">${esc(p.name)}</p><p class="text-muted" style="font-size:0.85rem;">${esc(p.description)}</p></div></div></div>`).join('')}
      <div class="card card-warning"><p class="heading">⚠️ Remember:</p><p>Always get help from a trusted person when logging in for the first time. Never share your login details.</p></div>
    </div>`;
  }

  function renderComparisonActivity(act) {
    const items = act.items || [];
    if (!activityState.comparisonChoice) activityState.comparisonChoice = null;
    return `<div class="grid grid-2 stagger">${items.map((item, i) => `
      <button class="card card-clickable ${activityState.comparisonChoice === i ? 'card-success' : ''}" onclick="App.pickComparison(${i})" style="text-align:center;">
        <span style="font-size:2.5rem;">${item.icon || '🛍️'}</span>
        <p class="heading">${esc(item.name)}</p>
        <p class="text-accent heading">$${(item.price || 0).toFixed(2)}</p>
        ${item.delivery ? `<p class="text-muted" style="font-size:0.8rem;">🚚 ${esc(item.delivery)}</p>` : ''}
        ${item.fees ? `<p class="text-muted" style="font-size:0.8rem;">💰 Fees: ${esc(item.fees)}</p>` : ''}
      </button>
    `).join('')}</div>`;
  }
  function pickComparison(i) { activityState.comparisonChoice = i; toast('Good choice! Think about why.', 'info'); render(); }

  function renderRoutineBuilderActivity(act) {
    const timeSlots = act.timeSlots || ['🌅 Morning', '☀️ Afternoon', '🌙 Evening'];
    return `<div class="card space-y"><h3 class="heading">Build Your Routine</h3>
      ${timeSlots.map((slot, i) => `<div><label class="heading" style="font-size:0.9rem;">${esc(slot)}</label><textarea class="input" rows="2" placeholder="What do you do?" id="routine-${i}"></textarea></div>`).join('')}
      <button class="btn btn-primary btn-sm" onclick="App.savePlan()">💾 Save Routine</button>
    </div>`;
  }

  function renderJobExplorerActivity(act) {
    const jobs = act.jobs || [
      { title: 'Shop Assistant', icon: '🛍️', tasks: 'Help customers, stack shelves, use the register' },
      { title: 'Office Helper', icon: '🏢', tasks: 'Sort mail, answer phones, organise files' },
      { title: 'Café Worker', icon: '☕', tasks: 'Take orders, make drinks, clean tables' },
      { title: 'Garden Worker', icon: '🌿', tasks: 'Mow lawns, plant flowers, water gardens' },
    ];
    return `<div class="grid grid-2 stagger">${jobs.map(j => `
      <div class="card"><span style="font-size:2rem;">${j.icon}</span><p class="heading">${esc(j.title)}</p><p class="text-muted" style="font-size:0.85rem;">${esc(j.tasks)}</p></div>
    `).join('')}
    <div class="card card-accent" style="grid-column:1/-1;"><label class="heading" style="font-size:0.9rem;">Which job interests you? Why?</label><textarea class="input" rows="2" id="plan-field-0" placeholder="I'm interested in…"></textarea>
    <button class="btn btn-primary btn-sm" style="margin-top:0.5rem;" onclick="App.savePlan()">💾 Save</button></div></div>`;
  }

  function renderCVBuilderActivity(act) {
    const fields = ['Your Name', 'Your Strengths', 'Your Interests / Hobbies', 'Skills You Have', 'Experience or Volunteering'];
    return `<div class="card space-y"><h3 class="heading">📄 Build Your CV</h3>
      ${fields.map((f, i) => `<div><label class="heading" style="font-size:0.9rem;">${esc(f)}</label><input class="input" id="plan-field-${i}" placeholder="Write here…"></div>`).join('')}
      <button class="btn btn-primary btn-sm" onclick="App.savePlan()">💾 Save CV to Portfolio</button>
    </div>`;
  }

  function renderEmailComposerActivity(act) {
    return `<div class="card space-y"><h3 class="heading">✉️ Write a Polite Email</h3>
      <div><label class="heading" style="font-size:0.9rem;">To:</label><input class="input" id="plan-field-0" placeholder="employer@example.com"></div>
      <div><label class="heading" style="font-size:0.9rem;">Subject:</label><input class="input" id="plan-field-1" placeholder="e.g. Job Application"></div>
      <div><label class="heading" style="font-size:0.9rem;">Message:</label><textarea class="input" rows="4" id="plan-field-2" placeholder="Dear…"></textarea></div>
      <div class="card card-info"><p class="heading" style="font-size:0.85rem;">💡 Tips:</p><ul style="font-size:0.85rem;padding-left:1rem;"><li>Start with "Dear" or "Hello"</li><li>Be polite and clear</li><li>End with "Kind regards" and your name</li></ul></div>
      <button class="btn btn-primary btn-sm" onclick="App.savePlan()">💾 Save Email Draft</button>
    </div>`;
  }

  function renderInterviewSimActivity(act) {
    const questions = act.questions || [
      'Tell me about yourself.',
      'What are your strengths?',
      'Why do you want this job?',
      'What do you like to do?',
    ];
    if (!activityState.interviewIdx) activityState.interviewIdx = 0;
    const idx = activityState.interviewIdx;
    if (idx >= questions.length) return `<div class="card card-success text-center"><span style="font-size:3rem;">🎉</span><p class="heading">Interview practice complete!</p></div>`;
    return `<div class="card space-y text-center">
      <span style="font-size:3rem;">🎤</span>
      <p class="text-muted">Question ${idx + 1} of ${questions.length}</p>
      <p class="heading" style="font-size:var(--fs-lg);">"${esc(questions[idx])}"</p>
      <textarea class="input" rows="3" placeholder="Practise your answer here…" id="plan-field-0"></textarea>
      <div class="flex gap-sm justify-center"><button class="btn btn-primary" onclick="App.nextInterview()">Next Question →</button></div>
    </div>`;
  }
  function nextInterview() { activityState.interviewIdx = (activityState.interviewIdx || 0) + 1; render(); }

  function renderPledgeBuilderActivity(act) {
    const pledges = act.pledges || [
      'I will be polite in messages',
      'I will not share passwords',
      'I will report bullying',
      'I will keep work and personal separate',
      'I will ask before sharing photos',
    ];
    if (!activityState.pledgeSigned) activityState.pledgeSigned = {};
    return `<div class="card space-y"><h3 class="heading">✍️ My Workplace Pledge</h3>
      <ul class="checklist">${pledges.map((p, i) => `
        <li><button class="check-box ${activityState.pledgeSigned[i] ? 'checked' : ''}" onclick="App.togglePledge(${i})">${activityState.pledgeSigned[i] ? '✓' : ''}</button><span>${esc(p)}</span></li>
      `).join('')}</ul>
      <div><label class="heading" style="font-size:0.9rem;">Sign your name:</label><input class="input" id="plan-field-0" placeholder="Your name"></div>
      <button class="btn btn-primary btn-sm" onclick="App.savePlan()">💾 Save Pledge</button>
    </div>`;
  }
  function togglePledge(i) { if (!activityState.pledgeSigned) activityState.pledgeSigned = {}; activityState.pledgeSigned[i] = !activityState.pledgeSigned[i]; render(); }

  function renderPortfolioReviewActivity(act) {
    const strands = act.strands || [];
    return `<div class="space-y stagger">${strands.map((s, i) => `
      <div class="card"><div class="flex gap items-center" style="margin-bottom:0.5rem;"><span style="font-size:1.5rem;">${s.icon}</span><p class="heading">${esc(s.name)}</p></div>
        <textarea class="input" rows="2" placeholder="${esc(s.captionHint || 'Write your caption…')}" id="plan-field-${i}"></textarea>
      </div>
    `).join('')}
    <button class="btn btn-primary btn-sm" onclick="App.savePlan()">💾 Save Portfolio Captions</button>
    </div>`;
  }

  /* --- Quiz phase --- */
  function renderQuizPhase(mod) {
    const questions = mod.quiz || [];
    if (quizIndex >= questions.length) {
      // Quiz complete
      return renderQuizResult(mod, questions.length);
    }
    const q = questions[quizIndex];
    const answered = quizAnswered[quizIndex];
    return `
      <div class="space-y stagger">
        <div class="card slide-up">
          <div class="flex justify-between items-center" style="margin-bottom:0.5rem;">
            <span class="heading">Question ${quizIndex + 1} of ${questions.length}</span>
            <span class="badge badge-gold">Score: ${quizScore}</span>
          </div>
          <div class="progress-track"><div class="progress-fill" style="width:${((quizIndex) / questions.length) * 100}%;"></div></div>
        </div>

        <div class="card slide-up" style="animation-delay:0.06s;">
          <h2 class="heading" style="font-size:var(--fs-lg);margin-bottom:1rem;">${esc(q.q)}</h2>
          <div class="space-y-sm">
            ${q.options.map((opt, oi) => `
              <button class="option-btn ${answered !== undefined ? (oi === q.answer ? 'correct' : (answered === oi ? 'incorrect' : '')) : ''}"
                onclick="App.answerQuiz(${oi})" ${answered !== undefined ? 'disabled' : ''}>
                ${esc(opt)}
              </button>
            `).join('')}
          </div>
        </div>

        ${answered !== undefined ? `
          <div class="card ${answered === q.answer ? 'card-success' : 'card-danger'} slide-up">
            <p class="heading">${answered === q.answer ? '✅ Correct!' : '❌ Not quite.'}</p>
            <p>The answer is: <strong>${esc(q.options[q.answer])}</strong></p>
          </div>
          <button class="btn btn-primary btn-lg btn-block" onclick="App.nextQuizQuestion()">
            ${quizIndex + 1 >= questions.length ? 'See Results 🏆' : 'Next Question →'}
          </button>
        ` : ''}
      </div>`;
  }

  function answerQuiz(choice) {
    const mod = getModule();
    const q = mod.quiz[quizIndex];
    quizAnswered[quizIndex] = choice;
    if (choice === q.answer) {
      quizScore++;
      toast('✅ Correct!', 'success');
    } else {
      toast('❌ Not quite!', 'error');
    }
    render();
  }

  function nextQuizQuestion() {
    quizIndex++;
    render();
  }

  function renderQuizResult(mod, total) {
    const pct = Math.round((quizScore / total) * 100);
    const passed = pct >= 60;
    Storage.saveQuizScore(mod.id, quizScore, total);
    return `
      <div class="text-center space-y bounce-in">
        <span style="font-size:5rem;">${passed ? '🏆' : '📚'}</span>
        <h2 class="heading" style="font-size:var(--fs-xl);">${passed ? 'Great Work!' : 'Keep Practising!'}</h2>
        <p class="heading text-accent" style="font-size:var(--fs-lg);">${quizScore} / ${total} (${pct}%)</p>
        <div class="progress-track" style="max-width:20rem;margin:0 auto;"><div class="progress-fill" style="width:${pct}%;"></div></div>
        ${passed ? `<button class="btn btn-primary btn-lg btn-block" onclick="App.finishModule()">Complete Module ✅</button>` : ''}
        <button class="btn btn-ghost btn-block" onclick="App.retryQuiz()">🔄 Try Quiz Again</button>
        <button class="btn btn-ghost btn-block" onclick="App.go('dashboard')">← Back to Dashboard</button>
      </div>`;
  }

  function retryQuiz() {
    quizIndex = 0; quizScore = 0; quizAnswered = [];
    modulePhase = 'quiz';
    render();
  }

  /* --- Done phase --- */
  function renderDonePhase(mod) {
    return `
      <div class="text-center space-y bounce-in">
        <span style="font-size:5rem;">🎉</span>
        <h2 class="heading" style="font-size:var(--fs-xl);">Module Complete!</h2>
        <p class="text-accent heading">${esc(mod.badge)}</p>
        <div class="card card-accent" style="text-align:left;">
          <h3 class="heading" style="margin-bottom:0.5rem;">📁 Portfolio Task</h3>
          <p>${esc(mod.portfolioPrompt)}</p>
          <textarea class="input" rows="3" placeholder="Write your portfolio entry here…" id="portfolio-entry" style="margin-top:0.75rem;"></textarea>
          <button class="btn btn-primary btn-sm" style="margin-top:0.5rem;" onclick="App.savePortfolioEntry()">💾 Save to Portfolio</button>
        </div>
        <button class="btn btn-primary btn-lg btn-block" onclick="App.go('dashboard')">← Back to Dashboard</button>
      </div>`;
  }

  function finishModule() {
    const mod = getModule();
    Storage.completeModule(mod.id, mod.badge);
    toast(`🏅 Badge earned: ${mod.badge}`, 'success');
    modulePhase = 'done';
    render();
  }

  function savePortfolioEntry() {
    const mod = getModule();
    const entry = document.getElementById('portfolio-entry')?.value;
    if (entry?.trim()) {
      Storage.addPortfolioItem(mod.id, 'text', mod.title, entry);
      toast('📁 Saved to portfolio!', 'success');
    }
  }

  function nextPhase(phase) {
    modulePhase = phase;
    render();
    root().querySelector('.screen')?.scrollTo(0, 0);
  }

  /* ---------- Screen: Portfolio ---------- */
  function renderPortfolio() {
    const p = Storage.getActiveProfile();
    if (!p) return renderWelcome();
    const items = p.portfolio || [];
    return `
    <div class="screen">
      <header class="app-header"><div class="header-inner">
        <button class="btn btn-round" onclick="App.go('dashboard')" aria-label="Back">←</button>
        <div class="header-title-group"><h1 class="heading" style="font-size:var(--fs-xl);">📁 My Portfolio</h1><p class="text-muted">${items.length} artefacts</p></div>
      </div></header>
      <div class="container space-y-lg" style="padding-bottom:3rem;">
        ${items.length === 0 ? `<div class="card text-center"><span style="font-size:3rem;">📭</span><p class="heading" style="margin-top:0.5rem;">No portfolio items yet.</p><p class="text-muted">Complete modules and save your work!</p></div>` : ''}
        ${items.map((item, i) => {
          const mod = MODULES.find(m => m.id === item.moduleId);
          return `
            <div class="artefact slide-up" style="animation-delay:${i * 0.05}s;">
              <span class="artefact-icon">${mod?.icon || '📄'}</span>
              <div class="artefact-info">
                <p class="heading" style="font-size:0.9rem;">${esc(item.label)}</p>
                <p style="font-size:0.85rem;white-space:pre-wrap;margin-top:0.25rem;">${esc(item.data)}</p>
                <p class="artefact-date">${new Date(item.date).toLocaleDateString()}</p>
              </div>
            </div>`;
        }).join('')}
      </div>
    </div>`;
  }

  /* ---------- Screen: Checklist ---------- */
  function renderChecklist() {
    const p = Storage.getActiveProfile();
    if (!p) return renderWelcome();
    const scores = p.checklistScores || {};
    return `
    <div class="screen">
      <header class="app-header"><div class="header-inner">
        <button class="btn btn-round" onclick="App.go('dashboard')" aria-label="Back">←</button>
        <div class="header-title-group"><h1 class="heading" style="font-size:var(--fs-xl);">📋 Skills Checklist</h1><p class="text-muted">Rate your confidence 1–5</p></div>
      </div></header>
      <div class="container space-y" style="padding-bottom:3rem;">
        ${SKILLS_CHECKLIST.map((item, i) => `
          <div class="card slide-up" style="animation-delay:${i * 0.04}s;">
            <p style="margin-bottom:0.5rem;font-weight:600;">${esc(item.text)}</p>
            <div class="flex gap-sm">
              ${[1,2,3,4,5].map(v => `
                <button class="btn btn-sm ${scores[item.id] === v ? 'btn-accent' : 'btn-ghost'}" onclick="App.rateSkill('${item.id}', ${v})" aria-label="Rate ${v} out of 5">${v}</button>
              `).join('')}
            </div>
          </div>
        `).join('')}
        <button class="btn btn-primary btn-block" onclick="App.saveChecklist()">💾 Save Checklist</button>
      </div>
    </div>`;
  }

  function rateSkill(id, value) {
    const p = Storage.getActiveProfile();
    if (!p) return;
    const scores = { ...p.checklistScores, [id]: value };
    Storage.saveChecklistScores(scores);
    render();
  }

  function saveChecklist() {
    toast('📋 Checklist saved!', 'success');
  }

  /* ---------- Main render ---------- */
  function render() {
    let html = '';
    switch (screen) {
      case 'welcome':   html = renderWelcome(); break;
      case 'dashboard': html = renderDashboard(); break;
      case 'module':    html = renderModule(); break;
      case 'portfolio': html = renderPortfolio(); break;
      case 'checklist': html = renderChecklist(); break;
      case 'educator':  html = Educator.renderDashboard(); break;
      case 'educator-learner': html = Educator.renderLearnerDetail(); break;
      case 'educator-checklist': html = Educator.renderChecklistReport(); break;
      case 'media-manager': html = renderMediaManager(); break;
      case 'export':    html = renderExportPage(); break;
      default:          html = renderWelcome();
    }
    root().innerHTML = html;
  }

  /* ---------- Screen: Media Manager ---------- */
  function renderMediaManager() {
    const isEducator = typeof Educator !== 'undefined' && Educator.isLoggedIn();
    return `
    <div class="screen">
      <header class="app-header">
        <div class="header-inner">
          <button class="btn btn-round" onclick="App.go('${isEducator ? 'educator' : 'dashboard'}')" aria-label="Back">←</button>
          <div class="header-title-group">
            <h1 class="heading" style="font-size:var(--fs-xl);">📷 Media Library</h1>
            <p class="text-muted">Photos, videos, and resources</p>
          </div>
        </div>
      </header>
      <div class="container space-y-lg" style="padding-bottom:3rem;">
        ${Media.renderUploadForm()}
        <div class="card">
          <h2 class="heading" style="margin-bottom:1rem;">📚 All Media</h2>
          ${Media.renderGallery(null, { editable: true })}
        </div>
      </div>
    </div>`;
  }

  /* ---------- Screen: Export ---------- */
  function renderExportPage() {
    return `
    <div class="screen">
      <header class="app-header">
        <div class="header-inner">
          <button class="btn btn-round" onclick="App.go('educator')" aria-label="Back">←</button>
          <div class="header-title-group">
            <h1 class="heading" style="font-size:var(--fs-xl);">📥 Export Data</h1>
            <p class="text-muted">Download reports and backups</p>
          </div>
        </div>
      </header>
      <div class="container space-y-lg" style="padding-bottom:3rem;">
        <div class="grid grid-2">
          <div class="card text-center">
            <span style="font-size:3rem;">📊</span>
            <h3 class="heading" style="margin:0.5rem 0;">Learner Report (CSV)</h3>
            <p class="text-muted" style="font-size:0.85rem;margin-bottom:1rem;">All learner progress in spreadsheet format</p>
            <button class="btn btn-primary" onclick="Export.downloadCSV()">📥 Download CSV</button>
          </div>
          <div class="card text-center">
            <span style="font-size:3rem;">📄</span>
            <h3 class="heading" style="margin:0.5rem 0;">Summary Report (PDF)</h3>
            <p class="text-muted" style="font-size:0.85rem;margin-bottom:1rem;">Print-ready overview for acquittal</p>
            <button class="btn btn-primary" onclick="Export.downloadPDF()">📄 Generate PDF</button>
          </div>
          <div class="card text-center">
            <span style="font-size:3rem;">📚</span>
            <h3 class="heading" style="margin:0.5rem 0;">Module Stats (CSV)</h3>
            <p class="text-muted" style="font-size:0.85rem;margin-bottom:1rem;">Module completion and quiz data</p>
            <button class="btn btn-primary" onclick="Export.downloadModuleStatsCSV()">📥 Download CSV</button>
          </div>
          <div class="card text-center">
            <span style="font-size:3rem;">💾</span>
            <h3 class="heading" style="margin:0.5rem 0;">Full Backup (JSON)</h3>
            <p class="text-muted" style="font-size:0.85rem;margin-bottom:1rem;">Complete data backup for restoration</p>
            <button class="btn btn-primary" onclick="Export.exportJSON()">💾 Download Backup</button>
          </div>
        </div>
        <div class="card">
          <h3 class="heading" style="margin-bottom:0.75rem;">📤 Restore from Backup</h3>
          <input type="file" id="import-file" accept=".json" class="input">
          <button class="btn btn-ghost" style="margin-top:0.5rem;" onclick="App.importBackup()">📤 Import Data</button>
        </div>
      </div>
    </div>`;
  }

  function importBackup() {
    const input = document.getElementById('import-file');
    if (!input.files[0]) {
      toast('Please select a backup file', 'error');
      return;
    }
    Export.importJSON(input.files[0]).then(() => {
      toast('✅ Data restored successfully!', 'success');
      render();
    }).catch(err => {
      toast('❌ ' + err.message, 'error');
    });
  }

  /* ---------- Escape HTML ---------- */
  function esc(s) {
    if (!s) return '';
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* ---------- Init ---------- */
  function init() {
    applySettings();
    // Check if there's an active profile → go to dashboard
    const p = Storage.getActiveProfile();
    if (p) {
      screen = 'dashboard';
    }
    render();
  }

  /* ---------- Public API ---------- */
  return {
    init, go, render, toast, speak,
    startNew, loadProfile,
    openModule, nextPhase, finishModule,
    retryQuiz, answerQuiz, nextQuizQuestion,
    sortAnswer, matchAnswer,
    toggleCheck,
    pickPassWord, pickPassNum,
    answerScenario, nextScenario,
    toggleBudgetItem,
    toggleStepCheck,
    spotDanger,
    savePlan, savePortfolioEntry,
    pickComparison,
    nextInterview,
    togglePledge,
    rateSkill, saveChecklist,
    toggleSetting,
    importBackup,
  };
})();

// Boot
document.addEventListener('DOMContentLoaded', App.init);
