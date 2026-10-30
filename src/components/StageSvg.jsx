import { memo } from "react";
import { useLang } from "../i18n.jsx";

// ruler labels along the cutting mat edges
const RULER_X = [1, 2, 3, 4, 5, 6, 7];
const RULER_Y = [1, 2, 3, 4, 5, 6];
const DASH_XS = Array.from({ length: 24 }, (_, i) => -160 + i * 70);

// x, width, height of each building
const BUILDINGS = [[24, 92, 170], [124, 72, 232], [204, 112, 140], [330, 64, 190], [478, 88, 206], [574, 110, 150], [692, 86, 220]];

function City() {
  return BUILDINGS.map(([x, w, h], i) => {
    const cols = Math.floor((w - 16) / 22);
    const rows = Math.floor((h - 34) / 30);
    const windows = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const lit = (r * 3 + c * 7 + i) % 4 === 0;
        windows.push(
          <rect key={r + "-" + c} x={x + 12 + c * 22} y={505 - h + 16 + r * 30} width={12} height={16} rx={2}
            fill={lit ? "#FFD38A" : "#F6F7FB"} opacity={lit ? 1 : 0.08} />
        );
      }
    }
    return (
      <g key={x}>
        <rect x={x} y={505 - h} width={w} height={h} rx={4} fill={i % 2 ? "#24306A" : "#1A2550"} className="o" />
        {windows}
      </g>
    );
  });
}

