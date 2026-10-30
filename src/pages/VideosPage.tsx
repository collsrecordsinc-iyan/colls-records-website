import React, { useState, useEffect } from 'react';
import { db } from '../lib/db';
import { VideoItem } from '../types';
import { INITIAL_VIDEOS, BRAND_ASSETS, COMPANY_INFO } from '../lib/constants';
import { CinematicVideoPlayer } from '../components/CinematicVideoPlayer';
import {
  Video,
  Youtube,
  Film,
  Play,
  ArrowUpRight,
  ExternalLink
} from 'lucide-react';

export const VideosPage: React.FC = () => {
  const [videos, setVideos] = useState<VideoItem[]>(INITIAL_VIDEOS);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    db.getVideos().then(setVideos);
    const handleUpdate = () => db.getVideos().then(setVideos);
    window.addEventListener('colls_db_updated', handleUpdate);
    return () => window.removeEventListener('colls_db_updated', handleUpdate);
  }, []);

  const featured = videos.find(v => v.is_featured) || videos[0];

  const filtered = activeCategory === 'all'
    ? videos.filter(v => !v.is_featured)
    : videos.filter(v => !v.is_featured && v.category === activeCategory);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest">
            <Film className="w-4 h-4" />
            <span>Colls Film &amp; Visual Studio</span>
          </div>
          <h1 className="font-display font-black text-4xl sm:text-6xl text-white uppercase tracking-tight">
            Official Videos &amp; Cinema
          </h1>
          <p className="text-base text-neutral-300 leading-relaxed">
            4K music videos, studio visualizers, and cultural documentaries produced across Tanga and East Africa.
          </p>
        </div>

        {/* Top Featured Video Cinematic Player */}
        <div className="max-w-5xl mx-auto">
          <CinematicVideoPlayer
            title={featured?.title || "Colls Records Brand Animation & Studio Visualizer"}
            subtitle={featured?.description || "Engineered with international audiovisual design at Colls Records, Tanga, Tanzania."}
            videoUrl={featured?.video_url || BRAND_ASSETS.featuredVideo}
            posterUrl={featured?.thumbnail_url || BRAND_ASSETS.heroBanner}
          />
        </div>

        {/* Video Categories */}
        <div className="space-y-8 pt-8 border-t border-neutral-900">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'all', label: 'All Videos' },
                { id: 'music_video', label: 'Music Videos' },
                { id: 'documentary', label: 'Documentaries' },
                { id: 'film', label: 'Films' },
                { id: 'behind_the_scenes', label: 'Behind The Scenes' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
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

            <a
              href={COMPANY_INFO.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold text-red-400 hover:text-red-300 transition-colors"
            >
              <Youtube className="w-4 h-4 text-red-500" />
              <span>Subscribe on YouTube</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Videos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((vid) => (
              <div
                key={vid.id}
                className="glass-panel p-4 rounded-2xl border border-neutral-800 hover:border-amber-500/30 transition-all flex flex-col justify-between group shadow-xl"
              >
                <div>
                  <div className="relative aspect-video rounded-xl overflow-hidden mb-4 bg-neutral-900 border border-neutral-800">
                    <img
                      src={vid.thumbnail_url}
                      alt={vid.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                      <div className="w-12 h-12 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-neutral-950/80 text-[10px] font-mono uppercase text-amber-400 border border-neutral-800">
                      {vid.category.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                    {vid.title}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                    {vid.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-mono text-neutral-500">Colls Visuals</span>
                  {vid.youtube_url ? (
                    <a
                      href={vid.youtube_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
                    >
                      <span>Watch</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="text-neutral-400">In Studio</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
