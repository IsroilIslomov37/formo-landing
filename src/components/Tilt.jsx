import { useRef } from "react";

// Sichqoncha yo'nalishiga qarab biroz qiyshayadi. Telefon va reduced-motion'da o'chiq.
export default function Tilt({ children, max = 8, className = "", ...rest }) {
  const ref = useRef(null);

  const move = (e) => {
    if (e.pointerType !== "mouse" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    ref.current.style.transform = `perspective(900px) rotateY(${x * max}deg) rotateX(${-y * max}deg)`;
  };
  const leave = () => { ref.current.style.transform = ""; };

  return (
    <div ref={ref} onPointerMove={move} onPointerLeave={leave} {...rest}
      className={`transition-transform duration-200 ease-out will-change-transform ${className}`}>
      {children}
    </div>
  );
}
