import React, { useState, useEffect } from 'react';
import { BRAND_ASSETS, COMPANY_INFO } from '../lib/constants';
import { useI18n } from '../lib/i18n';
import {
  Play,
  Calendar,
  MessageCircle,
  Volume2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface HeroSliderProps {
  onNavigate: (route: string) => void;
  onPlaySong?: () => void;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ onNavigate, onPlaySong }) => {
  const { t } = useI18n();
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = BRAND_ASSETS.heroSliderImages;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative min-h-[90vh] lg:min-h-[92vh] flex items-center justify-center overflow-hidden bg-neutral-950">
      {/* Background Auto-Playing Slides with Ken Burns Effect */}
      <div className="absolute inset-0 z-0">
        {slides.map((image, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-40 scale-105 transition-transform duration-[7000ms]' : 'opacity-0 scale-100'
              }`}
            >
              <img
                src={image}
                alt={`Colls Records Studio Showcase ${index + 1}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center filter saturate-110 brightness-90"
              />
            </div>
          );
        })}

        {/* Cinematic atmospheric overlays & vignettes */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-neutral-950/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-neutral-950/60 to-neutral-950" />
      </div>

      {/* Main Content Layout */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Domain Kicker / Unboxed Badge */}
            <div className="inline-flex items-center gap-2 text-xs font-mono text-amber-400 tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping inline-block" />
              <span>{t('hero.badge')}</span>
            </div>

            {/* Giant Title */}
            <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white uppercase leading-none drop-shadow-md">
              COLLS <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">RECORDS</span>
            </h1>

            {/* Core Capabilities Subtitle */}
            <p className="text-base sm:text-lg text-amber-300/90 font-medium tracking-wide">
              {t('hero.subtitle')}
            </p>

            {/* Editorial Lead Paragraph */}
            <p className="text-sm sm:text-base text-neutral-300 max-w-2xl leading-relaxed">
              {t('hero.tagline')}
            </p>

            {/* Primary Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <button
                onClick={() => onNavigate('/book')}
                className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold uppercase tracking-wider rounded-xl transition-all shadow-xl shadow-amber-500/20 active:scale-95 flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>{t('hero.cta.book')}</span>
              </button>

              <button
                onClick={() => onNavigate('/music')}
                className="px-6 py-3.5 bg-neutral-900/90 hover:bg-neutral-800 text-white border border-neutral-700/80 hover:border-amber-500/40 font-semibold rounded-xl transition-all backdrop-blur-md flex items-center gap-2"
              >
                <Play className="w-4 h-4 text-amber-400 fill-current" />
                <span>{t('hero.cta.listen')}</span>
              </button>

              <a
                href="https://wa.me/255741808971?text=Hello,%20I%20would%20like%20to%20inquire%20about%20Colls%20Records%20services"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Hotline</span>
              </a>
            </div>

            {/* Slide Navigation Controls */}
            <div className="pt-6 flex items-center justify-center lg:justify-start gap-3">
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest">
                PORTRAITS ({currentSlide + 1}/{slides.length})
              </span>
              <div className="flex gap-1.5">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all ${
                      i === currentSlide ? 'w-6 bg-amber-400' : 'w-2 bg-neutral-700 hover:bg-neutral-500'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Hero Brand Animation Video Reveal */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md aspect-video sm:aspect-square rounded-2xl overflow-hidden glass-panel-gold p-2 shadow-2xl">
              <div className="relative w-full h-full rounded-xl overflow-hidden bg-neutral-950 flex items-center justify-center">
                <video
                  src={BRAND_ASSETS.heroVideo}
                  poster={BRAND_ASSETS.heroBanner}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent pointer-events-none" />
                
                {/* Visualizer audio mark overlay */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-neutral-200">
                  <div className="flex items-center gap-2 bg-neutral-950/80 px-2.5 py-1 rounded-md border border-neutral-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    <span className="font-mono text-[11px] text-amber-300">Colls Records Studio</span>
                  </div>
                  <span className="text-[11px] font-mono text-neutral-400">Tanga, TZ</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Column Stat Counters Strip */}
        <div className="mt-16 pt-10 border-t border-neutral-800/80 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="space-y-1">
            <div className="font-display font-extrabold text-3xl sm:text-4xl text-amber-400 tabular-nums">
              480+
            </div>
            <div className="text-xs uppercase tracking-wider text-neutral-400 font-medium">
              {t('hero.stats.songs')}
            </div>
          </div>

          <div className="space-y-1">
            <div className="font-display font-extrabold text-3xl sm:text-4xl text-white tabular-nums">
              190+
            </div>
            <div className="text-xs uppercase tracking-wider text-neutral-400 font-medium">
              {t('hero.stats.artists')}
            </div>
          </div>

          <div className="space-y-1">
            <div className="font-display font-extrabold text-3xl sm:text-4xl text-amber-400 tabular-nums">
              6+
            </div>
            <div className="text-xs uppercase tracking-wider text-neutral-400 font-medium">
              {t('hero.stats.years')}
            </div>
          </div>

          <div className="space-y-1">
            <div className="font-display font-extrabold text-3xl sm:text-4xl text-white tabular-nums">
              125+
            </div>
            <div className="text-xs uppercase tracking-wider text-neutral-400 font-medium">
              {t('hero.stats.projects')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
