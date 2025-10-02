# Scientific Peptide Marquee Component

A modern, interactive React marquee component showcasing scientific quotes about therapeutic peptides. Features drag-and-drop functionality, persistent positioning, and smooth animations.

![Peptide Marquee Demo](./demo-preview.png)

## ✨ Features

- **Interactive Drag & Drop** - Click and drag cards to position them exactly where needed
- **Persistent Positioning** - Cards stay where you place them (no snap-back)
- **Smart Animation Resume** - Animation continues from your chosen position
- **Hover to Pause** - Pause animation when hovering to read quotes
- **Responsive Design** - Works on desktop and mobile devices
- **Scientific Data** - 12 curated quotes from verified medical researchers
- **Professional Styling** - Clean, modern UI with gradient backgrounds

## 🧬 Peptide Compounds Featured

The marquee displays verified scientific quotes about these therapeutic peptides:
- Semaglutide (weight loss, diabetes)
- Tirzepatide (obesity, insulin sensitivity)
- Oxytocin (pain relief, social cognition)
- Cagrilintide (weight management)
- GHK-Cu (anti-inflammatory, tissue repair)
- Tesamorelin (growth hormone, fat reduction)
- Ipamorelin (growth hormone release)
- Survodutide (weight loss, glycemic control)
- Thymosin Beta-4 (cardiac protection, wound healing)
- LL-37 (antimicrobial activity)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone or extract the project:**
   ```bash
   cd peptide-marquee-component
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173`

## 📦 Build for Production

Create an optimized production build:

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

### Preview Production Build
```bash
npm run preview
```

## 🛠️ Project Structure

```
peptide-marquee-component/
├── public/
│   ├── logos/                    # University and organization logos
│   └── aurora-gradient-*.png     # Background gradient images
├── src/
│   ├── components/
│   │   └── Marquee.tsx          # Main interactive marquee component
│   ├── data/
│   │   ├── peptide-compounds.json    # Complete peptide database
│   │   └── peptide-quotes.final.json # Verified scientific quotes
│   ├── lib/
│   │   └── utils.ts             # Utility functions
│   ├── App.tsx                  # Main application component
│   ├── App.css                  # Global styles
│   └── main.tsx                 # Application entry point
├── package.json
├── tailwind.config.js           # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── vite.config.ts              # Vite build configuration
```

## 🎨 Customization

### Adding New Quotes
Edit `src/App.tsx` and modify the `scientificQuotes` array:

```typescript
const scientificQuotes = [
  {
    compound: "Your Compound",
    quote: "Your verified scientific quote here...",
    scientist: "Dr. Researcher Name",
    organization: "University/Institution",
    logo: "/logos/institution.svg",
    source: "https://pubmed.ncbi.nlm.nih.gov/your-source"
  },
  // ... more quotes
];
```

### Styling Changes
- **Animation Speed**: Modify `[--duration:60s]` in `App.tsx`
- **Card Dimensions**: Change `w-[450px]` class in `ScientificQuoteCard`
- **Colors**: Update Tailwind classes throughout components
- **Background**: Replace gradient images in `/public/` directory

### Data Sources
- **Complete Peptide Database**: `src/data/peptide-compounds.json` (46 compounds)
- **Verified Quotes**: `src/data/peptide-quotes.final.json` (100+ verified quotes)

## 🔧 Technical Details

### Built With
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Vite** - Fast build tool and dev server

### Key Components
- **Marquee.tsx** - Core interactive component with drag functionality
- **ScientificQuoteCard** - Individual quote card component
- **Custom Animation System** - RequestAnimationFrame-based smooth scrolling

### Browser Compatibility
- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint (if configured)

## 🚀 Deployment Options

### Static Hosting (Recommended)
- **Vercel**: `vercel --prod`
- **Netlify**: Drag & drop the `dist/` folder
- **GitHub Pages**: Upload `dist/` contents
- **AWS S3**: Upload to S3 bucket with static website hosting

### Docker Deployment
```dockerfile
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 📄 License & Legal

### Quote Attribution
All scientific quotes are properly attributed with:
- Researcher name and credentials
- Institution/organization affiliation  
- Direct source links to peer-reviewed publications
- PubMed/PMC reference numbers where applicable

### Data Sources
- PubMed Central (PMC) articles
- Peer-reviewed medical journals
- University research publications
- Clinical trial results

**Important**: All quotes have been verified for accuracy and proper attribution. Sources are linked for transparency and legal compliance.

## 🤝 Support & Handoff

This package includes everything needed for development, customization, and deployment:

✅ Complete source code with TypeScript  
✅ All dependencies defined in package.json  
✅ Production build configuration  
✅ Comprehensive documentation  
✅ Verified scientific data sources  
✅ Professional UI assets and logos  

### For Developers
- Well-commented, modular code structure
- TypeScript for type safety and better IDE support
- Tailwind CSS for easy styling modifications
- Modern React patterns and hooks

### For Deployment
- Optimized production builds
- Static file output (no server required)
- Compatible with all major hosting platforms
- Fast loading and responsive design

---

**Ready to deploy!** 🚀 This package contains everything needed to run, modify, and deploy the Scientific Peptide Marquee Component.