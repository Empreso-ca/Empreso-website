import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Empreso",
  description: "Empreso website",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.svg" sizes="any" />
        {/* Preconnect to font services - optimizes DNS lookup */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Font loading with swap - prevents FOUT (Flash of Unstyled Text) */}
        {/* display=swap allows page to load with fallback font, then swaps when ready */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans bg-background text-foreground min-h-screen">
        <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
          <Navbar />
          {children}
          <Footer />
        </ClerkProvider>
      </body>
    </html>
  );
}
