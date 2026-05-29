import React, { useState } from 'react';
import { Mail, ArrowRight, Instagram, Facebook, Compass } from 'lucide-react';

export default function Footer({ setCurrentTab, t, lang }) {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim() !== '') {
      setSuccess(true);
      setEmail('');
    }
  };

  return (
    <>
      <footer className="footer-premium">
        <div className="footer-grid section-container">
          
          {/* Column 1: Brand Pitch & Story */}
          <div className="footer-col-story">
            <h3 className="footer-logo">LAZULI</h3>
            <p className="footer-brand-desc">
              {t('heritageText1')}
            </p>
            <div className="social-links-row">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-icon">
                <Instagram size={18} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-icon">
                <Facebook size={18} />
              </a>
              <a href="https://manollijewelry.com" target="_blank" rel="noreferrer" className="social-icon">
                <Compass size={18} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-col-links">
            <h4>{t('exploreCollection').replace('→', '').trim()}</h4>
            <div className="footer-nav-links">
              <button onClick={() => setCurrentTab('Home')}>{t('home')}</button>
              <button onClick={() => setCurrentTab('Shop')}>{t('shop')}</button>
              <button onClick={() => setCurrentTab('Orders')}>{t('orders')}</button>
              <button onClick={() => setCurrentTab('Admin')}>{t('adminPanel')}</button>
            </div>
          </div>

          {/* Column 3: Contact & Info */}
          <div className="footer-col-links">
            <h4>{t('heritageCraft')}</h4>
            <ul className="footer-info-list">
              <li>{lang === 'EN' ? 'Moez Street Studio, Islamic Cairo' : 'استوديو شارع المعز، القاهرة الإسلامية'}</li>
              <li>{lang === 'EN' ? 'Cairo, Egypt' : 'القاهرة، مصر'}</li>
              <li>support@manolli.com</li>
              <li>+20 102 345 6789</li>
            </ul>
          </div>

          {/* Column 4: Newsletter Subscription */}
          <div className="footer-col-news">
            <h4>{t('newsletterTitle')}</h4>
            <p className="newsletter-p">{t('newsletterP')}</p>
            
            {success ? (
              <div className="newsletter-success">
                {t('newsletterSuccess')}
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="newsletter-form">
                <div className="newsletter-input-wrap">
                  <Mail size={16} className="mail-icon" />
                  <input 
                    type="email" 
                    placeholder={t('emailAddr') + '...'} 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button type="submit" className="submit-arrow-btn">
                    <ArrowRight size={16} />
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

        {/* Footer bottom bar */}
        <div className="footer-bottom-bar">
          <div className="bottom-bar-container">
            <p>{t('footerCopyright', { year: new Date().getFullYear() })}</p>
            <div className="bottom-links">
              <span>{t('privacyPolicy')}</span>
              <span>{t('termsOfService')}</span>
              <span>{t('egyptianCraftCert')}</span>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        .footer-premium {
          background: var(--bg-dark);
          color: #BDBBB6;
          border-top: 1px solid var(--border-dark);
          padding-top: 2rem;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr 0.8fr 1.2fr;
          gap: 4rem;
          padding-bottom: 4rem !important;
        }

        .footer-logo {
          font-family: 'Playfair Display', serif;
          font-size: 2.2rem;
          letter-spacing: 0.15em;
          color: var(--text-light);
          margin-bottom: 1.5rem;
        }

        .footer-brand-desc {
          font-size: 0.85rem;
          line-height: 1.7;
          color: #8C8A84;
          margin-bottom: 2rem;
        }

        .social-links-row {
          display: flex;
          gap: 1rem;
        }

        .social-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid var(--border-dark);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #8C8A84;
          transition: var(--transition-snappy);
        }

        .social-icon:hover {
          color: var(--gold-primary);
          border-color: var(--gold-primary);
          transform: translateY(-2px);
        }

        /* Footer Column Links */
        .footer-col-links h4, .footer-col-news h4 {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-light);
          font-weight: 600;
          margin-bottom: 1.75rem;
        }

        .footer-nav-links {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.85rem;
        }

        .footer-nav-links button {
          background: transparent;
          border: none;
          color: #8C8A84;
          font-size: 0.85rem;
          cursor: pointer;
          font-family: inherit;
          transition: var(--transition-snappy);
        }

        .footer-nav-links button:hover {
          color: var(--gold-primary);
        }

        .rtl-active .footer-nav-links button:hover {
          padding-left: 0;
          padding-right: 0.25rem;
        }

        .footer-info-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          font-size: 0.85rem;
          color: #8C8A84;
        }

        /* Newsletter */
        .newsletter-p {
          font-size: 0.85rem;
          line-height: 1.6;
          color: #8C8A84;
          margin-bottom: 1.5rem;
        }

        .newsletter-success {
          background: rgba(196, 164, 120, 0.1);
          color: var(--gold-primary);
          border: 1px solid rgba(196, 164, 120, 0.2);
          padding: 0.8rem 1rem;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .newsletter-form {
          width: 100%;
        }

        .newsletter-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
          border-bottom: 1px solid var(--border-dark);
          padding: 0.5rem 0;
        }

        .mail-icon {
          position: absolute;
          left: 0;
          color: #5C5A55;
        }

        .rtl-active .mail-icon {
          left: auto;
          right: 0;
        }

        .newsletter-input-wrap input {
          width: 100%;
          background: transparent;
          border: none;
          padding: 0.25rem 2.5rem 0.25rem 2rem;
          font-size: 0.85rem;
          color: var(--text-light);
        }

        .rtl-active .newsletter-input-wrap input {
          padding: 0.25rem 2rem 0.25rem 2.5rem;
        }

        .newsletter-input-wrap input::placeholder {
          color: #5C5A55;
        }

        .submit-arrow-btn {
          position: absolute;
          right: 0;
          background: transparent;
          border: none;
          color: var(--gold-primary);
          cursor: pointer;
          transition: var(--transition-snappy);
        }

        .rtl-active .submit-arrow-btn {
          right: auto;
          left: 0;
        }

        .rtl-active .submit-arrow-btn svg {
          transform: rotate(180deg);
        }

        /* Footer Bottom Bar */
        .footer-bottom-bar {
          border-top: 1px solid var(--border-dark);
          margin-top: 4rem;
          padding: 2rem 0;
          font-size: 0.75rem;
          color: #6C6A64;
        }

        .bottom-bar-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .bottom-links {
          display: flex;
          gap: 2rem;
        }

        .bottom-links span {
          cursor: pointer;
          transition: var(--transition-snappy);
        }

        .bottom-links span:hover {
          color: var(--gold-primary);
        }

        @media (max-width: 1024px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 3rem;
          }
        }

        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }
          .bottom-bar-container {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }
          .bottom-links {
            flex-direction: column;
            gap: 0.5rem;
          }
        }
      `}</style>
    </>
  );
}
