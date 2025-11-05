# Cloudflare Setup Instructions for petnjica.me

This document provides step-by-step instructions for deploying the petnjica.me website to Cloudflare Pages.

## Prerequisites

Before you begin, ensure you have:
- A Cloudflare account (free or paid)
- Access to the domain `petnjica.me` DNS settings
- (Optional) Cloudflare API token for automated deployments

## Deployment Options

### Option 1: Automatic Deployment via GitHub (Recommended)

This option uses GitHub Actions for automated deployment whenever changes are pushed to the main branch.

#### Step 1: Connect GitHub Repository to Cloudflare Pages

1. Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to "Compute & AI" → "Workers & Pages"
3. Click on "Get Started" on "Import a Git Project"
4. First click "GitHub" to select, then select your GitHub repository: `dinorastoder/petnjicame`
5. Configure the build settings:
   - **Production branch**: `main`
   - **Build command**: (leave empty)
   - **Build output directory**: `public`
6. Click "Save and Deploy"

#### Step 2: Configure GitHub Secrets for Actions

1. Go to your GitHub repository settings
2. Navigate to "Secrets and variables" → "Actions"
3. Add the following secrets:
   - `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token
   - `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID

To get your API token:
- Go to Cloudflare Dashboard → My Profile → API Tokens
- Create a token with "Cloudflare Pages:Edit" permissions

To get your Account ID:
- Go to Cloudflare Dashboard → Workers & Pages
- Your Account ID is displayed in the right sidebar

### Option 2: Manual Deployment via Wrangler CLI

#### Step 1: Install Wrangler

```bash
npm install -g wrangler
```

#### Step 2: Login to Cloudflare

```bash
wrangler login
```

This will open a browser window for authentication.

#### Step 3: Deploy

```bash
cd petnjicame
npm run deploy
```

Or directly:

```bash
wrangler pages deploy public --project-name=petnjicame
```

### Option 3: Manual Upload via Dashboard

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to "Workers & Pages" → "Pages"
3. Click "Create a project" → "Upload assets"
4. Upload the contents of the `public` directory
5. Set the project name to `petnjicame`
6. Click "Save and Deploy"

## Domain Configuration

### Step 1: Add Custom Domain

1. In your Cloudflare Pages project dashboard
2. Go to "Custom domains" tab
3. Click "Set up a custom domain"
4. Add `petnjica.me` and `www.petnjica.me`
5. Cloudflare will automatically configure DNS and SSL

### Step 2: Configure DNS (if domain is not on Cloudflare)

If your domain's nameservers are not yet pointing to Cloudflare:

1. Go to Cloudflare Dashboard → Websites → Add a site
2. Enter `petnjica.me`
3. Choose a plan (Free is sufficient)
4. Cloudflare will scan your existing DNS records
5. Update your domain registrar's nameservers to Cloudflare's nameservers
6. Wait for DNS propagation (can take up to 24-48 hours)

## Verification

After deployment, verify your site:

1. **Test the site**: Visit `https://petnjica.me` (or your Cloudflare Pages URL)
2. **Check all pages**:
   - Homepage: `https://petnjica.me/`
   - About: `https://petnjica.me/about.html`
   - Contact: `https://petnjica.me/contact.html`
   - 404 page: Try any non-existent URL
3. **Verify redirects**: Visit `https://www.petnjica.me` - should redirect to `https://petnjica.me`
4. **Check security headers**: Use [securityheaders.com](https://securityheaders.com) to verify headers
5. **Test SEO**: Verify `robots.txt` and `sitemap.xml` are accessible

## Local Development

To test locally before deploying:

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Open browser at http://localhost:8080
```

Or use a simple HTTP server:

```bash
cd public
python3 -m http.server 8080
```

## Troubleshooting

### Build Fails
- Ensure the `public` directory exists and contains all necessary files
- Check that all file paths are correct and use lowercase

### Custom Domain Not Working
- Verify DNS records are correct
- Wait for DNS propagation (up to 48 hours)
- Check SSL/TLS encryption mode (should be "Full" or "Full (strict)")

### 404 Errors
- Ensure all HTML files are in the `public` directory
- Check file names match exactly (case-sensitive)
- Verify `_redirects` file is properly formatted

## Security Notes

The site includes the following security features:
- Security headers (X-Frame-Options, CSP, etc.)
- HTTPS enforcement via Cloudflare
- DDoS protection via Cloudflare
- Automatic SSL certificate provisioning

## Future Enhancements

Planned features:
- Interactive form for collecting community ideas
- Contact form with email notifications
- Community forum or discussion board
- Event calendar
- Photo gallery

## Support

For issues or questions:
- Check [Cloudflare Pages documentation](https://developers.cloudflare.com/pages/)
- Review GitHub repository issues
- Contact Cloudflare support

---

Last updated: November 5, 2025
