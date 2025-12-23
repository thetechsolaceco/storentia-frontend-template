# Storentia

Developer-first eCommerce infrastructure that simplifies how online stores are built, managed, and scaled.

## What is Storentia?

Storentia provides a centralized dashboard and APIs that let teams create and operate fully functional eCommerce stores with greater control and flexibility. Instead of relying on rigid platforms, you get:

- **Full ownership** of your storefront code
- **Hosted backend** for catalog, orders, and user management
- **Multi-store support** from a single subscription
- **Production-ready** templates to ship faster

## Quick Start

```bash
npm create storentia@latest
```

You'll be prompted to enter:
1. **Project name** - Name of your project
2. **API key** - Your Storentia API key (get one from the [Storentia Dashboard](https://storentia.com))

## How It Works

1. **Subscribe** to Storentia and define how many stores you need
2. **Generate API keys** from the dashboard for each store
3. **Bootstrap** your project with the CLI
4. **Customize** the storefront while Storentia handles the backend

Your storefront is fully customizable and developer-owned. All operational logic—catalog management, user access, and order handling—is managed through Storentia's hosted dashboard and APIs.

## Features

- 🛒 **Products & Categories** - Full catalog management
- 📦 **Order Management** - Track orders with status updates
- 👤 **User Authentication** - Built-in auth with Google OAuth
- 📍 **Address Management** - Billing and shipping addresses
- 🛍️ **Cart & Checkout** - Complete shopping flow
- 🔍 **Product Search** - Real-time search with suggestions
- 🌙 **Dark Mode** - Theme support out of the box
- 📱 **Responsive** - Mobile-first design

## Environment Variables

```env
NEXT_PUBLIC_API_URL=https://api.storentia.com/v1
NEXT_PUBLIC_STORENTIA_API_KEY=your_api_key_here
```

## Project Structure

```
├── src/
│   ├── app/           # Next.js app router pages
│   ├── components/    # React components
│   │   ├── landing/   # Landing page components
│   │   ├── providers/ # Context providers
│   │   ├── shared/    # Shared components (Header, Footer)
│   │   └── ui/        # UI primitives (shadcn/ui)
│   ├── lib/           # Utilities and API clients
│   │   ├── apiClients/# Storentia API integration
│   │   └── store/     # Redux store (cart state)
│   └── types/         # TypeScript types
├── public/            # Static assets
├── scripts/           # CLI and build scripts
└── docs/              # Documentation
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **State Management**: Redux Toolkit
- **Authentication**: Cookie-based with Storentia API
- **Language**: TypeScript

## Development

```bash
npm run dev      # Start dev server on port 3001
npm run build    # Build for production
npm start        # Run production build
npm run lint     # Run ESLint
```

## Documentation

- [CLI Usage](./docs/guides/CLI_USAGE.md)
- [API Validation](./docs/guides/API_VALIDATION.md)
- [Contributing](./docs/development/CONTRIBUTING.md)
- [Changelog](./docs/CHANGELOG.md)

## Why Storentia?

| Traditional Approach | With Storentia |
|---------------------|----------------|
| Build auth from scratch | Auth included |
| Set up database & APIs | Hosted backend |
| Rebuild for each store | Multi-store ready |
| Maintain infrastructure | Focus on UI/UX |

Ship faster. Maintain consistency. Scale without rebuilding.

## License

MIT
