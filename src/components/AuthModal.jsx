import React, { useState } from 'react';
import { X, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { authInstance } from '../firebase/config';

export default function AuthModal({ isOpen, onClose, t, lang }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        await authInstance.createUserWithEmailAndPassword(email, password);
      } else {
        await authInstance.signInWithEmailAndPassword(email, password);
      }
      onClose();
    } catch (err) {
      console.error(err);
      if (err.message.includes('email-already-in-use')) {
        setError(lang === 'EN' ? 'This email is already in use.' : 'هذا البريد الإلكتروني مسجل بالفعل.');
      } else if (err.message.includes('wrong-password') || err.message.includes('user-not-found')) {
        setError(lang === 'EN' ? 'Incorrect email or password.' : 'البريد الإلكتروني أو كلمة المرور غير صحيحة.');
      } else if (err.message.includes('weak-password')) {
        setError(lang === 'EN' ? 'Password must be at least 6 characters.' : 'يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.');
      } else {
        setError(lang === 'EN' ? 'Authentication failed.' : 'فشلت عملية التحقق. يرجى المحاولة مرة أخرى.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await authInstance.signInWithGoogle();
      onClose();
    } catch (err) {
      console.error("Google Auth failed:", err);
      setError(lang === 'EN' ? 'Google authentication failed.' : 'فشلت عملية التحقق باستخدام جوجل.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="auth-overlay" onClick={onClose}>
        <div className="auth-card" onClick={(e) => e.stopPropagation()}>
          <button className="auth-close-btn" onClick={onClose}>
            <X size={20} />
          </button>

          <div className="auth-header">
            <h2>{isRegister ? t('addProductTab') : t('welcome')}</h2>
            <p>{isRegister ? (lang === 'EN' ? 'Join Lazuli to save favorites and track fine jewelry orders.' : 'انضم للازولي لحفظ قطعك المفضلة وتتبع طلباتك الفاخرة.') : (lang === 'EN' ? 'Sign in to access your saved items and secure checkout.' : 'سجل دخولك لتتمكن من تصفح قطعك المفضلة وإإتمام الشراء بأمان.')}</p>
          </div>

          {/* Demo Credentials Callout */}
          <div className="demo-accounts-callout">
            <span className="demo-badge">✨ Demo Credentials / بيانات التجربة</span>
            <div className="demo-rows">
              <button 
                type="button" 
                className="demo-row-btn"
                onClick={() => {
                  setEmail('user@lazuli.com');
                  setPassword('user123');
                  setIsRegister(false);
                }}
              >
                <strong>Client (عميل):</strong> <span>user@lazuli.com</span> / <span>user123</span>
              </button>
              <button 
                type="button" 
                className="demo-row-btn"
                onClick={() => {
                  setEmail('admin@lazuli.com');
                  setPassword('admin123');
                  setIsRegister(false);
                }}
              >
                <strong>Admin (مشرف):</strong> <span>admin@lazuli.com</span> / <span>admin123</span>
              </button>
            </div>
            <p className="demo-hint">{lang === 'EN' ? '💡 Click a row above to auto-fill forms!' : '💡 اضغط على أي سطر أعلاه لتعبئة النموذج تلقائياً!'}</p>
          </div>

          {error && <div className="auth-error-banner">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group-premium">
              <label>{t('emailAddr')}</label>
              <div className="input-wrapper">
                <Mail size={16} className="input-icon" />
                <input 
                  type="email" 
                  placeholder="yourname@gmail.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-group-premium">
              <label>{lang === 'EN' ? 'Password' : 'كلمة المرور'}</label>
              <div className="input-wrapper">
                <Lock size={16} className="input-icon" />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-gold auth-submit-btn"
              disabled={loading}
            >
              <span>{loading ? (lang === 'EN' ? 'Authenticating...' : 'جاري التحقق...') : isRegister ? (lang === 'EN' ? 'Register' : 'إنشاء حساب') : (lang === 'EN' ? 'Sign In' : 'تسجيل الدخول')}</span>
            </button>

            <div className="auth-social-divider">
              <span>{lang === 'EN' ? 'or' : 'أو'}</span>
            </div>

            <button 
              type="button" 
              className="google-signin-btn"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" className="google-icon-svg">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>{lang === 'EN' ? 'Continue with Google' : 'متابعة باستخدام حساب جوجل'}</span>
            </button>
          </form>

          <div className="auth-footer">
            {isRegister ? (
              <p>
                {lang === 'EN' ? 'Already have an account? ' : 'لديك حساب بالفعل؟ '}
                <button onClick={() => { setIsRegister(false); setError(''); }}>{lang === 'EN' ? 'Sign In' : 'تسجيل الدخول'}</button>
              </p>
            ) : (
              <p>
                {lang === 'EN' ? "Don't have an account? " : 'ليس لديك حساب؟ '}
                <button onClick={() => { setIsRegister(true); setError(''); }}>{lang === 'EN' ? 'Register' : 'إنشاء حساب جديد'}</button>
              </p>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .auth-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          z-index: 400;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          animation: fade-in 0.3s ease-out;
        }

        .auth-card {
          width: 100%;
          max-width: 440px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-lg);
          padding: 2.5rem 2.5rem;
          position: relative;
          display: flex;
          flex-direction: column;
          animation: scale-up 0.4s cubic-bezier(0.25, 1, 0.5, 1);
        }

        .auth-close-btn {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          transition: var(--transition-snappy);
        }

        .rtl-active .auth-close-btn {
          left: 1.5rem;
          right: auto;
        }

        .auth-close-btn:hover {
          color: var(--gold-primary);
        }

        .auth-header {
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .auth-header h2 {
          font-size: 1.8rem;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }

        .auth-header p {
          font-size: 0.85rem;
          color: var(--text-secondary);
          max-width: 320px;
          margin: 0 auto;
        }

        /* Demo Credentials Callout */
        .demo-accounts-callout {
          background: #FAF8F4;
          border: 1px solid var(--border-color);
          padding: 0.8rem 1rem;
          margin-bottom: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .demo-badge {
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--gold-primary);
          display: block;
        }

        .demo-rows {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .demo-row-btn {
          background: transparent;
          border: none;
          text-align: inherit;
          font-family: inherit;
          font-size: 0.75rem;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 0.25rem 0.5rem;
          border-radius: 3px;
          transition: var(--transition-snappy);
          display: flex;
          justify-content: space-between;
          border: 1px dashed transparent;
        }

        .rtl-active .demo-row-btn {
          flex-direction: row-reverse;
        }

        .demo-row-btn:hover {
          background: rgba(196, 164, 120, 0.08);
          border-color: var(--gold-primary);
          color: var(--text-primary);
        }

        .demo-row-btn strong {
          color: var(--gold-primary);
        }

        .demo-hint {
          font-size: 0.65rem;
          color: var(--text-muted);
          text-align: center;
          margin-top: 0.1rem;
        }

        .auth-error-banner {
          background: #FDF2F2;
          border: 1px solid #FDE8E8;
          color: #C81E1E;
          padding: 0.8rem 1rem;
          font-size: 0.8rem;
          margin-bottom: 1.5rem;
          font-weight: 500;
          text-align: center;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .input-group-premium {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .input-group-premium label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-primary);
          font-weight: 600;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          color: var(--text-secondary);
          pointer-events: none;
        }

        .rtl-active .input-icon {
          left: auto;
          right: 1rem;
        }

        .input-wrapper input {
          width: 100%;
          height: 46px;
          padding: 0 1rem 0 2.5rem;
          border: 1px solid var(--border-color);
          background: var(--bg-primary);
          color: var(--text-primary);
          font-size: 0.9rem;
          transition: var(--transition-smooth);
        }

        .rtl-active .input-wrapper input {
          padding: 0 2.5rem 0 1rem;
        }

        .input-wrapper input:focus {
          border-color: var(--gold-primary);
          background: var(--bg-secondary);
          box-shadow: 0 0 0 3px rgba(196, 164, 120, 0.15);
        }

        .eye-btn {
          position: absolute;
          right: 1rem;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
        }

        .rtl-active .eye-btn {
          right: auto;
          left: 1rem;
        }

        .eye-btn:hover {
          color: var(--gold-primary);
        }

        .auth-submit-btn {
          width: 100%;
          height: 48px;
          margin-top: 0.75rem;
        }

        .auth-submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .auth-social-divider {
          display: flex;
          align-items: center;
          text-align: center;
          margin: 1.25rem 0;
          color: var(--text-muted);
        }

        .auth-social-divider::before,
        .auth-social-divider::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid var(--border-color);
        }

        .auth-social-divider::before {
          margin-right: .6em;
        }

        .auth-social-divider::after {
          margin-left: .6em;
        }

        .auth-social-divider span {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .google-signin-btn {
          width: 100%;
          height: 48px;
          border: 1px solid var(--border-color);
          background: var(--bg-secondary);
          color: var(--text-primary);
          font-weight: 600;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .google-signin-btn:hover {
          border-color: var(--gold-primary);
          background: #FAF8F4;
          transform: translateY(-1px);
        }

        .google-signin-btn:active {
          transform: translateY(0);
        }

        .google-signin-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .google-icon-svg {
          flex-shrink: 0;
        }

        .auth-footer {
          margin-top: 2rem;
          text-align: center;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .auth-footer button {
          background: transparent;
          border: none;
          color: var(--gold-primary);
          font-weight: 600;
          cursor: pointer;
          text-decoration: underline;
        }

        .auth-footer button:hover {
          color: var(--gold-dark);
        }

        @keyframes scale-up {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
}
