import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "@/contexts/auth/AuthContext";
import { ExpertProvider } from "@/contexts/auth/ExpertAuthContext";
import { AdminProvider } from "@/contexts/auth/AdminAuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";

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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AdminProvider>
          <ExpertProvider>
            <AuthProvider>
              <Header />
              <main>{children}</main>
              <Footer />
            </AuthProvider>
          </ExpertProvider>
        </AdminProvider>
        <Toaster />
      </body>
    </html>
  );
}