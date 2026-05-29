import React, { useState, useEffect } from 'react';
import { ShieldAlert, Plus, Package, DollarSign, Users, ChevronRight, Check } from 'lucide-react';
import { getFirestoreDb } from '../firebase/config';

export default function AdminPanel({ allProducts, onRefreshProducts, t, lang, getBilingualValue }) {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'add-product'
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Add Product Form State
  const [nameEn, setNameEn] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Earrings');
  const [collection, setCollection] = useState("Nature's Mosaic");
  const [stone, setStone] = useState('Beige Agate');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [bulletsEn, setBulletsEn] = useState('');
  const [bulletsAr, setBulletsAr] = useState('');
  const [image, setImage] = useState('');
  const [hoverImage, setHoverImage] = useState('');
  const [stock, setStock] = useState('10');
  const [formSuccess, setFormSuccess] = useState(false);

  const governorates = [
    { id: 'Cairo', name_en: 'Cairo', name_ar: 'القاهرة' },
    { id: 'Giza', name_en: 'Giza', name_ar: 'الجيزة' },
    { id: 'Alexandria', name_en: 'Alexandria', name_ar: 'الإسكندرية' },
    { id: 'Qalyubia', name_en: 'Qalyubia', name_ar: 'القليوبية' },
    { id: 'Sharqia', name_en: 'Sharqia', name_ar: 'الشرقية' },
    { id: 'Dakahlia', name_en: 'Dakahlia', name_ar: 'الدقهلية' },
    { id: 'Gharbia', name_en: 'Gharbia', name_ar: 'الغربية' },
    { id: 'Port Said', name_en: 'Port Said', name_ar: 'بورسعيد' },
    { id: 'Suez', name_en: 'Suez', name_ar: 'السويس' },
    { id: 'Luxor', name_en: 'Luxor', name_ar: 'الأقصر' },
    { id: 'Aswan', name_en: 'Aswan', name_ar: 'أسوان' }
  ];

  const getCityName = (cityKey) => {
    const gov = governorates.find(g => g.id === cityKey);
    return gov ? (lang === 'EN' ? gov.name_en : gov.name_ar) : cityKey;
  };

  const categoryMap = {
    'Earrings': { en: 'Earrings', ar: 'أقراط' },
    'Necklaces': { en: 'Necklaces', ar: 'قلادات' },
    'Bracelets': { en: 'Bracelets', ar: 'أساور' },
    'Rings': { en: 'Rings', ar: 'خواتم' },
    'Pins': { en: 'Pins', ar: 'دبابيس بروش' }
  };

  const collectionMap = {
    "Nature's Mosaic": { en: "Nature's Mosaic", ar: "فسيفساء الطبيعة" },
    "El Kawthar": { en: "El Kawthar", ar: "الكوثر" },
    "Oumy": { en: "Oumy", ar: "أمي" },
    "Calligraphy": { en: "Calligraphy", ar: "الخط العربي" }
  };

  const stoneMap = {
    'None': { en: 'None', ar: 'لا يوجد حجر' },
    'Beige Agate': { en: 'Beige Agate', ar: 'عقيق بيج' },
    'Turquoise': { en: 'Turquoise', ar: 'فيروز' },
    'Lapis Lazuli': { en: 'Lapis Lazuli', ar: 'لازورد' },
    'Amethyst': { en: 'Amethyst', ar: 'أميثيست' },
    'Black Onyx': { en: 'Black Onyx', ar: 'أونيكس أسود' }
  };

  const getStatusLabel = (status) => {
    if (lang === 'AR') {
      if (status === 'Pending') return 'قيد الانتظار';
      if (status === 'Shipped') return 'تم الشحن';
      if (status === 'Delivered') return 'تم التوصيل';
    }
    return status;
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const db = getFirestoreDb();
      const res = await db.getOrders();
      const ordersList = res.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort orders by newest first
      ordersList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(ordersList);
    } catch (e) {
      console.error("Failed to load orders:", e);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const db = getFirestoreDb();
      await db.updateOrder(orderId, { status: newStatus });
      
      // Update local state
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (e) {
      console.error("Failed to update status:", e);
    }
  };

  const handleAddProductSubmit = async (e) => {
    e.preventDefault();
    setFormSuccess(false);

    const detailsEnArray = bulletsEn.split(',').map(b => b.trim()).filter(b => b !== '');
    const detailsArArray = bulletsAr.split(',').map(b => b.trim()).filter(b => b !== '');
    
    const newProduct = {
      name_en: nameEn,
      name_ar: nameAr,
      price: parseFloat(price),
      
      category_en: categoryMap[category].en,
      category_ar: categoryMap[category].ar,
      
      collection_en: collectionMap[collection].en,
      collection_ar: collectionMap[collection].ar,
      
      stone_en: stone === 'None' ? '' : stoneMap[stone].en,
      stone_ar: stone === 'None' ? '' : stoneMap[stone].ar,
      
      description_en: descriptionEn,
      description_ar: descriptionAr,
      
      details_en: detailsEnArray.length > 0 ? detailsEnArray : ["Premium Cairo artisan handcrafted jewelry"],
      details_ar: detailsArArray.length > 0 ? detailsArArray : ["قطع مجوهرات راقية مصنوعة يدوياً بأيدي صائغي القاهرة"],
      
      // Default fields for absolute backward compatibility
      name: nameEn,
      category: categoryMap[category].en,
      collection: collectionMap[collection].en,
      stone: stone === 'None' ? '' : stoneMap[stone].en,
      description: descriptionEn,
      details: detailsEnArray.length > 0 ? detailsEnArray : ["Premium Cairo artisan handcrafted jewelry"],
      
      image: image || "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800",
      hoverImage: hoverImage || null,
      stock: parseInt(stock) || 10
    };

    try {
      const db = getFirestoreDb();
      await db.addProduct(newProduct);
      setFormSuccess(true);
      
      // Reset form
      setNameEn('');
      setNameAr('');
      setPrice('');
      setDescriptionEn('');
      setDescriptionAr('');
      setBulletsEn('');
      setBulletsAr('');
      setImage('');
      setHoverImage('');
      setStock('10');
      
      onRefreshProducts(); // Refresh the home/shop products lists
    } catch (error) {
      console.error("Add product failed:", error);
    }
  };

  // Analytics Metrics
  const totalSales = orders.reduce((acc, o) => acc + o.grandTotal, 0);
  const totalProducts = allProducts.length;
  const totalOrders = orders.length;

  return (
    <>
      <div className="admin-page-wrap section-container">
        
        {/* Admin Header */}
        <div className="admin-header">
          <div className="admin-title-wrap">
            <span className="section-subtitle">{t('ownerConsole')}</span>
            <h2>{t('studioDashboard')}</h2>
          </div>
          <div className="admin-nav-tabs">
            <button 
              className={activeTab === 'orders' ? 'active' : ''} 
              onClick={() => setActiveTab('orders')}
            >
              {t('ordersTab')} ({totalOrders})
            </button>
            <button 
              className={activeTab === 'add-product' ? 'active' : ''} 
              onClick={() => setActiveTab('add-product')}
            >
              {t('addProductTab')}
            </button>
          </div>
        </div>

        {/* Analytics Highlights */}
        <div className="admin-stats-grid">
          <div className="stat-card">
            <div className="stat-icon-wrap bg-gold-light">
              <DollarSign size={20} />
            </div>
            <div>
              <p className="stat-label">{t('revenue')}</p>
              <h3>{totalSales.toLocaleString()} {lang === 'EN' ? 'EGP' : 'ج.م'}</h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrap bg-gold-light">
              <Package size={20} />
            </div>
            <div>
              <p className="stat-label">{t('catalogItems')}</p>
              <h3>{totalProducts} {lang === 'EN' ? 'Items' : 'قطعة'}</h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrap bg-gold-light">
              <Users size={20} />
            </div>
            <div>
              <p className="stat-label">{t('activeOrders')}</p>
              <h3>{orders.filter(o => o.status !== 'Delivered').length} {lang === 'EN' ? 'Active' : 'نشط'}</h3>
            </div>
          </div>
        </div>

        {/* Dynamic Panel Content */}
        {activeTab === 'orders' ? (
          <div className="admin-orders-panel">
            <h3>{t('ledger')}</h3>
            
            {loadingOrders ? (
              <div className="admin-loader-wrap">
                <span className="admin-spinner"></span>
                <p>{t('loadingLedger')}</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="admin-empty-state">
                <ShieldAlert size={36} />
                <h4>{t('noOrdersLedger')}</h4>
                <p>{t('noOrdersLedgerDesc')}</p>
              </div>
            ) : (
              <div className="orders-table-wrap">
                {/* Desktop-only Table View */}
                <table className="admin-orders-table desktop-only">
                  <thead>
                    <tr>
                      <th>{t('tableId')}</th>
                      <th>{t('tableName')}</th>
                      <th>{t('tableDate')}</th>
                      <th>{t('tableCoords')}</th>
                      <th>{t('tablePayment')}</th>
                      <th>{t('tableSubtotal')}</th>
                      <th>{t('tableStatus')}</th>
                      <th>{t('tableActions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o.id}>
                        <td>
                          <span className="order-badge">{o.trackingNumber}</span>
                        </td>
                        <td>
                          <strong>{o.client.firstName} {o.client.lastName}</strong>
                          <span className="order-phone-sub">{o.client.phone}</span>
                        </td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          {o.date.split(',')[0]}
                        </td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          {getCityName(o.client.city)}, {lang === 'EN' ? 'Egypt' : 'مصر'}
                        </td>
                        <td style={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: '600' }}>
                          {o.paymentMethod === 'cod' ? (lang === 'EN' ? 'COD' : 'الدفع عند الاستلام') : (lang === 'EN' ? 'Card' : 'بطاقة')}
                        </td>
                        <td className="bold-price">
                          {o.grandTotal.toLocaleString()} {lang === 'EN' ? 'EGP' : 'ج.م'}
                        </td>
                        <td>
                          <span className={`status-pill ${o.status.toLowerCase()}`}>
                            {getStatusLabel(o.status)}
                          </span>
                        </td>
                        <td>
                          {o.status === 'Pending' && (
                            <button 
                              className="action-pill ship-btn"
                              onClick={() => handleUpdateStatus(o.id, 'Shipped')}
                            >
                              {t('shipBtn')}
                            </button>
                          )}
                          {o.status === 'Shipped' && (
                            <button 
                              className="action-pill deliver-btn"
                              onClick={() => handleUpdateStatus(o.id, 'Delivered')}
                            >
                              {t('deliverBtn')}
                            </button>
                          )}
                          {o.status === 'Delivered' && (
                            <span className="action-completed-check">
                              <Check size={16} /> {t('completed')}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Mobile-only Card list View */}
                <div className="admin-orders-mobile-list mobile-only">
                  {orders.map((o) => (
                    <div key={o.id} className="admin-order-mobile-card">
                      <div className="mobile-card-row">
                        <span className="order-badge">{o.trackingNumber}</span>
                        <span className={`status-pill ${o.status.toLowerCase()}`}>{getStatusLabel(o.status)}</span>
                      </div>
                      
                      <div className="mobile-card-details" style={{ margin: '1rem 0' }}>
                        <p style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.2rem' }}>
                          {o.client.firstName} {o.client.lastName}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                          📞 {o.client.phone}<br />
                          📍 {o.client.address}, {getCityName(o.client.city)}
                        </p>
                        
                        <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                            {t('tablePayment')}: {o.paymentMethod === 'cod' ? (lang === 'EN' ? 'COD' : 'الدفع عند الاستلام') : (lang === 'EN' ? 'Card' : 'بطاقة')}
                          </span>
                          <strong className="bold-price" style={{ fontSize: '1rem' }}>{o.grandTotal.toLocaleString()} {lang === 'EN' ? 'EGP' : 'ج.م'}</strong>
                        </div>
                      </div>

                      <div className="mobile-card-actions" style={{ paddingTop: '0.75rem', borderTop: '1px dashed var(--border-color)' }}>
                        {o.status === 'Pending' && (
                          <button 
                            className="action-pill ship-btn"
                            style={{ width: '100%', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            onClick={() => handleUpdateStatus(o.id, 'Shipped')}
                          >
                            {t('shipBtn')}
                          </button>
                        )}
                        {o.status === 'Shipped' && (
                          <button 
                            className="action-pill deliver-btn"
                            style={{ width: '100%', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            onClick={() => handleUpdateStatus(o.id, 'Delivered')}
                          >
                            {t('deliverBtn')}
                          </button>
                        )}
                        {o.status === 'Delivered' && (
                          <span className="action-completed-check" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                            <Check size={16} /> {t('completedDelivered')}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Add Product Panel Form */
          <div className="admin-add-product-panel">
            <div className="form-info-card">
              <h3>{t('sculptPiece')}</h3>
              <p>{t('sculptDesc')}</p>
            </div>

            {formSuccess && (
              <div className="form-success-banner">
                <Check size={18} />
                <span>{t('formSuccessMsg')}</span>
              </div>
            )}

            <form onSubmit={handleAddProductSubmit} className="add-product-form">
              {/* Product Names (Bilingual) */}
              <div className="form-row-premium">
                <div className="input-group-premium">
                  <label>{t('gemName')} ({lang === 'EN' ? 'English' : 'بالإنجليزي'})</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Vintage Agate Studs" 
                    value={nameEn} 
                    onChange={(e) => setNameEn(e.target.value)} 
                    required 
                  />
                </div>
                <div className="input-group-premium">
                  <label>{t('gemName')} ({lang === 'EN' ? 'Arabic' : 'بالعربي'})</label>
                  <input 
                    type="text" 
                    placeholder="مثال: أقراط العقيق الكلاسيكية" 
                    value={nameAr} 
                    onChange={(e) => setNameAr(e.target.value)} 
                    required 
                  />
                </div>
              </div>

              {/* Price & Stock */}
              <div className="form-row-premium" style={{ marginTop: '1.2rem' }}>
                <div className="input-group-premium">
                  <label>{t('priceEGP')}</label>
                  <input 
                    type="number" 
                    placeholder="1200" 
                    value={price} 
                    onChange={(e) => setPrice(e.target.value)} 
                    required 
                  />
                </div>
                <div className="input-group-premium">
                  <label>{t('stockLevel')}</label>
                  <input 
                    type="number" 
                    value={stock} 
                    onChange={(e) => setStock(e.target.value)} 
                    required 
                  />
                </div>
              </div>

              {/* Categories / Collections / Stones */}
              <div className="form-row-premium" style={{ marginTop: '1.2rem' }}>
                <div className="input-group-premium">
                  <label>{t('category')}</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    {Object.keys(categoryMap).map(k => (
                      <option key={k} value={k}>{lang === 'EN' ? categoryMap[k].en : categoryMap[k].ar}</option>
                    ))}
                  </select>
                </div>
                
                <div className="input-group-premium">
                  <label>{t('byCollection')}</label>
                  <select value={collection} onChange={(e) => setCollection(e.target.value)}>
                    {Object.keys(collectionMap).map(k => (
                      <option key={k} value={k}>{lang === 'EN' ? collectionMap[k].en : collectionMap[k].ar}</option>
                    ))}
                  </select>
                </div>

                <div className="input-group-premium">
                  <label>{t('gemStone')}</label>
                  <select value={stone} onChange={(e) => setStone(e.target.value)}>
                    {Object.keys(stoneMap).map(k => (
                      <option key={k} value={k}>{lang === 'EN' ? stoneMap[k].en : stoneMap[k].ar}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Images */}
              <div className="form-row-premium" style={{ marginTop: '1.2rem' }}>
                <div className="input-group-premium" style={{ gridColumn: 'span 2' }}>
                  <label>{t('imagePrimary')}</label>
                  <input 
                    type="url" 
                    placeholder="https://images.unsplash.com/photo..." 
                    value={image} 
                    onChange={(e) => setImage(e.target.value)} 
                    required 
                  />
                </div>
                <div className="input-group-premium">
                  <label>{t('imageHover')}</label>
                  <input 
                    type="url" 
                    placeholder="https://images.unsplash.com/photo..." 
                    value={hoverImage} 
                    onChange={(e) => setHoverImage(e.target.value)} 
                  />
                </div>
              </div>

              {/* Description (Bilingual) */}
              <div className="form-row-premium" style={{ marginTop: '1.2rem' }}>
                <div className="input-group-premium">
                  <label>{t('editorialDesc')} ({lang === 'EN' ? 'English' : 'بالإنجليزي'})</label>
                  <textarea 
                    placeholder="Tell the stone's heritage, inspiration, and styling..." 
                    value={descriptionEn}
                    onChange={(e) => setDescriptionEn(e.target.value)}
                    className="admin-textarea"
                    required
                  />
                </div>
                <div className="input-group-premium">
                  <label>{t('editorialDesc')} ({lang === 'EN' ? 'Arabic' : 'بالعربي'})</label>
                  <textarea 
                    placeholder="قصة القطعة الفنية وتاريخ الأحجار وجماليات صياغتها..." 
                    value={descriptionAr}
                    onChange={(e) => setDescriptionAr(e.target.value)}
                    className="admin-textarea"
                    required
                  />
                </div>
              </div>

              {/* Specifications Bullets (Bilingual) */}
              <div className="form-row-premium" style={{ marginTop: '1.2rem' }}>
                <div className="input-group-premium">
                  <label>{t('specsBullets')} ({lang === 'EN' ? 'English' : 'بالإنجليزي'})</label>
                  <input 
                    type="text" 
                    placeholder="Material: 18k gold plated sterling silver, Stones: Hand-faceted turquoise" 
                    value={bulletsEn}
                    onChange={(e) => setBulletsEn(e.target.value)}
                  />
                  <p className="admin-field-hint">{t('specsHint')}</p>
                </div>
                <div className="input-group-premium">
                  <label>{t('specsBullets')} ({lang === 'EN' ? 'Arabic' : 'بالعربي'})</label>
                  <input 
                    type="text" 
                    placeholder="الخامة: نحاس مطلي بذهب عيار 18، الأحجار: عقيق بيج مصقول يدوياً" 
                    value={bulletsAr}
                    onChange={(e) => setBulletsAr(e.target.value)}
                  />
                  <p className="admin-field-hint">{t('specsHint')}</p>
                </div>
              </div>

              <button type="submit" className="btn-gold admin-submit-cta">
                <span>{t('launchBtn')}</span>
              </button>
            </form>
          </div>
        )}

      </div>

      <style>{`
        .admin-page-wrap {
          padding-top: 8rem;
        }

        .admin-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 1.5rem;
          margin-bottom: 3rem;
        }

        .admin-nav-tabs {
          display: flex;
          gap: 1.5rem;
        }

        .admin-nav-tabs button {
          background: transparent;
          border: none;
          padding: 0.6rem 1.2rem;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 600;
          cursor: pointer;
          color: var(--text-secondary);
          transition: var(--transition-snappy);
          border: 1px solid transparent;
        }

        .admin-nav-tabs button:hover {
          color: var(--gold-primary);
        }

        .admin-nav-tabs button.active {
          color: var(--text-primary);
          border-color: var(--border-color);
          background: var(--bg-secondary);
        }

        /* Stats highlights */
        .admin-stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          margin-bottom: 3.5rem;
        }

        .stat-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          padding: 1.5rem 2rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .stat-icon-wrap {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--gold-primary);
        }

        .bg-gold-light {
          background: rgba(196, 164, 120, 0.08);
        }

        .stat-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-secondary);
          margin-bottom: 0.25rem;
        }

        .stat-card h3 {
          font-family: 'Outfit', sans-serif;
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        /* Ledger table */
        .admin-orders-panel {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          padding: 2.5rem;
        }

        .admin-orders-panel h3 {
          font-size: 1.25rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 1.5rem;
        }

        .orders-table-wrap {
          width: 100%;
          overflow-x: auto;
        }

        .admin-orders-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .rtl-active .admin-orders-table {
          text-align: right;
        }

        .admin-orders-table th {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-secondary);
          font-weight: 700;
          padding: 1rem 1.2rem;
          border-bottom: 2px solid var(--border-color);
        }

        .admin-orders-table td {
          padding: 1.2rem;
          border-bottom: 1px solid var(--border-color);
          font-size: 0.85rem;
        }

        .order-badge {
          background: #FAF8F4;
          border: 1px solid var(--border-color);
          padding: 0.3rem 0.6rem;
          font-family: monospace;
          font-weight: 600;
          font-size: 0.8rem;
          color: var(--text-primary);
        }

        .order-phone-sub {
          display: block;
          font-size: 0.7rem;
          color: var(--text-secondary);
          margin-top: 0.15rem;
        }

        .bold-price {
          font-weight: 600;
          color: var(--text-primary);
        }

        /* Status Pills */
        .status-pill {
          display: inline-flex;
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 0.25rem 0.6rem;
          border-radius: 12px;
        }

        .status-pill.pending {
          background: #FEF3C7;
          color: #92400E;
        }

        .status-pill.shipped {
          background: #DBEAFE;
          color: #1E40AF;
        }

        .status-pill.delivered {
          background: #D1FAE5;
          color: #065F46;
        }

        /* Action Buttons */
        .action-pill {
          background: transparent;
          border: 1px solid var(--text-primary);
          padding: 0.35rem 0.75rem;
          font-size: 0.7rem;
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: var(--transition-snappy);
        }

        .ship-btn:hover {
          background: #DBEAFE;
          border-color: #3B82F6;
          color: #1E40AF;
        }

        .deliver-btn:hover {
          background: #D1FAE5;
          border-color: #10B981;
          color: #065F46;
        }

        .action-completed-check {
          color: #10B981;
          font-weight: 600;
          font-size: 0.75rem;
        }

        .admin-loader-wrap {
          text-align: center;
          padding: 4rem 2rem;
          color: var(--text-secondary);
        }

        .admin-spinner {
          display: inline-block;
          width: 30px;
          height: 30px;
          border: 2.5px solid var(--border-color);
          border-top-color: var(--gold-primary);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin-bottom: 1rem;
        }

        .admin-empty-state {
          text-align: center;
          padding: 5rem 2rem;
          color: var(--text-secondary);
        }

        .admin-empty-state h4 {
          font-size: 1.1rem;
          color: var(--text-primary);
          margin: 1rem 0 0.25rem;
        }

        /* Form styling */
        .admin-add-product-panel {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          padding: 3rem;
        }

        .form-info-card {
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1.5px solid var(--border-color);
        }

        .form-info-card h3 {
          font-size: 1.4rem;
          margin-bottom: 0.25rem;
        }

        .form-info-card p {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .form-success-banner {
          background: #DEF7EC;
          border: 1px solid #BCF0DA;
          color: #03543F;
          padding: 1rem;
          font-size: 0.85rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 2rem;
        }

        .add-product-form select {
          width: 100%;
          height: 46px;
          border: 1px solid var(--border-color);
          background: var(--bg-primary);
          padding: 0 1rem;
          cursor: pointer;
          font-family: inherit;
        }

        .add-product-form select:focus {
          border-color: var(--gold-primary);
        }

        .admin-textarea {
          width: 100%;
          height: 100px;
          border: 1px solid var(--border-color);
          background: var(--bg-primary);
          padding: 1rem;
          font-size: 0.9rem;
          font-family: inherit;
          resize: vertical;
          transition: var(--transition-smooth);
        }

        .admin-textarea:focus {
          border-color: var(--gold-primary);
          background: var(--bg-secondary);
        }

        .admin-field-hint {
          font-size: 0.7rem;
          color: var(--text-secondary);
          margin-top: 0.3rem;
        }

        .admin-submit-cta {
          margin-top: 2rem;
          height: 50px;
          width: 100%;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 992px) {
          .admin-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1.5rem;
          }
          .admin-stats-grid {
            grid-template-columns: 1fr;
            gap: 1.25rem;
          }
          .admin-orders-panel, .admin-add-product-panel {
            padding: 1.5rem;
          }
        }

        @media (max-width: 768px) {
          .admin-nav-tabs {
            width: 100%;
            flex-direction: column;
            gap: 0.5rem;
          }
          .admin-nav-tabs button {
            width: 100%;
            text-align: center;
          }
          .admin-orders-mobile-list {
            display: flex;
            flex-direction: column;
            gap: 1.25rem;
          }
          .admin-order-mobile-card {
            background: #FAF8F4;
            border: 1px solid var(--border-color);
            padding: 1.25rem;
            display: flex;
            flex-direction: column;
            box-shadow: var(--shadow-sm);
          }
          .mobile-card-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
        }
      `}</style>
    </>
  );
}
