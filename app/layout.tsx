import type { Metadata } from "next";
import { Geist, Geist_Mono, Fredoka } from "next/font/google";
import "./globals.css";
import { AppProvider } from "./context";
import { Nav } from "./components/nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "TimeTracker - 168 Hours",
  description: "Personal time tracking and analysis. See where your 168 hours go.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fredoka.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col text-slate-900" style={{ backgroundColor: '#FFFBF0', fontFamily: 'var(--font-fredoka), sans-serif' }}>
        <AppProvider>
          <Nav />
          <main className="max-w-6xl mx-auto w-full px-4 py-8 flex-1">
            {children}
          </main>
        </AppProvider>
      </body>
    </html>
  );
}
