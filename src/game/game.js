import { GAME_CONTENT } from '../modules-data.js'

// === Default configuration & state ===
const defaultConfig = {
  welcome_title: 'Welcome to Town Square!',
  help_owl_name: 'Ollie',
}

const gameState = {
  currentScreen: 'loading',
  currentWorld: null,
  currentLevel: null,
  isPaused: false,
  score: 0,
  collectibles: 0,
  totalCollectibles: 5,
  playerProgress: [],
  settings: {
    contrast: false,
    largeText: false,
    dyslexic: false,
    reduceMotion: false,
    tts: false,
    autoJump: false,
    oneButton: false,
    slowMotion: false,
  },
}

// Local storage keys
const STORAGE_KEYS = {
  SETTINGS: 'sli-game-settings',
  PROGRESS: 'sli-player-progress',
}

// DOM short-hands
const $id = (id) => document.getElementById(id)

// ============ Initialization ============
async function initialize() {
  // animate loading bar
  const loadingBar = $id('loading-bar')
  for (let i = 0; i <= 100; i += 12) {
    loadingBar.style.width = i + '%'
    // small delay so user sees progress
    // eslint-disable-next-line no-await-in-loop
    await delay(60)
  }

  // load persisted player progress (fallback when no dataSdk)
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.PROGRESS)
    if (saved) gameState.playerProgress = JSON.parse(saved)
  } catch (e) {
    // ignore
  }

  loadSettings()
  setupKeyboardControls()
  setupTouchControls()

  // render main menu
  renderMainMenu()
  showScreen('main-menu')
}

// ============ Screen management & UI rendering ============
function showScreen(screenId) {
  const screens = [
    'loading-screen',
    'main-menu',
    'hub-screen',
    'world-screen',
    'game-screen',
    'minigame-screen',
    'quiz-screen',
    'results-screen',
  ]
  screens.forEach((id) => {
    const el = $id(id)
    if (el) el.classList.toggle('hidden', id !== screenId)
  })
  gameState.currentScreen = screenId
}

function renderMainMenu() {
  const el = $id('main-menu')
  el.innerHTML = `
    <div class="h-full w-full flex flex-col items-center justify-center p-8" style="background: linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);">
      <div class="relative z-10 text-center max-w-2xl">
        <div class="text-8xl mb-6">🎮</div>
        <h1 class="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-pink-400 to-yellow-400 bg-clip-text text-transparent">Smart Learning for Independence</h1>
        <p class="text-xl opacity-90 mb-12">Learn digital skills through fun adventures!</p>
        <div class="flex flex-col gap-4 items-center">
          <button id="start-adventure" class="btn-game text-2xl px-12" aria-label="Start your adventure"> 🚀 Start Adventure </button>
          <button id="open-settings" class="btn-game bg-gradient-to-b from-blue-500 to-blue-700" style="box-shadow: 0 4px 0 #1e3a5f;"> ⚙️ Settings </button>
          <button id="view-progress" class="btn-game bg-gradient-to-b from-green-500 to-green-700" style="box-shadow: 0 4px 0 #1a5c3a;"> 📊 My Progress </button>
        </div>
      </div>
    </div>
  `

  $id('start-adventure').addEventListener('click', () => startGame())
  $id('open-settings').addEventListener('click', () => showSettings())
  $id('view-progress').addEventListener('click', () => showProgress())
}

function startGame() {
  renderHub()
  showScreen('hub-screen')
  updateProgressUI()
}

// ============ Settings modal (rendered on demand) ============
function showSettings() {
  const modal = $id('settings-modal')
  modal.innerHTML = `
    <div class="modal-overlay absolute inset-0" onclick=""></div>
    <div class="absolute inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg rounded-3xl p-6 md:p-8 overflow-auto" style="background: var(--color-surface); max-height: 90%;">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">⚙️ Settings</h2>
        <button id="close-settings" class="text-3xl hover:scale-110 transition">✕</button>
      </div>
      <div class="space-y-6">
        <div>
          <h3 class="text-xl font-bold mb-4 flex items-center gap-2">♿ Accessibility</h3>
          <div class="space-y-4">
            <label class="flex items-center justify-between p-4 rounded-xl cursor-pointer" style="background: rgba(255,255,255,0.1);"> <span class="font-semibold">High Contrast</span> <input type="checkbox" id="setting-contrast" class="w-6 h-6" /> </label>
            <label class="flex items-center justify-between p-4 rounded-xl cursor-pointer" style="background: rgba(255,255,255,0.1);"> <span class="font-semibold">Large Text</span> <input type="checkbox" id="setting-large-text" class="w-6 h-6" /> </label>
            <label class="flex items-center justify-between p-4 rounded-xl cursor-pointer" style="background: rgba(255,255,255,0.1);"> <span class="font-semibold">Dyslexic-Friendly Font</span> <input type="checkbox" id="setting-dyslexic" class="w-6 h-6" /> </label>
            <label class="flex items-center justify-between p-4 rounded-xl cursor-pointer" style="background: rgba(255,255,255,0.1);"> <span class="font-semibold">Reduce Motion</span> <input type="checkbox" id="setting-motion" class="w-6 h-6" /> </label>
            <label class="flex items-center justify-between p-4 rounded-xl cursor-pointer" style="background: rgba(255,255,255,0.1);"> <span class="font-semibold">Read Aloud (TTS)</span> <input type="checkbox" id="setting-tts" class="w-6 h-6" /> </label>
          </div>
        </div>
        <div>
          <h3 class="text-xl font-bold mb-4 flex items-center gap-2">🎮 Game Assist</h3>
          <div class="space-y-4">
            <label class="flex items-center justify-between p-4 rounded-xl cursor-pointer" style="background: rgba(255,255,255,0.1);"> <span class="font-semibold">Auto-Jump</span> <input type="checkbox" id="setting-autojump" class="w-6 h-6" /> </label>
            <label class="flex items-center justify-between p-4 rounded-xl cursor-pointer" style="background: rgba(255,255,255,0.1);"> <span class="font-semibold">One-Button Mode</span> <input type="checkbox" id="setting-onebutton" class="w-6 h-6" /> </label>
            <label class="flex items-center justify-between p-4 rounded-xl cursor-pointer" style="background: rgba(255,255,255,0.1);"> <span class="font-semibold">Slow Motion</span> <input type="checkbox" id="setting-slowmo" class="w-6 h-6" /> </label>
          </div>
        </div>
      </div>
      <div class="mt-8 text-right"><button id="save-settings" class="btn-game">✅ Save Settings</button></div>
    </div>
  `

  // set checkbox states and wire events
  const map = {
    contrast: 'setting-contrast',
    largeText: 'setting-large-text',
    dyslexic: 'setting-dyslexic',
    reduceMotion: 'setting-motion',
    tts: 'setting-tts',
    autoJump: 'setting-autojump',
    oneButton: 'setting-onebutton',
    slowMotion: 'setting-slowmo',
  }
  Object.keys(map).forEach((k) => {
    const el = $id(map[k])
    if (!el) return
    el.checked = !!gameState.settings[k]
    el.addEventListener('change', () => {
      gameState.settings[k] = el.checked
      applySettings()
    })
  })

  $id('save-settings').addEventListener('click', () => {
    saveSettings()
    hideSettings()
  })
  $id('close-settings').addEventListener('click', () => hideSettings())
  modal.classList.remove('hidden')
}

