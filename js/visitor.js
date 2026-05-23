// ===== Visitor Page Logic =====
import { getData } from './data.js';
import { fetchExchangeRates, CURRENCY_INFO } from './exchange.js';

// Social platform SVG icons
const SOCIAL_ICONS = {
  instagram: `<svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>`,
  line: `<svg viewBox="0 0 24 24"><path d="M19.365 9.864c.018 0 .049 0 .018 0C21.07 9.864 22 10.794 22 12.18v0c0 1.387-.93 2.317-2.617 2.317h-1.072a.286.286 0 00-.286.286v1.072c0 .158-.128.286-.286.286h-.001a.286.286 0 01-.202-.084l-1.441-1.441a.286.286 0 00-.202-.084h-.322c-1.687 0-2.617-.93-2.617-2.317v-.036c0-1.387.93-2.317 2.617-2.317h3.794zM24 10.063C24 4.888 18.627.5 12 .5S0 4.888 0 10.063c0 4.726 4.191 8.684 9.855 9.437.383.083.907.253 1.04.58.12.297.078.762.038 1.062 0 0-.138.835-.168 1.013-.051.297-.234 1.163 1.018.634 1.252-.53 6.766-3.986 9.23-6.822C22.678 14.084 24 12.18 24 10.063z"/></svg>`,
  youtube: `<svg viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
  tiktok: `<svg viewBox="0 0 24 24"><path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>`,
  twitter: `<svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
  facebook: `<svg viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`,
};

// Decoration emojis for floating effect
const DECORATIONS = ['⭐', '💖', '🌸', '☁️', '✨', '🦋', '🌈', '💫', '🎀', '🌙'];

let appData = null;

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', async () => {
  // Show a simple loading text initially
  document.body.insertAdjacentHTML('afterbegin', '<div id="app-loading" style="position:fixed;inset:0;background:var(--bg-gradient);z-index:9999;display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-weight:bold;color:var(--pink-500);">載入中 ✨...</div>');

  try {
    appData = await getData();
    renderPage();
    renderDecorations();
    initExchangeRates();
  } catch (err) {
    console.error("Error loading data", err);
  } finally {
    document.getElementById('app-loading')?.remove();
  }

  // Set up real-time listener from Firebase
  listenForChanges((newData) => {
    appData = newData;
    renderPage();
    initExchangeRates();
  });
});

function renderPage() {
  renderProfile();
  renderSocials();
  renderLinks();
  renderGoogleForm();
}

function renderProfile() {
  const { profile } = appData;
  
  const avatarImg = document.getElementById('avatar-img');
  const profileName = document.getElementById('profile-name');
  const profileBio = document.getElementById('profile-bio');

  if (avatarImg) avatarImg.src = profile.avatar;
  if (profileName) profileName.textContent = profile.name;
  if (profileBio) profileBio.textContent = profile.bio;
}

function renderSocials() {
  const container = document.getElementById('social-icons');
  if (!container) return;

  container.innerHTML = '';
  
  for (const social of appData.socials) {
    if (!social.url) continue;
    
    const btn = document.createElement('a');
    btn.href = social.url;
    btn.target = '_blank';
    btn.rel = 'noopener noreferrer';
    btn.className = `social-btn ${social.platform}`;
    btn.innerHTML = SOCIAL_ICONS[social.platform] || '';
    btn.title = social.label || social.platform;
    
    container.appendChild(btn);
  }
}

function renderLinks() {
  const container = document.getElementById('links-section');
  if (!container) return;

  container.innerHTML = '';

  appData.links.forEach((link, idx) => {
    const card = document.createElement('a');
    card.href = link.url || '#';
    card.target = link.url && link.url !== '#' ? '_blank' : '_self';
    card.rel = 'noopener noreferrer';
    card.className = 'link-card glass-card';
    card.style.animationDelay = `${idx * 0.08}s`;

    card.innerHTML = `
      <span class="link-emoji">${link.emoji || '🔗'}</span>
      <span class="link-title">${escapeHtml(link.title)}</span>
      <span class="link-arrow">→</span>
    `;

    container.appendChild(card);
  });
}

