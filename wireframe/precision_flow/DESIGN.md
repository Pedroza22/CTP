---
name: Precision & Flow
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#434654'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#737686'
  outline-variant: '#c3c5d7'
  surface-tint: '#1353d8'
  primary: '#003fb1'
  on-primary: '#ffffff'
  primary-container: '#1a56db'
  on-primary-container: '#d4dcff'
  inverse-primary: '#b5c4ff'
  secondary: '#4442e3'
  on-secondary: '#ffffff'
  secondary-container: '#5f5ffd'
  on-secondary-container: '#fffbff'
  tertiary: '#8b0075'
  on-tertiary: '#ffffff'
  tertiary-container: '#b40099'
  on-tertiary-container: '#ffd0ec'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b5c4ff'
  on-primary-fixed: '#00174d'
  on-primary-fixed-variant: '#003dab'
  secondary-fixed: '#e1dfff'
  secondary-fixed-dim: '#c1c1ff'
  on-secondary-fixed: '#09006b'
  on-secondary-fixed-variant: '#2c24ce'
  tertiary-fixed: '#ffd8ee'
  tertiary-fixed-dim: '#ffade3'
  on-tertiary-fixed: '#3a0030'
  on-tertiary-fixed-variant: '#860071'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.4'
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.02em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
---

## Brand & Style
This design system is engineered for high-velocity project management, blending the utilitarian precision of developer-centric tools with the vibrant, approachable clarity of collaborative workspaces. The aesthetic is **Modern Corporate**, leaning heavily into high-performance minimalism. 

The system prioritizes information density and cognitive ease, ensuring that complex task hierarchies remain legible. It evokes a sense of reliability and effortless coordination, using structural rigidity to provide a feeling of stability while employing subtle motion and soft elevation to feel responsive and modern.

## Colors
The palette is anchored by a deep professional blue, used for primary actions and brand presence. To balance high-performance utility with visual interest, a secondary vibrant indigo (inspired by Monday.com) is used for collaborative features and secondary highlights.

### Semantic Palette
- **Primary:** Deep Blue (#1a56db) for core navigation and "Commit" actions.
- **Secondary:** Indigo (#6161ff) for selection states and multi-user interactions.
- **Neutral:** A Slate Gray scale ranging from #F8FAFC (Surface) to #0F172A (Text) provides the structural foundation.
- **Accents:** Semantic colors follow a strict logic: Emerald for completion, Amber for active progress, and Rose for blockers.

### Theming
The design system supports a "Crisp Light" mode (high contrast, white backgrounds) and a "Focused Dark" mode. In Dark Mode, backgrounds shift to a deep midnight slate (#020617) to reduce eye strain during prolonged technical work.

## Typography
The typographic system uses a tiered approach to maximize readability in data-dense environments.

- **Headlines:** Hanken Grotesk provides a sharp, contemporary feel for page titles and section headers.
- **Body:** Inter is the workhorse for all task descriptions and interface text, chosen for its exceptional legibility at small sizes.
- **Data/Labels:** JetBrains Mono is used sparingly for IDs, timestamps, and metadata to give a subtle "technical" edge similar to developer tools.

Line heights are generous for body text to prevent fatigue, while display sizes use tighter leading and negative letter-spacing for a sophisticated, editorial look.

## Layout & Spacing
The system utilizes a **12-column fluid grid** with fixed gutters to ensure consistency across complex dashboards.

- **Rhythm:** A 4px baseline grid governs all spacing. Vertical rhythm is strictly enforced using multiples of 4 (8px, 16px, 24px).
- **Desktop:** Sidebars are fixed-width (240px or 280px), while the main content area expands. Cards and list views utilize the full width to accommodate wide table data.
- **Mobile:** The layout collapses to a single column with 16px horizontal margins. Navigation moves to a bottom bar or a full-screen drawer.
- **Density:** The system supports a "Compact" view option where vertical padding is halved (from 12px to 6px) for power users managing high volumes of tasks.

## Elevation & Depth
Depth is created through **Tonal Layering** supplemented by **Ambient Shadows**. This design system avoids heavy skeuomorphism in favor of a "stacked" paper metaphor.

- **Level 0 (Base):** Background color (Slate 50 or Slate 950).
- **Level 1 (Surface):** Cards and main content containers. Uses a subtle 1px border (#E2E8F0 in light, #1E293B in dark).
- **Level 2 (Elevated):** Hover states and dropdowns. Uses a soft, diffused shadow: `0 4px 12px -2px rgba(0,0,0,0.08)`.
- **Level 3 (Overlay):** Modals and dialogs. Features a slightly larger shadow and a background backdrop blur (8px) to maintain context while focusing the user.

## Shapes
The shape language is consistently **Rounded (8px)**. This medium radius provides a professional yet modern appearance that feels more approachable than sharp corners but more serious than pill-shaped aesthetics.

- **Buttons & Inputs:** 8px (Medium) for a standard, reliable feel.
- **Cards & Modals:** 12px (Large) to define clear container boundaries.
- **Status Tags/Chips:** Full pill (999px) to distinguish them from interactive buttons and indicate they are discrete metadata units.

## Components
- **Buttons:** Primary buttons use solid fills (#1a56db) with white text. Secondary buttons use a subtle ghost style with a 1px border. Hover states involve a slight darkening of the fill or a faint background tint.
- **Input Fields:** Use a 1px border with a 4px focus ring in the primary blue. Labels are always positioned above the field in `body-sm` weight.
- **Task Cards:** Feature a left-hand accent border corresponding to the status color (e.g., green for completed). They include a subtle shadow on hover to indicate interactivity.
- **Chips/Status:** High-contrast background with dark text for light mode; low-opacity background with bright text for dark mode.
- **Navigation:** Vertical sidebar using "active state" indicators—a vertical line on the left edge and a subtle background tint behind the icon and label.
- **Data Tables:** Row-based hover effects; headers are uppercase `label-md` with a subtle bottom border to separate them from the data rows.