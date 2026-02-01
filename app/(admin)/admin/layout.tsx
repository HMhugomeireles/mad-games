import type { ReactNode } from "react";
import AdminMenu from "@/components/admin-menu";
import { Toaster } from "@/components/ui/sonner";
import Providers from "@/lib/tankstack/provider";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import "./globals.css";
import { Geist, Geist_Mono, Share_Tech_Mono } from "next/font/google";


export const metadata = {
    title: "Admin",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const shareTechMono = Share_Tech_Mono({
  weight: '400', // Esta fonte geralmente só tem peso 400
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-share-tech', // Definimos um nome de variável CSS
});

export default function AdminLayout({ children }: { children: ReactNode }) {
    // Nota: não usamos container aqui para evitar "double padding".
    // As páginas /admin/* que já têm container continuam válidas.
    return (
        <html lang="pt" suppressHydrationWarning>
            <body className={`min-h-screen bg-background text-foreground antialiased ${shareTechMono.variable}`}>
                <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
                    <Header />
                    <Providers>
                        <section>
                            <AdminMenu />
                            <Toaster richColors position="top-center" closeButton />
                            <Providers>{children}</Providers>
                        </section>
                    </Providers>
                </ThemeProvider>
            </body>
        </html>
    );
}
