import React, { useState } from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, Gift } from 'lucide-react';

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem, 
  onCheckout,
  t,
  lang,
  getBilingualValue
}) {
  const [giftNoteOpen, setGiftNoteOpen] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  // Luxury FREE SHIPPING threshold
  const FREE_SHIPPING_THRESHOLD = 5000;
  const progressPercent = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const neededForFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal;

  if (!isOpen) return null;

  return (
    <>
      <div className="cart-drawer-overlay" onClick={onClose}>
        <div className="cart-drawer-panel" onClick={(e) => e.stopPropagation()}>
          
          {/* Drawer Header */}
          <div className="cart-drawer-header">
            <div className="cart-header-title">
              <ShoppingBag size={20} />
              <h2>{t('bagCount', { x: cartItems.reduce((a,b) => a+b.quantity, 0) })}</h2>
            </div>
            <button className="close-drawer-btn" onClick={onClose}>
              <X size={24} />
            </button>
          </div>

          {/* Dynamic Free Shipping Banner */}
          {subtotal > 0 && (
            <div className="shipping-bar-wrap">
              {subtotal >= FREE_SHIPPING_THRESHOLD ? (
                <p className="shipping-bar-text">{t('freeShippingUnlocked')}</p>
              ) : (
                <p className="shipping-bar-text">
                  {t('addMoreFreeShipping', { x: neededForFreeShipping.toLocaleString() })}
                </p>
              )}
              <div className="shipping-bar-track">
                <div className="shipping-bar-fill" style={{ width: `${progressPercent}%` }}></div>
              </div>
            </div>
          )}

          {/* Cart Items List */}
          <div className="cart-drawer-body">
            {cartItems.length === 0 ? (
              <div className="cart-empty-state">
                <div className="empty-icon-wrap">
                  <ShoppingBag size={48} strokeWidth={1} />
                </div>
                <h3>{t('emptyBag')}</h3>
                <p>{t('emptyBagDesc')}</p>
                <button className="btn-gold" style={{ marginTop: '2rem' }} onClick={onClose}>
                  <span>{t('continueShopping')}</span>
                </button>
              </div>
            ) : (
              <div className="cart-items-list">
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item-row">
                    <img src={item.image} alt={getBilingualValue(item, 'name')} className="cart-item-img" />
                    
                    <div className="cart-item-details">
                      <p className="cart-item-collection">{getBilingualValue(item, 'collection')}</p>
                      <h4 className="cart-item-name">{getBilingualValue(item, 'name')}</h4>
                      <p className="cart-item-price">{(item.price * item.quantity).toLocaleString()} {lang === 'EN' ? 'EGP' : 'ج.م'}</p>
                      
                      {/* Quantity Controls */}
                      <div className="cart-item-actions">
                        <div className="qty-selectors">
                          <button 
                            className="qty-btn"
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={12} />
                          </button>
                          <span className="qty-val">{item.quantity}</span>
                          <button 
                            className="qty-btn"
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button className="remove-item-btn" onClick={() => onRemoveItem(item.id)}>
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
            <div className="cart-drawer-footer">
              {/* Premium Gift Toggle */}
              <div className="gift-message-wrap">
                <button 
                  className={`gift-toggle-btn ${giftNoteOpen ? 'active' : ''}`}
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
                    className="gift-note-textarea"
                  />
                )}
              </div>

              {/* Subtotal */}
              <div className="bill-subtotal-row">
                <span>{t('subtotal')}</span>
                <strong>{subtotal.toLocaleString()} {lang === 'EN' ? 'EGP' : 'ج.م'}</strong>
              </div>
              <p className="bill-tax-notice">{t('taxNotice')}</p>
              
              <button 
                className="btn-gold checkout-cta"
                onClick={() => {
                  onClose();
                  onCheckout({ giftMessage });
                }}
              >
                <span>{t('checkoutCta')}</span>
              </button>
            </div>
          )}

        </div>
      </div>

      <style>{`
        .cart-drawer-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 300;
          display: flex;
          justify-content: flex-end;
          animation: fade-in 0.3s ease-out;
        }

        .rtl-active.cart-drawer-overlay {
          justify-content: flex-start;
        }

        .cart-drawer-panel {
          width: 100%;
          max-width: 480px;
          height: 100%;
          background: var(--bg-secondary);
          box-shadow: var(--shadow-lg);
          display: flex;
          flex-direction: column;
          position: relative;
          z-index: 310;
          animation: slide-in-right 0.4s cubic-bezier(0.25, 1, 0.5, 1);
        }

        .rtl-active .cart-drawer-panel {
          animation: slide-in-left-drawer 0.4s cubic-bezier(0.25, 1, 0.5, 1);
        }

        .cart-drawer-header {
          padding: 1.5rem 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border-color);
        }

        .cart-header-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: var(--text-primary);
        }

        .cart-header-title h2 {
          font-size: 1.15rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .close-drawer-btn {
          background: transparent;
          border: none;
          color: var(--text-primary);
          cursor: pointer;
          transition: var(--transition-snappy);
        }

        .close-drawer-btn:hover {
          color: var(--gold-primary);
        }

        /* Shipping bar styles */
        .shipping-bar-wrap {
          padding: 1rem 2rem;
          background: #FAF8F4;
          border-bottom: 1px solid var(--border-color);
        }

        .shipping-bar-text {
          font-size: 0.8rem;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }

        .shipping-bar-track {
          width: 100%;
          height: 4px;
          background: #EAE3D9;
          border-radius: 2px;
          overflow: hidden;
        }

        .shipping-bar-fill {
          height: 100%;
          background: var(--gold-gradient);
          border-radius: 2px;
          transition: width 0.5s ease-out;
        }

        /* Body and Items */
        .cart-drawer-body {
          flex-grow: 1;
          overflow-y: auto;
          padding: 2rem;
        }

        .cart-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          text-align: center;
        }

        .empty-icon-wrap {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          border: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
          color: var(--text-secondary);
        }

        .cart-empty-state h3 {
          font-size: 1.4rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
        }

        .cart-empty-state p {
          color: var(--text-secondary);
          font-size: 0.9rem;
          max-width: 250px;
        }

        .cart-items-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .cart-item-row {
          display: flex;
          gap: 1.25rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid rgba(234, 227, 217, 0.5);
        }

        .cart-item-img {
          width: 80px;
          height: 100px;
          object-fit: cover;
          background: var(--bg-primary);
          border: 1px solid rgba(234, 227, 217, 0.4);
        }

        .cart-item-details {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }

        .cart-item-collection {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--gold-primary);
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .cart-item-name {
          font-family: 'Outfit', sans-serif;
          font-size: 0.95rem;
          font-weight: 500;
          color: var(--text-primary);
          margin-bottom: 0.25rem;
        }

        .cart-item-price {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: auto;
        }

        .cart-item-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 0.5rem;
        }

        .qty-selectors {
          display: flex;
          align-items: center;
          border: 1px solid var(--border-color);
          background: #FFFDFB;
        }

        .qty-btn {
          background: transparent;
          border: none;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--text-secondary);
        }

        .qty-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .qty-val {
          width: 24px;
          text-align: center;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .remove-item-btn {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          transition: var(--transition-snappy);
        }

        .remove-item-btn:hover {
          color: #D9534F;
        }

        /* Footer styles */
        .cart-drawer-footer {
          padding: 1.5rem 2rem;
          border-top: 1px solid var(--border-color);
          background: #FFFDFB;
        }

        .gift-message-wrap {
          margin-bottom: 1.5rem;
        }

        .gift-toggle-btn {
          background: transparent;
          border: none;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-secondary);
          font-size: 0.8rem;
          cursor: pointer;
          font-weight: 500;
          width: 100%;
          text-align: inherit;
        }

        .gift-toggle-btn:hover, .gift-toggle-btn.active {
          color: var(--gold-primary);
        }

        .gift-note-textarea {
          width: 100%;
          height: 60px;
          border: 1px solid var(--border-color);
          background: var(--bg-primary);
          padding: 0.5rem;
          font-size: 0.8rem;
          margin-top: 0.5rem;
          resize: none;
        }

        .bill-subtotal-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 1.1rem;
          margin-bottom: 0.25rem;
        }

        .bill-subtotal-row strong {
          color: var(--text-primary);
          font-size: 1.2rem;
        }

        .bill-tax-notice {
          font-size: 0.75rem;
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
        }

        .checkout-cta {
          width: 100%;
          height: 50px;
        }

        /* Slide in animations */
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        @keyframes slide-in-left-drawer {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }

        @media (max-width: 480px) {
          .cart-drawer-panel {
            max-width: 100%;
          }
          .cart-drawer-header, .shipping-bar-wrap, .cart-drawer-body, .cart-drawer-footer {
            padding-left: 1.5rem;
            padding-right: 1.5rem;
          }
        }
      `}</style>
    </>
  );
}
