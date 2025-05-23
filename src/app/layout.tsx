import "~/styles/globals.css";
import { TopNav } from "../_components/TopNav";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "SV Baseball",
  description: "Generated by IceRayer",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <ClerkProvider>
        <body>
          <Toaster />
          <TopNav />
          <main>
            {children}
          </main>
        </body>
      </ClerkProvider>
    </html>
  );
}
