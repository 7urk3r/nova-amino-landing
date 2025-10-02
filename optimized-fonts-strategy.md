# Font Optimization Strategy

## Current Problem:
- Adobe Fonts loading 20+ requests extending load time to 16+ seconds
- Loading ALL font weights unnecessarily
- External domain dependency causing slowdown

## Optimized Solution:

### Option A: Self-Host Critical Fonts (FASTEST)
1. Download ONLY needed weights:
   - IBM Plex Mono 400 normal (.woff2)
   - TT Commons Pro 400 normal (.woff2)
   - TT Commons Pro 700 normal (.woff2)

2. Add to public/fonts/ directory

3. Replace Adobe Fonts with:
```css
@font-face {
  font-family: 'IBM Plex Mono';
  src: url('/fonts/IBMPlexMono-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'TT Commons Pro';
  src: url('/fonts/TTCommonsPro-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'TT Commons Pro';
  src: url('/fonts/TTCommonsPro-Bold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
```

### Expected Results:
- 20+ requests → 3 requests (85% reduction)
- 16s load time → 2-4s load time (75% improvement)
- No external domain dependency
- Faster font loading with font-display: swap

### Option B: Optimized Adobe Fonts Project
Create new project with ONLY:
- ibm-plex-mono: 400
- tt-commons-pro: 400, 700

This is harder to manage and still has external dependency.

## Recommendation:
Go with Option A (self-hosting) for maximum performance.