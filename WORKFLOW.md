# Development and Deployment Workflows

This document outlines the recommended workflows for development and deployment of the Rumble Video Site.

## Local Development

### Command
```bash
npm run dev
```

### What Happens
- Runs `next dev`, providing a fast, dynamic Next.js environment
- No static generation or Cloudflare dependencies
- Hot module reloading enabled
- Fast refresh for React components

### Best For
- Writing and testing code
- UI development and iteration
- Component testing
- Local debugging

### Important Notes
- If your app relies on KV data, you'll need to mock it locally
- Create a `mock-data` directory with static JSON files for development
- Use environment variables to switch between mock and real data

## Cloudflare Pages Development

### Command
```bash
npm run dev:cloudflare
```

### What Happens
- Runs `wrangler pages dev`
- Simulates Cloudflare Pages environment
- Provides access to Cloudflare Workers KV (VIDEO_DATA)
- Skips `next build` to avoid static generation issues

### Best For
- Testing Cloudflare Pages integration
- Verifying KV data access
- Ensuring compatibility with the Pages environment
- Testing production-like conditions

### Important Notes
- This environment closely mirrors production
- KV data is available through the VIDEO_DATA namespace
- Static generation is disabled to prevent build issues

## Production Deployment

### Commands
```bash
npm run build:cloudflare
npm run deploy
```

### What Happens
1. `build:cloudflare`
   - Builds the app specifically for Cloudflare Pages
   - Runs `@cloudflare/next-on-pages`
   - Optimizes for the Pages environment

2. `deploy`
   - Deploys the built app to Cloudflare Pages
   - Updates the production environment

### Best For
- Production deployments
- Shipping updates to live site
- Testing production builds

### Important Notes
- Always test with `dev:cloudflare` before deploying
- Ensure all environment variables are set in Cloudflare
- Monitor deployment logs for any issues

## Environment Variables

### Local Development
```env
NEXT_PUBLIC_USE_MOCK_DATA=true
```

### Cloudflare Pages
```env
NEXT_PUBLIC_USE_MOCK_DATA=false
```

## Troubleshooting

### Static Generation Issues
- Use `npm run dev` for local development
- Avoid running `next build` during development
- Use `dev:cloudflare` for testing Pages environment

### KV Data Issues
- Check KV namespace configuration in Cloudflare
- Verify environment variables
- Use mock data for local development

### Build Issues
- Clear `.next` directory
- Run `npm install` to update dependencies
- Check for conflicting Next.js and Cloudflare configurations 