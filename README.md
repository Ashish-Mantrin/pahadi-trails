# Pahadi Trails — Uttarakhand tourism website upgrade

## What was audited and preserved
The supplied project is a plain HTML/CSS/JavaScript site, not a React application. The approved homepage HTML and its original section sequence were retained. During audit, `index.html` referenced `style.css` and `script.js`, but those files were absent from the supplied folder; they have been restored so the page is styled and interactive. The existing privacy and terms pages were retained.

## Included
- Original homepage structure/section order preserved, with styling, reduced-motion-aware reveals and subtle card motion.
- Responsive shared navigation/footer and separate About, destination directory, tour ideas, custom tours, adventure, Char Dham, trekking, wildlife, stays, blog, gallery/lightbox, map, contact, FAQs, privacy, terms and 19 destination guides.
- Structured destination data at `data/destinations.json`; map points are approximate planning coordinates, not navigational authority.
- SEO titles/descriptions/canonicals, Open Graph metadata, `robots.txt`, `sitemap.xml`, basic 404 page. Replace `example.com` everywhere before launch.
- MapLibre GL JS terrain-map implementation with markers and links. Real 3D terrain requires a valid licensed style URL and compatible elevation source; no key is included. Use the provider's official attribution and usage terms. 2D OpenStreetMap links remain available.
- Enquiry form prepares a WhatsApp summary; static preview cannot persist leads or send email. Optional API route, Supabase schema with RLS enabled and Resend integration starter included.
- `.env.example`, photography register, database migration, deployment and QA notes.

## Local preview
Serve the folder over HTTP (for example `python -m http.server 8000`) and open `http://localhost:8000`. A local static server does not execute `/api/enquiries`; the form will provide a contact-summary fallback. External CDN/fonts/photos require internet.

## Production configuration required
1. Replace `example.com` in canonicals, sitemap and robots with the real domain; set HTTPS redirects and host-specific 404 behavior.
2. Set `window.PAHADI_WHATSAPP_NUMBER` in `config.js` to the verified business number in digits-only international format. Test with a real device. WhatsApp opening is not proof of delivery.
3. Deploy `api/enquiries.js` on a compatible serverless platform; install `@supabase/supabase-js` and `resend`, configure variables from `.env.example`, and set up platform-level rate limiting, bot protection, origin policy, logging and alerting. Configure email SPF/DKIM/DMARC. Email delivery requires a verified sender/domain.
4. Apply `supabase/migrations/001_leads.sql`. Build a staff-only dashboard with Supabase Auth and server-verified roles before collecting real leads. The included `admin/README.md` describes the security boundary; a live authenticated dashboard is not yet configured.
5. Configure MapLibre with a licensed provider style and real terrain DEM source; set domain-restricted public key via deployment config. Check terrain source schema, attribution, quota, tile caching and licensing. The current map page falls back to a list of 2D map links if unconfigured.
6. Review every photograph. `assets/photography-register.csv` explicitly marks starter image entries unverified; replace them with licensed/owned destination-specific photography and record creator, license, attribution, permissions and restrictions. No photography license is claimed.
7. Review privacy/terms with qualified counsel, confirm the legal business/referral model and consent/retention policies.
8. Add verified business identity/contact information and real partner details only with permission. No prices, reviews, ratings or live availability are invented.
9. Set up Google Search Console, analytics with consent controls, SPF/DKIM/DMARC and monitoring after deployment.

## Honest integration status
- WhatsApp: prefilled message behavior implemented; business number must be configured. Opening the app does not send the message automatically.
- Email/database: integration source and SQL are included but require deployment, dependencies and secrets. Not live in this ZIP.
- Admin dashboard: schema/security setup notes included; the full authenticated production dashboard remains a deployment task and must not be exposed publicly.
- 3D terrain: MapLibre code is present; real terrain is conditional on a licensed style/DEM source and valid configuration. Unconfigured mode displays a 2D fallback.
- Photography: remote starter images are not verified as destination-specific or licensed. Replace/verify before launch.

## QA checklist
- [ ] Replace all `example.com` URLs and confirm canonicals/sitemap.
- [ ] Test all navigation links and destination cross-links on the production host.
- [ ] Test 360px, 390px, 768px, 1024px and 1440px widths; keyboard navigation and reduced motion.
- [ ] Verify all images, alt text, captions and image licenses.
- [ ] Test enquiry required fields, invalid email/phone, consent, failure recovery and duplicate submission protection. Add server-side rate limiting/bot defense before launch.
- [ ] Verify WhatsApp number and message encoding on mobile/desktop; do not interpret opening as delivery.
- [ ] Deploy and test database insertion, email delivery, error logs, staff authentication, RLS and CSV access controls.
- [ ] Test configured terrain source, marker links, attribution, map errors and 2D fallback.
- [ ] Validate schema/metadata, sitemap, robots, redirects, broken links and 404 behavior.
- [ ] Run Lighthouse/Core Web Vitals, accessibility checks and security review on the deployed site.

