import React, { useState, useEffect } from 'react';
import { CreditCard, Truck, ShoppingBag, ShieldCheck, CheckCircle, ArrowLeft } from 'lucide-react';
import { getFirestoreDb, authInstance } from '../firebase/config';

export default function Checkout({ cartItems, onClearCart, setCurrentTab, giftMessage, t, lang, getBilingualValue }) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('Cairo');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' | 'card'
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
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

  useEffect(() => {
    const unsubscribe = authInstance.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setEmail(currentUser.email);
        setFirstName(currentUser.name || '');
      }
    });
    return () => unsubscribe();
  }, []);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // Governorate Shipping Fee Calculation in EGP
  const getShippingFee = () => {
    if (subtotal >= 5000) return 0; // Free shipping threshold
    if (city === 'Cairo' || city === 'Giza') return 60;
    if (city === 'Alexandria') return 80;
    return 110; // All other Egyptian governorates
  };

  const shippingFee = getShippingFee();
  const grandTotal = subtotal + shippingFee;

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    const trackingNumber = 'MNL-' + Math.floor(100000 + Math.random() * 900000);
    const orderData = {
      trackingNumber,
      client: {
        email,
        firstName,
        lastName,
        address,
        apartment,
        city,
        phone
      },
      items: cartItems.map(item => ({
        id: item.id,
        name_en: item.name_en || item.name || '',
        name_ar: item.name_ar || item.name || '',
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        collection_en: item.collection_en || item.collection || '',
        collection_ar: item.collection_ar || item.collection || ''
      })),
      subtotal,
      shippingFee,
      grandTotal,
      giftMessage: giftMessage || '',
      paymentMethod,
      status: 'Pending',
      userId: user ? user.uid : 'Guest',
      date: new Date().toLocaleDateString(lang === 'EN' ? 'en-US' : 'ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    try {
      const db = getFirestoreDb();
      await db.addOrder(orderData);
      setPlacedOrder(orderData);
      onClearCart();
    } catch (error) {
      console.error("Order placement failed:", error);
      alert(lang === 'EN' ? "Something went wrong. Please check your network and try again." : "لقد حدث خطأ ما. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  if (placedOrder) {
    return (
      <div className="order-success-wrap section-container">
        <div className="success-card">
          <CheckCircle size={64} className="success-icon" />
          <h2>{t('thankYou')}</h2>
          <p className="success-subtitle">{t('successSubtitle')}</p>

          <div className="receipt-box">
            <div className="receipt-header">
              <div>
                <h5>{t('orderCode')}</h5>
                <h3>{placedOrder.trackingNumber}</h3>
              </div>
              <div style={{ textAlign: lang === 'EN' ? 'right' : 'left' }}>
                <h5>{t('datePlaced')}</h5>
                <p>{placedOrder.date}</p>
              </div>
            </div>

            <div className="receipt-divider"></div>

            <div className="receipt-items">
              {placedOrder.items.map((item, idx) => (
                <div key={idx} className="receipt-item-row">
                  <span>{getBilingualValue(item, 'name')} <strong>x{item.quantity}</strong></span>
                  <span>{(item.price * item.quantity).toLocaleString()} {lang === 'EN' ? 'EGP' : 'ج.م'}</span>
                </div>
              ))}
            </div>

            <div className="receipt-divider"></div>

            <div className="receipt-totals">
              <div className="receipt-total-row">
                <span>{t('subtotal')}</span>
                <span>{placedOrder.subtotal.toLocaleString()} {lang === 'EN' ? 'EGP' : 'ج.م'}</span>
              </div>
              <div className="receipt-total-row">
                <span>{t('shippingFeeLabel')} ({getCityName(placedOrder.client.city)})</span>
                <span>{placedOrder.shippingFee === 0 ? (lang === 'EN' ? 'FREE' : 'مجاني') : `${placedOrder.shippingFee} ${lang === 'EN' ? 'EGP' : 'ج.م'}`}</span>
              </div>
              <div className="receipt-total-row grand">
                <span>{t('totalDue')}</span>
                <span>{placedOrder.grandTotal.toLocaleString()} {lang === 'EN' ? 'EGP' : 'ج.م'}</span>
              </div>
            </div>

            <div className="receipt-divider"></div>

            <div className="receipt-footer">
              <h5>{t('deliverTo')}</h5>
              <p>{placedOrder.client.firstName} {placedOrder.client.lastName}</p>
              <p>{placedOrder.client.address}, Apt {placedOrder.client.apartment}</p>
              <p>{getCityName(placedOrder.client.city)}, {lang === 'EN' ? 'Egypt' : 'مصر'}</p>
              <p>{lang === 'EN' ? 'Phone' : 'الهاتف'}: {placedOrder.client.phone}</p>
              {placedOrder.giftMessage && (
                <div className="receipt-gift">
                  <strong>{t('giftNoteLabel')}:</strong> "{placedOrder.giftMessage}"
                </div>
              )}
            </div>
          </div>

          <button className="btn-gold" style={{ marginTop: '2.5rem' }} onClick={() => setCurrentTab('Home')}>
            <span>{t('continueStore')}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="checkout-page-wrap section-container">
        
        {/* Back Link */}
        <button className="back-to-shop-btn" onClick={() => setCurrentTab('Shop')}>
          <ArrowLeft size={16} />
          <span>{t('backCatalog')}</span>
        </button>

        {cartItems.length === 0 ? (
          <div className="checkout-empty-state">
            <ShoppingBag size={48} strokeWidth={1} />
            <h2>{t('emptyBag')}</h2>
            <p>{lang === 'EN' ? 'You cannot checkout with an empty shopping cart.' : 'لا يمكنك إتمام الشراء بحقيبة تسوق فارغة.'}</p>
            <button className="btn-gold" style={{ marginTop: '1.5rem' }} onClick={() => setCurrentTab('Shop')}>
              <span>{t('continueShopping')}</span>
            </button>
          </div>
        ) : (
          <div className="checkout-grid">
            
            {/* Left Column: Shipping & Payment Forms */}
            <div className="checkout-form-column">
              <form onSubmit={handleSubmitOrder}>
                
                {/* 1. Contact Information */}
                <div className="form-section-premium">
                  <h3>{t('contactInfo')}</h3>
                  <div className="form-row-premium">
                    <div className="input-group-premium">
                      <label>{t('emailAddr')}</label>
                      <input 
                        type="email" 
                        placeholder="client@gmail.com" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                      />
                    </div>
                    <div className="input-group-premium">
                      <label>{t('phoneNum')}</label>
                      <input 
                        type="tel" 
                        placeholder="01xxxxxxxxx" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required 
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Shipping Address */}
                <div className="form-section-premium">
                  <h3>{t('shippingCoords')}</h3>
                  
                  <div className="form-row-premium">
                    <div className="input-group-premium">
                      <label>{t('firstName')}</label>
                      <input 
                        type="text" 
                        value={firstName} 
                        onChange={(e) => setFirstName(e.target.value)} 
                        required 
                      />
                    </div>
                    <div className="input-group-premium">
                      <label>{t('lastName')}</label>
                      <input 
                        type="text" 
                        value={lastName} 
                        onChange={(e) => setLastName(e.target.value)} 
                        required 
                      />
                    </div>
                  </div>

                  <div className="input-group-premium" style={{ marginTop: '1rem' }}>
                    <label>{t('streetAddr')}</label>
                    <input 
                      type="text" 
                      placeholder={lang === 'EN' ? "e.g. 15 El-Moez Street, Zamalek" : "مثال: 15 شارع المعز، الزمالك"}
                      value={address} 
                      onChange={(e) => setAddress(e.target.value)} 
                      required 
                    />
                  </div>

                  <div className="form-row-premium" style={{ marginTop: '1rem' }}>
                    <div className="input-group-premium">
                      <label>{t('apartmentSuite')}</label>
                      <input 
                        type="text" 
                        placeholder={lang === 'EN' ? "e.g. Apt 4, 3rd Floor" : "مثال: شقة 4، الطابق الثالث"}
                        value={apartment} 
                        onChange={(e) => setApartment(e.target.value)} 
                        required 
                      />
                    </div>
                    
                    <div className="input-group-premium">
                      <label>{t('cityGov')}</label>
                      <select value={city} onChange={(e) => setCity(e.target.value)}>
                        {governorates.map(gov => (
                          <option key={gov.id} value={gov.id}>
                            {lang === 'EN' ? gov.name_en : gov.name_ar}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* 3. Payment Method */}
                <div className="form-section-premium">
                  <h3>{t('paymentMethod')}</h3>
                  
                  <div className="payment-options">
                    
                    <label className={`payment-radio-wrap ${paymentMethod === 'cod' ? 'active' : ''}`}>
                      <input 
                        type="radio" 
                        name="payment" 
                        value="cod" 
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                      />
                      <div className="payment-details">
                        <Truck size={18} />
                        <div>
                          <strong>{t('codTitle')}</strong>
                          <p>{t('codDesc')}</p>
                        </div>
                      </div>
                    </label>

                    <label className={`payment-radio-wrap ${paymentMethod === 'card' ? 'active' : ''}`}>
                      <input 
                        type="radio" 
                        name="payment" 
                        value="card" 
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                      />
                      <div className="payment-details">
                        <CreditCard size={18} />
                        <div>
                          <strong>{t('cardTitle')}</strong>
                          <p>{t('cardDesc')}</p>
                        </div>
                      </div>
                    </label>

                  </div>

                  {paymentMethod === 'card' && (
                    <div className="credit-card-fields animated-fields">
                      <div className="input-group-premium">
                        <label>{t('cardNumber')}</label>
                        <input 
                          type="text" 
                          placeholder="4000 1234 5678 9010" 
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          required={paymentMethod === 'card'}
                        />
                      </div>
                      
                      <div className="form-row-premium" style={{ marginTop: '1rem' }}>
                        <div className="input-group-premium">
                          <label>{t('expiry')}</label>
                          <input 
                            type="text" 
                            placeholder="12/28" 
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            required={paymentMethod === 'card'}
                          />
                        </div>
                        <div className="input-group-premium">
                          <label>{t('cvv')}</label>
                          <input 
                            type="password" 
                            placeholder="***" 
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            required={paymentMethod === 'card'}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <button 
                  type="submit" 
                  className="btn-gold checkout-submit-cta"
                  disabled={loading}
                >
                  <span>{loading ? t('processingOrder') : `${t('placeOrder')} • ${grandTotal.toLocaleString()} ${lang === 'EN' ? 'EGP' : 'ج.م'}`}</span>
                </button>
              </form>
            </div>

            {/* Right Column: Order Summary */}
            <div className="checkout-summary-column">
              <div className="summary-box-premium">
                <h3>{t('orderCuration')}</h3>
                
                <div className="summary-items">
                  {cartItems.map((item) => (
                    <div key={item.id} className="summary-item-row">
                      <div className="summary-item-details">
                        <img src={item.image} alt={getBilingualValue(item, 'name')} className="summary-item-img" />
                        <div>
                          <h4>{getBilingualValue(item, 'name')}</h4>
                          <p className="summary-item-coll">{getBilingualValue(item, 'collection')}</p>
                          <span className="summary-item-qty">{t('qty')}: {item.quantity}</span>
                        </div>
                      </div>
                      <span className="summary-item-price">{(item.price * item.quantity).toLocaleString()} {lang === 'EN' ? 'EGP' : 'ج.م'}</span>
                    </div>
                  ))}
                </div>

                {giftMessage && (
                  <div className="summary-gift-note">
                    <p>🎁 {t('giftNoteLabel')}: <em>"{giftMessage}"</em></p>
                  </div>
                )}

                <div className="summary-bill-divider"></div>

                <div className="summary-bill-row">
                  <span>{t('subtotal')}</span>
                  <span>{subtotal.toLocaleString()} {lang === 'EN' ? 'EGP' : 'ج.م'}</span>
                </div>
                
                <div className="summary-bill-row">
                  <span>{t('shippingFeeLabel')} ({getCityName(city)})</span>
                  <span>{shippingFee === 0 ? (lang === 'EN' ? 'FREE' : 'مجاني') : `${shippingFee} ${lang === 'EN' ? 'EGP' : 'ج.م'}`}</span>
                </div>

                <div className="summary-bill-divider"></div>

                <div className="summary-bill-row grand-total-row">
                  <span>{t('totalDue')}</span>
                  <strong>{grandTotal.toLocaleString()} {lang === 'EN' ? 'EGP' : 'ج.م'}</strong>
                </div>

                <div className="security-notice">
                  <ShieldCheck size={18} />
                  <span>{t('securityNoticeText')}</span>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>

      <style>{`
        .checkout-page-wrap {
          padding-top: 8rem;
        }

        .back-to-shop-btn {
          background: transparent;
          border: none;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-secondary);
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 0.08em;
          font-weight: 600;
          cursor: pointer;
          margin-bottom: 2rem;
          transition: var(--transition-snappy);
        }

        .back-to-shop-btn:hover {
          color: var(--gold-primary);
        }

        .checkout-empty-state {
          text-align: center;
          padding: 8rem 2rem;
          border: 1px solid var(--border-color);
          background: var(--bg-secondary);
          display: flex;
          flex-direction: column;
          align-items: center;
          color: var(--text-secondary);
        }

        .checkout-empty-state h2 {
          font-size: 1.8rem;
          color: var(--text-primary);
          margin: 1.5rem 0 0.5rem;
        }

        /* Form Grid */
        .checkout-grid {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 4rem;
          align-items: start;
        }

        .form-section-premium {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          padding: 2.5rem;
          margin-bottom: 2rem;
        }

        .form-section-premium h3 {
          font-size: 1.25rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-primary);
          margin-bottom: 1.5rem;
          padding-bottom: 0.5rem;
          border-bottom: 1.5px solid var(--border-color);
        }

        .form-row-premium {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .form-section-premium select {
          width: 100%;
          height: 46px;
          border: 1px solid var(--border-color);
          background: var(--bg-primary);
          padding: 0 1rem;
          cursor: pointer;
          font-family: inherit;
        }

        .form-section-premium select:focus {
          border-color: var(--gold-primary);
        }

        .payment-options {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .payment-radio-wrap {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1.2rem;
          border: 1px solid var(--border-color);
          background: var(--bg-primary);
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .payment-radio-wrap input[type=radio] {
          margin-top: 0.25rem;
          accent-color: var(--gold-primary);
        }

        .payment-radio-wrap.active {
          border-color: var(--gold-primary);
          background: var(--bg-secondary);
          box-shadow: var(--shadow-sm);
        }

        .payment-details {
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
        }

        .payment-details svg {
          color: var(--gold-primary);
          margin-top: 0.1rem;
          flex-shrink: 0;
        }

        .payment-details strong {
          display: block;
          font-size: 0.9rem;
          color: var(--text-primary);
          margin-bottom: 0.15rem;
        }

        .payment-details p {
          font-size: 0.75rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }

        .credit-card-fields {
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px dashed var(--border-color);
          animation: fade-in-up 0.4s ease-out;
        }

        .checkout-submit-cta {
          width: 100%;
          height: 52px;
        }

        .checkout-submit-cta:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Summary Column Box */
        .summary-box-premium {
          background: #FAF8F4;
          border: 1px solid var(--border-color);
          padding: 2rem;
        }

        .summary-box-premium h3 {
          font-size: 1.1rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 1.5rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid var(--border-color);
        }

        .summary-items {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          max-height: 280px;
          overflow-y: auto;
          padding-right: 0.5rem;
        }

        .summary-item-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .summary-item-details {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .summary-item-img {
          width: 50px;
          height: 62px;
          object-fit: cover;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
        }

        .summary-item-details h4 {
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--text-primary);
          margin-bottom: 0.15rem;
          max-width: 160px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .summary-item-coll {
          font-size: 0.65rem;
          text-transform: uppercase;
          color: var(--gold-primary);
          letter-spacing: 0.05em;
          margin-bottom: 0.1rem;
        }

        .summary-item-qty {
          font-size: 0.7rem;
          color: var(--text-secondary);
        }

        .summary-item-price {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .summary-gift-note {
          background: rgba(196, 164, 120, 0.08);
          border-left: 3px solid var(--gold-primary);
          padding: 0.75rem 1rem;
          margin-top: 1rem;
          font-size: 0.75rem;
        }

        .summary-bill-divider {
          width: 100%;
          height: 1px;
          background: var(--border-color);
          margin: 1.25rem 0;
        }

        .summary-bill-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-bottom: 0.5rem;
        }

        .grand-total-row {
          color: var(--text-primary);
          font-size: 1.05rem;
        }

        .grand-total-row strong {
          font-size: 1.25rem;
          color: var(--text-primary);
        }

        .security-notice {
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
          margin-top: 1.5rem;
          font-size: 0.75rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }

        .security-notice svg {
          color: var(--gold-primary);
          flex-shrink: 0;
        }

        /* Order Success Page */
        .order-success-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          padding-top: 8rem;
        }

        .success-card {
          width: 100%;
          max-width: 600px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-lg);
          padding: 4rem 3rem;
          text-align: center;
        }

        .success-icon {
          color: var(--gold-primary);
          margin-bottom: 1.5rem;
        }

        .success-card h2 {
          font-size: 2.2rem;
          color: var(--text-primary);
          margin-bottom: 0.75rem;
        }

        .success-subtitle {
          color: var(--text-secondary);
          font-size: 0.95rem;
          margin-bottom: 3rem;
          max-width: 400px;
          margin: 0 auto 3rem;
        }

        .receipt-box {
          border: 1px solid var(--border-color);
          background: #FAF8F4;
          padding: 2rem;
          text-align: left;
        }

        .receipt-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .receipt-header h5, .receipt-footer h5 {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-secondary);
          margin-bottom: 0.25rem;
          font-weight: 700;
        }

        .receipt-header h3 {
          font-family: 'Outfit', sans-serif;
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .receipt-header p {
          font-size: 0.85rem;
          color: var(--text-primary);
        }

        .receipt-divider {
          border-top: 1px dashed var(--border-color);
          margin: 1.25rem 0;
        }

        .receipt-item-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          margin-bottom: 0.4rem;
        }

        .receipt-item-row strong {
          color: var(--gold-primary);
        }

        .receipt-total-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-bottom: 0.4rem;
        }

        .receipt-total-row.grand {
          color: var(--text-primary);
          font-weight: 600;
          font-size: 0.95rem;
        }

        .receipt-footer p {
          font-size: 0.85rem;
          color: var(--text-primary);
          line-height: 1.4;
        }

        .receipt-gift {
          margin-top: 1rem;
          padding: 0.75rem;
          border-left: 2px solid var(--gold-primary);
          background: rgba(196, 164, 120, 0.06);
          font-size: 0.8rem;
          font-style: italic;
        }

        /* RTL Specific styles inside checkout */
        .rtl-active .receipt-box {
          text-align: right;
        }
        .rtl-active .receipt-gift {
          border-left: none;
          border-right: 2px solid var(--gold-primary);
        }

        @media (max-width: 992px) {
          .checkout-grid {
            grid-template-columns: 1fr;
            gap: 3rem;
          }
          .checkout-summary-column {
            order: -1; /* Display summary at the top on tablets/mobiles */
          }
        }

        @media (max-width: 768px) {
          .form-row-premium {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          .form-section-premium {
            padding: 1.5rem;
          }
          .success-card {
            padding: 2.5rem 1.5rem;
          }
          .receipt-box {
            padding: 1.2rem;
          }
          .checkout-page-wrap {
            padding-top: 6rem;
          }
        }
      `}</style>
    </>
  );
}

