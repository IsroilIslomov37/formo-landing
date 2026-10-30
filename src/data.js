// Bot / kanal manzili. Ishga tushirishdan oldin haqiqiysiga almashtiring.
export const TELEGRAM = "https://t.me/formo_uz";

// Hikoya bosqichlarining boshlanish sekundi (nomlari i18n.jsx da)
export const CHAPTERS = [0, 10, 20, 32, 44, 54, 66];
export const TOTAL = 82;

export const NAV_HREFS = ["#jarayon", "#afzalliklar", "#konstruktor", "#qanday"];

// Konstruktor ranglari. Nomlari i18n'dagi `kit.colors` bilan indeks bo'yicha mos keladi.
export const KIT_COLORS = [
  { color: "#FFFFFF", ink: "#0E1A3F", trim: "#0E1A3F" },
  { color: "#16245E", ink: "#F3F4F8", trim: "#F2A33A" },
  { color: "#1FB5A0", ink: "#0E1A3F", trim: "#0E1A3F" },
  { color: "#C9383F", ink: "#F6F7FB", trim: "#F6F7FB" },
  { color: "#F2A33A", ink: "#0E1A3F", trim: "#0E1A3F" },
  { color: "#12141F", ink: "#F3F4F8", trim: "#F2A33A" },
  { color: "#2A45B8", ink: "#F6F7FB", trim: "#F2A33A" },
  { color: "#6B3FA0", ink: "#F6F7FB", trim: "#F6F7FB" },
];

// Qo'shimcha rang: yoqa, yenglar va naqsh shu rangda bo'ladi (`kit.trims` bilan indeks bo'yicha)
export const TRIM_COLORS = ["#0E1A3F", "#F2A33A", "#F6F7FB", "#C9383F", "#1FB5A0"];

export const PATTERN_IDS = ["none", "fade"];

export const SIZES = ["S", "M", "L", "XL", "XXL", "3XL"];

// Tayyor namunalar: raqam va rang indeksi (nomlari `kit.presets` da)
export const PRESETS = [
  { number: "17", color: 0 },
  { number: "7", color: 2 },
  { number: "1", color: 3 },
  { number: "10", color: 1 },
  { number: "99", color: 4 },
];
