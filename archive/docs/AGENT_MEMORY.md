# Agent Memory (User Preferences)

This file captures persistent UI preferences to keep implementation aligned with the user's requirements.

- Header layout: logo far left, nav pill centered, Sign in (text) and Sign up (black pill) far right.
- Sticky behavior: only the centered nav pill is sticky; header itself is not sticky.
- Visual style:
  - Nav pill: light glassmorphic background, rounded, subtle shadow.
  - Nav text: black (#0b0d12), TT Commons Pro font for nav links and actions.
  - No blue focus rings in header/pill (suppress UA focus outline on pointer input; keep keyboard nav working).
- Dropdowns: Products and Announcements use Headless UI with dark-on-light frosted panel; items are black text.
- Alignment: when page loads, logo, pill, and actions are vertically aligned along the same baseline.

Implementation notes
- Pill renders inside `header nav.site-nav` and uses `position: sticky; top: 0` to remain visible when scrolling.
- Playwright tests should verify:
  - Presence of sticky pill inside header.
  - Horizontal centering of the pill within the header container.
  - Menu opens and renders items.

## Hero Card Background Images Issue

**Problem**: Background images defined in CSS files do not consistently display on the hero card.

**Solution**: Use inline HTML styles for hero card background images instead of CSS.

**Technical Details**:
- CSS background-image properties in `.hero-card` class sometimes fail to load
- Inline styles with `background-image: url('/image.webp')` work reliably
- This affects both PNG and WebP formats
- Responsive images should still be handled via CSS media queries, but primary background must be inline

**Current Implementation**:
```html
<div class="hero-card" style="background-image: url('/hero-bg-desktop.webp'); background-size: cover; background-position: center; background-repeat: no-repeat;">
```

**Avoid**: Relying solely on CSS background-image for hero card backgrounds.