function hideSettings() {
  $id('settings-modal').classList.add('hidden')
  saveSettings()
}

// Hub / world grid
function renderHub() {
  const hub = $id('hub-screen')
  hub.innerHTML = `
    <div class="min-h-full w-full p-4 md:p-8" style="background: linear-gradient(180deg, #87CEEB 0%, #98D8AA 60%, #4A7C59 100%);">
      <div class="flex flex-wrap justify-between items-center mb-6 gap-4" style="background: rgba(255,255,255,0.9); border-radius: 16px; padding: 16px 24px;">
        <div class="flex items-center gap-4">
          <button id="back-main" class="text-3xl hover:scale-110 transition">🏠</button>
          <h2 id="hub-title" class="text-2xl md:text-3xl font-bold">${defaultConfig.welcome_title}</h2>
        </div>
        <div class="flex items-center gap-6 flex-wrap">
          <div class="flex items-center gap-2 text-xl"><span>⭐</span> <span id="total-stars" class="font-bold">0</span></div>
          <div class="flex items-center gap-2 text-xl"><span>🏅</span> <span id="total-badges" class="font-bold">0</span></div>
          <div class="flex items-center gap-2 text-xl"><span>💎</span> <span id="total-points" class="font-bold">0</span></div>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto" id="world-grid"></div>
    </div>
  `

  $id('back-main').addEventListener('click', () => showScreen('main-menu'))

  const grid = $id('world-grid')
  grid.innerHTML = GAME_CONTENT.worlds
    .map((world) => {
      const color = world.color || '#ffffff'
      return `
      <button class="world-gate p-6 text-left" data-world="${world.id}" style="border-color: ${color}; background: linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0.95)); color: #1a1a2e;">
        <div class="text-6xl mb-4">${world.icon}</div>
        <h3 class="text-2xl font-bold mb-2">${world.name}</h3>
        <p class="opacity-80 mb-4">${(world.levels && world.levels[0]?.outcomes?.[0]) || ''}</p>
        <div class="mt-4 h-3 bg-gray-700 rounded-full overflow-hidden"><div id="world-${world.id}-progress" class="h-full bg-gradient-to-r from-teal-400 to-green-400 rounded-full" style="width:0%"></div></div>
      </button>
    `
    })
    .join('')

  // wire gates
  grid.querySelectorAll('button[data-world]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const id = Number(btn.getAttribute('data-world'))
      enterWorld(id)
    })
  })
}

// ============ World & Level navigation ============
function enterWorld(worldId) {
  gameState.currentWorld = worldId
  const world = GAME_CONTENT.worlds.find((w) => w.id === worldId)
  const content = $id('world-content')
  content.style.background = world.bgGradient || ''

  const worldProgress = gameState.playerProgress.filter(
    (p) => p.type === 'level' && p.world_id === worldId,
  )

  content.innerHTML = `
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center gap-4 mb-8">
        <button id="world-back" class="text-4xl hover:scale-110 transition">⬅️</button>
        <div>
          <h2 class="text-3xl font-bold">${world.icon} ${world.name}</h2>
          <p class="opacity-70">Choose a level to play</p>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="level-grid"></div>
    </div>
  `

  $id('world-back').addEventListener('click', () => showScreen('hub-screen'))

  const levelGrid = $id('level-grid')
  levelGrid.innerHTML = world.levels
    .map((level, index) => {
      const levelProgress = worldProgress.find((p) => p.level_id === level.id)
      const isUnlocked =
        index === 0 ||
        worldProgress.some((p) => p.level_id === index && p.completed)
      const stars = levelProgress?.stars || 0
      return `
      <button class="p-6 rounded-2xl text-left transition ${isUnlocked ? 'hover:scale-105 cursor-pointer' : 'opacity-50 cursor-not-allowed'}" data-world="${worldId}" data-level="${level.id}" ${isUnlocked ? '' : 'disabled'} style="background: rgba(255,255,255,0.9); color: #1a1a2e;">
        <div class="flex justify-between items-start mb-4"><div class="text-4xl">${level.collectibleIcon}</div><div class="text-2xl">${isUnlocked ? '' : '🔒'}</div></div>
        <h3 class="text-xl font-bold mb-2">Level ${level.id}: ${level.title}</h3>
        <p class="text-sm opacity-70 mb-4">${level.outcomes?.[0] || ''}</p>
        <div class="flex gap-1">${[1, 2, 3].map((i) => `<span class="text-yellow-400 ${i <= stars ? '' : 'opacity-30'}">⭐</span>`).join('')}</div>
        ${levelProgress?.badge_earned ? '<div class="mt-2">🏅 Badge Earned!</div>' : ''}
      </button>
    `
    })
    .join('')

  levelGrid.querySelectorAll('button[data-level]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const worldId = Number(btn.getAttribute('data-world'))
      const levelId = Number(btn.getAttribute('data-level'))
      startLevel(worldId, levelId)
    })
  })

  showScreen('world-screen')
}

