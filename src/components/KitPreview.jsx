const SHIRT = "M112,36 C128,58 172,58 188,36 L252,60 L304,128 L272,160 L252,138 L252,330 Q150,338 48,330 L48,138 L28,160 L-4,128 L48,60 Z";
const SHORTS = "M10,0 L190,0 L205,145 L125,145 L100,55 L75,145 L-5,145 Z";
const FONT = "'Oswald Variable', Impact, sans-serif";

// Futbolka va shortik. `back` — orqa tomon ko'rsatiladimi.
// Old tomondagi F belgisi #fMark symbol'iga tayanadi (u hikoya sahnasida e'lon qilingan).
export default function KitPreview({ label, color, ink, trim, pattern, logo, name, number, shortsNumber, back }) {
  const longName = name.length > 9;
  return (
    <svg className="w-[min(100%,380px)] max-[900px]:w-[min(100%,300px)] max-[480px]:w-[min(100%,250px)] h-auto block" viewBox="0 0 400 480" role="img" aria-label={label}>
      <defs>
        <clipPath id="kitShirtClip"><path d={SHIRT} /></clipPath>
        <clipPath id="kitShortsClip"><path d={SHORTS} /></clipPath>
        <linearGradient id="kitFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={trim} stopOpacity="0" />
          <stop offset="1" stopColor={trim} stopOpacity=".95" />
        </linearGradient>
      </defs>

      <g transform="translate(68,-18) scale(0.88)">
        <path d={SHIRT} fill={color} className="transition-[fill] duration-300" />
        <g clipPath="url(#kitShirtClip)">
          {pattern === "fade" && <rect x="-10" y="210" width="330" height="140" fill="url(#kitFade)" />}
          <g fill={trim} className="transition-[fill] duration-300">
            <rect x="48" y="138" width="18" height="210" />
            <rect x="234" y="138" width="18" height="210" />
            <path d="M-4,128 L28,160 L39,146 L7,114 Z" />
            <path d="M304,128 L272,160 L261,146 L293,114 Z" />
          </g>
          <path d="M112,36 C128,58 172,58 188,36" fill="none" stroke={trim} strokeWidth="16" className="transition-[stroke] duration-300" />
          <path d="M68,138 V348 M232,138 V348" stroke="#F2A33A" strokeWidth="3" />
        </g>
        <path d="M112,36 C128,58 172,58 188,36 C176,62 124,62 112,36 Z" fill="#C9CFE0" stroke="#0A0F26" strokeWidth="3" />
        <path d={SHIRT} fill="none" stroke="#0A0F26" strokeWidth="4" strokeLinejoin="round" />

        <g style={{ opacity: back ? 0 : 1 }} className="transition-opacity duration-300">
          {logo && <use href="#fMark" x="80" y="78" width="38" height="37" color={ink} />}
          <text key={number} className="kit-pop transition-[fill] duration-300" x="200" y="112" textAnchor="middle" fontFamily={FONT} fontWeight="700" fontSize="32" fill={ink}>{number}</text>
        </g>
        <g style={{ opacity: back ? 1 : 0 }} className="transition-opacity duration-300">
          <text
            x="150" y="128" textAnchor="middle" fontFamily={FONT} fontWeight="700" fontSize="30" letterSpacing="3" fill={ink}
            textLength={longName ? 196 : undefined} lengthAdjust={longName ? "spacingAndGlyphs" : undefined}
          >{name}</text>
          <text key={number} className="kit-pop transition-[fill] duration-300" x="150" y="268" textAnchor="middle" fontFamily={FONT} fontWeight="700" fontSize="118" fill={ink}>{number}</text>
        </g>
      </g>

      <g transform="translate(100,312)">
        <path d={SHORTS} fill={color} className="transition-[fill] duration-300" />
        <g clipPath="url(#kitShortsClip)">
          <g fill={trim} className="transition-[fill] duration-300">
            <rect x="-10" y="-4" width="220" height="18" />
            <path d="M10,14 L-5,150 L12,150 L26,14 Z" />
            <path d="M190,14 L205,150 L188,150 L174,14 Z" />
          </g>
          <path d="M-10,16 H210" stroke="#F2A33A" strokeWidth="3" />
        </g>
        {shortsNumber && (
          <text key={number} className="kit-pop transition-[fill] duration-300" x="44" y="122" textAnchor="middle" fontFamily={FONT} fontWeight="700" fontSize="38" fill={ink}>{number}</text>
        )}
        <path d={SHORTS} fill="none" stroke="#0A0F26" strokeWidth="3.5" strokeLinejoin="round" />
      </g>
    </svg>
  );
}
