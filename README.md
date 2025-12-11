# Storentia - E-commerce Store Template

A modern, feature-rich e-commerce store template built with Next.js 16, React 19, and Tailwind CSS.

## 🚀 Quick Start

Create a new Storentia store with one command:

```bash
npm create storentia@latest
```

You'll be prompted to enter:
1. **Store name** - Your store's name (e.g., "My Awesome Store")
2. **Authentication key** - Your Storentia authentication key (will be validated automatically)

The CLI will automatically:
- ✅ **Validate your API key** against the Storentia backend
- ✅ Retrieve your store information from the API
- ✅ Clone the template
- ✅ Set up your project with the specified name
- ✅ Create `.env.local` with validated store data
- ✅ Create `.env.dashboard` with validated store data
- ✅ Install all dependencies
- ✅ Configure authentication automatically

> **New in v1.1.0**: API keys are now validated before store creation! See [API Validation Guide](./docs/guides/API_VALIDATION.md) for details.

Or provide the store name directly:

```bash
npm create storentia@latest my-store-name
```

Alternative with npx:

```bash
npx create-storentia@latest
```

Then navigate to your project and start the development server:

```bash
cd my-store-name
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your store.

## ✨ Features

- **API Key Validation**: Automatic validation of Storentia API keys before store creation
- **Modern Stack**: Built with Next.js 16 and React 19
- **Beautiful UI**: Pre-built components using Radix UI and Tailwind CSS
- **Dashboard**: Complete admin dashboard for store management
- **Responsive**: Mobile-first design that works on all devices
- **TypeScript**: Full TypeScript support for type safety
- **Dark Mode**: Built-in theme switching with next-themes
- **Charts**: Data visualization with Recharts
- **Carousel**: Product showcases with Embla Carousel

## 📦 What's Included

- Authentication pages (Login/Register)
- Product catalog and detail pages
- Shopping cart functionality
- Admin dashboard
- User profile management
- Order management
- Responsive navigation
- And much more!

## 🔐 Environment Configuration

The CLI automatically creates three environment files with **validated store data** from the Storentia API:

### `.env.local` (Main Store)
```env
# Authentication Key
STORENTIA_AUTH=your_authentication_key

# Store Information (from validated API response)
NEXT_PUBLIC_STORE_ID=your_store_id
NEXT_PUBLIC_STORE_NAME=Your Store Name
NEXT_PUBLIC_STORE_DESCRIPTION=Your store description

# Store Owner Information
STORE_OWNER_ID=owner_id
STORE_OWNER_NAME=Owner Name
STORE_OWNER_EMAIL=owner@example.com

# API Key Information
API_KEY_TYPE=PROD
API_KEY_PERMISSIONS=READ,WRITE,MANAGE_PRODUCTS

# API Configuration
NEXT_PUBLIC_API_URL=https://storekit.samarthh.me/v1
```

### `.env.dashboard` (Admin Dashboard)
Same as `.env.local` with additional dashboard-specific variables:
```env
NEXT_PUBLIC_DASHBOARD_MODE=true
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=auto_generated_secret
```

### `.env.example` (Reference Template)
A template file for your reference with all available environment variables.

**⚠️ Important**: Never commit `.env.local` or `.env.dashboard` to version control. These files are automatically added to `.gitignore`.

**📖 Learn More**: See [API Validation Guide](./docs/guides/API_VALIDATION.md) for detailed information about API key validation.

## 🛠️ Available Scripts

In your project directory, you can run:

### `npm run dev`
Starts the development server on [http://localhost:3000](http://localhost:3000)

### `npm run build`
Builds the application for production

### `npm start`
Runs the built application in production mode

### `npm run lint`
Runs ESLint to check code quality

## 🎨 Customization

The template is fully customizable. You can:

- Modify components in the `src/components` directory
- Update pages in the `src/app` directory
- Customize styles in your Tailwind configuration
- Add your own features and functionality

## 📚 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Components**: [Radix UI](https://www.radix-ui.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **TypeScript**: Full type safety

## 📚 Documentation

- [CLI Usage Guide](./docs/guides/CLI_USAGE.md)
- [API Validation](./docs/guides/API_VALIDATION.md)
- [Changelog](./docs/CHANGELOG.md)
- [Contributing](./docs/development/CONTRIBUTING.md)

## 🤝 Contributing

Contributions are welcome! See [Contributing Guide](./docs/development/CONTRIBUTING.md) for details.

## 📄 License

MIT License - feel free to use this template for your projects!

## 🔗 Links

- [GitHub Repository](https://github.com/thetechsolaceco/Storentia-Init)
- [Report Issues](https://github.com/thetechsolaceco/Storentia-Init/issues)

---

Made with ❤️ by [TechSolace](https://github.com/thetechsolaceco)
