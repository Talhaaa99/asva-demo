"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, RefreshCw } from "lucide-react";
import { useSwap } from "@/hooks/useSwap";
import { TOKENS } from "@/lib/contracts";
import { useChainId } from "wagmi";
import { formatAddress } from "@/lib/utils";

const TOKEN_OPTIONS = [
  { symbol: "ETH", name: "Ether" },
  { symbol: "USDC", name: "USD Coin" },
];

export function SwapCard() {
  const [tokenIn, setTokenIn] = useState("ETH");
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
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="crypto-card">
        <div className="crypto-card-inner">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <span>Swap Tokens</span>
              {isEstimating && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <RefreshCw className="h-6 w-6 text-purple-500" />
                </motion.div>
              )}
            </h3>
          </div>

          <div className="space-y-8">
            {/* Token Input */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                You Pay
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="number"
                  placeholder="0.0"
                  value={amountIn}
                  onChange={(e) => setAmountIn(e.target.value)}
                  className="crypto-input flex-1 min-w-[200px]"
                />
                <select
                  value={tokenIn}
                  onChange={(e) => setTokenIn(e.target.value)}
                  className="crypto-input w-[80px]"
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
              <button
                onClick={swapTokens}
                className="w-14 h-14 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
                  shadow-lg hover:scale-110 transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.8)]
                  flex items-center justify-center group"
              >
                <ArrowRight className="h-6 w-6 text-white group-hover:rotate-180 transition-transform duration-300" />
              </button>
            </div>

            {/* Token Output */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                You Receive
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="number"
                  placeholder="0.0"
                  value={estimate?.amountOut || ""}
                  readOnly
                  className="crypto-input flex-1 min-w-[200px] bg-gray-50 dark:bg-gray-800"
                />
                <select
                  value={tokenOut}
                  onChange={(e) => setTokenOut(e.target.value)}
                  className="crypto-input w-[80px]"
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
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Slippage Tolerance
              </label>
              <div className="flex gap-2">
                {[0.1, 0.5, 1.0].map((value) => (
                  <button
                    key={value}
                    onClick={() => setSlippage(value)}
                    className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300
                      ${
                        slippage === value
                          ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                      }`}
                  >
                    {value}%
                  </button>
                ))}
              </div>
            </div>

            {/* Swap Details */}
            {estimate && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200/50 dark:border-purple-800/50"
              >
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Price Impact:
                  </span>
                  <span
                    className={
                      estimate.priceImpact > 1
                        ? "text-red-500 font-semibold"
                        : "text-green-500 font-semibold"
                    }
                  >
                    {estimate.priceImpact}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Gas Estimate:
                  </span>
                  <span className="text-gray-900 dark:text-white font-semibold">
                    {estimate.gasEstimate.toString()} gas
                  </span>
                </div>
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleEstimate}
                disabled={
                  !amountIn || parseFloat(amountIn) <= 0 || isEstimating
                }
                className="crypto-button flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isEstimating ? "Estimating..." : "Estimate Swap"}
              </button>

              <button
                onClick={handleSwap}
                disabled={!estimate || isSwapping || isConfirming}
                className="crypto-button flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSwapping
                  ? "Swapping..."
                  : isConfirming
                  ? "Confirming..."
                  : "Execute Swap"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
