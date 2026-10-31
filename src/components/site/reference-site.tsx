import { Link, useRouter } from '@tanstack/react-router';
import { useEffect, useRef, useState, type MouseEvent } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import content, { type ReferenceProduct } from 'virtual:pratap-content';
import logo from '@/assets/logo-BWnST3z9.png';
import './reference-site.css';

export { content };
type Page = keyof typeof content.pages;
const navigation = [
  ['/', 'Home', 'home'], ['/about', 'About Us', 'about'],
  ['/infrastructure', 'Infrastructure', 'infrastructure'],
  ['/products', 'Products', 'products'], ['/contact', 'Contact', 'contact'],
] as const;

export function referenceHead(page: Page, product?: ReferenceProduct) {
  const titles = { home: 'Pratap Group — Woven Packaging Since 1984', about: 'About Pratap Group — In Manufacturing Since 1968', infrastructure: 'Infrastructure — Four Units, Every Process In-house', products: 'Six Product Lines — Pratap Group', product: `${product?.title ?? 'Block Bottom Bags'} — Pratap Group`, contact: 'Contact Pratap Group — Kolkata Sales Office' };
  const description = product?.description ?? 'Pratap Group manufactures PP/HDPE woven fabrics and bags, block bottom bags, BOPP bags, jumbo bags and PP spunbond non-woven fabric across four units in West Bengal.';
  return { meta: [{ title: titles[page] }, { name: 'description', content: description }, { property: 'og:title', content: titles[page] }, { property: 'og:description', content: description }] };
}

function useReferenceMotion(ref: React.RefObject<HTMLDivElement | null>, identity: string) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      root.querySelectorAll<HTMLElement>('.reveal').forEach(el => {
        const delay = Number(el.className.match(/\bd(\d)\b/)?.[1] ?? 0) * 0.08;
        gsap.fromTo(el, { autoAlpha: 0, y: 40 }, {
          autoAlpha: 1, y: 0, duration: 0.9, delay, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 94%', once: true, onEnter: () => el.classList.add('in') },
        });
      });
      root.querySelectorAll<HTMLElement>('.reference-photo img, .person img').forEach(el => {
        gsap.fromTo(el, { scale: 1.15 }, { scale: 1, duration: 1.6, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 95%', once: true } });
      });
      root.querySelectorAll<HTMLElement>('[data-count]').forEach(el => {
        const target = Number(el.dataset.count);
        if (target === 1968) return;
        const value = { count: 0 };
        gsap.to(value, { count: target, duration: 1.4, ease: 'power3.out', onUpdate: () => { el.textContent = Math.round(value.count).toLocaleString('en-IN'); }, scrollTrigger: { trigger: el, start: 'top 95%', once: true } });
      });
      const hero = root.querySelector('.hero');
      if (hero) gsap.to(hero.querySelector('.hero-in'), { y: 75, opacity: 0.25, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
      return () => root.querySelectorAll<HTMLElement>('[data-count]').forEach(el => { el.textContent = el.dataset.count === '1968' ? '1968' : Number(el.dataset.count).toLocaleString('en-IN'); });
    }, root);
    const refresh = () => ScrollTrigger.refresh();
    root.querySelectorAll('img').forEach(img => img.addEventListener('load', refresh));
    const resize = new ResizeObserver(refresh);
    resize.observe(root);

    const track = root.querySelector<HTMLElement>('#galTrack');
    const bar = root.querySelector<HTMLElement>('#galBar');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let timer: ReturnType<typeof setInterval> | undefined;
    let hovered = false;
    const stop = () => clearInterval(timer);
    const go = (direction: number) => {
      if (!track) return;
      const max = track.scrollWidth - track.clientWidth;
      const step = (track.firstElementChild?.getBoundingClientRect().width ?? 520) + 20;
      const left = direction > 0 && track.scrollLeft >= max - 4 ? 0 : direction < 0 && track.scrollLeft <= 4 ? max : track.scrollLeft + direction * step;
      track.scrollTo({ left, behavior: reduced.matches ? 'instant' : 'smooth' });
    };
    const start = () => {
      stop();
      if (!reduced.matches && !document.hidden && !hovered && !track?.contains(document.activeElement)) timer = setInterval(() => go(1), 3800);
    };
    const enter = () => { hovered = true; stop(); };
    const leave = () => { hovered = false; start(); };
    const progress = () => { if (track && bar) bar.style.width = `${8 + 92 * track.scrollLeft / Math.max(1, track.scrollWidth - track.clientWidth)}%`; };
    const galleryClick = (event: Event) => {
      const button = (event.target as Element).closest<HTMLElement>('[data-gal]');
      if (button) { go(Number(button.dataset.gal)); start(); }
    };
    if (track) {
      track.tabIndex = 0;
      track.setAttribute('aria-label', 'Plant and machinery image gallery');
      track.addEventListener('scroll', progress, { passive: true });
      track.addEventListener('mouseenter', enter);
      track.addEventListener('mouseleave', leave);
      track.addEventListener('focusin', stop);
      track.addEventListener('focusout', start);
      root.addEventListener('click', galleryClick);
      document.addEventListener('visibilitychange', start);
      reduced.addEventListener('change', start);
      progress(); start();
    }
    const form = root.querySelector<HTMLFormElement>('[data-enquiry]');
    const submit = (event: Event) => {
      event.preventDefault();
      if (!form?.reportValidity()) return;
      const data = new FormData(form);
      const body = ['name', 'company', 'phone', 'email', 'prod', 'msg'].map(key => `${{ name: 'Name', company: 'Company', phone: 'Phone', email: 'Email', prod: 'Product', msg: 'Message' }[key]}: ${data.get(key) ?? ''}`).join('\n');
      window.location.href = `mailto:sales@pratapgroup.com?subject=${encodeURIComponent(`Product enquiry: ${data.get('prod') || 'Pratap Group'}`)}&body=${encodeURIComponent(body)}`;
      const status = form.querySelector('[role="status"]');
      if (status) status.textContent = 'Your email draft is ready. Send it from your email app, or write directly to sales@pratapgroup.com.';
    };
    form?.addEventListener('submit', submit);
    return () => {
      stop(); media.revert(); resize.disconnect();
      root.querySelectorAll('img').forEach(img => img.removeEventListener('load', refresh));
      track?.removeEventListener('scroll', progress);
      track?.removeEventListener('mouseenter', enter);
      track?.removeEventListener('mouseleave', leave);
      track?.removeEventListener('focusin', stop);
      track?.removeEventListener('focusout', start);
      root.removeEventListener('click', galleryClick);
      document.removeEventListener('visibilitychange', start);
      reduced.removeEventListener('change', start);
      form?.removeEventListener('submit', submit);
    };
  }, [ref, identity]);
}

