import React, { useState, useEffect } from 'react';
import { Steps, Empty, Button, Spin } from 'antd';
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

  // Status index mapper for Antd Steps
  const getStatusStepIndex = (status) => {
    const s = status.toLowerCase();
    if (s === 'pending') return 0;
    if (s === 'processing') return 1;
    if (s === 'shipped') return 2;
    if (s === 'delivered') return 3;
    return 0;
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

  // Steps Items definition
  const getStepsItems = () => [
    { title: lang === 'EN' ? 'Pending' : 'قيد الانتظار' },
    { title: lang === 'EN' ? 'Processing' : 'قيد التجهيز' },
    { title: lang === 'EN' ? 'Shipped' : 'تم الشحن' },
    { title: lang === 'EN' ? 'Delivered' : 'تم التوصيل' }
  ];

  return (
    <>
      <div className="orders-page-wrap section-container max-w-4xl mx-auto py-12 px-6 mt-0">
        <div className="orders-header mb-12">
          <span className="section-subtitle text-xs uppercase tracking-widest text-brand-gold font-bold mb-1 block">
            {t('customerPortal')}
          </span>
          <h2 className="text-4xl font-serif text-[#1C1A17]">{t('myOrders')}</h2>
          <p className="text-sm text-[#706C66] mt-2">{t('ordersDesc')}</p>
        </div>

        {loading ? (
          <div className="orders-loader-wrap text-center py-20">
            <Spin size="large" className="custom-spin" />
            <p className="text-xs text-[#706C66] mt-4 uppercase tracking-widest">{lang === 'EN' ? 'Gathering your order records...' : 'جاري تجميع سجلات طلباتك...'}</p>
          </div>
        ) : !user ? (
          <div className="orders-empty-state text-center py-20 bg-white border border-[#EAE3D9] flex flex-col items-center">
            <AlertCircle size={40} className="text-brand-gold mb-4" />
            <h3 className="text-xl font-serif font-semibold mb-2">{t('authRequired')}</h3>
            <p className="text-sm text-[#706C66] mb-6">{t('authRequiredDesc')}</p>
            <Button 
              onClick={() => setCurrentTab('Home')}
              className="bg-[#1C1A17] text-white hover:bg-brand-gold uppercase tracking-widest text-xs font-semibold h-11 px-8 rounded-none border-none"
            >
              {lang === 'EN' ? 'Sign In' : 'تسجيل الدخول'}
            </Button>
          </div>
        ) : orders.length === 0 ? (
          <div className="orders-empty-state text-center py-20 bg-white border border-[#EAE3D9] flex flex-col items-center">
            <ShoppingBag size={48} strokeWidth={1} className="text-gray-400 mb-4" />
            <h3 className="text-xl font-serif font-semibold mb-2">{t('noOrders')}</h3>
            <p className="text-sm text-[#706C66] mb-6">{t('noOrdersDesc')}</p>
            <Button 
              type="primary" 
              className="bg-[#1C1A17] hover:bg-brand-gold text-white uppercase tracking-widest text-xs font-semibold h-11 px-8 rounded-none border-none"
              onClick={() => setCurrentTab('Shop')}
            >
              {t('discoverColl')}
            </Button>
          </div>
        ) : (
          <div className="orders-list-wrap flex flex-col gap-8">
            {orders.map((o) => (
              <div key={o.id} className="customer-order-card bg-white border border-[#EAE3D9] shadow-sm">
                
                {/* Card Top Details */}
                <div className="order-card-header px-6 py-4 bg-[#FAF8F4] border-b border-[#EAE3D9] grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <div className="header-col text-xs">
                    <h5 className="font-bold text-[10px] text-[#706C66] uppercase tracking-wider">{t('orderRef')}</h5>
                    <h4 className="font-bold text-[#1C1A17] mt-1">{o.trackingNumber}</h4>
                  </div>
                  <div className="header-col text-xs">
                    <h5 className="font-bold text-[10px] text-[#706C66] uppercase tracking-wider">{t('datePlaced')}</h5>
                    <p className="text-[#1C1A17] mt-1">{o.date.split(',')[0]}</p>
                  </div>
                  <div className="header-col text-xs">
                    <h5 className="font-bold text-[10px] text-[#706C66] uppercase tracking-wider">{t('totalDue')}</h5>
                    <p className="order-price font-bold text-brand-copper mt-1">{o.grandTotal.toLocaleString()} ج.م</p>
                  </div>
                  <div className="header-col flex md:justify-end text-xs">
                    <span className={`status-pill uppercase font-bold text-[9px] tracking-widest px-3 py-1 rounded-full text-white bg-brand-gold`}>
                      {lang === 'EN' ? o.status : o.status === 'Pending' ? 'قيد المراجعة' : o.status === 'Processing' ? 'قيد التجهيز' : o.status === 'Shipped' ? 'تم الشحن' : 'تم التوصيل'}
                    </span>
                  </div>
                </div>

                {/* Card Delivery Status Timeline (Antd Steps Widget!) */}
                <div className="order-card-timeline px-8 py-6 border-b border-[#EAE3D9]/60">
                  <Steps 
                    size="small"
                    current={getStatusStepIndex(o.status)}
                    items={getStepsItems()}
                    className="custom-order-steps"
                  />
                </div>

                {/* Card Items */}
                <div className="order-card-body p-6 border-b border-[#EAE3D9]/60">
                  <div className="ordered-items-list flex flex-col gap-4">
                    {o.items.map((item, idx) => (
                      <div key={idx} className="ordered-item-row flex gap-4 items-center">
                        <img src={item.image} alt={getBilingualValue(item, 'name')} className="ordered-item-img w-12 h-14 object-cover border border-[#EAE3D9] bg-[#FAF9F6]" />
                        <div className="text-xs">
                          <h4 className="font-semibold text-brand-charcoal">{getBilingualValue(item, 'name')}</h4>
                          <p className="ordered-item-coll text-[10px] text-brand-gold uppercase tracking-wider mt-0.5">{getBilingualValue(item, 'collection')}</p>
                          <span className="ordered-item-qty text-gray-500 block mt-0.5">
                            {t('qty')}: {item.quantity} • {lang === 'EN' ? 'Price' : 'السعر'}: {item.price.toLocaleString()} ج.م
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Bottom Delivery Coordinates */}
                <div className="order-card-footer px-6 py-3 bg-[#FFFDFB] text-xs text-[#706C66]">
                  <div className="shipping-summary-row flex gap-2 items-start leading-relaxed">
                    <Package size={16} className="text-brand-gold shrink-0 mt-0.5" />
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
        /* Antd Steps custom overrides inside orders tracker */
        .custom-order-steps .ant-steps-item-title {
          font-size: 0.7rem !important;
          text-transform: uppercase !important;
          letter-spacing: 0.05em !important;
          font-weight: 700 !important;
          color: var(--text-secondary) !important;
        }

        .custom-order-steps .ant-steps-item-process .ant-steps-item-title {
          color: var(--gold-primary) !important;
        }

        .custom-order-steps .ant-steps-item-finish .ant-steps-item-icon {
          border-color: var(--gold-primary) !important;
          background-color: var(--gold-primary) !important;
        }

        .custom-order-steps .ant-steps-item-finish .ant-steps-item-icon .ant-steps-icon {
          color: #FFFFFF !important;
        }

        .custom-order-steps .ant-steps-item-process .ant-steps-item-icon {
          border-color: var(--gold-primary) !important;
          background-color: var(--gold-primary) !important;
        }

        .custom-order-steps .ant-steps-item-process .ant-steps-item-icon .ant-steps-icon {
          color: #FFFFFF !important;
        }

        .custom-spin .ant-spin-dot-item {
          background-color: var(--gold-primary) !important;
        }
      `}</style>
    </>
  );
}