function startLevel(worldId, levelId) {
  gameState.currentWorld = worldId
  gameState.currentLevel = levelId
  gameState.score = 500
  gameState.collectibles = 0

  const world = GAME_CONTENT.worlds.find((w) => w.id === worldId)
  const level = world.levels.find((l) => l.id === levelId)
  gameState.totalCollectibles = level.collectibles.length

  // HUD
  const hud = $id('game-hud')
  hud.innerHTML = `
    <div class="flex items-center gap-4"><button id="pause-btn" class="text-3xl">⏸️</button><span id="level-title" class="text-xl font-bold">Level ${level.id}</span></div>
    <div class="flex items-center gap-6"><div><span id="collectibles-icon">${level.collectibleIcon}</span> <span id="collectibles-count">0</span>/<span id="collectibles-total">${gameState.totalCollectibles}</span></div><div>💎 <span id="game-score">${gameState.score}</span></div></div>
  `

  $id('pause-btn').addEventListener('click', pauseGame)

  showScreen('game-screen')
  initPlatformer(world, level)
}

// ============ Simple persistence (localStorage + dataSdk fallback) ============
async function saveProgress(data) {
  // if dataSdk available, try to use it (non-blocking)
  if (window.dataSdk && window.dataSdk.create) {
    try {
      const id = `level-${data.world_id}-${data.level_id}`
      const existing = gameState.playerProgress.find(
        (p) =>
          p.type === 'level' &&
          p.world_id === data.world_id &&
          p.level_id === data.level_id,
      )
      if (existing && window.dataSdk.update) {
        const res = await window.dataSdk.update({ ...existing, ...data })
        if (!res.isOk) showToast('Could not save progress')
        return
      }
      const res = await window.dataSdk.create({ id, ...data })
      if (!res.isOk) showToast('Could not save progress')
      return
    } catch (e) {
      console.warn('dataSdk save failed, falling back to localStorage', e)
    }
  }

  // fallback: localStorage
  const idx = gameState.playerProgress.findIndex(
    (p) =>
      p.type === data.type &&
      p.world_id === data.world_id &&
      p.level_id === data.level_id,
  )
  if (idx >= 0) {
    gameState.playerProgress[idx] = {
      ...gameState.playerProgress[idx],
      ...data,
    }
  } else {
    gameState.playerProgress.push({
      id: `level-${data.world_id}-${data.level_id}`,
      ...data,
    })
  }
  try {
    localStorage.setItem(
      STORAGE_KEYS.PROGRESS,
      JSON.stringify(gameState.playerProgress),
    )
  } catch (e) {
    /* ignore */
  }
}

// ============ Platformer (canvas) ============
let gameLoop = null
let player = null
let platforms = []
let collectiblesInGame = []
let checkpoint = null
let goal = null
const keys = { left: false, right: false, jump: false, interact: false }

function initPlatformer(world, level) {
  const canvas = $id('game-canvas')
  const ctx = canvas.getContext('2d')
  const rect = canvas.parentElement.getBoundingClientRect()
  canvas.width = Math.max(800, Math.floor(rect.width))
  canvas.height = Math.max(480, Math.floor(rect.height))

  player = {
    x: 60,
    y: canvas.height - 150,
    width: 48,
    height: 64,
    vx: 0,
    vy: 0,
    grounded: false,
    facing: 1,
  }

  const platformHeight = 20
  const groundY = canvas.height - 60
  platforms = [
    { x: 0, y: groundY, width: canvas.width, height: 60, isGround: true },
    { x: 150, y: groundY - 80, width: 120, height: platformHeight },
    { x: 350, y: groundY - 150, width: 120, height: platformHeight },
    { x: 550, y: groundY - 100, width: 120, height: platformHeight },
    { x: 750, y: groundY - 180, width: 120, height: platformHeight },
    { x: 950, y: groundY - 120, width: 150, height: platformHeight },
  ]

  collectiblesInGame = level.collectibles.map((name, i) => ({
    x: 100 + i * 200 + Math.random() * 100,
    y: groundY - 120 - Math.random() * 100,
    width: 40,
    height: 40,
    name,
    icon: level.collectibleIcon,
    collected: false,
  }))

  checkpoint = {
    x: canvas.width * 0.6,
    y: groundY - 80,
    width: 60,
    height: 80,
    activated: false,
  }
  goal = { x: canvas.width - 100, y: groundY - 100, width: 60, height: 100 }

  if (gameLoop) cancelAnimationFrame(gameLoop)
  gameState.isPaused = false

  function update() {
    if (gameState.isPaused || gameState.currentScreen !== 'game-screen') {
      gameLoop = requestAnimationFrame(update)
      return
    }

    const speed = gameState.settings.slowMotion ? 3 : 6
    const gravity = gameState.settings.slowMotion ? 0.3 : 0.6
    const jumpForce = gameState.settings.slowMotion ? -10 : -14

    if (gameState.settings.oneButton) {
      player.vx = speed
      if (keys.jump && player.grounded) {
        player.vy = jumpForce
        player.grounded = false
      }
    } else {
      if (keys.left) {
        player.vx = -speed
        player.facing = -1
      } else if (keys.right) {
        player.vx = speed
        player.facing = 1
      } else {
        player.vx *= 0.8
      }
      if (keys.jump && player.grounded) {
        player.vy = jumpForce
        player.grounded = false
      }
    }

    if (gameState.settings.autoJump) {
      platforms.forEach((plat) => {
        if (
          !plat.isGround &&
          player.x + player.width > plat.x - 50 &&
          player.x < plat.x &&
          player.y > plat.y &&
          player.grounded
        ) {
          player.vy = jumpForce
          player.grounded = false
        }
      })
    }

    player.vy += gravity
    player.x += player.vx
    player.y += player.vy

    // collisions
    player.grounded = false
    platforms.forEach((plat) => {
      if (
        player.x + player.width > plat.x &&
        player.x < plat.x + plat.width &&
        player.y + player.height > plat.y &&
        player.y + player.height < plat.y + plat.height + 20 &&
        player.vy >= 0
      ) {
        player.y = plat.y - player.height
        player.vy = 0
        player.grounded = true
      }
    })

    if (player.x < 0) player.x = 0
    if (player.x + player.width > canvas.width) {
      player.x = canvas.width - player.width
    }
    if (player.y > canvas.height) {
      player.x = 60
      player.y = groundY - 150
      player.vy = 0
    }

    // collect
    collectiblesInGame.forEach((c) => {
      if (
        !c.collected &&
        player.x + player.width > c.x &&
        player.x < c.x + c.width &&
        player.y + player.height > c.y &&
        player.y < c.y + c.height
      ) {
        c.collected = true
        gameState.collectibles++
        gameState.score += 40
        $id('collectibles-count').textContent = gameState.collectibles
        $id('game-score').textContent = gameState.score
        showToast(`Got ${c.name}!`)
      }
    })

    // checkpoint
    if (
      !checkpoint.activated &&
      player.x + player.width > checkpoint.x &&
      player.x < checkpoint.x + checkpoint.width &&
      player.y + player.height > checkpoint.y
    ) {
      checkpoint.activated = true
      startMinigame()
      return
    }

    // goal
    if (
      checkpoint.activated &&
      player.x + player.width > goal.x &&
      player.x < goal.x + goal.width &&
      player.y + player.height > goal.y
    ) {
      startQuiz()
      return
    }

    render(ctx, canvas, world)
    gameLoop = requestAnimationFrame(update)
  }
  gameLoop = requestAnimationFrame(update)
}

