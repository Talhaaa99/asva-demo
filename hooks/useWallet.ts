import { useAccount, useBalance, useChainId, useDisconnect } from "wagmi";
import { useCallback, useEffect, useState } from "react";
import { TOKENS, TOKEN_METADATA } from "@/lib/contracts";
import { formatBalance, copyToClipboard, getExplorerUrl } from "@/lib/utils";
import { TokenBalance } from "@/lib/types";
import { ToastService } from "@/lib/services/toastService";

export function useWallet() {
  const { address, isConnected, isConnecting } = useAccount();
  const chainId = useChainId();
  const { disconnect } = useDisconnect();

  // Local state to track connection status
  const [connectionStatus, setConnectionStatus] = useState<
    "connected" | "disconnected" | "connecting" | "error"
  >("disconnected");

  // Monitor connection status with better error handling
  useEffect(() => {
    try {
      console.log("Connection status update:", {
        isConnecting,
        isConnected,
        address,
        connectionStatus,
      });

      if (isConnecting) {
        setConnectionStatus("connecting");
      } else if (isConnected && address) {
        setConnectionStatus("connected");
      } else {
        setConnectionStatus("disconnected");
      }
    } catch (error) {
      console.warn("Wallet connection status error:", error);
      setConnectionStatus("error");
    }
  }, [isConnected, isConnecting, address]);

  // Additional check for wallet availability
  useEffect(() => {
    const checkWalletAvailability = () => {
      try {
        // Check if any wallet is available
        const hasMetaMask =
          typeof window !== "undefined" && (window as any).ethereum;
        const hasWalletConnect =
          typeof window !== "undefined" && (window as any).WalletConnect;

        if (!hasMetaMask && !hasWalletConnect) {
          console.warn("No wallet extensions detected");
        }
      } catch (error) {
        console.warn("Wallet availability check failed:", error);
      }
    };

    checkWalletAvailability();
  }, []);

  // Get native ETH balance
  const { data: ethBalance } = useBalance({
    address,
  });

  // Get token balances
  const tokens = TOKENS[chainId as keyof typeof TOKENS] || TOKENS[8453];

  const getTokenBalances = useCallback((): TokenBalance[] => {
    if (!address || !isConnected) return [];

    return Object.entries(tokens)
      .filter(([symbol]) => symbol !== "ETH" && symbol !== "WETH")
      .map(([symbol, tokenAddress]) => {
        const metadata = TOKEN_METADATA[symbol];
        return {
          symbol,
          address: tokenAddress,
          decimals: metadata?.decimals || 18,
          balance: "0", // This would be populated by useBalance hook
        };
      });
  }, [address, isConnected, tokens]);

  // Copy address to clipboard
  const copyAddress = useCallback(async () => {
    if (!address) return;
    const success = await copyToClipboard(address);
    return success;
  }, [address]);

  // Open explorer for address
  const openExplorer = useCallback(() => {
    if (!address || !chainId) return;
    const url = getExplorerUrl(address, chainId);
    window.open(url, "_blank");
  }, [address, chainId]);

  // Open explorer for transaction
  const openTransactionExplorer = useCallback(
    (hash: string) => {
      if (!chainId) return;
      const url = getExplorerUrl(hash, chainId);
      window.open(url, "_blank");
    },
    [chainId]
  );

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    try {
      console.log("Disconnecting wallet...");
      disconnect();
      setConnectionStatus("disconnected");

      // Force clear any cached wallet data
      if (typeof window !== "undefined") {
        // Clear any localStorage wallet data
        localStorage.removeItem("wagmi.connected");
        localStorage.removeItem("wagmi.account");
        localStorage.removeItem("wagmi.chainId");

        // Clear any sessionStorage wallet data
        sessionStorage.removeItem("wagmi.connected");
        sessionStorage.removeItem("wagmi.account");
        sessionStorage.removeItem("wagmi.chainId");
      }

      // Small delay to ensure UI updates
      setTimeout(() => {
        console.log("Wallet disconnected successfully");
        ToastService.show({
          title: "Wallet Disconnected",
          description: "Your wallet has been successfully disconnected.",
          type: "success",
        });
      }, 100);
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      // Force set disconnected state even if disconnect fails
      setConnectionStatus("disconnected");
      ToastService.show({
        title: "Disconnect Error",
        description: "There was an issue disconnecting your wallet.",
        type: "error",
      });
    }
  }, [disconnect]);

  // Check if wallet is truly connected with fallback
  const isWalletConnected = useCallback(() => {
    // If we're explicitly disconnected, return false
    if (connectionStatus === "disconnected") {
      return false;
    }

    // Primary check: wagmi connection state
    if (isConnected && !!address) {
      return true;
    }

    // Fallback check: if we have an address but wagmi thinks we're not connected
    // This can happen when there are connector initialization issues
    if (!!address && connectionStatus === "connected") {
      return true;
    }

    return false;
  }, [isConnected, address, connectionStatus]);

  // Format ETH balance for display
  const formattedEthBalance = ethBalance
    ? formatBalance(ethBalance.value, ethBalance.decimals, 4)
    : "0";

  return {
    address,
    isConnected,
    isConnecting,
    connectionStatus,
    chainId,
    ethBalance: ethBalance?.value,
    formattedEthBalance,
    getTokenBalances,
    copyAddress,
    openExplorer,
    openTransactionExplorer,
    disconnectWallet,
    isWalletConnected,
  };
}
