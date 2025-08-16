import { useState, useCallback } from "react";
import {
  useAccount,
  useChainId,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseUnits, formatBalance } from "@/lib/utils";
import {
  UNISWAP_V2_ROUTER_ABI,
  UNISWAP_V2_ROUTER_ADDRESSES,
  TOKENS,
} from "@/lib/contracts";

export interface SwapParams {
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  slippage: number;
}

export interface SwapEstimate {
  amountOut: string;
  priceImpact: number;
  gasEstimate: bigint;
}

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

      try {
        const amountInWei = parseUnits(params.amountIn, 18);
        const path = [params.tokenIn, params.tokenOut];
        const deadline = Math.floor(Date.now() / 1000) + 1200; // 20 minutes

        // Mock estimation (in a real app, you'd call getAmountsOut)
        const mockAmountOut = (amountInWei * 95n) / 100n; // 5% slippage for demo
        const mockPriceImpact = 0.5; // 0.5% price impact
        const mockGasEstimate = 150000n; // 150k gas

        setEstimate({
          amountOut: formatBalance(mockAmountOut),
          priceImpact: mockPriceImpact,
          gasEstimate: mockGasEstimate,
        });

        setSwapParams(params);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to estimate swap"
        );
      } finally {
        setIsEstimating(false);
      }
    },
    [routerAddress]
  );

  // Execute swap
  const {
    writeContract,
    data: hash,
    isPending: isSwapping,
  } = useWriteContract();

  const executeSwap = useCallback(async () => {
    if (!swapParams || !estimate || !address || !routerAddress) {
      setError("Missing swap parameters or wallet not connected");
      return;
    }

    try {
      const amountInWei = parseUnits(swapParams.amountIn, 18);
      const amountOutMin =
        (parseUnits(estimate.amountOut, 18) *
          (1000n - BigInt(swapParams.slippage * 10))) /
        1000n;
      const path = [swapParams.tokenIn, swapParams.tokenOut];
      const deadline = Math.floor(Date.now() / 1000) + 1200; // 20 minutes

      writeContract({
        address: routerAddress as `0x${string}`,
        abi: UNISWAP_V2_ROUTER_ABI,
        functionName: "swapExactTokensForTokens",
        args: [amountOutMin, path, address, BigInt(deadline)],
        value: 0n,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to execute swap");
    }
  }, [swapParams, estimate, address, routerAddress, writeContract]);

  // Wait for transaction
  const {
    isLoading: isConfirming,
    isSuccess,
    isError,
  } = useWaitForTransactionReceipt({
    hash,
  });

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