function render(ctx, canvas, world) {
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
  gradient.addColorStop(0, '#87CEEB')
  gradient.addColorStop(0.7, '#98D8AA')
  gradient.addColorStop(1, '#4A7C59')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.font = '40px sans-serif'
  ctx.fillText('🌳', 50, canvas.height - 80)
  ctx.fillText('🌲', canvas.width - 150, canvas.height - 90)
  ctx.fillText('☁️', 100, 60)
  ctx.fillText('☁️', canvas.width - 200, 80)

  platforms.forEach((plat) => {
    if (plat.isGround) ctx.fillStyle = '#4A7C59'
    else {
      const platGrad = ctx.createLinearGradient(
        plat.x,
        plat.y,
        plat.x,
        plat.y + plat.height,
      )
      platGrad.addColorStop(0, '#8B7355')
      platGrad.addColorStop(1, '#5C4033')
      ctx.fillStyle = platGrad
    }
    ctx.beginPath()
    roundRect(
      ctx,
      plat.x,
      plat.y,
      plat.width,
      plat.height,
      plat.isGround ? 0 : 8,
    )
    ctx.fill()
  })

  ctx.font = '32px sans-serif'
  collectiblesInGame.forEach((c) => {
    if (!c.collected) {
      const bounce = Math.sin(Date.now() / 300 + c.x) * 5
      ctx.fillText(c.icon, c.x, c.y + bounce)
    }
  })

  ctx.font = '48px sans-serif'
  if (!checkpoint.activated) ctx.fillText('🚩', checkpoint.x, checkpoint.y + 60)
  else ctx.fillText('✅', checkpoint.x, checkpoint.y + 60)
  ctx.font = '60px sans-serif'
  ctx.fillText('🏁', goal.x, goal.y + 80)
  drawPlayer(ctx)
}

function drawPlayer(ctx) {
  ctx.save()
  ctx.translate(player.x + player.width / 2, player.y)
  ctx.scale(player.facing, 1)
  ctx.font = '48px sans-serif'
  ctx.fillText('🧑', -24, 48)
  ctx.restore()
}

function roundRect(ctx, x, y, w, h, r) {
  const radius = r || 0
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + w - radius, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius)
  ctx.lineTo(x + w, y + h - radius)
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h)
  ctx.lineTo(x + radius, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
}

// ============ Mini-games / Quiz / Results ============
function startMinigame() {
  const world = GAME_CONTENT.worlds.find((w) => w.id === gameState.currentWorld)
  const level = world.levels.find((l) => l.id === gameState.currentLevel)
  const mg = level.minigame
  const container = $id('minigame-content')
  let html = `<div class="max-w-2xl w-full text-center"><div class="text-6xl mb-4">🎯</div><h2 class="text-3xl font-bold mb-2">${mg.title}</h2><p class="text-xl opacity-80">${mg.instruction}</p>`

  // simple renderers for common types
  switch (mg.type) {
    case 'checklist':
      html += renderChecklistGame(mg)
      break
    case 'sorting':
      html += renderSortingGame(mg)
      break
    case 'matching':
      html += renderMatchingGame(mg)
      break
    case 'builder':
      html += renderBuilderGame(mg)
      break
    case 'spotting':
      html += renderSpottingGame(mg)
      break
    case 'showcase':
      html += renderShowcaseGame(mg)
      break
    default:
      html += '<p>Activity</p>'
  }

  html +=
    '<div class="text-center mt-8"><button id="complete-mg" class="btn-game">✅ Done!</button></div></div>'
  container.innerHTML = html

  // wire minigame interactions (sorting, spotting, builder)
  // sorting: move item to safe/unsafe zone
  container
    .querySelectorAll('#sorting-items button[data-safe]')
    .forEach((btn) => {
      btn.addEventListener('click', () =>
        sortItem(btn, btn.getAttribute('data-safe') === 'true'),
      )
    })

  // spotting: mark scams
  container
    .querySelectorAll('#spotting-items button[data-scam]')
    .forEach((btn) => {
      btn.addEventListener('click', () =>
        spotItem(btn, btn.getAttribute('data-scam') === 'true'),
      )
    })

  // builder: word/number buttons
  container
    .querySelectorAll('#word-buttons button[data-word]')
    .forEach((btn) => {
      btn.addEventListener('click', () =>
        addWord(btn.getAttribute('data-word')),
      )
    })
  container.querySelectorAll('button[data-num]').forEach((btn) => {
    btn.addEventListener('click', () => addNumber(btn.getAttribute('data-num')))
  })

  showScreen('minigame-screen')
  $id('complete-mg').addEventListener('click', () => {
    gameState.score += 200
    $id('game-score') && ($id('game-score').textContent = gameState.score)
    showToast('Great job! +200 points')
    showScreen('game-screen')
  })
}

