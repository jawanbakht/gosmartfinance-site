# Go Smart finance website

Nieuwe site voor gosmartfinance.com. Astro + Tailwind, hosting op Netlify.

## Lokaal draaien

```
npm install
npm run dev      # http://localhost:4321
npm run build    # statische site in dist/
```

## Waar staat wat

- `src/config.ts`: naam, e-mail, menu, accentkleur, en `indexable` (pas op `true` bij livegang)
- `src/styles/global.css`: design-tokens (kleuren, fonts, spacing)
- `src/components/`: Nav, Footer, Button, KpiTile, SampleBadge
- `src/pages/`: pagina's
- `public/stijlgids/`: stijlgids van fase 0
- `netlify.toml`: build, redirects van de oude JouwWeb-adressen, noindex tot livegang

## Bij livegang

1. `indexable: true` in `src/config.ts`
2. `X-Robots-Tag` weghalen uit `netlify.toml`
3. DNS: alleen A/CNAME naar Netlify. MX-records (e-mail) niet aanraken.
