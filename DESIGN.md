---
name: LARP Auto
description: A brick build-instruction book rendered in voxels, for an enthusiast-vehicle sales advisory.
colors:
  ink: "#12171c"
  ink-muted: "#454f58"
  ink-faint: "#5e686f"
  page: "#ffffff"
  page-sunk: "#f5f8fa"
  page-blue: "#bfe6ff"
  brick-red: "#e53935"
  part-yellow: "#ffd23f"
  mark-green: "#3aae64"
  hairline: "#d7dee4"
  shadow-ink: "rgba(18, 23, 28, 0.32)"
  shadow-ink-soft: "rgba(18, 23, 28, 0.24)"
  scrim: "rgba(255, 255, 255, 0.86)"
  grid-dot: "rgba(18, 23, 28, 0.22)"
  grid-dot-faint: "rgba(18, 23, 28, 0.13)"
typography:
  display:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 1.5rem + 3.6vw, 4.35rem)"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(2rem, 1.3rem + 2.6vw, 3.3rem)"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "-0.035em"
  figure:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(3.4rem, 2.3rem + 4.6vw, 5.6rem)"
    fontWeight: 900
    lineHeight: 1
    letterSpacing: "-0.05em"
  numeral:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(3.2rem, 2.4rem + 2.4vw, 4.7rem)"
    fontWeight: 900
    lineHeight: 0.8
    letterSpacing: "-0.05em"
  title:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(1.15rem, 1rem + 0.6vw, 1.45rem)"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "-0.02em"
  title-small:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.05rem"
    fontWeight: 800
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  wordmark:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.28rem"
    fontWeight: 900
    lineHeight: 1.1
    letterSpacing: "-0.045em"
  lede:
    fontFamily: "Chivo, system-ui, sans-serif"
    fontSize: "clamp(1.1rem, 1rem + 0.5vw, 1.32rem)"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  prose:
    fontFamily: "Chivo, system-ui, sans-serif"
    fontSize: "clamp(1.1rem, 0.9rem + 0.9vw, 1.35rem)"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  body:
    fontFamily: "Chivo, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  nav:
    fontFamily: "Chivo, system-ui, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "normal"
  body-small:
    fontFamily: "Chivo, system-ui, sans-serif"
    fontSize: "0.93rem"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
  label:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0.14em"
  micro:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.65rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "0.1em"
rounded:
  sm: "3px"
  md: "5px"
  lg: "6px"
spacing:
  gutter: "clamp(1.25rem, 4vw, 2.5rem)"
  section: "clamp(3.5rem, 8vw, 6.5rem)"
  panel: "clamp(1.5rem, 4vw, 2.4rem)"
  container: "76rem"
components:
  button-primary:
    backgroundColor: "{colors.part-yellow}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0.85rem 1.35rem"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0.85rem 1.35rem"
  stage:
    backgroundColor: "{colors.page-blue}"
    rounded: "{rounded.lg}"
  panel:
    backgroundColor: "{colors.page}"
    rounded: "{rounded.lg}"
---

# Design System: LARP Auto

## Overview

**Creative North Star: "The Build-Instruction Book, In Motion"**

This system explains a service the way a numbered build booklet explains a model: white pages, sky-blue instruction fields, oversized step numerals, black keylines around every part, and diagrams that show the mechanism rather than describing it. Every claim should be expressible as a part, a count, or a quantity — or it does not belong on the page.

The subject is drawn as **isometric voxel vehicles**, generated as real SVG geometry at build time. This is a deliberate constraint: the business has completed no sales, so it owns no photography of its own work, and a vehicle-sales service that borrows someone else's car photography undermines the exact credibility it is selling. A drawn car makes no claim about a car anyone owns.

What separates this from a static diagram system is that **the diagrams move**. Cars run a road at different speeds; a recovered spread seats onto a column; a car drives down the venue it was routed to. All motion shares one grammar — travel along the isometric road, or seating onto it — so the page reads as one mechanism rather than a set of decorated panels.

**Key Characteristics:**
- White ground, colour confined to bordered instruction fields
- 1.5px black keyline on every surface and every voxel face
- Isometric voxel vehicles as the only illustration, generated not photographed
- Oversized numerals as the dominant type gesture
- Brick red reserved for value recovered; part yellow for parts and the action
- One motion grammar: travel along the road, or seat onto it

## Colors

A near-monochrome white page interrupted by instruction-blue fields, with two signal colours that each do one job.

