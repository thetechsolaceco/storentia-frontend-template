import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";

export default function ShopLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="flex-1 bg-gray-50">{children}</main>
      <Footer />
    </>
  );
}
