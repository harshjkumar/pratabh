import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";

import logo from "@/assets/logo-BWnST3z9.png";

export function Logo({ className = "" }: { className?: string; dark?: boolean }) {
  return (
    <Link to="/" className={`inline-flex items-center leading-none ${className}`}>
      <img src={logo} alt="Pratap Group" className="h-9 md:h-11 w-auto" />
    </Link>
  );
}

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/products", label: "Products" },
  { to: "/infrastructure", label: "Infrastructure" },
  { to: "/contact", label: "Contact" },
];

const leftNav = [
  { to: "/about", label: "About" },
  { to: "/infrastructure", label: "Infrastructure" },
];
const rightNav = [
  { to: "/products", label: "Our Products" },
  { to: "/contact", label: "Contact" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const linkCls = "text-[11px] font-semibold uppercase tracking-[0.22em] hover:opacity-60 transition-opacity";
  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 px-5 md:px-10 py-5 md:py-6 transition-all duration-500 ${scrolled ? "bg-background/85 backdrop-blur-md" : ""}`}>
        <div className="hidden md:grid grid-cols-3 items-center">
          <nav className="flex items-center gap-10 justify-start">
            {leftNav.map((n) => (
              <Link key={n.to} to={n.to} className={linkCls} activeProps={{ className: "opacity-100" }} inactiveProps={{ className: "opacity-70" }}>
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="flex justify-center">
            <Logo />
          </div>
          <nav className="flex items-center gap-10 justify-end">
            {rightNav.map((n) => (
              <Link key={n.to} to={n.to} className={linkCls} activeProps={{ className: "opacity-100" }} inactiveProps={{ className: "opacity-70" }}>
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex md:hidden items-center justify-between">
          <Logo />
          <button aria-label="Menu" onClick={() => setOpen((v) => !v)} className="flex flex-col gap-[5px] p-1">
            <span className="block w-6 h-[2px] bg-foreground" />
            <span className="block w-6 h-[2px] bg-foreground" />
            <span className="block w-6 h-[2px] bg-foreground" />
          </button>
        </div>
      </header>
      {open && (
        <div className="fixed inset-0 z-40 bg-background pt-24 px-6 md:hidden">
          <ul className="space-y-6">
            {[...leftNav, ...rightNav].map((n) => (
              <li key={n.to}>
                <Link onClick={() => setOpen(false)} to={n.to} className="font-display font-light uppercase text-4xl tracking-tight">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

export function MicroLabel({ children }: { children: ReactNode }) {
  return (
    <span className="text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: "var(--color-teal)" }}>
      {children}
    </span>
  );
}

export function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function Footer() {
  return (
    <footer className="pt-20 md:pt-28 pb-10 bg-[#f2ede4] text-foreground border-t border-foreground/10">
      <div className="px-5 md:px-10 mb-16 md:mb-20">
        <div className="grid md:grid-cols-12 gap-12 md:gap-10 pb-16 border-b border-foreground/15">
          <div className="md:col-span-5 flex flex-col justify-between">
            <div>
              <Link to="/" className="inline-flex items-center">
                <img src={logo} alt="Pratap Group" className="h-14 md:h-16 w-auto" />
              </Link>
              <p className="mt-6 text-sm md:text-base leading-relaxed max-w-md opacity-85">
                Manufacturing excellence in HDPE/PP woven packaging, non-woven fabrics, PE liner bags & aluminium composite panels since 1997.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-foreground/10 flex flex-col gap-3">
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] opacity-60">Direct Inquiries</span>
              <a href="mailto:info@Pratap.in" className="text-sm md:text-base font-semibold uppercase tracking-[0.15em] border-b border-foreground/40 pb-1 self-start hover:opacity-70 transition-opacity">
                info@Pratap.in
              </a>
              <p className="text-xs uppercase tracking-[0.12em] opacity-75 font-mono">+91 33 2684 1354</p>
            </div>
          </div>

          <div className="md:col-span-2 md:col-start-7">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] opacity-50 mb-5">Navigation</p>
            <ul className="space-y-3 text-xs md:text-sm font-medium uppercase tracking-[0.1em]">
              <li><Link to="/" className="hover:opacity-60 transition-opacity">Home</Link></li>
              <li><Link to="/about" className="hover:opacity-60 transition-opacity">About Us</Link></li>
              <li><Link to="/products" className="hover:opacity-60 transition-opacity">Products</Link></li>
              <li><Link to="/infrastructure" className="hover:opacity-60 transition-opacity">Infrastructure</Link></li>
              <li><Link to="/contact" className="hover:opacity-60 transition-opacity">Contact</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] opacity-50 mb-5">Product Portfolio</p>
            <ul className="space-y-3 text-xs md:text-sm font-medium uppercase tracking-[0.08em] opacity-85">
              <li className="hover:opacity-100 transition-opacity"><Link to="/products">Block Bottom Bags</Link></li>
              <li className="hover:opacity-100 transition-opacity"><Link to="/products">PP / HDPE Woven Fabrics</Link></li>
              <li className="hover:opacity-100 transition-opacity"><Link to="/products">PP / HDPE Woven Bags</Link></li>
              <li className="hover:opacity-100 transition-opacity"><Link to="/products">BOPP Laminated Bags</Link></li>
              <li className="hover:opacity-100 transition-opacity"><Link to="/products">PP Woven Handle Bags</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] opacity-50 mb-5">Headquarters</p>
            <p className="text-xs md:text-sm uppercase tracking-[0.08em] opacity-80 leading-relaxed font-medium">
              Vill. Haripur<br />
              P.O. Panchla<br />
              Howrah 711322<br />
              West Bengal, India
            </p>
            <div className="mt-6 pt-4 border-t border-foreground/10">
              <span className="inline-block text-[10px] font-semibold uppercase tracking-[0.2em] px-2.5 py-1 bg-foreground/10 rounded-sm">
                ISO 9001:2015
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-5 md:px-10 text-[10px] uppercase tracking-[0.22em] opacity-60">
        <span>© {new Date().getFullYear()} Pratap Group. All Rights Reserved.</span>
        <span>Panchla, Howrah · West Bengal, India</span>
      </div>
    </footer>
  );
}


export function PageHero({ label, title, subtitle, image }: { label: string; title: ReactNode; subtitle?: string; image: string }) {
  return (
    <section className="relative h-[75vh] min-h-[520px] w-full overflow-hidden">
      <motion.img
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        src={image}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/10 to-background/60" />
      <div className="relative z-10 h-full flex flex-col justify-end px-5 md:px-10 pb-14 md:pb-20">
        <Reveal>
          <MicroLabel>{label}</MicroLabel>
        </Reveal>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 font-display font-light uppercase leading-[0.95] tracking-[-0.02em] text-[8vw] md:text-[4.2vw] max-w-[95%]"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mt-6 max-w-xl text-sm md:text-base leading-relaxed opacity-80"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  );
}
