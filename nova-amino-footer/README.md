# Nova Amino Footer Component

A beautiful, interactive footer component with animated logo and expandable content sections.

## Features

### ✨ Animated Logo
- **5 animated orbs** with different colors, sizes, and movement patterns
- **Purple cursor-following orb** that tracks mouse movement over the logo
- **Aurora gradient background** with steel blue base color
- **Smooth animations** using CSS keyframes and JavaScript
- **Responsive design** that works on all screen sizes

### 🔗 Interactive Footer Links
- **4 column layout**: SHOP, LEARN, SUPPORT, COMPANY
- **Expandable sections** with smooth animations
- **Rotating chevron icons** that indicate expand/collapse state
- **Auto-close behavior** - opening one section closes others
- **Hover effects** on all links and buttons

### 📱 Responsive Design
- Mobile-first approach with responsive grid
- Optimized for desktop, tablet, and mobile devices
- Tailwind CSS for consistent styling

## Quick Start

1. **Download the files:**
   - `nova-amino-footer.html` - Complete standalone footer component
   - `NovaAminoLogo.svg` - Logo file (place in `Assets/` folder)

2. **Setup file structure:**
   ```
   your-project/
   ├── nova-amino-footer.html
   └── Assets/
       └── NovaAminoLogo.svg
   ```

3. **Open in browser:**
   - The footer is a complete HTML file with embedded CSS and JavaScript
   - No additional dependencies needed (uses Tailwind CSS via CDN)

## Integration into Existing Projects

### HTML Integration
Copy the footer section from `nova-amino-footer.html`:

```html
<!-- Nova Amino Footer Component -->
<footer class="py-12">
  <!-- ... footer content ... -->
</footer>
```

### Required Dependencies
- **Tailwind CSS** (via CDN or local installation)
- **NovaAminoLogo.svg** file in `Assets/` folder

### CSS Styles
Copy the `<style>` block content for:
- Logo animations
- Orb styling and keyframes
- Aurora gradient effects

### JavaScript Functions
Copy the `<script>` block content for:
- Cursor-following orb behavior
- Expandable sections functionality

## Customization

### Colors
Update orb colors by modifying the `background` properties:
```css
.orb { background: radial-gradient(...); }
.orb.o2 { background: radial-gradient(...); }
```

### Animation Speed
Adjust animation durations:
```css
.o1 { animation: driftA 4s ease-in-out infinite alternate; }
.o2 { animation: driftB 5s ease-in-out infinite alternate; }
```

### Links
Update footer links in the HTML:
```html
<li><a href="/your-link" class="hover:text-white">Your Link</a></li>
```

### Content
Modify expandable content in the "Expanded Content Sections":
```html
<div id="expanded-storage" class="hidden">
  <!-- Your custom content -->
</div>
```

## File Structure

```
cursor-Footer/
├── nova-amino-footer.html      # 📄 Clean, packaged footer component
├── index.html                  # 🔧 Original development file
├── README.md                   # 📋 This documentation
└── Assets/
    └── NovaAminoLogo.svg      # 🎨 Logo file for masking
```

## Technical Details

### Logo Animation
- Uses CSS `mask-image` to confine animations within logo shape
- 5 orbs with staggered timing and different movement patterns
- Cursor-following orb with smooth transitions and circular offset

### Expandable Sections
- JavaScript-powered expand/collapse functionality
- CSS transitions for smooth animations
- State management to ensure only one section open at a time

### Performance
- Hardware-accelerated CSS animations
- Efficient JavaScript using `requestAnimationFrame`
- Optimized for smooth 60fps animations

## Browser Support
- Chrome, Firefox, Safari, Edge (modern versions)
- Mobile browsers (iOS Safari, Chrome Mobile)
- CSS mask support required for logo animation

## License
Ready for use in Nova Amino projects and related applications.

---

**Ready to use!** 🚀 The footer component is fully self-contained and ready for integration into any project.