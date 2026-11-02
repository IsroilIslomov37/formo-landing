import Tilt from "./Tilt.jsx";
import Reveal from "./Reveal.jsx";
import { useLang } from "../i18n.jsx";
import { wrap, kicker, btnAccent, btnQuiet } from "../ui.jsx";

const FONT = "'Oswald Variable', Impact, sans-serif";

// uchta to'liq komplekt (futbolka + shortik): oyim = Manchester United, men = Barcelona, dadam = Real Madrid
const KITS = [
  { cls: "fan-l", place: "translate(92,222) rotate(-13) scale(.54)", shirt: "#D81920", ink: "#FFFFFF", trim: "#16110F", num: "7", numY: 78 },
  { cls: "fan-r", place: "translate(388,222) rotate(13) scale(.54)", shirt: "#F7F7F9", ink: "#1B2A5E", trim: "#E7B73B", num: "9", numY: 78, outline: "#E7B73B" },
  { cls: "fan-c", place: "translate(240,200) scale(.68)", shirt: "#004D98", ink: "#F2C300", trim: "#A50044", num: "10", numY: 84, stripes: true, numSize: 150 },
];

function Kit({ cls, place, shirt, ink, trim, name, num, numY, stripes, outline, numSize = 140 }) {
  return (
    <g className={"fan " + cls}>
      <g className="jersey-hover">
        <g transform={place}>
          {/* yerdagi yumshoq soya */}
          <ellipse cx="0" cy="205" rx="130" ry="16" fill="#000" opacity=".45" filter="url(#jBlur)" />
          <g filter="url(#jDrop)">
            <use href="#jerseyShape" fill={shirt} stroke="#0A0F26" strokeWidth="6" strokeLinejoin="round" />
          </g>
          <g clipPath="url(#jerseyClip)">
            {stripes && [-115, -57, 1, 59].map((x, i) => (
              <rect key={x} x={x} y="-200" width="58" height="400" fill={i % 2 ? "#A50044" : "#004D98"} />
            ))}
            {/* yenglar manjeti */}
            <path d="M-198,-104 L-160,-62 L-133,-92 L-171,-134 Z M198,-104 L160,-62 L133,-92 L171,-134 Z" fill={trim} />
            {/* 3D: yon tomonlar qorayadi, chap-yuqoridan nur tushadi, mato burmalari */}
            <use href="#jerseyShape" fill="url(#jShade)" />
            <use href="#jerseyShape" fill="url(#jLight)" />
            <path d="M-72,-110 Q-40,10 -82,172 M62,-112 Q92,20 66,174 M-8,-30 Q8,70 -6,182" fill="none" stroke="#000" strokeOpacity=".2" strokeWidth="10" strokeLinecap="round" filter="url(#jBlurS)" />
            <path d="M-92,-148 Q-44,-120 -26,-50" fill="none" stroke="#fff" strokeOpacity=".3" strokeWidth="14" strokeLinecap="round" filter="url(#jBlurS)" />
            <path d="M-115,160 Q0,178 115,160" fill="none" stroke="#000" strokeOpacity=".18" strokeWidth="10" filter="url(#jBlurS)" />
          </g>
          {/* V shaklidagi yoqa */}
          <path d="M-45,-191 Q0,-146 45,-191" fill="none" stroke={trim} strokeWidth="16" strokeLinecap="round" />
          <text x="0" y="-52" textAnchor="middle" fontFamily={FONT} fontWeight="700" fontSize="36" letterSpacing="4" fill={ink} stroke="#000" strokeOpacity=".25" strokeWidth="2" paintOrder="stroke">{name}</text>
          <text x="0" y={numY} textAnchor="middle" fontFamily={FONT} fontWeight="700" fontSize={numSize} fill={ink} stroke={outline || "#000"} strokeOpacity={outline ? 1 : .3} strokeWidth={outline ? 3 : 4} paintOrder="stroke">{num}</text>
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
        <Tilt max={16} aria-hidden="true" className={`[&_svg]:cursor-pointer ${ready ? "hero-on" : ""}`}>
          <svg className="w-full h-auto block max-w-[520px] mx-auto overflow-visible max-[900px]:max-w-[400px]" viewBox="0 0 480 420">
            <defs>
              <radialGradient id="heroGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0" stopColor="#2A3C8F" stopOpacity=".8" />
                <stop offset="1" stopColor="#2A3C8F" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="jShade" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#000" stopOpacity=".38" /><stop offset=".28" stopColor="#000" stopOpacity="0" />
                <stop offset=".72" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity=".45" />
              </linearGradient>
              <linearGradient id="jLight" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#fff" stopOpacity=".3" /><stop offset=".45" stopColor="#fff" stopOpacity="0" />
                <stop offset="1" stopColor="#000" stopOpacity=".28" />
              </linearGradient>
              <filter id="jBlur" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="9" /></filter>
              <filter id="jDrop" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="10" dy="16" stdDeviation="12" floodColor="#000" floodOpacity=".5" /></filter>
              <clipPath id="jerseyClip"><use href="#jerseyShape" /></clipPath>
              <filter id="jBlurS" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="4" /></filter>
              <path id="jerseyShape" d="M-45,-191 Q0,-146 45,-191 L110,-171 L185,-91 L145,-51 L115,-79 L115,179 Q0,191 -115,179 L-115,-79 L-145,-51 L-185,-91 L-110,-171 Z" />
            </defs>
            <ellipse cx="240" cy="330" rx="230" ry="90" fill="url(#heroGlow)" />
            {KITS.map((k, i) => <Kit key={k.cls} {...k} name={t.hero.jerseys[i]} />)}
            <path d="M70,70 l3,9 9,3 -9,3 -3,9 -3,-9 -9,-3 9,-3z" fill="#F2A33A" />
            <path d="M420,60 l2.5,7 7,2.5 -7,2.5 -2.5,7 -2.5,-7 -7,-2.5 7,-2.5z" fill="#F3F4F8" />
            <path d="M440,330 l2,6 6,2 -6,2 -2,6 -2,-6 -6,-2 6,-2z" fill="#1FB5A0" />
          </svg>
        </Tilt>
      </div>
    </section>
  );
}
