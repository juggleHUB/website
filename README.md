# JuggleHUB Website

Astro static site for JuggleHUB — a coworking space with integrated childcare in Berlin. Content is managed through Pages CMS.

## Stack

- **Astro 4** — static site generator
- **Tailwind CSS** — styling
- **Pages CMS** — hosted Git-based editor, configured in `.pages.yml`
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
  images/           # Images uploaded or selected through Pages CMS
.pages.yml          # Pages CMS configuration
```

## i18n

All content files store both locales in one JSON file, with `de` and `en` as top-level keys:

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

The editor is hosted at [app.pagescms.org](https://app.pagescms.org/), not at `/admin`.
Its `.pages.yml` configuration exposes all 15 content files as editable pages,
with German and English sections. It also maps the media library to
`public/images`, saving public URLs as `/images/...`.

To activate it, the repository owner must sign in to Pages CMS with GitHub and
install the Pages CMS GitHub App for **this repository only**. An editor with
GitHub repository write access can then sign in to Pages CMS; alternatively,
the owner can invite an editor by email within Pages CMS without granting
GitHub repository access. Changes are committed to GitHub, triggering the
normal Netlify build.

Editors can upload images in the media library and select them in page image
fields (hero photos, team portraits, room photos, cards, and icons). Images
used by both languages have separate `de` and `en` fields; update both if the
same image should appear on both versions. Decorative `/woosh/` SVG assets and
the site logo are design assets, not CMS image fields.

## Brand

| Token | Value |
|---|---|
| Yellow | `#E2FF04` |
| Cream | `#FAFFF0` |
| Dark | `#1a1a1a` |
