import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Peblo Notes — Collaborative AI Workspace",
  description: "AI-powered collaborative notes workspace for the Peblo challenge",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-950 antialiased`}>
        <AuthProvider>
          <Providers>
            <Navbar />
            <main>{children}</main>
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