function renderChecklistGame(mg) {
  return `<div class="space-y-4" id="checklist-items">${mg.items.map((item, i) => `<label class="flex items-center gap-4 p-4 rounded-xl" style="background:rgba(255,255,255,0.9);color:#1a1a2e;"><input class="w-8 h-8 checklist-item" type="checkbox" data-index="${i}"><span class="text-xl font-semibold">${item}</span></label>`).join('')}</div>`
}
function renderSortingGame(mg) {
  const shuffled = [...mg.items].sort(() => Math.random() - 0.5)
  return `<div class="grid grid-cols-1 md:grid-cols-2 gap-8"><div class="p-4 rounded-xl" style="background:rgba(0,200,100,0.08);border:3px dashed #4CAF50;"><h3 class="text-xl font-bold mb-4 text-center" style="color:#2E7D32;">✅ SAFE</h3><div id="safe-zone" class="min-h-40 space-y-2"></div></div><div class="p-4 rounded-xl" style="background:rgba(255,100,100,0.08);border:3px dashed #F44336;"><h3 class="text-xl font-bold mb-4 text-center" style="color:#C62828;">⚠️ UNSAFE</h3><div id="unsafe-zone" class="min-h-40 space-y-2"></div></div></div><div class="mt-8 space-y-3" id="sorting-items">${shuffled.map((item, i) => `<button onclick="" data-safe="${item.safe}" class="w-full p-4 rounded-xl text-left font-semibold" style="background:rgba(255,255,255,0.9);color:#1a1a2e;">${item.text}</button>`).join('')}</div>`
}
function renderMatchingGame(mg) {
  return `<div class="grid grid-cols-1 md:grid-cols-2 gap-4" id="matching-items">${mg.pairs.map((pair) => `<div class="p-4 rounded-xl" style="background:rgba(255,255,255,0.9);color:#1a1a2e;"><div class="text-2xl mb-2">${pair.item}</div><div class="text-lg opacity-70">${pair.match}</div></div>`).join('')}</div>`
}
function renderBuilderGame(mg) {
  return `<div class="text-center mb-6"><div id="password-display" class="text-3xl font-mono p-4 rounded-xl mb-4" style="background:rgba(255,255,255,0.9);color:#1a1a2e;">Tap words below...</div></div><div class="mb-4"><h4 class="font-bold mb-2">Pick 3 Words:</h4><div class="flex flex-wrap gap-2" id="word-buttons">${mg.words.map((word) => `<button onclick="" data-word="${word}" class="px-4 py-2 rounded-lg font-semibold" style="background:rgba(255,255,255,0.9);color:#1a1a2e;">${word}</button>`).join('')}</div></div><div><h4 class="font-bold mb-2">Add a Number:</h4><div class="flex flex-wrap gap-2">${mg.numbers.map((num) => `<button onclick="" data-num="${num}" class="w-12 h-12 rounded-lg font-bold text-xl" style="background:rgba(255,255,255,0.9);color:#1a1a2e;">${num}</button>`).join('')}</div></div>`
}
function renderSpottingGame(mg) {
  return `<div class="space-y-4" id="spotting-items">${mg.items.map((item) => `<button class="w-full p-4 rounded-xl text-left font-semibold" data-scam="${item.isScam}">📧 ${item.text}</button>`).join('')}</div><p class="text-center mt-4 opacity-70">Tap the messages that look like scams!</p>`
}
function renderShowcaseGame(mg) {
  return `<div class="space-y-6" id="showcase-items">${mg.challenges.map((ch, i) => `<div class="p-4 rounded-xl" style="background:rgba(255,255,255,0.9);color:#1a1a2e;"><label class="block font-bold mb-2">${i + 1}. ${ch.task}</label><textarea id="showcase-${i}" rows="2" class="w-full p-3 rounded-lg border-2 border-gray-300 focus:border-pink-500 outline-none resize-none" placeholder="Type your answer..."></textarea></div>`).join('')}</div>`
}

// ---------- minigame helpers (sorting / spotting / builder) ----------
function sortItem(button, isSafe) {
  const zone = isSafe
    ? document.getElementById('safe-zone')
    : document.getElementById('unsafe-zone')
  if (!zone) return
  button.style.background = isSafe ? '#C8E6C9' : '#FFCDD2'
  zone.appendChild(button)
  button.onclick = null
}

function spotItem(button, isScam) {
  if (isScam) {
    button.style.background = '#FFCDD2'
    button.innerHTML =
      '🚨 ' +
      button.textContent +
      ' <span class="text-red-600 font-bold">SCAM!</span>'
    gameState.score += 20
  } else {
    button.style.background = '#C8E6C9'
    button.innerHTML = '✅ ' + button.textContent
  }
  button.onclick = null
  document.getElementById('game-score') &&
    (document.getElementById('game-score').textContent = gameState.score)
}

