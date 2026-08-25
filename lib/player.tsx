"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { config, tracks } from "@/content/site";

/**
 * Everything except `elapsed`. This changes only on real user intent, so the
 * value stays referentially stable across the ~4Hz timeupdate tick.
 */
type PlayerState = {
  currentTrack: number;
  playing: boolean;
  /** true after the first play anywhere — reveals the mini-player */
  started: boolean;
};

type PlayerApi = PlayerState & {
  togglePlay: () => void;
  /** select a track from the tracklist and start playback */
  selectTrack: (i: number) => void;
  /** hero plate: toggles track 1 */
  playTop: () => void;
  /** dismiss the mini-player without stopping playback */
  dismissMiniPlayer: () => void;
  miniPlayerDismissed: boolean;
  /** jump to an absolute position in seconds; callers clamp to the duration */
  seek: (seconds: number) => void;
  fmt: (s: number) => string;
};

const PlayerContext = createContext<PlayerApi | null>(null);
/**
 * `elapsed` lives in its own context because it updates several times a
 * second. Only the fills and timecodes subscribe to it, so a tick never
 * re-renders the sections that merely need play/pause state.
 */
const ElapsedContext = createContext<number>(0);

export function fmt(s: number) {
  const m = Math.floor(s / 60);
  const ss = Math.floor(s % 60);
  return `${m}:${String(ss).padStart(2, "0")}`;
}

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PlayerState>({
    currentTrack: 0,
    playing: false,
    started: false,
  });
  const [elapsed, setElapsed] = useState(0);
  const [miniPlayerDismissed, setMiniPlayerDismissed] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Keep the <audio> element in sync with state.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const src = tracks[state.currentTrack].src;
    if (!audio.src.endsWith(src)) {
      audio.src = src;
      audio.currentTime = 0;
    }
    if (state.playing) {
      audio.play().catch(() => {
        // Autoplay blocked or file missing — reflect reality in state.
        setState((s) => ({ ...s, playing: false }));
      });
    } else {
      audio.pause();
    }
  }, [state.currentTrack, state.playing]);

  const onTimeUpdate = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setElapsed(audio.currentTime);
  }, []);

  const onEnded = useCallback(() => {
    setState((s) => {
      if (config.autoAdvance && s.currentTrack < tracks.length - 1) {
        return { ...s, currentTrack: s.currentTrack + 1 };
      }
      return { ...s, playing: false };
    });
    setElapsed(0);
    const audio = audioRef.current;
    if (audio) audio.currentTime = 0;
  }, []);

  const togglePlay = useCallback(() => {
    setState((s) => ({ ...s, playing: !s.playing, started: true }));
    setMiniPlayerDismissed(false);
  }, []);

  const selectTrack = useCallback((i: number) => {
    const audio = audioRef.current;
    if (audio) audio.currentTime = 0;
    setElapsed(0);
    setState((s) => ({ ...s, currentTrack: i, playing: true, started: true }));
    setMiniPlayerDismissed(false);
  }, []);

  const playTop = useCallback(() => {
    setState((s) => {
      if (s.currentTrack === 0 && s.playing) return { ...s, playing: false };
      if (s.currentTrack === 0) return { ...s, playing: true, started: true };
      const audio = audioRef.current;
      if (audio) audio.currentTime = 0;
      setElapsed(0);
      return { ...s, currentTrack: 0, playing: true, started: true };
    });
    setMiniPlayerDismissed(false);
  }, []);

  const dismissMiniPlayer = useCallback(() => setMiniPlayerDismissed(true), []);

  const seek = useCallback((seconds: number) => {
    const t = Math.max(0, seconds);
    const audio = audioRef.current;
    if (audio) {
      // Setting currentTime before metadata exists throws in some browsers;
      // the local state below still moves the UI either way.
      try {
        audio.currentTime = t;
      } catch {
        /* no seekable range yet */
      }
    }
    setElapsed(t);
  }, []);

  const api = useMemo<PlayerApi>(
    () => ({
      ...state,
      togglePlay,
      selectTrack,
      playTop,
      dismissMiniPlayer,
      miniPlayerDismissed,
      seek,
      fmt,
    }),
    [
      state,
      togglePlay,
      selectTrack,
      playTop,
      dismissMiniPlayer,
      miniPlayerDismissed,
      seek,
    ],
  );

  return (
    <PlayerContext.Provider value={api}>
      <ElapsedContext.Provider value={elapsed}>
        {children}
      </ElapsedContext.Provider>
      <audio
        ref={audioRef}
        preload="none"
        onTimeUpdate={onTimeUpdate}
        onEnded={onEnded}
      />
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
}

/** Subscribe to playback position. Use in the smallest possible leaf. */
export function useElapsed() {
  return useContext(ElapsedContext);
}

/** Percentage 0–100 of the given track's duration, clamped. */
export function useProgressPct(trackIndex: number, active: boolean) {
  const elapsed = useElapsed();
  if (!active) return 0;
  return Math.min(100, (elapsed / tracks[trackIndex].dur) * 100);
}
