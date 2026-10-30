import Tilt from "./Tilt.jsx";
import Reveal from "./Reveal.jsx";
import { useLang } from "../i18n.jsx";
import { wrap, kicker, btnAccent, btnQuiet } from "../ui.jsx";

const FONT = "'Oswald Variable', Impact, sans-serif";

// uchta futbolka yelpig'ichdek ochiladi
const JERSEYS = [
  { cls: "fan-l", place: "translate(118,222) rotate(-15) scale(.56)", fill: "#1FB5A0", ink: "#0E1A3F", num: "7", numY: 90, sw: 7 },
  { cls: "fan-r", place: "translate(362,222) rotate(15) scale(.56)", fill: "#C9383F", ink: "#F6F7FB", num: "1", numY: 90, sw: 7, sleeves: true },
  { cls: "fan-c", place: "translate(240,200) scale(.68)", fill: "#2A45B8", ink: "#F2A33A", num: "10", numY: 95, sw: 6, stripes: true, numSize: 160 },
];

function Jersey({ cls, place, fill, ink, name, num, numY, sw, sleeves, stripes, numSize = 150 }) {
  return (
    <g className={"fan " + cls}>
      <g className="jersey-hover">
        <g transform={place}>
          <use href="#jerseyShape" fill={fill} stroke="#0A0F26" strokeWidth={sw} strokeLinejoin="round" />
          <path d="M-45,-191 Q0,-146 45,-191" fill="none" stroke={ink} strokeWidth="14" />
          {sleeves && <path d="M145,-51 L185,-91 M-145,-51 L-185,-91" stroke={ink} strokeWidth="14" />}
          {stripes && <path d="M-115,-79 V179 M115,-79 V179" stroke={ink} strokeWidth="8" opacity=".85" />}
          <text x="0" y="-70" textAnchor="middle" fontFamily={FONT} fontWeight="700" fontSize="40" letterSpacing="4" fill={ink}>{name}</text>
          <text x="0" y={numY} textAnchor="middle" fontFamily={FONT} fontWeight="700" fontSize={numSize} fill={ink}>{num}</text>
        </g>
      </g>
    </g>
  );
}

// sarlavha qatorlari pastdan "maska" ichida ko'tariladi
function Line({ children, ready, delay }) {
  return (
    <span className="block overflow-hidden pb-[.08em] -mb-[.08em]">
      <span
        className={`block transition-transform duration-[900ms] ease-[cubic-bezier(.2,.9,.2,1)] ${ready ? "translate-y-0" : "translate-y-[110%]"}`}
        style={{ transitionDelay: ready ? `${delay}ms` : undefined }}
      >{children}</span>
    </span>
  );
}

export default function Hero({ ready }) {
  const { t } = useLang();
  const h = t.hero;
  return (
    <section className="pt-[clamp(44px,7vw,100px)] pb-[clamp(24px,4vw,56px)]">
      <div className={`${wrap} grid grid-cols-[minmax(0,1.15fr)_minmax(0,.95fr)] gap-10 items-center max-[900px]:grid-cols-1`}>
        <div>
          <Reveal when={ready} delay={100}>
            <span className={kicker}>{h.kicker}</span>
          </Reveal>
          <h1 className="font-display font-extrabold text-[clamp(32px,8.6vw,56px)] min-[901px]:text-[clamp(44px,6vw,82px)] leading-[1.02] tracking-[-.03em] mt-[22px] mb-6 text-balance">
            {h.lines.map((line, i) => (
              <Line key={line} ready={ready} delay={200 + i * 120}>
                {i === h.accent ? <em className="not-italic text-accent">{line}</em> : line}{" "}
              </Line>
            ))}
          </h1>
          <Reveal when={ready} delay={600}>
            <p className="text-[clamp(16.5px,1.5vw,19px)] font-medium text-muted max-w-[34em] m-0">{h.lead}</p>
          </Reveal>
          <Reveal when={ready} delay={720} className="flex flex-wrap gap-3 mt-8">
            <a className={`${btnAccent} group`} href="#buyurtma">
              {h.cta}
              <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </a>
            <a className={btnQuiet} href="#jarayon">{h.see}</a>
          </Reveal>
          <Reveal when={ready} delay={860}>
            <p className="inline-flex items-center gap-3 mt-[34px] text-sm font-semibold text-muted">
              <svg className="w-4 h-[30px] flex-none animate-bob motion-reduce:animate-none" viewBox="0 0 16 30" aria-hidden="true">
                <path d="M8 2v22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M2 19l6 7 6-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {h.cue}
            </p>
          </Reveal>
        </div>

        {/* intro tugamaguncha futbolkalar ochilmay turadi */}
        <Tilt max={10} aria-hidden="true" className={`[&_svg]:cursor-pointer ${ready ? "hero-on" : ""}`}>
          <svg className="w-full h-auto block max-w-[520px] mx-auto overflow-visible max-[900px]:max-w-[400px]" viewBox="0 0 480 420">
            <defs>
              <radialGradient id="heroGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0" stopColor="#2A3C8F" stopOpacity=".8" />
                <stop offset="1" stopColor="#2A3C8F" stopOpacity="0" />
              </radialGradient>
              <path id="jerseyShape" d="M-45,-191 Q0,-146 45,-191 L110,-171 L185,-91 L145,-51 L115,-79 L115,179 Q0,191 -115,179 L-115,-79 L-145,-51 L-185,-91 L-110,-171 Z" />
            </defs>
            <ellipse cx="240" cy="330" rx="230" ry="90" fill="url(#heroGlow)" />
            {JERSEYS.map((j, i) => <Jersey key={j.cls} {...j} name={t.hero.jerseys[i]} />)}
            <path d="M70,70 l3,9 9,3 -9,3 -3,9 -3,-9 -9,-3 9,-3z" fill="#F2A33A" />
            <path d="M420,60 l2.5,7 7,2.5 -7,2.5 -2.5,7 -2.5,-7 -7,-2.5 7,-2.5z" fill="#F3F4F8" />
            <path d="M440,330 l2,6 6,2 -6,2 -2,6 -2,-6 -6,-2 6,-2z" fill="#1FB5A0" />
          </svg>
        </Tilt>
      </div>
    </section>
  );
}
