import React, { useState, useEffect } from 'react';
import { Badge, AutoComplete, Dropdown, Menu } from 'antd';
import { ShoppingBag, Search, User, Menu as MenuIcon, X, Heart, Settings } from 'lucide-react';
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
    setCurrentTab('Home');
    setMobileMenuOpen(false);
  };

  const toggleLanguage = () => {
    setLang(lang === 'EN' ? 'AR' : 'EN');
  };

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
    localStorage.setItem('lazuli_search_query', value);
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

  const profileMenu = (
    <Menu className="p-3 shadow-xl border border-[#EAE3D9] bg-white min-w-[200px] !rounded-none font-sans">
      <div className="px-3 py-2 border-b border-[#EAE3D9] mb-2 font-sans">
        <p className="font-semibold text-sm text-[#1C1A17]">{t('welcome')}, {user?.name || (lang === 'EN' ? 'Client' : 'عميلنا')}</p>
        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
      </div>
      <Menu.Item key="orders" onClick={() => setCurrentTab('Orders')} className="hover:!bg-[#FAF9F6] !rounded-none">
        <span className="text-[#1C1A17] text-sm font-medium hover:text-[#C4A478] font-sans">{t('orders')}</span>
      </Menu.Item>
      <Menu.Item key="admin" onClick={() => setCurrentTab('Admin')} className="hover:!bg-[#FAF9F6] !rounded-none">
        <div className="flex items-center gap-2 text-[#1C1A17] text-sm font-medium hover:text-[#C4A478] font-sans">
          <Settings size={14} />
          <span>{t('adminPanel')}</span>
        </div>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" onClick={handleLogout} className="hover:bg-[#FFF5F5] !rounded-none">
        <span className="text-red-500 text-sm font-semibold font-sans">{t('signOut')}</span>
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 h-20 ${
          isScrolled || currentTab !== 'Home' 
            ? 'bg-[#FAF9F6]/95 backdrop-blur-md border-b border-[#EAE3D9] text-[#1C1A17] shadow-sm' 
            : 'bg-transparent border-b border-white/10 text-[#FAF8F5]'
        }`}
      >
        <div className="max-w-7xl h-full mx-auto flex items-center justify-between px-6 md:px-8">
          
          {/* Left: Hamburger menu for mobile */}
          <button 
            className="bg-transparent border-none text-current cursor-pointer block lg:hidden" 
            onClick={() => setMobileMenuOpen(true)}
          >
            <MenuIcon size={24} />
          </button>

          {/* Left/Middle: Nav items for desktop */}
          <div className="hidden lg:flex items-center gap-8 font-sans font-medium text-xs uppercase tracking-widest h-full">
            <button 
              className={`bg-transparent border-none text-current cursor-pointer py-2 relative transition-colors hover:text-[#C4A478] ${
                currentTab === 'Home' ? 'border-b-2 border-[#C4A478] text-[#C4A478]' : ''
              }`}
              onClick={() => { setCurrentTab('Home'); setSelectedCategory('All'); setSelectedCollection('All'); }}
            >
              {t('home')}
            </button>
            
            {/* Mega Category Trigger */}
            <div className="mega-menu-trigger group py-6 h-full flex items-center relative">
              <button 
                className={`flex items-center gap-1 bg-transparent border-none text-current cursor-pointer transition-colors hover:text-[#C4A478] ${
                  currentTab === 'Shop' ? 'text-[#C4A478]' : ''
                }`} 
                onClick={() => handleCategoryClick('All')}
              >
                <span>{t('shop')}</span>
              </button>
              {/* MEGA MENU CONTAINER */}
              <div className="opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 absolute top-full left-1/2 -translate-x-1/2 w-[90vw] max-w-4xl bg-white border border-[#EAE3D9] shadow-xl p-8 z-50 grid grid-cols-4 gap-8">
                <div>
                  <h4 className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#1C1A17] mb-4 pb-2 border-b border-[#FAF9F6]">
                    {lang === 'EN' ? 'Store Categories' : 'فئات المتجر'}
                  </h4>
                  <ul className="flex flex-col gap-2.5">
                    <li>
                      <button 
                        onClick={() => handleCategoryClick('Handmade Copper')}
                        className="bg-transparent border-none text-[#706C66] text-xs font-normal cursor-pointer transition-all hover:text-[#C4A478] hover:translate-x-1"
                      >
                        {lang === 'EN' ? 'Handmade Copper' : 'النحاس الهاند ميد'}
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => handleCategoryClick('Precious Stones')}
                        className="bg-transparent border-none text-[#706C66] text-xs font-normal cursor-pointer transition-all hover:text-[#C4A478] hover:translate-x-1"
                      >
                        {lang === 'EN' ? 'Precious Stones' : 'الأحجار الكريمة الهاند ميد'}
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => handleCategoryClick('Gift Boxes & Bundles')}
                        className="bg-transparent border-none text-[#706C66] text-xs font-normal cursor-pointer transition-all hover:text-[#C4A478] hover:translate-x-1"
                      >
                        {lang === 'EN' ? 'Gift Boxes & Bundles' : 'الهدايا والبوكسات'}
                      </button>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#1C1A17] mb-4 pb-2 border-b border-[#FAF9F6]">
                    {lang === 'EN' ? 'Subcategories' : 'أقسام فرعية'}
                  </h4>
                  <ul className="flex flex-col gap-2.5">
                    <li>
                      <button 
                        onClick={() => { setSelectedCategory('All'); setSelectedCollection('All'); setCurrentTab('Shop'); }}
                        className="bg-transparent border-none text-[#706C66] text-xs font-normal cursor-pointer transition-all hover:text-[#C4A478] hover:translate-x-1"
                      >
                        {t('all')}
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => handleCategoryClick('Handmade Copper')}
                        className="bg-transparent border-none text-[#706C66] text-xs font-normal cursor-pointer transition-all hover:text-[#C4A478] hover:translate-x-1"
                      >
                        {lang === 'EN' ? 'Copper Cuff' : 'أساور نحاس'}
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => handleCategoryClick('Precious Stones')}
                        className="bg-transparent border-none text-[#706C66] text-xs font-normal cursor-pointer transition-all hover:text-[#C4A478] hover:translate-x-1"
                      >
                        {lang === 'EN' ? 'Stone Rings' : 'خواتم مرصعة بالجرام'}
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => handleCategoryClick('Gift Boxes & Bundles')}
                        className="bg-transparent border-none text-[#706C66] text-xs font-normal cursor-pointer transition-all hover:text-[#C4A478] hover:translate-x-1"
                      >
                        {lang === 'EN' ? 'Premium Bundles' : 'بوكسات هدايا'}
                      </button>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#1C1A17] mb-4 pb-2 border-b border-[#FAF9F6]">
                    {t('collections')}
                  </h4>
                  <ul className="flex flex-col gap-2.5">
                    <li>
                      <button 
                        onClick={() => handleCollectionClick("Nature's Mosaic")}
                        className="bg-transparent border-none text-[#706C66] text-xs font-normal cursor-pointer transition-all hover:text-[#C4A478] hover:translate-x-1"
                      >
                        {lang === 'EN' ? "Nature's Mosaic" : "فسيفساء الطبيعة"}
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => handleCollectionClick("El Kawthar")}
                        className="bg-transparent border-none text-[#706C66] text-xs font-normal cursor-pointer transition-all hover:text-[#C4A478] hover:translate-x-1"
                      >
                        {lang === 'EN' ? "El Kawthar" : "الكوثر"}
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => handleCollectionClick("Oumy")}
                        className="bg-transparent border-none text-[#706C66] text-xs font-normal cursor-pointer transition-all hover:text-[#C4A478] hover:translate-x-1"
                      >
                        {lang === 'EN' ? "Oumy" : "أمي"}
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => handleCollectionClick("Calligraphy")}
                        className="bg-transparent border-none text-[#706C66] text-xs font-normal cursor-pointer transition-all hover:text-[#C4A478] hover:translate-x-1"
                      >
                        {lang === 'EN' ? "Calligraphy" : "الخط العربي"}
                      </button>
                    </li>
                  </ul>
                </div>
                <div className="flex flex-col justify-between border-l border-[#EAE3D9] pl-6 rtl:border-l-0 rtl:border-r rtl:pr-6 rtl:pl-0">
                  <div>
                    <h4 className="font-serif text-sm font-bold tracking-widest text-[#C4A478]">LAZULI</h4>
                    <p className="text-[11px] text-gray-500 leading-relaxed mt-2 font-sans font-normal">
                      {lang === 'EN' 
                        ? 'A celebration of Egyptian heritage and traditional slow craftsmanship. Pure handmade copper meeting divine celestial semi-precious gemstones.' 
                        : 'احتفاء بالتراث المصري وصياغة المعادن البطيئة. نحاس نقي مصنوع باليد يلتقي بأحجار كريمة طبيعية ساحرة.'}
                    </p>
                  </div>
                  <button 
                    onClick={() => { setCurrentTab('Shop'); setSelectedCategory('All'); }}
                    className="bg-transparent border-none text-[10px] font-semibold uppercase tracking-widest text-[#1C1A17] hover:text-[#C4A478] text-left rtl:text-right mt-4 flex items-center gap-1 font-sans cursor-pointer"
                  >
                    <span>{lang === 'EN' ? 'Explore Catalog' : 'استكشف المعرض'} →</span>
                  </button>
                </div>
              </div>
            </div>

            <button 
              className={`bg-transparent border-none text-current cursor-pointer py-2 relative transition-colors hover:text-[#C4A478] ${
                currentTab === 'Orders' ? 'border-b-2 border-[#C4A478] text-[#C4A478]' : ''
              }`}
              onClick={() => { if (user) { setCurrentTab('Orders'); } else { setAuthOpen(true); } }}
            >
              {t('orders')}
            </button>
          </div>

          {/* Center: Brand Logo */}
          <div 
            className="flex flex-col items-center justify-center font-serif text-xl md:text-2xl font-bold tracking-[0.15em] cursor-pointer leading-none text-center" 
            onClick={() => { setCurrentTab('Home'); setSelectedCategory('All'); setSelectedCollection('All'); }}
          >
            <span className="text-current tracking-[0.2em] font-serif">LAZULI</span>
            <span className="block font-sans text-[8px] tracking-[0.35em] mt-1 text-[#C4A478] font-bold uppercase">
              COPPER & STONES
            </span>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-4 md:gap-6">
            
            {/* Bilingual Toggle Button! */}
            <button 
              className="hidden sm:inline-flex items-center gap-1.5 bg-transparent border border-current/30 px-3 py-1 text-[11px] font-semibold tracking-wider uppercase cursor-pointer hover:text-[#C4A478] hover:border-[#C4A478] transition-all font-sans" 
              onClick={toggleLanguage}
            >
              <span>🌐 {lang === 'EN' ? 'العربية' : 'English'}</span>
            </button>

            {/* Search Trigger */}
            <button 
              className="bg-transparent border-none text-current cursor-pointer relative p-1 transition-colors hover:text-[#C4A478] inline-flex items-center justify-center" 
              onClick={() => setSearchOpen(true)}
            >
              <Search size={20} />
            </button>

            {/* Wishlist Icon */}
            <button 
              className="bg-transparent border-none text-current cursor-pointer relative p-1 transition-colors hover:text-[#C4A478] inline-flex items-center justify-center hidden sm:inline-flex" 
              onClick={() => { setSelectedCategory('All'); setSelectedCollection('All'); setCurrentTab('Shop'); }}
            >
              <Badge count={favorites.length} size="small" offset={[2, -4]} color="#C4A478">
                <Heart size={20} className={favorites.length > 0 ? 'fill-[#E06A6A] text-[#E06A6A]' : ''} />
              </Badge>
            </button>

            {/* User Profile Menu */}
            {user ? (
              <Dropdown overlay={profileMenu} trigger={['click']} placement="bottomRight">
                <button className="bg-transparent border-none text-current cursor-pointer relative p-1 transition-colors hover:text-[#C4A478] inline-flex items-center justify-center">
                  <User size={20} />
                  <span className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-[#C4A478] rounded-full"></span>
                </button>
              </Dropdown>
            ) : (
              <button 
                className="bg-transparent border-none text-current cursor-pointer relative p-1 transition-colors hover:text-[#C4A478] inline-flex items-center justify-center" 
                onClick={() => setAuthOpen(true)}
              >
                <User size={20} />
              </button>
            )}

            {/* Shopping Bag Trigger */}
            <button 
              className="bg-transparent border-none text-current cursor-pointer relative p-1 transition-colors hover:text-[#C4A478] inline-flex items-center justify-center" 
              onClick={() => setCartOpen(true)}
            >
              <Badge count={totalCartCount} size="small" offset={[4, -4]} color="#D37F4B">
                <ShoppingBag size={20} />
              </Badge>
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE NAV DRAWER OVERLAY */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 w-full h-full bg-black/40 backdrop-blur-sm z-[200] flex animate-fade-in"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div 
            className={`w-[85%] max-w-[320px] h-full bg-white shadow-2xl p-6 flex flex-col transition-all duration-300 ${
              lang === 'AR' ? 'mr-auto ml-0' : 'ml-0 mr-auto'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex flex-col font-serif text-lg font-bold tracking-widest leading-none">
                <span>LAZULI</span>
                <span className="block font-sans text-[7px] tracking-[0.3em] mt-1 text-[#C4A478] font-bold uppercase">
                  COPPER & STONES
                </span>
              </div>
              <button 
                className="bg-transparent border-none text-[#1C1A17] cursor-pointer" 
                onClick={() => setMobileMenuOpen(false)}
              >
                <X size={24} />
              </button>
            </div>

            {/* Mobile Auth Header */}
            <div className="pb-6 border-b border-[#EAE3D9] mb-6">
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#C4A478]/15 text-[#C4A478] flex items-center justify-center font-bold font-sans">
                    {user.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <div>
                    <p className="font-sans text-xs font-semibold text-[#1C1A17]">{t('welcome')}, {user.name || (lang === 'EN' ? 'Artisan' : 'صائغنا')}</p>
                    <button 
                      className="bg-transparent border-none text-red-500 text-[10px] font-bold cursor-pointer underline p-0 mt-1" 
                      onClick={handleLogout}
                    >
                      {t('signOut')}
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  className="w-full h-11 bg-[#1C1A17] hover:bg-[#C4A478] text-white font-sans text-xs font-semibold uppercase tracking-widest border-none cursor-pointer transition-colors" 
                  onClick={() => { setAuthOpen(true); setMobileMenuOpen(false); }}
                >
                  {lang === 'EN' ? 'Sign In / Register' : 'تسجيل الدخول / التسجيل'}
                </button>
              )}
            </div>
            
            <div className="flex flex-col gap-6 overflow-y-auto flex-grow pr-2">
              <button 
                onClick={() => { setCurrentTab('Home'); setMobileMenuOpen(false); }}
                className="bg-transparent border-none text-left rtl:text-right font-serif text-lg font-medium text-[#1C1A17] cursor-pointer"
              >
                {t('home')}
              </button>
              
              <div className="flex flex-col gap-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#C4A478] font-sans">{t('shop')}</p>
                <button 
                  onClick={() => handleCategoryClick('All')}
                  className="bg-transparent border-none text-left rtl:text-right text-sm py-1 text-[#706C66] cursor-pointer font-sans"
                >
                  {t('all')}
                </button>
                <button 
                  onClick={() => handleCategoryClick('Handmade Copper')}
                  className="bg-transparent border-none text-left rtl:text-right text-sm py-1 text-[#706C66] cursor-pointer font-sans"
                >
                  {lang === 'EN' ? 'Handmade Copper' : 'النحاس الهاند ميد'}
                </button>
                <button 
                  onClick={() => handleCategoryClick('Precious Stones')}
                  className="bg-transparent border-none text-left rtl:text-right text-sm py-1 text-[#706C66] cursor-pointer font-sans"
                >
                  {lang === 'EN' ? 'Precious Stones' : 'الأحجار الكريمة الهاند ميد'}
                </button>
                <button 
                  onClick={() => handleCategoryClick('Gift Boxes & Bundles')}
                  className="bg-transparent border-none text-left rtl:text-right text-sm py-1 text-[#706C66] cursor-pointer font-sans"
                >
                  {lang === 'EN' ? 'Gift Boxes' : 'الهدايا والبوكسات'}
                </button>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#C4A478] font-sans">{t('collections')}</p>
                <button 
                  onClick={() => handleCollectionClick("Nature's Mosaic")}
                  className="bg-transparent border-none text-left rtl:text-right text-sm py-1 text-[#706C66] cursor-pointer font-sans"
                >
                  {lang === 'EN' ? "Nature's Mosaic" : "فسيفساء الطبيعة"}
                </button>
                <button 
                  onClick={() => handleCollectionClick("El Kawthar")}
                  className="bg-transparent border-none text-left rtl:text-right text-sm py-1 text-[#706C66] cursor-pointer font-sans"
                >
                  {lang === 'EN' ? "El Kawthar" : "الكوثر"}
                </button>
                <button 
                  onClick={() => handleCollectionClick("Oumy")}
                  className="bg-transparent border-none text-left rtl:text-right text-sm py-1 text-[#706C66] cursor-pointer font-sans"
                >
                  {lang === 'EN' ? "Oumy" : "أمي"}
                </button>
                <button 
                  onClick={() => handleCollectionClick("Calligraphy")}
                  className="bg-transparent border-none text-left rtl:text-right text-sm py-1 text-[#706C66] cursor-pointer font-sans"
                >
                  {lang === 'EN' ? "Calligraphy" : "الخط العربي"}
                </button>
              </div>

              <div className="flex flex-col gap-2 border-t border-[#EAE3D9] pt-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#C4A478] font-sans">
                  {lang === 'EN' ? 'Account & Wishlist' : 'الحساب والمفضلة'}
                </p>
                
                <button 
                  className="bg-transparent border-none text-left rtl:text-right text-sm py-1 text-[#706C66] cursor-pointer font-sans flex items-center gap-2"
                  onClick={() => { setSelectedCategory('All'); setSelectedCollection('All'); setCurrentTab('Shop'); setMobileMenuOpen(false); }}
                >
                  <Heart size={14} className={favorites.length > 0 ? 'fill-[#E06A6A] text-[#E06A6A]' : ''} />
                  <span>{t('favorites')} ({favorites.length})</span>
                </button>

                {user && (
                  <button 
                    className="bg-transparent border-none text-left rtl:text-right text-sm py-1 text-[#706C66] cursor-pointer font-sans"
                    onClick={() => { setCurrentTab('Orders'); setMobileMenuOpen(false); }}
                  >
                    <span>{t('orders')}</span>
                  </button>
                )}

                {user && (
                  <button 
                    className="bg-transparent border-none text-left rtl:text-right text-sm py-1 text-[#706C66] cursor-pointer font-sans"
                    onClick={() => { setCurrentTab('Admin'); setMobileMenuOpen(false); }}
                  >
                    <span>{t('adminPanel')}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Language Switcher at the bottom */}
            <div className="mt-auto pt-6 border-t border-[#EAE3D9]">
              <button 
                className="w-full h-11 bg-[#FAF9F6] border border-[#EAE3D9] font-sans text-xs font-semibold cursor-pointer hover:text-[#C4A478] hover:border-[#C4A478] transition-colors flex items-center justify-center gap-1.5"
                onClick={() => { toggleLanguage(); setMobileMenuOpen(false); }}
              >
                <span>🌐 {lang === 'EN' ? 'العربية (Arabic)' : 'English (الإنجليزية)'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SEARCH FULLSCREEN BLUR OVERLAY WITH ANT AUTOCOMPLETE */}
      {searchOpen && (
        <div className="fixed inset-0 w-full h-full bg-[#1C1A17]/95 backdrop-blur-md z-[1000] flex items-center justify-center animate-fade-in">
          <button 
            className="absolute top-8 right-8 bg-transparent border-none text-white cursor-pointer hover:text-[#C4A478] hover:rotate-90 transition-all" 
            onClick={() => setSearchOpen(false)}
          >
            <X size={30} />
          </button>
          <div className="max-w-2xl px-6 w-full text-center">
            <h2 className="font-serif text-3xl md:text-4xl text-white tracking-wide mb-6">{t('searchTitle')}</h2>
            <div className="flex items-center border border-[#C4A478] bg-white px-4 py-2 w-full shadow-2xl">
              <Search className="text-[#C4A478] mr-3 ml-3" size={24} />
              
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
                  className="w-full text-lg border-none outline-none focus:ring-0 text-[#1C1A17] bg-transparent"
                  autoFocus
                />
              </AutoComplete>
            </div>
            <p className="mt-4 text-[10px] text-gray-400 uppercase tracking-[0.2em]">{t('searchEnter')}</p>
          </div>
        </div>
      )}
    </>
  );
}
