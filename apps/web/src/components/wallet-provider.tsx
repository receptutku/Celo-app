"use client"

import '@rainbow-me/rainbowkit/styles.css'
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { WagmiProvider } from 'wagmi'
import { celo, celoAlfajores } from 'wagmi/chains'
import { defineChain } from 'viem'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { http } from 'wagmi'

// Define Celo Sepolia chain
const celoSepolia = defineChain({
  id: 11142220,
  name: 'Celo Sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'CELO',
    symbol: 'CELO',
  },
  rpcUrls: {
    default: {
      http: ['https://forno.celo-sepolia.celo-testnet.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Celo Sepolia Blockscout',
      url: 'https://celo-sepolia.blockscout.com',
    },
  },
  testnet: true,
})

// Create config with proper SSR handling
let config: any = null

function getWagmiConfig() {
  if (!config) {
    const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
    
    if (!projectId || projectId === 'YOUR_PROJECT_ID') {
      console.warn('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set. Wallet connection may not work properly.');
    }
    
    config = getDefaultConfig({
      appName: 'Buy Me a Coffee',
      projectId: projectId || 'default-project-id',
      // Prioritize Alfajores testnet
      chains: [celoAlfajores, celo, celoSepolia],
      transports: {
        [celo.id]: http(),
        [celoAlfajores.id]: http(),
        [celoSepolia.id]: http(),
      },
      ssr: true,
    })
  }
  return config
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
})

function WalletProviderInner({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={getWagmiConfig()}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  // Always provide the WagmiProvider, even during SSR
  // The hooks will work correctly once the client hydrates
  return <WalletProviderInner>{children}</WalletProviderInner>
}
