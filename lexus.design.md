---
version: alpha
name: "Lexus"
website: "https://www.lexus.com"
description: >-
  A Toyota luxury arm whose marketing site runs on the strictest black-and-white discipline in the automotive luxury category — pure black ink #000000 carries 1001 occurrences across the page as text and border while a single champagne-gold accent #b6a171 surfaces only on a small set of luxury chips. The typography is Nobel across every tier, the only typeface in the system, sat at a deliberately light 300 / 400 weight for display (18-40px in weight 300) and 700 for small-caps nav. Letter-spacing is the load-bearing typographic move: 0.44px to 1.6px tracking runs everything from body to button. Cards round at 20-24px, and the L-spindle grille on the staged vehicle photography supplies the only geometric brand mark.

seo:
  title: "Lexus Design System for React — black ink #000000, Nobel, gold #b6a171, 14 components"
  metaDescription: "Lexus's marketing-site design tokens packaged for React, Next.js, and AI coding tools. Black-on-white luxury chrome, Nobel typography across every tier, single champagne-gold accent, 14 components."
  highlights:
    - "Pure black voltage — #000000 carries 1001 occurrences as the structural ink across text, borders, and one rare background fill"
    - "Nobel as single voice — every display, body, button, and nav surface runs Nobel in weights 300, 400, 500, 700"
    - "Letter-spacing as hierarchy — tracking ranges from 0.44px on body to 1.6px on labels, doing the work weight would normally do"
    - "Champagne gold rare accent — #b6a171 surfaces 6 times only, all on luxury-tier chips and spec-badge outlines"
    - "Rounded card geometry at 20-24px — the dominant body radius, paired with 9999px pill chips for stat callouts"
  tags:
    - "Automotive"
  lastUpdated: "2026-05-19"
  author:
    name: "Dov Azencot"
    url: "https://x.com/dovazencot"
  opening: |
    Lexus's marketing chrome is the most monochrome system in the automotive luxury category. The hero opens on a studio render of an LX 700h staged against a darkened gallery wall, the L-spindle grille lit as the focal element. Below, a "Meet the models" model-card grid sits on pure white with three vehicle renders, each card rounded at 20-24px and bordered with a 1px ink hairline. Every typographic surface — display h2 at 24px, model name at 13-14px, body copy at 11px — runs Nobel at modest weights with letter-spacing ranging from 0.44px on body to 1.6px on small caps. Tracking is the system's load-bearing hierarchy device; weight is held in reserve.

    Where Mercedes leans on charcoal-and-silver, BMW on a warmer kidney-grille blue, and Ferrari on hard-cut red-on-black, Lexus inverts the entire luxury-automotive palette toward neutral ink-on-canvas. The DESIGN.md file packages the system into a machine-readable spec for React tooling. Inside: black `#000000` carries 1001 captured occurrences as text and border; white `#ffffff` is the canvas at 136; a gray ladder (#adadad, #707070) handles secondary and tertiary text; and a single champagne gold #b6a171 surfaces six times only — all on luxury-tier chips and spec-badge outlines. Nobel runs every typographic tier; cards round at 20-24px; pill chips appear at 9999px for stat callouts. There are no chromatic accents anywhere else.

    Feed this file to Claude or Cursor and the AI reproduces Lexus's specific moves: black-on-white monochrome chrome, Nobel as the single typeface with letter-spacing doing the work weight would normally do, 20-24px card rounding, and the champagne-gold accent reserved for luxury-tier moments. The one move worth borrowing only if your brand has earned the right to be monochrome is the willingness to let typography and photography carry everything without any chromatic safety net. For most marketing systems the same discipline reads as undercooked; for a brand whose entire promise is craftsmanship in restraint, the absence of color is the entire design.
  related:
    - href: "/design"
      title: "Browse all design systems"
      description: "The full directory of DESIGN.md files on shadcn.io, with live mockups for each."
    - href: "https://www.lexus.com"
      title: "Lexus — official site"
      description: "Lexus's public US marketing site — the source of truth for the live tokens captured in this file."
    - href: "https://github.com/google-labs-code/design.md"
      title: "The DESIGN.md specification"
      description: "Google Labs' open spec for machine-readable design system files — the format this page is built on."
  questions:
    - id: "primary-color"
      title: "What is Lexus's primary brand color?"
      answer: "Lexus operates from a near-absent color palette. The dominant chromatic element is pure black #000000 at 1001 captured occurrences — 497 as text and 496 as border — used for every running label, every card outline, and most button strokes. White #ffffff carries 136 occurrences as canvas. The only true accent is champagne gold #b6a171, which surfaces six times across the entire page, all on luxury-tier chip outlines and spec-badge frames. Most brands would call this monochrome a default; Lexus treats it as the brand's voltage — restraint as identity, with the gold appearing only on moments that earn the luxury signifier."
    - id: "typography"
      title: "What typeface does Lexus use, and what should I use as a substitute?"
      answer: "Lexus runs Nobel across every typographic tier — a geometric sans by Tobias Frere-Jones based on the 1920s Sjoerd Hendrik de Roos original. Display sits at 24-40px in weight 300, headings at 13-16px in 400 or 500, body at 11-14px in 400, and small-caps labels at 11-13px in 700 with 1.1-1.6px tracking. The letter-spacing is the load-bearing typographic move: every tier carries explicit tracking from 0.44px on body to 1.6px on labels. The closest open-source substitute is Inter at the same weights with explicit `letter-spacing: 0.04em` applied to small sizes; Geist Sans is a tighter alternative if you need a more contemporary geometric fit."
    - id: "monochrome-canvas"
      title: "Why does Lexus avoid color entirely?"
      answer: "Lexus's brand promise is craftsmanship-through-restraint, and the marketing chrome is built to never compete with the vehicle photography. The L-spindle grille and the body lines of the staged vehicles are the page's only chromatic interest; introducing a brand color would dilute that focus. The black-and-white discipline runs deeper than convention — even the gallery background of the hero photography is darkened to push every chromatic note onto the metal of the car. The champagne gold #b6a171 surfaces only when a luxury-tier signifier demands more than ink can carry."
    - id: "radii-and-cards"
      title: "What is Lexus's corner-radius philosophy?"
      answer: "The radius scale is generous-rounded on body cards and full-pill on chips. Cards default to 20px or 24px (16 combined occurrences captured) — softer than the 8-12px SaaS default, more confident than the 2-4px utility square. Stat-callout chips run fully rounded at 9999px (and 932px renders as effectively full on the captured sizes). There is no 4 / 8 / 12px middle tier; the system is binary — generous-rounded for body or fully circular for chips. The 20-24px rounding pairs naturally with the L-spindle silhouette of the front grille — soft-corner geometry across the chrome echoes the curvature of the vehicle photography."
    - id: "use-in-project"
      title: "Can I use this DESIGN.md to build my own luxury-automotive marketing site?"
      answer: "Yes — the file is structured for ingestion by Claude, Cursor, or any AI tool that reads design tokens. The agent will reproduce Lexus's specific moves: monochrome ink-on-canvas chrome, Nobel as the single typeface with explicit letter-spacing, 20-24px card rounding, and the champagne-gold accent reserved for luxury-tier chips. The token references resolve without invention. One caveat worth keeping: the willingness to forgo chromatic safety nets only works when the photography genuinely carries the page. For a category where the vehicle is the protagonist this is the right discipline; for SaaS or DTC where the product is software or a swatch, the same restraint can read as unfinished."

mockups:
  - "marketing-hero"
  - "media-grid"

colors:
  ink: "#000000"
  ink-soft: "#222222"
  muted: "#707070"
  muted-light: "#adadad"
  hairline: "#efefef"
  canvas: "#ffffff"
  gold-accent: "#b6a171"
  link-blue: "#0000ee"

typography:
  display-xl:
    fontFamily: "\"Nobel\", sans-serif"
    fontSize: 40px
    fontWeight: 300
    lineHeight: 30px
    letterSpacing: "0.96px"
  display-lg:
    fontFamily: "\"Nobel\", sans-serif"
    fontSize: 32px
    fontWeight: 300
    lineHeight: 38px
    letterSpacing: "0.44px"
  display-md:
    fontFamily: "\"Nobel\", sans-serif"
    fontSize: 24px
    fontWeight: 300
    lineHeight: 30px
    letterSpacing: "0.96px"
  heading-md:
    fontFamily: "\"Nobel\", sans-serif"
    fontSize: 18px
    fontWeight: 300
    lineHeight: 22px
    letterSpacing: "0.72px"
  heading-sm:
    fontFamily: "\"Nobel\", sans-serif"
    fontSize: 16px
    fontWeight: 500
    lineHeight: 24px
    letterSpacing: "0.64px"
  body-lg:
    fontFamily: "\"Nobel\", sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
    letterSpacing: "0.56px"
  body-md:
    fontFamily: "\"Nobel\", sans-serif"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 18px
    letterSpacing: "0.52px"
  body-sm:
    fontFamily: "\"Nobel-book\", \"Nobel\", sans-serif"
    fontSize: 11px
    fontWeight: 400
    lineHeight: 14px
    letterSpacing: "0.44px"
  label-md:
    fontFamily: "\"Nobel-bold\", \"Nobel\", sans-serif"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 18px
    letterSpacing: "1.3px"
  label-sm:
    fontFamily: "\"Nobel-regular\", \"Nobel\", sans-serif"
    fontSize: 11px
    fontWeight: 400
    lineHeight: 14px
    letterSpacing: "1.1px"
  nav-link:
    fontFamily: "\"Nobel-book\", \"Nobel\", sans-serif"
    fontSize: 10px
    fontWeight: 400
    lineHeight: 12px
    letterSpacing: "1px"
  button-md:
    fontFamily: "\"Nobel-bold\", \"Nobel\", sans-serif"
    fontSize: 13px
    fontWeight: 600
    lineHeight: 18px
    letterSpacing: "0.52px"

rounded:
  none: "0px"
  lg: "20px"
  xl: "24px"
  full: "9999px"

spacing:
  xs: "4px"
  sm: "6px"
  base: "8px"
  md: "10px"
  lg: "12px"
  xl: "15px"
  2xl: "16px"
  3xl: "24px"
  4xl: "36px"
  5xl: "45px"

components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.canvas}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: "8px 24px"
    height: "36px"
  button-secondary:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: "8px 24px"
    height: "36px"
    borderColor: "{colors.ink}"
  top-nav:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.nav-link}"
    rounded: "{rounded.none}"
    padding: "15px 24px"
    height: "60px"
    borderColor: "{colors.hairline}"
  nav-link:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.nav-link}"
    padding: "6px 12px"
  hero-heading:
    backgroundColor: transparent
    textColor: "{colors.canvas}"
    typography: "{typography.display-xl}"
    padding: "0"
  section-heading:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.display-md}"
  body-paragraph:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
  body-paragraph-muted:
    backgroundColor: transparent
    textColor: "{colors.muted}"
    typography: "{typography.body-sm}"
  model-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: "0"
  feature-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xl}"
    padding: "24px"
  stat-pill:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    padding: "6px 12px"
    height: "28px"
    borderColor: "{colors.ink}"
  luxury-chip:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.gold-accent}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    padding: "6px 12px"
    height: "28px"
    borderColor: "{colors.gold-accent}"
  uppercase-label:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.label-md}"
  footer-link:
    backgroundColor: transparent
    textColor: "{colors.muted}"
    typography: "{typography.body-sm}"
