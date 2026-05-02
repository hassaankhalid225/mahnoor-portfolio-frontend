import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mahnoor Fatima — Video Editor & Motion Designer",
  description: "Cinematic short-form, long-form & motion graphics editing by Mahnoor Fatima. Reels, Shorts, podcasts and YouTube videos.",
  openGraph: {
    title: "Mahnoor Fatima — Video Editor",
    description: "I don't edit videos. I craft stories.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
