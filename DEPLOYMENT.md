# Vercel Deployment Guide

## Quick Deploy to Vercel

### Option 1: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Deploy from your project directory**:
   ```bash
   vercel
   ```

3. **Follow the prompts**:
   - Set up and deploy: Yes
   - Which scope: Select your account
   - Link to existing project: No
   - Project name: (press Enter to use default)
   - In which directory is your code: `./`
   - Want to override settings: No

4. **Production deployment**:
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via Vercel Dashboard

1. **Push your code to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git branch -M main
   git push -u origin main
   ```

2. **Go to [vercel.com](https://vercel.com)** and sign in

3. **Click "Add New Project"**

4. **Import your Git repository**

5. **Configure project**:
   - Framework Preset: Vite
   - Build Command: `npm run build` (automatically pulls tokens via prebuild)
   - Output Directory: `dist`
   - Install Command: `npm install`

6. **Click "Deploy"**

## Automatic Token Updates

### Setting up Auto-Deploy on Token Changes

To automatically redeploy your MUI app whenever design tokens are updated:

1. **In Vercel Dashboard**:
   - Go to your project settings
   - Navigate to "Git" → "Deploy Hooks"
   - Click "Create Hook"
   - Name: "Token Update"
   - Branch: main
   - Copy the webhook URL

2. **In your tokens-test repository**:
   - Go to Settings → Webhooks
   - Click "Add webhook"
   - Paste the Vercel deploy hook URL
   - Content type: `application/json`
   - Events: Select "Just the push event"
   - Click "Add webhook"

Now whenever you push changes to your tokens-test repository, your MUI app will automatically:
1. Receive the webhook trigger
2. Pull the latest design tokens from GitHub
3. Rebuild with the new tokens
4. Deploy the updated application

## Environment Variables (Optional)

If you want to make the token repository URL configurable:

1. In Vercel Dashboard → Settings → Environment Variables
2. Add: `VITE_TOKENS_REPO_URL`
3. Value: `https://raw.githubusercontent.com/jamesyoung-tech/tokens-test/main/tokens/design-tokens.json`

Then update `scripts/pull-tokens.js` to use `process.env.VITE_TOKENS_REPO_URL` if available.

## Verifying Deployment

After deployment, Vercel will provide you with:
- **Production URL**: `https://your-project.vercel.app`
- **Preview URLs**: For each branch/PR

Visit your production URL to see your MUI app live!

## Troubleshooting

### Build fails with token fetch error
- Ensure the tokens-test repository is public
- Check that the design-tokens.json file exists at the correct path
- The build will fail if tokens cannot be fetched

### Tokens not updating
- Check that the prebuild script is running (visible in build logs)
- Verify the webhook is properly configured
- Ensure the token file path in the script matches your repository structure

### Need to skip token pull during build
If you need to build without pulling tokens:
```bash
npm run build -- --skip-prebuild
```

Or temporarily remove the `prebuild` script from package.json.
