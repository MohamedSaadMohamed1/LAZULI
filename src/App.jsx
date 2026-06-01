import React, { useState, useEffect } from 'react';
import { ConfigProvider, theme } from 'antd';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Checkout from './pages/Checkout';
import AdminPanel from './pages/AdminPanel';
import Orders from './pages/Orders';

// Firebase Config & Seeding
import { authInstance, getFirestoreDb, isMockMode } from './firebase/config';
import { seedDatabase } from './firebase/seed';

// Translations
import { translations } from './utils/translations';

export default function App() {
  const [currentTab, setCurrentTab] = useState('Home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');
  
  // Bilingual Language State
  const [lang, setLang] = useState(() => localStorage.getItem('lazuli_lang') || 'EN');

  // Catalog Products State
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // E-commerce Global States
  const [cartItems, setCartItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState(null);

  // Shop specific filters preserved globally for smooth layout transitions
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCollection, setSelectedCollection] = useState('All');

  // Promo Code / Discount State
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // 1. Initial Seeding and Database Loading
  useEffect(() => {
    const initializeCatalog = async () => {
      // Auto seed empty database catalog
      await seedDatabase();
      await fetchProducts();
    };
    initializeCatalog();
  }, []);

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const db = getFirestoreDb();
      const res = await db.getProducts();
      const loaded = res.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(loaded);
    } catch (e) {
      console.error("Failed to load catalog products:", e);
    } finally {
      setLoadingProducts(false);
    }
  };

  // 2. Language & Layout Direction (RTL support for Arabic!)
  useEffect(() => {
    localStorage.setItem('lazuli_lang', lang);
    document.documentElement.lang = lang.toLowerCase();
    
    if (lang === 'AR') {
      document.documentElement.dir = 'rtl';
      document.body.classList.add('rtl-active');
    } else {
      document.documentElement.dir = 'ltr';
      document.body.classList.remove('rtl-active');
    }
  }, [lang]);

  // Translator Utility
  const t = (key, params = {}) => {
    let text = translations[lang][key] || translations['EN'][key] || key;
    Object.keys(params).forEach(k => {
      text = text.replace(`{${k}}`, params[k]);
    });
    return text;
  };

  // Helper to extract bilingual fields from catalog items
  const getBilingualValue = (obj, keyPrefix) => {
    if (!obj) return '';
    const field = `${keyPrefix}_${lang.toLowerCase()}`;
    return obj[field] || obj[keyPrefix] || '';
  };

  // 3. Auth Observer & Syncing Cart/Favorites with Firestore
  useEffect(() => {
    const unsubscribe = authInstance.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Sync cart from database
        try {
          const db = getFirestoreDb();
          const cartRes = await db.getCart(currentUser.uid);
          if (cartRes.exists()) {
            setCartItems(cartRes.data().items || []);
          } else {
            // Push any offline guest items to their new database cart
            const localCart = JSON.parse(localStorage.getItem('guest_cart') || '[]');
            if (localCart.length > 0) {
              await db.setCart(currentUser.uid, { items: localCart });
              setCartItems(localCart);
            }
          }

          // Sync favorites from database
          const favsRes = await db.getFavorites(currentUser.uid);
          if (favsRes.exists()) {
            setFavorites(favsRes.data().ids || []);
          } else {
            const localFavs = JSON.parse(localStorage.getItem('guest_favorites') || '[]');
            if (localFavs.length > 0) {
              await db.setFavorites(currentUser.uid, { ids: localFavs });
              setFavorites(localFavs);
            }
          }
        } catch (e) {
          console.error("Failed to sync user data with Firebase:", e);
        }
      } else {
        // Load Guest data from localStorage
        setCartItems(JSON.parse(localStorage.getItem('guest_cart') || '[]'));
        setFavorites(JSON.parse(localStorage.getItem('guest_favorites') || '[]'));
      }
    });

    return () => unsubscribe();
  }, []);

  // Write Guest local storage when cart changes
  const saveCartState = async (newCart) => {
    setCartItems(newCart);
    if (user) {
      try {
        const db = getFirestoreDb();
        await db.setCart(user.uid, { items: newCart });
      } catch (e) {
        console.error("Cart sync with Firestore failed:", e);
      }
    } else {
      localStorage.setItem('guest_cart', JSON.stringify(newCart));
    }
  };

  const saveFavoritesState = async (newFavs) => {
    setFavorites(newFavs);
    if (user) {
      try {
        const db = getFirestoreDb();
        await db.setFavorites(user.uid, { ids: newFavs });
      } catch (e) {
        console.error("Favorites sync with Firestore failed:", e);
      }
    } else {
      localStorage.setItem('guest_favorites', JSON.stringify(newFavs));
    }
  };

  // 4. E-commerce Handler Operations
  const handleAddToCart = (product, quantity = 1) => {
    const existingIdx = cartItems.findIndex(item => item.id === product.id);
    let updatedCart = [...cartItems];

    if (existingIdx !== -1) {
      const newQty = updatedCart[existingIdx].quantity + quantity;
      // Cap at stock level
      updatedCart[existingIdx].quantity = Math.min(newQty, product.stock);
    } else {
      updatedCart.push({
        id: product.id,
        name_en: product.name_en,
        name_ar: product.name_ar,
        price: product.price,
        image: product.image,
        collection_en: product.collection_en,
        collection_ar: product.collection_ar,
        category_en: product.category_en,
        category_ar: product.category_ar,
        subcategory_en: product.subcategory_en,
        subcategory_ar: product.subcategory_ar,
        stock: product.stock,
        quantity: Math.min(quantity, product.stock)
      });
    }

    saveCartState(updatedCart);
    setCartOpen(true); // Open sliding bag drawer to confirm addition
  };

  const handleUpdateCartQuantity = (productId, quantity) => {
    const updated = cartItems.map(item => {
      if (item.id === productId) {
        return { ...item, quantity: Math.max(1, Math.min(quantity, item.stock)) };
      }
      return item;
    });
    saveCartState(updated);
  };

  const handleRemoveCartItem = (productId) => {
    const updated = cartItems.filter(item => item.id !== productId);
    saveCartState(updated);
  };

  const handleToggleFavorite = (productId) => {
    let updated;
    if (favorites.includes(productId)) {
      updated = favorites.filter(id => id !== productId);
    } else {
      updated = [...favorites, productId];
    }
    saveFavoritesState(updated);
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setCurrentTab('Details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBuyNow = (product, quantity = 1) => {
    handleAddToCart(product, quantity);
    setCartOpen(false);
    setCurrentTab('Checkout');
  };

  const handleCheckoutInitiate = (data) => {
    if (data && data.giftMessage) {
      setGiftMessage(data.giftMessage);
    }
    setCartOpen(false);
    setCurrentTab('Checkout');
  };

  const handleClearCart = () => {
    saveCartState([]);
    setGiftMessage('');
    setAppliedCoupon(null);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#C4A478', // Luxurious Antique Gold
          colorSuccess: '#D37F4B', // Copper Accent
          colorBgBase: '#FAF9F6', // Alabaster Sand Cream
          colorTextBase: '#1C1A17', // Charcoal Slate
          fontFamily: "'Outfit', 'Playfair Display', sans-serif",
          borderRadius: 0, // Sharp editorial luxury geometry
        },
        components: {
          Button: {
            borderRadius: 0,
            controlHeight: 48,
            fontFamily: "'Outfit', sans-serif",
          },
          Input: {
            borderRadius: 0,
            controlHeight: 48,
          },
          Select: {
            borderRadius: 0,
            controlHeight: 48,
          },
          Modal: {
            borderRadius: 0,
          },
          Drawer: {
            borderRadius: 0,
          },
          Table: {
            borderRadius: 0,
          }
        }
      }}
    >
      {/* ⚠️ MOCK DEV ENVIRONMENT INDICATOR */}
      {isMockMode && (
        <div className="dev-mock-indicator">
          <span>✨ {lang === 'EN' ? 'LAZULI Local Mock Active' : 'محاكاة لازولي المحلية نشطة'}</span>
        </div>
      )}

      {/* Sticky Header Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        setCartOpen={setCartOpen}
        setAuthOpen={setAuthOpen}
        cartItems={cartItems}
        favorites={favorites}
        setSelectedCategory={setSelectedCategory}
        setSelectedCollection={setSelectedCollection}
        lang={lang}
        setLang={setLang}
        t={t}
      />

      {/* MAIN CONTENT VIEWPORT */}
      <main className="viewport-main">
        {loadingProducts ? (
          <div className="catalog-loading-panel">
            <span className="premium-spinner-indicator"></span>
            <h3>LAZULI</h3>
            <p>{lang === 'EN' ? 'Curating copper & precious stone catalog...' : 'جاري تحميل كتالوج النحاس والأحجار الكريمة...'}</p>
          </div>
        ) : (
          <>
            {currentTab === 'Home' && (
              <Home
                products={products}
                onProductClick={handleProductClick}
                onAddToCart={handleAddToCart}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                setCurrentTab={setCurrentTab}
                setSelectedCategory={setSelectedCategory}
                setSelectedCollection={setSelectedCollection}
                t={t}
                lang={lang}
                getBilingualValue={getBilingualValue}
              />
            )}

            {currentTab === 'Shop' && (
              <Shop
                products={products}
                onProductClick={handleProductClick}
                onAddToCart={handleAddToCart}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedCollection={selectedCollection}
                setSelectedCollection={setSelectedCollection}
                t={t}
                lang={lang}
                getBilingualValue={getBilingualValue}
              />
            )}

            {currentTab === 'Details' && selectedProduct && (
              <ProductDetails
                product={selectedProduct}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                allProducts={products}
                onProductClick={handleProductClick}
                t={t}
                lang={lang}
                getBilingualValue={getBilingualValue}
              />
            )}

            {currentTab === 'Checkout' && (
              <Checkout
                cartItems={cartItems}
                onClearCart={handleClearCart}
                setCurrentTab={setCurrentTab}
                giftMessage={giftMessage}
                appliedCoupon={appliedCoupon}
                setAppliedCoupon={setAppliedCoupon}
                t={t}
                lang={lang}
                getBilingualValue={getBilingualValue}
              />
            )}

            {currentTab === 'Orders' && (
              <Orders 
                setCurrentTab={setCurrentTab} 
                t={t} 
                lang={lang}
                getBilingualValue={getBilingualValue}
              />
            )}

            {currentTab === 'Admin' && (
              <AdminPanel
                allProducts={products}
                onRefreshProducts={fetchProducts}
                t={t}
                lang={lang}
                getBilingualValue={getBilingualValue}
              />
            )}
          </>
        )}
      </main>

      {/* FOOTER */}
      <Footer setCurrentTab={setCurrentTab} t={t} lang={lang} />

      {/* Cart Sliding Sidebar Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={handleCheckoutInitiate}
        appliedCoupon={appliedCoupon}
        setAppliedCoupon={setAppliedCoupon}
        t={t}
        lang={lang}
        getBilingualValue={getBilingualValue}
      />

      {/* Authentication Popup Overlay */}
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        t={t}
        lang={lang}
      />

      {/* CORE WRAPPER STYLING */}
      <style>{`
        .viewport-main {
          min-height: 80vh;
        }

        /* RTL Specific adjustments for Arabic flow */
        .rtl-active {
          text-align: right;
        }
        .rtl-active .btn-gold::before {
          left: auto;
          right: -100%;
        }
        .rtl-active .btn-gold:hover::before {
          right: 0;
        }
        .rtl-active .nav-action-btn.badge-btn .action-badge {
          left: -8px;
          right: auto;
        }
        .rtl-active .favorite-btn {
          left: 0.75rem;
          right: auto;
        }
        .rtl-active .product-card-badges {
          left: auto;
          right: 0.75rem;
        }

        /* Mock indicator styling */
        .dev-mock-indicator {
          position: fixed;
          bottom: 1.5rem;
          left: 1.5rem;
          background: rgba(28, 26, 23, 0.95);
          backdrop-filter: blur(4px);
          color: var(--gold-light);
          padding: 0.6rem 1.2rem;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          border: 1px solid var(--gold-primary);
          z-index: 99;
          box-shadow: var(--shadow-lg);
          border-radius: 4px;
          animation: fade-in-up 0.5s ease-out;
        }

        .rtl-active .dev-mock-indicator {
          left: auto;
          right: 1.5rem;
        }

        /* Global Catalog Loading Panel */
        .catalog-loading-panel {
          height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: var(--bg-primary);
          color: var(--text-primary);
          text-align: center;
        }

        .premium-spinner-indicator {
          width: 40px;
          height: 40px;
          border: 3px solid var(--border-color);
          border-top-color: var(--gold-primary);
          border-radius: 50%;
          animation: spin-premium 1s linear infinite;
          margin-bottom: 2rem;
        }

        .catalog-loading-panel h3 {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          font-weight: 600;
          letter-spacing: 0.2em;
          margin-bottom: 0.5rem;
        }

        .catalog-loading-panel p {
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-secondary);
        }

        @keyframes spin-premium {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </ConfigProvider>
  );
}
