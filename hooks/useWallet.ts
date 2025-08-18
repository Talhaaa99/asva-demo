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

  // Simplified connection status tracking
  const [connectionStatus, setConnectionStatus] = useState<
    "connected" | "disconnected" | "connecting" | "error"
  >("disconnected");

  // Monitor connection status
  useEffect(() => {
    console.log("Wallet state update:", {
      isConnecting,
      isConnected,
      address: address ? `${address.slice(0, 6)}...${address.slice(-4)}` : null,
    });

    if (isConnecting) {
      setConnectionStatus("connecting");
    } else if (isConnected && address) {
      setConnectionStatus("connected");
    } else {
      setConnectionStatus("disconnected");
    }
  }, [isConnected, isConnecting, address]);

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

      // Clear wagmi storage first
      if (typeof window !== "undefined") {
        localStorage.removeItem("wagmi.connected");
        localStorage.removeItem("wagmi.account");
        localStorage.removeItem("wagmi.chainId");
        sessionStorage.removeItem("wagmi.connected");
        sessionStorage.removeItem("wagmi.account");
        sessionStorage.removeItem("wagmi.chainId");
      }

      // Set disconnected state immediately
      setConnectionStatus("disconnected");

      // Call wagmi disconnect
      disconnect();

      ToastService.show({
        title: "Wallet Disconnected",
        description: "Your wallet has been successfully disconnected.",
        type: "success",
      });
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      setConnectionStatus("disconnected");
      ToastService.show({
        title: "Disconnect Error",
        description: "There was an issue disconnecting your wallet.",
        type: "error",
      });
    }
  }, [disconnect]);

  // Simple and reliable wallet connection check
  const isWalletConnected = useCallback(() => {
    console.log("isWalletConnected check:", {
      address: address ? `${address.slice(0, 6)}...${address.slice(-4)}` : null,
      isConnected,
      connectionStatus,
      hasAddress: !!address,
    });

    // If we have an address, consider it connected regardless of wagmi state
    // This handles cases where wagmi state is inconsistent
    if (address) {
      console.log("Wallet connected: has address");
      return true;
    }

    // Fallback to wagmi's isConnected state
    console.log("Wallet connected: using wagmi state", isConnected);
    return isConnected;
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
