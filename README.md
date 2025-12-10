# Storentia - E-commerce Store Template

A modern, feature-rich e-commerce store template built with Next.js 16, React 19, and Tailwind CSS.

## 🚀 Quick Start

Create a new Storentia store with one command:

```bash
npm create storentia@latest
```

You'll be prompted to enter:
1. **Store name** - Your store's name (e.g., "My Awesome Store")
2. **Authentication key** - Your Storentia authentication key

The CLI will automatically:
- ✅ Clone the template
- ✅ Set up your project with the specified name
- ✅ Create `.env.local` for your main store
- ✅ Create `.env.dashboard` for your admin dashboard
- ✅ Install all dependencies
- ✅ Configure authentication automatically

Or provide the store name directly:

```bash
npm create storentia@latest my-store-name
```

Or with npx:

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

The CLI automatically creates three environment files:

### `.env.local` (Main Store)
```env
STORENTIA_AUTH=your_authentication_key
NEXT_PUBLIC_STORE_NAME=Your Store Name
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### `.env.dashboard` (Admin Dashboard)
```env
STORENTIA_AUTH=your_authentication_key
NEXT_PUBLIC_DASHBOARD_MODE=true
NEXT_PUBLIC_STORE_NAME=Your Store Name
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=auto_generated_secret
```

### `.env.example` (Reference Template)
A template file for your reference with all available environment variables.

**⚠️ Important**: Never commit `.env.local` or `.env.dashboard` to version control. These files are automatically added to `.gitignore`.

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

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 📄 License

MIT License - feel free to use this template for your projects!

## 🔗 Links

- [GitHub Repository](https://github.com/thetechsolaceco/Storentia-Init)
- [Report Issues](https://github.com/thetechsolaceco/Storentia-Init/issues)

---

Made with ❤️ by [TechSolace](https://github.com/thetechsolaceco)
