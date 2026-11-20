# Livegang gosmartfinance.com

De site is af en technisch gecontroleerd (`npm run check`). Wat nog moet gebeuren vóór en tijdens de livegang.

## 1. Inhoud die nog van Sakhi moet komen

Deze onderdelen staan nu bewust NIET op de site, omdat de feiten ontbreken. Er is niets verzonnen.

- [ ] Portretfoto (liggend of 4:5, rustige achtergrond). Vervangt "Foto volgt" op Home en Over.
- [ ] Logo als SVG. Vervangt het tijdelijke beeldmerk in `src/components/LogoMark.astro`.
- [ ] FAQ-antwoorden: AVG/dataverwerking, boekhoudpakketten, technische kennis, wie boekt, prijs en doorlooptijd. Toevoegen in `src/components/home/Faq.astro`.
- [ ] Per dienst: "Werkt met" (pakketten) en hoe de output eruitziet. Toevoegen in `src/data/services.ts`.
- [ ] Bevestigen: reactietijd "binnen 1 werkdag", telefoonnummer en KvK-nummer op de site (nu niet getoond).
- [ ] Testimonial: alleen terugzetten als hij echt is en met naam mag.
- [ ] Privacyverklaring (`src/pages/privacy.astro`) laten controleren. Het is een concept op basis van de huidige opzet: alleen een contactformulier via Netlify, geen tracking-cookies.

## 2. Accounts (zelf aanmaken)

- [ ] GitHub: lege, privé repository `gosmartfinance-site`. Daarna: `git remote add origin <url>` en `git push -u origin main`.
- [ ] Netlify: "Add new site" → "Import from GitHub" → deze repository. Build-instellingen komen uit `netlify.toml`.
- [ ] Netlify → Forms: formulierdetectie aanzetten, en een e-mailmelding naar info@gosmartfinance.com instellen.

## 3. Testen op de Netlify-preview (vóór het domein omgaat)

- [ ] Mobiel: iPhone (Safari) en Android (Chrome). Menu, diensten, demo-filters, formulier.
- [ ] Een echt testbericht versturen via /contact en controleren dat het aankomt.
- [ ] Lighthouse (Chrome DevTools) op Home en Demo, mobiel. Doel: 95 of hoger op alle vier de scores.
- [ ] Toetsenbord: met Tab door Home, Demo en Contact. Focusring overal zichtbaar.
- [ ] "Beperk beweging" aanzetten in Windows/macOS: hero en secties staan stil.

## 4. Live zetten

- [ ] `src/config.ts`: `indexable: true`
- [ ] `netlify.toml`: de regel `X-Robots-Tag = "noindex, nofollow"` verwijderen
- [ ] Netlify → Domain management: `www.gosmartfinance.com` en `gosmartfinance.com` toevoegen
- [ ] Bij de domeinregistrar: alleen de A-record en de CNAME (www) naar Netlify. **MX-records niet aanraken** (e-mail).
  Staat het domein bij JouwWeb geregistreerd? Vraag dan eerst een verhuiscode aan.
- [ ] HTTPS controleren (Netlify regelt het certificaat automatisch)
- [ ] Oude adressen testen: /backgrount → /over en /contact-formulier → /contact
- [ ] Google Search Console: domein verifiëren, sitemap `https://www.gosmartfinance.com/sitemap.xml` indienen
- [ ] JouwWeb pas opzeggen als de nieuwe site een paar weken stabiel draait
