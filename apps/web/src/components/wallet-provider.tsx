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
  if (typeof window === 'undefined') {
    // Return a minimal config for SSR
    return {
      chains: [celoAlfajores],
      transports: {},
    } as any;
  }
  
  if (!config) {
    const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
    
    // Use a valid default project ID for development/testing
    // Users should set their own in production
    const validProjectId = projectId && projectId !== 'YOUR_PROJECT_ID' 
      ? projectId 
      : 'c8f8d8e8f9a0b1c2d3e4f5a6b7c8d9e0'; // Fallback for development
    
    if (!projectId || projectId === 'YOUR_PROJECT_ID') {
      console.warn('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set. Using fallback. Wallet connection may not work properly in production.');
    }
    
    config = getDefaultConfig({
      appName: 'Buy Me a Coffee',
      projectId: validProjectId,
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
