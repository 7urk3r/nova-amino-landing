# Nova Amino Development Guide

## Quick Start (Choose one method)

### Method 1: Simple npm command
```bash
npm run dev
```

### Method 2: Startup script (recommended)
```bash
./start-dev.sh
```

### Method 3: Manual cleanup + start
```bash
npm run clean && npm run dev
```

## Troubleshooting

If the site won't start:
1. Run `npm run clean` to kill existing processes
2. Wait 2 seconds
3. Run `npm run dev`

## Default URLs
- **Primary**: http://localhost:3000
- **Fallback**: http://localhost:3001 (if 3000 is busy)

## Testing
```bash
npm test                    # Run all Playwright tests
npm run test -- --headed   # Run tests with browser visible
```

## Build
```bash
npm run build    # Production build
npm run preview  # Preview production build
```

## Notes for Claude
- Site serves at localhost:3000 by default
- All file paths fixed (no more /public/ prefix issues)
- Vite auto-finds next available port if 3000 is busy
- Use `npm run clean` if port conflicts occur