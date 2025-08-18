import { Network } from "./types";

// API Configuration
export const COINGECKO_API = "https://api.coingecko.com/api/v3";
export const COINGECKO_IDS = {
  ETH: "ethereum",
  USDC: "usd-coin",
} as const;

// Hardcoded fallback rates (for demo purposes)
export const FALLBACK_RATES = {
  ETH: 4500, // ETH to USD (updated)
  USDC: 1, // USDC to USD
} as const;

// Network configurations
export const NETWORKS: Network[] = [
  {
    id: 8453,
    name: "Base",
    icon: "🔷",
    explorer: "https://basescan.org",
    description: "Base Mainnet",
  },
  {
    id: 1,
    name: "Ethereum",
    icon: "🔵",
    explorer: "https://etherscan.io",
    description: "Ethereum Mainnet",
  },
  {
    id: 11155111,
    name: "Sepolia",
    icon: "🧪",
    explorer: "https://sepolia.etherscan.io",
    description: "Ethereum Testnet",
  },
];

// Token options for swap interface
export const TOKEN_OPTIONS = [
  { symbol: "ETH", name: "Ether" },
  { symbol: "USDC", name: "USD Coin" },
] as const;

// Slippage options
export const SLIPPAGE_OPTIONS = [0.1, 0.5, 1.0] as const;

// Animation durations
export const ANIMATION_DURATIONS = {
  fast: 300,
  normal: 500,
  slow: 800,
} as const;

// Gas estimates
export const GAS_ESTIMATES = {
  swap: 150000,
  approval: 50000,
} as const;

// Transaction timeouts
export const TRANSACTION_TIMEOUTS = {
  deadline: 1200, // 20 minutes
  polling: 1000, // 1 second
} as const;
