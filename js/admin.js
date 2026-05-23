// ===== Admin Page Logic =====
import { getData, saveData, resetData, exportData, importData, addLink, removeLink } from './data.js';

let appData = null;
let dragSrcIndex = null;

document.addEventListener('DOMContentLoaded', () => {
  appData = getData();
  renderAllForms();
  setupEventListeners();
  refreshPreview();
});

// ===== Render All Form Sections =====
function renderAllForms() {
  renderProfileForm();
  renderSocialsForm();
  renderLinksForm();
  renderFormSettings();
  renderExchangeSettings();
}

// ===== Profile Section =====
function renderProfileForm() {
  document.getElementById('input-name').value = appData.profile.name;
  document.getElementById('input-bio').value = appData.profile.bio;
  
  const preview = document.getElementById('avatar-preview');
  if (preview) preview.src = appData.profile.avatar;
}

// ===== Socials Section =====
function renderSocialsForm() {
  const container = document.getElementById('social-edit-list');
  if (!container) return;

  container.innerHTML = '';

  for (const social of appData.socials) {
    const item = document.createElement('div');
    item.className = 'social-edit-item';
    item.innerHTML = `
      <div class="social-edit-icon ${social.platform}">
        ${social.platform === 'instagram' ? 'IG' : social.platform === 'line' ? 'LINE' : social.platform.toUpperCase().slice(0, 2)}
      </div>
      <input type="url" class="form-input" 
             value="${escapeAttr(social.url)}" 
             placeholder="輸入 ${social.label} 連結"
             data-social-id="${social.id}" />
    `;

    const input = item.querySelector('input');
    input.addEventListener('input', (e) => {
      const s = appData.socials.find(s => s.id === social.id);
      if (s) {
        s.url = e.target.value;
        autoSave();
      }
    });

    container.appendChild(item);
  }
}

// ===== Links Section =====
function renderLinksForm() {
  const container = document.getElementById('link-edit-list');
  if (!container) return;

  container.innerHTML = '';

  appData.links.forEach((link, idx) => {
    const item = document.createElement('div');
    item.className = 'link-edit-item';
    item.draggable = true;
    item.dataset.index = idx;

    item.innerHTML = `
      <div class="link-edit-row">
        <span class="link-edit-drag" title="拖曳排序">⠿</span>
        <input type="text" class="link-edit-emoji form-input" 
               value="${link.emoji || '🔗'}" 
               data-field="emoji" maxlength="4" />
        <input type="text" class="form-input" style="flex:1"
               value="${escapeAttr(link.title)}" 
               placeholder="按鈕標題"
               data-field="title" />
        <button class="link-edit-delete" title="刪除" data-id="${link.id}">✕</button>
      </div>
      <div class="link-edit-row">
        <input type="url" class="form-input" style="flex:1"
               value="${escapeAttr(link.url)}" 
               placeholder="https://..."
               data-field="url" />
      </div>
    `;

    // Input events
    item.querySelectorAll('input').forEach(input => {
      input.addEventListener('input', (e) => {
        const field = e.target.dataset.field;
        if (field && appData.links[idx]) {
          appData.links[idx][field] = e.target.value;
          autoSave();
        }
      });
    });

    // Delete button
    item.querySelector('.link-edit-delete').addEventListener('click', () => {
      appData = removeLink(appData, link.id);
      renderLinksForm();
      refreshPreview();
      showToast('已刪除連結 🗑️');
    });

    // Drag events
    item.addEventListener('dragstart', (e) => {
      dragSrcIndex = idx;
      item.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    });

    item.addEventListener('dragend', () => {
      item.classList.remove('dragging');
      dragSrcIndex = null;
    });

    item.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    });

    item.addEventListener('drop', (e) => {
      e.preventDefault();
      if (dragSrcIndex !== null && dragSrcIndex !== idx) {
        const [moved] = appData.links.splice(dragSrcIndex, 1);
        appData.links.splice(idx, 0, moved);
        saveData(appData);
        renderLinksForm();
        refreshPreview();
      }
    });

    container.appendChild(item);
  });
}

// ===== Google Form Settings =====
function renderFormSettings() {
  const toggle = document.getElementById('toggle-form');
  const urlInput = document.getElementById('input-form-url');
  const titleInput = document.getElementById('input-form-title');

  if (toggle) toggle.checked = appData.googleForm.enabled;
  if (urlInput) urlInput.value = appData.googleForm.url || '';
  if (titleInput) titleInput.value = appData.googleForm.title || '';
}

// ===== Exchange Rate Settings =====
function renderExchangeSettings() {
  const toggle = document.getElementById('toggle-exchange');
  if (toggle) toggle.checked = appData.exchangeRate.enabled;

  const checkboxes = document.querySelectorAll('.currency-checkbox');
  checkboxes.forEach(cb => {
    cb.checked = appData.exchangeRate.currencies.includes(cb.value);
  });
}

