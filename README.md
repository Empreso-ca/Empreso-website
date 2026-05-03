# empreso — Next.js App Router

A pixel-styled replica of the empreso landing site, built with Next.js 14 (App Router), Tailwind CSS, and TypeScript.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Structure

```
app/
  layout.tsx          # Root layout (Navbar + Footer)
  page.tsx            # Home (Hero, LogoCloud, Careers, Community)
  about/page.tsx
  pricing/page.tsx
  contact/page.tsx
  solutions/page.tsx
  globals.css         # Design tokens + grid background
components/
  landing/            # Navbar, Hero, LogoCloud, Careers, Community, Footer
  ui/                 # Button, Card, Input, Textarea
lib/
  utils.ts            # cn() helper
tailwind.config.ts
```

## Customizing

- Design tokens (colors, radii) live as HSL CSS variables in `app/globals.css`.
- All Tailwind theme extensions live in `tailwind.config.ts`.
- UI primitives (`Button`, `Card`, `Input`, `Textarea`) accept Tailwind class overrides via `cn()`.
