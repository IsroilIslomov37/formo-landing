import { useCallback, useEffect, useRef, useState } from "react";

const SECONDS = 40;

// Hikoyani o'zi aylantirib ko'rsatadi. Foydalanuvchi qo'l tekkizsa to'xtaydi.
export default function useAutoplay(tlRef) {
  const [playing, setPlaying] = useState(false);
  const playingRef = useRef(false);
  const raf = useRef(0);
  const last = useRef(0);
  const pos = useRef(0);
  const startedAt = useRef(0);

  const stop = useCallback(() => {
    if (!playingRef.current) return;
    cancelAnimationFrame(raf.current);
    playingRef.current = false;
    setPlaying(false);
  }, []);

  const step = useCallback((t) => {
    if (!playingRef.current) return;
    const st = tlRef.current?.scrollTrigger;
    if (!st) return stop();
    const dt = last.current ? Math.min(0.1, (t - last.current) / 1000) : 0;
    last.current = t;
    pos.current += ((st.end - st.start) / SECONDS) * dt;
    if (pos.current >= st.end) {
      window.scrollTo({ top: st.end, behavior: "instant" });
      return stop();
    }
    window.scrollTo({ top: pos.current, behavior: "instant" });
    raf.current = requestAnimationFrame(step);
  }, [tlRef, stop]);

  const start = useCallback(() => {
    const st = tlRef.current?.scrollTrigger;
    if (!st) return;
    // hikoya ichida turgan bo'lsa shu joydan, bo'lmasa boshidan
    const y = window.scrollY;
    pos.current = y >= st.start && y < st.end - 4 ? y : st.start;
    window.scrollTo({ top: pos.current, behavior: "instant" });
    last.current = 0;
    startedAt.current = performance.now();
    playingRef.current = true;
    setPlaying(true);
    raf.current = requestAnimationFrame(step);
  }, [tlRef, step]);

  const toggle = useCallback(() => (playingRef.current ? stop() : start()), [start, stop]);

  useEffect(() => {
    // trackpad inertsiyasi start'dan keyin ham wheel yuboradi, shuning uchun biroz kutamiz
    const onManual = () => { if (performance.now() - startedAt.current > 400) stop(); };
    const onKey = (e) => {
      if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(e.key) && !e.target.closest?.(".autoplay")) stop();
    };
    window.addEventListener("wheel", onManual, { passive: true });
    window.addEventListener("touchstart", onManual, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onManual);
      window.removeEventListener("touchstart", onManual);
      window.removeEventListener("keydown", onKey);
      cancelAnimationFrame(raf.current);
    };
  }, [stop]);

  return { playing, toggle, stop };
}
