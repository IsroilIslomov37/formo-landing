import { createRoot, hydrateRoot } from "react-dom/client";
import "@fontsource-variable/unbounded";
import "@fontsource-variable/manrope";
import "@fontsource-variable/oswald";
import App from "./App.jsx";
import { LangProvider } from "./i18n.jsx";
import "./styles.css";

const root = document.getElementById("root");
const app = (
  <LangProvider>
    <App />
  </LangProvider>
);

// Prerender qilingan sahifada hydrate, dev rejimida (bo'sh #root) oddiy render
if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
