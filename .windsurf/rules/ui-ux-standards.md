# Rule: UI & UX Standards

*   **Rule ID**: WS-RULE-007
*   **Target Scope**: shadcn/ui styling, page layouts, theme modes, advertisement styling.
*   **Highest Authority**: [docs/architecture.md](../../docs/architecture.md)

---

## 1. Objective

To deliver a premium, visually stunning, fully responsive, and accessible user experience that incorporates Google AdSense slots without causing layout shifts.

---

## 2. Mandatory Practices

### Component System (shadcn/ui)
*   All UI primitives must be built using shadcn/ui components copied into `components/ui/`.
*   Customize shadcn/ui components only via standard Tailwind configurations in `tailwind.config.ts` or by passing custom utility classes through the `className` prop.

### Aesthetic System
*   Color Palette: Use standard Tailwind HSL color tokens mapped to CSS variables (e.g. `bg-background`, `text-foreground`, `border-input`).
*   Animations: Use smooth, micro-animations (e.g. `transition-all duration-200`) for hover states, button clicks, and modal openings.
*   Theme Syncing: Maintain a dark/light mode toggle. Ensure that every custom tool component styles text and background layers to handle theme transitions automatically.

### Hydration & Crash Recovery
*   All components loading data from local storage or window parameters must implement a Client Hydration Guard (checking component mounting state) to block SSR HTML mismatches.
*   All tools pages must support integration with the React `<ErrorBoundary>` component.

### Ad Integration Layout Rules
*   All ad containers must use the `<AdContainer />` component.
*   Ad slots must be visually distinguished from functional tool layouts using subtle borders and a small "ADVERTISEMENT" label in `text-[10px] text-muted-foreground`.
*   Maintain clear margin space (minimum `24px` / `my-6`) around ad blocks to avoid accidental clicks.

---

## 3. Prohibited Practices

*   **NO Ad-Hoc Styling Sheets**: Writing custom `.css` stylesheets for individual tools is prohibited. Everything must map to Tailwind utility tokens.
*   **NO Floating Pop-Ups**: In-page popups, interstitials, or floating overlay ads that cover tool interfaces are strictly banned.
*   **NO Unresponsive Views**: UI panels must wrap and reflow smoothly on all screen sizes, from mobile screens (320px width) to large monitors (1920px width).
*   **NO Missing Loading Skeletons**: Tools that take time to load or perform actions must render loading spinners or progressive skeleton states to inform the user.

---

## 4. Validation Checklist

- [ ] Does the UI resize fluidly across mobile, tablet, and desktop viewports?
- [ ] Do all colors adjust correctly when switching between dark and light themes?
- [ ] Are all local storage integrations protected by a Client Hydration Guard?
- [ ] Are all ad containers pre-initialized with fixed CSS height parameters?
- [ ] Are all interface primitives derived from shadcn/ui?
- [ ] Do interactive elements (buttons, inputs) show clear focus outlines for keyboard users?
