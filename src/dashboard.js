import { modules } from './modules-data.js'

// Render the curriculum dashboard
export function renderDashboard (container) {
  container.innerHTML = `
    <h2>Curriculum Dashboard</h2>
    <div class="modules-list">
      ${modules.map(module => `
        <div class="module-card">
          <h3>${module.id}. ${module.title}</h3>
          <p><strong>Strand:</strong> ${module.strand}</p>
          <ul>
            <li><strong>Outcomes:</strong> ${module.outcomes.join('; ')}</li>
            <li><strong>Activities:</strong> ${module.activities.join('; ')}</li>
            <li><strong>Adjustments:</strong> ${module.adjustments.join('; ')}</li>
            <li><strong>Assessment:</strong> ${module.assessment}</li>
            <li><strong>Portfolio:</strong> ${module.portfolio}</li>
          </ul>
          <button class="mark-complete" data-id="${module.id}">Mark Complete</button>
        </div>
      `).join('')}
    </div>
  `

  // Add event listeners for completion
  container.querySelectorAll('.mark-complete').forEach(btn => {
    btn.addEventListener('click', e => {
      btn.textContent = 'Completed!'
      btn.disabled = true
      btn.classList.add('completed')
    })
  })
}
