import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import ContextProvider from "@/context";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "react-hot-toast";

const sora = Sora({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Swap Demo",
  description: "Web3 DApp with token swapping functionality",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={sora.className}>
        <ContextProvider cookies={null}>
          <ThemeProvider defaultTheme="dark" storageKey="asva-theme">
            {children}
            <Toaster position="bottom-center" />
          </ThemeProvider>
        </ContextProvider>
      </body>
    </html>
  );
}
