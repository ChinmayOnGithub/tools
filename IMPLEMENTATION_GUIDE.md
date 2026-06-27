# UI/UX Implementation Guide

## Overview
Modern, clean UI with square corners inspired by Porkbun. Focus on UX over decoration. Orange primary color for warmth and energy.

## Key Design Principles

1. **UX First** - Every element serves a clear purpose
2. **Square Corners** - Professional, data-focused aesthetic  
3. **Consistent Spacing** - Predictable rhythm throughout
4. **Orange Primary** - Warm, energetic brand color (HSL: 25, 95%, 53-58%)
5. **4 Ad Strategy** - Optimal monetization without annoying users

## Ad Placement Strategy

Based on industry research (Coalition for Better Ads, Google AdSense guidelines):

### Optimal Ad Count: 4 Ads Per Page
- **30% Rule**: Ads should occupy maximum 30% of page area
- **User Experience**: 3-4 ads balances revenue and UX
- **Strategic Placement**: Quality over quantity

### Ad Slots
1. **Top Leaderboard** (728x90) - After hero, before content
2. **Middle Rectangle** (300x250) - Between main sections
3. **Sidebar Half-Page** (300x600) - Sticky in sidebar
4. **Bottom Leaderboard** (728x90) - After all content

### Usage
```tsx
<AdContainer slot="top" />
<AdContainer slot="middle" />
<AdContainer slot="sidebar" />
<AdContainer slot="bottom" />
```

## Component Architecture

### Core Components (Keep)
- **StatsCard** - Dashboard metrics
- **ToolCard** - Tool display
- **ScrollControls** - Up/down navigation (Jenkins-style)
- **AdContainer** - Ad placements

### Removed Components (Simplified)
- ❌ StatusBadge - Use inline spans
- ❌ FeatureBanner - Use simple cards
- ❌ QuickActionsPanel - Unnecessary complexity
- ❌ SectionHeader - Use semantic HTML

## shadcn/ui Best Practices

### Never Edit src/components/ui/*
These are base primitives. Customize through:
- `className` props
- Tailwind config
- Composition, not modification

### Proper Usage
```tsx
// ✅ Good - Compose with shadcn primitives
<Card className="border-2 card-depth-1">
  <CardContent>{children}</CardContent>
</Card>

// ❌ Bad - Editing Card.tsx directly
// Don't modify files in components/ui/
```

## Color System

### Primary Orange
```css
/* Light mode */
--primary: 25 95% 53%; /* Vibrant orange */

/* Dark mode */
--primary: 25 95% 58%; /* Slightly brighter */
```

### Usage
- Brand elements (logo, CTA buttons)
- Accent highlights
- Interactive states
- Status indicators

## UX Features

### 1. Scroll Controls (Jenkins-style)
- Fixed position bottom-right
- Appears after 300px scroll
- Square buttons with icons
- Smooth scroll behavior

```tsx
<ScrollControls />
```

### 2. Sticky Sidebar
- Categories stay visible
- Better navigation
- Desktop only (mobile full-width)

### 3. Clear Hierarchy
- Bold section headings
- 2px borders for separation
- Consistent spacing (gap-10, gap-8, gap-5)

### 4. Stats Dashboard
- Key metrics upfront
- Quick understanding
- Responsive grid

## Folder Structure

```
src/
├── app/
│   ├── page.tsx              # Homepage
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Design system
├── components/
│   ├── shared/               # Custom components
│   │   ├── AdContainer.tsx
│   │   ├── ScrollControls.tsx
│   │   ├── StatsCard.tsx
│   │   └── ToolCard.tsx
│   └── ui/                   # shadcn primitives (DON'T EDIT)
│       ├── Button.tsx
│       ├── Card.tsx
│       └── ...
└── config/
    ├── tools-registry.ts
    └── categories.ts
```

## Maintenance Guidelines

### Adding New Tools
1. Register in `tools-registry.ts`
2. Create folder in `components/tools/[slug]/`
3. Add translations in `locales/en.json`
4. Export from `index.tsx`

### Adding New Components
1. Check if shadcn has primitive
2. Compose with existing components
3. Keep in `components/shared/`
4. Follow naming: PascalCase.tsx

### Styling Rules
- Mobile-first Tailwind
- Use `cn()` for conditional classes
- Square corners (border-radius minimal)
- 2px borders for prominence
- `card-depth-*` for shadows

## Performance

- CSS-only animations
- No heavy dependencies
- Lazy load ads
- Fixed ad sizing (prevents CLS)
- Optimized images

## Accessibility

- Semantic HTML
- ARIA labels on buttons
- Focus states (2px ring)
- Keyboard navigation
- Screen reader friendly

## Testing Checklist

- [ ] Light/dark mode
- [ ] Mobile (320px+)
- [ ] Tablet (768px+)
- [ ] Desktop (1920px)
- [ ] Keyboard navigation
- [ ] Ad placements (4 total)
- [ ] Scroll controls appear
- [ ] Sticky sidebar works

## Common Issues

**Orange not showing**
→ Check CSS variables in globals.css

**Ads overlapping**
→ Verify fixed heights in AdContainer

**Scroll buttons always visible**
→ Check scroll threshold (300px)

**Rounded corners appearing**
→ Remove any `rounded-*` classes

## Quick Start

```bash
# Development
npm run dev

# Build
npm run build

# Lint
npm run lint
```

## Resources

- [shadcn/ui Docs](https://ui.shadcn.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Next.js](https://nextjs.org/docs)
- [Coalition for Better Ads](https://www.coalitionforbetterads.org/)

---

**Remember**: UX > UI. Function > Form. Simplicity > Complexity.
