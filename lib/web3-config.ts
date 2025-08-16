import { createAppKit } from "@reown/appkit/react"
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi"
import { baseSepolia } from "@reown/appkit/networks"
import { QueryClient } from "@tanstack/react-query"

const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || "demo-project-id"

const metadata = {
  name: "Demo Contract dApp",
  description: "A simple Web3 dApp for contract interaction",
  url: typeof window !== "undefined" ? window.location.origin : "https://myapp.com",
  icons: ["https://myapp.com/icon.png"],
}

const wagmiAdapter = new WagmiAdapter({
  networks: [baseSepolia],
  projectId,
  ssr: true,
})

// Create AppKit instance
export const appKit = createAppKit({
  adapters: [wagmiAdapter],
  networks: [baseSepolia],
  metadata,
  projectId,
  features: {
    analytics: true,
  },
})

export const wagmiConfig = wagmiAdapter.wagmiConfig
export const queryClient = new QueryClient()
