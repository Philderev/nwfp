# Handoff: Google Ad Grants Funnel — The No White Flags Project

## Overview
A 4-page conversion funnel for Google Ad Grants traffic landing on The No White Flags Project's donation/volunteer campaign. Visitors land on an impact page, then split into a donation path or a volunteer path, both converging on a shared thank-you page.

Flow: Hero-Landing (impact) → Give-Dignity (donate) / Volunteer-Hub (volunteer) → Donation Thank You

## About the Design Files
The files in this bundle (`Hero-Landing.html`, `Give-Dignity.html`, `Volunteer-Hub.html`, `donation-thank-yo.html`) are **design references built as self-contained HTML/CSS/JS prototypes** — they demonstrate intended look, copy, and interaction behavior. They are not production code to copy directly. The task is to **recreate these designs in the target codebase's existing environment** (WordPress/Elementor, since the org's main site at nowhiteflags.org runs on WordPress + Elementor, or whatever CMS/framework the ad-funnel pages will actually live on) using that environment's established patterns — routing, forms, and analytics should follow the target stack's conventions, not the prototype's inline-React-style markup.

## Fidelity
**High-fidelity (hifi).** Colors, typography, spacing, copy, and interaction states (hover, selected, disabled) are final. Recreate pixel-close using the values in the Design Tokens section below.

## Screens / Views

### 1. Hero-Landing (`/impact`)
**Purpose:** Entry point from Google Search Ads. Tells the org's story, builds trust, and funnels to either Donate or Volunteer.

