/* ============================================================
   Smart Learning for Independence – Storage Layer
   LocalStorage-based persistence for learner profiles, progress,
   portfolio artefacts, and settings.
   ============================================================ */

const Storage = (() => {
  const KEYS = {
    PROFILES: 'sl_profiles',
    ACTIVE: 'sl_active_profile',
    SETTINGS: 'sl_settings',
  };

  /* ---------- helpers ---------- */
  function _get(key) {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch {
      return null;
    }
  }
  function _set(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  }

  /* ---------- Settings ---------- */
  const defaultSettings = {
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    speakAloud: false,
  };

  function getSettings() {
    return { ...defaultSettings, ..._get(KEYS.SETTINGS) };
  }
  function saveSettings(s) {
    _set(KEYS.SETTINGS, s);
  }

  /* ---------- Profiles ---------- */
  function _newProfile(name) {
    return {
      id: 'p_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      name: name || 'Learner',
      createdAt: new Date().toISOString(),
      modulesCompleted: [], // array of module ids
      quizScores: {}, // { moduleId: { score, total, date } }
      badges: [], // array of badge strings
      portfolio: [], // [{ moduleId, type, label, data, date }]
      checklistScores: {}, // baseline/post { itemId: value 1-5 }
      totalPoints: 0,
    };
  }

  function getAllProfiles() {
    return _get(KEYS.PROFILES) || [];
  }

  function createProfile(name) {
    const profiles = getAllProfiles();
    const p = _newProfile(name);
    profiles.push(p);
    _set(KEYS.PROFILES, profiles);
    setActiveProfile(p.id);
    return p;
  }

  function getActiveProfileId() {
    return _get(KEYS.ACTIVE);
  }
  function setActiveProfile(id) {
    _set(KEYS.ACTIVE, id);
  }

  function getActiveProfile() {
    const id = getActiveProfileId();
    if (!id) return null;
    return getAllProfiles().find((p) => p.id === id) || null;
  }

  function _updateProfile(id, updater) {
    const profiles = getAllProfiles();
    const idx = profiles.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    updater(profiles[idx]);
    _set(KEYS.PROFILES, profiles);
    return profiles[idx];
  }

  /* ---------- Progress ---------- */
  function completeModule(moduleId, badge) {
    const id = getActiveProfileId();
    if (!id) return;
    return _updateProfile(id, (p) => {
      if (!p.modulesCompleted.includes(moduleId)) {
        p.modulesCompleted.push(moduleId);
        p.totalPoints += 10;
      }
      if (badge && !p.badges.includes(badge)) {
        p.badges.push(badge);
        p.totalPoints += 5;
      }
    });
  }

  function saveQuizScore(moduleId, score, total) {
    const id = getActiveProfileId();
    if (!id) return;
    return _updateProfile(id, (p) => {
      p.quizScores[moduleId] = { score, total, date: new Date().toISOString() };
      p.totalPoints += score;
    });
  }

  function addPortfolioItem(moduleId, type, label, data) {
    const id = getActiveProfileId();
    if (!id) return;
    return _updateProfile(id, (p) => {
      p.portfolio.push({
        moduleId,
        type, // 'text' | 'checklist' | 'drawing' | 'note'
        label,
        data,
        date: new Date().toISOString(),
      });
    });
  }

  function saveChecklistScores(scores) {
    const id = getActiveProfileId();
    if (!id) return;
    return _updateProfile(id, (p) => {
      p.checklistScores = { ...p.checklistScores, ...scores };
    });
  }

  /* ---------- Reset ---------- */
  function resetProfile(profileId) {
    return _updateProfile(profileId, (p) => {
      p.modulesCompleted = [];
      p.quizScores = {};
      p.badges = [];
      p.portfolio = [];
      p.checklistScores = {};
      p.totalPoints = 0;
    });
  }

  function deleteProfile(profileId) {
    const profiles = getAllProfiles().filter((p) => p.id !== profileId);
    _set(KEYS.PROFILES, profiles);
    if (getActiveProfileId() === profileId) {
      _set(KEYS.ACTIVE, profiles.length ? profiles[0].id : null);
    }
  }

  /* ---------- Public API ---------- */
  return {
    getSettings,
    saveSettings,
    getAllProfiles,
    createProfile,
    getActiveProfile,
    getActiveProfileId,
    setActiveProfile,
    completeModule,
    saveQuizScore,
    addPortfolioItem,
    saveChecklistScores,
    resetProfile,
    deleteProfile,
  };
})();
