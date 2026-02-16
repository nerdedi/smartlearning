/* ============================================================
   Smart Learning for Independence – Educator Dashboard
   Admin view for educators to monitor progress, manage content
   ============================================================ */

const Educator = (() => {
  const EDUCATOR_KEY = 'sl_educator_session';
  const EDUCATOR_PIN = '2026'; // Simple PIN for basic protection

  /* ---------- Auth ---------- */
  function isLoggedIn() {
    return sessionStorage.getItem(EDUCATOR_KEY) === 'true';
  }

  function login(pin) {
    if (pin === EDUCATOR_PIN) {
      sessionStorage.setItem(EDUCATOR_KEY, 'true');
      return true;
    }
    return false;
  }

  function logout() {
    sessionStorage.removeItem(EDUCATOR_KEY);
  }

  /* ---------- Get all learner data ---------- */
  function getAllLearners() {
    return Storage.getAllProfiles();
  }

  function getLearnerStats() {
    const learners = getAllLearners();
    const totalModules = MODULES.length;

    return learners.map((learner) => {
      const completedCount = (learner.modulesCompleted || []).length;
      const progress = Math.round((completedCount / totalModules) * 100);
      const avgQuizScore = calculateAvgQuizScore(learner);
      const lastActivity = getLastActivity(learner);

      return {
        ...learner,
        completedCount,
        progress,
        avgQuizScore,
        lastActivity,
        badgeCount: (learner.badges || []).length,
        portfolioCount: (learner.portfolio || []).length,
      };
    });
  }

  function calculateAvgQuizScore(learner) {
    const scores = learner.quizScores || {};
    const entries = Object.values(scores);
    if (entries.length === 0) return null;
    const total = entries.reduce((sum, s) => sum + (s.score / s.total) * 100, 0);
    return Math.round(total / entries.length);
  }

  function getLastActivity(learner) {
    const dates = [
      learner.createdAt,
      ...(learner.portfolio || []).map((p) => p.date),
      ...Object.values(learner.quizScores || {}).map((s) => s.date),
    ].filter(Boolean);

    if (dates.length === 0) return null;
    return new Date(Math.max(...dates.map((d) => new Date(d)))).toLocaleDateString();
  }

  /* ---------- Module completion stats ---------- */
  function getModuleStats() {
    const learners = getAllLearners();

    return MODULES.map((mod) => {
      const completions = learners.filter((l) =>
        (l.modulesCompleted || []).includes(mod.id)
      ).length;

      const quizAttempts = learners.filter((l) => l.quizScores && l.quizScores[mod.id]);

      const avgScore =
        quizAttempts.length > 0
          ? Math.round(
              quizAttempts.reduce(
                (sum, l) => sum + (l.quizScores[mod.id].score / l.quizScores[mod.id].total) * 100,
                0
              ) / quizAttempts.length
            )
          : null;

      return {
        ...mod,
        completions,
        completionRate: learners.length > 0 ? Math.round((completions / learners.length) * 100) : 0,
        quizAttempts: quizAttempts.length,
        avgQuizScore: avgScore,
      };
    });
  }

  /* ---------- Overall stats ---------- */
  function getOverallStats() {
    const learners = getAllLearners();
    const totalLearners = learners.length;
    const activeLearners = learners.filter((l) => (l.modulesCompleted || []).length > 0).length;
    const totalCompletions = learners.reduce(
      (sum, l) => sum + (l.modulesCompleted || []).length,
      0
    );
    const totalBadges = learners.reduce((sum, l) => sum + (l.badges || []).length, 0);
    const totalPortfolioItems = learners.reduce((sum, l) => sum + (l.portfolio || []).length, 0);

    const avgProgress =
      totalLearners > 0
        ? Math.round(
            learners.reduce(
              (sum, l) => sum + ((l.modulesCompleted || []).length / MODULES.length) * 100,
              0
            ) / totalLearners
          )
        : 0;

    return {
      totalLearners,
      activeLearners,
      totalCompletions,
      totalBadges,
      totalPortfolioItems,
      avgProgress,
      totalModules: MODULES.length,
    };
  }

  /* ---------- Render educator login ---------- */
  function renderLogin() {
    return `
      <div class="screen" style="display:flex;align-items:center;justify-content:center;padding:1.5rem;">
        <div class="card" style="max-width:24rem;width:100%;">
          <h1 class="heading text-center" style="margin-bottom:1rem;">👩‍🏫 Educator Login</h1>
          <p class="text-muted text-center" style="margin-bottom:1.5rem;">Enter the educator PIN to access the dashboard.</p>
          <input type="password" id="educator-pin" class="input" placeholder="Enter PIN" maxlength="10" style="text-align:center;font-size:1.5rem;letter-spacing:0.5rem;">
          <button class="btn btn-primary btn-block" style="margin-top:1rem;" onclick="Educator.attemptLogin()">🔓 Login</button>
          <button class="btn btn-ghost btn-block" style="margin-top:0.5rem;" onclick="App.go('welcome')">← Back</button>
        </div>
      </div>`;
  }

  function attemptLogin() {
    const pin = document.getElementById('educator-pin').value;
    if (login(pin)) {
      App.toast('✅ Welcome, Educator!', 'success');
      App.go('educator');
    } else {
      App.toast('❌ Incorrect PIN', 'error');
    }
  }

  /* ---------- Render main dashboard ---------- */
  function renderDashboard() {
    if (!isLoggedIn()) return renderLogin();

    const stats = getOverallStats();
    const learners = getLearnerStats();
    const modules = getModuleStats();

    return `
      <div class="screen">
        <header class="app-header">
          <div class="header-inner">
            <div class="header-title-group">
              <h1 class="heading" style="font-size:var(--fs-xl);">👩‍🏫 Educator Dashboard</h1>
              <p class="text-muted">Smart Learning for Independence</p>
            </div>
            <div class="header-actions">
              <button class="btn btn-sm btn-ghost" onclick="Educator.exportData()">📥 Export Data</button>
              <button class="btn btn-sm btn-ghost" onclick="App.go('media-manager')">📷 Media</button>
              <button class="btn btn-sm btn-danger" onclick="Educator.doLogout()">🚪 Logout</button>
            </div>
          </div>
        </header>

        <div class="container space-y-lg" style="padding-bottom:3rem;">
          <!-- Overview Stats -->
          <div class="grid grid-4">
            ${renderStatCard('👥', 'Learners', stats.totalLearners, `${stats.activeLearners} active`)}
            ${renderStatCard('📊', 'Avg Progress', stats.avgProgress + '%', '')}
            ${renderStatCard('🏅', 'Badges Earned', stats.totalBadges, '')}
            ${renderStatCard('📁', 'Portfolio Items', stats.totalPortfolioItems, '')}
          </div>

          <!-- Learner Progress Table -->
          <div class="card">
            <h2 class="heading" style="margin-bottom:1rem;">📋 Learner Progress</h2>
            ${
              learners.length === 0
                ? '<p class="text-muted">No learners yet.</p>'
                : renderLearnerTable(learners)
            }
          </div>

          <!-- Module Stats -->
          <div class="card">
            <h2 class="heading" style="margin-bottom:1rem;">📚 Module Performance</h2>
            ${renderModuleTable(modules)}
          </div>

          <!-- Quick Actions -->
          <div class="card">
            <h2 class="heading" style="margin-bottom:1rem;">⚡ Quick Actions</h2>
            <div class="flex gap flex-wrap">
              <button class="btn btn-primary" onclick="Educator.exportCSV()">📊 Export CSV Report</button>
              <button class="btn btn-ghost" onclick="Educator.exportPDF()">📄 Export PDF Summary</button>
              <button class="btn btn-ghost" onclick="App.go('media-manager')">📷 Manage Media</button>
              <button class="btn btn-ghost" onclick="Educator.viewChecklist()">📋 Skills Checklist Report</button>
            </div>
          </div>

          <button class="btn btn-ghost btn-block" onclick="App.go('welcome')">← Back to App</button>
        </div>
      </div>`;
  }

  function renderStatCard(icon, label, value, subtext) {
    return `
      <div class="card text-center">
        <span style="font-size:2rem;">${icon}</span>
        <p class="heading text-accent" style="font-size:var(--fs-xl);margin:0.25rem 0;">${value}</p>
        <p class="heading" style="font-size:0.9rem;">${label}</p>
        ${subtext ? `<p class="text-muted" style="font-size:0.75rem;">${subtext}</p>` : ''}
      </div>`;
  }

  function renderLearnerTable(learners) {
    return `
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Progress</th>
              <th>Modules</th>
              <th>Avg Quiz</th>
              <th>Badges</th>
              <th>Portfolio</th>
              <th>Last Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${learners
              .map(
                (l) => `
              <tr>
                <td><strong>${esc(l.name)}</strong></td>
                <td>
                  <div class="progress-mini">
                    <div class="progress-fill-mini" style="width:${l.progress}%;"></div>
                  </div>
                  <span style="font-size:0.75rem;">${l.progress}%</span>
                </td>
                <td>${l.completedCount}/${MODULES.length}</td>
                <td>${l.avgQuizScore !== null ? l.avgQuizScore + '%' : '–'}</td>
                <td>${l.badgeCount}</td>
                <td>${l.portfolioCount}</td>
                <td>${l.lastActivity || '–'}</td>
                <td>
                  <button class="btn btn-sm btn-ghost" onclick="Educator.viewLearner('${l.id}')" title="View details">👁️</button>
                  <button class="btn btn-sm btn-ghost" onclick="Educator.exportLearner('${l.id}')" title="Export">📥</button>
                </td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      </div>`;
  }

  function renderModuleTable(modules) {
    return `
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Module</th>
              <th>Strand</th>
              <th>Completions</th>
              <th>Completion Rate</th>
              <th>Avg Quiz Score</th>
            </tr>
          </thead>
          <tbody>
            ${modules
              .map((m) => {
                const strand = strandFor(m.num);
                return `
              <tr>
                <td>${m.num}</td>
                <td>${m.icon} ${esc(m.title)}</td>
                <td><span class="badge" style="background:${strand.color};">${strand.icon}</span></td>
                <td>${m.completions}</td>
                <td>
                  <div class="progress-mini">
                    <div class="progress-fill-mini" style="width:${m.completionRate}%;"></div>
                  </div>
                  ${m.completionRate}%
                </td>
                <td>${m.avgQuizScore !== null ? m.avgQuizScore + '%' : '–'}</td>
              </tr>`;
              })
              .join('')}
          </tbody>
        </table>
      </div>`;
  }

  /* ---------- View individual learner ---------- */
  function viewLearner(id) {
    const learner = getAllLearners().find((l) => l.id === id);
    if (!learner) {
      App.toast('Learner not found', 'error');
      return;
    }

    // Store selected learner and render detail view
    sessionStorage.setItem('sl_viewing_learner', id);
    App.go('educator-learner');
  }

  function renderLearnerDetail() {
    if (!isLoggedIn()) return renderLogin();

    const id = sessionStorage.getItem('sl_viewing_learner');
    const learner = getAllLearners().find((l) => l.id === id);

    if (!learner) {
      return `<div class="screen"><div class="container"><p>Learner not found.</p><button class="btn btn-ghost" onclick="App.go('educator')">← Back</button></div></div>`;
    }

    const completedMods = MODULES.filter((m) => (learner.modulesCompleted || []).includes(m.id));
    const checklistScores = learner.checklistScores || {};

    return `
      <div class="screen">
        <header class="app-header">
          <div class="header-inner">
            <button class="btn btn-round" onclick="App.go('educator')" aria-label="Back">←</button>
            <div class="header-title-group">
              <h1 class="heading">👤 ${esc(learner.name)}</h1>
              <p class="text-muted">Joined ${new Date(learner.createdAt).toLocaleDateString()}</p>
            </div>
            <button class="btn btn-sm btn-primary" onclick="Educator.exportLearner('${learner.id}')">📥 Export</button>
          </div>
        </header>

        <div class="container space-y-lg" style="padding-bottom:3rem;">
          <!-- Stats -->
          <div class="grid grid-4">
            ${renderStatCard('📊', 'Progress', Math.round((completedMods.length / MODULES.length) * 100) + '%', '')}
            ${renderStatCard('📚', 'Modules', completedMods.length + '/' + MODULES.length, '')}
            ${renderStatCard('🏅', 'Badges', (learner.badges || []).length, '')}
            ${renderStatCard('⭐', 'Points', learner.totalPoints || 0, '')}
          </div>

          <!-- Completed Modules -->
          <div class="card">
            <h2 class="heading" style="margin-bottom:0.75rem;">✅ Completed Modules</h2>
            ${
              completedMods.length === 0
                ? '<p class="text-muted">No modules completed yet.</p>'
                : `<div class="flex gap-sm flex-wrap">${completedMods
                    .map((m) => `<span class="badge badge-green">${m.icon} ${esc(m.title)}</span>`)
                    .join('')}</div>`
            }
          </div>

          <!-- Quiz Scores -->
          <div class="card">
            <h2 class="heading" style="margin-bottom:0.75rem;">📝 Quiz Scores</h2>
            ${
              Object.keys(learner.quizScores || {}).length === 0
                ? '<p class="text-muted">No quizzes taken yet.</p>'
                : `<div class="space-y-sm">${Object.entries(learner.quizScores)
                    .map(([modId, score]) => {
                      const mod = MODULES.find((m) => m.id === modId);
                      const pct = Math.round((score.score / score.total) * 100);
                      return `<div class="flex justify-between items-center">
                    <span>${mod?.icon || ''} ${mod?.title || modId}</span>
                    <span class="badge ${pct >= 60 ? 'badge-green' : 'badge-gold'}">${score.score}/${score.total} (${pct}%)</span>
                  </div>`;
                    })
                    .join('')}</div>`
            }
          </div>

          <!-- Skills Checklist -->
          <div class="card">
            <h2 class="heading" style="margin-bottom:0.75rem;">📋 Skills Checklist</h2>
            ${
              Object.keys(checklistScores).length === 0
                ? '<p class="text-muted">Checklist not completed yet.</p>'
                : `<div class="space-y-sm">${SKILLS_CHECKLIST.map((item) => {
                    const score = checklistScores[item.id];
                    return `<div class="flex justify-between items-center" style="font-size:0.9rem;">
                    <span>${esc(item.text)}</span>
                    <span class="badge ${score ? (score >= 4 ? 'badge-green' : score >= 2 ? 'badge-gold' : 'badge-blue') : ''}">${score || '–'}/5</span>
                  </div>`;
                  }).join('')}</div>`
            }
          </div>

          <!-- Portfolio -->
          <div class="card">
            <h2 class="heading" style="margin-bottom:0.75rem;">📁 Portfolio Items (${(learner.portfolio || []).length})</h2>
            ${
              (learner.portfolio || []).length === 0
                ? '<p class="text-muted">No portfolio items yet.</p>'
                : `<div class="space-y">${(learner.portfolio || [])
                    .map((item) => {
                      const mod = MODULES.find((m) => m.id === item.moduleId);
                      return `<div class="card" style="padding:0.75rem;">
                    <p class="heading" style="font-size:0.85rem;">${mod?.icon || '📄'} ${esc(item.label)}</p>
                    <p style="font-size:0.85rem;white-space:pre-wrap;margin-top:0.25rem;">${esc(item.data)}</p>
                    <p class="text-muted" style="font-size:0.75rem;margin-top:0.25rem;">${new Date(item.date).toLocaleDateString()}</p>
                  </div>`;
                    })
                    .join('')}</div>`
            }
          </div>
        </div>
      </div>`;
  }

  /* ---------- Skills Checklist Report ---------- */
  function viewChecklist() {
    App.go('educator-checklist');
  }

  function renderChecklistReport() {
    if (!isLoggedIn()) return renderLogin();

    const learners = getAllLearners();

    return `
      <div class="screen">
        <header class="app-header">
          <div class="header-inner">
            <button class="btn btn-round" onclick="App.go('educator')" aria-label="Back">←</button>
            <div class="header-title-group">
              <h1 class="heading">📋 Skills Checklist Report</h1>
              <p class="text-muted">Baseline/Post Assessment Overview</p>
            </div>
          </div>
        </header>

        <div class="container space-y-lg" style="padding-bottom:3rem;">
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Skill</th>
                  ${learners.map((l) => `<th style="writing-mode:vertical-rl;text-orientation:mixed;">${esc(l.name)}</th>`).join('')}
                  <th>Avg</th>
                </tr>
              </thead>
              <tbody>
                ${SKILLS_CHECKLIST.map((item) => {
                  const scores = learners.map((l) => (l.checklistScores || {})[item.id] || null);
                  const validScores = scores.filter((s) => s !== null);
                  const avg =
                    validScores.length > 0
                      ? (validScores.reduce((a, b) => a + b, 0) / validScores.length).toFixed(1)
                      : '–';
                  return `
                    <tr>
                      <td style="font-size:0.85rem;">${esc(item.text)}</td>
                      ${scores.map((s) => `<td class="text-center">${s !== null ? s : '–'}</td>`).join('')}
                      <td class="text-center"><strong>${avg}</strong></td>
                    </tr>`;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>`;
  }

  /* ---------- Export functions ---------- */
  function exportData() {
    App.go('export');
  }

  function exportCSV() {
    Export.downloadCSV();
  }

  function exportPDF() {
    Export.downloadPDF();
  }

  function exportLearner(id) {
    Export.downloadLearnerReport(id);
  }

  /* ---------- Logout ---------- */
  function doLogout() {
    logout();
    App.toast('Logged out', 'info');
    App.go('welcome');
  }

  /* ---------- Helper ---------- */
  function esc(s) {
    if (!s) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ---------- Public API ---------- */
  return {
    isLoggedIn,
    login,
    logout,
    attemptLogin,
    doLogout,
    getAllLearners,
    getLearnerStats,
    getModuleStats,
    getOverallStats,
    renderLogin,
    renderDashboard,
    renderLearnerDetail,
    renderChecklistReport,
    viewLearner,
    viewChecklist,
    exportData,
    exportCSV,
    exportPDF,
    exportLearner,
  };
})();
