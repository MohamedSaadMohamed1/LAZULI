import React, { useState, useEffect } from 'react';
import { Carousel, Image, Rate, Button, Input, Form, Badge, message } from 'antd';
import { ChevronDown, Heart, Shield, Award, Truck, AlertCircle, MessageSquarePlus } from 'lucide-react';
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
  const [qty, setQty] = useState(1);
  const [openAccordion, setOpenAccordion] = useState('specs'); // 'specs' | 'craft' | 'shipping'
  const [reviews, setReviews] = useState([]);
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  // Load reviews from LocalStorage dynamically when product changes
  useEffect(() => {
    setQty(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Fetch review data or fall back to defaults
    const key = `lazuli_reviews_${product.id}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      setReviews(JSON.parse(saved));
    } else {
      // Default premium seed reviews!
      const defaults = [
        {
          name: lang === 'EN' ? "Yasmin Sabri" : "ياسمين صبري",
          rating: 5,
          comment: lang === 'EN' ? "Absolutely breathtaking craftsmanship. The copper weight feels extremely premium, and the stone has gorgeous organic details!" : "حرفية مذهلة تخطف الأنفاس. وزن النحاس ثقيل وله ملمس فاخر، والحجر الطبيعي له عروق وتفاصيل عضوية ساحرة!",
          date: lang === 'EN' ? "May 20, 2026" : "٢٠ مايو ٢٠٢٦"
        },
        {
          name: lang === 'EN' ? "Farida A." : "فريدة أ.",
          rating: 4,
          comment: lang === 'EN' ? "Exquisite detail, fast delivery to Zamalek. Highly recommend for gift boxes!" : "تفاصيل رائعة للغاية، وتوصيل سريع للزمالك. أنصح به بشدة كصناديق هدايا فاخرة!",
          date: lang === 'EN' ? "May 24, 2026" : "٢٤ مايو ٢٠٢٦"
        }
      ];
      localStorage.setItem(key, JSON.stringify(defaults));
      setReviews(defaults);
    }
  }, [product, lang]);

  const isFavorite = favorites.includes(product.id);

  // Filter 4 related products from the same category or collection
  const relatedProducts = allProducts
    .filter(p => p.id !== product.id && (p.category_en === product.category_en || p.category === product.category_en))
    .slice(0, 4);

  const toggleAccordion = (section) => {
    setOpenAccordion(openAccordion === section ? null : section);
  };

  // Submit dynamic review
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) {
      message.error(lang === 'EN' ? 'Please fill in all review fields.' : 'يرجى ملء جميع حقول التقييم.');
      return;
    }

    const newReview = {
      name: reviewName,
      rating: reviewRating,
      comment: reviewComment,
      date: new Date().toLocaleDateString(lang === 'EN' ? 'en-US' : 'ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };

    const updated = [newReview, ...reviews];
    setReviews(updated);
    localStorage.setItem(`lazuli_reviews_${product.id}`, JSON.stringify(updated));

    // Reset Form
    setReviewName('');
    setReviewRating(5);
    setReviewComment('');
    message.success(lang === 'EN' ? 'Review submitted successfully!' : 'تم تقديم مراجعتك بنجاح! شكرًا لك.');
  };

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 5;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviews]);

  const productDetailsList = getBilingualValue(product, 'details') || [];

  return (
    <>
      <div className="details-page-wrap section-container max-w-7xl mx-auto py-12 px-6 mt-[80px]">
        
        {/* Navigation Breadcrumb */}
        <div className="breadcrumb text-xs uppercase tracking-widest text-gray-500 mb-8 flex gap-1">
          <span onClick={() => onProductClick(null)}>{t('breadcrumbHome')}</span> / 
          <span>{t('breadcrumbShop')}</span> / 
          <span>{getBilingualValue(product, 'category')}</span> / 
          <span className="active font-medium text-brand-charcoal">{getBilingualValue(product, 'name')}</span>
        </div>

        {/* Two Column Layout */}
        <div className="details-grid grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Column 1: Image Gallery using Antd Carousel & Zoom */}
          <div className="gallery-column lg:col-span-7 flex flex-col gap-4">
            
            {/* Main display with Badge Alerts */}
            <div className="main-display-wrap relative w-full overflow-hidden border border-[#EAE3D9] bg-[#FAF9F6]">
              {product.stock <= 3 && product.stock > 0 && (
                <div className="absolute top-4 left-4 z-10">
                  <Badge count={t('onlyLeft', { x: product.stock })} color="#D37F4B" className="text-xs uppercase tracking-wider" />
                </div>
              )}
              {product.stock === 0 && (
                <div className="absolute top-4 left-4 z-10">
                  <Badge count={t('soldOut')} color="#1C1A17" className="text-xs uppercase tracking-wider" />
                </div>
              )}

              {/* Antd Image Preview Container */}
              <Carousel effect="fade" autoplay autoplaySpeed={4000} className="details-carousel">
                <div>
                  <Image 
                    src={product.image} 
                    alt={getBilingualValue(product, 'name')} 
                    className="w-full aspect-[5/6] object-cover" 
                  />
                </div>
                {product.hoverImage && (
                  <div>
                    <Image 
                      src={product.hoverImage} 
                      alt={`${getBilingualValue(product, 'name')} detail`} 
                      className="w-full aspect-[5/6] object-cover" 
                    />
                  </div>
                )}
              </Carousel>
            </div>
          </div>

          {/* Column 2: Specs & Purchase Actions */}
          <div className="info-column lg:col-span-5 flex flex-col gap-4">
            
            <div className="info-header">
              <span className="info-collection text-xs uppercase tracking-widest text-brand-gold font-bold mb-1 block">
                {getBilingualValue(product, 'collection')}
              </span>
              <h2 className="info-title text-3xl font-serif text-[#1C1A17] mb-2">{getBilingualValue(product, 'name')}</h2>
              
              {/* Star Ratings count header */}
              <div className="flex items-center gap-2 mb-3">
                <Rate disabled allowHalf value={parseFloat(averageRating)} className="text-sm text-brand-gold" />
                <span className="text-xs text-gray-500 font-semibold mt-1">({reviews.length} {lang === 'EN' ? 'reviews' : 'تقييمات'})</span>
              </div>

              <p className="info-price text-2xl font-bold text-brand-charcoal">
                {product.price.toLocaleString()} {lang === 'EN' ? 'EGP' : 'ج.م'}
              </p>
            </div>

            <div className="info-divider h-[1px] bg-[#EAE3D9] my-4"></div>

            <p className="info-description text-sm leading-relaxed text-[#706C66]">{getBilingualValue(product, 'description')}</p>

            {/* Selection & Purchase */}
            {product.stock > 0 ? (
              <div className="purchase-controls flex flex-col gap-4 mt-2">
                
                {/* Quantity Selector */}
                <div className="purchase-qty-section flex items-center gap-4">
                  <span className="qty-label text-xs font-bold uppercase tracking-wider text-[#1C1A17]">{t('qty')}</span>
                  <div className="qty-picker flex items-center border border-[#EAE3D9] bg-white">
                    <button 
                      className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-brand-gold disabled:opacity-30"
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      disabled={qty <= 1}
                    >
                      -
                    </button>
                    <span className="qty-number w-8 text-center text-xs font-semibold">{qty}</span>
                    <button 
                      className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-brand-gold disabled:opacity-30"
                      onClick={() => setQty(Math.min(product.stock, qty + 1))}
                      disabled={qty >= product.stock}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Purchase Buttons */}
                <div className="cta-buttons-row flex gap-4 mt-2">
                  <Button 
                    type="primary" 
                    className="flex-grow h-12 bg-[#1C1A17] text-white hover:bg-brand-gold uppercase tracking-widest text-xs font-semibold rounded-none border-none"
                    onClick={() => onAddToCart(product, qty)}
                  >
                    {t('addToBag')}
                  </Button>

                  <Button 
                    className="w-12 h-12 flex items-center justify-center border-[#EAE3D9] text-[#706C66] hover:text-[#E06A6A] hover:border-[#E06A6A] rounded-none"
                    onClick={() => onToggleFavorite(product.id)}
                  >
                    <Heart size={20} fill={isFavorite ? '#E06A6A' : 'transparent'} className={isFavorite ? 'heart-filled text-[#E06A6A]' : ''} />
                  </Button>
                </div>

                <Button 
                  onClick={() => onBuyNow(product, qty)}
                  className="buy-now-btn w-full h-12 bg-brand-gold text-white hover:bg-brand-gold-dark border-none rounded-none text-xs font-semibold uppercase tracking-widest mt-2"
                >
                  {t('buyNow')}
                </Button>

              </div>
            ) : (
              <div className="sold-out-alert-panel flex items-center gap-3 p-4 bg-orange-50 border border-orange-200 text-orange-800 text-xs mt-4">
                <AlertCircle size={18} />
                <span>{t('customCommission')}</span>
              </div>
            )}

            {/* Accordion Panels */}
            <div className="accordions-wrap flex flex-col border-t border-[#EAE3D9] mt-6">
              
              {/* Accordion 1: Specifications */}
              <div className="accordion-item border-b border-[#EAE3D9]">
                <button className="accordion-header w-full py-4 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#1C1A17] hover:text-brand-gold" onClick={() => toggleAccordion('specs')}>
                  <span>{t('materialsSpecs')}</span>
                  <ChevronDown className={`chevron-icon text-gray-500 transition-transform ${openAccordion === 'specs' ? 'rotate-180' : ''}`} size={16} />
                </button>
                {openAccordion === 'specs' && (
                  <div className="accordion-content pb-4 text-xs text-[#706C66] leading-relaxed">
                    <ul className="details-bullets-list flex flex-col gap-2">
                      {productDetailsList.length > 0 ? (
                        productDetailsList.map((d, idx) => (
                          <li key={idx} className="relative pl-4 rtl:pl-0 rtl:pr-4 before:content-['•'] before:absolute before:left-0 rtl:before:left-auto rtl:before:right-0 before:text-brand-gold">{d}</li>
                        ))
                      ) : (
                        lang === 'EN' ? (
                          <>
                            <li className="relative pl-4 before:content-['•'] before:absolute before:left-0 before:text-brand-gold">Pure natural semi-precious stone accessory</li>
                            <li className="relative pl-4 before:content-['•'] before:absolute before:left-0 before:text-brand-gold">Handmade thick copper plating base</li>
                            <li className="relative pl-4 before:content-['•'] before:absolute before:left-0 before:text-brand-gold">Individually hammered by Cairo studio artisans</li>
                          </>
                        ) : (
                          <>
                            <li className="relative pr-4 before:content-['•'] before:absolute before:right-0 before:text-brand-gold">إكسسوار مصنوع من أحجار طبيعية عضوية ممتازة</li>
                            <li className="relative pr-4 before:content-['•'] before:absolute before:right-0 before:text-brand-gold">قاعدة مصاغة يدوياً بالكامل من النحاس النقي الثقيل</li>
                            <li className="relative pr-4 before:content-['•'] before:absolute before:right-0 before:text-brand-gold">مطروق باليد على حدة بواسطة حرفيينا في القاهرة</li>
                          </>
                        )
                      )}
                    </ul>
                  </div>
                )}
              </div>

              {/* Accordion 2: Natural Stone Energy */}
              <div className="accordion-item border-b border-[#EAE3D9]">
                <button className="accordion-header w-full py-4 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#1C1A17] hover:text-brand-gold" onClick={() => toggleAccordion('craft')}>
                  <span>{t('stoneEnergy')}</span>
                  <ChevronDown className={`chevron-icon text-gray-500 transition-transform ${openAccordion === 'craft' ? 'rotate-180' : ''}`} size={16} />
                </button>
                {openAccordion === 'craft' && (
                  <div className="accordion-content pb-4 text-xs text-[#706C66] leading-relaxed">
                    <p>
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
                          "Our copper settings are hand-sculpted. Due to the handcrafted process, slight textures and markings on copper and organic stones may exist, making each jewelry piece exclusively yours."
                        ) : (
                          "نحاسنا مصاغ ومطروق يدوياً بالكامل. ونظراً للصياغة اليدوية، فإن كل قطعة تحمل نقوشاً وعلامات خفيفة مميزة تميز الأحجار الطبيعية، لتكون قطعتك حصرية وخاصة بك وحدك."
                        )
                      )}
                    </p>
                  </div>
                )}
              </div>

              {/* Accordion 3: Shipping & Packaging */}
              <div className="accordion-item border-b border-[#EAE3D9]">
                <button className="accordion-header w-full py-4 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#1C1A17] hover:text-brand-gold" onClick={() => toggleAccordion('shipping')}>
                  <span>{t('shippingPacking')}</span>
                  <ChevronDown className={`chevron-icon text-gray-500 transition-transform ${openAccordion === 'shipping' ? 'rotate-180' : ''}`} size={16} />
                </button>
                {openAccordion === 'shipping' && (
                  <div className="accordion-content pb-4 text-xs text-[#706C66] leading-relaxed flex flex-col gap-4">
                    <div className="shipping-info-item flex gap-3 items-start">
                      <Truck size={16} className="text-brand-gold shrink-0 mt-0.5" />
                      <div>
                        <h5 className="font-semibold text-brand-charcoal">{t('cairoShippingTitle')}</h5>
                        <p>{t('cairoShippingDesc')}</p>
                      </div>
                    </div>
                    <div className="shipping-info-item flex gap-3 items-start">
                      <Award size={16} className="text-brand-gold shrink-0 mt-0.5" />
                      <div>
                        <h5 className="font-semibold text-brand-charcoal">{t('wrappingTitle')}</h5>
                        <p>{t('wrappingDesc')}</p>
                      </div>
                    </div>
                    <div className="shipping-info-item flex gap-3 items-start">
                      <Shield size={16} className="text-brand-gold shrink-0 mt-0.5" />
                      <div>
                        <h5 className="font-semibold text-brand-charcoal">{t('careTitle')}</h5>
                        <p>{t('careDesc')}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>

        {/* Dynamic Reviews and Rating Section */}
        <div className="reviews-section border-t border-[#EAE3D9] mt-16 pt-12 max-w-4xl mx-auto">
          <h3 className="text-2xl font-serif text-brand-charcoal mb-8 text-center">{lang === 'EN' ? 'Customer Reviews' : 'تقييمات وآراء العملاء'}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Reviews Summary Column */}
            <div className="md:col-span-4 bg-white border border-[#EAE3D9] p-6 text-center flex flex-col items-center justify-center">
              <h4 className="text-5xl font-serif text-brand-charcoal font-bold">{averageRating}</h4>
              <Rate disabled allowHalf value={parseFloat(averageRating)} className="text-base text-brand-gold mt-2" />
              <p className="text-xs text-gray-500 mt-2">{reviews.length} {lang === 'EN' ? 'Customer Reviews' : 'تقييمات العملاء'}</p>
            </div>

            {/* List of Reviews Column */}
            <div className="md:col-span-8 flex flex-col gap-6">
              {reviews.map((r, idx) => (
                <div key={idx} className="review-card border-b border-[#EAE3D9]/60 pb-4 flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-brand-charcoal">{r.name}</span>
                    <span className="text-[10px] text-gray-400">{r.date}</span>
                  </div>
                  <Rate disabled value={r.rating} className="text-xs text-brand-gold" />
                  <p className="text-xs text-[#706C66] mt-1 leading-relaxed">{r.comment}</p>
                </div>
              ))}

              {/* Submit a New Review Form */}
              <div className="new-review-form-wrap border-t border-[#EAE3D9] pt-6 mt-4">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-[#1C1A17] mb-4 flex items-center gap-2">
                  <MessageSquarePlus size={16} className="text-brand-gold" />
                  <span>{lang === 'EN' ? 'Write a Review' : 'كتابة تقييم وإضافة مراجعة'}</span>
                </h4>
                
                <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] uppercase font-bold text-gray-500">{lang === 'EN' ? 'Your Name' : 'اسمك بالكامل'}</label>
                      <input 
                        type="text" 
                        required
                        value={reviewName}
                        onChange={(e) => setReviewName(e.target.value)}
                        className="h-10 border border-[#EAE3D9] bg-white px-3 text-xs outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold"
                        placeholder={lang === 'EN' ? 'e.g. Yasmin Sabri' : 'مثال: ياسمين صبري'}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] uppercase font-bold text-gray-500">{lang === 'EN' ? 'Your Rating' : 'تقييمك بالنجوم'}</label>
                      <Rate value={reviewRating} onChange={setReviewRating} className="text-lg text-brand-gold mt-1" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-bold text-gray-500">{lang === 'EN' ? 'Comments' : 'تفاصيل المراجعة والتعليق'}</label>
                    <textarea 
                      required
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="h-20 border border-[#EAE3D9] bg-white p-3 text-xs outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold resize-none"
                      placeholder={lang === 'EN' ? 'Share your experience with this jewelry masterpiece...' : 'شاركينا تجربتك مع هذه التحفة الفنية الفريدة للمجوهرات...'}
                    />
                  </div>

                  <Button 
                    htmlType="submit"
                    className="bg-[#1C1A17] text-white hover:bg-brand-gold h-10 text-xs font-semibold uppercase tracking-widest border-none rounded-none mt-2 self-start"
                  >
                    {lang === 'EN' ? 'Submit Review' : 'إرسال التقييم'}
                  </Button>
                </form>
              </div>

            </div>

          </div>
        </div>

        {/* Related Products Showcase */}
        {relatedProducts.length > 0 && (
          <div className="related-products-section mt-20 pt-12 border-t border-[#EAE3D9]">
            <div className="section-title-wrap text-center mb-10">
              <span className="section-subtitle text-xs uppercase tracking-widest text-brand-gold font-bold mb-1 block">
                {t('complementaryCuration')}
              </span>
              <h2 className="text-3xl font-serif text-[#1C1A17]">{t('completeVibe')}</h2>
            </div>
            
            <div className="products-grid grid grid-cols-2 md:grid-cols-4 gap-6">
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
        /* Antd Carousel Styles */
        .details-carousel .slick-dots li button {
          background: #FAF9F6 !important;
          border: 1px solid var(--border-color) !important;
          width: 8px !important;
          height: 8px !important;
          border-radius: 50% !important;
        }

        .details-carousel .slick-dots li.slick-active button {
          background: var(--gold-primary) !important;
          border-color: var(--gold-primary) !important;
        }

        .details-carousel .slick-dots {
          bottom: 15px !important;
        }
      `}</style>
    </>
  );
}
