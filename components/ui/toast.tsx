"use client";

import { toast } from "react-hot-toast";
import React from "react";

export function getExplorerUrl(chainId: number, hash: string): string {
  switch (chainId) {
    case 1: // Ethereum mainnet
      return `https://etherscan.io/tx/${hash}`;
    case 8453: // Base mainnet
      return `https://basescan.org/tx/${hash}`;
    case 11155111: // Sepolia
      return `https://sepolia.etherscan.io/tx/${hash}`;
    case 84531: // Base Goerli
      return `https://goerli.basescan.org/tx/${hash}`;
    default:
      return `https://basescan.org/tx/${hash}`;
  }
}

export const swapToasts = {
  estimating: () => {
    toast("Estimating swap...", {
      icon: "⏳",
      duration: 3000,
    });
  },

  swapping: () => {
    return toast.loading("Swapping tokens...", {
      duration: Infinity,
    });
  },

  confirming: (hash: string, chainId: number) => {
    return toast.loading(
      React.createElement(
        "div",
        { className: "flex flex-col gap-2" },
        React.createElement("span", null, "Confirming transaction..."),
        React.createElement(
          "a",
          {
            href: getExplorerUrl(chainId, hash),
            target: "_blank",
            rel: "noopener noreferrer",
            className: "text-blue-500 hover:underline text-sm",
          },
          "View on Explorer →"
        )
      ),
      { duration: Infinity }
    );
  },

  success: (hash: string, chainId: number) => {
    toast.dismiss();
    toast.success(
      React.createElement(
        "div",
        { className: "flex flex-col gap-2" },
        React.createElement("span", null, "Swap successful! 🎉"),
        React.createElement(
          "a",
          {
            href: getExplorerUrl(chainId, hash),
            target: "_blank",
            rel: "noopener noreferrer",
            className: "text-blue-500 hover:underline text-sm",
          },
          "View Transaction →"
        )
      ),
      { duration: 10000 }
    );
  },

  error: (error: string) => {
    toast.dismiss();
    toast.error(`Swap failed: ${error}`, {
      duration: 8000,
    });
  },

  estimationError: (error: string) => {
    toast.error(`Estimation failed: ${error}`, {
      duration: 5000,
    });
  },
};
