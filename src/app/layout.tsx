import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/sonner";
import { Inter, Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geistHeading = Geist({subsets:['latin'],variable:'--font-heading'});

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "ButterScribe",
  description: "AI Content Writing tool for your website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable, geistHeading.variable)}>
      <AuthProvider>
      <body>
        {children}
          <Toaster
            position="top-right"
            toastOptions={{
              unstyled: true,
              classNames: {
                error: "bg-rose-600",
                info: "bg-cyan-600",
                success: "bg-emerald-800",
              },
            }}
          />
      </AuthProvider>
    </html>
  );
}
