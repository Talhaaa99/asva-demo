import { base, baseGoerli, mainnet, sepolia } from "wagmi/chains";
import { TokenMetadata } from "./types";

// Uniswap V2 Router addresses
export const UNISWAP_V2_ROUTER_ADDRESSES = {
  [mainnet.id]: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D", // Ethereum mainnet
  [base.id]: "0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24", // Base mainnet - Uniswap V2 Router
  [sepolia.id]: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D", // Sepolia testnet
  [baseGoerli.id]: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D", // Base testnet
} as const;

// Token addresses for all networks
export const TOKENS = {
  [mainnet.id]: {
    ETH: "0x0000000000000000000000000000000000000000", // Native ETH
    USDC: "0xA0b86a33E6441b8C4C8C8C8C8C8C8C8C8C8C8C8",
  },
  [base.id]: {
    ETH: "0x0000000000000000000000000000000000000000", // Native ETH
    WETH: "0x4200000000000000000000000000000000000006", // WETH on Base
    USDC: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC on Base
  },
  [sepolia.id]: {
    ETH: "0x0000000000000000000000000000000000000000", // Native ETH
    USDC: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
  },
  [baseGoerli.id]: {
    ETH: "0x0000000000000000000000000000000000000000", // Native ETH
    USDC: "0x176211869cA2b568f2A7D4EE941E073a821EE1ff",
  },
} as const;

// Token metadata for better display
export const TOKEN_METADATA: Record<string, TokenMetadata> = {
  ETH: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
    logo: "🔵",
  },
  USDC: {
    name: "USD Coin",
    symbol: "USDC",
    decimals: 6,
    logo: "🟢",
  },
} as const;

// ERC20 ABI (simplified for approvals)
export const ERC20_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

// Uniswap V2 Router ABI (simplified for demo)
export const UNISWAP_V2_ROUTER_ABI = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amountIn",
        type: "uint256",
      },
      {
        internalType: "address[]",
        name: "path",
        type: "address[]",
      },
    ],
    name: "getAmountsOut",
    outputs: [
      {
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amountOutMin",
        type: "uint256",
      },
      {
        internalType: "address[]",
        name: "path",
        type: "address[]",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256",
      },
    ],
    name: "swapExactTokensForTokens",
    outputs: [
      {
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amountOutMin",
        type: "uint256",
      },
      {
        internalType: "address[]",
        name: "path",
        type: "address[]",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256",
      },
    ],
    name: "swapExactETHForTokens",
    outputs: [
      {
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amountIn",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amountOutMin",
        type: "uint256",
      },
      {
        internalType: "address[]",
        name: "path",
        type: "address[]",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256",
      },
    ],
    name: "swapExactTokensForETH",
    outputs: [
      {
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
