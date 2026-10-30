import { useEffect, useLayoutEffect, useRef } from "react";
import { CHAPTERS, TOTAL } from "../data.js";

// serverda (prerender) useLayoutEffect ogohlantirish beradi
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

const NS = "http://www.w3.org/2000/svg";
const AMBER = "#F2A33A";
const WHITE = "#F6F7FB";
const TEAL = "#1FB5A0";

const mk = (tag, attrs, parent) => {
  const el = document.createElementNS(NS, tag);
  for (const k in attrs) el.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(el);
  return el;
};

/**
 * Scroll bilan boshqariladigan butun hikoya shu yerda.
 * SVG sahna (StageSvg) statik, bu hook uning id'lari bo'yicha animatsiya yuritadi.
 * Qaytaradigani: timeline ref (tape va autoplay uchun).
 */
export default function useStoryTimeline(rootRef, { markerRef, onChapter, likesSuffix, enabled = true }) {
  const tlRef = useRef(null);
  const onChapterRef = useRef(onChapter);
  onChapterRef.current = onChapter;
  // til almashsa, timeline qayta qurilmaydi — oxirgi qiymat ref orqali o'qiladi
  const suffixRef = useRef(likesSuffix);
  suffixRef.current = likesSuffix;

  useIsoLayoutEffect(() => {
    if (!enabled) return;
    const root = rootRef.current;
    const $ = (s) => root.querySelector(s);
    const $$ = (s) => Array.from(root.querySelectorAll(s));
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cancelled = false;

    let ctx;
    // GSAP alohida bo'lak sifatida yuklanadi: birinchi ko'rinish tezroq chiqadi
    const start = async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.config({ ignoreMobileResize: true });
      ctx = gsap.context(() => {
      const shirt = $("#shirt");
      const shorts = $("#shorts");
      const pack = $("#pack");
      gsap.set([shirt, shorts], { transformOrigin: "50% 50%" });
      gsap.set(pack, { svgOrigin: "400 496" });

      // element markazini bir marta o'lchab olamiz
      const centers = new Map();
      const ctr = (el) => {
        if (!centers.has(el)) {
          const b = el.getBBox();
          centers.set(el, { x: b.x + b.width / 2, y: b.y + b.height / 2 });
        }
        return centers.get(el);
      };
      // elementni markazi (cx, cy) ga tushadigan qilib qo'yadi
      const at = (el, cx, cy, s = 1, r = 0) => {
        const c = ctr(el);
        return { x: cx - c.x, y: cy - c.y, scale: s, rotation: r };
      };
      const packAt = (cx, cy, s) => ({ x: cx - 400, y: cy - 496, scale: s });

      let lastIdx = -1;
      const syncTape = () => {
        const t = tl.time();
        const m = markerRef.current;
        if (m) m.style.transform = `translateX(${(t / TOTAL) * m.parentElement.clientWidth}px)`;
        let idx = 0;
        CHAPTERS.forEach((at, i) => { if (t >= at - 0.01) idx = i; });
        if (idx !== lastIdx) {
          lastIdx = idx;
          onChapterRef.current(idx);
        }
      };

      const tl = gsap.timeline({
        defaults: { duration: 1, ease: "power2.inOut" },
        scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: reduce ? true : 0.5 },
        onUpdate: syncTape,
      });
      tlRef.current = tl;

      const caps = $$("[data-cap]");
      const cap = (i, t) => {
        tl.to(caps[i - 1], { autoAlpha: 0, y: -20, duration: 0.45, ease: "power1.in" }, t);
        tl.fromTo(caps[i], { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out", immediateRender: false }, t + 0.45);
      };

      const fx = $("#fx");
      const sparks = (points, t, fill = AMBER) => {
        const els = points.map(([x, y]) => {
          const u = mk("use", { href: "#spark", x: -13, y: -13, width: 26, height: 26, fill }, fx);
          gsap.set(u, { x, y, scale: 0, opacity: 0, transformOrigin: "50% 50%" });
          return u;
        });
        tl.to(els, { scale: 1.15, opacity: 1, rotation: 90, duration: 0.45, stagger: 0.07, ease: "back.out(3)" }, t);
        tl.to(els, { scale: 0, opacity: 0, duration: 0.4, stagger: 0.05, ease: "power1.in" }, t + 0.9);
      };

      const press = (t) => {
        tl.to("#cursorPress", { scale: 0.82, duration: 0.15, ease: "power1.out" }, t);
        tl.to("#cursorPress", { scale: 1, duration: 0.2, ease: "power1.out" }, t + 0.15);
      };
      gsap.set("#cursorPress", { transformOrigin: "0% 0%" });
      gsap.set("#cursor", { x: 860, y: 780 });

      /* ---------- 1 · mato ---------- */
      const sw = $$(".swatch");
      gsap.set(sw, { transformOrigin: "50% 50%" });
      gsap.set(sw.slice(1), { x: 820, rotation: 14 });
      [1.4, 3.3, 5.2, 7.1].forEach((t, i) => {
        tl.to(sw[i], { x: -820, rotation: -14, duration: 1.3 }, t);
        tl.to(sw[i + 1], { x: 0, rotation: 0, opacity: 1, duration: 1.3 }, t + 0.1);
      });
      gsap.set("#stamp", { transformOrigin: "50% 50%" });
      tl.fromTo("#stamp", { opacity: 0, scale: 2.2 }, { opacity: 1, scale: 1, duration: 0.55, ease: "back.out(2)", immediateRender: false }, 8.7);
      sparks([[250, 170], [560, 190], [230, 520], [575, 520], [400, 100]], 8.9);

      /* ---------- 2 · bichish ---------- */
      cap(1, 10);
      const cutPath = $("#cutLine");
      const maskPath = $("#guideMaskPath");
      const L = cutPath.getTotalLength();
      cutPath.style.strokeDasharray = L;
      cutPath.style.strokeDashoffset = L;
      maskPath.style.strokeDasharray = L;
      maskPath.style.strokeDashoffset = L;
      const scissors = $("#scissors");
      const bladeA = $("#bladeA");
      const bladeB = $("#bladeB");
      const cut = { p: 0 };
      const renderCut = () => {
        const d = Math.min(L, Math.max(0, cut.p * L));
        const a = cutPath.getPointAtLength(d);
        const prev = cutPath.getPointAtLength(Math.max(0, d - 3));
        const next = cutPath.getPointAtLength(Math.min(L, d + 3));
        const ang = Math.atan2(next.y - prev.y, next.x - prev.x) * 180 / Math.PI;
        scissors.setAttribute("transform", `translate(${a.x} ${a.y}) rotate(${ang})`);
        cutPath.style.strokeDashoffset = L - d;
        const open = 13 * Math.abs(Math.sin(d / 15));
        bladeA.setAttribute("transform", `rotate(${-open} -48 0)`);
        bladeB.setAttribute("transform", `rotate(${open} -48 0)`);
      };
      renderCut();
      tl.to("#stamp", { opacity: 0, scale: 0.85, duration: 0.4 }, 10);
      tl.to("#tagKnit", { opacity: 0, y: -30, duration: 0.4 }, 10);
      tl.set(shirt, { opacity: 1 }, 10.3);
      tl.set("#guide", { opacity: 1 }, 10.3);
      tl.to(maskPath, { strokeDashoffset: 0, duration: 1.4, ease: "none" }, 10.4);
      tl.to(scissors, { opacity: 1, duration: 0.4 }, 11.7);
      tl.to(cut, { p: 1, duration: 5.6, ease: "none", onUpdate: renderCut }, 12.1);
      tl.to(scissors, { opacity: 0, duration: 0.4 }, 17.7);
      tl.to("#guide", { opacity: 0, duration: 0.3 }, 17.7);
      tl.set("#shirtOutline", { opacity: 1 }, 17.8);
      tl.set(cutPath, { opacity: 0 }, 17.8);
      tl.to(sw[4], { y: 720, rotation: 10, duration: 1.3, ease: "power2.in" }, 17.9);
      tl.set(sw[4], { opacity: 0 }, 19.2);
      tl.to(shirt, { scale: 1.05, duration: 0.4, ease: "power1.out" }, 18.2);
      tl.to(shirt, { scale: 1, duration: 0.6, ease: "back.out(3)" }, 18.6);

      /* ---------- 3 · tikish ---------- */
      cap(2, 20);
      tl.to("#shirtTrims", { opacity: 1, duration: 0.8 }, 20.2);
      const hand = $("#hand");
      gsap.set(hand, { x: 880, y: -160 });
      gsap.set("#logoShirt", { transformOrigin: "50% 50%", scale: 0 });
      tl.set(hand, { opacity: 1 }, 20.9);
      tl.to(hand, { x: 314, y: 290, duration: 1 }, 21);
      tl.to("#revChemp", { attr: { width: 184 }, duration: 3, ease: "none" }, 22);
      tl.to(hand, { x: 488, duration: 3, ease: "none" }, 22);
      tl.to("#handBob", { y: -14, duration: 0.25, repeat: 11, yoyo: true, ease: "sine.inOut" }, 22);
      tl.to(hand, { x: 344, y: 400, duration: 0.8 }, 25.1);
      tl.to("#rev17", { attr: { width: 144 }, duration: 2.2, ease: "none" }, 26);
      tl.to(hand, { x: 458, duration: 2.2, ease: "none" }, 26);
      tl.to("#handBob", { y: -14, duration: 0.22, repeat: 9, yoyo: true, ease: "sine.inOut" }, 26);
      tl.to(hand, { x: 460, y: 226, duration: 0.8 }, 28.3);
      tl.to("#logoShirt", { scale: 1, duration: 0.8, ease: "back.out(2.5)" }, 29.1);
      tl.to("#handBob", { y: -12, duration: 0.2, repeat: 3, yoyo: true }, 29.1);
      tl.to(hand, { x: 900, y: -180, duration: 1 }, 30.1);
      tl.set(hand, { opacity: 0 }, 31.1);
      sparks([[300, 240], [510, 230], [282, 470], [522, 450]], 30.6);

      /* ---------- 4 · shortik ---------- */
      cap(3, 32);
      tl.to(shirt, { ...at(shirt, 235, 330, 0.62), duration: 1.4 }, 32.2);
      gsap.set(shorts, { x: 300 });
      tl.to(shorts, { x: 0, opacity: 1, duration: 1.3, ease: "power3.out" }, 33);
      gsap.set("#btn", { transformOrigin: "50% 50%", scale: 0.7 });
      gsap.set("#btnFace", { transformOrigin: "50% 50%" });
      tl.to("#btn", { opacity: 1, scale: 1, duration: 0.7, ease: "back.out(2)" }, 34.4);
      tl.to("#cursor", { x: 478, y: 584, duration: 1.4 }, 35.3);
      press(36.8);
      tl.to("#btnFace", { scale: 0.96, y: 3, duration: 0.15 }, 36.8);
      tl.to("#btnFace", { scale: 1, y: 0, duration: 0.2 }, 36.95);
      tl.fromTo("#ripple", { attr: { r: 0 }, opacity: 0.5 }, { attr: { r: 130 }, opacity: 0, duration: 0.7, ease: "power2.out", immediateRender: false }, 36.9);
      tl.to("#btnText1", { opacity: 0, duration: 0.25 }, 37);
      tl.to("#btnFill2", { opacity: 1, duration: 0.25 }, 37);
      tl.to("#btnText2", { opacity: 1, duration: 0.25 }, 37.1);
      [0, 1, 2].forEach((i) => {
        const u = mk("use", { href: "#spark", x: -15, y: -15, width: 30, height: 30, fill: i === 1 ? WHITE : AMBER }, fx);
        gsap.set(u, { x: 300, y: 250 + i * 50, scale: 0, opacity: 0, transformOrigin: "50% 50%" });
        const t = 37.3 + i * 0.14;
        tl.to(u, { scale: 1, opacity: 1, duration: 0.2 }, t);
        tl.to(u, { x: 520, rotation: 180, duration: 1.1, ease: "none" }, t + 0.1);
        tl.to(u, { y: 160 + i * 50, duration: 0.55, ease: "power1.out" }, t + 0.1);
        tl.to(u, { y: 250 + i * 50, duration: 0.55, ease: "power1.in" }, t + 0.65);
        tl.to(u, { scale: 0, opacity: 0, duration: 0.2 }, t + 1.1);
      });
      tl.to("#waveCircle", { attr: { r: 340 }, duration: 1.4 }, 38.3);
      tl.to("#waveRing", { attr: { r: 340 }, duration: 1.4 }, 38.3);
      tl.to("#waveRing", { opacity: 0, duration: 0.3 }, 39.5);
      tl.to(shorts, { scale: 1.07, duration: 0.4, ease: "power1.out" }, 39.3);
      tl.to(shorts, { scale: 1, duration: 0.5, ease: "back.out(3)" }, 39.7);
      tl.to("#cursor", { x: 860, y: 780, duration: 1 }, 39.6);
      sparks([[470, 240], [712, 270], [590, 430]], 39.7, TEAL);

      /* ---------- 5 · qadoqlash ---------- */
      cap(4, 44);
      tl.to("#btn", { opacity: 0, y: 60, duration: 0.6 }, 44);
      gsap.set(["#boxBack", "#boxFront"], { y: 430 });
      tl.to(["#boxBack", "#boxFront"], { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" }, 44.3);
      tl.to(shirt, { ...at(shirt, 345, 468, 0.42, -8), duration: 1.4 }, 45.6);
      tl.to(shorts, { ...at(shorts, 462, 455, 0.5, 9), duration: 1.4 }, 45.9);
      tl.to(shirt, { ...at(shirt, 345, 516, 0.36, -8), duration: 0.9 }, 47.3);
      tl.to(shorts, { ...at(shorts, 462, 518, 0.45, 6), duration: 0.9 }, 47.4);
      gsap.set("#lid", { y: -520, transformOrigin: "50% 50%" });
      tl.set("#lid", { opacity: 1 }, 48.3);
      tl.to("#lid", { y: 0, duration: 1, ease: "bounce.out" }, 48.4);
      tl.to(".flap", { opacity: 0, duration: 0.25 }, 48.95);
      gsap.set("#sticker", { transformOrigin: "50% 50%", scale: 0 });
      tl.to("#sticker", { scale: 1, rotation: 360, duration: 0.7, ease: "back.out(2.5)" }, 49.6);
      sparks([[200, 410], [600, 400], [400, 330], [250, 610], [560, 615]], 50.2);

      /* ---------- 6 · yetkazish ---------- */
      cap(5, 54);
      gsap.set(["#city", "#road"], { y: 280 });
      gsap.set(".wheel", { transformOrigin: "50% 50%" });
      tl.to(["#city", "#road"], { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" }, 54.2);
      tl.to(pack, { ...packAt(640, 461, 0.42), duration: 1.2 }, 54.2);
      gsap.set("#van", { x: -760 });
      tl.to("#van", { x: 0, duration: 1.6, ease: "power2.out" }, 55.4);
      tl.to(".wheel", { rotation: "+=540", duration: 1.6, ease: "power2.out" }, 55.4);
      tl.to(pack, { x: -40, scale: 0.3, duration: 1, ease: "none" }, 57.2);
      tl.to(pack, { y: 340 - 496, duration: 0.5, ease: "power1.out" }, 57.2);
      tl.to(pack, { y: 430 - 496, duration: 0.5, ease: "power1.in" }, 57.7);
      tl.set(pack, { opacity: 0 }, 58.25);
      tl.to("#van", { x: 780, duration: 1.6, ease: "power2.in" }, 58.4);
      tl.to(".wheel", { rotation: "+=720", duration: 1.6, ease: "power2.in" }, 58.4);
      tl.to("#speed", { opacity: 1, duration: 0.3 }, 58.6);
      tl.to("#speed", { opacity: 0, duration: 0.3 }, 59.7);
      tl.to("#city", { x: -500, opacity: 0, duration: 1.6, ease: "power2.in" }, 58.6);
      tl.to("#dashes", { x: -280, duration: 1.6, ease: "power2.in" }, 58.4);
      gsap.set("#house", { x: 420 });
      tl.to("#house", { x: 0, opacity: 1, duration: 1.3, ease: "power3.out" }, 60.1);
      tl.set("#van", { x: -780 }, 60.2);
      tl.to("#van", { x: -70, duration: 1.5, ease: "power2.out" }, 60.4);
      tl.to(".wheel", { rotation: "+=540", duration: 1.5, ease: "power2.out" }, 60.4);
      tl.to("#dashes", { x: -560, duration: 1.5, ease: "power2.out" }, 60.4);
      tl.set(pack, { ...packAt(300, 430, 0.3), opacity: 1 }, 62);
      tl.to(pack, { x: 575 - 400, scale: 0.32, duration: 1, ease: "none" }, 62.1);
      tl.to(pack, { y: 360 - 496, duration: 0.5, ease: "power1.out" }, 62.1);
      tl.to(pack, { y: 472 - 496, duration: 0.5, ease: "power1.in" }, 62.6);
      tl.to("#van", { x: -820, duration: 1.4, ease: "power2.in" }, 63.3);
      tl.to(".wheel", { rotation: "-=720", duration: 1.4, ease: "power2.in" }, 63.3);
      gsap.set("#badge", { transformOrigin: "50% 50%", scale: 0 });
      tl.to("#badge", { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(2.5)" }, 64.4);
      sparks([[500, 430], [655, 425], [575, 345]], 64.6, TEAL);

      /* ---------- 7 · ulashish ---------- */
      cap(6, 66);
      tl.to(["#road", "#house", "#badge"], { y: 300, opacity: 0, duration: 1, ease: "power2.in" }, 66);
      tl.to(pack, { x: 0, y: 0, scale: 1, duration: 1.3 }, 66.3);
      tl.to("#lid", { x: -260, y: -420, rotation: -35, opacity: 0, duration: 1, ease: "power2.in" }, 67.7);
      tl.to(["#boxBack", "#boxFront"], { y: 360, opacity: 0, duration: 1.1, ease: "power2.in" }, 68.5);
      tl.to(shirt, { ...at(shirt, 400, 300, 0.5, 0), duration: 1.2, ease: "back.out(1.4)" }, 68.3);
      tl.to(shorts, { ...at(shorts, 400, 470, 0.5, 0), duration: 1.2, ease: "back.out(1.4)" }, 68.45);
      gsap.set("#phoneFront", { transformOrigin: "50% 50%", scale: 1.25 });
      tl.to("#phoneBack", { opacity: 1, duration: 0.8 }, 69.2);
      tl.to("#phoneFront", { opacity: 1, scale: 1, duration: 1, ease: "power3.out" }, 69.2);
      tl.to("#camUI", { opacity: 1, duration: 0.6 }, 69.7);
      tl.to("#cursor", { x: 404, y: 590, duration: 1.2 }, 70.4);
      press(71.7);
      tl.to("#flash", { opacity: 0.95, duration: 0.08, ease: "none" }, 71.8);
      tl.to("#flash", { opacity: 0, duration: 0.6, ease: "power1.out" }, 71.9);
      tl.to("#camUI", { opacity: 0, duration: 0.3 }, 72.1);
      tl.to("#postUI", { opacity: 1, duration: 0.4 }, 72.2);
      tl.to("#capRev", { attr: { width: 250 }, duration: 1.2, ease: "none" }, 72.6);
      tl.to("#cursor", { x: 432, y: 606, duration: 0.7 }, 73.9);
      press(74.7);
      gsap.set("#shareBtn", { transformOrigin: "50% 50%" });
      tl.to("#shareBtn", { scale: 0.94, duration: 0.15 }, 74.7);
      tl.to("#shareBtn", { scale: 1, duration: 0.2 }, 74.85);
      tl.to("#composer", { opacity: 0, duration: 0.3 }, 75.1);
      tl.to("#published", { opacity: 1, duration: 0.4 }, 75.2);
      gsap.set("#heartFull", { transformOrigin: "50% 50%" });
      tl.fromTo("#heartFull", { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(4)", immediateRender: false }, 75.5);

      const likesEl = $("#likes");
      const likes = { n: 0 };
      tl.to(likes, {
        n: 1248, duration: 3.6, ease: "power1.inOut",
        onUpdate: () => {
          likesEl.textContent = String(Math.round(likes.n)).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " " + suffixRef.current;
        },
      }, 75.4);

      const heartsG = $("#hearts");
      [-46, 38, 84, -14, 120, 14, 64].forEach((dx, i) => {
        const u = mk("use", { href: "#heart", x: -15, y: -14, width: 30, height: 28, fill: "#F0544F", stroke: "#0A0F26", "stroke-width": 2 }, heartsG);
        gsap.set(u, { x: 291, y: 546, scale: 0.3, opacity: 0, transformOrigin: "50% 50%" });
        const t = 75.6 + i * 0.32;
        tl.to(u, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(3)" }, t);
        tl.to(u, { y: 190 + (i % 3) * 40, duration: 1.7, ease: "power1.out" }, t);
        tl.to(u, { x: 291 + dx, duration: 1.7, ease: "sine.inOut" }, t);
        tl.to(u, { opacity: 0, duration: 0.5 }, t + 1.3);
      });
      tl.to("#cursor", { x: 860, y: 780, duration: 1 }, 75.6);
      [["#bub1", "100% 50%", 76.2], ["#bub2", "0% 50%", 77.3], ["#bub3", "100% 50%", 78.4]].forEach(([sel, origin, t]) => {
        gsap.set(sel, { transformOrigin: origin });
        tl.fromTo(sel, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2.5)", immediateRender: false }, t);
      });
      sparks([[230, 110], [580, 120], [600, 560], [210, 560]], 79);
      tl.set({}, {}, TOTAL);

      syncTape();
      }, root);

      // shriftlar kelgach sahifa balandligi o'zgaradi
      document.fonts?.ready.then(() => { if (!cancelled) ScrollTrigger.refresh(); });
    };
    start();

    return () => {
      cancelled = true;
      ctx?.revert();
      tlRef.current = null;
      // sparks va yuraklarni qo'lda qo'shgan edik
      $("#fx")?.replaceChildren();
      $("#hearts")?.replaceChildren();
    };
  }, [rootRef, markerRef, enabled]);

  return tlRef;
}
