import React, { useState, useEffect } from 'react';
import { db } from '../lib/db';
import { PricingPackage } from '../types';
import { INITIAL_PRICING } from '../lib/constants';
import { formatTZS } from '../utils/pricing';
import { useI18n } from '../lib/i18n';
import {
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  PhoneCall,
  Clock
} from 'lucide-react';

interface PricingPageProps {
  onNavigate: (route: string) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onNavigate }) => {
  const { lang, t } = useI18n();
  const [packages, setPackages] = useState<PricingPackage[]>(INITIAL_PRICING);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  useEffect(() => {
    db.getPricingPackages().then(setPackages);
    const handleUpdate = () => db.getPricingPackages().then(setPackages);
    window.addEventListener('colls_db_updated', handleUpdate);
    return () => window.removeEventListener('colls_db_updated', handleUpdate);
  }, []);

  const categories = ['All', 'Recording', 'Beats', 'Mixing', 'Mastering', 'Full Song', 'Promotion', 'Video & Film'];

  const filtered = activeCategory === 'All'
    ? packages.filter(p => p.is_active)
    : packages.filter(p => p.is_active && p.category === activeCategory);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest">
            <Sparkles className="w-4 h-4" />
            <span>Tanzanian Shillings (TZS) Rates</span>
          </div>
          <h1 className="font-display font-black text-4xl sm:text-6xl text-white uppercase tracking-tight">
            Transparent Studio Pricing
          </h1>
          <p className="text-base text-neutral-300 leading-relaxed">
            Honest, competitive rates tailored for artists, producers, and businesses in East Africa. No hidden fees.
          </p>

          {/* Category Tabs */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-colors ${
                  activeCategory === cat
                    ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                    : 'bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((pkg) => {
            const name = lang === 'sw' && pkg.swahili_name ? pkg.swahili_name : pkg.name;
            const features = lang === 'sw' && pkg.swahili_features && pkg.swahili_features.length > 0
              ? pkg.swahili_features
              : pkg.features;

            return (
              <div
                key={pkg.id}
                className={`glass-panel p-7 rounded-3xl border transition-all duration-300 flex flex-col justify-between relative shadow-xl ${
                  pkg.is_popular
                    ? 'border-amber-500/60 shadow-amber-500/10'
                    : 'border-neutral-800 hover:border-neutral-700'
                }`}
              >
                {pkg.is_popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-500 text-neutral-950 font-bold text-[10px] uppercase font-mono px-4 py-1 rounded-full shadow-lg tracking-wider">
                    Recommended
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-mono uppercase text-amber-400 font-semibold">
                      {pkg.category}
                    </span>
                    <span className="text-[11px] font-mono text-neutral-400">
                      Tanga Studio
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-4">
                    {name}
                  </h3>

                  <div className="py-4 my-2 border-y border-neutral-800/80">
                    <div className="font-display font-extrabold text-3xl sm:text-4xl text-white tabular-nums">
                      {formatTZS(pkg.price_tzs)}
                    </div>
                    <span className="text-xs font-mono text-neutral-400 mt-1 block">
                      per {pkg.unit}
                    </span>
                  </div>

                  <ul className="space-y-3.5 my-6 text-xs text-neutral-300">
                    {features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-800/80">
                  <button
                    onClick={() => onNavigate(`/book?package=${pkg.id}`)}
                    className={`w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 active:scale-95 ${
                      pkg.is_popular
                        ? 'bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-lg shadow-amber-500/20'
                        : 'bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700'
                    }`}
                  >
                    <span>{t('section.pricing.book')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Disclaimer Note */}
        <div className="max-w-2xl mx-auto p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 text-center text-xs text-neutral-400">
          <p>
            <strong>Note:</strong> Prices are indicative in Tanzanian Shillings (TZS) and may vary depending on project scale, track count, or location shoot requirements. Contact us for custom enterprise and international distributor quotes.
          </p>
        </div>

        {/* Payment Methods Info Banner */}
        <div className="glass-panel p-8 rounded-3xl border border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h4 className="text-lg font-bold text-white">
              Accepted Payment Methods in Tanzania
            </h4>
            <p className="text-xs text-neutral-400">
              We accept official mobile money transfers (M-Pesa, Tigo Pesa, Airtel Money), direct bank wire, and international credit cards for overseas clients.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <span className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-mono text-emerald-400 font-bold">
              M-Pesa (Vodacom)
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-mono text-blue-400 font-bold">
              Tigo Pesa
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-mono text-red-400 font-bold">
              Airtel Money
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
