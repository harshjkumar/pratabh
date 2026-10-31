import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';

// The checked-in preview is the content/layout source. Its scripts and fonts are
// deliberately not executed: React owns navigation and GSAP owns the reveals.
export function compileReference(source, base = '/') {
  const assets = new Map();
  let html = source.replace(/data:image\/(png|jpeg|webp);base64,([A-Za-z0-9+/=]+)/g, (_, type, data) => {
    const bytes = Buffer.from(data, 'base64');
    const file = `assets/pratap/${createHash('sha256').update(bytes).digest('hex').slice(0, 16)}.${type === 'jpeg' ? 'jpg' : type}`;
    assets.set(file, { bytes, type });
    return `${base}${file}`;
  });
  const styles = [...html.matchAll(/<style>([\s\S]*?)<\/style>/g)].map(m => m[1]);
  const layout = styles.find(css => css.includes('--kraft:'));
  if (!layout) throw new Error('Reference HTML is missing its layout stylesheet.');
  const rawPages = Object.fromEntries([...html.matchAll(/<main class="page" id="page-([a-z]+)">([\s\S]*?)<\/main>/g)].map(m => [m[1], m[2]]));
  for (const page of ['home', 'about', 'infrastructure', 'products', 'product', 'contact']) {
    if (!rawPages[page]) throw new Error(`Reference HTML is missing the ${page} page.`);
  }
  const gallery = [...rawPages.home.matchAll(/<figure class="gal-slide"><img src="([^"]+)" alt="([^"]+)"/g)].map(m => ({ src: m[1], alt: m[2] }));
  const slugs = ['woven-fabric', 'woven-bags', 'block-bottom-bags', 'bopp-bags', 'jumbo-bags', 'non-woven-fabric'];
  const imageIndexes = [1, 11, 11, 6, 1, 8];
  const text = value => value.replace(/<span class="pending-tag">[\s\S]*?<\/span>/g, '').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim();
  const cards = [...rawPages.products.matchAll(/<a class="prod-card[^>]*>([\s\S]*?)<\/a>/g)];
  if (cards.length !== 6 || gallery.length !== 12) throw new Error('Reference product/gallery structure changed; update the adapter.');
  const products = cards.map((m, index) => ({
    slug: slugs[index],
    title: text(m[1].match(/<h3>([\s\S]*?)<\/h3>/)[1]),
    description: text(m[1].match(/<p class="prod-spec[^>]*>([\s\S]*?)<\/p>/)[1]),
    note: text(m[1].match(/<span class="prod-unit">([\s\S]*?)<\/span>/)[1]),
    image: gallery[imageIndexes[index]].src,
    imageAlt: gallery[imageIndexes[index]].alt,
  }));
  const identifyProduct = label => {
    const name = text(label);
    const aliases = { 'Woven Fabric': 0, 'Woven Bags': 1, 'Jumbo Bags': 4, 'Non-Woven Fabric': 5 };
    return products.find(p => name === p.title) ?? products[aliases[name]] ?? products[2];
  };
  const colors = new Map([
    ['#182640', 'var(--color-ink)'], ['#0F1A2E', 'var(--color-ink)'],
    ['#F5F3EC', 'var(--background)'], ['#FFFFFF', 'var(--card)'],
    ['#C8A265', 'var(--color-teal)'], ['#EAD9B8', 'var(--color-panel)'],
    ['#BE3A26', 'var(--color-dark)'], ['#5C6472', 'var(--muted-foreground)'],
    ['#3F7355', 'var(--color-teal)'], ['#EDF3EE', 'var(--color-panel)'],
    ['#33415C', 'var(--foreground)'], ['#2E4438', 'var(--foreground)'],
    ['#4A3A17', 'var(--foreground)'], ['#E0DACB', 'var(--border)'],
    ['#E5E0D2', 'var(--border)'], ['#D8D2C2', 'var(--border)'],
    ['#ECE7DA', 'var(--border)'], ['#DDD8CB', 'var(--border)'],
    ['#DCE7DE', 'var(--border)'], ['#CFE0D3', 'var(--color-panel)'],
  ]);
  const theme = value => value.replace(/'(Anton|Archivo)',sans-serif/g, 'var(--font-display)')
    .replace(/'IBM Plex Mono',monospace/g, 'var(--font-mono)')
    .replace(/#[0-9a-f]{6}\b/gi, color => colors.get(color.toUpperCase()) ?? color);
  const picture = (item, classes = '') => `<div class="reference-photo ${classes}"><img src="${item.src}" alt="${item.alt}" loading="lazy"></div>`;
  function facilityOverview(section) {
    const units = [...section.matchAll(/class="unit-no">([^<]+)<\/div>\s*<div><h3>([^<]+)<\/h3><p class="entity">([\s\S]*?)<\/p>/g)];
    const capacities = [...section.matchAll(/class="unit-cap">([\d,]+) <small>([^<]+)<\/small>/g)];
    if (units.length !== 4 || capacities.length !== 2) throw new Error('Reference facility overview changed; expected four units and two group capacities.');
    const heading = section.match(/<h2>([^<]+)<\/h2>/)?.[1] ?? 'Four units. One group.';
    const factory = '<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M4 27V13l8 4v-6l9 5V5h5l2 22H4Z"/><path d="M9 22h2m5 0h2m5 0h2M21 9h5"/></svg>';
    return `<section class="sec facilities" aria-labelledby="facilities-heading"><div class="wrap">
      <div class="facilities-heading reveal"><div><span class="kicker">Infrastructure</span><h2 id="facilities-heading">${heading}</h2></div><p>Four manufacturing units across Howrah and Purba Bardhaman, West Bengal.</p></div>
      <div class="facilities-grid">${units.map((unit, index) => {
        const [entity, address] = unit[3].split('<br>');
        return `<a class="facility-card reveal d${index}" href="/infrastructure#unit-${index + 1}" aria-label="Explore Unit ${unit[1]} — ${entity}">
          <div class="facility-card-top"><span class="facility-number">Unit ${unit[1]}</span><span class="facility-icon">${factory}</span></div>
          <h3>${unit[2]}</h3><p class="facility-company">${entity}</p>
          <div class="facility-card-bottom"><p>${address}</p><span class="facility-arrow" aria-hidden="true">↗</span></div>
        </a>`;
      }).join('')}</div>
      <div class="facility-summary reveal"><div class="facility-summary-label"><span class="kicker">Combined strength</span><h3>Group production capacity</h3></div>
        ${capacities.map(capacity => `<div class="facility-metric"><p><strong>${capacity[1]}</strong><span>MTPA</span></p><span>${capacity[2].replace(/^MTPA /, '')}</span></div>`).join('')}
      </div>
      <div class="facilities-actions reveal"><p>For unit-specific product lines and capacities, <a href="/contact">speak to our team</a>.</p><a class="facility-cta" href="/infrastructure">Explore our infrastructure <span aria-hidden="true">→</span></a></div>
    </div></section>`;
  }
  function prepare(markup, page) {
    let photoIndex = 0;
    if (page === 'home') markup = markup.replace(/<section class="sec units has-bg"[^>]*>[\s\S]*?<\/section>/, facilityOverview);
    if (page === 'infrastructure') {
      let unitIndex = 0;
      markup = markup.replace(/<div class="ublock reveal">/g, () => `<div class="ublock reveal" id="unit-${++unitIndex}">`);
    }
    let out = markup
      .replace(/<section class="sec testi">[\s\S]*?<\/section>/g, '')
      .replace(/<p class="pending-note[^>]*>[\s\S]*?<\/p>/g, '')
      .replace(/<p class="pending[^>]*>[\s\S]*?<\/p>/g, '')
      .replace(/<li class="[^"]*pending"[^>]*>[\s\S]*?<\/li>/g, '')
      .replace(/<div class="reveal d3 pending"[^>]*>[\s\S]*?<\/div>/g, '')
      .replace(/<div class="photo-ph[^>]*>[\s\S]*?<\/div>/g, match => {
        const index = page === 'product' ? [11, 5, 6, 4, 11][photoIndex++ % 5] : [0, 2, 3, 7, 10][photoIndex++ % 5];
        return picture(gallery[index], match.includes('reveal') ? 'reveal' : '');
      })
      .replace(/<a class="prod-card([^"<>]*)" href="#page-product">([\s\S]*?)<\/a>/g, (_, cls, content) => {
        const product = identifyProduct(content.match(/<h3>([\s\S]*?)<\/h3>/)[1]);
        content = content.replace(/<div class="prod-img[^>]*>[\s\S]*?<\/div>/, picture({ src: product.image, alt: product.imageAlt }, 'prod-img'));
        return `<a class="prod-card${cls}" href="/product?type=${product.slug}">${content}</a>`;
      })
      .replace(/<a href="#page-product">([\s\S]*?)<\/a>/g, (_, label) => `<a href="/product?type=${identifyProduct(label).slug}">${label}</a>`)
      .replace(/<td class="pending"[^>]*>[\s\S]*?<\/td>/g, '<td>Contact us for details</td>')
      .replace(/<span class="pending"[^>]*>[\s\S]*?<\/span><\/span>/g, '<span>Contact us for details</span>')
      .replace(/<p class="makes pending">[\s\S]*?<\/p>/g, '<p class="makes">Contact us for product allocation</p>')
      .replace(/<div class="unit-cap pending">[\s\S]*?<\/div>/g, '<div class="unit-cap">On enquiry<small>Unit capacity details</small></div>')
      .replace(/<span class="pending-tag">[\s\S]*?<\/span>/g, '')
      .replace(/\bpending\b/g, '')
      .replace(/Product · template shown for one line/g, 'Product')
      .replace(/Unit — to confirm/g, 'Pratap Group')
      .replace(/Download Company Brochure \(PDF\)/g, 'Request company brochure')
      .replace(/href="#page-([a-z]+)"/g, (_, route) => `href="${route === 'home' ? '/' : route === 'product' ? '/product?type=block-bottom-bags' : `/${route}`}"`)
      .replace(/<a href="\/contact">sales@pratapgroup.com<\/a>/g, '<a href="mailto:sales@pratapgroup.com">sales@pratapgroup.com</a>')
      .replace(/<a href="\/contact">033 6614 1201 \/ 02 \/ 03<\/a>/g, '<a href="tel:+913366141201">033 6614 1201 / 02 / 03</a>')
      .replace(/<table class="dtable([^"<>]*)"([^>]*)>([\s\S]*?)<\/table>/g, '<div class="table-scroll" tabindex="0" role="region" aria-label="Scrollable data table"><table class="dtable$1"$2>$3</table></div>');
    if (page === 'contact') {
      out = out.replace('<div class="form-grid reveal d1">', '<form class="form-grid reveal d1" data-enquiry>')
        .replace(/<\/div>\s*<\/div>\s*<\/div>\s*<div>\s*<span class="kicker reveal">Reach us/, '</div></form></div><div><span class="kicker reveal">Reach us')
        .replace(/id="f-(name|company|phone|email|prod|msg)"/g, (_, name) => `id="f-${name}" name="${name}"${['name', 'email', 'msg'].includes(name) ? ' required' : ''}`)
        .replace('<option>Select a product line</option>', '<option value="">Select a product line</option>')
        .replace('<button class="btn btn-solid" type="button">Send enquiry</button>', '<button class="btn btn-solid" type="submit">Prepare email enquiry</button><p class="enquiry-status" role="status">Opens your email app with your enquiry. Send it there to contact our sales team.</p>')
        .replace(/<div class="map-ph reveal">[\s\S]*?<\/div>/, '<a class="map-link reveal" href="https://www.google.com/maps/search/?api=1&amp;query=Continental+Chambers+15A+Hemanta+Basu+Sarani+Kolkata+700001" target="_blank" rel="noopener noreferrer"><span class="kicker">Visit our registered office</span><h3>Continental Chambers, Kolkata</h3><span>15A Hemanta Basu Sarani, 5th Floor · Kolkata 700 001</span><b>Open in Google Maps ↗</b></a>');
    }
    // Only repository-owned, inert markup reaches dangerouslySetInnerHTML.
    if (/<\s*(script|iframe|object|embed)\b|\son[a-z]+\s*=|(?:href|src)\s*=\s*["']\s*javascript:/i.test(out)) throw new Error('Executable markup is not allowed in reference content.');
    // Section spacing and surfaces belong to the site's shared layout system.
    // Keep content styles and hero photography, but discard preview-only bands.
    out = out.replace(/<section\b([^>]*)>/g, (_, attributes) => {
      const cleaned = attributes.replace(/style="([^"]*)"/g, (_, style) => {
        const declarations = style.split(';').filter(declaration => {
          const property = declaration.split(':')[0].trim();
          return !/^(?:background|background-color|padding(?:-.+)?|border(?:-.+)?)$/.test(property);
        }).filter(Boolean);
        return declarations.length ? `style="${declarations.join(';')}"` : '';
      });
      return `<section${cleaned}>`;
    });
    return theme(out);
  }
  const pages = Object.fromEntries(Object.entries(rawPages).map(([key, markup]) => [key, prepare(markup, key)]));
  const footer = prepare(html.match(/<footer class="f3">[\s\S]*?<\/footer>/)[0], 'footer');
  // CSS nesting scopes every reference layout rule to this site component.
  const css = `@layer reference-layout { .reference-site {\n${theme(layout).replace(/:root/g, '&').replace(/(^|\n)(\s*)(?:body|html)(?=[{:\s])/g, '$1$2&').replace(/\.js /g, '').replace(/\.reveal\{opacity:0;[^}]+\}/g, '.reveal{opacity:1}')}\n} }`;
  return { pages, footer, css, products, assets };
}

export default function referenceContent() {
  const virtualId = 'virtual:pratap-content';
  let file;
  let base;
  let compiled;
  let building = false;
  const compile = () => compiled = compileReference(readFileSync(file, 'utf8'), base);
  return {
    name: 'pratap-reference-content',
    configResolved(config) { file = resolve(config.root, 'Pratap-Group-Website-Preview_1.html'); base = config.base; building = config.command === 'build'; },
    buildStart() { this.addWatchFile(file); compile(); },
    resolveId(id) { if (id === virtualId) return `\0${virtualId}`; },
    load(id) {
      if (id !== `\0${virtualId}`) return;
      this.addWatchFile(file);
      const { assets, ...content } = compiled ?? compile();
      if (building) for (const [fileName, asset] of assets) this.emitFile({ type: 'asset', fileName, source: asset.bytes });
      return `export default ${JSON.stringify(content)};`;
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const asset = (compiled ?? compile()).assets.get((req.url ?? '').split('?')[0].replace(base, ''));
        if (!asset) return next();
        res.setHeader('Content-Type', `image/${asset.type}`);
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        res.end(asset.bytes);
      });
    },
    handleHotUpdate(ctx) {
      if (ctx.file !== file) return;
      compile();
      const mod = ctx.server.moduleGraph.getModuleById(`\0${virtualId}`);
      if (mod) ctx.server.moduleGraph.invalidateModule(mod);
      ctx.server.ws.send({ type: 'full-reload' });
      return [];
    },
  };
}
