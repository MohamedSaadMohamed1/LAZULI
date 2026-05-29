import React, { useState, useEffect } from 'react';
import { ChevronDown, Heart, Shield, Award, Truck, AlertCircle } from 'lucide-react';
import ProductCard from '../components/ProductCard';

export default function ProductDetails({ 
  product, 
  onAddToCart, 
  onBuyNow, 
  favorites, 
  onToggleFavorite, 
  allProducts, 
  onProductClick,
  t,
  lang,
  getBilingualValue
}) {
  const [activeImage, setActiveImage] = useState(product.image);
  const [qty, setQty] = useState(1);
  const [openAccordion, setOpenAccordion] = useState('specs'); // 'specs' | 'craft' | 'shipping'

  useEffect(() => {
    setActiveImage(product.image);
    setQty(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product]);

  const isFavorite = favorites.includes(product.id);

  // Filter 4 related products from the same collection or category
  const relatedProducts = allProducts
    .filter(p => p.id !== product.id && (p.collection_en === product.collection_en || p.category_en === product.category_en))
    .slice(0, 4);

  const toggleAccordion = (section) => {
    setOpenAccordion(openAccordion === section ? null : section);
  };

  const productDetailsList = getBilingualValue(product, 'details') || [];

  return (
    <>
      <div className="details-page-wrap section-container">
        
        {/* Navigation Breadcrumb */}
        <div className="breadcrumb">
          <span>{t('breadcrumbHome')}</span> / <span>{t('breadcrumbShop')}</span> / <span>{getBilingualValue(product, 'category')}</span> / <span className="active">{getBilingualValue(product, 'name')}</span>
        </div>

        {/* Two Column Layout */}
        <div className="details-grid">
          
          {/* Column 1: Image Gallery */}
          <div className="gallery-column">
            <div className="main-display-wrap">
              <img src={activeImage} alt={getBilingualValue(product, 'name')} className="main-display-img" />
              {product.stock <= 3 && product.stock > 0 && (
                <span className="details-stock-alert">{t('onlyLeft', { x: product.stock })}</span>
              )}
              {product.stock === 0 && (
                <span className="details-sold-out-alert">{t('soldOut')}</span>
              )}
            </div>

            {product.hoverImage && (
              <div className="thumbnail-row">
                <button 
                  className={`thumb-btn ${activeImage === product.image ? 'active' : ''}`}
                  onClick={() => setActiveImage(product.image)}
                >
                  <img src={product.image} alt="Primary preview" />
                </button>
                <button 
                  className={`thumb-btn ${activeImage === product.hoverImage ? 'active' : ''}`}
                  onClick={() => setActiveImage(product.hoverImage)}
                >
                  <img src={product.hoverImage} alt="Alternate detail preview" />
                </button>
              </div>
            )}
          </div>

          {/* Column 2: Specs & Purchase Actions */}
          <div className="info-column">
            
            <div className="info-header">
              <span className="info-collection">{getBilingualValue(product, 'collection')}</span>
              <h2 className="info-title">{getBilingualValue(product, 'name')}</h2>
              <p className="info-price">{product.price.toLocaleString()} {lang === 'EN' ? 'EGP' : 'ج.م'}</p>
            </div>

            <div className="info-divider"></div>

            <p className="info-description">{getBilingualValue(product, 'description')}</p>

            {/* Selection & Purchase */}
            {product.stock > 0 ? (
              <div className="purchase-controls">
                
                {/* Quantity */}
                <div className="purchase-qty-section">
                  <span className="qty-label">{t('qty')}</span>
                  <div className="qty-picker">
                    <button 
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      disabled={qty <= 1}
                    >
                      -
                    </button>
                    <span className="qty-number">{qty}</span>
                    <button 
                      onClick={() => setQty(Math.min(product.stock, qty + 1))}
                      disabled={qty >= product.stock}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Purchase Buttons */}
                <div className="cta-buttons-row">
                  <button 
                    className="btn-gold add-to-bag-btn"
                    onClick={() => onAddToCart(product, qty)}
                  >
                    <span>{t('addToBag')}</span>
                  </button>

                  <button 
                    className="btn-outline favorite-circle-btn"
                    onClick={() => onToggleFavorite(product.id)}
                  >
                    <Heart size={20} fill={isFavorite ? '#E06A6A' : 'transparent'} className={isFavorite ? 'heart-filled' : ''} />
                  </button>
                </div>

                <button 
                  className="buy-now-btn"
                  onClick={() => onBuyNow(product, qty)}
                >
                  {t('buyNow')}
                </button>

              </div>
            ) : (
              <div className="sold-out-alert-panel">
                <AlertCircle size={20} />
                <span>{t('customCommission')}</span>
              </div>
            )}

            {/* Accordion Panels */}
            <div className="accordions-wrap">
              
              {/* Accordion 1: Specifications */}
              <div className="accordion-item">
                <button className="accordion-header" onClick={() => toggleAccordion('specs')}>
                  <span>{t('materialsSpecs')}</span>
                  <ChevronDown className={`chevron-icon ${openAccordion === 'specs' ? 'rotate-180' : ''}`} size={16} />
                </button>
                {openAccordion === 'specs' && (
                  <div className="accordion-content">
                    <ul className="details-bullets-list">
                      {productDetailsList.length > 0 ? (
                        productDetailsList.map((d, idx) => <li key={idx}>{d}</li>)
                      ) : (
                        lang === 'EN' ? (
                          <>
                            <li>Premium raw semi-precious stone craft</li>
                            <li>Artisan 18k thick gold plating on sterling silver base</li>
                            <li>Individually hand carved in Cairo, Egypt</li>
                          </>
                        ) : (
                          <>
                            <li>حرفة أحجار شبه كريمة طبيعية وعضوية ممتازة</li>
                            <li>طلاء ذهبي سميك عيار 18 قيراط على قاعدة من الفضة الإسترلينية</li>
                            <li>منحوت ومصقول يدوياً بالكامل في القاهرة، مصر</li>
                          </>
                        )
                      )}
                    </ul>
                  </div>
                )}
              </div>

              {/* Accordion 2: Natural Stone Properties */}
              <div className="accordion-item">
                <button className="accordion-header" onClick={() => toggleAccordion('craft')}>
                  <span>{t('stoneEnergy')}</span>
                  <ChevronDown className={`chevron-icon ${openAccordion === 'craft' ? 'rotate-180' : ''}`} size={16} />
                </button>
                {openAccordion === 'craft' && (
                  <div className="accordion-content">
                    <p className="accordion-text-paragraph">
                      {product.stone_en === "Beige Agate" || product.stone === "Beige Agate" ? (
                        lang === 'EN' ? (
                          "Beige Agate is a stone of harmony and stabilization. Known for its soothing energy, it harmonizes the mind, body, and spirit. It grounds the wearer, instilling physical strength, calming environmental tension, and balancing emotional states in a warm, neutral aesthetic."
                        ) : (
                          "العقيق البيج هو حجر التناغم والاستقرار النفسي. يشتهر بطاقته المهدئة التي توازن العقل والجسد والروح، ويساعد في تجذير مرتديه وبث القوة الجسدية وتقليل حدة التوتر النفسي والبيئي، مما يخلق حالة جمالية دافئة ومتوازنة."
                        )
                      ) : product.stone_en === "Turquoise" || product.stone === "Turquoise" ? (
                        lang === 'EN' ? (
                          "Turquoise is a historical stone of protection, wisdom, and healing. Used for millennia by ancient Egyptian pharaohs, it brings tranquility and serves as a powerful shield against environmental stress."
                        ) : (
                          "الفيروز هو حجر تاريخي للحماية والحكمة والشفاء البدني. استخدمه الفراعنة القدماء لآلاف السنين كرمز للملوك، ويبعث الهدوء الداخلي ويعمل كدرع واقٍ قوي ضد الطاقات السلبية والتوتر البيئي."
                        )
                      ) : product.stone_en === "Lapis Lazuli" || product.stone === "Lapis Lazuli" ? (
                        lang === 'EN' ? (
                          "Lapis Lazuli represents celestial truth, inner vision, and royalty. Its deep blue canvas is freckled with natural gold pyrite veins, symbolizing wisdom, intellectual focus, and deep self-knowledge."
                        ) : (
                          "حجر اللازورد يمثل الحقيقة الكونّية البراقة، البصيرة الداخلية، والملوكية. لوحته الزرقاء العميقة منقوشة بعروق البيريت الذهبية الطبيعية، مما يرمز إلى الحكمة والتركيز الذهني القوي والمعرفة العميقة للذات."
                        )
                      ) : product.stone_en === "Amethyst" || product.stone === "Amethyst" ? (
                        lang === 'EN' ? (
                          "Amethyst is a legendary quartz associated with spiritual transformation, purification, and absolute mental clarity. Its soothing violet structure helps release mental stress, inviting serene sleep and meditation."
                        ) : (
                          "الأميثيست (الجمشت) هو كوارتز أسطوري يرتبط بالتحول الروحي النقي، والتطهير، والصفاء الذهني المطلق. يساعد تركيبه البنفسجي المهدئ في التخلص من الضغوط العقلية والتوتر، مما يحفز النوم الهادئ والتأمل العميق."
                        )
                      ) : (
                        lang === 'EN' ? (
                          "Our gemstones are organic minerals carefully selected for their vibrant colors and crystalline patterns. As raw semi-precious materials, every faceted stone carries slight variations in shape, texture, and shading, making your jewelry exclusively yours."
                        ) : (
                          "أحجارنا الكريمة هي معادن عضوية تم اختيارها بعناية لألوانها النابضة بالحياة وأنماطها الكريستالية الفريدة. وبما أنها مواد طبيعية خام، فإن كل قطعة تحمل اختلافات طفيفة في الشكل والملمس والتظليل، مما يجعل مجوهراتك حصرية لك وحدك."
                        )
                      )}
                    </p>
                  </div>
                )}
              </div>

              {/* Accordion 3: Delivery & Care */}
              <div className="accordion-item">
                <button className="accordion-header" onClick={() => toggleAccordion('shipping')}>
                  <span>{t('shippingPacking')}</span>
                  <ChevronDown className={`chevron-icon ${openAccordion === 'shipping' ? 'rotate-180' : ''}`} size={16} />
                </button>
                {openAccordion === 'shipping' && (
                  <div className="accordion-content">
                    <div className="shipping-info-grid">
                      <div className="shipping-info-item">
                        <Truck size={16} />
                        <div>
                          <h5>{t('cairoShippingTitle')}</h5>
                          <p>{t('cairoShippingDesc')}</p>
                        </div>
                      </div>
                      <div className="shipping-info-item">
                        <Award size={16} />
                        <div>
                          <h5>{t('wrappingTitle')}</h5>
                          <p>{t('wrappingDesc')}</p>
                        </div>
                      </div>
                      <div className="shipping-info-item">
                        <Shield size={16} />
                        <div>
                          <h5>{t('careTitle')}</h5>
                          <p>{t('careDesc')}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>

        {/* Related Products Carousel */}
        {relatedProducts.length > 0 && (
          <div className="related-products-section">
            <div className="section-title-wrap">
              <span className="section-subtitle">{t('complementaryCuration')}</span>
              <h2>{t('completeVibe')}</h2>
            </div>
            
            <div className="products-grid">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onProductClick={onProductClick}
                  onAddToCart={onAddToCart}
                  isFavorite={favorites.includes(p.id)}
                  onToggleFavorite={onToggleFavorite}
                  t={t}
                  lang={lang}
                  getBilingualValue={getBilingualValue}
                />
              ))}
            </div>
          </div>
        )}

      </div>

      <style>{`
        .details-page-wrap {
          padding-top: 8rem; /* Fit sticky navbar */
        }

        .breadcrumb {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-secondary);
          margin-bottom: 2.5rem;
        }

        .breadcrumb span {
          cursor: pointer;
        }

        .breadcrumb span:hover {
          color: var(--gold-primary);
        }

        .breadcrumb .active {
          color: var(--text-primary);
          font-weight: 500;
          cursor: default;
        }

        /* Two Column Grid */
        .details-grid {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 5rem;
          align-items: start;
        }

        /* Image Gallery Column */
        .gallery-column {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .main-display-wrap {
          position: relative;
          width: 100%;
          padding-top: 120%; /* Standard 5:6 premium aspect ratio */
          background: #FAF9F6;
          border: 1px solid var(--border-color);
          overflow: hidden;
        }

        .main-display-img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: var(--transition-smooth);
        }

        .main-display-wrap:hover .main-display-img {
          transform: scale(1.04);
        }

        .details-stock-alert {
          position: absolute;
          bottom: 1rem;
          left: 1rem;
          background: rgba(217, 83, 79, 0.95);
          color: var(--bg-secondary);
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 600;
          padding: 0.4rem 0.8rem;
          backdrop-filter: blur(4px);
        }

        .rtl-active .details-stock-alert {
          left: auto;
          right: 1rem;
        }

        .details-sold-out-alert {
          position: absolute;
          bottom: 1rem;
          left: 1rem;
          background: rgba(28, 26, 23, 0.85);
          color: var(--bg-secondary);
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 600;
          padding: 0.4rem 0.8rem;
          backdrop-filter: blur(4px);
        }

        .rtl-active .details-sold-out-alert {
          left: auto;
          right: 1rem;
        }

        .thumbnail-row {
          display: flex;
          gap: 1rem;
        }

        .thumb-btn {
          width: 70px;
          height: 85px;
          border: 1px solid var(--border-color);
          background: #FAF9F6;
          cursor: pointer;
          padding: 0;
          overflow: hidden;
          transition: var(--transition-snappy);
        }

        .thumb-btn img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .thumb-btn:hover, .thumb-btn.active {
          border-color: var(--gold-primary);
          opacity: 0.8;
        }

        /* Product Info Column */
        .info-column {
          display: flex;
          flex-direction: column;
        }

        .info-collection {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--gold-primary);
          font-weight: 700;
          margin-bottom: 0.5rem;
          display: block;
        }

        .info-title {
          font-size: 2.4rem;
          font-weight: 400;
          line-height: 1.15;
          margin-bottom: 1rem;
          color: var(--text-primary);
        }

        .info-price {
          font-size: 1.6rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .info-divider {
          width: 100%;
          height: 1px;
          background: var(--border-color);
          margin: 2rem 0;
        }

        .info-description {
          font-size: 1.05rem;
          line-height: 1.7;
          color: var(--text-secondary);
          margin-bottom: 2.5rem;
        }

        /* Purchase Section */
        .purchase-controls {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          margin-bottom: 3.5rem;
        }

        .purchase-qty-section {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .qty-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-primary);
          font-weight: 700;
        }

        .qty-picker {
          display: flex;
          align-items: center;
          border: 1px solid var(--border-color);
          background: #FFFDFB;
        }

        .qty-picker button {
          width: 38px;
          height: 38px;
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 1.1rem;
          color: var(--text-secondary);
          transition: var(--transition-snappy);
        }

        .qty-picker button:hover {
          color: var(--gold-primary);
        }

        .qty-picker button:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .qty-number {
          width: 32px;
          text-align: center;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .cta-buttons-row {
          display: flex;
          gap: 1rem;
          margin-top: 0.5rem;
        }

        .add-to-bag-btn {
          flex-grow: 1;
          height: 52px;
        }

        .favorite-circle-btn {
          width: 52px;
          height: 52px;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .buy-now-btn {
          width: 100%;
          height: 52px;
          background: var(--gold-primary);
          color: var(--text-primary);
          border: 1px solid var(--gold-primary);
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          font-size: 0.85rem;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .buy-now-btn:hover {
          background: var(--gold-dark);
          color: var(--text-light);
          border-color: var(--gold-dark);
          box-shadow: var(--shadow-md);
        }

        .sold-out-alert-panel {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.2rem;
          border: 1px solid #FFE3A5;
          background: #FFFBF2;
          color: #B48A2D;
          font-size: 0.9rem;
          margin-bottom: 2rem;
          line-height: 1.5;
        }

        /* Accordions */
        .accordions-wrap {
          display: flex;
          flex-direction: column;
          border-top: 1px solid var(--border-color);
        }

        .accordion-item {
          border-bottom: 1px solid var(--border-color);
        }

        .accordion-header {
          width: 100%;
          background: transparent;
          border: none;
          padding: 1.25rem 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-primary);
          font-weight: 700;
          cursor: pointer;
          text-align: inherit;
        }

        .accordion-header:hover {
          color: var(--gold-primary);
        }

        .chevron-icon {
          transition: transform 0.3s ease;
          color: var(--text-secondary);
        }

        .rotate-180 {
          transform: rotate(180deg);
        }

        .accordion-content {
          padding: 0 0 1.5rem 0;
          animation: fade-in 0.3s ease-out;
        }

        .details-bullets-list {
          list-style-type: none;
          padding-left: 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .details-bullets-list li {
          font-size: 0.9rem;
          color: var(--text-secondary);
          position: relative;
          padding-left: 1.25rem;
        }

        .rtl-active .details-bullets-list li {
          padding-left: 0;
          padding-right: 1.25rem;
        }

        .details-bullets-list li::before {
          content: '•';
          position: absolute;
          left: 0;
          color: var(--gold-primary);
          font-size: 1.2rem;
          line-height: 0.8;
        }

        .rtl-active .details-bullets-list li::before {
          left: auto;
          right: 0;
        }

        .accordion-text-paragraph {
          font-size: 0.9rem;
          line-height: 1.6;
          color: var(--text-secondary);
        }

        .shipping-info-grid {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .shipping-info-item {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }

        .shipping-info-item svg {
          color: var(--gold-primary);
          flex-shrink: 0;
          margin-top: 0.1rem;
        }

        .shipping-info-item h5 {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 0.15rem;
        }

        .shipping-info-item p {
          font-size: 0.8rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }

        /* Related products section */
        .related-products-section {
          margin-top: 8rem;
          padding-top: 6rem;
          border-top: 1px solid var(--border-color);
        }

        @media (max-width: 992px) {
          .details-grid {
            grid-template-columns: 1fr;
            gap: 4rem;
          }
          .gallery-column {
            max-width: 600px;
            margin: 0 auto;
            width: 100%;
          }
        }

        @media (max-width: 768px) {
          .info-title {
            font-size: 1.8rem;
          }
          .info-price {
            font-size: 1.35rem;
          }
          .details-page-wrap {
            padding-top: 6rem;
          }
          .related-products-section {
            margin-top: 4rem;
            padding-top: 4rem;
          }
        }
      `}</style>
    </>
  );
}
