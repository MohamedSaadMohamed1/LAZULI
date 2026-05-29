import React, { useState } from 'react';
import { Heart, ShoppingBag } from 'lucide-react';

export default function ProductCard({ 
  product, 
  onProductClick, 
  onAddToCart, 
  isFavorite, 
  onToggleFavorite,
  t,
  lang,
  getBilingualValue
}) {
  const [hovered, setHovered] = useState(false);

  const stoneName = getBilingualValue(product, 'stone');

  return (
    <>
      <div 
        className="product-card"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Product Images & Badge Area */}
        <div className="product-card-image-wrap" onClick={() => onProductClick(product)}>
          {/* Stone Badges */}
          <div className="product-card-badges">
            {stoneName && stoneName !== "None" && (
              <span className="badge-stone">{stoneName}</span>
            )}
            {product.stock <= 3 && product.stock > 0 && (
              <span className="badge-low-stock">{t('onlyLeft', { x: product.stock })}</span>
            )}
            {product.stock === 0 && (
              <span className="badge-sold-out">{t('soldOut')}</span>
            )}
          </div>

          {/* Favorite Toggle Button */}
          <button 
            className={`favorite-btn ${isFavorite ? 'fav-active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(product.id);
            }}
          >
            <Heart size={18} fill={isFavorite ? '#E06A6A' : 'transparent'} />
          </button>

          {/* Dual-image display with smooth fade */}
          <img 
            src={product.image} 
            alt={getBilingualValue(product, 'name')} 
            className={`product-img main-img ${hovered && product.hoverImage ? 'img-hidden' : ''}`}
            loading="lazy"
          />
          {product.hoverImage && (
            <img 
              src={product.hoverImage} 
              alt={`${getBilingualValue(product, 'name')} alternate view`} 
              className={`product-img hover-img ${hovered ? 'img-visible' : ''}`}
              loading="lazy"
            />
          )}

          {/* Quick Add Overlay on Desktop */}
          {product.stock > 0 && (
            <button 
              className="quick-add-overlay"
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
            >
              <ShoppingBag size={16} style={{ marginRight: '6px', marginLeft: '6px' }} />
              {t('quickAdd')}
            </button>
          )}
        </div>

        {/* Product Meta Data */}
        <div className="product-card-info" onClick={() => onProductClick(product)}>
          <span className="product-card-collection">{getBilingualValue(product, 'collection')}</span>
          <h3 className="product-card-title">{getBilingualValue(product, 'name')}</h3>
          
          <div className="product-card-price-row">
            <span className="product-card-price">{product.price.toLocaleString()} {lang === 'EN' ? 'EGP' : 'ج.م'}</span>
            {product.stock > 0 && (
              <button 
                className="mobile-quick-add"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart(product);
                }}
              >
                {t('add')}
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .product-card {
          display: flex;
          flex-direction: column;
          background: transparent;
          border-radius: 0;
          overflow: hidden;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .product-card-image-wrap {
          position: relative;
          width: 100%;
          padding-top: 120%; /* Standard premium jewelry aspect ratio (5:6) */
          background-color: #FAF9F6;
          overflow: hidden;
          margin-bottom: 0.75rem;
          border: 1px solid rgba(234, 227, 217, 0.4);
        }

        .product-img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 1.2s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.6s ease;
        }

        .main-img {
          opacity: 1;
        }

        .img-hidden {
          opacity: 0;
        }

        .hover-img {
          opacity: 0;
          transform: scale(1.02);
        }

        .img-visible {
          opacity: 1;
          transform: scale(1.06); /* Luxurious slow-zoom on hover */
        }

        .product-card-image-wrap:hover .main-img:not(.img-hidden) {
          transform: scale(1.06);
        }

        .product-card-badges {
          position: absolute;
          top: 0.75rem;
          left: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          z-index: 10;
        }

        .badge-stone {
          background: rgba(253, 251, 250, 0.9);
          color: var(--text-primary);
          border: 1px solid var(--border-color);
          font-size: 0.6rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          padding: 0.25rem 0.5rem;
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
        }

        .badge-low-stock {
          background: rgba(217, 83, 79, 0.9);
          color: var(--bg-secondary);
          font-size: 0.6rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 0.25rem 0.5rem;
        }

        .badge-sold-out {
          background: rgba(28, 26, 23, 0.85);
          color: var(--bg-secondary);
          font-size: 0.6rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 0.25rem 0.5rem;
        }

        .favorite-btn {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          border: 1px solid var(--border-color);
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--text-secondary);
          z-index: 10;
          transition: var(--transition-smooth);
        }

        .favorite-btn:hover {
          background: var(--bg-secondary);
          color: #E06A6A;
          transform: scale(1.1);
        }

        .fav-active {
          color: #E06A6A !important;
          border-color: #F8D7DA;
          background: var(--bg-secondary);
        }

        .quick-add-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          padding: 1rem;
          background: rgba(28, 26, 23, 0.9);
          backdrop-filter: blur(4px);
          color: var(--bg-secondary);
          border: none;
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: translateY(100%);
          transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
          z-index: 12;
          cursor: pointer;
        }

        .product-card-image-wrap:hover .quick-add-overlay {
          transform: translateY(0);
        }

        .quick-add-overlay:hover {
          background: var(--gold-primary);
          color: var(--text-primary);
        }

        .product-card-info {
          display: flex;
          flex-direction: column;
          padding: 0 0.15rem;
        }

        .product-card-collection {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--gold-primary);
          font-weight: 700;
          margin-bottom: 0.25rem;
        }

        .product-card-title {
          font-size: 0.95rem;
          font-weight: 400;
          color: var(--text-primary);
          margin-bottom: 0.4rem;
          transition: var(--transition-snappy);
          /* Perfect editorial ellipsis */
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .product-card:hover .product-card-title {
          color: var(--gold-primary);
        }

        .product-card-price-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .product-card-price {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .mobile-quick-add {
          display: none;
          background: transparent;
          border: 1px solid var(--text-primary);
          padding: 0.25rem 0.5rem;
          font-size: 0.65rem;
          text-transform: uppercase;
          font-weight: 700;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: var(--transition-snappy);
        }

        .mobile-quick-add:hover {
          background: var(--text-primary);
          color: var(--bg-secondary);
        }

        @media (max-width: 768px) {
          .quick-add-overlay {
            display: none;
          }
          .mobile-quick-add {
            display: block;
          }
          .product-card-badges {
            top: 0.5rem;
            left: 0.5rem;
            gap: 0.25rem;
          }
          .badge-stone, .badge-low-stock, .badge-sold-out {
            font-size: 0.5rem;
            padding: 0.2rem 0.4rem;
          }
          .favorite-btn {
            top: 0.5rem;
            right: 0.5rem;
            width: 28px;
            height: 28px;
          }
          .favorite-btn svg {
            width: 14px;
            height: 14px;
          }
          .product-card-title {
            font-size: 0.85rem;
            margin-bottom: 0.25rem;
          }
          .product-card-price {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </>
  );
}