// The scene itself is static markup; every id below is picked up by useStoryTimeline.
function StageSvg() {
  const S = useLang().t.stage;
  return (
    <svg id="stage" viewBox="0 0 800 700" role="img" aria-label={S.aria}>
            <defs>
              <radialGradient id="matGlow" cx="50%" cy="46%" r="62%"><stop offset="0" stopColor="#16245E"/><stop offset="1" stopColor="#0B1230"/></radialGradient>
              <pattern id="gMinor" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="rgba(150,170,255,.05)" strokeWidth="1"/></pattern>
              <pattern id="gMajor" width="100" height="100" patternUnits="userSpaceOnUse"><rect width="100" height="100" fill="url(#gMinor)"/><path d="M100 0H0V100" fill="none" stroke="rgba(150,170,255,.11)" strokeWidth="1.5"/></pattern>
              <pattern id="pAtlas" width="26" height="26" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><rect width="26" height="26" fill="#C9383F"/><rect width="9" height="26" fill="#D84A50"/></pattern>
              <pattern id="pSetka" width="14" height="14" patternUnits="userSpaceOnUse"><rect width="14" height="14" fill="#1FB5A0"/><circle cx="7" cy="7" r="3.2" fill="#15907F"/></pattern>
              <pattern id="pPaxta" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(-30)"><rect width="12" height="12" fill="#2A45B8"/><path d="M0 6H12" stroke="#3555CC" strokeWidth="3"/></pattern>
              <pattern id="pPoly" width="32" height="18" patternUnits="userSpaceOnUse"><rect width="32" height="18" fill="#F2A33A"/><path d="M0 12 L8 5 L16 12 L24 5 L32 12" fill="none" stroke="#D88B25" strokeWidth="3"/></pattern>
              <pattern id="pKnit" width="12" height="12" patternUnits="userSpaceOnUse"><rect width="12" height="12" fill="#FFFFFF"/><path d="M2 3 L6 8 L10 3" fill="none" stroke="#E8EBF3" strokeWidth="1.6"/></pattern>
              <radialGradient id="spot" cx="50%" cy="45%" r="58%"><stop offset="0" stopColor="#1D2C6E"/><stop offset="1" stopColor="#0A0F26"/></radialGradient>
              <clipPath id="shirtClip"><path d="M355,150 Q400,195 445,150 L510,170 L585,250 L545,290 L515,262 L515,520 Q400,532 285,520 L285,262 L255,290 L215,250 L290,170 Z"/></clipPath>
              <clipPath id="clipChemp"><rect id="revChemp" x="308" y="262" width="0" height="48"/></clipPath>
              <clipPath id="clip17"><rect id="rev17" x="328" y="340" width="0" height="114"/></clipPath>
              <clipPath id="shortsClip"><path d="M-100,-80 L100,-80 L114,62 Q64,74 12,70 L0,0 L-12,70 Q-64,74 -114,62 Z"/></clipPath>
              <clipPath id="shortsWave"><circle id="waveCircle" cx="-150" cy="0" r="0"/></clipPath>
              <clipPath id="capClip"><rect id="capRev" x="280" y="538" width="0" height="46"/></clipPath>
              <mask id="guideMask" maskUnits="userSpaceOnUse" x="0" y="0" width="800" height="700">
                <path id="guideMaskPath" d="M355,150 Q400,195 445,150 L510,170 L585,250 L545,290 L515,262 L515,520 Q400,532 285,520 L285,262 L255,290 L215,250 L290,170 Z" fill="none" stroke="#fff" strokeWidth="14"/>
              </mask>
              <symbol id="fMark" viewBox="0 0 345 332">
                <path d="M70,0 L310,0 L242,70 L70,70 L70,120 L250,120 L180,192 L70,192 L70,260 L0,332 L0,70 Z" style={{ fill: "currentColor" }}/>
                <path d="M310,0 L345,0 L277,70 L242,70 Z" style={{ fill: "var(--sliver,#D9A04A)" }}/>
              </symbol>
              <symbol id="heart" viewBox="-12 -11 24 22"><path d="M0,9 C-10,2 -12,-3 -10,-7 C-8,-11 -2,-11 0,-6 C2,-11 8,-11 10,-7 C12,-3 10,2 0,9 Z"/></symbol>
              <symbol id="spark" viewBox="-11 -11 22 22"><path d="M0,-10 L2.5,-2.5 L10,0 L2.5,2.5 L0,10 L-2.5,2.5 L-10,0 L-2.5,-2.5 Z"/></symbol>
            </defs>
            <rect width="800" height="700" fill="url(#matGlow)"/>
            <rect width="800" height="700" fill="url(#gMajor)"/>
            <path d="M0,700 L700,0" stroke="rgba(242,163,58,.28)" strokeWidth="1.5" strokeDasharray="8 8"/>
            <g id="ruler" className="svg-b" fontSize="11" fill="rgba(200,210,255,.35)">
              {RULER_X.map((n) => <text key={"x" + n} x={n * 100 + 4} y={16}>{n * 5}</text>)}
              {RULER_Y.map((n) => <text key={"y" + n} x={4} y={n * 100 - 4}>{n * 5}</text>)}
            </g>
            <g id="city" opacity="0"><City /></g>
            <g id="road" opacity="0">
              <rect x="-40" y="505" width="880" height="48" fill="#10183A"/>
              <path d="M-40,505 H840" stroke="rgba(150,165,255,.25)" strokeWidth="2"/>
              <g id="dashes">
                {DASH_XS.map((x) => <rect key={x} x={x} y={526} width={36} height={5} rx={2.5} fill="#F6F7FB" opacity={0.7} />)}
              </g>
            </g>
            <g id="house" opacity="0">
              <rect x="690" y="330" width="18" height="40" fill="#D88B25" className="o"/>
              <path d="M560,382 L650,318 L740,382 Z" fill="#F2A33A" className="o"/>
              <rect x="575" y="380" width="150" height="125" fill="#F6F7FB" className="o"/>
              <rect x="590" y="402" width="30" height="28" rx="3" fill="#FFD38A" className="o" strokeWidth="3"/>
              <rect x="682" y="402" width="30" height="28" rx="3" fill="#FFD38A" className="o" strokeWidth="3"/>
              <rect x="630" y="432" width="40" height="73" rx="4" fill="#16245E" className="o"/>
              <circle cx="662" cy="470" r="3.5" fill="#F2A33A"/>
            </g>
            <g id="phoneBack" opacity="0">
              <rect x="269" y="64" width="262" height="572" rx="28" fill="#0A0F26"/>
              <rect x="269" y="132" width="262" height="392" fill="url(#spot)"/>
            </g>
            <g id="fabrics">
              <g className="swatch">
                <path d="M180,120 Q300,104 400,118 T620,116 L628,350 Q636,470 622,574 Q500,590 400,576 T176,580 Q166,470 172,350 Z" fill="url(#pAtlas)" className="o"/>
                <path d="M232,160 Q262,340 238,540" stroke="rgba(255,255,255,.18)" strokeWidth="12" fill="none" strokeLinecap="round"/>
                <path d="M566,150 Q594,330 576,546" stroke="rgba(0,0,0,.12)" strokeWidth="16" fill="none" strokeLinecap="round"/>
                <g className="tag"><g transform="translate(546,84) rotate(8)"><path d="M6,0 Q-24,6 -30,34" fill="none" stroke="#F6F7FB" strokeWidth="2"/><rect x="-8" y="-22" width="172" height="44" rx="12" fill="#F6F7FB" className="o" strokeWidth="3"/><circle cx="6" cy="0" r="5" fill="#0B1230"/><text x="22" y="6" className="svg-h" fontSize="15" fill="#0E1A3F">{S.fabrics[0]}</text></g></g>
              </g>
              <g className="swatch" opacity="0">
                <path d="M180,120 Q300,104 400,118 T620,116 L628,350 Q636,470 622,574 Q500,590 400,576 T176,580 Q166,470 172,350 Z" fill="url(#pSetka)" className="o"/>
                <path d="M232,160 Q262,340 238,540" stroke="rgba(255,255,255,.16)" strokeWidth="12" fill="none" strokeLinecap="round"/>
                <path d="M566,150 Q594,330 576,546" stroke="rgba(0,0,0,.12)" strokeWidth="16" fill="none" strokeLinecap="round"/>
                <g className="tag"><g transform="translate(546,84) rotate(8)"><path d="M6,0 Q-24,6 -30,34" fill="none" stroke="#F6F7FB" strokeWidth="2"/><rect x="-8" y="-22" width="172" height="44" rx="12" fill="#F6F7FB" className="o" strokeWidth="3"/><circle cx="6" cy="0" r="5" fill="#0B1230"/><text x="22" y="6" className="svg-h" fontSize="15" fill="#0E1A3F">{S.fabrics[1]}</text></g></g>
              </g>
              <g className="swatch" opacity="0">
                <path d="M180,120 Q300,104 400,118 T620,116 L628,350 Q636,470 622,574 Q500,590 400,576 T176,580 Q166,470 172,350 Z" fill="url(#pPaxta)" className="o"/>
                <path d="M232,160 Q262,340 238,540" stroke="rgba(255,255,255,.14)" strokeWidth="12" fill="none" strokeLinecap="round"/>
                <path d="M566,150 Q594,330 576,546" stroke="rgba(0,0,0,.16)" strokeWidth="16" fill="none" strokeLinecap="round"/>
                <g className="tag"><g transform="translate(546,84) rotate(8)"><path d="M6,0 Q-24,6 -30,34" fill="none" stroke="#F6F7FB" strokeWidth="2"/><rect x="-8" y="-22" width="172" height="44" rx="12" fill="#F6F7FB" className="o" strokeWidth="3"/><circle cx="6" cy="0" r="5" fill="#0B1230"/><text x="22" y="6" className="svg-h" fontSize="15" fill="#0E1A3F">{S.fabrics[2]}</text></g></g>
              </g>
              <g className="swatch" opacity="0">
                <path d="M180,120 Q300,104 400,118 T620,116 L628,350 Q636,470 622,574 Q500,590 400,576 T176,580 Q166,470 172,350 Z" fill="url(#pPoly)" className="o"/>
                <path d="M232,160 Q262,340 238,540" stroke="rgba(255,255,255,.22)" strokeWidth="12" fill="none" strokeLinecap="round"/>
                <path d="M566,150 Q594,330 576,546" stroke="rgba(0,0,0,.1)" strokeWidth="16" fill="none" strokeLinecap="round"/>
                <g className="tag"><g transform="translate(546,84) rotate(8)"><path d="M6,0 Q-24,6 -30,34" fill="none" stroke="#F6F7FB" strokeWidth="2"/><rect x="-8" y="-22" width="172" height="44" rx="12" fill="#F6F7FB" className="o" strokeWidth="3"/><circle cx="6" cy="0" r="5" fill="#0B1230"/><text x="22" y="6" className="svg-h" fontSize="15" fill="#0E1A3F">{S.fabrics[3]}</text></g></g>
              </g>
              <g className="swatch" opacity="0">
                <path d="M180,120 Q300,104 400,118 T620,116 L628,350 Q636,470 622,574 Q500,590 400,576 T176,580 Q166,470 172,350 Z" fill="url(#pKnit)" className="o"/>
                <g className="tag" id="tagKnit"><g transform="translate(546,84) rotate(8)"><path d="M6,0 Q-24,6 -30,34" fill="none" stroke="#F6F7FB" strokeWidth="2"/><rect x="-8" y="-22" width="172" height="44" rx="12" fill="#F2A33A" className="o" strokeWidth="3"/><circle cx="6" cy="0" r="5" fill="#0B1230"/><text x="22" y="6" className="svg-h" fontSize="15" fill="#0E1A3F">{S.fabrics[4]}</text></g></g>
              </g>
            </g>
            <g id="stamp" opacity="0">
              <g transform="translate(400,350) rotate(-10)">
                <rect x="-150" y="-40" width="300" height="80" rx="18" fill="rgba(242,163,58,.08)" stroke="#E0901F" strokeWidth="5"/>
                <text x="0" y="12" textAnchor="middle" className="svg-h" fontSize="32" fill="#E0901F" letterSpacing="2">{S.chosen}</text>
              </g>
            </g>
            <g id="pack">
              <g id="boxBack" opacity="0">
                <path className="flap o" d="M255,395 L230,440 L180,398 L212,352 Z" fill="#D88B25"/>
                <path className="flap o" d="M545,395 L570,440 L620,398 L588,352 Z" fill="#D88B25"/>
                <path className="flap o" d="M262,395 L538,395 L522,340 L278,340 Z" fill="#C47C1E"/>
                <path d="M255,395 L545,395 L570,440 L230,440 Z" fill="#3A2208" className="o"/>
              </g>
              <g id="shirt" opacity="0">
                <path d="M355,150 Q400,195 445,150 L510,170 L585,250 L545,290 L515,262 L515,520 Q400,532 285,520 L285,262 L255,290 L215,250 L290,170 Z" fill="url(#pKnit)"/>
                <g id="shirtTrims" opacity="0" clipPath="url(#shirtClip)">
                  <g fill="#0E1A3F">
                    <path d="M285,262 H305 V540 H285 Z"/>
                    <path d="M495,262 H515 V540 H495 Z"/>
                    <path d="M600,265 L560,305 L532.7,276.9 L572.7,236.9 Z"/>
                    <path d="M200,265 L240,305 L267.3,276.9 L227.3,236.9 Z"/>
                  </g>
                  <path d="M355,150 Q400,195 445,150" fill="none" stroke="#0E1A3F" strokeWidth="18"/>
                  <g stroke="#F2A33A" strokeWidth="3.5" fill="none">
                    <path d="M307,262 V540 M493,262 V540"/>
                    <path d="M352,152 Q400,203 448,152"/>
                  </g>
                </g>
                <g id="shirtOutline" opacity="0">
                  <path d="M355,150 Q400,195 445,150 Q400,162 355,150 Z" fill="#C9CFE0" className="o"/>
                  <path d="M355,150 Q400,195 445,150 L510,170 L585,250 L545,290 L515,262 L515,520 Q400,532 285,520 L285,262 L255,290 L215,250 L290,170 Z" fill="none" className="o"/>
                  <g fill="none" stroke="rgba(14,26,63,.28)" strokeWidth="2" strokeDasharray="5 5">
                    <path d="M292,172 Q300,220 285,262"/>
                    <path d="M508,172 Q500,220 515,262"/>
                    <path d="M292,507 Q400,518 508,507"/>
                  </g>
                </g>
                <g id="chemp" clipPath="url(#clipChemp)"><text x="400" y="302" textAnchor="middle" textLength="172" lengthAdjust="spacingAndGlyphs" className="kit-type" fontSize="36">{S.champion}</text></g>
                <g id="num" clipPath="url(#clip17)"><text x="400" y="446" textAnchor="middle" textLength="112" lengthAdjust="spacingAndGlyphs" className="kit-type" fontSize="124" style={{ strokeWidth: "1.8", strokeDasharray: "5 4" }}>17</text></g>
                <g id="logoShirt"><use href="#fMark" x="441" y="203" width="34" height="33" color="#0E1A3F"/></g>
              </g>
              <g id="shorts" opacity="0">
                <g transform="translate(590,330)">
                  <g id="shortsPlain">
                    <path d="M-100,-80 L100,-80 L114,62 Q64,74 12,70 L0,0 L-12,70 Q-64,74 -114,62 Z" fill="#5B6178" className="o"/>
                    <path d="M-100,-62 H100" stroke="#0A0F26" strokeWidth="3"/>
                    <path d="M0,-62 V-4" stroke="#0A0F26" strokeWidth="3"/>
                    <path d="M-8,-62 q-6,16 -2,24 M8,-62 q6,16 2,24" stroke="#F6F7FB" strokeWidth="3" fill="none" strokeLinecap="round"/>
                  </g>
                  <g id="shortsStyled" clipPath="url(#shortsWave)">
                    <path d="M-100,-80 L100,-80 L114,62 Q64,74 12,70 L0,0 L-12,70 Q-64,74 -114,62 Z" fill="url(#pKnit)"/>
                    <g clipPath="url(#shortsClip)">
                      <g fill="#0E1A3F">
                        <rect x="-120" y="-84" width="240" height="22"/>
                        <path d="M86,-62 L106,-62 L122,80 L100,80 Z"/>
                        <path d="M-86,-62 L-106,-62 L-122,80 L-100,80 Z"/>
                      </g>
                      <path d="M-120,-60 H120 M84,-62 L99,80 M-84,-62 L-99,80" stroke="#F2A33A" strokeWidth="3.5" fill="none"/>
                    </g>
                    <use href="#fMark" x="46" y="-48" width="25" height="24" color="#0E1A3F"/>
                    <text x="-56" y="46" textAnchor="middle" textLength="40" lengthAdjust="spacingAndGlyphs" className="kit-type" fontSize="44">17</text>
                    <path d="M-100,-80 L100,-80 L114,62 Q64,74 12,70 L0,0 L-12,70 Q-64,74 -114,62 Z" fill="none" className="o"/>
                    <path d="M-100,-62 H100" stroke="#0A0F26" strokeWidth="3"/>
                    <path d="M0,-58 V-4" stroke="#0A0F26" strokeWidth="3"/>
                  </g>
                  <g clipPath="url(#shortsClip)"><circle id="waveRing" cx="-150" cy="0" r="0" fill="none" stroke="#F2A33A" strokeWidth="7"/></g>
                </g>
              </g>
              <g id="boxFront" opacity="0">
                <rect x="230" y="440" width="340" height="160" rx="10" fill="#F2A33A" className="o"/>
                <rect x="246" y="454" width="308" height="132" rx="7" fill="none" stroke="rgba(14,26,63,.35)" strokeWidth="2" strokeDasharray="7 6"/>
                <use href="#fMark" x="382" y="466" width="36" height="35" color="#0E1A3F" style={{ "--sliver": "#F6F7FB" }}/>
                <text x="406" y="540" textAnchor="middle" className="svg-h" fontSize="24" letterSpacing="10" fill="#0E1A3F">FORMO</text>
                <text x="400" y="566" textAnchor="middle" className="svg-b" fontSize="12" fontWeight="700" letterSpacing="3" fill="rgba(14,26,63,.7)">{S.tagline}</text>
              </g>
              <g id="lid" opacity="0">
                <rect x="218" y="398" width="364" height="48" rx="10" fill="#E39530" className="o"/>
                <g id="sticker">
                  <circle cx="400" cy="422" r="27" fill="#0E1A3F" stroke="#0A0F26" strokeWidth="3"/>
                  <use href="#fMark" x="387" y="409" width="27" height="26" color="#F6F7FB"/>
                </g>
              </g>
            </g>
            <path id="guide" d="M355,150 Q400,195 445,150 L510,170 L585,250 L545,290 L515,262 L515,520 Q400,532 285,520 L285,262 L255,290 L215,250 L290,170 Z" fill="none" stroke="#F2A33A" strokeWidth="4" strokeDasharray="12 9" mask="url(#guideMask)" opacity="0"/>
            <path id="cutLine" d="M355,150 Q400,195 445,150 L510,170 L585,250 L545,290 L515,262 L515,520 Q400,532 285,520 L285,262 L255,290 L215,250 L290,170 Z" fill="none" stroke="#0A0F26" strokeWidth="4" strokeLinejoin="round"/>
            <g id="van">
              <g transform="translate(275,372)">
                <g id="speed" opacity="0" stroke="#F6F7FB" strokeWidth="5" strokeLinecap="round"><path d="M-20,30 H-80"/><path d="M-30,60 H-110"/><path d="M-20,90 H-70"/></g>
                <rect x="0" y="0" width="172" height="112" rx="14" fill="#F6F7FB" className="o"/>
                <rect x="2" y="68" width="168" height="14" fill="#0E1A3F"/>
                <rect x="2" y="84" width="168" height="4" fill="#F2A33A"/>
                <use href="#fMark" x="20" y="20" width="30" height="29" color="#0E1A3F"/>
                <text x="105" y="42" textAnchor="middle" className="svg-h" fontSize="15" letterSpacing="4" fill="#0E1A3F">FORMO</text>
                <path d="M172,30 H214 Q238,32 248,70 L252,112 H172 Z" fill="#F6F7FB" className="o"/>
                <path d="M184,40 H212 Q228,44 236,72 H184 Z" fill="#9DB4E8" className="o" strokeWidth="3"/>
                <rect x="242" y="86" width="12" height="11" rx="3" fill="#FFD38A" className="o" strokeWidth="2.5"/>
                <g className="wheel"><circle cx="46" cy="114" r="24" fill="#0A0F26" stroke="#24306A" strokeWidth="2"/><path d="M46,94 V104 M46,124 V134 M26,114 H36 M56,114 H66" stroke="#F2A33A" strokeWidth="3.5" strokeLinecap="round"/><circle cx="46" cy="114" r="8" fill="#C9CFE0"/></g>
                <g className="wheel"><circle cx="208" cy="114" r="24" fill="#0A0F26" stroke="#24306A" strokeWidth="2"/><path d="M208,94 V104 M208,124 V134 M188,114 H198 M218,114 H228" stroke="#F2A33A" strokeWidth="3.5" strokeLinecap="round"/><circle cx="208" cy="114" r="8" fill="#C9CFE0"/></g>
              </g>
            </g>
            <g id="badge" opacity="0">
              <rect x="490" y="368" width="170" height="46" rx="16" fill="#1FB5A0" className="o" strokeWidth="3"/>
              <text x="575" y="397" textAnchor="middle" className="svg-h" fontSize="15" fill="#06231F">{S.delivered}</text>
            </g>
            <g id="camUI" opacity="0">
              <rect x="269" y="64" width="262" height="64" fill="#05081A"/>
              <text x="400" y="114" textAnchor="middle" className="svg-h" fontSize="12" fill="#F2A33A" letterSpacing="4">{S.photo}</text>
              <path d="M292,172 V152 H312 M488,152 H508 V172 M508,488 V508 H488 M312,508 H292 V488" fill="none" stroke="#F6F7FB" strokeWidth="3" strokeLinecap="round"/>
              <rect x="269" y="524" width="262" height="112" fill="#05081A"/>
              <rect x="300" y="568" width="30" height="30" rx="8" fill="#1B2455"/>
              <circle cx="400" cy="583" r="26" fill="#F6F7FB" stroke="#3A4580" strokeWidth="6"/>
              <circle cx="485" cy="583" r="15" fill="#1B2455"/>
            </g>
            <g id="postUI" opacity="0">
              <rect x="269" y="64" width="262" height="68" fill="#0A0F26"/>
              <circle cx="300" cy="102" r="17" fill="#F2A33A"/>
              <text x="300" y="107" textAnchor="middle" className="svg-h" fontSize="12" fill="#0E1A3F">17</text>
              <text x="326" y="100" className="svg-b" fontSize="15" fontWeight="800" fill="#F3F4F8">sardor_17</text>
              <text x="326" y="118" className="svg-b" fontSize="12" fill="#8D95B5">{S.justNow}</text>
              <g fill="#F3F4F8"><circle cx="496" cy="102" r="2.5"/><circle cx="505" cy="102" r="2.5"/><circle cx="514" cy="102" r="2.5"/></g>
              <rect x="269" y="524" width="262" height="112" fill="#0A0F26"/>
              <g id="composer">
                <g clipPath="url(#capClip)">
                  <text x="284" y="556" className="svg-b" fontSize="15" fontWeight="800" fill="#F3F4F8">Yangi formam keldi! 🔥</text>
                  <text x="284" y="576" className="svg-b" fontSize="14" fontWeight="700" fill="#F2A33A">#formo #chempion17</text>
                </g>
                <g id="shareBtn">
                  <rect x="290" y="590" width="220" height="36" rx="12" fill="rgba(242,163,58,.14)" stroke="#F2A33A" strokeWidth="2"/>
                  <text x="400" y="613" textAnchor="middle" className="svg-h" fontSize="14" fill="#F2A33A">{S.share}</text>
                </g>
              </g>
              <g id="published" opacity="0">
                <use href="#heart" x="278" y="534" width="26" height="24" fill="none" stroke="#F3F4F8" strokeWidth="2.2"/>
                <g id="heartFull" opacity="0"><use href="#heart" x="278" y="534" width="26" height="24" fill="#F0544F" stroke="#F0544F" strokeWidth="2"/></g>
                <path d="M318,537 h20 a4,4 0 0 1 4,4 v10 a4,4 0 0 1 -4,4 h-12 l-6,5 v-5 h-2 a4,4 0 0 1 -4,-4 v-10 a4,4 0 0 1 4,-4 z" fill="none" stroke="#F3F4F8" strokeWidth="2.2" strokeLinejoin="round"/>
                <path d="M354,538 L378,546 L354,556 L358,546 Z" fill="none" stroke="#F3F4F8" strokeWidth="2.2" strokeLinejoin="round"/>
                <text id="likes" x="282" y="582" className="svg-b" fontSize="14" fontWeight="800" fill="#F3F4F8">{"0 " + S.likes}</text>
                <text x="282" y="602" className="svg-b" fontSize="13" fill="#F3F4F8"><tspan fontWeight="800">sardor_17</tspan> {S.caption}</text>
                <text x="282" y="620" className="svg-b" fontSize="13" fontWeight="700" fill="#F2A33A">#formo #chempion17</text>
              </g>
            </g>
            <rect id="flash" x="269" y="64" width="262" height="572" rx="28" fill="#FFFFFF" opacity="0"/>
            <g id="phoneFront" opacity="0">
              <rect x="262" y="57" width="276" height="586" rx="35" fill="none" stroke="#05081A" strokeWidth="14"/>
              <rect x="255" y="50" width="290" height="600" rx="42" fill="none" stroke="rgba(150,165,255,.3)" strokeWidth="2"/>
              <rect x="365" y="72" width="70" height="18" rx="9" fill="#05081A"/>
              <rect x="545" y="170" width="5" height="56" rx="2" fill="#24306A"/>
            </g>
            <g id="hearts"></g>
            <g id="bub1" className="bub" opacity="0">
              <rect x="20" y="160" width="232" height="48" rx="16" fill="#1B2455" stroke="rgba(150,165,255,.25)" strokeWidth="1.5"/>
              <circle cx="46" cy="184" r="14" fill="#1FB5A0"/>
              <text x="68" y="190" className="svg-b" fontSize="15" fontWeight="700" fill="#F3F4F8">{S.bub1}</text>
            </g>
            <g id="bub2" className="bub" opacity="0">
              <rect x="548" y="300" width="234" height="48" rx="16" fill="#1B2455" stroke="rgba(150,165,255,.25)" strokeWidth="1.5"/>
              <circle cx="574" cy="324" r="14" fill="#C9383F"/>
              <text x="596" y="330" className="svg-b" fontSize="15" fontWeight="700" fill="#F3F4F8">{S.bub2}</text>
            </g>
            <g id="bub3" className="bub" opacity="0">
              <rect x="20" y="430" width="232" height="48" rx="16" fill="#1B2455" stroke="rgba(242,163,58,.5)" strokeWidth="1.5"/>
              <circle cx="46" cy="454" r="14" fill="#F2A33A"/>
              <text x="68" y="460" className="svg-b" fontSize="15" fontWeight="700" fill="#F3F4F8">{S.bub3}</text>
            </g>
            <g id="hand" opacity="0">
              <g id="handBob">
                <path d="M31,-42 C62,-30 76,22 128,6" fill="none" stroke="#F2A33A" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M0,0 L34,-46" stroke="#0A0F26" strokeWidth="7" strokeLinecap="round"/>
                <path d="M0,0 L34,-46" stroke="#D6DAE6" strokeWidth="3.5" strokeLinecap="round"/>
                <polygon points="112.3,-63.9 225.4,-177 183,-219.4 69.9,-106.3" fill="#24306A" className="o"/>
                <polygon points="109.5,-66.7 95.3,-52.5 58.5,-89.3 72.7,-103.5" fill="#F2A33A" className="o"/>
                <path d="M58,-38 L22,-27" stroke="#0A0F26" strokeWidth="22" strokeLinecap="round"/>
                <path d="M38,-62 L19,-36" stroke="#0A0F26" strokeWidth="20" strokeLinecap="round"/>
                <ellipse cx="58" cy="-56" rx="30" ry="25" transform="rotate(-45 58 -56)" fill="#E8B48F" className="o"/>
                <path d="M58,-38 L22,-27" stroke="#E8B48F" strokeWidth="15" strokeLinecap="round"/>
                <path d="M38,-62 L19,-36" stroke="#E8B48F" strokeWidth="13" strokeLinecap="round"/>
              </g>
            </g>
            <g id="scissors" opacity="0">
              <g id="bladeB">
                <path d="M-48,0 L-72,-14" stroke="#0A0F26" strokeWidth="11" strokeLinecap="round"/>
                <path d="M-48,0 L-72,-14" stroke="#F2A33A" strokeWidth="5.5" strokeLinecap="round"/>
                <ellipse cx="-86" cy="-20" rx="15" ry="10" fill="none" stroke="#0A0F26" strokeWidth="11"/>
                <ellipse cx="-86" cy="-20" rx="15" ry="10" fill="none" stroke="#F2A33A" strokeWidth="5.5"/>
                <path d="M2,0 L-48,9 L-50,-1 Z" fill="#D6DAE6" stroke="#0A0F26" strokeWidth="2.5" strokeLinejoin="round"/>
              </g>
              <g id="bladeA">
                <path d="M-48,0 L-72,14" stroke="#0A0F26" strokeWidth="11" strokeLinecap="round"/>
                <path d="M-48,0 L-72,14" stroke="#F2A33A" strokeWidth="5.5" strokeLinecap="round"/>
                <ellipse cx="-86" cy="20" rx="15" ry="10" fill="none" stroke="#0A0F26" strokeWidth="11"/>
                <ellipse cx="-86" cy="20" rx="15" ry="10" fill="none" stroke="#F2A33A" strokeWidth="5.5"/>
                <path d="M2,0 L-48,-9 L-50,1 Z" fill="#D6DAE6" stroke="#0A0F26" strokeWidth="2.5" strokeLinejoin="round"/>
              </g>
              <circle cx="-48" cy="0" r="4.5" fill="#F6F7FB" stroke="#0A0F26" strokeWidth="2"/>
            </g>
            <g id="btn" opacity="0">
              <g id="btnFace">
                <rect x="170" y="545" width="460" height="68" rx="18" fill="#1A1A2E"/>
                <rect x="170" y="545" width="460" height="68" rx="18" fill="rgba(242,163,58,.16)" stroke="#F2A33A" strokeWidth="3"/>
                <rect id="btnFill2" x="170" y="545" width="460" height="68" rx="18" fill="#0F3A3A" stroke="#1FB5A0" strokeWidth="3" opacity="0"/>
                <text id="btnText1" x="400" y="586" textAnchor="middle" className="svg-h" fontSize="20" fill="#F2A33A">{S.match}</text>
                <text id="btnText2" x="400" y="586" textAnchor="middle" className="svg-h" fontSize="20" fill="#1FB5A0" opacity="0">{S.matched}</text>
              </g>
              <circle id="ripple" cx="478" cy="584" r="0" fill="#F2A33A" opacity="0"/>
            </g>
            <g id="fx"></g>
            <g id="cursor">
              <g id="cursorPress">
                <g transform="scale(1.5)"><path d="M0,0 L0,36 L9,28 L16,43 L23,40 L16,25 L28,25 Z" fill="#FFFFFF" stroke="#0A0F26" strokeWidth="2.6" strokeLinejoin="round"/></g>
              </g>
            </g>
          </svg>
  );
}

export default memo(StageSvg);
