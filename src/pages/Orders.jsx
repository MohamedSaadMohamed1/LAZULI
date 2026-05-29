import React, { useState, useEffect } from 'react';
import { ShoppingBag, Loader, Package, AlertCircle } from 'lucide-react';
import { getFirestoreDb, authInstance } from '../firebase/config';

export default function Orders({ setCurrentTab, t, lang, getBilingualValue }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

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

  const getStatusLabel = (status) => {
    if (lang === 'AR') {
      if (status === 'Pending') return 'قيد الانتظار';
      if (status === 'Shipped') return 'تم الشحن';
      if (status === 'Delivered') return 'تم التوصيل';
    }
    return status;
  };

  useEffect(() => {
    const unsubscribe = authInstance.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchCustomerOrders(currentUser.uid);
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchCustomerOrders = async (uid) => {
    setLoading(true);
    try {
      const db = getFirestoreDb();
      const res = await db.getOrders();
      const allOrders = res.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Filter orders placed by this specific client
      const clientOrders = allOrders.filter(o => o.userId === uid);
      // Sort newest first
      clientOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setOrders(clientOrders);
    } catch (e) {
      console.error("Failed to load customer orders:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="orders-page-wrap section-container">
        <div className="orders-header">
          <span className="section-subtitle">{t('customerPortal')}</span>
          <h2>{t('myOrders')}</h2>
          <p>{t('ordersDesc')}</p>
        </div>

        {loading ? (
          <div className="orders-loader-wrap">
            <Loader size={36} className="orders-spinner" />
            <p>{lang === 'EN' ? 'Gathering your order records...' : 'جاري تجميع سجلات طلباتك...'}</p>
          </div>
        ) : !user ? (
          <div className="orders-empty-state">
            <AlertCircle size={40} className="empty-icon" />
            <h3>{t('authRequired')}</h3>
            <p>{t('authRequiredDesc')}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="orders-empty-state">
            <ShoppingBag size={48} strokeWidth={1} className="empty-icon" />
            <h3>{t('noOrders')}</h3>
            <p>{t('noOrdersDesc')}</p>
            <button className="btn-gold" style={{ marginTop: '1.5rem' }} onClick={() => setCurrentTab('Shop')}>
              <span>{t('discoverColl')}</span>
            </button>
          </div>
        ) : (
          <div className="orders-list-wrap">
            {orders.map((o) => (
              <div key={o.id} className="customer-order-card">
                
                {/* Card Top Details */}
                <div className="order-card-header">
                  <div className="header-col">
                    <h5>{t('orderRef')}</h5>
                    <h4>{o.trackingNumber}</h4>
                  </div>
                  <div className="header-col">
                    <h5>{t('datePlaced')}</h5>
                    <p>{o.date.split(',')[0]}</p>
                  </div>
                  <div className="header-col">
                    <h5>{t('totalDue')}</h5>
                    <p className="order-price">{o.grandTotal.toLocaleString()} {lang === 'EN' ? 'EGP' : 'ج.م'}</p>
                  </div>
                  <div className="header-col align-right">
                    <span className={`status-pill ${o.status.toLowerCase()}`}>
                      {getStatusLabel(o.status)}
                    </span>
                  </div>
                </div>

                {/* Card Items */}
                <div className="order-card-body">
                  <div className="ordered-items-list">
                    {o.items.map((item, idx) => (
                      <div key={idx} className="ordered-item-row">
                        <img src={item.image} alt={getBilingualValue(item, 'name')} className="ordered-item-img" />
                        <div>
                          <h4>{getBilingualValue(item, 'name') || item.name}</h4>
                          <p className="ordered-item-coll">{getBilingualValue(item, 'collection') || item.collection}</p>
                          <span className="ordered-item-qty">
                            {t('qty')}: {item.quantity} • {lang === 'EN' ? 'Price' : 'السعر'}: {item.price.toLocaleString()} {lang === 'EN' ? 'EGP' : 'ج.م'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Bottom Delivery coords */}
                <div className="order-card-footer">
                  <div className="shipping-summary-row">
                    <Package size={16} />
                    <span>
                      {t('shippingVia', {
                        method: o.paymentMethod === 'cod' ? t('codCourier') : t('prepaidCourier'),
                        name: `${o.client.firstName} ${o.client.lastName}`,
                        address: `${o.client.address}, Apt ${o.client.apartment}, ${getCityName(o.client.city)}, ${lang === 'EN' ? 'Egypt' : 'مصر'}`
                      })}
                    </span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .orders-page-wrap {
          padding-top: 8rem;
          max-width: 1000px;
        }

        .orders-header {
          margin-bottom: 3.5rem;
        }

        .orders-header h2 {
          font-size: 2.5rem;
          margin-top: 0.5rem;
          color: var(--text-primary);
        }

        .orders-header p {
          color: var(--text-secondary);
          font-size: 1rem;
        }

        .orders-loader-wrap {
          text-align: center;
          padding: 6rem 2rem;
          color: var(--text-secondary);
        }

        .orders-spinner {
          animation: spin 1s linear infinite;
          color: var(--gold-primary);
          margin-bottom: 1rem;
        }

        .orders-empty-state {
          text-align: center;
          padding: 6rem 2rem;
          border: 1px solid var(--border-color);
          background: var(--bg-secondary);
          display: flex;
          flex-direction: column;
          align-items: center;
          color: var(--text-secondary);
        }

        .orders-empty-state h3 {
          font-size: 1.4rem;
          color: var(--text-primary);
          margin: 1.25rem 0 0.5rem;
        }

        .orders-empty-state p {
          font-size: 0.9rem;
          max-width: 320px;
        }

        .empty-icon {
          color: var(--text-secondary);
        }

        /* Order Cards */
        .orders-list-wrap {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .customer-order-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-sm);
        }

        .order-card-header {
          padding: 1.5rem 2rem;
          background: #FAF8F4;
          border-bottom: 1px solid var(--border-color);
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          align-items: center;
        }

        .header-col h5 {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-secondary);
          margin-bottom: 0.25rem;
          font-weight: 700;
        }

        .header-col h4 {
          font-family: 'Outfit', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .header-col p {
          font-size: 0.85rem;
          color: var(--text-primary);
        }

        .order-price {
          font-weight: 600;
        }

        .align-right {
          text-align: right;
        }

        .rtl-active .align-right {
          text-align: left;
        }

        /* Items Body */
        .order-card-body {
          padding: 2rem;
          border-bottom: 1px solid var(--border-color);
        }

        .ordered-items-list {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .ordered-item-row {
          display: flex;
          gap: 1.25rem;
          align-items: center;
        }

        .ordered-item-img {
          width: 50px;
          height: 62px;
          object-fit: cover;
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
        }

        .ordered-item-row h4 {
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-primary);
          margin-bottom: 0.15rem;
        }

        .ordered-item-coll {
          font-size: 0.65rem;
          text-transform: uppercase;
          color: var(--gold-primary);
          letter-spacing: 0.05em;
          margin-bottom: 0.1rem;
        }

        .ordered-item-qty {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        /* Card Footer */
        .order-card-footer {
          padding: 1.2rem 2rem;
          background: #FFFDFB;
        }

        .shipping-summary-row {
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
          font-size: 0.8rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }

        .shipping-summary-row svg {
          color: var(--gold-primary);
          flex-shrink: 0;
          margin-top: 0.1rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .order-card-header {
            grid-template-columns: 1fr;
            gap: 1rem;
            padding: 1.2rem;
          }
          .align-right {
            text-align: left;
          }
          .order-card-body {
            padding: 1.2rem;
          }
          .order-card-footer {
            padding: 1rem 1.2rem;
          }
          .orders-header h2 {
            font-size: 1.8rem;
          }
        }
      `}</style>
    </>
  );
}
