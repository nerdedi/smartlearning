// reporting.js - Simple reporting dashboard for Smart Learning
import { getAssessments } from './assessment.js';
import { getAttendance } from './attendance.js';

export function renderReporting(container) {
  const attendance = getAttendance();
  const assessments = getAssessments();
  container.innerHTML = `
    <h2>Reporting Dashboard</h2>
    <p><strong>Total Attendance Entries:</strong> ${attendance.length}</p>
    <p><strong>Total Assessment Entries:</strong> ${assessments.length}</p>
    <h3>Recent Attendance</h3>
    <ul>${attendance.slice(-5).map(e => `<li>${e.date}: ${e.participant} (${e.present})</li>`).join('')}</ul>
    <h3>Recent Assessments</h3>
    <ul>${assessments.slice(-5).map(e => `<li>${e.date}: ${e.participant} (${e.module})</li>`).join('')}</ul>
  `;
}
