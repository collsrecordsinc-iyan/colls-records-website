import React, { useState, useEffect } from 'react';
import { TickerItem } from '../types';
import { db } from '../lib/db';
import { useI18n } from '../lib/i18n';
import { Radio, Sparkles, ArrowRight } from 'lucide-react';
import { INITIAL_TICKER } from '../lib/constants';

interface NewsTickerProps {
  onNavigate?: (path: string) => void;
}

export const NewsTicker: React.FC<NewsTickerProps> = ({ onNavigate }) => {
  const { lang, t } = useI18n();
  const [items, setItems] = useState<TickerItem[]>(INITIAL_TICKER);

  const loadItems = () => {
    db.getTickerItems().then((res) => {
      if (res && res.length > 0) {
        setItems(res.filter(i => i.is_active));
      }
    });
  };

  useEffect(() => {
    loadItems();
    const handleUpdate = () => loadItems();
    window.addEventListener('colls_db_updated', handleUpdate);
    return () => window.removeEventListener('colls_db_updated', handleUpdate);
  }, []);

  if (items.length === 0) return null;

  // Duplicate items for continuous infinite scroll marquee
  const displayItems = [...items, ...items, ...items];

  return (
    <div className="w-full bg-neutral-900/90 border-y border-amber-500/20 backdrop-blur-md relative overflow-hidden select-none z-30">
      <div className="flex items-center">
        {/* Broadcast badge */}
        <div className="bg-amber-500 text-neutral-950 font-display font-bold text-xs uppercase px-3.5 py-2.5 flex items-center gap-1.5 shrink-0 z-10 shadow-lg tracking-wider">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-ping inline-block" />
          <span>{t('ticker.live')}</span>
          <Radio className="w-3.5 h-3.5 ml-0.5" />
        </div>

        {/* Scrolling text track */}
        <div className="overflow-hidden flex-1 py-2">
          <div className="animate-ticker flex items-center gap-12">
            {displayItems.map((item, idx) => {
              const text = lang === 'sw' && item.swahili_text ? item.swahili_text : item.text;
              return (
                <div
                  key={`${item.id}-${idx}`}
                  className="flex items-center gap-3 shrink-0 text-sm font-medium text-neutral-200"
                >
                  {item.priority === 'promo' && (
                    <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono uppercase px-2 py-0.5 rounded tracking-wider">
                      PROMO
                    </span>
                  )}
                  {item.priority === 'urgent' && (
                    <span className="bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] font-mono uppercase px-2 py-0.5 rounded tracking-wider">
                      OFFER
                    </span>
                  )}
                  
                  {item.link ? (
                    <button
                      onClick={() => onNavigate && onNavigate(item.link || '/')}
                      className="hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                    >
                      <span>{text}</span>
                      <ArrowRight className="w-3 h-3 text-amber-400 opacity-60" />
                    </button>
                  ) : (
                    <span>{text}</span>
                  )}

                  <span className="text-amber-500/40 text-xs select-none">✦</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
