# DESIGN.md - Visual System & Design Guidelines

This file serves as the semantic dictionary of this project's visual identity. It is designed for both human developers and AI coding agents to ensure design consistency across all pages and interactive tools.

---

## 1. Core Visual Identity

The design system of **CoolTools** is heavily inspired by **Porkbun**: a modern, high-contrast, utilitarian, and data-focused layout with playful touches. It rejects soft gradients and rounded curves in favor of crisp borders, bold accents, and absolute square corners.

### Key Pillars:
1. **Zero Rounded Corners**: Strictly `0px` radius on all interactive controls, cards, panels, and borders.
2. **High Information Density**: Clean layout rhythm with minimal decorative whitespace.
3. **Utility-First**: UI serves to present interactive controls clearly; decoration is minimal.
4. **Vibrant Orange Theme**: Used for primary brand markers, active states, key interactive indicators, and core buttons.

---

## 2. Color Tokens (HSL)

Colors are defined using HSL values in `src/app/globals.css` and mapped to Tailwind colors.

### Theme Palette

| Token | Light Mode Value | Dark Mode Value | Semantic Application |
| :--- | :--- | :--- | :--- |
| `--background` | `240 10% 98%` | `240 10% 6%` | Page body background |
| `--foreground` | `240 10% 3.9%` | `240 5% 88%` | Standard body text |
| `--primary` | `25 95% 53%` | `25 90% 55%` | Brand logo, CTAs, accents, primary buttons |
| `--primary-foreground` | `240 10% 4%` | `240 10% 6%` | Text on top of primary colors |
| `--card` | `0 0% 100%` | `240 10% 9%` | Base tool panels and status container panels |
| `--card-foreground` | `240 10% 3.9%` | `240 5% 88%` | Text inside cards |
| `--muted` | `240 4.8% 95.9%` | `240 3.7% 12%` | Inactive tabs, disabled states, sub-panels |
| `--muted-foreground` | `240 3.8% 38%` | `240 5% 62%` | Explanatory subtext, labels, metadata |
| `--border` | `240 5.9% 90%` | `240 6% 15%` | Standard grid, card, and input outlines |
| `--input` | `240 5.9% 90%` | `240 6% 15%` | Input border state (default) |
| `--ring` | `250 85% 58%` | `250 85% 65%` | Active outline/focus indicators |

---

## 3. Typography & Sizing

The typography scale enforces absolute legibility.

* **Primary Font**: Geist Sans (`var(--font-sans)`)
* **Monospace Font**: Geist Mono (`var(--font-mono)`) - used for stats, numbers, hashes, code blocks, JSON, and raw data display.
* **Font Weights**:
  - Regular (`400`) for paragraphs and long text.
  - Medium (`500`) for navigation links, secondary headers, and active state indicators.
  - Bold (`700`) for primary page headings, section headers, and core stats.

---

## 4. Layout & Spacing Rules

* **Page Layout**: Use a structured sidebar layout with a sticky category list on the left and a scrollable content viewport on the right.
* **Component Rhythm**:
  - `p-6` or `gap-6` for main page containers and dashboard layouts.
  - `p-4` or `gap-4` inside card modules and sub-containers.
  - `gap-2` for action button rows and inline headers.
* **Borders**: All cards, inputs, buttons, and panels must use solid `border` or `border-2`. Soft drop-shadows are replaced with solid outline borders or subtle layered border depths (`card-depth-1`).

---

## 5. UI Elements & Tailwind Standards

To implement new features or modify existing components, adhere strictly to these rules:

### A. Buttons (`src/components/ui/Button.tsx`)
* Must have **square corners** (`rounded-none`).
* Use scale effects on click (`active:scale-[0.98]`).
* Hover transitions should be instant or highly snappy (`transition-all duration-100`).

### B. Cards (`src/components/ui/Card.tsx`)
* Solid thin borders with zero radius.
* Use `card-depth-1` for a clean layered appearance:
  ```css
  /* Example depth */
  .card-depth-1 {
    box-shadow: 2px 2px 0px 0px hsl(var(--border));
  }
  ```

### C. Forms & Inputs
* `rounded-none border border-input bg-transparent px-3 py-2 text-sm`
* Focus state: `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`
* Always provide helper labels with high-contrast muted text (`text-muted-foreground`).

### D. Scroll Controls (`src/components/shared/ScrollControls.tsx`)
* A Jenkins-style fixed viewport controller sitting at the bottom right.
* Features clean square buttons with up/down controls appearing dynamically after `300px` of vertical scrolling.

### E. Ad Containers (`src/components/shared/AdContainer.tsx`)
* The site uses a strict **4-ad monetization architecture** keeping ad density below 30%.
* Use the exact slot components: `"top"`, `"middle"`, `"sidebar"`, and `"bottom"`. Do not create custom ad blocks.

---

## 6. Machine & AI Instruction Rules

If you are an AI assistant editing or creating a tool in this workspace:
* **Rule 1**: NEVER add any classes containing `rounded-`, `rounded-md`, `rounded-lg`, etc., unless it is `rounded-full` for a circular icon or badge.
* **Rule 2**: NEVER edit the base primitives in `src/components/ui/` directly. Compose using wrapper elements and Tailwind `className` overrides.
* **Rule 3**: Align all buttons, input boxes, selectors, and cards to utilize the custom color tokens (`primary`, `muted`, `accent`).
* **Rule 4**: Ensure all code, hash outputs, raw counts, and data visualizations are styled with the monospace font class (`font-mono`).
