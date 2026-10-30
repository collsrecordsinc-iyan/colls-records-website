import React, { useRef, useState } from 'react';
import { BRAND_ASSETS, COMPANY_INFO } from '../lib/constants';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Youtube,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';

interface CinematicVideoPlayerProps {
  title?: string;
  subtitle?: string;
  videoUrl?: string;
  posterUrl?: string;
}

export const CinematicVideoPlayer: React.FC<CinematicVideoPlayerProps> = ({
  title = "Colls Records Brand Animation & Studio Visualizer",
  subtitle = "Experience the official animated brand presentation and sonic signature of Colls Records.",
  videoUrl = BRAND_ASSETS.featuredVideo,
  posterUrl = BRAND_ASSETS.heroBanner
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.warn(err));
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const dur = videoRef.current.duration;
    if (dur > 0) {
      setProgress((videoRef.current.currentTime / dur) * 100);
    }
  };

  const handleFullscreen = () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen().catch((err) => console.warn(err));
    }
  };

  return (
    <div className="w-full">
      <div
        ref={containerRef}
        className="relative aspect-video w-full rounded-2xl overflow-hidden glass-panel border border-neutral-800 shadow-2xl group bg-neutral-950"
      >
        <video
          ref={videoRef}
          src={videoUrl}
          poster={posterUrl}
          playsInline
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
          className="w-full h-full object-cover"
        />

        {/* Ambient Overlay Vignette */}
        <div className={`absolute inset-0 bg-neutral-950/40 transition-opacity duration-300 ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`} />

        {/* Center Play Overlay when paused */}
        {!isPlaying && (
          <button
            onClick={togglePlay}
            aria-label="Play Featured Video"
            className="absolute inset-0 flex items-center justify-center cursor-pointer group/btn"
          >
            <div className="w-20 h-20 rounded-full bg-amber-500/90 text-neutral-950 flex items-center justify-center shadow-2xl transition-transform group-hover/btn:scale-110 active:scale-95">
              <Play className="w-8 h-8 fill-current ml-1" />
            </div>
          </button>
        )}

        {/* Bottom Control Bar */}
        <div
          className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent transition-opacity duration-300 flex flex-col gap-2 ${
            isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
          }`}
        >
          {/* Progress track */}
          <div className="w-full h-1 bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-white text-xs">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                aria-label={isPlaying ? "Pause video" : "Play video"}
                className="p-1 text-neutral-300 hover:text-amber-400 transition-colors"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                onClick={toggleMute}
                aria-label={isMuted ? "Unmute video" : "Mute video"}
                className="p-1 text-neutral-300 hover:text-amber-400 transition-colors"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <span className="font-mono text-[11px] text-neutral-400">4K Ultra HD</span>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={COMPANY_INFO.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1 bg-red-600/90 hover:bg-red-500 text-white rounded font-medium text-xs transition-colors"
              >
                <Youtube className="w-3.5 h-3.5" />
                <span>Watch more on YouTube</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>

              <button
                onClick={handleFullscreen}
                aria-label="Toggle Fullscreen"
                className="p-1 text-neutral-300 hover:text-amber-400 transition-colors"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Video Details Header */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span>{title}</span>
          </h3>
          <p className="text-xs text-neutral-400 mt-1 max-w-xl">{subtitle}</p>
        </div>

        <a
          href={COMPANY_INFO.youtube}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors shrink-0"
        >
          <span>Colls Records YouTube Channel</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
