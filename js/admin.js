// ===== Admin Page Logic =====
import { DEFAULT_DATA, getData, saveData, resetData, exportData, importData, addLink, removeLink } from './data.js';

// ===== Emoji Picker =====
const EMOJI_CATEGORIES = {
  '⭐ 熱門': ['🔗', '🎨', '📸', '🎵', '🛍️', '✨', '💖', '🌸', '🎯', '🚀', '💡', '📝', '🎁', '🏆', '❤️', '🔥', '⚡', '🌈', '🦋', '💎'],
  '😀 表情': ['😀', '😍', '🥰', '😎', '🤩', '😊', '🥳', '😂', '🤔', '😴', '🥺', '😡', '🤯', '😱', '🤗', '😇', '🙃', '😏', '🥸', '🤓'],
  '🎨 創作': ['🎨', '🖌️', '✏️', '📐', '📏', '🎭', '🎬', '📷', '📸', '🎥', '🎞️', '🎤', '🎧', '🎼', '🎹', '🎸', '🥁', '🎺', '🎻', '🪗'],
  '🍕 食物': ['🍕', '🍔', '🍜', '🍣', '🍰', '☕', '🧋', '🍦', '🎂', '🍩', '🍪', '🍫', '🍓', '🍑', '🍇', '🍉', '🥑', '🌮', '🥗', '🍱'],
  '✈️ 旅遊': ['✈️', '🌍', '🗺️', '🏖️', '⛰️', '🗼', '🏯', '🎡', '🚂', '🚢', '🏕️', '🌅', '🌄', '🌠', '🌃', '🏙️', '🗽', '🎠', '⛵', '🚁'],
  '💼 工作': ['💼', '📊', '📈', '💻', '🖥️', '⌨️', '🖱️', '📱', '📋', '📌', '📎', '🔧', '⚙️', '🔑', '🏢', '📬', '💰', '💳', '🤝', '📣'],
  '💪 運動': ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱', '🏓', '🏸', '🥊', '🏋️', '🤸', '🧘', '🏊', '🚴', '🤾', '⛷️', '🏄', '🧗'],
  '🌿 自然': ['🌸', '🌺', '🌻', '🌹', '🍀', '🌿', '🌳', '🌵', '🦋', '🐝', '🐬', '🦁', '🐼', '🦊', '🐧', '🌙', '⭐', '🌊', '🔥', '❄️'],
  '🎉 慶祝': ['🎉', '🎊', '🎈', '🎁', '🎀', '🏆', '🥇', '🎖️', '👑', '💝', '💕', '💫', '✨', '🌟', '⚡', '🎆', '🎇', '🧨', '🪄', '🔮'],
};

function closeAllEmojiPickers() {
  document.querySelectorAll('.emoji-dropdown.open').forEach(d => d.classList.remove('open'));
}

document.addEventListener('click', (e) => {
  if (!e.target.closest('.emoji-picker-wrapper')) closeAllEmojiPickers();
});

function createEmojiPicker(currentEmoji, onChange) {
  const wrapper = document.createElement('div');
  wrapper.className = 'emoji-picker-wrapper';

  const triggerBtn = document.createElement('button');
  triggerBtn.type = 'button';
  triggerBtn.className = 'emoji-trigger-btn';
  triggerBtn.textContent = currentEmoji || '🔗';

  const dropdown = document.createElement('div');
  dropdown.className = 'emoji-dropdown';

  const searchRow = document.createElement('div');
  searchRow.className = 'emoji-search-row';

  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.className = 'emoji-search-input';
  searchInput.placeholder = '搜尋類別...';

  const customInput = document.createElement('input');
  customInput.type = 'text';
  customInput.className = 'emoji-custom-input';
  customInput.placeholder = '貼上';
  customInput.title = '自己貼入任何 emoji';
  customInput.maxLength = 8;

  searchRow.appendChild(searchInput);
  searchRow.appendChild(customInput);

  const tabsEl = document.createElement('div');
  tabsEl.className = 'emoji-tabs';

  const gridEl = document.createElement('div');
  gridEl.className = 'emoji-grid';

  let currentCategory = Object.keys(EMOJI_CATEGORIES)[0];

  function renderGrid(emojis) {
    gridEl.innerHTML = '';
    emojis.forEach(emoji => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'emoji-item' + (emoji === triggerBtn.textContent ? ' selected' : '');
      btn.textContent = emoji;
      btn.addEventListener('click', () => {
        triggerBtn.textContent = emoji;
        onChange(emoji);
        closeAllEmojiPickers();
      });
      gridEl.appendChild(btn);
    });
  }

  function switchCategory(catName) {
    currentCategory = catName;
    tabsEl.querySelectorAll('.emoji-tab').forEach(t => t.classList.toggle('active', t.dataset.cat === catName));
    searchInput.value = '';
    renderGrid(EMOJI_CATEGORIES[catName]);
  }

  Object.keys(EMOJI_CATEGORIES).forEach((cat, i) => {
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'emoji-tab' + (i === 0 ? ' active' : '');
    tab.dataset.cat = cat;
    tab.textContent = cat;
    tab.addEventListener('click', () => switchCategory(cat));
    tabsEl.appendChild(tab);
  });

  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim().toLowerCase();
    if (!q) { renderGrid(EMOJI_CATEGORIES[currentCategory]); return; }
    const all = Object.values(EMOJI_CATEGORIES).flat();
    renderGrid(all);
  });

  customInput.addEventListener('input', () => {
    const val = customInput.value.trim();
    if (val) {
      triggerBtn.textContent = val;
      onChange(val);
      customInput.value = '';
      closeAllEmojiPickers();
    }
  });

  triggerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = dropdown.classList.contains('open');
    closeAllEmojiPickers();
    if (!isOpen) {
      dropdown.classList.add('open');
      renderGrid(EMOJI_CATEGORIES[currentCategory]);
      searchInput.focus();
    }
  });

  dropdown.appendChild(searchRow);
  dropdown.appendChild(tabsEl);
  dropdown.appendChild(gridEl);
  wrapper.appendChild(triggerBtn);
  wrapper.appendChild(dropdown);

  return wrapper;
}

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;
const AUTH_KEY = 'portaly_admin_authenticated';

