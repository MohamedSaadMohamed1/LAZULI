import React, { useState, useEffect } from 'react';
import { Steps, Button, Radio, Input, Select, Result, message } from 'antd';
import { CreditCard, Truck, ShoppingBag, ShieldCheck, CheckCircle, ArrowLeft, ArrowRight, ClipboardCheck } from 'lucide-react';
import { getFirestoreDb, authInstance } from '../firebase/config';

export default function Checkout({ 
  cartItems, 
  onClearCart, 
  setCurrentTab, 
  giftMessage, 
  appliedCoupon,
  setAppliedCoupon,
  t, 
  lang, 
  getBilingualValue 
}) {
  const [currentStep, setCurrentStep] = useState(0);
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
  
  // Calculate discount & totals
  const discountAmount = appliedCoupon ? (subtotal * appliedCoupon.discountPercent / 100) : 0;
  const grandTotal = subtotal - discountAmount + shippingFee;

  // Validate step transitions
  const handleNextStep = () => {
    if (currentStep === 0) {
      if (!email || !phone || !firstName || !lastName || !address || !apartment) {
        message.error(lang === 'EN' ? 'Please fill in all shipping details.' : 'يرجى ملء جميع تفاصيل الشحن والتوصيل أولاً.');
        return;
      }
    }
    setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmitOrder = async () => {
    if (paymentMethod === 'card') {
      if (!cardNumber || !cardExpiry || !cardCvv) {
        message.error(lang === 'EN' ? 'Please enter your credit card credentials.' : 'يرجى إدخال تفاصيل بطاقة الائتمان الخاصة بك.');
        return;
      }
    }

    setLoading(true);
    const trackingNumber = 'LZL-' + Math.floor(100000 + Math.random() * 900000);
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
        name_en: item.name_en || '',
        name_ar: item.name_ar || '',
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        collection_en: item.collection_en || '',
        collection_ar: item.collection_ar || '',
        category_en: item.category_en || '',
        category_ar: item.category_ar || '',
        subcategory_en: item.subcategory_en || '',
        subcategory_ar: item.subcategory_ar || ''
      })),
      subtotal,
      discountAmount,
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
      message.success(lang === 'EN' ? 'Order placed successfully!' : 'تم إرسال وتأكيد طلبك الفاخر بنجاح!');
    } catch (error) {
      console.error("Order placement failed:", error);
      message.error(lang === 'EN' ? "Something went wrong. Please check your network and try again." : "لقد حدث خطأ ما. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  if (placedOrder) {
    return (
      <div className="order-success-wrap section-container max-w-2xl mx-auto py-16 px-6 mt-20">
        <div className="success-card bg-white border border-[#EAE3D9] p-8 md:p-12 text-center shadow-lg text-[#1C1A17]">
          <CheckCircle size={64} className="success-icon text-brand-gold mx-auto mb-6" />
          <h2 className="text-3xl font-serif mb-2">{t('thankYou')}</h2>
          <p className="success-subtitle text-sm text-[#706C66] mb-8 leading-relaxed max-w-sm mx-auto">{t('successSubtitle')}</p>

          <div className="receipt-box border border-[#EAE3D9] bg-[#FAF8F4] p-6 text-left rtl:text-right">
            <div className="receipt-header flex justify-between items-start mb-4">
              <div>
                <h5 className="text-[10px] font-bold uppercase tracking-wider text-[#706C66]">{t('orderCode')}</h5>
                <h3 className="text-lg font-bold text-[#1C1A17]">{placedOrder.trackingNumber}</h3>
              </div>
              <div style={{ textAlign: lang === 'EN' ? 'right' : 'left' }}>
                <h5 className="text-[10px] font-bold uppercase tracking-wider text-[#706C66]">{t('datePlaced')}</h5>
                <p className="text-xs text-[#1C1A17]">{placedOrder.date}</p>
              </div>
            </div>

            <div className="receipt-divider h-[1px] bg-[#EAE3D9] my-4"></div>

            <div className="receipt-items flex flex-col gap-3">
              {placedOrder.items.map((item, idx) => (
                <div key={idx} className="receipt-item-row flex justify-between text-xs text-brand-charcoal">
                  <span>{getBilingualValue(item, 'name')} <strong className="text-brand-gold">x{item.quantity}</strong></span>
                  <span className="font-semibold">{(item.price * item.quantity).toLocaleString()} ج.م</span>
                </div>
              ))}
            </div>

            <div className="receipt-divider h-[1px] bg-[#EAE3D9] my-4"></div>

            <div className="receipt-totals flex flex-col gap-2 text-xs">
              <div className="receipt-total-row flex justify-between text-[#706C66]">
                <span>{t('subtotal')}</span>
                <span>{placedOrder.subtotal.toLocaleString()} ج.م</span>
              </div>
              {placedOrder.discountAmount > 0 && (
                <div className="receipt-total-row flex justify-between text-green-600 font-semibold">
                  <span>{lang === 'EN' ? 'Discount' : 'الخصم'}</span>
                  <span>-{placedOrder.discountAmount.toLocaleString()} ج.م</span>
                </div>
              )}
              <div className="receipt-total-row flex justify-between text-[#706C66]">
                <span>{t('shippingFeeLabel')} ({getCityName(placedOrder.client.city)})</span>
                <span>{placedOrder.shippingFee === 0 ? (lang === 'EN' ? 'FREE' : 'مجاني') : `${placedOrder.shippingFee} ج.م`}</span>
              </div>
              <div className="receipt-total-row grand flex justify-between text-sm font-bold text-brand-charcoal border-t border-[#EAE3D9]/60 pt-2">
                <span>{t('totalDue')}</span>
                <span className="text-brand-copper">{placedOrder.grandTotal.toLocaleString()} ج.م</span>
              </div>
            </div>

            <div className="receipt-divider h-[1px] bg-[#EAE3D9] my-4"></div>

            <div className="receipt-footer text-xs flex flex-col gap-1 text-[#706C66]">
              <h5 className="text-[10px] font-bold uppercase tracking-wider text-[#706C66] mb-1">{t('deliverTo')}</h5>
              <p className="font-semibold text-brand-charcoal">{placedOrder.client.firstName} {placedOrder.client.lastName}</p>
              <p>{placedOrder.client.address}, Apt {placedOrder.client.apartment}</p>
              <p>{getCityName(placedOrder.client.city)}, {lang === 'EN' ? 'Egypt' : 'مصر'}</p>
              <p>{lang === 'EN' ? 'Phone' : 'الهاتف'}: {placedOrder.client.phone}</p>
              {placedOrder.giftMessage && (
                <div className="receipt-gift bg-orange-50 border border-orange-100 p-2 mt-2 text-[#D37F4B]">
                  <strong>{t('giftNoteLabel')}:</strong> "{placedOrder.giftMessage}"
                </div>
              )}
            </div>
          </div>

          <Button 
            type="primary" 
            className="btn-gold bg-[#1C1A17] text-white hover:bg-brand-gold uppercase tracking-widest text-xs font-semibold h-12 px-8 border-none mt-8 rounded-none w-full"
            onClick={() => setCurrentTab('Home')}
          >
            {t('continueStore')}
          </Button>
        </div>
      </div>
    );
  }

  // Steps Definition
  const stepsItems = [
    { title: lang === 'EN' ? 'Shipping Details' : 'تفاصيل الشحن' },
    { title: lang === 'EN' ? 'Order Review' : 'مراجعة المنتجات' },
    { title: lang === 'EN' ? 'Payment simulation' : 'بوابة الدفع' }
  ];

  return (
    <>
      <div className="checkout-page-wrap section-container max-w-7xl mx-auto py-12 px-6 mt-20">
        
        {/* Back Link */}
        <button 
          className="back-to-shop-btn flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#706C66] hover:text-brand-gold mb-8 bg-transparent border-none cursor-pointer" 
          onClick={() => setCurrentTab('Shop')}
        >
          <ArrowLeft size={16} />
          <span>{t('backCatalog')}</span>
        </button>

        {cartItems.length === 0 ? (
          <div className="checkout-empty-state text-center py-20 bg-white border border-[#EAE3D9] flex flex-col items-center">
            <ShoppingBag size={48} strokeWidth={1} className="text-gray-400 mb-4" />
            <h2 className="text-2xl font-serif mb-2">{t('emptyBag')}</h2>
            <p className="text-sm text-[#706C66] mb-6">{lang === 'EN' ? 'You cannot checkout with an empty shopping cart.' : 'لا يمكنك إتمام الشراء بحقيبة تسوق فارغة.'}</p>
            <Button 
              type="primary"
              onClick={() => setCurrentTab('Shop')}
              className="bg-[#1C1A17] hover:bg-brand-gold text-white uppercase tracking-widest text-xs h-11 px-8 rounded-none border-none"
            >
              {t('continueShopping')}
            </Button>
          </div>
        ) : (
          <div className="checkout-grid grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Interactive Wizard Steps */}
            <div className="checkout-form-column lg:col-span-8 flex flex-col gap-6">
              
              {/* Ant Design Steps Widget */}
              <div className="bg-white border border-[#EAE3D9] p-6 shadow-sm mb-2">
                <Steps 
                  current={currentStep} 
                  items={stepsItems} 
                  className="custom-checkout-steps"
                />
              </div>

              {/* STEP 0: Shipping Details form */}
              {currentStep === 0 && (
                <div className="form-section-premium bg-white border border-[#EAE3D9] p-8 shadow-sm">
                  <h3 className="text-lg font-serif font-semibold border-b border-[#EAE3D9] pb-3 mb-6">{t('contactInfo')}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{t('emailAddr')}</label>
                      <input 
                        type="email" 
                        placeholder="client@gmail.com" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-10 border border-[#EAE3D9] bg-white px-3 text-xs outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold"
                        required 
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{t('phoneNum')}</label>
                      <input 
                        type="tel" 
                        placeholder="01xxxxxxxxx" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="h-10 border border-[#EAE3D9] bg-white px-3 text-xs outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold"
                        required 
                      />
                    </div>
                  </div>

                  <h3 className="text-lg font-serif font-semibold border-b border-[#EAE3D9] pb-3 mb-6 mt-4">{t('shippingCoords')}</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{t('firstName')}</label>
                      <input 
                        type="text" 
                        value={firstName} 
                        onChange={(e) => setFirstName(e.target.value)} 
                        className="h-10 border border-[#EAE3D9] bg-white px-3 text-xs outline-none focus:border-brand-gold"
                        required 
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{t('lastName')}</label>
                      <input 
                        type="text" 
                        value={lastName} 
                        onChange={(e) => setLastName(e.target.value)} 
                        className="h-10 border border-[#EAE3D9] bg-white px-3 text-xs outline-none focus:border-brand-gold"
                        required 
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 mb-4">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{t('streetAddr')}</label>
                    <input 
                      type="text" 
                      placeholder={lang === 'EN' ? "e.g. 15 El-Moez Street, Zamalek" : "مثال: 15 شارع المعز، الزمالك"}
                      value={address} 
                      onChange={(e) => setAddress(e.target.value)} 
                      className="h-10 border border-[#EAE3D9] bg-white px-3 text-xs outline-none focus:border-brand-gold"
                      required 
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{t('apartmentSuite')}</label>
                      <input 
                        type="text" 
                        placeholder={lang === 'EN' ? "e.g. Apt 4, 3rd Floor" : "مثال: شقة 4، الطابق الثالث"}
                        value={apartment} 
                        onChange={(e) => setApartment(e.target.value)} 
                        className="h-10 border border-[#EAE3D9] bg-white px-3 text-xs outline-none focus:border-brand-gold"
                        required 
                      />
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{t('cityGov')}</label>
                      <Select 
                        value={city} 
                        onChange={setCity}
                        className="w-full text-xs"
                        dropdownClassName="custom-select-dropdown"
                      >
                        {governorates.map(gov => (
                          <Select.Option key={gov.id} value={gov.id}>
                            {lang === 'EN' ? gov.name_en : gov.name_ar}
                          </Select.Option>
                        ))}
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 1: Order Review & Applied Coupons */}
              {currentStep === 1 && (
                <div className="form-section-premium bg-white border border-[#EAE3D9] p-8 shadow-sm">
                  <h3 className="text-lg font-serif font-semibold border-b border-[#EAE3D9] pb-3 mb-6">{lang === 'EN' ? 'Review Your Selection' : 'مراجعة المنتجات والطلبيات'}</h3>
                  
                  <div className="flex flex-col gap-4 max-h-[350px] overflow-y-auto pr-3 mb-6">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-center pb-4 border-b border-[#EAE3D9]/60">
                        <div className="flex gap-4 items-center">
                          <img src={item.image} alt={getBilingualValue(item, 'name')} className="w-14 h-16 object-cover border border-[#EAE3D9]/40 bg-[#FAF9F6]" />
                          <div>
                            <h4 className="text-xs font-semibold text-brand-charcoal">{getBilingualValue(item, 'name')}</h4>
                            <p className="text-[10px] text-brand-gold uppercase tracking-wider mt-0.5">{getBilingualValue(item, 'collection')}</p>
                            <span className="text-[10px] text-gray-500 block mt-0.5">{t('qty')}: {item.quantity}</span>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-brand-charcoal">{(item.price * item.quantity).toLocaleString()} ج.م</span>
                      </div>
                    ))}
                  </div>

                  {giftMessage && (
                    <div className="bg-orange-50 border border-orange-200 p-4 text-xs text-[#D37F4B] leading-relaxed mb-4">
                      <strong>🎁 {t('giftNoteLabel')}:</strong> "{giftMessage}"
                    </div>
                  )}

                  {appliedCoupon && (
                    <div className="bg-green-50 border border-green-200 p-4 text-xs text-green-700 font-semibold mb-2">
                      🎉 {lang === 'EN' ? 'Applied Discount Code' : 'تم تفعيل كود الخصم الشامل'}: {appliedCoupon.code} (-{appliedCoupon.discountPercent}% OFF)
                    </div>
                  )}
                </div>
              )}

              {/* STEP 2: Payment Simulation */}
              {currentStep === 2 && (
                <div className="form-section-premium bg-white border border-[#EAE3D9] p-8 shadow-sm">
                  <h3 className="text-lg font-serif font-semibold border-b border-[#EAE3D9] pb-3 mb-6">{t('paymentMethod')}</h3>
                  
                  <div className="payment-options flex flex-col gap-4 mb-6">
                    <label className={`payment-radio-wrap flex items-start gap-4 p-4 border cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-brand-gold bg-[#FAF8F4]' : 'border-[#EAE3D9] bg-white'}`}>
                      <input 
                        type="radio" 
                        name="payment" 
                        value="cod" 
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="mt-1"
                      />
                      <div className="payment-details flex gap-3">
                        <Truck size={20} className="text-brand-gold shrink-0" />
                        <div>
                          <strong className="text-xs text-brand-charcoal font-semibold">{t('codTitle')}</strong>
                          <p className="text-[10px] text-[#706C66] leading-relaxed mt-1">{t('codDesc')}</p>
                        </div>
                      </div>
                    </label>

                    <label className={`payment-radio-wrap flex items-start gap-4 p-4 border cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-brand-gold bg-[#FAF8F4]' : 'border-[#EAE3D9] bg-white'}`}>
                      <input 
                        type="radio" 
                        name="payment" 
                        value="card" 
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        className="mt-1"
                      />
                      <div className="payment-details flex gap-3">
                        <CreditCard size={20} className="text-brand-gold shrink-0" />
                        <div>
                          <strong className="text-xs text-brand-charcoal font-semibold">{t('cardTitle')}</strong>
                          <p className="text-[10px] text-[#706C66] leading-relaxed mt-1">{t('cardDesc')}</p>
                        </div>
                      </div>
                    </label>
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="credit-card-fields border-t border-dashed border-[#EAE3D9] pt-6 flex flex-col gap-4 animate-fade-in-up">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{t('cardNumber')}</label>
                        <input 
                          type="text" 
                          placeholder="4000 1234 5678 9010" 
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="h-10 border border-[#EAE3D9] bg-white px-3 text-xs outline-none focus:border-brand-gold"
                          required={paymentMethod === 'card'}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{t('expiry')}</label>
                          <input 
                            type="text" 
                            placeholder="12/28" 
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="h-10 border border-[#EAE3D9] bg-white px-3 text-xs outline-none focus:border-brand-gold"
                            required={paymentMethod === 'card'}
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{t('cvv')}</label>
                          <input 
                            type="password" 
                            placeholder="***" 
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            className="h-10 border border-[#EAE3D9] bg-white px-3 text-xs outline-none focus:border-brand-gold"
                            required={paymentMethod === 'card'}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Wizard Steps Controller Buttons */}
              <div className="flex justify-between items-center bg-white border border-[#EAE3D9] px-8 py-4 shadow-sm">
                {currentStep > 0 ? (
                  <Button 
                    onClick={handlePrevStep}
                    icon={lang === 'EN' ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
                    className="border-[#1C1A17] text-[#1C1A17] hover:bg-[#FAF8F4] h-10 px-6 rounded-none text-xs font-semibold uppercase tracking-wider flex items-center gap-1"
                  >
                    {lang === 'EN' ? 'Back' : 'السابق'}
                  </Button>
                ) : <div />}

                {currentStep < 2 ? (
                  <Button 
                    type="primary"
                    onClick={handleNextStep}
                    className="bg-[#1C1A17] text-white hover:bg-brand-gold h-10 px-6 rounded-none text-xs border-none font-semibold uppercase tracking-wider flex items-center gap-1"
                  >
                    <span>{lang === 'EN' ? 'Continue' : 'المتابعة'}</span>
                    {lang === 'EN' ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
                  </Button>
                ) : (
                  <Button 
                    type="primary"
                    onClick={handleSubmitOrder}
                    disabled={loading}
                    className="bg-brand-gold text-white hover:bg-brand-gold-dark h-10 px-8 rounded-none text-xs border-none font-bold uppercase tracking-widest flex items-center gap-1"
                  >
                    {loading ? t('processingOrder') : (lang === 'EN' ? 'Place Order' : 'تأكيد وشراء الطلب')}
                  </Button>
                )}
              </div>

            </div>

            {/* Right Column: Sticky Order Summary */}
            <div className="checkout-summary-column lg:col-span-4 sticky top-[100px]">
              <div className="summary-box-premium bg-[#FAF8F4] border border-[#EAE3D9] p-6 text-[#1C1A17]">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#1C1A17] border-b border-[#EAE3D9] pb-3 mb-4">{t('orderCuration')}</h3>
                
                <div className="summary-items flex flex-col gap-4 max-h-[220px] overflow-y-auto mb-4 pr-1">
                  {cartItems.map((item) => (
                    <div key={item.id} className="summary-item-row flex justify-between items-center">
                      <div className="summary-item-details flex gap-3 items-center">
                        <img src={item.image} alt={getBilingualValue(item, 'name')} className="w-10 h-12 object-cover border border-[#EAE3D9] bg-white" />
                        <div>
                          <h4 className="text-[11px] font-semibold text-brand-charcoal truncate w-[130px]">{getBilingualValue(item, 'name')}</h4>
                          <p className="text-[9px] text-[#706C66] block">{t('qty')}: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold">{(item.price * item.quantity).toLocaleString()} ج.م</span>
                    </div>
                  ))}
                </div>

                <div className="summary-bill-divider h-[1px] bg-[#EAE3D9] my-4"></div>

                <div className="summary-bill-row flex justify-between text-xs text-[#706C66] mb-2">
                  <span>{t('subtotal')}</span>
                  <span>{subtotal.toLocaleString()} ج.م</span>
                </div>
                
                {appliedCoupon && (
                  <div className="summary-bill-row flex justify-between text-xs text-green-600 font-semibold mb-2">
                    <span>{lang === 'EN' ? 'Discount' : 'الخصم'}</span>
                    <span>-{discountAmount.toLocaleString()} ج.م</span>
                  </div>
                )}

                <div className="summary-bill-row flex justify-between text-xs text-[#706C66] mb-2">
                  <span>{t('shippingFeeLabel')} ({getCityName(city)})</span>
                  <span>{shippingFee === 0 ? (lang === 'EN' ? 'FREE' : 'مجاني') : `${shippingFee} ج.م`}</span>
                </div>

                <div className="summary-bill-divider h-[1px] bg-[#EAE3D9] my-4"></div>

                <div className="summary-bill-row grand-total-row flex justify-between items-center text-sm font-bold text-brand-charcoal pt-1">
                  <span>{t('totalDue')}</span>
                  <strong className="text-base text-brand-copper">{grandTotal.toLocaleString()} ج.م</strong>
                </div>

                <div className="security-notice flex gap-2 items-start border-t border-dashed border-[#EAE3D9] pt-4 mt-6 text-[10px] text-[#706C66] leading-relaxed">
                  <ShieldCheck size={18} className="text-brand-gold shrink-0" />
                  <span>{t('securityNoticeText')}</span>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>

      <style>{`
        /* Antd Steps Custom overrides */
        .custom-checkout-steps .ant-steps-item-title {
          font-size: 0.75rem !important;
          text-transform: uppercase !important;
          letter-spacing: 0.05em !important;
          font-weight: 600 !important;
          font-family: 'Outfit', sans-serif !important;
        }

        .custom-checkout-steps .ant-steps-item-icon {
          width: 28px !important;
          height: 28px !important;
          line-height: 26px !important;
          font-size: 0.8rem !important;
        }

        .custom-checkout-steps .ant-steps-item-finish .ant-steps-item-icon {
          border-color: var(--gold-primary) !important;
          background-color: var(--gold-primary) !important;
        }

        .custom-checkout-steps .ant-steps-item-finish .ant-steps-item-icon .ant-steps-icon {
          color: #FFFFFF !important;
        }

        .custom-checkout-steps .ant-steps-item-process .ant-steps-item-icon {
          border-color: var(--gold-primary) !important;
          background-color: var(--gold-primary) !important;
        }

        .custom-checkout-steps .ant-steps-item-process .ant-steps-item-icon .ant-steps-icon {
          color: #FFFFFF !important;
        }
      `}</style>
    </>
  );
}
