# Agent Memory - NovaAmino Landing Page Project

## Latest Session Summary (2025-01-22)

### ✅ COMPLETED TASKS

#### Marquee Component Fixes
- **Fixed font issues**: Changed peptide titles from hardcoded `"TT Commons Pro"` to `var(--font-heading)` in `/src/components/PeptideMarqueeInline.tsx`
- **Fixed infinite cycling**: Enhanced CSS animation with proper keyframes (`0%` to `100%`) and added `will-change: transform` for better performance
- **Updated marquee text**: Changed subtext to "Across the world, scientists and institutions are uncovering the potential of peptides. Their findings reveal both the science and the promise these compounds hold."

#### Performance Optimization
- **Fixed slow loading**: Corrected all `/public/` path issues causing 404s and repeated requests
  - Font: `public/fonts/TTCommonsPro-Regular.woff2` → `/fonts/TTCommonsPro-Regular.woff2`
  - Logo: `public/assets/NovaAminoLogo.svg` → `/assets/NovaAminoLogo.svg`
  - Hero image: `public/hero-view.png` → `/hero-view.png`
  - All card assets: `public/assets/` → `/assets/`
  - CSS: `public/assets/embla.css` → `/assets/embla.css`

#### Development Experience Improvements
- **Created startup script**: `start-dev.sh` with port cleanup and consistent startup
- **Updated package.json scripts**:
  - `npm run dev`: Vite with port 3000 and host 0.0.0.0
  - `npm run start`: Uses startup script
  - `npm run clean`: Kills processes on ports 3000, 3001, 5173
- **Created CLAUDE.md**: Documentation for consistent startup procedures

### 🔧 CURRENT PROJECT STATE

#### Server Configuration
- **Primary URL**: http://localhost:3000 (preferred)
- **Fallback URL**: http://localhost:3001 (auto-selected if 3000 busy)
- **Startup Command**: `npm run dev` or `./start-dev.sh`
- **Cleanup Command**: `npm run clean` (if port issues)

#### Key Files Modified
- `src/components/PeptideMarqueeInline.tsx` - Font fixes, animation improvements, text update
- `index.html` - All asset path corrections
- `package.json` - Enhanced npm scripts
- `start-dev.sh` - New startup script
- `CLAUDE.md` - Development documentation

#### Testing
- Playwright tests created: `verify-website.spec.js` and `tests/marquee-verification.spec.js`
- Test command: `npm test`
- Note: Some Node.js file system errors occurred during test execution

### 🎯 STARTUP PROCEDURE FOR FUTURE SESSIONS

1. **Quick Start**: `npm run dev`
2. **If issues**: `npm run clean && npm run dev`
3. **Site URL**: Check terminal output for exact port (usually 3000 or 3001)

### 🚨 KNOWN ISSUES
- Playwright tests may encounter Node.js file system errors in some environments
- Vite shows deprecation warning for CJS build (non-critical)

### 📝 PROJECT NOTES
- Font hierarchy: Uses CSS variables `var(--font-heading)` and `var(--font-body)`
- Marquee animation: Infinite cycling with `transform: translate3d(-50%, 0, 0)`
- All assets correctly served from Vite's root path without `/public/` prefix
- Development server configured for reliable local access

### 🤦 LESSONS LEARNED - What Went Wrong Initially

#### Root Cause Issues
1. **Port Confusion**: Started servers on random ports (5173, 3001) instead of checking original working setup (localhost:3000)
2. **Path Problems**: Site had `/public/` prefixed paths causing 404s and slow loading, but focused on server issues instead of diagnosing the real problem
3. **Multiple Conflicting Processes**: Kept starting new Vite processes without killing old ones, leading to port conflicts

#### What Should Have Been Done
1. **Ask about original setup**: "What port was this running on before?"
2. **Check existing processes**: `lsof -i :3000` to see what was already running
3. **Clean up first**: Kill existing processes before starting new ones
4. **Diagnose slow loading**: Look at server logs to see 404 errors immediately

#### The Real Problem
- Site was structurally fine - just had **asset path issues** (`/public/` prefix) causing performance problems
- Instead of fixing those first, went down rabbit hole of wrong ports, multiple processes, and complex tests
- **Asset path fixes were the main solution** - everything else was overcomplicating

#### Next Time Approach
1. Check what's already running first
2. Try simplest approach (`npm run dev`)
3. Read server logs for errors before assuming bigger problems
4. Clean up existing processes before starting new ones
5. **Trust the error messages** - Vite was clearly showing the `/public/` path issues