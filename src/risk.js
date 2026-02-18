// risk.js - Risk assessment log for Smart Learning
const RISK_KEY = 'risk-log';

export function getRisks() {
  return JSON.parse(localStorage.getItem(RISK_KEY) || '[]');
}

export function addRisk(date, description, mitigation, status, notes) {
  const log = getRisks();
  log.push({ date, description, mitigation, status, notes });
  localStorage.setItem(RISK_KEY, JSON.stringify(log));
}

export function renderRiskForm(container) {
  container.innerHTML = `
    <h2>Risk Assessment Log</h2>
    <form id="risk-form">
      <label>Date: <input type="date" name="date" required></label>
      <label>Description: <input type="text" name="description" required></label>
      <label>Mitigation: <input type="text" name="mitigation" required></label>
      <label>Status: <select name="status"><option>Open</option><option>Mitigated</option><option>Closed</option></select></label>
      <label>Notes: <input type="text" name="notes"></label>
      <button type="submit">Add Entry</button>
    </form>
    <table id="risk-table"><thead><tr><th>Date</th><th>Description</th><th>Mitigation</th><th>Status</th><th>Notes</th></tr></thead><tbody></tbody></table>
  `;
  const form = container.querySelector('#risk-form');
  const tableBody = container.querySelector('#risk-table tbody');
  function renderTable() {
    const log = getRisks();
    tableBody.innerHTML = log.map(e => `<tr><td>${e.date}</td><td>${e.description}</td><td>${e.mitigation}</td><td>${e.status}</td><td>${e.notes||''}</td></tr>`).join('');
  }
  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    addRisk(data.get('date'), data.get('description'), data.get('mitigation'), data.get('status'), data.get('notes'));
    form.reset();
    renderTable();
  });
  renderTable();
}