const passwordParts = []
function addWord(word) {
  if (passwordParts.filter((p) => isNaN(p)).length < 3) {
    passwordParts.push(word)
    updatePasswordDisplay()
  }
}
function addNumber(num) {
  if (!passwordParts.some((p) => !isNaN(p))) {
    passwordParts.push(num)
    updatePasswordDisplay()
  }
}
function updatePasswordDisplay() {
  const display = document.getElementById('password-display')
  if (display) {
    display.textContent =
      passwordParts.length > 0 ? passwordParts.join('-') : 'Tap words below...'
  }
}

function startQuiz() {
  const world = GAME_CONTENT.worlds.find((w) => w.id === gameState.currentWorld)
  const level = world.levels.find((l) => l.id === gameState.currentLevel)
  const quiz = level.quiz || []
  const state = { currentQuestion: 0, correct: 0 }

  function renderQuestion() {
    const q = quiz[state.currentQuestion]
    $id('quiz-content').innerHTML = `
      <div class="max-w-xl w-full text-center">
        <div class="mb-8"><div class="text-6xl mb-4">❓</div><div class="text-sm opacity-70 mb-2">Question ${state.currentQuestion + 1} of ${quiz.length}</div><h2 class="text-2xl font-bold">${q.question}</h2></div>
        <div class="space-y-4">${q.options.map((opt, i) => `<button class="w-full p-4 rounded-xl text-xl font-semibold" data-idx="${i}">${opt}</button>`).join('')}</div>
      </div>`

    $id('quiz-content')
      .querySelectorAll('button[data-idx]')
      .forEach((btn) => {
        btn.addEventListener('click', () => {
          const selected = Number(btn.getAttribute('data-idx'))
          if (selected === q.correct) {
            state.correct++
            gameState.score += 50
            showToast('Correct! ✅')
          } else {
            showToast('Not quite, but good try!')
          }
          state.currentQuestion++
          if (state.currentQuestion < quiz.length) {
            setTimeout(renderQuestion, 800)
          } else setTimeout(() => showResults(state.correct, quiz.length), 800)
        })
      })
    showScreen('quiz-screen')
  }

  renderQuestion()
}

function showResults(correctAnswers = 0, total = 0) {
  const world = GAME_CONTENT.worlds.find((w) => w.id === gameState.currentWorld)
  const level = world.levels.find((l) => l.id === gameState.currentLevel)

  let stars = 0
  if (gameState.score >= 500) stars = 1
  if (gameState.score >= 700) stars = 2
  if (gameState.score >= 900) stars = 3

  $id('results-content').innerHTML = `
    <div class="max-w-xl w-full text-center">
      <div class="text-8xl mb-6">🎉</div>
      <h2 class="text-4xl font-bold mb-4">Level Complete!</h2>
      <h3 class="text-2xl mb-8">${level.title}</h3>
      <div class="flex justify-center gap-4 mb-8">${[1, 2, 3].map((i) => `<span class="text-6xl ${i <= stars ? '' : 'opacity-30'}">${i <= stars ? '⭐' : '☆'}</span>`).join('')}</div>
      <div class="grid grid-cols-2 gap-4 mb-8"><div class="p-4 rounded-xl" style="background:rgba(255,255,255,0.1);"><div class="text-3xl mb-2">${gameState.collectibles}/${gameState.totalCollectibles}</div><div class="opacity-70">Collectibles</div></div><div class="p-4 rounded-xl" style="background:rgba(255,255,255,0.1);"><div class="text-3xl mb-2">💎 ${gameState.score}</div><div class="opacity-70">Total Score</div></div></div>
      <div class="mb-8">${stars >= 1 ? `<div class="p-4 rounded-xl mb-4" style="background:rgba(255,200,0,0.2);border:2px solid #FFD700;"><div class="text-4xl mb-2">🏅</div><div class="font-bold">Badge Earned!</div><div class="opacity-80">${level.title} Master</div></div>` : ''}
        <h4 class="font-bold mb-2">📝 Add to Portfolio:</h4>
        <p class="opacity-70 mb-2">${level.portfolio}</p>
        <textarea id="portfolio-input" class="w-full p-4 rounded-xl border-2 border-white/30 bg-white/10 focus:border-pink-500 outline-none resize-none" rows="3" placeholder="Write something you learned..."></textarea>
      </div>
      <div class="flex flex-col gap-4"><button id="save-continue" class="btn-game text-xl">✅ Save & Continue</button><button id="try-again" class="btn-game bg-gradient-to-b from-yellow-500 to-yellow-700" style="box-shadow:0 4px 0 #8b6914;">🔄 Try Again</button></div>
    </div>
  `
  $id('save-continue').addEventListener('click', () => saveAndContinue(stars))
  $id('try-again').addEventListener('click', restartLevel)
  showScreen('results-screen')
}

async function saveAndContinue(stars) {
  const portfolioText = $id('portfolio-input')?.value || ''
  await saveProgress({
    type: 'level',
    world_id: gameState.currentWorld,
    level_id: gameState.currentLevel,
    stars,
    score: gameState.score,
    completed: true,
    badge_earned: stars >= 1,
    portfolio_text: portfolioText,
  })
  showToast('Progress saved!')
  enterWorld(gameState.currentWorld)
}

// ============ Controls & settings ============
function pauseGame() {
  gameState.isPaused = true
  $id('pause-modal') && $id('pause-modal').classList.remove('hidden')
}
function resumeGame() {
  gameState.isPaused = false
  $id('pause-modal') && $id('pause-modal').classList.add('hidden')
}
function restartLevel() {
  $id('pause-modal') && $id('pause-modal').classList.add('hidden')
  startLevel(gameState.currentWorld, gameState.currentLevel)
}
function exitToHub() {
  $id('pause-modal') && $id('pause-modal').classList.add('hidden')
  if (gameLoop) cancelAnimationFrame(gameLoop)
  showScreen('hub-screen')
}

