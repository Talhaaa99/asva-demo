import { SwapParams, SwapEstimate } from "../types";
import { FALLBACK_RATES, GAS_ESTIMATES } from "../constants";
import { TOKEN_METADATA } from "../contracts";
import {
  calculateSwapRate,
  calculateSwapRateFromExchangeRates,
} from "../prices";

export class SwapService {
  /**
   * Calculate swap estimate based on input parameters
   */
  static calculateEstimate(
    params: SwapParams,
    prices: Record<string, number> | null,
    exchangeRates: Record<string, { value: number }> | null,
    tokens: Record<string, string>
  ): SwapEstimate {
    const tokenInSymbol = Object.keys(tokens).find(
      (key) => tokens[key] === params.tokenIn
    );
    const tokenOutSymbol = Object.keys(tokens).find(
      (key) => tokens[key] === params.tokenOut
    );

    if (!tokenInSymbol || !tokenOutSymbol) {
      throw new Error("Invalid token pair");
    }

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

    // Calculate price impact (simplified)
    const priceImpact = 0.5; // This would be calculated based on reserves
    const gasEstimate = BigInt(GAS_ESTIMATES.swap);

    return {
      amountOut: amountOutString,
      priceImpact,
      gasEstimate,
    };
  }

  /**
   * Get token decimals for proper parsing
   */
  static getTokenDecimals(symbol: string): number {
    return TOKEN_METADATA[symbol]?.decimals || 18;
  }

  /**
   * Calculate minimum amount out based on slippage
   */
  static calculateAmountOutMin(
    amountOut: string,
    tokenOutDecimals: number,
    slippage: number
  ): bigint {
    const amountOutWei = BigInt(
      parseFloat(amountOut) * Math.pow(10, tokenOutDecimals)
    );
    return (
      (amountOutWei * (BigInt(1000) - BigInt(Math.floor(slippage * 10)))) /
      BigInt(1000)
    );
  }

  /**
   * Determine swap path for Base network
   */
  static getSwapPath(
    tokenIn: string,
    tokenOut: string,
    isETHIn: boolean,
    isETHOut: boolean,
    chainId: number
  ): `0x${string}`[] {
    if (chainId === 8453) {
      // Base mainnet
      if (isETHIn && !isETHOut) {
        // ETH to USDC: ETH -> WETH -> USDC
        return [
          "0x4200000000000000000000000000000000000006" as `0x${string}`, // WETH
          tokenOut as `0x${string}`,
        ];
      } else if (!isETHIn && isETHOut) {
        // USDC to ETH: USDC -> WETH -> ETH
        return [
          tokenIn as `0x${string}`,
          "0x4200000000000000000000000000000000000006" as `0x${string}`, // WETH
        ];
      }
    }

    // Default path
    return [tokenIn as `0x${string}`, tokenOut as `0x${string}`];
  }

  /**
   * Get swap function name based on token types
   */
  static getSwapFunctionName(isETHIn: boolean, isETHOut: boolean): string {
    if (isETHIn && !isETHOut) {
      return "swapExactETHForTokens";
    } else if (!isETHIn && isETHOut) {
      return "swapExactTokensForETH";
    } else {
      return "swapExactTokensForTokens";
    }
  }
}
