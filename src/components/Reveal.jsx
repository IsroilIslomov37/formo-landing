import { useEffect, useRef, useState } from "react";

// Ko'rinish maydoniga kirganda pastdan yumshoq chiqadi (bir marta)
// `when` berilsa, ko'rinish tashqaridan boshqariladi (masalan, intro tugagach)
export default function Reveal({ children, delay = 0, className = "", as: Tag = "div", when }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (when !== undefined) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setShown(true);
        io.disconnect();
      }
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [when]);

  const visible = when ?? shown;

  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: visible ? `${delay}ms` : undefined }}
      className={`transition duration-700 ease-out ${visible ?"opacity-100 translate-y-0" : "opacity-0 translate-y-7"} ${className}`}
    >
      {children}
    </Tag>
  );
}
