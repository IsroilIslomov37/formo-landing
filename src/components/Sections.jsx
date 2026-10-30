import Reveal from "./Reveal.jsx";
import Logo from "./Logo.jsx";
import { useLang } from "../i18n.jsx";
import { TELEGRAM } from "../data.js";
import { wrap, section, kicker, btnAccent, SecHead } from "../ui.jsx";

const sectionPad = "pt-[clamp(64px,9vw,128px)]";

export function Features() {
  const F = useLang().t.features;
  return (
    <section id="afzalliklar" className={`${sectionPad} ${section}`}>
      <div className={wrap}>
        <SecHead kicker={F.kicker} title={F.title}>{F.lead}</SecHead>
        <div className="grid grid-cols-2 gap-x-[clamp(24px,5vw,72px)] max-[700px]:grid-cols-1">
          {F.items.map((f, i) => (
            <Reveal as="article" key={f.title} delay={(i % 2) * 90}
              className="group relative pt-[26px] pb-[30px] border-t border-line before:content-[''] before:absolute before:-top-px before:left-0 before:h-px before:w-0 before:bg-accent before:transition-[width] before:duration-500 hover:before:w-full">
              <span aria-hidden="true" className="absolute top-[26px] right-0 font-display font-semibold text-sm text-muted transition-colors duration-300 group-hover:text-accent">0{i + 1}</span>
              <h3 className="font-display font-semibold text-xl leading-tight tracking-[-.01em] m-0 mb-2.5 pr-10 transition-colors duration-300 group-hover:text-accent">{f.title}</h3>
              <p className="m-0 text-muted text-base font-medium max-w-[30em]">{f.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Steps() {
  const S = useLang().t.steps;
  return (
    <section id="qanday" className={section}>
      <div className={wrap}>
        <SecHead kicker={S.kicker} title={S.title} />
        <ol className="list-none m-0 p-0 grid grid-cols-4 max-[1000px]:grid-cols-2 max-[1000px]:gap-y-9 max-[560px]:grid-cols-1">
          {S.items.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 110}
              className="group flex flex-col gap-2 min-w-0 py-1 pr-7 pl-6 border-l border-line
                first:pl-0 first:border-l-0 max-[1000px]:odd:pl-0 max-[1000px]:odd:border-l-0
                max-[560px]:pl-[18px]! max-[560px]:pr-0 max-[560px]:border-l-2!"
            >
              <span className="font-display font-extrabold text-[56px] leading-none text-accent mb-3.5 origin-left transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110 max-[560px]:text-[40px]">{i + 1}</span>
              <h3 className="font-display font-semibold text-[17px] leading-tight m-0">{s.title}</h3>
              <p className="m-0 text-muted text-[15.5px] font-medium">{s.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Cta() {
  const C = useLang().t.cta;
  return (
    <section id="buyurtma" className={section}>
      <div className={wrap}>
        <Reveal><div
          onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty("--mx", (e.clientX - r.left) + "px"); e.currentTarget.style.setProperty("--my", (e.clientY - r.top) + "px"); }}
          className="group relative overflow-hidden grid grid-cols-[minmax(0,1.2fr)_minmax(0,.8fr)] gap-[clamp(24px,4vw,48px)] items-center p-[clamp(28px,5vw,64px)] border border-line rounded-[32px] bg-bg2 bg-[radial-gradient(520px_360px_at_85%_50%,#16225F_0%,transparent_70%)] max-[860px]:grid-cols-1">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(360px_circle_at_var(--mx,50%)_var(--my,50%),rgb(60_90_220/.22),transparent_70%)]"></div>
          <div className="relative">
            <span className={kicker}>{C.kicker}</span>
            <h2 className="font-display font-bold text-[clamp(28px,4vw,50px)] leading-[1.06] tracking-[-.03em] my-4 text-balance">{C.title}</h2>
            <p className="m-0 mb-7 max-w-[34em] text-muted font-medium">
              {C.text}
            </p>
            <a className={btnAccent} href={TELEGRAM} target="_blank" rel="noopener noreferrer">{C.telegram}</a>
            <div className="flex flex-wrap gap-2.5 mt-[18px]" aria-label={C.storesAria}>
              {["App Store", "Google Play"].map((n) => (
                <span key={n} className="inline-flex items-center gap-2 px-3.5 py-[11px] rounded-xl border border-line bg-bg/50 text-sm font-semibold text-muted">
                  {n} · <em className="not-italic text-teal">{C.soon}</em>
                </span>
              ))}
            </div>
          </div>

          <div
            aria-hidden="true"
            className="relative justify-self-center w-[min(100%,250px)] aspect-[9/18.5] transition-transform duration-500 group-hover:-rotate-3 group-hover:-translate-y-2 rounded-[38px] p-2.5 bg-[#05081A] border border-[rgb(150_165_255/.22)] shadow-[0_40px_80px_-30px_rgba(0,0,0,.8)] max-[860px]:w-[200px]"
          >
            <div className="h-full rounded-[29px] flex flex-col items-center justify-center gap-3.5 bg-[radial-gradient(circle_at_50%_45%,#1A2A6E_0%,#0A0F2A_62%)]">
              <svg className="w-[46%] h-auto" viewBox="0 0 345 332">
                <path d="M70,0 L310,0 L242,70 L70,70 L70,120 L250,120 L180,192 L70,192 L70,260 L0,332 L0,70 Z" fill="#F3F4F8" />
                <path d="M310,0 L345,0 L277,70 L242,70 Z" fill="#D9A04A" />
              </svg>
              <b className="font-display font-semibold text-xl leading-none tracking-[.32em] -mr-[.32em]">FORMO</b>
              <small className="text-[13px] text-[#C7CCE0] font-semibold">{C.phone}</small>
              <i className="w-[32%] h-[3px] rounded-sm mt-[40%] bg-[linear-gradient(90deg,var(--color-accent)_60%,rgb(150_165_255/.25)_60%)]"></i>
            </div>
          </div>
        </div></Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  const t = useLang().t;
  return (
    <footer className="border-t border-line py-14">
      <div className={`${wrap} flex flex-wrap justify-between items-center gap-x-8 gap-y-6`}>
        <Logo size="xl" label={t.logoTop} />
        <p className="m-0 text-muted text-sm font-semibold">{t.footer}</p>
      </div>
    </footer>
  );
}
