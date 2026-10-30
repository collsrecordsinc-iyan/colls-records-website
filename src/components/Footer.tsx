import React from 'react';
import { BRAND_ASSETS, COMPANY_INFO } from '../lib/constants';
import { useI18n } from '../lib/i18n';
import {
  Mail,
  MapPin,
  Youtube,
  Phone,
  MessageCircle,
  ArrowUpRight,
  Heart,
  Music2,
  ShieldCheck
} from 'lucide-react';

interface FooterProps {
  onNavigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t } = useI18n();

  return (
    <footer className="bg-neutral-950 border-t border-neutral-900 text-neutral-400 pt-16 pb-28 sm:pb-20 relative overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-amber-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-neutral-900">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <img
              src={BRAND_ASSETS.logo}
              alt="Colls Records"
              referrerPolicy="no-referrer"
              className="h-12 w-auto object-contain cursor-pointer"
              onClick={() => onNavigate('/')}
            />
            <p className="text-sm text-neutral-400 max-w-sm leading-relaxed">
              International music label, recording studio and creative multimedia company based in Tanga, Tanzania. Elevating East African sound and visual storytelling to global standards.
            </p>

            <div className="pt-2 flex flex-col gap-2 text-xs">
              <a
                href={`mailto:${COMPANY_INFO.email}`}
                className="flex items-center gap-2 hover:text-amber-400 transition-colors text-neutral-300"
              >
                <Mail className="w-4 h-4 text-amber-500" />
                <span>{COMPANY_INFO.email}</span>
              </a>
              <div className="flex items-center gap-2 text-neutral-400">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{COMPANY_INFO.fullAddress}</span>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-semibold mb-4">
              Explore
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => onNavigate('/')} className="hover:text-amber-400 transition-colors">
                  {t('nav.home')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/about')} className="hover:text-amber-400 transition-colors">
                  {t('nav.about')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/music')} className="hover:text-amber-400 transition-colors">
                  {t('nav.music')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/videos')} className="hover:text-amber-400 transition-colors">
                  {t('nav.videos')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/team')} className="hover:text-amber-400 transition-colors">
                  {t('nav.team')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/news')} className="hover:text-amber-400 transition-colors">
                  {t('nav.news')}
                </button>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-semibold mb-4">
              Services &amp; Rates
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => onNavigate('/services')} className="hover:text-amber-400 transition-colors">
                  Music Recording
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/services')} className="hover:text-amber-400 transition-colors">
                  Beats Making &amp; Production
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/services')} className="hover:text-amber-400 transition-colors">
                  Mixing &amp; Mastering
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/services')} className="hover:text-amber-400 transition-colors">
                  Music Video &amp; Film
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/pricing')} className="hover:text-amber-400 transition-colors">
                  TZS Pricing Packages
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/book')} className="text-amber-400 font-medium hover:underline">
                  Book a Studio Session →
                </button>
              </li>
            </ul>
          </div>

          {/* Producer Hotline */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-semibold mb-4">
              Direct Producers
            </h4>
            <div className="space-y-3 text-xs">
              <a
                href="https://wa.me/255741808971"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-amber-500/40 block transition-colors group"
              >
                <div className="font-semibold text-white group-hover:text-amber-400 flex items-center justify-between">
                  <span>Peter Manyama (New Beats)</span>
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="text-neutral-400 mt-0.5">Chief Producer · +255741808971</div>
              </a>

              <a
                href="https://wa.me/255620742182"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-amber-500/40 block transition-colors group"
              >
                <div className="font-semibold text-white group-hover:text-amber-400 flex items-center justify-between">
                  <span>Jacoh Master (Jackson Paul)</span>
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="text-neutral-400 mt-0.5">Assistant Producer · +255620742182</div>
              </a>

              <a
                href={COMPANY_INFO.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-neutral-300 hover:text-red-400 transition-colors pt-1"
              >
                <Youtube className="w-4 h-4 text-red-500" />
                <span className="font-medium">Subscribe @CollsRecords</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div>
            {COMPANY_INFO.copyright}
          </div>

          <div className="flex items-center gap-4">
            <span className="text-amber-400/90 font-medium">
              {COMPANY_INFO.developerCredit}
            </span>
            <span className="text-neutral-700">·</span>
            <button
              onClick={() => onNavigate('/admin')}
              className="hover:text-neutral-300 transition-colors flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-neutral-500" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
