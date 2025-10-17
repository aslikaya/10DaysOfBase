//Tells Next.js this component to work on client side, to render only on browser
"use client";
import { ReactNode } from "react";
import { baseSepolia } from "wagmi/chains";
import { OnchainKitProvider } from "@coinbase/onchainkit";
// for wallet connections and hooks like useConnect, useAccount, useBalance
import { WagmiProvider } from "wagmi";
// caches blockchain data so no need to fetch everytime and wagmi is based on this
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// all settings done in wagmi.config is imported
import { wagmiConfig } from "../wagmi.config"; //
import "@coinbase/onchainkit/styles.css";

// creating an instance of QueryClient to provide QueryClientProvider
// QueryClient is data management center for your app
// caches, refetches, optimizes for unnecessary API calls and deletes (all when needed)
const queryClient = new QueryClient();

export function RootProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
          chain={baseSepolia}
          config={{
            appearance: {
              // using user's system theme (dark/light mode)
              mode: "auto",
            },
            wallet: {
              display: "modal", // wallet connection opens in modal mode (popup overlay)
              preference: "all", //displaying all wallet options
            },
          }}
        >
          {children}
        </OnchainKitProvider> //all components inside this can access onchainkit
      </QueryClientProvider>
    </WagmiProvider>
  );
}
