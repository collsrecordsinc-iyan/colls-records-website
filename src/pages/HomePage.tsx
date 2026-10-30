import React, { useState, useEffect } from 'react';
import { HeroSlider } from '../components/HeroSlider';
import { NewsTicker } from '../components/NewsTicker';
import { CinematicVideoPlayer } from '../components/CinematicVideoPlayer';
import { ProducersWhatsAppSection } from '../components/ProducersWhatsAppSection';
import { useAudio } from '../context/AudioContext';
import { useI18n } from '../lib/i18n';
import { db } from '../lib/db';
import { Song, ServiceItem, PricingPackage, TeamMember } from '../types';
import { formatTZS } from '../utils/pricing';
import { BRAND_ASSETS, COMPANY_INFO } from '../lib/constants';
import {
  Play,
  Pause,
  ArrowRight,
  Sparkles,
  Calendar,
  CheckCircle2,
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
  ExternalLink,
  ShieldCheck,
  Check
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (route: string) => void;
}

const serviceIcons: Record<string, React.ReactNode> = {
  Mic: <Mic className="w-5 h-5" />,
  Music2: <Music2 className="w-5 h-5" />,
  Sliders: <Sliders className="w-5 h-5" />,
  Disc: <Disc className="w-5 h-5" />,
  Radio: <Radio className="w-5 h-5" />,
  Globe: <Globe className="w-5 h-5" />,
  Megaphone: <Megaphone className="w-5 h-5" />,
  Video: <Video className="w-5 h-5" />,
  Clapperboard: <Clapperboard className="w-5 h-5" />,
  Film: <Film className="w-5 h-5" />
};

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { t, lang } = useI18n();
  const { playSong, currentSong, isPlaying, togglePlay } = useAudio();

  const [songs, setSongs] = useState<Song[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [pricing, setPricing] = useState<PricingPackage[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);

  useEffect(() => {
    db.getSongs().then(setSongs);
    db.getServices().then(setServices);
    db.getPricingPackages().then(setPricing);
    db.getTeamMembers().then(setTeam);

    const handleUpdate = () => {
      db.getSongs().then(setSongs);
      db.getServices().then(setServices);
      db.getPricingPackages().then(setPricing);
      db.getTeamMembers().then(setTeam);
    };

    window.addEventListener('colls_db_updated', handleUpdate);
    return () => window.removeEventListener('colls_db_updated', handleUpdate);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* 1. Hero Section with 7-Portrait Slider & Logo Animation Video */}
      <HeroSlider
        onNavigate={onNavigate}
        onPlaySong={() => songs[0] && playSong(songs[0])}
      />

      {/* 2. Lower-Third News Ticker */}
      <NewsTicker onNavigate={onNavigate} />

      {/* 3. Latest Releases Showcase */}
      <section className="py-20 relative bg-neutral-950 border-b border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest mb-2">
                <Music2 className="w-4 h-4" />
                <span>Audio Master Collection</span>
              </div>
              <h2 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-tight">
                {t('section.releases.title')}
              </h2>
              <p className="text-sm text-neutral-400 mt-1 max-w-xl">
                {t('section.releases.subtitle')}
              </p>
            </div>

            <button
              onClick={() => onNavigate('/music')}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 hover:text-amber-300 transition-colors group shrink-0"
            >
              <span>{t('section.releases.viewall')}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {songs.map((song) => {
              const isThisPlaying = currentSong?.id === song.id && isPlaying;
              return (
                <div
                  key={song.id}
                  className="glass-panel p-5 rounded-2xl border border-neutral-800 hover:border-amber-500/40 transition-all flex flex-col sm:flex-row items-center gap-5 group"
                >
                  <div className="relative w-full sm:w-36 h-36 rounded-xl overflow-hidden shrink-0 border border-neutral-700 bg-neutral-900 shadow-md">
                    <img
                      src={song.cover_url}
                      alt={song.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <button
                      onClick={() => {
                        if (currentSong?.id === song.id) {
                          togglePlay();
                        } else {
                          playSong(song);
                        }
                      }}
                      aria-label={`Play song ${song.title}`}
                      className="absolute inset-0 bg-black/40 hover:bg-black/20 flex items-center justify-center transition-colors group/play"
                    >
                      <div className="w-12 h-12 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center shadow-lg transform group-hover/play:scale-110 active:scale-95 transition-transform">
                        {isThisPlaying ? (
                          <Pause className="w-6 h-6 fill-current" />
                        ) : (
                          <Play className="w-6 h-6 fill-current ml-0.5" />
                        )}
                      </div>
                    </button>
                  </div>

                  <div className="flex-1 min-w-0 w-full">
                    <div className="flex items-center gap-2 text-[11px] font-mono text-amber-400 mb-1">
                      <span>{song.genre}</span>
                      <span aria-hidden="true">·</span>
                      <span>{song.release_date}</span>
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors truncate">
                      {song.title}
                    </h3>
                    <p className="text-xs text-neutral-300 truncate mt-0.5">
                      {song.artist} {song.featured_artists ? `ft. ${song.featured_artists}` : ''}
                    </p>
                    <p className="text-[11px] text-neutral-500 font-mono mt-1">
                      Engineered: {song.producer || 'Colls Records'}
                    </p>

                    <p className="text-xs text-neutral-400 mt-2 line-clamp-2 leading-relaxed">
                      {song.description}
                    </p>

                    <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs">
                      <span className="font-mono text-neutral-400 text-[11px] tabular-nums">
                        {song.play_count.toLocaleString()} plays
                      </span>
                      <button
                        onClick={() => playSong(song)}
                        className="text-amber-400 hover:text-amber-300 font-semibold text-xs flex items-center gap-1"
                      >
                        <span>Listen Now</span>
                        <Play className="w-3 h-3 fill-current" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Services Bento Grid */}
      <section className="py-20 relative bg-neutral-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest">
              <Sliders className="w-4 h-4" />
              <span>Full-Stack Studio Production</span>
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-tight">
              {t('section.services.title')}
            </h2>
            <p className="text-sm text-neutral-400">
              {t('section.services.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.slice(0, 6).map((service, index) => (
              <div
                key={service.id}
                className="glass-panel p-6 rounded-2xl border border-neutral-800 hover:border-amber-500/30 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                    {serviceIcons[service.icon] || <Music2 className="w-5 h-5" />}
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                    {lang === 'sw' && service.swahili_name ? service.swahili_name : service.name}
                  </h3>

                  <p className="text-xs text-neutral-400 mt-2.5 leading-relaxed">
                    {lang === 'sw' && service.swahili_description ? service.swahili_description : service.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-neutral-500 block">
                      Starting From
                    </span>
                    <span className="text-sm font-bold text-amber-400 tabular-nums font-mono">
                      {formatTZS(service.starting_price)}
                    </span>
                  </div>

                  <button
                    onClick={() => onNavigate(`/book?service=${service.id}`)}
                    className="text-xs font-bold text-white hover:text-amber-400 flex items-center gap-1 transition-colors"
                  >
                    <span>Book</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <button
              onClick={() => onNavigate('/services')}
              className="px-6 py-3 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-amber-500/40 text-xs font-bold uppercase tracking-wider text-neutral-200 hover:text-white transition-colors"
            >
              View All 10 Studio &amp; Film Services →
            </button>
          </div>
        </div>
      </section>

      {/* 5. Featured Video Cinematic Player */}
      <section className="py-20 relative bg-neutral-950 border-y border-neutral-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest">
              <Film className="w-4 h-4" />
              <span>Cinematic Visuals</span>
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-tight">
              {t('section.video.title')}
            </h2>
            <p className="text-sm text-neutral-400">
              {t('section.video.subtitle')}
            </p>
          </div>

          <CinematicVideoPlayer
            title="Colls Records Brand Animation Visualizer"
            subtitle="Engineered with international audiovisual design at Colls Records, Tanga, Tanzania."
          />
        </div>
      </section>

      {/* 6. Dedicated Producers WhatsApp Section */}
      <ProducersWhatsAppSection />

      {/* 7. Pricing Preview in TZS */}
      <section className="py-20 relative bg-neutral-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest">
              <Disc className="w-4 h-4" />
              <span>Tanzanian Shillings (TZS)</span>
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-tight">
              {t('section.pricing.title')}
            </h2>
            <p className="text-sm text-neutral-400">
              {t('section.pricing.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricing.filter(p => p.is_popular).map((pkg) => (
              <div
                key={pkg.id}
                className="glass-panel p-7 rounded-2xl border border-amber-500/40 relative flex flex-col justify-between shadow-2xl"
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-neutral-950 font-bold text-[10px] uppercase font-mono px-3 py-1 rounded-full shadow-md tracking-wider">
                  Most Popular Choice
                </div>

                <div>
                  <span className="text-xs font-mono uppercase text-amber-400/90 font-semibold block mb-1">
                    {pkg.category}
                  </span>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {lang === 'sw' && pkg.swahili_name ? pkg.swahili_name : pkg.name}
                  </h3>

                  <div className="my-5 pb-5 border-b border-neutral-800">
                    <div className="font-display font-extrabold text-3xl text-white tabular-nums">
                      {formatTZS(pkg.price_tzs)}
                    </div>
                    <span className="text-xs font-mono text-neutral-400">
                      / {pkg.unit}
                    </span>
                  </div>

                  <ul className="space-y-3 text-xs text-neutral-300">
                    {pkg.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4">
                  <button
                    onClick={() => onNavigate(`/book?package=${pkg.id}`)}
                    className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold uppercase text-xs tracking-wider rounded-xl transition-all shadow-md shadow-amber-500/20 active:scale-95"
                  >
                    {t('section.pricing.book')}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center text-xs text-neutral-500">
            {t('section.pricing.disclaimer')}
          </div>
        </div>
      </section>

      {/* 8. Team Preview */}
      <section className="py-20 relative bg-neutral-950 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Executive &amp; Creative Roster</span>
              </div>
              <h2 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-tight">
                {t('section.team.title')}
              </h2>
              <p className="text-sm text-neutral-400 mt-1 max-w-xl">
                {t('section.team.subtitle')}
              </p>
            </div>

            <button
              onClick={() => onNavigate('/team')}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 hover:text-amber-300 transition-colors group shrink-0"
            >
              <span>View Full 7-Member Team</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.slice(0, 4).map((member) => (
              <div
                key={member.id}
                className="glass-panel rounded-2xl overflow-hidden border border-neutral-800 hover:border-amber-500/30 transition-all group"
              >
                <div className="relative aspect-square overflow-hidden bg-neutral-900">
                  <img
                    src={member.photo_url}
                    alt={member.full_name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 block font-semibold">
                      {member.role}
                    </span>
                    <h4 className="text-base font-bold text-white truncate">
                      {member.full_name}
                    </h4>
                  </div>
                </div>

                <div className="p-4">
                  <p className="text-xs text-neutral-400 line-clamp-3 leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Contact / Booking CTA Banner */}
      <section className="py-20 relative bg-neutral-900/40 border-t border-neutral-900 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <img
            src={BRAND_ASSETS.logoIcon}
            alt="Colls Mark"
            referrerPolicy="no-referrer"
            className="w-16 h-16 mx-auto object-contain"
          />
          <h2 className="font-display font-black text-3xl sm:text-5xl text-white uppercase tracking-tight max-w-2xl mx-auto">
            Ready to Record Your Next Masterpiece in Tanga?
          </h2>
          <p className="text-sm sm:text-base text-neutral-300 max-w-xl mx-auto leading-relaxed">
            Book an acoustic session, reserve an exclusive beat, or consult directly with our Chief Producer Peter Manyama and Assistant Producer Jacoh Master.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('/book')}
              className="px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold uppercase tracking-wider rounded-xl transition-all shadow-xl shadow-amber-500/20 active:scale-95"
            >
              Book a Studio Session Now
            </button>
            <button
              onClick={() => onNavigate('/contact')}
              className="px-8 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700 rounded-xl font-semibold transition-colors"
            >
              Contact Studio Office
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
