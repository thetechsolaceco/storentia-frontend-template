# 🎯 Storentia CLI Usage Examples

## Interactive Mode (Recommended)

Simply run the command without any arguments:

```bash
npm create storentia@latest
```

**You'll see:**
```
🎉 Welcome to Storentia Store Creator!

Let's set up your e-commerce store...

📦 What will be your store name? _
```

**Enter your store name:**
```
📦 What will be your store name? My Awesome Store

✨ Creating store: my-awesome-store

🔐 Enter your Storentia authentication key: _
```

**Enter your authentication key:**
```
🔐 Enter your Storentia authentication key: sk_live_abc123xyz789

📦 Cloning Storentia template...
🔧 Creating environment configuration...
  ✅ Created .env.local (Main Store)
  ✅ Created .env.dashboard (Dashboard)
  ✅ Created .env.example (Reference)
📥 Installing dependencies...
```

## Quick Mode (With Store Name)

Provide the store name as an argument:

```bash
npm create storentia@latest my-store-name
```

**You'll only be asked for the auth key:**
```
🎉 Welcome to Storentia Store Creator!

Let's set up your e-commerce store...

✨ Creating store: my-store-name

🔐 Enter your Storentia authentication key: _
```

## What Gets Created

After running the CLI, your project structure will be:

```
my-awesome-store/
├── .env.local          # Main store configuration
├── .env.dashboard      # Dashboard configuration
├── .env.example        # Reference template
├── .gitignore          # Updated with env files
├── src/
│   ├── app/
│   │   ├── (shop)/     # Main store pages
│   │   └── dashboard/  # Admin dashboard
│   ├── components/     # Reusable components
│   └── lib/            # Utilities
├── public/             # Static assets
└── package.json        # Your project config
```

## Environment Files Generated

### `.env.local` (Main Store)
```env
# Storentia Main Store Configuration
# Generated on 2025-12-10T17:56:34.000Z

# Authentication Key
STORENTIA_AUTH=sk_live_abc123xyz789

# Store Information
NEXT_PUBLIC_STORE_NAME=My Awesome Store

# API Configuration (update with your backend URL)
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Optional: Add your custom environment variables below
```

### `.env.dashboard` (Dashboard)
```env
# Storentia Dashboard Configuration
# Generated on 2025-12-10T17:56:34.000Z

# Authentication Key
STORENTIA_AUTH=sk_live_abc123xyz789

# Dashboard Configuration
NEXT_PUBLIC_DASHBOARD_MODE=true
NEXT_PUBLIC_STORE_NAME=My Awesome Store

# API Configuration (update with your backend URL)
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Session Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6

# Optional: Add your custom dashboard environment variables below
```

## Success Message

After successful installation:

```
✅ Success! Created my-awesome-store at /path/to/my-awesome-store

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📁 Environment Files Created:

  • .env.local      - Main store configuration
  • .env.dashboard  - Dashboard configuration
  • .env.example    - Reference template

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 Getting Started:

  cd my-awesome-store
  npm run dev          # Start main store
  npm run dev:dashboard # Start dashboard (if configured)

📚 Available Commands:

  npm run dev     - Start development server
  npm run build   - Build for production
  npm start       - Run production build
  npm run lint    - Run ESLint

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔐 Your authentication key has been saved securely.
⚠️  Never commit .env.local or .env.dashboard to version control!

Happy coding! 🎉
```

## Running Your Store

### Start Development Server
```bash
cd my-awesome-store
npm run dev
```

Visit: http://localhost:3000

### Start Dashboard
```bash
cd my-awesome-store
# Use the dashboard environment
npm run dev:dashboard
```

Or manually:
```bash
NODE_ENV=development node -r dotenv/config -r dotenv/config --env-file=.env.dashboard server.js
```

## Common Use Cases

### 1. Creating Multiple Stores
```bash
npm create storentia@latest store-electronics
npm create storentia@latest store-fashion
npm create storentia@latest store-books
```

Each will have its own auth key and configuration.

### 2. Development vs Production Keys

**Development:**
```bash
npm create storentia@latest my-store-dev
# Enter: sk_test_abc123
```

**Production:**
```bash
npm create storentia@latest my-store-prod
# Enter: sk_live_xyz789
```

### 3. Team Collaboration

Share the `.env.example` file with your team:
```bash
# Team member clones the repo
git clone your-repo-url
cd your-repo

# Copy example and add their own keys
cp .env.example .env.local
# Edit .env.local with their auth key
```

## Troubleshooting

### Store Name Already Exists
```
❌ Error: Directory "my-store" already exists!
```

**Solution:** Choose a different name or remove the existing directory.

### Empty Store Name
```
📦 What will be your store name?
❌ Error: Store name cannot be empty!
```

**Solution:** Provide a valid store name.

### Empty Auth Key
```
🔐 Enter your Storentia authentication key:
❌ Error: Authentication key cannot be empty!
```

**Solution:** Provide a valid authentication key.

## Security Best Practices

1. **Never commit env files:**
   ```bash
   # Already in .gitignore
   .env.local
   .env.dashboard
   .env*.local
   ```

2. **Use different keys for different environments:**
   - Development: `sk_test_...`
   - Production: `sk_live_...`

3. **Rotate keys regularly:**
   - Update `.env.local` and `.env.dashboard`
   - Restart your development server

4. **Store keys securely:**
   - Use a password manager
   - Don't share in chat/email
   - Use environment variable services in production

## Next Steps

After creating your store:

1. ✅ Review the generated `.env` files
2. ✅ Customize your store in `src/app/(shop)`
3. ✅ Configure dashboard in `src/app/dashboard`
4. ✅ Update API endpoints in env files
5. ✅ Add your products and content
6. ✅ Deploy to production

---

**Need help?** Check the main [README.md](./README.md) or visit the [GitHub repository](https://github.com/thetechsolaceco/Storentia-Init).
