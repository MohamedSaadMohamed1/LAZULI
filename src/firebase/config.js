import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, doc, getDocs, addDoc, updateDoc, setDoc, getDoc, query, where, deleteDoc } from 'firebase/firestore';

// Environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Check if credentials are valid (non-empty strings)
const isFirebaseConfigured = 
  firebaseConfig.apiKey && firebaseConfig.apiKey.trim() !== "" &&
  firebaseConfig.projectId && firebaseConfig.projectId.trim() !== "";

let app;
let auth;
let db;
let isMock = false;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    console.log("🔥 Firebase initialized successfully with real cloud services!");
  } catch (error) {
    console.error("Firebase initialization failed, falling back to Mock engine:", error);
    isMock = true;
  }
} else {
  console.log("ℹ️ No Firebase credentials detected in .env - Running in Mock Fallback mode (localStorage).");
  isMock = true;
}

// ----------------------------------------------------
// HIGH-FIDELITY MOCK FIREBASE ENGINE (LOCALSTORAGE)
// ----------------------------------------------------
const MOCK_DELAY = 300; // Simulated network delay in milliseconds
const delay = (ms) => new Promise(res => setTimeout(res, ms));

const getLocalStorageData = (key, defaultVal = []) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultVal;
};

const setLocalStorageData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Initialize mock storage keys if empty
if (!localStorage.getItem('mock_products')) setLocalStorageData('mock_products', []);
if (!localStorage.getItem('mock_orders')) setLocalStorageData('mock_orders', []);
if (!localStorage.getItem('mock_carts')) setLocalStorageData('mock_carts', {});
if (!localStorage.getItem('mock_favorites')) setLocalStorageData('mock_favorites', {});

// Seed demo users and admins
const existingUsers = getLocalStorageData('mock_users', []);
const demoUsers = [
  { uid: 'demo_user_uid', email: 'user@lazuli.com', password: 'user123', name: 'Manal (Client)' },
  { uid: 'demo_admin_uid', email: 'admin@lazuli.com', password: 'admin123', name: 'Studio Admin' }
];

let updatedUsers = [...existingUsers];
demoUsers.forEach(demo => {
  if (!updatedUsers.some(u => u.email === demo.email)) {
    updatedUsers.push(demo);
  }
});
setLocalStorageData('mock_users', updatedUsers);

// Seed demo orders
const existingOrders = getLocalStorageData('mock_orders', []);
if (existingOrders.length === 0) {
  const demoOrders = [
    {
      id: 'demo_order_1',
      trackingNumber: 'MNL-783421',
      client: {
        email: 'user@lazuli.com',
        firstName: 'Manal',
        lastName: 'Nofal',
        address: '15 El-Moez Street, Zamalek',
        apartment: 'Apt 4, 3rd Floor',
        city: 'Cairo',
        phone: '01023456789'
      },
      items: [
        {
          id: 'mock_id_agate',
          name_en: 'Beige Agate Golden Earrings',
          name_ar: 'قرط العقيق البيج المذهب',
          price: 1650,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800',
          collection_en: "Nature's Mosaic",
          collection_ar: 'فسيفساء الطبيعة'
        }
      ],
      subtotal: 1650,
      shippingFee: 60,
      grandTotal: 1710,
      giftMessage: 'Happy Birthday, Manal! From Cairo with love.',
      paymentMethod: 'cod',
      status: 'Delivered',
      userId: 'demo_user_uid',
      date: 'May 12, 2026, 04:30 PM',
      createdAt: '2026-05-12T16:30:00.000Z'
    },
    {
      id: 'demo_order_2',
      trackingNumber: 'MNL-902348',
      client: {
        email: 'user@lazuli.com',
        firstName: 'Manal',
        lastName: 'Nofal',
        address: '15 El-Moez Street, Zamalek',
        apartment: 'Apt 4, 3rd Floor',
        city: 'Cairo',
        phone: '01023456789'
      },
      items: [
        {
          id: 'mock_id_turquoise',
          name_en: 'Turquoise Calligraphy Necklace',
          name_ar: 'قلادة الخط العربي والفيروز',
          price: 2400,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800',
          collection_en: 'Calligraphy',
          collection_ar: 'الخط العربي'
        }
      ],
      subtotal: 2400,
      shippingFee: 60,
      grandTotal: 2460,
      giftMessage: '',
      paymentMethod: 'card',
      status: 'Shipped',
      userId: 'demo_user_uid',
      date: 'May 26, 2026, 11:15 AM',
      createdAt: '2026-05-26T11:15:00.000Z'
    },
    {
      id: 'demo_order_3',
      trackingNumber: 'MNL-109483',
      client: {
        email: 'user@lazuli.com',
        firstName: 'Manal',
        lastName: 'Nofal',
        address: '22 Sporting Club, Sporting',
        apartment: 'Apt 9, 2nd Floor',
        city: 'Alexandria',
        phone: '01023456789'
      },
      items: [
        {
          id: 'mock_id_lapis',
          name_en: 'El Kawthar Lapis Cuff',
          name_ar: 'سوار الكوثر باللاجورد الفاخر',
          price: 1950,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800',
          collection_en: 'El Kawthar',
          collection_ar: 'الكوثر'
        }
      ],
      subtotal: 1950,
      shippingFee: 80,
      grandTotal: 2030,
      giftMessage: '',
      paymentMethod: 'cod',
      status: 'Pending',
      userId: 'demo_user_uid',
      date: 'May 28, 2026, 09:20 AM',
      createdAt: '2026-05-28T09:20:00.000Z'
    }
  ];
  setLocalStorageData('mock_orders', demoOrders);
}

