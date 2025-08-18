// Price service using CoinGecko API
const COINGECKO_API = process.env.NEXT_PUBLIC_COINGECKO_API_KEY
  ? "https://pro-api.coingecko.com/api/v3"
  : "https://api.coingecko.com/api/v3";

export interface ExchangeRates {
  rates: {
    [currency: string]: {
      name: string;
      unit: string;
      value: number;
      type: string;
    };
  };
}

export interface TokenPrice {
  usd: number;
  usd_24h_change: number;
}

export interface PriceData {
  [key: string]: TokenPrice;
}

// Map our token symbols to CoinGecko IDs
export const COINGECKO_IDS = {
  ETH: "ethereum",
  USDC: "usd-coin",
} as const;

export async function getExchangeRates(): Promise<ExchangeRates> {
  try {
    const url = `${COINGECKO_API}/exchange_rates`;
    const headers: HeadersInit = {};

    // Add API key if available
    if (process.env.NEXT_PUBLIC_COINGECKO_API_KEY) {
      headers["x-cg-pro-api-key"] = process.env.NEXT_PUBLIC_COINGECKO_API_KEY;
    }

    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error(`Failed to fetch exchange rates: ${response.statusText}`);
    }

    const data: ExchangeRates = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
    // Return fallback exchange rates if API fails
    return {
      rates: {
        usd: { name: "US Dollar", unit: "$", value: 1, type: "fiat" },
        eth: { name: "Ethereum", unit: "Ξ", value: 0.00033, type: "crypto" },
      },
    };
  }
}

export async function getTokenPrices(tokens: string[]): Promise<PriceData> {
  try {
    const ids = tokens
      .map((token) => COINGECKO_IDS[token as keyof typeof COINGECKO_IDS])
      .filter(Boolean)
      .join(",");

    if (!ids) {
      return {};
    }

    const url = `${COINGECKO_API}/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;
    const headers: HeadersInit = {};

    // Add API key if available
    if (process.env.NEXT_PUBLIC_COINGECKO_API_KEY) {
      headers["x-cg-pro-api-key"] = process.env.NEXT_PUBLIC_COINGECKO_API_KEY;
    }

    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error(`Failed to fetch prices: ${response.statusText}`);
    }

    const data: PriceData = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching token prices:", error);
    // Return fallback prices if API fails
    return {
      ethereum: { usd: 3000, usd_24h_change: 0 },
      "usd-coin": { usd: 1, usd_24h_change: 0 },
    };
  }
}

export function calculateSwapRate(
  tokenIn: string,
  tokenOut: string,
  amountIn: string,
  prices: PriceData
): string {
  try {
    const tokenInId = COINGECKO_IDS[tokenIn as keyof typeof COINGECKO_IDS];
    const tokenOutId = COINGECKO_IDS[tokenOut as keyof typeof COINGECKO_IDS];

    if (!tokenInId || !tokenOutId) {
      throw new Error("Unsupported token pair");
    }

    const tokenInPrice = prices[tokenInId]?.usd || 0;
    const tokenOutPrice = prices[tokenOutId]?.usd || 0;

    if (tokenInPrice === 0 || tokenOutPrice === 0) {
      throw new Error("Price data not available");
    }

    // Calculate the amount out based on USD value
    const amountInUSD = parseFloat(amountIn) * tokenInPrice;
    const amountOut = amountInUSD / tokenOutPrice;

    // Apply a small slippage (0.5%) to account for fees and price impact
    const slippage = 0.995;
    const finalAmountOut = amountOut * slippage;

    return finalAmountOut.toFixed(6);
  } catch (error) {
    console.error("Error calculating swap rate:", error);
    // Return a fallback calculation based on current market rates
    if (tokenIn === "ETH" && tokenOut === "USDC") {
      return (parseFloat(amountIn) * 4500).toFixed(6);
    } else if (tokenIn === "USDC" && tokenOut === "ETH") {
      return (parseFloat(amountIn) / 4500).toFixed(6);
    }
    // Generic fallback
    return (parseFloat(amountIn) * 0.95).toFixed(6);
  }
}

export function calculateSwapRateFromExchangeRates(
  tokenIn: string,
  tokenOut: string,
  amountIn: string,
  exchangeRates: ExchangeRates
): string {
  try {
    // Convert token symbols to exchange rate keys
    const tokenInKey = tokenIn.toLowerCase();
    const tokenOutKey = tokenOut.toLowerCase();

    const tokenInRate = exchangeRates.rates[tokenInKey];
    const tokenOutRate = exchangeRates.rates[tokenOutKey];

    if (!tokenInRate || !tokenOutRate) {
      throw new Error("Exchange rate data not available");
    }

    // Calculate using BTC as intermediary (since all rates are BTC-based)
    const amountInBTC = parseFloat(amountIn) * tokenInRate.value;
    const amountOut = amountInBTC / tokenOutRate.value;

    // Apply a small slippage (0.5%) to account for fees and price impact
    const slippage = 0.995;
    const finalAmountOut = amountOut * slippage;

    return finalAmountOut.toFixed(6);
  } catch (error) {
    console.error("Error calculating swap rate from exchange rates:", error);
    // Return a fallback calculation based on current market rates
    if (tokenIn === "ETH" && tokenOut === "USDC") {
      return (parseFloat(amountIn) * 4500).toFixed(6);
    } else if (tokenIn === "USDC" && tokenOut === "ETH") {
      return (parseFloat(amountIn) / 4500).toFixed(6);
    }
    // Generic fallback
    return (parseFloat(amountIn) * 0.95).toFixed(6);
  }
}
