/* ============================================================
   Smart Learning for Independence – Media Manager
   Handles video/image uploads, display, and management
   ============================================================ */

const Media = (() => {
  const STORAGE_KEY = 'sl_media_library';
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB limit for videos
  const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg'];

  /* ---------- Storage helpers ---------- */
  function _getLibrary() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  function _saveLibrary(lib) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lib));
  }

  /* ---------- File to Base64 ---------- */
  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /* ---------- Add media item ---------- */
  async function addMedia(file, moduleId, caption = '') {
    if (!file) return { error: 'No file provided' };

    // Validate file type
    const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);

    if (!isImage && !isVideo) {
      return { error: 'Invalid file type. Use JPG, PNG, GIF, WebP, MP4, WebM, or OGG.' };
    }

    // Validate size
    if (file.size > MAX_FILE_SIZE) {
      return { error: 'File too large. Maximum 50MB.' };
    }

    try {
      const base64Data = await fileToBase64(file);

      const mediaItem = {
        id: 'media_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
        type: isImage ? 'image' : 'video',
        mimeType: file.type,
        name: file.name,
        size: file.size,
        data: base64Data,
        moduleId: moduleId || null,
        caption: caption,
        createdAt: new Date().toISOString(),
        uploadedBy: Storage.getActiveProfile()?.name || 'Unknown',
      };

      const library = _getLibrary();
      library.push(mediaItem);
      _saveLibrary(library);

      return { success: true, item: mediaItem };
    } catch (err) {
      return { error: 'Failed to process file: ' + err.message };
    }
  }

  /* ---------- Add media from URL ---------- */
  function addMediaFromURL(url, type, moduleId, caption = '') {
    const mediaItem = {
      id: 'media_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      type: type, // 'image', 'video', 'youtube'
      mimeType: type === 'youtube' ? 'video/youtube' : null,
      name: caption || url,
      url: url,
      moduleId: moduleId || null,
      caption: caption,
      createdAt: new Date().toISOString(),
      uploadedBy: Storage.getActiveProfile()?.name || 'Unknown',
    };

    const library = _getLibrary();
    library.push(mediaItem);
    _saveLibrary(library);

    return { success: true, item: mediaItem };
  }

  /* ---------- Get all media ---------- */
  function getAllMedia() {
    return _getLibrary();
  }

  /* ---------- Get media for module ---------- */
  function getMediaForModule(moduleId) {
    return _getLibrary().filter(m => m.moduleId === moduleId);
  }

  /* ---------- Get media by ID ---------- */
  function getMediaById(id) {
    return _getLibrary().find(m => m.id === id) || null;
  }

  /* ---------- Delete media ---------- */
  function deleteMedia(id) {
    const library = _getLibrary().filter(m => m.id !== id);
    _saveLibrary(library);
    return { success: true };
  }

  /* ---------- Update media caption ---------- */
  function updateCaption(id, caption) {
    const library = _getLibrary();
    const item = library.find(m => m.id === id);
    if (item) {
      item.caption = caption;
      _saveLibrary(library);
      return { success: true };
    }
    return { error: 'Media not found' };
  }

  /* ---------- Render media item HTML ---------- */
  function renderMedia(item, options = {}) {
    const { showCaption = true, showControls = false, size = 'medium' } = options;
    const sizeClass = `media-${size}`;

    if (item.type === 'image') {
      const src = item.data || item.url;
      return `
        <figure class="media-item ${sizeClass}">
          <img src="${src}" alt="${esc(item.caption || item.name)}" loading="lazy" onclick="Media.openLightbox('${item.id}')">
          ${showCaption && item.caption ? `<figcaption>${esc(item.caption)}</figcaption>` : ''}
          ${showControls ? renderMediaControls(item) : ''}
        </figure>`;
    }

    if (item.type === 'video') {
      const src = item.data || item.url;
      return `
        <figure class="media-item ${sizeClass}">
          <video controls preload="metadata" poster="">
            <source src="${src}" type="${item.mimeType || 'video/mp4'}">
            Your browser does not support video.
          </video>
          ${showCaption && item.caption ? `<figcaption>${esc(item.caption)}</figcaption>` : ''}
          ${showControls ? renderMediaControls(item) : ''}
        </figure>`;
    }

    if (item.type === 'youtube') {
      const videoId = extractYouTubeId(item.url);
      if (!videoId) return '<p class="text-muted">Invalid YouTube URL</p>';
      return `
        <figure class="media-item ${sizeClass}">
          <div class="video-embed">
            <iframe
              src="https://www.youtube-nocookie.com/embed/${videoId}"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
              title="${esc(item.caption || 'Video')}">
            </iframe>
          </div>
          ${showCaption && item.caption ? `<figcaption>${esc(item.caption)}</figcaption>` : ''}
          ${showControls ? renderMediaControls(item) : ''}
        </figure>`;
    }

    return '';
  }

  function renderMediaControls(item) {
    return `
      <div class="media-controls">
        <button class="btn btn-sm btn-ghost" onclick="Media.editCaption('${item.id}')" title="Edit caption">✏️</button>
        <button class="btn btn-sm btn-ghost" onclick="Media.confirmDelete('${item.id}')" title="Delete">🗑️</button>
      </div>`;
  }

  /* ---------- Extract YouTube ID ---------- */
  function extractYouTubeId(url) {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/,
      /^([a-zA-Z0-9_-]{11})$/
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  }

  /* ---------- Lightbox ---------- */
  function openLightbox(id) {
    const item = getMediaById(id);
    if (!item || item.type !== 'image') return;

    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML = `
      <div class="lightbox-content">
        <button class="lightbox-close" onclick="Media.closeLightbox()" aria-label="Close">×</button>
        <img src="${item.data || item.url}" alt="${esc(item.caption || item.name)}">
        ${item.caption ? `<p class="lightbox-caption">${esc(item.caption)}</p>` : ''}
      </div>
    `;
    overlay.onclick = (e) => { if (e.target === overlay) closeLightbox(); };
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    document.querySelector('.lightbox-overlay')?.remove();
    document.body.style.overflow = '';
  }

  /* ---------- Upload UI ---------- */
  function renderUploadForm(moduleId = null) {
    return `
      <div class="media-upload-form card">
        <h3 class="heading">📷 Add Photo or Video</h3>

        <div class="upload-tabs">
          <button class="btn btn-sm btn-primary" onclick="Media.showUploadTab('file')" id="tab-file">📁 Upload File</button>
          <button class="btn btn-sm btn-ghost" onclick="Media.showUploadTab('url')" id="tab-url">🔗 From URL</button>
          <button class="btn btn-sm btn-ghost" onclick="Media.showUploadTab('youtube')" id="tab-youtube">▶️ YouTube</button>
        </div>

        <div id="upload-file" class="upload-section">
          <input type="file" id="media-file-input" accept="image/*,video/*" class="input" onchange="Media.previewFile()">
          <div id="media-preview" class="media-preview"></div>
          <input type="text" id="media-caption" class="input" placeholder="Caption (optional)" style="margin-top:0.5rem;">
          <button class="btn btn-primary btn-block" style="margin-top:0.5rem;" onclick="Media.uploadFile('${moduleId || ''}')">⬆️ Upload</button>
        </div>

        <div id="upload-url" class="upload-section" style="display:none;">
          <input type="url" id="media-url-input" class="input" placeholder="https://example.com/image.jpg">
          <select id="media-url-type" class="input" style="margin-top:0.5rem;">
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
          <input type="text" id="media-url-caption" class="input" placeholder="Caption (optional)" style="margin-top:0.5rem;">
          <button class="btn btn-primary btn-block" style="margin-top:0.5rem;" onclick="Media.uploadFromURL('${moduleId || ''}')">➕ Add</button>
        </div>

        <div id="upload-youtube" class="upload-section" style="display:none;">
          <input type="url" id="youtube-url-input" class="input" placeholder="https://youtube.com/watch?v=...">
          <input type="text" id="youtube-caption" class="input" placeholder="Caption (optional)" style="margin-top:0.5rem;">
          <button class="btn btn-primary btn-block" style="margin-top:0.5rem;" onclick="Media.uploadYouTube('${moduleId || ''}')">▶️ Add Video</button>
        </div>
      </div>`;
  }

  function showUploadTab(tab) {
    document.querySelectorAll('.upload-section').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.upload-tabs .btn').forEach(el => {
      el.classList.remove('btn-primary');
      el.classList.add('btn-ghost');
    });
    document.getElementById(`upload-${tab}`).style.display = 'block';
    document.getElementById(`tab-${tab}`).classList.remove('btn-ghost');
    document.getElementById(`tab-${tab}`).classList.add('btn-primary');
  }

  function previewFile() {
    const input = document.getElementById('media-file-input');
    const preview = document.getElementById('media-preview');
    const file = input.files[0];

    if (!file) {
      preview.innerHTML = '';
      return;
    }

    const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);

    if (isImage) {
      const reader = new FileReader();
      reader.onload = (e) => {
        preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
      };
      reader.readAsDataURL(file);
    } else if (isVideo) {
      preview.innerHTML = `<p>📹 Video: ${file.name} (${(file.size / 1024 / 1024).toFixed(1)}MB)</p>`;
    } else {
      preview.innerHTML = `<p class="text-danger">❌ Unsupported file type</p>`;
    }
  }

  async function uploadFile(moduleId) {
    const input = document.getElementById('media-file-input');
    const caption = document.getElementById('media-caption').value;
    const file = input.files[0];

    if (!file) {
      App.toast('Please select a file', 'error');
      return;
    }

    App.toast('Uploading...', 'info');
    const result = await addMedia(file, moduleId || null, caption);

    if (result.error) {
      App.toast(result.error, 'error');
    } else {
      App.toast('✅ Media uploaded!', 'success');
      input.value = '';
      document.getElementById('media-caption').value = '';
      document.getElementById('media-preview').innerHTML = '';
      App.render();
    }
  }

  function uploadFromURL(moduleId) {
    const url = document.getElementById('media-url-input').value.trim();
    const type = document.getElementById('media-url-type').value;
    const caption = document.getElementById('media-url-caption').value;

    if (!url) {
      App.toast('Please enter a URL', 'error');
      return;
    }

    const result = addMediaFromURL(url, type, moduleId || null, caption);
    if (result.success) {
      App.toast('✅ Media added!', 'success');
      document.getElementById('media-url-input').value = '';
      document.getElementById('media-url-caption').value = '';
      App.render();
    }
  }

  function uploadYouTube(moduleId) {
    const url = document.getElementById('youtube-url-input').value.trim();
    const caption = document.getElementById('youtube-caption').value;

    if (!url || !extractYouTubeId(url)) {
      App.toast('Please enter a valid YouTube URL', 'error');
      return;
    }

    const result = addMediaFromURL(url, 'youtube', moduleId || null, caption);
    if (result.success) {
      App.toast('✅ YouTube video added!', 'success');
      document.getElementById('youtube-url-input').value = '';
      document.getElementById('youtube-caption').value = '';
      App.render();
    }
  }

  /* ---------- Edit/Delete ---------- */
  function editCaption(id) {
    const item = getMediaById(id);
    if (!item) return;

    const newCaption = prompt('Enter new caption:', item.caption || '');
    if (newCaption !== null) {
      updateCaption(id, newCaption);
      App.toast('Caption updated', 'success');
      App.render();
    }
  }

  function confirmDelete(id) {
    if (confirm('Delete this media? This cannot be undone.')) {
      deleteMedia(id);
      App.toast('Media deleted', 'success');
      App.render();
    }
  }

  /* ---------- Render media gallery ---------- */
  function renderGallery(moduleId = null, options = {}) {
    const items = moduleId ? getMediaForModule(moduleId) : getAllMedia();

    if (items.length === 0) {
      return `<div class="text-center text-muted" style="padding:2rem;">
        <span style="font-size:3rem;">📷</span>
        <p>No media yet. Upload photos or videos above!</p>
      </div>`;
    }

    return `
      <div class="media-gallery">
        ${items.map(item => renderMedia(item, { showCaption: true, showControls: options.editable, size: 'medium' })).join('')}
      </div>`;
  }

  /* ---------- Helper ---------- */
  function esc(s) {
    if (!s) return '';
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* ---------- Public API ---------- */
  return {
    addMedia,
    addMediaFromURL,
    getAllMedia,
    getMediaForModule,
    getMediaById,
    deleteMedia,
    updateCaption,
    renderMedia,
    renderUploadForm,
    renderGallery,
    showUploadTab,
    previewFile,
    uploadFile,
    uploadFromURL,
    uploadYouTube,
    editCaption,
    confirmDelete,
    openLightbox,
    closeLightbox,
    extractYouTubeId,
  };
})();
