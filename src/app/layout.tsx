import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ponkachu - Pikachu Meme Coin Web Game",
  description: "Ponkachu is a Pikachu-themed meme coin web game where players match identical tiles by connecting them with paths of no more than 3 turns. Features include 5 challenging levels, real-time scoring, sound effects, and a comprehensive leaderboard system. Join the Ponkachu community and test your puzzle-solving skills!",
  keywords: "Ponkachu, Pikachu, meme coin, web game, puzzle game, tile matching, blockchain game, crypto game",
  authors: [{ name: "Ponkachu Team" }],
  openGraph: {
    title: "Ponkachu - Pikachu Meme Coin Web Game",
    description: "Match identical tiles with paths of no more than 3 turns in this exciting Pikachu-themed puzzle game!",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ponkachu - Pikachu Meme Coin Web Game",
    description: "Match identical tiles with paths of no more than 3 turns in this exciting Pikachu-themed puzzle game!",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
