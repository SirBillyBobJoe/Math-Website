import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "XSmart",
  description: "A Complete Math Website To Drastically Improve Your Mathematics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const titleAsString = String(metadata.title ?? 'Default Title');
  return (
    <html lang="en">
      <Head>
        <title>{titleAsString}</title>
        <meta name="description" content={metadata.description ?? ''} />
      </Head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
