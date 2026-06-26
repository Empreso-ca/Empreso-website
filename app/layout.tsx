// /app/layout.tsx
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css"
import { ThemeProvider } from "next-themes";
import { ProfileProvider } from "@/context/ProfileContext";
import QueryProvider from "@/components/providers/query-provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" sizes="any" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
        <body className="font-sans bg-background text-foreground min-h-screen">

          <ClerkProvider>

            <QueryProvider>

              <div suppressHydrationWarning>

                {/* <ThemeProvider
                  attribute="class"
                  defaultTheme="system"
                  enableSystem
                > */}

                  <ProfileProvider>
                    {children}
                  </ProfileProvider>

                {/* </ThemeProvider> */}
                
              </div>

            </QueryProvider>

          </ClerkProvider>

        </body>
    </html>
  );
}