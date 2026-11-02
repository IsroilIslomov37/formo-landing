// Build'dan keyin ishlaydi: har bir til uchun tayyor HTML yozadi (SEO uchun),
// shuningdek sitemap.xml va robots.txt yaratadi.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { SITE_URL, TELEGRAM_URL } from "../site.config.js";

const dist = path.resolve("dist");
const { render, DICT, PATHS } = await import(pathToFileURL(path.resolve("dist-ssr/entry-server.js")).href);

let template = fs.readFileSync(path.join(dist, "index.html"), "utf8");

// CSS HTML ichiga joylanadi: alohida bloklovchi so'rov bo'lmaydi (birinchi ko'rinish tezroq)
template = template.replace(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/, (_, href) => `<style>${fs.readFileSync(path.join(dist, href), "utf8")}</style>`);
const LANGS = Object.keys(PATHS);
const OG_IMAGE = `${SITE_URL}/og.png`;
const url = (lang) => SITE_URL + PATHS[lang];

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const meta = (attr, key, value) => `<meta ${attr}="${key}" content="${esc(value)}">`;

// Hashlangan shrift fayllarini topib, birinchi ekran uchun oldindan yuklaymiz
const assets = fs.readdirSync(path.join(dist, "assets"));
const font = (re) => assets.find((f) => re.test(f));
function fontPreloads(lang) {
  const subset = lang === "ru" ? ["latin", "cyrillic"] : ["latin"];
  const files = [];
  for (const family of ["unbounded", "manrope"]) {
    for (const s of subset) {
      const f = font(new RegExp(`^${family}-${s}-wght-normal-.*\.woff2$`));
      if (f) files.push(f);
    }
  }
  return files.map((f) => `<link rel="preload" as="font" type="font/woff2" crossorigin href="/assets/${f}">`).join("\n");
}

function jsonLd(lang) {
  const t = DICT[lang].meta;
  const org = { "@type": "Organization", "@id": `${SITE_URL}/#org`, name: "Formo", url: SITE_URL + "/", logo: `${SITE_URL}/icon-512.png`, sameAs: [TELEGRAM_URL] };
  return {
    "@context": "https://schema.org",
    "@graph": [
      org,
      { "@type": "WebSite", "@id": `${SITE_URL}/#website`, url: SITE_URL + "/", name: "Formo", inLanguage: LANGS, publisher: { "@id": org["@id"] } },
      {
        "@type": "WebPage", "@id": `${url(lang)}#page`, url: url(lang), name: t.title, description: t.description,
        inLanguage: lang, isPartOf: { "@id": `${SITE_URL}/#website` }, primaryImageOfPage: { "@type": "ImageObject", url: OG_IMAGE, width: 1200, height: 630 },
      },
      {
        "@type": "Service", "@id": `${url(lang)}#service`, name: t.service, serviceType: t.service, description: t.description,
        provider: { "@id": org["@id"] }, areaServed: { "@type": "Country", name: "Uzbekistan" }, inLanguage: lang,
        availableChannel: { "@type": "ServiceChannel", serviceUrl: TELEGRAM_URL },
      },
    ],
  };
}

function seoBlock(lang) {
  const t = DICT[lang].meta;
  const others = LANGS.filter((l) => l !== lang);
  return [
    `<title>${esc(t.title)}</title>`,
    meta("name", "description", t.description),
    `<link rel="canonical" href="${url(lang)}">`,
    ...LANGS.map((l) => `<link rel="alternate" hreflang="${l}" href="${url(l)}">`),
    `<link rel="alternate" hreflang="x-default" href="${url("uz")}">`,
    meta("property", "og:type", "website"),
    meta("property", "og:site_name", "Formo"),
    meta("property", "og:locale", t.locale),
    ...others.map((l) => meta("property", "og:locale:alternate", DICT[l].meta.locale)),
    meta("property", "og:url", url(lang)),
    meta("property", "og:title", t.title),
    meta("property", "og:description", t.description),
    meta("property", "og:image", OG_IMAGE),
    meta("property", "og:image:type", "image/png"),
    meta("property", "og:image:width", "1200"),
    meta("property", "og:image:height", "630"),
    meta("property", "og:image:alt", t.ogAlt),
    meta("name", "twitter:card", "summary_large_image"),
    meta("name", "twitter:title", t.title),
    meta("name", "twitter:description", t.description),
    meta("name", "twitter:image", OG_IMAGE),
    meta("name", "twitter:image:alt", t.ogAlt),
    `<script type="application/ld+json">${JSON.stringify(jsonLd(lang)).replace(/</g, "\u003c")}</script>`,
    fontPreloads(lang),
  ].join("\n");
}

for (const lang of LANGS) {
  const body = render(lang);
  let html = template
    .replace(/<html lang="[^"]*">/, `<html lang="${lang}">`)
    .replace(/<!--seo:start-->[\s\S]*?<!--seo:end-->/, () => seoBlock(lang))
    .replace('<div id="root"></div>', () => `<div id="root">${body}</div>`);
  const file = lang === "uz" ? path.join(dist, "index.html") : path.join(dist, lang, "index.html");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
  console.log(`prerendered ${PATHS[lang]}  (${(html.length / 1024).toFixed(0)} KB)`);
}

const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${LANGS.map((l) => `  <url>
    <loc>${url(l)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${l === "uz" ? "1.0" : "0.9"}</priority>
${LANGS.map((o) => `    <xhtml:link rel="alternate" hreflang="${o}" href="${url(o)}"/>`).join("\n")}
    <xhtml:link rel="alternate" hreflang="x-default" href="${url("uz")}"/>
  </url>`).join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(dist, "sitemap.xml"), sitemap);
fs.writeFileSync(path.join(dist, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
console.log("sitemap.xml, robots.txt written for", SITE_URL);
