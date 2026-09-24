# JuggleHUB Website

Astro static site for JuggleHUB — a coworking space with integrated childcare in Berlin. Content managed via Sveltia CMS.

## Stack

- **Astro 4** — static site generator
- **Tailwind CSS** — styling
- **Sveltia CMS** — git-based CMS at `/admin`
- **marked** — markdown rendering for content pages

## Project structure

```
src/
  content/          # Content collections (one JSON file per page, both locales)
    home/index.json
    about/index.json
    ourstory/index.json
    faq/index.json
    contact/index.json
    press/index.json
    team/index.json
    coworking/index.json
    eventspace/index.json
    childcare/index.json
    virtualoffice/index.json
    pages/          # General content pages (AGB, Datenschutz, Impressum, …)
      agb.json
      datenschutz.json
      impressum.json
  pages/
    index.astro                        # Redirects / → /de/
    [lang]/
      index.astro                      # Home
      [slug].astro                     # General content pages
      about/
        index.astro
        our-story.astro
        faq.astro
        contact.astro
        press.astro
        team.astro
      coworking/index.astro
      event-space/index.astro
      flexible-childcare/index.astro
      virtual-office/index.astro
  layouts/Layout.astro
  components/
    Header.astro
    Footer.astro
public/
  admin/
    index.html      # Sveltia CMS entry point
    config.yml      # CMS configuration
```

## i18n

All content files use Sveltia CMS's **single_file** i18n structure — both locales in one JSON with `de` and `en` as top-level keys:

```json
{
  "de": { "headline": "Über uns" },
  "en": { "headline": "About Us" }
}
```

Astro pages live under `src/pages/[lang]/` and read the correct locale at build time via `entry.data[lang]`. Supported locales: `de` (default), `en`.

## Adding a new general content page

1. Create `src/content/pages/your-slug.json` with `{ "de": { "title": "...", "body": "..." }, "en": { ... } }`
2. It will automatically appear at `/de/your-slug/` and `/en/your-slug/`

## Dev

```bash
npm install
npm run dev       # http://localhost:4321
npm run build
npm run preview
```

## Contact forms on Netlify

The homepage, event-space, and virtual-office forms use Netlify Forms. They are
rendered as static HTML with separate form names (`contact`, `event-space`, and
`virtual-office`), and submissions include a `source` field for the page and
language. No email credentials or paid email API are needed in the site.

To deliver submissions to an inbox:

1. In the Netlify site dashboard, go to **Forms** and enable form detection.
2. Deploy the site. Confirm the three form names appear in **Forms**.
3. Under **Forms → Submission notifications**, add an **Email notification** for
   all forms and enter the desired inbox address.
4. Submit a test message on the live site from each form and verify both the
   inbox notification and the verified submission in Netlify.

Netlify handles submissions only after deployment; forms will not deliver email
from `astro dev` or `astro preview`. The forms include a honeypot field for basic
spam protection. Check your Netlify account's plan before relying on current
pricing: credit-based plans have free, unlimited form submissions, whereas
legacy plans can have monthly limits or overage charges.

## CMS

Visit `/admin` in the browser. Currently using `test-repo` backend (no auth, local only). To connect to a real repo, update `backend` in `public/admin/config.yml`:

```yaml
backend:
  name: github
  repo: your-org/jugglehub-website
  branch: main
```

## Brand

| Token | Value |
|---|---|
| Yellow | `#E2FF04` |
| Cream | `#FAFFF0` |
| Dark | `#1a1a1a` |
