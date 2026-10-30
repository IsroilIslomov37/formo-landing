// size="lg" — sarlavhadagi katta logo, size="xl" — pastki qismdagi ulkan logo
const SIZES = {
  lg: { icon: "w-[46px] h-11 max-[480px]:w-9 max-[480px]:h-[35px]", text: "text-[27px] max-[480px]:text-[20px]", gap: "gap-3.5 max-[480px]:gap-2.5" },
  xl: { icon: "w-[96px] h-[92px] max-[560px]:w-16 max-[560px]:h-[61px] max-[400px]:w-12 max-[400px]:h-[46px]", text: "text-[56px] max-[560px]:text-[34px] max-[400px]:text-[26px]", gap: "gap-5 max-[400px]:gap-3" },
};

// Hover: belgi qiyshayib kattalashadi, amber bo'lak uchib o'tadi, harflar to'lqin bo'lib sakraydi.
export default function Logo({ label, href = "#top", size = "lg" }) {
  const s = SIZES[size];
  return (
    <a className={`group/logo inline-flex items-center no-underline ${s.gap}`} href={href} aria-label={label}>
      <svg
        className={`block overflow-visible transition-transform duration-500 ease-[cubic-bezier(.2,1.6,.4,1)] group-hover/logo:-rotate-[8deg] group-hover/logo:scale-110 group-active/logo:scale-95 ${s.icon}`}
        viewBox="0 0 345 332" aria-hidden="true"
      >
        <path d="M70,0 L310,0 L242,70 L70,70 L70,120 L250,120 L180,192 L70,192 L70,260 L0,332 L0,70 Z" className="fill-ink" />
        <path className="logo-sliver fill-sliver group-hover/logo:animate-[sliver_.8s_ease]" d="M310,0 L345,0 L277,70 L242,70 Z" />
      </svg>
      <span className={`flex font-display font-semibold leading-none tracking-[.32em] -mr-[.32em] ${s.text}`} aria-hidden="true">
        {"FORMO".split("").map((ch, i) => (
          <span
            key={i}
            style={{ transitionDelay: `${i * 45}ms` }}
            className="inline-block transition-[transform,color] duration-300 group-hover/logo:-translate-y-[.16em] group-hover/logo:text-accent"
          >{ch}</span>
        ))}
      </span>
    </a>
  );
}
