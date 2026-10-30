import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { Song } from '../types';
import { INITIAL_SONGS } from '../lib/constants';
import { db } from '../lib/db';

interface AudioContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  playSong: (song: Song) => void;
  pauseSong: () => void;
  togglePlay: () => void;
  nextSong: () => void;
  prevSong: () => void;
  playlist: Song[];
  setPlaylist: (songs: Song[]) => void;
  currentTime: number;
  duration: number;
  volume: number;
  setVolume: (v: number) => void;
  seek: (seconds: number) => void;
  isMuted: boolean;
  toggleMute: () => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [playlist, setPlaylist] = useState<Song[]>(INITIAL_SONGS);
  const [currentSong, setCurrentSong] = useState<Song | null>(INITIAL_SONGS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolumeState] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Load fresh songs from db
    db.getSongs().then(songs => {
      if (songs && songs.length > 0) {
        setPlaylist(songs);
        if (!currentSong) {
          setCurrentSong(songs[0]);
        }
      }
    });
  }, []);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    const audio = audioRef.current;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration || 0);
    const onEnded = () => nextSong();
    const onError = (e: Event) => {
      console.warn('Audio playback notice:', e);
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, [playlist, currentSong]);

  const playSong = (song: Song) => {
    if (!audioRef.current) return;
    if (currentSong?.id !== song.id) {
      setCurrentSong(song);
      audioRef.current.src = song.audio_url;
      audioRef.current.currentTime = 0;
      db.incrementPlayCount(song.id);
    }
    audioRef.current.play()
      .then(() => setIsPlaying(true))
      .catch(err => {
        console.warn('Autoplay prevented or network stream issue:', err);
        setIsPlaying(false);
      });
  };

  const pauseSong = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current || !currentSong) return;
    if (isPlaying) {
      pauseSong();
    } else {
      if (!audioRef.current.src || audioRef.current.src === '') {
        audioRef.current.src = currentSong.audio_url;
      }
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => {
          console.warn('Playback error:', err);
          setIsPlaying(false);
        });
    }
  };

  const nextSong = () => {
    if (playlist.length === 0) return;
    const currentIndex = playlist.findIndex(s => s.id === currentSong?.id);
    const nextIndex = (currentIndex + 1) % playlist.length;
    playSong(playlist[nextIndex]);
  };

  const prevSong = () => {
    if (playlist.length === 0) return;
    const currentIndex = playlist.findIndex(s => s.id === currentSong?.id);
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    playSong(playlist[prevIndex]);
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const setVolume = (v: number) => {
    const clamped = Math.max(0, Math.min(1, v));
    setVolumeState(clamped);
    if (audioRef.current) {
      audioRef.current.volume = clamped;
    }
    if (clamped > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  return (
    <AudioContext.Provider
      value={{
        currentSong,
        isPlaying,
        playSong,
        pauseSong,
        togglePlay,
        nextSong,
        prevSong,
        playlist,
        setPlaylist,
        currentTime,
        duration,
        volume,
        setVolume,
        seek,
        isMuted,
        toggleMute
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error('useAudio must be used within AudioProvider');
  return ctx;
};
