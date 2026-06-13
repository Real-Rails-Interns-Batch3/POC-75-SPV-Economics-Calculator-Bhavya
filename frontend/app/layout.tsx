import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SPV Economics Calculator - Real Rails Intelligence Terminal",
  description: "Production-style single-deal vehicle economics and fee outcomes engine.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}