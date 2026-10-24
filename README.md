# Projects Pioneers Contracting Co (PPCO) website

A redesign of [ppco-ksa.com](https://ppco-ksa.com) built with Next.js 16, React 19, Framer Motion 12 and Tailwind CSS 4.
The copy is unchanged from the live site. Only the design, structure and usability are new.

## Run it

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # static site in out/
npm run preview   # builds, then serves it as the Cloudflare Worker (incl. the form), http://localhost:8787
```

The site is a static export (`output: "export"`): `next build` writes plain HTML, CSS and JS to `out/`, hosted on Cloudflare (see **Publishing**). The only server code is the enquiry form handler (`server/enquiry.ts`). In `npm run dev` it doesn't run, so the form falls back to "send from your email app".

## Pages (same URLs as the live site)

| URL | Page | What changed |
| --- | --- | --- |
| `/` | Home | Full-screen film hero with a frosted-glass strip of client names, Who We Are, interactive locations map, client logo wall, Core Services (photo on hover), Track Record, Core Disciplines, PPM, Our Story videos, call to action |
| `/company/` | Company | Sticky section menu (History, Philosophy, Quality & Safety, Our People), side panel with divisions and contact |
| `/projects/` | Projects | Project numbers (also division filters); one table of all projects with filters for division, scope, client and location, search, sort, removable filter chips, and shareable filtered links |
| `/list-of-equipment/` | Equipment and vehicles | Grand total, search, sort, availability bars |
| `/list-of-staff-and-manpower/` | List of Staff and Manpower | Same as equipment |
| `/training-and-safety/` | Quality & Safety | Quality mission panel, 2025 safety highlights, statistics table, certificate viewer |
| `/services/` | Services | Overview of the 3 divisions with Request a Quote, a section for each with its own quote and projects links, PPM, closing call to action |
| `/media/` | Media Center | 191 photos, filter by site, full-screen viewer (keyboard and swipe) |
| `/contact/` | Contact | Email and call buttons, Dammam and Riyadh offices, enquiry / request-for-quote form, map with offices and site offices (pick one to move the map) |

## Where things live

| What | Where |
| --- | --- |
| All page copy | `src/content/site.ts` |
| Media Center photos | `src/content/media.ts` |
| Project, equipment and manpower tables | `src/data/*.csv` (the same CSV files the live site loads; replace them to update) |
| Colours, type and spacing | `src/app/globals.css` |
| Pages | `src/app/**/page.tsx` |
| Shared components | `src/components/` |

## Design system

- **Colours**: neutral only, with no blue or purple cast. Near-black `#111111` for text, buttons and key numbers; `#0B0B0B` for the dark bands and the footer; white and `#F5F5F5` alternating section backgrounds; `#E5E5E5` lines and `#5E5E5E` secondary text. The logo keeps its own colours, and its green `#2FB61D` is the one accent, used for small details only.
- **Logo**: the two logo files have different empty space around the mark, so `Logo.tsx` crops each to the mark itself. It is 56px tall in the desktop header (44px on phones) and 80px in the footer, and it no longer changes size when the header turns white.
- **Type**: IBM Plex Sans, with IBM Plex Sans Arabic for Arabic text such as the addresses.
- **Headings**: the live site sets many headings in capitals ("WHO WE ARE", "CIVIL SOLUTIONS"). The words are kept exactly; they are displayed in title case (`src/lib/text.ts`) for readability.
- **Motion and interaction** (Framer Motion). Kept deliberately quiet:
  - Native scrolling (no smooth-scroll library, so the page responds immediately); a thin green scroll-progress line; a header that hides on scroll down and returns on scroll up.
  - A small ring follows the mouse (14px, 28px over links); it blends with the page, so it shows black over white and white over black. Off on touch devices.
  - New pages fade in. Headings and content fade up once as they enter the view; images open with a short wipe; a few photos move with a light parallax; the two key statements brighten word by word as you scroll.
  - Home: the company film plays (muted, decorative) behind the headline under a 35% black tint, with black scrims behind the text and the header so white text stays at 4.5:1 or better on the brightest frames. It only plays while the hero is on screen, and never autoplays for reduced-motion visitors. A frosted-glass strip along its bottom (20px backdrop blur, a light white sheen and a hairline highlight; the black scrim stops exactly at the strip's top edge and drops to 40% beneath it, so the film shows through while the names stay at 5:1 or better) scrolls the names of PPCO's clients, taken from the project lists (`pastClients()` in `src/lib/csv.ts`) and ordered by number of projects; it pauses on hover. Then the locations map (below). Then the client-logo bands, in full colour: each logo file has its own empty margin, so every logo is cropped to its measured outline (`box` in `site.ts`) and fitted inside its tile; none is clipped. Then the service rows: on desktop a pinned photo beside the list crossfades to the service you hover or focus; on phones each row has its own thumbnail. Further down: expanding discipline panels and the track record with counting figures.
  - Services: the photo column stays pinned and changes as each division scrolls past.
  - Contact: copy-email button, the enquiry / RFQ form, and one map section listing the Dammam and Riyadh offices and the site offices. Locations with an exact position (`mapPoints` in `site.ts`, taken from PPCO's Google Maps listings: Dammam, Riyadh and NEOM) move the map there and offer Open in Google Maps; the other site offices are listed without a link until their positions are added.
  - Page changes: every new page opens at the very top, links to a section open at that section below the header, and Back/Forward return to where you were (`ScrollManager.tsx`). The page has no `scroll-padding-top`: Next.js reads it after each navigation and would otherwise scroll past the banner.
  - Mobile menu: a labelled Menu button that stays visible over photos and on white, a full-screen panel with large links, Company sub-pages that expand in place, Request a Quote and Company Profile, and email and phone. It locks the page behind it, closes with Escape, and returns focus to the button.
  - Removed as too playful for a corporate site: magnetic buttons, tilting video cards, wobbling certificates, the pointer spotlight on cards, the photo that trailed the pointer over service rows, the round "Contact Us" button, cursor text labels, the coloured page-transition panel, the moving band of office names and the outlined "PPM" and "2006" watermarks.
  - The client-logo bands have a visible pause control; every moving band pauses on hover or keyboard focus.
  - Reveals animate full `transform` strings and the page fade runs as CSS keyframes, so they stay smooth while the next page loads; none leaves a transform behind, so sticky and fixed elements keep working.
  - All motion respects the visitor's reduced-motion setting; the cursor ring switches off for it.
- **Footer**: black, like the dark bands. The “Always One Step Ahead” sign-off is sized with container units (`10cqi`) so it always fills the footer's width on a single line.
- **Accessibility**: skip link, keyboard-operable menus, tabs, filters and viewers, visible focus, captions on tables, sticky first column on wide tables.

## Locations map (home)

An interactive version of PPCO's locations map. The coastline was traced from PPCO's own map image, and the points, categories and labels follow it (`src/content/locations.ts`).

- Pick a location by its label or dot, from the Location list, or with Previous / Next. The panel shows its role (head quarter, regional office, site office & yard or project location), office address and hours where known, and the projects listed there with their clients.
- Projects are matched by place name or by the Aramco field codes used in project names (HRDH = Haradh, KHRS = Khurais). Each location links to the Projects page, opened on the right division and filtered to that location (`/projects/?division=electrical&location=haradh`); the filter shows as a removable chip.
- The legend doubles as a filter. A dashed line traces the route from the head office in Dammam to the selected location.
- Motion: the map fades in, leader lines draw and points appear once when the section scrolls into view; selecting a point plays one short ring. Everything is static for reduced-motion visitors.
- Locations with no rows in the project lists (for example Jeddah, Tabuk, Hofuf) say so and link to all projects. Add their projects to the CSV files, or add keywords in `locations.ts`, and they will appear.

## Projects filtering

`/projects/` lists all 58 projects from the three CSV files in one table.

- Filters: division (also the three project-number cards), scope of work, client (both multi-select), location (the map locations) and free-text search across project, scope and client, with matches highlighted. Sort by project number, name, client or division.
- Counts beside every option update with the other filters, and options with no matches are hidden, so no choice leads to an empty table. Active filters show as removable chips with Clear all. Selecting a scope or client in the table filters by it.
- Filters are kept in the address (`/projects/?division=electrical&client=Saudi+Aramco&location=haradh&q=OHPL&sort=name`), so a filtered view can be shared or bookmarked, and the map's links use the same parameters.
- On phones the filters sit behind a Filters button showing how many are active, with a "Show N projects" button that closes the panel and jumps to the results.

## Enquiry and request-for-quote form

On the Contact page (`#enquiry`). Every "Request a Quote" link opens it with the quote option and, from a division, that service already chosen (`/contact/?type=quote&service=civil#enquiry`).

- Fields: name, company, email, phone, and for quotes the service, project location, expected start and scope of work. Validation runs on submit, errors are shown under each field, and focus moves to the first one.
- Delivery: the form posts to `/api/enquiry`, handled on Cloudflare (`server/enquiry.ts`, via `worker/index.ts`), which emails the request through [Resend](https://resend.com) when these variables are set in Cloudflare (Settings → Variables and Secrets; add the key as a secret, then redeploy):

  ```bash
  RESEND_API_KEY=re_...
  ENQUIRY_TO=info@ppco-ksa.com
  ENQUIRY_FROM="PPCO Website <website@ppco-ksa.com>"   # a sender on a domain verified in Resend
  ```

  Until they are set, the form tells the visitor that online sending isn't available and offers the same message, already filled in, to send from their own email app. Nothing typed is lost.
- Spam: a hidden honeypot field; submissions that fill it are dropped.
- If Resend rejects the message or can't be reached, the form says so and offers the email-app fallback.

## Hero film

The files are in `public/video/`: `ppco-hero.mp4` (1280×720, desktop), `ppco-hero-mobile.mp4` (854×480, phones) and `ppco-hero-poster.jpg` (shown while the film loads). The film plays muted, as a background, and recovers on its own if it fails to start: a failed or stalled download is retried (up to four times, and again when the connection comes back), and if the browser refuses to autoplay (for example iPhone Low Power Mode) it starts on the visitor's first tap. The Worker serves `/video/*` with proper byte-range (206) replies, which Safari needs and which let an interrupted download resume; `npm run build` records the file sizes it uses in `worker/video-sizes.json`. To replace it, re-encode the new file the same way:

```bash
ffmpeg -i source.mp4 -c:v libx264 -preset slow -crf 30 -pix_fmt yuv420p -an -movflags +faststart public/video/ppco-hero.mp4
ffmpeg -i source.mp4 -vf scale=854:-2 -c:v libx264 -preset slow -crf 30 -pix_fmt yuv420p -an -movflags +faststart public/video/ppco-hero-mobile.mp4
```

## Skills applied in this version

Each skill was used only where its subject matched the work:

| Skill | Used for |
| --- | --- |
| landing-page-design (elayadesign) | Hero text block capped at 680px, sizes snapped to the Tailwind scale (36 / 48 / 60px), one primary action with the second as a text link, custom ease-out curves |
| tastemaker, hero guidelines (codeswithroh) | Attention budget and subtraction pass for the hero: a 4-word headline on 1–2 lines, the scroll arrow removed, controls moved into the ticker bar |
| better-typography (Jakub Krehel) | Balanced heading wraps and `pretty` paragraph wraps site-wide, unitless line heights in the hero |
| better-colors (Jakub Krehel) | The hero tint and scrim were measured against 64 frames of the film rather than estimated |
| better-accessibility (Jakub Krehel) | Pause control for the client-logo bands, no autoplay under reduced motion, a form that validates on submit with linked error messages and focus on the first problem, a mobile menu that traps focus and returns it, keyboard-reachable scrolling tables; checked with an axe-core audit of every page |
| emil-design-eng, animation-performance (Emil Kowalski) | Press feedback on the controls, the blurred icon crossfade, explicit transition properties instead of `transition: all`, `transform` strings and CSS keyframes for motion that runs during page loads; the "should this animate at all" test used in the animation sweep |
| feedback-patterns (designer-skills) | Control state shown by the icon, the label and the filled style, never by colour alone |
| no-ai-design-slop (Meng To) | Removal test on the hero: each element kept only if it answers what this is, why it matters or what to do next |

Not used, because nothing in this work called for them: garden-skills (its web-design-engineer skill covers the same ground as the skills above, and the rest is video presentations, article layouts and image generation), Meng To's WebGL, illustration and game skills, Emil's native and Swift skills, and the research and testing skills in designer-skills.

## Publishing (Cloudflare)

The site deploys as a **Cloudflare Worker with static assets** (`wrangler.jsonc`). `npx wrangler deploy` runs `npm run build` (static export to `out/`), uploads `out/` and the small Worker in `worker/index.ts`, which only handles the enquiry form (`/api/enquiry`) and byte-range requests for the hero videos (`/video/*`). Pages are served by Cloudflare's asset handling, with `public/_headers` and the 404 page. Because `wrangler.jsonc` exists, Cloudflare no longer tries to convert the project to OpenNext.

In Cloudflare (Workers & Pages → your Worker → Settings → Builds), with the GitHub repository connected:

| Setting | Value |
| --- | --- |
| Build command | leave empty (the deploy step builds) |
| Deploy command | `npx wrangler deploy` |
| Root directory | `/` |

Every push to `main` deploys. Form email settings go under Settings → Variables and Secrets (`RESEND_API_KEY` as a Secret, `ENQUIRY_TO`, `ENQUIRY_FROM`); `keep_vars` stops deploys from removing them. The Worker's name must match `name` in `wrangler.jsonc` (`ppco-website-2026`).

The same repository also works as a Cloudflare **Pages** project (build command `npm run build`, output directory `out`); there the form is handled by `functions/api/enquiry.ts`. Both use the shared handler in `server/enquiry.ts`.

Local check of the production build: `npm run preview` (builds, then serves it with the Worker at http://localhost:8787).

## Before launch

1. **Images** are loaded from the live WordPress uploads folder (`ppco-ksa.com/wp-content/uploads`), and served at their original size (a static export has no image optimiser). Before pointing `ppco-ksa.com` at Cloudflare Pages, move them: either keep WordPress running on a subdomain (for example `old.ppco-ksa.com`) and change `U` in `src/content/site.ts`, or copy the files into `public/` and point `up()` there. Otherwise every photo breaks when the domain moves.
2. **Company Profile PDF** also points to the WordPress uploads folder. Move it with the images.
3. **Footer links**: on the live site the footer links go nowhere (`#`). Here they go to the nearest page. "Leadership" goes to Our People on the Company page, because the site has no leadership content yet.

## Issues found on the live site (copy kept as-is; please confirm)

- **Missing images (404)**: the three division photos on Projects, two photos on Services (`صورة-DSC_5402-متوسطة.jpeg`, `22-1.png`) and one certificate on Quality & Safety. These were replaced with matching photos from the site, or left out (the certificate).
- **Total project value**: the home page says "6 Billion+", but the Company page says "a total value exceeding SAR 3 billion".
- **Safety tables**: the Company page shows 2020–2024 with First Aid cases 11, 7, 7, 4, 6. Quality & Safety shows 2021–2025 with 1, 2, 1, 3, 4 for overlapping years.
- **Typo**: "Infrastucture" in the Civil Solutions scope line (Services and Projects).
- **Contact details**: the Dammam address differs between the footer (Al-Shula, Dammam 32432), the Company page (P.O. Box 32432 Zip 5188) and the Contact page (Dhahran-Jubail highway P.O.Box 5029 Dammam 34261).
- **Site offices**: "DHARAN" is probably meant to be "Dhahran".
