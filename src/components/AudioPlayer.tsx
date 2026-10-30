import React, { useState } from 'react';
import { useAudio } from '../context/AudioContext';
import { formatDuration } from '../utils/pricing';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  Music
} from 'lucide-react';

export const AudioPlayer: React.FC = () => {
  const {
    currentSong,
    isPlaying,
    togglePlay,
    nextSong,
    prevSong,
    currentTime,
    duration,
    seek,
    volume,
    setVolume,
    isMuted,
    toggleMute
  } = useAudio();

  const [isMinimized, setIsMinimized] = useState(false);

  if (!currentSong) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 ${
        isMinimized ? 'translate-y-[calc(100%-2rem)]' : 'translate-y-0'
      }`}
    >
      {/* Minimize tab */}
      <div className="flex justify-center -mb-2">
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          aria-label={isMinimized ? "Expand audio player" : "Minimize audio player"}
          className="bg-neutral-900 border-t border-x border-amber-500/30 text-amber-400 hover:text-amber-300 px-4 py-0.5 rounded-t-lg text-xs flex items-center gap-1.5 shadow-lg backdrop-blur-md transition-colors"
        >
          <Music className="w-3 h-3 animate-pulse" />
          <span className="font-mono text-[11px] tracking-wider uppercase">
            {isMinimized ? 'Colls Sound Player' : 'Hide Player'}
          </span>
          {isMinimized ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* Main player bar */}
      <div className="bg-neutral-950/95 backdrop-blur-xl border-t border-neutral-800 text-white shadow-2xl px-4 py-3">
        {/* Scrubber bar */}
        <div className="relative w-full h-1.5 bg-neutral-800 rounded-full mb-3 cursor-pointer group">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full group-hover:from-amber-400 group-hover:to-amber-300 transition-all"
            style={{ width: `${progress}%` }}
          />
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={(e) => seek(Number(e.target.value))}
            aria-label="Seek track position"
            className="absolute -top-1.5 left-0 w-full h-4 opacity-0 cursor-pointer"
          />
        </div>

        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Song info & cover */}
          <div className="flex items-center gap-3 min-w-0 w-1/3">
            <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-neutral-700 bg-neutral-900">
              <img
                src={currentSong.cover_url}
                alt={currentSong.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              {isPlaying && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-0.5 p-1">
                  <span className="w-1 bg-amber-400 rounded-full animate-eq-1" />
                  <span className="w-1 bg-amber-400 rounded-full animate-eq-2" />
                  <span className="w-1 bg-amber-400 rounded-full animate-eq-3" />
                  <span className="w-1 bg-amber-400 rounded-full animate-eq-4" />
                </div>
              )}
            </div>

            <div className="min-w-0">
              <h4 className="text-sm font-semibold truncate text-white leading-tight">
                {currentSong.title}
              </h4>
              <p className="text-xs text-neutral-400 truncate mt-0.5">
                {currentSong.artist} {currentSong.featured_artists ? `ft. ${currentSong.featured_artists}` : ''}
              </p>
              {currentSong.producer && (
                <p className="text-[10px] text-amber-500/80 truncate font-mono">
                  Prod: {currentSong.producer}
                </p>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-3 md:gap-4">
              <button
                onClick={prevSong}
                aria-label="Previous track"
                className="text-neutral-400 hover:text-white transition-colors p-1"
              >
                <SkipBack className="w-4 h-4 md:w-5 md:h-5" />
              </button>

              <button
                onClick={togglePlay}
                aria-label={isPlaying ? "Pause track" : "Play track"}
                className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-amber-500 hover:bg-amber-400 text-neutral-950 flex items-center justify-center transition-transform active:scale-95 shadow-md shadow-amber-500/20"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                )}
              </button>

              <button
                onClick={nextSong}
                aria-label="Next track"
                className="text-neutral-400 hover:text-white transition-colors p-1"
              >
                <SkipForward className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-neutral-400 tabular-nums">
              <span>{formatDuration(currentTime)}</span>
              <span>/</span>
              <span>{formatDuration(duration)}</span>
            </div>
          </div>

          {/* Volume & External actions */}
          <div className="flex items-center justify-end gap-3 w-1/3">
            {currentSong.youtube_url && (
              <a
                href={currentSong.youtube_url}
                target="_blank"
                rel="noopener noreferrer"
                title="Watch on YouTube"
                className="hidden md:flex items-center gap-1 text-xs text-neutral-400 hover:text-amber-400 transition-colors px-2 py-1 rounded bg-neutral-900 border border-neutral-800"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>YouTube</span>
              </a>
            )}

            <div className="hidden lg:flex items-center gap-2">
              <button
                onClick={toggleMute}
                aria-label={isMuted ? "Unmute" : "Mute"}
                className="text-neutral-400 hover:text-white transition-colors"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-red-400" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                aria-label="Volume slider"
                className="w-20 h-1.5 accent-amber-500 bg-neutral-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
