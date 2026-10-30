import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import Intro from "./components/Intro.jsx";
import Cursor from "./components/Cursor.jsx";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import Marquee from "./components/Marquee.jsx";
import Story from "./components/Story.jsx";
import Kit from "./components/Kit.jsx";
import { Features, Steps, Cta, Footer } from "./components/Sections.jsx";
import { useLang } from "./i18n.jsx";

// serverda useLayoutEffect ogohlantirish beradi, shuning uchun
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export default function App() {
  const { t } = useLang();
  // Serverda va birinchi renderda hamma narsa ko'rinadi (qidiruv tizimi va JS'siz foydalanuvchi uchun).
  // Intro kerak bo'lsa (index.html'dagi skript <html class="intro"> qo'yadi), sahifa yashirilib qayta boshlanadi.
  const [ready, setReady] = useState(true);
  const [intro, setIntro] = useState(false);

  useIsoLayoutEffect(() => {
    if (document.documentElement.classList.contains("intro")) {
      setReady(false);
      setIntro(true);
    }
  }, []);

  const done = useCallback(() => {
    document.documentElement.classList.remove("intro");
    setReady(true);
  }, []);

  return (
    <>
      <a
        href="#top"
        className="absolute left-4 top-3 z-[120] -translate-y-20 focus:translate-y-0 px-4 py-2.5 rounded-xl bg-accent text-bg font-display font-semibold text-sm transition-transform"
      >
        {t.skipLink}
      </a>
      {intro && <Intro onDone={done} />}
      <Cursor />
      <Header ready={ready} />
      <main id="top" tabIndex={-1} className="outline-none">
        <Hero ready={ready} />
        <Marquee />
        <Story />
        <Features />
        <Steps />
        <Kit />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
