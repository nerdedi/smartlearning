// volunteer.js - Volunteer roster and induction log for Smart Learning
const VOLUNTEER_KEY = 'volunteer-log'

export function getVolunteers () {
  return JSON.parse(localStorage.getItem(VOLUNTEER_KEY) || '[]')
}

export function addVolunteer (name, date, role, inducted, notes) {
  const log = getVolunteers()
  log.push({ name, date, role, inducted, notes })
  localStorage.setItem(VOLUNTEER_KEY, JSON.stringify(log))
}

export function renderVolunteerForm (container) {
  container.innerHTML = `
    <h2>Volunteer Roster & Induction</h2>
    <form id="volunteer-form">
      <label>Name: <input type="text" name="name" required></label>
      <label>Date: <input type="date" name="date" required></label>
      <label>Role: <input type="text" name="role" placeholder="e.g. Tech buddy" required></label>
      <label>Inducted: <select name="inducted"><option>Yes</option><option>No</option></select></label>
      <label>Notes: <input type="text" name="notes"></label>
      <button type="submit">Add Entry</button>
    </form>
    <table id="volunteer-table"><thead><tr><th>Name</th><th>Date</th><th>Role</th><th>Inducted</th><th>Notes</th></tr></thead><tbody></tbody></table>
  `
  const form = container.querySelector('#volunteer-form')
  const tableBody = container.querySelector('#volunteer-table tbody')
  function renderTable () {
    const log = getVolunteers()
    tableBody.innerHTML = log.map(e => `<tr><td>${e.name}</td><td>${e.date}</td><td>${e.role}</td><td>${e.inducted}</td><td>${e.notes || ''}</td></tr>`).join('')
  }
  form.addEventListener('submit', e => {
    e.preventDefault()
    const data = new FormData(form)
    addVolunteer(data.get('name'), data.get('date'), data.get('role'), data.get('inducted'), data.get('notes'))
    form.reset()
    renderTable()
  })
  renderTable()
}
