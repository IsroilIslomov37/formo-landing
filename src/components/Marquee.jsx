import { useLang } from "../i18n.jsx";

function Row({ hidden, words }) {
  return (
    <ul className="flex flex-none items-center gap-10 pr-10 m-0 p-0 list-none" aria-hidden={hidden || undefined}>
      {words.map((w, i) => (
        <li key={w} className="flex items-center gap-10">
          <span className={`font-kit font-bold uppercase text-[clamp(36px,6vw,72px)] leading-none tracking-[.02em] whitespace-nowrap
            ${i % 2 ? "text-accent" : "text-transparent [-webkit-text-stroke:1.5px_var(--color-ink)]"}`}>{w}</span>
          <svg className="size-5 flex-none text-accent" viewBox="-11 -11 22 22" aria-hidden="true">
            <path d="M0,-10 L2.5,-2.5 L10,0 L2.5,2.5 L0,10 L-2.5,2.5 L-10,0 L-2.5,-2.5 Z" fill="currentColor" />
          </svg>
        </li>
      ))}
    </ul>
  );
}

export default function Marquee() {
  const words = useLang().t.marquee;
  return (
    <div className="group overflow-hidden border-y border-line py-6 my-6 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
      <div className="flex w-max will-change-transform animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none">
        <Row words={words} />
        <Row hidden words={words} />
      </div>
    </div>
  );
}
