# Projects Pioneers Contracting Co (PPCO) website

A redesign of [ppco-ksa.com](https://ppco-ksa.com) built with Next.js 16, React 19, Framer Motion 12 and Tailwind CSS 4.
The copy is unchanged from the live site. Only the design, structure and usability are new.

## Run it

```bash
npm install
npm run dev                  # http://localhost:3000
npm run build && npm start   # production
```

Every page is pre-rendered as static HTML, so it can be hosted anywhere that runs Next.js (Vercel, a Node server) or exported.

## Pages (same URLs as the live site)

| URL | Page | What changed |
| --- | --- | --- |
| `/` | Home | Full-photo hero, Who We Are, Core Disciplines, PPM, Our Story videos, animated Track Record, Core Services, client logo wall, call to action |
| `/company/` | Company | Sticky section menu (History, Philosophy, Quality & Safety, Our People), side panel with divisions and contact |
| `/projects/` | Projects | Division tabs with project counts, searchable tables, filter by client |
| `/list-of-equipment/` | Equipment and vehicles | Grand total, search, sort, availability bars |
| `/list-of-staff-and-manpower/` | List of Staff and Manpower | Same as equipment |
| `/training-and-safety/` | Quality & Safety | Quality mission panel, 2025 safety highlights, statistics table, certificate viewer |
| `/services/` | Services | Overview of the 3 divisions, a section for each, PPM |
| `/media/` | Media Center | 191 photos, filter by site, full-screen viewer (keyboard and swipe) |
| `/contact/` | Contact | Email and call buttons, Dammam and Riyadh offices, map, site offices |

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

- **Colours**: the logo's indigo `#2D2481` for buttons, links and key numbers; the logo's green `#2FB61D` only for small accents; deep indigo `#141233` for the PPM band and the footer; white and `#F4F5F8` alternating section backgrounds.
- **Type**: IBM Plex Sans, with IBM Plex Sans Arabic for Arabic text such as the addresses.
- **Headings**: the live site sets many headings in capitals ("WHO WE ARE", "CIVIL SOLUTIONS"). The words are kept exactly; they are displayed in title case (`src/lib/text.ts`) for readability.
- **Motion** (Framer Motion): hero entrance, a soft cross-fade between pages, counters that count up once, the Company dropdown, tab and filter indicators, the video player and the photo viewer. Reduced-motion settings are respected.
- **Accessibility**: skip link, keyboard-operable menus, tabs, filters and viewers, visible focus, captions on tables, sticky first column on wide tables.

## Before launch

1. **Images** are loaded from the live WordPress uploads folder (`ppco-ksa.com/wp-content/uploads`). Copy them to `/public` or a CDN before switching DNS away from WordPress, then update `up()` in `src/content/site.ts`.
2. **Company Profile PDF** also points to the WordPress uploads folder. Move it with the images.
3. **Footer links**: on the live site the footer links go nowhere (`#`). Here they go to the nearest page. "Leadership" goes to Our People on the Company page, because the site has no leadership content yet.

## Issues found on the live site (copy kept as-is; please confirm)

- **Missing images (404)**: the three division photos on Projects, two photos on Services (`صورة-DSC_5402-متوسطة.jpeg`, `22-1.png`) and one certificate on Quality & Safety. These were replaced with matching photos from the site, or left out (the certificate).
- **Total project value**: the home page says "6 Billion+", but the Company page says "a total value exceeding SAR 3 billion".
- **Safety tables**: the Company page shows 2020–2024 with First Aid cases 11, 7, 7, 4, 6. Quality & Safety shows 2021–2025 with 1, 2, 1, 3, 4 for overlapping years.
- **Typo**: "Infrastucture" in the Civil Solutions scope line (Services and Projects).
- **Contact details**: the Dammam address differs between the footer (Al-Shula, Dammam 32432), the Company page (P.O. Box 32432 Zip 5188) and the Contact page (Dhahran-Jubail highway P.O.Box 5029 Dammam 34261).
- **Site offices**: "DHARAN" is probably meant to be "Dhahran".
