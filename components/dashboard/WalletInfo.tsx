"use client";

import { motion } from "framer-motion";
import { Wallet, Copy, ExternalLink, RefreshCw } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAccount, useBalance, useChainId, useToken } from "wagmi";
import { formatAddress, formatBalance } from "@/lib/utils";
import { TOKENS, TOKEN_METADATA } from "@/lib/contracts";
import { NetworkSelector } from "./NetworkSelector";

// Separate component to avoid conditional hooks
function TokenBalanceItem({
  symbol,
  address,
  metadata,
}: {
  symbol: string;
  address: string;
  metadata: any;
}) {
  const { address: walletAddress } = useAccount();
  const { data: tokenBalance } = useBalance({
    address: walletAddress,
    token: address as `0x${string}`,
  });

  // Use the correct decimals from metadata or fallback to tokenBalance decimals
  const decimals = metadata?.decimals || tokenBalance?.decimals || 18;
  const balance = tokenBalance?.value || BigInt(0);

  return (
    <div className="flex justify-between items-center p-2 bg-muted rounded-md">
      <div className="flex items-center gap-2">
        <span className="text-sm">{metadata?.logo || "🪙"}</span>
        <div>
          <div className="text-sm font-medium">{metadata?.name || symbol}</div>
          <div className="text-xs text-muted-foreground">
            {metadata?.symbol || symbol}
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm font-medium">
          {formatBalance(balance, decimals)}
        </div>
        <div className="text-xs text-muted-foreground">
          {formatAddress(address)}
        </div>
      </div>
    </div>
  );
}

export function WalletInfo() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { data: balance } = useBalance({
    address,
  });

  const tokens = TOKENS[chainId as keyof typeof TOKENS] || TOKENS[8453];

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
    }
  };

  const openExplorer = () => {
    if (address) {
      let explorerUrl = "";
      switch (chainId) {
        case 1: // Ethereum mainnet
          explorerUrl = `https://etherscan.io/address/${address}`;
          break;
        case 8453: // Base mainnet
          explorerUrl = `https://basescan.org/address/${address}`;
          break;
        case 11155111: // Sepolia
          explorerUrl = `https://sepolia.etherscan.io/address/${address}`;
          break;
        case 84531: // Base Goerli
          explorerUrl = `https://goerli.basescan.org/address/${address}`;
          break;
        default:
          explorerUrl = `https://basescan.org/address/${address}`;
      }
      window.open(explorerUrl, "_blank");
    }
  };

  if (!isConnected) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="crypto-card">
          <div className="crypto-card-inner">
            <div className="flex items-center gap-3 mb-6">
              <Wallet className="h-6 w-6 text-purple-500" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Wallet Not Connected
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Please connect your wallet to start swapping tokens.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="crypto-card">
        <div className="crypto-card-inner">
          <div className="flex items-center gap-3 mb-8">
            <Wallet className="h-6 w-6 text-purple-500" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Wallet Info
            </h3>
          </div>
          <div className="space-y-6">
            {/* Address */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Address
              </label>
              <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <span className="text-sm font-mono flex-1 text-gray-900 dark:text-white">
                  {address ? formatAddress(address) : "Unknown"}
                </span>
                <button
                  onClick={copyAddress}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Copy className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </button>
                <button
                  onClick={openExplorer}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ExternalLink className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>

            {/* Network Selector */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Network
              </label>
              <NetworkSelector />
            </div>

            {/* Balance */}
            {balance && (
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Balance
                </label>
                <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200/50 dark:border-purple-800/50">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatBalance(balance.value, balance.decimals)}{" "}
                    {balance.symbol}
                  </span>
                </div>
              </div>
            )}

            {/* Token Balances */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Token Balances
                </label>
                <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <RefreshCw className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
              <div className="space-y-3">
                {Object.entries(tokens)
                  .filter(([symbol]) => symbol !== "ETH" && symbol !== "WETH") // Remove ETH and WETH from token balances
                  .map(([symbol, address]) => {
                    const metadata =
                      TOKEN_METADATA[symbol as keyof typeof TOKEN_METADATA];

                    return (
                      <TokenBalanceItem
                        key={symbol}
                        symbol={symbol}
                        address={address}
                        metadata={metadata}
                      />
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
