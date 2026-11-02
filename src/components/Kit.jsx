import { useEffect, useRef, useState } from "react";
import KitPreview from "./KitPreview.jsx";
import Tilt from "./Tilt.jsx";
import Reveal from "./Reveal.jsx";
import { useLang } from "../i18n.jsx";
import { KIT_COLORS, TRIM_COLORS, PATTERN_IDS, PRESETS, SIZES, TELEGRAM } from "../data.js";
import { wrap, section, btnAccent, SecHead } from "../ui.jsx";

const pressed = "aria-pressed:text-accent aria-pressed:border-accent aria-pressed:bg-accent/10";
const toggleBtn = `font-display font-semibold text-[13px] leading-none text-muted bg-transparent border-[1.5px] border-transparent rounded-[10px] px-3.5 py-2.5 cursor-pointer ${pressed}`;
const chip = "flex-none px-3.5 py-2.5 rounded-full border border-line bg-bg2 font-kit font-bold text-sm tracking-[.06em] text-muted cursor-pointer transition duration-200 hover:text-ink hover:border-accent/60 active:scale-95";
const optBtn = `font-display font-semibold text-[13px] leading-none text-ink bg-bg2 border-[1.5px] border-line rounded-xl py-[13px] cursor-pointer transition-colors ${pressed}`;
const swatch = "size-10 rounded-full border-2 border-line cursor-pointer bg-[var(--c)] transition-transform duration-200 hover:scale-110 aria-pressed:border-accent aria-pressed:shadow-[0_0_0_3px_var(--color-bg2),0_0_0_5px_var(--color-accent)]";
const labelCls = "flex justify-between gap-3 text-sm font-bold";
const smallCls = "text-[12.5px] font-semibold text-muted";
const inputCls = "font-kit font-bold text-lg leading-none tracking-[.08em] uppercase text-ink bg-bg2 border-[1.5px] border-line rounded-[14px] px-4 py-[15px] w-full min-w-0 focus:outline-none focus:border-accent focus:shadow-[0_0_0_4px_rgb(242_163_58/.12)]";
const rowCls = "flex items-center justify-between gap-4 px-4 py-3.5 rounded-2xl bg-bg2 border border-line";
const switchTrack = "absolute inset-0 rounded-full bg-[#2A3366] transition-colors duration-200 pointer-events-none after:content-[''] after:absolute after:top-1 after:left-1 after:size-[22px] after:rounded-full after:bg-ink after:transition-transform peer-checked:bg-teal peer-checked:after:translate-x-[22px] peer-focus-visible:outline-2 peer-focus-visible:outline-accent peer-focus-visible:outline-offset-[3px]";

const TAB_IDS = ["text", "color", "pattern", "size"];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

function Switch({ checked, onChange, label }) {
  return (
    <label className="relative flex-none w-[52px] h-[30px]">
      <input className="peer absolute opacity-0 size-full m-0 cursor-pointer" type="checkbox" checked={checked} aria-label={label} onChange={(e) => onChange(e.target.checked)} />
      <span className={switchTrack}></span>
    </label>
  );
}

function Field({ label, hint, htmlFor, children }) {
  return (
    <div className="flex flex-col gap-2">
      {htmlFor
        ? <label className={labelCls} htmlFor={htmlFor}>{label} {hint && <small className={smallCls}>{hint}</small>}</label>
        : <span className={labelCls}>{label} {hint && <small className={smallCls}>{hint}</small>}</span>}
      {children}
    </div>
  );
}

