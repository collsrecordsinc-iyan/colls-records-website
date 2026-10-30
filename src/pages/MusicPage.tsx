import React, { useState, useEffect } from 'react';
import { db } from '../lib/db';
import { Song } from '../types';
import { INITIAL_SONGS, COMPANY_INFO } from '../lib/constants';
import { useAudio } from '../context/AudioContext';
import {
  Play,
  Pause,
  Youtube,
  Share2,
  Headphones,
  Check,
  Music2,
  ExternalLink,
  Sparkles
} from 'lucide-react';

export const MusicPage: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>(INITIAL_SONGS);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { currentSong, isPlaying, playSong, togglePlay } = useAudio();

  useEffect(() => {
    db.getSongs().then(setSongs);
    const handleUpdate = () => db.getSongs().then(setSongs);
    window.addEventListener('colls_db_updated', handleUpdate);
    return () => window.removeEventListener('colls_db_updated', handleUpdate);
  }, []);

  const handleShare = (song: Song) => {
    const shareUrl = `${window.location.origin}/music?song=${song.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopiedId(song.id);
        setTimeout(() => setCopiedId(null), 2500);
      });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest">
            <Music2 className="w-4 h-4" />
            <span>Colls Discography &amp; Releases</span>
          </div>
          <h1 className="font-display font-black text-4xl sm:text-6xl text-white uppercase tracking-tight">
            Official Music Releases
          </h1>
          <p className="text-base text-neutral-300 leading-relaxed">
            Listen to master studio recordings produced, mixed, and mastered at Colls Records in Tanga, Tanzania.
          </p>

          {/* YouTube Subscribe Callout */}
          <div className="pt-4 flex justify-center">
            <a
              href={COMPANY_INFO.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600/90 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-red-600/20 active:scale-95"
            >
              <Youtube className="w-4 h-4 fill-current" />
              <span>Subscribe to @CollsRecords on YouTube</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Songs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {songs.map((song) => {
            const isThisPlaying = currentSong?.id === song.id && isPlaying;
            return (
              <div
                key={song.id}
                className="glass-panel p-6 rounded-3xl border border-neutral-800 hover:border-amber-500/40 transition-all flex flex-col justify-between group shadow-xl"
              >
                <div>
                  <div className="relative aspect-video sm:aspect-[16/10] rounded-2xl overflow-hidden mb-5 border border-neutral-700 bg-neutral-900 shadow-md">
                    <img
                      src={song.cover_url}
                      alt={song.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Play Button Overlay */}
                    <button
                      onClick={() => {
                        if (currentSong?.id === song.id) {
                          togglePlay();
                        } else {
                          playSong(song);
                        }
                      }}
                      aria-label={`Play ${song.title}`}
                      className="absolute inset-0 bg-neutral-950/40 hover:bg-neutral-950/20 flex items-center justify-center transition-colors group/play"
                    >
                      <div className="w-16 h-16 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center shadow-2xl transform group-hover/play:scale-110 active:scale-95 transition-transform">
                        {isThisPlaying ? (
                          <Pause className="w-7 h-7 fill-current" />
                        ) : (
                          <Play className="w-7 h-7 fill-current ml-1" />
                        )}
                      </div>
                    </button>

                    {/* Genre tag */}
                    <div className="absolute top-3 left-3 bg-neutral-950/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-mono text-amber-400 border border-neutral-800">
                      {song.genre}
                    </div>

                    {/* Duration */}
                    {song.duration && (
                      <div className="absolute bottom-3 right-3 bg-neutral-950/80 backdrop-blur-md px-2 py-0.5 rounded text-[11px] font-mono text-neutral-300">
                        {song.duration}
                      </div>
                    )}
                  </div>

                  {/* Metadata */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-neutral-400">
                      <span className="font-mono text-amber-400">{song.release_date}</span>
                      <span className="font-mono flex items-center gap-1">
                        <Headphones className="w-3.5 h-3.5 text-neutral-500" />
                        <span className="tabular-nums font-semibold">{song.play_count.toLocaleString()}</span> plays
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-amber-400 transition-colors">
                      {song.title}
                    </h3>

                    <p className="text-sm text-neutral-300">
                      By <span className="font-semibold text-white">{song.artist}</span>
                      {song.featured_artists && (
                        <span> ft. <span className="text-amber-400">{song.featured_artists}</span></span>
                      )}
                    </p>

                    {song.producer && (
                      <p className="text-xs font-mono text-neutral-400">
                        Produced by: <span className="text-neutral-200">{song.producer}</span>
                      </p>
                    )}

                    {song.description && (
                      <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                        {song.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-6 pt-4 border-t border-neutral-800/80 flex items-center justify-between gap-3 text-xs">
                  <button
                    onClick={() => {
                      if (currentSong?.id === song.id) {
                        togglePlay();
                      } else {
                        playSong(song);
                      }
                    }}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5"
                  >
                    {isThisPlaying ? (
                      <>
                        <Pause className="w-3.5 h-3.5 fill-current" />
                        <span>Playing</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Listen Now</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-2">
                    {song.youtube_url && (
                      <a
                        href={song.youtube_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-red-500/50 text-neutral-300 hover:text-red-400 transition-colors"
                        title="Watch on YouTube"
                      >
                        <Youtube className="w-4 h-4" />
                      </a>
                    )}

                    <button
                      onClick={() => handleShare(song)}
                      className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 text-neutral-300 hover:text-amber-400 transition-colors"
                      title="Share release link"
                    >
                      {copiedId === song.id ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Share2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Studio Submission Banner */}
        <div className="p-8 rounded-3xl bg-neutral-900/60 border border-neutral-800 text-center space-y-4">
          <h3 className="font-display font-bold text-2xl text-white">
            Have a Track to Release Under Colls Records?
          </h3>
          <p className="text-sm text-neutral-400 max-w-xl mx-auto">
            We offer label representation, worldwide distribution to 150+ stores, radio pitching in Tanzania, and visualizer production.
          </p>
          <div className="pt-2">
            <a
              href="https://wa.me/255741808971?text=Hello,%20I%20have%20a%20track%20I%20would%20like%20to%20release%20with%20Colls%20Records"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
            >
              <span>Submit Demo on WhatsApp</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