let appData = null;
let dragSrcIndex = null;
let saveTimeout = null;
let toastTimeout = null;
let isDirty = false;
let userEdited = false;

document.addEventListener('DOMContentLoaded', () => {
  setupAdminLogin();
});

function setupAdminLogin() {
  const loginForm = document.getElementById('admin-login-form');
  const passwordInput = document.getElementById('admin-password');
  const errorEl = document.getElementById('admin-login-error');

  document.body.classList.add('admin-locked');

  if (sessionStorage.getItem(AUTH_KEY) === 'true') {
    unlockAdmin();
    return;
  }

  passwordInput?.focus();

  loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (passwordInput?.value === ADMIN_PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, 'true');
      await unlockAdmin();
      return;
    }

    if (errorEl) errorEl.textContent = '密碼錯誤';
    passwordInput?.select();
  });
}

async function unlockAdmin() {
  document.body.classList.remove('admin-locked');

  appData = structuredClone(DEFAULT_DATA);
  renderAllForms();
  setupEventListeners();
  refreshPreview();

  try {
    const remoteData = await getData();
    if (!userEdited) {
      appData = remoteData;
      renderAllForms();
      refreshPreview();
    }
  } catch (err) {
    console.error('Admin init failed:', err);
    showToast('使用預設資料，Firebase 載入較慢', 'error');
  }
}

function renderAllForms() {
  renderProfileForm();
  renderSocialsForm();
  renderLinksForm();
  renderFormSettings();
  renderExchangeSettings();
}

