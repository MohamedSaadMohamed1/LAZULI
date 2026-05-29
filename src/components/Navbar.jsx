import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, User, Menu, X, Heart, Settings, Languages } from 'lucide-react';
import { authInstance } from '../firebase/config';

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  setCartOpen, 
  setAuthOpen, 
  cartItems, 
  favorites,
  setSelectedCategory,
  setSelectedCollection,
  lang,
  setLang,
  t
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = authInstance.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);
    setSelectedCollection('All');
    setCurrentTab('Shop');
    setMobileMenuOpen(false);
  };

  const handleCollectionClick = (coll) => {
    setSelectedCollection(coll);
    setSelectedCategory('All');
    setCurrentTab('Shop');
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await authInstance.signOut();
    setUserMenuOpen(false);
  };

  const toggleLanguage = () => {
    setLang(lang === 'EN' ? 'AR' : 'EN');
  };

  return (
    <>
      <nav className={`navbar ${isScrolled || currentTab !== 'Home' ? 'navbar-solid' : 'navbar-transparent'}`}>
        <div className="navbar-container">
          
          {/* Left: Hamburger menu for mobile */}
          <button className="mobile-toggle" onClick={() => setMobileMenuOpen(true)}>
            <Menu size={22} />
          </button>

          {/* Left/Middle: Nav items for desktop */}
          <div className="nav-links-desktop">
            <button className={currentTab === 'Home' ? 'active' : ''} onClick={() => { setCurrentTab('Home'); setMobileMenuOpen(false); }}>
              {t('home')}
            </button>
            
            {/* Shop Category Dropdown */}
            <div className="nav-dropdown-trigger">
              <button className={currentTab === 'Shop' ? 'active' : ''} onClick={() => { handleCategoryClick('All'); }}>
                {t('shop')}
              </button>
              <div className="nav-dropdown-menu">
                <button onClick={() => handleCategoryClick('Earrings')}>{t('earrings')}</button>
                <button onClick={() => handleCategoryClick('Necklaces')}>{t('necklaces')}</button>
                <button onClick={() => handleCategoryClick('Bracelets')}>{t('bracelets')}</button>
                <button onClick={() => handleCategoryClick('Rings')}>{t('rings')}</button>
                <button onClick={() => handleCategoryClick('Pins')}>{t('pins')}</button>
              </div>
            </div>

            <div className="nav-dropdown-trigger">
              <span>{t('collections')}</span>
              <div className="nav-dropdown-menu">
                <button onClick={() => handleCollectionClick("Nature's Mosaic")}>
                  {lang === 'EN' ? "Nature's Mosaic" : "فسيفساء الطبيعة"}
                </button>
                <button onClick={() => handleCollectionClick("El Kawthar")}>
                  {lang === 'EN' ? "El Kawthar" : "الكوثر"}
                </button>
                <button onClick={() => handleCollectionClick("Oumy")}>
                  {lang === 'EN' ? "Oumy" : "أمي"}
                </button>
                <button onClick={() => handleCollectionClick("Calligraphy")}>
                  {lang === 'EN' ? "Calligraphy" : "الخط العربي"}
                </button>
              </div>
            </div>
          </div>

          {/* Center: Brand Logo */}
          <div className="nav-logo" onClick={() => setCurrentTab('Home')}>
            LAZULI
            <span>JEWELRY</span>
          </div>

          {/* Right: Actions */}
          <div className="nav-actions">
            
            {/* Bilingual Toggle Button! (Hidden on Mobile, placed in Mobile Drawer) */}
            <button className="lang-toggle-btn desktop-action" onClick={toggleLanguage}>
              <span>🌐 {lang === 'EN' ? 'العربية' : 'English'}</span>
            </button>

            {/* Search Toggle */}
            <button className="nav-action-btn" onClick={() => setSearchOpen(true)}>
              <Search size={20} />
            </button>

            {/* Favorites Icon (Hidden on Mobile, placed in Mobile Drawer) */}
            <button className="nav-action-btn badge-btn desktop-action" onClick={() => { setSelectedCategory('All'); setSelectedCollection('All'); setCurrentTab('Shop'); }}>
              <Heart size={20} className={favorites.length > 0 ? 'heart-filled' : ''} />
              {favorites.length > 0 && <span className="action-badge bg-gold">{favorites.length}</span>}
            </button>

            {/* Profile Dropdown (Hidden on Mobile, placed in Mobile Drawer) */}
            <div className="user-menu-wrap desktop-action">
              <button className="nav-action-btn" onClick={() => user ? setUserMenuOpen(!userMenuOpen) : setAuthOpen(true)}>
                <User size={20} />
                {user && <span className="user-dot"></span>}
              </button>
              
              {userMenuOpen && user && (
                <div className="user-menu-dropdown">
                  <div className="dropdown-header">
                    <p className="user-name">{t('welcome')}, {user.name || (lang === 'EN' ? 'Artisan' : 'صائغنا')}</p>
                    <p className="user-email">{user.email}</p>
                  </div>
                  <hr className="dropdown-divider" />
                  <button className="dropdown-item" onClick={() => { setCurrentTab('Orders'); setUserMenuOpen(false); }}>
                    {t('orders')}
                  </button>
                  <button className="dropdown-item" onClick={() => { setCurrentTab('Admin'); setUserMenuOpen(false); }}>
                    <Settings size={14} style={{ marginRight: '6px', marginLeft: '6px', display: 'inline-block', verticalAlign: 'middle' }} />
                    {t('adminPanel')}
                  </button>
                  <hr className="dropdown-divider" />
                  <button className="dropdown-item logout-btn" onClick={handleLogout}>
                    {t('signOut')}
                  </button>
                </div>
              )}
            </div>

            {/* Shopping Bag Trigger */}
            <button className="nav-action-btn badge-btn cart-toggle-btn" onClick={() => setCartOpen(true)}>
              <ShoppingBag size={20} />
              {totalCartCount > 0 && <span className="action-badge">{totalCartCount}</span>}
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE NAV MENU */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-menu-panel" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <div className="nav-logo">
                LAZULI
                <span>JEWELRY</span>
              </div>
              <button className="close-btn" onClick={() => setMobileMenuOpen(false)}>
                <X size={24} />
              </button>
            </div>

            {/* Mobile Auth Header */}
            <div className="mobile-menu-auth-block">
              {user ? (
                <div className="mobile-auth-logged">
                  <div className="avatar-circle">
                    {user.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <div>
                    <p className="user-name">{t('welcome')}, {user.name || (lang === 'EN' ? 'Artisan' : 'صائغنا')}</p>
                    <button className="mobile-logout-btn" onClick={handleLogout}>{t('signOut')}</button>
                  </div>
                </div>
              ) : (
                <button className="btn-gold mobile-auth-trigger" onClick={() => { setAuthOpen(true); setMobileMenuOpen(false); }}>
                  <span>{lang === 'EN' ? 'Sign In / Register' : 'تسجيل الدخول / التسجيل'}</span>
                </button>
              )}
            </div>
            
            <div className="mobile-menu-links">
              <button onClick={() => { setCurrentTab('Home'); setMobileMenuOpen(false); }}>{t('home')}</button>
              
              <div className="mobile-menu-section">
                <p className="mobile-section-title">{t('shop')}</p>
                <button onClick={() => handleCategoryClick('All')}>{t('all')}</button>
                <button onClick={() => handleCategoryClick('Earrings')}>{t('earrings')}</button>
                <button onClick={() => handleCategoryClick('Necklaces')}>{t('necklaces')}</button>
                <button onClick={() => handleCategoryClick('Bracelets')}>{t('bracelets')}</button>
                <button onClick={() => handleCategoryClick('Rings')}>{t('rings')}</button>
                <button onClick={() => handleCategoryClick('Pins')}>{t('pins')}</button>
              </div>

              <div className="mobile-menu-section">
                <p className="mobile-section-title">{t('collections')}</p>
                <button onClick={() => handleCollectionClick("Nature's Mosaic")}>
                  {lang === 'EN' ? "Nature's Mosaic" : "فسيفساء الطبيعة"}
                </button>
                <button onClick={() => handleCollectionClick("El Kawthar")}>
                  {lang === 'EN' ? "El Kawthar" : "الكوثر"}
                </button>
                <button onClick={() => handleCollectionClick("Oumy")}>
                  {lang === 'EN' ? "Oumy" : "أمي"}
                </button>
                <button onClick={() => handleCollectionClick("Calligraphy")}>
                  {lang === 'EN' ? "Calligraphy" : "الخط العربي"}
                </button>
              </div>

              {/* Mobile-only secondary quick actions */}
              <div className="mobile-menu-section mobile-secondary-section">
                <p className="mobile-section-title">{lang === 'EN' ? 'Account & Wishlist' : 'الحساب والمفضلة'}</p>
                
                <button className="mobile-fav-link" onClick={() => { setSelectedCategory('All'); setSelectedCollection('All'); setCurrentTab('Shop'); setMobileMenuOpen(false); }}>
                  <Heart size={16} className={favorites.length > 0 ? 'heart-filled' : ''} style={{ marginRight: '8px', marginLeft: '8px' }} />
                  <span>{t('favorites')} ({favorites.length})</span>
                </button>

                {user && (
                  <button className="mobile-orders-link" onClick={() => { setCurrentTab('Orders'); setMobileMenuOpen(false); }}>
                    <span>{t('orders')}</span>
                  </button>
                )}

                {user && (
                  <button className="mobile-admin-link" onClick={() => { setCurrentTab('Admin'); setMobileMenuOpen(false); }}>
                    <span>{t('adminPanel')}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Language Switcher at the bottom */}
            <div className="mobile-menu-footer-lang">
              <button className="mobile-lang-btn" onClick={() => { toggleLanguage(); setMobileMenuOpen(false); }}>
                <span>🌐 {lang === 'EN' ? 'العربية (Arabic)' : 'English (إنجليزية)'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SEARCH FULLSCREEN BLUR OVERLAY */}
      {searchOpen && (
        <div className="search-overlay">
          <button className="search-close-btn" onClick={() => setSearchOpen(false)}>
            <X size={30} />
          </button>
          <div className="search-container">
            <h2 className="search-title">{t('searchTitle')}</h2>
            <div className="search-bar">
              <Search className="search-bar-icon" size={24} />
              <input 
                type="text" 
                placeholder={t('searchHint')} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setSelectedCategory('All');
                    setSelectedCollection('All');
                    setCurrentTab('Shop');
                    setSearchOpen(false);
                  }
                }}
                autoFocus
              />
            </div>
            <p className="search-hint">{t('searchEnter')}</p>
          </div>
        </div>
      )}

      {/* STYLES SPECIFIC TO NAVBAR */}
      <style>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 100;
          transition: var(--transition-smooth);
          height: 80px;
        }
        
        .navbar-transparent {
          background: transparent;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--text-light);
        }
        
        .navbar-solid {
          background: rgba(253, 251, 250, 0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border-color);
          color: var(--text-primary);
          box-shadow: var(--shadow-sm);
        }

        .navbar-transparent .nav-logo {
          color: #FFFDFB;
        }

        .navbar-container {
          max-width: 1400px;
          height: 100%;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
        }

        .mobile-toggle {
          background: transparent;
          border: none;
          color: inherit;
          cursor: pointer;
          display: none;
        }

        .nav-links-desktop {
          display: flex;
          align-items: center;
          gap: 2.5rem;
          font-weight: 500;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .nav-links-desktop button, .nav-dropdown-trigger span {
          background: transparent;
          border: none;
          color: inherit;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 500;
          font-size: 0.85rem;
          cursor: pointer;
          padding: 0.5rem 0;
          position: relative;
          transition: var(--transition-snappy);
        }

        .nav-links-desktop button::after, .nav-dropdown-trigger span::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 1.5px;
          background: var(--gold-primary);
          transition: var(--transition-smooth);
        }

        .nav-links-desktop button:hover::after, 
        .nav-links-desktop button.active::after,
        .nav-dropdown-trigger:hover span::after {
          width: 100%;
        }

        .nav-dropdown-trigger {
          position: relative;
          cursor: pointer;
          padding: 0.5rem 0;
        }

        .nav-dropdown-menu {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%) translateY(10px);
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          min-width: 180px;
          padding: 0.75rem 0;
          display: flex;
          flex-direction: column;
          box-shadow: var(--shadow-md);
          opacity: 0;
          visibility: hidden;
          transition: var(--transition-smooth);
          z-index: 110;
        }

        .nav-dropdown-trigger:hover .nav-dropdown-menu {
          opacity: 1;
          visibility: visible;
          transform: translateX(-50%) translateY(0);
        }

        .nav-dropdown-menu button {
          color: var(--text-primary) !important;
          padding: 0.6rem 1.5rem !important;
          text-align: inherit;
          width: 100%;
          font-size: 0.8rem !important;
          letter-spacing: 0.05em !important;
          font-family: inherit;
        }

        .nav-dropdown-menu button:hover {
          background: var(--bg-primary);
          color: var(--gold-primary) !important;
        }

        .nav-logo {
          font-family: 'Playfair Display', serif;
          font-size: 1.8rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          cursor: pointer;
          text-align: center;
          line-height: 1;
        }

        .nav-logo span {
          display: block;
          font-family: 'Outfit', sans-serif;
          font-size: 0.55rem;
          letter-spacing: 0.35em;
          margin-top: 0.2rem;
          color: var(--gold-primary);
          font-weight: 600;
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .lang-toggle-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: transparent;
          border: 1px solid var(--border-color);
          padding: 0.35rem 0.75rem;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          color: inherit;
          transition: var(--transition-snappy);
        }

        .navbar-transparent .lang-toggle-btn {
          border-color: rgba(255, 255, 255, 0.2);
        }

        .lang-toggle-btn:hover {
          border-color: var(--gold-primary);
          color: var(--gold-primary);
        }

        .nav-action-btn {
          background: transparent;
          border: none;
          color: inherit;
          cursor: pointer;
          position: relative;
          padding: 0.25rem;
          transition: var(--transition-snappy);
        }

        .nav-action-btn:hover {
          color: var(--gold-primary);
        }

        .heart-filled {
          fill: #E06A6A;
          color: #E06A6A !important;
        }

        .badge-btn {
          display: inline-flex;
          position: relative;
        }

        .action-badge {
          position: absolute;
          top: -6px;
          right: -8px;
          background: var(--text-primary);
          color: var(--bg-secondary);
          font-size: 0.65rem;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.65rem;
          animation: badge-pulse 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .rtl-active .action-badge {
          left: -8px;
          right: auto;
        }

        .bg-gold {
          background: var(--gold-gradient) !important;
          color: var(--text-primary) !important;
        }

        .user-dot {
          position: absolute;
          bottom: 0px;
          right: 0px;
          width: 6px;
          height: 6px;
          background: var(--gold-primary);
          border-radius: 50%;
        }

        .user-menu-wrap {
          position: relative;
        }

        .user-menu-dropdown {
          position: absolute;
          top: calc(100% + 15px);
          right: 0;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-lg);
          padding: 1rem 0;
          min-width: 240px;
          z-index: 105;
          animation: fade-in-up 0.3s cubic-bezier(0.25, 1, 0.5, 1);
        }

        .rtl-active .user-menu-dropdown {
          left: 0;
          right: auto;
        }

        .dropdown-header {
          padding: 0.5rem 1.5rem;
        }

        .user-name {
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--text-primary);
        }

        .user-email {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .dropdown-divider {
          border: 0;
          border-top: 1px solid var(--border-color);
          margin: 0.5rem 0;
        }

        .dropdown-item {
          background: transparent;
          border: none;
          width: 100%;
          text-align: inherit;
          padding: 0.6rem 1.5rem;
          font-size: 0.85rem;
          color: var(--text-primary);
          cursor: pointer;
          display: block;
          font-family: inherit;
          transition: var(--transition-snappy);
        }

        .dropdown-item:hover {
          background: var(--bg-primary);
          color: var(--gold-primary);
        }

        .logout-btn {
          color: #D9534F;
        }

        .logout-btn:hover {
          background: #FFF5F5;
          color: #D9534F;
        }

        /* MOBILE MENU PANELS */
        .mobile-menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(8px);
          z-index: 200;
          animation: fade-in 0.3s ease-out;
        }

        .mobile-menu-panel {
          position: absolute;
          top: 0;
          left: 0;
          width: 85%;
          max-width: 320px;
          height: 100%;
          background: var(--bg-secondary);
          box-shadow: var(--shadow-lg);
          padding: 2rem;
          display: flex;
          flex-direction: column;
          animation: slide-in-left 0.4s cubic-bezier(0.25, 1, 0.5, 1);
        }

        .rtl-active .mobile-menu-panel {
          left: auto;
          right: 0;
          animation: slide-in-right-mobile 0.4s cubic-bezier(0.25, 1, 0.5, 1);
        }

        .mobile-menu-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          flex-shrink: 0;
        }

        .mobile-menu-header .close-btn {
          background: transparent;
          border: none;
          color: var(--text-primary);
          cursor: pointer;
        }

        .mobile-menu-auth-block {
          padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--border-color);
          margin-bottom: 1.5rem;
          flex-shrink: 0;
        }

        .mobile-auth-logged {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .avatar-circle {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(196, 164, 120, 0.15);
          color: var(--gold-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.1rem;
          border: 1px solid var(--gold-light);
        }

        .mobile-logout-btn {
          background: transparent;
          border: none;
          color: #D9534F;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          padding: 0;
          text-decoration: underline;
          margin-top: 0.15rem;
          text-align: inherit;
        }

        .mobile-auth-trigger {
          width: 100%;
          height: 44px;
        }

        .mobile-menu-links {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          overflow-y: auto;
          flex-grow: 1;
          padding-right: 0.5rem;
        }

        .mobile-menu-links > button {
          background: transparent;
          border: none;
          text-align: inherit;
          font-family: 'Playfair Display', serif;
          font-size: 1.4rem;
          font-weight: 500;
          color: var(--text-primary);
          cursor: pointer;
        }

        .mobile-menu-section {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .mobile-section-title {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--gold-primary);
          font-weight: 700;
          margin-bottom: 0.25rem;
        }

        .mobile-menu-section button {
          background: transparent;
          border: none;
          text-align: inherit;
          font-size: 0.95rem;
          padding: 0.4rem 0;
          color: var(--text-secondary);
          cursor: pointer;
          font-family: inherit;
          display: flex;
          align-items: center;
        }

        .mobile-menu-section button:hover {
          color: var(--gold-primary);
        }

        .mobile-secondary-section {
          margin-top: 0.5rem;
          padding-top: 1.5rem;
          border-top: 1px dashed var(--border-color);
        }

        .mobile-fav-link svg {
          color: #E06A6A;
        }

        .mobile-menu-footer-lang {
          margin-top: auto;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border-color);
          flex-shrink: 0;
        }

        .mobile-lang-btn {
          width: 100%;
          height: 44px;
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition-snappy);
        }

        .mobile-lang-btn:hover {
          border-color: var(--gold-primary);
          color: var(--gold-primary);
        }

        /* SEARCH OVERLAY */
        .search-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(253, 251, 250, 0.95);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          z-index: 250;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          animation: fade-in 0.4s ease-out;
        }

        .search-close-btn {
          position: absolute;
          top: 2rem;
          right: 2rem;
          background: transparent;
          border: none;
          color: var(--text-primary);
          cursor: pointer;
          transition: var(--transition-snappy);
        }

        .rtl-active .search-close-btn {
          left: 2rem;
          right: auto;
        }

        .search-container {
          width: 100%;
          max-width: 700px;
          text-align: center;
        }

        .search-title {
          font-size: 2.2rem;
          margin-bottom: 2rem;
          color: var(--text-primary);
        }

        .search-bar {
          display: flex;
          align-items: center;
          border-bottom: 2px solid var(--text-primary);
          padding: 0.8rem 0;
          position: relative;
        }

        .search-bar-icon {
          color: var(--text-secondary);
          margin-right: 1rem;
        }

        .rtl-active .search-bar-icon {
          margin-right: 0;
          margin-left: 1rem;
        }

        .search-bar input {
          width: 100%;
          background: transparent;
          border: none;
          font-size: 1.5rem;
          color: var(--text-primary);
          font-weight: 300;
        }

        .search-bar input::placeholder {
          color: #B2AFA8;
        }

        .search-hint {
          font-size: 0.8rem;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-top: 1rem;
        }

        /* Animations */
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slide-in-left {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        @keyframes slide-in-right-mobile {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes badge-pulse {
          0% { transform: scale(0.6); }
          100% { transform: scale(1); }
        }

        @media (max-width: 768px) {
          .desktop-action {
            display: none !important;
          }
          .nav-links-desktop {
            display: none;
          }
          .mobile-toggle {
            display: block;
          }
          .nav-logo {
            font-size: 1.3rem;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
          }
          .nav-actions {
            gap: 1rem;
          }
          .navbar-container {
            padding: 0 1rem;
            position: relative;
          }
          .navbar {
            height: 70px;
          }
          .search-title {
            font-size: 1.6rem;
          }
          .search-bar input {
            font-size: 1.1rem;
          }
        }
      `}</style>
    </>
  );
}
