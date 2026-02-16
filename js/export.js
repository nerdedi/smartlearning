/* ============================================================
   Smart Learning for Independence – Export Module
   Generate CSV reports, PDF summaries, and data exports
   ============================================================ */

const Export = (() => {

  /* ---------- CSV Export ---------- */
  function generateCSV() {
    const learners = Storage.getAllProfiles();
    const headers = [
      'Name',
      'Created',
      'Modules Completed',
      'Total Modules',
      'Progress %',
      'Total Points',
      'Badges Earned',
      'Portfolio Items',
      'Avg Quiz Score %',
      ...SKILLS_CHECKLIST.map(s => s.text.substring(0, 40) + '...')
    ];

    const rows = learners.map(l => {
      const completed = (l.modulesCompleted || []).length;
      const progress = Math.round((completed / MODULES.length) * 100);
      const quizScores = Object.values(l.quizScores || {});
      const avgQuiz = quizScores.length > 0
        ? Math.round(quizScores.reduce((sum, s) => sum + (s.score / s.total) * 100, 0) / quizScores.length)
        : '';

      return [
        l.name,
        new Date(l.createdAt).toLocaleDateString(),
        completed,
        MODULES.length,
        progress,
        l.totalPoints || 0,
        (l.badges || []).length,
        (l.portfolio || []).length,
        avgQuiz,
        ...SKILLS_CHECKLIST.map(s => (l.checklistScores || {})[s.id] || '')
      ];
    });

    return [headers, ...rows];
  }

  function downloadCSV() {
    const data = generateCSV();
    const csv = data.map(row =>
      row.map(cell => {
        const str = String(cell);
        // Escape quotes and wrap in quotes if contains comma/newline
        if (str.includes(',') || str.includes('\n') || str.includes('"')) {
          return '"' + str.replace(/"/g, '""') + '"';
        }
        return str;
      }).join(',')
    ).join('\n');

    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `smartlearning-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    App.toast('📥 CSV downloaded!', 'success');
  }

  /* ---------- Module Stats CSV ---------- */
  function downloadModuleStatsCSV() {
    const stats = Educator.getModuleStats();
    const headers = ['Module #', 'Title', 'Strand', 'Completions', 'Completion Rate %', 'Quiz Attempts', 'Avg Quiz Score %'];

    const rows = stats.map(m => [
      m.num,
      m.title,
      strandFor(m.num).title,
      m.completions,
      m.completionRate,
      m.quizAttempts,
      m.avgQuizScore || ''
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `smartlearning-modules-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    App.toast('📥 Module stats downloaded!', 'success');
  }

  /* ---------- PDF Export (Print-friendly HTML) ---------- */
  function downloadPDF() {
    const stats = Educator.getOverallStats();
    const learners = Educator.getLearnerStats();
    const moduleStats = Educator.getModuleStats();

    const html = `
<!DOCTYPE html>
<html lang="en-AU">
<head>
  <meta charset="UTF-8">
  <title>Smart Learning for Independence – Report</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; font-size: 12px; line-height: 1.5; padding: 20px; color: #333; }
    h1 { font-size: 24px; color: #064e3b; margin-bottom: 5px; }
    h2 { font-size: 16px; color: #064e3b; margin: 20px 0 10px; border-bottom: 2px solid #064e3b; padding-bottom: 5px; }
    h3 { font-size: 14px; margin: 15px 0 8px; }
    .header { margin-bottom: 20px; }
    .date { color: #666; font-size: 11px; }
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 15px 0; }
    .stat-box { border: 1px solid #ddd; padding: 10px; text-align: center; border-radius: 5px; }
    .stat-value { font-size: 24px; font-weight: bold; color: #064e3b; }
    .stat-label { font-size: 11px; color: #666; }
    table { width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 11px; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background: #f5f5f5; font-weight: bold; }
    tr:nth-child(even) { background: #f9f9f9; }
    .progress-bar { width: 60px; height: 8px; background: #eee; border-radius: 4px; display: inline-block; vertical-align: middle; }
    .progress-fill { height: 100%; background: #059669; border-radius: 4px; }
    .badge { display: inline-block; padding: 2px 6px; border-radius: 10px; font-size: 10px; font-weight: bold; }
    .badge-green { background: #dcfce7; color: #166534; }
    .badge-gold { background: #fef3c7; color: #92400e; }
    .footer { margin-top: 30px; text-align: center; font-size: 10px; color: #999; border-top: 1px solid #ddd; padding-top: 10px; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>🎓 Smart Learning for Independence</h1>
    <p class="date">Report generated: ${new Date().toLocaleString()}</p>
  </div>

  <h2>📊 Overall Summary</h2>
  <div class="stats-grid">
    <div class="stat-box">
      <div class="stat-value">${stats.totalLearners}</div>
      <div class="stat-label">Total Learners</div>
    </div>
    <div class="stat-box">
      <div class="stat-value">${stats.activeLearners}</div>
      <div class="stat-label">Active Learners</div>
    </div>
    <div class="stat-box">
      <div class="stat-value">${stats.avgProgress}%</div>
      <div class="stat-label">Average Progress</div>
    </div>
    <div class="stat-box">
      <div class="stat-value">${stats.totalBadges}</div>
      <div class="stat-label">Badges Earned</div>
    </div>
  </div>

  <h2>👥 Learner Progress</h2>
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Progress</th>
        <th>Modules</th>
        <th>Avg Quiz</th>
        <th>Badges</th>
        <th>Portfolio</th>
        <th>Last Active</th>
      </tr>
    </thead>
    <tbody>
      ${learners.map(l => `
        <tr>
          <td><strong>${esc(l.name)}</strong></td>
          <td>
            <div class="progress-bar"><div class="progress-fill" style="width:${l.progress}%;"></div></div>
            ${l.progress}%
          </td>
          <td>${l.completedCount}/${MODULES.length}</td>
          <td>${l.avgQuizScore !== null ? l.avgQuizScore + '%' : '–'}</td>
          <td>${l.badgeCount}</td>
          <td>${l.portfolioCount}</td>
          <td>${l.lastActivity || '–'}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <h2>📚 Module Performance</h2>
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Module</th>
        <th>Completions</th>
        <th>Completion Rate</th>
        <th>Avg Quiz Score</th>
      </tr>
    </thead>
    <tbody>
      ${moduleStats.map(m => `
        <tr>
          <td>${m.num}</td>
          <td>${m.icon} ${esc(m.title)}</td>
          <td>${m.completions}</td>
          <td>
            <div class="progress-bar"><div class="progress-fill" style="width:${m.completionRate}%;"></div></div>
            ${m.completionRate}%
          </td>
          <td>${m.avgQuizScore !== null ? m.avgQuizScore + '%' : '–'}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <h2>📋 Skills Checklist Summary</h2>
  <table>
    <thead>
      <tr>
        <th>Skill</th>
        <th>Responses</th>
        <th>Average Score</th>
      </tr>
    </thead>
    <tbody>
      ${SKILLS_CHECKLIST.map(item => {
        const scores = learners.map(l => (l.checklistScores || {})[item.id]).filter(s => s !== undefined);
        const avg = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : '–';
        return `
          <tr>
            <td>${esc(item.text)}</td>
            <td>${scores.length}</td>
            <td>${avg}/5</td>
          </tr>`;
      }).join('')}
    </tbody>
  </table>

  <div class="footer">
    <p>Smart Learning for Independence – Windgap Foundation LLND & Transition</p>
    <p>📍 LLND Learning Hub, Banksmeadow</p>
  </div>
</body>
</html>`;

    // Open in new window for printing
    const printWindow = window.open('', '_blank');
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();

    // Auto-trigger print dialog
    setTimeout(() => {
      printWindow.print();
    }, 500);

    App.toast('📄 PDF ready for printing!', 'success');
  }

  /* ---------- Individual Learner Report ---------- */
  function downloadLearnerReport(learnerId) {
    const learner = Storage.getAllProfiles().find(l => l.id === learnerId);
    if (!learner) {
      App.toast('Learner not found', 'error');
      return;
    }

    const completedMods = MODULES.filter(m => (learner.modulesCompleted || []).includes(m.id));
    const progress = Math.round((completedMods.length / MODULES.length) * 100);

    const html = `
<!DOCTYPE html>
<html lang="en-AU">
<head>
  <meta charset="UTF-8">
  <title>Learner Report – ${esc(learner.name)}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; font-size: 12px; line-height: 1.5; padding: 20px; color: #333; }
    h1 { font-size: 24px; color: #064e3b; }
    h2 { font-size: 16px; color: #064e3b; margin: 20px 0 10px; border-bottom: 2px solid #064e3b; padding-bottom: 5px; }
    .header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid #064e3b; }
    .learner-name { font-size: 28px; font-weight: bold; color: #064e3b; }
    .meta { font-size: 11px; color: #666; }
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 15px 0; }
    .stat-box { border: 1px solid #ddd; padding: 10px; text-align: center; border-radius: 5px; }
    .stat-value { font-size: 24px; font-weight: bold; color: #064e3b; }
    .stat-label { font-size: 11px; color: #666; }
    table { width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 11px; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background: #f5f5f5; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 10px; margin: 2px; background: #dcfce7; color: #166534; }
    .portfolio-item { border: 1px solid #ddd; padding: 10px; margin: 10px 0; border-radius: 5px; }
    .portfolio-label { font-weight: bold; color: #064e3b; }
    .portfolio-content { margin-top: 5px; white-space: pre-wrap; }
    .portfolio-date { font-size: 10px; color: #666; margin-top: 5px; }
    .footer { margin-top: 30px; text-align: center; font-size: 10px; color: #999; border-top: 1px solid #ddd; padding-top: 10px; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="learner-name">👤 ${esc(learner.name)}</div>
      <div class="meta">Joined: ${new Date(learner.createdAt).toLocaleDateString()}</div>
    </div>
    <div class="meta">Report generated: ${new Date().toLocaleString()}</div>
  </div>

  <div class="stats-grid">
    <div class="stat-box">
      <div class="stat-value">${progress}%</div>
      <div class="stat-label">Progress</div>
    </div>
    <div class="stat-box">
      <div class="stat-value">${completedMods.length}/${MODULES.length}</div>
      <div class="stat-label">Modules</div>
    </div>
    <div class="stat-box">
      <div class="stat-value">${(learner.badges || []).length}</div>
      <div class="stat-label">Badges</div>
    </div>
    <div class="stat-box">
      <div class="stat-value">${learner.totalPoints || 0}</div>
      <div class="stat-label">Points</div>
    </div>
  </div>

  <h2>✅ Completed Modules</h2>
  ${completedMods.length === 0
    ? '<p>No modules completed yet.</p>'
    : `<p>${completedMods.map(m => `<span class="badge">${m.icon} ${esc(m.title)}</span>`).join(' ')}</p>`}

  <h2>📝 Quiz Scores</h2>
  ${Object.keys(learner.quizScores || {}).length === 0
    ? '<p>No quizzes taken yet.</p>'
    : `<table>
        <thead><tr><th>Module</th><th>Score</th><th>Percentage</th><th>Date</th></tr></thead>
        <tbody>
          ${Object.entries(learner.quizScores).map(([modId, score]) => {
            const mod = MODULES.find(m => m.id === modId);
            return `<tr>
              <td>${mod?.icon || ''} ${mod?.title || modId}</td>
              <td>${score.score}/${score.total}</td>
              <td>${Math.round((score.score / score.total) * 100)}%</td>
              <td>${new Date(score.date).toLocaleDateString()}</td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>`}

  <h2>📋 Skills Self-Assessment</h2>
  <table>
    <thead><tr><th>Skill</th><th>Rating (1-5)</th></tr></thead>
    <tbody>
      ${SKILLS_CHECKLIST.map(item => {
        const score = (learner.checklistScores || {})[item.id];
        return `<tr>
          <td>${esc(item.text)}</td>
          <td>${score || '–'}</td>
        </tr>`;
      }).join('')}
    </tbody>
  </table>

  <h2>📁 Portfolio</h2>
  ${(learner.portfolio || []).length === 0
    ? '<p>No portfolio items yet.</p>'
    : (learner.portfolio || []).map(item => {
        const mod = MODULES.find(m => m.id === item.moduleId);
        return `<div class="portfolio-item">
          <div class="portfolio-label">${mod?.icon || '📄'} ${esc(item.label)}</div>
          <div class="portfolio-content">${esc(item.data)}</div>
          <div class="portfolio-date">${new Date(item.date).toLocaleDateString()}</div>
        </div>`;
      }).join('')}

  <div class="footer">
    <p>Smart Learning for Independence – Windgap Foundation LLND & Transition</p>
  </div>
</body>
</html>`;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 500);

    App.toast('📄 Learner report ready!', 'success');
  }

  /* ---------- JSON Export (backup) ---------- */
  function exportJSON() {
    const data = {
      exportDate: new Date().toISOString(),
      profiles: Storage.getAllProfiles(),
      settings: Storage.getSettings(),
      media: typeof Media !== 'undefined' ? Media.getAllMedia() : [],
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `smartlearning-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    App.toast('📥 Backup downloaded!', 'success');
  }

  /* ---------- Import JSON ---------- */
  function importJSON(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);

          if (data.profiles) {
            localStorage.setItem('sl_profiles', JSON.stringify(data.profiles));
          }
          if (data.settings) {
            localStorage.setItem('sl_settings', JSON.stringify(data.settings));
          }
          if (data.media) {
            localStorage.setItem('sl_media_library', JSON.stringify(data.media));
          }

          resolve({ success: true });
        } catch (err) {
          reject(new Error('Invalid backup file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  /* ---------- Helper ---------- */
  function esc(s) {
    if (!s) return '';
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* ---------- Public API ---------- */
  return {
    generateCSV,
    downloadCSV,
    downloadModuleStatsCSV,
    downloadPDF,
    downloadLearnerReport,
    exportJSON,
    importJSON,
  };
})();
