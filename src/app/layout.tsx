import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { ReduxProvider } from "@/components/providers/redux-provider";
import { storeAPI } from "@/lib/apiClients";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const storeId = process.env.NEXT_PUBLIC_STORENTIA_STOREID;
  const defaultTitle = "Storentia - Premium Ecommerce";
  const defaultDescription = "A modern, minimal ecommerce store.";

  if (!storeId) {
    return {
      title: defaultTitle,
      description: defaultDescription,
    };
  }

  try {
    const response = await storeAPI.getStore(storeId);
    
    if (response.success && response.data) {
      const store = response.data;
      return {
        title: store.name || defaultTitle,
        description: store.description || defaultDescription,
        icons: {
          icon: store.favicon || "/favicon.ico",
        },
        openGraph: {
          title: store.name || defaultTitle,
          description: store.description || defaultDescription,
          siteName: store.name,
          images: store.logoColoured ? [{ url: store.logoColoured }] : [],
          type: "website",
        },
        twitter: {
          card: "summary_large_image",
          title: store.name || defaultTitle,
          description: store.description || defaultDescription,
          images: store.logoColoured ? [store.logoColoured] : [],
        },
      };
    }
  } catch (error) {
    console.error("Error fetching store metadata:", error);
  }

  return {
    title: defaultTitle,
    description: defaultDescription,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const storeId = process.env.NEXT_PUBLIC_STORENTIA_STOREID;
  let jsonLd = null;

  if (storeId) {
    try {
      const response = await storeAPI.getStore(storeId);
      if (response.success && response.data) {
        const store = response.data;
        jsonLd = {
          "@context": "https://schema.org",
          "@type": "Store",
          name: store.name,
          description: store.description,
          image: store.logoColoured,
          telephone: store.mobile || store.landline,
          email: store.contactEmail || store.supportEmail,
          address: store.address ? {
            "@type": "PostalAddress",
            streetAddress: store.address,
          } : undefined,
          url: process.env.NEXT_PUBLIC_API_URL?.replace('/v1', ''), // Estimated URL
        };
      }
    } catch (e) {
      console.error("Error generating JSON-LD:", e);
    }
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} font-sans min-h-screen flex flex-col antialiased`}
        suppressHydrationWarning
      >
        {jsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        )}
        <ReduxProvider>
          <AuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