**Layout:**
- Sticky header, 3-column grid (`1fr auto 1fr`): social icons left, centered logo, phone number + "Donate Now" button right.
- Hero section: full-bleed dark navy gradient background (`linear-gradient(100deg, #10263B 0%, #173651 45%, #022D45 100%)`), 2-column grid (rebuilds to 1 column under ~600px): left = eyebrow label + H1 + subhead + white CTA card with "Donate Now" button; right = embedded YouTube donor story video (16:9, rounded 22px, drop shadow).
- "Why It Matters" section: light gray-blue background (#EEF3F6). Centered intro (eyebrow + H2 + paragraph), then a 2-column image+copy block ("Since 2022"), then a horizontally auto-scrolling marquee of 6 client photo cards (Kim Steele, Cooper Hostetler, Nixon Burbank, Jamie Matos, Kimberly Emanuel, Evelyn Davis) that pauses on hover.
- "Ways to help" section: 2 large clickable cards side by side — "Support Our Mission" (blue #022D45, ~70% width) and "Give Your Time" (red #C41F2B, ~30% width), each with eyebrow label, H3, copy, and a white pill "button" (span, not interactive button — whole card is the link).
- FAQ section: centered H2 "Common Questions" + 5 stacked white cards, each with an H3 question and answer paragraph (marked up with FAQPage JSON-LD).
- Footer: dark navy (#10263B), 3 columns (org blurb / quick links nav / social icons nav) + contact info column, divider line, copyright line.

**Components / content:** exact headline "Restoring Dignity. Rebuilding Independence.", subhead "We provide innovative personal hygiene solutions like body dryers and bidets to empower individuals with physical disabilities to regain their privacy."

### 2. Give-Dignity (`/give-dignity`)
**Purpose:** Focused donation page. Same header as other pages (not stripped, per current build — client asked for a unified header across all pages, overriding the original brief's "remove nav for distraction-free checkout" instruction).

**Layout:**
- 2-column layout (stacks under ~600px): left = H1 "Choose Your Impact" + 4 gift-tier buttons in a responsive grid ($25 / $100 / $500 / $1,500+, each with amount + description, selected state shows a filled blue checkmark badge top-right) + embedded Zeffy donation iframe (1200px tall) + a fallback "Continue to Secure Donation Form →" button (opens Zeffy in new tab — added because the iframe can render blank in sandboxed/cross-origin contexts) + secure-checkout microcopy.
- Right sidebar: 501(c)(3) card with a "View Our Determination Letter →" button that opens a **modal** showing the actual IRS determination letter image; SSL/PCI trust badges row; testimonial quote card with client photo.

**Modal behavior:** click-outside or the ✕ button closes it; click inside the modal card does not propagate/close.

### 3. Volunteer-Hub (`/volunteer`)
**Purpose:** Capture volunteer sign-ups.

**Layout:**
- H1 "Be the Hands of Independence." centered intro.
- 3 pathway cards in a responsive grid, numbered 01/02/03 (Technical/Installation, Community Outreach, Virtual/Admin), each with hover lift.
- Sign-up form card: First Name / Last Name (2-col), Email (full width), Phone / Zip (2-col), Area of Interest select (4 options), submit button "Join Our Volunteers →" — disabled/gray until First Name + Last Name + Email are filled, then turns red (#C41F2B) and becomes clickable, navigating to Thank-You with `?from=volunteer`.

### 4. Donation Thank You (`/donation-thank-you`)
**Purpose:** Post-conversion confirmation + cross-sell the other conversion path. **Should be `noindex`.**

**Layout:**
- Centered checkmark badge icon, H1 "You Just Restored Someone's Dignity. Thank You!", subhead.
- Conditional content based on a `?from=donor` or `?from=volunteer` query param (read via `URLSearchParams` on mount):
  - `from=donor`: shows a single card cross-promoting volunteering.
  - `from=volunteer`: shows a single card cross-promoting a $10/month gift.
  - no param: shows both "Give a Gift" and "Give Your Time" cards side by side.
- "Spread the Word" social share row: Facebook / LinkedIn / X share-intent links pre-filled with a share message, pointing back to `/impact`.

## Interactions & Behavior
- **Hover states:** all buttons/CTAs use a "morph to outline pill" hover — solid-fill button becomes white background + colored border + colored text + `border-radius: 999px` (transition `all .18s`). Cards use a subtle lift (`translateY(-2px to -8px)` + increased box-shadow). Social icon images scale to `1.12` on hover. The logo link fades to `opacity: 0.8`.
- **Client marquee:** CSS `@keyframes` infinite horizontal scroll (26s linear), duplicated card set for a seamless loop, `animation-play-state: paused` on `:hover`.
- **Gift tier selection:** clicking a tier button sets local state; selected tier shows blue border + light blue tint background + checkmark badge.
- **Volunteer form validation:** submit button is disabled (gray, non-clickable) until First Name, Last Name, and Email all have values.
- **501(c)(3) modal:** open/close is local boolean state; backdrop click and ✕ button both close it.
- **Thank-you conditional content:** driven by the `from` query param set by the referring page's CTA link.
- No page uses client-side routing — navigation is plain `<a href>` links between static HTML files (or, in the target codebase, between actual pages/routes).

## State Management
- **Give-Dignity:** `selectedTier` (25/100/500/1500, default 100), `letterModalOpen` (boolean, default false).
- **Volunteer-Hub:** form fields `firstName, lastName, email, phone, zip, areaOfInterest` (strings), derived `canSubmit` boolean.
- **Thank-You:** `from` string read from the URL query string on mount (`donor` | `volunteer` | `null`).
- No server calls in the prototype — the Zeffy iframe and Facebook/LinkedIn/X share links are the only external integrations. Volunteer form submission is a client-side redirect only; wire it to a real backend/CRM (or embed a real form service) in production.

## Design Tokens

**Colors**
- Ink (primary text): `#10263B`
- Ink soft (secondary text): `#51677C`
- Ink faint (tertiary text): `#62778A` / `#8695A6`
- Page background: `#F7FAFB` with two radial-gradient tints — `rgba(2,45,69,0.38)` top-left, `rgba(196,31,43,0.3)` bottom-right — `background-attachment: fixed`
- Section alt background: `#EEF3F6`
- Borders: `#E2E8EC` (cards), `#D3DEE4` (inputs)
- Primary blue (donate/trust): `#022D45`, hover/dark `#22506E`, light accent `#7FB2CE`, tint `#EAF2F7`
- Secondary red (volunteer): `#C41F2B`, hover/dark `#A61925`, tint `#FBEAEC` / `#EAD3D5`
- White: `#FFFFFF`
- Footer/dark surfaces: `#10263B`

**Typography**
- Display/headings: "Cormorant Garamond" (weights 500/600/700), serif
- Body/UI: "Inter" (weights 400/500/600/700), sans-serif
- Google Fonts URL: `https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap`

**Spacing / Radius**
- Buttons/inputs: 9–10px radius (999px on hover — pill morph)
- Cards: 14–20px radius
- Avatars/icon circles: 50%
- Section vertical padding: fluid `clamp()` values, roughly 56–110px depending on section

**Shadows**
- Small (cards): `0 4px 16px rgba(16,38,59,0.05-0.06)`
- Medium (elevated cards): `0 8px 28px rgba(16,38,59,0.07)`
- Large (hero elements, colored CTA cards): `0 12-20px 32-44px` in the card's own accent color at 20–30% opacity

## Assets
All under `assets/` in this bundle:
- `logo.png` — org logo (cropped to its visible mark, transparent background)
- `social-facebook.png`, `social-youtube.png`, `social-linkedin.png`, `social-instagram.png` — circular brand icon badges (user-supplied)
- `what-we-do.png` — installation photo
- `kim-steele.png`, `cooper-hostetler.png`, `nixon-burbank.png`, `jamie-matos.png`, `kimberly-emanuel.png`, `evelyn-davis.png` — client photos (user-supplied, real clients)
- `testimonial-photo.png` — quote-card photo on the donate page
- `501c3-letter.png` — real IRS 501(c)(3) determination letter, shown in the modal on the donate page

External embeds (not asset files — reference by URL in production):
- YouTube donor video: `https://www.youtube.com/embed/sRlhEp0EClg`
- Zeffy donation form: `https://www.zeffy.com/en-US/donation-form/908581e2-b062-42da-9ffb-2f08a9f8f414`

## SEO / Technical Notes
- Each page has a unique `<title>`, meta description, canonical URL, Open Graph + Twitter Card tags, and JSON-LD (NGO/Organization + BreadcrumbList; Hero-Landing also has FAQPage schema matching its visible FAQ section).
- Thank-You page is marked `noindex, nofollow`.
- Intended production URLs: `/impact`, `/give-dignity`, `/volunteer`, `/donation-thank-you`.
- `robots.txt`, `sitemap.xml`, and `llms.txt` are included at the bundle root as references for the production site.
- Accessibility: form inputs use `aria-label` (no visible `<label>` in the current design — consider adding visible labels in production), decorative elements are `aria-hidden`, the letter modal uses `role="dialog"`/`aria-modal`.

## Files
- `Hero-Landing.html` — impact/landing page
- `Give-Dignity.html` — donation page
- `Volunteer-Hub.html` — volunteer sign-up page
- `donation-thank-yo.html` — confirmation page
- `assets/` — all images referenced above
- `robots.txt`, `sitemap.xml`, `llms.txt` — SEO reference files

# nwfp
