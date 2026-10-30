import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useLang } from "../i18n.jsx";

const LOAD_MS = 2000;

// Sayt ochilganda: belgi chiziladi, harflar chiqadi, keyin parda tepaga ko'tariladi.
export default function Intro({ onDone }) {
  const { t } = useLang();
  const [pct, setPct] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    history.scrollRestoration = "manual";
    scrollTo(0, 0);
    document.documentElement.style.overflow = "hidden";

    const start = performance.now();
    let raf = 0;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / LOAD_MS);
      setPct(Math.round(p * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setLeaving(true);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (!leaving) return;
    // sayt kontenti parda hali ketayotganda kira boshlaydi
    const a = setTimeout(() => {
      document.documentElement.style.overflow = "";
      onDone();
    }, 450);
    const b = setTimeout(() => setGone(true), 1200);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, [leaving, onDone]);

  if (gone) return null;

  // body'ga portal: ostidagi #root intro paytida yashirin turadi (html.intro)
  return createPortal(
    <div
      data-intro
      className={`fixed inset-0 z-[100] grid place-items-center bg-bg border-b-2 border-accent transition-transform duration-[900ms] ease-[cubic-bezier(.76,0,.24,1)] ${leaving ? "-translate-y-full" : ""}`}
      aria-hidden={leaving || undefined}
    >
      <div className="flex flex-col items-center gap-8">
        <svg className="w-[clamp(110px,18vw,170px)] h-auto overflow-visible" viewBox="0 0 345 332" aria-hidden="true">
          <path className="intro-draw" style={{ "--c": "#F3F4F8", stroke: "#F3F4F8" }} d="M70,0 L310,0 L242,70 L70,70 L70,120 L250,120 L180,192 L70,192 L70,260 L0,332 L0,70 Z" />
          <path className="intro-draw" style={{ "--c": "#D9A04A", stroke: "#D9A04A", animationDelay: ".5s, 1.3s" }} d="M310,0 L345,0 L277,70 L242,70 Z" />
        </svg>
        <div className="flex overflow-hidden font-display font-semibold text-[clamp(26px,5vw,44px)] leading-tight tracking-[.32em] -mr-[.32em]" aria-label="Formo">
          {"FORMO".split("").map((ch, i) => (
            <span key={i} className="intro-letter" style={{ "--i": i }}>{ch}</span>
          ))}
        </div>
      </div>

      <div className="absolute left-[max(16px,4vw)] bottom-[max(20px,4vh)] font-kit font-bold text-[clamp(40px,8vw,96px)] leading-none text-ink/90 tabular-nums">
        {String(pct).padStart(2, "0")}<span className="text-accent">%</span>
      </div>
      <div className="absolute left-0 bottom-0 h-[3px] bg-accent" style={{ width: pct + "%" }}></div>
      <button
        type="button" onClick={() => setLeaving(true)}
        className="absolute right-[max(16px,4vw)] bottom-[max(24px,4vh)] text-sm font-semibold text-muted hover:text-ink cursor-pointer bg-transparent border-0"
      >
        {t.skip}
      </button>
    </div>,
    document.body
  );
}
