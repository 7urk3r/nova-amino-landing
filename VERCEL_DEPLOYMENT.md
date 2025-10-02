# Vercel Deployment Guide - Nova Amino Landing Page

## Repository Information
- **GitHub Repository**: https://github.com/7urk3r/nova-amino-landing
- **Project**: Nova Amino Landing Page with Sanity CMS integration
- **Framework**: Astro with React components

## Quick Deploy to Vercel

### 1. Connect Repository to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import the GitHub repository: `7urk3r/nova-amino-landing`
4. Select the repository and click "Import"

### 2. Configure Build Settings
Vercel should auto-detect Astro, but verify these settings:
- **Framework Preset**: `Astro`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3. Environment Variables
Add these environment variables in Vercel project settings:

```
SANITY_PROJECT_ID=ojsvc60h
SANITY_DATASET=production
SANITY_READ_TOKEN=sk9KIctAnRnAZgljNDqx1MqCTARCSKINtx8oGSOq1J19hYDM3PGf8qMlQZbwf0gsk42MpU4fkVwbMVB9pF2Fz3AHMBkiIkKUd7YngFirkIbFszn9UUUW3b5Fp0OXp6tlc32NH9m7MUHLq2xb8Mti5486rlcdn5mhtVMUeV2NPCtye8b0NsQ3
SANITY_WRITE_TOKEN=sk9KIctAnRnAZgljNDqx1MqCTARCSKINtx8oGSOq1J19hYDM3PGf8qMlQZbwf0gsk42MpU4fkVwbMVB9pF2Fz3AHMBkiIkKUd7YngFirkIbFszn9UUUW3b5Fp0OXp6tlc32NH9m7MUHLq2xb8Mti5486rlcdn5mhtVMUeV2NPCtye8b0NsQ3
```

### 4. Deploy
Click "Deploy" and wait for the build to complete.

## Sanity Studio Access

The Sanity Studio will be available at:
- **Production**: `https://your-vercel-domain.vercel.app/studio`
- **Local Development**: `http://localhost:3012/studio` or `http://localhost:3333`

## Post-Deployment Configuration

### Domain Setup (Optional)
1. In Vercel project settings, go to "Domains"
2. Add your custom domain
3. Update DNS records as instructed

### Sanity CORS Settings
1. Go to [Sanity Management Console](https://www.sanity.io/manage)
2. Select your project (`ojsvc60h`)
3. Navigate to "API" → "CORS Origins"
4. Add your Vercel domain:
   - `https://your-vercel-domain.vercel.app`
   - `https://your-custom-domain.com` (if using custom domain)

## Build Commands Reference

### Local Development
```bash
npm run dev          # Start Astro dev server (port 3012)
npx sanity start     # Start Sanity Studio (port 3333)
```

### Production Build
```bash
npm run build        # Build Astro site for production
npm run preview      # Preview production build locally
```

### Sanity Schema Deployment
```bash
npx sanity schema deploy  # Deploy schema changes to Sanity
```

## Troubleshooting

### Build Failures
- Ensure all environment variables are set correctly
- Check that Sanity tokens have proper permissions
- Verify schema is deployed to Sanity

### Studio Access Issues
- Confirm CORS settings include your deployment domain
- Check Sanity project ID and dataset name
- Verify write token permissions for studio functionality

### Missing Content
- Ensure content exists in the production dataset
- Check that queries match the deployed schema structure
- Verify reference documents exist

## Files Deployed to GitHub
The following essential files were committed for deployment:

### Core Application
- `src/` - Astro pages, components, and utilities
- `public/` - Static assets
- `astro.config.mjs` - Astro configuration
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration

### Sanity Integration
- `sanity/` - Schema definitions and configuration
- `sanity.config.ts` - Sanity studio configuration

### Environment
- `.env.example` - Environment variable template
- `.gitignore` - Git ignore rules

**Note**: Actual `.env` file with tokens is excluded for security and should be configured directly in Vercel.