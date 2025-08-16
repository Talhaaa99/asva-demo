import { useState, useCallback, useEffect } from "react";
import {
  useAccount,
  useChainId,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseUnits } from "@/lib/utils";
import {
  UNISWAP_V2_ROUTER_ABI,
  UNISWAP_V2_ROUTER_ADDRESSES,
  TOKENS,
  TOKEN_METADATA,
  ERC20_ABI,
} from "@/lib/contracts";
import { swapToasts } from "@/components/ui/toast";
import { useEstimate } from "./useEstimate";
import {
  calculateSwapRate,
  calculateSwapRateFromExchangeRates,
} from "@/lib/prices";
import { usePrices } from "./usePrices";
import { SwapParams, SwapEstimate } from "@/lib/types";
import {
  FALLBACK_RATES,
  GAS_ESTIMATES,
  TRANSACTION_TIMEOUTS,
} from "@/lib/constants";
import { SwapService } from "@/lib/services/swapService";

export function useSwap() {
  const [swapParams, setSwapParams] = useState<SwapParams | null>(null);
  const [estimate, setEstimate] = useState<SwapEstimate | null>(null);
  const [isEstimating, setIsEstimating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { address } = useAccount();
  const chainId = useChainId();
  const routerAddress =
    UNISWAP_V2_ROUTER_ADDRESSES[
      chainId as keyof typeof UNISWAP_V2_ROUTER_ADDRESSES
    ];
  const tokens = TOKENS[chainId as keyof typeof TOKENS] || TOKENS[8453];
  const { prices, exchangeRates } = usePrices();

  // Estimate swap
  const estimateSwap = useCallback(
    async (params: SwapParams) => {
      if (
        !routerAddress ||
        !params.amountIn ||
        parseFloat(params.amountIn) <= 0
      ) {
        setError("Invalid input amount");
        return;
      }

      setIsEstimating(true);
      setError(null);
      swapToasts.estimating();

      try {
        // Get token decimals for proper parsing
        const tokenInSymbol = Object.keys(tokens).find(
          (key) => tokens[key as keyof typeof tokens] === params.tokenIn
        );
        const tokenOutSymbol = Object.keys(tokens).find(
          (key) => tokens[key as keyof typeof tokens] === params.tokenOut
        );

        if (!tokenInSymbol || !tokenOutSymbol) {
          throw new Error("Invalid token pair");
        }

        const tokenInDecimals =
          TOKEN_METADATA[tokenInSymbol as keyof typeof TOKEN_METADATA]
            ?.decimals || 18;
        const tokenOutDecimals =
          TOKEN_METADATA[tokenOutSymbol as keyof typeof TOKEN_METADATA]
            ?.decimals || 18;

        const amountInWei = parseUnits(params.amountIn, tokenInDecimals);
        const path = [
          params.tokenIn as `0x${string}`,
          params.tokenOut as `0x${string}`,
        ];

        // For now, use a simplified estimation since we can't use hooks in callbacks
        // In a real implementation, you'd need to restructure this differently

        // Use real-time prices for estimation
        let amountOutString: string;

        if (exchangeRates) {
          // Use exchange rates if available (more accurate)
          amountOutString = calculateSwapRateFromExchangeRates(
            tokenInSymbol,
            tokenOutSymbol,
            params.amountIn,
            exchangeRates
          );
        } else if (prices && Object.keys(prices).length > 0) {
          // Fallback to simple price calculation
          amountOutString = calculateSwapRate(
            tokenInSymbol,
            tokenOutSymbol,
            params.amountIn,
            prices
          );
        } else {
          // Fallback to hardcoded rates for demo
          const tokenInPrice =
            FALLBACK_RATES[tokenInSymbol as keyof typeof FALLBACK_RATES] || 1;
          const tokenOutPrice =
            FALLBACK_RATES[tokenOutSymbol as keyof typeof FALLBACK_RATES] || 1;

          const amountInUSD = parseFloat(params.amountIn) * tokenInPrice;
          const amountOut = amountInUSD / tokenOutPrice;

          amountOutString = amountOut.toFixed(6);
        }

        // Convert the string result to the proper format for display
        const amountOutFormatted = amountOutString;

        // Calculate price impact (simplified)
        const priceImpact = 0.5; // This would be calculated based on reserves
        const gasEstimate = BigInt(GAS_ESTIMATES.swap); // Estimated gas

        setEstimate({
          amountOut: amountOutFormatted,
          priceImpact: priceImpact,
          gasEstimate: gasEstimate,
        });

        setSwapParams(params);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to estimate swap";
        setError(errorMessage);
        swapToasts.estimationError(errorMessage);
      } finally {
        setIsEstimating(false);
      }
    },
    [routerAddress, tokens]
  );

  // Execute swap
  const {
    writeContract,
    data: hash,
    isPending: isSwapping,
  } = useWriteContract();

  const executeSwap = useCallback(async () => {
    if (!swapParams || !estimate || !address || !routerAddress) {
      const errorMessage = "Missing swap parameters or wallet not connected";
      setError(errorMessage);
      swapToasts.error(errorMessage);
      return;
    }

    try {
      swapToasts.swapping();

      // Get token decimals for proper parsing
      const tokenInSymbol = Object.keys(tokens).find(
        (key) => tokens[key as keyof typeof tokens] === swapParams.tokenIn
      );
      const tokenOutSymbol = Object.keys(tokens).find(
        (key) => tokens[key as keyof typeof tokens] === swapParams.tokenOut
      );

      if (!tokenInSymbol || !tokenOutSymbol) {
        throw new Error("Invalid token pair");
      }

      const tokenInDecimals =
        TOKEN_METADATA[tokenInSymbol as keyof typeof TOKEN_METADATA]
          ?.decimals || 18;
      const tokenOutDecimals =
        TOKEN_METADATA[tokenOutSymbol as keyof typeof TOKEN_METADATA]
          ?.decimals || 18;

      const amountInWei = parseUnits(swapParams.amountIn, tokenInDecimals);
      const amountOutMin =
        (parseUnits(estimate.amountOut, tokenOutDecimals) *
          (BigInt(1000) - BigInt(Math.floor(swapParams.slippage * 10)))) /
        BigInt(1000);
      const path = [
        swapParams.tokenIn as `0x${string}`,
        swapParams.tokenOut as `0x${string}`,
      ];
      const deadline =
        Math.floor(Date.now() / 1000) + TRANSACTION_TIMEOUTS.deadline;

      // Determine the correct swap function based on token types
      const isETHIn = tokenInSymbol === "ETH";
      const isETHOut = tokenOutSymbol === "ETH";

      // Check if approval is needed (only for non-ETH tokens)
      if (!isETHIn) {
        // For non-ETH tokens, we need to approve the router to spend our tokens
        // This is a simplified version - in production you'd check current allowance first
        writeContract({
          address: swapParams.tokenIn as `0x${string}`,
          abi: ERC20_ABI,
          functionName: "approve",
          args: [routerAddress, amountInWei],
        });
        return; // Exit here, the actual swap will be triggered after approval
      }

      // Use SwapService to get the correct path
      const actualPath = SwapService.getSwapPath(
        swapParams.tokenIn,
        swapParams.tokenOut,
        isETHIn,
        isETHOut,
        chainId
      );

      if (isETHIn && !isETHOut) {
        // ETH to Token
        (writeContract as any)({
          address: routerAddress as `0x${string}`,
          abi: UNISWAP_V2_ROUTER_ABI,
          functionName: "swapExactETHForTokens",
          args: [amountOutMin, actualPath, address, BigInt(deadline)],
          value: amountInWei,
        });
      } else if (!isETHIn && isETHOut) {
        // Token to ETH
        (writeContract as any)({
          address: routerAddress as `0x${string}`,
          abi: UNISWAP_V2_ROUTER_ABI,
          functionName: "swapExactTokensForETH",
          args: [
            amountInWei,
            amountOutMin,
            actualPath,
            address,
            BigInt(deadline),
          ],
        });
      } else {
        // Token to Token
        (writeContract as any)({
          address: routerAddress as `0x${string}`,
          abi: UNISWAP_V2_ROUTER_ABI,
          functionName: "swapExactTokensForTokens",
          args: [
            amountInWei,
            amountOutMin,
            actualPath,
            address,
            BigInt(deadline),
          ],
        });
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to execute swap";
      setError(errorMessage);
      swapToasts.error(errorMessage);
    }
  }, [swapParams, estimate, address, routerAddress, writeContract, tokens]);

  // Wait for transaction
  const {
    isLoading: isConfirming,
    isSuccess,
    isError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  // Handle transaction state changes
  useEffect(() => {
    if (hash && isConfirming) {
      swapToasts.confirming(hash, chainId);
    }
  }, [hash, isConfirming, chainId]);

  useEffect(() => {
    if (hash && isSuccess) {
      swapToasts.success(hash, chainId);
    }
  }, [hash, isSuccess, chainId]);

  useEffect(() => {
    if (isError) {
      swapToasts.error("Transaction failed. Please try again.");
    }
  }, [isError]);

  return {
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
    clearError: () => setError(null),
  };
}