export default function Kit() {
  const { t } = useLang();
  const K = t.kit;

  const [tab, setTab] = useState("text");
  const [name, setName] = useState(K.defaultName);
  const [number, setNumber] = useState("17");
  const [colorIdx, setColorIdx] = useState(0);
  const [trim, setTrim] = useState(KIT_COLORS[0].trim);
  const [pattern, setPattern] = useState("none");
  const [logo, setLogo] = useState(true);
  const [size, setSize] = useState("L");
  const [shortsNumber, setShortsNumber] = useState(true);
  const [back, setBack] = useState(false);
  const [note, setNote] = useState("");

  // til almashganda hali tegilmagan standart ism ham almashadi
  const prevDefault = useRef(K.defaultName);
  useEffect(() => {
    setName((n) => (n === prevDefault.current ? K.defaultName : n));
    prevDefault.current = K.defaultName;
    setNote("");
  }, [K.defaultName]);

  const color = KIT_COLORS[colorIdx];
  const shownName = name.trim().toUpperCase() || K.defaultName;
  const shownNumber = number || "17";
  const colorName = K.colors[colorIdx];
  const trimName = K.trims[TRIM_COLORS.indexOf(trim)] ?? "—";
  const patternName = K.patterns[pattern];

  // asosiy rang almashsa, qo'shimcha rang ham unga mosi bilan almashadi
  function chooseColor(i) {
    setColorIdx(i);
    setTrim(KIT_COLORS[i].trim);
  }

  function applyPreset(p, i) {
    setName(K.presets[i]);
    setNumber(p.number);
    chooseColor(p.color);
  }

  function shuffle() {
    const i = Math.floor(Math.random() * KIT_COLORS.length);
    chooseColor(i);
    setTrim(pick(TRIM_COLORS.filter((h) => h !== KIT_COLORS[i].color)));
    setPattern(pick(PATTERN_IDS));
  }

  async function submit(e) {
    e.preventDefault();
    const text = K.message({
      name: shownName, number: shownNumber, color: colorName, trim: trimName, pattern: patternName,
      logo: logo ? K.yes : K.no, size, shorts: shortsNumber ? K.yes : K.no,
    });

    let copied = false;
    try {
      await navigator.clipboard.writeText(text);
      copied = true;
    } catch {
      // clipboard yopiq bo'lsa, matnni foydalanuvchi o'zi yozadi
    }
    setNote(copied ? K.copied : K.manual);
    window.open(TELEGRAM, "_blank", "noopener");
  }

  return (
    <section id="konstruktor" className={section}>
      <div className={wrap}>
        <SecHead kicker={K.kicker} title={K.title}>{K.lead}</SecHead>

        <Reveal className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-4 max-[720px]:grid-cols-1">
          {/* chap: forma ko'rinishi */}
          <div className="self-start sticky top-[calc(var(--header-h)+16px)] max-[720px]:static flex flex-col items-center gap-4 p-6 max-[480px]:p-4 rounded-3xl border border-line bg-bg2 bg-[radial-gradient(360px_320px_at_50%_55%,#16225F_0%,transparent_70%)]">
            <div className="inline-flex p-1 gap-1 rounded-[14px] bg-bg2 border border-line" role="group" aria-label={K.viewAria}>
              <button type="button" className={toggleBtn} aria-pressed={!back} onClick={() => setBack(false)}>{K.front}</button>
              <button type="button" className={toggleBtn} aria-pressed={back} onClick={() => setBack(true)}>{K.back}</button>
            </div>
            <Tilt max={7} className="w-full flex justify-center">
              <KitPreview
                label={K.previewAria}
                color={color.color} ink={color.ink} trim={trim} pattern={pattern} logo={logo}
                name={shownName} number={shownNumber} shortsNumber={shortsNumber} back={back}
              />
            </Tilt>
            <p className="m-0 text-[13px] font-semibold text-muted text-center">
              {shownName} · {shownNumber} · {colorName} · {size}
            </p>
          </div>

          {/* o'ng: boshqaruv */}
          <form className="flex flex-col gap-5 p-[26px] max-[480px]:p-4 rounded-3xl border border-line bg-surface min-w-0" onSubmit={submit}>
            <div className="flex flex-wrap max-[480px]:flex-nowrap items-center gap-2 max-[480px]:-mx-4 max-[480px]:px-4 max-[480px]:overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {PRESETS.map((p, i) => (
                <button key={i} type="button" onClick={() => applyPreset(p, i)} className={chip}>{K.presets[i]} {p.number}</button>
              ))}
              <button type="button" onClick={shuffle} aria-label={K.shuffleAria} className={`${chip} text-accent border-accent/40`}>{K.shuffle}</button>
            </div>

            <div className="grid grid-cols-4 gap-1 p-1 rounded-2xl bg-bg2 border border-line" role="tablist" aria-label={K.tabsAria}>
              {TAB_IDS.map((id) => (
                <button
                  key={id} type="button" role="tab" id={`tab-${id}`} aria-selected={tab === id} aria-controls="kit-panel"
                  onClick={() => setTab(id)}
                  className="font-display font-semibold text-[13px] max-[420px]:text-[11px] leading-none text-muted py-3 rounded-xl bg-transparent border-0 cursor-pointer transition-colors aria-selected:bg-accent/10 aria-selected:text-accent"
                >{K.tabs[id]}</button>
              ))}
            </div>

            <div key={tab} id="kit-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="flex flex-col gap-5 min-h-[250px] animate-[fadeUp_.3s_ease]">
              {tab === "text" && (
                <>
                  <Field label={K.nameLabel} hint={K.nameHint} htmlFor="kitName">
                    <input
                      className={inputCls} type="text" id="kitName" value={name} maxLength={12} autoComplete="off" spellCheck={false}
                      onFocus={() => setBack(true)} onChange={(e) => setName(e.target.value)}
                    />
                  </Field>
                  <Field label={K.numberLabel} hint={K.numberHint} htmlFor="kitNumber">
                    <input
                      className={inputCls} type="text" id="kitNumber" value={number} maxLength={2} inputMode="numeric" autoComplete="off"
                      onChange={(e) => setNumber(e.target.value.replace(/\D/g, "").slice(0, 2))}
                    />
                  </Field>
                  <div className={rowCls}>
                    <div><b className="block text-[15px]">{K.shortsTitle}</b><small className="text-[13px] text-muted font-semibold">{K.shortsSub}</small></div>
                    <Switch checked={shortsNumber} onChange={setShortsNumber} label={K.shortsTitle} />
                  </div>
                </>
              )}

              {tab === "color" && (
                <>
                  <Field label={K.colorLabel} hint={colorName}>
                    <div className="flex flex-wrap gap-2.5" role="group" aria-label={K.colorLabel}>
                      {KIT_COLORS.map((c, i) => (
                        <button key={c.color} type="button" className={swatch} style={{ "--c": c.color }} aria-label={K.colors[i]} aria-pressed={i === colorIdx} onClick={() => chooseColor(i)} />
                      ))}
                    </div>
                  </Field>
                  <Field label={K.trimLabel} hint={trimName}>
                    <div className="flex flex-wrap gap-2.5" role="group" aria-label={K.trimLabel}>
                      {TRIM_COLORS.map((hex, i) => (
                        <button key={hex} type="button" className={swatch} style={{ "--c": hex }} aria-label={K.trims[i]} aria-pressed={hex === trim} onClick={() => setTrim(hex)} />
                      ))}
                    </div>
                  </Field>
                </>
              )}

              {tab === "pattern" && (
                <>
                  <Field label={K.patternLabel} hint={patternName}>
                    <div className="grid grid-cols-2 gap-2" role="group" aria-label={K.patternLabel}>
                      {PATTERN_IDS.map((id) => (
                        <button key={id} type="button" className={optBtn} aria-pressed={id === pattern} onClick={() => setPattern(id)}>{K.patterns[id]}</button>
                      ))}
                    </div>
                  </Field>
                  <div className={rowCls}>
                    <div><b className="block text-[15px]">{K.logoTitle}</b><small className="text-[13px] text-muted font-semibold">{K.logoSub}</small></div>
                    <Switch checked={logo} onChange={(v) => { setLogo(v); setBack(false); }} label={K.logoTitle} />
                  </div>
                </>
              )}

              {tab === "size" && (
                <Field label={K.sizeLabel} hint={size}>
                  <div className="grid grid-cols-6 gap-2 max-[480px]:grid-cols-3" role="group" aria-label={K.sizeAria}>
                    {SIZES.map((s) => (
                      <button key={s} type="button" className={`${optBtn} text-sm`} aria-pressed={s === size} onClick={() => setSize(s)}>{s}</button>
                    ))}
                  </div>
                </Field>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3.5 pt-[18px] border-t border-line">
              <div><small className="block text-[13px] text-muted font-semibold">{K.orderSmall}</small><strong className="font-display font-bold text-xl leading-[1.15] tracking-[-.015em]">{K.set}</strong></div>
              <button type="submit" className={`${btnAccent} max-[480px]:w-full`}>{K.submit}</button>
            </div>
            <p className="m-0 text-[13.5px] text-teal font-semibold min-h-[1.4em]" aria-live="polite">{note}</p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
