# Final

A Next.js application for searching and displaying Rumble videos, articles, and businesses.

## Getting Started

### Prerequisites
- Node.js >= 20.0.0
- npm or yarn
- Cloudflare account (for production deployment)

### Installation
```bash
npm install
```

### Development Workflows

This project supports multiple development environments. See [WORKFLOW.md](WORKFLOW.md) for detailed information about:

- Local development with Next.js
- Cloudflare Pages development with KV
- Production deployment process

### Quick Start

1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Choose your development environment:
```bash
# For local development
npm run dev

# For Cloudflare Pages development
npm run dev:cloudflare
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
final/
├── src/
│   ├── components/     # React components
│   ├── context/       # React context providers
│   ├── pages/         # Next.js pages
│   ├── styles/        # Global styles
│   └── types/         # TypeScript type definitions
├── public/            # Static assets
├── .env.example       # Example environment variables
├── WORKFLOW.md        # Development and deployment workflows
└── package.json       # Project dependencies and scripts
```

## Available Scripts

- `npm run dev` - Start Next.js development server
- `npm run dev:cloudflare` - Start Cloudflare Pages development server
- `npm run build` - Build for Next.js
- `npm run build:cloudflare` - Build for Cloudflare Pages
- `npm run deploy` - Deploy to Cloudflare Pages
- `npm run lint` - Run ESLint
- `npm test` - Run tests

## Contributing

1. Create a new branch for your feature
2. Follow the development workflow in [WORKFLOW.md](WORKFLOW.md)
3. Submit a pull request

## License

This project is private and confidential.

## Features

- Search functionality for videos, articles, and businesses
- Responsive grid layout
- Type-safe implementation with TypeScript
- Cloudflare Pages deployment
