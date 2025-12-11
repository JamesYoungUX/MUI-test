# MUI Test App

A beautiful Material-UI application that automatically pulls design tokens from GitHub and deploys to Vercel.

## Features

- 🎨 **Dynamic Design Tokens**: Automatically fetches CSS design tokens from the [tokens-test repository](https://github.com/jamesyoung-tech/tokens-test)
- 🚀 **Material-UI Components**: Built with MUI for a modern, responsive interface
- 🎯 **Primary CTA**: Beautiful call-to-action button with animations
- 📦 **Vercel Deployment**: Configured for seamless deployment to Vercel
- 🔄 **Auto-sync**: Design tokens are pulled automatically before each build

## Design Tokens

This application uses HSL color format for design tokens, pulled from:
`https://github.com/jamesyoung-tech/tokens-test`

The tokens are automatically fetched and converted to CSS custom properties during the build process.

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Pull Latest Design Tokens

To manually pull the latest design tokens from GitHub:

```bash
npm run pull-tokens
```

This will fetch the latest `design-tokens.json` from your repository and update `src/tokens.css`.

### Build for Production

```bash
npm run build
```

The build process automatically pulls the latest design tokens before building.

## Deployment to Vercel

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts to link your project

### Option 2: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your Git repository
4. Vercel will automatically detect the Vite configuration
5. Click "Deploy"

### Automatic Updates

Once deployed, Vercel will automatically:
- Pull the latest design tokens from your GitHub repository
- Rebuild and redeploy whenever you push to your main branch
- Update the design tokens whenever the tokens-test repository is updated (if you set up a webhook)

### Setting up Token Auto-Update (Optional)

To automatically redeploy when design tokens are updated:

1. In your Vercel project settings, go to "Git" → "Deploy Hooks"
2. Create a new deploy hook (e.g., "Token Update")
3. Copy the webhook URL
4. In your tokens-test repository, go to Settings → Webhooks
5. Add the Vercel deploy hook URL
6. Set it to trigger on push events

Now whenever you update design tokens in the tokens-test repository, your MUI app will automatically redeploy with the latest tokens!

## Project Structure

```
mui-test-app/
├── src/
│   ├── App.tsx          # Main application component
│   ├── App.css          # App-specific styles
│   ├── index.css        # Global styles
│   ├── tokens.css       # Auto-generated design tokens
│   └── main.tsx         # Application entry point
├── scripts/
│   └── pull-tokens.js   # Script to fetch tokens from GitHub
├── vercel.json          # Vercel configuration
└── package.json         # Project dependencies and scripts
```

## Technologies Used

- **React** - UI library
- **TypeScript** - Type safety
- **Material-UI (MUI)** - Component library
- **Vite** - Build tool and dev server
- **Emotion** - CSS-in-JS (required by MUI)
- **Vercel** - Deployment platform

## Customization

### Adding More Components

You can easily add more MUI components to the application. The design tokens are available as CSS custom properties:

```css
var(--ds-color-primary)
var(--ds-color-button-test)
var(--ds-spacing-md)
var(--ds-border-radius-lg)
/* etc. */
```

### Updating Design Tokens

1. Update the `design-tokens.json` file in your tokens-test repository
2. The tokens should use HSL format: `hsl(207, 90%, 54%)`
3. Push your changes
4. Run `npm run pull-tokens` locally, or trigger a Vercel deployment

## License

MIT
