Sanity Studio Setup

This repo includes a Sanity Studio in the `sanity/` folder configured for the Nova Amino landing page. It defines schemas for hero content, feature cards, quotes, and site settings. You can run the Studio locally and deploy it to Sanity Manage at any time.

Prereqs
- Node 18+
- You’re already logged in via `npx sanity login` (as you mentioned)
- Project ID: `ojsvc60h` (override via env)
- Organization ID: `oKoxXFjj5` (optional)

Quick start (avoids ports you don’t want)
1. cd sanity
2. npm i
3. npx sanity dev --host 127.0.0.1 --port 3334

Deploy Studio
- npx sanity deploy

Environment (optional)
- Create a `.env` file in `sanity/` (copy `.env.example`).
  - SANITY_STUDIO_PROJECT_ID=ojsvc60h
  - SANITY_STUDIO_DATASET=production
  - SANITY_STUDIO_ORG_ID=oKoxXFjj5

Notes
- Schemas match the current site structure; feel free to add fields.
- The frontend can fetch content with the included `src/js/cms/httpSanity.js` using the public Content Lake API. No package install required.

