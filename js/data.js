// ===== Data Model & localStorage Manager =====

const STORAGE_KEY = 'portaly_data';

const DEFAULT_DATA = {
  profile: {
    name: '你的名字',
    bio: '✨ 歡迎來到我的小天地 ✨\n喜歡旅行、美食和分享生活 🌸',
    avatar: '/assets/avatar.png'
  },
  socials: [
    { id: 'ig', platform: 'instagram', label: 'Instagram', url: 'https://instagram.com/', icon: 'instagram' },
    { id: 'line', platform: 'line', label: 'LINE', url: 'https://line.me/', icon: 'line' }
  ],
  links: [
    { id: 'link1', title: '🎨 我的作品集', url: '#', emoji: '🎨', color: '#ff9bb9' },
    { id: 'link2', title: '📸 攝影日記', url: '#', emoji: '📸', color: '#c4a8ff' },
    { id: 'link3', title: '🎵 我的歌單', url: '#', emoji: '🎵', color: '#7cbfff' },
    { id: 'link4', title: '🛍️ 好物推薦', url: '#', emoji: '🛍️', color: '#6ee7b7' }
  ],
  googleForm: {
    enabled: true,
    url: '',
    title: '📋 問卷調查'
  },
  exchangeRate: {
    enabled: true,
    baseCurrency: 'TWD',
    currencies: ['USD', 'JPY', 'EUR', 'KRW']
  },
  theme: {
    bgStyle: 'gradient', // 'gradient' | 'solid' | 'image'
    bgColor1: '#fce4ec',
    bgColor2: '#f3e5f5',
    bgColor3: '#e3f2fd',
    cardStyle: 'glass' // 'glass' | 'solid' | 'outlined'
  }
};

// ===== Data Access Functions =====

export function getData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Merge with defaults to handle new fields added in updates
      return deepMerge(structuredClone(DEFAULT_DATA), parsed);
    }
  } catch (e) {
    console.warn('Failed to parse stored data, using defaults:', e);
  }
  return structuredClone(DEFAULT_DATA);
}

export function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error('Failed to save data:', e);
    return false;
  }
}

export function resetData() {
  localStorage.removeItem(STORAGE_KEY);
  return structuredClone(DEFAULT_DATA);
}

export function exportData() {
  const data = getData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `portaly-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importData(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        saveData(data);
        resolve(data);
      } catch (err) {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

// ===== Link CRUD =====

export function addLink(data, link) {
  link.id = 'link_' + Date.now();
  data.links.push(link);
  saveData(data);
  return data;
}

export function updateLink(data, id, updates) {
  const idx = data.links.findIndex(l => l.id === id);
  if (idx !== -1) {
    data.links[idx] = { ...data.links[idx], ...updates };
    saveData(data);
  }
  return data;
}

export function removeLink(data, id) {
  data.links = data.links.filter(l => l.id !== id);
  saveData(data);
  return data;
}

export function reorderLinks(data, fromIdx, toIdx) {
  const [item] = data.links.splice(fromIdx, 1);
  data.links.splice(toIdx, 0, item);
  saveData(data);
  return data;
}

// ===== Helpers =====

export function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

function deepMerge(target, source) {
  for (const key of Object.keys(source)) {
    if (
      source[key] &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key]) &&
      target[key] &&
      typeof target[key] === 'object' &&
      !Array.isArray(target[key])
    ) {
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

export { DEFAULT_DATA };