// Mock Auth Implementation
const mockAuth = {
  currentUser: JSON.parse(localStorage.getItem('mock_current_user') || 'null'),
  authListeners: [],
  
  onAuthStateChanged(callback) {
    this.authListeners.push(callback);
    callback(this.currentUser);
    return () => {
      this.authListeners = this.authListeners.filter(l => l !== callback);
    };
  },

  async createUserWithEmailAndPassword(email, password) {
    await delay(MOCK_DELAY);
    const users = getLocalStorageData('mock_users');
    if (users.some(u => u.email === email)) {
      throw new Error("auth/email-already-in-use");
    }
    const newUser = { uid: 'mock_uid_' + Math.random().toString(36).substr(2, 9), email, name: email.split('@')[0] };
    users.push({ ...newUser, password });
    setLocalStorageData('mock_users', users);
    
    this.currentUser = newUser;
    localStorage.setItem('mock_current_user', JSON.stringify(newUser));
    this.authListeners.forEach(l => l(newUser));
    return { user: newUser };
  },

  async signInWithEmailAndPassword(email, password) {
    await delay(MOCK_DELAY);
    const users = getLocalStorageData('mock_users');
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error("auth/wrong-password-or-user-not-found");
    }
    const safeUser = { uid: user.uid, email: user.email, name: user.name };
    this.currentUser = safeUser;
    localStorage.setItem('mock_current_user', JSON.stringify(safeUser));
    this.authListeners.forEach(l => l(safeUser));
    return { user: safeUser };
  },

  async signOut() {
    await delay(MOCK_DELAY);
    this.currentUser = null;
    localStorage.removeItem('mock_current_user');
    this.authListeners.forEach(l => l(null));
  }
};

