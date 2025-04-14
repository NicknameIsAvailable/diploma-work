import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="min-h-screen flex flex-col gap-4">{children}</main>
      <Footer />
    </>
  );
}
