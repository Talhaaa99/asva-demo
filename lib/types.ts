// Core types for the application
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

export interface TokenMetadata {
  name: string;
  symbol: string;
  decimals: number;
  logo: string;
}

export interface Network {
  id: number;
  name: string;
  icon: string;
  explorer: string;
  description?: string;
}

export interface TokenBalance {
  symbol: string;
  balance: string;
  decimals: number;
  address: string;
}

// Theme types
export type Theme = "dark" | "light" | "system";

// API Response types
export interface CoinGeckoPrices {
  [key: string]: {
    usd: number;
  };
}

export interface CoinGeckoExchangeRates {
  rates: {
    [key: string]: {
      value: number;
    };
  };
}

// Contract types
export interface ContractConfig {
  routerAddress: string;
  tokens: Record<string, string>;
}

// Toast types
export interface ToastConfig {
  title: string;
  description?: string;
  type: "success" | "error" | "loading" | "info";
  hash?: string;
  chainId?: number;
}
