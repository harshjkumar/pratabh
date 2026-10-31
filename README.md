# Pratap Group

React / TanStack Start / Vite website using the existing Archivo and JetBrains
Mono fonts, neutral backgrounds, teal accents, blue buttons, and GSAP motion.

## Content and layout

`Pratap-Group-Website-Preview_1.html` is the content source. The Vite plugin in
`scripts/reference-content.mjs` reads it on startup/build and reloads the site
when it changes. It extracts all six page sections, scopes the layout CSS, maps
reference colors/fonts to existing brand tokens, and emits deduplicated images
as cacheable assets. No preview scripts or embedded fonts are executed.

- `src/routes/`: Home, About, Infrastructure, Products, Contact, and Product.
- `src/components/site/reference-site.tsx`: navigation, rendering, animations,
  gallery, enquiry behavior, and product detail views.
- `src/components/site/reference-site.css`: branding and responsive overrides.
- `src/styles.css`: existing global theme and typography tokens.
- `src/components/site/shell.tsx`: legacy components, retained for reuse.

Six product links use `/product?type=<slug>`. Block Bottom Bags uses the full
source detail template; other products use their own source catalogue content.
Missing specifications remain available on enquiry. Editorial preview notes and
empty testimonial placeholders are omitted. Brochure images fill photo slots;
original photography and final spec sheets can be supplied later.

## Development

With dependencies installed, run `npm run dev`. Run `npm run build` for production.
Include the source HTML in the checkout used for builds.

The enquiry form validates fields and prepares an email draft; the visitor sends
it from their email app. No server-side email delivery is configured. The brochure
CTA requests the brochure because no downloadable PDF was supplied. The map link
opens the registered office in Google Maps.
