import { add } from './lib.js'

// UI wiring (module-safe)
const btn = document.getElementById('actionBtn')
const out = document.getElementById('result')
if (btn && out) {
  btn.addEventListener('click', () => {
    const value = add(2, 3)
    out.textContent = `2 + 3 = ${value}`
  })
}

// Expose for QUnit (without polluting global in prod)
if (typeof window !== 'undefined') {
  window.__app__ = { add }
}
