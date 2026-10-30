import { renderToString } from "react-dom/server";
import App from "./App.jsx";
import { LangProvider } from "./i18n.jsx";

// Build paytida (scripts/prerender.mjs) har bir til uchun tayyor HTML qaytaradi
export function render(lang) {
  return renderToString(
    <LangProvider initial={lang}>
      <App />
    </LangProvider>
  );
}

export { DICT, PATHS } from "./i18n.jsx";