function renderProfileForm() {
  document.getElementById('input-name').value = appData.profile.name;
  document.getElementById('input-bio').value = appData.profile.bio;

  const preview = document.getElementById('avatar-preview');
  if (preview) preview.src = appData.profile.avatar;
}

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

    item.querySelector('input').addEventListener('input', (e) => {
      const current = appData.socials.find(s => s.id === social.id);
      if (current) {
        current.url = e.target.value;
        autoSave();
      }
    });

    container.appendChild(item);
  }
}

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
                <span class="link-edit-drag" title="拖曳排序">⋮⋮</span>
                <span class="emoji-picker-mount"></span>
                <input type="text" class="form-input" style="flex:1"
                      value="${escapeAttr(link.title)}"
                      placeholder="連結標題"
                      data-field="title" />
                <button class="link-edit-delete" title="刪除" data-id="${link.id}">×</button>
              </div>
              <div class="link-edit-row">
                <input type="url" class="form-input" style="flex:1"
                      value="${escapeAttr(link.url)}"
                      placeholder="https://..."
                      data-field="url" />
              </div>
            `;

    // 把 emoji-picker-mount 換成真正的 picker
    const emojiPickerMount = item.querySelector('.emoji-picker-mount');
    const emojiPicker = createEmojiPicker(link.emoji || '🔗', (newEmoji) => {
      if (appData.links[idx]) {
        appData.links[idx].emoji = newEmoji;
        autoSave();
      }
    });
    emojiPickerMount.replaceWith(emojiPicker);

    item.querySelectorAll('input').forEach(input => {
      input.addEventListener('input', (e) => {
        const field = e.target.dataset.field;
        if (field && appData.links[idx]) {
          appData.links[idx][field] = e.target.value;
          autoSave();
        }
      });
    });

    item.querySelector('.link-edit-delete').addEventListener('click', () => {
      appData = removeLink(appData, link.id);
      renderLinksForm();
      autoSave();
    });

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
        renderLinksForm();
        autoSave();
      }
    });

    container.appendChild(item);
  });
}

function renderFormSettings() {
  const toggle = document.getElementById('toggle-form');
  const urlInput = document.getElementById('input-form-url');
  const titleInput = document.getElementById('input-form-title');

  if (toggle) toggle.checked = appData.googleForm.enabled;
  if (urlInput) urlInput.value = appData.googleForm.url || '';
  if (titleInput) titleInput.value = appData.googleForm.title || '';
}

function renderExchangeSettings() {
  const toggle = document.getElementById('toggle-exchange');
  if (toggle) toggle.checked = appData.exchangeRate.enabled;

  document.querySelectorAll('.currency-checkbox').forEach(cb => {
    cb.checked = appData.exchangeRate.currencies.includes(cb.value);
  });
}

function setupEventListeners() {
  document.getElementById('input-name')?.addEventListener('input', (e) => {
    appData.profile.name = e.target.value;
    autoSave();
  });

  document.getElementById('input-bio')?.addEventListener('input', (e) => {
    appData.profile.bio = e.target.value;
    autoSave();
  });

  document.getElementById('avatar-upload')?.addEventListener('change', handleAvatarUpload);

  document.getElementById('add-link-btn')?.addEventListener('click', () => {
    appData = addLink(appData, {
      title: '新連結',
      url: '',
      emoji: '🔗',
      color: '#ff9bb9'
    });
    renderLinksForm();
    autoSave();
  });

  document.getElementById('toggle-form')?.addEventListener('change', (e) => {
    appData.googleForm.enabled = e.target.checked;
    autoSave();
  });

  document.getElementById('input-form-url')?.addEventListener('input', (e) => {
    appData.googleForm.url = e.target.value;
    autoSave();
  });

  document.getElementById('input-form-title')?.addEventListener('input', (e) => {
    appData.googleForm.title = e.target.value;
    autoSave();
  });

  document.getElementById('toggle-exchange')?.addEventListener('change', (e) => {
    appData.exchangeRate.enabled = e.target.checked;
    autoSave();
  });

  document.querySelectorAll('.currency-checkbox').forEach(cb => {
    cb.addEventListener('change', () => {
      appData.exchangeRate.currencies = Array.from(document.querySelectorAll('.currency-checkbox:checked')).map(c => c.value);
      autoSave();
    });
  });

  document.getElementById('btn-export')?.addEventListener('click', () => {
    exportData();
    showToast('已匯出設定');
  });

  document.getElementById('btn-import')?.addEventListener('click', () => {
    document.getElementById('import-file-input')?.click();
  });

  document.getElementById('import-file-input')?.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      appData = await importData(file);
      renderAllForms();
      refreshPreview();
      showToast('已匯入設定');
    } catch (err) {
      showToast('匯入失敗，請確認 JSON 檔案格式', 'error');
    }

    e.target.value = '';
  });

  document.getElementById('btn-reset')?.addEventListener('click', async () => {
    if (confirm('確定要重設為預設值嗎？目前設定會被覆蓋。')) {
      appData = await resetData();
      renderAllForms();
      refreshPreview();
      showToast('已重設為預設值');
    }
  });

  document.querySelectorAll('.preview-size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.preview-size-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const frame = document.getElementById('preview-frame');
      if (frame) frame.className = `preview-frame ${btn.dataset.size}`;
    });
  });

  document.getElementById('btn-view-page')?.addEventListener('click', () => {
    window.open('/', '_blank');
  });
}

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
    appData.profile.avatar = evt.target.result;

    const preview = document.getElementById('avatar-preview');
    if (preview) preview.src = appData.profile.avatar;

    autoSave();
  };
  reader.readAsDataURL(file);
}

function autoSave() {
  isDirty = true;
  userEdited = true;
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(async () => {
    const saved = await saveData(appData);
    if (saved) {
      isDirty = false;
      refreshPreview();
      showToast('已儲存');
    } else {
      showToast('儲存失敗，請確認 Firebase 權限', 'error');
    }
  }, 300);
}

function refreshPreview() {
  const iframe = document.getElementById('preview-iframe');
  iframe?.contentWindow?.location?.reload();
}

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
  }, 1800);
}

function escapeAttr(str) {
  if (!str) return '';
  return String(str)
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
