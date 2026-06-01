import React, { useState, useEffect } from 'react';
import { Badge, AutoComplete, Input, Dropdown, Menu, Space } from 'antd';
import { ShoppingBag, Search, User, Menu as MenuIcon, X, Heart, Settings, Languages, Compass } from 'lucide-react';
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
  const [searchOptions, setSearchOptions] = useState([]);
  const [user, setUser] = useState(null);

  // Monitor scrolling to add shadow/white background on demand
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Monitor auth state changes
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
    setCurrentTab('Home');
    setMobileMenuOpen(false);
  };

  const toggleLanguage = () => {
    setLang(lang === 'EN' ? 'AR' : 'EN');
  };

  // Mock quick links or suggestions for Search Autocomplete
  const defaultSearchSuggestions = [
    { value: lang === 'EN' ? 'Copper Cuff' : 'سوار نحاسي' },
    { value: lang === 'EN' ? 'Turquoise Ring' : 'خاتم فيروز' },
    { value: lang === 'EN' ? 'Amethyst Necklace' : 'قلادة أميثيست' },
    { value: lang === 'EN' ? 'Agate Earrings' : 'أقراط عقيق' },
    { value: lang === 'EN' ? 'Gift Box' : 'صندوق هدايا' }
  ];

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    if (!value) {
      setSearchOptions([]);
    } else {
      // Filter suggestions
      const filtered = defaultSearchSuggestions.filter(item => 
        item.value.toLowerCase().includes(value.toLowerCase())
      );
      setSearchOptions(filtered);
    }
  };

  const handleSearchSelect = (value) => {
    setSearchQuery(value);
    setSelectedCategory('All');
    setSelectedCollection('All');
    setCurrentTab('Shop');
    setSearchOpen(false);
    // Preserving the query context in local storage so Shop page filters immediately
    localStorage.setItem('lazuli_search_query', value);
    // Dispatch a custom event to notify Shop page to refresh search input immediately!
    window.dispatchEvent(new Event('search_query_updated'));
  };

  const executeSearch = () => {
    setSelectedCategory('All');
    setSelectedCollection('All');
    setCurrentTab('Shop');
    setSearchOpen(false);
    localStorage.setItem('lazuli_search_query', searchQuery);
    window.dispatchEvent(new Event('search_query_updated'));
  };

  // Antd Menu Dropdowns for dynamic Header navigation
  const profileMenu = (
    <Menu className="custom-dropdown-menu p-3 shadow-xl border border-[#EAE3D9] bg-white min-w-[200px]">
      <div className="px-3 py-2 border-b border-[#EAE3D9] mb-2">
        <p className="font-semibold text-sm text-[#1C1A17]">{t('welcome')}, {user?.name || (lang === 'EN' ? 'Client' : 'عميلنا')}</p>
        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
      </div>
      <Menu.Item key="orders" onClick={() => setCurrentTab('Orders')}>
        <span className="text-[#1C1A17] text-sm font-medium hover:text-[#C4A478]">{t('orders')}</span>
      </Menu.Item>
      <Menu.Item key="admin" onClick={() => setCurrentTab('Admin')}>
        <div className="flex items-center gap-2 text-[#1C1A17] text-sm font-medium hover:text-[#C4A478]">
          <Settings size={14} />
          <span>{t('adminPanel')}</span>
        </div>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" onClick={handleLogout} className="hover:bg-[#FFF5F5]">
        <span className="text-red-500 text-sm font-semibold">{t('signOut')}</span>
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <nav className={`navbar ${isScrolled || currentTab !== 'Home' ? 'navbar-solid' : 'navbar-transparent'}`}>
        <div className="navbar-container">
          
          {/* Left: Hamburger menu for mobile */}
          <button className="mobile-toggle block lg:hidden" onClick={() => setMobileMenuOpen(true)}>
            <MenuIcon size={24} />
          </button>

          {/* Left/Middle: Nav items for desktop */}
          <div className="nav-links-desktop hidden lg:flex">
            <button 
              className={currentTab === 'Home' ? 'active' : ''} 
              onClick={() => { setCurrentTab('Home'); setSelectedCategory('All'); setSelectedCollection('All'); }}
            >
              {t('home')}
            </button>
            
            {/* Mega Category Trigger */}
            <div className="mega-menu-trigger group py-5">
              <button className={`flex items-center gap-1 ${currentTab === 'Shop' ? 'active' : ''}`} onClick={() => handleCategoryClick('All')}>
                <span>{t('shop')}</span>
              </button>
              {/* MEGA MENU CONTAINER */}
              <div className="mega-menu-container opacity-0 invisible group-hover:opacity-100 group-hover:visible">
                <div className="mega-menu-content grid grid-cols-4 gap-8">
                  <div>
                    <h4 className="mega-menu-column-title">{lang === 'EN' ? 'Store Categories' : 'فئات المتجر'}</h4>
                    <ul className="mega-menu-list">
                      <li><button onClick={() => handleCategoryClick('Handmade Copper')}>{lang === 'EN' ? 'Handmade Copper' : 'النحاس الهاند ميد'}</button></li>
                      <li><button onClick={() => handleCategoryClick('Precious Stones')}>{lang === 'EN' ? 'Precious Stones' : 'الأحجار الكريمة الهاند ميد'}</button></li>
                      <li><button onClick={() => handleCategoryClick('Gift Boxes & Bundles')}>{lang === 'EN' ? 'Gift Boxes & Bundles' : 'الهدايا والبوكسات'}</button></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="mega-menu-column-title">{lang === 'EN' ? 'Subcategories' : 'أقسام فرعية'}</h4>
                    <ul className="mega-menu-list">
                      <li><button onClick={() => { setSelectedCategory('All'); setSelectedCollection('All'); setCurrentTab('Shop'); }}>{t('all')}</button></li>
                      <li><button onClick={() => handleCategoryClick('Handmade Copper')}>{lang === 'EN' ? 'Copper Cuff' : 'أساور نحاس'}</button></li>
                      <li><button onClick={() => handleCategoryClick('Precious Stones')}>{lang === 'EN' ? 'Stone Rings' : 'خواتم مرصعة بالجرام'}</button></li>
                      <li><button onClick={() => handleCategoryClick('Gift Boxes & Bundles')}>{lang === 'EN' ? 'Premium Bundles' : 'بوكسات هدايا'}</button></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="mega-menu-column-title">{t('collections')}</h4>
                    <ul className="mega-menu-list">
                      <li><button onClick={() => handleCollectionClick("Nature's Mosaic")}>{lang === 'EN' ? "Nature's Mosaic" : "فسيفساء الطبيعة"}</button></li>
                      <li><button onClick={() => handleCollectionClick("El Kawthar")}>{lang === 'EN' ? "El Kawthar" : "الكوثر"}</button></li>
                      <li><button onClick={() => handleCollectionClick("Oumy")}>{lang === 'EN' ? "Oumy" : "أمي"}</button></li>
                      <li><button onClick={() => handleCollectionClick("Calligraphy")}>{lang === 'EN' ? "Calligraphy" : "الخط العربي"}</button></li>
                    </ul>
                  </div>
                  <div className="mega-menu-brand-card flex flex-col justify-between border-l border-[#EAE3D9] pl-6 rtl:border-l-0 rtl:border-r rtl:pr-6 rtl:pl-0">
                    <div>
                      <h4 className="mega-menu-column-title text-brand-gold tracking-widest">LAZULI</h4>
                      <p className="text-xs text-gray-500 leading-relaxed mt-2">
                        {lang === 'EN' 
                          ? 'A celebration of Egyptian heritage and traditional slow craftsmanship. Pure handmade copper meeting divine celestial semi-precious gemstones.' 
                          : 'احتفاء بالتراث المصري وصياغة المعادن البطيئة. نحاس نقي مصنوع باليد يلتقي بأحجار كريمة طبيعية ساحرة.'}
                      </p>
                    </div>
                    <button 
                      onClick={() => { setCurrentTab('Shop'); setSelectedCategory('All'); }}
                      className="text-xs font-semibold uppercase tracking-widest text-[#1C1A17] hover:text-brand-gold text-left rtl:text-right mt-4 flex items-center gap-1"
                    >
                      <span>{lang === 'EN' ? 'Explore Catalog' : 'استكشف المعرض'} →</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <button 
              className={currentTab === 'Orders' ? 'active' : ''} 
              onClick={() => { if (user) { setCurrentTab('Orders'); } else { setAuthOpen(true); } }}
            >
              {t('orders')}
            </button>
          </div>

          {/* Center: Brand Logo */}
          <div className="nav-logo" onClick={() => { setCurrentTab('Home'); setSelectedCategory('All'); setSelectedCollection('All'); }}>
            LAZULI
            <span>COPPER & STONES</span>
          </div>

          {/* Right: Actions */}
          <div className="nav-actions flex items-center gap-6">
            
            {/* Bilingual Toggle Button! */}
            <button className="lang-toggle-btn hidden sm:inline-flex" onClick={toggleLanguage}>
              <span>🌐 {lang === 'EN' ? 'العربية' : 'English'}</span>
            </button>

            {/* Search Trigger */}
            <button className="nav-action-btn" onClick={() => setSearchOpen(true)}>
              <Search size={20} />
            </button>

            {/* Wishlist Icon */}
            <button 
              className="nav-action-btn badge-btn hidden sm:inline-flex" 
              onClick={() => { setSelectedCategory('All'); setSelectedCollection('All'); setCurrentTab('Shop'); }}
            >
              <Badge count={favorites.length} size="small" offset={[2, -4]} color="#C4A478">
                <Heart size={20} className={favorites.length > 0 ? 'heart-filled' : ''} />
              </Badge>
            </button>

            {/* User Profile Menu */}
            {user ? (
              <Dropdown overlay={profileMenu} trigger={['click']} placement="bottomRight">
                <button className="nav-action-btn hidden sm:inline-block relative">
                  <User size={20} />
                  <span className="user-dot bg-brand-gold"></span>
                </button>
              </Dropdown>
            ) : (
              <button className="nav-action-btn hidden sm:inline-block" onClick={() => setAuthOpen(true)}>
                <User size={20} />
              </button>
            )}

            {/* Shopping Bag Trigger */}
            <button className="nav-action-btn badge-btn" onClick={() => setCartOpen(true)}>
              <Badge count={totalCartCount} size="small" offset={[4, -4]} color="#D37F4B">
                <ShoppingBag size={20} />
              </Badge>
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE NAV DRAWER OVERLAY */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-menu-panel" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <div className="nav-logo">
                LAULI
                <span>COPPER & STONES</span>
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
                <button onClick={() => handleCategoryClick('Handmade Copper')}>{lang === 'EN' ? 'Handmade Copper (النحاس)' : 'النحاس الهاند ميد'}</button>
                <button onClick={() => handleCategoryClick('Precious Stones')}>{lang === 'EN' ? 'Precious Stones (الأحجار)' : 'الأحجار الكريمة الهاند ميد'}</button>
                <button onClick={() => handleCategoryClick('Gift Boxes & Bundles')}>{lang === 'EN' ? 'Gift Boxes (الهدايا)' : 'الهدايا والبوكسات'}</button>
              </div>

              <div className="mobile-menu-section">
                <p className="mobile-section-title">{t('collections')}</p>
                <button onClick={() => handleCollectionClick("Nature's Mosaic")}>{lang === 'EN' ? "Nature's Mosaic" : "فسيفساء الطبيعة"}</button>
                <button onClick={() => handleCollectionClick("El Kawthar")}>{lang === 'EN' ? "El Kawthar" : "الكوثر"}</button>
                <button onClick={() => handleCollectionClick("Oumy")}>{lang === 'EN' ? "Oumy" : "أمي"}</button>
                <button onClick={() => handleCollectionClick("Calligraphy")}>{lang === 'EN' ? "Calligraphy" : "الخط العربي"}</button>
              </div>

              {/* Mobile-only secondary quick actions */}
              <div className="mobile-menu-section mobile-secondary-section">
                <p className="mobile-section-title">{lang === 'EN' ? 'Account & Wishlist' : 'الحساب والمفضلة'}</p>
                
                <button className="mobile-fav-link" onClick={() => { setSelectedCategory('All'); setSelectedCollection('All'); setCurrentTab('Shop'); setMobileMenuOpen(false); }}>
                  <Heart size={16} className={`${favorites.length > 0 ? 'heart-filled' : ''} mr-2 ml-2`} />
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

      {/* SEARCH FULLSCREEN BLUR OVERLAY WITH ANT AUTOCOMPLETE */}
      {searchOpen && (
        <div className="search-overlay">
          <button className="search-close-btn" onClick={() => setSearchOpen(false)}>
            <X size={30} />
          </button>
          <div className="search-container max-w-2xl px-6 w-full text-center">
            <h2 className="search-title mb-6">{t('searchTitle')}</h2>
            <div className="search-bar flex items-center border border-[#C4A478] bg-white px-4 py-2 w-full shadow-lg">
              <Search className="search-bar-icon text-brand-gold mr-3 ml-3" size={24} />
              
              <AutoComplete
                className="w-full text-left rtl:text-right"
                options={searchOptions}
                value={searchQuery}
                onSelect={handleSearchSelect}
                onChange={handleSearchChange}
                placeholder={t('searchHint')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    executeSearch();
                  }
                }}
              >
                <input 
                  type="text" 
                  className="w-full text-lg border-none outline-none focus:ring-0 text-[#1C1A17]"
                  style={{ background: 'transparent' }}
                  autoFocus
                />
              </AutoComplete>
            </div>
            <p className="search-hint mt-3 text-xs text-[#FAF8F5] uppercase tracking-widest">{t('searchEnter')}</p>
          </div>
        </div>
      )}

      <style>{`
        /* Mega Menu Styles */
        .mega-menu-trigger {
          position: relative;
        }

        .mega-menu-container {
          position: fixed;
          top: 80px;
          left: 0;
          width: 100vw;
          background: #FFFFFF;
          border-bottom: 1px solid #EAE3D9;
          box-shadow: 0 10px 30px rgba(0,0,0,0.06);
          padding: 2.5rem 10%;
          z-index: 99;
          transition: var(--transition-smooth);
          transform: translateY(10px);
        }

        .mega-menu-content {
          max-width: 1400px;
          margin: 0 auto;
        }

        .mega-menu-column-title {
          font-family: 'Outfit', sans-serif;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--text-primary);
          font-weight: 700;
          margin-bottom: 1.2rem;
          border-bottom: 1px solid #FAF9F6;
          padding-bottom: 0.5rem;
        }

        .mega-menu-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .mega-menu-list button {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          font-size: 0.85rem;
          font-weight: 400;
          cursor: pointer;
          transition: var(--transition-snappy);
          padding: 0;
          text-align: left;
        }

        .rtl-active .mega-menu-list button {
          text-align: right;
        }

        .mega-menu-list button:hover {
          color: var(--gold-primary);
          transform: translateX(3px);
        }

        .rtl-active .mega-menu-list button:hover {
          transform: translateX(-3px);
        }

        .search-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(28, 26, 23, 0.96);
          backdrop-filter: blur(12px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fade-in 0.3s ease-out;
        }

        .search-close-btn {
          position: absolute;
          top: 2rem;
          right: 2rem;
          background: transparent;
          border: none;
          color: var(--bg-primary);
          cursor: pointer;
          transition: var(--transition-snappy);
        }

        .rtl-active .search-close-btn {
          right: auto;
          left: 2rem;
        }

        .search-close-btn:hover {
          color: var(--gold-primary);
          transform: rotate(90deg);
        }

        .search-title {
          font-family: 'Playfair Display', serif;
          font-size: 2.2rem;
          color: var(--bg-primary);
          letter-spacing: 0.05em;
        }

        /* Antd AutoComplete input override */
        .search-bar .ant-select-selector {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
          height: 100% !important;
        }

        .search-bar .ant-select-selection-search-input {
          height: 100% !important;
          font-size: 1.25rem !important;
        }
      `}</style>
    </>
  );
}
