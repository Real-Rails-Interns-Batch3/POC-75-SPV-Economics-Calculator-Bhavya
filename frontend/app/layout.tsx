import React from 'react';
import './globals.css';

export const metadata = {
  title: 'SPV Economics Calculator',
  description: 'Single-deal vehicle economics and fee outcomes',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="min-h-full bg-[#030712] text-slate-300 antialiased overflow-y-auto m-0 p-0">
        {children}
      </body>
    </html>
  );
}