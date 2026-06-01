import React from 'react';
import { Sparkles, Compass, ShieldCheck } from 'lucide-react';
import ProductCard from '../components/ProductCard';

export default function Home({ 
  products, 
  onProductClick, 
  onAddToCart, 
  favorites, 
  onToggleFavorite, 
  setCurrentTab,
  setSelectedCollection,
  setSelectedCategory,
  t,
  lang,
  getBilingualValue
}) {
  
  // Showcase first 3 products
  const featuredProducts = products.slice(0, 3);

  const collections = [
    {
      id: "Nature's Mosaic",
      name: lang === 'EN' ? "Nature's Mosaic" : "فسيفساء الطبيعة",
      desc: lang === 'EN' ? "Celebrating organic textures, faceted semi-precious stones, and fluid earthy tones." : "تحتفي بالزخارف العضوية، وأحجار الكريمة شبه الطبيعية، وتدرجات الألوان الترابية المنسابة.",
      img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "El Kawthar",
      name: lang === 'EN' ? "El Kawthar" : "الكوثر",
      desc: lang === 'EN' ? "Inspired by timeless Eastern heritage, geometric metal carvings, and deep blue lapis lazuli." : "مستوحاة من التراث الشرقي الخالد، والنقوش الهندسية المعدنية، وحجر اللازورد الأزرق العميق.",
      img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "Calligraphy",
      name: lang === 'EN' ? "Calligraphy" : "الخط العربي",
      desc: lang === 'EN' ? "Arabic letters sculpted in fluid gold plated silver, telling tales of classical love poetry." : "حروف عربية منحوتة في فضة مطلية بالذهب، تروي حكايات من غزل الشعر العربي الكلاسيكي.",
      img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800"
    }
  ];

  const handleCollectionSelect = (collId) => {
    setSelectedCollection(collId);
    setSelectedCategory('All');
    setCurrentTab('Shop');
  };

  return (
    <>
      {/* 1. EDITORIAL HERO BANNER */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-subtitle">{t('cairoCraft')}</span>
          <h1 className="hero-title">{lang === 'EN' ? "Nature's Mosaic" : "فسيفساء الطبيعة"}</h1>
          <p className="hero-desc">
            {t('heroDesc')}
          </p>
          <div className="hero-buttons">
            <button className="btn-gold" onClick={() => { setSelectedCategory('All'); setSelectedCollection('All'); setCurrentTab('Shop'); }}>
              <span>{t('shopCollection')}</span>
            </button>
            <button className="btn-outline hero-secondary-btn" onClick={() => { handleCollectionSelect("Nature's Mosaic"); }}>
              {t('viewStory')}
            </button>
          </div>
        </div>
      </section>

      {/* 2. SHOWCASE COLLECTIONS */}
      <section className="collections-section">
        <div className="section-container">
          <div className="section-title-wrap">
            <span className="section-subtitle">{t('curatedCreations')}</span>
            <h2>{t('byCollection')}</h2>
            <p className="section-desc">{t('byCollectionDesc')}</p>
          </div>

          <div className="collections-grid">
            {collections.map((coll, idx) => (
              <div 
                key={idx} 
                className="collection-card" 
                onClick={() => handleCollectionSelect(coll.id)}
              >
                <div className="collection-img-wrap">
                  <img src={coll.img} alt={coll.name} />
                  <div className="collection-overlay">
                    <span className="collection-cta-text">{t('exploreCollection')}</span>
                  </div>
                </div>
                <div className="collection-info">
                  <h3>{coll.name}</h3>
                  <p>{coll.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS SHOWCASE */}
      <section className="featured-section">
        <div className="section-container">
          <div className="section-title-wrap">
            <span className="section-subtitle">{t('theCuration')}</span>
            <h2>{t('mostCoveted')}</h2>
            <p className="section-desc">{t('mostCovetedDesc')}</p>
          </div>

          <div className="products-grid">
            {featuredProducts.map((product) => (
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
        </div>
      </section>

      {/* 4. ARTISAN STORY & HERITAGE */}
      <section className="heritage-section">
        <div className="heritage-container">
          <div className="heritage-text">
            <span className="section-subtitle">{t('ourHeritage')}</span>
            <h2>{t('heritageTitle')}</h2>
            <p>{t('heritageText1')}</p>
            <p>{t('heritageText2')}</p>
            <button className="btn-gold" onClick={() => { setSelectedCategory('All'); setSelectedCollection('All'); setCurrentTab('Shop'); }}>
              <span>{t('discoverCraft')}</span>
            </button>
          </div>
          <div className="heritage-image-wrap">
            <img src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1000" alt="Jewelry artisan handcrafting silver pieces" />
          </div>
        </div>
      </section>

      {/* 5. THE BRAND PILLARS (Now placed right above the footer!) */}
      <section className="pillars-section">
        <div className="pillars-container">
          <div className="pillar-card">
            <Sparkles size={32} strokeWidth={1} className="pillar-icon" />
            <h3>{t('naturalStones')}</h3>
            <p>{t('naturalStonesDesc')}</p>
          </div>
          <div className="pillar-card">
            <Compass size={32} strokeWidth={1} className="pillar-icon" />
            <h3>{t('heritageCraft')}</h3>
            <p>{t('heritageCraftDesc')}</p>
          </div>
          <div className="pillar-card">
            <ShieldCheck size={32} strokeWidth={1} className="pillar-icon" />
            <h3>{t('artisanIntegrity')}</h3>
            <p>{t('artisanIntegrityDesc')}</p>
          </div>
        </div>
      </section>

      {/* STYLES SPECIFIC TO HOME PAGE */}
      <style>{`
        /* Hero Banner */
        .hero-section {
          height: 100vh;
          width: 100%;
          background: linear-gradient(rgba(28, 26, 23, 0.4), rgba(28, 26, 23, 0.2)),
                      url('https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&q=80&w=2000');
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: center;
          padding: 0 2rem;
          color: var(--text-light);
          position: relative;
        }

        .hero-content {
          max-width: 700px;
          margin-left: calc((100vw - 1280px) / 2 + 2rem);
          animation: fade-in-up 1s cubic-bezier(0.25, 1, 0.5, 1);
        }

        .rtl-active .hero-content {
          margin-left: 0;
          margin-right: calc((100vw - 1280px) / 2 + 2rem);
        }

        @media (max-width: 1280px) {
          .hero-content {
            margin-left: 2rem;
          }
          .rtl-active .hero-content {
            margin-left: 0;
            margin-right: 2rem;
          }
        }

        .hero-subtitle {
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: var(--gold-light);
          font-weight: 600;
          margin-bottom: 1rem;
          display: block;
        }

        .hero-title {
          font-size: 5rem;
          font-weight: 400;
          margin-bottom: 1.5rem;
          line-height: 1;
          color: #FFFDFB;
        }

        .hero-desc {
          font-size: 1.15rem;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 2.5rem;
          line-height: 1.6;
          font-weight: 300;
        }

        .hero-buttons {
          display: flex;
          gap: 1.5rem;
        }

        .hero-secondary-btn {
          color: #FFFDFB !important;
          border-color: rgba(255, 255, 255, 0.4) !important;
        }

        .hero-secondary-btn:hover {
          border-color: #FFFDFB !important;
          background: rgba(255, 255, 255, 0.1) !important;
        }

        /* Pillars Section */
        .pillars-section {
          background: #FAF8F4;
          border-bottom: 1px solid var(--border-color);
          padding: 4rem 2rem;
        }

        .pillars-container {
          max-width: 1280px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 4rem;
        }

        .pillar-card {
          text-align: center;
        }

        .pillar-icon {
          color: var(--gold-primary);
          margin-bottom: 1.25rem;
        }

        .pillar-card h3 {
          font-size: 1.2rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .pillar-card p {
          font-size: 0.9rem;
          color: var(--text-secondary);
          max-width: 320px;
          margin: 0 auto;
        }

        /* Collections Section */
        .collections-section {
          background: var(--bg-primary);
        }

        .collections-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2.5rem;
        }

        .collection-card {
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .collection-img-wrap {
          position: relative;
          width: 100%;
          padding-top: 125%;
          overflow: hidden;
          background: #FAF9F6;
          border: 1px solid rgba(234, 227, 217, 0.4);
          margin-bottom: 1.5rem;
        }

        .collection-img-wrap img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 1.2s cubic-bezier(0.25, 1, 0.5, 1);
        }

        .collection-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(28, 26, 23, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.5s ease;
        }

        .collection-cta-text {
          color: var(--bg-secondary);
          text-transform: uppercase;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          border-bottom: 1.5px solid var(--bg-secondary);
          padding-bottom: 0.35rem;
        }

        .collection-card:hover .collection-img-wrap img {
          transform: scale(1.06);
        }

        .collection-card:hover .collection-overlay {
          opacity: 1;
        }

        .collection-info h3 {
          font-size: 1.4rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
          color: var(--text-primary);
        }

        .collection-info p {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        /* Featured Section */
        .featured-section {
          background: var(--bg-secondary);
          border-top: 1px solid var(--border-color);
          border-bottom: 1px solid var(--border-color);
        }

        /* Heritage Section */
        .heritage-section {
          max-width: 1280px;
          margin: 0 auto;
          padding: 8rem 2rem;
          display: flex;
          align-items: center;
          gap: 6rem;
        }

        .heritage-text {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 1.5rem;
        }

        .rtl-active .heritage-text {
          align-items: flex-start;
        }

        .heritage-text h2 {
          font-size: 2.8rem;
          line-height: 1.15;
          color: var(--text-primary);
        }

        .heritage-text p {
          color: var(--text-secondary);
          font-size: 1.05rem;
          line-height: 1.7;
        }

        .heritage-image-wrap {
          flex: 1;
          padding-top: 50%;
          position: relative;
          background: #FAF9F6;
          border: 1px solid var(--border-color);
          overflow: hidden;
        }

        .heritage-image-wrap img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* Responsiveness */
        @media (max-width: 1024px) {
          .pillars-container {
            gap: 2rem;
          }
          .collections-grid {
            gap: 1.5rem;
          }
          .heritage-section {
            flex-direction: column;
            gap: 4rem;
            padding: 6rem 2rem;
          }
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 3.2rem;
          }
          .hero-desc {
            font-size: 1rem;
          }
          .hero-buttons {
            flex-direction: column;
            width: 100%;
            gap: 1rem;
          }
          .pillars-container {
            grid-template-columns: 1fr;
            gap: 3rem;
          }
          .collections-grid {
            grid-template-columns: 1fr;
            gap: 3rem;
          }
          .collection-img-wrap {
            padding-top: 110%;
          }
          .heritage-text h2 {
            font-size: 2rem;
          }
          .heritage-section {
            padding: 4rem 1.5rem;
          }
        }
      `}</style>
    </>
  );
}
