"use client";

import { RainbowKitSiweNextAuthProvider } from '@rainbow-me/rainbowkit-siwe-next-auth';
import { SessionProvider } from 'next-auth/react';
import type { Session } from 'next-auth';
import { AppProps } from 'next/app';
import Header from "./components/header";
import { SidebarProvider } from "./context/SidebarContext";
import HomePage from './components/HomePage';
import '@rainbow-me/rainbowkit/styles.css';
import { WagmiConfig, configureChains, createConfig,} from 'wagmi';
import { bscTestnet, mainnet } from 'wagmi/chains'
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public'
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit'

const { chains, publicClient, webSocketPublicClient } = configureChains(
    [mainnet, bscTestnet],
    [alchemyProvider({ apiKey: 'pRKvOH0qJ4GC3qcmfqfJfLPdIZEu--B0' }), publicProvider()]
);
const { connectors } = getDefaultWallets({
  appName: 'Test',
  projectId: '2950efa78122b496d57d65ff94ea587c',
  chains
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: connectors,
  publicClient,
  webSocketPublicClient,
})
export default function Index({ pageProps }: AppProps<{ session: Session }>): JSX.Element {
  return (
    <WagmiConfig config={wagmiConfig}>
      <SessionProvider refetchInterval={0} {...pageProps} >
        <RainbowKitSiweNextAuthProvider>
          <RainbowKitProvider chains={chains}>
            <SidebarProvider>
              <Header />
              <div className="flex dark:bg-gray-900 h-[92vh]">
                <main className="order-2 mx-4 mt-4 mb-24 flex-[1_0_16rem]">
                  <HomePage />
                </main>
              </div>
            </SidebarProvider>
          </RainbowKitProvider>
        </RainbowKitSiweNextAuthProvider>
      </SessionProvider>
    </WagmiConfig>
  );
}