### Primary
- **Page Blue** (#bfe6ff): the instruction page itself, filling any panel that holds a diagram, always carrying a 22px ink dot grid and always bordered. A container colour, never a text or button colour.

### Secondary
- **Mark Green** (#3aae64): the wordmark vehicle only. It is the identity, not a semantic accent, and it appears nowhere else on the surface — a green anywhere in the content would read as a fourth signal the system does not have.
- **Brick Red** (#e53935): value recovered, and nothing else — the gain stacked above a trade offer, the chosen venue's route, the completed rung of the fallback ladder, the total the seller keeps, and the dashed placeholder markers.
- **Part Yellow** (#ffd23f): parts and the primary action. The button, the marked inspection points, the assembled dossier, the road's lane markings.

### Neutral
- **Ink** (#12171c): all text, and every keyline. Border and text share one value on purpose.
- **Ink Muted** (#454f58): body copy and secondary text.
- **Ink Faint** (#5e686f): captions, footer, marque list. The legibility floor.
- **Page** (#ffffff) / **Page Sunk** (#f5f8fa): ground and alternating section bands.
- **Hairline** (#d7dee4): internal dividers where a full ink keyline would be too loud.

### Named Rules

**The Recovered Value Rule.** Brick red marks value that has been recovered or a route that has been chosen. A red heading, a red button, or a red section band breaks the system by spending the only colour that carries the argument.

**The Two Signals Rule.** Red and yellow never appear in the same element. Red is outcome; yellow is part and action.

**The Field Rule.** Saturated colour lives inside a bordered field, never as a full-bleed page background. The page is white; the diagrams are blue.

## Typography

**Display Font:** Archivo (self-hosted variable, 400–900)
**Body Font:** Chivo (self-hosted variable, 400–700)

**Character:** Archivo at 800–900 gives the flat, engineered authority an instruction sheet needs, with numerals sturdy enough to carry a step on their own. Chivo underneath is warmer and more open, which keeps long candid paragraphs readable rather than clinical.

### Hierarchy
- **Display** (800, clamp(2.5rem → 4.35rem), 1.02, -0.035em): one per surface.
- **Figure** (900, clamp(3.4rem → 5.6rem), -0.05em): a monetary quantity. Numbers only.
- **Numeral** (900, clamp(3.2rem → 4.7rem), 0.8): sequence numbers in a staged process.
- **Headline** (800, clamp(2rem → 3.3rem)): section openers.
- **Title** (800, clamp(1.15rem → 1.45rem)): card, venue and disclosure headings.
- **Prose** (400, clamp(1.1rem → 1.35rem), 1.6): the page's default reading size.
- **Body** (400, 1rem): copy inside panels and cards, capped at 66ch.
- **Label** (700, 0.72rem, 0.14em, uppercase): the term half of a term/value pair.

### Named Rules

**The Numeral Weight Rule.** In a sequence, the number is a display element, not a bullet. It is set at least twice the size of the heading beside it and given its own column.

**The Figure Slot Rule.** The figure size is for numbers. A phrase set at figure scale reads as a number the eye then fails to find.

**The No Kicker Rule.** No small uppercase line ever sits above a heading or above a figure. Framing belongs in the unit line beneath a figure, or inside the heading. Uppercase labels are permitted only as the term half of a term/value pair.

**The Tabular Rule.** Any number a reader might compare against another is set with `font-variant-numeric: tabular-nums`.

## Layout

A centred container at 76rem with a fluid gutter (clamp(1.25rem, 4vw, 2.5rem)). Sections are divided by a hairline and alternate white and sunk bands, with clamp(3.5rem, 8vw, 6.5rem) of rhythm and more space above a heading than below it.

Every grid declares `minmax(0, 1fr)` tracks. This is load-bearing: the voxel SVGs carry intrinsic viewBox widths that would otherwise size an auto track and push the page wider than the viewport.

Breakpoints: 40rem (standard list two-up), 46rem (venue rows split), 50rem (stages two-up), 52rem (refusals split), 58rem (gap and pricing split), 62rem (hero two columns), 66rem (primary nav appears), 68rem (standard list three-up). Below 27rem the masthead action swaps its long label for a short one rather than overflowing.

The hero reorders by viewport: on phones the order is copy → diagram → actions, so the vehicles land inside the first screen; from 62rem it becomes a two-row named-area grid with copy and actions stacked left and the diagram spanning both rows.

## Elevation & Depth

Depth comes from the ink keyline first, the isometric geometry second, and shadow only on the button family. Shadows always carry both an offset and a soft blur.

### Shadow Vocabulary
- **Action rest** (`0 3px 7px -3px var(--shadow-ink), 0 10px 20px -10px var(--shadow-ink-soft)`)
- **Action hover** (`0 6px 12px -4px var(--shadow-ink), 0 16px 28px -12px var(--shadow-ink-soft)`), with a 2px lift.

### Named Rules

**The Keyline-First Rule.** Separation is drawn, not shaded. Any panel, field or plate is defined by a 1.5px ink border.

**The Blurred Shadow Rule.** Every shadow carries an offset and a blur. Zero-blur block shadows belong to a neobrutalist world; this is a flat instruction page.

## Shapes

Rectangles with small consistent radii: 6px on fields and panels, 5px on buttons, 3px on the smallest markers. Borders are 1.5px ink, stepping to 2px above a list that opens a section.

The recurring geometry is the 2:1 isometric cube — top face a rhombus of width 2u and height u, side faces of height u — with painter's-algorithm depth sorting by x+y+z, hidden-face culling, three fixed shades per material, and an ink stroke on every visible face. Vehicles are built from a per-length roofline profile read rear-to-nose. Height 2 is the beltline; height 3 is raised solid bodywork (an engine deck or rear haunch); only height 4 opens a glazed cabin with a roof course above it. A profile therefore never leaves bare glass as the car's top surface. Twin racing stripes ride the topmost solid course of every column, so they run unbroken from nose to tail. The wordmark uses the same model at a mid-engine GT profile, which is what makes the mark and the animated cars legibly the same object. Unbroken flat ground is emitted as a three-polygon **plate** rather than one voxel per cell — a 44×26 road is 1144 voxels and about 150KB of markup, or three polygons.

## Motion

Motion is a first-class part of this system rather than a finishing touch, and it has exactly one grammar: **things travel along the isometric road, or seat onto it.**

- **drive** — an element translates by `(n·u, n·u/2)` px, which is n grid units along +x in this projection, fading in at 7% and out at 100%. Used for the racing cars (linear, 4.4–6.3s, staggered negative delays so the frame is populated at load) and for the car that drives to its chosen venue (eased, 3.4s).
- **seat** — an element drops from `translateY(-drop)` onto its resting position once, on an exponential ease-out. Used for the recovered spread landing on the trade-offer column.

An animated element is emitted as **one** `<g data-layer>` wrapping its whole body, never one group per voxel: a car is roughly 250 visible faces, and animating them individually is several hundred animated elements per car.

### Named Rules

**The One Grammar Rule.** Anything that moves either travels the road or seats onto it. A fade, a scale, a spin, or a per-section entrance reveal is outside the system.

**The Reduced-Motion Rule.** All motion sits inside `@media (prefers-reduced-motion: no-preference)`. With motion suppressed, every layer must rest in a composed position — so base positions are authored as a balanced still, never as an off-screen start.

## Components

### Buttons
- **Shape:** 5px radius, 1.5px ink border, 0.85rem × 1.35rem padding, Archivo 700.
- **Primary:** part yellow ground, ink text, with an authored 16px arrow.
- **Hover / Focus:** 2px lift and a deeper blurred shadow over 0.16s exponential ease-out; focus-visible draws a 3px brick-red outline at 3px offset.
- **Ghost:** transparent, same border and metrics, sunk-page fill on hover.
- **Responsive label:** below 27rem the masthead action swaps to a short label.

### Stage (signature)
The instruction field: page-blue ground with a 22px ink dot grid, 1.5px ink border, 6px radius, overflow hidden. Holds diagrams only, never prose. `--plain` is the sunk-page variant with a fainter grid, used for the smaller step diagrams.

### Panel
White ground, same border and radius, clamp(1.5rem, 4vw, 2.4rem) padding. Holds prose, ledgers and tables.

### Ledger
A definition list on a two-column grid, terms in ink-muted, values right-aligned in tabular Archivo, hairline rules between rows. The total row drops its rule and turns brick red.

### Disclosure
Full-width `details` rows on ink rules, summary in Archivo 700 with a chevron built from two 2.5px borders rotating 180° over 0.24s.

### Placeholder Marker (signature)
A small uppercase Archivo chip with a 1.5px dashed brick-red border, inline in the copy it qualifies. It marks a commercial fact the business has not decided. It ships; it is how this system refuses to invent a claim.

## Do's and Don'ts

### Do:
- **Do** draw every vehicle as isometric voxel geometry generated at build time.
- **Do** keep brick red for value recovered and routes chosen.
- **Do** emit unbroken flat ground as a plate, not as a field of voxels.
- **Do** wrap an animated body in one `<g data-layer>`, never one group per voxel.
- **Do** author base positions as a balanced still, since that is what reduced-motion users see.
- **Do** put framing in the unit line beneath a figure, never in an uppercase line above it.
- **Do** declare `minmax(0, 1fr)` on every grid track that can contain a voxel scene.
- **Do** mark an undecided commercial fact with the Placeholder Marker rather than writing plausible copy.
- **Do** label illustrative arithmetic as an illustration, in the same breath as the numbers.

### Don't:
- **Don't** flood a page with page blue; it belongs inside bordered fields.
- **Don't** put a small uppercase line above a heading or a figure.
- **Don't** use a zero-blur offset shadow.
- **Don't** introduce photography, or a gradient standing in for a drawn part.
- **Don't** add motion outside the two named animations; per-section entrance reveals are not part of this system.
- **Don't** put red and yellow in the same element.
- **Don't** state a projected sale price, an average uplift, or any outcome the business has not achieved.
- **Don't** set text lighter than Ink Faint (#5e686f).
