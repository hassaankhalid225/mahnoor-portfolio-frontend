import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "Mahnoor Fatima | Premium Video Editing Agency",
  description: "Specialized in high-retention video storytelling for top-tier creators and brands. From Viral Shorts to Cinematic Long-form.",
  openGraph: {
    title: "Mahnoor Fatima | Creative Video Editor",
    description: "Crafting visual excellence through strategic editing.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="antialiased selection:bg-primary/20">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}