## Important
This project has not been deployed and no external credential, email, database, image license, API quota or terrain provider has been verified. The included source should be treated as an implementation starter until the configuration checklist is complete.

## V3 polish: automatic hero, WhatsApp and AI assistant
- The homepage feature slider advances every **3 seconds**. It pauses while the pointer is over the hero and respects reduced-motion preferences.
- A floating WhatsApp shortcut and “Ask Pahadi” assistant are added across pages. Set `PAHADI_WHATSAPP_NUMBER` in `config.js` to your business number using digits only, including country code.
- The assistant frontend posts to `/api/chat`. This serverless endpoint uses the OpenAI API; it does **not** scrape or read conversations from chatgpt.com. Configure `OPENAI_API_KEY` and optionally `OPENAI_MODEL` in your deployment environment. Never place the secret in `config.js` or any frontend file. The endpoint uses Vercel-style serverless syntax and may need adapting for other hosting providers.
- The AI assistant will not function in a static-file preview until `/api/chat` is deployed and configured. WhatsApp opens a prefilled chat but does not send the message automatically.
- Detail-page and footer CSS refinements are included. Check all pages in a browser before production and replace example domain/image placeholders with verified, licensed production assets.

## V4 content and interaction update

- Added a reliable scroll-aware Back to Top control on every page.
- Added enhanced destination storytelling cards, a four-image destination gallery layout, and expanded destination-specific highlights for the 19 destination guides.
- Expanded About Us with Who We Are, What We Do, Mission, Vision, Haridwar base, and visitor promises.
- Added animated hero-script decoration, improved steps cards, footer link grid, and enquiry contact styling.
- Added `enhancements.js` for the back-to-top control, destination prefill, and enquiry submission feedback.
- The chatbot now provides a conversational local knowledge fallback based on website destination content when `/api/chat` is unavailable. Live AI still requires a deployed backend and server-side OpenAI API key.

### Important configuration before public launch

- Replace the sample phone number and `hello@pahaditrails.example` in `index.html` with verified business contact details.
- Configure and test a real `/api/enquiries` backend before describing enquiries as received or stored. If it is unavailable, the form clearly says that online submission is not connected and offers WhatsApp as a fallback.
- Destination gallery images are editorial placeholders from remote Unsplash image URLs; verify that each image accurately depicts the named place and confirm current license/usage terms before commercial launch. The project does not claim that these placeholder photos are verified destination-specific assets.
- Set a real WhatsApp Business number in `config.js` and deploy `/api/chat` with `OPENAI_API_KEY` on the server for live AI responses.

## Final QA update (2026-10-11)
- Updated hero carousel timer to a six-second interval; previous/next buttons, dot controls, hover/focus pause, hidden-tab pause, touch swipe, and reduced-motion behavior are included.
- Improved footer layout and styling, back-to-top visibility/scroll behavior, hero-script animation, and About-page feature layout.
- The homepage enquiry form now asks for separate phone and email, sends a normalized payload to `/api/enquiries`, and shows success only when the endpoint returns `{ "ok": true }`. Failure keeps entered values and displays an error instead of claiming submission.
- The form endpoint requires a deployed serverless runtime, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and the included Supabase migration. Configure `RESEND_API_KEY`, `ENQUIRY_TO_EMAIL`, and `ENQUIRY_FROM_EMAIL` for email notifications. Static `python -m http.server` does not run the API route.
- Run syntax checks with `node --check script.js`, `node --check enhancements.js`, `node --check chat-widget.js`, and `node --check map.js`. This project is plain HTML/CSS/JS and does not define an npm production build or automated browser-test suite.
- Verified all 37 HTML files for missing local `href`/`src` references and checked the ZIP archive integrity. No automated cross-browser visual test was available in this environment.
- Contact phone/email are explicitly sample placeholders; replace them before publishing. Verify photography licenses and replace `example.com` canonical URLs with the production domain.

## October 2026 refinement
- Hero rotation is set to 3 seconds with a layered crossfade/slow-zoom transition and a short text landing animation. The slider pauses on hover/focus and respects reduced-motion preferences.
- Added `assets/media.js` as the central image registry and organized `assets/images/` into logo, favicon, hero, destinations, packages, adventure, Char Dham, trekking, wildlife, blogs, testimonials and contact folders. Replace the registry URLs/paths to change hero imagery centrally; the supplied SVG logo and favicon are included.
- Destination directory cards now use a balanced text-left / image-right layout, with consistent borders and spacing. Destination detail pages have refined highlights, gallery cards, sticky desktop sidebar and compact embedded planning maps.
- Removed the public Custom Tours page and replaced its navigation references with the contact/enquiry route.
- Maps use OpenStreetMap embeds and identify the supplied 29.9457, 78.1642 point as an approximate planning reference, not a verified entrance.
- External image URLs remain in use for many existing page sections. Add your own licensed images into the categorized media folders and update `assets/media.js` (and remaining page-specific references as needed). Backend/API services still require real configuration before enquiries or AI responses can be treated as live.
