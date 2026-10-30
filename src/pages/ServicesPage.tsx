import React, { useState, useEffect } from 'react';
import { db } from '../lib/db';
import { ServiceItem } from '../types';
import { INITIAL_SERVICES } from '../lib/constants';
import { formatTZS } from '../utils/pricing';
import { useI18n } from '../lib/i18n';
import {
  Mic,
  Music2,
  Sliders,
  Disc,
  Radio,
  Globe,
  Megaphone,
  Video,
  Clapperboard,
  Film,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';

interface ServicesPageProps {
  onNavigate: (route: string) => void;
}

const serviceIcons: Record<string, React.ReactNode> = {
  Mic: <Mic className="w-6 h-6" />,
  Music2: <Music2 className="w-6 h-6" />,
  Sliders: <Sliders className="w-6 h-6" />,
  Disc: <Disc className="w-6 h-6" />,
  Radio: <Radio className="w-6 h-6" />,
  Globe: <Globe className="w-6 h-6" />,
  Megaphone: <Megaphone className="w-6 h-6" />,
  Video: <Video className="w-6 h-6" />,
  Clapperboard: <Clapperboard className="w-6 h-6" />,
  Film: <Film className="w-6 h-6" />
};

export const ServicesPage: React.FC<ServicesPageProps> = ({ onNavigate }) => {
  const { lang, t } = useI18n();
  const [services, setServices] = useState<ServiceItem[]>(INITIAL_SERVICES);
  const [activeCategory, setActiveCategory] = useState<'all' | 'audio' | 'video' | 'creative'>('all');

  useEffect(() => {
    db.getServices().then(setServices);
    const handleUpdate = () => db.getServices().then(setServices);
    window.addEventListener('colls_db_updated', handleUpdate);
    return () => window.removeEventListener('colls_db_updated', handleUpdate);
  }, []);

  const filtered = activeCategory === 'all'
    ? services
    : services.filter(s => s.category === activeCategory);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest">
            <Sliders className="w-4 h-4" />
            <span>Creative Engineering Portfolio</span>
          </div>
          <h1 className="font-display font-black text-4xl sm:text-6xl text-white uppercase tracking-tight">
            Our Studio &amp; Production Services
          </h1>
          <p className="text-base text-neutral-300 leading-relaxed">
            From acoustic vocal tracking to international music distribution and 4K cinema directing, Colls Records delivers Grammy-grade production for artists, creators, and corporate brands.
          </p>

          {/* Category Filter Buttons */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-2">
            {[
              { id: 'all', label: 'All Services' },
              { id: 'audio', label: 'Music & Audio' },
              { id: 'video', label: 'Video & Film' },
              { id: 'creative', label: 'Promotion & PR' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                    : 'bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filtered.map((service, index) => {
            const name = lang === 'sw' && service.swahili_name ? service.swahili_name : service.name;
            const desc = lang === 'sw' && service.swahili_description ? service.swahili_description : service.description;

            return (
              <div
                key={service.id}
                className="glass-panel p-6 sm:p-8 rounded-3xl border border-neutral-800 hover:border-amber-500/40 transition-all flex flex-col justify-between group shadow-xl"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                      {serviceIcons[service.icon] || <Music2 className="w-6 h-6" />}
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-mono uppercase text-neutral-500 block">
                        Starting From
                      </span>
                      <span className="text-lg font-bold text-amber-400 tabular-nums font-mono">
                        {formatTZS(service.starting_price)}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-amber-400 transition-colors">
                    {name}
                  </h3>

                  <p className="text-sm text-neutral-300 mt-3 leading-relaxed">
                    {desc}
                  </p>

                  {/* Highlights */}
                  <div className="mt-6 pt-4 border-t border-neutral-800/80 space-y-2 text-xs text-neutral-400">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Standard delivery with dedicated sound engineer</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Commercial streaming &amp; broadcast rights included</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 flex items-center justify-between gap-4">
                  <button
                    onClick={() => onNavigate(`/pricing`)}
                    className="text-xs text-neutral-400 hover:text-white transition-colors underline"
                  >
                    View Packages
                  </button>

                  <button
                    onClick={() => onNavigate(`/book?service=${service.id}`)}
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-amber-500/20 active:scale-95 flex items-center gap-1.5"
                  >
                    <span>Request Service</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Project Callout */}
        <div className="glass-panel p-8 rounded-3xl border border-neutral-800 text-center space-y-4">
          <h3 className="font-display font-bold text-2xl text-white">
            Need a Customized Production Solution?
          </h3>
          <p className="text-sm text-neutral-400 max-w-xl mx-auto">
            From complete album contracts to documentary film series and corporate advert packages, we provide tailored solutions for your scope.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <button
              onClick={() => onNavigate('/contact')}
              className="px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700 rounded-xl text-xs font-semibold uppercase tracking-wider"
            >
              Contact Studio Office
            </button>
            <a
              href="https://wa.me/255741808971?text=Hello,%20I%20would%20like%20to%20inquire%20about%20a%20custom%20production%20package"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-xl text-xs uppercase tracking-wider"
            >
              WhatsApp Chief Producer
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
