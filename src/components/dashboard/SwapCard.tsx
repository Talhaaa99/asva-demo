"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, RefreshCw, AlertCircle, CheckCircle } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSwap } from "@/hooks/useSwap";
import { TOKENS } from "@/lib/contracts";
import { useChainId } from "wagmi";
import { formatAddress } from "@/lib/utils";

const TOKEN_OPTIONS = [
  { symbol: "WETH", name: "Wrapped Ether" },
  { symbol: "USDC", name: "USD Coin" },
  { symbol: "USDT", name: "Tether USD" },
];

export function SwapCard() {
  const [tokenIn, setTokenIn] = useState("WETH");
  const [tokenOut, setTokenOut] = useState("USDC");
  const [amountIn, setAmountIn] = useState("");
  const [slippage, setSlippage] = useState(0.5);

  const chainId = useChainId();
  const tokens = TOKENS[chainId as keyof typeof TOKENS] || TOKENS[8453]; // Default to Base mainnet

  const {
    estimateSwap,
    executeSwap,
    estimate,
    isEstimating,
    isSwapping,
    isConfirming,
    isSuccess,
    isError,
    error,
    hash,
    clearError,
  } = useSwap();

  const handleEstimate = () => {
    if (!amountIn || parseFloat(amountIn) <= 0) return;

    estimateSwap({
      tokenIn: tokens[tokenIn as keyof typeof tokens] || "",
      tokenOut: tokens[tokenOut as keyof typeof tokens] || "",
      amountIn,
      slippage,
    });
  };

  const handleSwap = () => {
    executeSwap();
  };

  const swapTokens = () => {
    setTokenIn(tokenOut);
    setTokenOut(tokenIn);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>Swap Tokens</span>
            {isEstimating && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <RefreshCw className="h-4 w-4" />
              </motion.div>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Token Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">You Pay</label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="0.0"
                value={amountIn}
                onChange={(e) => setAmountIn(e.target.value)}
                className="flex-1"
              />
              <select
                value={tokenIn}
                onChange={(e) => setTokenIn(e.target.value)}
                className="px-3 py-2 border border-input rounded-md bg-background text-sm"
              >
                {TOKEN_OPTIONS.map((token) => (
                  <option key={token.symbol} value={token.symbol}>
                    {token.symbol}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap Direction Button */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="icon"
              onClick={swapTokens}
              className="rounded-full"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Token Output */}
          <div className="space-y-2">
            <label className="text-sm font-medium">You Receive</label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="0.0"
                value={estimate?.amountOut || ""}
                readOnly
                className="flex-1 bg-muted"
              />
              <select
                value={tokenOut}
                onChange={(e) => setTokenOut(e.target.value)}
                className="px-3 py-2 border border-input rounded-md bg-background text-sm"
              >
                {TOKEN_OPTIONS.map((token) => (
                  <option key={token.symbol} value={token.symbol}>
                    {token.symbol}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Slippage Setting */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Slippage Tolerance</label>
            <div className="flex gap-2">
              {[0.1, 0.5, 1.0].map((value) => (
                <Button
                  key={value}
                  variant={slippage === value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSlippage(value)}
                >
                  {value}%
                </Button>
              ))}
            </div>
          </div>

          {/* Swap Details */}
          {estimate && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-2 p-3 bg-muted rounded-md"
            >
              <div className="flex justify-between text-sm">
                <span>Price Impact:</span>
                <span
                  className={
                    estimate.priceImpact > 1 ? "text-red-500" : "text-green-500"
                  }
                >
                  {estimate.priceImpact}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Gas Estimate:</span>
                <span>{estimate.gasEstimate.toString()} gas</span>
              </div>
            </motion.div>
          )}

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700"
            >
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
              <Button variant="ghost" size="sm" onClick={clearError}>
                ×
              </Button>
            </motion.div>
          )}

          {/* Success Display */}
          {isSuccess && hash && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md text-green-700"
            >
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">
                Swap successful! Hash: {formatAddress(hash)}
              </span>
            </motion.div>
          )}
        </CardContent>

        <CardFooter className="flex gap-2">
          <Button
            onClick={handleEstimate}
            disabled={!amountIn || parseFloat(amountIn) <= 0 || isEstimating}
            className="flex-1"
          >
            {isEstimating ? "Estimating..." : "Estimate Swap"}
          </Button>

          <Button
            onClick={handleSwap}
            disabled={!estimate || isSwapping || isConfirming}
            className="flex-1"
          >
            {isSwapping || isConfirming ? "Swapping..." : "Execute Swap"}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
