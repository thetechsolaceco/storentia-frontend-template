import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { ReduxProvider } from "@/components/providers/redux-provider";
import { Preloader } from "@/components/shared/preloader";
import { CartProvider } from "@/components/providers/cart-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Storentia - Premium Ecommerce",
  description: "A modern, minimal ecommerce store.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} font-sans min-h-screen flex flex-col antialiased`}
        suppressHydrationWarning
      >
        <Preloader />
        <ReduxProvider>
          <AuthProvider>
            <CartProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="light"
                enableSystem
                disableTransitionOnChange
              >
                {children}
              </ThemeProvider>
            </CartProvider>
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