function renderGoogleForm() {
  const container = document.getElementById('form-section');
  if (!container) return;

  const { googleForm } = appData;
  const titleEl = container.querySelector('.section-title');
  const contentEl = container.querySelector('.form-content');

  if (!googleForm.enabled) {
    container.style.display = 'none';
    return;
  }

  container.style.display = '';
  if (titleEl) titleEl.textContent = googleForm.title || '📋 問卷調查';

  if (!contentEl) return;

  if (googleForm.url) {
    // Ensure URL is an embed URL
    let embedUrl = googleForm.url;
    if (embedUrl.includes('/viewform')) {
      embedUrl = embedUrl.replace('/viewform', '/viewform?embedded=true');
    }
    
    contentEl.innerHTML = `
      <div class="form-iframe-wrapper">
        <iframe src="${escapeHtml(embedUrl)}" 
                frameborder="0" 
                marginheight="0" 
                marginwidth="0"
                loading="lazy"
                title="Google 表單">
          載入中…
        </iframe>
      </div>
    `;
  } else {
    contentEl.innerHTML = `
      <div class="form-placeholder">
        <span class="placeholder-emoji">📝</span>
        <p>問卷即將上線，敬請期待！</p>
      </div>
    `;
  }
}

async function initExchangeRates() {
  const section = document.getElementById('exchange-section');
  if (!section) return;

  const { exchangeRate } = appData;
  if (!exchangeRate.enabled) {
    section.style.display = 'none';
    return;
  }

  section.style.display = '';
  await loadRates();
}

async function loadRates(forceRefresh = false) {
  const grid = document.getElementById('exchange-grid');
  const updateTime = document.getElementById('exchange-update');
  const refreshBtn = document.getElementById('exchange-refresh');
  
  if (!grid) return;

  if (forceRefresh) {
    localStorage.removeItem('portaly_exchange_cache');
  }

  if (refreshBtn) {
    refreshBtn.classList.add('loading');
    refreshBtn.textContent = '更新中...';
  }

  const { exchangeRate } = appData;
  const { rates, lastUpdate, error } = await fetchExchangeRates(exchangeRate.currencies);

  grid.innerHTML = '';

  for (const currency of exchangeRate.currencies) {
    const info = CURRENCY_INFO[currency] || { name: currency, flag: '🏳️', symbol: '' };
    const rate = rates[currency] || 0;

    const item = document.createElement('div');
    item.className = 'rate-item';
    item.innerHTML = `
      <span class="rate-flag">${info.flag}</span>
      <div class="rate-info">
        <span class="rate-code">${currency}</span>
        <span class="rate-value">${rate.toFixed(2)}</span>
      </div>
    `;
    grid.appendChild(item);
  }

  if (updateTime) {
    updateTime.innerHTML = `<span class="exchange-live-dot"></span>${error ? '使用參考匯率' : lastUpdate}`;
  }

  if (refreshBtn) {
    refreshBtn.classList.remove('loading');
    refreshBtn.textContent = '🔄 重新整理';
  }
}

// Make refresh globally accessible
window.refreshRates = () => loadRates(true);

function renderDecorations() {
  const container = document.getElementById('floating-decos');
  if (!container) return;

  for (let i = 0; i < 12; i++) {
    const deco = document.createElement('span');
    deco.className = 'deco';
    deco.textContent = DECORATIONS[i % DECORATIONS.length];
    
    deco.style.left = `${Math.random() * 100}%`;
    deco.style.top = `${Math.random() * 100}%`;
    deco.style.fontSize = `${1 + Math.random() * 1.5}rem`;
    deco.style.opacity = 0.15 + Math.random() * 0.25;
    deco.style.animation = `${Math.random() > 0.5 ? 'float' : 'floatSlow'} ${5 + Math.random() * 8}s ease-in-out infinite`;
    deco.style.animationDelay = `${Math.random() * 5}s`;
    
    container.appendChild(deco);
  }
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
