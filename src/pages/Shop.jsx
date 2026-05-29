import React, { useState, useMemo, useEffect } from 'react';
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

  // Reset stone filter when language changes to prevent invalid state
  useEffect(() => {
    setStoneFilter('All');
  }, [lang]);

  // Collect unique stones for filter dynamically based on language!
  const uniqueStones = useMemo(() => {
    const stones = products
      .map(p => getBilingualValue(p, 'stone'))
      .filter(stone => stone && stone !== "None");
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
  }, [products, selectedCategory, selectedCollection, stoneFilter, searchQuery, sortOption, lang]);

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedCollection('All');
    setStoneFilter('All');
    setSearchQuery('');
    setSortOption('default');
  };

  return (
    <>
      <section className="shop-header">
        <div className="shop-header-content">
          <span className="section-subtitle">{t('fineCatalog')}</span>
          <h2>{t('jewelryStore')}</h2>
          <p>{t('jewelryStoreDesc')}</p>
        </div>
      </section>

      <section className="shop-body section-container">
        {/* Filters Sidebar */}
        <div className="shop-layout">
          
          <aside className="shop-sidebar">
            <div className="sidebar-search">
              <input 
                type="text" 
                placeholder={t('searchProducts')} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="sidebar-search-input"
              />
            </div>

            <div className="filter-section">
              <h4>{t('category')}</h4>
              <div className="filter-list">
                {['All', 'Earrings', 'Necklaces', 'Bracelets', 'Rings', 'Pins'].map((cat) => (
                  <button 
                    key={cat}
                    className={selectedCategory === cat ? 'active' : ''}
                    onClick={() => { setSelectedCategory(cat); setSelectedCollection('All'); }}
                  >
                    {cat === 'All' ? t('all') : cat === 'Earrings' ? t('earrings') : cat === 'Necklaces' ? t('necklaces') : cat === 'Bracelets' ? t('bracelets') : cat === 'Rings' ? t('rings') : t('pins')}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h4>{t('collections')}</h4>
              <div className="filter-list">
                {['All', "Nature's Mosaic", "El Kawthar", "Oumy", "Calligraphy"].map((coll) => (
                  <button 
                    key={coll}
                    className={selectedCollection === coll ? 'active' : ''}
                    onClick={() => { setSelectedCollection(coll); setSelectedCategory('All'); }}
                  >
                    {coll === 'All' ? t('all') : coll === "Nature's Mosaic" ? (lang === 'EN' ? "Nature's Mosaic" : "فسيفساء الطبيعة") : coll === 'El Kawthar' ? (lang === 'EN' ? "El Kawthar" : "الكوثر") : coll === 'Oumy' ? (lang === 'EN' ? "Oumy" : "أمي") : (lang === 'EN' ? "Calligraphy" : "الخط العربي")}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h4>{t('naturalStone')}</h4>
              <div className="filter-list">
                {uniqueStones.map((stone) => (
                  <button 
                    key={stone}
                    className={stoneFilter === stone ? 'active' : ''}
                    onClick={() => setStoneFilter(stone)}
                  >
                    {stone === 'All' ? t('all') : stone}
                  </button>
                ))}
              </div>
            </div>

            {(selectedCategory !== 'All' || selectedCollection !== 'All' || stoneFilter !== 'All' || searchQuery !== '') && (
              <button className="clear-filters-btn" onClick={handleResetFilters}>
                {t('resetFilters')}
              </button>
            )}
          </aside>

          {/* Product Grid Area */}
          <div className="shop-content-panel">
            
            {/* Sort & Stats Bar */}
            <div className="shop-utility-bar">
              <span className="products-count">{t('showing')} <strong>{filteredProducts.length}</strong> {t('creations')}</span>
              
              <div className="sort-wrapper">
                <label>{t('sortBy')}</label>
                <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                  <option value="default">{t('featured')}</option>
                  <option value="price-low">{t('priceLow')}</option>
                  <option value="price-high">{t('priceHigh')}</option>
                  <option value="name">{t('alphabetical')}</option>
                </select>
              </div>
            </div>

            {/* Catalog Grid */}
            {filteredProducts.length === 0 ? (
              <div className="shop-empty-catalog">
                <h3>{t('noMatch')}</h3>
                <p>{t('noMatchDesc')}</p>
                <button className="btn-gold" style={{ marginTop: '1.5rem' }} onClick={handleResetFilters}>
                  <span>{t('resetFilters')}</span>
                </button>
              </div>
            ) : (
              <div className="products-grid">
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

      <style>{`
        /* Shop Header */
        .shop-header {
          background: #FAF8F4;
          border-bottom: 1px solid var(--border-color);
          padding: 8rem 2rem 4rem;
          text-align: center;
        }

        .shop-header-content {
          max-width: 600px;
          margin: 0 auto;
        }

        .shop-header h2 {
          font-size: 2.8rem;
          margin: 0.5rem 0 1rem;
          color: var(--text-primary);
        }

        .shop-header p {
          color: var(--text-secondary);
          font-size: 1rem;
        }

        /* Shop Layout */
        .shop-layout {
          display: flex;
          gap: 3.5rem;
          margin-top: 1rem;
        }

        .shop-sidebar {
          width: 260px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .sidebar-search-input {
          width: 100%;
          height: 42px;
          border: 1px solid var(--border-color);
          background: var(--bg-secondary);
          padding: 0 1rem;
          font-size: 0.85rem;
          transition: var(--transition-smooth);
        }

        .sidebar-search-input:focus {
          border-color: var(--gold-primary);
          box-shadow: 0 0 0 3px rgba(196, 164, 120, 0.1);
        }

        .filter-section h4 {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-primary);
          font-weight: 700;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid var(--border-color);
        }

        .filter-list {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.6rem;
        }

        .filter-list button {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          font-size: 0.9rem;
          cursor: pointer;
          font-family: inherit;
          transition: var(--transition-snappy);
          padding: 0.1rem 0;
        }

        .filter-list button:hover {
          color: var(--gold-primary);
        }

        .rtl-active .filter-list button:hover {
          padding-left: 0;
          padding-right: 0.25rem;
        }

        .filter-list button.active {
          color: var(--gold-primary);
          font-weight: 600;
        }

        .filter-list button.active {
          padding-left: 0.4rem;
          border-left: 2px solid var(--gold-primary);
        }

        .rtl-active .filter-list button.active {
          padding-left: 0;
          padding-right: 0.4rem;
          border-left: none;
          border-right: 2px solid var(--gold-primary);
        }

        .clear-filters-btn {
          background: transparent;
          border: 1px solid var(--text-primary);
          color: var(--text-primary);
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 600;
          padding: 0.7rem;
          cursor: pointer;
          text-align: center;
          transition: var(--transition-snappy);
        }

        .clear-filters-btn:hover {
          background: var(--text-primary);
          color: var(--bg-secondary);
        }

        /* Content Panel */
        .shop-content-panel {
          flex-grow: 1;
        }

        .shop-utility-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--border-color);
          margin-bottom: 2.5rem;
        }

        .products-count {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .sort-wrapper {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.85rem;
        }

        .sort-wrapper label {
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 600;
        }

        .sort-wrapper select {
          border: 1px solid var(--border-color);
          background: var(--bg-secondary);
          padding: 0.4rem 1.5rem 0.4rem 0.75rem;
          border-radius: 0;
          cursor: pointer;
          font-family: inherit;
        }

        .sort-wrapper select:focus {
          border-color: var(--gold-primary);
        }

        .shop-empty-catalog {
          text-align: center;
          padding: 6rem 2rem;
          border: 1px solid var(--border-color);
          background: var(--bg-secondary);
        }

        .shop-empty-catalog h3 {
          font-size: 1.5rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
        }

        .shop-empty-catalog p {
          color: var(--text-secondary);
          font-size: 0.95rem;
        }

        /* Responsive sidebar and Horizontal Scroll Pill Tags for Mobile */
        @media (max-width: 992px) {
          .shop-layout {
            flex-direction: column;
            gap: 1.5rem;
          }
          
          .shop-sidebar {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 1.25rem;
            background: transparent;
            padding: 0;
            border: none;
          }

          .sidebar-search {
            width: 100%;
          }

          .filter-section {
            width: 100%;
            margin-bottom: 0.5rem;
          }

          .filter-section h4 {
            font-size: 0.7rem;
            margin-bottom: 0.6rem;
            border-bottom: none;
            padding-bottom: 0;
            color: var(--text-secondary);
          }

          .filter-list {
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            overflow-x: auto;
            width: 100%;
            gap: 0.5rem;
            padding-bottom: 0.6rem;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none; /* Hide scrollbar for Firefox */
          }

          .filter-list::-webkit-scrollbar {
            display: none; /* Hide scrollbar for Chrome/Safari */
          }

          .sidebar-search-input {
            height: 46px;
            border-radius: 4px;
            border: 1px solid var(--border-color);
            background: var(--bg-secondary);
            padding: 0 1.2rem;
            font-size: 0.9rem;
            box-shadow: var(--shadow-sm);
          }

          .filter-list button {
            flex-shrink: 0;
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            padding: 0.45rem 1.4rem !important;
            font-size: 0.75rem !important;
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            font-weight: 500;
            border-radius: 30px; /* Elegant rounded luxury pills */
            transition: var(--transition-snappy);
          }

          .filter-list button:hover {
            border-color: var(--gold-primary);
            color: var(--gold-primary);
          }

          .filter-list button.active {
            background: #FAF5EE !important;
            border-color: var(--gold-primary) !important;
            color: var(--gold-dark) !important;
            font-weight: 600;
            padding-left: 1.4rem !important;
            padding-right: 1.4rem !important;
            border-left: 1px solid var(--gold-primary) !important;
          }

          .rtl-active .filter-list button.active {
            padding-left: 1.4rem !important;
            padding-right: 1.4rem !important;
            border-left: none !important;
            border-right: 1px solid var(--gold-primary) !important;
          }
          
          .clear-filters-btn {
            width: 100%;
            height: 44px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 0.5rem;
            border-radius: 4px;
          }
        }

        @media (max-width: 768px) {
          .shop-header h2 {
            font-size: 2rem;
          }
          .shop-utility-bar {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
        }
      `}</style>
    </>
  );
}
