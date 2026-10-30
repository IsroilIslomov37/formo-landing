import { useEffect, useRef } from "react";

const COLORS = ["#F2A33A", "#F6F7FB", "#1FB5A0", "#F2A33A"];
const LINKS = "a, button, label, summary, select, .mag";
const FIELDS = "input, textarea";

// Faqat sichqonchali qurilmada: nuqta + halqa, iz qoldiradigan uchqunlar, bosganda portlash.
// `.mag` klassli tugmalar sichqonchaga biroz intiladi.
export default function Cursor() {
  const canvas = useRef(null);
  const dot = useRef(null);
  const ring = useRef(null);

  useEffect(() => {
    const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    document.documentElement.classList.add("has-cursor");
    const cv = canvas.current;
    const ctx = cv.getContext("2d");
    const dotEl = dot.current;
    const ringEl = ring.current;

    let w = 0, h = 0;
    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = innerWidth; h = innerHeight;
      cv.width = w * dpr; cv.height = h * dpr;
      cv.style.width = w + "px"; cv.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const mouse = { x: -100, y: -100, seen: false };
    const pos = { x: -100, y: -100, s: 1 };
    let targetScale = 1;
    let mode = "idle"; // idle | link | field
    let down = false;
    let lastSpawn = { x: 0, y: 0 };
    let magEl = null;
    const parts = [];

    const spawn = (x, y, burst) => {
      const a = Math.random() * Math.PI * 2;
      const sp = burst ? 1.5 + Math.random() * 3.5 : 0.2 + Math.random() * 0.8;
      parts.push({
        x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - (burst ? 0 : 0.3),
        life: 1, decay: burst ? 0.02 + Math.random() * 0.015 : 0.025 + Math.random() * 0.02,
        size: burst ? 5 + Math.random() * 7 : 3 + Math.random() * 5,
        rot: Math.random() * Math.PI, color: COLORS[(Math.random() * COLORS.length) | 0],
      });
      if (parts.length > 160) parts.shift();
    };

    const setMag = (el, x, y) => {
      if (magEl && magEl !== el) magEl.style.translate = "";
      magEl = el;
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.translate = `${(x - (r.left + r.width / 2)) * 0.22}px ${(y - (r.top + r.height / 2)) * 0.3}px`;
    };

    const onMove = (e) => {
      if (e.pointerType !== "mouse") return;
      mouse.x = e.clientX; mouse.y = e.clientY;
      if (!mouse.seen) {
        mouse.seen = true;
        pos.x = mouse.x; pos.y = mouse.y;
        lastSpawn = { x: mouse.x, y: mouse.y };
        ringEl.style.opacity = "1";
      }
      const t = e.target;
      const isField = !!t.closest?.(FIELDS);
      const isLink = !isField && !!t.closest?.(LINKS);
      mode = isField ? "field" : isLink ? "link" : "idle";
      targetScale = mode === "link" ? 1.9 : mode === "field" ? 0 : 1;
      ringEl.dataset.mode = mode;
      dotEl.style.opacity = mode === "field" ? "0" : "1";
      setMag(t.closest?.(".mag") || null, e.clientX, e.clientY);

      const d = Math.hypot(mouse.x - lastSpawn.x, mouse.y - lastSpawn.y);
      if (d > 16 && mode !== "field") {
        const n = Math.min(3, 1 + ((d / 40) | 0));
        for (let i = 0; i < n; i++) spawn(mouse.x + Math.random() * 6 - 3, mouse.y + Math.random() * 6 - 3, false);
        lastSpawn = { x: mouse.x, y: mouse.y };
      }
      wake();
    };
    const onDown = (e) => {
      if (e.pointerType !== "mouse") return;
      down = true;
      if (mode !== "field") for (let i = 0; i < 18; i++) spawn(e.clientX, e.clientY, true);
      wake();
    };
    const onUp = () => { down = false; wake(); };
    const onLeave = () => {
      dotEl.style.opacity = ringEl.style.opacity = "0";
      mouse.seen = false;
      setMag(null);
    };

    const star = (x, y, r, rot) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.beginPath();
      ctx.moveTo(0, -r);
      ctx.lineTo(r * 0.25, -r * 0.25);
      ctx.lineTo(r, 0);
      ctx.lineTo(r * 0.25, r * 0.25);
      ctx.lineTo(0, r);
      ctx.lineTo(-r * 0.25, r * 0.25);
      ctx.lineTo(-r, 0);
      ctx.lineTo(-r * 0.25, -r * 0.25);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    // Animatsiya sikli faqat kerak bo'lganda ishlaydi (harakat, uchqun yoki halqa yetib olayotganda).
    // Tinch turganda kadr sarflanmaydi, shuning uchun scroll ravon qoladi.
    let raf = 0;
    let dirty = false;
    const wake = () => { if (!raf) raf = requestAnimationFrame(frame); };
    const frame = () => {
      raf = 0;
      pos.x += (mouse.x - pos.x) * 0.18;
      pos.y += (mouse.y - pos.y) * 0.18;
      const ts = down ? targetScale * 0.75 : targetScale;
      pos.s += (ts - pos.s) * 0.2;
      ringEl.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%) scale(${pos.s})`;
      dotEl.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0) translate(-50%, -50%)`;

      if (parts.length || dirty) ctx.clearRect(0, 0, w, h);
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.x += p.vx; p.y += p.vy; p.vy += 0.04; p.vx *= 0.98;
        p.life -= p.decay; p.rot += 0.05;
        if (p.life <= 0) { parts.splice(i, 1); continue; }
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        star(p.x, p.y, p.size * p.life, p.rot);
      }
      ctx.globalAlpha = 1;
      dirty = parts.length > 0;
      const settling = Math.abs(mouse.x - pos.x) > 0.1 || Math.abs(mouse.y - pos.y) > 0.1 || Math.abs(ts - pos.s) > 0.01;
      if (parts.length || settling) raf = requestAnimationFrame(frame);
    };
    wake();

    addEventListener("pointermove", onMove, { passive: true });
    addEventListener("pointerdown", onDown, { passive: true });
    addEventListener("pointerup", onUp, { passive: true });
    addEventListener("resize", resize);
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("has-cursor");
      removeEventListener("pointermove", onMove);
      removeEventListener("pointerdown", onDown);
      removeEventListener("pointerup", onUp);
      removeEventListener("resize", resize);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      setMag(null);
    };
  }, []);

  return (
    <>
      <canvas ref={canvas} aria-hidden="true" className="fixed inset-0 z-[110] pointer-events-none" />
      <div
        ref={ring} aria-hidden="true" data-mode="idle"
        className="fixed left-0 top-0 z-[111] pointer-events-none size-10 rounded-full border border-ink/50 opacity-0 transition-[background-color,border-color,opacity] duration-200 data-[mode=link]:bg-accent/15 data-[mode=link]:border-accent"
      />
      <div ref={dot} aria-hidden="true" className="fixed left-0 top-0 z-[112] pointer-events-none size-1.5 rounded-full bg-accent opacity-0 transition-opacity duration-150" />
    </>
  );
}
