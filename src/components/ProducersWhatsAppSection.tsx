import React from 'react';
import { useI18n } from '../lib/i18n';
import { MessageCircle, Phone, ArrowUpRight, Music, Headphones } from 'lucide-react';

export const ProducersWhatsAppSection: React.FC = () => {
  const { t } = useI18n();
  const prefilled = encodeURIComponent("Hello, I would like to inquire about Colls Records services");

  const producers = [
    {
      name: 'Peter Manyama',
      stageName: 'New Beats',
      role: 'Chief Producer',
      phone: '+255741808971',
      whatsapp: 'https://wa.me/255741808971',
      photo: 'https://res.cloudinary.com/hxdy3cea/image/upload/v1793366234/Cinematic_Music_Producer_Portrait.png',
      specialty: 'Afro-Beats, Bongo Flava, Melodic Arrangements & Executive Audio Direction',
      hours: 'Mon - Sat: 9:00 AM - 10:00 PM'
    },
    {
      name: 'Jackson Paul',
      stageName: 'Jacoh Master',
      role: 'Assistant Producer & Sound Engineer',
      phone: '+255620742182',
      whatsapp: 'https://wa.me/255620742182',
      photo: 'https://res.cloudinary.com/hxdy3cea/image/upload/v1793364686/file_00000000bb248211ae52b82e10503011.png',
      specialty: 'Acoustic Recording, Surgical Mixing, Multitrack Balancing & Analog Stereo Mastering',
      hours: 'Mon - Sun: 10:00 AM - 11:00 PM'
    }
  ];

  return (
    <section className="py-20 relative bg-neutral-950 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-amber-500/5 blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-emerald-500/5 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-widest">
            <MessageCircle className="w-4 h-4" />
            <span>Direct WhatsApp Studio Access</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-tight">
            {t('section.producers.title')}
          </h2>
          <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
            {t('section.producers.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {producers.map((producer, index) => (
            <div
              key={index}
              className="glass-panel p-6 sm:p-8 rounded-2xl border border-neutral-800 hover:border-emerald-500/40 transition-all duration-300 group flex flex-col justify-between shadow-xl relative overflow-hidden"
            >
              {/* Subtle top indicator */}
              <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-emerald-500 to-amber-500 opacity-60 group-hover:opacity-100 transition-opacity" />

              <div>
                <div className="flex items-start gap-5">
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 border border-neutral-700 bg-neutral-900 shadow-md">
                    <img
                      src={producer.photo}
                      alt={producer.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute bottom-1 right-1 bg-emerald-500 text-neutral-950 p-1 rounded-full shadow">
                      <Headphones className="w-3 h-3" />
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-semibold block">
                      {producer.role}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-white mt-1 group-hover:text-emerald-400 transition-colors">
                      {producer.name}
                    </h3>
                    <p className="text-xs font-mono text-neutral-400 mt-0.5">
                      Stage: <span className="text-neutral-200 font-semibold">{producer.stageName}</span>
                    </p>
                    <p className="text-xs text-emerald-400/90 font-mono mt-2 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5" />
                      <span>{producer.phone}</span>
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-neutral-800/80">
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    {producer.specialty}
                  </p>
                  <p className="text-[11px] text-neutral-500 font-mono mt-2">
                    Studio Availability: {producer.hours}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-2">
                <a
                  href={`${producer.whatsapp}?text=${prefilled}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Chat on WhatsApp</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
