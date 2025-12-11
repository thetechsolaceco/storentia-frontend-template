# Storentia CLI Usage Guide

## Quick Start

### Interactive Mode (Recommended)

```bash
npm create storentia@latest
```

You'll be prompted for:
1. **Store name** - Your store's name
2. **Authentication key** - Your Storentia API key

### With Store Name Argument

```bash
npm create storentia@latest my-store-name
```

Only asks for the authentication key.

## What Gets Created

```
my-store/
├── .env.local          # Main store configuration
├── .env.dashboard      # Dashboard configuration
├── .env.example        # Reference template
├── src/
│   ├── app/
│   │   ├── (shop)/     # Main store pages
│   │   └── dashboard/  # Admin dashboard
│   ├── components/     # Reusable components
│   └── lib/            # Utilities
├── public/             # Static assets
└── package.json        # Project config
```

## Environment Files

### `.env.local` (Main Store)
```env
STORENTIA_AUTH=your_key
NEXT_PUBLIC_STORE_ID=your_store_id
NEXT_PUBLIC_STORE_NAME=Your Store Name
NEXT_PUBLIC_API_URL=https://storekit.samarthh.me/v1
```

### `.env.dashboard` (Dashboard)
```env
STORENTIA_AUTH=your_key
NEXT_PUBLIC_DASHBOARD_MODE=true
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=auto_generated_secret
```

## Running Your Store

```bash
cd my-store
npm run dev
```

Visit: http://localhost:3000

## Security Best Practices

- Never commit `.env.local` or `.env.dashboard` to version control
- Use different keys for development and production
- Rotate keys regularly if compromised
