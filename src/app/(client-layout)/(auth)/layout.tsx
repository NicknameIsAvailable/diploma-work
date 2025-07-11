export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="h-full flex justify-center items-center gap-4">
      {children}
    </main>
  );
}
