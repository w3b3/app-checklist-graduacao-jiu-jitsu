// Head metadata for every page: canonical, hreflang, Open Graph, X card, JSON-LD,
// plus sitemap.xml and robots.txt. Pure functions so the build script stays small.

export const escapeAttr = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** JSON for a <script type="application/ld+json"> block: `<` is escaped so it can never close the tag. */
export const jsonLd = (data: unknown) =>
  `  <script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;

export type Alternate = { hreflang: string; url: string };

export type HeadInput = {
  origin: string;
  title: string;
  description: string;
  canonical: string;
  alternates: Alternate[];
  ogLocale: string;
  ogAlternateLocales: string[];
  siteName: string;
  imageUrl: string;
  imageAlt: string;
  jsonLd: unknown[];
  noindex?: boolean;
};

export function buildHead(i: HeadInput): string {
  const meta = (attr: 'name' | 'property', key: string, value: string | number) =>
    `  <meta ${attr}="${key}" content="${escapeAttr(String(value))}">`;
  const lines: string[] = [];
  if (i.noindex) lines.push(meta('name', 'robots', 'noindex, nofollow'));
  else lines.push(`  <link rel="canonical" href="${i.canonical}">`);
  for (const a of i.alternates) lines.push(`  <link rel="alternate" hreflang="${a.hreflang}" href="${a.url}">`);
  if (!i.noindex) {
    lines.push(
      meta('property', 'og:type', 'website'),
      meta('property', 'og:url', i.canonical),
      meta('property', 'og:site_name', i.siteName),
      meta('property', 'og:title', i.title),
      meta('property', 'og:description', i.description),
      meta('property', 'og:locale', i.ogLocale),
      ...i.ogAlternateLocales.map((l) => meta('property', 'og:locale:alternate', l)),
      meta('property', 'og:image', i.imageUrl),
      meta('property', 'og:image:type', 'image/png'),
      meta('property', 'og:image:width', 1200),
      meta('property', 'og:image:height', 630),
      meta('property', 'og:image:alt', i.imageAlt),
      meta('name', 'twitter:card', 'summary_large_image'),
    );
    for (const d of i.jsonLd) lines.push(jsonLd(d));
  }
  return lines.join('\n');
}

export const PUBLISHER = { '@type': 'Organization', name: 'Tatame0', url: 'https://tatame0.com' };
export const STORE_LINKS = [
  'https://apps.apple.com/app/id6754972177',
  'https://play.google.com/store/apps/details?id=com.brothersfight.bjjchecklist',
];

export function softwareApplication(o: { name: string; url: string; inLanguage: string; description: string; image: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MobileApplication',
    name: o.name,
    url: o.url,
    description: o.description,
    image: o.image,
    inLanguage: o.inLanguage,
    operatingSystem: 'iOS, Android, Web',
    applicationCategory: 'SportsApplication',
    downloadUrl: STORE_LINKS,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    publisher: PUBLISHER,
  };
}

export function webSite(o: { name: string; url: string; inLanguage: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: o.name,
    url: o.url,
    inLanguage: o.inLanguage,
    publisher: PUBLISHER,
  };
}

export function breadcrumbList(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, idx) => ({ '@type': 'ListItem', position: idx + 1, name: it.name, item: it.url })),
  };
}

export type SitemapEntry = { url: string; alternates: Alternate[] };

export function buildSitemap(entries: SitemapEntry[], lastmod: string): string {
  const urls = entries
    .map(
      (e) =>
        `  <url>\n    <loc>${e.url}</loc>\n    <lastmod>${lastmod}</lastmod>\n` +
        e.alternates
          .map((a) => `    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${a.url}"/>`)
          .join('\n') +
        '\n  </url>',
    )
    .join('\n');
  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' +
    urls +
    '\n</urlset>\n'
  );
}

export const buildRobots = (origin: string) => `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`;
