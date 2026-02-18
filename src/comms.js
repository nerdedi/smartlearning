// comms.js - Comms log and newsletter/social post generator for Smart Learning
const COMMS_KEY = 'comms-log';

export function getComms() {
  return JSON.parse(localStorage.getItem(COMMS_KEY) || '[]');
}

export function addComms(date, type, summary, highlights, notes) {
  const log = getComms();
  log.push({ date, type, summary, highlights, notes });
  localStorage.setItem(COMMS_KEY, JSON.stringify(log));
}

export function renderCommsForm(container) {
  container.innerHTML = `
    <h2>Comms Log & Post Generator</h2>
    <form id="comms-form">
      <label>Date: <input type="date" name="date" required></label>
      <label>Type: <select name="type"><option>Newsletter</option><option>Social Post</option><option>Showcase Highlight</option></select></label>
      <label>Summary: <input type="text" name="summary" required></label>
      <label>Highlights: <input type="text" name="highlights" placeholder="e.g. Quotes, achievements"></label>
      <label>Notes: <input type="text" name="notes"></label>
      <button type="submit">Add Entry</button>
    </form>
    <table id="comms-table"><thead><tr><th>Date</th><th>Type</th><th>Summary</th><th>Highlights</th><th>Notes</th></tr></thead><tbody></tbody></table>
    <h3>Quick Post Generator</h3>
    <form id="postgen-form">
      <label>Type: <select name="type"><option>Newsletter</option><option>Social Post</option><option>Showcase Highlight</option></select></label>
      <label>Key Message: <input type="text" name="message" required></label>
      <button type="submit">Generate</button>
    </form>
    <div id="postgen-output"></div>
  `;
  const form = container.querySelector('#comms-form');
  const tableBody = container.querySelector('#comms-table tbody');
  function renderTable() {
    const log = getComms();
    tableBody.innerHTML = log.map(e => `<tr><td>${e.date}</td><td>${e.type}</td><td>${e.summary}</td><td>${e.highlights||''}</td><td>${e.notes||''}</td></tr>`).join('');
  }
  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    addComms(data.get('date'), data.get('type'), data.get('summary'), data.get('highlights'), data.get('notes'));
    form.reset();
    renderTable();
  });
  renderTable();
  // Post generator
  const postForm = container.querySelector('#postgen-form');
  const postOut = container.querySelector('#postgen-output');
  postForm.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(postForm);
    const type = data.get('type');
    const msg = data.get('message');
    let template = '';
    if (type === 'Newsletter') {
      template = `This month at Smart Learning: ${msg}`;
    } else if (type === 'Social Post') {
      template = `Smart Learning highlight: ${msg} #Inclusion #DigitalSkills`;
    } else {
      template = `Showcase highlight: ${msg}`;
    }
    postOut.textContent = template;
  });
}
