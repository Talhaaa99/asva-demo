// Test script for estimate functions
const FALLBACK_RATES = {
  ETH: 4500, // ETH to USD (updated)
  USDC: 1, // USDC to USD
};

// Mock price data
const mockPrices = {
  ethereum: { usd: 4500, usd_24h_change: 0 },
  "usd-coin": { usd: 1, usd_24h_change: 0 },
};

// Mock exchange rates
const mockExchangeRates = {
  rates: {
    eth: { value: 0.0001 }, // 1 ETH = 0.0001 BTC
    usdc: { value: 0.000000022 }, // 1 USDC = 0.000000022 BTC
  },
};

// Test function for fallback calculation
function testFallbackCalculation(tokenIn, tokenOut, amountIn) {
  const tokenInPrice = FALLBACK_RATES[tokenIn] || 1;
  const tokenOutPrice = FALLBACK_RATES[tokenOut] || 1;

  const amountInUSD = parseFloat(amountIn) * tokenInPrice;
  const amountOut = amountInUSD / tokenOutPrice;

  return amountOut.toFixed(6);
}

// Test function for price-based calculation
function testPriceCalculation(tokenIn, tokenOut, amountIn, prices) {
  const tokenInId = tokenIn === "ETH" ? "ethereum" : "usd-coin";
  const tokenOutId = tokenOut === "ETH" ? "ethereum" : "usd-coin";

  const tokenInPrice = prices[tokenInId]?.usd || 0;
  const tokenOutPrice = prices[tokenOutId]?.usd || 0;

  if (tokenInPrice === 0 || tokenOutPrice === 0) {
    throw new Error("Price data not available");
  }

  const amountInUSD = parseFloat(amountIn) * tokenInPrice;
  const amountOut = amountInUSD / tokenOutPrice;

  // Apply slippage
  const slippage = 0.995;
  const finalAmountOut = amountOut * slippage;

  return finalAmountOut.toFixed(6);
}

// Test function for exchange rate calculation
function testExchangeRateCalculation(
  tokenIn,
  tokenOut,
  amountIn,
  exchangeRates
) {
  const tokenInKey = tokenIn.toLowerCase();
  const tokenOutKey = tokenOut.toLowerCase();

  const tokenInRate = exchangeRates.rates[tokenInKey];
  const tokenOutRate = exchangeRates.rates[tokenOutKey];

  if (!tokenInRate || !tokenOutRate) {
    throw new Error("Exchange rate data not available");
  }

  const amountInBTC = parseFloat(amountIn) * tokenInRate.value;
  const amountOut = amountInBTC / tokenOutRate.value;

  // Apply slippage
  const slippage = 0.995;
  const finalAmountOut = amountOut * slippage;

  return finalAmountOut.toFixed(6);
}

// Run tests
console.log("🧪 Testing Estimate Functions\n");

// Test 1: ETH to USDC (1 ETH)
console.log("Test 1: 1 ETH → USDC");
console.log("Expected: ~4500 USDC");
console.log("Fallback:", testFallbackCalculation("ETH", "USDC", "1"));
console.log(
  "Price-based:",
  testPriceCalculation("ETH", "USDC", "1", mockPrices)
);
console.log(
  "Exchange rate:",
  testExchangeRateCalculation("ETH", "USDC", "1", mockExchangeRates)
);
console.log("");

// Test 2: USDC to ETH (4500 USDC)
console.log("Test 2: 4500 USDC → ETH");
console.log("Expected: ~1 ETH");
console.log("Fallback:", testFallbackCalculation("USDC", "ETH", "4500"));
console.log(
  "Price-based:",
  testPriceCalculation("USDC", "ETH", "4500", mockPrices)
);
console.log(
  "Exchange rate:",
  testExchangeRateCalculation("USDC", "ETH", "4500", mockExchangeRates)
);
console.log("");

// Test 3: ETH to USDC (0.1 ETH)
console.log("Test 3: 0.1 ETH → USDC");
console.log("Expected: ~450 USDC");
console.log("Fallback:", testFallbackCalculation("ETH", "USDC", "0.1"));
console.log(
  "Price-based:",
  testPriceCalculation("ETH", "USDC", "0.1", mockPrices)
);
console.log(
  "Exchange rate:",
  testExchangeRateCalculation("ETH", "USDC", "0.1", mockExchangeRates)
);
console.log("");

// Test 4: USDC to ETH (100 USDC)
console.log("Test 4: 100 USDC → ETH");
console.log("Expected: ~0.022 ETH");
console.log("Fallback:", testFallbackCalculation("USDC", "ETH", "100"));
console.log(
  "Price-based:",
  testPriceCalculation("USDC", "ETH", "100", mockPrices)
);
console.log(
  "Exchange rate:",
  testExchangeRateCalculation("USDC", "ETH", "100", mockExchangeRates)
);
console.log("");

// Test error handling
console.log("Test 5: Error handling");
try {
  console.log(
    "Invalid token pair:",
    testFallbackCalculation("INVALID", "USDC", "1")
  );
} catch (error) {
  console.log("Error caught:", error.message);
}
console.log("");

console.log("✅ Test completed!");
