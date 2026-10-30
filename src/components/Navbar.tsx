import React, { useState } from 'react';
import { BRAND_ASSETS } from '../lib/constants';
import { useI18n, Language } from '../lib/i18n';
import {
  Menu,
  X,
  Globe,
  Calendar,
  User,
  Shield,
  Music,
  ExternalLink
} from 'lucide-react';

interface NavbarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  userRole?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, onNavigate, userRole = 'admin' }) => {
  const { lang, setLang, t } = useI18n();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: t('nav.about'), route: '/about' },
    { label: t('nav.services'), route: '/services' },
    { label: t('nav.pricing'), route: '/pricing' },
    { label: t('nav.music'), route: '/music' },
    { label: t('nav.team'), route: '/team' },
    { label: t('nav.contact'), route: '/contact' }
  ];

  const handleLinkClick = (route: string) => {
    onNavigate(route);
    setMobileMenuOpen(false);
  };

  const toggleLanguage = () => {
    const nextLang: Language = lang === 'en' ? 'sw' : 'en';
    setLang(nextLang);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-neutral-950/85 backdrop-blur-xl border-b border-neutral-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark / Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => handleLinkClick('/')}
            className="flex items-center gap-3.5 focus:outline-none group text-left"
            aria-label="Colls Records Home"
          >
            <img
              src={BRAND_ASSETS.logo}
              alt="Colls Records Logo"
              referrerPolicy="no-referrer"
              className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </button>
        </div>

        {/* Zone 2: 4-6 Clean Text Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-neutral-300">
          {navLinks.map((link) => {
            const isActive = currentRoute === link.route;
            return (
              <button
                key={link.route}
                onClick={() => handleLinkClick(link.route)}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 relative hover:text-white ${
                  isActive ? 'text-amber-400 font-semibold' : 'text-neutral-300'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions & Utility Switchers */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          {/* Language Toggle (EN / SW) */}
          <button
            onClick={toggleLanguage}
            title="Switch Language (English / Kiswahili)"
            aria-label="Switch Language"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-xs font-mono text-neutral-300 hover:text-white transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-bold">{lang.toUpperCase()}</span>
          </button>

          {/* Client Portal Link */}
          <button
            onClick={() => handleLinkClick('/portal')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              currentRoute.startsWith('/portal')
                ? 'bg-neutral-800 text-amber-400 border border-amber-500/30'
                : 'text-neutral-400 hover:text-white bg-neutral-900/60 border border-neutral-800/80 hover:bg-neutral-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>{t('nav.portal')}</span>
          </button>

          {/* Admin Dashboard Link */}
          <button
            onClick={() => handleLinkClick('/admin')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              currentRoute.startsWith('/admin')
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-neutral-400 hover:text-white bg-neutral-900/60 border border-neutral-800/80 hover:bg-neutral-900'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-amber-500" />
            <span>Admin</span>
          </button>

          {/* Primary CTA: Book a Session */}
          <button
            onClick={() => handleLinkClick('/book')}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold tracking-wide uppercase bg-amber-500 hover:bg-amber-400 text-neutral-950 rounded-lg transition-transform active:scale-95 shadow-md shadow-amber-500/20 whitespace-nowrap shrink-0"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{t('nav.book')}</span>
          </button>
        </div>

        {/* Mobile Hamburger & Lang Button */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={toggleLanguage}
            className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 text-xs font-mono text-amber-400 font-bold"
          >
            {lang.toUpperCase()}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-neutral-950 border-b border-neutral-800 px-6 py-6 space-y-4 animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 gap-3 pb-4 border-b border-neutral-800">
            <button
              onClick={() => handleLinkClick('/')}
              className={`text-left py-2 px-3 rounded-lg text-sm font-medium ${
                currentRoute === '/' ? 'bg-amber-500/10 text-amber-400' : 'text-neutral-300'
              }`}
            >
              {t('nav.home')}
            </button>
            {navLinks.map((link) => (
              <button
                key={link.route}
                onClick={() => handleLinkClick(link.route)}
                className={`text-left py-2 px-3 rounded-lg text-sm font-medium ${
                  currentRoute === link.route ? 'bg-amber-500/10 text-amber-400' : 'text-neutral-300'
                }`}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => handleLinkClick('/videos')}
              className={`text-left py-2 px-3 rounded-lg text-sm font-medium ${
                currentRoute === '/videos' ? 'bg-amber-500/10 text-amber-400' : 'text-neutral-300'
              }`}
            >
              {t('nav.videos')}
            </button>
            <button
              onClick={() => handleLinkClick('/news')}
              className={`text-left py-2 px-3 rounded-lg text-sm font-medium ${
                currentRoute === '/news' ? 'bg-amber-500/10 text-amber-400' : 'text-neutral-300'
              }`}
            >
              {t('nav.news')}
            </button>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <button
              onClick={() => handleLinkClick('/book')}
              className="w-full flex items-center justify-center gap-2 py-3 bg-amber-500 text-neutral-950 font-bold uppercase rounded-lg text-sm shadow-lg shadow-amber-500/20"
            >
              <Calendar className="w-4 h-4" />
              <span>{t('nav.book')}</span>
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleLinkClick('/portal')}
                className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-semibold text-neutral-200"
              >
                <User className="w-4 h-4 text-amber-400" />
                <span>{t('nav.portal')}</span>
              </button>
              <button
                onClick={() => handleLinkClick('/admin')}
                className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-semibold text-neutral-200"
              >
                <Shield className="w-4 h-4 text-amber-500" />
                <span>Admin Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
