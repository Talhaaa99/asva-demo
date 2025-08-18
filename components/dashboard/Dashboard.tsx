"use client";

import { motion } from "framer-motion";
import { useAccount } from "wagmi";
import { formatAddress } from "@/lib/utils";
import { SwapCard } from "./SwapCard";
import { WalletInfo } from "./WalletInfo";
import { ThemeToggle } from "@/components/theme-toggle";
import { useWallet } from "@/hooks/useWallet";

export function Dashboard() {
  const { address, isConnected } = useAccount();
  const { isWalletConnected } = useWallet();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Header */}
      <header className="border-b border-gray-200/20 dark:border-gray-800/50 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex items-center gap-3"
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg animate-glow">
                  <span className="text-white font-bold text-base">A</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-2xl opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Swap Demo
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="flex items-center gap-2"
            >
              {isWalletConnected() && address && (
                <div className="hidden sm:block px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-mono text-gray-700 dark:text-gray-300">
                  {formatAddress(address)}
                </div>
              )}
              <ThemeToggle />
              <appkit-button />
            </motion.div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {/* Swap Interface */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            <SwapCard />
          </motion.div>

          {/* Wallet Information */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          >
            <WalletInfo />
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200/20 dark:border-gray-800/50 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p className="text-sm">
              Built with Next.js 15, TypeScript, TailwindCSS, and Web3
              technologies
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
