# API Key Validation

## Overview

The CLI automatically validates your Storentia API key before creating a store.

## How It Works

1. Enter your authentication key (format: `sk_prod_...`)
2. CLI validates against `https://storekit.samarthh.me/v1/auth/key/validate`
3. If valid, displays your store information
4. Proceeds with store creation using validated data

## Validation Response

**Success:**
```
✅ Authentication successful!

📊 Store Information:
  • Store Name: Your Store
  • Store ID: xxxx-xxxx-xxxx
  • Owner: Your Name
  • Key Type: PROD
  • Permissions: READ, WRITE, MANAGE_PRODUCTS
```

**Failure:**
```
❌ Authentication failed: Invalid API key
Please check your API key and try again.
```

## Data Retrieved

- **Store**: ID, name, description
- **Owner**: ID, name, email
- **API Key**: Type, permissions

## Getting Your API Key

1. Visit [https://storekit.samarthh.me](https://storekit.samarthh.me)
2. Sign in or create an account
3. Navigate to store settings
4. Generate a new API key
5. Copy the key (format: `sk_prod_...`)

## Troubleshooting

| Error | Solution |
|-------|----------|
| Invalid API key | Check key is correct and active |
| Network error | Check internet connection |
| Empty key | Enter a valid API key |

## Security

- Keys validated via HTTPS
- Environment files auto-added to `.gitignore`
- Never share or commit API keys
