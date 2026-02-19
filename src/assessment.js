// assessment.js - Digital assessment log for Smart Learning
const ASSESSMENT_KEY = 'assessment-log'

export function getAssessments () {
  return JSON.parse(localStorage.getItem(ASSESSMENT_KEY) || '[]')
}

export function addAssessment (module, date, participant, criteria, comments, evidence) {
  const log = getAssessments()
  log.push({ module, date, participant, criteria, comments, evidence })
  localStorage.setItem(ASSESSMENT_KEY, JSON.stringify(log))
}

export function renderAssessmentForm (container) {
  container.innerHTML = `
    <h2>Assessment Log</h2>
    <form id="assessment-form">
      <label>Module: <input type="text" name="module" required></label>
      <label>Date: <input type="date" name="date" required></label>
      <label>Participant: <input type="text" name="participant" required></label>
      <label>Criteria: <input type="text" name="criteria" placeholder="e.g. Skill demonstrated" required></label>
      <label>Comments: <input type="text" name="comments"></label>
      <label>Evidence: <input type="text" name="evidence" placeholder="photo/video ref"></label>
      <button type="submit">Add Entry</button>
    </form>
    <table id="assessment-table"><thead><tr><th>Module</th><th>Date</th><th>Participant</th><th>Criteria</th><th>Comments</th><th>Evidence</th></tr></thead><tbody></tbody></table>
  `
  const form = container.querySelector('#assessment-form')
  const tableBody = container.querySelector('#assessment-table tbody')
  function renderTable () {
    const log = getAssessments()
    tableBody.innerHTML = log.map(e => `<tr><td>${e.module}</td><td>${e.date}</td><td>${e.participant}</td><td>${e.criteria}</td><td>${e.comments || ''}</td><td>${e.evidence || ''}</td></tr>`).join('')
  }
  form.addEventListener('submit', e => {
    e.preventDefault()
    const data = new FormData(form)
    addAssessment(data.get('module'), data.get('date'), data.get('participant'), data.get('criteria'), data.get('comments'), data.get('evidence'))
    form.reset()
    renderTable()
  })
  renderTable()
}
