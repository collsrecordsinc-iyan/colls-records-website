import React, { useState, useEffect } from 'react';
import { db } from '../lib/db';
import { SiteContent } from '../types';
import { INITIAL_SITE_CONTENT, BRAND_ASSETS, COMPANY_INFO } from '../lib/constants';
import { useI18n } from '../lib/i18n';
import {
  Compass,
  Target,
  Flame,
  CheckCircle2,
  Mic2,
  Sliders,
  Disc,
  Radio,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2
} from 'lucide-react';

interface AboutPageProps {
  onNavigate: (route: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const { t } = useI18n();
  const [content, setContent] = useState<SiteContent>(INITIAL_SITE_CONTENT);

  useEffect(() => {
    db.getSiteContent().then(setContent);
    const handleUpdate = () => db.getSiteContent().then(setContent);
    window.addEventListener('colls_db_updated', handleUpdate);
    return () => window.removeEventListener('colls_db_updated', handleUpdate);
  }, []);

  const about = content.about;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest">
            <Building2 className="w-4 h-4" />
            <span>Colls Records Company Profile</span>
          </div>
          <h1 className="font-display font-black text-4xl sm:text-6xl text-white uppercase tracking-tight">
            Our Story &amp; Origins in Tanga
          </h1>
          <p className="text-base sm:text-lg text-neutral-300 leading-relaxed">
            Headquartered in the historic coastal city of Tanga, Tanzania, Colls Records bridges indigenous African melodic tradition with world-class acoustic engineering.
          </p>
        </div>

        {/* Hero Image Showcase */}
        <div className="relative rounded-3xl overflow-hidden glass-panel border border-neutral-800 shadow-2xl">
          <img
            src={BRAND_ASSETS.heroBanner}
            alt="Colls Records Studio Facility"
            referrerPolicy="no-referrer"
            className="w-full h-80 sm:h-[450px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono text-amber-400 uppercase tracking-wider block">
                Colls Creative Headquarters
              </span>
              <h2 className="text-2xl font-bold text-white">
                Tanga Mjini, Tanzania
              </h2>
            </div>
            <button
              onClick={() => onNavigate('/book')}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold uppercase text-xs tracking-wider rounded-xl transition-all shadow-lg shadow-amber-500/20 active:scale-95 shrink-0"
            >
              Book Studio Tour &amp; Session
            </button>
          </div>
        </div>

        {/* Narrative & Origins */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-6 space-y-6">
            <h2 className="font-display font-bold text-3xl text-white uppercase tracking-tight">
              Rooted in Coastal Soul, Built for Global Stages
            </h2>
            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
              {about.story}
            </p>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Colls Records operates as both an independent music label and an advanced multimedia production house under the stewardship of CEO Kelvin Lyamuya, Head of Digital Iyan Eman Juma, Marketing Manager Ashrack Miraji, and hit producers Peter Manyama (New Beats) and Jackson Paul (Jacoh Master).
            </p>
          </div>

          <div className="lg:col-span-6 space-y-6">
            {/* Mission & Vision Cards */}
            <div className="glass-panel p-6 rounded-2xl border border-neutral-800 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
                <Target className="w-5 h-5 text-amber-500" />
                <span>Our Mission</span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                {about.mission}
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-neutral-800 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
                <Compass className="w-5 h-5 text-amber-500" />
                <span>Our Vision</span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                {about.vision}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                Core Production Disciplines
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs text-neutral-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Music Production</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Video Production</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Film Production</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Documentary</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 6-Phase Creative Process Pipeline */}
        <div className="space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
              The Colls Signature Pipeline
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-tight">
              Our 6-Step Creative Process
            </h2>
            <p className="text-sm text-neutral-400">
              From the initial melodic seed in the rehearsal room to international chart rotation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {about.creative_process.map((step, idx) => (
              <div
                key={idx}
                className="glass-panel p-6 rounded-2xl border border-neutral-800 hover:border-amber-500/40 transition-all group"
              >
                <div className="font-display font-extrabold text-3xl text-amber-400/40 group-hover:text-amber-400 transition-colors font-mono">
                  {step.step}
                </div>
                <h3 className="text-lg font-bold text-white mt-2 mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Core Values Grid */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
              Foundational Pillars
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-tight">
              Our Guiding Values
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {about.core_values.map((val, idx) => (
              <div
                key={idx}
                className="glass-panel p-6 rounded-2xl border border-neutral-800 flex items-start gap-4"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm text-neutral-200 font-medium leading-relaxed">
                    {val}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Studio Specs & Hardware Highlight */}
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-neutral-800 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-neutral-800">
            <div>
              <span className="text-xs font-mono text-amber-400 uppercase tracking-widest">
                Acoustic Architecture
              </span>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-white mt-1">
                Studio Gear &amp; Acoustic Engineering
              </h3>
            </div>
            <button
              onClick={() => onNavigate('/book')}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold uppercase text-xs tracking-wider rounded-xl transition-all shadow-md active:scale-95 shrink-0"
            >
              Reserve Studio Time
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
            <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
              <h5 className="font-bold text-white mb-1.5 flex items-center gap-1.5">
                <Mic2 className="w-4 h-4 text-amber-400" />
                <span>Microphones &amp; Preamps</span>
              </h5>
              <p className="text-neutral-400 leading-relaxed">
                Neumann TLM 103, Shure SM7B, Rode NT1-A with Universal Audio Apollo Twin X preamps.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
              <h5 className="font-bold text-white mb-1.5 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-amber-400" />
                <span>Monitoring &amp; Acoustics</span>
              </h5>
              <p className="text-neutral-400 leading-relaxed">
                Yamaha HS8 nearfield monitors, KRK Subwoofer, tuned bass traps and floating floor vocal booth.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
              <h5 className="font-bold text-white mb-1.5 flex items-center gap-1.5">
                <Disc className="w-4 h-4 text-amber-400" />
                <span>DAWs &amp; Plugins</span>
              </h5>
              <p className="text-neutral-400 leading-relaxed">
                Pro Tools Ultimate, FL Studio 24 Producer, Logic Pro, Waves Mercury, FabFilter Pro, iZotope Ozone 11.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
              <h5 className="font-bold text-white mb-1.5 flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-amber-400" />
                <span>Cinema &amp; Visual Suite</span>
              </h5>
              <p className="text-neutral-400 leading-relaxed">
                Sony Cinema FX Line cameras, DJI Ronin gimbals, DaVinci Resolve Studio color grading station.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
