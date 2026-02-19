// showcase.js - Showcase event planner for Smart Learning
const SHOWCASE_KEY = 'showcase-log'

export function getShowcaseEvents () {
  return JSON.parse(localStorage.getItem(SHOWCASE_KEY) || '[]')
}

export function addShowcaseEvent (date, activity, participants, notes) {
  const log = getShowcaseEvents()
  log.push({ date, activity, participants, notes })
  localStorage.setItem(SHOWCASE_KEY, JSON.stringify(log))
}

export function renderShowcaseForm (container) {
  container.innerHTML = `
    <h2>Showcase Event Planner</h2>
    <form id="showcase-form">
      <label>Date: <input type="date" name="date" required></label>
      <label>Activity: <input type="text" name="activity" required></label>
      <label>Participants: <input type="text" name="participants" placeholder="e.g. Families, Volunteers"></label>
      <label>Notes: <input type="text" name="notes"></label>
      <button type="submit">Add Entry</button>
    </form>
    <table id="showcase-table"><thead><tr><th>Date</th><th>Activity</th><th>Participants</th><th>Notes</th></tr></thead><tbody></tbody></table>
  `
  const form = container.querySelector('#showcase-form')
  const tableBody = container.querySelector('#showcase-table tbody')
  function renderTable () {
    const log = getShowcaseEvents()
    tableBody.innerHTML = log.map(e => `<tr><td>${e.date}</td><td>${e.activity}</td><td>${e.participants || ''}</td><td>${e.notes || ''}</td></tr>`).join('')
  }
  form.addEventListener('submit', e => {
    e.preventDefault()
    const data = new FormData(form)
    addShowcaseEvent(data.get('date'), data.get('activity'), data.get('participants'), data.get('notes'))
    form.reset()
    renderTable()
  })
  renderTable()
}
