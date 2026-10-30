import { LANGS, useLang } from "../i18n.jsx";

// UZ / RU / EN tanlagich
export default function LangSwitch({ className = "" }) {
  const { lang, setLang, t } = useLang();
  return (
    <div role="group" aria-label={t.langAria} className={`inline-flex p-0.5 rounded-full border border-line bg-surface ${className}`}>
      {LANGS.map((l) => (
        <button
          key={l.id} type="button" lang={l.id} title={l.name}
          aria-pressed={lang === l.id}
          onClick={() => setLang(l.id)}
          className="px-3.5 py-2.5 rounded-full border-0 bg-transparent font-display font-semibold text-xs leading-none text-muted cursor-pointer transition-colors hover:text-ink aria-pressed:bg-accent/15 aria-pressed:text-accent"
        >{l.label}</button>
      ))}
    </div>
  );
}
