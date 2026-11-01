# Fundora Brand Guidelines v1.0

> Last updated: 2026-11-01  
> Status: Active  
> Brand: Fundora (Onchain Microgrants & Hackathons on Arc)

---

## 1. Brand Identity Overview

Fundora combines institutional financial credibility with high-speed, modern Web3 execution on the Arc network. The brand visual language balances precision, trust, and clean geometric structures.

### Visual Mark & Wordmark
- **Logo Mark (`/brand/fundora-logo-mark.png`)**: A dynamic dual-arch geometric motif representing the Arc blockchain and capital flow/bridge.
  - Left Arch: Fundora Blue (`#1A3F75`)
  - Right Arch: Deep Midnight (`#101624`)
- **Wordmark (`/brand/fundora-logo-text.png`)**: Custom bold sans-serif typography set in Deep Midnight (`#101624`).
- **Logo Lockup**: The logo mark precedes the wordmark with 8-10px (`gap-2` to `gap-2.5`) clear space, followed by the subtle "Arc" network pill badge.

---

## 2. Color Palette

### Primary Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Fundora Blue | `#1A3F75` | `rgb(26, 63, 117)` | Primary CTAs, Explore button, interactive buttons, left logo arch |
| Deep Midnight | `#101624` | `rgb(16, 22, 36)` | Primary typography, outer logo arch, dark surfaces |
| Brand Hover Blue | `#122D54` | `rgb(18, 45, 84)` | Hover state for primary buttons |
| Brand Light Blue | `#EBF2F7` | `rgb(235, 242, 247)` | Active pill backgrounds, tinted badges |

### Network & Semantic Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Arc Teal | `#0F766E` | `rgb(15, 118, 110)` | Verified escrow, network status indicator, positive balances |
| Arc Teal Light | `#F0FDFA` | `rgb(240, 253, 250)` | Approved badges, success panel backgrounds |
| Amber Warning | `#B45309` | `rgb(180, 83, 9)` | In-review, pending judging, deadlines |
| Coral Danger | `#BE123C` | `rgb(190, 18, 60)` | Cancelled events, rejected submissions, refund states |

### Backgrounds & Surfaces

| Name | Hex | Usage |
|------|-----|-------|
| Warm Canvas | `#F7F8F6` | Primary page background |
| Surface White | `#FFFFFF` | Card containers, interactive inputs |
| Border Default | `#E2E8F0` | Dividers and card borders |

---

## 3. Typography

- **Headings & Brand Title**: Plus Jakarta Sans (`font-jakarta`), weights 600, 700, 800.
- **Body & Controls**: Inter (`font-sans`), weights 400, 500, 600.
- **Financial & Code Values**: JetBrains Mono (`font-mono`), weights 400, 500.

---

## 4. Logo Usage Rules

### Standard Navbar Lockup
```html
<div className="flex items-center gap-2.5">
  <img src="/brand/fundora-logo-mark.png" alt="" className="h-8 w-auto object-contain shrink-0" />
  <div className="flex items-center gap-2">
    <img src="/brand/fundora-logo-text.png" alt="Fundora" className="h-5 sm:h-5.5 w-auto object-contain shrink-0" />
    <span className="badge-arc">Arc</span>
  </div>
</div>
```

### Clear Space & Minimum Sizing
- **Minimum Logo Mark Height**: 20px (e.g. documentation footer), standard 32px (`h-8`).
- **Minimum Wordmark Height**: 18px (`h-4.5`), standard 22px (`h-5.5`).
- **Clear Space**: Maintain at least the width of the inner arch as clear padding around the lockup.
- **Background Contrast**: Always use transparent PNG assets (`/brand/fundora-logo-mark.png` and `/brand/fundora-logo-text.png`) to avoid white box artifacts against tinted backgrounds.
