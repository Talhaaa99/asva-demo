import { base, baseGoerli } from "wagmi/chains";

// Uniswap V2 Router addresses
export const UNISWAP_V2_ROUTER_ADDRESSES = {
  [base.id]: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D", // Base mainnet (using Ethereum mainnet address as example)
  [baseGoerli.id]: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D", // Base testnet (using Goerli address as example)
} as const;

// Token addresses for Base
export const TOKENS = {
  [base.id]: {
    WETH: "0x4200000000000000000000000000000000000006",
    USDC: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    USDT: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
  },
  [baseGoerli.id]: {
    WETH: "0x4200000000000000000000000000000000000006",
    USDC: "0x176211869cA2b568f2A7D4EE941E073a821EE1ff",
    USDT: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
  },
} as const;

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
] as const;
