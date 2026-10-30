import { useEffect, useRef, useState } from "react";
import StageSvg from "./StageSvg.jsx";
import useStoryTimeline from "../hooks/useStoryTimeline.js";
import useAutoplay from "../hooks/useAutoplay.js";
import { useLang } from "../i18n.jsx";
import { CHAPTERS, TOTAL } from "../data.js";
import { wrap, kicker, btnAccent } from "../ui.jsx";


export default function Story() {
  const root = useRef(null);
  const marker = useRef(null);
  const [active, setActive] = useState(0);
  const { t } = useLang();
  const S = t.story;
  // Katta SVG sahna va animatsiya sahifa ochilganda emas, hikoyaga yaqinlashganda yaratiladi
  const [near, setNear] = useState(false);
  useEffect(() => {
    if (!("IntersectionObserver" in window)) { setNear(true); return; }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setNear(true); io.disconnect(); }
    }, { rootMargin: "500px 0px" });
    io.observe(root.current);
    return () => io.disconnect();
  }, []);

  const tl = useStoryTimeline(root, { markerRef: marker, onChapter: setActive, likesSuffix: t.stage.likes, enabled: near });
  const auto = useAutoplay(tl);

  function jumpTo(at) {
    const st = tl.current?.scrollTrigger;
    if (!st) return;
    const y = st.start + ((at + 0.8) / TOTAL) * (st.end - st.start);
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
  }

  return (
    <section id="jarayon" ref={root} aria-label={S.aria} className="relative h-[1000vh] scroll-mt-[var(--header-h)]">
      <div className={`sticky top-0 h-svh flex flex-col justify-center gap-[18px] pt-[calc(var(--header-h)+12px)] pb-[18px] max-[860px]:gap-4 max-[860px]:pt-[calc(var(--header-h)+10px)] land:gap-2 land:pt-[calc(var(--header-h)+6px)] land:pb-2`}>
        <div className={`${wrap} w-full grid grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)] gap-[clamp(24px,4vw,56px)] items-center max-[860px]:grid-cols-1 max-[860px]:gap-4 land:grid-cols-2 land:gap-4`}>
          <div className={`grid items-center max-[860px]:items-start max-[860px]:min-h-[170px] land:items-center land:min-h-0`}>
            {S.items.map((s, i) => (
              <article
                key={s.title}
                className={`[grid-area:1/1] flex flex-col gap-4 max-w-[30rem] min-w-0 [&:not(:first-child)]:opacity-0 [&:not(:first-child)]:invisible max-[860px]:gap-2.5`}
                data-cap
              >
                <span className={`${kicker} self-start px-3 py-2 rounded-[10px] bg-accent/10 border border-accent/35 max-[860px]:px-2.5 max-[860px]:py-1.5`}>
                  {S.step(i + 1, S.chapters[i])}
                </span>
                <h2 className={`font-display font-bold text-[clamp(24px,2.9vw,40px)] leading-[1.1] tracking-[-.025em] m-0 text-balance max-[860px]:text-xl land:text-base`}>{s.title}</h2>
                <p className={`text-[16.5px] font-medium text-muted m-0 text-pretty max-[860px]:text-[14.5px] max-[860px]:leading-normal land:text-xs`}>{s.text}</p>
                {i === S.items.length - 1 && (
                  <a className={`${btnAccent} self-start mt-1.5 max-[860px]:px-4! max-[860px]:py-[13px]! max-[860px]:text-[12.5px]!`} href="#buyurtma">
                    {S.cta}
                  </a>
                )}
              </article>
            ))}
          </div>

          <div
            className={`justify-self-center w-[min(100%,calc((100svh_-_var(--header-h)_-_120px)*8/7))] aspect-[8/7] max-w-full border border-line rounded-[28px] overflow-hidden bg-bg2 [contain:layout_paint] [transform:translateZ(0)] shadow-[0_30px_70px_-40px_rgba(0,0,0,.7)]
              max-[860px]:order-first max-[860px]:w-[min(100%,max(240px,calc((100svh_-_var(--header-h)_-_290px)*8/7)))] max-[860px]:rounded-[20px] land:order-none land:w-[min(100%,calc((100svh_-_var(--header-h)_-_70px)*8/7))] land:rounded-xl`}
          >
            {near && <StageSvg />}
          </div>
        </div>

        <div className={`${wrap} w-full flex gap-2.5 items-stretch`}>
          <button
            type="button" aria-pressed={auto.playing} onClick={auto.toggle}
            className={`flex-none inline-flex items-center gap-2 px-4 rounded-[14px] cursor-pointer font-display font-semibold text-[13px] leading-none text-accent bg-transparent border-[1.5px] border-accent transition-colors duration-200 hover:bg-accent/10 max-[860px]:px-3`}
          >
            <svg className="size-4 fill-current" viewBox="0 0 20 20" aria-hidden="true">
              {auto.playing ? <path d="M5.5 4.5h3v11h-3zM11.5 4.5h3v11h-3z" /> : <path d="M6 4.5v11l9-5.5z" />}
            </svg>
            <span className="max-[860px]:sr-only">{auto.playing ? S.pause : S.play}</span>
          </button>

          <nav
            aria-label={S.tapeAria} onClickCapture={auto.stop}
            className={`tape relative flex flex-1 min-w-0 h-[46px] bg-surface border border-line rounded-[14px] overflow-hidden max-[860px]:h-12 land:h-8`}
          >
            {CHAPTERS.map((at, i) => {
              const next = CHAPTERS[i + 1] ?? TOTAL;
              const on = i === active;
              return (
                <button
                  key={at} type="button" onClick={() => jumpTo(at)}
                  style={{ "--g": next - at }}
                  aria-label={S.stepAria(i + 1, S.chapters[i])}
                  aria-current={on ? "true" : undefined}
                  className={`flex-[var(--g)_1_0] min-w-0 flex items-end gap-[7px] px-2.5 pb-2 border-0 border-l border-line first:border-l-0 cursor-pointer font-display font-semibold text-xs leading-none whitespace-nowrap overflow-hidden text-left
                    max-[860px]:flex-[1_1_0] max-[860px]:px-[7px] max-[860px]:pb-[7px] max-[860px]:text-[11px]
                    ${on
                      ? `bg-accent/10 text-accent shadow-[inset_0_-2px_0_var(--color-accent)] max-[860px]:grow-[2.8]`
                      : "bg-transparent text-muted hover:bg-[rgb(150_165_255/.06)]"}`}
                >
                  <b className={`font-bold ${on ? "text-accent" : "text-ink"}`}>{i + 1}</b>{" "}
                  <span className={`overflow-hidden text-ellipsis ${on ? "" : `max-[860px]:hidden`}`}>{S.chapters[i]}</span>
                </button>
              );
            })}
            <span
              ref={marker}
              className={`absolute top-0 bottom-0 left-0 w-0.5 -ml-px bg-accent pointer-events-none before:content-[''] before:absolute before:top-0 before:left-1/2 before:-translate-x-1/2 before:border-[6px] before:border-transparent before:border-t-accent max-[860px]:hidden`}
            ></span>
          </nav>
        </div>
      </div>
    </section>
  );
}
