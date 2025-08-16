"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAccount, useChainId } from "wagmi";
import { base, baseGoerli, mainnet, sepolia } from "wagmi/chains";

const NETWORKS = [
  {
    id: mainnet.id,
    name: "Ethereum",
    chain: mainnet,
    icon: "🔵",
    description: "Ethereum Mainnet",
  },
  {
    id: base.id,
    name: "Base",
    chain: base,
    icon: "🔷",
    description: "Base Mainnet",
  },
  {
    id: sepolia.id,
    name: "Sepolia",
    chain: sepolia,
    icon: "🧪",
    description: "Ethereum Testnet",
  },
  {
    id: baseGoerli.id,
    name: "Base Goerli",
    chain: baseGoerli,
    icon: "🔷",
    description: "Base Testnet",
  },
];

export function NetworkSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { chainId } = useAccount();
  const [isPending, setIsPending] = useState(false);

  const currentNetwork = NETWORKS.find((n) => n.id === chainId) || NETWORKS[1]; // Default to Base

  const handleNetworkSwitch = async (chainId: number) => {
    setIsPending(true);
    try {
      // Use window.ethereum for network switching
      if (window.ethereum) {
        await (window.ethereum as any).request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: `0x${chainId.toString(16)}` }],
        });
      }
    } catch (error) {
      console.error("Failed to switch network:", error);
    } finally {
      setIsPending(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className="w-full justify-between text-sm p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{currentNetwork.icon}</span>
          <div className="text-left">
            <div className="font-medium">{currentNetwork.name}</div>
            <div className="text-xs text-muted-foreground">
              {currentNetwork.description}
            </div>
          </div>
        </div>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50"
        >
          <div className="p-1">
            {NETWORKS.map((network) => (
              <button
                key={network.id}
                onClick={() => handleNetworkSwitch(network.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                  chainId === network.id
                    ? "bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20"
                    : ""
                }`}
              >
                <span className="text-lg">{network.icon}</span>
                <div className="flex-1">
                  <div className="font-medium">{network.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {network.description}
                  </div>
                </div>
                {chainId === network.id && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
