// ===== Data Model & Firebase Manager =====

import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCPEfv1-5pcFGIMiV5rF7EhLej2Wqy5ZhI",
  authDomain: "porfile-cb9ea.firebaseapp.com",
  projectId: "porfile-cb9ea",
  storageBucket: "porfile-cb9ea.firebasestorage.app",
  messagingSenderId: "230349125579",
  appId: "1:230349125579:web:ef30c14cce0821d4b0284e",
  measurementId: "G-KCCTTPPXG9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// We will store all data in a single document: collection "portaly", document "my-data"
const DATA_DOC_REF = doc(db, "portaly", "my-data");

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
    bgStyle: 'gradient',
    bgColor1: '#fce4ec',
    bgColor2: '#f3e5f5',
    bgColor3: '#e3f2fd',
    cardStyle: 'glass'
  }
};

// ===== Data Access Functions (Async) =====

export async function getData() {
  try {
    const docSnap = await getDoc(DATA_DOC_REF);
    if (docSnap.exists()) {
      return deepMerge(structuredClone(DEFAULT_DATA), docSnap.data());
    } else {
      // If doc doesn't exist yet, return default data
      return structuredClone(DEFAULT_DATA);
    }
  } catch (e) {
    console.warn('Failed to fetch from Firebase, using defaults:', e);
    return structuredClone(DEFAULT_DATA);
  }
}

export async function saveData(data) {
  try {
    await setDoc(DATA_DOC_REF, data);
    return true;
  } catch (e) {
    console.error('Failed to save to Firebase:', e);
    return false;
  }
}

export async function resetData() {
  const data = structuredClone(DEFAULT_DATA);
  await saveData(data);
  return data;
}

// Real-time listener for the visitor page (optional, but good for instant updates!)
export function listenForChanges(callback) {
  return onSnapshot(DATA_DOC_REF, (doc) => {
    if (doc.exists()) {
      callback(deepMerge(structuredClone(DEFAULT_DATA), doc.data()));
    } else {
      callback(structuredClone(DEFAULT_DATA));
    }
  });
}

// ===== Link CRUD Helpers =====
// Note: These now modify the object in-place and you must call saveData(data) afterwards!

export function addLink(data, link) {
  link.id = 'link_' + Date.now();
  data.links.push(link);
  return data;
}

export function updateLink(data, id, updates) {
  const idx = data.links.findIndex(l => l.id === id);
  if (idx !== -1) {
    data.links[idx] = { ...data.links[idx], ...updates };
  }
  return data;
}

export function removeLink(data, id) {
  data.links = data.links.filter(l => l.id !== id);
  return data;
}

export function reorderLinks(data, fromIdx, toIdx) {
  const [item] = data.links.splice(fromIdx, 1);
  data.links.splice(toIdx, 0, item);
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
