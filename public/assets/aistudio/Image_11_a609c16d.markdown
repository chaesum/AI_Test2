---
name: Cognitive Edge
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#c7c4d8'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#918fa1'
  outline-variant: '#464555'
  surface-tint: '#c3c0ff'
  primary: '#c3c0ff'
  on-primary: '#1d00a5'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#4d44e3'
  secondary: '#4cd7f6'
  on-secondary: '#003640'
  secondary-container: '#03b5d3'
  on-secondary-container: '#00424e'
  tertiary: '#bdc2ff'
  on-tertiary: '#131e8c'
  tertiary-container: '#4a55be'
  on-tertiary-container: '#d7d8ff'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#acedff'
  secondary-fixed-dim: '#4cd7f6'
  on-secondary-fixed: '#001f26'
  on-secondary-fixed-variant: '#004e5c'
  tertiary-fixed: '#e0e0ff'
  tertiary-fixed-dim: '#bdc2ff'
  on-tertiary-fixed: '#000767'
  on-tertiary-fixed-variant: '#2f3aa3'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
  surface-base: '#0B0F19'
  surface-card: '#111827'
  surface-elevated: '#1E293B'
  border-subtle: '#1F293D'
  border-prominent: '#334155'
  status-danger: '#EF4444'
  status-success: '#10B981'
typography:
  headline-xl:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Geist
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Geist
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.03em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 3rem
  margin-mobile: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

The design system establishes an AI-first, experimental yet deeply trustworthy environment crafted for modern cognitive and academic consultation. Operating at the intersection of technical precision and human-centric mentorship, the visual tone balances analytical rigor with calm, distraction-free clarity.

Key style pillars:
- **Technological Precision:** Sharp visual logic using monoline borders, translucent dark surfaces, and crisp typographical hierarchy to instill confidence in the AI consultation engine.
- **Cognitive Serenity:** A rich, low-luminance dark backdrop suppresses visual fatigue during prolonged consultation sessions, directing absolute focus toward dialogue, reflection, and profile configuration.
- **Curated Softness:** Generous curvature and pill geometry introduce an approachable, humane touch, softening the edge of deep generative AI interactions.

## Colors

The color palette centers on high-depth dark values accented by an electric indigo primary (`#4F46E5`) and focused teal secondary (`#06B6D4`). 

- **Primary (`#4F46E5`):** Reserved for core interactive targets, active conversation highlights, and primary navigation states.
- **Secondary (`#06B6D4`):** Represents AI synthesis, dynamic typing cursors, and system suggestions.
- **Tertiary (`#818CF8`):** Serves as high-contrast textual links, subtle focus highlights, and selected badge states within dark containers.
- **Surface Foundations:** Background layers migrate from absolute foundation (`#0B0F19`) to interactive card panels (`#111827`) and elevated hover/popover states (`#1E293B`), ensuring accessible contrast ratios without harsh pure blacks.
- **Named Status Colors:** Critical destructive actions—such as account deletion—utilize `status-danger` (`#EF4444`) with reduced ambient fill to preserve deliberate friction.

## Typography

The typography pairings contrast technical precision against dense cognitive reading flow:
- **Headlines (`Space Grotesk`):** Injects a forward-looking, analytical structure to landing titles, screen headers, and card banners. Tight tracking ensures an architectural density.
- **Body & Labels (`Geist`):** Delivers clean readability for Korean and Latin alphabets, maintaining legibility across lengthy consultation dialogues, complex prompt inputs, and compact form metadata.
- Font scales are strictly capped for mobile viewports using dedicated mobile tokens to prevent headline clipping and preserve visual hierarchy on constrained screens.

## Layout & Spacing

The layout is built on a responsive 12-column fluid grid on desktop (scaling to a 4-column system on mobile devices) constrained to a maximum content width of 1200px:
- **Landing Page:** Uses alternating full-bleed sections with nested content containers aligned to the 12-column grid.
- **Chatbot Workspace:** Utilizes an inner single-column focused column (max 768px wide) flanked by ambient canvas margin to maintain deep attention during input and output.
- **Authentication & Profile Forms:** Centered card architecture (max 440px width on desktop) with standard `space-lg` internal component padding.
- Spacing follows an 8pt conceptual rhythm, with `space-sm` (8px) and `space-md` (16px) regulating dense structural relationships between input labels, fields, and control buttons.

## Elevation & Depth

Visual hierarchy within the dark aesthetic relies on calibrated tonal surfacing, subtle border definitions, and indigo-tinted ambient glow rather than standard drop shadows.

- **Level 0 (Canvas):** Pure base tone (`surface-base`) devoid of elevation or border boundaries.
- **Level 1 (Panels & Cards):** Applied to form envelopes, chat history records, and service summary modules. Uses `surface-card` backed by a 1px `border-subtle` outline.
- **Level 2 (Chat Bubbles & Dropdowns):** Elevated using `surface-elevated` with a delicate ambient shadow (`0 8px 30px rgba(0, 0, 0, 0.45)`) combined with a crisp, low-opacity white stroke (`rgba(255, 255, 255, 0.08)`).
- **Interactive Focus & Glow:** Active inputs and primary action buttons emit an indigo-tinted ambient halo (`0 0 20px rgba(79, 70, 229, 0.3)`), signifying active AI readiness without shifting surrounding geometry.

## Shapes

The design uses a pill-oriented rounding standard (`roundedness: 3`) to counterbalance the dark, technical visual elements.

- **Buttons & Text Inputs:** Styled as full pill geometries (`rounded-full` / 9999px) or heavy standard rounds (1rem / 16px) to offer a smooth, human tactile feel.
- **Cards & Consultation Enclosures:** Styled with `rounded-xl` (3rem / 48px on large outer hero containers; 1.5rem / 24px on secondary cards) to frame content softly.
- **Micro-surfaces:** Badges, tags, and AI activity indicators default to pill shapes, reinforcing interactive affordance across all five screens.

## Components

### Buttons
- **Primary:** Full pill (`rounded-full`), solid `#4F46E5` fill, pure white text (`label-lg`), with subtle top inner highlight. Hover triggers a gentle brightness increase and indigo glow.
- **Secondary / Ghost:** Transparent base with 1px `border-prominent` stroke and `#E2E8F0` text. Hover transitions to `surface-elevated`.
- **Destructive (Account Deletion):** Outlined with `status-danger` (`#EF4444`) border and text on `surface-card`. Hover state fills with translucent red (`rgba(239, 68, 68, 0.12)`).

### Input Fields & Textareas
- **Form Inputs (Login, Sign-Up, Profile):** Height 48px, pill-styled edges (or 16px radius for multi-line textarea), filled with `surface-card`, outlined by `border-subtle`. Placeholder text in muted slate (`#64748B`). Active focus activates a 1.5px `#4F46E5` border with indigo outer glow.
- **Chatbot Message Bar:** Integrated consultation input container featuring a multi-line auto-expanding field, a docked circular or pill submit button on the right edge, and internal spacing of `space-md`.

### Cards & Dialogs
- **Form Containers:** Centralized modules wrapped in `surface-card`, bounded by a 1px border (`border-subtle`), with `space-xl` inner padding and `rounded-lg` corners.
- **Consultation Dialogue Blocks:** Alternating user message bubbles (tinted deep indigo surface with right alignment) and system chatbot outputs (`surface-card` with left alignment and teal micro-accents).

### Chips & Status Indicators
- **Category & Suggested Prompt Chips:** Pill-shaped, subtle semi-transparent background (`rgba(255, 255, 255, 0.04)`), 1px border. Hover shifts border color to `#06B6D4` (Teal), inviting interaction.