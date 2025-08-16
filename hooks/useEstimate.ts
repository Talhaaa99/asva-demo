import { useReadContract } from "wagmi";
import { parseUnits, formatBalance } from "@/lib/utils";
import { UNISWAP_V2_ROUTER_ABI, TOKEN_METADATA } from "@/lib/contracts";

export interface EstimateParams {
  routerAddress: string;
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  tokenInDecimals: number;
  tokenOutDecimals: number;
}

export function useEstimate(params: EstimateParams | null) {
  const {
    data: amountsOut,
    isError,
    error,
  } = useReadContract({
    address: params?.routerAddress as `0x${string}`,
    abi: UNISWAP_V2_ROUTER_ABI,
    functionName: "getAmountsOut",
    args: params
      ? [
          parseUnits(params.amountIn, params.tokenInDecimals),
          [params.tokenIn as `0x${string}`, params.tokenOut as `0x${string}`],
        ]
      : undefined,
    query: {
      enabled: !!params,
    },
  });

  if (!params || !amountsOut || amountsOut.length < 2) {
    return {
      amountOut: "0",
      priceImpact: 0,
      gasEstimate: BigInt(150000),
      isError,
      error,
    };
  }

  const amountOut = amountsOut[1];
  const amountOutFormatted = formatBalance(amountOut, params.tokenOutDecimals);

  return {
    amountOut: amountOutFormatted,
    priceImpact: 0.5, // Simplified calculation
    gasEstimate: BigInt(150000),
    isError,
    error,
  };
}