function applySettings() {
  document.body.classList.toggle('high-contrast', gameState.settings.contrast)
  document.body.classList.toggle('large-text', gameState.settings.largeText)
  document.body.classList.toggle('dyslexic-font', gameState.settings.dyslexic)
  document.body.classList.toggle(
    'reduce-motion',
    gameState.settings.reduceMotion,
  )
}
function saveSettings() {
  try {
    localStorage.setItem(
      STORAGE_KEYS.SETTINGS,
      JSON.stringify(gameState.settings),
    )
  } catch (e) {}
}
function loadSettings() {
  try {
    const s = localStorage.getItem(STORAGE_KEYS.SETTINGS)
    if (s) gameState.settings = { ...gameState.settings, ...JSON.parse(s) }
  } catch (e) {}
  applySettings()
}

// ============ Progress UI ============
function showProgress() {
  renderProgressModal()
  $id('progress-modal').classList.remove('hidden')
}
function hideProgress() {
  $id('progress-modal').classList.add('hidden')
}

function renderProgressModal() {
  const content = $id('progress-modal')
  const stats = calculateStats()
  content.innerHTML = `
    <div class="modal-overlay absolute inset-0" onclick=""></div>
    <div class="absolute inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl rounded-3xl p-6 md:p-8 overflow-auto" style="background:var(--color-surface); max-height:90%;">
      <div class="flex justify-between items-center mb-6"><h2 class="text-2xl font-bold">📊 My Progress</h2><button id="close-progress" class="text-3xl">✕</button></div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div class="p-4 rounded-xl text-center" style="background: rgba(255,255,255,0.1);"><div class="text-4xl mb-2">⭐</div><div class="text-2xl font-bold">${stats.totalStars}</div><div class="opacity-70">Stars Earned</div></div>
        <div class="p-4 rounded-xl text-center" style="background: rgba(255,255,255,0.1);"><div class="text-4xl mb-2">🏅</div><div class="text-2xl font-bold">${stats.totalBadges}</div><div class="opacity-70">Badges</div></div>
        <div class="p-4 rounded-xl text-center" style="background: rgba(255,255,255,0.1);"><div class="text-4xl mb-2">💎</div><div class="text-2xl font-bold">${stats.totalPoints}</div><div class="opacity-70">Points</div></div>
        <div class="p-4 rounded-xl text-center" style="background: rgba(255,255,255,0.1);"><div class="text-4xl mb-2">📚</div><div class="text-2xl font-bold">${stats.completedLevels}/24</div><div class="opacity-70">Levels Done</div></div>
      </div>
      <h3 class="text-xl font-bold mb-4">📝 My Portfolio</h3>
      <div class="space-y-3 max-h-64 overflow-auto">${
        gameState.playerProgress
          .filter((p) => p.type === 'level' && p.portfolio_text)
          .map(
            (p) =>
              `<div class="p-4 rounded-xl" style="background: rgba(255,255,255,0.1);"><div class="font-bold mb-1">World ${p.world_id}, Level ${p.level_id}</div><p class="opacity-80">${p.portfolio_text}</p></div>`,
          )
          .join('') ||
        '<p class="opacity-60">Complete levels to build your portfolio!</p>'
      }</div>
      <div class="flex gap-4 mt-8"><button id="export-portfolio" class="btn-game flex-1 bg-gradient-to-b from-green-500 to-green-700">📁 Export Portfolio</button><button id="close-progress-2" class="btn-game flex-1">✅ Close</button></div>
    </div>
  `
  content
    .querySelector('#close-progress')
    .addEventListener('click', hideProgress)
  content
    .querySelector('#close-progress-2')
    .addEventListener('click', hideProgress)
  content
    .querySelector('#export-portfolio')
    .addEventListener('click', exportPortfolio)
}

function calculateStats() {
  const levelProgress = gameState.playerProgress.filter(
    (p) => p.type === 'level',
  )
  return {
    totalStars: levelProgress.reduce((s, p) => s + (p.stars || 0), 0),
    totalBadges: levelProgress.filter((p) => p.badge_earned).length,
    totalPoints: levelProgress.reduce((s, p) => s + (p.score || 0), 0),
    completedLevels: levelProgress.filter((p) => p.completed).length,
  }
}

function updateProgressUI() {
  const stats = calculateStats()
  $id('total-stars') && ($id('total-stars').textContent = stats.totalStars)
  $id('total-badges') && ($id('total-badges').textContent = stats.totalBadges)
  $id('total-points') && ($id('total-points').textContent = stats.totalPoints)

  GAME_CONTENT.worlds.forEach((world) => {
    const worldProgress = gameState.playerProgress.filter(
      (p) => p.type === 'level' && p.world_id === world.id,
    )
    const completedInWorld = worldProgress.filter((p) => p.completed).length
    const progressEl = $id(`world-${world.id}-progress`)
    if (progressEl) {
      progressEl.style.width = `${(completedInWorld / world.levels.length) * 100}%`
    }
  })
}

function exportPortfolio() {
  const stats = calculateStats()
  const portfolioItems = gameState.playerProgress.filter(
    (p) => p.type === 'level' && p.portfolio_text,
  )
  let content = `SMART LEARNING FOR INDEPENDENCE - PORTFOLIO\n${'='.repeat(50)}\n\n`
  content += `Total Stars: ${stats.totalStars}\nTotal Badges: ${stats.totalBadges}\nTotal Points: ${stats.totalPoints}\nLevels Completed: ${stats.completedLevels}/24\n\nPORTFOLIO ENTRIES\n${'-'.repeat(30)}\n\n`
  portfolioItems.forEach((p) => {
    const world = GAME_CONTENT.worlds.find((w) => w.id === p.world_id)
    const level = world?.levels.find((l) => l.id === p.level_id)
    content += `${world?.name || 'Unknown'} - ${level?.title || 'Unknown'}\n${p.portfolio_text}\n\n`
  })
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'SLI_Portfolio.txt'
  a.click()
  URL.revokeObjectURL(url)
  showToast('Portfolio exported!')
}

