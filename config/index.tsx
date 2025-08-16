import { cookieStorage, createStorage, http } from "@wagmi/core";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { base, baseGoerli, mainnet, sepolia } from "@reown/appkit/networks";

export const projectId: string =
  process.env.NEXT_PUBLIC_PROJECT_ID || "demo-project-id";

export const networks = [mainnet, base, sepolia, baseGoerli];

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  networks,
});

export const config = wagmiAdapter.wagmiConfig;
