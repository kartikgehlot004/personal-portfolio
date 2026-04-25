# Design Brief

## Purpose & Context
Premium personal research portfolio website. Showcase academic work, articles, publications, and bio to researchers, professionals, and collaborators. Visual polish and smooth interactions create memorable first impression.

## Tone & Differentiation
Editorial modernism with refined minimalism. Bold serif headlines (Fraunces) paired with humanist sans-body (General Sans). Deep blue-purple primary with warm coral-orange accents. Sophisticated color palette over bright defaults. Smooth entrance animations and intentional depth layering. Every surface has deliberate styling — no ghost text on flat backgrounds.

## Color Palette (OKLCH)

| Token                  | Light Mode         | Dark Mode          | Purpose                                    |
|:--------------------|:-------------------|:------------------|:-------------------------------------------|
| Primary              | 0.45 0.18 265      | 0.72 0.16 265      | Deep blue-purple, headings, primary buttons |
| Accent               | 0.68 0.18 45       | 0.74 0.16 45       | Coral-orange, CTAs, hover highlights       |
| Secondary            | 0.65 0.08 260      | 0.50 0.06 262      | Muted blue, subtle accents                 |
| Background           | 0.98 0.01 240      | 0.12 0.01 265      | Base surface                               |
| Foreground           | 0.20 0.02 265      | 0.95 0.01 240      | Primary text                               |
| Muted                | 0.92 0.01 240      | 0.20 0.01 263      | Section backgrounds, dividers               |
| Card                 | 0.99 0.01 245      | 0.16 0.01 264      | Elevated content containers                |

## Typography

| Layer    | Font            | Size                | Weight  | Usage                                |
|:--------|:----------------|:------------------|:--------|:-------------------------------------|
| Display | Fraunces        | 3rem–5rem          | 700     | Hero headline, section titles         |
| Subhead | Fraunces        | 1.5rem–2rem        | 500–600 | Page section headings                |
| Body    | General Sans    | 1rem–1.125rem       | 400–500 | Article text, descriptions           |
| Small   | General Sans    | 0.875rem            | 400     | Metadata, labels, captions           |
| Mono    | Geist Mono      | 0.875rem            | 400     | Code snippets, article metadata      |

## Structural Zones

| Zone     | Background        | Border          | Styling & Separation                                   |
|:--------|:-----------------|:----------------|:------------------------------------------------------|
| Header   | Primary (0.45)    | Accent bottom   | Sticky, elevated shadow, nav links in foreground      |
| Hero     | Gradient accent   | None            | Animated background, floating orb, staggered text    |
| Content  | Muted (0.92 light)| Subtle top      | Grid of cards, each with card background + shadow    |
| Footer   | Muted (0.92 light)| Subtle top      | Social links in accent color, copyright text         |

## Spacing & Rhythm
- Base unit: 0.5rem (8px)
- Sections: 4rem (64px) gap between major sections
- Cards: 2rem (32px) padding internal, 1.5rem (24px) gap between
- Responsive: 1.5rem (24px) mobile, 2rem (32px) tablet, 4rem (64px) desktop

## Component Patterns
- **Buttons**: Primary (bg-primary, text-white, rounded-lg, accent hover), Secondary (border-primary, text-primary, transparent bg)
- **Cards**: bg-card, card-elevated shadow, card-hover lift effect on hover, 2px translateY, rounded-lg
- **Links**: text-accent, underline-offset-2, no decoration until hover
- **Forms**: border-border, focus:ring-2 ring-accent

## Motion & Animation
- **Page Load**: Fade-in-up (0.6s ease-out) on content sections, staggered 100ms per card
- **Hover**: Card lift (2px up), shadow elevation (0.3s ease-out)
- **Hero**: Floating orb (6s infinite ease-in-out), animated gradient background
- **Transitions**: All state changes use transition-smooth (0.3s cubic-bezier)
- **No bounce or playful easing**: Cubic-bezier only, preserve professional tone

## Constraints
- Max 5 total colors in palette (primary, accent, secondary, muted, background)
- Header always sticky with shadow
- Card shadows never harsh — max 12px blur
- Accent color used sparingly — only CTAs, highlights, hovers
- No arbitrary rounded-md/sm — use consistent lg radius throughout
- Dark mode designed intentionally, not inverted

## Signature Detail
Animated gradient background in hero section (blue-purple to slate). Floating accent orb with 6s ease-in-out motion. Staggered fade-in-up animations on page load create rhythm and visual interest. Coral-orange accent used sparingly for CTAs and section highlights — creates sophistication through restraint.

## Design Tokens (index.css)
- Font families set via CSS custom properties (--font-display, --font-body, --font-mono)
- OKLCH palette replaces all neutral greys with blue-purple hue-aligned system
- @font-face declarations for Fraunces, General Sans, Geist Mono bundled fonts
- Utility classes: gradient-primary, text-gradient, card-elevated, card-hover
- Dark mode designed with intentional color shifts, not simple inversion

