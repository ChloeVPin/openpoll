import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { BotIdClient } from "botid/client";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://openpollapp.vercel.app"),
  title: "Open Poll - Free, Real-Time Minimalist Polling",
  description:
    "Create free, real-time polls in seconds. The best open-source alternative to StrawPoll with a minimalist, beautiful design.",
  openGraph: {
    title: "Open Poll - Free, Real-Time Minimalist Polling",
    description:
      "Create free, real-time polls in seconds. The best open-source alternative to StrawPoll with a minimalist, beautiful design.",
    siteName: "Open Poll",
    type: "website",
    images: [
      {
        url: "/opengraph-image?v=3",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Open Poll - Free, Real-Time Minimalist Polling",
    description:
      "Create free, real-time polls in seconds. The best open-source alternative to StrawPoll with a minimalist, beautiful design.",
    images: ["/opengraph-image?v=3"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col selection:bg-primary selection:text-primary-foreground">
        <Providers>
          <BotIdClient
            protect={[
              { path: "/api/vote", method: "POST" },
              { path: "/create", method: "POST" },
              { path: "/p/*/admin", method: "POST" },
            ]}
          />
          {children}
        </Providers>
      </body>
    </html>
  );
}
