import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: {
    default: "PadelFit AI - Prevent Injuries, Play Longer",
    template: "%s | PadelFit AI",
  },
  description: "AI-powered injury prevention for padel players. Personalized warm-up routines, conditioning plans, and form tips to keep you on the court.",
  keywords: ["padel", "injury prevention", "warm up", "padel training", "padel exercises", "padel stretches"],
  authors: [{ name: "PadelFit AI" }],
  creator: "PadelFit AI",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "PadelFit AI",
    title: "PadelFit AI - Prevent Injuries, Play Longer",
    description: "AI-powered injury prevention for padel players. Personalized warm-up routines, conditioning plans, and form tips.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "PadelFit AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PadelFit AI - Prevent Injuries, Play Longer",
    description: "AI-powered injury prevention for padel players.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
