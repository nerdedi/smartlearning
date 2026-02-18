// attendance.js - Digital attendance log for Smart Learning
const ATTENDANCE_KEY = 'attendance-log';

export function getAttendance() {
  return JSON.parse(localStorage.getItem(ATTENDANCE_KEY) || '[]');
}

export function addAttendance(date, participant, present, notes) {
  const log = getAttendance();
  log.push({ date, participant, present, notes });
  localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(log));
}

export function renderAttendanceForm(container) {
  container.innerHTML = `
    <h2>Attendance Log</h2>
    <form id="attendance-form">
      <label>Date: <input type="date" name="date" required></label>
      <label>Participant: <input type="text" name="participant" required></label>
      <label>Present: <select name="present"><option>Yes</option><option>No</option></select></label>
      <label>Notes: <input type="text" name="notes"></label>
      <button type="submit">Add Entry</button>
    </form>
    <table id="attendance-table"><thead><tr><th>Date</th><th>Participant</th><th>Present</th><th>Notes</th></tr></thead><tbody></tbody></table>
  `;
  const form = container.querySelector('#attendance-form');
  const tableBody = container.querySelector('#attendance-table tbody');
  function renderTable() {
    const log = getAttendance();
    tableBody.innerHTML = log.map(e => `<tr><td>${e.date}</td><td>${e.participant}</td><td>${e.present}</td><td>${e.notes||''}</td></tr>`).join('');
  }
  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    addAttendance(data.get('date'), data.get('participant'), data.get('present'), data.get('notes'));
    form.reset();
    renderTable();
  });
  renderTable();
}