---

## Overview

Lexus's marketing chrome is the most disciplined monochrome in the automotive luxury category. **Restraint as voltage.** Where Mercedes leans on charcoal-and-silver, BMW on a warmer kidney-grille blue, and Ferrari on hard-cut red-on-black, Lexus inverts the entire luxury convention toward neutral ink-on-canvas. Across the captured page, pure black `{colors.ink}` (#000000) carries 1001 occurrences as text (497) and border (496) — the load-bearing structural ink. White `{colors.canvas}` (#ffffff) carries 136 as canvas. The single chromatic exception anywhere on the chrome is champagne gold `{colors.gold-accent}` (#b6a171), which surfaces six times only — all on luxury-tier chip outlines and spec-badge frames. There is no other color.

The typographic move is **tracking-as-hierarchy**. Nobel — a geometric sans by Tobias Frere-Jones — runs every tier of the system, from 40px display down to 10px nav link. Display sits at weight 300 with explicit 0.44-0.96px letter-spacing; small-caps labels at weight 700 with 1.1-1.6px tracking. The hierarchy comes from tracking, not from weight: the same Nobel 13px body and Nobel 13px label can sit beside each other and read as different registers entirely because the letter-spacing widens by 0.78px. Most luxury-automotive systems use a serif at weight 400 for editorial display; Lexus uses Nobel at weight 300 with explicit tracking and lets the geometry carry the formality.

