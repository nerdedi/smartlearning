/**
 * Money Matching Game - Windgap Currency
 * Interactive game for Module 7 (Money Awareness)
 */

const MoneyGame = (() => {
  /* ---------- Currency Data ---------- */
  const CURRENCY = {
    notes: [
      { id: 'note5', value: 5, label: '$5', color: '#e8b4d4', textColor: '#6b1c50', icon: '🏛️', name: 'Five Dollars' },
      { id: 'note10', value: 10, label: '$10', color: '#b8c4e8', textColor: '#2d3a6b', icon: '🐦', name: 'Ten Dollars' },
      { id: 'note20', value: 20, label: '$20', color: '#f4a855', textColor: '#7d4200', icon: '🦆', name: 'Twenty Dollars' },
      { id: 'note50', value: 50, label: '$50', color: '#f4d455', textColor: '#6b5a00', icon: '👤', name: 'Fifty Dollars' },
      { id: 'note100', value: 100, label: '$100', color: '#8bc48b', textColor: '#1a4d1a', icon: '🐨', name: 'One Hundred Dollars' },
    ],
    coins: [
      { id: 'coin5c', value: 0.05, label: '5c', color: '#c0c0c0', textColor: '#333', icon: '🦔', name: 'Five Cents', shape: 'circle' },
      { id: 'coin10c', value: 0.10, label: '10c', color: '#c0c0c0', textColor: '#333', icon: '🦚', name: 'Ten Cents', shape: 'circle' },
      { id: 'coin20c', value: 0.20, label: '20c', color: '#c0c0c0', textColor: '#333', icon: '🦆', name: 'Twenty Cents', shape: 'circle' },
      { id: 'coin50c', value: 0.50, label: '50c', color: '#c0c0c0', textColor: '#333', icon: '🦘', name: 'Fifty Cents', shape: 'dodecagon' },
      { id: 'coin1', value: 1, label: '$1', color: '#d4af37', textColor: '#5c4600', icon: '🦘', name: 'One Dollar', shape: 'circle' },
      { id: 'coin2', value: 2, label: '$2', color: '#d4af37', textColor: '#5c4600', icon: '👴', name: 'Two Dollars', shape: 'circle-small' },
    ]
  };

  // Sprite map positions (x%, y%) for windgap-currency.png
  // Based on 3x2 grid for notes + 6 coins in row 3
  const SPRITE_MAP = {
    note5: { x: 0, y: 0, w: 33.33, h: 33 },
    note10: { x: 33.33, y: 0, w: 33.33, h: 33 },
    note20: { x: 66.66, y: 0, w: 33.33, h: 33 },
    note50: { x: 16.66, y: 33, w: 33.33, h: 33 },
    note100: { x: 66.66, y: 33, w: 33.33, h: 33 },
    coin5c: { x: 0, y: 75, w: 10, h: 25 },
    coin10c: { x: 12, y: 75, w: 10, h: 25 },
    coin20c: { x: 24, y: 75, w: 12, h: 25 },
    coin50c: { x: 38, y: 75, w: 14, h: 25 },
    coin1: { x: 55, y: 75, w: 14, h: 25 },
    coin2: { x: 72, y: 75, w: 14, h: 25 },
  };

  let gameState = {
    mode: 'learn', // learn | match-value | count | make-amount
    score: 0,
    round: 0,
    totalRounds: 5,
    selected: null,
    currentChallenge: null,
    feedback: null,
    useSpriteImage: true, // Use actual Windgap currency image
  };

  // Sprite image path
  const SPRITE_IMAGE = 'assets/money/windgap-currency.png';

  // Image dimensions: 1536 x 1024
  const IMG_W = 1536;
  const IMG_H = 1024;

  // Exact pixel crop regions for each currency item
  const SPRITE_REGIONS = {
    // Row 1: Notes $5, $10, $20 - each note is ~430px wide, ~270px tall
    note5:   { x: 40,   y: 55,  w: 430, h: 270 },
    note10:  { x: 540,  y: 55,  w: 430, h: 270 },
    note20:  { x: 1050, y: 55,  w: 440, h: 270 },
    // Row 2: $50 (with portrait, middle), $100 (right)
    note50:  { x: 540,  y: 360, w: 430, h: 270 },
    note100: { x: 1050, y: 360, w: 440, h: 270 },
    // Row 3: Coins - varying sizes
    coin5c:  { x: 95,   y: 720, w: 145, h: 145 },
    coin10c: { x: 280,  y: 720, w: 145, h: 145 },
    coin20c: { x: 475,  y: 710, w: 175, h: 175 },
    coin50c: { x: 695,  y: 690, w: 210, h: 210 },
    coin1:   { x: 950,  y: 705, w: 195, h: 195 },
    coin2:   { x: 1195, y: 705, w: 195, h: 195 },
  };

  /* ---------- Render Currency Item ---------- */
  function renderCurrency(item, size = 'medium', clickable = false, onclick = '') {
    const isNote = item.id.startsWith('note');
    const sizeClass = `money-${size}`;
    const clickAttr = clickable ? `onclick="${onclick}" tabindex="0" role="button"` : '';

    // Use real sprite image
    if (gameState.useSpriteImage && SPRITE_REGIONS[item.id]) {
      const region = SPRITE_REGIONS[item.id];

      // Target display sizes
      const noteSize = size === 'large' ? { w: 200, h: 125 } : size === 'small' ? { w: 120, h: 75 } : { w: 160, h: 100 };
      const coinSize = size === 'large' ? { w: 90, h: 90 } : size === 'small' ? { w: 55, h: 55 } : { w: 70, h: 70 };
      const displaySize = isNote ? noteSize : coinSize;

      // Scale factor: how much to scale the sprite region to fit display size
      const scaleX = displaySize.w / region.w;
      const scaleY = displaySize.h / region.h;

      // Scale the entire image by the same factor
      const bgW = Math.round(IMG_W * scaleX);
      const bgH = Math.round(IMG_H * scaleY);

      // Position = region position * scale factor
      const bgX = Math.round(region.x * scaleX);
      const bgY = Math.round(region.y * scaleY);

      return `
        <div class="money-item ${isNote ? 'money-note' : 'money-coin'} ${sizeClass}" data-id="${item.id}" ${clickAttr}>
          <div class="money-sprite" style="
            width: ${displaySize.w}px;
            height: ${displaySize.h}px;
            background-image: url('${SPRITE_IMAGE}');
            background-position: -${bgX}px -${bgY}px;
            background-size: ${bgW}px ${bgH}px;
            border-radius: ${isNote ? '8px' : '50%'};
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          "></div>
          <div class="money-label">${item.name}</div>
        </div>`;
    }

    // Fallback to CSS-styled representation
    if (isNote) {
      return `
        <div class="money-item money-note ${sizeClass}" data-id="${item.id}" ${clickAttr}>
          <div class="note-visual" style="background: linear-gradient(135deg, ${item.color} 0%, ${lighten(item.color, 20)} 100%);">
            <div class="note-corner note-tl">${item.label.replace('$', '')}</div>
            <div class="note-logo">
              <span class="windgap-text">windgap</span>
              <span class="windgap-tagline">Creating Opportunities</span>
            </div>
            <div class="note-corner note-br">${item.label.replace('$', '')}</div>
            <div class="note-icon">${item.icon}</div>
          </div>
          <div class="money-label">${item.name}</div>
        </div>`;
    } else {
      const shapeClass = item.shape === 'dodecagon' ? 'coin-dodecagon' : item.shape === 'circle-small' ? 'coin-small' : '';
      const isGold = item.value >= 1;
      return `
        <div class="money-item money-coin ${sizeClass} ${shapeClass}" data-id="${item.id}" ${clickAttr}>
          <div class="coin-visual ${isGold ? 'coin-gold' : 'coin-silver'}">
            <div class="coin-value">${item.label.replace('c', '').replace('$', '')}</div>
            <div class="coin-icon">${item.icon}</div>
          </div>
          <div class="money-label">${item.name}</div>
        </div>`;
    }
  }

  function lighten(color, percent) {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, (num >> 16) + amt);
    const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
    const B = Math.min(255, (num & 0x0000FF) + amt);
    return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
  }

  /* ---------- Game Modes ---------- */

  // Learn Mode - Show all currency
  function renderLearnMode() {
    return `
      <div class="money-game-section">
        <h3 class="heading" style="margin-bottom:1rem;">💵 Australian Notes</h3>
        <p class="text-muted" style="margin-bottom:1rem;">Tap each note to hear its value</p>
        <div class="money-grid money-grid-notes">
          ${CURRENCY.notes.map(n => renderCurrency(n, 'large', true, `MoneyGame.speakValue('${n.name}')`)).join('')}
        </div>
      </div>

      <div class="money-game-section">
        <h3 class="heading" style="margin-bottom:1rem;">🪙 Australian Coins</h3>
        <p class="text-muted" style="margin-bottom:1rem;">Tap each coin to hear its value</p>
        <div class="money-grid money-grid-coins">
          ${CURRENCY.coins.map(c => renderCurrency(c, 'medium', true, `MoneyGame.speakValue('${c.name}')`)).join('')}
        </div>
      </div>

      <div class="text-center" style="margin-top:2rem;">
        <button class="btn btn-primary btn-lg" onclick="MoneyGame.startGame('match-value')">
          🎮 Play Matching Game
        </button>
      </div>`;
  }

  // Match Value Game - Match currency to its value
  function renderMatchGame() {
    if (!gameState.currentChallenge) {
      generateMatchChallenge();
    }

    const challenge = gameState.currentChallenge;
    const allCurrency = [...CURRENCY.notes, ...CURRENCY.coins];
    const targetItem = allCurrency.find(c => c.id === challenge.targetId);

    // Shuffle options
    const options = challenge.options.map(id => allCurrency.find(c => c.id === id));

    return `
      <div class="money-game-header">
        <div class="game-progress">
          <span class="progress-text">Round ${gameState.round + 1} of ${gameState.totalRounds}</span>
          <div class="progress-bar">
            <div class="progress-fill" style="width:${((gameState.round) / gameState.totalRounds) * 100}%"></div>
          </div>
        </div>
        <div class="game-score">Score: ${gameState.score} ⭐</div>
      </div>

      <div class="match-challenge">
        <h3 class="heading text-center" style="margin-bottom:1.5rem;">
          Find the <span class="highlight">${challenge.targetValue}</span>
        </h3>

        <div class="match-options">
          ${options.map(item => `
            <button class="match-option ${gameState.selected === item.id ? (item.id === challenge.targetId ? 'correct' : 'incorrect') : ''}"
                    onclick="MoneyGame.checkMatch('${item.id}')"
                    ${gameState.selected ? 'disabled' : ''}>
              ${renderCurrency(item, 'medium')}
            </button>
          `).join('')}
        </div>
      </div>

      ${gameState.feedback ? `
        <div class="game-feedback ${gameState.feedback.correct ? 'feedback-correct' : 'feedback-incorrect'}">
          ${gameState.feedback.correct ? '✅ Correct!' : `❌ That's ${gameState.feedback.selectedName}. Try to remember: ${challenge.targetValue} looks like this!`}
        </div>
        <div class="text-center" style="margin-top:1rem;">
          <button class="btn btn-primary" onclick="MoneyGame.nextRound()">
            ${gameState.round + 1 >= gameState.totalRounds ? '🏆 See Results' : '➡️ Next Round'}
          </button>
        </div>
      ` : ''}`;
  }

  // Count Money Game - Add up displayed currency
  function renderCountGame() {
    if (!gameState.currentChallenge) {
      generateCountChallenge();
    }

    const challenge = gameState.currentChallenge;
    const allCurrency = [...CURRENCY.notes, ...CURRENCY.coins];

    return `
      <div class="money-game-header">
        <div class="game-progress">
          <span class="progress-text">Round ${gameState.round + 1} of ${gameState.totalRounds}</span>
          <div class="progress-bar">
            <div class="progress-fill" style="width:${((gameState.round) / gameState.totalRounds) * 100}%"></div>
          </div>
        </div>
        <div class="game-score">Score: ${gameState.score} ⭐</div>
      </div>

      <div class="count-challenge">
        <h3 class="heading text-center" style="margin-bottom:1.5rem;">
          💰 How much money is this?
        </h3>

        <div class="count-display">
          ${challenge.items.map(id => {
            const item = allCurrency.find(c => c.id === id);
            return renderCurrency(item, 'small');
          }).join('')}
        </div>

        <div class="count-options">
          ${challenge.options.map(opt => `
            <button class="count-option btn ${gameState.selected === opt ? (opt === challenge.answer ? 'correct' : 'incorrect') : 'btn-ghost'}"
                    onclick="MoneyGame.checkCount('${opt}')"
                    ${gameState.selected ? 'disabled' : ''}>
              ${opt}
            </button>
          `).join('')}
        </div>
      </div>

      ${gameState.feedback ? `
        <div class="game-feedback ${gameState.feedback.correct ? 'feedback-correct' : 'feedback-incorrect'}">
          ${gameState.feedback.correct ? '✅ Correct!' : `❌ The answer is ${challenge.answer}`}
        </div>
        <div class="text-center" style="margin-top:1rem;">
          <button class="btn btn-primary" onclick="MoneyGame.nextRound()">
            ${gameState.round + 1 >= gameState.totalRounds ? '🏆 See Results' : '➡️ Next Round'}
          </button>
        </div>
      ` : ''}`;
  }

  // Results Screen
  function renderResults() {
    const percentage = Math.round((gameState.score / gameState.totalRounds) * 100);
    const message = percentage >= 80 ? "🌟 Excellent! You're a money expert!" :
                    percentage >= 60 ? "👍 Good job! Keep practicing!" :
                    "💪 Keep learning! Practice makes perfect!";

    return `
      <div class="game-results bounce-in">
        <div class="results-trophy">🏆</div>
        <h2 class="heading">Game Complete!</h2>
        <div class="results-score">
          <span class="score-number">${gameState.score}</span>
          <span class="score-total">/ ${gameState.totalRounds}</span>
        </div>
        <div class="results-stars">
          ${'⭐'.repeat(gameState.score)}${'☆'.repeat(gameState.totalRounds - gameState.score)}
        </div>
        <p class="results-message">${message}</p>

        <div class="results-buttons">
          <button class="btn btn-primary btn-lg" onclick="MoneyGame.startGame('${gameState.mode}')">
            🔄 Play Again
          </button>
          <button class="btn btn-ghost" onclick="MoneyGame.setMode('learn')">
            📚 Back to Learning
          </button>
        </div>
      </div>`;
  }

  /* ---------- Game Logic ---------- */

  function generateMatchChallenge() {
    const allCurrency = [...CURRENCY.notes, ...CURRENCY.coins];
    const target = allCurrency[Math.floor(Math.random() * allCurrency.length)];

    // Get 3 other random items as distractors
    const others = allCurrency.filter(c => c.id !== target.id);
    const shuffled = others.sort(() => Math.random() - 0.5).slice(0, 3);

    // Add target and shuffle all options
    const options = [...shuffled, target].sort(() => Math.random() - 0.5);

    gameState.currentChallenge = {
      targetId: target.id,
      targetValue: target.name,
      options: options.map(o => o.id)
    };
  }

  function generateCountChallenge() {
    // Pick 2-4 random currency items
    const allCurrency = [...CURRENCY.notes, ...CURRENCY.coins];
    const count = 2 + Math.floor(Math.random() * 3);
    const items = [];
    let total = 0;

    for (let i = 0; i < count; i++) {
      const item = allCurrency[Math.floor(Math.random() * allCurrency.length)];
      items.push(item.id);
      total += item.value;
    }

    // Format answer
    const answer = total >= 1 ? `$${total.toFixed(2)}` : `${Math.round(total * 100)}c`;

    // Generate wrong options
    const wrongOptions = [
      total * 2,
      total + 5,
      total - (total > 1 ? 1 : 0.1),
      total + 10
    ].filter(v => v > 0 && v !== total)
     .slice(0, 3)
     .map(v => v >= 1 ? `$${v.toFixed(2)}` : `${Math.round(v * 100)}c`);

    const options = [answer, ...wrongOptions].sort(() => Math.random() - 0.5);

    gameState.currentChallenge = {
      items,
      answer,
      options
    };
  }

  function checkMatch(selectedId) {
    const allCurrency = [...CURRENCY.notes, ...CURRENCY.coins];
    const selected = allCurrency.find(c => c.id === selectedId);
    const correct = selectedId === gameState.currentChallenge.targetId;

    gameState.selected = selectedId;
    gameState.feedback = {
      correct,
      selectedName: selected.name
    };

    if (correct) {
      gameState.score++;
      if (typeof App !== 'undefined') App.speak('Correct!');
    } else {
      if (typeof App !== 'undefined') App.speak(`That's ${selected.name}`);
    }

    render();
  }

  function checkCount(answer) {
    const correct = answer === gameState.currentChallenge.answer;

    gameState.selected = answer;
    gameState.feedback = { correct };

    if (correct) {
      gameState.score++;
      if (typeof App !== 'undefined') App.speak('Correct!');
    }

    render();
  }

  function nextRound() {
    gameState.round++;
    gameState.selected = null;
    gameState.feedback = null;
    gameState.currentChallenge = null;

    if (gameState.round >= gameState.totalRounds) {
      gameState.mode = 'results';
    }

    render();
  }

  function startGame(mode) {
    gameState = {
      mode,
      score: 0,
      round: 0,
      totalRounds: 5,
      selected: null,
      currentChallenge: null,
      feedback: null
    };
    render();
  }

  function setMode(mode) {
    gameState.mode = mode;
    gameState.currentChallenge = null;
    render();
  }

  function speakValue(name) {
    if (typeof App !== 'undefined') {
      App.speak(name);
    } else if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(name);
      utterance.lang = 'en-AU';
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    }
  }

  /* ---------- Main Render ---------- */

  function render() {
    const container = document.getElementById('money-game-container');
    if (!container) return;

    let html = '';
    switch (gameState.mode) {
      case 'learn':
        html = renderLearnMode();
        break;
      case 'match-value':
        html = renderMatchGame();
        break;
      case 'count':
        html = renderCountGame();
        break;
      case 'results':
        html = renderResults();
        break;
      default:
        html = renderLearnMode();
    }

    container.innerHTML = html;
  }

  // Render the full game widget (for embedding in modules)
  function renderWidget() {
    return `
      <div class="money-game-widget">
        <div class="game-tabs">
          <button class="game-tab ${gameState.mode === 'learn' ? 'active' : ''}" onclick="MoneyGame.setMode('learn')">
            📚 Learn
          </button>
          <button class="game-tab ${gameState.mode === 'match-value' ? 'active' : ''}" onclick="MoneyGame.startGame('match-value')">
            🎯 Match
          </button>
          <button class="game-tab ${gameState.mode === 'count' ? 'active' : ''}" onclick="MoneyGame.startGame('count')">
            🧮 Count
          </button>
        </div>
        <div id="money-game-container" class="money-game-container">
          ${renderLearnMode()}
        </div>
      </div>`;
  }

  /* ---------- Public API ---------- */
  return {
    render,
    renderWidget,
    setMode,
    startGame,
    checkMatch,
    checkCount,
    nextRound,
    speakValue,
    CURRENCY
  };
})();