export function ReferenceSite({ page, product }: { page: Page; product?: ReferenceProduct }) {
  const root = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const identity = `${page}:${product?.slug ?? ''}`;
  useReferenceMotion(root, identity);
  useEffect(() => { setOpen(false); }, [identity]);
  const followLink = (event: MouseEvent<HTMLDivElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = (event.target as Element).closest<HTMLAnchorElement>('a[href]');
    if (!anchor || anchor.target || anchor.download || !anchor.getAttribute('href')?.startsWith('/')) return;
    event.preventDefault();
    void router.navigate({ href: anchor.getAttribute('href')! });
  };
  return (
    <div className="reference-site" ref={root}>
      <style>{content.css}</style>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <nav className="site-nav" aria-label="Main navigation">
        <div className="wrap nav-in">
          <Link className="logo" to="/" aria-label="Pratap Group home"><img className="logo-img" src={logo} alt="Pratap Group" /></Link>
          <ul className="nav-links">{navigation.map(([to, label, key]) => <li key={to}><Link to={to} className={page === key || (page === 'product' && key === 'products') ? 'on' : ''}>{label}</Link>{key === 'products' && <div className="dd">{content.products.map(p => <Link key={p.slug} to="/product" search={{ type: p.slug }}>{p.title}</Link>)}</div>}</li>)}</ul>
          <a className="nav-phone mono" href="tel:+913366141201">033 6614 1201</a>
          <button className="menu-toggle" type="button" aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>{open ? 'Close −' : 'Menu +'}</button>
        </div>
        {open && <div id="mobile-navigation" className="mobile-navigation">{navigation.map(([to, label]) => <Link to={to} key={to} onClick={() => setOpen(false)}>{label}</Link>)}</div>}
      </nav>
      <div onClick={followLink}>
        <main id="main-content" key={identity} tabIndex={-1}>
          {page === 'product' && product && product.slug !== 'block-bottom-bags'
            ? <ProductDetail product={product} />
            : <div dangerouslySetInnerHTML={{ __html: content.pages[page] }} />}
        </main>
        <div dangerouslySetInnerHTML={{ __html: content.footer }} />
      </div>
    </div>
  );
}

function ProductDetail({ product: p }: { product: ReferenceProduct }) {
  return <>
    <header className="page-head has-bg" style={{ backgroundImage: `url(${p.image})` }}><div className="wrap">
      <span className="crumb"><a href="/">Home</a> / <a href="/products">Products</a> / {p.title}</span>
      <span className="kicker">Product</span><h1>{p.title}</h1><p>{p.description}</p>
    </div></header>
    <section className="sec"><div className="wrap">
      <div className="spec-grid"><div>
        <span className="kicker reveal">Overview</span><p className="product-lede reveal">{p.description}</p>
        <h3 className="detail-heading reveal">Specifications</h3>
        <div className="table-scroll"><table className="dtable reveal"><tbody>
          <tr><td className="mono-cell">Product</td><td>{p.title}</td></tr>
          <tr><td className="mono-cell">Production</td><td>{p.note}</td></tr>
          {p.slug === 'non-woven-fabric' && <><tr><td className="mono-cell">Fabric weight</td><td>15–180 GSM</td></tr><tr><td className="mono-cell">Width</td><td>Up to 3,200 mm</td></tr><tr><td className="mono-cell">Colours</td><td>25 colours</td></tr></>}
          <tr><td className="mono-cell">Detailed specifications</td><td>Contact our sales team for sizes, specifications and availability.</td></tr>
        </tbody></table></div>
      </div><div>
        <div className="reference-photo reveal"><img src={p.image} alt={p.imageAlt} /></div>
        <div className="made-at reveal"><span className="u-label">Manufactured by</span><b>Pratap Group</b><p>{p.note}</p><a href="/infrastructure">See the machinery →</a></div>
        <div className="enquiry-card reveal"><span className="kicker">Enquiries</span><p><a href="tel:+913366141201">033 6614 1201 / 02 / 03</a><br /><a href="mailto:sales@pratapgroup.com">sales@pratapgroup.com</a></p><a className="btn btn-solid" href="/contact">Send an enquiry</a></div>
      </div></div>
      <h3 className="detail-heading reveal">Related products</h3><div className="prod-grid">{content.products.filter(other => other.slug !== p.slug).slice(0, 3).map(other => <a key={other.slug} className="prod-card reveal" href={`/product?type=${other.slug}`}><div className="prod-body"><h3>{other.title}</h3><span className="prod-unit">{other.note}</span><span className="prod-link">View details →</span></div></a>)}</div>
    </div></section>
  </>;
}
