import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { parseUnits as viemParseUnits, formatUnits } from "viem";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format an Ethereum address to show only first and last characters
 */
export function formatAddress(address: string, length: number = 6): string {
  if (!address) return "";
  return `${address.slice(0, length)}...${address.slice(-length)}`;
}

/**
 * Format a balance value with proper decimal handling
 */
export function formatBalance(
  balance: bigint | undefined,
  decimals: number = 18,
  displayDecimals: number = 4
): string {
  if (!balance) return "0";
  try {
    const formatted = formatUnits(balance, decimals);
    const num = parseFloat(formatted);
    return num.toFixed(displayDecimals);
  } catch (error) {
    console.error("Error formatting balance:", error);
    return "0";
  }
}

/**
 * Parse a string value to bigint with proper decimal handling
 */
export function parseUnits(value: string, decimals: number = 18): bigint {
  try {
    return viemParseUnits(value, decimals);
  } catch (error) {
    console.error("Error parsing units:", error);
    return BigInt(0);
  }
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    return false;
  }
}

/**
 * Get explorer URL for a transaction hash
 */
export function getExplorerUrl(hash: string, chainId: number): string {
  const networks = {
    1: "https://etherscan.io",
    8453: "https://basescan.org",
    11155111: "https://sepolia.etherscan.io",
  };

  const baseUrl = networks[chainId as keyof typeof networks] || networks[1];
  return `${baseUrl}/tx/${hash}`;
}

/**
 * Validate if a string is a valid Ethereum address
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Debounce function to limit function calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