// Mock Firestore Database Implementation
const mockDb = {
  async getDocs(collectionPath) {
    await delay(MOCK_DELAY);
    const storeKey = `mock_${collectionPath}`;
    const items = getLocalStorageData(storeKey);
    return {
      docs: items.map(item => ({
        id: item.id,
        data: () => item
      })),
      empty: items.length === 0
    };
  },

  async addDoc(collectionPath, data) {
    await delay(MOCK_DELAY);
    const storeKey = `mock_${collectionPath}`;
    const items = getLocalStorageData(storeKey);
    const newDoc = { id: 'mock_id_' + Math.random().toString(36).substr(2, 9), ...data, createdAt: new Date().toISOString() };
    items.push(newDoc);
    setLocalStorageData(storeKey, items);
    return { id: newDoc.id };
  },

  async setDoc(docPath, data) {
    await delay(MOCK_DELAY);
    const parts = docPath.split('/');
    const collectionPath = parts[0];
    const docId = parts[1];
    const storeKey = `mock_${collectionPath}`;
    
    // Specifically handle structured objects like carts and favorites stored as maps
    if (collectionPath === 'carts' || collectionPath === 'favorites') {
      const dbStore = getLocalStorageData(storeKey, {});
      dbStore[docId] = data;
      setLocalStorageData(storeKey, dbStore);
      return;
    }

    const items = getLocalStorageData(storeKey);
    const idx = items.findIndex(item => item.id === docId);
    if (idx !== -1) {
      items[idx] = { id: docId, ...data };
    } else {
      items.push({ id: docId, ...data });
    }
    setLocalStorageData(storeKey, items);
  },

  async getDoc(docPath) {
    await delay(MOCK_DELAY);
    const parts = docPath.split('/');
    const collectionPath = parts[0];
    const docId = parts[1];
    const storeKey = `mock_${collectionPath}`;

    if (collectionPath === 'carts' || collectionPath === 'favorites') {
      const dbStore = getLocalStorageData(storeKey, {});
      const data = dbStore[docId] || null;
      return {
        exists: () => data !== null,
        data: () => data
      };
    }

    const items = getLocalStorageData(storeKey);
    const item = items.find(i => i.id === docId) || null;
    return {
      exists: () => item !== null,
      data: () => item
    };
  },

  async updateDoc(docPath, data) {
    await delay(MOCK_DELAY);
    const parts = docPath.split('/');
    const collectionPath = parts[0];
    const docId = parts[1];
    const storeKey = `mock_${collectionPath}`;

    if (collectionPath === 'carts' || collectionPath === 'favorites') {
      const dbStore = getLocalStorageData(storeKey, {});
      if (dbStore[docId]) {
        dbStore[docId] = { ...dbStore[docId], ...data };
        setLocalStorageData(storeKey, dbStore);
      }
      return;
    }

    const items = getLocalStorageData(storeKey);
    const idx = items.findIndex(item => item.id === docId);
    if (idx !== -1) {
      items[idx] = { ...items[idx], ...data };
      setLocalStorageData(storeKey, items);
    }
  }
};

// ----------------------------------------------------
// UNIFIED EXPORTS (Seamless switching)
// ----------------------------------------------------
export const isMockMode = isMock;

export const authInstance = isMock ? mockAuth : auth;

export const getFirestoreDb = () => {
  if (isMock) {
    return {
      // Wrapper methods matching Firestore SDK signatures
      getProducts: () => mockDb.getDocs('products'),
      addProduct: (data) => mockDb.addDoc('products', data),
      getOrders: () => mockDb.getDocs('orders'),
      addOrder: (data) => mockDb.addDoc('orders', data),
      updateOrder: (id, data) => mockDb.updateDoc(`orders/${id}`, data),
      getCart: (userId) => mockDb.getDoc(`carts/${userId}`),
      setCart: (userId, cartItems) => mockDb.setDoc(`carts/${userId}`, cartItems),
      getFavorites: (userId) => mockDb.getDoc(`favorites/${userId}`),
      setFavorites: (userId, favorites) => mockDb.setDoc(`favorites/${userId}`, favorites),
    };
  } else {
    return {
      getProducts: () => getDocs(collection(db, 'products')),
      addProduct: (data) => addDoc(collection(db, 'products'), data),
      getOrders: () => getDocs(collection(db, 'orders')),
      addOrder: (data) => addDoc(collection(db, 'orders'), data),
      updateOrder: (id, data) => updateDoc(doc(db, 'orders', id), data),
      getCart: (userId) => getDoc(doc(db, 'carts', userId)),
      setCart: (userId, cartItems) => setDoc(doc(db, 'carts', userId), cartItems),
      getFavorites: (userId) => getDoc(doc(db, 'favorites', userId)),
      setFavorites: (userId, favorites) => setDoc(doc(db, 'favorites', userId), favorites),
    };
  }
};
