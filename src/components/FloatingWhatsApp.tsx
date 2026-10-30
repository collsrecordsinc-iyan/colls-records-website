import React, { useState } from 'react';
import { COMPANY_INFO } from '../lib/constants';
import { MessageCircle, X, ChevronRight } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const prefilled = encodeURIComponent("Hello, I would like to inquire about Colls Records services");

  return (
    <div className="fixed bottom-24 right-5 z-40">
      {/* Popover Card */}
      {isOpen && (
        <div className="mb-3 w-80 bg-neutral-900 border border-neutral-700/80 rounded-2xl shadow-2xl p-4 text-white backdrop-blur-xl animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold">Colls Records Studio</h4>
                <p className="text-[11px] text-emerald-400 font-medium">Direct Producer Hotline</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close WhatsApp hotline"
              className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-neutral-300 my-3 leading-relaxed">
            Choose a producer below to begin instant WhatsApp consultation on music recording, custom beats, mixing or video production:
          </p>

          <div className="space-y-2">
            {COMPANY_INFO.producers.map((producer) => (
              <a
                key={producer.id}
                href={`${producer.whatsapp}?text=${prefilled}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2.5 rounded-xl bg-neutral-950/70 hover:bg-neutral-800/80 border border-neutral-800 hover:border-emerald-500/50 transition-all group"
              >
                <img
                  src={producer.photo}
                  alt={producer.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover border border-neutral-700 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-white group-hover:text-emerald-400 truncate">
                    {producer.name} <span className="font-normal text-amber-400">({producer.stageName})</span>
                  </div>
                  <div className="text-[11px] text-neutral-400 truncate">
                    {producer.role}
                  </div>
                  <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
                    {producer.phone}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-emerald-400 shrink-0 transition-transform group-hover:translate-x-0.5" />
              </a>
            ))}
          </div>

          <div className="mt-3 pt-2 text-[10px] text-center text-neutral-500">
            Tanga, Tanzania • Studio Hours: Mon-Sun 9AM - 11PM
          </div>
        </div>
      )}

      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Chat with Colls Records producers on WhatsApp"
        className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 flex items-center justify-center shadow-xl shadow-emerald-500/30 transition-all hover:scale-105 active:scale-95 group focus:outline-none focus:ring-4 focus:ring-emerald-500/30"
      >
        {isOpen ? (
          <X className="w-7 h-7" />
        ) : (
          <div className="relative">
            <MessageCircle className="w-7 h-7 fill-current" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-neutral-950 animate-pulse" />
          </div>
        )}
      </button>
    </div>
  );
};
