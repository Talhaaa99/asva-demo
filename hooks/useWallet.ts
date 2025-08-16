import { useAccount, useBalance, useChainId } from "wagmi";
import { useCallback } from "react";
import { TOKENS, TOKEN_METADATA } from "@/lib/contracts";
import { formatBalance, copyToClipboard, getExplorerUrl } from "@/lib/utils";
import { TokenBalance } from "@/lib/types";

export function useWallet() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

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

  // Format ETH balance for display
  const formattedEthBalance = ethBalance
    ? formatBalance(ethBalance.value, ethBalance.decimals, 4)
    : "0";

  return {
    address,
    isConnected,
    chainId,
    ethBalance: ethBalance?.value,
    formattedEthBalance,
    getTokenBalances,
    copyAddress,
    openExplorer,
    openTransactionExplorer,
  };
}
