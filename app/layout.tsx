import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ApiKeysProvider } from "@/context/ApiKeysContext";
import { StyleRulesProvider } from "@/context/StyleRulesContext";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DeepL API Demo - Style Rules & Custom Instructions",
  description: "Interactive demo showcasing DeepL's Style Rules API and Custom Instructions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ApiKeysProvider>
          <StyleRulesProvider>
            {children}
            <Toaster />
          </StyleRulesProvider>
        </ApiKeysProvider>
      </body>
    </html>
  );
}
