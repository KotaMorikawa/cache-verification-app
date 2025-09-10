import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
  title: "Next.js 15 Cache Testing",
  description: "Testing cache behavior in Next.js 15",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <nav className="bg-gray-900 text-white p-4 border-b">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <Link href="/" className="text-xl font-bold hover:text-blue-300 transition-colors">
              Cache Testing
            </Link>
            <div className="flex space-x-6">
              <Link href="/" className="hover:text-blue-300 transition-colors">
                Home
              </Link>
              <Link href="/case1" className="hover:text-blue-300 transition-colors">
                Case 1
              </Link>
              <Link href="/case2" className="hover:text-blue-300 transition-colors">
                Case 2
              </Link>
              <Link href="/case3" className="hover:text-blue-300 transition-colors">
                Case 3
              </Link>
              <Link href="/case4" className="hover:text-blue-300 transition-colors">
                Case 4
              </Link>
              <Link href="/case5" className="hover:text-blue-300 transition-colors">
                Case 5
              </Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
