import React, { useState } from 'react';
import { Drawer, Button, Input, Progress, message } from 'antd';
import { X, ShoppingBag, Plus, Minus, Trash2, Gift, Ticket } from 'lucide-react';

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem, 
  onCheckout,
  appliedCoupon,
  setAppliedCoupon,
  t,
  lang,
  getBilingualValue
}) {
  const [giftNoteOpen, setGiftNoteOpen] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');
  const [couponCode, setCouponCode] = useState('');

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  // Luxury FREE SHIPPING threshold
  const FREE_SHIPPING_THRESHOLD = 5000;
  const progressPercent = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const neededForFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal;

  // Apply Coupon Code Logic
  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    if (code === 'LAZULI10') {
      setAppliedCoupon({ code: 'LAZULI10', discountPercent: 10 });
      message.success(lang === 'EN' ? 'Coupon LAZULI10 applied (10% Discount)!' : 'تم تطبيق كوبون LAZULI10 (خصم 10%)!');
    } else if (code === 'COPPER20') {
      setAppliedCoupon({ code: 'COPPER20', discountPercent: 20 });
      message.success(lang === 'EN' ? 'Coupon COPPER20 applied (20% Discount)!' : 'تم تطبيق كوبون COPPER20 (خصم 20%)!');
    } else {
      message.error(lang === 'EN' ? 'Invalid coupon code.' : 'كود الخصم غير صحيح.');
    }
    setCouponCode('');
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    message.info(lang === 'EN' ? 'Coupon removed.' : 'تم إزالة كوبون الخصم.');
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Discount Calculation
  const discountAmount = appliedCoupon ? (subtotal * appliedCoupon.discountPercent / 100) : 0;
  const finalTotal = subtotal - discountAmount;

  return (
    <Drawer
      title={
        <div className="flex items-center gap-2 text-[#1C1A17]">
          <ShoppingBag size={20} />
          <h2 className="text-sm font-semibold uppercase tracking-widest">
            {t('bagCount', { x: totalCartCount })}
          </h2>
        </div>
      }
      placement={lang === 'AR' ? 'left' : 'right'}
      onClose={onClose}
      open={isOpen}
      width={480}
      className="custom-cart-drawer"
      bodyStyle={{ padding: 0 }}
    >
      <div className="flex flex-col h-full bg-[#FAF9F6] text-[#1C1A17]">
        
        {/* Dynamic Free Shipping Banner */}
        {subtotal > 0 && (
          <div className="shipping-bar-wrap px-8 py-4 border-b border-[#EAE3D9] bg-[#FAF8F4]">
            {subtotal >= FREE_SHIPPING_THRESHOLD ? (
              <p className="shipping-bar-text text-xs font-semibold text-brand-copper mb-2">{t('freeShippingUnlocked')}</p>
            ) : (
              <p className="shipping-bar-text text-xs text-[#706C66] mb-2">
                {t('addMoreFreeShipping', { x: neededForFreeShipping.toLocaleString() })}
              </p>
            )}
            <Progress 
              percent={progressPercent} 
              showInfo={false} 
              strokeColor={{
                '0%': '#EAD8C0',
                '100%': '#C4A478',
              }}
              status="active"
            />
          </div>
        )}

        {/* Cart Items List */}
        <div className="cart-drawer-body flex-grow overflow-y-auto px-8 py-6">
          {cartItems.length === 0 ? (
            <div className="cart-empty-state flex flex-col items-center justify-center h-full text-center">
              <div className="empty-icon-wrap w-24 h-24 rounded-full border border-[#EAE3D9] flex items-center justify-center mb-6 text-gray-400">
                <ShoppingBag size={44} strokeWidth={1} />
              </div>
              <h3 className="text-xl font-serif font-semibold mb-2">{t('emptyBag')}</h3>
              <p className="text-sm text-[#706C66] max-w-xs">{t('emptyBagDesc')}</p>
              <Button 
                type="primary" 
                className="mt-6 bg-[#1C1A17] hover:bg-brand-gold uppercase tracking-widest text-xs h-12 px-8 border-none"
                onClick={onClose}
              >
                {t('continueShopping')}
              </Button>
            </div>
          ) : (
            <div className="cart-items-list flex flex-col gap-6">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item-row flex gap-4 pb-6 border-b border-[#EAE3D9]/60">
                  <img src={item.image} alt={getBilingualValue(item, 'name')} className="cart-item-img w-20 h-24 object-cover border border-[#EAE3D9]/40 bg-[#FAF9F6]" />
                  
                  <div className="cart-item-details flex-grow flex flex-col justify-between">
                    <div>
                      <p className="cart-item-collection text-[10px] font-bold text-brand-gold uppercase tracking-widest">{getBilingualValue(item, 'collection')}</p>
                      <h4 className="cart-item-name text-sm font-medium text-[#1C1A17] mt-1">{getBilingualValue(item, 'name')}</h4>
                      <p className="cart-item-price text-xs font-semibold text-[#1C1A17] mt-1">
                        {(item.price * item.quantity).toLocaleString()} {lang === 'EN' ? 'EGP' : 'ج.م'}
                      </p>
                    </div>
                    
                    {/* Quantity Controls */}
                    <div className="cart-item-actions flex items-center justify-between mt-3">
                      <div className="qty-selectors flex items-center border border-[#EAE3D9] bg-white">
                        <button 
                          className="qty-btn w-7 h-7 flex items-center justify-center text-gray-500 hover:text-brand-gold"
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={12} />
                        </button>
                        <span className="qty-val w-6 text-center text-xs font-semibold">{item.quantity}</span>
                        <button 
                          className="qty-btn w-7 h-7 flex items-center justify-center text-gray-500 hover:text-brand-gold"
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button className="remove-item-btn text-[#706C66] hover:text-red-500 transition-colors" onClick={() => onRemoveItem(item.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Billing & Actions */}
        {cartItems.length > 0 && (
          <div className="cart-drawer-footer px-8 py-6 border-t border-[#EAE3D9] bg-white">
            
            {/* Promo Code Input */}
            <div className="coupon-code-wrap mb-4">
              {appliedCoupon ? (
                <div className="applied-coupon flex items-center justify-between bg-green-50 border border-green-200 px-3 py-2 text-xs text-green-700">
                  <div className="flex items-center gap-2">
                    <Ticket size={14} />
                    <span>
                      {appliedCoupon.code} ({appliedCoupon.discountPercent}% OFF)
                    </span>
                  </div>
                  <button 
                    onClick={handleRemoveCoupon} 
                    className="text-xs font-bold text-red-500 hover:underline cursor-pointer"
                  >
                    {lang === 'EN' ? 'Remove' : 'إزالة'}
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input 
                    placeholder={lang === 'EN' ? 'Coupon: LAZULI10' : 'كوبون الخصم: LAZULI10'}
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="text-xs border-[#EAE3D9] focus:border-brand-gold focus:ring-brand-gold h-10 rounded-none"
                    prefix={<Ticket size={14} className="text-gray-400" />}
                  />
                  <Button 
                    onClick={handleApplyCoupon}
                    className="bg-[#1C1A17] text-white hover:bg-brand-gold h-10 px-4 rounded-none text-xs border-none font-semibold uppercase tracking-wider"
                  >
                    {lang === 'EN' ? 'Apply' : 'تطبيق'}
                  </Button>
                </div>
              )}
            </div>

            {/* Premium Gift Toggle */}
            <div className="gift-message-wrap mb-4">
              <button 
                className={`gift-toggle-btn flex items-center gap-2 text-xs font-medium ${giftNoteOpen ? 'text-brand-gold' : 'text-[#706C66]'} hover:text-brand-gold transition-colors`}
                onClick={() => setGiftNoteOpen(!giftNoteOpen)}
              >
                <Gift size={16} />
                <span>{t('giftWrap')}</span>
              </button>
              {giftNoteOpen && (
                <textarea 
                  placeholder={t('giftPlaceholder')}
                  value={giftMessage}
                  onChange={(e) => setGiftMessage(e.target.value)}
                  className="gift-note-textarea w-full h-16 border border-[#EAE3D9] bg-[#FAF9F6] p-2 text-xs mt-2 outline-none focus:border-brand-gold transition-colors resize-none"
                />
              )}
            </div>

            {/* Subtotal & Totals */}
            <div className="bill-subtotal-row flex items-center justify-between text-sm text-[#706C66] mb-1">
              <span>{t('subtotal')}</span>
              <span>{subtotal.toLocaleString()} {lang === 'EN' ? 'EGP' : 'ج.م'}</span>
            </div>

            {appliedCoupon && (
              <div className="bill-discount-row flex items-center justify-between text-sm text-green-600 mb-1 font-semibold">
                <span>{lang === 'EN' ? 'Discount' : 'الخصم'}</span>
                <span>-{discountAmount.toLocaleString()} {lang === 'EN' ? 'EGP' : 'ج.م'}</span>
              </div>
            )}

            <div className="bill-total-row flex items-center justify-between text-base font-bold text-[#1C1A17] border-t border-[#EAE3D9]/60 pt-2 mb-1">
              <span>{lang === 'EN' ? 'Total' : 'المجموع'}</span>
              <span className="text-lg text-brand-copper">{finalTotal.toLocaleString()} {lang === 'EN' ? 'EGP' : 'ج.م'}</span>
            </div>
            
            <p className="bill-tax-notice text-[10px] text-[#706C66] mb-4 leading-relaxed">{t('taxNotice')}</p>
            
            <Button 
              type="primary" 
              className="btn-gold checkout-cta w-full h-12 bg-[#1C1A17] text-white hover:bg-brand-gold uppercase tracking-widest text-xs font-semibold border-none rounded-none"
              onClick={() => {
                onClose();
                onCheckout({ giftMessage });
              }}
            >
              {t('checkoutCta')}
            </Button>
          </div>
        )}

      </div>
    </Drawer>
  );
}