// ============ Controls (keyboard / touch) ============
function setupKeyboardControls() {
  document.addEventListener('keydown', (e) => {
    if (gameState.currentScreen !== 'game-screen') return
    switch (e.key) {
      case 'ArrowLeft':
      case 'a':
        keys.left = true
        break
      case 'ArrowRight':
      case 'd':
        keys.right = true
        break
      case 'ArrowUp':
      case 'w':
      case ' ':
        keys.jump = true
        e.preventDefault()
        break
      case 'Enter':
        keys.interact = true
        break
      case 'Escape':
        pauseGame()
        break
    }
  })
  document.addEventListener('keyup', (e) => {
    switch (e.key) {
      case 'ArrowLeft':
      case 'a':
        keys.left = false
        break
      case 'ArrowRight':
      case 'd':
        keys.right = false
        break
      case 'ArrowUp':
      case 'w':
      case ' ':
        keys.jump = false
        break
      case 'Enter':
        keys.interact = false
        break
    }
  })
}

function setupTouchControls() {
  const btnLeft = $id('btn-left')
  const btnRight = $id('btn-right')
  const btnJump = $id('btn-jump')
  const btnInteract = $id('btn-interact')
  const touchStart = (k) => (e) => {
    e.preventDefault()
    keys[k] = true
  }
  const touchEnd = (k) => (e) => {
    e.preventDefault()
    keys[k] = false
  }
  if (btnLeft) {
    btnLeft.addEventListener('touchstart', touchStart('left'))
    btnLeft.addEventListener('touchend', touchEnd('left'))
    btnLeft.addEventListener('mousedown', touchStart('left'))
    btnLeft.addEventListener('mouseup', touchEnd('left'))
  }
  if (btnRight) {
    btnRight.addEventListener('touchstart', touchStart('right'))
    btnRight.addEventListener('touchend', touchEnd('right'))
    btnRight.addEventListener('mousedown', touchStart('right'))
    btnRight.addEventListener('mouseup', touchEnd('right'))
  }
  if (btnJump) {
    btnJump.addEventListener('touchstart', touchStart('jump'))
    btnJump.addEventListener('touchend', touchEnd('jump'))
    btnJump.addEventListener('mousedown', touchStart('jump'))
    btnJump.addEventListener('mouseup', touchEnd('jump'))
  }
  if (btnInteract) {
    btnInteract.addEventListener('touchstart', touchStart('interact'))
    btnInteract.addEventListener('touchend', touchEnd('interact'))
    btnInteract.addEventListener('mousedown', touchStart('interact'))
    btnInteract.addEventListener('mouseup', touchEnd('interact'))
  }
}

// ============ Help / TTS / Toasts ============
function showHelp() {
  const helpText = getContextualHelp()
  const panel = $id('help-panel')
  panel.innerHTML = `
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-xl font-bold">🦉 <span id="owl-name">Ollie</span> says:</h3>
      <button id="close-help" class="text-2xl hover:scale-110" aria-label="Close help">✕</button>
    </div>
    <p id="help-text" class="text-lg mb-4">${helpText}</p>
    <div class="flex flex-wrap gap-2">
      <button id="help-read" class="px-4 py-2 rounded-lg font-semibold" style="background: rgba(255,255,255,0.2);">🔊 Read Aloud</button>
      <button id="help-settings" class="px-4 py-2 rounded-lg font-semibold" style="background: rgba(255,255,255,0.2);">⚙️ Settings</button>
    </div>
  `
  panel.classList.remove('hidden')
  $id('close-help')?.addEventListener('click', hideHelp)
  $id('help-read')?.addEventListener('click', () => readAloud(helpText))
  $id('help-settings')?.addEventListener('click', showSettings)
  if (gameState.settings.tts) readAloud(helpText)
}
function hideHelp() {
  $id('help-panel').classList.add('hidden')
}
function getContextualHelp() {
  switch (gameState.currentScreen) {
    case 'main-menu':
      return "G'day! Tap 'Start Adventure' to begin learning."
    case 'hub-screen':
      return 'This is Town Square! Each gate leads to a different world.'
    case 'world-screen':
      return 'Choose a level to play.'
    case 'game-screen':
      return 'Use arrows to move, space to jump. Collect items and reach the flag!'
    case 'minigame-screen':
      return 'Complete this activity to show what you learned.'
    case 'quiz-screen':
      return 'Answer the questions — it is fine to try.'
    default:
      return "I'm here to help!"
  }
}
function readAloud(text) {
  if ('speechSynthesis' in window) {
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'en-AU'
    u.rate = 0.9
    speechSynthesis.speak(u)
  }
}

// ============ Utilities ============
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
function showToast(message) {
  const container = $id('toast-container')
  const t = document.createElement('div')
  t.className = 'toast'
  t.textContent = message
  container.appendChild(t)
  setTimeout(() => t.remove(), 3000)
}

// ============ Start ============
document.addEventListener('DOMContentLoaded', () => {
  // wire help owl
  $id('help-owl').addEventListener('click', () => {
    showHelp()
  })

  // pause modal buttons
  $id('resume-btn')?.addEventListener('click', () => resumeGame())
  $id('restart-btn')?.addEventListener('click', () => restartLevel())
  $id('exit-btn')?.addEventListener('click', () => exitToHub())

  // quick bindings for modals inside this page
  $id('settings-modal').innerHTML = ''
  $id('progress-modal').innerHTML = ''
  $id('help-panel').innerHTML = ''

  initialize()
})

export { initialize }
