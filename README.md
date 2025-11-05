# petnjicame

Community-driven informational website for Petnjica, Montenegro — independent platform for sharing local informations, ideas, and resources.

## Overview

This website is built to serve static HTML pages for the domain **petnjica.me** using Cloudflare Pages. The platform is designed to be simple, fast, and easily extensible for future features like forms for collecting community ideas and suggestions.

## Project Structure

```
petnjicame/
├── public/              # Static files served by Cloudflare Pages
│   ├── index.html      # Home page
│   ├── about.html      # About page
│   ├── contact.html    # Contact page
│   ├── styles.css      # CSS styling
│   ├── _headers        # Cloudflare Pages headers configuration
│   └── _redirects      # Cloudflare Pages redirects configuration
├── wrangler.toml       # Cloudflare Workers/Pages configuration
└── package.json        # Node.js dependencies and scripts
```

## Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Cloudflare account

### Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run local development server:
   ```bash
   npm run dev
   ```

3. Open your browser at `http://localhost:8080`

### Deployment to Cloudflare Pages

#### Option 1: Using Wrangler CLI

1. Install Wrangler globally (if not already installed):
   ```bash
   npm install -g wrangler
   ```

2. Login to Cloudflare:
   ```bash
   wrangler login
   ```

3. Deploy the site:
   ```bash
   npm run deploy
   ```

#### Option 2: Using Cloudflare Dashboard

1. Go to [Cloudflare Pages](https://pages.cloudflare.com/)
2. Connect your GitHub repository
3. Configure build settings:
   - Build command: (leave empty for static site)
   - Build output directory: `public`
4. Deploy

### Domain Configuration

To use the custom domain `petnjica.me`:

1. In Cloudflare Pages dashboard, go to your project
2. Navigate to "Custom domains"
3. Add `petnjica.me` and `www.petnjica.me`
4. Update your domain's nameservers to Cloudflare's nameservers (if not already done)
5. Cloudflare will automatically provision SSL certificates

## Features

- ✅ Static HTML pages with responsive design
- ✅ Cloudflare Pages hosting
- ✅ Security headers configured
- ✅ WWW to non-WWW redirects
- ✅ Modern CSS with mobile-responsive design
- 🔜 Form for collecting community ideas and suggestions (planned)

## Security

The site includes security headers configured in `public/_headers`:
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- Referrer-Policy
- Permissions-Policy
- Content-Security-Policy

## License

MIT
