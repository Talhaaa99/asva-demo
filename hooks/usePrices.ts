import { useState, useEffect } from "react";
import {
  getTokenPrices,
  getExchangeRates,
  PriceData,
  ExchangeRates,
} from "@/lib/prices";

export function usePrices() {
  const [prices, setPrices] = useState<PriceData>({});
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchPrices = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch both token prices and exchange rates
        const [priceData, exchangeRateData] = await Promise.all([
          getTokenPrices(["ETH", "USDC"]),
          getExchangeRates(),
        ]);

        if (mounted) {
          setPrices(priceData);
          setExchangeRates(exchangeRateData);
        }
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error ? err.message : "Failed to fetch prices"
          );
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchPrices();

    // Refresh prices every 30 seconds
    const interval = setInterval(fetchPrices, 30000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return { prices, exchangeRates, isLoading, error };
}
