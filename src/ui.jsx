import Reveal from "./components/Reveal.jsx";

// Bir necha joyda takrorlanadigan Tailwind klass to'plamlari

// Butun sayt (sarlavha, bo'limlar, footer) uchun yagona konteyner
export const wrap = "mx-auto w-full max-w-[1440px] pl-[max(20px,4vw,env(safe-area-inset-left))] pr-[max(20px,4vw,env(safe-area-inset-right))]";
export const section = "pb-[clamp(64px,9vw,128px)] scroll-mt-[var(--header-h)]";
export const kicker = "inline-flex items-center gap-2.5 font-body font-bold text-xs leading-none tracking-[.12em] uppercase text-accent";

const btn = "mag inline-flex items-center justify-center gap-[.6em] font-display font-semibold text-[15px] leading-none tracking-[-.005em] px-[26px] py-[18px] rounded-[14px] border-[1.5px] no-underline cursor-pointer whitespace-nowrap max-[480px]:px-5 max-[480px]:py-4 max-[480px]:text-sm max-[480px]:whitespace-normal max-[480px]:text-center transition duration-200 hover:-translate-y-px active:translate-y-px";
export const btnAccent = `${btn} border-accent text-accent bg-transparent hover:bg-accent/10`;
export const btnQuiet = `${btn} border-line text-ink bg-surface hover:border-[rgb(150_165_255/.3)]`;

export function SecHead({ kicker: k, title, children }) {
  return (
    <Reveal className="flex flex-col gap-4 mb-[clamp(28px,4vw,52px)] max-w-[46rem]">
      <span className={kicker}>{k}</span>
      <h2 className="font-display font-bold text-[clamp(28px,4vw,52px)] leading-[1.06] tracking-[-.03em] m-0 text-balance">{title}</h2>
      {children && <p className="m-0 text-muted font-medium max-w-[36em]">{children}</p>}
    </Reveal>
  );
}
