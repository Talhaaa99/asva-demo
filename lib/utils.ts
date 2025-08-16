import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { parseUnits as viemParseUnits, formatUnits } from "viem";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAddress(address: string, length: number = 6): string {
  if (!address) return "";
  return `${address.slice(0, length)}...${address.slice(-length)}`;
}

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

export function parseUnits(value: string, decimals: number = 18): bigint {
  try {
    return viemParseUnits(value, decimals);
  } catch (error) {
    console.error("Error parsing units:", error);
    return BigInt(0);
  }
}