The shape language is **generous-rounded plus pill**. Cards default to 20-24px corners, softer than the 8-12px SaaS default and more confident than the 2-4px utility square. Stat-callout chips and primary buttons render fully rounded at `{rounded.full}` — the only pill-shaped elements in the system. There is no 4 / 8 / 12px middle tier; the binary scale matches the soft-corner geometry of the L-spindle grille on the vehicle photography.

**Key Characteristics:**
- Pure black `{colors.ink}` (#000000) carries 1001 captured occurrences as structural ink — 497 as text, 496 as border, 7 as background, 1 as shadow. Wired in CSS as `--colors-black`.
- White `{colors.canvas}` (#ffffff) is the canvas at 136 occurrences, with sub-tone clustering into the same token via the brand's CSS variable system (`--colors-white`, `--colors-neutral-50`, and dozens of other tonal-50 variants resolve here).
- Champagne gold `{colors.gold-accent}` (#b6a171) surfaces six times only — the single chromatic note on luxury-tier chip outlines, never on body chrome or primary CTAs.
- Nobel runs every typographic tier as the only typeface, with weights distributed between 300 (display), 400 (body and nav), 500-700 (labels and emphasis).
- Letter-spacing carries hierarchy: 0.44px on body, 0.56-0.96px on display, 1.0-1.6px on small-caps labels.
- Generous-rounded card geometry at 20-24px, pill-shaped primary buttons and stat chips at 9999px, no middle radius tier.
- Gray text ladder runs `{colors.muted-light}` (#adadad) for tertiary borders / muted text and `{colors.muted}` (#707070) for secondary body — wired as `--colors-neutral-500` / `-gray-500` / `-zinc-500`.
- 455 CSS custom properties exposed on `:root` — a Chakra-style design-token system collapsed onto a near-monochrome rendered surface.

## Colors

### Brand

- **Ink** (`{colors.ink}` — #000000): frequency 1001. Used as text (497), border (496), background (7), shadow (1). The dominant structural ink across every tier — wordmark fill, section h2 color, model-card outline, primary button fill, nav link color. Wired in CSS as `--colors-black` and `--colors-transparent`. The system's load-bearing tone.
- **Gold Accent** (`{colors.gold-accent}` — #b6a171): frequency 6 — 3 text, 3 border. The single chromatic accent anywhere on the chrome. Used on luxury-tier chip outlines, spec-badge frames, and the F-Sport / LX trim signifier. The 6 occurrences are reserved for moments where ink can't carry the luxury cue alone.

### Surface

- **Canvas** (`{colors.canvas}` — #ffffff): frequency 136 — 62 text (on dark crops), 62 border, 12 background. The dominant page floor. Clustered with off-white near-white tones in the extractor — the brand wires every tonal-50 CSS variable (`--colors-neutral-50`, `--colors-slate-50`, `--colors-gray-50`, etc.) to resolve at this value, treating "near-white" as a single canonical tone.
- **Ink Soft** (`{colors.ink-soft}` — #222222): frequency 1, background-only. A near-black secondary used for the darkened gallery wall behind hero photography. Wired as `--colors-zinc-800` / `--colors-neutral-800` / `--colors-stone-800`.
- **Hairline** (`{colors.hairline}` — #efefef): frequency 1, border-only. A lighter divider tone used on footer rules and section dividers between editorial bands. Resolves dozens of tonal-100 CSS variables to a single rendered value.

### Text

- **Muted** (`{colors.muted}` — #707070): frequency 18 — 9 text, 9 border. The secondary running-text tone used in body paragraphs below model cards. Wired as `--colors-neutral-500`, `--colors-gray-500`, `--colors-zinc-500`, `--colors-stone-500`.
- **Muted Light** (`{colors.muted-light}` — #adadad): frequency 84 — 42 text, 42 border. The tertiary text and hairline tone used on form labels, disabled buttons, and the lightest reading-text surface.

### Utility

- **Link Blue** (`{colors.link-blue}` — #0000ee): frequency 2 — 1 text, 1 border. The unstyled browser-default blue used on legal footer links that aren't re-skinned to ink. Not a brand color — a fallback that surfaces on non-overridden anchor elements.

## Typography

### Font Families

The system runs **Nobel** across every typographic tier as the only typeface. Nobel is Tobias Frere-Jones' 1929/1993 revival of Sjoerd Hendrik de Roos's geometric sans — neither contemporary grotesk nor humanist. The brand uses multiple Nobel cuts wired as separate CSS-stack names: `nobel` (the base cut), `nobel-book` (lighter for body / nav), `nobel-regular` (mid-weight), and `nobel-bold` (heavier for buttons / labels). All fall back to `sans-serif`. There is no separate display family, no serif tier, and no monospace anywhere on the captured chrome.

### Hierarchy

| Token | Cut | Size | Weight | Line Height | Tracking | Use |
|---|---|---|---|---|---|---|
| `{typography.display-xl}` | Nobel | 40px | 300 | 30px | 0.96px | Large promotional display heads on feature bands |
| `{typography.display-lg}` | Nobel | 32px | 300 | 38px | 0.44px | Hero h1 on model landing pages |
| `{typography.display-md}` | Nobel | 24px | 300 | 30px | 0.96px | Section h2 ("Meet the models") |
| `{typography.heading-md}` | Nobel | 18px | 300 | 22px | 0.72px | Sub-section heads |
| `{typography.heading-sm}` | Nobel | 16px | 500 | 24px | 0.64px | Feature card titles |
| `{typography.body-lg}` | Nobel | 14px | 400 | 20px | 0.56px | Primary body running text |
| `{typography.body-md}` | Nobel | 13px | 400 | 18px | 0.52px | Secondary body, model-card metadata |
| `{typography.body-sm}` | Nobel-book | 11px | 400 | 14px | 0.44px | Disclaimer / footnote / fine-print copy |
| `{typography.label-md}` | Nobel-bold | 13px | 400 | 18px | 1.3px | Small-caps section labels, sub-brand chips |
| `{typography.label-sm}` | Nobel-regular | 11px | 400 | 14px | 1.1px | Smaller tracked labels above cards |
| `{typography.nav-link}` | Nobel-book | 10px | 400 | 12px | 1px | Top-nav link labels |
| `{typography.button-md}` | Nobel-bold | 13px | 600 | 18px | 0.52px | Primary and secondary button labels |

### Principles

Display weight stays at 300. Most luxury-automotive systems run editorial display at weight 400 in a serif; Lexus runs Nobel at weight 300 with explicit 0.44-0.96px tracking and lets the tracking carry the formality. The hierarchy device is **letter-spacing**, not weight — the same 13px Nobel body at 0.52px tracking and Nobel-bold label at 1.3px tracking read as different visual registers entirely. The body tier sits at 11-14px, deliberately smaller than the 16-18px SaaS default — the system reads as catalog-print rather than as web-marketing.

The 700 weight is reserved for two narrow roles: small-caps labels above cards (with 1.1-1.6px tracking) and primary button text. There is no italic, oblique, or display-cut variation anywhere on the captured surface.

### Note on Font Substitutes

Nobel is licensed (Frere-Jones Type / Hoefler & Co). The closest open-source substitute is **Inter** at weights 300/400/600 with explicit `letter-spacing` declarations on every tier — 0.04-0.08em depending on size — to approximate the explicit pixel tracking. **Geist Sans** is a tighter alternative if you prefer a more contemporary geometric fit. For an even closer match without licensing, **Hanken Grotesk** at the same weights reads close to Nobel at the 11-14px body sizes.

## Layout

### Spacing System

- **Base unit:** 4-15px hybrid. The dominant gap value is 15px (46 captured occurrences) — an unusual choice that pairs with the small body type for catalog-style rhythm.
- **Tokens:** `{spacing.xs}` 4px · `{spacing.sm}` 6px · `{spacing.base}` 8px · `{spacing.md}` 10px · `{spacing.lg}` 12px · `{spacing.xl}` 15px · `{spacing.2xl}` 16px · `{spacing.3xl}` 24px · `{spacing.4xl}` 36px · `{spacing.5xl}` 45px.
- **Section padding (vertical):** the hero plate is full-viewport; below the fold, sections sit at ~36-45px vertical rhythm between bands.
- **Card internal padding:** 0 on model cards (the vehicle render fills edge-to-edge with metadata sitting beneath), 24px on feature blocks.
- **Nav padding:** `{spacing.xl}` (15px) vertical, `{spacing.3xl}` (24px) horizontal in the masthead.

### Grid & Container

- **Max content width:** ~1440px viewport with the hero photograph extending edge-to-edge; below-fold content centers at ~1280px.
- **Hero block:** full-bleed studio photography of the staged vehicle against a darkened gallery wall; small-caps label overlay positioned bottom-left.
- **Model strip:** 3-up grid of vehicle thumbnail cards ("Meet the models" — ES sedan, NX SUV, LX SUV are visible in the captured screenshot), each card rounded at 20px and bordered with a 1px ink hairline.
- **Shopping tools strip:** horizontal row of icon chips with small-caps tracked labels beneath each — Build, Search, Compare, Test Drive, Offers.
- **Feature bands:** alternating editorial sections with full-width photography crops on one side and a centered text column on the other.

### Rhythm

The page alternates between **studio-cinematic** and **catalog-editorial** bands. The hero studio render is generous (full-viewport, minimal overlay text). The model strip is dense (3-up card grid with 15px gaps). Feature bands are generous again (editorial composition with photography). The shopping-tools chip row is densely packed. The footer is a multi-column link grid with the smallest type tier on the page. The 11-14px body sizing keeps the rhythm catalog-tight without ever feeling cramped — the explicit tracking is what gives the text room to breathe at small sizes.

## Elevation

The system has **essentially no shadow tier**. Of the 1001 black-color occurrences, only 1 is used as shadow ink — a faint elevation on a single overlay element. Below-fold cards use 1px hairline borders for separation; the masthead doesn't carry a shadow under it either. Hierarchy comes entirely from card outlines, surface-tone contrast (`{colors.hairline}` over `{colors.canvas}`), and photographic edges.

- **Flat (no shadow):** hero, body bands, model cards, feature blocks, footer — 100% of body surfaces.
- **Hairline outlines:** every model card, feature card, and form-element border uses a 1px `{colors.ink}` rule — high-contrast against the white canvas.
- **Photographic edge:** model cards lean on the cropped edge of the vehicle render itself for definition rather than on a drawn drop-shadow.

## Shapes

The radius scale is **generous-rounded plus pill**:

- `{rounded.none}` 0px — used on photographic crops and full-bleed hero blocks.
- `{rounded.lg}` 20px — the dominant body card radius (8 captured occurrences on the model-card grid).
- `{rounded.xl}` 24px — feature cards and larger surface tiles (8 captured occurrences).
- `{rounded.full}` 9999px — primary buttons, stat callout chips, luxury-tier chips, and icon affordances (2 captured at 932px which renders as effectively full at chip sizes).

The scale skips the 4-12px middle tier entirely. There is no `{rounded.sm}` or `{rounded.md}` token in the system because the chrome is intentionally binary — generous-rounded for body or fully circular for chips. The soft-corner card geometry pairs naturally with the L-spindle silhouette of the front grille.

## Components

**`button-primary`** — The signature CTA. Pure black `{colors.ink}` fill, white text, `{rounded.full}` pill radius, 8x24 padding, 36px height. Label in Nobel-bold at `{typography.button-md}` (13px / 600 / 0.52px tracking). "Build" / "Find a dealer" are canonical instances.

**`button-secondary`** — White `{colors.canvas}` fill, ink text, 1px ink border, `{rounded.full}` pill radius. Same dimensions as primary. Used for tertiary actions on the white floor.

**`top-nav`** — White `{colors.canvas}` surface, ink text, 60px height, 15x24 padding, 1px `{colors.hairline}` bottom rule. Houses the Lexus wordmark flush left, the model nav center (Models, Shopping Tools, Owners, Service), and the right-aligned Search / Login cluster.

**`nav-link`** — Transparent background, ink text in `{typography.nav-link}` (10px / 400 / 1px tracking). The smallest typographic tier on the page — the nav links read as catalog metadata rather than as primary navigation.

**`hero-heading`** — Either white text over the dark gallery hero photography or ink text below the fold. Display tier sits at `{typography.display-xl}` (40px / 300) for promotional banners and `{typography.display-md}` (24px / 300) for section h2s.

**`section-heading`** — Ink `{colors.ink}` text on the below-fold white floor, Nobel at `{typography.display-md}` (24px / 300 / 0.96px tracking). Used for the model-strip h2 ("Meet the models").

**`body-paragraph`** — Default ink text at `{typography.body-md}` (13px / 400) — the workhorse paragraph treatment on the editorial floor.

**`body-paragraph-muted`** — Muted `{colors.muted}` (#707070) variant of the body paragraph for secondary captions and disclaimer text.

**`model-card`** — White `{colors.canvas}` fill, ink text, `{rounded.lg}` 20px corners, 1px ink hairline border, 0 internal padding (the vehicle render fills edge-to-edge with the model name and starting price sitting beneath in `{typography.body-md}`).

**`feature-card`** — White fill, ink text, `{rounded.xl}` 24px corners, 24px internal padding. The larger card variant used for editorial-band content blocks.

**`stat-pill`** — White fill, ink text, 1px ink border, `{rounded.full}` pill radius, 6x12 padding, 28px height. Used for stat callouts ("318 MILES RANGE", "0-60 IN 4.1s") in `{typography.label-sm}` with 1.1px tracking.

**`luxury-chip`** — White fill, champagne gold `{colors.gold-accent}` text and border, `{rounded.full}` pill radius. The single chromatic element type on the page — used for F-Sport / LX trim signifiers and luxury-tier callouts.

**`uppercase-label`** — Ink text in `{typography.label-md}` (13px / 1.3px tracking). The small-caps section label that sits above hero h2s and feature heads — does the work an all-caps stylized treatment would do on other systems.

**`footer-link`** — Muted `{colors.muted}` (#707070) text at `{typography.body-sm}` (11px / 0.44px tracking). The smallest typographic tier on the page outside of the nav, used for footer category sub-labels and legal links.

## Do's and Don'ts

**Do** reserve `{colors.gold-accent}` (#b6a171) for luxury-tier chip outlines and trim signifiers. The gold has six total occurrences on the captured chrome — multiplying it into primary CTAs or secondary accents flattens the luxury cue.

**Do** let letter-spacing carry the typographic hierarchy. The same Nobel 13px body at 0.52px tracking and label at 1.3px tracking read as different registers because of the tracking. Bumping weight from 400 to 700 without adjusting tracking misses the system's signature device.

**Do** use 1px ink hairlines for card outlines on the white floor. Black-on-white edges at maximum contrast supply the entire elevation system — softening to a gray border weakens the catalog-print precision.

**Do** keep display weight at 300 on Nobel. The hero h1 and section h2s sit at 24-40px in weight 300, deliberately under-weighted against the SaaS-default 500-600. Bumping to 500 turns the catalog editorial into a generic luxury-marketing shout.

**Don't** introduce a chromatic accent beyond `{colors.gold-accent}` (#b6a171). The brand operates from a single accent — adding a second color anywhere on body chrome breaks the discipline that defines the system.

**Don't** use `{colors.muted-light}` (#adadad) for primary text — it is a hairline / tertiary border token (42 of 84 occurrences are borders). For dim body text use `{colors.muted}` (#707070) instead.

**Don't** introduce a 4 / 8 / 12px middle radius tier. The system is binary — generous-rounded 20-24px on body cards or fully circular at `{rounded.full}` on chips. Adding a middle radius softens the catalog-precision contrast between body cards and pill chips.

**Don't** drop the explicit letter-spacing declarations when re-implementing in Tailwind. The Nobel tier carries 0.44-1.6px tracking across every size — defaulting to `letter-spacing: normal` collapses the typographic hierarchy back into pure weight, and the chrome stops reading as Lexus.

## Known Gaps

- **Hover and focus states:** the captured marketing chrome shows resting states only. The full state matrix (button hover, focus rings, active press, disabled tints) is not exposed.
- **Form input error states:** form chrome (text-input, validation, error styling) was not visible in the captured marketing surface. The text-input component is implied by the chip / button shape language but not directly captured.
- **Dark mode:** the captured marketing surface is light-only. A dark variant likely exists in the Lexus Drivers / Enform product surface but is not represented here.
- **Motion:** the hero photography is typically delivered as a slowly-panning studio render; easing curves, pan duration, and crossfade timing are not represented in the static spec.
- **Sub-brand surfaces:** the F-Sport, Performance, and Lexus Electrified sub-brands carry slightly distinct band treatments on dedicated landing pages that are not enumerated here.
- **The 455 CSS custom properties:** the extracted page exposes 455 `:root` variables wired into a Chakra-style design-token system, but most of the tonal-50 / -100 / -500 variants resolve to the same handful of rendered values listed above. The full token graph is not unpacked here.
- **The localized inventory / Build flow:** post-ZIP inventory and configurator chrome is not visible in the public marketing surface and uses a richer filter set that is not captured.
- **Dealer-portal product surfaces:** the dealer-facing Lexus Plus / Drivers portals carry their own surface tokens that are not included here.
