import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import RefreshTokenProvider from "@/entities/auth/refresh-token-provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <RefreshTokenProvider>
        <Header />
        <main className="min-h-screen flex flex-col gap-4">{children}</main>
        <Footer />
      </RefreshTokenProvider>
    </>
  );
}
