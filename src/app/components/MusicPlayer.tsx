import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Pause, Volume2, VolumeX, Music2, X } from "lucide-react";

const AUDIO_SRC = "/audio/cafe-jazz.mp3";
const TRACK_TITLE = "Café Lo-Fi Jazz";
const TRACK_SUBTITLE = "Ambient · Loop";

const STORAGE_KEY = "portfolio-music";

type Stored = { volume: number; muted: boolean };

function readStored(): Stored {
  if (typeof window === "undefined") return { volume: 0.35, muted: false };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { volume: 0.35, muted: false };
    const p = JSON.parse(raw);
    return {
      volume: typeof p.volume === "number" ? Math.max(0, Math.min(1, p.volume)) : 0.35,
      muted: Boolean(p.muted),
    };
  } catch {
    return { volume: 0.35, muted: false };
  }
}

function EQBars({ playing }: { playing: boolean }) {
  return (
    <div className="flex items-end gap-[3px] h-4">
      {[0.6, 1, 0.75, 0.9, 0.55].map((mult, i) => (
        <motion.span
          key={i}
          className="w-[3px] rounded-sm"
          style={{ background: "var(--accent-primary)", transformOrigin: "bottom" }}
          animate={
            playing
              ? { scaleY: [0.3 * mult, 1 * mult, 0.5 * mult, 0.9 * mult, 0.3 * mult] }
              : { scaleY: 0.25 }
          }
          transition={{
            duration: 0.9 + i * 0.08,
            repeat: playing ? Infinity : 0,
            ease: "easeInOut",
            delay: i * 0.05,
          }}
          initial={{ height: 16 }}
        />
      ))}
    </div>
  );
}

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(() => readStored().muted);
  const [volume, setVolume] = useState(() => readStored().volume);
  const [hasError, setHasError] = useState(false);
  const [showNudge, setShowNudge] = useState(false);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = muted ? 0 : volume;
  }, [volume, muted]);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ volume, muted })
    );
  }, [volume, muted]);

  useEffect(() => {
    const t = setTimeout(() => setShowNudge(true), 2500);
    const hide = setTimeout(() => setShowNudge(false), 9000);
    return () => {
      clearTimeout(t);
      clearTimeout(hide);
    };
  }, []);

  const togglePlay = async () => {
    const a = audioRef.current;
    if (!a) return;
    setShowNudge(false);
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      if (a.error || hasError) {
        a.load();
      }
      try {
        await a.play();
        setPlaying(true);
        setHasError(false);
      } catch {
        setHasError(true);
        setPlaying(false);
      }
    }
  };

  const toggleMute = () => setMuted((m) => !m);

  return (
    <>
      <audio
        ref={audioRef}
        src={AUDIO_SRC}
        loop
        preload="none"
        onEnded={() => setPlaying(false)}
        onError={() => setHasError(true)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        <AnimatePresence>
          {showNudge && !expanded && !playing && (
            <motion.button
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              onClick={() => {
                setExpanded(true);
                setShowNudge(false);
              }}
              className="px-3 py-2 rounded-xl border backdrop-blur-md flex items-center gap-2 shadow-lg"
              style={{
                background: "rgba(var(--bg-base-rgb), 0.85)",
                borderColor: "rgba(var(--accent-primary-rgb), 0.3)",
                fontSize: "12px",
                color: "var(--text-primary)",
                letterSpacing: "0.02em",
              }}
            >
              <Music2 className="w-3.5 h-3.5" style={{ color: "var(--accent-primary)" }} />
              Click for café vibes
              <span style={{ color: "var(--accent-primary)" }}>♪</span>
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {expanded ? (
            <motion.div
              key="panel"
              initial={{ opacity: 0, scale: 0.85, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 16 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-2xl border backdrop-blur-xl overflow-hidden"
              style={{
                width: 280,
                background: "rgba(var(--bg-base-rgb), 0.9)",
                borderColor: "var(--border-strong)",
                boxShadow: "0 16px 48px rgba(0, 0, 0, 0.35), 0 0 32px rgba(var(--accent-primary-rgb), 0.12)",
              }}
            >
              <div
                className="px-4 py-3 flex items-center justify-between border-b"
                style={{ borderColor: "var(--border-subtle)" }}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: "rgba(var(--accent-primary-rgb), 0.12)" }}
                  >
                    <Music2 className="w-3.5 h-3.5" style={{ color: "var(--accent-primary)" }} />
                  </div>
                  <div style={{ lineHeight: 1.1 }}>
                    <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-primary)" }}>
                      {TRACK_TITLE}
                    </div>
                    <div style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: 2 }}>
                      {TRACK_SUBTITLE}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setExpanded(false)}
                  aria-label="Minimize player"
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                  style={{ color: "var(--text-muted)" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(var(--text-primary-rgb), 0.06)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="px-4 py-4 flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  aria-label={playing ? "Pause" : "Play"}
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200"
                  style={{
                    background: "var(--accent-primary)",
                    color: "var(--accent-foreground)",
                    boxShadow: playing
                      ? "0 0 24px rgba(var(--accent-primary-rgb), 0.45)"
                      : "0 0 0 rgba(var(--accent-primary-rgb), 0)",
                  }}
                >
                  {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>

                <EQBars playing={playing && !muted} />

                <div className="flex-1" />

                <button
                  onClick={toggleMute}
                  aria-label={muted ? "Unmute" : "Mute"}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                  style={{ color: muted ? "var(--text-muted)" : "var(--accent-primary)" }}
                >
                  {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>

              <div className="px-4 pb-4">
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={muted ? 0 : volume}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    setVolume(v);
                    if (muted && v > 0) setMuted(false);
                  }}
                  aria-label="Volume"
                  className="w-full h-1 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, var(--accent-primary) 0%, var(--accent-primary) ${(muted ? 0 : volume) * 100}%, rgba(var(--text-primary-rgb), 0.12) ${(muted ? 0 : volume) * 100}%, rgba(var(--text-primary-rgb), 0.12) 100%)`,
                    accentColor: "var(--accent-primary)",
                  }}
                />
              </div>

              {hasError && (
                <div
                  className="px-4 py-2 border-t"
                  style={{
                    background: "rgba(var(--accent-secondary-rgb), 0.06)",
                    borderColor: "var(--border-subtle)",
                    fontSize: "10.5px",
                    color: "var(--text-muted)",
                    lineHeight: 1.4,
                  }}
                >
                  Track not found. Add a file to{" "}
                  <code style={{ color: "var(--accent-primary)" }}>public/audio/cafe-jazz.mp3</code>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.button
              key="fab"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.2 }}
              onClick={() => setExpanded(true)}
              aria-label="Open music player"
              className="relative w-12 h-12 rounded-full border backdrop-blur-md flex items-center justify-center transition-all duration-200"
              style={{
                background: "rgba(var(--bg-base-rgb), 0.85)",
                borderColor: playing ? "var(--accent-primary)" : "var(--border-strong)",
                color: "var(--accent-primary)",
                boxShadow: playing
                  ? "0 0 28px rgba(var(--accent-primary-rgb), 0.4)"
                  : "0 6px 20px rgba(0,0,0,0.25)",
              }}
            >
              {playing && (
                <motion.span
                  className="absolute inset-0 rounded-full"
                  animate={{ scale: [1, 1.3, 1.6], opacity: [0.5, 0.2, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
                  style={{ border: "1px solid var(--accent-primary)" }}
                />
              )}
              {playing ? <EQBars playing /> : <Music2 className="w-4 h-4" />}
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
