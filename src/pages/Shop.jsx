import React, { useState, useMemo, useEffect } from 'react';
import { Slider, Switch, Button, Badge, Drawer, Select, Radio, Empty } from 'antd';
import { SlidersHorizontal, Search, RotateCcw, X, ArrowUpDown } from 'lucide-react';
import ProductCard from '../components/ProductCard';

export default function Shop({ 
  products, 
  onProductClick, 
  onAddToCart, 
  favorites, 
  onToggleFavorite,
  selectedCategory,
  setSelectedCategory,
  selectedCollection,
  setSelectedCollection,
  t,
  lang,
  getBilingualValue
}) {
  const [sortOption, setSortOption] = useState('default');
  const [stoneFilter, setStoneFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 8000]); // Seeding prices up to 5000+
  const [inStockOnly, setInStockOnly] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Monitor search query updates from Navbar autocomplete selection
  useEffect(() => {
    const handleQueryUpdate = () => {
      const savedQuery = localStorage.getItem('lazuli_search_query') || '';
      setSearchQuery(savedQuery);
      localStorage.removeItem('lazuli_search_query');
    };
    window.addEventListener('search_query_updated', handleQueryUpdate);
    handleQueryUpdate(); // Run once on mount in case query is already populated
    return () => window.removeEventListener('search_query_updated', handleQueryUpdate);
  }, []);

  // Reset stone filter when language changes to prevent invalid state
  useEffect(() => {
    setStoneFilter('All');
  }, [lang]);

  // Collect unique stones for filter dynamically based on language
  const uniqueStones = useMemo(() => {
    const stones = products
      .map(p => getBilingualValue(p, 'stone'))
      .filter(stone => stone && stone !== "None" && stone !== "Multi-Stone");
    return ['All', ...new Set(stones)];
  }, [products, lang]);

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by Category
    if (selectedCategory && selectedCategory !== 'All') {
      result = result.filter(p => p.category_en === selectedCategory || p.category === selectedCategory);
    }

    // Filter by Collection
    if (selectedCollection && selectedCollection !== 'All') {
      result = result.filter(p => p.collection_en === selectedCollection || p.collection === selectedCollection);
    }

    // Filter by Stone Type (using dynamic bilingual match)
    if (stoneFilter && stoneFilter !== 'All') {
      result = result.filter(p => getBilingualValue(p, 'stone') === stoneFilter);
    }

    // Filter by Price Range Slider
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Filter by In-Stock Switch
    if (inStockOnly) {
      result = result.filter(p => p.stock > 0);
    }

    // Filter by Search Query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        getBilingualValue(p, 'name').toLowerCase().includes(q) || 
        getBilingualValue(p, 'collection').toLowerCase().includes(q) || 
        getBilingualValue(p, 'category').toLowerCase().includes(q) ||
        getBilingualValue(p, 'stone').toLowerCase().includes(q)
      );
    }

    // Apply Sorting
    if (sortOption === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'name') {
      result.sort((a, b) => getBilingualValue(a, 'name').localeCompare(getBilingualValue(b, 'name')));
    }

    return result;
  }, [products, selectedCategory, selectedCollection, stoneFilter, priceRange, inStockOnly, searchQuery, sortOption, lang]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'All') count++;
    if (selectedCollection !== 'All') count++;
    if (stoneFilter !== 'All') count++;
    if (inStockOnly) count++;
    if (searchQuery.trim() !== '') count++;
    if (priceRange[0] > 0 || priceRange[1] < 8000) count++;
    return count;
  }, [selectedCategory, selectedCollection, stoneFilter, inStockOnly, searchQuery, priceRange]);

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedCollection('All');
    setStoneFilter('All');
    setSearchQuery('');
    setPriceRange([0, 8000]);
    setInStockOnly(false);
    setSortOption('default');
  };

  // Shared Filters Form for Desktop Sidebar & Mobile Drawer
  const renderFiltersContent = () => (
    <div className="flex flex-col gap-6 text-[#1C1A17]">
      
      {/* Search Input widget */}
      <div className="sidebar-search relative flex items-center bg-white border border-[#EAE3D9] px-3 py-2 w-full">
        <Search size={16} className="text-[#706C66] mr-2 ml-2" />
        <input 
          type="text" 
          placeholder={t('searchProducts')} 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full text-xs bg-transparent border-none outline-none focus:ring-0 text-[#1C1A17]"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-brand-gold">
            <X size={14} />
          </button>
        )}
      </div>

      {/* Main Categories Section */}
      <div className="filter-section">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#1C1A17] mb-3 pb-2 border-b border-[#EAE3D9]">
          {t('category')}
        </h4>
        <Radio.Group 
          value={selectedCategory} 
          onChange={(e) => { setSelectedCategory(e.target.value); setSelectedCollection('All'); }}
          className="flex flex-col gap-2 w-full"
        >
          <Radio value="All" className="text-xs text-[#706C66] hover:text-brand-gold font-medium">{t('all')}</Radio>
          <Radio value="Handmade Copper" className="text-xs text-[#706C66] hover:text-brand-gold font-medium">
            {lang === 'EN' ? 'Handmade Copper' : 'النحاس الهاند ميد'}
          </Radio>
          <Radio value="Precious Stones" className="text-xs text-[#706C66] hover:text-brand-gold font-medium">
            {lang === 'EN' ? 'Precious Stones' : 'الأحجار الكريمة الهاند ميد'}
          </Radio>
          <Radio value="Gift Boxes & Bundles" className="text-xs text-[#706C66] hover:text-brand-gold font-medium">
            {lang === 'EN' ? 'Gift Boxes & Bundles' : 'الهدايا والبوكسات'}
          </Radio>
        </Radio.Group>
      </div>

      {/* Collections Section */}
      <div className="filter-section">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#1C1A17] mb-3 pb-2 border-b border-[#EAE3D9]">
          {t('collections')}
        </h4>
        <Radio.Group 
          value={selectedCollection} 
          onChange={(e) => { setSelectedCollection(e.target.value); setSelectedCategory('All'); }}
          className="flex flex-col gap-2 w-full"
        >
          <Radio value="All" className="text-xs text-[#706C66] hover:text-brand-gold font-medium">{t('all')}</Radio>
          <Radio value="Nature's Mosaic" className="text-xs text-[#706C66] hover:text-brand-gold font-medium">
            {lang === 'EN' ? "Nature's Mosaic" : "فسيفساء الطبيعة"}
          </Radio>
          <Radio value="El Kawthar" className="text-xs text-[#706C66] hover:text-brand-gold font-medium">
            {lang === 'EN' ? "El Kawthar" : "الكوثر"}
          </Radio>
          <Radio value="Oumy" className="text-xs text-[#706C66] hover:text-brand-gold font-medium">
            {lang === 'EN' ? "Oumy" : "أمي"}
          </Radio>
          <Radio value="Calligraphy" className="text-xs text-[#706C66] hover:text-brand-gold font-medium">
            {lang === 'EN' ? "Calligraphy" : "الخط العربي"}
          </Radio>
        </Radio.Group>
      </div>

      {/* Precious Stones Section */}
      <div className="filter-section">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#1C1A17] mb-3 pb-2 border-b border-[#EAE3D9]">
          {t('naturalStone')}
        </h4>
        <Select 
          value={stoneFilter} 
          onChange={setStoneFilter}
          className="w-full text-xs"
          dropdownClassName="custom-select-dropdown"
        >
          <Select.Option value="All">{t('all')}</Select.Option>
          {uniqueStones.filter(s => s !== 'All').map((stone) => (
            <Select.Option key={stone} value={stone}>{stone}</Select.Option>
          ))}
        </Select>
      </div>

      {/* Price Slider (Antd Slider) */}
      <div className="filter-section">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#1C1A17] mb-3 pb-2 border-b border-[#EAE3D9] flex justify-between">
          <span>{lang === 'EN' ? 'Price Range' : 'نطاق السعر'}</span>
          <span className="text-brand-copper font-semibold">
            {priceRange[0]} - {priceRange[1]} ج.م
          </span>
        </h4>
        <Slider 
          range 
          min={0} 
          max={8000} 
          value={priceRange} 
          onChange={setPriceRange}
          trackStyle={{ backgroundColor: '#C4A478' }}
          handleStyle={[{ borderColor: '#C4A478' }, { borderColor: '#C4A478' }]}
        />
      </div>

      {/* Availability Switch */}
      <div className="filter-section flex items-center justify-between border-t border-[#EAE3D9] pt-4">
        <span className="text-xs font-semibold text-[#1C1A17] uppercase tracking-wider">
          {lang === 'EN' ? 'In Stock Only' : 'المتوفر في المخزن فقط'}
        </span>
        <Switch 
          checked={inStockOnly} 
          onChange={setInStockOnly}
          style={{ backgroundColor: inStockOnly ? '#D37F4B' : '#EAE3D9' }}
        />
      </div>

      {/* Reset Button */}
      {activeFiltersCount > 0 && (
        <Button 
          onClick={handleResetFilters}
          icon={<RotateCcw size={14} />}
          className="w-full h-11 border border-[#1C1A17] text-[#1C1A17] hover:bg-[#1C1A17] hover:text-white uppercase tracking-widest text-xs font-semibold rounded-none flex items-center justify-center gap-2 mt-4"
        >
          {t('resetFilters')}
        </Button>
      )}
    </div>
  );

  return (
    <>
      {/* Editorial Header */}
      <section className="bg-[#FAF8F4] border-b border-[#EAE3D9] py-16 md:py-24 px-6 md:px-8 text-center mt-0">
        <div className="max-w-2xl mx-auto flex flex-col items-center justify-center text-center">
          <span className="text-[11px] uppercase tracking-[0.2em] text-[#C4A478] font-bold mb-2 block w-full text-center">
            {t('fineCatalog')}
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-medium text-[#1C1A17] mb-4 w-full text-center">
            {t('jewelryStore')}
          </h2>
          <p className="text-xs md:text-sm text-[#706C66] leading-relaxed max-w-lg font-sans w-full text-center">
            {t('jewelryStoreDesc')}
          </p>
        </div>
      </section>

      {/* MOBILE BAR FOR FILTER CONTROLS (Sticky) */}
      <div className="mobile-filter-bar lg:hidden sticky top-20 bg-white/95 backdrop-blur-md border-b border-[#EAE3D9] py-3 px-6 z-40 flex items-center justify-between shadow-sm">
        <Button 
          onClick={() => setIsFilterDrawerOpen(true)}
          className="flex items-center gap-2 h-10 px-4 border-[#C4A478] text-[#1C1A17] font-semibold text-xs uppercase tracking-widest rounded-none"
        >
          <SlidersHorizontal size={14} className="text-brand-gold" />
          <span>{lang === 'EN' ? 'Filters' : 'تصفية الفلاتر'}</span>
          <Badge count={activeFiltersCount} size="small" color="#D37F4B" />
        </Button>

        <div className="flex items-center gap-2">
          <ArrowUpDown size={14} className="text-gray-400" />
          <Select 
            value={sortOption} 
            onChange={setSortOption}
            className="w-32 text-xs border-none"
            dropdownClassName="custom-select-dropdown"
          >
            <Option value="default">{t('featured')}</Option>
            <Option value="price-low">{t('priceLow')}</Option>
            <Option value="price-high">{t('priceHigh')}</Option>
            <Option value="name">{t('alphabetical')}</Option>
          </Select>
        </div>
      </div>

      <section className="shop-body section-container max-w-7xl mx-auto py-12 px-6">
        <div className="shop-layout flex gap-12">
          
          {/* DESKTOP SIDEBAR FILTERS */}
          <aside className="shop-sidebar w-64 shrink-0 hidden lg:flex flex-col gap-6">
            {renderFiltersContent()}
          </aside>

          {/* CATALOG MAIN GRID */}
          <div className="shop-content-panel flex-grow">
            
            {/* Sort & Stats Bar (Desktop) */}
            <div className="shop-utility-bar hidden lg:flex items-center justify-between pb-4 border-b border-[#EAE3D9] mb-8">
              <span className="products-count text-xs text-[#706C66]">
                {t('showing')} <strong className="text-[#1C1A17]">{filteredProducts.length}</strong> {t('creations')}
              </span>
              
              <div className="sort-wrapper flex items-center gap-3">
                <label className="text-xs uppercase tracking-widest text-[#706C66] font-semibold">{t('sortBy')}</label>
                <Select 
                  value={sortOption} 
                  onChange={setSortOption}
                  className="w-48 text-xs rounded-none"
                  dropdownClassName="custom-select-dropdown"
                >
                  <Select.Option value="default">{t('featured')}</Select.Option>
                  <Select.Option value="price-low">{t('priceLow')}</Select.Option>
                  <Select.Option value="price-high">{t('priceHigh')}</Select.Option>
                  <Select.Option value="name">{t('alphabetical')}</Select.Option>
                </Select>
              </div>
            </div>

            {/* Catalog Grid */}
            {filteredProducts.length === 0 ? (
              <div className="shop-empty-catalog py-20 text-center bg-white border border-[#EAE3D9]">
                <Empty description={false} />
                <h3 className="text-xl font-serif font-semibold mt-4 mb-2">{t('noMatch')}</h3>
                <p className="text-sm text-[#706C66] mb-6">{t('noMatchDesc')}</p>
                <Button 
                  type="primary"
                  onClick={handleResetFilters}
                  className="bg-[#1C1A17] hover:bg-brand-gold text-white uppercase tracking-widest text-xs font-semibold h-11 px-8 rounded-none border-none"
                >
                  {t('resetFilters')}
                </Button>
              </div>
            ) : (
              <div className="products-grid grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onProductClick={onProductClick}
                    onAddToCart={onAddToCart}
                    isFavorite={favorites.includes(product.id)}
                    onToggleFavorite={onToggleFavorite}
                    t={t}
                    lang={lang}
                    getBilingualValue={getBilingualValue}
                  />
                ))}
              </div>
            )}

          </div>

        </div>
      </section>

      {/* MOBILE FILTER SLIDING DRAWER */}
      <Drawer
        title={
          <div className="flex items-center justify-between w-full pr-4 text-[#1C1A17]">
            <span className="text-sm font-semibold uppercase tracking-widest">{lang === 'EN' ? 'Refine Catalog' : 'تصفية المعروضات'}</span>
            {activeFiltersCount > 0 && (
              <button 
                onClick={handleResetFilters} 
                className="text-xs font-bold text-brand-copper hover:underline"
              >
                {lang === 'EN' ? 'Clear All' : 'مسح الكل'}
              </button>
            )}
          </div>
        }
        placement={lang === 'AR' ? 'left' : 'right'}
        onClose={() => setIsFilterDrawerOpen(false)}
        open={isFilterDrawerOpen}
        width="100%"
        className="mobile-filters-drawer"
        bodyStyle={{ background: '#FAF9F6', padding: '2rem 1.5rem' }}
      >
        <div className="pb-10">
          {renderFiltersContent()}
          <Button 
            type="primary"
            onClick={() => setIsFilterDrawerOpen(false)}
            className="w-full h-12 bg-brand-gold hover:bg-brand-gold-dark text-white uppercase tracking-widest text-xs font-semibold rounded-none border-none mt-8"
          >
            {lang === 'EN' ? 'Apply Filters' : 'تطبيق الفلاتر'}
          </Button>
        </div>
      </Drawer>

      <style>{`
        /* Dynamic overrides for Antd Slider, Switches inside Shop */
        .ant-slider-track {
          background-color: var(--gold-primary) !important;
        }
        .ant-slider-handle::after {
          box-shadow: 0 0 0 2px var(--gold-primary) !important;
        }
        .ant-slider-handle:hover::after {
          box-shadow: 0 0 0 4px var(--gold-primary) !important;
        }

        .custom-select-dropdown {
          border-radius: 0 !important;
          font-family: 'Outfit', sans-serif !important;
        }

        .ant-select-selector {
          border-radius: 0 !important;
          border-color: #EAE3D9 !important;
        }

        .ant-select-focused .ant-select-selector,
        .ant-select-selector:hover {
          border-color: var(--gold-primary) !important;
        }

        .ant-radio-wrapper span {
          font-size: 0.8rem;
        }

        .ant-radio-checked .ant-radio-inner {
          border-color: var(--gold-primary) !important;
          background-color: var(--gold-primary) !important;
        }

        .ant-radio-inner::after {
          background-color: #FFFFFF !important;
        }

        .ant-radio-wrapper:hover .ant-radio-inner {
          border-color: var(--gold-primary) !important;
        }

        /* Mobile filters drawer custom close position */
        .mobile-filters-drawer .ant-drawer-close {
          order: 2;
          margin-right: 0 !important;
          margin-left: auto !important;
        }
        .rtl-active .mobile-filters-drawer .ant-drawer-close {
          margin-left: 0 !important;
          margin-right: auto !important;
        }
      `}</style>
    </>
  );
}
