"use client";

import { motion } from "framer-motion";
import { Wallet, Copy, ExternalLink } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAccount, useBalance, useChainId } from "wagmi";
import { formatAddress, formatBalance } from "@/lib/utils";
import { TOKENS } from "@/lib/contracts";

export function WalletInfo() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { data: balance } = useBalance({
    address,
    watch: true,
  });

  const tokens = TOKENS[chainId as keyof typeof TOKENS] || TOKENS[8453];

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
    }
  };

  const openExplorer = () => {
    if (address) {
      const explorerUrl =
        chainId === 8453
          ? `https://basescan.org/address/${address}`
          : `https://goerli.basescan.org/address/${address}`;
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
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Wallet Not Connected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Please connect your wallet to start swapping tokens.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Wallet Info
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Address */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Address</label>
            <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
              <span className="text-sm font-mono flex-1">
                {address ? formatAddress(address) : "Unknown"}
              </span>
              <Button variant="ghost" size="sm" onClick={copyAddress}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={openExplorer}>
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Network */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Network</label>
            <div className="p-2 bg-muted rounded-md">
              <span className="text-sm">
                {chainId === 8453 ? "Base Mainnet" : "Base Testnet"}
              </span>
            </div>
          </div>

          {/* Balance */}
          {balance && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Balance</label>
              <div className="p-2 bg-muted rounded-md">
                <span className="text-sm">
                  {formatBalance(balance.value, balance.decimals)}{" "}
                  {balance.symbol}
                </span>
              </div>
            </div>
          )}

          {/* Token Balances */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Token Balances</label>
            <div className="space-y-2">
              {Object.entries(tokens).map(([symbol, address]) => (
                <div
                  key={symbol}
                  className="flex justify-between items-center p-2 bg-muted rounded-md"
                >
                  <span className="text-sm font-medium">{symbol}</span>
                  <span className="text-sm text-muted-foreground">
                    {formatAddress(address)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
