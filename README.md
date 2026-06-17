<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/a0ab351c-519d-409a-83ea-f22afa4d2d81

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set up your environment variables in `.env` (see `.env.example` for details)
3. Run the app:
   `npm run dev`

## Deployment

Since this app uses an Express backend (in `server.ts`) to securely connect to the Brevo API, it must be deployed to a platform that supports running Node.js servers (e.g., Render, Railway, fly.io, etc.).

### Option 1: Deploying to Render.com (Recommended & Free Tier Friendly)

1. Sign up/Log in to [Render](https://render.com).
2. Click **New** -> **Web Service**.
3. Connect your GitHub repository.
4. Configure the service:
   - **Name**: `page-profit-accelerator` (or your preferred name)
   - **Language**: `Node`
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
5. Click **Advanced** and add the following **Environment Variables**:
   - `BREVO_API_KEY`: Your Brevo API key (e.g., `xkeysib-...`)
   - `BREVO_SENDER_EMAIL`: Your verified sender email (e.g., `Solomon@selltheclick.co`)
   - `BREVO_SENDER_NAME`: The name shown to recipients (e.g., `Solomon Olayemi`)
   - `BREVO_LIST_ID`: The list ID where leads should be saved (default is `2`)
   - `NODE_ENV`: `production`
   - `APP_URL`: Your live domain (e.g., `https://yourdomain.com`) - *Important: This ensures report PDF download links and Cal.com redirects work correctly.*
6. Click **Deploy Web Service**. Render will build and launch your full-stack app.

### Option 2: Deploying to Railway.app

1. Sign up/Log in to [Railway](https://railway.app).
2. Click **New Project** -> **Deploy from GitHub repo**.
3. Under **Variables**, add all the environment variables listed in the Render section.
4. Railway automatically detects the build command and start script from `package.json` and deploys it.
