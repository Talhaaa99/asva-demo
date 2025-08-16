import { ContractConfig } from "../types";
import { UNISWAP_V2_ROUTER_ADDRESSES, TOKENS } from "../contracts";

export class ConfigService {
  /**
   * Get contract configuration for a specific chain
   */
  static getContractConfig(chainId: number): ContractConfig | null {
    const routerAddress =
      UNISWAP_V2_ROUTER_ADDRESSES[
        chainId as keyof typeof UNISWAP_V2_ROUTER_ADDRESSES
      ];
    const tokens = TOKENS[chainId as keyof typeof TOKENS];

    if (!routerAddress || !tokens) {
      return null;
    }

    return {
      routerAddress,
      tokens,
    };
  }

  /**
   * Check if a chain is supported
   */
  static isChainSupported(chainId: number): boolean {
    return chainId in UNISWAP_V2_ROUTER_ADDRESSES;
  }

  /**
   * Get supported chain IDs
   */
  static getSupportedChainIds(): number[] {
    return Object.keys(UNISWAP_V2_ROUTER_ADDRESSES).map(Number);
  }

  /**
   * Get default chain ID (Base mainnet)
   */
  static getDefaultChainId(): number {
    return 8453; // Base mainnet
  }

  /**
   * Get environment variables with fallbacks
   */
  static getEnvVar(key: string, fallback?: string): string | undefined {
    if (typeof window !== "undefined") {
      // Client-side
      return (window as any).__NEXT_DATA__?.props?.env?.[key] || fallback;
    }
    // Server-side
    return process.env[key] || fallback;
  }

  /**
   * Get API configuration
   */
  static getApiConfig() {
    return {
      coingeckoApiKey: this.getEnvVar("NEXT_PUBLIC_COINGECKO_API_KEY"),
      projectId: this.getEnvVar("NEXT_PUBLIC_PROJECT_ID"),
    };
  }

  /**
   * Get app configuration
   */
  static getAppConfig() {
    return {
      name: "Swap Demo",
      version: "1.0.0",
      description: "Web3 DApp with token swapping functionality",
      defaultTheme: "dark" as const,
      supportedThemes: ["light", "dark"] as const,
    };
  }
}
