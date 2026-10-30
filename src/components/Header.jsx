import { useEffect, useRef, useState } from "react";
import Logo from "./Logo.jsx";
import LangSwitch from "./LangSwitch.jsx";
import { useLang } from "../i18n.jsx";
import { NAV_HREFS } from "../data.js";
import { wrap, btnAccent } from "../ui.jsx";


const linkCls = `whitespace-nowrap text-[15px] font-semibold text-muted no-underline transition-colors hover:text-ink
  max-[1100px]:font-display max-[1100px]:text-[19px] max-[1100px]:leading-[1.2] max-[1100px]:text-ink max-[1100px]:py-[17px] max-[1100px]:px-0.5 max-[1100px]:border-b max-[1100px]:border-line max-[1100px]:hover:text-accent`;

const panelBase = `flex items-center gap-8 min-[1400px]:gap-11 transition-[opacity,transform,visibility] duration-200
  max-[1100px]:fixed max-[1100px]:inset-x-0 max-[1100px]:top-[var(--header-h)] max-[1100px]:z-[49] max-[1100px]:flex-col max-[1100px]:items-stretch max-[1100px]:gap-0
  max-[1100px]:px-[max(16px,4vw)] max-[1100px]:pt-2 max-[1100px]:pb-[22px] max-[1100px]:bg-bg max-[1100px]:border-b max-[1100px]:border-line
  max-[1100px]:shadow-[0_30px_60px_-20px_rgba(0,0,0,.8)]`;
const panelOpen = `max-[1100px]:opacity-100 max-[1100px]:visible max-[1100px]:translate-y-0`;
const panelShut = `max-[1100px]:opacity-0 max-[1100px]:invisible max-[1100px]:-translate-y-2.5`;

export default function Header({ ready = true }) {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const burger = useRef(null);
  const panel = useRef(null);
  const bar = useRef(null);

  // tepadagi ingichka progress chiziq
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.current.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    return () => { removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  // menyu ochilganda fokus birinchi havolaga o'tadi
  useEffect(() => {
    if (open) panel.current.querySelector("a").focus({ preventScroll: true });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        burger.current.focus({ preventScroll: true });
      }
    };
    const onClick = (e) => {
      if (!panel.current.contains(e.target) && !burger.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, [open]);

  // ekran kengayganda ochiq menyu qolib ketmasin
  useEffect(() => {
    const mq = matchMedia("(min-width: 1101px)");
    const onChange = (e) => { if (e.matches) setOpen(false); };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <header className={`sticky top-0 z-50 h-[var(--header-h)] bg-bg/95 border-b border-line transition-transform duration-700 ease-out ${ready ? "" : "-translate-y-full"}`}>
      <div className={`${wrap} h-full flex items-center justify-between gap-5 min-[1280px]:gap-12`}>
        <Logo label={t.logoHome} />
        <nav className="flex items-center gap-9 min-[1400px]:gap-12 max-[1100px]:gap-2.5" aria-label={t.navAria}>
          <div
            id="navLinks" ref={panel}
            className={`${panelBase} ${open ? panelOpen : panelShut}`}
            onClick={(e) => { if (e.target.closest("a")) setOpen(false); }}
          >
            {NAV_HREFS.map((href, i) => (
              <a key={href} className={linkCls} href={href}>{t.nav[i]}</a>
            ))}
            <div className="hidden max-[480px]:block mt-[18px]">
              <a className={`${btnAccent} w-full`} href="#buyurtma">{t.order}</a>
            </div>
            <LangSwitch className="min-[1101px]:hidden self-start mt-[18px]" />
          </div>
          <LangSwitch className="max-[1100px]:hidden" />
          <a className={`${btnAccent} px-4! py-3! text-[13px]! rounded-xl! max-[480px]:hidden`} href="#buyurtma">{t.order}</a>
          <button
            type="button" ref={burger}
            className="group hidden max-[1100px]:inline-grid place-content-center gap-[5px] size-12 flex-none rounded-xl cursor-pointer border border-line bg-surface aria-expanded:border-accent"
            aria-expanded={open} aria-controls="navLinks"
            aria-label={open ? t.menuClose : t.menuOpen}
            onClick={() => setOpen((o) => !o)}
          >
            <span className="block w-5 h-0.5 rounded-sm bg-ink transition duration-200 group-aria-expanded:translate-y-[7px] group-aria-expanded:rotate-45"></span>
            <span className="block w-5 h-0.5 rounded-sm bg-ink transition duration-200 group-aria-expanded:opacity-0"></span>
            <span className="block w-5 h-0.5 rounded-sm bg-ink transition duration-200 group-aria-expanded:-translate-y-[7px] group-aria-expanded:-rotate-45"></span>
          </button>
        </nav>
      </div>
      <div ref={bar} aria-hidden="true" className="absolute -bottom-px left-0 h-0.5 w-full origin-left scale-x-0 bg-accent"></div>
    </header>
  );
}
