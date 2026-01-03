# PersonalityAI Web Version

Minimal, friction-free web interface for AI-powered personality interviews and career guidance.

## Features

- **Landing Page** – No signup required, instant start
- **Interview Flow** – One question at a time, adaptive AI
- **Autosave** – Responses saved to localStorage, survives refresh
- **Results Export** – JSON export of personality profile
- **Mobile-First** – Responsive design for all devices
- **Error Resilient** – Graceful handling of network failures

## Quick Start

```bash
pnpm install
pnpm dev
```

Visit `http://localhost:5173`

## Build for Production

```bash
pnpm build
```

Output in `dist/` directory.

## Deployment

### Vercel (Recommended)

```bash
npm i -g vercel
vercel
```

### Other Platforms

- **Netlify**: Connect GitHub repo, auto-deploys
- **GitHub Pages**: Run `pnpm build`, push `dist/` to gh-pages branch
- **Your Server**: Copy `dist/` contents to web root

## Environment Variables

Backend API URL is hardcoded to `http://127.0.0.1:3000/trpc` for local development.

For production, update `web/src/lib/trpc.ts` to point to your backend server.

## Architecture

- **Frontend**: React 19 + TypeScript + Tailwind CSS
- **State**: localStorage for session persistence
- **API**: tRPC client connecting to backend
- **Build**: Vite for fast development and optimized production builds