// ===== Event Listeners =====
function setupEventListeners() {
  // Profile name
  document.getElementById('input-name')?.addEventListener('input', (e) => {
    appData.profile.name = e.target.value;
    autoSave();
  });

  // Profile bio
  document.getElementById('input-bio')?.addEventListener('input', (e) => {
    appData.profile.bio = e.target.value;
    autoSave();
  });

  // Avatar upload
  document.getElementById('avatar-upload')?.addEventListener('change', handleAvatarUpload);

  // Add link button
  document.getElementById('add-link-btn')?.addEventListener('click', () => {
    appData = addLink(appData, {
      title: '新連結',
      url: '',
      emoji: '🔗',
      color: '#ff9bb9'
    });
    renderLinksForm();
    refreshPreview();
    showToast('已新增連結 ✨');
  });

  // Google Form toggle
  document.getElementById('toggle-form')?.addEventListener('change', (e) => {
    appData.googleForm.enabled = e.target.checked;
    autoSave();
  });

  // Google Form URL
  document.getElementById('input-form-url')?.addEventListener('input', (e) => {
    appData.googleForm.url = e.target.value;
    autoSave();
  });

  // Google Form title
  document.getElementById('input-form-title')?.addEventListener('input', (e) => {
    appData.googleForm.title = e.target.value;
    autoSave();
  });

  // Exchange rate toggle
  document.getElementById('toggle-exchange')?.addEventListener('change', (e) => {
    appData.exchangeRate.enabled = e.target.checked;
    autoSave();
  });

  // Currency checkboxes
  document.querySelectorAll('.currency-checkbox').forEach(cb => {
    cb.addEventListener('change', () => {
      const selected = [];
      document.querySelectorAll('.currency-checkbox:checked').forEach(c => {
        selected.push(c.value);
      });
      appData.exchangeRate.currencies = selected;
      autoSave();
    });
  });

  // Export button
  document.getElementById('btn-export')?.addEventListener('click', () => {
    exportData();
    showToast('已匯出設定檔 📁', 'success');
  });

  // Import button
  document.getElementById('btn-import')?.addEventListener('click', () => {
    document.getElementById('import-file-input')?.click();
  });

  // Import file handler
  document.getElementById('import-file-input')?.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      appData = await importData(file);
      renderAllForms();
      refreshPreview();
      showToast('已匯入設定！✨', 'success');
    } catch (err) {
      showToast('匯入失敗：檔案格式不正確', 'error');
    }
    e.target.value = '';
  });

  // Reset button
  document.getElementById('btn-reset')?.addEventListener('click', () => {
    if (confirm('確定要重設所有設定嗎？這將會清除所有修改。')) {
      appData = resetData();
      renderAllForms();
      refreshPreview();
      showToast('已重設為預設值', 'success');
    }
  });

  // Preview size buttons
  document.querySelectorAll('.preview-size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.preview-size-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const frame = document.getElementById('preview-frame');
      if (frame) {
        frame.className = `preview-frame ${btn.dataset.size}`;
      }
    });
  });

  // View live page
  document.getElementById('btn-view-page')?.addEventListener('click', () => {
    window.open('/', '_blank');
  });
}

// ===== Avatar Upload Handler =====
function handleAvatarUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    showToast('請選擇圖片檔案', 'error');
    return;
  }

  if (file.size > 2 * 1024 * 1024) {
    showToast('圖片大小不能超過 2MB', 'error');
    return;
  }

  const reader = new FileReader();
  reader.onload = (evt) => {
    const dataUrl = evt.target.result;
    appData.profile.avatar = dataUrl;
    
    const preview = document.getElementById('avatar-preview');
    if (preview) preview.src = dataUrl;
    
    autoSave();
    showToast('頭像已更新！✨', 'success');
  };
  reader.readAsDataURL(file);
}

// ===== Auto Save & Preview Refresh =====
let saveTimeout = null;

function autoSave() {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    saveData(appData);
    refreshPreview();
  }, 300);
}

function refreshPreview() {
  const iframe = document.getElementById('preview-iframe');
  if (iframe) {
    // Reload the iframe to reflect changes
    iframe.contentWindow?.location?.reload();
  }
}

// ===== Toast Notification =====
let toastTimeout = null;

function showToast(message, type = 'success') {
  let toast = document.getElementById('admin-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'admin-toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }

  clearTimeout(toastTimeout);
  toast.textContent = message;
  toast.className = `toast ${type}`;
  
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

// ===== Helpers =====
function escapeAttr(str) {
  if (!str) return '';
  return str.replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
