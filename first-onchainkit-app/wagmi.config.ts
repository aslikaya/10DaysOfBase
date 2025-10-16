import { createConfig, http } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { coinbaseWallet, metaMask } from 'wagmi/connectors';

//const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
const rpcUrl = process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL;


export const wagmiConfig = createConfig({
    chains: [baseSepolia],
    connectors: [
        metaMask({
            dappMetadata: {
                name: 'First OnchainKit App',
            },
        }),
        coinbaseWallet({
            appName: 'onchainkit',
        }),
    ],
    ssr: true,
    transports: {
        [baseSepolia.id]: http(),
    },
});

// Tells Typescript which config wagmi components using
declare module 'wagmi' {
    interface Register {
        config: typeof wagmiConfig
    }
}