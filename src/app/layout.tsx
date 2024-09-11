import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { ThemeProvider } from "~/components/theme-provider";
import { TRPCReactProvider } from "~/trpc/react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { Providers } from "~/components/session-provider";

export const metadata: Metadata = {
  title: {
    template: "%s | Swapify",
    default: "Swapify",
  },
  description: "Get Spotify's recommendations on other music services",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`h-full ${GeistSans.variable}`}>
      <body className="h-full">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <TRPCReactProvider>
              {children}

              <ReactQueryDevtools initialIsOpen={false} />
            </TRPCReactProvider>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
