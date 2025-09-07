import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "@/contexts/auth/AuthContext";
import { ExpertProvider } from "@/contexts/auth/ExpertAuthContext";
import { AdminProvider } from "@/contexts/auth/AdminAuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";

import { ReactQueryProvider } from "@/contexts/ReactQueryProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Confidently | Interview Practice App",
  description: "An app for practicing real interviews, powered by Smart Depot",
  authors: [{ name: "Ananthu M A", url: "https://ananthuma.com" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-blue-50 via-indigo-50 to-white dark:from-gray-900 dark:via-indigo-900 dark:to-black transition-colors duration-300`}>
        <AdminProvider>
          <ExpertProvider>
            <AuthProvider>
              <Header />
              {/* Dark/Light mode toggle */}
              <div className="fixed top-4 right-4 z-50">
                <button
                  aria-label="Toggle dark mode"
                  className="btn-primary shadow-lg"
                  onClick={() => {
                    document.body.classList.toggle('dark');
                  }}
                >
                  🌓
                </button>
              </div>
              {/* React Query Provider for global data fetching */}
              <ReactQueryProvider>
                <main>
                  {children}
                </main>
              </ReactQueryProvider>
              <Footer />
            </AuthProvider>
          </ExpertProvider>
        </AdminProvider>
        <Toaster />
      </body>
    </html>
  );
}