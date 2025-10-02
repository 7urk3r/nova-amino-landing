# Deployment Guide - Scientific Peptide Marquee

This guide provides step-by-step instructions for deploying the Scientific Peptide Marquee component to various hosting platforms.

## 📋 Pre-Deployment Checklist

Before deploying, ensure you have:

✅ **Node.js 18+** installed  
✅ **All dependencies** installed (`npm install`)  
✅ **Build passes** without errors (`npm run build`)  
✅ **Local preview** works (`npm run preview`)  

## 🚀 Quick Deploy Commands

### Test Build Locally
```bash
# Clean previous builds
npm run clean

# Create production build
npm run build

# Test the production build
npm run preview
```

Visit `http://localhost:4173` to verify everything works correctly.

## 🌐 Hosting Platform Deployment

### 1. Vercel (Recommended)

**Option A: Automatic Deployment**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy with one command
npm run deploy:vercel
```

**Option B: Manual Upload**
1. Run `npm run build`
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project" → "Import Git Repository"
4. Connect your repository
5. Vercel will auto-detect Vite settings

**Configuration:**
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

---

### 2. Netlify

**Option A: Drag & Drop**
1. Run `npm run build`
2. Go to [netlify.com](https://netlify.com)
3. Drag the `dist/` folder to the deploy area

**Option B: CLI Deployment**
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
npm run deploy:netlify
```

**Option C: Git Integration**
1. Push code to GitHub/GitLab/Bitbucket
2. Connect repository in Netlify dashboard
3. Configure build settings:
   - Build Command: `npm run build`
   - Publish Directory: `dist`

---

### 3. GitHub Pages

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Production build"
   git push origin main
   ```

3. **Deploy to gh-pages:**
   ```bash
   # Install gh-pages
   npm i -g gh-pages
   
   # Deploy dist folder
   gh-pages -d dist
   ```

4. **Enable GitHub Pages:**
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` / `root`

---

### 4. AWS S3 + CloudFront

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Create S3 Bucket:**
   - Enable static website hosting
   - Set index document: `index.html`
   - Set error document: `index.html` (for SPA routing)

3. **Upload files:**
   ```bash
   aws s3 sync dist/ s3://your-bucket-name --delete
   ```

4. **Set up CloudFront** (optional but recommended):
   - Create distribution pointing to S3 bucket
   - Set default root object: `index.html`
   - Configure custom error pages for SPA routing

---

### 5. Docker Deployment

**Create Dockerfile:**
```dockerfile
# Build stage
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Create nginx.conf:**
```nginx
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        location / {
            try_files $uri $uri/ /index.html;
        }

        # Gzip compression
        gzip on;
        gzip_types text/css application/javascript image/svg+xml;
    }
}
```

**Build and run:**
```bash
docker build -t peptide-marquee .
docker run -p 8080:80 peptide-marquee
```

## 🔧 Environment Configuration

### Environment Variables
The project uses minimal environment variables. If you need to add API keys or configuration:

1. **Create `.env.production`:**
   ```
   VITE_API_URL=https://your-api.com
   VITE_ANALYTICS_ID=your-analytics-id
   ```

2. **Access in code:**
   ```typescript
   const apiUrl = import.meta.env.VITE_API_URL;
   ```

### Build Optimizations
The production build includes:
- ✅ Code minification
- ✅ Tree shaking
- ✅ Asset optimization
- ✅ CSS purging
- ✅ Gzip compression ready

## 📊 Performance Verification

After deployment, verify performance:

1. **Lighthouse Audit:**
   - Performance: Should be 90+
   - Accessibility: Should be 90+
   - Best Practices: Should be 90+
   - SEO: Should be 80+

2. **Load Testing:**
   ```bash
   # Test with curl
   curl -w "@curl-format.txt" -o /dev/null -s "https://your-domain.com"
   ```

3. **Visual Check:**
   - Marquee animations work smoothly
   - Drag functionality works on desktop/mobile
   - Cards display properly
   - Gradient backgrounds load correctly
   - All logos and images display

## 🛠️ Troubleshooting

### Common Issues

**Build Fails:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Assets Not Loading:**
- Check `vite.config.ts` base URL setting
- Ensure all files are in `public/` directory
- Verify relative paths in components

**Routing Issues (404 on refresh):**
- Configure server for SPA routing
- Set fallback to `index.html`

**Performance Issues:**
- Enable gzip compression
- Check image optimization
- Verify CSS is being purged

## 🔒 Security Considerations

- ✅ No sensitive data in client-side code
- ✅ HTTPS enabled on production
- ✅ Content Security Policy configured
- ✅ No inline scripts or styles
- ✅ Dependencies regularly updated

## 📈 Monitoring

Consider adding:
- **Analytics**: Google Analytics, Plausible
- **Error Tracking**: Sentry, LogRocket
- **Performance**: Web Vitals monitoring
- **Uptime**: Pingdom, UptimeRobot

---

## 🎯 Quick Deploy Summary

**For immediate deployment:**

```bash
# 1. Build the project
npm run build

# 2. Test locally
npm run preview

# 3. Deploy to Vercel (easiest)
npx vercel --prod

# Or deploy to Netlify
npx netlify deploy --prod --dir=dist
```

Your Scientific Peptide Marquee will be live and ready to showcase therapeutic peptide research! 🧬🚀
